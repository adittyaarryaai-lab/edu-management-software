import React from 'react';
import { ArrowLeft, Lock, Bell, Moon, Languages, ShieldAlert, ChevronRight, Sun, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext'; 

const Settings = () => {
    const navigate = useNavigate();
    const { isDarkMode, toggleTheme } = useTheme();
    const [notifEnabled, setNotifEnabled] = React.useState(true);

    const appSettings = [
        { title: 'Change Password', icon: <Lock size={20}/>, color: 'text-red-400', bg: 'bg-red-500/10', path: '/change-password' },
        { title: 'Neural Alerts', icon: <Bell size={20}/>, color: 'text-orange-400', bg: 'bg-orange-500/10', isNotif: true },
        { title: 'Visual Matrix', icon: isDarkMode ? <Moon size={20}/> : <Sun size={20}/>, color: 'text-neon', bg: 'bg-neon/10', isTheme: true },
        { title: 'Language Pack', icon: <Languages size={20}/>, color: 'text-blue-400', bg: 'bg-blue-500/10' },
        { title: 'Privacy Cipher', icon: <ShieldAlert size={20}/>, color: 'text-green-400', bg: 'bg-green-500/10' },
    ];

    return (
        <div className={`min-h-screen pb-24 font-sans italic transition-colors duration-500 bg-void text-white`}>
            {/* Header Area */}
            <div className="bg-void text-white px-6 pt-12 pb-20 rounded-b-[3.5rem] shadow-2xl border-b border-neon/20 flex items-center gap-4 relative z-10 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-neon/10 to-transparent pointer-events-none"></div>
                <button onClick={() => navigate(-1)} className="bg-white/5 p-2 rounded-xl active:scale-90 border border-white/10 text-neon transition-all relative z-10">
                    <ArrowLeft size={20} />
                </button>
                <div className="relative z-10">
                    <h1 className="text-xl font-black uppercase tracking-tighter italic">Settings</h1>
                    <p className="text-[9px] font-black text-neon/40 uppercase tracking-[0.4em] mt-0.5 italic">System Configuration</p>
                </div>
                <div className="absolute right-8 text-neon/10 animate-pulse"><ShieldCheck size={60}/></div>
            </div>

            {/* Settings List */}
            <div className="px-5 -mt-8 relative z-20 space-y-4">
                {appSettings.map((s, i) => (
                    <div 
                        key={i} 
                        onClick={() => s.path && navigate(s.path)}
                        className="bg-white/5 backdrop-blur-xl p-4 sm:p-5 rounded-[2.5rem] shadow-2xl border border-white/5 flex items-center justify-between active:scale-[0.98] transition-all cursor-pointer group hover:border-neon/30 italic"
                    >
                        <div className="flex items-center gap-3 sm:gap-4 flex-1">
                            <div className={`${s.bg} ${s.color} p-3 sm:p-4 rounded-[1.5rem] border border-white/5 shadow-inner group-hover:scale-110 transition-all duration-500 shrink-0`}>
                                {s.icon}
                            </div>
                            <div className="min-w-0">
                                <span className="font-black text-[13px] sm:text-sm uppercase tracking-tight block truncate text-white group-hover:text-neon transition-colors">{s.title}</span>
                                <p className="text-[8px] font-black text-white/20 uppercase tracking-widest truncate italic">Protocol Control</p>
                            </div>
                        </div>

                        <div className="flex shrink-0">
                            {s.isTheme ? (
                                <div 
                                    onClick={(e) => { e.stopPropagation(); toggleTheme(); }}
                                    className="w-12 h-6 rounded-full transition-all duration-500 relative cursor-pointer shadow-inner border border-white/10"
                                    style={{ backgroundColor: isDarkMode ? '#3DF2E0' : '#1e293b' }}
                                >
                                    <div 
                                        className="absolute top-1 w-4 h-4 bg-void rounded-full shadow-md transition-all duration-500" 
                                        style={{ left: isDarkMode ? '28px' : '4px' }}
                                    />
                                </div>
                            ) : s.isNotif ? (
                                <div 
                                    onClick={(e) => { e.stopPropagation(); setNotifEnabled(!notifEnabled); }}
                                    className="w-12 h-6 rounded-full transition-all duration-500 relative cursor-pointer shadow-inner border border-white/10"
                                    style={{ backgroundColor: notifEnabled ? '#f97316' : '#1e293b' }}
                                >
                                    <div 
                                        className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-md transition-all duration-500" 
                                        style={{ left: notifEnabled ? '28px' : '4px' }}
                                    />
                                </div>
                            ) : (
                                <div className="bg-void p-2 rounded-xl border border-white/5">
                                    <ChevronRight size={18} className="text-neon/20 group-hover:text-neon transition-colors" />
                                </div>
                            )}
                        </div>
                    </div>
                ))}

                {/* System Stats Footer */}
                <div className="mt-10 p-8 text-center rounded-[3rem] overflow-hidden relative shadow-2xl bg-void border border-neon/20 italic">
                    <div className="relative z-10">
                        <p className="text-[9px] font-black text-neon/40 uppercase tracking-[0.5em] mb-2 italic">Core Neural Engine Status</p>
                        <h4 className="text-lg font-black italic uppercase text-white tracking-tighter">Verified v4.0.5</h4>
                        <div className="mt-4 flex justify-center gap-2">
                            <div className="h-0.5 w-10 bg-neon rounded-full shadow-[0_0_10px_rgba(61,242,224,1)]"></div>
                            <div className="h-0.5 w-2 bg-white/10 rounded-full"></div>
                            <div className="h-0.5 w-2 bg-white/10 rounded-full"></div>
                        </div>
                    </div>
                    <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-neon/5 rounded-full blur-3xl"></div>
                </div>
            </div>
        </div>
    );
};

export default Settings;