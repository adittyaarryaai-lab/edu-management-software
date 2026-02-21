import React, { useState, useEffect } from 'react';
import { ArrowLeft, Award, Calendar, AlertCircle, CheckCircle, XCircle, Cpu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import Loader from '../components/Loader';

const StudentAttendance = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { data } = await API.get('/attendance/student-stats');
                setStats(data);
            } catch (err) { console.error(err); }
            finally { setLoading(false); }
        };
        fetchStats();
    }, []);

    if (loading) return <Loader />;

    return (
        <div className="min-h-screen bg-void pb-24 font-sans italic text-white">
            {/* Header with Circular Progress */}
            <div className="bg-void text-white px-6 pt-12 pb-32 rounded-b-[4rem] shadow-2xl border-b border-neon/20 relative overflow-hidden text-center">
                <div className="absolute inset-0 bg-gradient-to-t from-neon/10 to-transparent pointer-events-none"></div>
                <button onClick={() => navigate(-1)} className="absolute top-12 left-6 bg-white/5 p-2 rounded-xl border border-white/10 text-neon transition-all active:scale-90 relative z-10">
                    <ArrowLeft size={20}/>
                </button>
                
                <div className="relative inline-block mt-4 z-10">
                    <div className="w-32 h-32 rounded-full border-[6px] border-white/5 flex items-center justify-center relative shadow-inner">
                        <div className="text-4xl font-black text-white tracking-tighter">{stats?.percentage}%</div>
                        {/* Glow effect matching Neon Cyan */}
                        <div className="absolute inset-0 rounded-full border-[6px] border-neon shadow-[0_0_30px_rgba(61,242,224,0.4)] opacity-50"></div>
                    </div>
                </div>
                <h2 className="mt-6 text-[10px] font-black uppercase tracking-[0.4em] text-neon italic relative z-10">Neural Presence Score</h2>
                <div className="absolute -right-8 top-16 text-neon/5 animate-spin-slow"><Cpu size={140}/></div>
            </div>

            <div className="px-5 -mt-16 relative z-20 space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-3 gap-3">
                    {[
                        { label: 'Total', value: stats?.totalDays, bg: 'bg-slate-900', icon: <Calendar size={14}/> },
                        { label: 'Present', value: stats?.presentDays, bg: 'bg-neon/10', color: 'text-neon', icon: <CheckCircle size={14}/> },
                        { label: 'Absent', value: stats?.absentDays, bg: 'bg-red-600/10', color: 'text-red-500', icon: <AlertCircle size={14}/> }
                    ].map((item, i) => (
                        <div key={i} className={`${item.bg} p-4 rounded-3xl border border-white/5 shadow-2xl flex flex-col items-center justify-center group hover:border-neon/20 transition-all`}>
                            <div className={`${item.color || 'text-white/40'} mb-1 group-hover:scale-110 transition-transform`}>{item.icon}</div>
                            <span className={`text-lg font-black ${item.color || 'text-white'}`}>{item.value}</span>
                            <p className="text-[8px] font-black uppercase tracking-widest text-white/30 italic">{item.label}</p>
                        </div>
                    ))}
                </div>

                {/* Absence History */}
                <div className="bg-white/5 backdrop-blur-xl rounded-[2.5rem] p-6 shadow-2xl border border-white/5">
                    <h3 className="text-[10px] font-black text-neon/30 uppercase tracking-[0.3em] mb-4 ml-2 italic">Protocol: Absence Log</h3>
                    {stats?.absentHistory.length > 0 ? (
                        stats.absentHistory.map((log, i) => (
                            <div key={i} className="flex justify-between items-center p-4 border-b border-white/5 last:border-0 group hover:bg-neon/5 rounded-2xl transition-all">
                                <div className="flex items-center gap-4">
                                    <div className="bg-red-500/10 text-red-500 p-2 rounded-xl border border-red-500/20 shadow-inner group-hover:bg-red-500 group-hover:text-void transition-all"><XCircle size={16}/></div>
                                    <span className="text-xs font-black text-white/80 uppercase tracking-tighter italic">{new Date(log.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                </div>
                                <span className="text-[8px] font-black text-red-400 uppercase tracking-widest bg-red-500/5 px-3 py-1 rounded-md border border-red-500/10 group-hover:border-red-500/30 transition-all">Signal Absent</span>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-10 opacity-30 italic">
                            <Award size={36} className="mx-auto mb-3 text-neon animate-bounce" />
                            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-neon/60">Flawless Protocol • Zero Absences Detected</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StudentAttendance;