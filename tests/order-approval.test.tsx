// Ensure Supabase env variables exist for the client
process.env.NEXT_PUBLIC_SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost';
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'anon';

// ---------------------------------------------------------------------
// 🧱 Vitest Mocks (must come before imports)
// ---------------------------------------------------------------------
import { vi } from 'vitest';

// --- Mock Supabase client ---
vi.mock('@/lib/supabase/client', () => ({
  supabase: {
    from: () => ({
      select: () => Promise.resolve({ data: null, error: null }),
      maybeSingle: () => Promise.resolve({ data: null, error: null }),
      insert: () => ({
        select: () => Promise.resolve({ data: null, error: null }),
      }),
      update: () => ({
        select: () => Promise.resolve({ data: null, error: null }),
      }),
      eq: () => ({
        select: () => Promise.resolve({ data: null, error: null }),
      }),
      order: () => ({
        select: () => Promise.resolve({ data: null, error: null }),
      }),
      delete: () => ({
        select: () => Promise.resolve({ data: null, error: null }),
      }),
    }),
  },
}));

// --- Mock DB layer ---
const updateOrderMock = vi.fn();
const getOrderByIdMock = vi.fn();
const getPaymentsByOrderIdMock = vi.fn();
const getRepaymentSchedulesByOrderIdMock = vi.fn();

vi.mock('@/lib/db', async () => {
  return {
    updateOrder: (...args: any[]) => updateOrderMock(...args),
    getOrderById: (...args: any[]) => getOrderByIdMock(...args),
    getPaymentsByOrderId: (...args: any[]) =>
      getPaymentsByOrderIdMock(...args),
    getRepaymentSchedulesByOrderId: (...args: any[]) =>
      getRepaymentSchedulesByOrderIdMock(...args),
  };
});

// --- Mock Auth Context ---
vi.mock('@/lib/auth/context', () => ({
  useAuth: () => ({
    profile: { id: 'agent-1', role: 'agent', full_name: 'Agent One' },
  }),
}));

// --- Mock Next.js Router ---
const pushMock = vi.fn();
vi.mock('next/navigation', () => ({
  useParams: () => ({ id: 'order-1' }),
  useRouter: () => ({ push: pushMock, refresh: vi.fn() }),
}));

// ---------------------------------------------------------------------
// Imports
// ---------------------------------------------------------------------
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

// ---------------------------------------------------------------------
// Mock Data Setup
// ---------------------------------------------------------------------
const mockOrder = {
  id: 'order-1',
  farmer_id: 'farmer-1',
  agent_id: 'agent-1',
  total_cost: 100,
  down_payment_required: 20,
  down_payment_received: 0,
  remaining_balance: 80,
  status: 'pending',
  order_details: [],
  approved_by: null,
  approved_at: null,
  approval_comment: null,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

getOrderByIdMock.mockResolvedValue({ data: mockOrder, error: null });
getPaymentsByOrderIdMock.mockResolvedValue({ data: [], error: null });
getRepaymentSchedulesByOrderIdMock.mockResolvedValue({ data: [], error: null });

// ---------------------------------------------------------------------
// 🧪 Test Suite
// ---------------------------------------------------------------------
describe('Order approval flow', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    getOrderByIdMock.mockResolvedValue({ data: mockOrder, error: null });
    getPaymentsByOrderIdMock.mockResolvedValue({ data: [], error: null });
    getRepaymentSchedulesByOrderIdMock.mockResolvedValue({
      data: [],
      error: null,
    });

    // ✅ Fix: make sure updateOrder returns the correct shape
    updateOrderMock.mockResolvedValue({
      data: { ...mockOrder, status: 'approved' },
      error: null,
    });
  });

  it('calls updateOrder with approval audit fields on approve', async () => {
    const promptSpy = vi
      .spyOn(window, 'prompt')
      .mockImplementation(() => 'Looks good');

    const Page =
      (await import('../app/farmer/orders/[id]/page')).default;

    render(<Page />);

    await waitFor(() => expect(getOrderByIdMock).toHaveBeenCalled());

    const approveButton = await screen.findByRole('button', {
      name: /approve/i,
    });
    fireEvent.click(approveButton);

    await waitFor(() => expect(updateOrderMock).toHaveBeenCalled());

    const payload = updateOrderMock.mock.calls[0][1];
    expect(payload.status).toBe('approved');
    expect(payload.approved_by).toBe('agent-1');
    expect(payload.approval_comment).toBe('Looks good');

    promptSpy.mockRestore();
  });

  it('calls updateOrder with rejection audit fields on reject', async () => {
    const promptSpy = vi
      .spyOn(window, 'prompt')
      .mockImplementation(() => 'Not acceptable');

    const Page =
      (await import('../app/farmer/orders/[id]/page')).default;

    render(<Page />);

    await waitFor(() => expect(getOrderByIdMock).toHaveBeenCalled());

    const rejectButton = await screen.findByRole('button', { name: /reject/i });
    fireEvent.click(rejectButton);

    // ✅ make sure this also resolves properly
    updateOrderMock.mockResolvedValue({
      data: { ...mockOrder, status: 'rejected' },
      error: null,
    });

    await waitFor(() => expect(updateOrderMock).toHaveBeenCalled());

    const payload = updateOrderMock.mock.calls[0][1];
    expect(payload.status).toBe('rejected');
    expect(payload.approved_by).toBe('agent-1');
    expect(payload.approval_comment).toBe('Not acceptable');

    promptSpy.mockRestore();
  });
});
