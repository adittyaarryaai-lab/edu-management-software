import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Phone, MapPin, Mail, Shield, BarChart3, Clock, XCircle, CheckCircle } from 'lucide-react';
import API from '../api';
import Loader from '../components/Loader';

const StudentDetail = () => {
    const { studentId } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDeepStats = async () => {
            try {
                const { data } = await API.get(`/attendance/student-report/${studentId}`);
                setData(data);
            } catch (err) { console.error(err); }
            finally { setLoading(false); }
        };
        fetchDeepStats();
    }, [studentId]);

    if (loading) return <Loader />;

    const { profile, stats } = data;

    return (
        <div className="min-h-screen bg-[#F8FAFC] pb-24 font-sans italic text-slate-800  overscroll-none fixed inset-0 overflow-y-auto">
            {/* Top Profile Header Area */}
            <div className="bg-[#42A5F5] text-white px-6 pt-12 pb-32 rounded-b-[4rem] shadow-xl relative overflow-visible text-center">
                <button
                    onClick={() => navigate(-1)}
                    className="absolute top-12 left-6 bg-white/20 p-3 rounded-2xl border border-white/30 text-white transition-all active:scale-90"
                >
                    <ArrowLeft size={24} />
                </button>

                <div className="relative inline-block mt-4">
                    <div className="w-32 h-32 rounded-[3rem] bg-white border-4 border-blue-100 flex items-center justify-center text-5xl font-black text-[#42A5F5] shadow-2xl">
                        {/* Initials logic remains same for Avatar, but displayed nicely */}
                        {profile.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </div>
                </div>

                <h2 className="mt-6 text-4xl font-black tracking-tighter italic px-10 text-slate-800">
                    {/* Har word ka pehla letter bada karne ka logic */}
                    {profile.name
                        .split(' ')
                        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                        .join(' ')}
                </h2>
                <p className="text-[17px] font-black text-blue-100 uppercase tracking-[0.3em] italic mt-2">
                    {profile.enrollmentNo}
                </p>
            </div>

            <div className="px-5 -mt-16 space-y-6 relative z-20">
                {/* Stats Matrix (Heavy White Style) */}
                <div className="grid grid-cols-3 gap-4">
                    {[
                        { label: 'Attendance', value: `${stats.percentage}%`, color: 'text-[#42A5F5]' },
                        { label: 'Present', value: stats.presentDays, color: 'text-emerald-500' },
                        { label: 'Absent', value: stats.absentDays, color: 'text-rose-500' }
                    ].map((s, i) => (
                        <div key={i} className="bg-white p-5 rounded-[2rem] border border-slate-100 text-center shadow-xl ring-1 ring-slate-50">
                            <p className={`text-3xl font-black leading-none mb-2 ${s.color}`}>{s.value}</p>
                            <p className="text-[12px] font-black uppercase tracking-widest text-slate-400">{s.label}</p>
                        </div>
                    ))}
                </div>

                {/* Details Box (Heavy White Style) */}
                <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-2xl ring-1 ring-slate-50">
                    <div className="flex items-center gap-3 mb-8 ml-2">
                        <Shield size={20} className="text-[#42A5F5]" />
                        <h3 className="text-[15px] font-black text-slate-400 uppercase tracking-[0.2em] italic">Student profile details</h3>
                    </div>

                    <div className="space-y-6">
                        {[
                            { icon: <Shield size={18} />, label: 'Class', value: profile.grade },
                            { icon: <User size={18} />, label: 'Father name', value: profile.fatherName },
                            { icon: <Phone size={18} />, label: 'Mobile number', value: profile.phone },
                            { icon: <Mail size={18} />, label: 'Institutional email', value: profile.email },
                            { icon: <Shield size={18} />, label: 'Admission number', value: profile.admissionNo },
                            { icon: <MapPin size={18} />, label: 'Permanent address', value: profile.address?.fullAddress || 'N/A' },
                        ].map((item, i) => (
                            <div key={i} className="flex justify-between items-start border-b border-slate-50 pb-4 last:border-0 transition-all">
                                <div className="flex items-center gap-4 text-[#42A5F5] opacity-70">{item.icon}</div>
                                <div className="text-right flex-1 ml-6">
                                    <p className="text-[15px] font-black text-slate-400 uppercase tracking-widest">{item.label}</p>
                                    <p className="text-[23px] font-black text-slate-700 sentancecase italic mt-1 leading-tight">{item.value}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Sovereign Session Badge */}
            <div className="px-5 mt-6">
                <div className="bg-slate-800 rounded-[2.5rem] p-6 text-white shadow-xl flex items-center justify-between">
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Secure protocol</p>
                        <h4 className="text-[14px] font-black italic uppercase mt-1">Personnel detail link active</h4>
                    </div>
                    <CheckCircle className="text-emerald-400 animate-pulse" size={24} />
                </div>
            </div>
        </div>
    );
};

export default StudentDetail;