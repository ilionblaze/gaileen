# Gaileen Cipher Frontend

React-based web UI for the Gaileen Cipher encoding and decoding system.

## Technology Stack

- **React 18** with TypeScript
- **Vite** for fast development and building
- **Vitest** for unit testing
- **React Testing Library** for component testing
- **CSS** for styling (no framework dependencies)

## Project Structure

```
frontend/
├── src/
│   ├── components/       # React components
│   │   ├── CipherForm.tsx    # Main container component
│   │   ├── InputBox.tsx      # Reusable input component
│   │   └── KeyInput.tsx      # Key input with validation
│   ├── hooks/           # Custom React hooks
│   │   └── useCipher.ts     # Cipher operations hook
│   ├── services/        # API service layer
│   │   └── api.ts           # Backend API communication
│   ├── types/           # TypeScript type definitions
│   │   └── cipher.ts        # Cipher-related types
│   ├── App.tsx          # Root component with error boundary
│   ├── App.css          # Application styles
│   ├── main.tsx         # Application entry point
│   └── index.css        # Global styles
├── tests/               # Test files
│   ├── components/      # Component tests
│   ├── hooks/           # Hook tests
│   └── setup.ts         # Test configuration
├── Dockerfile           # Docker configuration
├── nginx.conf           # Nginx configuration for production
└── vite.config.ts       # Vite configuration
```

## Getting Started

### Prerequisites

- Node.js 20 or higher
- npm or yarn

### Installation

```bash
# Install dependencies
npm install
```

### Development

```bash
# Start development server (runs on http://localhost:3000)
npm run dev
```

The development server will automatically reload when you make changes to the code.

### Building

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

### Testing

```bash
# Run tests
npm test

# Run tests with UI
npm run test:ui

# Run tests in watch mode
npm test -- --watch
```

### Linting

```bash
# Run ESLint
npm run lint
```

## Environment Variables

Create a `.env` file in the frontend directory (use `.env.example` as a template):

```env
VITE_API_URL=http://localhost:8000
```

## Docker

### Build Docker Image

```bash
docker build -t gaileen-frontend .
```

### Run Docker Container

```bash
docker run -p 3000:3000 gaileen-frontend
```

## Features

### Components

#### CipherForm
Main container component that orchestrates the cipher UI. Manages state for encode/decode text and cipher key.

#### InputBox
Reusable input component with support for single-line and multi-line text input. Includes proper accessibility features.

#### KeyInput
Specialized input for cipher keys with client-side validation. Validates that keys are comma-separated integers between 0-25.

### Custom Hooks

#### useCipher
Encapsulates cipher API communication logic. Manages loading and error states for encode/decode operations.

### API Service

The `api.ts` service layer handles all communication with the backend API:
- `encode(text, key)` - Encodes plaintext
- `decode(text, key)` - Decodes cipher text

## Architecture

The frontend follows React best practices and SOLID principles:

- **Single Responsibility**: Each component has one clear purpose
- **Separation of Concerns**: Components, hooks, and services are separated
- **Type Safety**: Full TypeScript coverage
- **Accessibility**: ARIA labels, keyboard navigation, screen reader support
- **Error Handling**: Error boundary and graceful error states
- **Testing**: Comprehensive unit tests for components and hooks

## API Integration

The frontend communicates with the FastAPI backend at `http://localhost:8000` (configurable via `VITE_API_URL`).

### Endpoints Used

- `POST /api/encode` - Encode plaintext to cipher
- `POST /api/decode` - Decode cipher to plaintext

### Request Format

```json
{
  "text": "hello world",
  "key": "7,9,8,0,5,0,7"
}
```

### Response Format

```json
{
  "result": "encoded/decoded text",
  "success": true,
  "error": null
}
```

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## Contributing

1. Follow the existing code style
2. Write tests for new features
3. Ensure all tests pass before submitting
4. Update documentation as needed

## License

See main project LICENSE file.
