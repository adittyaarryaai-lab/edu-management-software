import React, { useEffect } from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';

const Toast = ({ message, type = 'success', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[200] w-[90%] max-w-xs animate-in slide-in-from-top duration-300">
      <div className={`flex items-center gap-3 p-4 rounded-2xl shadow-[0_0_30px_rgba(0,0,0,0.5)] border backdrop-blur-xl ${
        type === 'success' ? 'bg-void/90 border-neon text-neon' : 'bg-void/90 border-red-500 text-red-500'
      }`}>
        {type === 'success' ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
        <span className="text-[10px] font-black uppercase tracking-widest italic">{message}</span>
      </div>
    </div>
  );
};

export default Toast;