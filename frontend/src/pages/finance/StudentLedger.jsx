import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, AlertCircle, History, Wallet, User as UserIcon, Calendar, Layers } from 'lucide-react';
import API from '../../api';

const StudentLedger = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [audit, setAudit] = useState(null);

    useEffect(() => {
        const fetchAudit = async () => {
            const { data } = await API.get(`/fees/audit/${id}`);
            setAudit(data);
        };
        fetchAudit();
    }, [id]);

    if (!audit) return <div className="p-20 text-center text-orange-500 animate-pulse font-black uppercase">Decrypting Ledger...</div>;

    return (
        <div className="min-h-screen bg-void text-white p-6 font-sans italic pb-24">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <button onClick={() => navigate(-1)} className="p-2 bg-white/5 rounded-xl border border-white/10 active:scale-90 transition-all">
                    <ArrowLeft size={20} className="text-orange-500" />
                </button>
                <h1 className="text-xl font-black uppercase tracking-tighter">Student Records Check</h1>
            </div>

            {/* --- TOP STATUS BAR --- */}
            <div className={`p-8 rounded-[2.5rem] border-2 mb-8 relative overflow-hidden ${audit.status === 'COMPLETED' ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-rose-500/10 border-rose-500/30'}`}>
                <div className="flex justify-between items-start relative z-10">
                    <div>
                        <h2 className="text-2xl font-black uppercase tracking-tighter mb-1">{audit.student.name}</h2>
                        <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest">
                            ADM: {audit.student.admissionNo || 'N/A'} • SEC: {audit.student.grade}
                        </p>
                    </div>
                    <div className={`px-4 py-2 rounded-full text-[8px] font-black uppercase tracking-widest flex items-center gap-2 ${audit.status === 'COMPLETED' ? 'bg-emerald-500 text-black' : 'bg-rose-600 text-white animate-pulse'}`}>
                        {audit.status === 'COMPLETED' ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />}
                        {audit.status}
                    </div>
                </div>

                <div className="mt-8 flex items-baseline gap-2">
                    <span className="text-4xl font-black tracking-tighter">₹{audit.remaining.toLocaleString()}</span>
                    <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Balance Dues</span>
                </div>

                {audit.advance > 0 && (
                    <div className="mt-4 inline-flex items-center gap-2 bg-emerald-500/20 px-4 py-2 rounded-xl border border-emerald-500/20">
                        <Wallet size={12} className="text-emerald-400" />
                        <span className="text-[9px] font-black text-emerald-400 uppercase">Advance Secured: ₹{audit.advance.toLocaleString()}</span>
                    </div>
                )}
            </div>

            {/* --- QUICK STATS GRID --- */}
            <div className="grid grid-cols-2 gap-4 mb-10">
                <div className="bg-slate-900/60 p-6 rounded-[2rem] border border-white/5">
                    <p className="text-[7px] font-black text-white/20 uppercase mb-2">Collected So Far</p>
                    <p className="text-lg font-black text-emerald-400">₹{audit.totalPaid.toLocaleString()}</p>
                </div>
                <div className="bg-slate-900/60 p-6 rounded-[2rem] border border-white/5">
                    <p className="text-[7px] font-black text-white/20 uppercase mb-2">Expected Total</p>
                    <p className="text-lg font-black text-white/40">₹{audit.totalExpected.toLocaleString()}</p>
                </div>
            </div>

            {/* --- DETAILED FEE STRUCTURE LIST --- */}
            <div className="bg-slate-900/60 rounded-[2.5rem] border border-white/5 overflow-hidden mb-10 shadow-2xl">
                <div className="p-6 bg-white/5 border-b border-white/5 flex items-center gap-3">
                    <Layers size={14} className="text-orange-500" />
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-white/40">Assessment Breakdown</h3>
                </div>
                <div className="p-6 space-y-4">
                    {audit.structureDetails?.map((item, i) => (
                        <div key={i} className="flex justify-between items-center border-b border-white/5 pb-3 last:border-0">
                            <div className="flex flex-col">
                                <span className="text-[10px] font-bold text-white/60 uppercase">{item.label}</span>
                                <span className={`text-[6px] font-black uppercase tracking-widest mt-1 ${item.cycle === 'monthly' ? 'text-cyan-400' : 'text-amber-500'}`}>
                                    {item.cycle === 'monthly' ? '• Per Month' : '• One Time'}
                                </span>
                            </div>
                            <span className="text-sm font-black italic">₹{item.amount.toLocaleString()}</span>
                        </div>
                    ))}
                    <div className="pt-4 border-t border-orange-500/20 flex justify-between items-center">
                        <span className="text-[10px] font-black text-orange-500 uppercase italic">Net Expected for {audit.currentMonth}</span>
                        <span className="text-xl font-black text-white">₹{audit.totalExpected.toLocaleString()}</span>
                    </div>
                </div>
            </div>

            {/* --- TRANSACTION CHRONOLOGY --- */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 ml-2 mb-4">
                    <History size={14} className="text-orange-500" />
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30">Payment History</h3>
                </div>

                {audit.history.length > 0 ? audit.history.map((h, idx) => (
                    <div key={idx} className="bg-slate-900/40 p-5 rounded-[2rem] border border-white/5 flex justify-between items-center group">
                        <div className="flex items-center gap-4">
                            <div className="bg-white/5 p-3 rounded-xl text-white/20"><Calendar size={16} /></div>
                            <div>
                                <p className="text-xs font-black uppercase">₹{h.amount.toLocaleString()} Received</p>
                                <p className="text-[8px] font-bold text-white/20 uppercase mt-0.5">{new Date(h.date).toLocaleDateString()} • {h.mode}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-[7px] font-black text-orange-500 uppercase tracking-widest">{h.month}</p>
                            <p className="text-[9px] font-bold text-white/10 italic">SYNCED</p>
                        </div>
                    </div>
                )) : (
                    <div className="text-center py-10 opacity-20 text-[9px] font-black uppercase tracking-widest">No Records Captured</div>
                )}
            </div>
        </div>
    );
};

export default StudentLedger;