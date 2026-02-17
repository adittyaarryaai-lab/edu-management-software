import React, { useState } from 'react';
import { ArrowLeft, Lock, Bell, Moon, Languages, ShieldAlert, ChevronRight, Sun, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
    const navigate = useNavigate();
    
    // State for toggles
    const [darkMode, setDarkMode] = useState(false);
    const [notifEnabled, setNotifEnabled] = useState(true);

    const appSettings = [
        { title: 'Change Password', icon: <Lock size={20}/>, color: 'text-red-500', bg: 'bg-red-50', path: '/change-password' },
        { title: 'Notification Toggle', icon: <Bell size={20}/>, color: 'text-orange-500', bg: 'bg-orange-50', isNotif: true },
        { title: 'Dark Mode', icon: darkMode ? <Moon size={20}/> : <Sun size={20}/>, color: 'text-indigo-500', bg: 'bg-indigo-50', isTheme: true },
        { title: 'App Language', icon: <Languages size={20}/>, color: 'text-blue-500', bg: 'bg-blue-50' },
        { title: 'Data Privacy', icon: <ShieldAlert size={20}/>, color: 'text-green-500', bg: 'bg-green-50' },
    ];

    return (
        <div className="min-h-screen bg-[#f8fafc] pb-24 font-sans italic">
            {/* Header Area */}
            <div className="nav-gradient text-white px-6 pt-12 pb-20 rounded-b-[3.5rem] shadow-lg flex items-center gap-4 relative z-10">
                <button onClick={() => navigate(-1)} className="bg-white/20 p-2 rounded-xl active:scale-90 transition-all">
                    <ArrowLeft size={20}/>
                </button>
                <div>
                    <h1 className="text-xl font-black uppercase tracking-tight">App Settings</h1>
                    <p className="text-[9px] font-black opacity-70 uppercase tracking-widest mt-0.5">System Configuration</p>
                </div>
                <div className="absolute right-8 opacity-20"><ShieldCheck size={40}/></div>
            </div>

            {/* Settings List */}
            <div className="px-5 -mt-8 relative z-20 space-y-4">
                {appSettings.map((s, i) => (
                    <div 
                        key={i} 
                        onClick={() => s.path && navigate(s.path)}
                        className="bg-white p-4 sm:p-5 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-white flex items-center justify-between active:scale-[0.98] transition-all cursor-pointer group"
                    >
                        <div className="flex items-center gap-3 sm:gap-4 flex-1">
                            <div className={`${s.bg} ${s.color} p-3 sm:p-4 rounded-[1.5rem] shadow-inner group-hover:scale-110 transition-transform duration-300 shrink-0`}>
                                {s.icon}
                            </div>
                            <div className="min-w-0">
                                <span className="font-black text-slate-800 text-[13px] sm:text-sm uppercase tracking-tighter block truncate">{s.title}</span>
                                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest truncate">Protocol Setup</p>
                            </div>
                        </div>

                        {/* --- FIXED TOGGLE LOGIC --- */}
                        <div className="flex shrink-0">
                            {s.isTheme ? (
                                <div 
                                    onClick={(e) => { 
                                        e.stopPropagation(); // Card click ko rokne ke liye
                                        setDarkMode(!darkMode); 
                                    }}
                                    className="w-12 h-6 rounded-full transition-all duration-300 relative cursor-pointer shadow-inner"
                                    style={{ backgroundColor: darkMode ? '#4f46e5' : '#e2e8f0' }} // Indigo-600 vs Slate-200
                                >
                                    <div 
                                        className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-md transition-all duration-300" 
                                        style={{ left: darkMode ? '28px' : '4px' }}
                                    />
                                </div>
                            ) : s.isNotif ? (
                                <div 
                                    onClick={(e) => { 
                                        e.stopPropagation(); 
                                        setNotifEnabled(!notifEnabled); 
                                    }}
                                    className="w-12 h-6 rounded-full transition-all duration-300 relative cursor-pointer shadow-inner"
                                    style={{ backgroundColor: notifEnabled ? '#f97316' : '#e2e8f0' }} // Orange-500 vs Slate-200
                                >
                                    <div 
                                        className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-md transition-all duration-300" 
                                        style={{ left: notifEnabled ? '28px' : '4px' }}
                                    />
                                </div>
                            ) : (
                                <div className="bg-slate-50 p-2 rounded-xl">
                                    <ChevronRight size={18} className="text-slate-300" />
                                </div>
                            )}
                        </div>
                    </div>
                ))}

                {/* System Stats Footer */}
                <div className="mt-10 p-8 text-center bg-slate-900 rounded-[3rem] text-white overflow-hidden relative shadow-2xl">
                    <div className="relative z-10">
                        <p className="text-[9px] font-black text-blue-400 uppercase tracking-[0.4em] mb-2">Neural Engine Status</p>
                        <h4 className="text-lg font-black italic uppercase">Verified v4.0.5</h4>
                        <div className="mt-4 flex justify-center gap-2">
                            <div className="h-1 w-8 bg-blue-600 rounded-full"></div>
                            <div className="h-1 w-2 bg-white/20 rounded-full"></div>
                            <div className="h-1 w-2 bg-white/20 rounded-full"></div>
                        </div>
                    </div>
                    <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-blue-600/10 rounded-full blur-3xl"></div>
                </div>
            </div>
        </div>
    );
};

export default Settings;