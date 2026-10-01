import React from 'react';

export interface FormFieldProps {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  htmlFor?: string;
  children: React.ReactNode;
  className?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  error,
  helperText,
  required,
  htmlFor,
  children,
  className = '',
}) => {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label
          htmlFor={htmlFor}
          className="text-xs font-semibold text-[#1b1c1a] uppercase tracking-wider flex items-center gap-1"
        >
          <span>{label}</span>
          {required && <span className="text-[#ba1a1a]">*</span>}
        </label>
      )}

      {children}

      {error ? (
        <p className="text-xs text-[#ba1a1a] font-medium mt-0.5">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-[#7d766e] mt-0.5">{helperText}</p>
      ) : null}
    </div>
  );
};

export const inputClass =
  'w-full px-3.5 py-2.5 bg-white border border-[#cec5bc] rounded-md text-sm text-[#1b1c1a] placeholder:text-[#7d766e]/60 focus:border-[#755a2a] focus:ring-1 focus:ring-[#755a2a] focus:outline-none transition-colors disabled:bg-[#f5f3f0] disabled:cursor-not-allowed';

export const selectClass =
  'w-full px-3.5 py-2.5 bg-white border border-[#cec5bc] rounded-md text-sm text-[#1b1c1a] focus:border-[#755a2a] focus:ring-1 focus:ring-[#755a2a] focus:outline-none transition-colors disabled:bg-[#f5f3f0] disabled:cursor-not-allowed';

export const textareaClass =
  'w-full px-3.5 py-2.5 bg-white border border-[#cec5bc] rounded-md text-sm text-[#1b1c1a] placeholder:text-[#7d766e]/60 focus:border-[#755a2a] focus:ring-1 focus:ring-[#755a2a] focus:outline-none transition-colors resize-y min-h-[90px] disabled:bg-[#f5f3f0] disabled:cursor-not-allowed';
