import { render, screen, fireEvent } from '@testing-library/react';
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

  it('shows login/register when not authenticated', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Navbar />
      </MemoryRouter>
    );
    expect(screen.getByText(/login/i)).toBeInTheDocument();
    expect(screen.getByText(/register/i)).toBeInTheDocument();
  });

  it('opens and closes mobile menu', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Navbar />
      </MemoryRouter>
    );
    // Selecciona el botón del menú móvil por su clase específica
    const menuButton = screen.getAllByRole('button').find(btn => btn.className.includes('md:hidden'));
    fireEvent.click(menuButton);
    // Selecciona el texto SCORES solo del menú móvil (span)
    const mobileScores = screen.getAllByText(/scores?/i).find(el => el.tagName === 'SPAN');
    expect(mobileScores).toBeInTheDocument();
    fireEvent.click(menuButton);
    // El menú debería cerrarse (el span ya no está en el DOM)
    expect(screen.queryAllByText(/scores?/i).find(el => el.tagName === 'SPAN')).toBeUndefined();
  });
  // Add more specific tests if Navbar has navigation links or branding
});
