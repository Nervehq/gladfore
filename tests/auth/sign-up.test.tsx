import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';

const signUpMock = vi.fn();
const pushMock = vi.fn();

vi.mock('../../lib/auth/context', () => ({
  useAuth: () => ({ signUp: signUpMock }),
}));

const toastMock = vi.fn();
vi.mock('../../hooks/use-toast', () => ({
  useToast: () => ({ toast: toastMock }),
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: pushMock, refresh: vi.fn() }),
  useParams: () => ({ id: 'test-id' }),
}));

import SignUpPage from '../../app/(auth)/sign-up/page';

describe('SignUpPage', () => {
  it('renders the form', () => {
    render(<SignUpPage />);
    expect(screen.getByRole('heading', { name: /sign up/i })).toBeInTheDocument();
    expect(screen.getByLabelText('Full name')).toBeInTheDocument();
  });

  it('calls signUp and navigates on success', async () => {
    signUpMock.mockResolvedValue({ error: null });

    render(<SignUpPage />);

    fireEvent.change(screen.getByLabelText('Full name'), { target: { value: 'Test' } });
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'n@e.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'pass' } });
    fireEvent.change(screen.getByLabelText('Phone (optional)'), { target: { value: '071234' } });
    fireEvent.change(screen.getByLabelText('Role'), { target: { value: 'farmer' } });

    fireEvent.click(screen.getByRole('button', { name: /create account/i }));

    await waitFor(() => expect(signUpMock).toHaveBeenCalled());
    expect(pushMock).toHaveBeenCalledWith('/');
  });

  it('shows error toast on failure', async () => {
    signUpMock.mockResolvedValue({ error: { message: 'bad' } });

    render(<SignUpPage />);

    fireEvent.change(screen.getByLabelText('Full name'), { target: { value: 'Test' } });
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'n@e.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'pass' } });
    fireEvent.click(screen.getByRole('button', { name: /create account/i }));

    await waitFor(() => expect(toastMock).toHaveBeenCalled());
  });
});
