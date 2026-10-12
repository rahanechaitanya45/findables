import React, { useState, useEffect } from 'react';
import { CheckCircle2, Copy, X } from 'lucide-react';

interface ToastItem {
  id: number;
  message: string;
}

export const Toast: React.FC = () => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    let nextId = 1;
    const handleToastEvent = (e: Event) => {
      const customEvent = e as CustomEvent<{ message: string; duration?: number }>;
      const message = customEvent.detail?.message;
      const duration = customEvent.detail?.duration || 3000;
      if (!message) return;

      const id = nextId++;
      setToasts((prev) => [...prev, { id, message }]);

      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    };

    window.addEventListener('findables-toast', handleToastEvent);
    return () => window.removeEventListener('findables-toast', handleToastEvent);
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed bottom-5 left-1/2 -translate-x-1/2 z-[9999] flex flex-col gap-2 pointer-events-none max-w-[90vw] sm:max-w-md w-full px-3"
      role="status"
      aria-live="polite"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto bg-[#131921] text-white border border-slate-700/80 shadow-2xl rounded-xl px-4 py-3 flex items-center justify-between gap-3 animate-in fade-in slide-in-from-bottom-2 duration-200"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <p className="text-xs sm:text-sm font-medium text-slate-100 truncate">
              {toast.message}
            </p>
          </div>
          <button
            onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
            className="text-slate-400 hover:text-white p-1 rounded transition-colors shrink-0 cursor-pointer"
            aria-label="Dismiss notification"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};
