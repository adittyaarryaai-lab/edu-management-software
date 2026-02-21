import React, { useState, useEffect } from 'react';
import { ArrowLeft, Video, User, Clock, ExternalLink, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import API from '../api'; 
import Loader from '../components/Loader';

const LiveClass = ({ user }) => {
    const navigate = useNavigate();
    const [classes, setClasses] = useState([]); 
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchClasses = async () => {
            if (!user || !user.grade) {
                setLoading(false);
                return;
            }
            try {
                setLoading(true);
                const { data } = await API.get(`/live-classes/my-classes/${encodeURIComponent(user.grade)}`);
                setClasses(data); 
            } catch (err) {
                console.error("Neural Link Error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchClasses();
    }, [user?.grade]);

    if (loading) return <Loader />;

    return (
        <div className="min-h-screen bg-void pb-24 font-sans italic">
            {/* Header */}
            <div className="bg-void text-white px-6 pt-12 pb-24 rounded-b-[3rem] shadow-2xl border-b border-neon/20 relative z-10 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-neon/5 to-transparent pointer-events-none"></div>
                <div className="flex justify-between items-center mb-6 relative z-10">
                    <button onClick={() => navigate(-1)} className="bg-white/5 p-2 rounded-xl active:scale-90 border border-white/10 text-neon transition-all">
                        <ArrowLeft size={20} />
                    </button>
                    <h1 className="text-xl font-black uppercase tracking-tighter italic">Live Classes</h1>
                    <div className="bg-neon/10 p-2 rounded-xl border border-neon/30 text-neon"><Video size={20} /></div>
                </div>
                <p className="text-[10px] text-neon/60 font-black uppercase tracking-[0.3em] ml-2 leading-relaxed">Join scheduled neural lectures and interactive sessions.</p>
            </div>

            {/* Live Class List */}
            <div className="px-5 -mt-12 relative z-20 space-y-5">
                {classes.length > 0 ? classes.map((c, i) => (
                    <div key={i} className="bg-white/5 backdrop-blur-xl rounded-[2.5rem] p-6 shadow-2xl border border-white/5 overflow-hidden relative group">
                        <div className={`absolute top-0 right-0 px-6 py-1.5 rounded-bl-3xl ${c.status === 'Live' ? 'bg-red-600 animate-pulse' : 'bg-neon text-void'} text-[9px] font-black uppercase tracking-widest`}>
                            {c.status === 'Live' ? 'Node Active' : c.status}
                        </div>

                        <div className="flex flex-col gap-4 mt-2">
                            <div>
                                <h3 className="text-lg font-black text-white leading-tight uppercase italic tracking-tight group-hover:text-neon transition-all">{c.subject}</h3>
                                <div className="flex items-center gap-2 mt-1">
                                    <User size={12} className="text-neon/40" />
                                    <span className="text-[10px] font-black text-neon/40 uppercase tracking-widest italic">Core Topic: {c.topic}</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 bg-void p-3 rounded-2xl border border-white/5 shadow-inner">
                                <Clock size={16} className="text-neon" />
                                <span className="text-xs font-black text-white/80 uppercase tracking-tighter italic">
                                    {new Date(c.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {new Date(c.startTime).toLocaleDateString()}
                                </span>
                            </div>

                            <button
                                onClick={() => c.meetingLink && window.open(c.meetingLink, "_blank")}
                                className={`w-full py-4 rounded-3xl font-black uppercase text-[10px] tracking-[0.2em] flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(61,242,224,0.3)] active:scale-95 italic ${c.status === "Live" || c.status === "Upcoming"
                                        ? "bg-neon text-void"
                                        : "bg-void border border-white/5 text-white/20 grayscale"
                                    }`}
                            >
                                <ExternalLink size={18} />
                                <span>Join Neural Session</span>
                            </button>
                        </div>
                    </div>
                )) : (
                    <div className="bg-white/5 rounded-[3rem] p-16 flex flex-col items-center justify-center border border-dashed border-neon/10 shadow-inner">
                        <Zap size={40} className="text-neon/10 mb-4 animate-pulse" />
                        <p className="text-[10px] font-black text-neon/20 uppercase tracking-[0.3em] text-center italic">No Live Transmissions Scheduled</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LiveClass;