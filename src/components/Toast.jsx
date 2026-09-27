import React from 'react';
import { useToast } from '../context/ToastContext';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

const Toast = () => {
  const { toasts, removeToast } = useToast();

  if (!toasts || toasts.length === 0) return null;

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-[#D9A514] shrink-0" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />;
      case 'info':
      default:
        return <Info className="w-5 h-5 text-[#064C32] shrink-0" />;
    }
  };

  const getBorderColor = (type) => {
    switch (type) {
      case 'success':
        return 'border-[#064C32]/40 bg-white text-[#111111] shadow-lg shadow-[#064C32]/10';
      case 'error':
        return 'border-red-400 bg-white text-[#111111] shadow-lg shadow-red-500/10';
      case 'warning':
        return 'border-amber-400 bg-white text-[#111111] shadow-lg shadow-amber-500/10';
      case 'info':
      default:
        return 'border-[#064C32]/20 bg-white text-[#111111] shadow-lg';
    }
  };

  return (
    <div className="fixed top-5 right-5 z-[9999] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border ${getBorderColor(
            t.type
          )} transition-all duration-300 transform translate-y-0 opacity-100 backdrop-blur-md`}
        >
          {getIcon(t.type)}
          <div className="flex-1 text-sm font-medium leading-snug">
            {t.message}
          </div>
          <button
            onClick={() => removeToast(t.id)}
            className="text-gray-400 hover:text-gray-700 transition p-0.5 rounded-lg -mr-1 -mt-1"
            aria-label="Dismiss notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};

export default Toast;
