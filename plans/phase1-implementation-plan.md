# Gaileen Cipher Web UI - Implementation Plan

**Version**: 1.0  
**Date**: February 9, 2026  
**Target**: Local Development Only

## Overview

Build a React-based web UI for the Gaileen Cipher with a Python FastAPI backend, containerized with Docker for local deployment.

---

## Understanding the Current System

The Gaileen Cipher is a substitution cipher that:
- Uses a positional key (e.g., `[7,9,8,0,5,0,7]`) to shift alphabet positions
- Encodes lowercase letters to symbols (>, <, ^, v, O, X, /, \, etc.)
- Has two output modes: plain text and BBCode (with `[br]` tags for special characters)
- The `-p` flag enables plain text mode (no BBCode)

---

## Technology Stack

- **Frontend**: React with TypeScript
- **Backend**: Python FastAPI (wraps existing `gaileen.py`)
- **Containerization**: Docker with docker-compose
- **Testing**: Jest + React Testing Library (frontend), pytest (backend)
- **Deployment**: Local development only

---

## Project Structure

```
gaileen/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── CipherForm.tsx
│   │   │   ├── InputBox.tsx
│   │   │   └── KeyInput.tsx
│   │   ├── services/
│   │   │   └── api.ts
│   │   ├── hooks/
│   │   │   └── useCipher.ts
│   │   ├── types/
│   │   │   └── cipher.ts
│   │   ├── App.tsx
│   │   └── index.tsx
│   ├── tests/
│   │   ├── components/
│   │   ├── hooks/
│   │   └── services/
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── Dockerfile
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py
│   │   ├── routes.py
│   │   ├── models.py
│   │   └── validators.py
│   ├── tests/
│   │   ├── test_routes.py
│   │   ├── test_validators.py
│   │   └── test_integration.py
│   ├── requirements.txt
│   └── Dockerfile
├── docker-compose.yml
├── cipher.py (existing)
├── gaileen.py (existing)
├── test_gaileen.py (existing)
├── docs/
│   └── ui.md (existing)
└── plans/
    └── phase1-implementation-plan.md (this file)
```

---

## Phase 1 Implementation Details

### 1. Backend API Development

**Goal**: Create a FastAPI service that wraps the existing Python cipher functionality

#### Components

**1.1 FastAPI Application (`app/main.py`)**
- CORS enabled for local development (localhost:3000)
- Health check endpoint
- Error handling middleware
- Logging configuration

**1.2 API Endpoints (`app/routes.py`)**
- `POST /api/encode` - accepts plaintext + key, returns encoded text
- `POST /api/decode` - accepts encoded text + key, returns plaintext
- `GET /api/health` - health check endpoint

**1.3 Request/Response Models (`app/models.py`)**
```python
class CipherRequest(BaseModel):
    text: str
    key: str  # comma-separated string

class CipherResponse(BaseModel):
    result: str
    success: bool
    error: Optional[str] = None
```

**1.4 Validation (`app/validators.py`)**
- Parse comma-separated key string
- Validate each key value is an integer between 0-25
- Validate text is not empty
- Return clear error messages

**1.5 Integration with `gaileen.py`**
- Import existing `gaileen` class
- Always use plain mode (`setPlain()`) for web output
- **Encoding format**: Uses `space=True` to add spaces between symbols
  - Multi-character symbols (e.g., `<.`, `>>`, `<<`, `//`, `.>`, `..`) are kept together
  - Example output: `<. > O < X < ` (note spaces between symbols and trailing space)
  - This format allows proper decoding by splitting on spaces
- **Decoding format**: Expects space-separated symbols
  - Input is split by spaces to create a list of symbols
  - Each symbol (single or multi-character) is decoded individually

#### API Contract

**Encode Request**:
```json
POST /api/encode
{
  "text": "hello world",
  "key": "7,9,8,0,5,0,7"
}
```

**Encode Response**:
```json
{
  "result": "=.>O..X./<=..",
  "success": true,
  "error": null
}
```

**Error Response**:
```json
{
  "result": "",
  "success": false,
  "error": "Invalid key: values must be between 0 and 25"
}
```

---

### 2. React Frontend Development

**Goal**: Create a clean, responsive UI following React best practices

#### Components (SOLID Principles)

**2.1 `CipherForm.tsx` (Container Component)**
- **Responsibility**: Orchestrate the cipher UI
- **State Management**:
  - `encodeText`: string for encode input
  - `decodeText`: string for decode input
  - `key`: string for cipher key (default: "7,9,8,0,5,0,7")
  - `loading`: boolean for API call state
  - `error`: string for error messages
- **Behavior**:
  - When encode button clicked: clear decode box, call encode API, populate decode box
  - When decode button clicked: clear encode box, call decode API, populate encode box
  - Display loading spinner during API calls
  - Display error messages when validation fails

**2.2 `InputBox.tsx` (Presentational Component)**
- **Props**:
  ```typescript
  interface InputBoxProps {
    label: string
    value: string
    onChange: (value: string) => void
    placeholder?: string
    disabled?: boolean
    multiline?: boolean
    rows?: number
  }
  ```
- **Features**:
  - Accessible with proper ARIA labels
  - Support for single-line and multi-line (textarea)
  - Disabled state during loading
  - Clear visual hierarchy

**2.3 `KeyInput.tsx` (Specialized Component)**
- **Props**:
  ```typescript
  interface KeyInputProps {
    value: string
    onChange: (value: string) => void
    disabled?: boolean
  }
  ```
- **Features**:
  - Input for comma-separated key values
  - Client-side validation (numbers 0-25)
  - Visual feedback for invalid input
  - Default value: "7,9,8,0,5,0,7"
  - Help text explaining key format

#### Custom Hooks

**2.4 `useCipher.ts`**
```typescript
interface UseCipherReturn {
  encode: (text: string, key: string) => Promise<string>
  decode: (text: string, key: string) => Promise<string>
  loading: boolean
  error: string | null
}

function useCipher(): UseCipherReturn
```
- Encapsulates API communication logic
- Manages loading and error states
- Provides clean interface for components
- Handles error transformation

#### Service Layer

**2.5 `api.ts`**
```typescript
export const cipherApi = {
  encode: async (text: string, key: string): Promise<CipherResponse> => {
    // POST to /api/encode
  },
  decode: async (text: string, key: string): Promise<CipherResponse> => {
    // POST to /api/decode
  }
}
```

#### Type Definitions

**2.6 `types/cipher.ts`**
```typescript
export interface CipherResponse {
  result: string
  success: boolean
  error?: string
}

export interface CipherRequest {
  text: string
  key: string
}
```

---

### 3. Key Features

#### User Experience
- **Automatic clearing**: When encode button is clicked, decode box clears (and vice versa)
- **Loading states**: Show spinner during API calls, disable inputs
- **Error handling**: Display user-friendly error messages
- **Responsive design**: Mobile-friendly layout
- **Accessibility**: Keyboard navigation, screen reader support, proper focus management

#### Key Validation
- **Format**: Comma-separated integers
- **Range**: Each value must be 0-25 (alphabet size)
- **Examples**:
  - ✅ Valid: "7,9,8,0,5,0,7"
  - ✅ Valid: "0,1,2,3"
  - ❌ Invalid: "7,9,26,0" (26 is out of range)
  - ❌ Invalid: "7,9,a,0" (non-numeric)
  - ❌ Invalid: "7 9 8" (wrong separator)

---

### 4. Docker Configuration

#### Frontend Dockerfile
```dockerfile
# Multi-stage build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]
```

#### Backend Dockerfile
```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

#### docker-compose.yml
```yaml
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "8000:8000"
    volumes:
      - ./backend:/app
      - ./gaileen.py:/app/gaileen.py
    environment:
      - PYTHONUNBUFFERED=1

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    depends_on:
      - backend
    environment:
      - VITE_API_URL=http://localhost:8000
```

---

### 5. Testing Strategy

#### Frontend Tests (Jest + React Testing Library)

**Component Tests**:
- `CipherForm.test.tsx`:
  - Renders all input boxes and buttons
  - Encode button clears decode box and calls API
  - Decode button clears encode box and calls API
  - Displays loading state during API calls
  - Displays error messages on validation failure
  - Handles API errors gracefully

- `InputBox.test.tsx`:
  - Renders with correct label
  - Calls onChange when value changes
  - Respects disabled state
  - Supports multiline mode

- `KeyInput.test.tsx`:
  - Validates key format
  - Shows error for invalid keys
  - Accepts valid keys

**Hook Tests**:
- `useCipher.test.ts`:
  - Encode function calls API correctly
  - Decode function calls API correctly
  - Loading state updates correctly
  - Error state updates on API failure

**Service Tests**:
- `api.test.ts`:
  - Encode API call formats request correctly
  - Decode API call formats request correctly
  - Handles network errors
  - Parses responses correctly

**Accessibility Tests**:
- All interactive elements are keyboard accessible
- Proper ARIA labels on all inputs
- Focus management works correctly
- Screen reader announcements for errors

#### Backend Tests (pytest)

**Route Tests** (`test_routes.py`):
- `test_encode_success`: Valid encode request returns correct result
- `test_decode_success`: Valid decode request returns correct result
- `test_encode_invalid_key`: Invalid key returns error
- `test_decode_invalid_key`: Invalid key returns error
- `test_encode_empty_text`: Empty text returns error
- `test_health_check`: Health endpoint returns 200

**Validator Tests** (`test_validators.py`):
- `test_parse_valid_key`: "7,9,8,0,5" parses to [7,9,8,0,5]
- `test_parse_invalid_key_range`: "7,26,8" raises validation error
- `test_parse_invalid_key_format`: "7,a,8" raises validation error
- `test_parse_empty_key`: "" raises validation error

**Integration Tests** (`test_integration.py`):
- `test_encode_decode_roundtrip`: Encode then decode returns original
- `test_gaileen_integration`: Backend correctly uses gaileen.py
- `test_plain_mode_enabled`: Output uses plain mode (no BBCode)

**Test Coverage Goal**: >80% for all new code

---

### 6. React Best Practices Applied

Based on the Vercel React Best Practices guide:

#### Critical Optimizations
- ✅ **No barrel file imports**: Direct imports from source files
- ✅ **Lazy loading**: Non-critical components loaded on demand
- ✅ **Proper error boundaries**: Catch and display errors gracefully

#### Server-Side Performance
- ✅ **Minimal serialization**: Only send needed data over API
- ✅ **Proper error handling**: Clear error messages from backend

#### Client-Side Data Fetching
- ✅ **Custom hooks**: Encapsulate API logic in `useCipher`
- ✅ **Error handling**: Graceful degradation on API failures

#### Re-render Optimization
- ✅ **Functional setState**: Use functional updates where needed
- ✅ **Proper dependencies**: Correct useEffect dependency arrays
- ✅ **Derived state**: Calculate during render, not in effects
- ✅ **Event handlers**: Put interaction logic in handlers, not effects

#### Rendering Performance
- ✅ **Explicit conditional rendering**: Use ternary operators
- ✅ **Proper loading states**: Use transitions for non-urgent updates

#### JavaScript Performance
- ✅ **Early returns**: Return early when result is determined
- ✅ **Proper validation**: Validate input before processing

#### Advanced Patterns
- ✅ **TypeScript**: Type safety throughout
- ✅ **Separation of concerns**: Components, hooks, services separated
- ✅ **SOLID principles**: Single responsibility for each component

---

## Development Phases

### Phase 1A - Backend (Estimated: 2-3 hours) ✅ COMPLETED

- [x] Set up FastAPI project structure
- [x] Create `app/main.py` with CORS and basic setup
- [x] Implement `app/models.py` with Pydantic models
- [x] Implement `app/validators.py` with key validation (0-25 range)
- [x] Implement `app/routes.py` with encode/decode endpoints
- [x] Integrate with existing `gaileen.py` (plain mode)
- [x] Write backend tests (pytest) - 42 tests passing
- [x] Create `requirements.txt`
- [x] Create backend Dockerfile
- [x] Test backend locally

### Phase 1B - Frontend (Estimated: 3-4 hours)

- [ ] Set up React + TypeScript project (Vite)
- [ ] Create type definitions (`types/cipher.ts`)
- [ ] Implement `api.ts` service layer
- [ ] Implement `useCipher.ts` custom hook
- [ ] Create `InputBox.tsx` component
- [ ] Create `KeyInput.tsx` component with validation
- [ ] Create `CipherForm.tsx` container component
- [ ] Create `App.tsx` with error boundary
- [ ] Add basic styling (CSS or Tailwind)
- [ ] Write frontend tests (Jest + RTL)
- [ ] Create frontend Dockerfile with nginx
- [ ] Test frontend locally

### Phase 1C - Integration (Estimated: 1-2 hours)

- [ ] Create `docker-compose.yml`
- [ ] Configure environment variables
- [ ] Test full stack with Docker Compose
- [ ] Verify encode/decode functionality end-to-end
- [ ] Test error handling (invalid keys, network errors)
- [ ] Test accessibility (keyboard navigation, screen readers)
- [ ] Update main README.md with setup instructions
- [ ] Create frontend/backend specific READMEs
- [ ] Final testing and bug fixes

---

## Key Design Decisions

### 1. Why FastAPI?
- Modern, fast Python framework
- Automatic API documentation (Swagger UI at `/docs`)
- Easy integration with existing Python code
- Type hints and validation built-in with Pydantic
- Excellent for local development

### 2. Why Separate Frontend/Backend?
- Clear separation of concerns
- Independent development and testing
- Easier maintenance
- Follows SOLID principles
- Can scale independently if needed later

### 3. State Management
- Using React hooks (useState, useCallback, useMemo)
- No Redux needed for this simple use case
- Custom hook (`useCipher`) encapsulates cipher logic
- Clean, maintainable code

### 4. Plain Text Mode
- Always enabled in API calls (`-p` flag)
- Simpler output for web UI
- Avoids BBCode complexity
- Better user experience

### 5. Key Validation
- **Range**: 0-25 (alphabet size, 26 letters)
- **Format**: Comma-separated integers
- **Validation**: Both client-side (immediate feedback) and server-side (security)
- **Error messages**: Clear, actionable feedback

### 6. Local Development Only
- No authentication needed
- CORS configured for localhost
- Simple deployment with docker-compose
- Focus on functionality over production concerns

---

## Success Criteria

### Functional Requirements
- ✅ User can encode plaintext to cipher symbols
- ✅ User can decode cipher symbols to plaintext
- ✅ User can specify custom cipher key (0-25 range)
- ✅ Encode button clears decode box
- ✅ Decode button clears encode box
- ✅ Invalid keys show clear error messages
- ✅ Loading states during API calls

### Non-Functional Requirements
- ✅ Responsive design (mobile-friendly)
- ✅ Accessible (keyboard navigation, ARIA labels)
- ✅ Fast response times (<500ms for encode/decode)
- ✅ >80% test coverage
- ✅ Clean, maintainable code following SOLID principles
- ✅ Easy local setup with docker-compose

### Documentation
- ✅ Setup instructions in README
- ✅ API documentation (Swagger)
- ✅ Code comments for complex logic
- ✅ Test documentation

---

## Future Enhancements (Phase 2+)

These are NOT part of Phase 1 but could be considered later:

- Copy to clipboard button
- Message history/saved messages
- Export/import functionality
- Multiple cipher algorithms
- Batch encode/decode
- Dark mode
- Keyboard shortcuts
- Share encoded messages via URL
- Custom symbol sets
- Visual cipher wheel animation

---

## References

- [Gaileen Cipher Article](https://www.worldanvil.com/w/anvimar-ilionblaze/a/gaileen-cipher-article)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [React Documentation](https://react.dev/)
- [Vercel React Best Practices](https://github.com/vercel-labs/agent-skills/blob/main/skills/react-best-practices/AGENTS.md)
- [Docker Documentation](https://docs.docker.com/)

---

**End of Phase 1 Implementation Plan**
