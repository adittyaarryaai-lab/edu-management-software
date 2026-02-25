import React, { useState, useEffect } from 'react';
import { ArrowLeft, Award, Calendar, AlertCircle, CheckCircle, XCircle, Cpu, ChevronLeft, ChevronRight, BarChart3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import Loader from '../components/Loader';

const StudentAttendance = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentMonth, setCurrentMonth] = useState(new Date().toISOString().slice(0, 7)); // e.g. "2026-02"

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true);
                // Backend ko current month bhej rahe hain
                const { data } = await API.get(`/attendance/student-stats?month=${currentMonth}`);
                setStats(data);
            } catch (err) { console.error("History Sync Failed", err); }
            finally { setLoading(false); }
        };
        fetchStats();
    }, [currentMonth]); // Jab month badlega, data refresh hoga

    const changeMonth = (offset) => {
        const date = new Date(currentMonth + "-01");
        date.setMonth(date.getMonth() + offset);
        setCurrentMonth(date.toISOString().slice(0, 7));
    };

    if (loading) return <Loader />;

    return (
        <div className="min-h-screen bg-void pb-24 font-sans italic text-white">
            {/* Header with Circular Progress */}
            <div className="bg-void text-white px-6 pt-12 pb-32 rounded-b-[4rem] shadow-2xl border-b border-neon/20 relative overflow-hidden text-center">
                <div className="absolute inset-0 bg-gradient-to-t from-neon/10 to-transparent pointer-events-none"></div>
                <button
                    onClick={() => navigate('/')}
                    className="absolute top-12 left-6 z-50 bg-white/10 p-2 rounded-xl border border-white/20 text-neon active:scale-90 transition-all cursor-pointer"
                >
                    <ArrowLeft size={20} />
                </button>

                <div className="relative inline-block mt-4 z-10">
                    <div className="w-32 h-32 rounded-full border-[6px] border-white/5 flex items-center justify-center relative shadow-inner">
                        <div className="text-4xl font-black text-white tracking-tighter">{stats?.percentage}%</div>
                        {/* Glow effect matching Neon Cyan */}
                        <div className="absolute inset-0 rounded-full border-[6px] border-neon shadow-[0_0_30px_rgba(61,242,224,0.4)] opacity-50"></div>
                    </div>
                </div>
                <h2 className="mt-6 text-[10px] font-black uppercase tracking-[0.4em] text-neon italic relative z-10">Neural Presence Score</h2>
                <div className="absolute -right-8 top-16 text-neon/5 animate-spin-slow"><Cpu size={140} /></div>
            </div>

            <div className="px-5 -mt-16 relative z-20 space-y-6">
                {/* 1. NEURAL STATS CARDS (Total, Present, Absent) */}
                <div className="grid grid-cols-3 gap-3">
                    {[
                        { label: 'TOTAL DAYS', value: stats?.totalDays, bg: 'bg-slate-900', color: 'text-white', icon: <Calendar size={14} /> },
                        { label: 'PRESENT', value: stats?.presentDays, bg: 'bg-neon/10', color: 'text-neon', icon: <CheckCircle size={14} /> },
                        { label: 'ABSENT', value: stats?.absentDays, bg: 'bg-red-600/10', color: 'text-red-500', icon: <XCircle size={14} /> }
                    ].map((item, i) => (
                        <div key={i} className={`${item.bg} p-4 rounded-3xl border border-white/5 shadow-2xl flex flex-col items-center justify-center group hover:border-neon/20 transition-all h-24`}>
                            <div className={`${item.color || 'text-white/40'} mb-1 group-hover:scale-110 transition-transform`}>{item.icon}</div>
                            <span className={`text-lg font-black ${item.color || 'text-white'}`}>{item.value}</span>
                            <p className="text-[7px] font-black uppercase tracking-widest text-white/30 italic">{item.label}</p>
                        </div>
                    ))}
                </div>

                {/* 2. MONTH NAVIGATION MATRIX */}
                <div className="bg-slate-900/80 backdrop-blur-xl p-4 rounded-[2rem] border border-neon/20 flex items-center justify-between shadow-2xl mx-1">
                    <button onClick={() => changeMonth(-1)} className="p-2 text-neon/40 hover:text-neon transition-colors">
                        <ChevronLeft size={24} />
                    </button>
                    <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-neon" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white italic">
                            {new Date(currentMonth + "-01").toLocaleString('default', { month: 'long', year: 'numeric' })}
                        </span>
                    </div>
                    <button onClick={() => changeMonth(1)} className="p-2 text-neon/40 hover:text-neon transition-colors">
                        <ChevronRight size={24} />
                    </button>
                </div>

                {/* 3. HISTORY MATRIX (Timeline) */}
                <div className="space-y-3 pb-10">
                    <h3 className="text-[10px] font-black text-neon/30 uppercase tracking-[0.3em] mb-2 ml-4 italic">Attendance Timeline</h3>

                    {stats?.history && stats.history.length > 0 ? (
                        stats.history.map((log, i) => (
                            <div key={i} className="bg-white/5 backdrop-blur-xl p-5 rounded-[2.5rem] border border-white/5 flex items-center justify-between group hover:border-neon/30 transition-all italic">
                                <div className="flex items-center gap-4">
                                    <div className={`p-3 rounded-2xl border ${log.status === 'Present' ? 'bg-neon/10 text-neon border-neon/20' : 'bg-red-500/10 text-red-500 border-red-500/20'}`}>
                                        {log.status === 'Present' ? <CheckCircle size={18} /> : <XCircle size={18} />}
                                    </div>
                                    <div>
                                        <h4 className="font-black text-white text-xs uppercase italic tracking-tight">
                                            {new Date(log.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', weekday: 'long' })}
                                        </h4>
                                        <p className="text-[8px] font-black text-white/20 uppercase tracking-[0.2em] mt-0.5">Verified Session Log</p>
                                    </div>
                                </div>
                                <span className={`text-[8px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full border ${log.status === 'Present' ? 'bg-neon text-void border-neon shadow-[0_0_10px_rgba(61,242,224,0.3)]' : 'bg-red-500 text-white border-red-500'}`}>
                                    {log.status}
                                </span>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-20 bg-white/5 rounded-[3rem] border border-dashed border-white/10 mx-2">
                            <p className="text-white/20 font-black text-[10px] uppercase tracking-[0.4em] italic">No Matrix Data Found</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StudentAttendance;