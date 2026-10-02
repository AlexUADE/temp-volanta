import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'destructive' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  icon,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-sans transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#755a2a] rounded-[4px]';

  const sizeStyles = {
    sm: 'text-[11px] font-bold tracking-[0.06em] uppercase px-3 py-1.5 gap-1.5',
    md: 'text-[11px] font-bold tracking-[0.06em] uppercase px-4 py-2.5 gap-2',
    lg: 'text-xs font-bold tracking-[0.08em] uppercase px-6 py-3 gap-2.5',
  };

  const variantStyles = {
    primary:
      'bg-[#15110d] text-white border border-[#15110d] hover:bg-[#2a2621] active:bg-[#15110d]',
    secondary:
      'bg-[#755a2a] text-white border border-[#755a2a] hover:bg-[#5e4720] active:bg-[#755a2a]',
    outline:
      'border border-[#e8e2d8] bg-transparent text-[#15110d] hover:bg-[#15110d] hover:text-white hover:border-[#15110d]',
    destructive:
      'bg-[#9b2c2c] text-white border border-[#9b2c2c] hover:bg-[#7b2323] active:bg-[#9b2c2c]',
    ghost:
      'text-[#4b463f] hover:bg-[#f4efeb] hover:text-[#1b1c1a]',
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin shrink-0" />
      ) : (
        icon && <span className="shrink-0">{icon}</span>
      )}
      <span>{children}</span>
    </button>
  );
};
