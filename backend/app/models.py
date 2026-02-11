"""Pydantic models for request/response validation"""
from typing import Optional
from pydantic import BaseModel, Field


class CipherRequest(BaseModel):
    """Request model for encode/decode operations"""
    text: str = Field(..., min_length=1, description="Text to encode or decode")
    key: str = Field(..., min_length=1, description="Comma-separated cipher key (e.g., '7,9,8,0,5,0,7')")

    class Config:
        json_schema_extra = {
            "example": {
                "text": "hello world",
                "key": "7,9,8,0,5,0,7"
            }
        }


class CipherResponse(BaseModel):
    """Response model for encode/decode operations"""
    result: str = Field(..., description="Encoded or decoded text")
    success: bool = Field(..., description="Whether the operation was successful")
    error: Optional[str] = Field(None, description="Error message if operation failed")

    class Config:
        json_schema_extra = {
            "example": {
                "result": "=.>O..X./<=..",
                "success": True,
                "error": None
            }
        }


class HealthResponse(BaseModel):
    """Response model for health check"""
    status: str = Field(..., description="Service status")
    version: str = Field(..., description="API version")

    class Config:
        json_schema_extra = {
            "example": {
                "status": "healthy",
                "version": "1.0.0"
            }
        }
