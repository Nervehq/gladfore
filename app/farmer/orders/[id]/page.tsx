 'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/context';
import { supabase } from '@/lib/supabase/client';
import { Database } from '@/lib/supabase/types';
import { getOrderById, getPaymentsByOrderId, recordPayment as dbRecordPayment, updateOrder } from '@/lib/db';
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

  useEffect(() => {
    if (!id) return;

    (async () => {
      const { data: orderData } = await getOrderById(id);
      setOrder(orderData ?? null);
      const { data: paymentsData } = await getPaymentsByOrderId(id);
      setPayments((paymentsData ?? []) as Payment[]);
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

    toast({ title: 'Payment recorded', description: `Recorded ${formatCurrency(amount)}` });
    router.refresh();
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
    </div>
  );
}
