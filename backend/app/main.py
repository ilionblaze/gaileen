"""FastAPI application entry point"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import router

# Create FastAPI application
app = FastAPI(
    title="Gaileen Cipher API",
    description="API for encoding and decoding text using the Gaileen Cipher",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configure CORS for local development
# Allow requests from the frontend running on localhost:3000
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)

# Include API routes with /api prefix
app.include_router(router, prefix="/api", tags=["cipher"])


@app.get("/")
async def root():
    """Root endpoint - redirect to API documentation"""
    return {
        "message": "Gaileen Cipher API",
        "version": "1.0.0",
        "docs": "/docs",
        "health": "/api/health"
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
