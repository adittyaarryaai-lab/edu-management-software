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

    // --- DAY 142: SNAPSHOT SYNCED MATH (TEACHER VIEW) ---
    const totalPenalty = audit?.totalPenalty || 0;
    const finalRemaining = audit?.remaining || 0; // Backend ab (Balance + Total Penalty) bhej raha hai
    
    const isFeesDone = finalRemaining <= 0;
    const statusText = isFeesDone ? "COMPLETED" : "PAYMENT REQUIRED";

    const structureTotal = audit?.totalExpected || 0;
    const advanceMoney = audit?.advance || 0;
    return (
        <div className="min-h-screen bg-void text-white p-6 font-sans italic pb-24">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <button onClick={() => navigate(-1)} className="p-2 bg-white/5 rounded-xl border border-white/10 active:scale-90 transition-all">
                    <ArrowLeft size={20} className="text-orange-500" />
                </button>
                <h1 className="text-xl font-black uppercase tracking-tighter">Student Records Check</h1>
            </div>

            {/* --- TOP STATUS BAR (TEACHER VIEW SYNC) --- */}
            <div className={`p-8 rounded-[2.5rem] border-2 mb-8 relative overflow-hidden ${isFeesDone ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-rose-500/10 border-rose-500/30'}`}>
                <div className="flex justify-between items-start relative z-10 text-left">
                    <div>
                        <h2 className="text-2xl font-black uppercase tracking-tighter mb-1">{audit.student.name}</h2>
                        <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest">
                            ADM: {audit.student.admissionNo || 'N/A'} • SEC: {audit.student.grade}
                        </p>
                    </div>
                    <div className={`px-4 py-2 rounded-full text-[8px] font-black uppercase tracking-widest flex items-center gap-2 ${isFeesDone ? 'bg-emerald-500 text-black shadow-[0_0_15px_rgba(16,185,129,0.4)]' : 'bg-rose-600 text-white animate-pulse shadow-[0_0_15px_rgba(225,29,72,0.4)]'}`}>
                        {isFeesDone ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />}
                        {statusText}
                    </div>
                </div>

                {/* --- StudentLedger.jsx Update --- */}

                <div className="mt-8 flex items-baseline gap-2 text-left">
                    {/* Final Remaining (Includes Live + Frozen Penalty) */}
                    <span className={`text-4xl font-black tracking-tighter ${isFeesDone ? 'text-emerald-400' : 'text-white'}`}>
                        ₹{finalRemaining.toLocaleString()}
                    </span>
                    <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Total Outstanding</span>
                </div>
                {/* Naya Penalty Alert Box add karo (Advance Payment ke niche) */}
                {totalPenalty > 0 && (
                    <div className="mt-4 flex items-center gap-2 bg-rose-500/10 px-4 py-3 rounded-2xl border border-rose-500/20 text-left">
                        <AlertCircle size={14} className="text-rose-500 animate-pulse" />
                        <div className="flex flex-col">
                            <span className="text-[9px] font-black text-rose-500 uppercase tracking-widest">Accrued Penalty Dues</span>
                            <span className="text-[8px] font-bold text-white/40 uppercase italic">
                                ₹{totalPenalty.toLocaleString()} Fine included in total balance
                            </span>
                        </div>
                    </div>
                )}

                {advanceMoney > 0 && (
                    <div className="mt-4 flex items-center gap-2 bg-emerald-500/20 px-4 py-2 rounded-xl border border-emerald-500/20 w-fit">
                        <Wallet size={12} className="text-emerald-400" />
                        <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest italic">
                            Surplus Secured: ₹{advanceMoney.toLocaleString()}
                        </span>
                    </div>
                )}
            </div>

            {/* --- QUICK STATS GRID --- */}
            <div className="grid grid-cols-2 gap-4 mb-10">
                <div className="bg-slate-900/60 p-6 rounded-[2rem] border border-white/5">
                    <p className="text-[7px] font-black text-white/20 uppercase mb-2">Collected in {audit?.currentMonth}</p>
                    <p className="text-lg font-black text-emerald-400">₹{audit?.totalPaidThisMonth?.toLocaleString() || "0"}</p>
                </div>
                <div className="bg-slate-900/60 p-6 rounded-[2rem] border border-white/5">
                    <p className="text-[7px] font-black text-white/20 uppercase mb-2">Active Structure Balance</p>
                    <p className="text-lg font-black text-white/40">₹{audit?.totalExpected?.toLocaleString() || "0"}</p>
                </div>
            </div>

            {/* --- ASSESSMENT BREAKDOWN (SETTLED LOGIC) --- */}
            <div className="bg-slate-900/60 rounded-[2.5rem] border border-white/5 overflow-hidden mb-10 shadow-2xl">
                <div className="p-6 bg-white/5 border-b border-white/5 flex items-center gap-3">
                    <Layers size={14} className="text-orange-500" />
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-white/40">Component Integrity Check</h3>
                </div>
                <div className="p-6 space-y-4">
                    {audit?.structureDetails?.map((item, i) => (
                        <div key={i} className={`flex justify-between items-center border-b border-white/5 pb-3 last:border-0 ${item.isPaid ? 'opacity-30' : ''}`}>
                            <div className="flex flex-col">
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-bold text-white/60 uppercase">{item.label}</span>
                                    {item.isPaid && <span className="text-[6px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded-full font-black italic">SETTLED</span>}
                                </div>
                                <span className={`text-[6px] font-black uppercase tracking-widest mt-1 ${item.cycle === 'monthly' ? 'text-cyan-400' : 'text-amber-500'}`}>
                                    {item.cycle === 'monthly' ? '• Per Month' : '• One Time'}
                                </span>
                            </div>
                            <span className={`text-sm font-black italic ${item.isPaid ? 'line-through' : ''}`}>₹{item?.amount?.toLocaleString() || "0"}</span>
                        </div>
                    ))}
                    <div className="pt-4 border-t border-orange-500/20 flex justify-between items-center">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black text-orange-500 uppercase italic">Expected Exposure</span>
                            <span className="text-[6px] text-white/20 uppercase font-black">Net since join date</span>
                        </div>
                        <span className="text-xl font-black text-white italic tracking-tighter">₹{structureTotal.toLocaleString()}</span>
                    </div>
                </div>
            </div>

            {/* --- UPGRADED TEACHER VIEW: MONTHLY GROUPED HISTORY --- */}
            <div className="space-y-6 mt-12">
                <div className="flex items-center gap-2 ml-2 mb-4">
                    <History size={14} className="text-orange-500" />
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30">Verified Ledger Entries</h3>
                </div>

                {audit.history && Object.keys(audit.history).length > 0 ? (
                    Object.entries(audit.history).map(([monthYear, records]) => (
                        <div key={monthYear} className="space-y-4 mb-8">
                            {/* Month Header Label */}
                            <div className="flex items-center gap-4 px-2">
                                <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-orange-500/20 to-transparent"></div>
                                <span className="text-[9px] font-black uppercase tracking-[0.4em] text-orange-500/60">{monthYear}</span>
                                <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-orange-500/20 to-transparent"></div>
                            </div>

                            {/* Monthly Records List */}
                            <div className="space-y-3">
                                {records.map((h, idx) => (
                                    <div key={idx} className="bg-slate-900/40 p-5 rounded-[2.2rem] border border-white/5 flex justify-between items-center group hover:bg-orange-500/5 transition-all">
                                        {/* --- StudentLedger.jsx Fix --- */}
                                        <div className="flex items-center gap-4">
                                            <div className="bg-white/5 p-3 rounded-2xl text-orange-500 group-hover:bg-orange-500 group-hover:text-void transition-colors">
                                                <Calendar size={16} />
                                            </div>
                                            <div>
                                                {/* Yahan 'pay' ki jagah 'h' use karna hai kyunki loop variable 'h' hai */}
                                                <p className="text-[11px] font-black uppercase text-white tracking-tight">
                                                    {h.category || 'GENERAL FEE'}
                                                </p>
                                                <p className="text-[8px] font-bold text-white/20 uppercase mt-0.5">
                                                    {new Date(h.date).toLocaleDateString('en-GB')} • {h.mode}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-black text-emerald-400 italic">+ ₹{h.amount.toLocaleString()}</p>
                                            <div className="flex items-center justify-end gap-1 opacity-20 group-hover:opacity-100 transition-opacity">
                                                <div className="w-1 h-1 rounded-full bg-emerald-400"></div>
                                                <p className="text-[6px] font-black text-white uppercase tracking-widest">Captured</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-20 bg-slate-900/20 rounded-[3rem] border border-dashed border-white/5 mx-2">
                        <AlertCircle size={30} className="mx-auto mb-4 text-white/10" />
                        <p className="text-[9px] font-black uppercase tracking-widest text-white/20 italic">No Transactional Data Logged</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentLedger;