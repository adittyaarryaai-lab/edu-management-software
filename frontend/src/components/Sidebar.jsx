import React from 'react';
import { LayoutDashboard, Users, BookOpen, CreditCard, Bell, LogOut } from 'lucide-react';

const Sidebar = ({ user, handleLogout }) => {
  const menuItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20}/>, roles: ['admin', 'teacher', 'student'] },
    { name: 'Students', icon: <Users size={20}/>, roles: ['admin', 'teacher'] },
    { name: 'Academic', icon: <BookOpen size={20}/>, roles: ['admin', 'teacher'] },
    { name: 'Finance', icon: <CreditCard size={20}/>, roles: ['admin', 'accountant'] },
    { name: 'Notices', icon: <Bell size={20}/>, roles: ['all'] },
  ];

  return (
    <div className="h-screen w-64 bg-slate-900 text-white flex flex-col p-4 fixed left-0 top-0">
      <h1 className="text-2xl font-bold text-blue-400 mb-8">EduFlowAI</h1>
      <nav className="flex-1">
        {menuItems.map((item) => (
          <button key={item.name} className="flex items-center gap-3 w-full p-3 hover:bg-slate-800 rounded-lg mb-1 transition">
            {item.icon}
            <span>{item.name}</span>
          </button>
        ))}
      </nav>
      <button 
        onClick={handleLogout}
        className="flex items-center gap-3 p-3 text-red-400 hover:bg-red-900/20 rounded-lg mt-auto"
      >
        <LogOut size={20}/>
        <span>Logout</span>
      </button>
    </div>
  );
};

export default Sidebar;