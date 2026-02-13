import React from 'react';
import { Bell, Menu, Search, Headphones, LogOut } from 'lucide-react';

const Navbar = ({ user }) => {
  
  // Memory clear karne ke liye function
  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.reload(); // Page reload hote hi Mock Login wapas aa jayega
  };

  return (
    <header className="nav-gradient text-white px-6 pt-8 pb-16 rounded-b-[3rem] shadow-xl relative z-50">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <Menu size={24} className="opacity-90 cursor-pointer active:scale-90 transition-all" />
          <div className="bg-white/20 p-1.5 rounded-xl backdrop-blur-sm">
             <span className="text-[10px] font-black italic">Edu</span>
          </div>
          <span className="text-[10px] font-bold tracking-widest opacity-80 uppercase">iCloudEMS v2</span>
        </div>
        <div className="flex items-center gap-3">
          {/* Logout Button added to fix your Role Switching issue */}
          <button 
            onClick={handleLogout}
            title="Logout to switch role"
            className="bg-red-500/20 p-2 rounded-xl backdrop-blur-md active:scale-90 transition-all border border-white/10"
          >
            <LogOut size={18} className="text-white" />
          </button>
          
          <div className="bg-white/10 p-2 rounded-xl backdrop-blur-md active:scale-90 transition-all">
            <Bell size={18} />
            <span className="absolute top-2 right-2 bg-red-500 w-2 h-2 rounded-full border-2 border-blue-500"></span>
          </div>
          <div className="bg-white/10 p-2 rounded-xl backdrop-blur-md active:scale-90 transition-all"><Headphones size={18} /></div>
        </div>
      </div>
      
      <div className="mt-2">
        <h2 className="text-2xl font-bold tracking-tight">
          Good Evening 👋 <span className="text-white/90">{user?.name?.split(' ')[0]}</span>
        </h2>
        {/* Role Badge for testing */}
        <span className="inline-block mt-1 px-3 py-0.5 bg-white/20 rounded-full text-[10px] font-bold uppercase tracking-widest">
          {user?.role} Portal
        </span>
        
        <div className="mt-5 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
                type="text" 
                placeholder="Search modules..." 
                className="w-full bg-white text-slate-800 py-4 pl-12 pr-4 rounded-2xl shadow-lg outline-none placeholder:text-slate-400 font-medium text-sm"
            />
        </div>
      </div>
    </header>
  );
};

export default Navbar;