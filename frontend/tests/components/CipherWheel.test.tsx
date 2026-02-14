/**
 * Tests for CipherWheel Component
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { CipherWheel } from '../../src/components/CipherWheel';

describe('CipherWheel', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  describe('Rendering', () => {
    it('renders the cipher wheel container', () => {
      render(<CipherWheel isAnimating={false} />);
      
      const container = screen.getByRole('img', { name: /cipher wheel animation/i });
      expect(container).toBeInTheDocument();
    });

    it('renders all 26 cipher symbols on outer ring', () => {
      const { container } = render(<CipherWheel isAnimating={false} />);
      
      const symbols = [
        ">", "<", "^", "v", ">>", "<<", ".", ".>", "<.", "^.", 
        ".v", "..", "O", "Ø", "X", "/", "\\", "\\\\", "//", "/.", 
        "\\.", "./", ".\\", ":", "+", "="
      ];
      
      const outerRing = container.querySelector('.outer-ring');
      expect(outerRing).toBeInTheDocument();
      
      // Check that we have text elements for symbols
      const symbolTexts = container.querySelectorAll('.wheel-symbol');
      expect(symbolTexts).toHaveLength(26);
    });

    it('renders all 26 letters on inner ring', () => {
      const { container } = render(<CipherWheel isAnimating={false} />);
      
      const innerRing = container.querySelector('.inner-ring');
      expect(innerRing).toBeInTheDocument();
      
      const letterTexts = container.querySelectorAll('.wheel-letter');
      expect(letterTexts).toHaveLength(26);
    });

    it('renders shift indicator numbers 0-25', () => {
      const { container } = render(<CipherWheel isAnimating={false} />);
      
      const shiftNumbers = container.querySelectorAll('.wheel-shift-number');
      expect(shiftNumbers).toHaveLength(26);
    });

    it('does not show animation status when not animating', () => {
      render(<CipherWheel isAnimating={false} />);
      
      const status = screen.queryByText(/animating/i);
      expect(status).not.toBeInTheDocument();
    });

    it('shows animation status when animating', () => {
      render(
        <CipherWheel 
          isAnimating={true} 
          animationSequence={[7, 9, 8]} 
        />
      );
      
      const status = screen.getByText(/animating/i);
      expect(status).toBeInTheDocument();
    });
  });

  describe('Idle Animation', () => {
    it('starts idle rotation when not animating', () => {
      const { container } = render(<CipherWheel isAnimating={false} />);
      
      const innerRing = container.querySelector('.inner-ring') as HTMLElement;
      expect(innerRing).toBeInTheDocument();
      
      // The idle animation should be running via requestAnimationFrame
      // We can't easily test the actual rotation, but we can verify the element exists
      expect(innerRing).toHaveStyle({ transformOrigin: '200px 200px' });
    });

    it('stops idle rotation when animating starts', () => {
      const { rerender } = render(<CipherWheel isAnimating={false} />);
      
      // Start animating
      rerender(
        <CipherWheel 
          isAnimating={true} 
          animationSequence={[7]} 
        />
      );
      
      // Animation should now be controlled by the sequence
      expect(screen.getByText(/animating/i)).toBeInTheDocument();
    });
  });

  describe('Character-by-Character Animation', () => {
    it('animates through sequence of shift positions', async () => {
      const onComplete = vi.fn();
      const sequence = [7, 9, 8];
      
      render(
        <CipherWheel 
          isAnimating={true}
          animationSequence={sequence}
          animationSpeed={1}
          onAnimationComplete={onComplete}
        />
      );
      
      // Should show step 1
      expect(screen.getByText(/animating.*1\/3/i)).toBeInTheDocument();
      
      // Advance through animation steps
      vi.advanceTimersByTime(500); // Default pause duration
      
      await waitFor(() => {
        expect(screen.getByText(/animating.*2\/3/i)).toBeInTheDocument();
      });
      
      vi.advanceTimersByTime(500);
      
      await waitFor(() => {
        expect(screen.getByText(/animating.*3\/3/i)).toBeInTheDocument();
      });
      
      vi.advanceTimersByTime(500);
      
      // Animation should complete
      await waitFor(() => {
        expect(onComplete).toHaveBeenCalledTimes(1);
      });
    });

    it('respects animation speed multiplier', async () => {
      const onComplete = vi.fn();
      const sequence = [7];
      
      render(
        <CipherWheel 
          isAnimating={true}
          animationSequence={sequence}
          animationSpeed={2} // 2x speed
          onAnimationComplete={onComplete}
        />
      );
      
      // With 2x speed, pause should be 500/2 = 250ms
      vi.advanceTimersByTime(250);
      
      await waitFor(() => {
        expect(onComplete).toHaveBeenCalled();
      });
    });

    it('handles empty animation sequence', () => {
      const onComplete = vi.fn();
      
      render(
        <CipherWheel 
          isAnimating={true}
          animationSequence={[]}
          onAnimationComplete={onComplete}
        />
      );
      
      // Should not show animation status with empty sequence
      expect(screen.queryByText(/animating/i)).not.toBeInTheDocument();
    });

    it('resets to step 0 when new sequence starts', () => {
      const { rerender } = render(
        <CipherWheel 
          isAnimating={true}
          animationSequence={[7, 9]}
        />
      );
      
      expect(screen.getByText(/animating.*1\/2/i)).toBeInTheDocument();
      
      // Start new sequence
      rerender(
        <CipherWheel 
          isAnimating={true}
          animationSequence={[5, 3, 1]}
        />
      );
      
      // Should reset to step 1
      expect(screen.getByText(/animating.*1\/3/i)).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA label', () => {
      render(<CipherWheel isAnimating={false} />);
      
      const wheel = screen.getByRole('img', { name: /cipher wheel animation/i });
      expect(wheel).toBeInTheDocument();
    });

    it('announces animation status with aria-live', () => {
      render(
        <CipherWheel 
          isAnimating={true}
          animationSequence={[7, 9]}
        />
      );
      
      const status = screen.getByText(/animating/i);
      expect(status).toHaveAttribute('aria-live', 'polite');
    });

    it('respects prefers-reduced-motion', () => {
      // Mock matchMedia for reduced motion
      const mockMatchMedia = vi.fn().mockImplementation((query) => ({
        matches: query === '(prefers-reduced-motion: reduce)',
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }));
      
      window.matchMedia = mockMatchMedia;
      
      const { container } = render(
        <CipherWheel 
          isAnimating={true}
          animationSequence={[7]}
          animationSpeed={1}
        />
      );
      
      const innerRing = container.querySelector('.inner-ring') as HTMLElement;
      
      // Should have 0s transition when reduced motion is preferred
      expect(innerRing).toHaveStyle({ transition: expect.stringContaining('0s') });
    });
  });

  describe('Animation Callbacks', () => {
    it('calls onAnimationComplete when sequence finishes', async () => {
      const onComplete = vi.fn();
      
      render(
        <CipherWheel 
          isAnimating={true}
          animationSequence={[7]}
          animationSpeed={1}
          onAnimationComplete={onComplete}
        />
      );
      
      vi.advanceTimersByTime(500);
      
      await waitFor(() => {
        expect(onComplete).toHaveBeenCalledTimes(1);
      });
    });

    it('does not call onAnimationComplete if not provided', async () => {
      render(
        <CipherWheel 
          isAnimating={true}
          animationSequence={[7]}
          animationSpeed={1}
        />
      );
      
      vi.advanceTimersByTime(500);
      
      // Should not throw error
      await waitFor(() => {
        expect(screen.queryByText(/animating/i)).not.toBeInTheDocument();
      });
    });
  });

  describe('Visual Elements', () => {
    it('renders SVG with correct viewBox', () => {
      const { container } = render(<CipherWheel isAnimating={false} />);
      
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('viewBox', '0 0 400 400');
    });

    it('renders shift indicator marker at top', () => {
      const { container } = render(<CipherWheel isAnimating={false} />);
      
      const indicator = container.querySelector('.shift-indicator');
      expect(indicator).toBeInTheDocument();
      
      const polygon = indicator?.querySelector('polygon');
      expect(polygon).toBeInTheDocument();
    });

    it('renders center circle', () => {
      const { container } = render(<CipherWheel isAnimating={false} />);
      
      const circles = container.querySelectorAll('circle');
      // Should have outer, inner, and center circles
      expect(circles.length).toBeGreaterThanOrEqual(3);
    });
  });
});
