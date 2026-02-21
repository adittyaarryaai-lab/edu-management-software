import React, { useState } from 'react';
import { ArrowLeft, FileText, Clock, CheckCircle, Plus, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Requests = () => {
    const navigate = useNavigate();
    const [isFormOpen, setIsFormOpen] = useState(false);

    const pastRequests = [
        { id: "REQ-9902", type: "Character Certificate", date: "10 Feb 2026", status: "Approved", color: "text-neon" },
        { id: "REQ-9845", type: "Official Transcript", date: "02 Feb 2026", status: "Processing", color: "text-orange-400" },
    ];

    return (
        <div className="min-h-screen bg-void pb-24 font-sans italic text-white">
            {/* Header */}
            <div className="bg-void text-white px-6 pt-12 pb-20 rounded-b-[3rem] shadow-2xl border-b border-neon/20 relative z-10 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-neon/10 to-transparent pointer-events-none"></div>
                <div className="flex justify-between items-center mb-6 relative z-10">
                    <button onClick={() => navigate(-1)} className="bg-white/5 p-2 rounded-xl active:scale-90 border border-white/10 text-neon transition-all">
                        <ArrowLeft size={20} />
                    </button>
                    <h1 className="text-xl font-black uppercase tracking-tighter italic">Request Hub</h1>
                    <button 
                        onClick={() => setIsFormOpen(!isFormOpen)}
                        className={`p-2 rounded-xl shadow-[0_0_15px_rgba(61,242,224,0.3)] transition-all active:scale-90 border ${isFormOpen ? 'bg-void text-neon border-neon' : 'bg-neon text-void border-neon'}`}
                    >
                        <Plus size={20} />
                    </button>
                </div>
                <p className="text-[10px] text-neon/60 font-black uppercase tracking-[0.3em] ml-2 leading-relaxed">Initiate official document requests across the academic network.</p>
            </div>

            <div className="px-5 -mt-8 relative z-20 space-y-6">
                {/* Application Form */}
                {isFormOpen && (
                    <div className="bg-slate-900/80 backdrop-blur-xl rounded-[2.5rem] p-6 shadow-2xl border border-neon/20 animate-in fade-in slide-in-from-top-4 duration-500 italic">
                        <h3 className="text-[10px] font-black text-neon uppercase tracking-[0.4em] mb-4 italic">New Neural Request</h3>
                        <div className="space-y-4">
                            <select className="w-full bg-void border border-white/5 py-4 px-4 rounded-2xl text-xs font-black text-white/80 outline-none focus:border-neon transition-all uppercase italic appearance-none">
                                <option className="bg-void">Select Protocol Type</option>
                                <option className="bg-void">Character Certificate</option>
                                <option className="bg-void">Bonafide Certificate</option>
                                <option className="bg-void">Transfer Certificate (TC)</option>
                                <option className="bg-void">Transcript Matrix</option>
                            </select>
                            <textarea placeholder="Specify reason for request..." rows="3" className="w-full bg-void border border-white/5 py-4 px-4 rounded-2xl text-xs font-black text-white italic outline-none focus:border-neon transition-all placeholder:text-white/10"></textarea>
                            <button className="w-full bg-neon text-void py-4 rounded-full font-black shadow-[0_0_20px_rgba(61,242,224,0.4)] flex items-center justify-center gap-2 active:scale-95 transition-all uppercase text-[10px] tracking-widest italic">
                                <Send size={18} /> Transmit Request
                            </button>
                        </div>
                    </div>
                )}

                {/* Tracking List */}
                <div className="space-y-4">
                    <p className="text-[10px] font-black text-neon/30 uppercase tracking-[0.4em] ml-2 italic">Signal History</p>
                    {pastRequests.map((req, i) => (
                        <div key={i} className="bg-white/5 backdrop-blur-xl p-5 rounded-[2.5rem] border border-white/5 shadow-2xl group hover:border-neon/20 transition-all italic">
                            <div className="flex justify-between items-start mb-3">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-neon/10 text-neon rounded-2xl border border-neon/20 shadow-inner group-hover:bg-neon group-hover:text-void transition-all">
                                        <FileText size={20} />
                                    </div>
                                    <div>
                                        <h4 className="font-black text-white text-sm uppercase italic tracking-tight group-hover:text-neon transition-colors">{req.type}</h4>
                                        <p className="text-[9px] font-black text-neon/30 uppercase tracking-widest mt-0.5">{req.id}</p>
                                    </div>
                                </div>
                                <span className={`text-[9px] font-black uppercase px-3 py-1 rounded-lg bg-void border border-white/5 italic ${req.color}`}>
                                    {req.status}
                                </span>
                            </div>
                            <div className="flex justify-between items-center border-t border-white/5 pt-3 mt-1">
                                <div className="flex items-center gap-1.5 text-white/30">
                                    <Clock size={12} />
                                    <span className="text-[10px] font-black uppercase tracking-tighter">{req.date}</span>
                                </div>
                                <div className="flex items-center gap-1 text-neon/40">
                                    <CheckCircle size={12} />
                                    <span className="text-[8px] font-black uppercase tracking-widest">Hash Verified</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Requests;