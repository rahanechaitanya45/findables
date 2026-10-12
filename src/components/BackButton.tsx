import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface BackButtonProps {
  label?: string;
  fallbackPath?: string;
  onNavigate: (path: string) => void;
  className?: string;
}

export const BackButton: React.FC<BackButtonProps> = ({
  label = 'Back',
  fallbackPath = '/',
  onNavigate,
  className = '',
}) => {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    // If browser history has previous page on the same origin, go back
    if (typeof window !== 'undefined' && window.history.length > 1 && document.referrer.includes(window.location.host)) {
      window.history.back();
    } else {
      onNavigate(fallbackPath);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 active:bg-slate-100 border border-slate-200/90 rounded-lg shadow-2xs hover:border-slate-300 transition-colors cursor-pointer group min-h-[34px] select-none ${className}`}
      aria-label={`Go back ${label ? `to ${label}` : ''}`}
    >
      <ArrowLeft className="w-3.5 h-3.5 text-slate-500 group-hover:-translate-x-0.5 transition-transform shrink-0" />
      <span>{label}</span>
    </button>
  );
};
