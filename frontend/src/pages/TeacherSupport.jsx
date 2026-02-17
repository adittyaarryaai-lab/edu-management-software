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
        if (!reply) return alert("Please type an answer first!");
        try {
            await API.put(`/support/resolve/${id}`, { answer: reply });
            alert("Solution Transmitted! ✅");
            window.location.reload();
        } catch (err) { alert("Resolution failed"); }
    };

    if (loading) return <Loader />;

    return (
        <div className="min-h-screen bg-[#f8fafc] pb-24 font-sans italic">
            <div className="nav-gradient text-white px-6 pt-12 pb-20 rounded-b-[3rem] shadow-lg">
                <button onClick={() => navigate(-1)} className="bg-white/20 p-2 rounded-xl mb-4"><ArrowLeft size={20}/></button>
                <h1 className="text-xl font-black uppercase tracking-tight">Incoming Queries</h1>
            </div>

            <div className="px-5 -mt-8 space-y-6">
                {queries.length > 0 ? queries.map((q) => (
                    <div key={q._id} className="bg-white p-6 rounded-[2.5rem] shadow-xl border border-slate-50 relative overflow-hidden">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                                <div className="bg-blue-50 p-2 rounded-xl text-blue-600"><User size={20}/></div>
                                <div>
                                    <h4 className="font-black text-slate-800 text-sm uppercase">{q.student?.name}</h4>
                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{q.student?.grade} • {q.subject}</p>
                                </div>
                            </div>
                            {q.isUrgent && <span className="bg-red-500 text-white text-[8px] font-black px-2 py-0.5 rounded-full uppercase animate-pulse">Urgent</span>}
                        </div>

                        <div className="bg-slate-50 p-4 rounded-2xl mb-4">
                            <p className="text-xs text-slate-600 font-bold leading-relaxed italic">"{q.query}"</p>
                        </div>

                        {q.status === 'Pending' ? (
                            <div className="space-y-3">
                                <textarea 
                                    placeholder="Type your solution here..." 
                                    className="w-full bg-slate-50 p-4 rounded-2xl border border-slate-100 text-sm font-bold outline-none focus:border-blue-500 h-24"
                                    onChange={(e) => setReply(e.target.value)}
                                />
                                <button 
                                    onClick={() => handleResolve(q._id)}
                                    className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 active:scale-95 transition-all"
                                >
                                    <Send size={16}/> Resolve Query
                                </button>
                            </div>
                        ) : (
                            <div className="bg-green-50 p-4 rounded-2xl border border-green-100 border-dashed">
                                <p className="text-[8px] font-black text-green-600 uppercase tracking-widest mb-1">Your Resolution</p>
                                <p className="text-[11px] text-green-800 font-bold">{q.answer}</p>
                            </div>
                        )}
                    </div>
                )) : (
                    <div className="text-center py-20 bg-white rounded-[3rem] border border-dashed border-slate-200">
                        <MessageCircle className="mx-auto text-slate-100 mb-4" size={60} />
                        <p className="text-slate-300 font-black text-[10px] uppercase tracking-[0.2em]">All Systems Clear - No Pending Queries</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TeacherSupport;