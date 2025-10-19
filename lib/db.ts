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
