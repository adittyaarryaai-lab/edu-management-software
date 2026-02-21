import React, { useState, useEffect } from 'react';
import { Bell, Menu, Search, Headphones, LogOut, Cpu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SidebarDrawer from './SidebarDrawer';
import API from '../api'; 

const Navbar = ({ user }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [greeting, setGreeting] = useState({ text: 'Good Morning', emoji: '☀️' });
  const [unreadCount, setUnreadCount] = useState(0); 
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || !user.token) return;

    const fetchUnreadCount = async () => {
      const backup = localStorage.getItem('superadmin_backup');
      if (user?.role === 'admin' && backup) return; 
      if (user?.role === 'admin' || user?.role === 'superadmin') return;

      try {
        const { data } = await API.get('/notices/my-notices');
        setUnreadCount(data.unreadCount || 0);
      } catch (err) {
        if (err.response?.status !== 401) {
          console.error("Notification Fetch Error:", err);
        }
      }
    };

    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 60000);
    return () => clearInterval(interval);
  }, [user]);

  const handleBellClick = async () => {
      try {
          if (user?.role === 'superadmin') return;
          if (user?.role !== 'admin' && unreadCount > 0) {
              await API.put('/notices/mark-all-read'); 
              setUnreadCount(0);
          }
          navigate('/notice-feed'); 
      } catch (err) {
          console.error("Redirect error:", err);
          navigate('/notice-feed');
      }
  };

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
    const backup = localStorage.getItem('superadmin_backup');
    if (backup) {
        localStorage.setItem('user', backup);
        localStorage.removeItem('superadmin_backup');
        window.location.href = '/superadmin/dashboard';
    } else {
        localStorage.removeItem('user');
        window.location.reload();
    }
  };
  

  return (
    <>
      <header className="bg-void text-white px-6 pt-8 pb-16 rounded-b-[3rem] shadow-[0_10px_30px_rgba(0,0,0,0.5)] border-b border-neon/20 relative z-50 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-neon/60 to-transparent animate-pulse"></div>
        </div>

        <div className="flex justify-between items-center mb-6 relative z-10">
          <div className="flex items-center gap-3">
            <Menu
              size={24}
              className="cursor-pointer text-white/80 hover:text-neon transition-all active:scale-90"
              onClick={() => setIsDrawerOpen(true)}
            />
            <div className="bg-neon/10 p-2 rounded-xl border border-neon/30 backdrop-blur-md shadow-inner">
              <Cpu size={14} className="text-neon animate-spin-slow" />
            </div>
            <span className="text-[10px] font-black tracking-[0.3em] uppercase text-neon/80">
              EDUFLOWAI v2
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleLogout}
              className={`${localStorage.getItem('superadmin_backup') ? 'bg-orange-500/20 border-orange-400/30' : 'bg-red-500/20 border-red-400/30'} p-2 rounded-xl border transition-all active:scale-90`}
              title={localStorage.getItem('superadmin_backup') ? 'Return to SuperAdmin' : 'Logout'}
            >
              <LogOut size={18} className={localStorage.getItem('superadmin_backup') ? 'text-orange-400' : 'text-red-400'} />
            </button>

            {user?.role !== 'superadmin' && (
              <div
                onClick={handleBellClick}
                className="bg-white/5 p-2 rounded-xl border border-white/10 backdrop-blur-md relative cursor-pointer hover:bg-neon/20 transition-all active:scale-90"
              >
                <Bell size={18} className="text-white/80" />
                {user?.role !== 'admin' && unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-void animate-bounce shadow-[0_0_10px_rgba(239,68,68,0.5)]">
                    {unreadCount}
                  </span>
                )}
              </div>
            )}

            <div className="bg-white/5 p-2 rounded-xl border border-white/10 backdrop-blur-md hover:bg-neon/20 transition-all active:scale-90">
              <Headphones size={18} className="text-white/80" />
            </div>
          </div>
        </div>

        <div className="mt-2 text-left relative z-10">
          <h2 className="text-2xl font-black tracking-tight italic">
            {greeting.text} {greeting.emoji}{' '}
            <span className="text-neon">
              {user?.name?.split(' ')[0]}
            </span>
          </h2>
          <span className="inline-block mt-2 px-4 py-1 bg-neon/10 border border-neon/30 rounded-full text-[9px] font-black uppercase tracking-[0.3em] text-neon italic">
            {user?.role} PORTAL
          </span>
          <div className="mt-6 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neon/60" size={18} />
            <input
              type="text"
              placeholder="SEARCH NEURAL MODULES..."
              className="w-full bg-slate-900/50 border border-neon/20 text-white py-4 pl-12 pr-4 rounded-2xl shadow-inner outline-none placeholder:text-neon/30 focus:border-neon focus:bg-slate-900 transition-all font-black text-[10px] tracking-widest"
            />
          </div>
        </div>
      </header>

      <SidebarDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} user={user} />
    </>
  );
};

export default Navbar;