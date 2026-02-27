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
        <div className="min-h-screen bg-void pb-24 font-sans italic text-white">
            {/* Top Profile Header */}
            <div className="bg-void text-white px-6 pt-12 pb-32 rounded-b-[4rem] shadow-2xl border-b border-neon/20 relative overflow-hidden text-center">
                <button onClick={() => navigate(-1)} className="absolute top-12 left-6 bg-white/5 p-2 rounded-xl border border-white/10 text-neon"><ArrowLeft size={20} /></button>
                <div className="relative inline-block mt-4">
                    <div className="w-28 h-28 rounded-[2.5rem] bg-void border-4 border-neon flex items-center justify-center text-3xl font-black text-neon shadow-[0_0_30px_rgba(61,242,224,0.2)]">
                        {profile.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </div>
                </div>
                <h2 className="mt-4 text-2xl font-black uppercase tracking-tighter italic">{profile.name}</h2>
                <p className="text-[10px] font-black text-neon/40 uppercase tracking-[0.4em] italic mt-1">{profile.enrollmentNo}</p>
            </div>

            <div className="px-5 -mt-16 space-y-6 relative z-20">
                {/* Stats Matrix */}
                <div className="grid grid-cols-3 gap-3">
                    {[
                        { label: 'ATTENDANCE', value: `${stats.percentage}%`, color: 'text-neon' },
                        { label: 'PRESENT', value: stats.presentDays, color: 'text-white' },
                        { label: 'ABSENT', value: stats.absentDays, color: 'text-red-500' }
                    ].map((s, i) => (
                        <div key={i} className="bg-slate-900/90 backdrop-blur-xl p-4 rounded-3xl border border-white/5 text-center shadow-2xl">
                            <p className={`text-lg font-black leading-none mb-1 ${s.color}`}>{s.value}</p>
                            <p className="text-[7px] font-black uppercase tracking-widest text-white/20">{s.label}</p>
                        </div>
                    ))}
                </div>

                {/* Details Box (Right Aligned Style) */}
                <div className="bg-white/5 backdrop-blur-xl p-6 rounded-[2.5rem] border border-white/5 shadow-2xl">
                    <div className="flex items-center gap-2 mb-6 ml-2">
                        <Shield size={16} className="text-neon/40" />
                        <h3 className="text-[10px] font-black text-neon/30 uppercase tracking-[0.3em] italic">Identity Matrix</h3>
                    </div>
                    <div className="space-y-4">
                        {[
                            { icon: <Shield size={14} />, label: 'CLASS', value: profile.grade },
                            { icon: <User size={14} />, label: 'FATHER NAME', value: profile.fatherName },
                            { icon: <Phone size={14} />, label: 'MOBILE NUMBER', value: profile.phone },
                            { icon: <Mail size={14} />, label: 'NETWORK ID', value: profile.email },
                            { icon: <Shield size={14} />, label: 'ADMISSION NO', value: profile.admissionNo },
                            { icon: <MapPin size={14} />, label: 'Address', value: profile.address?.fullAddress || 'N/A' },
                        ].map((item, i) => (
                            <div key={i} className="flex justify-between items-start border-b border-white/5 pb-3 last:border-0">
                                <div className="flex items-center gap-3 text-neon/40">{item.icon}</div>
                                <div className="text-right">
                                    <p className="text-[7px] font-black text-white/20 uppercase tracking-widest">{item.label}</p>
                                    <p className="text-[10px] font-black text-white uppercase italic mt-0.5">{item.value}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentDetail;