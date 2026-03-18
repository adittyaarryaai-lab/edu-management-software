import React, { useState, useEffect } from 'react';
import { CreditCard, Calendar, Clock, CheckCircle, AlertCircle, TrendingUp, ArrowLeft, Download, ChevronDown } from 'lucide-react';
import API from '../../api';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'; // Direct function import karein
import { useNavigate } from 'react-router-dom';

const StudentFees = () => {
    const [summary, setSummary] = useState(null);
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
                    {/* Main Card ke andar status badge ke niche ye chhota sa note add karo */}
                    {summary.totalPenalty > 0 && (
                        <p className="text-[8px] font-bold text-rose-400/60 mt-3 uppercase tracking-widest">
                            * Includes ₹{summary.totalPenalty.toLocaleString()} in accumulated late fees
                        </p>
                    )}
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
                {/* --- POINT 8: PENDING FEES ALERT SECTION --- */}
                {summary.remainingFees > 0 && (
                    <div className="bg-rose-500/10 border border-rose-500/20 p-6 rounded-[2.5rem] mt-8 flex items-start gap-4 relative overflow-hidden group">
                        {/* Animated Background Pulse */}
                        <div className="absolute inset-0 bg-rose-500/5 animate-pulse"></div>

                        <div className="p-3 bg-rose-500/20 rounded-2xl relative z-10">
                            <AlertCircle size={24} className="text-rose-500" />
                        </div>

                        <div className="relative z-10 flex-1">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-rose-500 mb-1">
                                Outstanding Dues Detected
                            </h4>
                            <p className="text-[11px] font-bold text-white/60 leading-relaxed italic">
                                Your account shows a pending balance of <span className="text-white">₹{summary.remainingFees.toLocaleString()}</span>.
                                Please settle the dues before <span className="text-rose-400">{summary.nextDueDate !== 'No Pending' ? new Date(summary.nextDueDate).toLocaleDateString() : 'the next deadline'}</span> to avoid additional late fees.
                            </p>
                        </div>

                        <button
                            onClick={() => alert("Payment Gateway Integration Coming Soon! (Day 107)")}
                            className="relative z-10 self-center px-6 py-3 bg-rose-600 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-rose-500 transition-all active:scale-95 shadow-lg shadow-rose-900/20"
                        >
                            Resolve Now
                        </button>
                    </div>
                )}

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
                                            <span className={`px-3 py-1 rounded-full text-[7px] font-black uppercase tracking-widest ${ins.status === 'Paid' ? 'bg-emerald-500/10 text-emerald-500' :
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
                {/* --- POINT 5: PAYMENT HISTORY SECTION --- */}
                <div className="bg-slate-900/60 rounded-[3rem] border border-white/5 overflow-hidden shadow-2xl mt-12 mb-10">
                    <div className="p-6 border-b border-white/5 bg-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <CheckCircle size={14} className="text-emerald-400" />
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-white/40">Payment History</h3>
                        </div>
                        <span className="text-[8px] font-black bg-emerald-500/10 text-emerald-500 px-3 py-1 rounded-full uppercase">
                            Verified Transactions
                        </span>
                    </div>
                    {/* --- DAY 108: DYNAMIC YEAR DROPDOWN FILTER --- */}
                    <div className="flex items-center gap-4 mb-8 px-2">
                        <div className="relative group">
                            <select
                                value={selectedYear}
                                onChange={(e) => setSelectedYear(e.target.value)}
                                className="appearance-none bg-slate-900 border border-white/10 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-neon focus:outline-none focus:border-neon/50 cursor-pointer transition-all hover:bg-white/5"
                            >
                                <option value="All">All Years</option>
                                {/* Unique years nikalne ka logic niche filter mein hai */}
                                {[...new Set(summary.paymentHistory?.map(p => p.year))].map(yr => (
                                    <option key={yr} value={yr}>{yr}</option>
                                ))}
                            </select>
                            {/* Chhota down arrow icon (optional) */}
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-30">
                                <ChevronDown size={12} />
                            </div>
                        </div>

                        <div className="ml-auto flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                            <span className="text-[8px] font-black text-white/40 uppercase tracking-widest">Live Ledger</span>
                        </div>
                    </div>

                    {/* --- DAY 108: FILTERED PAYMENT LIST (Step 3) --- */}
                    <div className="p-6 space-y-4">
                        {summary.paymentHistory
                            ?.filter(pay => selectedYear === 'All' ? true : pay.year.toString() === selectedYear)
                            .length > 0 ? (
                            summary.paymentHistory
                                ?.filter(pay => selectedYear === 'All' ? true : pay.year.toString() === selectedYear)
                                .map((pay, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-emerald-500/20 transition-all">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-emerald-500/10 rounded-xl">
                                                <TrendingUp size={16} className="text-emerald-500" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-black text-white italic">₹{pay.amount.toLocaleString()}</p>
                                                <p className="text-[8px] font-bold text-white/30 uppercase tracking-tighter">
                                                    {new Date(pay.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })} • {pay.mode}
                                                </p>
                                            </div>
                                        </div>
                                        {/* Receipt Download Action */}
                                        <div className="flex flex-col items-end gap-2 group">
                                            <button
                                                onClick={() => downloadReceipt(pay.id)}
                                                className="flex items-center gap-1.5 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl hover:bg-emerald-500 hover:text-black transition-all active:scale-90"
                                            >
                                                <Download size={10} />
                                                <span className="text-[8px] font-black uppercase tracking-widest">Receipt</span>
                                            </button>
                                            <div className="text-right">
                                                <p className="text-[7px] font-black text-emerald-400 uppercase tracking-widest">SUCCESS</p>
                                                <p className="text-[9px] font-bold text-white/20 italic">{pay.month} {pay.year}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                        ) : (
                            <div className="py-10 text-center opacity-20 text-[10px] font-black uppercase italic tracking-widest">
                                No Transactions Found for {selectedYear === 'All' ? 'Archive' : selectedYear}
                            </div>
                        )}
                    </div>
                    {/* --- POINT 9: QUICK PAY MODAL PLACEHOLDER --- */}
                    <div className="mt-12 p-8 bg-gradient-to-br from-slate-900 to-black rounded-[3rem] border border-neon/20 shadow-[0_0_50px_-12px_rgba(34,211,238,0.2)] relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:rotate-12 transition-transform duration-700">
                            <CreditCard size={120} />
                        </div>

                        <div className="relative z-10 flex items-center justify-between mb-8">
                            <div>
                                <h3 className="text-xl font-black italic uppercase tracking-tighter">Digital Checkout</h3>
                                <p className="text-[8px] font-bold text-white/30 uppercase tracking-[0.3em]">Neural Payment Gateway v1.0</p>
                            </div>
                            <div className="p-3 bg-neon/10 rounded-2xl border border-neon/20 animate-pulse">
                                <CreditCard size={24} className="text-neon" />
                            </div>
                        </div>

                        <div className="relative z-10 grid grid-cols-3 gap-4 mb-8">
                            {['UPI', 'CARD', 'BANK'].map(method => (
                                <div key={method} className="p-6 bg-white/5 border border-white/5 rounded-[2.5rem] flex flex-col items-center gap-3 hover:bg-neon/5 hover:border-neon/20 transition-all cursor-not-allowed group/item">
                                    <div className="w-2 h-2 rounded-full bg-white/10 group-hover/item:bg-neon transition-colors shadow-[0_0_10px_rgba(34,211,238,0)] group-hover/item:shadow-[0_0_10px_rgba(34,211,238,1)]"></div>
                                    <p className="text-[10px] font-black tracking-widest text-white/40">{method}</p>
                                </div>
                            ))}
                        </div>

                        <div className="relative z-10 flex flex-col items-center gap-2">
                            <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-white/10 to-transparent mb-4"></div>
                            <p className="text-[7px] font-black text-neon uppercase tracking-[0.5em] animate-pulse">
                                Secure 256-bit Encryption Active • Gateways Integration Coming Soon
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const Layers = ({ size, className }) => <div className={className}><CreditCard size={size} /></div>;

export default StudentFees;