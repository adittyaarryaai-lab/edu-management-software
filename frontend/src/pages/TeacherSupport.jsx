import React, { useState, useEffect } from 'react';
import { ArrowLeft, MessageCircle, Send, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import Loader from '../components/Loader';

const TeacherSupport = () => {
    const navigate = useNavigate();
    const [queries, setQueries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [reply, setReply] = useState('');

    useEffect(() => {
        const fetchQueries = async () => {
            try {
                const { data } = await API.get('/support/all-queries');
                setQueries(data);
            } catch (err) { console.error(err); }
            finally { setLoading(false); }
        };
        fetchQueries();
    }, []);

    const handleResolve = async (id) => {
        if (!reply) return alert("Enter resolution log first!");
        try {
            await API.put(`/support/resolve/${id}`, { answer: reply });
            alert("Solution Transmitted! ✅");
            window.location.reload();
        } catch (err) { alert("Resolution failed"); }
    };

    if (loading) return <Loader />;

    return (
        <div className="min-h-screen bg-void pb-24 font-sans italic text-white">
            <div className="bg-void text-white px-6 pt-12 pb-20 rounded-b-[3rem] shadow-2xl border-b border-neon/20 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-neon/10 to-transparent pointer-events-none"></div>
                <button onClick={() => navigate(-1)} className="bg-white/5 p-2 rounded-xl mb-4 border border-white/10 text-neon transition-all active:scale-90 relative z-10">
                    <ArrowLeft size={20}/>
                </button>
                <h1 className="text-xl font-black uppercase tracking-tighter italic relative z-10">Incoming Queries</h1>
            </div>

            <div className="px-5 -mt-8 space-y-6 relative z-20">
                {queries.length > 0 ? queries.map((q) => (
                    <div key={q._id} className="bg-white/5 backdrop-blur-xl p-6 rounded-[2.5rem] shadow-2xl border border-white/5 relative overflow-hidden group hover:border-neon/30 transition-all italic">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                                <div className="bg-neon/10 p-2 rounded-xl text-neon border border-neon/20"><User size={20}/></div>
                                <div>
                                    <h4 className="font-black text-white text-sm uppercase italic tracking-tight group-hover:text-neon transition-all">{q.student?.name}</h4>
                                    <p className="text-[9px] font-black text-white/30 uppercase tracking-widest italic">{q.student?.grade} • {q.subject}</p>
                                </div>
                            </div>
                            {q.isUrgent && <span className="bg-red-600 text-white text-[8px] font-black px-3 py-1 rounded-full uppercase animate-pulse shadow-[0_0_15px_rgba(220,38,38,0.5)]">Urgent</span>}
                        </div>

                        <div className="bg-void/60 p-4 rounded-2xl mb-5 border border-white/5 shadow-inner">
                            <p className="text-xs text-white/50 font-black leading-relaxed italic">"{q.query}"</p>
                        </div>

                        {q.status === 'Pending' ? (
                            <div className="space-y-4">
                                <textarea 
                                    placeholder="Type neural resolution protocol here..." 
                                    className="w-full bg-void p-4 rounded-2xl border border-white/5 text-sm font-black text-white outline-none focus:border-neon h-24 italic placeholder:text-white/10"
                                    onChange={(e) => setReply(e.target.value)}
                                />
                                <button 
                                    onClick={() => handleResolve(q._id)}
                                    className="w-full bg-neon text-void py-4 rounded-[1.8rem] font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 active:scale-95 transition-all shadow-[0_0_20px_rgba(61,242,224,0.3)] italic"
                                >
                                    <Send size={16}/> Transmit Resolution
                                </button>
                            </div>
                        ) : (
                            <div className="bg-neon/5 p-4 rounded-2xl border border-neon/20 border-dashed italic">
                                <p className="text-[8px] font-black text-neon uppercase tracking-[0.4em] mb-1">Archived Resolution</p>
                                <p className="text-[11px] text-white/70 font-black italic">"{q.answer}"</p>
                            </div>
                        )}
                    </div>
                )) : (
                    <div className="text-center py-20 bg-void rounded-[3rem] border border-dashed border-white/5 shadow-inner">
                        <MessageCircle className="mx-auto text-neon/10 mb-4 animate-pulse" size={60} />
                        <p className="text-white/20 font-black text-[10px] uppercase tracking-[0.4em] italic text-center">System Equilibrium Reached • No Pending Interrupts</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TeacherSupport;