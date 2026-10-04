'use client';

import { useEffect } from 'react';
import { CheckCircle2, XCircle, AlertCircle, Info, X } from 'lucide-react';

interface ToastProps {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  description?: string;
  duration?: number;
  onClose: () => void;
}

export default function Toast({ type, message, description, duration = 5000, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const config = {
    success: {
      icon: CheckCircle2,
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200',
      iconColor: 'text-emerald-600',
      textColor: 'text-emerald-900',
      descColor: 'text-emerald-700',
    },
    error: {
      icon: XCircle,
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      iconColor: 'text-red-600',
      textColor: 'text-red-900',
      descColor: 'text-red-700',
    },
    warning: {
      icon: AlertCircle,
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200',
      iconColor: 'text-amber-600',
      textColor: 'text-amber-900',
      descColor: 'text-amber-700',
    },
    info: {
      icon: Info,
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      iconColor: 'text-blue-600',
      textColor: 'text-blue-900',
      descColor: 'text-blue-700',
    },
  };

  const { icon: Icon, bgColor, borderColor, iconColor, textColor, descColor } = config[type];

  return (
    <div className="fixed top-4 right-4 z-[9999] animate-slideInRight">
      <div className={`${bgColor} ${borderColor} border rounded-xl shadow-lg p-4 min-w-[320px] max-w-md`}>
        <div className="flex items-start gap-3">
          <div className={`${iconColor} shrink-0 mt-0.5`}>
            <Icon className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className={`${textColor} font-semibold text-sm leading-snug`}>{message}</p>
            {description && (
              <p className={`${descColor} text-xs mt-1 leading-relaxed`}>{description}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 shrink-0 transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
