/**
 * CipherForm Component
 * Container component that orchestrates the cipher UI
 */

import React, { useState } from 'react';
import { useCipher } from '../hooks/useCipher';
import { InputBox } from './InputBox';
import { KeyInput } from './KeyInput';

const DEFAULT_KEY = '7,9,8,0,5,0,7';

export function CipherForm(): React.ReactElement {
  const [encodeText, setEncodeText] = useState('');
  const [decodeText, setDecodeText] = useState('');
  const [key, setKey] = useState(DEFAULT_KEY);
  
  const { encode, decode, loading, error } = useCipher();

  const handleEncode = async () => {
    if (!encodeText.trim()) {
      return;
    }

    try {
      const result = await encode(encodeText, key);
      setDecodeText(result);
    } catch (err) {
      // Error is already handled by useCipher hook
      console.error('Encode error:', err);
    }
  };

  const handleDecode = async () => {
    if (!decodeText.trim()) {
      return;
    }

    try {
      const result = await decode(decodeText, key);
      setEncodeText(result);
    } catch (err) {
      // Error is already handled by useCipher hook
      console.error('Decode error:', err);
    }
  };

  return (
    <div className="cipher-form">
      <h1 className="title">Gaileen Cipher</h1>
      
      <div className="form-content">
        <KeyInput
          value={key}
          onChange={setKey}
          disabled={loading}
        />

        <div className="input-section">
          <InputBox
            label="Encode"
            value={encodeText}
            onChange={setEncodeText}
            placeholder="Enter text to encode..."
            disabled={loading}
            multiline={true}
            rows={6}
          />
          
          <button
            onClick={handleEncode}
            disabled={loading || !encodeText.trim()}
            className="action-button"
            aria-label="Encode text"
          >
            {loading ? 'Processing...' : 'Encode →'}
          </button>
        </div>

        <div className="input-section">
          <InputBox
            label="Decode"
            value={decodeText}
            onChange={setDecodeText}
            placeholder="Enter text to decode..."
            disabled={loading}
            multiline={true}
            rows={6}
          />
          
          <button
            onClick={handleDecode}
            disabled={loading || !decodeText.trim()}
            className="action-button"
            aria-label="Decode text"
          >
            {loading ? 'Processing...' : '← Decode'}
          </button>
        </div>

        {error && (
          <div className="error-message" role="alert">
            <strong>Error:</strong> {error}
          </div>
        )}
      </div>
    </div>
  );
}
