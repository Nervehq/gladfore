import * as React from 'react';

export function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title?: React.ReactNode; children?: React.ReactNode }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full md:w-96 bg-white rounded-t-lg md:rounded-lg p-4 md:p-6 shadow-lg">
        {title && <div className="font-semibold mb-2">{title}</div>}
        <div>{children}</div>
      </div>
    </div>
  );
}
