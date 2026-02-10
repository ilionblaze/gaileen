# Gaileen Cipher - Setup Guide

Complete setup instructions for the Gaileen Cipher web application.

## Prerequisites

### Required Software
- **Docker** (recommended) - For containerized deployment
  - Docker Desktop 4.0+ (Windows/Mac)
  - Docker Engine 20.10+ (Linux)
- **OR** Manual Setup:
  - Python 3.11+
  - Node.js 20+
  - npm 10+

## Quick Start (Docker - Recommended)

The easiest way to run the application is using Docker Compose:

```bash
# 1. Clone the repository
git clone <repository-url>
cd gaileen

# 2. Build and start all services
docker-compose up --build

# 3. Access the application
# Frontend: http://localhost:3000
# Backend API: http://localhost:8000
# API Docs: http://localhost:8000/docs
```

That's it! The application is now running.

To stop the services:
```bash
docker-compose down
```

## Manual Setup (Development)

If you prefer to run the services manually without Docker:

### Backend Setup

```bash
# 1. Navigate to backend directory
cd backend

# 2. Create virtual environment (recommended)
python -m venv venv

# 3. Activate virtual environment
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# 4. Install dependencies
pip install -r requirements.txt

# 5. Run the backend server
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000

# Backend will be available at http://localhost:8000
```

### Frontend Setup

Open a new terminal:

```bash
# 1. Navigate to frontend directory
cd frontend

# 2. Install dependencies
npm install

# 3. Run the development server
npm run dev

# Frontend will be available at http://localhost:3000
```

## Environment Configuration

### Backend Environment Variables

Create `backend/.env` (optional, defaults work for local development):

```env
HOST=0.0.0.0
PORT=8000
CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
```

### Frontend Environment Variables

Create `frontend/.env` (optional, defaults work for local development):

```env
VITE_API_URL=http://localhost:8000
```

## Testing

### Backend Tests

```bash
cd backend
pytest

# With coverage
pytest --cov=app --cov-report=html

# Run specific test file
pytest tests/test_routes.py
```

Expected output: 42 tests passing

### Frontend Tests

```bash
cd frontend
npm test

# With UI
npm run test:ui

# Watch mode
npm test -- --watch
```

Expected output: 16 tests passing

## Building for Production

### Build Backend Docker Image

```bash
cd backend
docker build -t gaileen-backend .
docker run -p 8000:8000 gaileen-backend
```

### Build Frontend Docker Image

```bash
cd frontend
docker build -t gaileen-frontend .
docker run -p 3000:3000 gaileen-frontend
```

### Build Frontend for Static Hosting

```bash
cd frontend
npm run build

# Output will be in frontend/dist/
# Can be served with any static file server
```

## Verification

After starting the application, verify it's working:

1. **Open Frontend**: http://localhost:3000
2. **Test Encoding**:
   - Enter text in the "Encode" box (e.g., "hello world")
   - Keep default key: `7,9,8,0,5,0,7`
   - Click "Encode →"
   - Encoded text should appear in "Decode" box
3. **Test Decoding**:
   - Click "← Decode"
   - Original text should appear in "Encode" box
4. **Test Key Validation**:
   - Try invalid key: `7,26,8` (should show error)
   - Try valid key: `1,2,3,4,5` (should work)

## API Documentation

Once the backend is running, visit:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## Troubleshooting

### Port Already in Use

If ports 3000 or 8000 are already in use:

**Docker Compose**: Edit `docker-compose.yml` and change port mappings:
```yaml
ports:
  - "3001:3000"  # Use port 3001 instead
```

**Manual Setup**: 
- Backend: `uvicorn app.main:app --port 8001`
- Frontend: Edit `vite.config.ts` and change `server.port`

### CORS Errors

If you see CORS errors in the browser console:
1. Ensure backend is running
2. Check `VITE_API_URL` in frontend/.env matches backend URL
3. Verify CORS origins in backend configuration

### Module Not Found Errors

**Backend**:
```bash
# Reinstall dependencies
pip install -r requirements.txt

# Ensure you're in the backend directory
cd backend
```

**Frontend**:
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Docker Build Fails

```bash
# Clean Docker cache
docker system prune -a

# Rebuild without cache
docker-compose build --no-cache
```

## Project Structure

```
gaileen/
├── backend/              # FastAPI backend
│   ├── app/             # Application code
│   ├── tests/           # Backend tests
│   ├── Dockerfile       # Backend container
│   └── requirements.txt # Python dependencies
├── frontend/            # React frontend
│   ├── src/            # Source code
│   ├── tests/          # Frontend tests
│   ├── Dockerfile      # Frontend container
│   └── package.json    # Node dependencies
├── docker-compose.yml  # Full stack orchestration
├── gaileen.py         # Core cipher logic
├── cipher.py          # Cipher implementation
└── README.md          # Main documentation
```

## Development Workflow

1. **Make Changes**: Edit files in `backend/` or `frontend/`
2. **Test Locally**: Run tests to verify changes
3. **Manual Testing**: Test in browser at http://localhost:3000
4. **Build**: Ensure production build works
5. **Commit**: Commit changes to version control

## Additional Resources

- **Backend README**: `backend/README.md`
- **Frontend README**: `frontend/README.md`
- **Implementation Plan**: `plans/phase1-implementation-plan.md`
- **UI Design**: `docs/ui.md`

## Support

For issues or questions:
1. Check this setup guide
2. Review the troubleshooting section
3. Check the API documentation at http://localhost:8000/docs
4. Review test files for usage examples

## Next Steps

After setup:
1. Explore the UI at http://localhost:3000
2. Try encoding and decoding messages
3. Experiment with different cipher keys
4. Review the API documentation
5. Run the test suites to understand the codebase

Happy coding! 🎉
