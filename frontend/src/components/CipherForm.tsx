/**
 * CipherForm Component
 * Container component that orchestrates the cipher UI
 */

import React, { useState } from 'react';
import { useCipher } from '../hooks/useCipher';
import { InputBox } from './InputBox';
import { KeyInput } from './KeyInput';
import { CopyButton } from './CopyButton';
import { ThemeToggle } from './ThemeToggle';
import { CipherWheel } from './CipherWheel';
import { SpeedControl } from './SpeedControl';

const DEFAULT_KEY = '7,9,8,0,5,0,7';

export function CipherForm(): React.ReactElement {
  const [encodeText, setEncodeText] = useState('');
  const [decodeText, setDecodeText] = useState('');
  const [key, setKey] = useState(DEFAULT_KEY);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationSequence, setAnimationSequence] = useState<number[]>([]);
  const [animationSpeed, setAnimationSpeed] = useState(1);
  
  const { encode, decode, loading, error } = useCipher();

  // Parse key string to array of numbers
  const parseKey = (keyString: string): number[] => {
    try {
      return keyString.split(',').map(num => parseInt(num.trim(), 10));
    } catch {
      return [7, 9, 8, 0, 5, 0, 7]; // Default key
    }
  };

  // Calculate animation sequence based on text and key
  const calculateAnimationSequence = (text: string, keyArray: number[], isDecoding: boolean = false): number[] => {
    const sequence: number[] = [];
    let keyIndex = 0;

    if (isDecoding) {
      // For decoding, count cipher symbols (split by spaces)
      const symbols = text.trim().split(/\s+/);
      for (const symbol of symbols) {
        if (symbol) {
          sequence.push(keyArray[keyIndex]);
          keyIndex = (keyIndex + 1) % keyArray.length;
        }
      }
    } else {
      // For encoding, count alphabetic characters
      for (const char of text.toLowerCase()) {
        if (char >= 'a' && char <= 'z') {
          sequence.push(keyArray[keyIndex]);
          keyIndex = (keyIndex + 1) % keyArray.length;
        }
      }
    }

    return sequence;
  };

  const handleEncode = async () => {
    if (!encodeText.trim()) {
      return;
    }

    try {
      // Start animation
      const keyArray = parseKey(key);
      const sequence = calculateAnimationSequence(encodeText, keyArray);
      setAnimationSequence(sequence);
      setIsAnimating(true);

      // Wait for animation to complete before showing result
      // The animation will call onAnimationComplete
    } catch (err) {
      // Error is already handled by useCipher hook
      console.error('Encode error:', err);
      setIsAnimating(false);
    }
  };

  const handleDecode = async () => {
    if (!decodeText.trim()) {
      return;
    }

    try {
      // Start animation
      const keyArray = parseKey(key);
      const sequence = calculateAnimationSequence(decodeText, keyArray, true); // Pass true for decoding
      setAnimationSequence(sequence);
      setIsAnimating(true);

      // Wait for animation to complete before showing result
      // The animation will call onAnimationComplete
    } catch (err) {
      // Error is already handled by useCipher hook
      console.error('Decode error:', err);
      setIsAnimating(false);
    }
  };

  const handleAnimationComplete = async () => {
    // Animation is done, now perform the actual encode/decode
    try {
      if (encodeText.trim() && animationSequence.length > 0) {
        const result = await encode(encodeText, key);
        setDecodeText(result);
      } else if (decodeText.trim() && animationSequence.length > 0) {
        const result = await decode(decodeText, key);
        setEncodeText(result);
      }
    } catch (err) {
      console.error('Cipher operation error:', err);
    } finally {
      setIsAnimating(false);
      setAnimationSequence([]);
    }
  };

  return (
    <div className="cipher-form">
      <div className="cipher-form-header">
        <h1 className="title">Gaileen Cipher</h1>
        <ThemeToggle />
      </div>
      
      <div className="form-content">
        <KeyInput
          value={key}
          onChange={setKey}
          disabled={loading || isAnimating}
        />

        <div className="cipher-layout">
          {/* Left column - Encode */}
          <div className="cipher-column">
            <div className="input-section">
              <InputBox
                label="Encode"
                value={encodeText}
                onChange={setEncodeText}
                placeholder="Enter text to encode..."
                disabled={loading || isAnimating}
                multiline={true}
                rows={6}
              />
              
              <div className="input-actions">
                <button
                  onClick={handleEncode}
                  disabled={loading || isAnimating || !encodeText.trim()}
                  className="action-button"
                  aria-label="Encode text"
                >
                  {isAnimating ? 'Animating...' : loading ? 'Processing...' : 'Encode →'}
                </button>
                <CopyButton
                  text={encodeText}
                  disabled={loading || isAnimating || !encodeText.trim()}
                  label="Copy"
                />
              </div>
            </div>
          </div>

          {/* Center column - Cipher Wheel */}
          <div className="cipher-column cipher-wheel-column">
            <CipherWheel
              isAnimating={isAnimating}
              animationSequence={animationSequence}
              animationSpeed={animationSpeed}
              onAnimationComplete={handleAnimationComplete}
            />
            <SpeedControl
              speed={animationSpeed}
              onChange={setAnimationSpeed}
              disabled={isAnimating}
            />
          </div>

          {/* Right column - Decode */}
          <div className="cipher-column">
            <div className="input-section">
              <InputBox
                label="Decode"
                value={decodeText}
                onChange={setDecodeText}
                placeholder="Enter text to decode..."
                disabled={loading || isAnimating}
                multiline={true}
                rows={6}
              />
              
              <div className="input-actions">
                <button
                  onClick={handleDecode}
                  disabled={loading || isAnimating || !decodeText.trim()}
                  className="action-button"
                  aria-label="Decode text"
                >
                  {isAnimating ? 'Animating...' : loading ? 'Processing...' : '← Decode'}
                </button>
                <CopyButton
                  text={decodeText}
                  disabled={loading || isAnimating || !decodeText.trim()}
                  label="Copy"
                />
              </div>
            </div>
          </div>
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
