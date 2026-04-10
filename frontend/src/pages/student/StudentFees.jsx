import React, { useState, useEffect } from 'react';
import { CreditCard, Calendar, Clock, CheckCircle, AlertCircle, TrendingUp, ArrowLeft, Download, ChevronDown, X, Zap } from 'lucide-react';
import API from '../../api';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'; // Direct function import karein
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Loader from '../../components/Loader';

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

    if (!summary) return <Loader />;
    // --- DAY 142: MASTER MATH LOGIC (SYNCED WITH BACKEND SNAPSHOT) ---
    const currentMonthPaid = summary?.totalPaidThisMonth || 0;

    // Backend ab grandTotal mein (Live Penalty + Frozen Penalty + Fees) jod kar bhej raha hai
    const finalOutstanding = summary?.grandTotal || 0;
    const advanceMoney = summary?.advanceBalance || 0;
    const totalPenalty = summary?.totalPenalty || 0;

    const totalExpectedAll = summary?.totalFeesStructure || 0;

    // Status Logic
    const isFeesDone = finalOutstanding <= 0;
    const statusText = isFeesDone ? "FEES COMPLETED" : "PAYMENT REQUIRED";

    // Activity & Dates
    const lastDate = summary?.lastActivity ? new Date(summary.lastActivity).toLocaleDateString('en-GB') : "NO ACTIVITY";
    const today = new Date();
    const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
    const deadlineStr = nextMonth.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });

    const structureTotal = summary?.totalFeesStructure || 0;
    return (
        <div className="min-h-screen bg-[#F8FAFC] pb-24 font-sans italic text-slate-800 text-[15px] overflow-x-hidden overscroll-none fixed inset-0 overflow-y-auto">

            {/* --- DAY 132: MODAL FOR PENDING SCREENSHOT PREVIEW --- */}
            <AnimatePresence>
                {showPendingModal && summary.pendingSignal && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[1000] flex items-center justify-center p-6 backdrop-blur-xl bg-black/60">
                        <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="bg-white w-full max-w-md rounded-[3rem] border border-[#DDE3EA] overflow-hidden shadow-2xl relative">
                            <button onClick={() => setShowPendingModal(false)} className="absolute top-6 right-6 z-10 p-2 bg-slate-100 rounded-full hover:bg-rose-500 hover:text-white transition-all"><X size={18} /></button>
                            <div className="p-8 space-y-6">
                                <h3 className="text-[18px] font-black text-amber-600 flex items-center gap-2 capitalize"><Clock size={20} /> Verification pending</h3>
                                <div className="aspect-[3/4] w-full bg-slate-100 rounded-3xl overflow-hidden border border-[#DDE3EA]">
                                    <img src={`http://localhost:5000${summary.pendingSignal.screenshot}`} className="w-full h-full object-contain" alt="Evidence" />
                                </div>
                                <div className="bg-slate-50 p-5 rounded-2xl space-y-2 border border-[#DDE3EA]">
                                    <div className="flex justify-between text-[13px] font-bold capitalize"><span className="opacity-50">Amount sent:</span><span className="text-[#42A5F5]">₹{summary.pendingSignal.amount.toLocaleString()}</span></div>
                                    <div className="flex justify-between text-[13px] font-bold capitalize"><span className="opacity-50">Status:</span><span className="text-amber-600">Awaiting approval</span></div>
                                </div>
                                {/* <p className="text-[8px] text-white/20 text-center uppercase font-black tracking-widest">Payment Submitted • Waiting for Approval</p> */}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
            {/* Header: Blue Theme */}
            <div className="bg-[#42A5F5] text-white px-6 pt-12 pb-32 rounded-b-[4rem] shadow-lg relative overflow-hidden">

                <div className="flex items-center justify-between relative z-10">

                    {/* Left side (Back + Title) */}
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate(-1)}
                            className="p-2 bg-white/20 rounded-xl active:scale-90 transition-all border border-white/30"
                        >
                            <ArrowLeft size={24} />
                        </button>

                        <h1 className="text-4xl font-black italic tracking-tighter capitalize">
                            My fees
                        </h1>
                    </div>

                    {/* Right Icon */}
                    <div className="bg-white/10 p-4 rounded-3xl backdrop-blur-md border border-white/20">
                        <CreditCard size={32} />
                    </div>
                </div>
            </div>

            <div className="px-5 -mt-16 relative z-20 space-y-6">
                {/* Main Balance Card */}
                <div className="bg-white p-10 rounded-[3rem] border border-[#DDE3EA] shadow-xl text-center relative overflow-hidden">
                    <p className="text-[20px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                        {!isFeesDone ? `${summary?.currentMonth} Outstanding` : 'Account Integrity'}
                    </p>

                    {/* --- StudentFees.jsx Update --- */}

                    {/* Surplus Adjusted Badge ke upar ya niche ye Penalty Alert daldo */}
                    {summary?.totalPenalty > 0 && (
                        <div className="flex items-center justify-center gap-2 mb-4 bg-rose-50 p-4 rounded-3xl border border-rose-100 text-left">
                            <AlertCircle size={20} className="text-rose-500" />
                            <div>
                                <span className="text-[15px] font-black text-rose-600 block capitalize">School Fine Due To Late Fees</span>
                                <span className="text-[15px] font-bold text-slate-400 italic">₹{summary?.totalPenalty.toLocaleString()} added to your dues</span>
                            </div>
                        </div>
                    )}

                    {/* Main Balance Heading badal do */}
                    <h2 className={`text-5xl font-black tracking-tighter mb-4 ${!isFeesDone ? 'text-rose-500' : 'text-emerald-500'}`}>
                        {/* backend se aane wala grandTotal use karo jo balance + penalty hai */}
                        {/* // 'finalOutstanding' use karo jo tune upar define kiya hai */}
                        ₹{(summary?.grandTotal || finalOutstanding).toLocaleString()}
                        {isFeesDone && <span className="text-xs ml-3 opacity-50 italic tracking-widest">ALL CLEAR</span>}
                    </h2>

                    {/* Surplus Adjusted Badge */}
                    {advanceMoney > 0 && (
                        <div className="inline-flex items-center gap-2 mb-4 bg-emerald-50 px-5 py-2 rounded-full border border-emerald-100">
                            <CheckCircle size={14} className="text-emerald-500" />
                            <span className="text-[15px] font-bold text-emerald-600 capitalize">Surplus adjusted: ₹{advanceMoney.toLocaleString()} Secured</span>
                        </div>
                    )}

                    <div className={`mt-4 py-2 px-6 rounded-full text-[15px] font-black inline-flex items-center gap-2 capitalize ${isFeesDone ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600 animate-pulse'}`}>
                        {isFeesDone ? <CheckCircle size={15} /> : <AlertCircle size={15} />}
                        {isFeesDone ? 'Fees completed' : 'Payment required'}
                    </div>
                </div>
                {/* --- STATS GRID: MONTHLY FOCUS --- */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white p-6 rounded-[2.5rem] border border-[#DDE3EA] text-center shadow-sm">
                        <TrendingUp size={24} className="text-[#42A5F5] mx-auto mb-2 opacity-50" />
                        <p className="text-[15px] font-bold text-slate-400 capitalize">Paid for {summary?.currentMonth}</p>
                        <p className="text-[15px] font-black text-slate-700">₹{currentMonthPaid.toLocaleString()}</p>
                    </div>
                    <div className="bg-white p-6 rounded-[2.5rem] border border-[#DDE3EA] text-center shadow-sm">
                        <Calendar size={24} className="text-slate-400 mx-auto mb-2 opacity-50" />
                        <p className="text-[15px] font-bold text-slate-400 capitalize">Fee Structure</p>
                        <p className="text-[15px] font-black text-slate-700">₹{structureTotal.toLocaleString()}</p>
                    </div>
                </div>

                {/* --- TIMELINE INFO: DYNAMIC DEADLINE --- */}
                <div className="bg-[#42A5F5] p-6 rounded-[2.5rem] text-white flex justify-between shadow-lg">
                    <div>
                        <p className="text-[15px] font-bold opacity-60 uppercase tracking-widest mb-1">Next Deadline</p>
                        <p className="text-[14px] font-black capitalize">
                            {isFeesDone ? 'NEXT CYCLE: ' : ''} {deadlineStr}
                        </p>
                    </div>
                    <div className="text-right border-l border-white/20 pl-6">
                        <p className="text-[15px] font-bold opacity-60 uppercase tracking-widest mb-1">Last activity</p>
                        <p className="text-[14px] font-black">{lastDate}</p>
                    </div>
                </div>
                {/* --- POINT 8: PENDING FEES ALERT SECTION --- */}
                {(summary.remainingFees > 0 || summary.totalPenalty > 0) && (
                    <div className="bg-white border-2 border-rose-100 p-8 rounded-[3rem] shadow-lg space-y-6 relative overflow-hidden group">
                        <div className="flex items-start gap-4">
                            <div className="absolute -right-4 -bottom-4 opacity-[0.03] rotate-12 group-hover:rotate-0 transition-transform duration-700">
                                <CreditCard size={120} />
                            </div>
                            <div className="flex-1">
                                <h4 className="text-[17px] font-black text-slate-800 capitalize italic mb-1">
                                    Balance adjustment required
                                </h4>
                                <div className="space-y-1">
                                    <p className="text-[15px] font-bold text-slate-500 leading-relaxed italic">
                                        Current monthly fees: <span className="text-slate-800 font-black">₹{summary.remainingFees.toLocaleString()}</span>
                                    </p>
                                    {summary.totalPenalty > 0 && (
                                        <p className="text-[15px] font-bold text-rose-400 italic">
                                            Late fee penalty: <span className="font-black">₹{summary.totalPenalty.toLocaleString()}</span>
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                        {/* --- DAY 132: SMART BUTTON LOGIC --- */}
                        <div className="relative z-10 pt-2">
                            {summary.pendingSignal ? (
                                /* PENDING BUTTON */
                                <button
                                    onClick={() => setShowPendingModal(true)}
                                    className="w-full py-5 bg-amber-500 text-white rounded-[2rem] text-[15px] font-black flex items-center justify-center gap-3 shadow-lg active:scale-95 transition-all"
                                >
                                    <Zap size={18} fill="white" className="animate-pulse" />
                                    Verification pending: ₹{summary.pendingSignal.amount.toLocaleString()} 📡
                                </button>
                            ) : (
                                /* RESOLVE BUTTON */
                                <button
                                    onClick={() => navigate('/student/checkout')}
                                    className="w-full py-5 bg-rose-600 text-white rounded-[2rem] text-[15px] font-black shadow-xl hover:bg-rose-700 active:scale-95 transition-all capitalize"
                                >
                                    Resolve Total Balance Now⚡: ₹{(summary.grandTotal || summary.remainingFees).toLocaleString()} ⚡
                                </button>
                            )}
                        </div>
                        <p className="text-center text-[12px] font-bold text-black uppercase tracking-[0.2em] relative z-10">
                            Secure Connection⚡
                        </p>
                    </div>
                )}

                {/* --- POINT 2: FEES DETAILS SECTION --- */}
                <div className="pb-6 space-y-5 bg-white rounded-[2.5rem] border border-[#DDE3EA] shadow-sm">
                    <div className="flex justify-center mb-4">
                        <div className="px-6 py-3 bg-white shadow-md rounded-2xl border border-slate-200">
                            <p className="text-[20px] font-bold text-slate-400 uppercase tracking-widest text-center">
                                Fee Details
                            </p>
                        </div>
                    </div>

                    {summary.feeStructure && Object.entries(summary.feeStructure).map(([key, data], index) => (
                        <div
                            key={index}
                            className="flex justify-between items-center bg-white rounded-2xl px-5 py-5 shadow-sm border border-slate-200"
                        >

                            {/* Left Side */}
                            <div className="flex flex-col">
                                <span className="text-[18px] font-black text-slate-700 capitalize italic tracking-tight">
                                    {key.replace(/([A-Z])/g, ' $1').trim().toLowerCase()}
                                </span>

                                <div className="flex items-center gap-2 mt-2">
                                    <div className={`w-2 h-2 rounded-full ${data.billingCycle === 'one-time' ? 'bg-amber-400' : 'bg-[#42A5F5]'}`}></div>

                                    <span className="text-[14px] font-bold text-slate-400 capitalize">
                                        {data.billingCycle === 'one-time' ? 'One time payment' : 'Monthly billing'}
                                    </span>
                                </div>
                            </div>

                            {/* Right Side Amount */}
                            <span className="text-[18px] font-black text-slate-800 italic">
                                ₹{(data.amount || 0).toLocaleString()}
                            </span>

                        </div>
                    ))}

                    <div className="flex justify-between items-center pt-4 px-2 border-t border-slate-100">
                        <div className="flex flex-col">
                            <span className="text-[19px] font-black text-[#42A5F5] capitalize italic tracking-tight">
                                Net monthly fees
                            </span>
                            {/* <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                Standard structure total
                            </span> */}
                        </div>
                        <span className="text-2xl font-black text-[#42A5F5] tracking-tighter">
                            ₹{totalExpectedAll.toLocaleString()}
                        </span>
                    </div>
                </div>

                {/* Spacer for better layout */}
                {/* <div className="h-10"></div> */}

                {/* --- UPGRADED MONTHLY GROUPED HISTORY --- */}
                <div className="bg-white rounded-[3rem] border border-[#DDE3EA] overflow-hidden shadow-lg mt-8 mb-10">
                    <div className="flex justify-center mb-4">
                        <div className="flex items-center gap-3 px-6 py-3 bg-white shadow-md rounded-2xl border border-slate-200">

                            {/* <div className="p-2 bg-emerald-100 rounded-xl text-emerald-600">
                                <CheckCircle size={18} />
                            </div> */}

                            <h3 className="text-[20px] font-bold text-slate-400 uppercase tracking-widest text-center">
                                All transactions
                            </h3>
                        </div>
                    </div>

                    <div className="p-6 space-y-12">
                        {summary.paymentHistory && Object.keys(summary.paymentHistory).length > 0 ? (
                            Object.entries(summary.paymentHistory).map(([monthYear, records]) => (
                                <div key={monthYear} className="space-y-5">
                                    {/* Month Divider Label */}
                                    <div className="flex items-center gap-4 px-2">
                                        <span className="text-[15px] font-black text-[#42A5F5] uppercase tracking-widest whitespace-nowrap">
                                            {monthYear}
                                        </span>
                                        <div className="h-[1px] flex-1 bg-slate-100"></div>
                                    </div>

                                    {/* Inside each month box */}
                                    <div className="grid gap-4">
                                        {records.map((pay, idx) => (
                                            <div key={idx} className="bg-white p-5 rounded-[2.5rem] border border-[#DDE3EA] flex justify-between items-center group active:scale-[0.98] transition-all shadow-sm">
                                                <div className="flex items-center gap-4">
                                                    {/* Icon Sync with blue theme */}
                                                    <div className="p-3 bg-blue-50 text-[#42A5F5] rounded-2xl group-hover:bg-[#42A5F5] group-hover:text-white transition-colors">
                                                        <TrendingUp size={20} />
                                                    </div>
                                                    {/* StudentFees.jsx mein mapping ke andar */}
                                                    <div>
                                                        {/* Category: Sentence Case & 15px */}
                                                        <p className="text-[16px] font-black text-slate-800 capitalize leading-tight mb-0.5">
                                                            {pay.category?.toLowerCase() || "General fee payment"}
                                                        </p>
                                                        {/* Date & Mode: 12px light */}
                                                        <p className="text-[14px] font-medium text-slate-400 capitalize">
                                                            {new Date(pay.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })} • {pay.mode?.toLowerCase()} mode
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="text-right flex flex-col items-end gap-2">
                                                    <p className="text-[16px] font-black text-emerald-600 italic">
                                                        ₹{pay.amount.toLocaleString()}
                                                    </p>
                                                    <button
                                                        onClick={() => downloadReceipt(pay.id)}
                                                        className="flex items-center gap-1.5 text-[15px] font-black text-[#42A5F5] uppercase tracking-tighter opacity-60 hover:opacity-100 transition-opacity"
                                                    >
                                                        <Download size={15} /> Get slip
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="py-24 text-center flex flex-col items-center opacity-40">
                                <Clock size={48} className="text-slate-200 mb-4" />
                                <p className="text-[15px] font-bold text-slate-400 italic capitalize">
                                    No payment records found in ledger
                                </p>
                            </div>
                        )}
                        <div className="mt-12 p-10 bg-gradient-to-br from-[#42A5F5] to-blue-600 rounded-[3rem] shadow-xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:rotate-12 transition-transform duration-700">
                                <CreditCard size={120} color="white" />
                            </div>
                            <div className="relative z-10 text-white">
                                <p className="text-[10px] font-black uppercase tracking-[0.4em] mb-1">Security assured</p>
                                <h4 className="text-[18px] font-black italic capitalize">End-to-end encrypted billing</h4>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
};

const Layers = ({ size, className }) => <div className={className}><CreditCard size={size} /></div>;

export default StudentFees;