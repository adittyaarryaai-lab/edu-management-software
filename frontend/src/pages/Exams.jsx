import React from 'react';
import { ArrowLeft, GraduationCap, MapPin, Calendar, FileDown, AlertTriangle, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Exams = () => {
    const navigate = useNavigate();

    const examSchedule = [
        { subject: "Engineering Physics", date: "24 Feb 2026", time: "10:00 AM", room: "Block A - 302", status: "Upcoming" },
        { subject: "Calculus & Algebra", date: "26 Feb 2026", time: "10:00 AM", room: "Block B - 105", status: "Upcoming" },
        { subject: "Web Development II", date: "28 Feb 2026", time: "02:00 PM", room: "Lab 4", status: "Upcoming" },
    ];

    return (
        <div className="min-h-screen bg-[#f8fafc] pb-24">
            {/* Header */}
            <div className="nav-gradient text-white px-6 pt-12 pb-24 rounded-b-[3rem] shadow-lg relative z-10">
                <div className="flex justify-between items-center mb-6">
                    <button onClick={() => navigate(-1)} className="bg-white/20 p-2 rounded-xl active:scale-90 transition-all">
                        <ArrowLeft size={20} />
                    </button>
                    <h1 className="text-xl font-bold uppercase tracking-tight">Exam Center</h1>
                    <div className="bg-white/20 p-2 rounded-xl"><GraduationCap size={20}/></div>
                </div>
                <div className="bg-amber-400/20 border border-amber-400/30 p-4 rounded-2xl backdrop-blur-md flex items-start gap-3">
                    <AlertTriangle className="text-amber-300 shrink-0" size={18} />
                    <p className="text-[10px] font-bold leading-relaxed">Please carry your physical ID Card and Admit Card to the examination hall.</p>
                </div>
            </div>

            {/* Exam Schedule List */}
            <div className="px-5 -mt-12 relative z-20 space-y-4">
                <button className="w-full bg-white p-5 rounded-[2rem] shadow-xl border border-blue-100 flex items-center justify-between group active:scale-95 transition-all">
                    <div className="flex items-center gap-4">
                        <div className="bg-blue-50 text-blue-600 p-3 rounded-2xl">
                            <FileDown size={24} />
                        </div>
                        <div className="text-left">
                            <h3 className="font-black text-slate-800 text-sm uppercase">Download Admit Card</h3>
                            <p className="text-[9px] font-bold text-slate-400 tracking-widest">SESSION FEB-2026</p>
                        </div>
                    </div>
                </button>

                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-2 mt-8">Upcoming Schedule</p>
                
                {examSchedule.map((exam, i) => (
                    <div key={i} className="glass-card p-5 border-l-4 border-l-amber-400">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h4 className="font-extrabold text-slate-800 text-sm leading-tight">{exam.subject}</h4>
                                <span className="text-[9px] font-black text-amber-500 uppercase tracking-tighter">{exam.status}</span>
                            </div>
                            <div className="bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
                                <span className="text-[10px] font-bold text-slate-600 uppercase tracking-tighter">{exam.date}</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 border-t border-slate-50 pt-4">
                            <div className="flex items-center gap-2">
                                <Clock className="text-slate-400" size={14} />
                                <span className="text-[11px] font-bold text-slate-600">{exam.time}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <MapPin className="text-slate-400" size={14} />
                                <span className="text-[11px] font-bold text-slate-600">{exam.room}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Exams;