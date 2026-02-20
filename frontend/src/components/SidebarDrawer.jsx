import React from 'react';
import { X, User, ShieldCheck, LogOut, HelpCircle, Settings, ChevronRight, Cpu, LayoutDashboard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SidebarDrawer = ({ isOpen, onClose, user }) => {
    const navigate = useNavigate();

    if (!isOpen) return null;

    // Logout Function (UNCHANGED)
    const handleLogout = () => {
        localStorage.removeItem('user');
        window.location.reload();
    };

    // Navigation Helper (UNCHANGED)
    const handleNavigation = (path) => {
        navigate(path);
        onClose(); 
    };

    // PROBLEM 6 FIX: Role based menu items (SuperAdmin ke liye limited options)
    const menuItems = user?.role === 'superadmin' ? [
        { icon: <LayoutDashboard size={20}/>, label: 'Executive Hub', color: 'text-blue-400', path: '/superadmin/dashboard' },
        { icon: <User size={20}/>, label: 'Master Account', color: 'text-cyan-400', path: '/superadmin/account' },
        { icon: <Settings size={20}/>, label: 'Settings', color: 'text-slate-400', path: '/settings' },
    ] : [
        { icon: <User size={20}/>, label: 'My Account', color: 'text-cyan-400', path: '/my-account' },
        { icon: <ShieldCheck size={20}/>, label: 'Security', color: 'text-green-400', path: '/settings' },
        { icon: <HelpCircle size={20}/>, label: 'Support & Help', color: 'text-orange-400', path: '/support' },
        { icon: <Settings size={20}/>, label: 'Settings', color: 'text-slate-400', path: '/settings' },
    ];

    return (
        <div className="fixed inset-0 z-[100] flex">
            
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            ></div>
            
            {/* Drawer Content */}
            <div className="relative w-80 bg-gradient-to-br from-slate-800 via-slate-900 to-black h-full shadow-[0_20px_60px_rgba(0,0,0,0.6)] flex flex-col animate-in slide-in-from-left duration-300 border-r border-cyan-500/20 italic">

                {/* Animated Top Scan Line */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent animate-pulse"></div>

                {/* Profile Header Section */}
                <div className="p-8 pb-12 rounded-br-[3rem] text-white relative overflow-hidden border-b border-cyan-500/10">

                    <div className="flex justify-between items-start mb-6 relative z-10">
                        <div className="w-16 h-16 bg-cyan-500/20 rounded-full overflow-hidden flex items-center justify-center border border-cyan-400/40 backdrop-blur-md shadow-inner">
                            {user?.avatar ? (
                                <img 
                                    src={`http://localhost:5000${user.avatar}`} 
                                    alt="profile" 
                                    className="w-full h-full object-cover"
                                    onError={(e) => { e.target.src = 'https://cdn-icons-png.flaticon.com/512/149/149071.png'; }}
                                />
                            ) : (
                                <User size={32} className="text-cyan-300" />
                            )}
                        </div>

                        <button 
                            onClick={onClose} 
                            className="bg-white/10 p-2 rounded-xl border border-white/10 hover:bg-cyan-500/20 transition-all active:scale-90"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <h2 className="text-xl font-black truncate text-cyan-200 tracking-wide uppercase">
                        {user?.name}
                    </h2>

                    {/* PROBLEM 6 FIX: ID Label update (SuperAdmin ke liye Master ID) */}
                    <p className="text-[10px] font-bold uppercase tracking-[0.3em] opacity-60 mt-2 text-cyan-400">
                        {user?.role === 'superadmin' ? `Admin ID: ${user?.employeeId || '001'}` : 
                         user?.role === 'student' ? 'Roll No: 2501350071' : `Employee ID: ${user?.employeeId}`}
                    </p>

                    <div className="mt-4 flex items-center gap-2 text-[9px] uppercase tracking-[0.3em] text-cyan-300 opacity-70">
                        <Cpu size={12} className="animate-pulse" />
                        AI ENABLED
                    </div>
                </div>

                {/* Menu Options */}
                <div className="flex-1 p-6 space-y-2 overflow-y-auto">
                    <p className="text-[10px] font-black text-cyan-500/60 uppercase tracking-[0.4em] mb-4 ml-2">
                        {user?.role === 'superadmin' ? 'Root Terminal' : 'Main Menu'}
                    </p>
                    
                    {menuItems.map((item, i) => (
                        <button 
                            key={i} 
                            onClick={() => handleNavigation(item.path)}
                            className="w-full flex items-center justify-between p-4 bg-slate-900/60 hover:bg-cyan-500/10 border border-transparent hover:border-cyan-400/30 rounded-2xl transition-all group active:scale-95 backdrop-blur-md"
                        >
                            <div className="flex items-center gap-4">
                                <div className={`${item.color}`}>
                                    {item.icon}
                                </div>
                                <span className="font-bold text-slate-200 text-sm tracking-wide uppercase">
                                    {item.label}
                                </span>
                            </div>

                            <ChevronRight 
                                size={16} 
                                className="text-slate-500 group-hover:text-cyan-400 transition-colors"
                            />
                        </button>
                    ))}
                </div>

                {/* Footer Sign Out */}
                <div className="p-6 border-t border-cyan-500/10">
                    <button 
                        onClick={handleLogout}
                        className="w-full bg-red-500/10 text-red-400 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 border border-red-400/20 hover:bg-red-500/20 transition-all active:scale-95 backdrop-blur-md uppercase text-[10px] tracking-[0.2em]"
                    >
                        <LogOut size={20} />
                        <span>Terminate Session</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SidebarDrawer;