'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase/client';

export default function ResetPasswordPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      return toast({ title: 'Email required', description: 'Please enter your email address' });
    }
    setLoading(true);
    try {
      // supabase v1/v2 helper — returns { data, error }
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/(auth)/sign-in`,
      } as any);

      if (error) {
        toast({ title: 'Reset failed', description: error.message || 'Could not send reset email' });
      } else {
        toast({ title: 'Check your email', description: 'Password reset instructions sent' });
        // optional: redirect to sign-in after a short delay
        setTimeout(() => router.push('/(auth)/sign-in'), 1200);
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
        <header className="mb-6 text-center">
          <h1 className="text-2xl font-semibold">Reset password</h1>
          <p className="text-sm text-muted-foreground mt-1">Enter the email for your account and we’ll send reset instructions.</p>
        </header>

        <form onSubmit={onSubmit} className="space-y-4">
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

          <div className="flex items-center justify-between text-sm">
            <Link href="/(auth)/sign-in" className="text-muted-foreground hover:underline">Back to sign in</Link>
            <Link href="/(auth)/sign-up" className="text-muted-foreground hover:underline">Create account</Link>
          </div>

          <div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Sending…' : 'Send reset link'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}