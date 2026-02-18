import React, { useState, useEffect } from 'react';
import { ArrowLeft, Award, Calendar, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
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
        <div className="min-h-screen bg-[#f8fafc] pb-24 font-sans italic">
            {/* Header with Circular Progress */}
            <div className="nav-gradient text-white px-6 pt-12 pb-32 rounded-b-[4rem] shadow-2xl relative overflow-hidden text-center">
                <button onClick={() => navigate(-1)} className="absolute top-12 left-6 bg-white/20 p-2 rounded-xl"><ArrowLeft size={20}/></button>
                
                <div className="relative inline-block mt-4">
                    {/* Simple Progress Ring using CSS */}
                    <div className="w-32 h-32 rounded-full border-8 border-white/20 flex items-center justify-center relative">
                        <div className="text-3xl font-black">{stats?.percentage}%</div>
                        {/* Static glow effect */}
                        <div className="absolute inset-0 rounded-full shadow-[0_0_30px_rgba(255,255,255,0.3)]"></div>
                    </div>
                </div>
                <h2 className="mt-4 text-sm font-black uppercase tracking-[0.3em]">Attendance Score</h2>
            </div>

            <div className="px-5 -mt-16 relative z-20 space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-3 gap-3">
                    {[
                        { label: 'Total', value: stats?.totalDays, bg: 'bg-slate-900', icon: <Calendar size={14}/> },
                        { label: 'Present', value: stats?.presentDays, bg: 'bg-green-600', icon: <CheckCircle size={14}/> },
                        { label: 'Absent', value: stats?.absentDays, bg: 'bg-red-500', icon: <AlertCircle size={14}/> }
                    ].map((item, i) => (
                        <div key={i} className={`${item.bg} p-4 rounded-3xl text-white shadow-xl flex flex-col items-center justify-center`}>
                            <div className="opacity-60 mb-1">{item.icon}</div>
                            <span className="text-lg font-black">{item.value}</span>
                            <p className="text-[8px] font-black uppercase tracking-widest">{item.label}</p>
                        </div>
                    ))}
                </div>

                {/* Absence History */}
                <div className="bg-white rounded-[2.5rem] p-6 shadow-xl border border-white">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 ml-2 italic">Absence Log</h3>
                    {stats?.absentHistory.length > 0 ? (
                        stats.absentHistory.map((log, i) => (
                            <div key={i} className="flex justify-between items-center p-4 border-b border-slate-50 last:border-0">
                                <div className="flex items-center gap-4">
                                    <div className="bg-red-50 text-red-500 p-2 rounded-xl"><XCircle size={16}/></div>
                                    <span className="text-xs font-black text-slate-700 uppercase tracking-tighter italic">{new Date(log.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                </div>
                                <span className="text-[9px] font-black text-red-400 uppercase tracking-widest bg-red-50/50 px-2 py-1 rounded-md">Marked Absent</span>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-6 opacity-30 italic">
                            <Award size={30} className="mx-auto mb-2 text-green-500" />
                            <p className="text-[9px] font-black uppercase tracking-widest">Perfect Record! Zero Absences.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StudentAttendance;