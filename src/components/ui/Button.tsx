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
    'inline-flex items-center justify-center font-sans font-medium transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#755a2a]';

  const sizeStyles = {
    sm: 'text-xs px-3 py-1.5 rounded gap-1.5',
    md: 'text-sm px-4 py-2.5 rounded-md gap-2',
    lg: 'text-base px-6 py-3 rounded-lg gap-2.5',
  };

  const variantStyles = {
    primary:
      'bg-[#15110d] text-white hover:bg-[#2a2621] active:bg-[#15110d] shadow-2xs',
    secondary:
      'bg-[#755a2a] text-white hover:bg-[#5e4720] active:bg-[#755a2a] shadow-2xs',
    outline:
      'border border-[#cec5bc] bg-white text-[#1b1c1a] hover:bg-[#f5f3f0] active:bg-[#efeeeb]',
    destructive:
      'bg-[#ba1a1a] text-white hover:bg-[#93000a] active:bg-[#ba1a1a] shadow-2xs',
    ghost:
      'text-[#4b463f] hover:bg-[#efeeeb] hover:text-[#1b1c1a] active:bg-[#eae8e5]',
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin shrink-0" />
      ) : (
        icon && <span className="shrink-0">{icon}</span>
      )}
      <span>{children}</span>
    </button>
  );
};
