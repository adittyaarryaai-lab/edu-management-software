import React from 'react';
import { Home, QrCode, Megaphone } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const BottomNav = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 px-8 py-2 flex justify-between items-center z-50 rounded-t-[2.5rem] shadow-[0_-10px_40px_rgba(0,0,0,0.05)] h-20">
      {/* HOME */}
      <NavLink
        to="/dashboard"
        className={({ isActive }) =>
          `flex flex-col items-center gap-1 transition-all ${isActive ? 'text-[#2196F3]' : 'text-slate-400'
          }`
        }
      >
        <Home size={24} />
        <span className="text-[11px] font-bold">Home</span>
      </NavLink>

      {/* CENTER SCAN BUTTON */}
      {/* CENTER SCAN BUTTON */}
      <div className="relative -top-10 flex flex-col items-center">
        <div className="relative">
          {/* Soft Blue Glow */}
          <div className="absolute inset-0 rounded-full bg-blue-400/20 blur-xl"></div>

          <div className="relative bg-[#42A5F5] text-white p-5 rounded-full shadow-lg border-4 border-white active:scale-95 transition-all cursor-pointer">
            <QrCode size={28} />
          </div>
        </div>

        <span className="mt-2 text-slate-500 text-[11px] font-bold">Scan QR</span>
      </div>

      {/* FEED */}
      <NavLink
        to="/notice-feed"
        className={({ isActive }) =>
          `flex flex-col items-center gap-1 transition-all ${isActive ? 'text-[#2196F3]' : 'text-slate-400'
          }`
        }
      >
        <Megaphone size={24} />
        <span className="text-[11px] font-bold">Feed</span>
      </NavLink>
    </div>
  );
};

export default BottomNav;