import React, { useEffect } from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';

const Toast = ({ message, type = 'success', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[200] w-[90%] max-w-xs animate-in slide-in-from-top duration-300">
      <div className={`flex items-center gap-3 p-4 rounded-2xl shadow-2xl border backdrop-blur-md ${
        type === 'success' ? 'bg-green-50/90 border-green-100 text-green-600' : 'bg-red-50/90 border-red-100 text-red-600'
      }`}>
        {type === 'success' ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
        <span className="text-xs font-bold">{message}</span>
      </div>
    </div>
  );
};

export default Toast;