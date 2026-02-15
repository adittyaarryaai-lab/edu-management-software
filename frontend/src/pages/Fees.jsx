import React, { useState, useEffect } from 'react';
import { ArrowLeft, CreditCard, Home, Bus, Info, IndianRupee, CheckCircle, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import Loader from '../components/Loader';

const Fees = ({ user }) => {
    const navigate = useNavigate();
    const [feeData, setFeeData] = useState(null);
    const [loading, setLoading] = useState(true);

    // Backend se data fetch karne ka logic
    useEffect(() => {
        const fetchMyFees = async () => {
            try {
                const { data } = await API.get('/fees/my-fees');
                setFeeData(data);
            } catch (err) {
                console.error("No fees assigned yet or backend error");
            } finally {
                setLoading(false);
            }
        };
        fetchMyFees();
    }, []);

    const feeModules = [
        { title: 'All Fees (Incd.)', icon: <CreditCard size={28} />, color: 'text-blue-500', border: 'border-blue-500' },
        { title: 'Fees Info', icon: <Info size={28} />, color: 'text-orange-400', border: 'border-slate-100' },
        { title: 'Apply Hostel', icon: <Home size={28} />, color: 'text-red-400', border: 'border-slate-100' },
        { title: 'Transport', icon: <Bus size={28} />, color: 'text-yellow-500', border: 'border-slate-100' },
    ];

    if (loading) return <Loader />;

    return (
        <div className="min-h-screen bg-[#f8fafc] pb-20">
            {/* Header section */}
            <div className="nav-gradient text-white px-6 pt-12 pb-24 rounded-b-[3rem] shadow-lg relative z-10">
                <div className="flex items-center gap-4 mb-4">
                    <button onClick={() => navigate(-1)} className="bg-white/20 p-2 rounded-xl active:scale-90 transition-all">
                        <ArrowLeft size={20} />
                    </button>
                    <h1 className="text-xl font-bold uppercase tracking-tight">Fees Portal</h1>
                </div>
                <p className="text-xs opacity-90 font-bold tracking-widest uppercase ml-2">Secure Billing Management</p>
            </div>

            {/* Profile Card section */}
            <div className="px-5 -mt-14 relative z-20 space-y-6">
                <div className="bg-white rounded-[2.5rem] p-6 shadow-xl shadow-blue-100/50 border border-white">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-16 h-16 bg-blue-50 border border-blue-100 rounded-full flex-shrink-0 flex items-center justify-center overflow-hidden">
                           <span className="text-xl font-black text-blue-600 uppercase">{user?.name?.charAt(0)}</span>
                        </div>
                        <div className="overflow-hidden">
                            <h2 className="text-xl font-black text-slate-800 truncate">{user?.name || "Student Name"}</h2>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1 leading-none">Enrollment No</p>
                            <p className="text-[11px] font-bold text-blue-600 break-all">{user?.enrollmentNo || "N/A"}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-y-4 border-t border-slate-50 pt-5">
                        <div className="pr-2">
                            <p className="text-[9px] font-black text-slate-400 uppercase leading-none mb-1">Grade / Class</p>
                            <p className="text-[11px] font-bold text-slate-700">{user?.grade || "N/A"}</p>
                        </div>
                        <div>
                            <p className="text-[9px] font-black text-slate-400 uppercase leading-none mb-1">Fee Status</p>
                            <p className={`text-[11px] font-bold ${feeData?.status === 'Paid' ? 'text-green-500' : 'text-orange-500'}`}>
                                {feeData?.status || "Pending"}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Real Balance Card - Yeh naya section hai data ke liye */}
                <div className="bg-slate-900 rounded-[2.5rem] p-7 text-white shadow-2xl relative overflow-hidden">
                    <div className="relative z-10">
                        <p className="text-[9px] font-black text-blue-400 uppercase tracking-widest mb-1">Total Outstanding</p>
                        <h2 className="text-4xl font-black mb-4 flex items-center gap-1 tracking-tighter">
                            <IndianRupee size={28} className="text-blue-500" />
                            {feeData ? (feeData.totalAmount - feeData.paidAmount).toLocaleString() : '0'}
                        </h2>
                        <div className="flex justify-between items-center border-t border-white/10 pt-4">
                            <div>
                                <p className="text-[8px] font-black text-slate-500 uppercase">Last Date</p>
                                <p className="text-[10px] font-bold">{feeData?.dueDate || 'Not Set'}</p>
                            </div>
                            <div className="bg-blue-600 px-4 py-2 rounded-xl">
                                <span className="text-[10px] font-black uppercase tracking-tighter">Pay Now</span>
                            </div>
                        </div>
                    </div>
                    {/* Background decor */}
                    <div className="absolute -right-6 -top-6 bg-blue-500/10 w-32 h-32 rounded-full blur-2xl"></div>
                </div>

                {/* Fee Type Grid */}
                <div className="grid grid-cols-2 gap-4">
                    {feeModules.map((m, i) => (
                        <div key={i} className={`bg-white p-5 rounded-[2rem] flex flex-col items-start justify-center gap-3 border-2 ${m.border} shadow-sm active:scale-95 transition-all cursor-pointer group`}>
                            <div className={`${m.color} bg-slate-50 p-3 rounded-2xl group-hover:scale-110 transition-transform`}>
                                {m.icon}
                            </div>
                            <span className="text-[10px] font-black text-slate-700 leading-tight uppercase tracking-widest">
                                {m.title}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Payment History Section */}
                {feeData?.paymentHistory && feeData.paymentHistory.length > 0 && (
                    <div className="space-y-4 pb-10">
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Recent Transactions</h3>
                        {feeData.paymentHistory.map((item, i) => (
                            <div key={i} className="bg-white p-5 rounded-[2rem] shadow-sm border border-slate-50 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="bg-green-50 text-green-600 p-3 rounded-2xl">
                                        <CheckCircle size={20} />
                                    </div>
                                    <div>
                                        <h4 className="font-black text-slate-800 text-sm">₹{item.amount} Confirmed</h4>
                                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">
                                            {item.method} • {new Date(item.date).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Fees;