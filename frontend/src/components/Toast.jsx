import React, { useEffect } from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';

const Toast = ({ message, type = 'success', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[200] w-[90%] max-w-xs animate-in slide-in-from-top duration-300">
      <div className={`flex items-center gap-4 p-5 rounded-[2rem] shadow-[0_15px_40px_rgba(0,0,0,0.1)] border backdrop-blur-xl ${
        type === 'success' 
        ? 'bg-white/90 border-emerald-100 text-emerald-600' 
        : 'bg-white/90 border-red-100 text-red-500'
      }`}>
        {type === 'success' 
          ? <CheckCircle2 size={24} className="shrink-0" /> 
          : <XCircle size={24} className="shrink-0" />
        }
        <span className="text-[14px] font-bold tracking-tight italic leading-tight capitalize">
          {message}
        </span>
      </div>
    </div>
  );
};

export default Toast;