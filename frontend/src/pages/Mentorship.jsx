import React from 'react';
import { ArrowLeft, Users, MessageCircle, Phone, Calendar, Star, Info, Construction, ShieldAlert, Zap } from 'lucide-react';
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
        <div className="min-h-screen bg-void text-white font-sans italic overflow-hidden relative flex flex-col justify-center items-center p-6">
            {/* Background Glow Effect */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-neon/10 blur-[120px] rounded-full pointer-events-none"></div>

            {/* Top Navigation */}
            <div className="absolute top-10 left-6 z-30">
                <button
                    onClick={() => navigate(-1)}
                    className="bg-white/5 p-3 rounded-2xl active:scale-90 border border-white/10 text-neon hover:bg-neon/10 transition-all shadow-lg"
                >
                    <ArrowLeft size={24} />
                </button>
            </div>

            {/* Main Content */}
            <div className="relative z-10 flex flex-col items-center text-center">
                {/* Animated Icon */}
                <div className="mb-8 relative">
                    <div className="absolute inset-0 bg-neon/20 blur-2xl rounded-full animate-pulse"></div>
                    <div className="bg-slate-900 border border-neon/30 p-8 rounded-[2.5rem] relative">
                        <Construction size={60} className="text-neon animate-bounce" strokeWidth={1.5} />
                    </div>
                    <Zap size={24} className="absolute -top-2 -right-2 text-neon fill-neon animate-pulse" />
                </div>

                {/* Text Section */}
                <h1 className="text-4xl font-black uppercase tracking-[0.2em] mb-4 italic leading-none">
                    Module <span className="text-neon">Under</span> <br /> Construction
                </h1>

                <div className="h-[2px] w-24 bg-gradient-to-r from-transparent via-neon to-transparent mb-6"></div>

                <p className="text-[11px] text-white/40 font-bold uppercase tracking-[0.4em] max-w-[300px] leading-relaxed">
                    Neural network for central inbox is being synchronized. <br />
                    <span className="text-neon/60">Estimated deploy: Coming Soon</span>
                </p>

                {/* Status Indicator */}
                <div className="mt-12 flex items-center gap-3 bg-white/5 px-6 py-3 rounded-full border border-white/10">
                    <div className="w-2 h-2 bg-neon rounded-full animate-ping"></div>
                    <span className="text-[9px] font-black uppercase tracking-widest text-white/60">
                        System Protocol 119: Active
                    </span>
                </div>
            </div>

            {/* Footer Tag */}
            <div className="absolute bottom-10 flex items-center gap-2 opacity-20">
                <ShieldAlert size={12} />
                <p className="text-[8px] font-black uppercase tracking-[0.5em]">EduFlowAI Security Mesh</p>
            </div>
        </div>
    );
};

export default Mentorship;