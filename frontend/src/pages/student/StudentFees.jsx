import React, { useState, useEffect } from 'react';
import { CreditCard, Calendar, Clock, CheckCircle, AlertCircle, TrendingUp, ArrowLeft } from 'lucide-react';
import API from '../../api';
import { useNavigate } from 'react-router-dom';

const StudentFees = () => {
    const [summary, setSummary] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSummary = async () => {
            try {
                const { data } = await API.get('/fees/student-summary');
                setSummary(data);
            } catch (err) { console.error("Summary Load Error"); }
        };
        fetchSummary();
    }, []);

    if (!summary) return <div className="p-20 text-center animate-pulse text-neon uppercase font-black italic tracking-widest">Accessing Ledger...</div>;

    return (
        <div className="min-h-screen bg-void text-white p-5 pb-32 italic font-sans">
            <div className="flex items-center gap-4 mb-10 border-l-4 border-neon pl-4">
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 bg-white/5 rounded-xl border border-white/10 active:scale-90 transition-all hover:bg-neon/20 hover:border-neon/40"
                >
                    <ArrowLeft size={20} className="text-neon" />
                </button>
                <h1 className="text-xl font-black uppercase tracking-tighter">Finance Overview</h1>
            </div>

            <div className="space-y-6">
                {/* --- MAIN BALANCE CARD --- */}
                <div className="bg-slate-900/60 p-10 rounded-[3rem] border border-white/5 relative overflow-hidden shadow-2xl">
                    <div className="absolute -top-6 -right-6 opacity-5 rotate-12"><CreditCard size={150} /></div>
                    <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] mb-2">
                        {summary.remainingFees < 0 ? 'Advance Deposited' : 'Net Payable Balance'}
                    </p>
                    <h2 className={`text-5xl font-black tracking-tighter mb-2 ${summary.remainingFees < 0 ? 'text-emerald-400' : 'text-neon'}`}>
                        ₹{Math.abs(summary.remainingFees).toLocaleString()}
                        {summary.remainingFees < 0 && <span className="text-xs ml-2 opacity-50 underline tracking-widest">ADVANCE</span>}
                    </h2>
                    {summary.totalPenalty > 0 && (
                        <p className="text-[9px] font-black text-rose-500 uppercase tracking-widest mb-4 flex items-center gap-1">
                            <AlertCircle size={10} /> Includes ₹{summary.totalPenalty.toLocaleString()} Late Fee Penalty
                        </p>
                    )}
                    <div className={`inline-flex items-center gap-2 px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-widest ${summary.status === 'Fully Paid' ? 'bg-emerald-500/20 text-emerald-500 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-500 animate-pulse border border-rose-500/30'}`}>
                        {summary.status === 'Fully Paid' ? <CheckCircle size={12} /> : <AlertCircle size={12} />}
                        {summary.remainingFees < 0 ? 'Advance Paid' : summary.status}
                    </div>
                </div>

                {/* --- STATS GRID --- */}
                <div className="grid grid-cols-2 gap-5">
                    <div className="bg-slate-900/40 p-6 rounded-[2.5rem] border border-white/5 flex flex-col items-center">
                        <TrendingUp size={20} className="text-emerald-400 mb-2 opacity-40" />
                        <p className="text-[7px] font-black text-white/20 uppercase tracking-widest mb-1">Total Paid</p>
                        <p className="text-xl font-black text-white italic">₹{summary.totalPaid.toLocaleString()}</p>
                    </div>
                    <div className="bg-slate-900/40 p-6 rounded-[2.5rem] border border-white/5 flex flex-col items-center">
                        <Layers size={20} className="text-white/20 mb-2 opacity-40" />
                        <p className="text-[7px] font-black text-white/20 uppercase tracking-widest mb-1">Fee Structure</p>
                        <p className="text-xl font-black text-white/40 italic">₹{summary.totalFees.toLocaleString()}</p>
                    </div>
                </div>

                {/* --- TIMELINE INFO --- */}
                <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/5 flex justify-between relative overflow-hidden">
                    <div className="absolute left-0 top-0 h-full w-1 bg-neon/30"></div>
                    <div>
                        <p className="text-[8px] font-black text-white/20 uppercase mb-1">Next Deadline</p>
                        <p className="text-xs font-black text-rose-400">
                            {summary.nextDueDate !== 'No Pending' ? new Date(summary.nextDueDate).toLocaleDateString() : 'CLEAR'}
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-[8px] font-black text-white/20 uppercase mb-1">Last Activity</p>
                        <p className="text-xs font-black text-emerald-400">
                            {summary.lastPaymentDate !== 'N/A' ? new Date(summary.lastPaymentDate).toLocaleDateString() : 'NONE'}
                        </p>
                    </div>
                </div>

                {/* --- POINT 2: FEES DETAILS SECTION --- */}
                <div className="bg-slate-900/60 rounded-[3rem] border border-white/5 overflow-hidden shadow-2xl mt-8">
                    <div className="p-6 border-b border-white/5 bg-white/5 flex items-center gap-3">
                        <Layers size={14} className="text-neon" />
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-white/40">Fee Structure Details</h3>
                    </div>
                    <div className="p-6 space-y-4">
                        <div className="flex justify-between items-center border-b border-white/5 pb-3">
                            <span className="text-[10px] font-bold text-white/40 uppercase tracking-tight">Tuition Fees</span>
                            <span className="text-sm font-black italic text-white">₹{(summary.breakdown?.tuition || 0).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center border-b border-white/5 pb-3">
                            <span className="text-[10px] font-bold text-white/40 uppercase tracking-tight">Transport Fees</span>
                            <span className="text-sm font-black italic text-white">₹{(summary.breakdown?.transport || 0).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center border-b border-white/5 pb-3">
                            <span className="text-[10px] font-bold text-white/40 uppercase tracking-tight">Other Charges</span>
                            <span className="text-sm font-black italic text-white">₹{(summary.breakdown?.others || 0).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center pt-2">
                            <span className="text-[10px] font-black text-neon uppercase italic tracking-widest">Total Fees</span>
                            <span className="text-lg font-black text-neon">₹{summary.totalFees.toLocaleString()}</span>
                        </div>
                    </div>
                </div>

                {/* --- POINT 4: INSTALLMENT SECTION (Fixing Nesting) --- */}
                <div className="bg-slate-900/40 rounded-[2.5rem] border border-white/5 overflow-hidden shadow-xl mt-8">
                    <div className="p-6 border-b border-white/5 bg-white/5 flex items-center gap-3">
                        <Clock size={14} className="text-neon" />
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-white/40">Installment Schedule</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-[10px]">
                            <thead className="bg-white/5 uppercase font-black text-white/30 border-b border-white/5">
                                <tr>
                                    <th className="p-4">Installment</th>
                                    <th className="p-4">Due Date</th>
                                    <th className="p-4">Amount</th>
                                    <th className="p-4 text-rose-400">Late Fee</th>
                                    <th className="p-4">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {summary.installmentList?.map((ins, i) => (
                                    <tr key={i} className="hover:bg-white/5 transition-all">
                                        <td className="p-4 font-black uppercase tracking-tighter">
                                            {ins.number ? `${ins.number}${ins.number === 1 ? 'st' : ins.number === 2 ? 'nd' : ins.number === 3 ? 'rd' : 'th'} Pay` : ins.type}
                                        </td>
                                        <td className={`p-4 font-bold ${ins.status === 'Overdue' ? 'text-rose-400' : 'opacity-60'}`}>
                                            {new Date(ins.dueDate).toLocaleDateString()}
                                        </td>
                                        <td className="p-4 font-black">₹{ins.amount.toLocaleString()}</td>
                                        <td className="p-4 font-black text-rose-500">
                                            {ins.penalty > 0 ? `+ ₹${ins.penalty.toLocaleString()}` : '--'}
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-3 py-1 rounded-full text-[7px] font-black uppercase tracking-widest ${
                                                ins.status === 'Paid' ? 'bg-emerald-500/10 text-emerald-500' :
                                                ins.status === 'Overdue' ? 'bg-rose-600 text-white animate-pulse shadow-[0_0_10px_rgba(225,29,72,0.5)]' :
                                                'bg-orange-500/10 text-orange-500'
                                            }`}>
                                                {ins.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

const Layers = ({ size, className }) => <div className={className}><CreditCard size={size} /></div>;

export default StudentFees;