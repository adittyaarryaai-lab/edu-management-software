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
            // FIX 1: Agar user nahi hai toh loading band karo, wait mat karo
            if (!user || !user.grade) {
                setLoading(false);
                return;
            }

            try {
                // FIX 2: setLoading(true) ko yahan rakha hai
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
    }, [user?.grade]); // Specially user grade badalne par trigger hoga

    // FIX 3: Agar loading false hai aur user grade missing hai toh empty state dikhao
    if (loading) return <Loader />;

    return (
        <div className="min-h-screen bg-[#f8fafc] pb-24 font-sans italic">
            {/* Header */}
            <div className="nav-gradient text-white px-6 pt-12 pb-24 rounded-b-[3rem] shadow-lg relative z-10">
                <div className="flex justify-between items-center mb-6">
                    <button onClick={() => navigate(-1)} className="bg-white/20 p-2 rounded-xl active:scale-90 transition-all border border-white/10">
                        <ArrowLeft size={20} />
                    </button>
                    <h1 className="text-xl font-black uppercase tracking-tight">Live Classes</h1>
                    <div className="bg-white/20 p-2 rounded-xl"><Video size={20} /></div>
                </div>
                <p className="text-[11px] opacity-90 font-medium ml-2 leading-relaxed uppercase tracking-widest">Join your scheduled online lectures and interactive sessions here.</p>
            </div>

            {/* Live Class List */}
            <div className="px-5 -mt-12 relative z-20 space-y-5">
                {classes.length > 0 ? classes.map((c, i) => (
                    <div key={i} className="bg-white rounded-[2.5rem] p-6 shadow-xl border border-slate-50 overflow-hidden relative group">
                        <div className={`absolute top-0 right-0 px-6 py-1.5 rounded-bl-3xl ${c.status === 'Live' ? 'bg-red-500 animate-pulse' : 'bg-blue-500'} text-white text-[9px] font-black uppercase tracking-widest`}>
                            {c.status === 'Live' ? 'Live Now' : c.status}
                        </div>

                        <div className="flex flex-col gap-4 mt-2">
                            <div>
                                <h3 className="text-lg font-black text-slate-800 leading-tight uppercase italic">{c.subject}</h3>
                                <div className="flex items-center gap-2 mt-1">
                                    <User size={12} className="text-slate-400" />
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Topic: {c.topic}</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                                <Clock size={16} className="text-blue-500" />
                                <span className="text-xs font-black text-slate-700 uppercase tracking-tighter">
                                    {new Date(c.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {new Date(c.startTime).toLocaleDateString()}
                                </span>
                            </div>

                            <button
                                onClick={() => c.meetingLink && window.open(c.meetingLink, "_blank")}
                                className={`w-full py-4 rounded-3xl font-black uppercase text-[10px] tracking-[0.2em] flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95 ${c.status === "Live" || c.status === "Upcoming"
                                        ? "bg-slate-900 text-white shadow-slate-200"
                                        : "bg-slate-100 text-slate-400 grayscale"
                                    }`}
                            >
                                <ExternalLink size={18} />
                                <span>Join Neural Session</span>
                            </button>
                        </div>
                    </div>
                )) : (
                    <div className="bg-white rounded-[3rem] p-16 flex flex-col items-center justify-center border border-dashed border-slate-200 shadow-inner italic">
                        <Zap size={40} className="text-slate-100 mb-4" />
                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] text-center">No Live Classes Scheduled</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LiveClass;