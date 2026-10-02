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
      className={`max-w-md mx-auto p-6 bg-[#ffdad6]/30 border border-[#9b2c2c]/30 rounded-[8px] text-center ${className}`}
    >
      <div className="w-9 h-9 rounded-full bg-[#ffdad6] text-[#9b2c2c] flex items-center justify-center mx-auto mb-3">
        <AlertCircle className="w-4 h-4" />
      </div>
      <h3 className="font-serif text-base text-[#9b2c2c] mb-1">{title}</h3>
      <p className="text-xs text-[#4b463f] mb-4">{message}</p>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          Reintentar
        </Button>
      )}
    </div>
  );
};
