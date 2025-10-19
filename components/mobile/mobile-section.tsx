import React from 'react';
import { cn } from '@/lib/utils';

interface MobileSectionProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
}

export function MobileSection({ children, className, title }: MobileSectionProps) {
  return (
    <section className={cn('px-4 py-4', className)}>
      {title && <h2 className="text-base font-semibold mb-3">{title}</h2>}
      {children}
    </section>
  );
}
