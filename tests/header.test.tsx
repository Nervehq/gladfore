import React from 'react';
import { render, screen } from '@testing-library/react';
import { vi, expect } from 'vitest';
import { within } from '@testing-library/react';

vi.mock('../lib/auth/context', async () => {
  return {
    useAuth: () => ({ profile: { id: '1', role: 'farmer', full_name: 'Test Farmer' }, signOut: vi.fn() }),
  };
});

import { Header } from '../components/navigation/header';

describe('Header', () => {
  it('renders app name and farmer link', () => {
    render(<Header />);
    expect(screen.getByText('Gladfore')).toBeInTheDocument();
    expect(screen.getByText('Test Farmer')).toBeInTheDocument();
  });
});
