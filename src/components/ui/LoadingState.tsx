import React from 'react';

export const LoadingState: React.FC<{ message?: string; className?: string }> = ({
  message = 'Cargando información...',
  className = 'py-16',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center gap-3 text-center ${className}`}>
      <div className="w-8 h-8 border-3 border-[#755a2a] border-t-transparent rounded-full animate-spin" />
      <p className="text-sm text-[#4b463f] font-medium">{message}</p>
    </div>
  );
};
