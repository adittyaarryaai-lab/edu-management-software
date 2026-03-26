import React from 'react';
import { Wallet, FileText, PieChart, AlertCircle, Clock, PlusCircle, User, ShieldCheck, HelpCircle, Settings, LayoutDashboard, Users, X, Cpu, ChevronRight, LogOut, CreditCard, Layers } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SidebarDrawer = ({ isOpen, onClose, user }) => {
    const navigate = useNavigate();

    if (!isOpen) return null;

    const handleLogout = () => {
        localStorage.removeItem('user');
        window.location.reload();
    };

    const handleNavigation = (path) => {
        navigate(path);
        onClose();
    };

    const menuItems = user?.role === 'superadmin' ? [
        { icon: <LayoutDashboard size={20} />, label: 'Executive Hub', color: 'text-neon', path: '/superadmin/dashboard' },
        { icon: <User size={20} />, label: 'Master Account', color: 'text-neon', path: '/superadmin/account' },
        { icon: <Settings size={20} />, label: 'Settings', color: 'text-white/40', path: '/settings' },
    ] : user?.role === 'finance' ? [
        // --- DAY 98: FINANCE TEACHER SIDEBAR (POINT 8) ---
        { icon: <User size={20} />, label: 'My Account', color: 'text-neon', path: '/my-account' },
        { icon: <LayoutDashboard size={20} />, label: 'Dashboard', color: 'text-neon', path: '/finance/dashboard' },
        { icon: <Layers size={20} />, label: 'Fee Configuration', color: 'text-cyan-400', path: '/finance/fee-setup' },
        { icon: <Users size={20} />, label: 'Students Fees', color: 'text-neon', path: '/finance/fees' },
        { icon: <PlusCircle size={20} />, label: 'Add Payment', color: 'text-cyan-400', path: '/finance/add-payment' },
        { icon: <FileText size={20} />, label: 'Receipts', color: 'text-neon', path: '/finance/receipts' },
        { icon: <Clock size={20} />, label: 'Installments', color: 'text-neon', path: '/finance/installments' },
        { icon: <AlertCircle size={20} />, label: 'Pending Fees', color: 'text-rose-500', path: '/finance/pending' },
        { icon: <PieChart size={20} />, label: 'Reports', color: 'text-neon', path: '/finance/reports' },
        { icon: <ShieldCheck size={20} />, label: 'Security', color: 'text-neon', path: '/settings' },
    ] : user?.role === 'student' ? [
        // --- DAY 99: STUDENT SIDEBAR ---
        { icon: <User size={20} />, label: 'My Account', color: 'text-neon', path: '/my-account' },
        { icon: <CreditCard size={20} />, label: 'My Fees', color: 'text-neon', path: '/student/fees' },
        { icon: <ShieldCheck size={20} />, label: 'Security', color: 'text-neon', path: '/settings' },
        { icon: <HelpCircle size={20} />, label: 'Support', color: 'text-neon', path: '/support' },
    ] : [
        // Normal Teacher/Student Sidebar
        { icon: <User size={20} />, label: 'My Account', color: 'text-neon', path: '/my-account' },
        { icon: <ShieldCheck size={20} />, label: 'Security', color: 'text-neon', path: '/settings' },
        { icon: <HelpCircle size={20} />, label: 'Support & Help', color: 'text-neon', path: '/support' },
        { icon: <Settings size={20} />, label: 'Settings', color: 'text-white/40', path: '/settings' },
    ];

    return (
        <div className="fixed inset-0 z-[100] flex">

            <div
                className="absolute inset-0 bg-void/80 backdrop-blur-md"
                onClick={onClose}
            ></div>

            <div className="relative w-80 bg-void h-full shadow-[20px_0_60px_rgba(0,0,0,0.8)] flex flex-col animate-in slide-in-from-left duration-300 border-r border-neon/20 italic">

                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-neon/60 to-transparent animate-pulse"></div>

                <div className="p-8 pb-12 rounded-br-[3rem] text-white relative overflow-hidden border-b border-neon/10 bg-gradient-to-b from-neon/5 to-transparent">

                    <div className="flex justify-between items-start mb-6 relative z-10">
                        <div className="w-16 h-16 bg-neon/10 rounded-full overflow-hidden flex items-center justify-center border border-neon/40 backdrop-blur-md shadow-[0_0_20px_rgba(61,242,224,0.2)]">
                            {user?.avatar ? (
                                <img
                                    src={`http://localhost:5000${user.avatar}`} alt="profile" className="w-full h-full object-cover" onError={(e) => { e.target.src = 'https://cdn-icons-png.flaticon.com/512/149/149071.png'; }}
                                />
                            ) : (
                                <User size={32} className="text-neon" />
                            )}
                        </div>

                        <button
                            onClick={onClose}
                            className="bg-white/5 p-2 rounded-xl border border-white/10 hover:bg-neon/20 transition-all active:scale-90"
                        >
                            <X size={20} className="text-white/70" />
                        </button>
                    </div>

                    <h2 className="text-xl font-black truncate text-white tracking-wide uppercase italic">
                        {user?.name}
                    </h2>

                    {/* --- DAY 124: DYNAMIC ENROLLMENT NO SYNC --- */}
                    <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-neon/60 mt-2">
                        {user?.role === 'superadmin' ? `Admin ID: ${user?.employeeId || '001'}` :
                            user?.role === 'student' ? `Enrollment No: ${user?.enrollmentNo || 'NOT ASSIGNED'}` :
                                `Employee ID: ${user?.employeeId}`}
                    </p>

                    <div className="mt-4 flex items-center gap-2 text-[9px] uppercase tracking-[0.3em] text-neon/40 font-black">
                        <Cpu size={12} className="animate-pulse" />
                        System Secured
                    </div>
                </div>

                <div className="flex-1 p-6 space-y-2 overflow-y-auto">
                    <p className="text-[10px] font-black text-neon/30 uppercase tracking-[0.4em] mb-4 ml-2 italic">
                        {user?.role === 'superadmin' ? 'Root Terminal' : 'Main Menu'}
                    </p>

                    {menuItems.map((item, i) => (
                        <button
                            key={i}
                            onClick={() => handleNavigation(item.path)}
                            className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-neon/10 border border-transparent hover:border-neon/30 rounded-2xl transition-all group active:scale-95 backdrop-blur-md"
                        >
                            <div className="flex items-center gap-4">
                                <div className={`${item.color}`}>
                                    {item.icon}
                                </div>
                                <span className="font-bold text-white/80 text-sm tracking-wide uppercase italic">
                                    {item.label}
                                </span>
                            </div>

                            <ChevronRight
                                size={16}
                                className="text-white/20 group-hover:text-neon transition-colors"
                            />
                        </button>
                    ))}
                </div>

                <div className="p-6 border-t border-neon/10">
                    <button
                        onClick={handleLogout}
                        className="w-full bg-red-500/10 text-red-500 py-4 rounded-2xl font-black flex items-center justify-center gap-2 border border-red-500/20 hover:bg-red-500/20 transition-all active:scale-95 backdrop-blur-md uppercase text-[10px] tracking-[0.2em] italic"
                    >
                        <LogOut size={20} />
                        <span>Logout</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SidebarDrawer;