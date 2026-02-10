/**
 * Tests for InputBox component
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { InputBox } from '../../src/components/InputBox';

describe('InputBox', () => {
  it('renders with correct label', () => {
    render(
      <InputBox
        label="Test Label"
        value=""
        onChange={() => {}}
      />
    );

    expect(screen.getByLabelText('Test Label')).toBeInTheDocument();
  });

  it('calls onChange when value changes', async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();

    render(
      <InputBox
        label="Test"
        value=""
        onChange={handleChange}
      />
    );

    const input = screen.getByLabelText('Test');
    await user.type(input, 'hello');

    expect(handleChange).toHaveBeenCalled();
  });

  it('respects disabled state', () => {
    render(
      <InputBox
        label="Test"
        value=""
        onChange={() => {}}
        disabled={true}
      />
    );

    const input = screen.getByLabelText('Test');
    expect(input).toBeDisabled();
  });

  it('renders as textarea when multiline is true', () => {
    render(
      <InputBox
        label="Test"
        value=""
        onChange={() => {}}
        multiline={true}
      />
    );

    const textarea = screen.getByLabelText('Test');
    expect(textarea.tagName).toBe('TEXTAREA');
  });

  it('renders as input when multiline is false', () => {
    render(
      <InputBox
        label="Test"
        value=""
        onChange={() => {}}
        multiline={false}
      />
    );

    const input = screen.getByLabelText('Test');
    expect(input.tagName).toBe('INPUT');
  });
});
