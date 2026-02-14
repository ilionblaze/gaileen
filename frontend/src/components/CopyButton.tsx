/**
 * CopyButton Component
 * Button that copies text to clipboard with visual feedback
 */

import React, { useState, useEffect } from 'react';
import { copyToClipboard } from '../utils/clipboard';

export interface CopyButtonProps {
  /** The text to copy to clipboard */
  text: string;
  /** Whether the button is disabled */
  disabled?: boolean;
  /** Optional label for the button */
  label?: string;
  /** Optional CSS class name */
  className?: string;
}

export function CopyButton({
  text,
  disabled = false,
  label = 'Copy',
  className = '',
}: CopyButtonProps): React.ReactElement {
  const [copyState, setCopyState] = useState<'idle' | 'success' | 'error'>('idle');

  // Reset copy state after 2 seconds
  useEffect(() => {
    if (copyState !== 'idle') {
      const timer = setTimeout(() => {
        setCopyState('idle');
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [copyState]);

  const handleCopy = async () => {
    if (disabled || !text) {
      return;
    }

    const success = await copyToClipboard(text);
    setCopyState(success ? 'success' : 'error');
  };

  const getButtonText = () => {
    switch (copyState) {
      case 'success':
        return '✓ Copied!';
      case 'error':
        return '✗ Failed';
      default:
        return label;
    }
  };

  const getButtonClass = () => {
    const baseClass = 'copy-button';
    const stateClass = copyState !== 'idle' ? `copy-button-${copyState}` : '';
    return `${baseClass} ${stateClass} ${className}`.trim();
  };

  return (
    <button
      onClick={handleCopy}
      disabled={disabled || !text}
      className={getButtonClass()}
      aria-label={`Copy ${label.toLowerCase()} to clipboard`}
      type="button"
    >
      {getButtonText()}
    </button>
  );
}
