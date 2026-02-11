/**
 * Custom hook for cipher operations
 * Encapsulates API communication logic and manages loading/error states
 */

import { useState, useCallback } from 'react';
import { cipherApi } from '../services/api';

interface UseCipherReturn {
  encode: (text: string, key: string) => Promise<string>;
  decode: (text: string, key: string) => Promise<string>;
  loading: boolean;
  error: string | null;
}

export function useCipher(): UseCipherReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const encode = useCallback(async (text: string, key: string): Promise<string> => {
    setLoading(true);
    setError(null);

    try {
      const response = await cipherApi.encode(text, key);
      
      if (!response.success) {
        const errorMessage = response.error || 'Encoding failed';
        setError(errorMessage);
        throw new Error(errorMessage);
      }

      return response.result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const decode = useCallback(async (text: string, key: string): Promise<string> => {
    setLoading(true);
    setError(null);

    try {
      const response = await cipherApi.decode(text, key);
      
      if (!response.success) {
        const errorMessage = response.error || 'Decoding failed';
        setError(errorMessage);
        throw new Error(errorMessage);
      }

      return response.result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    encode,
    decode,
    loading,
    error,
  };
}
