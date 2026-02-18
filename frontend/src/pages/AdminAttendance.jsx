import React, { useState, useEffect } from 'react';
import { ArrowLeft, ShieldAlert, BarChart3, Users, Filter } from 'lucide-react';
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
        <div className="min-h-screen bg-[#f8fafc] pb-24 font-sans italic">
            {/* Admin Header */}
            <div className="bg-slate-900 text-white px-6 pt-12 pb-24 rounded-b-[4rem] shadow-2xl relative overflow-hidden">
                <button onClick={() => navigate(-1)} className="bg-white/10 p-2 rounded-xl mb-6"><ArrowLeft size={20}/></button>
                <div className="flex justify-between items-center relative z-10">
                    <div>
                        <h1 className="text-2xl font-black uppercase tracking-tighter italic flex items-center gap-2">
                            <BarChart3 className="text-blue-400" /> Command Center
                        </h1>
                        <p className="text-[10px] font-black opacity-50 uppercase tracking-[0.3em] mt-1">Master Attendance Protocols</p>
                    </div>
                    <div className="bg-blue-600 p-4 rounded-3xl shadow-xl shadow-blue-500/20">
                        <Users size={24} />
                    </div>
                </div>
            </div>

            <div className="px-5 -mt-12 relative z-20 space-y-6">
                {/* Grade Filter */}
                <div className="bg-white p-2 rounded-[2.5rem] shadow-xl border border-white flex gap-2">
                    {['10-A', '12-C'].map((grade) => (
                        <button 
                            key={grade}
                            onClick={() => setSelectedGrade(grade)}
                            className={`flex-1 py-4 rounded-[2rem] font-black uppercase text-[10px] tracking-widest transition-all ${selectedGrade === grade ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400'}`}
                        >
                            Grade {grade}
                        </button>
                    ))}
                </div>

                {/* Report List */}
                <div className="space-y-4">
                    {loading ? <div className="text-center py-10 font-black uppercase text-[10px] tracking-[0.3em] opacity-30">Decrypting Data...</div> : (
                        report.map((std, i) => (
                            <div key={i} className="bg-white p-5 rounded-[2.5rem] shadow-lg border border-white flex justify-between items-center group">
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-3xl flex items-center justify-center font-black text-xs shadow-inner ${std.status === 'Low' ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-500'}`}>
                                        {std.percentage}%
                                    </div>
                                    <div>
                                        <h4 className="font-black text-slate-800 text-sm uppercase italic">{std.name}</h4>
                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Roll: {std.roll}</p>
                                    </div>
                                </div>
                                {std.status === 'Low' && (
                                    <div className="bg-red-500 text-white p-2 rounded-xl shadow-lg shadow-red-200 animate-pulse">
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