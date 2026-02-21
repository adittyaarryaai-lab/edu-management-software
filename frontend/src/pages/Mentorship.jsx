import React from 'react';
import { ArrowLeft, Users, MessageCircle, Phone, Calendar, Star, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Mentorship = () => {
    const navigate = useNavigate();

    const mentor = {
        name: "Dr. Vikram Singh",
        designation: "Associate Professor (CSE)",
        email: "vikram.singh@university.edu",
        phone: "+91 98123 45678",
        cabin: "Block C, Room 405",
        specialization: "AI & Machine Learning"
    };

    const upcomingMeetings = [
        { date: "18 Feb 2026", time: "03:00 PM", topic: "Monthly Progress Review", type: "In-Person" },
    ];

    return (
        <div className="min-h-screen bg-void pb-24 font-sans italic">
            {/* Header */}
            <div className="bg-void text-white px-6 pt-12 pb-24 rounded-b-[3.5rem] shadow-2xl border-b border-neon/20 relative z-10 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-neon/10 to-transparent pointer-events-none"></div>
                <div className="flex justify-between items-center mb-6 relative z-10">
                    <button onClick={() => navigate(-1)} className="bg-white/5 p-2 rounded-xl active:scale-90 border border-white/10 text-neon transition-all">
                        <ArrowLeft size={20} />
                    </button>
                    <h1 className="text-xl font-black uppercase tracking-tighter italic">Mentorship</h1>
                    <div className="bg-neon/10 p-2 rounded-xl border border-neon/30 text-neon"><Users size={20}/></div>
                </div>
                
                <div className="flex items-center gap-5 relative z-10 mt-4">
                    <div className="w-16 h-16 bg-neon/10 rounded-2xl border border-neon/40 flex items-center justify-center backdrop-blur-md shadow-[0_0_20px_rgba(61,242,224,0.2)]">
                        <Star className="text-neon fill-neon animate-pulse" size={32} />
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-neon/40 italic">Assigned Core Mentor</p>
                        <h2 className="text-xl font-black text-white italic uppercase tracking-tighter">{mentor.name}</h2>
                    </div>
                </div>
            </div>

            {/* Mentor Details Card */}
            <div className="px-5 -mt-10 relative z-20 space-y-4">
                <div className="bg-white/5 backdrop-blur-xl rounded-[2.5rem] p-6 shadow-2xl border border-white/10">
                    <div className="space-y-4">
                        <div className="flex items-center gap-4 border-b border-white/5 pb-4">
                            <div className="bg-neon/10 p-3 rounded-xl text-neon border border-neon/20"><Info size={20}/></div>
                            <div>
                                <p className="text-[9px] font-black text-neon/40 uppercase italic tracking-widest">Node Designation</p>
                                <p className="text-sm font-black text-white uppercase italic">{mentor.designation}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 border-b border-white/5 pb-4">
                            <div className="bg-neon/10 p-3 rounded-xl text-neon border border-neon/20"><Calendar size={20}/></div>
                            <div>
                                <p className="text-[9px] font-black text-neon/40 uppercase italic tracking-widest">Sector Location</p>
                                <p className="text-sm font-black text-white uppercase italic">{mentor.cabin}</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mt-6">
                        <a href={`tel:${mentor.phone}`} className="flex items-center justify-center gap-2 bg-neon/5 text-neon border border-neon/20 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest active:scale-95 transition-all italic">
                            <Phone size={16} /> Link Audio
                        </a>
                        <button className="flex items-center justify-center gap-2 bg-neon text-void py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest active:scale-95 transition-all shadow-[0_0_15px_rgba(61,242,224,0.3)] italic">
                            <MessageCircle size={16} /> Email Data
                        </button>
                    </div>
                </div>

                {/* Meetings Section */}
                <h3 className="text-[10px] font-black text-neon/30 uppercase tracking-[0.4em] ml-2 mt-8 italic">Upcoming Sync Cycles</h3>
                {upcomingMeetings.map((m, i) => (
                    <div key={i} className="bg-white/5 backdrop-blur-xl p-5 rounded-[2.5rem] border border-white/5 border-l-4 border-l-neon shadow-2xl">
                        <div className="flex justify-between items-start">
                            <div>
                                <h4 className="font-black text-white text-sm uppercase italic tracking-tighter">{m.topic}</h4>
                                <p className="text-[9px] font-black text-neon/40 mt-1 uppercase tracking-widest italic">{m.type} Sync</p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs font-black text-neon uppercase italic">{m.date}</p>
                                <p className="text-[10px] font-bold text-white/30 italic uppercase">{m.time}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Mentorship;