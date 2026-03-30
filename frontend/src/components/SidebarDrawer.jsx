import React, { useState, useEffect } from 'react';
import { Wallet, FileText, PieChart, AlertCircle, Clock, PlusCircle, User, ShieldCheck, HelpCircle, Settings, LayoutDashboard, Users, X, Cpu, ChevronRight, LogOut, CreditCard, Layers, Check, CheckSquare, CalendarDays, Video, Bot, Megaphone, MessageCircle,  Calendar, TrendingUp, GraduationCap, Book } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const SidebarDrawer = ({ isOpen, onClose, user }) => {
    const navigate = useNavigate();
    // --- DAY 134: BACKGROUND SCROLL LOCK PROTOCOL ---
    useEffect(() => {
        if (isOpen) {
            // Background scroll disable
            document.body.style.overflow = 'hidden';
        } else {
            // Background scroll enable
            document.body.style.overflow = 'unset';
        }

        // Cleanup function: Agar component unmount ho jaye toh scroll wapas on ho jaye
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);
    const [showConfirm, setShowConfirm] = useState(false);

    if (!isOpen) return null;

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

    const handleNavigation = (path) => {
        navigate(path);
        onClose();
    };
    const menuItems = user?.role === 'superadmin' ? [
        { icon: <LayoutDashboard size={20} />, label: 'Executive Hub', color: 'text-neon', path: '/superadmin/dashboard' },
        { icon: <User size={20} />, label: 'Master Account', color: 'text-neon', path: '/superadmin/account' },
        { icon: <Settings size={20} />, label: 'Settings', color: 'text-white/40', path: '/settings' },
    ] : user?.role === 'finance' ? [
        { icon: <User size={20} />, label: 'My Account', color: 'text-white/40', path: '/my-account' },
        { icon: <LayoutDashboard size={20} />, label: 'Dashboard', color: 'text-neon', path: '/finance/dashboard' },
        { icon: <PlusCircle size={20} />, label: 'Add Payment', color: 'text-cyan-400', path: '/finance/add-payment' },
        { icon: <FileText size={20} />, label: 'Finance Reports', color: 'text-neon', path: '/finance/reports' },
        { icon: <Users size={20} />, label: 'Fees Tracker', color: 'text-orange-400', path: '/finance/fees-tracker' },
        { icon: <Layers size={20} />, label: 'Fee Setup', color: 'text-neon', path: '/finance/fee-setup' },
        { icon: <ShieldCheck size={20} />, label: 'Payment Gateway', color: 'text-emerald-400', path: '/finance/gateway' },
        { icon: <ShieldCheck size={20} />, label: 'Setting', color: 'text-neon', path: '/settings' },
    ] : user?.role === 'teacher' ? [
        // --- DAY 136: SYNCED TEACHER MODULES ---
        { icon: <User size={20} />, label: 'My Account', color: 'text-white/40', path: '/my-account' },
        { icon: <LayoutDashboard size={20} />, label: 'Dashboard', color: 'text-neon', path: '/teacher/dashboard' },
        { icon: <CheckSquare size={20} />, label: 'Attendance', color: 'text-neon', path: '/teacher/attendance' },
        { icon: <CalendarDays size={20} />, label: 'Schedule', color: 'text-neon', path: '/timetable' },
        { icon: <PlusCircle size={20} />, label: 'Assignments', color: 'text-neon', path: '/teacher/assignments' },
        { icon: <Users size={20} />, label: 'Class List', color: 'text-neon', path: '/teacher/students' },
        { icon: <Video size={20} />, label: 'Live Class', color: 'text-neon', path: '/teacher/live-class' },
        { icon: <Bot size={20} />, label: 'Broadcast', color: 'text-neon', path: '/teacher/notices' },
        { icon: <Megaphone size={20} />, label: 'Notice Feed', color: 'text-neon', path: '/notice-feed' },
        { icon: <MessageCircle size={20} />, label: 'Support', color: 'text-neon', path: '/teacher/support' },
        { icon: <Layers size={20} />, label: 'Syllabus', color: 'text-neon', path: '/teacher/upload-syllabus' },
        { icon: <ShieldCheck size={20} />, label: 'Setting', color: 'text-neon', path: '/settings' },   
    ] : user?.role === 'student' ? [
        { icon: <User size={20} />, label: 'My Account', color: 'text-neon', path: '/my-account' },
        { icon: <LayoutDashboard size={20} />, label: 'Dashboard', color: 'text-neon', path: '/' },
        { icon: <Calendar size={20} />, label: 'Attendance', color: 'text-neon', path: '/attendance' },
        { icon: <Clock size={20} />, label: 'TimeTable', color: 'text-neon', path: '/timetable' },
        { icon: <CreditCard size={20} />, label: 'My Fees', color: 'text-neon', path: '/student/fees' },
        { icon: <Megaphone size={20} />, label: 'Notice Board', color: 'text-neon', path: '/notice-feed' },
        { icon: <FileText size={20} />, label: 'Assignments', color: 'text-white/60', path: '/assignments' },
        { icon: <TrendingUp size={20} />, label: 'Performance', color: 'text-white/60', path: '/performance' },
        { icon: <GraduationCap size={20} />, label: 'Exams', color: 'text-white/60', path: '/exams' },
        { icon: <Book size={20} />, label: 'Library', color: 'text-white/60', path: '/library' },
        { icon: <Video size={20} />, label: 'Live Class', color: 'text-white/60', path: '/live-class' },
        { icon: <HelpCircle size={20} />, label: 'Support', color: 'text-neon', path: '/support' },
        { icon: <ShieldCheck size={20} />, label: 'Setting', color: 'text-neon', path: '/settings' },
    ] : [
        { icon: <User size={20} />, label: 'My Account', color: 'text-neon', path: '/my-account' },
        { icon: <ShieldCheck size={20} />, label: 'Security', color: 'text-neon', path: '/settings' },
        { icon: <Settings size={20} />, label: 'Settings', color: 'text-white/40', path: '/settings' },
    ];

    return (
        <>
            <div className="fixed inset-0 z-[100] flex">
                {/* Dashboard Overlay / Blur */}
                <div className="absolute inset-0 bg-void/80 backdrop-blur-md" onClick={onClose}></div>

                {/* Sidebar Menu */}
                <div className="relative w-80 bg-void h-full shadow-[20px_0_60px_rgba(0,0,0,0.8)] flex flex-col border-r border-neon/20 italic overflow-y-auto max-h-screen">
                    <div className="p-8 pb-12 rounded-br-[3rem] text-white relative overflow-hidden border-b border-neon/10 bg-gradient-to-b from-neon/5 to-transparent">
                        <div className="flex justify-between items-start mb-6 relative z-10">
                            <div className="w-16 h-16 bg-neon/10 rounded-full overflow-hidden flex items-center justify-center border border-neon/40 backdrop-blur-md shadow-[0_0_20px_rgba(61,242,224,0.2)]">
                                {user?.avatar ? (
                                    <img src={`http://localhost:5000${user.avatar}`} alt="profile" className="w-full h-full object-cover" />
                                ) : (
                                    <User size={32} className="text-neon" />
                                )}
                            </div>
                            <button onClick={onClose} className="bg-white/5 p-2 rounded-xl border border-white/10 hover:bg-neon/20 transition-all active:scale-90">
                                <X size={20} className="text-white/70" />
                            </button>
                        </div>
                        <h2 className="text-xl font-black truncate text-white tracking-wide uppercase italic">{user?.name}</h2>
                        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-neon/60 mt-2">
                            {user?.role === 'student' ? `Enrollment No: ${user?.enrollmentNo}` : `ID: ${user?.employeeId || '001'}`}
                        </p>
                    </div>

                    <div className="flex-1 p-6 space-y-2 overflow-y-auto">
                        <p className="text-[10px] font-black text-neon/30 uppercase tracking-[0.4em] mb-4 ml-2 italic">Main Menu</p>
                        {menuItems.map((item, i) => (
                            <button key={i} onClick={() => handleNavigation(item.path)} className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-neon/10 border border-transparent hover:border-neon/30 rounded-2xl transition-all group active:scale-95">
                                <div className="flex items-center gap-4">
                                    <div className={`${item.color}`}>{item.icon}</div>
                                    <span className="font-bold text-white/80 text-sm tracking-wide uppercase italic">{item.label}</span>
                                </div>
                                <ChevronRight size={16} className="text-white/20 group-hover:text-neon transition-colors" />
                            </button>
                        ))}
                    </div>

                    <div className="p-6 border-t border-neon/10">
                        <button
                            onClick={() => setShowConfirm(true)}
                            className="w-full bg-red-500/10 text-red-500 py-4 rounded-2xl font-black flex items-center justify-center gap-2 border border-red-500/20 hover:bg-red-500/20 transition-all active:scale-95 backdrop-blur-md uppercase text-[10px] tracking-[0.2em] italic"
                        >
                            <LogOut size={20} />
                            <span>Logout</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* --- LOGOUT CONFIRMATION MODAL (CENTERED & BLURRED) --- */}
            <AnimatePresence>
                {showConfirm && (
                    <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
                        {/* Instant Dark Overlay with Heavy Blur */}
                        <motion.div 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-void/90 backdrop-blur-xl"
                        />
                        
                        {/* Modal Box */}
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="relative w-full max-w-sm bg-slate-900 border-2 border-red-500/30 p-10 rounded-[3rem] shadow-[0_0_80px_rgba(239,68,68,0.2)] text-center italic"
                        >
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent"></div>
                            
                            <div className="p-6 bg-red-500/10 rounded-full inline-block mb-6 border border-red-500/20">
                                <AlertCircle size={48} className="text-red-500 animate-pulse" />
                            </div>
                            
                            <h3 className="text-2xl font-black uppercase tracking-tighter text-white">Confirm Logout</h3>
                            <p className="text-[10px] text-white/40 uppercase font-bold mt-4 tracking-widest leading-relaxed">
                               Are you sure you want to log out?
                            </p>

                            <div className="grid grid-cols-2 gap-4 mt-12">
                                <button 
                                    onClick={() => setShowConfirm(false)} 
                                    className="py-5 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase text-white/60 hover:bg-white/10 transition-all active:scale-95"
                                >
                                    No
                                </button>
                                <button 
                                    onClick={handleLogout} 
                                    className="py-5 bg-red-500 text-white rounded-2xl text-[10px] font-black uppercase shadow-[0_15px_30px_rgba(239,68,68,0.4)] hover:bg-red-400 transition-all active:scale-95"
                                >
                                    Yes
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
};

export default SidebarDrawer;