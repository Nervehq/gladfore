import '@testing-library/jest-dom';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
  useParams: () => ({ id: 'test-id' }),
}));

// Mock next/link to render children directly (default export)
vi.mock('next/link', () => ({
  default: ({ children }: any) => children,
}));
