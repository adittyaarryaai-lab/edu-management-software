import React from 'react';
import { Home, QrCode, Megaphone } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const BottomNav = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-void border-t border-neon/20 px-8 py-0 flex justify-between items-center z-50 rounded-t-[2rem] shadow-[0_-10px_30px_rgba(61,242,224,0.1)]">

      {/* HOME */}
      <NavLink
        to="/dashboard"
        className={({ isActive }) =>
          `flex flex-col items-center gap-1 transition-all ${
            isActive ? 'text-neon' : 'text-slate-500'
          }`
        }
      >
        <Home size={24} className="transition-all group-hover:scale-110" />
        <span className="text-[10px] font-bold uppercase tracking-[0.2em]">
          Home
        </span>
      </NavLink>

      {/* CENTER SCAN BUTTON */}
      <div className="relative -top-8 flex flex-col items-center">

        <div className="relative group">
          {/* Glow Ring */}
          <div className="absolute inset-0 rounded-full bg-neon/30 blur-xl animate-pulse"></div>

          <div className="relative bg-gradient-to-br from-neon to-cyan-600 text-void p-6 rounded-full shadow-[0_0_30px_rgba(61,242,224,0.6)] border-4 border-void active:scale-95 transition-all cursor-pointer">
            <QrCode size={28} />
          </div>
        </div>

        <span className="mt-2 text-neon text-[10px] font-black uppercase tracking-[0.3em]">
          Scan
        </span>
      </div>

      {/* FEED */}
      <NavLink
        to="/notice-feed"
        className={({ isActive }) =>
          `flex flex-col items-center gap-1 transition-all ${
            isActive ? 'text-neon' : 'text-slate-500'
          }`
        }
      >
        <Megaphone size={24} />
        <span className="text-[10px] font-bold uppercase tracking-[0.2em]">
          Feed
        </span>
      </NavLink>
    </div>
  );
};

export default BottomNav;