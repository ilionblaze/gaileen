"""API route handlers for cipher operations"""
import sys
import os
from fastapi import APIRouter, HTTPException

# Add parent directory to path to import gaileen
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from gaileen import gaileen
from app.models import CipherRequest, CipherResponse, HealthResponse
from app.validators import parse_and_validate_key, validate_text, ValidationError

router = APIRouter()


@router.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint"""
    return HealthResponse(
        status="healthy",
        version="1.0.0"
    )


@router.post("/encode", response_model=CipherResponse)
async def encode_text(request: CipherRequest):
    """
    Encode plaintext using the Gaileen cipher.
    
    Args:
        request: CipherRequest containing text and key
    
    Returns:
        CipherResponse with encoded text or error message
    """
    try:
        # Validate text
        validate_text(request.text, operation="encode")
        
        # Parse and validate key
        key_values = parse_and_validate_key(request.key)
        
        # Create cipher instance with plain mode (no BBCode)
        cipher = gaileen(key_values)
        cipher.setPlain()
        
        # Encode the text (space=True to add spaces between symbols for easier decoding)
        encoded = cipher.encode(request.text, space=True)
        
        return CipherResponse(
            result=encoded,
            success=True,
            error=None
        )
    
    except ValidationError as e:
        return CipherResponse(
            result="",
            success=False,
            error=str(e)
        )
    
    except Exception as e:
        # Log unexpected errors but don't expose internal details
        print(f"Unexpected error during encoding: {e}")
        return CipherResponse(
            result="",
            success=False,
            error="An unexpected error occurred during encoding"
        )


@router.post("/decode", response_model=CipherResponse)
async def decode_text(request: CipherRequest):
    """
    Decode cipher text using the Gaileen cipher.
    
    Args:
        request: CipherRequest containing encoded text and key
    
    Returns:
        CipherResponse with decoded text or error message
    """
    try:
        # Validate text
        validate_text(request.text, operation="decode")
        
        # Parse and validate key
        key_values = parse_and_validate_key(request.key)
        
        # Create cipher instance with plain mode (no BBCode)
        cipher = gaileen(key_values)
        cipher.setPlain()
        
        # Split the encoded text into individual symbols (space-separated)
        # The decode method expects a list of symbols
        symbols = request.text.split()
        
        # Decode the symbols
        decoded = cipher.decode(symbols)
        
        return CipherResponse(
            result=decoded,
            success=True,
            error=None
        )
    
    except ValidationError as e:
        return CipherResponse(
            result="",
            success=False,
            error=str(e)
        )
    
    except Exception as e:
        # Log unexpected errors but don't expose internal details
        print(f"Unexpected error during decoding: {e}")
        return CipherResponse(
            result="",
            success=False,
            error="An unexpected error occurred during decoding"
        )
