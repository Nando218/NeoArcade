import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import RegisterPage from '../src/pages/RegisterPage.jsx';
import { vi } from 'vitest';

vi.mock('../src/lib/auth', () => ({
  useAuth: () => ({ isAuthenticated: false, register: vi.fn(async () => true), isLoading: false }),
}));

describe('RegisterPage', () => {
  it('renders register page', () => {
    render(<MemoryRouter><RegisterPage /></MemoryRouter>);
    expect(screen.getByRole('heading', { name: /create account/i })).toBeInTheDocument();
  });
});
