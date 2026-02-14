import React from 'react';
import { ArrowLeft, Video, User, Clock, Link as LinkIcon, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LiveClass = () => {
    const navigate = useNavigate();

    const classes = [
        { 
            subject: "Web Development II", 
            teacher: "Mr. Sahil Sharma", 
            time: "12:15 PM - 01:15 PM", 
            status: "Live Now", 
            link: "https://meet.google.com/abc-defg-hij",
            color: "bg-red-500" 
        },
        { 
            subject: "Cloud Computing", 
            teacher: "Dr. Anjali Verma", 
            time: "02:30 PM - 03:30 PM", 
            status: "Upcoming", 
            link: "#",
            color: "bg-blue-500" 
        }
    ];

    return (
        <div className="min-h-screen bg-[#f8fafc] pb-24">
            {/* Header */}
            <div className="nav-gradient text-white px-6 pt-12 pb-24 rounded-b-[3rem] shadow-lg relative z-10">
                <div className="flex justify-between items-center mb-6">
                    <button onClick={() => navigate(-1)} className="bg-white/20 p-2 rounded-xl active:scale-90 transition-all">
                        <ArrowLeft size={20} />
                    </button>
                    <h1 className="text-xl font-bold uppercase tracking-tight">Live Classes</h1>
                    <div className="bg-white/20 p-2 rounded-xl"><Video size={20}/></div>
                </div>
                <p className="text-[11px] opacity-90 font-medium ml-2 leading-relaxed">Join your scheduled online lectures and interactive sessions here.</p>
            </div>

            {/* Live Class List */}
            <div className="px-5 -mt-12 relative z-20 space-y-5">
                {classes.map((c, i) => (
                    <div key={i} className="bg-white rounded-[2.5rem] p-6 shadow-xl border border-slate-50 overflow-hidden relative">
                        {/* Status Tag */}
                        <div className={`absolute top-0 right-0 px-6 py-1.5 rounded-bl-3xl ${c.color} text-white text-[9px] font-black uppercase tracking-widest`}>
                            {c.status}
                        </div>

                        <div className="flex flex-col gap-4 mt-2">
                            <div>
                                <h3 className="text-lg font-black text-slate-800 leading-tight">{c.subject}</h3>
                                <div className="flex items-center gap-2 mt-1">
                                    <User size={12} className="text-slate-400" />
                                    <span className="text-[11px] font-bold text-slate-500">{c.teacher}</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                                <Clock size={16} className="text-blue-500" />
                                <span className="text-xs font-black text-slate-700">{c.time}</span>
                            </div>

                            <button 
                                onClick={() => c.link !== "#" && window.open(c.link, "_blank")}
                                disabled={c.status !== "Live Now"}
                                className={`w-full py-4 rounded-3xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg ${
                                    c.status === "Live Now" 
                                    ? "bg-blue-600 text-white shadow-blue-200 active:scale-95" 
                                    : "bg-slate-100 text-slate-400 grayscale"
                                }`}
                            >
                                <ExternalLink size={18} />
                                <span>{c.status === "Live Now" ? "Join Meeting" : "Waiting for Link"}</span>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LiveClass;