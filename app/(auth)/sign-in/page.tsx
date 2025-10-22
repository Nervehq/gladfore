'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/context';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function SignInPage() {
  const router = useRouter();
  const { signIn, profile, user, loading } = useAuth();
  const { toast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // 🔁 Auto-redirect if already logged in
  useEffect(() => {
    if (loading) return;
    if (profile?.role === 'admin') router.push('/admin/dashboard');
    else if (profile?.role === 'agent') router.push('/agent/dashboard');
    else if (profile?.role === 'farmer') router.push('/farmer/dashboard');
  }, [profile, loading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const { error } = await signIn(email, password);

    setSubmitting(false);

    if (error) {
      toast({
        title: 'Sign in failed',
        description: error.message || 'Invalid credentials',
      });
      return;
    }

    toast({
      title: 'Signed in successfully',
      description: 'Redirecting to your dashboard…',
    });

    // Wait a moment for profile to load before redirect
    setTimeout(() => {
      if (profile?.role === 'admin') router.push('/admin/dashboard');
      else if (profile?.role === 'agent') router.push('/agent/dashboard');
      else router.push('/farmer/dashboard');
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-start justify-center bg-slate-50 py-8 px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-sm p-6 sm:p-8">
        <header className="mb-6">
          <h1 className="text-2xl font-semibold">Sign in</h1>
          <p className="text-sm text-muted-foreground mt-1">Access your dashboard</p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-4">
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
              placeholder="••••••••"
              required
            />
          </div>

          <div className="flex items-center justify-between text-sm">
            <Link href="/reset-password" className="text-primary hover:underline">
              Forgot password?
            </Link>
            <Link href="/sign-up" className="ml-4 text-muted-foreground hover:underline">
              Create account
            </Link>
          </div>

          <div>
            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? 'Signing in…' : 'Sign in'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
