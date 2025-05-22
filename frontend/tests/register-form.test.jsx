import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { RegisterForm } from '../src/components/auth/register-form';
import React from 'react';
import { vi } from 'vitest';

vi.mock('../src/lib/auth', () => ({
  useAuth: () => ({ register: vi.fn(() => Promise.resolve(false)), isLoading: false })
}));
vi.mock('../src/hooks/use-toast', () => ({
  useToast: () => ({ toast: vi.fn() })
}));

describe('RegisterForm', () => {
  it('renders form fields and button', () => {
    render(<RegisterForm />);
    expect(screen.getByLabelText(/user name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /register/i })).toBeInTheDocument();
  });

  it('shows error if fields are empty and submit is clicked', async () => {
    const { container } = render(<RegisterForm />);
    const form = container.querySelector('form');
    fireEvent.submit(form);
    await waitFor(() => {
      expect(
        screen.getByText(
          (content) => content.toLowerCase().includes('please complete all fields'),
          { exact: false }
        )
      ).toBeInTheDocument();
    });
  });

  it('shows error if password is too short', async () => {
    render(<RegisterForm />);
    fireEvent.change(screen.getByLabelText(/user name/i), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@email.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: '123' } });
    fireEvent.click(screen.getByRole('button', { name: /register/i }));
    expect(await screen.findByText(/password must be at least 6 characters/i, { exact: false })).toBeInTheDocument();
  });
});
