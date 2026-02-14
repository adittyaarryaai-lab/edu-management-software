import React, { useState } from 'react';
import { ArrowLeft, ClipboardCheck, FileText, Clock, CheckCircle, Plus, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Requests = () => {
    const navigate = useNavigate();
    const [isFormOpen, setIsFormOpen] = useState(false);

    const pastRequests = [
        { id: "REQ-9902", type: "Character Certificate", date: "10 Feb 2026", status: "Approved", color: "text-green-500" },
        { id: "REQ-9845", type: "Official Transcript", date: "02 Feb 2026", status: "Processing", color: "text-blue-500" },
    ];

    return (
        <div className="min-h-screen bg-[#f8fafc] pb-24">
            {/* Header */}
            <div className="nav-gradient text-white px-6 pt-12 pb-20 rounded-b-[3rem] shadow-lg relative z-10">
                <div className="flex justify-between items-center mb-6">
                    <button onClick={() => navigate(-1)} className="bg-white/20 p-2 rounded-xl active:scale-90 transition-all">
                        <ArrowLeft size={20} />
                    </button>
                    <h1 className="text-xl font-bold uppercase tracking-tight">Request Center</h1>
                    <button 
                        onClick={() => setIsFormOpen(!isFormOpen)}
                        className="bg-white text-blue-600 p-2 rounded-xl shadow-lg active:scale-90 transition-all"
                    >
                        <Plus size={20} />
                    </button>
                </div>
                <p className="text-[11px] opacity-90 font-medium ml-2">Apply for official university documents and track their status.</p>
            </div>

            <div className="px-5 -mt-8 relative z-20 space-y-6">
                {/* Application Form */}
                {isFormOpen && (
                    <div className="bg-white rounded-[2.5rem] p-6 shadow-xl border border-blue-50 animate-in fade-in slide-in-from-top-4 duration-300">
                        <h3 className="text-sm font-black text-slate-800 mb-4">New Document Request</h3>
                        <div className="space-y-4">
                            <select className="w-full bg-slate-50 border border-slate-100 py-3.5 px-4 rounded-2xl text-xs font-bold text-slate-700 outline-none">
                                <option>Select Document Type</option>
                                <option>Character Certificate</option>
                                <option>Bonafide Certificate</option>
                                <option>Transfer Certificate (TC)</option>
                                <option>Transcript</option>
                            </select>
                            <textarea placeholder="Reason for request..." rows="3" className="w-full bg-slate-50 border border-slate-100 py-3.5 px-4 rounded-2xl text-xs outline-none"></textarea>
                            <button className="w-full bg-blue-600 text-white py-4 rounded-full font-bold shadow-lg shadow-blue-200 flex items-center justify-center gap-2 active:scale-95 transition-all">
                                <Send size={18} /> Submit Request
                            </button>
                        </div>
                    </div>
                )}

                {/* Tracking List */}
                <div className="space-y-4">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-2">Request History</p>
                    {pastRequests.map((req, i) => (
                        <div key={i} className="glass-card p-5">
                            <div className="flex justify-between items-start mb-3">
                                <div className="flex items-center gap-3">
                                    <div className="p-2.5 bg-blue-50 text-blue-500 rounded-xl">
                                        <FileText size={20} />
                                    </div>
                                    <div>
                                        <h4 className="font-extrabold text-slate-800 text-sm leading-tight">{req.type}</h4>
                                        <p className="text-[10px] font-bold text-slate-400 mt-0.5">{req.id}</p>
                                    </div>
                                </div>
                                <span className={`text-[9px] font-black uppercase px-2.5 py-1 rounded-lg bg-slate-50 ${req.color}`}>
                                    {req.status}
                                </span>
                            </div>
                            <div className="flex justify-between items-center border-t border-slate-50 pt-3 mt-1">
                                <div className="flex items-center gap-1.5 text-slate-400">
                                    <Clock size={12} />
                                    <span className="text-[10px] font-bold uppercase">{req.date}</span>
                                </div>
                                <div className="flex items-center gap-1 text-green-500">
                                    <CheckCircle size={12} />
                                    <span className="text-[9px] font-black uppercase">Verified</span>
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