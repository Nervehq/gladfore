 'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth/context';
import { Button } from '@/components/ui/button';

export function Header() {
  const { profile, signOut } = useAuth();

  return (
    <header className="w-full border-b bg-white/50 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="font-semibold text-lg">Gladfore</Link>
          <nav className="flex items-center gap-2">
            <Link href="/">Home</Link>
            {profile?.role === 'farmer' && <Link href="/farmer/dashboard">Farmer</Link>}
            {profile?.role === 'agent' && <Link href="/agent/dashboard">Agent</Link>}
            {profile?.role === 'admin' && <Link href="/admin/dashboard">Admin</Link>}
          </nav>
        </div>

        <div>
          {profile ? (
            <div className="flex items-center gap-2">
              <span className="text-sm">{profile.full_name}</span>
              <Button size="sm" variant="outline" onClick={() => signOut()}>
                Sign out
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/sign-in">
                <Button size="sm">Sign in</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
