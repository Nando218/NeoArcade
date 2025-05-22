import { render } from '@testing-library/react';
import { Sheet } from '../src/components/ui/sheet';
import React from 'react';

describe('Sheet', () => {
  it('renders Sheet component', () => {
    const { container } = render(<Sheet />);
    expect(container).toBeInTheDocument();
  });
});
