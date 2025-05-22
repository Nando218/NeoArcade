import { render, screen } from '@testing-library/react';
import { Input } from './input';
import React from 'react';

describe('Input', () => {
  it('renders input element', () => {
    render(<Input placeholder="Type here" />);
    expect(screen.getByPlaceholderText('Type here')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<Input className="custom-class" />);
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('is disabled when disabled prop is set', () => {
    render(<Input disabled />);
    expect(screen.getByRole('textbox')).toBeDisabled();
  });
});
