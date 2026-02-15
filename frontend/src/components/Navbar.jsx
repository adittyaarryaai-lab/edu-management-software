import React, { useState, useEffect } from 'react';
import { Bell, Menu, Search, Headphones, LogOut, Cpu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SidebarDrawer from './SidebarDrawer';

const Navbar = ({ user }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [greeting, setGreeting] = useState({ text: 'Good Morning', emoji: '☀️' });
  const navigate = useNavigate();

  // Dynamic Greeting Logic (UNCHANGED)
  useEffect(() => {
    const updateGreeting = () => {
      const hour = new Date().getHours();
      if (hour < 12) setGreeting({ text: 'Good Morning', emoji: '☀️' });
      else if (hour < 17) setGreeting({ text: 'Good Afternoon', emoji: '🌤️' });
      else if (hour < 21) setGreeting({ text: 'Good Evening', emoji: '👋' });
      else setGreeting({ text: 'Good Night', emoji: '🌙' });
    };

    updateGreeting();
    const interval = setInterval(updateGreeting, 900000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.reload();
  };

  return (
    <>
      {/* ROBOTIC PREMIUM HEADER */}
      <header className="bg-[#7E8694] text-white px-6 pt-8 pb-16 rounded-b-[3rem] shadow-lg relative z-50 overflow-hidden">

        {/* SCANNING LINE EFFECT */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent animate-pulse"></div>
        </div>

        {/* TOP BAR */}
        <div className="flex justify-between items-center mb-6 relative z-10">
          <div className="flex items-center gap-3">
            <Menu
              size={24}
              className="cursor-pointer text-white/80 hover:text-cyan-400 transition-all active:scale-90"
              onClick={() => setIsDrawerOpen(true)}
            />

            <div className="bg-cyan-500/20 p-2 rounded-xl border border-cyan-400/30 backdrop-blur-md shadow-inner">
              <Cpu size={14} className="text-cyan-300 animate-spin-slow" />
            </div>

            <span className="text-[10px] font-black tracking-[0.3em] uppercase text-cyan-200">
              ICLOUDEMS v2
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleLogout}
              title="Logout"
              className="bg-red-500/20 p-2 rounded-xl border border-red-400/30 hover:bg-red-500/30 transition-all active:scale-90"
            >
              <LogOut size={18} />
            </button>

            <div
              onClick={() => navigate('/notices')}
              className="bg-white/10 p-2 rounded-xl border border-white/10 backdrop-blur-md relative cursor-pointer hover:bg-cyan-500/20 transition-all active:scale-90"
            >
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 bg-red-500 w-2 h-2 rounded-full border border-slate-900"></span>
            </div>

            <div className="bg-white/10 p-2 rounded-xl border border-white/10 backdrop-blur-md hover:bg-cyan-500/20 transition-all active:scale-90">
              <Headphones size={18} />
            </div>
          </div>
        </div>

        {/* GREETING + SEARCH */}
        <div className="mt-2 text-left relative z-10">
          <h2 className="text-2xl font-black tracking-tight">
            {greeting.text} {greeting.emoji}{' '}
            <span className="text-cyan-200">
              {user?.name?.split(' ')[0]}
            </span>
          </h2>

          <span className="inline-block mt-2 px-4 py-1 bg-cyan-500/20 border border-cyan-400/30 rounded-full text-[9px] font-black uppercase tracking-[0.3em] text-cyan-200">
            {user?.role} PORTAL
          </span>

          <div className="mt-6 relative">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-300"
              size={18}
            />
            <input
              type="text"
              placeholder="Search modules..."
              className="w-full bg-slate-900/70 border border-cyan-400/20 text-cyan-100 py-4 pl-12 pr-4 rounded-2xl shadow-inner outline-none placeholder:text-cyan-300/50 focus:border-cyan-400 focus:bg-slate-900 transition-all font-medium text-sm"
            />
          </div>
        </div>
      </header>

      <SidebarDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        user={user}
      />
    </>
  );
};

export default Navbar;
