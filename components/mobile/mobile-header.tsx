'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Menu, LogOut } from 'lucide-react';
import { useAuth } from '@/lib/auth/context';

interface MobileHeaderProps {
  title: string;
  onMenuClick?: () => void;
  showMenu?: boolean;
}

export function MobileHeader({ title, onMenuClick, showMenu = true }: MobileHeaderProps) {
  const { signOut, profile } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="flex h-14 items-center justify-between px-4">
        <div className="flex items-center gap-3">
          {showMenu && onMenuClick && (
            <Button variant="ghost" size="icon" onClick={onMenuClick} className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          )}
          <h1 className="text-lg font-semibold truncate">{title}</h1>
        </div>
        <div className="flex items-center gap-2">
          {profile && (
            <span className="text-xs text-muted-foreground hidden sm:inline">
              {profile.full_name}
            </span>
          )}
          <Button variant="ghost" size="icon" onClick={() => signOut()}>
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
