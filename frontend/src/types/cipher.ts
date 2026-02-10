/**
 * Type definitions for the Gaileen Cipher API
 */

export interface CipherRequest {
  text: string;
  key: string;
}

export interface CipherResponse {
  result: string;
  success: boolean;
  error?: string;
}
