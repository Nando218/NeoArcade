import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { LoginForm } from '../src/components/auth/login-form';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';

vi.mock('../src/lib/auth', () => ({
  useAuth: () => ({ login: vi.fn(() => Promise.resolve(false)), isLoading: false })
}));
vi.mock('../src/hooks/use-toast', () => ({
  useToast: () => ({ toast: vi.fn() })
}));

describe('LoginForm', () => {
  it('renders form fields and button', () => {
    render(
      <MemoryRouter>
        <LoginForm />
      </MemoryRouter>
    );
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  it('shows error if fields are empty and submit is clicked', async () => {
    const { container } = render(
      <MemoryRouter>
        <LoginForm />
      </MemoryRouter>
    );
    const form = container.querySelector('form');
    fireEvent.submit(form);
    screen.debug(); // Debug output
    await waitFor(() => {
      expect(
        screen.getByText(
          (content) => content.toLowerCase().includes('please complete all fields'),
          { exact: false }
        )
      ).toBeInTheDocument();
    });
  });
});
