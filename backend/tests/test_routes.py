"""Tests for API routes"""
import pytest
import sys
import os
from fastapi.testclient import TestClient

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.main import app

client = TestClient(app)


class TestHealthEndpoint:
    """Tests for health check endpoint"""
    
    def test_health_check(self):
        """Test that health endpoint returns 200 and correct data"""
        response = client.get("/api/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        assert data["version"] == "1.0.0"


class TestEncodeEndpoint:
    """Tests for encode endpoint"""
    
    def test_encode_success(self):
        """Test successful encoding"""
        response = client.post(
            "/api/encode",
            json={"text": "iambob", "key": "0"}
        )
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert data["result"] == "<. > O < X < "
        assert data["error"] is None
    
    def test_encode_with_key(self):
        """Test encoding with custom key"""
        response = client.post(
            "/api/encode",
            json={"text": "safe house", "key": "7"}
        )
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert data["result"] == "= .> O .. X ./ < = .. "
        assert data["error"] is None
    
    def test_encode_multi_value_key(self):
        """Test encoding with multi-value key"""
        response = client.post(
            "/api/encode",
            json={"text": "sheep dog", "key": "0,1"}
        )
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert data["result"] == "// <. >> << / >> X .> "
        assert data["error"] is None
    
    def test_encode_invalid_key_range(self):
        """Test that invalid key range returns error"""
        response = client.post(
            "/api/encode",
            json={"text": "hello", "key": "7,26,8"}
        )
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is False
        assert "out of range" in data["error"]
        assert data["result"] == ""
    
    def test_encode_invalid_key_format(self):
        """Test that invalid key format returns error"""
        response = client.post(
            "/api/encode",
            json={"text": "hello", "key": "7,a,8"}
        )
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is False
        assert "Invalid number" in data["error"]
        assert data["result"] == ""
    
    def test_encode_empty_text(self):
        """Test that empty text returns error"""
        response = client.post(
            "/api/encode",
            json={"text": "", "key": "7"}
        )
        assert response.status_code == 422  # Pydantic validation error
    
    def test_encode_uppercase_text(self):
        """Test that uppercase text returns error"""
        response = client.post(
            "/api/encode",
            json={"text": "Hello", "key": "7"}
        )
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is False
        assert "invalid characters" in data["error"]
    
    def test_encode_missing_key(self):
        """Test that missing key returns validation error"""
        response = client.post(
            "/api/encode",
            json={"text": "hello"}
        )
        assert response.status_code == 422  # Pydantic validation error


class TestDecodeEndpoint:
    """Tests for decode endpoint"""
    
    def test_decode_success(self):
        """Test successful decoding"""
        response = client.post(
            "/api/decode",
            json={"text": "<. > O < X <", "key": "0"}
        )
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert data["result"] == "iambob"
        assert data["error"] is None
    
    def test_decode_with_key(self):
        """Test decoding with custom key"""
        response = client.post(
            "/api/decode",
            json={"text": "= .> O .. X ./ < = ..", "key": "7"}
        )
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert data["result"] == "safehouse"
        assert data["error"] is None
    
    def test_decode_multi_value_key(self):
        """Test decoding with multi-value key"""
        response = client.post(
            "/api/decode",
            json={"text": "// <. >> << / >> X .>", "key": "0,1"}
        )
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert data["result"] == "sheepdog"
        assert data["error"] is None
    
    def test_decode_invalid_key_range(self):
        """Test that invalid key range returns error"""
        response = client.post(
            "/api/decode",
            json={"text": "< . >", "key": "7,26,8"}
        )
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is False
        assert "out of range" in data["error"]
        assert data["result"] == ""
    
    def test_decode_invalid_key_format(self):
        """Test that invalid key format returns error"""
        response = client.post(
            "/api/decode",
            json={"text": "< . >", "key": "7,a,8"}
        )
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is False
        assert "Invalid number" in data["error"]
        assert data["result"] == ""
    
    def test_decode_empty_text(self):
        """Test that empty text returns error"""
        response = client.post(
            "/api/decode",
            json={"text": "", "key": "7"}
        )
        assert response.status_code == 422  # Pydantic validation error
    
    def test_decode_missing_key(self):
        """Test that missing key returns validation error"""
        response = client.post(
            "/api/decode",
            json={"text": "< . >"}
        )
        assert response.status_code == 422  # Pydantic validation error


class TestRootEndpoint:
    """Tests for root endpoint"""
    
    def test_root(self):
        """Test that root endpoint returns API information"""
        response = client.get("/")
        assert response.status_code == 200
        data = response.json()
        assert data["message"] == "Gaileen Cipher API"
        assert data["version"] == "1.0.0"
        assert data["docs"] == "/docs"
        assert data["health"] == "/api/health"
