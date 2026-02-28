import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, Wallet, UserCircle, LogOut, ShieldCheck, Activity } from 'lucide-react';

const FinanceDashboard = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    return (
        <div className="min-h-screen bg-void text-white font-sans italic pb-24">
            {/* Header Section */}
            <div className="p-8 border-b border-white/5 flex justify-between items-center bg-slate-900/50 backdrop-blur-md">
                <div>
                    <h1 className="text-2xl font-black uppercase tracking-tighter italic text-neon">Finance Node</h1>
                    <p className="text-[10px] text-white/20 uppercase font-black tracking-widest mt-1">
                        System Access: {user?.name || 'Authorized Personnel'}
                    </p>
                </div>
            </div>

            {/* Profile Info Card */}
            <div className="p-6 mx-5 mt-6 bg-slate-900/80 rounded-[2.5rem] border border-neon/20 shadow-2xl flex items-center gap-5">
                <div className="w-16 h-16 bg-neon/10 border border-neon/30 rounded-[1.5rem] flex items-center justify-center text-neon shadow-[0_0_20px_rgba(61,242,224,0.1)]">
                    <UserCircle size={40}/>
                </div>
                <div>
                    <h2 className="text-lg font-black uppercase italic leading-none">{user?.name}</h2>
                    <p className="text-[9px] font-black text-neon/40 uppercase tracking-[0.2em] mt-2 flex items-center gap-1">
                        <ShieldCheck size={10}/> Role: Finance Teacher / Accountant
                    </p>
                </div>
            </div>

            {/* Empty State: Awaiting Fees Modules */}
            <div className="mt-12 flex flex-col items-center justify-center opacity-20 text-center px-10">
                <div className="relative mb-6">
                    <Wallet size={80} className="text-neon" />
                    <Activity size={24} className="absolute -bottom-2 -right-2 text-neon animate-pulse" />
                </div>
                <h3 className="font-black text-xs uppercase tracking-[0.4em] mb-2 text-white">Dashboard Initialized</h3>
                <p className="text-[8px] font-bold uppercase tracking-widest leading-relaxed">
                    Neural history synchronized. <br/> Fees & Salary modules will be deployed in the next cycle.
                </p>
            </div>

            {/* Bottom Status Bar */}
            <div className="fixed bottom-10 left-5 right-5 bg-void border border-neon/10 rounded-3xl p-4 flex items-center justify-between shadow-2xl">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-neon rounded-full animate-ping"></div>
                    <span className="text-[8px] font-black uppercase text-neon/60 tracking-widest">Live: Secure Session</span>
                </div>
                <p className="text-[8px] font-black uppercase text-white/20 italic">EduFlowAI v3.0</p>
            </div>
        </div>
    );
};

export default FinanceDashboard;