import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';

const signInMock = vi.fn();
const pushMock = vi.fn();

// Mock useAuth and expose signInMock
vi.mock('../../lib/auth/context', () => ({
  useAuth: () => ({ signIn: signInMock }),
}));

const toastMock = vi.fn();
vi.mock('../../hooks/use-toast', () => ({
  useToast: () => ({ toast: toastMock }),
}));

// Override router for assertions in these tests
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: pushMock, refresh: vi.fn() }),
  useParams: () => ({ id: 'test-id' }),
}));

import SignInPage from '../../app/(auth)/sign-in/page';

describe('SignInPage', () => {
  it('renders the form', () => {
    render(<SignInPage />);
    expect(screen.getByRole('heading', { name: /sign in/i })).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
  });

  it('calls signIn and navigates on success', async () => {
  signInMock.mockResolvedValue({ error: null });

    render(<SignInPage />);

    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'a@b.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'pass' } });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => expect(signInMock).toHaveBeenCalledWith('a@b.com', 'pass'));
    // router push called to '/'
    expect(pushMock).toHaveBeenCalledWith('/');
  });

  it('shows error toast on failure', async () => {
    signInMock.mockResolvedValue({ error: { message: 'bad' } });

    render(<SignInPage />);

    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'a@b.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'pass' } });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => expect(toastMock).toHaveBeenCalled());
  });
});
