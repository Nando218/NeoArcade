import { render, screen } from '@testing-library/react';
import { Alert, AlertTitle, AlertDescription } from './alert';
import React from 'react';

describe('Alert', () => {
  it('renders Alert with default variant', () => {
    const { container } = render(<Alert>Default alert</Alert>);
    expect(container.firstChild).toHaveClass('bg-background');
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('renders Alert with destructive variant', () => {
    const { container } = render(<Alert variant="destructive">Destructive alert</Alert>);
    expect(container.firstChild).toHaveClass('text-destructive');
  });

  it('renders AlertTitle and AlertDescription', () => {
    render(
      <Alert>
        <AlertTitle>Title</AlertTitle>
        <AlertDescription>Description</AlertDescription>
      </Alert>
    );
    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();
  });
});
