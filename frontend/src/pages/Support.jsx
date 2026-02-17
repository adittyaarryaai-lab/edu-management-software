import React, { useState, useEffect } from 'react';
import { ArrowLeft, MessageSquarePlus, LifeBuoy, Clock, CheckCircle2, AlertCircle, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import API from '../api'; // Step 4: Backend connection
import Loader from '../components/Loader';

const Support = () => {
    const navigate = useNavigate();
    const [isFormOpen, setIsFormOpen] = useState(false);
    
    // Step 4: Real Data States
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        subject: '',
        query: '',
        isUrgent: false
    });

    // Step 4: Fetch real tickets from backend
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

    // Step 4: Submit Ticket Logic
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
            window.location.reload(); // Refresh to show new ticket
        } catch (err) {
            alert("Failed to submit ticket");
        }
    };

    if (loading) return <Loader />;

    return (
        <div className="min-h-screen bg-[#f8fafc] pb-24 font-sans italic">
            {/* Header */}
            <div className="nav-gradient text-white px-6 pt-12 pb-20 rounded-b-[3rem] shadow-lg relative z-10">
                <div className="flex justify-between items-center mb-6">
                    <button onClick={() => navigate(-1)} className="bg-white/20 p-2 rounded-xl active:scale-90 transition-all">
                        <ArrowLeft size={20} />
                    </button>
                    <h1 className="text-xl font-bold uppercase tracking-tight">Help Center</h1>
                    <button 
                        onClick={() => setIsFormOpen(!isFormOpen)}
                        className="bg-white text-blue-600 p-2 rounded-xl shadow-lg active:scale-90 transition-all"
                    >
                        <MessageSquarePlus size={20} />
                    </button>
                </div>
                <div className="flex items-center gap-3 bg-white/10 p-4 rounded-2xl backdrop-blur-md border border-white/10">
                    <LifeBuoy className="text-blue-200" size={24} />
                    <p className="text-[11px] font-medium leading-relaxed uppercase tracking-tighter">Have a problem? Raise a ticket and our team will get back to you shortly.</p>
                </div>
            </div>

            <div className="px-5 -mt-8 relative z-20 space-y-6">
                {/* Raise Ticket Form */}
                {isFormOpen && (
                    <div className="bg-white rounded-[2.5rem] p-6 shadow-xl border border-blue-50 animate-in fade-in slide-in-from-top-4 duration-300">
                        <h3 className="text-sm font-bold text-slate-800 mb-4">Raise New Ticket</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input 
                                type="text" 
                                placeholder="Subject (e.g. Exam Doubt)" 
                                className="w-full bg-slate-50 border border-slate-100 py-3.5 px-4 rounded-2xl text-xs font-bold outline-none focus:border-blue-300" 
                                onChange={(e) => setFormData({...formData, subject: e.target.value})}
                                required
                            />
                            <textarea 
                                placeholder="Describe your issue..." 
                                rows="3" 
                                className="w-full bg-slate-50 border border-slate-100 py-3.5 px-4 rounded-2xl text-xs font-bold outline-none focus:border-blue-300"
                                onChange={(e) => setFormData({...formData, query: e.target.value})}
                                required
                            ></textarea>
                            
                            {/* Priority Toggle */}
                            <div className="flex items-center gap-2 ml-2">
                                <input 
                                    type="checkbox" 
                                    id="urgent" 
                                    className="w-4 h-4"
                                    onChange={(e) => setFormData({...formData, isUrgent: e.target.checked})}
                                />
                                <label htmlFor="urgent" className="text-[10px] font-black uppercase text-red-500 tracking-widest">Mark as Urgent</label>
                            </div>

                            <button type="submit" className="w-full bg-slate-900 text-white py-4 rounded-full font-black uppercase text-[10px] tracking-widest shadow-lg active:scale-95 transition-all">
                                <Send size={18} /> Submit Ticket
                            </button>
                        </form>
                    </div>
                )}

                {/* Tickets History */}
                <div className="space-y-4">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-2">My Recent Tickets</p>
                    {tickets.length > 0 ? tickets.map((t, i) => (
                        <div key={i} className="bg-white rounded-[2rem] p-5 shadow-sm border border-slate-50">
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <span className="text-[8px] font-black text-blue-500 uppercase tracking-widest">#{t._id.slice(-6)}</span>
                                    <h4 className="font-extrabold text-slate-800 text-sm leading-tight mt-1 uppercase tracking-tighter">{t.subject}</h4>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${
                                    t.status === 'Resolved' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'
                                }`}>
                                    {t.status}
                                </span>
                            </div>
                            
                            {/* Teacher's Reply (If Resolved) */}
                            {t.answer && (
                                <div className="mb-4 p-3 bg-blue-50 rounded-xl border border-blue-100">
                                    <p className="text-[8px] font-black text-blue-400 uppercase mb-1 tracking-widest">Response:</p>
                                    <p className="text-[10px] font-bold text-slate-600 italic leading-tight">"{t.answer}"</p>
                                </div>
                            )}

                            <div className="flex justify-between items-center border-t border-slate-50 pt-3">
                                <div className="flex items-center gap-1.5 text-slate-400">
                                    <Clock size={12} />
                                    <span className="text-[10px] font-bold">{new Date(t.createdAt).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <AlertCircle size={12} className={t.isUrgent ? 'text-red-400' : 'text-orange-400'} />
                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">
                                        {t.isUrgent ? 'High' : 'Medium'} Priority
                                    </span>
                                </div>
                            </div>
                        </div>
                    )) : (
                        <div className="text-center py-20 bg-white rounded-[3rem] border border-dashed border-slate-200">
                             <LifeBuoy className="mx-auto text-slate-100 mb-4" size={48} />
                             <p className="text-slate-300 font-black text-[10px] uppercase tracking-widest">No Active Tickets</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Support;