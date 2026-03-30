import React, { useState, useEffect } from 'react';
import { CreditCard, Calendar, Clock, CheckCircle, AlertCircle, TrendingUp, ArrowLeft, Download, ChevronDown,X, Zap } from 'lucide-react';
import API from '../../api';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'; // Direct function import karein
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const StudentFees = () => {
    const [summary, setSummary] = useState(null);
    const [showPendingModal, setShowPendingModal] = useState(false); // Modal control ke liye
    const navigate = useNavigate();
    const [selectedYear, setSelectedYear] = useState('All');

    useEffect(() => {
        const fetchSummary = async () => {
            try {
                const { data } = await API.get('/fees/student-summary');
                setSummary(data);
            } catch (err) { console.error("Summary Load Error"); }
        };
        fetchSummary();
    }, []);
    const downloadReceipt = async (paymentId) => {
        try {
            const { data: p } = await API.get(`/fees/receipt/${paymentId}`);
            const doc = new jsPDF();

            // --- HEADER DESIGN ---
            doc.setFillColor(15, 23, 42); // Void Dark Theme Color
            doc.rect(0, 0, 210, 45, 'F');

            doc.setTextColor(34, 211, 238); // Neon Cyan
            doc.setFontSize(24);
            doc.setFont("helvetica", "bold");
            doc.text(p.schoolId?.schoolName?.toUpperCase() || "EDUFLOWAI INSTITUTION", 105, 20, { align: "center" });

            doc.setTextColor(255, 255, 255);
            doc.setFontSize(10);
            doc.setFont("helvetica", "normal");
            doc.text("OFFICIAL DIGITAL FEE RECEIPT", 105, 30, { align: "center" });
            doc.text(`${p.schoolId?.address || 'Digital Campus, Cloud Network'}`, 105, 36, { align: "center" });

            // --- RECEIPT METADATA ---
            doc.setTextColor(0, 0, 0);
            doc.setFontSize(10);
            doc.setFont("helvetica", "bold");
            doc.text(`Receipt ID: #REC-${p._id.slice(-6).toUpperCase()}`, 15, 60);
            doc.text(`Date: ${new Date(p.date).toLocaleDateString('en-GB')}`, 160, 60);

            // --- DATA TABLE ---
            autoTable(doc, {
                startY: 70,
                head: [['FIELD', 'STUDENT INFORMATION']],
                body: [
                    ['STUDENT NAME', p.student?.name || 'N/A'],
                    ['ENROLLMENT NO', p.student?.enrollmentNo || 'N/A'],
                    ['GRADE/CLASS', p.student?.grade || 'N/A'],
                    ['FEE COMPONENT', p.feeCategory || 'General Fees'], // Ye naya add kiya
                    ['FATHER NAME', p.student?.fatherName || 'N/A'],
                    ['PAYMENT MODE', p.paymentMode || 'N/A'],
                    ['BILLING MONTH', `${p.month} ${p.year}`]
                ],
                theme: 'grid',
                headStyles: { fillColor: [15, 23, 42], textColor: [34, 211, 238], fontStyle: 'bold' },
                styles: { fontSize: 10, cellPadding: 5 },
            });

            // --- FINAL TOTAL ---
            const finalY = doc.lastAutoTable.finalY + 15;
            doc.setDrawColor(34, 211, 238);
            doc.setLineWidth(1);
            doc.line(15, finalY, 195, finalY);

            doc.setFontSize(16);
            doc.text(`TOTAL PAID: INR ${p.amountPaid.toLocaleString()}/-`, 15, finalY + 15);

            // --- FOOTER ---
            doc.setFontSize(9);
            doc.setTextColor(150);
            doc.setFont("helvetica", "italic");
            doc.text("This is a system-generated secure document. No physical signature is required.", 105, 280, { align: "center" });
            doc.text("© EduFlowAI Finance Neural Network", 105, 285, { align: "center" });

            doc.save(`Receipt_${p._id.slice(-6)}.pdf`);
        } catch (err) {
            console.error("PDF Download Error:", err);
            alert("Bypass Error: System could not generate PDF. Please check network.");
        }
    };

    if (!summary) return <div className="p-20 text-center animate-pulse text-neon uppercase font-black italic tracking-widest">Loading Fees Status...</div>;

    // --- DAY 120: MASTER MATH LOGIC ---
    const currentMonthPaid = summary?.totalPaidThisMonth || 0;
    const finalBalance = summary?.remainingFees || 0;
    const advanceMoney = summary?.advanceBalance || 0;

    const totalExpectedAll = summary?.totalFeesStructure || 0;

    // Status Logic
    const isFeesDone = finalBalance <= 0;
    const statusText = isFeesDone ? "FEES COMPLETED" : "PAYMENT REQUIRED";

    // Activity & Dates
    const lastDate = summary?.lastActivity ? new Date(summary.lastActivity).toLocaleDateString('en-GB') : "NO ACTIVITY";
    const today = new Date();
    const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
    const deadlineStr = nextMonth.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });

    // Total Structure (Box ke liye)
    const structureTotal = summary?.totalFeesStructure || 0;
    return (
        <div className="min-h-screen bg-void text-white p-5 pb-32 italic font-sans">

            {/* --- DAY 132: MODAL FOR PENDING SCREENSHOT PREVIEW --- */}
            <AnimatePresence>
                {showPendingModal && summary.pendingSignal && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[1000] flex items-center justify-center p-6 backdrop-blur-xl bg-black/80">
                        <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="bg-slate-900 w-full max-w-md rounded-[3rem] border border-white/10 overflow-hidden shadow-2xl relative">
                            <button onClick={() => setShowPendingModal(false)} className="absolute top-6 right-6 z-10 p-2 bg-white/5 rounded-full hover:bg-red-500 transition-colors"><X size={18} /></button>
                            <div className="p-8 space-y-6">
                                <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                                    <div className="p-2 bg-amber-500/20 rounded-xl text-amber-500"><Clock size={20} /></div>
                                    <h3 className="text-sm font-black uppercase tracking-widest text-amber-500 italic">Pending</h3>
                                </div>
                                <div className="aspect-[3/4] w-full bg-black rounded-3xl overflow-hidden border border-white/5">
                                    <img src={`http://localhost:5000${summary.pendingSignal.screenshot}`} className="w-full h-full object-contain" alt="Evidence" />
                                </div>
                                <div className="bg-white/5 p-4 rounded-2xl space-y-2">
                                    <div className="flex justify-between text-[10px] uppercase font-black italic"><span className="opacity-40">Amount Sent:</span><span className="text-neon">₹{summary.pendingSignal.amount.toLocaleString()}</span></div>
                                    <div className="flex justify-between text-[10px] uppercase font-black italic"><span className="opacity-40">Status:</span><span className="text-amber-500">Pending</span></div>
                                </div>
                                <p className="text-[8px] text-white/20 text-center uppercase font-black tracking-widest">Payment Submitted • Waiting for Approval</p>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
            <div className="flex items-center gap-4 mb-10 border-l-4 border-neon pl-4">
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 bg-white/5 rounded-xl border border-white/10 active:scale-90 transition-all hover:bg-neon/20 hover:border-neon/40"
                >
                    <ArrowLeft size={20} className="text-neon" />
                </button>
                <h1 className="text-xl font-black uppercase tracking-tighter">My Fees</h1>
            </div>

            <div className="space-y-6">
                {/* --- MAIN BALANCE CARD (FINAL UPGRADE) --- */}
                <div className="bg-slate-900/60 p-10 rounded-[3rem] border border-white/5 relative overflow-hidden shadow-2xl">
                    <div className="absolute -top-6 -right-6 opacity-5 rotate-12"><CreditCard size={150} /></div>

                    <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] mb-2">
                        {!isFeesDone ? `${summary?.currentMonth} Outstanding` : 'Account Integrity'}
                    </p>

                    {/* --- StudentFees.jsx Update --- */}

                    {/* Surplus Adjusted Badge ke upar ya niche ye Penalty Alert daldo */}
                    {summary?.totalPenalty > 0 && (
                        <div className="flex items-center gap-2 mb-4 bg-rose-500/10 p-4 rounded-3xl border border-rose-500/20 shadow-lg shadow-rose-500/5">
                            <AlertCircle size={16} className="text-rose-500 animate-pulse" />
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black text-rose-500 uppercase tracking-[0.2em]">School Fine due to late fees</span>
                                <span className="text-[8px] font-bold text-white/30 uppercase italic">Late fee of ₹{summary.totalPenalty.toLocaleString()} added to dues</span>
                            </div>
                        </div>
                    )}

                    {/* Main Balance Heading badal do */}
                    <h2 className={`text-5xl font-black tracking-tighter mb-4 ${!isFeesDone ? 'text-rose-500' : 'text-emerald-400'}`}>
                        {/* backend se aane wala grandTotal use karo jo balance + penalty hai */}
                        ₹{(summary?.grandTotal || finalBalance).toLocaleString()}
                        {isFeesDone && <span className="text-xs ml-3 opacity-50 italic tracking-widest">ALL CLEAR</span>}
                    </h2>

                    {/* Surplus Adjusted Badge */}
                    {advanceMoney > 0 && (
                        <div className="flex items-center gap-2 mb-4 bg-emerald-500/10 p-3 rounded-2xl border border-emerald-500/20">
                            <CheckCircle size={14} className="text-emerald-400" />
                            <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">
                                Surplus Adjusted: ₹{advanceMoney.toLocaleString()} Secured
                            </span>
                        </div>
                    )}

                    <div className={`inline-flex items-center gap-2 px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-widest ${isFeesDone ? 'bg-emerald-500/20 text-emerald-500 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-500 animate-pulse border border-rose-500/30'}`}>
                        {isFeesDone ? <CheckCircle size={12} /> : <AlertCircle size={12} />}
                        {isFeesDone ? 'Fees Completed: Neural Synced' : 'Payment Required'}
                    </div>
                </div>

                {/* --- STATS GRID: MONTHLY FOCUS --- */}
                <div className="grid grid-cols-2 gap-5">
                    <div className="bg-slate-900/40 p-6 rounded-[2.5rem] border border-white/5 flex flex-col items-center text-center">
                        <TrendingUp size={20} className="text-emerald-400 mb-2 opacity-40" />
                        <p className="text-[7px] font-black text-white/20 uppercase tracking-widest mb-1">Paid For {summary?.currentMonth}</p>
                        <p className="text-xl font-black text-white italic">₹{currentMonthPaid.toLocaleString()}</p>
                    </div>
                    <div className="bg-slate-900/40 p-6 rounded-[2.5rem] border border-white/5 flex flex-col items-center text-center">
                        <Layers size={20} className="text-white/20 mb-2 opacity-40" />
                        <p className="text-[7px] font-black text-white/20 uppercase tracking-widest mb-1">Active Structure</p>
                        <p className="text-xl font-black text-white/40 italic">₹{structureTotal.toLocaleString()}</p>
                    </div>
                </div>

                {/* --- TIMELINE INFO: DYNAMIC DEADLINE --- */}
                <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/5 flex justify-between relative overflow-hidden">
                    <div className="absolute left-0 top-0 h-full w-1 bg-neon/30"></div>
                    <div>
                        <p className="text-[8px] font-black text-white/20 uppercase mb-1">Next Deadline</p>
                        <p className="text-xs font-black text-rose-400 uppercase">
                            {isFeesDone ? 'NEXT CYCLE: ' : 'DUE BY: '} {deadlineStr}
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-[8px] font-black text-white/20 uppercase mb-1">Last Activity</p>
                        <p className="text-xs font-black text-emerald-400 uppercase">{lastDate}</p>
                    </div>
                </div>
                {/* --- POINT 8: PENDING FEES ALERT SECTION --- */}
                {(summary.remainingFees > 0 || summary.totalPenalty > 0) && (
                    <div className="bg-rose-500/10 border border-rose-500/20 p-6 rounded-[2.5rem] mt-8 flex flex-col gap-4 relative overflow-hidden group">
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-rose-500/20 rounded-2xl relative z-10">
                                <AlertCircle size={24} className="text-rose-500" />
                            </div>
                            <div className="relative z-10 flex-1">
                                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-rose-500 mb-1">
                                    Balance Adjustment Required
                                </h4>
                                <p className="text-[11px] font-bold text-white/60 leading-relaxed italic">
                                    Current Monthly Fees: <span className="text-white font-black">₹{summary.remainingFees.toLocaleString()}</span>
                                    {summary.totalPenalty > 0 && <> <br /> Late Fee Penalty: <span className="text-rose-400 font-black">₹{summary.totalPenalty.toLocaleString()}</span></>}
                                </p>
                            </div>
                        </div>
                        {/* --- DAY 132: SMART BUTTON LOGIC --- */}
                        {summary.pendingSignal ? (
                            /* PENDING BUTTON */
                            <button 
                                onClick={() => setShowPendingModal(true)}
                                className="w-full py-4 bg-amber-500/20 border-2 border-amber-500/40 text-amber-500 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-amber-500/30 transition-all flex items-center justify-center gap-2"
                            >
                                <Zap size={14} className="animate-pulse" fill="currentColor"/> Pending Approval: ₹{summary.pendingSignal.amount.toLocaleString()} 📡
                            </button>
                        ) : (
                            /* NORMAL RESOLVE BUTTON */
                            <button
                                onClick={() => navigate('/student/checkout')}
                                className="w-full py-4 bg-rose-600 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-rose-500 transition-all active:scale-95"
                            >
                                Resolve Total: ₹{(summary.grandTotal || summary.remainingFees).toLocaleString()} ⚡
                            </button>
                        )}
                    </div>
                )}

                {/* --- POINT 2: FEES DETAILS SECTION --- */}
                <div className="p-6 space-y-4">
                    {summary.feeStructure && Object.entries(summary.feeStructure).map(([key, data], index) => (
                        <div key={index} className="flex justify-between items-center border-b border-white/5 pb-3">
                            <div className="flex flex-col">
                                <span className="text-[10px] font-bold text-white/40 uppercase tracking-tight">
                                    {key.replace(/([A-Z])/g, ' $1').trim()}
                                </span>
                                <span className={`text-[6px] font-black uppercase tracking-widest mt-0.5 ${data.billingCycle === 'one-time' ? 'text-amber-500/60' : 'text-cyan-500/60'}`}>
                                    • {data.billingCycle === 'one-time' ? 'One Time' : 'Per Month'}
                                </span>
                            </div>
                            <span className="text-sm font-black italic text-white">₹{(data.amount || 0).toLocaleString()}</span>
                        </div>
                    ))}

                    <div className="flex justify-between items-center pt-2">
                        <span className="text-[10px] font-black text-neon uppercase italic tracking-widest">Monthly Fees</span>
                        <span className="text-lg font-black text-neon">₹{totalExpectedAll.toLocaleString()}</span>
                    </div>
                </div>

                {/* --- UPGRADED MONTHLY GROUPED HISTORY --- */}
                <div className="bg-slate-900/60 rounded-[3rem] border border-white/5 overflow-hidden shadow-2xl mt-12 mb-10">
                    <div className="p-6 border-b border-white/5 bg-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <CheckCircle size={14} className="text-emerald-400" />
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-white/40">All Transactions</h3>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                            <span className="text-[8px] font-black text-white/40 uppercase tracking-widest">Monthly Ledger Sync</span>
                        </div>
                    </div>

                    <div className="p-6 space-y-10">
                        {summary.paymentHistory && Object.keys(summary.paymentHistory).length > 0 ? (
                            Object.entries(summary.paymentHistory).map(([monthYear, records]) => (
                                <div key={monthYear} className="space-y-4">
                                    {/* Month Divider Label */}
                                    <div className="flex items-center gap-3 ml-2">
                                        <span className="text-[10px] font-black text-cyan-400 uppercase tracking-[0.3em]">{monthYear}</span>
                                        <div className="h-[1px] flex-1 bg-white/5"></div>
                                    </div>

                                    {/* Inside each month box */}
                                    <div className="grid gap-3">
                                        {records.map((pay, idx) => (
                                            <div key={idx} className="flex items-center justify-between p-5 bg-[#0B0F14] rounded-[2rem] border border-white/5 hover:border-cyan-400/30 transition-all group">
                                                <div className="flex items-center gap-4">
                                                    <div className="p-3 bg-white/5 rounded-2xl group-hover:bg-cyan-400/10 group-hover:text-cyan-400 transition-colors">
                                                        <TrendingUp size={16} />
                                                    </div>
                                                    {/* StudentFees.jsx mein mapping ke andar */}
                                                    <div>
                                                        <p className="text-[11px] font-black uppercase text-white tracking-tight">
                                                            {pay.category || h.category} {/* Backend se aane wala Clean Name */}
                                                        </p>
                                                        <p className="text-[8px] font-bold text-white/20 uppercase">
                                                            {new Date(pay.date).toLocaleDateString('en-GB')} • {pay.mode}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="text-right flex flex-col items-end gap-2">
                                                    <p className="text-sm font-black text-white italic">₹{pay.amount.toLocaleString()}</p>
                                                    <button
                                                        onClick={() => downloadReceipt(pay.id)}
                                                        className="flex items-center gap-1 text-[7px] font-black uppercase text-cyan-400/40 hover:text-cyan-400 transition-colors"
                                                    >
                                                        <Download size={8} /> Download Slip
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="py-20 text-center flex flex-col items-center opacity-20">
                                <Clock size={40} className="mb-4" />
                                <p className="text-[10px] font-black uppercase tracking-widest">No payment records found in the neural link.</p>
                            </div>
                        )}
                    </div>
                    {/* --- POINT 9: QUICK PAY MODAL PLACEHOLDER --- */}
                    <div className="mt-12 p-8 bg-gradient-to-br from-slate-900 to-black rounded-[3rem] border border-neon/20 shadow-[0_0_50px_-12px_rgba(34,211,238,0.2)] relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:rotate-12 transition-transform duration-700">
                            <CreditCard size={120} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const Layers = ({ size, className }) => <div className={className}><CreditCard size={size} /></div>;

export default StudentFees;