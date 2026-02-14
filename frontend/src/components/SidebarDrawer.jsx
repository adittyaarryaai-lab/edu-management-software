import React from 'react';
import { X, User, ShieldCheck, LogOut, HelpCircle, Settings, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SidebarDrawer = ({ isOpen, onClose, user }) => {
    const navigate = useNavigate();

    if (!isOpen) return null;

    // Logout Function
    const handleLogout = () => {
        localStorage.removeItem('user');
        window.location.reload();
    };

    // Navigation Helper
    const handleNavigation = (path) => {
        navigate(path);
        onClose(); 
    };

    // UPDATED: Path ko alag-alag assign kiya hai
    const menuItems = [
        { icon: <User size={20}/>, label: 'My Account', color: 'text-blue-500', path: '/my-account' },
        { icon: <ShieldCheck size={20}/>, label: 'Security', color: 'text-green-500', path: '/settings' },
        { icon: <HelpCircle size={20}/>, label: 'Support & Help', color: 'text-orange-500', path: '/support' },
        { icon: <Settings size={20}/>, label: 'Settings', color: 'text-slate-500', path: '/settings' },
    ];

    return (
        <div className="fixed inset-0 z-[100] flex">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose}></div>
            
            {/* Drawer Content */}
            <div className="relative w-80 bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-left duration-300">
                
                {/* Profile Header Section */}
                <div className="nav-gradient p-8 pb-12 rounded-br-[3rem] text-white">
                    <div className="flex justify-between items-start mb-6">
                        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center border-2 border-white/40">
                            <User size={32} />
                        </div>
                        <button onClick={onClose} className="bg-white/10 p-2 rounded-xl active:scale-90 transition-all">
                            <X size={20} />
                        </button>
                    </div>
                    <h2 className="text-xl font-black truncate">{user?.name}</h2>
                    <p className="text-[10px] font-bold uppercase tracking-widest opacity-70 mt-1">
                        {user?.role === 'student' ? 'Roll No: 2501350071' : 'Employee ID: 9310'}
                    </p>
                </div>

                {/* Menu Options */}
                <div className="flex-1 p-6 space-y-2 overflow-y-auto">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 ml-2">Main Menu</p>
                    
                    {menuItems.map((item, i) => (
                        <button 
                            key={i} 
                            onClick={() => handleNavigation(item.path)}
                            className="w-full flex items-center justify-between p-4 hover:bg-slate-50 rounded-2xl transition-all group active:scale-95"
                        >
                            <div className="flex items-center gap-4">
                                <div className={`${item.color}`}>{item.icon}</div>
                                <span className="font-bold text-slate-700 text-sm">{item.label}</span>
                            </div>
                            <ChevronRight size={16} className="text-slate-300 group-hover:text-blue-500 transition-colors" />
                        </button>
                    ))}
                </div>

                {/* Footer Sign Out */}
                <div className="p-6 border-t border-slate-50">
                    <button 
                        onClick={handleLogout}
                        className="w-full bg-red-50 text-red-500 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 active:scale-95 transition-all"
                    >
                        <LogOut size={20} />
                        <span>Sign Out</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SidebarDrawer;