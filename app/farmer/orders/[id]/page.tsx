 'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/context';
import { supabase } from '@/lib/supabase/client';
import { Database } from '@/lib/supabase/types';
import { getOrderById, getPaymentsByOrderId, recordPayment as dbRecordPayment, updateOrder, getRepaymentSchedulesByOrderId, recordPaymentLinked } from '@/lib/db';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { formatCurrency } from '@/lib/business-logic/order-calculations';
import { useToast } from '@/hooks/use-toast';

type Order = Database['public']['Tables']['orders']['Row'];
type Payment = Database['public']['Tables']['payments']['Row'];

export default function OrderDetailsPage() {
  const params = useParams();
  const id = params?.id as string;
  const { profile } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const [order, setOrder] = useState<Order | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [amount, setAmount] = useState<number>(0);
    const [schedules, setSchedules] = useState<Database['public']['Tables']['repayment_schedules']['Row'][]>([]);

  useEffect(() => {
    if (!id) return;

    (async () => {
      const { data: orderData } = await getOrderById(id);
      setOrder(orderData ?? null);
      const { data: paymentsData } = await getPaymentsByOrderId(id);
      setPayments((paymentsData ?? []) as Payment[]);
      const { data: schedulesData } = await getRepaymentSchedulesByOrderId(id);
      setSchedules((schedulesData ?? []) as Database['public']['Tables']['repayment_schedules']['Row'][]);
    })();
  }, [id]);

  const recordPayment = async (paymentType: 'down_payment' | 'installment') => {
    if (!order || !profile) return toast({ title: 'Cannot record', description: 'Missing context' });

    const paymentPayload: Database['public']['Tables']['payments']['Insert'] = {
      order_id: order.id,
      farmer_id: order.farmer_id,
      amount: amount,
      payment_type: paymentType,
      recorded_by: profile.id,
    };

    const { error: pErr } = await dbRecordPayment(paymentPayload);

    if (pErr) {
      console.error('Payment error', pErr);
      return toast({ title: 'Error', description: 'Could not record payment' });
    }

    // Update order summary
    const newDown = order.down_payment_received + amount;
    const newRemaining = order.remaining_balance - amount;
  await updateOrder(order.id, { down_payment_received: newDown, remaining_balance: newRemaining });

    // refresh schedules and payments
    const { data: schedulesData } = await getRepaymentSchedulesByOrderId(order.id);
    setSchedules((schedulesData ?? []) as Database['public']['Tables']['repayment_schedules']['Row'][]);
    const { data: paymentsData2 } = await getPaymentsByOrderId(order.id);
    setPayments((paymentsData2 ?? []) as Payment[]);

    toast({ title: 'Payment recorded', description: `Recorded ${formatCurrency(amount)}` });
    router.refresh();
  };

  const paySchedule = async (sched: Database['public']['Tables']['repayment_schedules']['Row']) => {
    if (!profile || !order) return toast({ title: 'Cannot pay', description: 'Missing context' });
    const remainingForSched = Number(sched.amount_due) - Number(sched.amount_paid || 0);
    const input = window.prompt(`Enter amount to pay for installment ${sched.installment_number}`, String(remainingForSched));
    if (!input) return;
    const amt = Number(input);
    if (!amt || amt <= 0) return toast({ title: 'Invalid amount', description: 'Enter a positive number' });

    const payload: Database['public']['Tables']['payments']['Insert'] & { repayment_schedule_id?: string } = {
      order_id: order.id,
      farmer_id: order.farmer_id,
      amount: amt,
      payment_type: 'installment',
      recorded_by: profile.id,
      repayment_schedule_id: sched.id,
    };

    const { payment, schedule: updatedSched, order: updatedOrder, error } = await recordPaymentLinked(payload);
    if (error) {
      console.error('Pay schedule error', error);
      return toast({ title: 'Error', description: 'Could not record payment' });
    }

    toast({ title: 'Payment recorded', description: `Recorded ${formatCurrency(amt)}` });

    if (updatedSched) {
      setSchedules((prev) => prev.map((s) => (s.id === updatedSched.id ? updatedSched : s)));
    }
    if (updatedOrder) setOrder(updatedOrder as Order);
    const { data: paymentsData3 } = await getPaymentsByOrderId(order.id);
    setPayments((paymentsData3 ?? []) as Payment[]);
  };

  if (!order) return <div className="p-6">Loading order...</div>;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Order {order.id}</h1>

      <div className="space-y-2 mb-4">
        <div>Total: {formatCurrency(order.total_cost)}</div>
        <div>Down required: {formatCurrency(order.down_payment_required)}</div>
        <div>Down paid: {formatCurrency(order.down_payment_received)}</div>
        <div>Remaining: {formatCurrency(order.remaining_balance)}</div>
        <div>Status: {order.status}</div>
      </div>

      <div className="mb-4">
        <h2 className="font-medium">Record payment</h2>
        <div className="flex gap-2 items-center mt-2">
          <Input type="number" step="0.01" value={amount} onChange={(e) => setAmount(Number(e.target.value))} />
          <Button onClick={() => recordPayment('down_payment')}>Record down payment</Button>
          <Button onClick={() => recordPayment('installment')}>Record installment</Button>
        </div>
      </div>

      <div>
        <h2 className="font-medium mb-2">Payments</h2>
        <ul className="space-y-2">
          {payments.map((p) => (
            <li key={p.id} className="flex justify-between">
              <span>{formatCurrency(p.amount)}</span>
              <span className="text-sm text-muted-foreground">{new Date(p.created_at).toLocaleString()}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6">
        <h2 className="font-medium mb-2">Repayment schedule</h2>
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr>
              <th className="text-left p-2">#</th>
              <th className="text-left p-2">Due</th>
              <th className="text-right p-2">Amount due</th>
              <th className="text-right p-2">Paid</th>
              <th className="text-left p-2">Status</th>
              <th className="text-center p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {schedules.map((s) => (
              <tr key={s.id} className="border-t">
                <td className="p-2">{s.installment_number}</td>
                <td className="p-2">{new Date(s.due_date).toLocaleDateString()}</td>
                <td className="p-2 text-right">{s.amount_due.toFixed(2)}</td>
                <td className="p-2 text-right">{(s.amount_paid || 0).toFixed(2)}</td>
                <td className="p-2">
                  {s.status === 'paid' ? (
                    <span className="text-green-600">Paid</span>
                  ) : s.status === 'pending' ? (
                    new Date(s.due_date) < new Date() ? <span className="text-red-600">Overdue</span> : <span className="text-gray-600">Pending</span>
                  ) : (
                    <span className="text-yellow-600">Partial</span>
                  )}
                </td>
                <td className="p-2 text-center">
                  <Button size="sm" onClick={() => paySchedule(s)} disabled={s.status === 'paid'}>Pay</Button>
                </td>
              </tr>
            ))}
            {schedules.length === 0 && (
              <tr>
                <td colSpan={6} className="p-4 text-center text-muted-foreground">No repayment schedule</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
