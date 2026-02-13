import React from 'react';
import { Bell, Menu, Search, Headphones } from 'lucide-react';

const Navbar = ({ user }) => {
  return (
    <header className="nav-gradient text-white px-6 pt-8 pb-16 rounded-b-[3rem] shadow-xl relative">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <Menu size={24} className="opacity-90" />
          <div className="bg-white/20 p-1 rounded-lg">
            <img src="https://via.placeholder.com/30" alt="logo" className="rounded" />
          </div>
          <span className="text-xs font-bold tracking-widest opacity-80">iCloudEMS v2</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-white/10 p-2 rounded-full"><Search size={20} /></div>
          <div className="bg-white/10 p-2 rounded-full relative">
            <Bell size={20} />
            <span className="absolute top-1 right-1 bg-red-500 w-2 h-2 rounded-full border border-blue-500"></span>
          </div>
          <div className="bg-white/10 p-2 rounded-full"><Headphones size={20} /></div>
        </div>
      </div>
      
      <div className="mt-4">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          Good Evening 👋 {user?.name?.split(' ')[0]}
        </h2>
        <div className="mt-4 relative">
            <Search className="absolute left-4 top-3.5 text-slate-400" size={18} />
            <input 
                type="text" 
                placeholder="Search modules..." 
                className="w-full bg-white text-slate-800 py-3.5 pl-12 pr-4 rounded-2xl shadow-inner outline-none placeholder:text-slate-400"
            />
        </div>
      </div>
    </header>
  );
};

export default Navbar;