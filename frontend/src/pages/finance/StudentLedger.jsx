import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, AlertCircle, History, Wallet, User as UserIcon, Calendar, Layers } from 'lucide-react';
import API from '../../api';
import Loader from '../../components/Loader';

const StudentLedger = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [audit, setAudit] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAudit = async () => {
            try {
                setLoading(true); // Fetch shuru hote hi loading ON
                const { data } = await API.get(`/fees/audit/${id}`);
                setAudit(data);
            } catch (err) {
                console.error("Ledger decrypt error");
            } finally {
                setLoading(false); // Data mil jaye ya error aaye, loading OFF
            }
        };
        fetchAudit();
    }, [id]);

    if (loading) return <Loader />;

    // const totalPenalty = audit?.totalPenalty || 0;
    const finalRemaining = audit?.remaining || 0;

    const isFeesDone = finalRemaining <= 0;
    const statusText = isFeesDone ? "Completed" : "Payment required";

    const structureTotal = audit?.totalExpected || 0;
    const advanceMoney = audit?.advance || 0;

    return (
        <div className="min-h-screen bg-[#F8FAFC] text-slate-800 p-6 font-sans italic pb-24 text-[15px]">
            {/* Header */}
            <div className="flex items-center gap-5 mb-8 border-l-4 border-[#42A5F5] pl-4">
                <button
                    onClick={() => navigate(-1)}
                    className="p-3 bg-white rounded-2xl border border-[#DDE3EA] shadow-md hover:bg-blue-50 transition-all active:scale-90 group"
                >
                    <ArrowLeft size={24} className="text-[#42A5F5]" />
                </button>
                <h1 className="text-3xl font-black italic tracking-tight capitalize">Student fees records</h1>
            </div>

            {/* TOP STATUS BAR */}
            <div className={`p-8 rounded-[3rem] border shadow-sm mb-8 relative overflow-hidden ${isFeesDone ? 'bg-emerald-50 border-emerald-100' : 'bg-rose-50 border-rose-100'}`}>
                <div className="flex justify-between items-start relative z-10 text-left">
                    <div>
                        <h2 className="text-2xl font-black italic tracking-tight text-slate-800 capitalize mb-1">{audit.student.name}</h2>
                        <p className="text-[14px] font-bold text-slate-400 uppercase tracking-widest">
                            Adm No: {audit.student.admissionNo || 'N/A'} Class: {audit.student.grade}
                        </p>
                    </div>
                    <div className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-sm ${isFeesDone ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white animate-pulse'}`}>
                        {isFeesDone ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
                        {statusText}
                    </div>
                </div>

                <div className="mt-10 flex flex-col items-start gap-2 text-left">

                    <span className={`text-6xl font-black tracking-tighter italic ${isFeesDone ? 'text-emerald-500' : 'text-slate-800'}`}>
                        ₹{finalRemaining.toLocaleString()}
                    </span>

                    <span className="text-[12px] font-bold text-slate-400 uppercase tracking-widest">
                        Total outstanding
                    </span>

                </div>

                {/* {totalPenalty > 0 && (
                    <div className="mt-6 flex items-center gap-3 bg-white/60 px-5 py-4 rounded-[2rem] border border-rose-100 text-left">
                        <AlertCircle size={18} className="text-rose-500" />
                        <div className="flex flex-col">
                            <span className="text-[13px] font-black text-rose-500 uppercase">Late Fees</span>
                            <span className="text-[12px] font-bold text-slate-900 italic">
                                ₹{totalPenalty.toLocaleString()} Fine included in total balance
                            </span>
                        </div>
                    </div>
                )} */}

                {advanceMoney > 0 && (
                    <div className="mt-4 flex items-center gap-3 bg-emerald-500 px-5 py-2.5 rounded-2xl border border-emerald-100 w-fit shadow-md shadow-emerald-100">
                        <Wallet size={16} className="text-white" />
                        <span className="text-[12px] font-black text-white uppercase italic tracking-wider">
                            Surplus secured: ₹{advanceMoney.toLocaleString()}
                        </span>
                    </div>
                )}
            </div>

            {/* QUICK STATS GRID */}
            <div className="grid grid-cols-2 gap-5 mb-10">
                <div className="bg-white p-7 rounded-[2.5rem] border border-[#DDE3EA] shadow-sm">
                    <p className="text-[12px] font-black text-slate-900 uppercase mb-2 tracking-widest italic">Collected in {audit?.currentMonth}:</p>
                    <p className="text-xl font-black text-emerald-500 italic">₹{audit?.totalPaidThisMonth?.toLocaleString() || "0"}</p>
                </div>
                <div className="bg-white p-7 rounded-[2.5rem] border border-[#DDE3EA] shadow-sm">
                    <p className="text-[12px] font-black text-slate-900 uppercase mb-2 tracking-widest italic">Per Month :</p>
                    <p className="text-xl font-black text-slate-900 italic">₹{audit?.totalExpected?.toLocaleString() || "0"}</p>
                </div>
            </div>

            {/* COMPONENT INTEGRITY CHECK */}
            <div className="bg-white rounded-[3rem] border border-[#DDE3EA] overflow-hidden mb-10 shadow-sm">
                <div className="p-6 bg-slate-50 border-b border-slate-100 flex items-center gap-3">
                    <Layers size={18} className="text-[#42A5F5]" />
                    <h3 className="text-[13px] font-black uppercase tracking-widest text-slate-400">Review Components</h3>
                </div>
                <div className="p-8 space-y-5">
                    {audit?.structureDetails?.map((item, i) => (
                        <div key={i} className={`flex justify-between items-center border-b border-slate-50 pb-4 last:border-0 ${item.isPaid ? 'opacity-30' : ''}`}>
                            <div className="flex flex-col">
                                <div className="flex items-center gap-2">
                                    <span className="text-[16px] font-bold text-slate-600 capitalize italic">{item.label}</span>
                                    {item.isPaid && <span className="text-[9px] bg-emerald-100 text-emerald-600 px-3 py-0.5 rounded-full font-black italic">Settled</span>}
                                </div>
                                <span className={`text-[12px] font-black uppercase tracking-widest mt-1 ${item.cycle === 'monthly' ? 'text-blue-400' : 'text-amber-500'}`}>
                                    {item.cycle === 'monthly' ? '• Per month' : '• One time'}
                                </span>
                            </div>
                            <span className={`text-[17px] font-black italic text-slate-700 ${item.isPaid ? 'line-through' : ''}`}>₹{item?.amount?.toLocaleString() || "0"}</span>
                        </div>
                    ))}
                    <div className="pt-6 border-t border-blue-50 flex justify-between items-center">
                        <div className="flex flex-col">
                            <span className="text-[14px] font-black text-[#42A5F5] uppercase italic">Total Expected</span>
                            <span className="text-[10px] text-slate-700 uppercase font-black tracking-widest">Per Month</span>
                        </div>
                        <span className="text-3xl font-black text-slate-800 italic tracking-tighter">₹{structureTotal.toLocaleString()}</span>
                    </div>
                </div>
            </div>

            {/* LEDGER ENTRIES */}
            <div className="space-y-6 mt-12">
                <div className="flex items-center gap-3 ml-4 mb-6">
                    <History size={18} className="text-[#42A5F5]" />
                    <h3 className="text-[13px] font-black text-slate-400 capitalize tracking-widest">Verified Transactions</h3>
                </div>

                {audit.history && Object.keys(audit.history).length > 0 ? (
                    Object.entries(audit.history).map(([monthYear, records]) => (
                        <div key={monthYear} className="space-y-5 mb-10">
                            <div className="flex items-center gap-4 px-4">
                                <div className="h-[1px] flex-1 bg-slate-100"></div>
                                <span className="text-[15px] font-black uppercase tracking-[0.3em] text-[#42A5F5]">{monthYear}</span>
                                <div className="h-[1px] flex-1 bg-slate-100"></div>
                            </div>

                            <div className="space-y-4">
                                {records.map((h, idx) => (
                                    <div key={idx} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 flex justify-between items-center group hover:border-[#42A5F5] transition-all shadow-sm">
                                        <div className="flex items-center gap-5">
                                            <div className="bg-slate-50 p-4 rounded-2xl text-[#42A5F5] group-hover:bg-[#42A5F5] group-hover:text-white transition-all">
                                                <Calendar size={20} />
                                            </div>
                                            <div>
                                                <p className="text-[16px] font-black text-slate-700 capitalize italic group-hover:text-[#42A5F5] transition-colors">
                                                    {h.category?.toLowerCase() || 'general fee'}
                                                </p>
                                                <p className="text-[12px] font-bold text-slate-400 capitalize mt-1">
                                                    {new Date(h.date).toLocaleDateString('en-GB')} • {h.mode}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[18px] font-black text-emerald-500 italic">+ ₹{h.amount.toLocaleString()}</p>
                                            <div className="flex items-center justify-end gap-1 opacity-40">
                                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                                                <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest italic">Captured</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-20 bg-white rounded-[3rem] border border-dashed border-slate-200 mx-4 shadow-sm">
                        <AlertCircle size={40} className="mx-auto mb-4 text-slate-200" />
                        <p className="text-[12px] font-black uppercase tracking-widest text-slate-300 italic">No transactional data logged</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentLedger;