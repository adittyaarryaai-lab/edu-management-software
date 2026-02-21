import React, { useState, useEffect } from 'react';
import { ArrowLeft, ShieldAlert, BarChart3, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import Loader from '../components/Loader';

const AdminAttendance = () => {
    const navigate = useNavigate();
    const [selectedGrade, setSelectedGrade] = useState('10-A');
    const [report, setReport] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReport = async () => {
            try {
                setLoading(true);
                const { data } = await API.get(`/attendance/admin-report/${selectedGrade}`);
                setReport(data);
            } catch (err) { console.error(err); }
            finally { setLoading(false); }
        };
        fetchReport();
    }, [selectedGrade]);

    return (
        <div className="min-h-screen bg-void dark:bg-void pb-24 font-sans italic">
            {/* Admin Header */}
            <div className="bg-void text-white px-6 pt-12 pb-24 rounded-b-[4rem] shadow-2xl relative overflow-hidden border-b border-neon/20">
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-neon/5 to-transparent"></div>
                <button onClick={() => navigate(-1)} className="bg-white/5 p-2 rounded-xl mb-6 border border-white/10 text-neon transition-all hover:bg-neon/20"><ArrowLeft size={20}/></button>
                <div className="flex justify-between items-center relative z-10">
                    <div>
                        <h1 className="text-2xl font-black uppercase tracking-tighter italic flex items-center gap-2">
                            <BarChart3 className="text-neon animate-pulse" /> Command Center
                        </h1>
                        <p className="text-[10px] font-black text-neon/40 uppercase tracking-[0.3em] mt-1">Master Attendance Protocols</p>
                    </div>
                    <div className="bg-neon text-void p-4 rounded-3xl shadow-[0_0_25px_rgba(61,242,224,0.4)]">
                        <Users size={24} />
                    </div>
                </div>
            </div>

            <div className="px-5 -mt-12 relative z-20 space-y-6">
                {/* Grade Filter */}
                <div className="bg-slate-900/80 backdrop-blur-xl p-2 rounded-[2.5rem] shadow-2xl border border-neon/20 flex gap-2">
                    {['10-A', '12-C'].map((grade) => (
                        <button 
                            key={grade}
                            onClick={() => setSelectedGrade(grade)}
                            className={`flex-1 py-4 rounded-[2rem] font-black uppercase text-[10px] tracking-widest transition-all ${selectedGrade === grade ? 'bg-neon text-void shadow-[0_0_15px_rgba(61,242,224,0.3)]' : 'text-neon/40 hover:text-neon/60'}`}
                        >
                            Grade {grade}
                        </button>
                    ))}
                </div>

                {/* Report List */}
                <div className="space-y-4">
                    {loading ? <div className="text-center py-10 font-black uppercase text-[10px] tracking-[0.3em] text-neon/30 animate-pulse italic">Decrypting Neural Data...</div> : (
                        report.map((std, i) => (
                            <div key={i} className="bg-white/5 backdrop-blur-xl p-5 rounded-[2.5rem] shadow-lg border border-white/5 flex justify-between items-center group hover:border-neon/30 transition-all">
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-3xl flex items-center justify-center font-black text-xs shadow-inner border ${std.status === 'Low' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-neon/10 text-neon border-neon/20'}`}>
                                        {std.percentage}%
                                    </div>
                                    <div>
                                        <h4 className="font-black text-white text-sm uppercase italic tracking-tight">{std.name}</h4>
                                        <p className="text-[9px] font-bold text-neon/40 uppercase tracking-widest">Roll: {std.roll}</p>
                                    </div>
                                </div>
                                {std.status === 'Low' && (
                                    <div className="bg-red-600 text-white p-2 rounded-xl shadow-[0_0_15px_rgba(220,38,38,0.4)] animate-bounce">
                                        <ShieldAlert size={16} />
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminAttendance;