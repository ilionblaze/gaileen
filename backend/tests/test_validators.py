"""Tests for validation functions"""
import pytest
import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.validators import parse_and_validate_key, validate_text, ValidationError


class TestParseAndValidateKey:
    """Tests for parse_and_validate_key function"""
    
    def test_parse_valid_key(self):
        """Test parsing a valid key string"""
        result = parse_and_validate_key("7,9,8,0,5,0,7")
        assert result == [7, 9, 8, 0, 5, 0, 7]
    
    def test_parse_single_value(self):
        """Test parsing a single value key"""
        result = parse_and_validate_key("5")
        assert result == [5]
    
    def test_parse_with_spaces(self):
        """Test parsing key with spaces around values"""
        result = parse_and_validate_key("7, 9, 8, 0")
        assert result == [7, 9, 8, 0]
    
    def test_parse_boundary_values(self):
        """Test parsing boundary values (0 and 25)"""
        result = parse_and_validate_key("0,25,0,25")
        assert result == [0, 25, 0, 25]
    
    def test_parse_empty_key(self):
        """Test that empty key raises ValidationError"""
        with pytest.raises(ValidationError, match="Key cannot be empty"):
            parse_and_validate_key("")
    
    def test_parse_whitespace_only(self):
        """Test that whitespace-only key raises ValidationError"""
        with pytest.raises(ValidationError, match="Key cannot be empty"):
            parse_and_validate_key("   ")
    
    def test_parse_invalid_number(self):
        """Test that non-numeric value raises ValidationError"""
        with pytest.raises(ValidationError, match="Invalid number 'a'"):
            parse_and_validate_key("7,a,8")
    
    def test_parse_value_too_high(self):
        """Test that value > 25 raises ValidationError"""
        with pytest.raises(ValidationError, match="out of range"):
            parse_and_validate_key("7,26,8")
    
    def test_parse_value_too_low(self):
        """Test that value < 0 raises ValidationError"""
        with pytest.raises(ValidationError, match="out of range"):
            parse_and_validate_key("7,-1,8")
    
    def test_parse_empty_value_in_list(self):
        """Test that empty value in list raises ValidationError"""
        with pytest.raises(ValidationError, match="Empty value"):
            parse_and_validate_key("7,,8")
    
    def test_parse_float_value(self):
        """Test that float value raises ValidationError"""
        with pytest.raises(ValidationError, match="Invalid number"):
            parse_and_validate_key("7,9.5,8")


class TestValidateText:
    """Tests for validate_text function"""
    
    def test_validate_empty_text(self):
        """Test that empty text raises ValidationError"""
        with pytest.raises(ValidationError, match="cannot be empty"):
            validate_text("")
    
    def test_validate_whitespace_only(self):
        """Test that whitespace-only text raises ValidationError"""
        with pytest.raises(ValidationError, match="cannot be empty"):
            validate_text("   ")
    
    def test_validate_encode_valid_text(self):
        """Test that valid lowercase text passes validation"""
        validate_text("hello world", operation="encode")
        # Should not raise
    
    def test_validate_encode_uppercase(self):
        """Test that uppercase letters raise ValidationError for encoding"""
        with pytest.raises(ValidationError, match="invalid characters"):
            validate_text("Hello World", operation="encode")
    
    def test_validate_encode_numbers(self):
        """Test that numbers raise ValidationError for encoding"""
        with pytest.raises(ValidationError, match="invalid characters"):
            validate_text("hello123", operation="encode")
    
    def test_validate_encode_special_chars(self):
        """Test that special characters raise ValidationError for encoding"""
        with pytest.raises(ValidationError, match="invalid characters"):
            validate_text("hello!", operation="encode")
    
    def test_validate_decode_any_text(self):
        """Test that decode operation accepts any non-empty text"""
        validate_text("< . > O", operation="decode")
        # Should not raise
