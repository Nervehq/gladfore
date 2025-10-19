 'use client';

import React from 'react';
import { RequireRole } from '@/components/navigation/require-role';
import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth/context';
import { supabase } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import Link from 'next/link';

type OrderRow = {
  id: string;
  total_cost: number;
  down_payment_required: number;
  down_payment_received: number;
  remaining_balance: number;
  status: string;
  created_at: string;
};

export default function FarmerDashboardPage() {
  const { profile, loading } = useAuth();
  const [orders, setOrders] = useState<OrderRow[]>([]);

  useEffect(() => {
    if (!profile) return;

    (async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('farmer_id', profile.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching orders', error);
        return;
      }

      setOrders((data as any) || []);
    })();
  }, [profile]);

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <RequireRole role="farmer">
      <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">My Orders</h1>
        <Link href="/farmer/orders/new">
          <Button>Create order</Button>
        </Link>
      </div>

      <Table>
        <TableHeader>
          <tr>
            <TableHead>ID</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Down Paid</TableHead>
            <TableHead>Remaining</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
          </tr>
        </TableHeader>
        <TableBody>
          {orders.map((o) => (
            <TableRow key={o.id}>
              <TableCell>{o.id}</TableCell>
              <TableCell>{o.total_cost}</TableCell>
              <TableCell>{o.down_payment_received}</TableCell>
              <TableCell>{o.remaining_balance}</TableCell>
              <TableCell>{o.status}</TableCell>
              <TableCell>{new Date(o.created_at).toLocaleString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      </div>
    </RequireRole>
  );
}
