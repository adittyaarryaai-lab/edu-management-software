import React from 'react';
import { ArrowLeft, Lock, Bell, Moon, Languages, ShieldAlert, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
    const navigate = useNavigate();

    const appSettings = [
        { title: 'Change Password', icon: <Lock size={20}/>, color: 'text-red-500', bg: 'bg-red-50' },
        { title: 'Notification Toggle', icon: <Bell size={20}/>, color: 'text-orange-500', bg: 'bg-orange-50' },
        { title: 'Dark Mode', icon: <Moon size={20}/>, color: 'text-indigo-500', bg: 'bg-indigo-50', toggle: true },
        { title: 'App Language', icon: <Languages size={20}/>, color: 'text-blue-500', bg: 'bg-blue-50' },
        { title: 'Data Privacy', icon: <ShieldAlert size={20}/>, color: 'text-green-500', bg: 'bg-green-50' },
    ];

    return (
        <div className="min-h-screen bg-[#f8fafc] pb-24">
            <div className="nav-gradient text-white px-6 pt-12 pb-16 rounded-b-[3rem] shadow-lg flex items-center gap-4">
                <button onClick={() => navigate(-1)} className="bg-white/20 p-2 rounded-xl"><ArrowLeft size={20}/></button>
                <h1 className="text-xl font-bold uppercase tracking-tight">App Settings</h1>
            </div>

            <div className="px-5 mt-8 space-y-3">
                {appSettings.map((s, i) => (
                    <div key={i} className="bg-white p-5 rounded-[2rem] shadow-sm border border-slate-50 flex items-center justify-between active:scale-95 transition-all">
                        <div className="flex items-center gap-4">
                            <div className={`${s.bg} ${s.color} p-3 rounded-2xl`}>{s.icon}</div>
                            <span className="font-bold text-slate-700 text-sm">{s.title}</span>
                        </div>
                        {s.toggle ? (
                            <div className="w-10 h-5 bg-slate-200 rounded-full relative"><div className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full"></div></div>
                        ) : <ChevronRight size={18} className="text-slate-300" />}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Settings;