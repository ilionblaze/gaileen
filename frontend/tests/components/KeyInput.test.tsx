/**
 * Tests for KeyInput component
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { KeyInput } from '../../src/components/KeyInput';

describe('KeyInput', () => {
  it('renders with label and help text', () => {
    render(
      <KeyInput
        value="7,9,8,0,5,0,7"
        onChange={() => {}}
      />
    );

    expect(screen.getByLabelText('Cipher key')).toBeInTheDocument();
    expect(screen.getByText(/Enter comma-separated numbers/)).toBeInTheDocument();
  });

  it('accepts valid key format', () => {
    render(
      <KeyInput
        value="7,9,8,0,5,0,7"
        onChange={() => {}}
      />
    );

    // Should not show error for valid key
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('shows error for invalid key (out of range)', () => {
    render(
      <KeyInput
        value="7,26,8"
        onChange={() => {}}
      />
    );

    expect(screen.getByRole('alert')).toHaveTextContent(/must be between 0 and 25/);
  });

  it('shows error for invalid key (non-numeric)', () => {
    render(
      <KeyInput
        value="7,a,8"
        onChange={() => {}}
      />
    );

    expect(screen.getByRole('alert')).toHaveTextContent(/must contain only numbers/);
  });

  it('shows error for empty key', () => {
    render(
      <KeyInput
        value=""
        onChange={() => {}}
      />
    );

    expect(screen.getByRole('alert')).toHaveTextContent(/cannot be empty/);
  });

  it('calls onChange when value changes', async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();

    render(
      <KeyInput
        value="7,9,8"
        onChange={handleChange}
      />
    );

    const input = screen.getByLabelText('Cipher key');
    await user.clear(input);
    await user.type(input, '1,2,3');

    expect(handleChange).toHaveBeenCalled();
  });
});
