import { supabase } from './supabase/client';
import { Database } from './supabase/types';

// Use an internal any-typed alias to call the Supabase client.
// This centralizes the only 'any' usage to this file while keeping
// the function signatures strongly typed for callers.
const sb: any = supabase;

export async function createOrder(payload: Database['public']['Tables']['orders']['Insert']) {
  const res = await sb.from('orders').insert([payload]).select().maybeSingle();
  return res as { data: Database['public']['Tables']['orders']['Row'] | null; error: any };
}

export async function recordPayment(payload: Database['public']['Tables']['payments']['Insert']) {
  const res = await sb.from('payments').insert([payload]).select();
  return res as { data: Database['public']['Tables']['payments']['Row'][] | null; error: any };
}

// Fetch repayment schedules for an order
export async function getRepaymentSchedulesByOrderId(orderId: string) {
  const res = await sb
    .from('repayment_schedules')
    .select('*')
    .eq('order_id', orderId)
    .order('installment_number', { ascending: true });
  return res as { data: Database['public']['Tables']['repayment_schedules']['Row'][] | null; error: any };
}

// Record a payment that may optionally be linked to a repayment schedule item.
// If repayment_schedule_id is provided, update that schedule (amount_paid, status).
// Then update the order remaining_balance and status accordingly.
export async function recordPaymentLinked(
  payload: Database['public']['Tables']['payments']['Insert'] & { repayment_schedule_id?: string | null }
) {
  // insert payment
  const insertRes = await sb.from('payments').insert([payload]).select();
  const paymentData = (insertRes as any).data?.[0] ?? null;
  const paymentError = (insertRes as any).error ?? null;

  if (paymentError) return { payment: null, schedule: null, order: null, error: paymentError };

  let updatedSchedule: Database['public']['Tables']['repayment_schedules']['Row'] | null = null;

  if (payload.repayment_schedule_id) {
    // fetch existing schedule
    const schedRes = await sb.from('repayment_schedules').select('*').eq('id', payload.repayment_schedule_id).maybeSingle();
    const sched = (schedRes as any).data ?? null;
    if (sched) {
      const newAmountPaid = Number(sched.amount_paid || 0) + Number(payload.amount);
      const newStatus = newAmountPaid >= Number(sched.amount_due) ? 'paid' : (newAmountPaid > 0 ? 'partial' : sched.status);
      const upd = await sb.from('repayment_schedules').update({ amount_paid: newAmountPaid, status: newStatus }).eq('id', payload.repayment_schedule_id).select().maybeSingle();
      updatedSchedule = (upd as any).data ?? null;
    }
  }

  // Update order remaining balance and possibly status
  let updatedOrder: Database['public']['Tables']['orders']['Row'] | null = null;
  if (payload.order_id) {
    const ordRes = await sb.from('orders').select('*').eq('id', payload.order_id).maybeSingle();
    const ord = (ordRes as any).data ?? null;
    if (ord) {
      const newRemaining = Number(ord.remaining_balance || 0) - Number(payload.amount);
      const newStatus = newRemaining <= 0 ? 'approved' === ord.status ? 'approved' : ord.status : ord.status;
      const updOrd = await sb.from('orders').update({ remaining_balance: newRemaining, status: newStatus }).eq('id', payload.order_id).select().maybeSingle();
      updatedOrder = (updOrd as any).data ?? null;
    }
  }

  return { payment: paymentData, schedule: updatedSchedule, order: updatedOrder, error: null };
}

export async function createRepaymentSchedules(payloads: Database['public']['Tables']['repayment_schedules']['Insert'][] ) {
  const res = await sb.from('repayment_schedules').insert(payloads).select();
  return res as { data: Database['public']['Tables']['repayment_schedules']['Row'][] | null; error: any };
}

export async function getOrderById(id: string) {
  const res = await sb.from('orders').select('*').eq('id', id).maybeSingle();
  return res as { data: Database['public']['Tables']['orders']['Row'] | null; error: any };
}

export async function getPaymentsByOrderId(orderId: string) {
  const res = await sb.from('payments').select('*').eq('order_id', orderId).order('created_at', { ascending: true });
  return res as { data: Database['public']['Tables']['payments']['Row'][] | null; error: any };
}

export async function updateOrder(id: string, payload: Database['public']['Tables']['orders']['Update']) {
  const res = await sb.from('orders').update(payload).eq('id', id).select().maybeSingle();
  return res as { data: Database['public']['Tables']['orders']['Row'] | null; error: any };
}

export async function getOrders() {
  const res = await sb.from('orders').select('*').order('created_at', { ascending: false });
  return res as { data: Database['public']['Tables']['orders']['Row'][] | null; error: any };
}

export async function getProfiles() {
  const res = await sb.from('profiles').select('*').order('created_at', { ascending: false });
  return res as { data: Database['public']['Tables']['profiles']['Row'][] | null; error: any };
}

export async function deleteProfile(id: string) {
  const res = await sb.from('profiles').delete().eq('id', id);
  return res as { data: any; error: any };
}
