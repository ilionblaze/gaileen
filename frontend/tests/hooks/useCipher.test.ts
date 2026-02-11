/**
 * Tests for useCipher hook
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useCipher } from '../../src/hooks/useCipher';
import * as api from '../../src/services/api';

// Mock the API
vi.mock('../../src/services/api');

describe('useCipher', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('initializes with correct default values', () => {
    const { result } = renderHook(() => useCipher());

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(typeof result.current.encode).toBe('function');
    expect(typeof result.current.decode).toBe('function');
  });

  it('encode sets loading state and returns result on success', async () => {
    const mockResponse = { result: 'encoded', success: true };
    vi.spyOn(api.cipherApi, 'encode').mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useCipher());

    const promise = result.current.encode('hello', '7,9,8');

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    const encodedResult = await promise;
    expect(encodedResult).toBe('encoded');
    expect(result.current.error).toBe(null);
  });

  it('encode sets error state on failure', async () => {
    const mockResponse = { result: '', success: false, error: 'Invalid key' };
    vi.spyOn(api.cipherApi, 'encode').mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useCipher());

    await expect(result.current.encode('hello', 'invalid')).rejects.toThrow('Invalid key');

    await waitFor(() => {
      expect(result.current.error).toBe('Invalid key');
    });
  });

  it('decode sets loading state and returns result on success', async () => {
    const mockResponse = { result: 'decoded', success: true };
    vi.spyOn(api.cipherApi, 'decode').mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useCipher());

    const promise = result.current.decode('encoded', '7,9,8');

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    const decodedResult = await promise;
    expect(decodedResult).toBe('decoded');
    expect(result.current.error).toBe(null);
  });

  it('decode sets error state on failure', async () => {
    const mockResponse = { result: '', success: false, error: 'Decoding failed' };
    vi.spyOn(api.cipherApi, 'decode').mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useCipher());

    await expect(result.current.decode('invalid', '7,9,8')).rejects.toThrow('Decoding failed');

    await waitFor(() => {
      expect(result.current.error).toBe('Decoding failed');
    });
  });
});
