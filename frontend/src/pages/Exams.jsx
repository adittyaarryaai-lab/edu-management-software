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
        <div className="min-h-screen bg-void pb-24 font-sans italic">
            <div className="bg-void text-white px-6 pt-12 pb-24 rounded-b-[3rem] shadow-2xl border-b border-neon/20 relative z-10 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-neon/5 to-transparent pointer-events-none"></div>
                <div className="flex justify-between items-center mb-6 relative z-10">
                    <button onClick={() => navigate(-1)} className="bg-white/5 p-2 rounded-xl active:scale-90 border border-white/10 text-neon">
                        <ArrowLeft size={20} />
                    </button>
                    <h1 className="text-xl font-black uppercase tracking-tighter italic">Exam Center</h1>
                    <div className="bg-neon/10 p-2 rounded-xl border border-neon/30 text-neon"><GraduationCap size={20}/></div>
                </div>
                <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-2xl backdrop-blur-md flex items-start gap-3 relative z-10">
                    <AlertTriangle className="text-amber-500 shrink-0 animate-pulse" size={18} />
                    <p className="text-[9px] font-black text-amber-200 uppercase tracking-widest leading-relaxed">Identity Check: PHYSICAL ADMIT CARD & ID REQUIRED FOR HALL UPLINK.</p>
                </div>
            </div>

            <div className="px-5 -mt-12 relative z-20 space-y-4">
                <button className="w-full bg-white/5 backdrop-blur-xl p-5 rounded-[2.5rem] shadow-2xl border border-neon/20 flex items-center justify-between active:scale-95 transition-all group">
                    <div className="flex items-center gap-4">
                        <div className="bg-neon text-void p-3 rounded-2xl shadow-[0_0_15px_rgba(61,242,224,0.3)]">
                            <FileDown size={24} />
                        </div>
                        <div className="text-left">
                            <h3 className="font-black text-white text-xs uppercase italic tracking-tight">Access Hall Ticket</h3>
                            <p className="text-[8px] font-black text-neon/40 tracking-[0.3em] uppercase">Session FEB-2026</p>
                        </div>
                    </div>
                </button>

                <p className="text-[10px] font-black text-neon/30 uppercase tracking-[0.4em] ml-2 mt-8 italic">Evaluation Schedule</p>
                
                {examSchedule.map((exam, i) => (
                    <div key={i} className="bg-white/5 backdrop-blur-xl p-5 rounded-[2.5rem] border border-white/5 border-l-4 border-l-neon shadow-2xl">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h4 className="font-black text-white text-sm uppercase italic tracking-tighter">{exam.subject}</h4>
                                <span className="text-[8px] font-black text-neon uppercase tracking-widest">{exam.status}</span>
                            </div>
                            <div className="bg-void px-3 py-1 rounded-full border border-neon/20">
                                <span className="text-[10px] font-black text-neon/60 uppercase italic tracking-tighter">{exam.date}</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-4">
                            <div className="flex items-center gap-2">
                                <Clock className="text-neon/40" size={14} />
                                <span className="text-[11px] font-black text-white italic tracking-tight">{exam.time}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <MapPin className="text-neon/40" size={14} />
                                <span className="text-[11px] font-black text-white italic tracking-tight">{exam.room}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
export default Exams;