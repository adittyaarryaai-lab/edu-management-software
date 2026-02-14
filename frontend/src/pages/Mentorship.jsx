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
        <div className="min-h-screen bg-[#f8fafc] pb-24">
            {/* Header */}
            <div className="nav-gradient text-white px-6 pt-12 pb-24 rounded-b-[3.5rem] shadow-lg relative z-10">
                <div className="flex justify-between items-center mb-6">
                    <button onClick={() => navigate(-1)} className="bg-white/20 p-2 rounded-xl active:scale-90 transition-all">
                        <ArrowLeft size={20} />
                    </button>
                    <h1 className="text-xl font-bold uppercase tracking-tight">Mentorship</h1>
                    <div className="bg-white/20 p-2 rounded-xl"><Users size={20}/></div>
                </div>
                
                <div className="flex items-center gap-5">
                    <div className="w-16 h-16 bg-white/20 rounded-2xl border border-white/30 flex items-center justify-center backdrop-blur-md">
                        <Star className="text-yellow-300" size={32} />
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest opacity-70">Assigned Mentor</p>
                        <h2 className="text-xl font-black leading-tight">{mentor.name}</h2>
                    </div>
                </div>
            </div>

            {/* Mentor Details Card */}
            <div className="px-5 -mt-10 relative z-20 space-y-4">
                <div className="bg-white rounded-[2.5rem] p-6 shadow-xl border border-slate-50">
                    <div className="space-y-4">
                        <div className="flex items-center gap-4 border-b border-slate-50 pb-4">
                            <div className="bg-blue-50 p-3 rounded-xl text-blue-500"><Info size={20}/></div>
                            <div>
                                <p className="text-[9px] font-bold text-slate-400 uppercase">Designation</p>
                                <p className="text-sm font-bold text-slate-700">{mentor.designation}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 border-b border-slate-50 pb-4">
                            <div className="bg-orange-50 p-3 rounded-xl text-orange-500"><Calendar size={20}/></div>
                            <div>
                                <p className="text-[9px] font-bold text-slate-400 uppercase">Cabin Location</p>
                                <p className="text-sm font-bold text-slate-700">{mentor.cabin}</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mt-6">
                        <a href={`tel:${mentor.phone}`} className="flex items-center justify-center gap-2 bg-green-50 text-green-600 py-3.5 rounded-2xl font-bold text-xs active:scale-95 transition-all">
                            <Phone size={16} /> Call
                        </a>
                        <button className="flex items-center justify-center gap-2 bg-blue-50 text-blue-600 py-3.5 rounded-2xl font-bold text-xs active:scale-95 transition-all">
                            <MessageCircle size={16} /> Email
                        </button>
                    </div>
                </div>

                {/* Meetings Section */}
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 mt-6">Upcoming Sessions</h3>
                {upcomingMeetings.map((m, i) => (
                    <div key={i} className="glass-card p-5 border-l-4 border-l-blue-500">
                        <div className="flex justify-between items-start">
                            <div>
                                <h4 className="font-extrabold text-slate-800 text-sm leading-tight">{m.topic}</h4>
                                <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-tighter">{m.type} Meeting</p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs font-black text-blue-600 uppercase">{m.date}</p>
                                <p className="text-[10px] font-bold text-slate-400">{m.time}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Mentorship;