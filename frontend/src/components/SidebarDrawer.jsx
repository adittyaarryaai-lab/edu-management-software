import React, { useState, useEffect } from 'react';
import { Wallet, FileText, PieChart, AlertCircle, Clock, PlusCircle, User, ShieldCheck, HelpCircle, Settings, LayoutDashboard, Users, X, Cpu, ChevronRight, LogOut, CreditCard, Layers, Check, CheckSquare, CalendarDays, Video, Bot, Megaphone, MessageCircle, Calendar, TrendingUp, GraduationCap, Book } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import '../App.css';


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
        { icon: <ShieldCheck size={20} />, label: 'Technical Logs', color: 'text-cyan-400', path: '/superadmin/technical-logs' },
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
        // { icon: <LayoutDashboard size={20} />, label: 'Dashboard', color: 'text-neon', path: '/' },
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

                {/* Sidebar Menu Main Container */}
                <div className="relative w-80 bg-[#F8FAFC] h-full shadow-[20px_0_60px_rgba(0,0,0,0.2)] flex flex-col border-r border-slate-100 italic overflow-hidden">

                    {/* --- STEP 1: PREMIUM LIGHT BLUE HEADER (Fixed at Top) --- */}
                    <div className="p-6 pb-8 bg-gradient-to-br from-[#42A5F5] to-[#1E88E5] rounded-br-[3rem] relative shadow-lg shrink-0">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-16 h-16 bg-white p-1 rounded-full shadow-xl">
                                <div className="w-full h-full rounded-full overflow-hidden bg-slate-100 flex items-center justify-center">
                                    {user?.avatar ? (
                                        <img src={`http://localhost:5000${user.avatar}`} alt="profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <User size={30} className="text-[#42A5F5]" />
                                    )}
                                </div>
                            </div>
                            <div className="flex-1 overflow-hidden text-left">
                                <h2 className="text-[20px] font-black text-white truncate drop-shadow-sm">
                                    {user?.name?.split(' ').map(n => n.charAt(0).toUpperCase() + n.slice(1).toLowerCase()).join(' ')}
                                </h2>
                                <p className="text-[15px] font-bold text-white/80 tracking-wider">
                                    {user?.role === 'student' ? user?.enrollmentNo : user?.employeeId || 'ID: 001'}
                                </p>
                            </div>
                            {/* <button onClick={onClose} className="bg-white/20 p-2 rounded-xl backdrop-blur-md text-white active:scale-90 transition-all">
                                <ChevronRight size={20} className="rotate-180" />
                            </button> */}
                        </div>

                        {/* --- ACTION BUTTONS (ACCOUNT, SUPPORT, LOGOUT) --- */}
                        <div className="grid grid-cols-3 gap-2 bg-white/10 backdrop-blur-md p-3 rounded-[2rem] border border-white/20">

                            <button onClick={() => handleNavigation('/my-account')} className="flex flex-col items-center gap-1 group">
                                <div className="bg-white text-[#42A5F5] p-2.5 rounded-full shadow-md active:scale-90 transition-all"><User size={18} /></div>
                                <span className="text-[15px] font-bold text-white">Account</span>
                            </button>
                            <button onClick={() => handleNavigation('/support')} className="flex flex-col items-center gap-1 group">
                                <div className="bg-white text-[#42A5F5] p-2.5 rounded-full shadow-md active:scale-90 transition-all"><HelpCircle size={18} /></div>
                                <span className="text-[15px] font-bold text-white">Support</span>
                            </button>
                            <button onClick={() => handleNavigation('/settings')} className="flex flex-col items-center gap-1 group">
                                <div className="bg-white text-red-500 p-2.5 rounded-full shadow-md active:scale-90 transition-all"><Settings size={18} /></div>
                                <span className="text-[15px] font-bold text-white">Settings</span>
                            </button>
                        </div>
                    </div>

                    {/* --- SCROLLABLE CONTENT AREA --- */}
                    <div className="flex-1 overflow-y-auto pb-12 custom-scrollbar">

                        {/* --- STEP 2: DAILY ROUTINE WITH SNAKE BORDER --- */}
                        <div className="mt-8 px-4">
                            <div className="relative bg-white rounded-[2.5rem] p-6 shadow-md border border-slate-100 overflow-hidden group">

                                {/* SNAKE ANIMATION LINE (The rotating red line) */}
    
                                <div className="absolute inset-0 pointer-events-none z-0">
                                    <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-red-500 to-transparent animate-[snake-border_4s_linear_infinite]"></div>
                                    <div className="absolute bottom-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-red-500 to-transparent animate-[snake-border_4s_linear_infinite_reverse]"></div>
                                </div>

                                <p className="text-[15px] font-bold text-slate-400 uppercase tracking-widest mb-6 ml-2 italic text-left relative z-10">Daily Routine</p>

                                <div className="space-y-6 relative z-10">
                                    {/* ATTENDANCE MODULE */}
                                    <button
                                        onClick={() => handleNavigation('/attendance')}
                                        className="w-full flex items-center justify-between group/item"
                                    >
                                        <div className="flex items-center gap-4 text-left">
                                            <div className="bg-red-50 text-red-500 p-3 rounded-2xl border border-red-100 group-hover/item:scale-110 transition-all">
                                                <Calendar size={20} />
                                            </div>
                                            <span className="font-bold text-slate-700 text-[15px] italic">Attendance</span>
                                        </div>
                                        <ChevronRight size={20} className="text-black group-hover/item:translate-x-1 transition-transform" />
                                    </button>

                                    {/* TIMETABLE MODULE */}
                                    <button
                                        onClick={() => handleNavigation('/timetable')}
                                        className="w-full flex items-center justify-between group/item"
                                    >
                                        <div className="flex items-center gap-4 text-left">
                                            <div className="bg-blue-50 text-blue-500 p-3 rounded-2xl border border-blue-100 group-hover/item:scale-110 transition-all">
                                                <Clock size={20} />
                                            </div>
                                            <span className="font-bold text-slate-700 text-[15px] italic">TimeTable</span>
                                        </div>
                                        <ChevronRight size={20} className="text-black group-hover/item:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="mt-8 px-4">
                            <div className="relative bg-white rounded-[2.5rem] p-6 shadow-md border border-slate-100 overflow-hidden group">

                                {/* SNAKE ANIMATION LINE (The rotating red line) */}
                                <div className="absolute inset-0 pointer-events-none z-0">
                                    <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-red-500 to-transparent animate-[snake-border_4s_linear_infinite]"></div>
                                    <div className="absolute bottom-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-red-500 to-transparent animate-[snake-border_4s_linear_infinite_reverse]"></div>
                                </div>

                                <p className="text-[15px] font-bold text-slate-400 uppercase tracking-widest mb-6 ml-2 italic text-left relative z-10">Updates</p>

                                <div className="space-y-6 relative z-10">
                                    {/* Notice Module */}
                                    <button
                                        onClick={() => handleNavigation('/notice-feed')}
                                        className="w-full flex items-center justify-between group/item"
                                    >
                                        <div className="flex items-center gap-4 text-left">
                                            <div className="bg-red-50 text-red-500 p-3 rounded-2xl border border-red-100 group-hover/item:scale-110 transition-all">
                                                <Megaphone size={20} />
                                            </div>
                                            <span className="font-bold text-slate-700 text-[15px] italic">Notice Board</span>
                                        </div>
                                        <ChevronRight size={20} className="text-black group-hover/item:translate-x-1 transition-transform" />
                                    </button>

                                    {/* Support MODULE */}
                                    <button
                                        onClick={() => handleNavigation('/support')}
                                        className="w-full flex items-center justify-between group/item"
                                    >
                                        <div className="flex items-center gap-4 text-left">
                                            <div className="bg-blue-50 text-blue-500 p-3 rounded-2xl border border-blue-100 group-hover/item:scale-110 transition-all">
                                                <HelpCircle size={20} />
                                            </div>
                                            <span className="font-bold text-slate-700 text-[15px] italic">Support</span>
                                        </div>
                                        <ChevronRight size={20} className="text-black group-hover/item:translate-x-1 transition-transform" />
                                    </button>

                                    <button
                                        onClick={() => handleNavigation('/live-class')}
                                        className="w-full flex items-center justify-between group/item"
                                    >
                                        <div className="flex items-center gap-4 text-left">
                                            <div className="bg-blue-50 text-blue-500 p-3 rounded-2xl border border-blue-100 group-hover/item:scale-110 transition-all">
                                                <Video size={20} />
                                            </div>
                                            <span className="font-bold text-slate-700 text-[15px] italic">Live Class</span>
                                        </div>
                                        <ChevronRight size={20} className="text-black group-hover/item:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="mt-8 px-4">
                            <div className="relative bg-white rounded-[2.5rem] p-6 shadow-md border border-slate-100 overflow-hidden group">

                                {/* SNAKE ANIMATION LINE (The rotating red line) */}
                                <div className="absolute inset-0 pointer-events-none z-0">
                                    <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-red-500 to-transparent animate-[snake-border_4s_linear_infinite]"></div>
                                    <div className="absolute bottom-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-red-500 to-transparent animate-[snake-border_4s_linear_infinite_reverse]"></div>
                                </div>

                                <p className="text-[15px] font-bold text-slate-400 uppercase tracking-widest mb-6 ml-2 italic text-left relative z-10">Finance</p>

                                <div className="space-y-6 relative z-10">
                                    {/* Fees MODULE */}
                                    <button
                                        onClick={() => handleNavigation('/fees')}
                                        className="w-full flex items-center justify-between group/item"
                                    >
                                        <div className="flex items-center gap-4 text-left">
                                            <div className="bg-red-50 text-red-500 p-3 rounded-2xl border border-red-100 group-hover/item:scale-110 transition-all">
                                                <CreditCard size={20} />
                                            </div>
                                            <span className="font-bold text-slate-700 text-[15px] italic">My Fees</span>
                                        </div>
                                        <ChevronRight size={20} className="text-black group-hover/item:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="mt-8 px-4">
                            <div className="relative bg-white rounded-[2.5rem] p-6 shadow-md border border-slate-100 overflow-hidden group">

                                {/* SNAKE ANIMATION LINE (The rotating red line) */}
                                <div className="absolute inset-0 pointer-events-none z-0">
                                    <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-red-500 to-transparent animate-[snake-border_4s_linear_infinite]"></div>
                                    <div className="absolute bottom-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-red-500 to-transparent animate-[snake-border_4s_linear_infinite_reverse]"></div>
                                </div>

                                <p className="text-[15px] font-bold text-slate-400 uppercase tracking-widest mb-6 ml-2 italic text-left relative z-10">Academics</p>

                                <div className="space-y-6 relative z-10">
                                    {/* Assignment MODULE */}
                                    <button
                                        onClick={() => handleNavigation('/Assignments')}
                                        className="w-full flex items-center justify-between group/item"
                                    >
                                        <div className="flex items-center gap-4 text-left">
                                            <div className="bg-red-50 text-red-500 p-3 rounded-2xl border border-red-100 group-hover/item:scale-110 transition-all">
                                                <FileText size={20} />
                                            </div>
                                            <span className="font-bold text-slate-700 text-[15px] italic">Assignments</span>
                                        </div>
                                        <ChevronRight size={20} className="text-black group-hover/item:translate-x-1 transition-transform" />
                                    </button>

                                    {/* Performance MODULE */}
                                    <button
                                        onClick={() => handleNavigation('/performance')}
                                        className="w-full flex items-center justify-between group/item"
                                    >
                                        <div className="flex items-center gap-4 text-left">
                                            <div className="bg-blue-50 text-blue-500 p-3 rounded-2xl border border-blue-100 group-hover/item:scale-110 transition-all">
                                                <TrendingUp size={20} />
                                            </div>
                                            <span className="font-bold text-slate-700 text-[15px] italic">Performance</span>
                                        </div>
                                        <ChevronRight size={20} className="text-black group-hover/item:translate-x-1 transition-transform" />
                                    </button>
                                    {/* Exam module */}
                                    <button
                                        onClick={() => handleNavigation('/exams')}
                                        className="w-full flex items-center justify-between group/item"
                                    >
                                        <div className="flex items-center gap-4 text-left">
                                            <div className="bg-blue-50 text-blue-500 p-3 rounded-2xl border border-blue-100 group-hover/item:scale-110 transition-all">
                                                <GraduationCap size={20} />
                                            </div>
                                            <span className="font-bold text-slate-700 text-[15px] italic">Exams</span>
                                        </div>
                                        <ChevronRight size={20} className="text-black group-hover/item:translate-x-1 transition-transform" />
                                    </button>
                                    {/* Library module */}
                                    <button
                                        onClick={() => handleNavigation('/library')}
                                        className="w-full flex items-center justify-between group/item"
                                    >
                                        <div className="flex items-center gap-4 text-left">
                                            <div className="bg-blue-50 text-blue-500 p-3 rounded-2xl border border-blue-100 group-hover/item:scale-110 transition-all">
                                                <Book size={20} />
                                            </div>
                                            <span className="font-bold text-slate-700 text-[15px] italic">Library</span>
                                        </div>
                                        <ChevronRight size={20} className="text-black group-hover/item:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Yahan tu aage aur bhi boxes (Campus, Assessment) add kar sakta hai */}
                    </div>
                    <div className="p-6 border-t border-neon/10">
                        <button
                            onClick={() => setShowConfirm(true)}
                            className="w-full bg-red-500/10 text-red-500 py-4 rounded-2xl font-black flex items-center justify-center gap-2 border border-red-500/20 hover:bg-red-500/20 transition-all active:scale-95 backdrop-blur-md uppercase text-[15px] tracking-[0.2em] italic"
                        >
                            <LogOut size={30} />
                            <span>Logout</span>
                        </button>
                    </div>
                </div>
            </div>

            --- LOGOUT CONFIRMATION MODAL (CENTERED & BLURRED) ---
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