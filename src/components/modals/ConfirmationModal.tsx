import React from 'react';
import { AlertCircle, X } from 'lucide-react';
import { cn } from '@/utils';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  type?: 'danger' | 'warning' | 'info';
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm Action',
  type = 'danger'
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className={cn(
              "p-3 rounded-xl",
              type === 'danger' ? "bg-red-50 text-red-500" : 
              type === 'warning' ? "bg-amber-50 text-amber-500" : 
              "bg-blue-50 text-blue-500"
            )}>
              <AlertCircle size={24} />
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg text-slate-400">
              <X size={20} />
            </button>
          </div>
          
          <h3 className="text-xl font-bold text-slate-900">{title}</h3>
          <p className="text-slate-500 mt-2 leading-relaxed">{message}</p>
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-100 flex gap-3">
          <button 
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-600 hover:bg-white transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={() => { onConfirm(); onClose(); }}
            className={cn(
              "flex-1 px-4 py-2.5 rounded-xl text-sm font-bold text-white shadow-lg transition-all",
              type === 'danger' ? "bg-red-500 hover:bg-red-600 shadow-red-500/20" : 
              type === 'warning' ? "bg-amber-500 hover:bg-amber-600 shadow-amber-500/20" : 
              "bg-primary hover:bg-primary/90 shadow-primary/20"
            )}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};
