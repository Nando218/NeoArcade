import { render } from '@testing-library/react';
import { Switch } from '../src/components/ui/switch';
import React from 'react';

describe('Switch', () => {
  it('renders Switch component', () => {
    const { container } = render(<Switch />);
    expect(container).toBeInTheDocument();
  });
});
