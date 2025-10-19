 'use client';

import React, { useEffect, useState } from 'react';
import { RequireRole } from '@/components/navigation/require-role';
import { supabase } from '@/lib/supabase/client';
import { Database } from '@/lib/supabase/types';
import { updateOrder, getOrders } from '@/lib/db';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

type OrderRow = Database['public']['Tables']['orders']['Row'];

export default function AgentDashboardPage() {
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    (async () => {
      const { data } = await (await import('@/lib/db')).getOrders();
      setOrders((data as Database['public']['Tables']['orders']['Row'][]) || []);
    })();
  }, []);

  const updateStatus = async (id: string, status: 'approved' | 'rejected') => {
  const { error } = await updateOrder(id, { status: status as Database['public']['Tables']['orders']['Update']['status'] });
  if (error) return toast({ title: 'Error', description: 'Could not update order' });
    toast({ title: `Order ${status}`, description: `Order ${id} ${status}` });
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
  };

  return (
    <RequireRole role="agent">
      <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Agent — Orders</h1>
      <Table>
        <TableHeader>
          <tr>
            <TableHead>ID</TableHead>
            <TableHead>Farmer</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </tr>
        </TableHeader>
        <TableBody>
          {orders.map((o) => (
            <TableRow key={o.id}>
              <TableCell>{o.id}</TableCell>
              <TableCell>{o.farmer_id}</TableCell>
              <TableCell>{o.total_cost}</TableCell>
              <TableCell>{o.status}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => updateStatus(o.id, 'approved')}>
                    Approve
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => updateStatus(o.id, 'rejected')}>
                    Reject
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      </div>
    </RequireRole>
  );
}
