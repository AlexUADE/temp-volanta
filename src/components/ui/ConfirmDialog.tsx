import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { Button } from './Button';

export interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
  isLoading?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  isDestructive = false,
  isLoading = false,
  onConfirm,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="bg-white border border-[#e8e2d8] rounded-[8px] shadow-[0_8px_24px_rgba(21,17,13,0.12)] max-w-md w-full p-6 text-[#1b1c1a]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div
              className={`w-9 h-9 rounded-[4px] flex items-center justify-center shrink-0 ${
                isDestructive ? 'bg-[#ffdad6] text-[#9b2c2c]' : 'bg-[#f4efeb] text-[#755a2a]'
              }`}
            >
              <AlertTriangle className="w-4 h-4" />
            </div>
            <h3 className="font-serif text-lg text-[#1b1c1a]">{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="text-[#7d766e] hover:text-[#1b1c1a] p-1 rounded hover:bg-[#f4efeb] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-[#4b463f] leading-relaxed mb-6 whitespace-pre-line">
          {message}
        </p>

        <div className="flex items-center justify-end gap-2.5">
          <Button variant="outline" size="sm" onClick={onClose} disabled={isLoading}>
            {cancelText}
          </Button>
          <Button
            variant={isDestructive ? 'destructive' : 'primary'}
            size="sm"
            onClick={onConfirm}
            isLoading={isLoading}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
};
