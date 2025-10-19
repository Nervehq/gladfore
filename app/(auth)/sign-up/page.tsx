'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth/context';
import { useToast } from '@/hooks/use-toast';

export default function SignUpPage() {
  const router = useRouter();
  const { signUp } = useAuth();
  const { toast } = useToast();

  const [name, setName] = useState('');
  const [role, setRole] = useState<'farmer' | 'agent' | 'admin'>('farmer');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) {
      return toast({ title: 'Password mismatch', description: 'Passwords do not match' });
    }
    setLoading(true);
    try {
      // signature can vary — cast to any to match runtime hook shape
      const res = (await (signUp as any)(email, password, { name, role })) as any;
      if (res?.error) {
        toast({ title: 'Sign up failed', description: res.error.message || 'Try again' });
      } else {
        toast({ title: 'Account created', description: 'Redirecting…' });
        // role-aware redirect
        if (role === 'agent') router.push('/agent/dashboard');
        else if (role === 'admin') router.push('/admin/dashboard');
        else router.push('/farmer/dashboard');
      }
    } catch (err) {
      console.error(err);
      toast({ title: 'Error', description: 'Unexpected error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-start justify-center bg-slate-50 py-8 px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-sm p-6 sm:p-8">
        <header className="mb-6">
          <h1 className="text-2xl font-semibold">Create account</h1>
          <p className="text-sm text-muted-foreground mt-1">Sign up and get started</p>
        </header>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Full name</label>
            <Input
              className="w-full"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Jane Doe"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as any)}
              className="block w-full px-3 py-2 border rounded-md bg-white"
              aria-label="Role"
            >
              <option value="farmer">Farmer</option>
              <option value="agent">Agent</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <Input
              className="w-full"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <Input
              className="w-full"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a password"
              required
              minLength={8}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Confirm password</label>
            <Input
              className="w-full"
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Repeat password"
              required
              minLength={8}
            />
          </div>

          <div className="flex items-center justify-between text-sm">
            <p className="text-muted-foreground">Already have an account?</p>
            <Link href="/sign-in" className="text-primary hover:underline">Sign in</Link>
          </div>

          <div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Creating account…' : 'Create account'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}