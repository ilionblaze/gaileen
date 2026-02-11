/**
 * KeyInput Component
 * Specialized component for cipher key input with validation
 */

import React, { useMemo } from 'react';

export interface KeyInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

/**
 * Validates a cipher key string
 * @param key - Comma-separated key string
 * @returns Error message if invalid, null if valid
 */
function validateKey(key: string): string | null {
  if (!key.trim()) {
    return 'Key cannot be empty';
  }

  const parts = key.split(',').map(s => s.trim());
  
  for (const part of parts) {
    if (part === '') {
      return 'Key cannot contain empty values';
    }
    
    const num = parseInt(part, 10);
    
    if (isNaN(num)) {
      return 'Key must contain only numbers separated by commas';
    }
    
    if (num < 0 || num > 25) {
      return 'Each key value must be between 0 and 25';
    }
  }

  return null;
}

export function KeyInput({
  value,
  onChange,
  disabled = false,
}: KeyInputProps): React.ReactElement {
  const validationError = useMemo(() => validateKey(value), [value]);
  const isValid = validationError === null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="key-input">
      <label htmlFor="cipher-key" className="input-label">
        Key
      </label>
      <input
        id="cipher-key"
        type="text"
        value={value}
        onChange={handleChange}
        disabled={disabled}
        className={`input-field ${!isValid ? 'input-error' : ''}`}
        aria-label="Cipher key"
        aria-invalid={!isValid}
        aria-describedby="key-help key-error"
      />
      <div id="key-help" className="help-text">
        Enter comma-separated numbers (0-25). Example: 7,9,8,0,5,0,7
      </div>
      {!isValid && (
        <div id="key-error" className="error-text" role="alert">
          {validationError}
        </div>
      )}
    </div>
  );
}
