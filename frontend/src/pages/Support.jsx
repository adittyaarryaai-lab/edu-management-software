import React, { useState, useEffect } from 'react';
import { ArrowLeft, MessageSquarePlus, LifeBuoy, Clock, CheckCircle2, AlertCircle, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import API from '../api'; 
import Loader from '../components/Loader';

const Support = () => {
    const navigate = useNavigate();
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
            alert("Ticket Raised Successfully! 🛰️");
            setIsFormOpen(false);
            window.location.reload();
        } catch (err) {
            alert("Failed to submit ticket");
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
                    <h1 className="text-xl font-black uppercase tracking-tighter italic">Help Center</h1>
                    <button onClick={() => setIsFormOpen(!isFormOpen)} className={`p-2 rounded-xl shadow-lg transition-all active:scale-90 border ${isFormOpen ? 'bg-void border-neon text-neon' : 'bg-neon border-neon text-void'}`}>
                        <MessageSquarePlus size={20} />
                    </button>
                </div>
                <div className="flex items-center gap-3 bg-white/5 p-4 rounded-2xl backdrop-blur-md border border-white/10 relative z-10">
                    <LifeBuoy className="text-neon animate-spin-slow" size={24} />
                    <p className="text-[10px] font-black leading-relaxed uppercase tracking-[0.2em] text-neon/60 italic">Network Anomalies? Deploy a ticket for node resolution.</p>
                </div>
            </div>

            <div className="px-5 -mt-8 relative z-20 space-y-6">
                {isFormOpen && (
                    <div className="bg-slate-900/80 backdrop-blur-xl rounded-[2.5rem] p-6 shadow-2xl border border-neon/20 animate-in fade-in slide-in-from-top-4 duration-500">
                        <h3 className="text-[10px] font-black text-neon uppercase tracking-[0.4em] mb-4 italic">Deploy New Query</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input type="text" placeholder="Anomaly Subject (e.g. Node Doubt)" className="w-full bg-void border border-white/5 py-4 px-4 rounded-2xl text-xs font-black outline-none focus:border-neon text-white italic" onChange={(e) => setFormData({...formData, subject: e.target.value})} required />
                            <textarea placeholder="Describe interference details..." rows="3" className="w-full bg-void border border-white/5 py-4 px-4 rounded-2xl text-xs font-black outline-none focus:border-neon text-white italic placeholder:text-white/20" onChange={(e) => setFormData({...formData, query: e.target.value})} required></textarea>
                            <div className="flex items-center gap-3 ml-2">
                                <input type="checkbox" id="urgent" className="w-4 h-4 accent-neon" onChange={(e) => setFormData({...formData, isUrgent: e.target.checked})} />
                                <label htmlFor="urgent" className="text-[10px] font-black uppercase text-red-500 tracking-[0.3em] italic">Prioritize (High Urgency)</label>
                            </div>
                            <button type="submit" className="w-full bg-neon text-void py-4 rounded-full font-black uppercase text-[10px] tracking-widest shadow-[0_0_20px_rgba(61,242,224,0.3)] active:scale-95 transition-all italic">
                                <Send size={18} /> Transmit Query Ticket
                            </button>
                        </form>
                    </div>
                )}

                <div className="space-y-4">
                    <p className="text-[10px] font-black text-neon/30 uppercase tracking-[0.4em] ml-2 italic">Neural Signal Archive</p>
                    {tickets.length > 0 ? tickets.map((t, i) => (
                        <div key={i} className="bg-white/5 backdrop-blur-xl rounded-[2rem] p-6 shadow-2xl border border-white/5 group hover:border-neon/30 transition-all italic">
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <span className="text-[8px] font-black text-neon/40 uppercase tracking-widest leading-none">Node Hash: #{t._id.slice(-6).toUpperCase()}</span>
                                    <h4 className="font-black text-white text-sm leading-tight mt-1 uppercase tracking-tight group-hover:text-neon transition-colors">{t.subject}</h4>
                                </div>
                                <span className={`px-4 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border italic ${t.status === 'Resolved' ? 'bg-neon/10 text-neon border-neon/30' : 'bg-orange-500/10 text-orange-400 border-orange-500/30'}`}>
                                    {t.status}
                                </span>
                            </div>
                            {t.answer && (
                                <div className="mb-4 p-4 bg-void/60 rounded-2xl border border-neon/10 shadow-inner">
                                    <p className="text-[8px] font-black text-neon uppercase mb-1 tracking-widest">Faculty Resolution:</p>
                                    <p className="text-[11px] font-black text-white/80 italic leading-relaxed">"{t.answer}"</p>
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
                                        {t.isUrgent ? 'Priority Level High' : 'Medium Priority'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )) : (
                        <div className="text-center py-20 bg-white/5 rounded-[3rem] border border-dashed border-white/10 shadow-inner">
                             <LifeBuoy className="mx-auto text-white/5 mb-4 animate-pulse" size={48} />
                             <p className="text-white/20 font-black text-[10px] uppercase tracking-[0.4em] italic">No Signal Tickets Archived</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Support;