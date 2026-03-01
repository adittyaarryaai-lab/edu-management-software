import React, { useState, useEffect } from 'react';
import { IndianRupee, User, Calendar, CreditCard, FileText, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import API from '../../api';
import Toast from '../../components/Toast';

const AddPayment = () => {
    const navigate = useNavigate();
    const [msg, setMsg] = useState('');
    const [students, setStudents] = useState([]);
    const [formData, setFormData] = useState({
        studentId: '',
        amountPaid: '',
        month: 'February',
        year: '2026',
        paymentMode: 'Cash',
        remarks: ''
    });

    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    const handlePayment = async (e) => {
        e.preventDefault();
        try {
            // Hum response se data nikalenge taaki receipt ID mil sake
            const { data } = await API.post('/users/finance/add-payment', formData);
            
            setMsg("Fee Payment Recorded! ✅");

            // --- DAY 92: REDIRECT TO RECEIPT PAGE ---
            // Dashboard ki jagah ab seedha receipt page khulega
            setTimeout(() => {
                navigate(`/finance/receipt/${data.feeRecord._id}`);
            }, 2000);

        } catch (err) { 
            console.error(err);
            alert(err.response?.data?.message || "Payment Failed"); 
        }
    };

    return (
        <div className="min-h-screen bg-[#0B0F14] text-white font-sans pb-24 px-5 pt-10">
            <h1 className="text-xl font-black uppercase tracking-widest text-white mb-6 border-l-4 border-cyan-400 pl-4 italic">Collect Fees</h1>

            <form onSubmit={handlePayment} className="space-y-4">
                {/* Student Identification - Day 91 FIXED */}
                <div className="bg-slate-900/60 p-6 rounded-[2.5rem] border border-white/5 space-y-4 shadow-xl mb-4">
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-white/40 uppercase ml-4 flex items-center gap-1">
                            <User size={10} /> Student Identity ID
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Paste Student ID here..."
                                className="w-full bg-[#0B0F14] p-4 rounded-2xl border border-white/5 text-xs text-white font-black outline-none focus:border-cyan-400 transition-all pr-12"
                                value={formData.studentId}
                                onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                                required
                            />
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20">
                                <Search size={16} />
                            </div>
                        </div>
                        <p className="text-[7px] text-white/10 ml-4 italic uppercase tracking-widest">
                            * Get this ID from the Student Fees Ledger list
                        </p>
                    </div>
                </div>
                {/* Amount Input */}
                <div className="bg-slate-900/60 p-6 rounded-[2.5rem] border border-white/5 space-y-4 shadow-xl">
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-white/40 uppercase ml-4 flex items-center gap-1"><IndianRupee size={10} /> Amount to Pay</label>
                        <input
                            type="number"
                            placeholder="Enter Amount"
                            className="w-full bg-[#0B0F14] p-4 rounded-2xl border border-white/5 text-sm text-cyan-400 font-black outline-none focus:border-cyan-400 transition-all"
                            value={formData.amountPaid}
                            onChange={(e) => setFormData({ ...formData, amountPaid: e.target.value })}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        {/* Month Selection */}
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-white/40 uppercase ml-4 flex items-center gap-1"><Calendar size={10} /> Month</label>
                            <select
                                className="w-full bg-[#0B0F14] p-4 rounded-2xl border border-white/5 text-xs text-white font-bold outline-none"
                                value={formData.month}
                                onChange={(e) => setFormData({ ...formData, month: e.target.value })}
                            >
                                {months.map(m => <option key={m} value={m}>{m}</option>)}
                            </select>
                        </div>
                        {/* Year Selection */}
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-white/40 uppercase ml-4">Year</label>
                            <input
                                type="number"
                                className="w-full bg-[#0B0F14] p-4 rounded-2xl border border-white/5 text-xs text-white font-bold outline-none"
                                value={formData.year}
                                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                            />
                        </div>
                    </div>
                </div>

                {/* Payment Mode */}
                <div className="bg-slate-900/40 p-6 rounded-[2.5rem] border border-white/5 space-y-4 shadow-xl">
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-white/40 uppercase ml-4 flex items-center gap-1"><CreditCard size={10} /> Payment Method</label>
                        <div className="grid grid-cols-3 gap-2">
                            {['Cash', 'UPI', 'Bank'].map(mode => (
                                <button
                                    key={mode}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, paymentMode: mode })}
                                    className={`py-3 rounded-xl text-[10px] font-black uppercase transition-all ${formData.paymentMode === mode ? 'bg-cyan-400 text-black shadow-[0_0_15px_rgba(61,242,224,0.3)]' : 'bg-white/5 text-white/40'}`}
                                >
                                    {mode}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-white/40 uppercase ml-4 flex items-center gap-1"><FileText size={10} /> Remarks / Note</label>
                        <textarea
                            placeholder="Optional notes..."
                            className="w-full bg-[#0B0F14] p-4 rounded-2xl border border-white/5 text-xs text-white outline-none focus:border-cyan-400 h-20"
                            onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    className="w-full bg-cyan-400 text-black py-5 rounded-[2rem] font-black text-xs uppercase shadow-[0_0_30px_rgba(61,242,224,0.2)] active:scale-95 transition-all mt-4"
                >
                    Confirm & Record Payment
                </button>
            </form>
            {msg && <Toast message={msg} onClose={() => setMsg('')} />}
        </div>
    );
};

export default AddPayment;