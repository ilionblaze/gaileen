"""Integration tests for the cipher API"""
import pytest
import sys
import os
from fastapi.testclient import TestClient

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.main import app
from gaileen import gaileen

client = TestClient(app)


class TestEncodeDecodeRoundtrip:
    """Tests for encode/decode roundtrip operations"""
    
    def test_roundtrip_simple(self):
        """Test that encoding then decoding returns original text"""
        original_text = "hello world"
        key = "7,9,8,0,5,0,7"
        
        # Encode
        encode_response = client.post(
            "/api/encode",
            json={"text": original_text, "key": key}
        )
        assert encode_response.status_code == 200
        encode_data = encode_response.json()
        assert encode_data["success"] is True
        encoded_text = encode_data["result"]
        
        # Decode using the encoded text (already has spaces between symbols)
        decode_response = client.post(
            "/api/decode",
            json={"text": encoded_text, "key": key}
        )
        assert decode_response.status_code == 200
        decode_data = decode_response.json()
        assert decode_data["success"] is True
        
        # Remove spaces from original for comparison (cipher doesn't preserve spaces)
        expected = original_text.replace(" ", "")
        assert decode_data["result"] == expected
    
    def test_roundtrip_with_different_keys(self):
        """Test roundtrip with various keys"""
        test_cases = [
            ("test", "0"),
            ("hello", "5"),
            ("world", "25"),
            ("cipher", "0,1,2,3"),
        ]
        
        for text, key in test_cases:
            # Encode
            encode_response = client.post(
                "/api/encode",
                json={"text": text, "key": key}
            )
            assert encode_response.status_code == 200
            encoded = encode_response.json()["result"]
            
            # Decode (encoded already has spaces between symbols)
            decode_response = client.post(
                "/api/decode",
                json={"text": encoded, "key": key}
            )
            assert decode_response.status_code == 200
            decoded = decode_response.json()["result"]
            
            assert decoded == text


class TestGaileenIntegration:
    """Tests for integration with gaileen.py"""
    
    def test_api_matches_gaileen_encode(self):
        """Test that API encoding matches direct gaileen.py usage"""
        text = "iambob"
        key = [0]
        
        # Direct gaileen usage
        cipher = gaileen(key)
        cipher.setPlain()
        expected = cipher.encode(text, space=True)
        
        # API usage
        response = client.post(
            "/api/encode",
            json={"text": text, "key": "0"}
        )
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert data["result"] == expected
    
    def test_api_matches_gaileen_decode(self):
        """Test that API decoding matches direct gaileen.py usage"""
        symbols = ["<", ".", ">", "O", "<", "X", "<"]
        key = [0]
        
        # Direct gaileen usage
        cipher = gaileen(key)
        cipher.setPlain()
        expected = cipher.decode(symbols)
        
        # API usage
        response = client.post(
            "/api/decode",
            json={"text": " ".join(symbols), "key": "0"}
        )
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert data["result"] == expected
    
    def test_plain_mode_enabled(self):
        """Test that plain mode is enabled (no BBCode in output)"""
        text = "test"
        key = "0"
        
        response = client.post(
            "/api/encode",
            json={"text": text, "key": key}
        )
        assert response.status_code == 200
        data = response.json()
        
        # Plain mode should not contain [br] tags
        assert "[br]" not in data["result"]
        assert "br" not in data["result"]


class TestErrorHandling:
    """Tests for error handling across the API"""
    
    def test_encode_then_decode_with_wrong_key(self):
        """Test that decoding with wrong key produces different result"""
        text = "secret"
        encode_key = "7,9,8"
        decode_key = "1,2,3"
        
        # Encode with one key
        encode_response = client.post(
            "/api/encode",
            json={"text": text, "key": encode_key}
        )
        encoded = encode_response.json()["result"]
        
        # Decode with different key
        decode_response = client.post(
            "/api/decode",
            json={"text": " ".join(encoded), "key": decode_key}
        )
        decoded = decode_response.json()["result"]
        
        # Should not match original
        assert decoded != text
    
    def test_multiple_validation_errors(self):
        """Test that validation catches multiple types of errors"""
        # Invalid key and uppercase text
        response = client.post(
            "/api/encode",
            json={"text": "Hello", "key": "26"}
        )
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is False
        # Should catch either uppercase or invalid key (whichever is checked first)
        assert data["error"] is not None
