import React, { useState, useEffect } from 'react';
import { ArrowLeft, MessageCircle, Send, User, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import Loader from '../components/Loader';
import Toast from '../components/Toast';

const TeacherSupport = () => {
    const navigate = useNavigate();
    const [msg, setMsg] = useState('');
    const [queries, setQueries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [reply, setReply] = useState('');

    useEffect(() => {
        const fetchQueries = async () => {
            try {
                setLoading(true);
                // Day 136: Ab ye sirf assigned class ke queries layega backend se
                const { data } = await API.get('/support/all-queries');
                setQueries(data);
            } catch (err) { 
                console.error("Neural Fetch Error:", err); 
            } finally { 
                setLoading(false); 
            }
        };
        fetchQueries();
    }, []);

    const handleResolve = async (id) => {
    if (!reply.trim()) {
        setMsg("ERROR: Enter resolution protocol! 🛡️");
        return;
    }
    try {
        await API.put(`/support/resolve/${id}`, { answer: reply });
        setMsg("Solution Send! Query Closed. ✅");
        setTimeout(() => window.location.reload(), 2000);
    } catch (err) { 
        setMsg("Transmission failed: Neural link unstable."); 
    }
};

    if (loading) return <Loader />;

    return (
        <div className="min-h-screen bg-void pb-24 font-sans italic text-white">
            {/* Header */}
            <div className="bg-void text-white px-6 pt-12 pb-20 rounded-b-[3rem] shadow-2xl border-b border-neon/20 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-neon/10 to-transparent pointer-events-none"></div>
                <button onClick={() => navigate(-1)} className="bg-white/5 p-2 rounded-xl mb-4 border border-white/10 text-neon transition-all active:scale-90 relative z-10">
                    <ArrowLeft size={20}/>
                </button>
                <h1 className="text-xl font-black uppercase tracking-tighter italic relative z-10 text-neon">Class Suppot</h1>
                <p className="text-[9px] text-white/40 uppercase font-black tracking-[0.3em] mt-1 relative z-10">Assigned Class Queries Only</p>
            </div>

            <div className="px-5 -mt-8 space-y-6 relative z-20">
                {queries.length > 0 ? queries.map((q) => (
                    <div key={q._id} className="bg-slate-900/60 backdrop-blur-xl p-6 rounded-[2.5rem] shadow-2xl border border-white/5 relative overflow-hidden group hover:border-neon/30 transition-all italic">
                        
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                                <div className="bg-neon/10 p-2 rounded-xl text-neon border border-neon/20 shadow-[0_0_15px_rgba(61,242,224,0.1)]">
                                    <User size={20}/>
                                </div>
                                <div>
                                    {/* DAY 136: EXCLUSIVE CLASS BADGE */}
                                    <span className="text-[7px] font-black bg-neon text-void px-2 py-0.5 rounded-md uppercase tracking-widest mb-1.5 inline-block">
                                        Assigned Student
                                    </span>
                                    <h4 className="font-black text-white text-sm uppercase italic tracking-tight group-hover:text-neon transition-all leading-none">{q.student?.name}</h4>
                                    <p className="text-[9px] font-black text-white/30 uppercase tracking-widest mt-1 italic">{q.student?.grade} • Subject: {q.subject}</p>
                                </div>
                            </div>
                            {q.isUrgent && (
                                <span className="bg-red-600 text-white text-[8px] font-black px-3 py-1 rounded-full uppercase animate-pulse shadow-[0_0_15px_rgba(220,38,38,0.4)]">
                                    Urgent Query
                                </span>
                            )}
                        </div>

                        {/* Query Text Box */}
                        <div className="bg-void/60 p-4 rounded-2xl mb-5 border border-white/5 shadow-inner group-hover:bg-void transition-colors">
                            <p className="text-xs text-white/50 font-black leading-relaxed italic group-hover:text-white/80 transition-colors">
                                "{q.query}"
                            </p>
                        </div>

                        {/* Resolution Logic */}
                        {q.status === 'Pending' ? (
                            <div className="space-y-4">
                                <div className="relative">
                                    <textarea 
                                        placeholder="Type your solution here..." 
                                        className="w-full bg-void p-4 rounded-2xl border border-white/5 text-sm font-black text-white outline-none focus:border-neon h-24 italic placeholder:text-white/10"
                                        onChange={(e) => setReply(e.target.value)}
                                    />
                                    <ShieldCheck className="absolute bottom-4 right-4 text-neon/20" size={18} />
                                </div>
                                <button 
                                    onClick={() => handleResolve(q._id)}
                                    className="w-full bg-neon text-void py-4 rounded-[1.8rem] font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 active:scale-95 transition-all shadow-[0_0_20px_rgba(61,242,224,0.3)] italic group-hover:scale-[1.02]"
                                >
                                    <Send size={16}/> Send Solution
                                </button>
                            </div>
                        ) : (
                            <div className="bg-emerald-500/5 p-4 rounded-2xl border border-emerald-500/20 border-dashed italic relative overflow-hidden">
                                <CheckCircle2 className="absolute top-2 right-2 text-emerald-500/10" size={40} />
                                <p className="text-[8px] font-black text-emerald-400 uppercase tracking-[0.4em] mb-1 flex items-center gap-1">
                                    <CheckCircle2 size={10}/> Archived Solution Sent
                                </p>
                                <p className="text-[11px] text-white/70 font-black italic">"{q.answer}"</p>
                            </div>
                        )}
                    </div>
                )) : (
                    <div className="text-center py-24 bg-void/50 rounded-[3rem] border border-dashed border-white/5 shadow-inner">
                        <MessageCircle className="mx-auto text-neon/10 mb-4 animate-pulse" size={60} />
                        <p className="text-white/20 font-black text-[10px] uppercase tracking-[0.4em] italic text-center px-10">System Equilibrium Reached • No Sector Interrupts Found</p>
                    </div>
                )}
            </div>
            {msg && <Toast message={msg} onClose={() => setMsg('')} />}
        </div>
    );
};

export default TeacherSupport;