import React from 'react';
import { Bell, Menu, Search, Headphones } from 'lucide-react';

const Navbar = ({ user }) => {
  return (
    <header className="nav-gradient text-white px-6 pt-8 pb-16 rounded-b-[3rem] shadow-xl relative z-50">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <Menu size={24} className="opacity-90 cursor-pointer active:scale-90 transition-all" />
          <div className="bg-white/20 p-1.5 rounded-xl backdrop-blur-sm">
             {/* Small logo text or icon */}
             <span className="text-[10px] font-black italic">Edu</span>
          </div>
          <span className="text-[10px] font-bold tracking-widest opacity-80 uppercase">iCloudEMS v2</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-white/10 p-2 rounded-xl backdrop-blur-md active:scale-90 transition-all"><Search size={18} /></div>
          <div className="bg-white/10 p-2 rounded-xl backdrop-blur-md relative active:scale-90 transition-all">
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