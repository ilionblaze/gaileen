/**
 * Main App Component
 * Root component with error boundary and theme provider
 */

import React from 'react';
import { CipherForm } from './components/CipherForm';
import { ThemeProvider } from './contexts/ThemeContext';
import './App.css';

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <h1>Something went wrong</h1>
          <p>{this.state.error?.message || 'An unexpected error occurred'}</p>
          <button onClick={() => window.location.reload()}>
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

function App(): React.ReactElement {
  return (
    <ThemeProvider>
      <ErrorBoundary>
        <div className="app">
          <CipherForm />
        </div>
      </ErrorBoundary>
    </ThemeProvider>
  );
}

export default App;
