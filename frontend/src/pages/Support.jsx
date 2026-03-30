import React, { useState, useEffect } from 'react';
import { ArrowLeft, MessageSquarePlus, LifeBuoy, Clock, CheckCircle2, AlertCircle, Send, ShieldCheck, Cpu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import Loader from '../components/Loader';
import Toast from '../components/Toast';


const Support = () => {
    const navigate = useNavigate();
    const [msg, setMsg] = useState(''); // Alert ki jagah ye use hoga
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        subject: '',
        query: '',
        isUrgent: false
    });

    useEffect(() => {
        const fetchTickets = async () => {
            try {
                setLoading(true);
                const { data } = await API.get('/support/my-queries');
                setTickets(data);
            } catch (err) {
                console.error("Error fetching tickets:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchTickets();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await API.post('/support/ask', {
                subject: formData.subject,
                query: formData.query,
                isUrgent: formData.isUrgent
            });
            // alert hatao, msg set karo
            setMsg("Query! Send to your Class Teacher. 🛰️");
            setIsFormOpen(false);
            // Page reload ki jagah ticket list refresh karna better hai, par tune reload rakha hai toh wahi rehne diya
            setTimeout(() => window.location.reload(), 2000);
        } catch (err) {
            setMsg("Protocol Failure: Link interrupted. ⚠️");
        }
    };

    if (loading) return <Loader />;

    return (
        <div className="min-h-screen bg-void pb-24 font-sans italic text-white">
            {/* Header */}
            <div className="bg-void text-white px-6 pt-12 pb-20 rounded-b-[3rem] shadow-2xl border-b border-neon/20 relative z-10 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-neon/10 to-transparent pointer-events-none"></div>
                <div className="flex justify-between items-center mb-6 relative z-10">
                    <button onClick={() => navigate(-1)} className="bg-white/5 p-2 rounded-xl active:scale-90 border border-white/10 text-neon transition-all">
                        <ArrowLeft size={20} />
                    </button>
                    <h1 className="text-xl font-black uppercase tracking-tighter italic">Student Support</h1>
                    <button onClick={() => setIsFormOpen(!isFormOpen)} className={`p-2 rounded-xl shadow-lg transition-all active:scale-90 border ${isFormOpen ? 'bg-void border-neon text-neon' : 'bg-neon border-neon text-void'}`}>
                        <MessageSquarePlus size={20} />
                    </button>
                </div>
                <div className="flex items-center gap-3 bg-white/5 p-4 rounded-2xl backdrop-blur-md border border-white/10 relative z-10">
                    <div className="p-2 bg-neon/10 rounded-lg">
                        <Cpu className="text-neon animate-pulse" size={20} />
                    </div>
                    <p className="text-[10px] font-black leading-relaxed uppercase tracking-[0.2em] text-neon/60 italic">Connected to Class Teacher.</p>
                </div>
            </div>

            <div className="px-5 -mt-8 relative z-20 space-y-6">
                {isFormOpen && (
                    <div className="bg-slate-900/80 backdrop-blur-xl rounded-[2.5rem] p-6 shadow-2xl border border-neon/20 animate-in fade-in slide-in-from-top-4 duration-500">
                        <h3 className="text-[10px] font-black text-neon uppercase tracking-[0.4em] mb-4 italic flex items-center gap-2">
                            <Send size={12} /> Your Query
                        </h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input
                                type="text"
                                placeholder="Subject (e.g. class Doubt)"
                                className="w-full bg-void border border-white/5 py-4 px-4 rounded-2xl text-xs font-black outline-none focus:border-neon text-white italic"
                                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                required
                            />
                            <textarea
                                placeholder="Details for your Query..."
                                rows="3"
                                className="w-full bg-void border border-white/5 py-4 px-4 rounded-2xl text-xs font-black outline-none focus:border-neon text-white italic placeholder:text-white/20"
                                onChange={(e) => setFormData({ ...formData, query: e.target.value })}
                                required
                            ></textarea>
                            <div className="flex items-center gap-3 ml-2">
                                <input type="checkbox" id="urgent" className="w-4 h-4 accent-neon" onChange={(e) => setFormData({ ...formData, isUrgent: e.target.checked })} />
                                <label htmlFor="urgent" className="text-[10px] font-black uppercase text-red-500 tracking-[0.3em] italic">Urgent Solution</label>
                            </div>
                            <button type="submit" className="w-full bg-neon text-void py-4 rounded-full font-black uppercase text-[10px] tracking-widest shadow-[0_0_20px_rgba(61,242,224,0.3)] active:scale-95 transition-all italic">
                                Send Query
                            </button>
                        </form>
                    </div>
                )}

                <div className="space-y-4">
                    <p className="text-[10px] font-black text-neon/30 uppercase tracking-[0.4em] ml-2 italic">Signal Activated </p>
                    {tickets.length > 0 ? tickets.map((t, i) => (
                        <div key={i} className="bg-slate-900/60 backdrop-blur-xl rounded-[2rem] p-6 shadow-2xl border border-white/5 group hover:border-neon/30 transition-all italic">
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <span className="text-[8px] font-black text-neon/40 uppercase tracking-widest leading-none">Query ID: #{t._id.slice(-6).toUpperCase()}</span>
                                    <h4 className="font-black text-white text-sm leading-tight mt-1 uppercase tracking-tight group-hover:text-neon transition-colors">{t.subject}</h4>
                                </div>
                                <span className={`px-4 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border italic ${t.status === 'Resolved' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-amber-500/10 text-amber-400 border-amber-500/30'}`}>
                                    {t.status}
                                </span>
                            </div>

                            {/* Query Content */}
                            <p className="text-[11px] text-white/40 mb-4 px-1 leading-relaxed">"{t.query}"</p>

                            {/* DAY 136: FACULTY RESOLUTION UI */}
                            {t.answer && (
                                <div className="mb-4 p-4 bg-void/80 rounded-2xl border border-emerald-500/20 shadow-inner relative overflow-hidden group-hover:border-emerald-500/40 transition-all">
                                    <div className="absolute top-0 right-0 p-2 opacity-5">
                                        <CheckCircle2 size={48} className="text-emerald-500" />
                                    </div>
                                    <p className="text-[8px] font-black text-emerald-400 uppercase mb-1.5 tracking-widest flex items-center gap-1.5">
                                        <ShieldCheck size={10} /> Faculty Solution:
                                    </p>
                                    <p className="text-[11px] font-black text-white/80 italic leading-relaxed relative z-10">
                                        "{t.answer}"
                                    </p>
                                </div>
                            )}

                            <div className="flex justify-between items-center border-t border-white/5 pt-4">
                                <div className="flex items-center gap-1.5 text-white/20">
                                    <Clock size={12} />
                                    <span className="text-[10px] font-black uppercase tracking-tighter">{new Date(t.createdAt).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <AlertCircle size={12} className={t.isUrgent ? 'text-red-500 animate-pulse' : 'text-neon/30'} />
                                    <span className={`text-[9px] font-black uppercase tracking-widest ${t.isUrgent ? 'text-red-500' : 'text-white/20'}`}>
                                        {t.isUrgent ? 'Urgent Query' : 'Normal Query'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )) : (
                        <div className="text-center py-20 bg-void/50 rounded-[3rem] border border-dashed border-white/10 shadow-inner">
                            <LifeBuoy className="mx-auto text-white/5 mb-4 animate-pulse" size={48} />
                            <p className="text-white/20 font-black text-[10px] uppercase tracking-[0.4em] italic">No Support Signals Found</p>
                        </div>
                    )}
                </div>
            </div>
            {msg && <Toast message={msg} onClose={() => setMsg('')} />}
        </div>
    );
};

export default Support;