/**
 * Tests for SpeedControl Component
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SpeedControl } from '../../src/components/SpeedControl';

describe('SpeedControl', () => {
  describe('Rendering', () => {
    it('renders the speed control slider', () => {
      render(<SpeedControl speed={1} onChange={vi.fn()} />);
      
      const slider = screen.getByRole('slider', { name: /animation speed control/i });
      expect(slider).toBeDefined();
    });

    it('displays current speed label', () => {
      render(<SpeedControl speed={1} onChange={vi.fn()} />);
      
      expect(screen.getByText(/animation speed:/i)).toBeDefined();
      expect(screen.getByText(/normal/i)).toBeDefined();
    });

    it('displays current speed value', () => {
      render(<SpeedControl speed={1.5} onChange={vi.fn()} />);
      
      expect(screen.getByText('1.5x')).toBeDefined();
    });

    it('shows min and max labels', () => {
      render(<SpeedControl speed={1} onChange={vi.fn()} />);
      
      expect(screen.getByText('0.5x')).toBeDefined();
      expect(screen.getByText('3x')).toBeDefined();
    });
  });

  describe('Speed Labels', () => {
    it('shows "Slow" for speed <= 0.5', () => {
      render(<SpeedControl speed={0.5} onChange={vi.fn()} />);
      expect(screen.getByText(/slow/i)).toBeDefined();
    });

    it('shows "Normal" for speed <= 1', () => {
      render(<SpeedControl speed={1} onChange={vi.fn()} />);
      expect(screen.getByText(/normal/i)).toBeDefined();
    });

    it('shows "Fast" for speed <= 2', () => {
      render(<SpeedControl speed={2} onChange={vi.fn()} />);
      expect(screen.getByText(/fast/i)).toBeDefined();
    });

    it('shows "Very Fast" for speed > 2', () => {
      render(<SpeedControl speed={3} onChange={vi.fn()} />);
      expect(screen.getByText(/very fast/i)).toBeDefined();
    });
  });

  describe('Interaction', () => {
    it('calls onChange when slider value changes', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      
      render(<SpeedControl speed={1} onChange={onChange} />);
      
      const slider = screen.getByRole('slider');
      
      // Change slider value
      await user.click(slider);
      await user.keyboard('{ArrowRight}');
      
      expect(onChange).toHaveBeenCalled();
    });

    it('updates to new speed value', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      
      const { rerender } = render(<SpeedControl speed={1} onChange={onChange} />);
      
      const slider = screen.getByRole('slider') as HTMLInputElement;
      expect(slider.value).toBe('1');
      
      // Simulate parent updating the speed
      rerender(<SpeedControl speed={2} onChange={onChange} />);
      
      expect(slider.value).toBe('2');
    });
  });

  describe('Disabled State', () => {
    it('disables slider when disabled prop is true', () => {
      render(<SpeedControl speed={1} onChange={vi.fn()} disabled={true} />);
      
      const slider = screen.getByRole('slider');
      expect(slider).toHaveProperty('disabled', true);
    });

    it('enables slider when disabled prop is false', () => {
      render(<SpeedControl speed={1} onChange={vi.fn()} disabled={false} />);
      
      const slider = screen.getByRole('slider');
      expect(slider).toHaveProperty('disabled', false);
    });

    it('enables slider by default', () => {
      render(<SpeedControl speed={1} onChange={vi.fn()} />);
      
      const slider = screen.getByRole('slider');
      expect(slider).toHaveProperty('disabled', false);
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA attributes', () => {
      render(<SpeedControl speed={1.5} onChange={vi.fn()} />);
      
      const slider = screen.getByRole('slider');
      
      expect(slider.getAttribute('aria-label')).toBe('Animation speed control');
      expect(slider.getAttribute('aria-valuemin')).toBe('0.5');
      expect(slider.getAttribute('aria-valuemax')).toBe('3');
      expect(slider.getAttribute('aria-valuenow')).toBe('1.5');
      expect(slider.getAttribute('aria-valuetext')).toContain('1.5x speed');
    });

    it('updates aria-valuetext with speed label', () => {
      const { rerender } = render(<SpeedControl speed={0.5} onChange={vi.fn()} />);
      
      const slider = screen.getByRole('slider');
      expect(slider.getAttribute('aria-valuetext')).toContain('Slow');
      
      rerender(<SpeedControl speed={2} onChange={vi.fn()} />);
      expect(slider.getAttribute('aria-valuetext')).toContain('Fast');
    });

    it('has associated label', () => {
      render(<SpeedControl speed={1} onChange={vi.fn()} />);
      
      const label = screen.getByText(/animation speed:/i);
      const slider = screen.getByRole('slider');
      
      expect(label.getAttribute('for')).toBe('speed-slider');
      expect(slider.id).toBe('speed-slider');
    });
  });

  describe('Range Constraints', () => {
    it('has min value of 0.5', () => {
      render(<SpeedControl speed={1} onChange={vi.fn()} />);
      
      const slider = screen.getByRole('slider') as HTMLInputElement;
      expect(slider.min).toBe('0.5');
    });

    it('has max value of 3', () => {
      render(<SpeedControl speed={1} onChange={vi.fn()} />);
      
      const slider = screen.getByRole('slider') as HTMLInputElement;
      expect(slider.max).toBe('3');
    });

    it('has step of 0.1', () => {
      render(<SpeedControl speed={1} onChange={vi.fn()} />);
      
      const slider = screen.getByRole('slider') as HTMLInputElement;
      expect(slider.step).toBe('0.1');
    });
  });
});
