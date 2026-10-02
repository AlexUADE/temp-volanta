import React from 'react';

export const LoadingState: React.FC<{ message?: string; className?: string }> = ({
  message = 'Cargando información...',
  className = 'py-16',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center gap-3 text-center ${className}`}>
      <div className="w-7 h-7 border-2 border-[#755a2a] border-t-transparent rounded-full animate-spin" />
      <p className="text-xs text-[#7d766e]">{message}</p>
    </div>
  );
};
