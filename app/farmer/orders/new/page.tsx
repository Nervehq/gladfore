 'use client';

import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useAuth } from '@/lib/auth/context';
import { supabase } from '@/lib/supabase/client';
import { Database } from '@/lib/supabase/types';
import { createOrder, recordPayment, createRepaymentSchedules } from '@/lib/db';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { calculateFullOrder, formatCurrency } from '@/lib/business-logic/order-calculations';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

type Item = { name: string; quantity: number; pricePerUnit: number };

type FormValues = {
  items: Item[];
  downPaymentReceived: number;
};

export default function CreateOrderPage() {
  const { profile } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const methods = useForm<FormValues>({
    defaultValues: { items: [{ name: '', quantity: 1, pricePerUnit: 0 }], downPaymentReceived: 0 },
  });

  const { fields, append, remove } = useFieldArray({ control: methods.control, name: 'items' });

  const onSubmit = async (data: FormValues) => {
    if (!profile) return toast({ title: 'Not signed in', description: 'Please sign in' });

    const calc = calculateFullOrder(
      data.items.map((i, idx) => ({ id: String(idx), name: i.name, quantity: Number(i.quantity), pricePerUnit: Number(i.pricePerUnit) }))
    );

    if (data.downPaymentReceived !== calc.downPaymentRequired) {
      return toast({ title: 'Invalid down payment', description: `Down payment must be ${formatCurrency(calc.downPaymentRequired)}` });
    }

    const payload: Database['public']['Tables']['orders']['Insert'] = {
      farmer_id: profile.id,
      // agent_id: if there's an agent linkage it should be stored elsewhere; default to farmer id
      agent_id: profile.id,
      total_cost: calc.totalCost,
      down_payment_required: calc.downPaymentRequired,
      down_payment_received: data.downPaymentReceived,
      remaining_balance: calc.remainingBalance,
      status: 'pending',
      order_details: data.items,
    };

    const { data: created, error } = await createOrder(payload);

    if (error) {
      console.error('Order create error', error);
      return toast({ title: 'Error', description: 'Could not create order' });
    }

    // If a down payment was provided, record it as a payment
    if (data.downPaymentReceived && data.downPaymentReceived > 0) {
      try {
        const paymentPayload: Database['public']['Tables']['payments']['Insert'] = {
          order_id: created!.id,
          farmer_id: profile.id,
          amount: data.downPaymentReceived,
          payment_type: 'down_payment',
          recorded_by: profile.id,
        };

        const { error: payErr } = await recordPayment(paymentPayload);
        if (payErr) console.warn('Failed to record initial down payment', payErr);
      } catch (e) {
        console.warn('Failed to record initial down payment', e);
      }
    }

    // Generate a simple repayment schedule for the remaining balance
    try {
      const installments = 3; // assumption: 3 monthly installments
      const installmentAmount = Number((calc.remainingBalance / installments).toFixed(2));
      const now = new Date();
  const schedules: Database['public']['Tables']['repayment_schedules']['Insert'][] = [];

      for (let i = 1; i <= installments; i++) {
        const due = new Date(now);
        due.setDate(due.getDate() + 30 * i);
        schedules.push({
          order_id: created!.id,
          farmer_id: profile.id,
          installment_number: i,
          due_date: due.toISOString(),
          amount_due: installmentAmount,
          amount_paid: 0,
          status: 'pending',
        });
      }

      if (schedules.length > 0) {
        const { error: schedErr } = await createRepaymentSchedules(schedules);
        if (schedErr) console.warn('Failed to create repayment schedules', schedErr);
      }
    } catch (e) {
      console.warn('Failed to create repayment schedules', e);
    }

    toast({ title: 'Order created', description: 'Your order and repayment schedule were created successfully' });
    if (created && created.id) {
      router.push(`/farmer/orders/${created.id}`);
    } else {
      router.push('/farmer/dashboard');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6">Create Order</h1>

      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
        {fields.map((field, idx) => (
          <div key={field.id} className="grid grid-cols-12 gap-2 items-end">
            <div className="col-span-5">
              <label className="block text-sm">Item name</label>
              <Input {...methods.register(`items.${idx}.name` as const, { required: true })} />
            </div>
            <div className="col-span-2">
              <label className="block text-sm">Qty</label>
              <Input type="number" {...methods.register(`items.${idx}.quantity` as const, { valueAsNumber: true, min: 1 })} />
            </div>
            <div className="col-span-3">
              <label className="block text-sm">Price</label>
              <Input type="number" step="0.01" {...methods.register(`items.${idx}.pricePerUnit` as const, { valueAsNumber: true })} />
            </div>
            <div className="col-span-2">
              <Button type="button" variant="ghost" onClick={() => remove(idx)}>
                Remove
              </Button>
            </div>
          </div>
        ))}

        <div>
          <Button type="button" variant="outline" onClick={() => append({ name: '', quantity: 1, pricePerUnit: 0 })}>
            Add item
          </Button>
        </div>

        <div className="mt-4">
          <h3 className="text-lg font-medium">Summary</h3>
          <pre className="bg-muted p-3 mt-2 rounded">{
            JSON.stringify(calculateFullOrder(
              methods.getValues('items').map((i, idx) => ({ id: String(idx), name: i.name, quantity: Number(i.quantity), pricePerUnit: Number(i.pricePerUnit) }))
            ), null, 2)
          }</pre>
        </div>

        <div>
          <label className="block text-sm">Down payment (must equal required)</label>
          <Input type="number" step="0.01" {...methods.register('downPaymentReceived', { valueAsNumber: true })} />
        </div>

        <Button type="submit">Create order</Button>
      </form>
    </div>
  );
}
