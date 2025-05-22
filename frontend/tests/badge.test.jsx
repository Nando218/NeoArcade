import { render } from '@testing-library/react';
import { Badge } from '../src/components/ui/badge';
import React from 'react';

describe('Badge', () => {
  it('renders Badge with default variant', () => {
    const { container } = render(<Badge>Default</Badge>);
    expect(container.firstChild).toHaveClass('bg-primary');
  });

  it('renders Badge with secondary variant', () => {
    const { container } = render(<Badge variant="secondary">Secondary</Badge>);
    expect(container.firstChild).toHaveClass('bg-secondary');
  });

  it('renders Badge with destructive variant', () => {
    const { container } = render(<Badge variant="destructive">Destructive</Badge>);
    expect(container.firstChild).toHaveClass('bg-destructive');
  });

  it('renders Badge with outline variant', () => {
    const { container } = render(<Badge variant="outline">Outline</Badge>);
    expect(container.firstChild).toHaveClass('text-foreground');
  });
});
