/**
 * Tests for clipboard utility functions
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { copyToClipboard, isCopySupported } from '../../src/utils/clipboard';

describe('clipboard utilities', () => {
  describe('copyToClipboard', () => {
    beforeEach(() => {
      // Reset mocks before each test
      vi.clearAllMocks();
    });

    afterEach(() => {
      // Clean up any DOM modifications
      document.body.innerHTML = '';
    });

    it('should return false for empty text', async () => {
      const result = await copyToClipboard('');
      expect(result).toBe(false);
    });

    it('should use Clipboard API when available', async () => {
      const mockWriteText = vi.fn().mockResolvedValue(undefined);
      Object.assign(navigator, {
        clipboard: {
          writeText: mockWriteText,
        },
      });

      const result = await copyToClipboard('test text');

      expect(mockWriteText).toHaveBeenCalledWith('test text');
      expect(result).toBe(true);
    });

    it('should handle Clipboard API errors and fallback', async () => {
      const mockWriteText = vi.fn().mockRejectedValue(new Error('Permission denied'));
      Object.assign(navigator, {
        clipboard: {
          writeText: mockWriteText,
        },
      });

      // Mock execCommand for fallback
      const mockExecCommand = vi.fn().mockReturnValue(true);
      document.execCommand = mockExecCommand;

      const result = await copyToClipboard('test text');

      expect(mockWriteText).toHaveBeenCalledWith('test text');
      expect(mockExecCommand).toHaveBeenCalledWith('copy');
      expect(result).toBe(true);
    });

    it('should use fallback when Clipboard API is not available', async () => {
      // Remove clipboard API
      Object.assign(navigator, {
        clipboard: undefined,
      });

      // Mock execCommand
      const mockExecCommand = vi.fn().mockReturnValue(true);
      document.execCommand = mockExecCommand;

      const result = await copyToClipboard('fallback text');

      expect(mockExecCommand).toHaveBeenCalledWith('copy');
      expect(result).toBe(true);
    });

    it('should create and remove textarea element in fallback', async () => {
      Object.assign(navigator, {
        clipboard: undefined,
      });

      const mockExecCommand = vi.fn().mockReturnValue(true);
      document.execCommand = mockExecCommand;

      const initialChildCount = document.body.children.length;

      await copyToClipboard('test text');

      // Textarea should be removed after copy
      expect(document.body.children.length).toBe(initialChildCount);
    });

    it('should return false when both methods fail', async () => {
      Object.assign(navigator, {
        clipboard: undefined,
      });

      const mockExecCommand = vi.fn().mockReturnValue(false);
      document.execCommand = mockExecCommand;

      const result = await copyToClipboard('test text');

      expect(result).toBe(false);
    });

    it('should handle fallback exceptions', async () => {
      Object.assign(navigator, {
        clipboard: undefined,
      });

      const mockExecCommand = vi.fn().mockImplementation(() => {
        throw new Error('execCommand failed');
      });
      document.execCommand = mockExecCommand;

      const result = await copyToClipboard('test text');

      expect(result).toBe(false);
    });
  });

  describe('isCopySupported', () => {
    it('should return true when Clipboard API is available', () => {
      Object.assign(navigator, {
        clipboard: {
          writeText: vi.fn(),
        },
      });

      expect(isCopySupported()).toBe(true);
    });

    it('should return true when execCommand is supported', () => {
      Object.assign(navigator, {
        clipboard: undefined,
      });

      document.queryCommandSupported = vi.fn().mockReturnValue(true);

      expect(isCopySupported()).toBe(true);
    });

    it('should return false when no copy method is available', () => {
      Object.assign(navigator, {
        clipboard: undefined,
      });

      document.queryCommandSupported = vi.fn().mockReturnValue(false);

      expect(isCopySupported()).toBe(false);
    });
  });
});
