import { render } from '@testing-library/react';
import { Navbar } from '../src/components/layout/navbar';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

describe('Navbar', () => {
  it('renders Navbar component', () => {
    const { container } = render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );
    expect(container).toBeInTheDocument();
  });
  // Add more specific tests if Navbar has navigation links or branding
});
