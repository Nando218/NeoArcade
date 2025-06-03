import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AdminPage from '../src/pages/AdminPage.jsx';
import React from 'react';
import { vi } from 'vitest';

vi.mock('../src/lib/auth', () => ({
  useAuth: () => ({ user: { id: 1, username: 'admin', role: 'admin', email: 'admin@arcade.com' }, isAuthenticated: true })
}));
vi.mock('../src/lib/scores', () => ({
  useScores: () => ({ scores: [], addScore: vi.fn(), deleteScore: vi.fn(), isLoading: false, error: null, fetchAllScores: vi.fn() })
}));
vi.mock('../src/lib/api', () => ({
  getAllUsers: vi.fn(async () => [{ id: 1, username: 'admin', email: 'admin@arcade.com', role: 'admin' }]),
  authAPI: {}
}));

describe('AdminPage', () => {
  it('renders admin page', () => {
    render(<MemoryRouter><AdminPage /></MemoryRouter>);
    // Asegura que se renderice el boton USUARIOS que es unico de la pagina de administrador
    expect(screen.getByRole('button', { name: /users/i })).toBeInTheDocument();
  });
});
