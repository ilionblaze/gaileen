/**
 * API service layer for communicating with the Gaileen Cipher backend
 */

import type { CipherRequest, CipherResponse } from '../types/cipher';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

/**
 * Encodes plaintext using the Gaileen Cipher
 * @param text - The plaintext to encode
 * @param key - Comma-separated cipher key (e.g., "7,9,8,0,5,0,7")
 * @returns Promise with the encoded result
 */
async function encode(text: string, key: string): Promise<CipherResponse> {
  const response = await fetch(`${API_BASE_URL}/api/encode`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text, key } as CipherRequest),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Network error' }));
    return {
      result: '',
      success: false,
      error: errorData.error || `HTTP error ${response.status}`,
    };
  }

  return response.json();
}

/**
 * Decodes cipher text using the Gaileen Cipher
 * @param text - The cipher text to decode
 * @param key - Comma-separated cipher key (e.g., "7,9,8,0,5,0,7")
 * @returns Promise with the decoded result
 */
async function decode(text: string, key: string): Promise<CipherResponse> {
  const response = await fetch(`${API_BASE_URL}/api/decode`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text, key } as CipherRequest),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Network error' }));
    return {
      result: '',
      success: false,
      error: errorData.error || `HTTP error ${response.status}`,
    };
  }

  return response.json();
}

export const cipherApi = {
  encode,
  decode,
};
