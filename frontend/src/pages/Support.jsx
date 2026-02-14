import React, { useState } from 'react';
import { ArrowLeft, MessageSquarePlus, LifeBuoy, Clock, CheckCircle2, AlertCircle, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Support = () => {
    const navigate = useNavigate();
    const [isFormOpen, setIsFormOpen] = useState(false);

    const tickets = [
        { id: "#TK-8821", subject: "Fee Receipt Not Generated", date: "12 Feb 2026", status: "Pending", priority: "High" },
        { id: "#TK-8710", subject: "Attendance Correction - Physics", date: "05 Feb 2026", status: "Resolved", priority: "Medium" },
    ];

    return (
        <div className="min-h-screen bg-[#f8fafc] pb-24">
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
                    <p className="text-[11px] font-medium leading-relaxed">Have a problem? Raise a ticket and our team will get back to you shortly.</p>
                </div>
            </div>

            <div className="px-5 -mt-8 relative z-20 space-y-6">
                {/* Raise Ticket Form */}
                {isFormOpen && (
                    <div className="bg-white rounded-[2.5rem] p-6 shadow-xl border border-blue-50 animate-in fade-in slide-in-from-top-4 duration-300">
                        <h3 className="text-sm font-bold text-slate-800 mb-4">Raise New Ticket</h3>
                        <div className="space-y-4">
                            <select className="w-full bg-slate-50 border border-slate-100 py-3.5 px-4 rounded-2xl text-xs font-bold text-slate-700 outline-none">
                                <option>Select Department</option>
                                <option>Accounts & Fees</option>
                                <option>Academic Affairs</option>
                                <option>IT Support</option>
                            </select>
                            <input type="text" placeholder="Subject" className="w-full bg-slate-50 border border-slate-100 py-3.5 px-4 rounded-2xl text-xs outline-none" />
                            <textarea placeholder="Describe your issue..." rows="3" className="w-full bg-slate-50 border border-slate-100 py-3.5 px-4 rounded-2xl text-xs outline-none"></textarea>
                            <button className="w-full bg-blue-500 text-white py-4 rounded-full font-bold shadow-lg shadow-blue-200 flex items-center justify-center gap-2 active:scale-95 transition-all">
                                <Send size={18} /> Submit Ticket
                            </button>
                        </div>
                    </div>
                )}

                {/* Tickets History */}
                <div className="space-y-4">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-2">My Recent Tickets</p>
                    {tickets.map((t, i) => (
                        <div key={i} className="glass-card p-5">
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <span className="text-[10px] font-black text-blue-500 uppercase">{t.id}</span>
                                    <h4 className="font-extrabold text-slate-800 text-sm leading-tight mt-1">{t.subject}</h4>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase ${
                                    t.status === 'Resolved' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'
                                }`}>
                                    {t.status}
                                </span>
                            </div>
                            
                            <div className="flex justify-between items-center border-t border-slate-50 pt-3">
                                <div className="flex items-center gap-1.5 text-slate-400">
                                    <Clock size={12} />
                                    <span className="text-[10px] font-bold">{t.date}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <AlertCircle size={12} className={t.priority === 'High' ? 'text-red-400' : 'text-orange-400'} />
                                    <span className="text-[10px] font-bold text-slate-500 uppercase">{t.priority} Priority</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Support;