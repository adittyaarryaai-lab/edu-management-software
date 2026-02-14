import React from 'react';
import { Users, UserCheck, CreditCard, Megaphone, Settings, PlusCircle, LayoutDashboard, Database } from 'lucide-react';

const AdminHome = () => {
    const adminStats = [
        { label: 'Total Students', value: '1,240', color: 'text-blue-600' },
        { label: 'Total Teachers', value: '85', color: 'text-purple-600' },
        { label: 'Fees Collected', value: '₹12.5L', color: 'text-green-600' },
    ];

    const managementModules = [
        { title: 'Add Student', icon: <PlusCircle size={24}/>, desc: 'Enroll new students', color: 'bg-blue-50 text-blue-500' },
        { title: 'Manage Staff', icon: <Users size={24}/>, desc: 'Assign roles & classes', color: 'bg-purple-50 text-purple-500' },
        { title: 'Fee Manager', icon: <CreditCard size={24}/>, desc: 'Track pending payments', color: 'bg-green-50 text-green-500' },
        { title: 'Global Notice', icon: <Megaphone size={24}/>, desc: 'Send alerts to all', color: 'bg-orange-50 text-orange-500' },
        { title: 'Timetable Master', icon: <Database size={24}/>, desc: 'Schedule all classes', color: 'bg-indigo-50 text-indigo-500' },
        { title: 'System Logs', icon: <Settings size={24}/>, desc: 'Server & App health', color: 'bg-slate-50 text-slate-500' },
    ];

    return (
        <div className="px-5 -mt-10 space-y-6">
            {/* Quick Stats Banner */}
            <div className="bg-white rounded-[2.5rem] p-6 shadow-xl shadow-slate-200/50 grid grid-cols-3 gap-2">
                {adminStats.map((stat, i) => (
                    <div key={i} className="text-center border-r last:border-0 border-slate-100 px-1">
                        <p className="text-[18px] font-black text-slate-800 leading-none">{stat.value}</p>
                        <p className="text-[8px] font-bold text-slate-400 uppercase mt-1 tracking-tighter">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Management Grid */}
            <div className="grid grid-cols-1 gap-4">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest ml-2">Administrative Controls</h3>
                {managementModules.map((m, i) => (
                    <div key={i} className="bg-white p-5 rounded-[2rem] shadow-sm border border-slate-50 flex items-center justify-between active:scale-95 transition-all cursor-pointer">
                        <div className="flex items-center gap-4">
                            <div className={`${m.color} p-3 rounded-2xl`}>{m.icon}</div>
                            <div>
                                <h4 className="font-bold text-slate-800 text-sm leading-none">{m.title}</h4>
                                <p className="text-[10px] text-slate-400 mt-1 font-medium">{m.desc}</p>
                            </div>
                        </div>
                        <div className="bg-slate-50 p-2 rounded-full text-slate-300">
                             <PlusCircle size={16} />
                        </div>
                    </div>
                ))}
            </div>

            {/* System Status Card */}
            <div className="bg-slate-900 rounded-[2.5rem] p-6 text-white shadow-2xl relative overflow-hidden">
                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-2">
                        <LayoutDashboard size={18} className="text-green-400" />
                        <h3 className="font-bold text-sm">Server Status: Online</h3>
                    </div>
                    <p className="text-[10px] opacity-60">All modules are synced with EduFlowAI Cloud. No pending updates.</p>
                </div>
                <div className="absolute -right-10 -bottom-10 bg-white/5 w-32 h-32 rounded-full"></div>
            </div>
        </div>
    );
};

export default AdminHome;