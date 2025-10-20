'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/context';

export function RequireRole({
  role,
  children,
}: {
  role: string;
  children: React.ReactNode;
}) {
  const { profile, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (!profile) {
      router.replace('/sign-in');
      return;
    }

    if (profile.role !== role) {
      switch (profile.role) {
        case 'admin':
          router.replace('/admin/dashboard');
          break;
        case 'farmer':
          router.replace('/farmer/dashboard');
          break;
        case 'agent':
          router.replace('/agent/dashboard');
          break;
        default:
          router.replace('/');
      }
    }
  }, [profile, loading, router, role]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center text-gray-500">
        Loading your access...
      </div>
    );
  }

  if (!profile || profile.role !== role) return null;

  return <>{children}</>;
}
