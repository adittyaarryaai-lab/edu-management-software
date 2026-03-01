import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Printer, Download, ArrowLeft, Phone, MapPin } from 'lucide-react';
import API from '../../api';

const FeeReceipt = () => {
    const { id } = useParams();
    const [receipt, setReceipt] = useState(null);

    useEffect(() => {
        const fetchReceipt = async () => {
            const { data } = await API.get(`/users/finance/receipt/${id}`);
            setReceipt(data);
        };
        fetchReceipt();
    }, [id]);

    const handlePrint = () => { window.print(); };

    if (!receipt) return <div className="p-10 text-white italic">Loading Receipt...</div>;

    return (
        <div className="min-h-screen bg-void text-slate-900 font-sans p-5 pb-20 print:p-0 print:bg-white print:fixed print:inset-0 print:z-[9999] print:m-0 overflow-y-auto">
            {/* Header Actions - Hidden during Print */}
            <div className="flex justify-between items-center mb-8 print:hidden">
                <button onClick={() => window.history.back()} className="text-white/40"><ArrowLeft /></button>
                <button onClick={handlePrint} className="bg-cyan-400 text-black px-6 py-2 rounded-xl font-black text-xs uppercase flex items-center gap-2">
                    <Printer size={16} /> Print Receipt
                </button>
            </div>

            {/* Receipt Paper Design */}
            <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-2xl mx-auto border-t-[12px] border-cyan-400 print:shadow-none print:border-none">
                {/* School Header */}
                <div className="text-center border-b-2 border-slate-100 pb-6 mb-6">
                    <h1 className="text-2xl font-black uppercase text-slate-800">{receipt.schoolId.name}</h1>
                    <div className="flex flex-col items-center gap-1 mt-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        <span className="flex items-center gap-1"><MapPin size={10}/> {receipt.schoolId.address}</span>
                        <span className="flex items-center gap-1"><Phone size={10}/> Contact: {receipt.schoolId.phone}</span>
                    </div>
                </div>

                <div className="flex justify-between mb-8">
                    <div>
                        <p className="text-[9px] font-black text-slate-300 uppercase">Receipt Number</p>
                        <p className="text-xs font-bold font-mono">#{receipt._id.slice(-8).toUpperCase()}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-[9px] font-black text-slate-300 uppercase">Date Issued</p>
                        <p className="text-xs font-bold">{new Date(receipt.date).toLocaleDateString()}</p>
                    </div>
                </div>

                {/* Student Details Section */}
                <div className="bg-slate-50 p-6 rounded-2xl mb-8">
                    <h3 className="text-[10px] font-black text-cyan-600 uppercase mb-4 tracking-widest">Student Information</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-[8px] font-black text-slate-400 uppercase">Student Name</p>
                            <p className="text-sm font-bold uppercase">{receipt.student.name}</p>
                        </div>
                        <div>
                            <p className="text-[8px] font-black text-slate-400 uppercase">Class / Section</p>
                            <p className="text-sm font-bold uppercase">{receipt.student.grade}</p>
                        </div>
                    </div>
                </div>

                {/* Fee Table */}
                <table className="w-full mb-8">
                    <thead>
                        <tr className="border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase">
                            <th className="text-left py-4">Description</th>
                            <th className="text-right py-4">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="border-b border-slate-50">
                            <td className="py-4 text-xs font-bold uppercase">Monthly Fees ({receipt.month} {receipt.year})</td>
                            <td className="py-4 text-right font-black text-slate-800">₹{receipt.amountPaid.toLocaleString()}</td>
                        </tr>
                    </tbody>
                </table>

                {/* Total */}
                <div className="flex justify-between items-center border-t-2 border-slate-100 pt-6">
                    <div className="bg-cyan-100 text-cyan-700 px-4 py-1 rounded-lg text-[9px] font-black uppercase">
                        Paid via {receipt.paymentMode}
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] font-black text-slate-400 uppercase">Total Amount Paid</p>
                        <p className="text-2xl font-black text-slate-800 tracking-tighter">₹{receipt.amountPaid.toLocaleString()}</p>
                    </div>
                </div>

                {/* Footer Note */}
                <div className="mt-12 text-center text-[8px] font-bold text-slate-300 uppercase italic tracking-widest border-t border-slate-50 pt-6">
                    This is a computer-generated receipt. No signature required.
                </div>
            </div>
        </div>
    );
};

export default FeeReceipt;