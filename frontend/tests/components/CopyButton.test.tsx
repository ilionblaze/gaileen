/**
 * Tests for CopyButton component
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CopyButton } from '../../src/components/CopyButton';
import * as clipboardUtils from '../../src/utils/clipboard';

// Mock the clipboard utilities
vi.mock('../../src/utils/clipboard', () => ({
  copyToClipboard: vi.fn(),
  isCopySupported: vi.fn(() => true),
}));

describe('CopyButton', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it('should render with default label', () => {
    render(<CopyButton text="test text" />);
    
    const button = screen.getByRole('button', { name: /copy/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Copy');
  });

  it('should render with custom label', () => {
    render(<CopyButton text="test text" label="Copy Text" />);
    
    const button = screen.getByRole('button', { name: /copy text/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Copy Text');
  });

  it('should be disabled when disabled prop is true', () => {
    render(<CopyButton text="test text" disabled={true} />);
    
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('should be disabled when text is empty', () => {
    render(<CopyButton text="" />);
    
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('should call copyToClipboard when clicked', async () => {
    const mockCopyToClipboard = vi.mocked(clipboardUtils.copyToClipboard);
    mockCopyToClipboard.mockResolvedValue(true);

    render(<CopyButton text="test text" />);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);

    // Use real timers for async operations
    vi.useRealTimers();
    await waitFor(() => {
      expect(mockCopyToClipboard).toHaveBeenCalledWith('test text');
    });
    vi.useFakeTimers();
  });

  it('should show success state after successful copy', async () => {
    const mockCopyToClipboard = vi.mocked(clipboardUtils.copyToClipboard);
    mockCopyToClipboard.mockResolvedValue(true);

    render(<CopyButton text="test text" />);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);

    // Use real timers for async operations
    vi.useRealTimers();
    await waitFor(() => {
      expect(button).toHaveTextContent('✓ Copied!');
      expect(button).toHaveClass('copy-button-success');
    });
    vi.useFakeTimers();
  });

  it('should show error state after failed copy', async () => {
    const mockCopyToClipboard = vi.mocked(clipboardUtils.copyToClipboard);
    mockCopyToClipboard.mockResolvedValue(false);

    render(<CopyButton text="test text" />);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);

    // Use real timers for async operations
    vi.useRealTimers();
    await waitFor(() => {
      expect(button).toHaveTextContent('✗ Failed');
      expect(button).toHaveClass('copy-button-error');
    });
    vi.useFakeTimers();
  });

  it('should reset to idle state after 2 seconds', async () => {
    const mockCopyToClipboard = vi.mocked(clipboardUtils.copyToClipboard);
    mockCopyToClipboard.mockResolvedValue(true);

    render(<CopyButton text="test text" />);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);

    // Use real timers for async operations
    vi.useRealTimers();
    
    // Wait for success state
    await waitFor(() => {
      expect(button).toHaveTextContent('✓ Copied!');
    });

    // Wait for the 2 second timeout
    await new Promise(resolve => setTimeout(resolve, 2100));

    // Should reset to idle state
    expect(button).toHaveTextContent('Copy');
    expect(button).not.toHaveClass('copy-button-success');
    
    vi.useFakeTimers();
  });

  it('should not call copyToClipboard when disabled', async () => {
    const mockCopyToClipboard = vi.mocked(clipboardUtils.copyToClipboard);
    mockCopyToClipboard.mockResolvedValue(true);

    render(<CopyButton text="test text" disabled={true} />);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(mockCopyToClipboard).not.toHaveBeenCalled();
  });

  it('should not call copyToClipboard when text is empty', async () => {
    const mockCopyToClipboard = vi.mocked(clipboardUtils.copyToClipboard);
    mockCopyToClipboard.mockResolvedValue(true);

    render(<CopyButton text="" />);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(mockCopyToClipboard).not.toHaveBeenCalled();
  });

  it('should apply custom className', () => {
    render(<CopyButton text="test text" className="custom-class" />);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('copy-button');
    expect(button).toHaveClass('custom-class');
  });

  it('should have proper ARIA label', () => {
    render(<CopyButton text="test text" label="Encode" />);
    
    const button = screen.getByRole('button', { name: 'Copy encode to clipboard' });
    expect(button).toBeInTheDocument();
  });

  it('should have type="button" to prevent form submission', () => {
    render(<CopyButton text="test text" />);
    
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('type', 'button');
  });

  it('should handle multiple rapid clicks correctly', async () => {
    const mockCopyToClipboard = vi.mocked(clipboardUtils.copyToClipboard);
    mockCopyToClipboard.mockResolvedValue(true);

    render(<CopyButton text="test text" />);
    
    const button = screen.getByRole('button');
    
    // Use real timers for async operations
    vi.useRealTimers();
    
    // Click multiple times rapidly
    fireEvent.click(button);
    fireEvent.click(button);
    fireEvent.click(button);

    // Should only call once per click
    await waitFor(() => {
      expect(mockCopyToClipboard).toHaveBeenCalledTimes(3);
    });
    
    vi.useFakeTimers();
  });

  it('should clean up timer on unmount', async () => {
    const mockCopyToClipboard = vi.mocked(clipboardUtils.copyToClipboard);
    mockCopyToClipboard.mockResolvedValue(true);

    const { unmount } = render(<CopyButton text="test text" />);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);

    // Use real timers for async operations
    vi.useRealTimers();
    
    await waitFor(() => {
      expect(button).toHaveTextContent('✓ Copied!');
    });

    // Unmount before timer completes
    unmount();

    // Should not cause any errors
    vi.useFakeTimers();
  });
});
