import React from 'react';
import { Home, QrCode, Megaphone } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const BottomNav = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 px-10 flex justify-between items-center z-40 rounded-t-[2.5rem] shadow-[0_-15px_40px_rgba(0,0,0,0.06)] h-24 pb-2">
      <NavLink
        to="/dashboard"
        className={({ isActive }) =>
          `flex flex-col items-center gap-1 transition-all ${
            isActive ? 'text-[#42A5F5]' : 'text-slate-400'
          }`
        }
      >
        <Home size={26} />
        <span className="text-[11px] font-black italic capitalize">Home</span>
      </NavLink>

      {/* CENTER SCAN BUTTON */}
      {/* CENTER SCAN BUTTON */}
      <div className="relative -top-6 flex flex-col items-center">
        <div className="relative group">
          {/* Soft Blue Glow Effect */}
          <div className="absolute inset-0 rounded-full bg-[#42A5F5]/30 blur-2xl group-active:blur-lg transition-all"></div>

          <div className="relative bg-[#42A5F5] text-white p-5 rounded-full shadow-[0_10px_25px_rgba(66,165,245,0.4)] border-[6px] border-white active:scale-90 transition-all cursor-pointer">
            <QrCode size={28} />
          </div>
        </div>

        <span className="mt-1 text-slate-500 text-[10px] font-black italic uppercase tracking-widest">Scan QR</span>
      </div>

      {/* FEED */}
      <NavLink
        to="/notice-feed"
        className={({ isActive }) =>
          `flex flex-col items-center gap-1 transition-all ${
            isActive ? 'text-[#42A5F5]' : 'text-slate-400'
          }`
        }
      >
        <Megaphone size={26} />
        <span className="text-[11px] font-black italic capitalize">Feed</span>
      </NavLink>
    </div>
  );
};
export default BottomNav;