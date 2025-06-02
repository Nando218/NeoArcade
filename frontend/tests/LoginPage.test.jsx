import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import LoginPage from '../src/pages/LoginPage.jsx';
import { vi } from 'vitest';

vi.mock('../src/lib/auth', () => ({
  useAuth: () => ({ isAuthenticated: false, login: vi.fn(async () => true), isLoading: false }),
}));

describe('LoginPage', () => {
  it('renders login page', () => {
    render(<MemoryRouter><LoginPage /></MemoryRouter>);
    expect(screen.getByRole('heading', { name: /login/i })).toBeInTheDocument();
  });
});
