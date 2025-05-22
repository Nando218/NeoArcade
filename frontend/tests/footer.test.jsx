import { render } from '@testing-library/react';
import { Footer } from '../src/components/layout/footer';
import React from 'react';

describe('Footer', () => {
  it('renders Footer component', () => {
    const { container } = render(<Footer />);
    expect(container).toBeInTheDocument();
  });
  // Add more specific tests if Footer has links or copyright text
});
