"""Validation functions for cipher operations"""
from typing import List


class ValidationError(Exception):
    """Custom exception for validation errors"""
    pass


def parse_and_validate_key(key_string: str) -> List[int]:
    """
    Parse and validate a comma-separated cipher key string.
    
    Args:
        key_string: Comma-separated string of integers (e.g., "7,9,8,0,5,0,7")
    
    Returns:
        List of integers representing the cipher key
    
    Raises:
        ValidationError: If key format is invalid or values are out of range
    """
    if not key_string or not key_string.strip():
        raise ValidationError("Key cannot be empty")
    
    # Split by comma and strip whitespace
    parts = [part.strip() for part in key_string.split(",")]
    
    if not parts:
        raise ValidationError("Key must contain at least one value")
    
    key_values = []
    for i, part in enumerate(parts):
        if not part:
            raise ValidationError(f"Empty value at position {i + 1}")
        
        # Try to parse as integer
        try:
            value = int(part)
        except ValueError:
            raise ValidationError(f"Invalid number '{part}' at position {i + 1}")
        
        # Validate range (0-25 for alphabet)
        if value < 0 or value > 25:
            raise ValidationError(
                f"Key value {value} at position {i + 1} is out of range. "
                f"Values must be between 0 and 25 (inclusive)"
            )
        
        key_values.append(value)
    
    return key_values


def validate_text(text: str, operation: str = "encode") -> None:
    """
    Validate text for cipher operations.
    
    Args:
        text: Text to validate
        operation: Operation type ("encode" or "decode")
    
    Raises:
        ValidationError: If text is invalid
    """
    if not text or not text.strip():
        raise ValidationError(f"Text to {operation} cannot be empty")
    
    # For encoding, check if text contains only lowercase letters and spaces
    if operation == "encode":
        # Allow lowercase letters and spaces
        invalid_chars = [c for c in text if not (c.islower() or c.isspace())]
        if invalid_chars:
            unique_invalid = sorted(set(invalid_chars))
            raise ValidationError(
                f"Text contains invalid characters: {', '.join(repr(c) for c in unique_invalid)}. "
                f"Only lowercase letters and spaces are allowed for encoding"
            )
