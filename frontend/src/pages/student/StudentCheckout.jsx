import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, School, User, Hash, BookOpen, CreditCard, ChevronRight } from 'lucide-react';
import API from '../../api';

const StudentCheckout = () => {
    const [summary, setSummary] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSummary = async () => {
            try {
                const { data } = await API.get('/fees/student-summary');
                setSummary(data);
            } catch (err) { console.error("Checkout Load Error"); }
        };
        fetchSummary();
    }, []);

    if (!summary) return <div className="p-20 text-center text-neon animate-pulse uppercase font-black">Syncing Credentials...</div>;

    return (
        <div className="min-h-screen bg-void text-white p-6 font-sans italic">
            {/* Header */}
            <div className="flex items-center gap-4 mb-10">
                <button onClick={() => navigate(-1)} className="p-2 bg-white/5 rounded-xl border border-white/10">
                    <ArrowLeft size={20} className="text-neon" />
                </button>
                <h1 className="text-xl font-black uppercase tracking-tighter">Online Payment Mode</h1>
            </div>

            <div className="space-y-6 max-w-2xl mx-auto">
                {/* --- STUDENT IDENTITY CARD --- */}
                <div className="bg-slate-900/60 p-8 rounded-[2.5rem] border border-white/5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10"><User size={80} /></div>
                    <h2 className="text-[10px] font-black text-neon uppercase tracking-[0.4em] mb-6">Student Identification</h2>

                    <div className="grid grid-cols-2 gap-y-6">
                        <div className="flex items-center gap-3">
                            <User size={14} className="text-neon" />
                            <div>
                                <p className="text-[8px] uppercase text-white/30">Student Name</p>
                                <p className="text-xs font-black uppercase text-white">{summary.studentName}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Hash size={14} className="text-neon" />
                            <div>
                                <p className="text-[8px] uppercase text-white/30">Enrollment</p>
                                <p className="text-xs font-black uppercase text-white">{summary.enrollmentNo}</p>
                            </div>
                        </div>
                        {/* NAYA: Father Name */}
                        <div className="flex items-center gap-3">
                            <User size={14} className="text-neon" />
                            <div>
                                <p className="text-[8px] uppercase text-white/30">Father's Name</p>
                                <p className="text-xs font-black uppercase text-white">{summary.fatherName || 'N/A'}</p>
                            </div>
                        </div>
                        {/* NAYA: Mobile Number */}
                        <div className="flex items-center gap-3">
                            <Hash size={14} className="text-neon" />
                            <div>
                                <p className="text-[8px] uppercase text-white/30">Mobile No.</p>
                                <p className="text-xs font-black uppercase text-white">{summary.mobile || 'N/A'}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- DAY 128: SCHOOL IDENTIFICATION CARD --- */}
                <div className="bg-slate-900/60 p-8 rounded-[2.5rem] border border-neon/10 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-5 text-neon"><School size={80} /></div>
                    <h2 className="text-[10px] font-black text-neon uppercase tracking-[0.4em] mb-6 flex items-center gap-2">
                        <School size={12} /> School Identification
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* School Name */}
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-neon/5 rounded-lg border border-neon/10">
                                <School size={14} className="text-neon" />
                            </div>
                            <div>
                                <p className="text-[8px] uppercase text-white/30">School Name</p>
                                <p className="text-xs font-black uppercase text-white tracking-wider">{summary.schoolName}</p>
                            </div>
                        </div>

                        {/* Payment QR Number */}
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-neon/5 rounded-lg border border-neon/10">
                                <Hash size={14} className="text-neon" />
                            </div>
                            <div>
                                <p className="text-[8px] uppercase text-white/30">Online Payment (NO.)</p>
                                <p className="text-xs font-black text-neon animate-pulse tracking-widest">{summary.schoolPhone}</p>
                            </div>
                        </div>

                        {/* Admin Name */}
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-neon/5 rounded-lg border border-neon/10">
                                <User size={14} className="text-neon" />
                            </div>
                            <div>
                                <p className="text-[8px] uppercase text-white/30">Admin Name</p>
                                <p className="text-xs font-black uppercase text-white">{summary.adminName}</p>
                            </div>
                        </div>

                        {/* Admin Email */}
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-neon/5 rounded-lg border border-neon/10">
                                <CreditCard size={14} className="text-neon" />
                            </div>
                            <div>
                                <p className="text-[8px] uppercase text-white/30">Email</p>
                                <p className="text-xs font-black text-white/70 lowercase">{summary.adminEmail}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- BILLING SUMMARY --- */}
                <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/5">
                    <h2 className="text-[10px] font-black text-rose-500 uppercase tracking-[0.4em] mb-6">Settlement Summary</h2>

                    <div className="space-y-4">
                        <div className="flex justify-between items-center pb-4 border-b border-white/5">
                            <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Monthly Fees To Be Paid</span>
                            {/* Calculation: GrandTotal minus Penalty = Base Fees */}
                            <span className="text-sm font-black italic">₹{(summary.grandTotal - summary.totalPenalty).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center pb-4 border-b border-white/5">
                            <span className="text-[10px] font-bold text-rose-400 uppercase tracking-widest">Total Penalty</span>
                            <span className="text-sm font-black italic text-rose-400">+ ₹{(summary.totalPenalty || 0).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center pt-2">
                            <span className="text-xs font-black text-neon uppercase italic tracking-[0.2em]">Net Payable amount</span>
                            <span className="text-2xl font-black text-neon animate-pulse">₹{(summary.grandTotal).toLocaleString()}</span>
                        </div>
                    </div>
                </div>

                {/* --- PAY NOW ACTION --- */}
                <button
                    onClick={() => navigate('/student/payment-methods')}
                    className="w-full py-6 bg-neon text-black rounded-[2rem] font-black uppercase tracking-[0.2em] text-sm flex items-center justify-center gap-3 hover:scale-[1.02] transition-all shadow-[0_20px_40px_-15px_rgba(34,211,238,0.3)]"
                >
                    <CreditCard size={18} />
                    Pay
                    <ChevronRight size={18} />
                </button>
            </div>
        </div>
    );
};

export default StudentCheckout;