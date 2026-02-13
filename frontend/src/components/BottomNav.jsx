import React from 'react';
import { Home, QrCode, Bell } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const BottomNav = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 px-8 py-3 flex justify-between items-center z-50 rounded-t-[2rem] shadow-[0_-10px_20px_rgba(0,0,0,0.05)]">
      <NavLink to="/dashboard" className={({isActive}) => `flex flex-col items-center gap-1 ${isActive ? 'text-blue-600' : 'text-slate-400'}`}>
        <Home size={24} />
        <span className="text-[10px] font-bold uppercase tracking-wider">Home</span>
      </NavLink>
      
      <div className="relative -top-10">
        <div className="bg-blue-500 text-white p-5 rounded-full shadow-lg shadow-blue-300 border-4 border-slate-50 active:scale-95 transition-all">
          <QrCode size={28} />
          <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-slate-500 text-[10px] font-bold uppercase">Scan</span>
        </div>
      </div>

      <NavLink to="/notices" className={({isActive}) => `flex flex-col items-center gap-1 ${isActive ? 'text-blue-600' : 'text-slate-400'}`}>
        <Bell size={24} />
        <span className="text-[10px] font-bold uppercase tracking-wider">Notification</span>
      </NavLink>
    </div>
  );
};

export default BottomNav;