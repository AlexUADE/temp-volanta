import React from 'react';
import { Button } from './Button';

export const EmptyState: React.FC<{
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  className?: string;
}> = ({ icon, title, description, actionText, onAction, className = 'py-16' }) => {
  return (
    <div className={`flex flex-col items-center justify-center text-center p-8 max-w-md mx-auto ${className}`}>
      {icon && (
        <div className="w-11 h-11 rounded-[4px] bg-[#f4efeb] text-[#755a2a] flex items-center justify-center mb-4">
          {icon}
        </div>
      )}
      <h3 className="font-serif text-lg text-[#1b1c1a] mb-2">{title}</h3>
      <p className="text-xs text-[#7d766e] leading-relaxed mb-6">{description}</p>
      {actionText && onAction && (
        <Button variant="primary" size="md" onClick={onAction}>
          {actionText}
        </Button>
      )}
    </div>
  );
};
