import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Button } from './Button';

export const ErrorState: React.FC<{
  title?: string;
  message: string;
  onRetry?: () => void;
  className?: string;
}> = ({ title = 'Ocurrió un error', message, onRetry, className = 'py-12' }) => {
  return (
    <div
      className={`max-w-md mx-auto p-6 bg-[#ffdad6]/40 border border-[#ba1a1a]/30 rounded-lg text-center ${className}`}
    >
      <div className="w-10 h-10 rounded-full bg-[#ffdad6] text-[#ba1a1a] flex items-center justify-center mx-auto mb-3">
        <AlertCircle className="w-5 h-5" />
      </div>
      <h3 className="font-serif font-bold text-base text-[#93000a] mb-1">{title}</h3>
      <p className="text-xs text-[#93000a]/80 mb-4">{message}</p>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          Reintentar
        </Button>
      )}
    </div>
  );
};
