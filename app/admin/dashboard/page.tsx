 'use client';

import React, { useEffect, useState } from 'react';
import { RequireRole } from '@/components/navigation/require-role';
import { supabase } from '@/lib/supabase/client';
import { Database } from '@/lib/supabase/types';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export default function AdminDashboardPage() {
  const [users, setUsers] = useState<Database['public']['Tables']['profiles']['Row'][]>([]);
  const [orders, setOrders] = useState<Database['public']['Tables']['orders']['Row'][]>([]);
  const { toast } = useToast();

  useEffect(() => {
    (async () => {
  const { data: u } = await (await import('@/lib/db')).getProfiles();
  setUsers((u as Database['public']['Tables']['profiles']['Row'][]) || []);
  const { data: o } = await (await import('@/lib/db')).getOrders();
  setOrders((o as Database['public']['Tables']['orders']['Row'][]) || []);
    })();
  }, []);

  const deleteUser = async (id: string) => {
  const { error } = await (await import('@/lib/db')).deleteProfile(id);
    if (error) return toast({ title: 'Error', description: 'Could not delete user' });
    setUsers((prev) => prev.filter((u) => u.id !== id));
    toast({ title: 'Deleted', description: 'User deleted' });
  };

  return (
    <RequireRole role="admin">
      <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Admin — Users & Orders</h1>

      <h2 className="text-lg font-medium mt-4 mb-2">Users</h2>
      <Table>
        <TableHeader>
          <tr>
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Actions</TableHead>
          </tr>
        </TableHeader>
        <TableBody>
          {users.map((u) => (
            <TableRow key={u.id}>
              <TableCell>{u.id}</TableCell>
              <TableCell>{u.full_name}</TableCell>
              <TableCell>{u.role}</TableCell>
              <TableCell>
                <Button variant="destructive" size="sm" onClick={() => deleteUser(u.id)}>
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <h2 className="text-lg font-medium mt-6 mb-2">Orders</h2>
      <Table>
        <TableHeader>
          <tr>
            <TableHead>ID</TableHead>
            <TableHead>Farmer</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Status</TableHead>
          </tr>
        </TableHeader>
        <TableBody>
          {orders.map((o) => (
            <TableRow key={o.id}>
              <TableCell>{o.id}</TableCell>
              <TableCell>{o.farmer_id}</TableCell>
              <TableCell>{o.total_cost}</TableCell>
              <TableCell>{o.status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      </div>
    </RequireRole>
  );
}
