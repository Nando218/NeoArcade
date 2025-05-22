import { render, screen } from '@testing-library/react';
import { Button } from '../src/components/ui/button';
import React from 'react';

describe('Button', () => {
  it('renders children', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('applies variant and size classes', () => {
    const { container } = render(<Button variant="destructive" size="lg">Delete</Button>);
    expect(container.firstChild).toHaveClass('bg-destructive');
    expect(container.firstChild).toHaveClass('h-11');
  });

  it('is disabled when disabled prop is set', () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
