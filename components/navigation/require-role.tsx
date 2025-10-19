 'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/context';

export function RequireRole({ role, children }: { role: string; children: React.ReactNode }) {
  const { profile, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !profile) {
      router.push('/sign-in');
    }
    if (!loading && profile && profile.role !== role) {
      // redirect to their dashboard
      if (profile.role === 'farmer') router.push('/farmer/dashboard');
      if (profile.role === 'agent') router.push('/agent/dashboard');
      if (profile.role === 'admin') router.push('/admin/dashboard');
    }
  }, [profile, loading, router, role]);

  if (loading || !profile || profile.role !== role) return null;

  return <>{children}</>;
}
