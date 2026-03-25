import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Printer, Download, ArrowLeft, Phone, MapPin } from 'lucide-react';
import API from '../../api';

const FeeReceipt = () => {
    const { id } = useParams();
    const [receipt, setReceipt] = useState(null);

    useEffect(() => {
        const fetchReceipt = async () => {
            try {
                // Humne userRoutes.js mein ye route update kiya hai
                const { data } = await API.get(`/users/finance/receipt/${id}`);
                setReceipt(data);
            } catch (err) {
                console.error("Receipt Load Error");
            }
        };
        fetchReceipt();
    }, [id]);

    const handlePrint = () => { window.print(); };

    if (!receipt) return <div className="p-10 text-white italic animate-pulse">Neural Link Establishing: Loading Receipt...</div>;

    return (
        <div className="min-h-screen bg-void text-slate-900 font-sans p-5 pb-20 print:p-0 print:bg-white print:fixed print:inset-0 print:z-[9999] print:m-0 overflow-y-auto">
            {/* Header Actions - Hidden during Print */}
            <div className="flex justify-between items-center mb-8 print:hidden max-w-2xl mx-auto">
                <button onClick={() => window.history.back()} className="text-white/40 hover:text-cyan-400 transition-colors">
                    <ArrowLeft size={24} />
                </button>
                <button onClick={handlePrint} className="bg-cyan-400 text-black px-6 py-2 rounded-xl font-black text-xs uppercase flex items-center gap-2 hover:bg-cyan-300 transition-all active:scale-95 shadow-[0_0_20px_rgba(34,211,238,0.3)]">
                    <Printer size={16} /> Print Official Receipt
                </button>
            </div>

            {/* Receipt Paper Design */}
            <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl max-w-2xl mx-auto border-t-[15px] border-cyan-400 print:shadow-none print:border-none print:p-4">

                {/* --- 1. SCHOOL HEADER (IDENTITY SYNC) --- */}
                <div className="text-center border-b-2 border-slate-100 pb-8 mb-8">
                    {/* Backend field: displaySchoolName */}
                    <h1 className="text-3xl font-black uppercase text-slate-800 tracking-tighter leading-tight">
                        {receipt.displaySchoolName}
                    </h1>
                    <div className="flex flex-col items-center gap-2 mt-3 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                        <span className="flex items-center gap-1.5">
                            <MapPin size={12} className="text-cyan-500" /> {receipt.schoolId?.address}
                        </span>
                        {/* Backend field: displayContact */}
                        <span className="flex items-center gap-1.5">
                            <Phone size={12} className="text-cyan-500" /> CONTACT: {receipt.displayContact || "N/A"}
                        </span>
                    </div>
                </div>

                <div className="flex justify-between mb-10 px-2">
                    <div>
                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Receipt Number</p>
                        <p className="text-sm font-bold font-mono text-slate-700 mt-1">#REC-{receipt._id.slice(-8).toUpperCase()}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Date Issued</p>
                        {/* Backend field: formattedIssuedDate (DD/MM/YYYY) */}
                        <p className="text-sm font-bold text-slate-700 mt-1">{receipt.formattedIssuedDate}</p>
                    </div>
                </div>

                {/* Student Details Section */}
                <div className="bg-slate-50 p-7 rounded-[2rem] mb-10 border border-slate-100">
                    <h3 className="text-[10px] font-black text-cyan-600 uppercase mb-5 tracking-[0.3em]">Neural Identity: Student Info</h3>
                    <div className="grid grid-cols-2 gap-8">
                        <div>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Student Name</p>
                            <p className="text-md font-black uppercase text-slate-800 mt-1">{receipt.student?.name}</p>
                        </div>
                        <div>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Grade / Sector</p>
                            <p className="text-md font-black uppercase text-slate-800 mt-1">{receipt.student?.grade}</p>
                        </div>
                        {receipt.student?.enrollmentNo && (
                            <div className="col-span-2 border-t border-slate-200/50 pt-4">
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Enrollment No.</p>
                                <p className="text-sm font-bold uppercase text-slate-600 mt-1">{receipt.student?.enrollmentNo}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Fee Table */}
                <div className="px-2">
                    <table className="w-full mb-10">
                        <thead>
                            <tr className="border-b-2 border-slate-100 text-[11px] font-black text-slate-400 uppercase tracking-widest">
                                <th className="text-left py-5">Description of Component</th>
                                <th className="text-right py-5">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-b border-slate-50">
                                <td className="py-6">
                                    {/* Backend field: displayPurpose (e.g. UNIFORM FEES) */}
                                    <p className="text-sm font-black text-slate-800 uppercase italic">
                                        {receipt.displayPurpose}
                                    </p>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">
                                        Billing Cycle: {receipt.month} {receipt.year}
                                    </p>
                                </td>
                                <td className="py-6 text-right font-black text-xl text-slate-800 tracking-tighter">
                                    ₹{receipt.amountPaid.toLocaleString()}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Total Section */}
                <div className="flex justify-between items-center bg-slate-900 p-8 rounded-[2rem] text-white">
                    <div className="space-y-1">
                        <div className="bg-cyan-400 text-black px-3 py-1 rounded-md text-[8px] font-black uppercase tracking-tighter inline-block">
                            Verified Transaction
                        </div>
                        <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest block pt-2">
                            Mode: {receipt.paymentMode}
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] font-black text-cyan-400 uppercase tracking-widest mb-1">Total Amount Paid</p>
                        <p className="text-4xl font-black tracking-tighter italic">₹{receipt.amountPaid.toLocaleString()}</p>
                    </div>
                </div>

                {/* Footer Note */}
                <div className="mt-12 text-center">
                    <div className="h-[1px] w-20 bg-slate-100 mx-auto mb-6"></div>
                    <p className="text-[9px] font-bold text-slate-300 uppercase italic tracking-[0.2em] leading-relaxed">
                        This is a system-generated secure digital receipt.<br />
                        © EduFlowAI Finance Neural Network • No physical signature required.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default FeeReceipt;