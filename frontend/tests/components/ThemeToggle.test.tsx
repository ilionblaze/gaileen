/**
 * Tests for ThemeToggle Component
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeToggle } from '../../src/components/ThemeToggle';
import { ThemeProvider } from '../../src/contexts/ThemeContext';
import React from 'react';

// Helper to render with ThemeProvider
function renderWithTheme(ui: React.ReactElement) {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
}

describe('ThemeToggle', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
    
    // Mock matchMedia
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  });

  describe('Rendering', () => {
    it('renders toggle button', () => {
      renderWithTheme(<ThemeToggle />);
      
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });

    it('shows moon icon and "Dark" text in light mode', () => {
      renderWithTheme(<ThemeToggle />);
      
      const button = screen.getByRole('button');
      expect(button).toHaveTextContent('Dark');
      expect(button).toHaveAttribute('aria-label', 'Switch to dark mode');
    });

    it('shows sun icon and "Light" text in dark mode', () => {
      localStorage.setItem('gaileen-cipher-theme', 'dark');
      
      renderWithTheme(<ThemeToggle />);
      
      const button = screen.getByRole('button');
      expect(button).toHaveTextContent('Light');
      expect(button).toHaveAttribute('aria-label', 'Switch to light mode');
    });

    it('applies custom className when provided', () => {
      renderWithTheme(<ThemeToggle className="custom-class" />);
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('theme-toggle');
      expect(button).toHaveClass('custom-class');
    });
  });

  describe('Interaction', () => {
    it('toggles theme when clicked', async () => {
      const user = userEvent.setup();
      
      renderWithTheme(<ThemeToggle />);
      
      const button = screen.getByRole('button');
      expect(button).toHaveTextContent('Dark');
      
      await user.click(button);
      
      expect(button).toHaveTextContent('Light');
      expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    });

    it('toggles theme multiple times', async () => {
      const user = userEvent.setup();
      
      renderWithTheme(<ThemeToggle />);
      
      const button = screen.getByRole('button');
      
      // First toggle: light -> dark
      await user.click(button);
      expect(button).toHaveTextContent('Light');
      expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
      
      // Second toggle: dark -> light
      await user.click(button);
      expect(button).toHaveTextContent('Dark');
      expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    });

    it('persists theme preference to localStorage', async () => {
      const user = userEvent.setup();
      
      renderWithTheme(<ThemeToggle />);
      
      const button = screen.getByRole('button');
      await user.click(button);
      
      expect(localStorage.getItem('gaileen-cipher-theme')).toBe('dark');
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA label for light mode', () => {
      renderWithTheme(<ThemeToggle />);
      
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label', 'Switch to dark mode');
    });

    it('has proper ARIA label for dark mode', () => {
      localStorage.setItem('gaileen-cipher-theme', 'dark');
      
      renderWithTheme(<ThemeToggle />);
      
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label', 'Switch to light mode');
    });

    it('has title attribute matching aria-label', () => {
      renderWithTheme(<ThemeToggle />);
      
      const button = screen.getByRole('button');
      const ariaLabel = button.getAttribute('aria-label');
      const title = button.getAttribute('title');
      
      expect(title).toBe(ariaLabel);
    });

    it('is keyboard accessible', async () => {
      const user = userEvent.setup();
      
      renderWithTheme(<ThemeToggle />);
      
      const button = screen.getByRole('button');
      
      // Tab to button
      await user.tab();
      expect(button).toHaveFocus();
      
      // Press Enter to toggle
      await user.keyboard('{Enter}');
      expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    });

    it('can be activated with Space key', async () => {
      const user = userEvent.setup();
      
      renderWithTheme(<ThemeToggle />);
      
      const button = screen.getByRole('button');
      button.focus();
      
      await user.keyboard(' ');
      expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    });

    it('has aria-hidden on SVG icons', () => {
      renderWithTheme(<ThemeToggle />);
      
      const button = screen.getByRole('button');
      const svg = button.querySelector('svg');
      
      expect(svg).toHaveAttribute('aria-hidden', 'true');
    });
  });

  describe('Button type', () => {
    it('has type="button" to prevent form submission', () => {
      renderWithTheme(<ThemeToggle />);
      
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('type', 'button');
    });
  });
});
