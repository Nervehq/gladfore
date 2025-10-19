import React from 'react';
import { cn } from '@/lib/utils';

interface MobileCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export function MobileCard({ children, className, onClick }: MobileCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'bg-white rounded-lg border p-4 shadow-sm',
        onClick && 'cursor-pointer active:bg-gray-50 transition-colors',
        className
      )}
    >
      {children}
    </div>
  );
}
