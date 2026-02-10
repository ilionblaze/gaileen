# Gaileen Cipher Web Application

A modern web-based interface for encoding and decoding messages using the Gaileen substitution cipher.

[![Tests](https://img.shields.io/badge/tests-passing-brightgreen)]()
[![Backend](https://img.shields.io/badge/backend-FastAPI-009688)]()
[![Frontend](https://img.shields.io/badge/frontend-React-61dafb)]()
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue)]()
[![Python](https://img.shields.io/badge/Python-3.11-blue)]()

## Overview

The Gaileen Cipher is a positional substitution cipher that encodes lowercase letters into symbols using a numeric key. This web application provides an intuitive interface for encoding plaintext to cipher symbols and decoding cipher symbols back to plaintext.

### Features

- 🔐 **Encode & Decode** - Convert between plaintext and cipher text
- 🔑 **Custom Keys** - Use any comma-separated key (0-25 range)
- ✅ **Real-time Validation** - Instant feedback on key validity
- 🎨 **Modern UI** - Clean, responsive design
- ♿ **Accessible** - ARIA labels, keyboard navigation
- 🧪 **Well Tested** - 58 tests (42 backend + 16 frontend)
- 🐳 **Docker Ready** - Easy deployment with Docker Compose
- 📱 **Mobile Friendly** - Works on all devices

## Quick Start

### Using Docker (Recommended)

```bash
# Start the application
docker-compose up --build

# Access the application
# Frontend: http://localhost:3000
# Backend API: http://localhost:8000
# API Docs: http://localhost:8000/docs
```

### Manual Setup

**Backend:**
```bash
cd backend
pip install -r requirements.txt
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

Then open http://localhost:3000 in your browser.

## How It Works

### The Gaileen Cipher

The cipher uses a positional key to shift alphabet positions:

1. **Key**: A sequence of numbers (0-25), e.g., `[7,9,8,0,5,0,7]`
2. **Encoding**: Each letter is shifted by the corresponding key position
3. **Symbols**: Shifted positions map to special symbols (>, <, ^, v, O, X, /, \, etc.)
4. **Decoding**: Reverse the process using the same key

**Example:**
```
Plaintext: "hello world"
Key: 7,9,8,0,5,0,7
Encoded: "<. > O < X < >> O / < . "
```

### Architecture

```
┌─────────────┐      HTTP/JSON      ┌─────────────┐
│   React     │ ◄─────────────────► │   FastAPI   │
│  Frontend   │                     │   Backend   │
│ (Port 3000) │                     │ (Port 8000) │
└─────────────┘                     └─────────────┘
                                           │
                                           ▼
                                    ┌─────────────┐
                                    │  gaileen.py │
                                    │  cipher.py  │
                                    └─────────────┘
```

## Technology Stack

### Backend
- **FastAPI** - Modern Python web framework
- **Pydantic** - Data validation
- **pytest** - Testing framework
- **uvicorn** - ASGI server

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Vitest** - Testing framework
- **React Testing Library** - Component testing

### DevOps
- **Docker** - Containerization
- **docker-compose** - Multi-container orchestration
- **nginx** - Production web server

## Project Structure

```
gaileen/
├── backend/                 # FastAPI backend
│   ├── app/
│   │   ├── main.py         # FastAPI application
│   │   ├── routes.py       # API endpoints
│   │   ├── models.py       # Pydantic models
│   │   └── validators.py   # Input validation
│   ├── tests/              # Backend tests (42 tests)
│   ├── Dockerfile          # Backend container
│   └── requirements.txt    # Python dependencies
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── hooks/          # Custom hooks
│   │   ├── services/       # API service layer
│   │   └── types/          # TypeScript types
│   ├── tests/              # Frontend tests (16 tests)
│   ├── Dockerfile          # Frontend container
│   └── package.json        # Node dependencies
├── docker-compose.yml      # Full stack orchestration
├── gaileen.py             # Core cipher logic
├── cipher.py              # Cipher implementation
├── SETUP.md               # Detailed setup guide
└── README.md              # This file
```

## API Endpoints

### Encode
```http
POST /api/encode
Content-Type: application/json

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

### Decode
```http
POST /api/decode
Content-Type: application/json

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

### Health Check
```http
GET /api/health
```

## Testing

### Run All Tests

```bash
# Backend tests (42 tests)
cd backend
pytest

# Frontend tests (16 tests)
cd frontend
npm test

# Total: 58 tests
```

### Test Coverage

- **Backend**: >80% coverage
- **Frontend**: >80% coverage
- **Integration**: End-to-end functionality verified

## Development

### Backend Development

```bash
cd backend

# Install dependencies
pip install -r requirements.txt

# Run with auto-reload
uvicorn app.main:app --reload

# Run tests
pytest

# Run tests with coverage
pytest --cov=app --cov-report=html
```

### Frontend Development

```bash
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev

# Run tests
npm test

# Run tests with UI
npm run test:ui

# Build for production
npm run build
```

## Deployment

### Docker Compose (Production)

```bash
# Build and start
docker-compose up -d --build

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Individual Containers

```bash
# Build backend
docker build -t gaileen-backend ./backend

# Build frontend
docker build -t gaileen-frontend ./frontend

# Run backend
docker run -p 8000:8000 gaileen-backend

# Run frontend
docker run -p 3000:3000 gaileen-frontend
```

## Configuration

### Environment Variables

**Backend** (`backend/.env`):
```env
HOST=0.0.0.0
PORT=8000
CORS_ORIGINS=http://localhost:3000
```

**Frontend** (`frontend/.env`):
```env
VITE_API_URL=http://localhost:8000
```

See `.env.example` files for complete configuration options.

## Documentation

- **[SETUP.md](SETUP.md)** - Detailed setup instructions
- **[Backend README](backend/README.md)** - Backend documentation
- **[Frontend README](frontend/README.md)** - Frontend documentation
- **[Implementation Plan](plans/phase1-implementation-plan.md)** - Development roadmap
- **[UI Design](docs/ui.md)** - UI specifications
- **[API Docs](http://localhost:8000/docs)** - Interactive API documentation (when running)

## Key Features

### User Interface
- Clean, modern design with professional styling
- Two text areas for encode/decode operations
- Key input with real-time validation
- Loading states during API calls
- Error messages with clear feedback
- Responsive design (mobile and desktop)

### Code Quality
- **TypeScript** for type safety
- **SOLID principles** throughout
- **Separation of concerns** (components, hooks, services)
- **Comprehensive testing** (58 tests total)
- **Accessibility** (ARIA labels, keyboard navigation)
- **Error boundaries** for graceful error handling
- **React best practices** (functional components, hooks)

### Security
- Input validation (client and server)
- CORS configuration
- No sensitive data exposure
- Secure headers in production

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests (`pytest` and `npm test`)
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### Development Guidelines

- Follow existing code style
- Write tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting
- Keep commits focused and descriptive

## Troubleshooting

See [SETUP.md](SETUP.md) for detailed troubleshooting guide.

Common issues:
- **Port conflicts**: Change ports in docker-compose.yml or vite.config.ts
- **CORS errors**: Verify VITE_API_URL matches backend URL
- **Module errors**: Reinstall dependencies (`pip install -r requirements.txt` or `npm install`)

## License

See LICENSE file for details.

## References

- [Gaileen Cipher Article](https://www.worldanvil.com/w/anvimar-ilionblaze/a/gaileen-cipher-article)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [React Documentation](https://react.dev/)
- [Docker Documentation](https://docs.docker.com/)

## Acknowledgments

- Original cipher design and implementation
- FastAPI for the excellent Python framework
- React team for the UI library
- All contributors and testers

---

**Status**: Production Ready ✅  
**Version**: 1.0.0  
**Last Updated**: February 9, 2026

For detailed setup instructions, see [SETUP.md](SETUP.md).
