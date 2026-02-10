/**
 * InputBox Component
 * Presentational component for text input with proper accessibility
 */

import React from 'react';

export interface InputBoxProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  multiline?: boolean;
  rows?: number;
}

export function InputBox({
  label,
  value,
  onChange,
  placeholder = '',
  disabled = false,
  multiline = true,
  rows = 4,
}: InputBoxProps): React.ReactElement {
  const id = `input-${label.toLowerCase().replace(/\s+/g, '-')}`;

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="input-box">
      <label htmlFor={id} className="input-label">
        {label}
      </label>
      {multiline ? (
        <textarea
          id={id}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
          rows={rows}
          className="input-field"
          aria-label={label}
        />
      ) : (
        <input
          id={id}
          type="text"
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
          className="input-field"
          aria-label={label}
        />
      )}
    </div>
  );
}
