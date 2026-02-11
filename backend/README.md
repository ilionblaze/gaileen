# Gaileen Cipher Backend

FastAPI backend service for the Gaileen Cipher web application.

## Overview

This backend provides REST API endpoints for encoding and decoding messages using the Gaileen substitution cipher. Built with FastAPI, it offers automatic API documentation, input validation, and comprehensive error handling.

## Technology Stack

- **FastAPI** - Modern Python web framework
- **Pydantic** - Data validation and settings management
- **pytest** - Testing framework
- **uvicorn** - ASGI server
- **Python 3.11+** - Programming language

## Project Structure

```
backend/
├── app/
│   ├── __init__.py          # Package initialization
│   ├── main.py              # FastAPI application setup
│   ├── routes.py            # API endpoint definitions
│   ├── models.py            # Pydantic models
│   └── validators.py        # Input validation logic
├── tests/
│   ├── __init__.py          # Test package initialization
│   ├── test_routes.py       # API endpoint tests
│   ├── test_validators.py  # Validation logic tests
│   └── test_integration.py # Integration tests
├── Dockerfile               # Docker container configuration
├── requirements.txt         # Python dependencies
├── pytest.ini              # Pytest configuration
└── README.md               # This file
```

## API Endpoints

### POST /api/encode

Encodes plaintext using the Gaileen Cipher.

**Request:**
```json
{
  "text": "hello world",
  "key": "7,9,8,0,5,0,7"
}
```

**Response:**
```json
{
  "result": "<. > O < X < >> O / < . ",
  "success": true,
  "error": null
}
```

**Error Response:**
```json
{
  "result": "",
  "success": false,
  "error": "Invalid key: values must be between 0 and 25"
}
```

### POST /api/decode

Decodes cipher text using the Gaileen Cipher.

**Request:**
```json
{
  "text": "<. > O < X < >> O / < . ",
  "key": "7,9,8,0,5,0,7"
}
```

**Response:**
```json
{
  "result": "hello world",
  "success": true,
  "error": null
}
```

### GET /api/health

Health check endpoint.

**Response:**
```json
{
  "status": "healthy"
}
```

### GET /

Root endpoint with API information.

**Response:**
```json
{
  "message": "Gaileen Cipher API",
  "version": "1.0.0",
  "docs": "/docs"
}
```

## Setup

### Prerequisites

- Python 3.11 or higher
- pip (Python package manager)

### Installation

```bash
# Navigate to backend directory
cd backend

# Create virtual environment (recommended)
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### Running the Server

```bash
# Development mode (with auto-reload)
uvicorn app.main:app --reload

# Production mode
uvicorn app.main:app --host 0.0.0.0 --port 8000

# With custom host and port
uvicorn app.main:app --host 127.0.0.1 --port 8080
```

The server will start at http://localhost:8000

### API Documentation

Once the server is running, access the interactive API documentation:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## Testing

### Run All Tests

```bash
# Run all tests
pytest

# Run with verbose output
pytest -v

# Run specific test file
pytest tests/test_routes.py

# Run specific test
pytest tests/test_routes.py::test_encode_success
```

### Test Coverage

```bash
# Run tests with coverage report
pytest --cov=app --cov-report=html

# View coverage report
# Open htmlcov/index.html in browser
```

### Test Results

```
42 tests passing
Coverage: >80%
Duration: ~2 seconds
```

## Docker

### Build Docker Image

```bash
docker build -t gaileen-backend .
```

### Run Docker Container

```bash
# Run container
docker run -p 8000:8000 gaileen-backend

# Run with volume mount (for development)
docker run -p 8000:8000 -v $(pwd):/app gaileen-backend
```

## Configuration

### Environment Variables

Create a `.env` file in the backend directory:

```env
HOST=0.0.0.0
PORT=8000
CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
PYTHONUNBUFFERED=1
```

### CORS Configuration

CORS is configured in `app/main.py` to allow requests from the frontend:

```python
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]
```

## Key Validation

The backend validates cipher keys with the following rules:

- **Format**: Comma-separated integers
- **Range**: Each value must be between 0 and 25 (inclusive)
- **Examples**:
  - ✅ Valid: `"7,9,8,0,5,0,7"`
  - ✅ Valid: `"0,1,2,3,4,5"`
  - ❌ Invalid: `"7,26,8"` (26 is out of range)
  - ❌ Invalid: `"7,a,8"` (non-numeric)
  - ❌ Invalid: `"7 9 8"` (wrong separator)

## Error Handling

The API returns structured error responses:

```json
{
  "result": "",
  "success": false,
  "error": "Descriptive error message"
}
```

Common error scenarios:
- Invalid key format
- Key values out of range (0-25)
- Empty text input
- Invalid characters in cipher text

## Integration with gaileen.py

The backend integrates with the core cipher logic in `gaileen.py`:

```python
from gaileen import gaileen

# Create cipher instance
cipher = gaileen()
cipher.setKey(key_list)
cipher.setPlain()  # Use plain text mode (no BBCode)

# Encode
encoded = cipher.encode(text, space=True)

# Decode
decoded = cipher.decode(text)
```

## Development

### Code Structure

**app/main.py**
- FastAPI application setup
- CORS configuration
- Route registration

**app/routes.py**
- API endpoint definitions
- Request/response handling
- Error handling

**app/models.py**
- Pydantic models for request/response validation
- Type definitions

**app/validators.py**
- Key validation logic
- Input sanitization

### Adding New Endpoints

1. Define Pydantic models in `models.py`
2. Add endpoint function in `routes.py`
3. Register route in `main.py`
4. Write tests in `tests/`

### Code Style

- Follow PEP 8 style guide
- Use type hints
- Write docstrings for functions
- Keep functions focused and small

## Troubleshooting

### Port Already in Use

```bash
# Use a different port
uvicorn app.main:app --port 8001
```

### Module Import Errors

```bash
# Ensure you're in the backend directory
cd backend

# Reinstall dependencies
pip install -r requirements.txt
```

### CORS Errors

Check that the frontend URL is in the CORS origins list in `app/main.py`.

### Tests Failing

```bash
# Clear pytest cache
pytest --cache-clear

# Run tests with verbose output
pytest -v
```

## Performance

- **Response Time**: <100ms for encode/decode operations
- **Throughput**: Handles hundreds of requests per second
- **Memory**: Minimal memory footprint
- **Startup**: Fast startup time (<2 seconds)

## Security

- Input validation on all endpoints
- CORS properly configured
- No sensitive data in responses
- Error messages don't expose internals
- Rate limiting can be added if needed

## Dependencies

Main dependencies (see `requirements.txt` for full list):

- `fastapi` - Web framework
- `uvicorn` - ASGI server
- `pydantic` - Data validation
- `pytest` - Testing
- `pytest-cov` - Coverage reporting

## Contributing

1. Write tests for new features
2. Ensure all tests pass
3. Follow existing code style
4. Update documentation
5. Keep commits focused

## License

See main project LICENSE file.

## References

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Pydantic Documentation](https://docs.pydantic.dev/)
- [pytest Documentation](https://docs.pytest.org/)
