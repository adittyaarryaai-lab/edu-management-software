import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, BookOpen, CreditCard, Bell, LogOut } from 'lucide-react';

const Sidebar = ({ user, handleLogout }) => {
  // We added 'path' to each menu item to match our Routes in App.jsx
  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20}/>, roles: ['admin', 'teacher', 'student'] },
    { name: 'Students', path: '/students', icon: <Users size={20}/>, roles: ['admin', 'teacher'] },
    { name: 'Academic', path: '/academic', icon: <BookOpen size={20}/>, roles: ['admin', 'teacher'] },
    { name: 'Finance', path: '/finance', icon: <CreditCard size={20}/>, roles: ['admin', 'accountant'] },
    { name: 'Notices', path: '/notices', icon: <Bell size={20}/>, roles: ['admin', 'teacher', 'student', 'parent'] },
  ];

  // Filter menu items based on the logged-in user's role
  const filteredMenu = menuItems.filter(item => 
    item.roles.includes(user.role)
  );

  return (
    <div className="h-screen w-64 bg-slate-900 text-white flex flex-col p-4 fixed left-0 top-0 z-50 shadow-xl">
      <div className="mb-10 px-2">
        <h1 className="text-2xl font-black tracking-tight text-blue-400">EduFlowAI</h1>
        <p className="text-xs text-slate-400 font-medium">Enterprise Edition</p>
      </div>

      <nav className="flex-1 space-y-1">
        {filteredMenu.map((item) => (
          /* We replaced <button> with <NavLink> */
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) => 
              `flex items-center gap-3 w-full p-3 rounded-xl transition-all duration-200 ${
                isActive 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`
            }
          >
            {item.icon}
            <span className="font-medium">{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto pt-6 border-t border-slate-800">
        <div className="flex items-center gap-3 px-3 mb-6">
          <div className="h-8 w-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold text-xs">
            {user.name.charAt(0)}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-semibold truncate">{user.name}</p>
            <p className="text-[10px] uppercase text-slate-500 tracking-wider">{user.role}</p>
          </div>
        </div>
        
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 w-full p-3 text-red-400 hover:bg-red-900/20 rounded-xl transition-colors group"
        >
          <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;