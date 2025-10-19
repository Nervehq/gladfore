import React from 'react';
import { cn } from '@/lib/utils';

interface MobileContainerProps {
  children: React.ReactNode;
  className?: string;
  withBottomNav?: boolean;
}

export function MobileContainer({ children, className, withBottomNav = true }: MobileContainerProps) {
  return (
    <div
      className={cn(
        'min-h-screen bg-gray-50',
        withBottomNav && 'pb-16 md:pb-0',
        className
      )}
    >
      {children}
    </div>
  );
}
