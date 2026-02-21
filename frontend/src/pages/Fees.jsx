import React, { useState, useEffect } from 'react';
import { ArrowLeft, CreditCard, Home, Bus, Info, IndianRupee, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import Loader from '../components/Loader';

const Fees = ({ user }) => {
    const navigate = useNavigate();
    const [feeData, setFeeData] = useState(null);
    const [loading, setLoading] = useState(true);

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
        { title: 'All Fees (Incd.)', icon: <CreditCard size={28} />, color: 'text-neon', border: 'border-neon/40' },
        { title: 'Fees Info', icon: <Info size={28} />, color: 'text-orange-400', border: 'border-white/10' },
        { title: 'Apply Hostel', icon: <Home size={28} />, color: 'text-red-400', border: 'border-white/10' },
        { title: 'Transport', icon: <Bus size={28} />, color: 'text-yellow-400', border: 'border-white/10' },
    ];

    if (loading) return <Loader />;

    return (
        <div className="min-h-screen bg-void pb-20 font-sans italic">
            {/* Header section */}
            <div className="bg-void text-white px-6 pt-12 pb-24 rounded-b-[3rem] shadow-2xl border-b border-neon/20 relative z-10 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-neon/10 to-transparent pointer-events-none"></div>
                <div className="flex items-center gap-4 mb-4 relative z-10">
                    <button onClick={() => navigate(-1)} className="bg-white/5 p-2 rounded-xl active:scale-90 border border-white/10 text-neon">
                        <ArrowLeft size={20} />
                    </button>
                    <h1 className="text-xl font-black uppercase tracking-tighter italic">Fees Portal</h1>
                </div>
                <p className="text-[10px] text-neon/60 font-black tracking-[0.3em] uppercase ml-2 italic">Secure Billing Management Matrix</p>
            </div>

            {/* Profile Card section */}
            <div className="px-5 -mt-14 relative z-20 space-y-6">
                <div className="bg-white/5 backdrop-blur-xl rounded-[2.5rem] p-6 shadow-2xl border border-white/10">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-16 h-16 bg-neon/10 border border-neon/30 rounded-full flex-shrink-0 flex items-center justify-center overflow-hidden shadow-inner">
                           <span className="text-xl font-black text-neon uppercase">{user?.name?.charAt(0)}</span>
                        </div>
                        <div className="overflow-hidden">
                            <h2 className="text-xl font-black text-white truncate italic uppercase tracking-tight">{user?.name || "Student Name"}</h2>
                            <p className="text-[8px] font-black text-neon/40 uppercase tracking-[0.3em] mt-1 leading-none">Access Enrollment ID</p>
                            <p className="text-[11px] font-black text-neon break-all font-mono">{user?.enrollmentNo || "N/A"}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-y-4 border-t border-white/5 pt-5">
                        <div className="pr-2">
                            <p className="text-[8px] font-black text-white/30 uppercase leading-none mb-1 tracking-widest">Neural Grade</p>
                            <p className="text-[11px] font-black text-white/80 uppercase">{user?.grade || "N/A"}</p>
                        </div>
                        <div>
                            <p className="text-[8px] font-black text-white/30 uppercase leading-none mb-1 tracking-widest">Protocol Status</p>
                            <p className={`text-[11px] font-black uppercase ${feeData?.status === 'Paid' ? 'text-neon' : 'text-orange-400 animate-pulse'}`}>
                                {feeData?.status || "Pending"}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Real Balance Card */}
                <div className="bg-void rounded-[2.5rem] p-7 text-white shadow-[0_0_50px_rgba(0,0,0,0.8)] border border-neon/10 relative overflow-hidden group">
                    <div className="relative z-10">
                        <p className="text-[9px] font-black text-neon uppercase tracking-[0.4em] mb-1 italic">Total Outstanding Dues</p>
                        <h2 className="text-4xl font-black mb-4 flex items-center gap-1 tracking-tighter text-white">
                            <IndianRupee size={28} className="text-neon" />
                            {feeData ? (feeData.totalAmount - feeData.paidAmount).toLocaleString() : '0'}
                        </h2>
                        <div className="flex justify-between items-center border-t border-white/5 pt-4">
                            <div>
                                <p className="text-[8px] font-black text-white/20 uppercase tracking-widest italic">Deadline Cycle</p>
                                <p className="text-[10px] font-black text-neon/80 italic">{feeData?.dueDate || 'Not Set'}</p>
                            </div>
                            <div className="bg-neon text-void px-6 py-2 rounded-xl shadow-[0_0_15px_rgba(61,242,224,0.4)] active:scale-95 transition-all">
                                <span className="text-[10px] font-black uppercase tracking-widest italic">Pay Now</span>
                            </div>
                        </div>
                    </div>
                    <div className="absolute -right-6 -top-6 bg-neon/5 w-32 h-32 rounded-full blur-3xl group-hover:bg-neon/10 transition-all"></div>
                </div>

                {/* Fee Type Grid */}
                <div className="grid grid-cols-2 gap-4">
                    {feeModules.map((m, i) => (
                        <div key={i} className={`bg-white/5 backdrop-blur-xl p-5 rounded-[2rem] flex flex-col items-start justify-center gap-3 border border-white/5 shadow-xl active:scale-95 transition-all cursor-pointer group hover:border-neon/30`}>
                            <div className={`${m.color} bg-void p-3 rounded-2xl group-hover:shadow-[0_0_15px_rgba(61,242,224,0.2)] transition-all`}>
                                {m.icon}
                            </div>
                            <span className="text-[10px] font-black text-white/70 leading-tight uppercase tracking-[0.2em] italic">
                                {m.title}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Payment History Section */}
                {feeData?.paymentHistory && feeData.paymentHistory.length > 0 && (
                    <div className="space-y-4 pb-10">
                        <h3 className="text-[10px] font-black text-neon/30 uppercase tracking-[0.4em] ml-2 italic">Archived Transactions</h3>
                        {feeData.paymentHistory.map((item, i) => (
                            <div key={i} className="bg-white/5 backdrop-blur-xl p-5 rounded-[2rem] shadow-xl border border-white/5 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="bg-neon/10 text-neon p-3 rounded-2xl border border-neon/20">
                                        <CheckCircle size={20} />
                                    </div>
                                    <div>
                                        <h4 className="font-black text-white text-sm italic">₹{item.amount} Confirmed</h4>
                                        <p className="text-[9px] text-white/30 font-black uppercase tracking-tighter italic">
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