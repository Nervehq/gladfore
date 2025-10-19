import React from 'react';
import { render, screen } from '@testing-library/react';
import { vi, expect } from 'vitest';

// We'll mock useRouter to capture pushes
const pushMock = vi.fn();
vi.mock('next/navigation', () => ({ useRouter: () => ({ push: pushMock }) }));

vi.mock('../lib/auth/context', async () => {
  return {
    useAuth: () => ({ profile: { id: '1', role: 'farmer', full_name: 'Test Farmer' }, loading: false }),
  };
});

describe('RequireRole', () => {
  it('renders children for matching role', async () => {
    const { RequireRole } = await import('../components/navigation/require-role');
    render(<RequireRole role="farmer"> <div>Secret</div> </RequireRole>);
    expect(screen.getByText('Secret')).toBeInTheDocument();
  });

  it('redirects non-matching role', async () => {
    // reset modules and replace the auth mock to simulate an agent profile
    vi.resetModules();
    vi.doMock('../lib/auth/context', () => ({
      useAuth: () => ({ profile: { id: '2', role: 'agent', full_name: 'Agent' }, loading: false }),
    }));

    // re-import the component under the new mock
    const { RequireRole } = await import('../components/navigation/require-role');

    render(<RequireRole role="farmer"> <div>Secret</div> </RequireRole>);
    expect(pushMock).toHaveBeenCalled();
  });
});
