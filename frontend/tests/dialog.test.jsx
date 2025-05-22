import { render } from '@testing-library/react';
import { Dialog } from '../src/components/ui/dialog';
import React from 'react';

describe('Dialog', () => {
  it('renders Dialog component', () => {
    const { container } = render(<Dialog />);
    expect(container).toBeInTheDocument();
  });
});
