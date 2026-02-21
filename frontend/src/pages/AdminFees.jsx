import React, { useState, useEffect } from 'react';
import { ArrowLeft, IndianRupee, Search, X, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import Loader from '../components/Loader';

const AdminFees = () => {
    const navigate = useNavigate();
    const [fees, setFees] = useState([]);
    const [loading, setLoading] = useState(true);

    const [showPayModal, setShowPayModal] = useState(false);
    const [selectedFee, setSelectedFee] = useState(null);
    const [payAmount, setPayAmount] = useState('');
    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => {
        fetchFees();
    }, []);

    const fetchFees = async () => {
        try {
            const { data } = await API.get('/fees/all');
            setFees(data);
        } catch (err) {
            console.error("Error fetching fees");
        } finally {
            setLoading(false);
        }
    };

    const handlePayment = async () => {
        if (!payAmount || payAmount <= 0) return alert("Please enter a valid amount");
        
        setIsUpdating(true);
        try {
            await API.post('/fees/pay', { 
                feeId: selectedFee._id, 
                amount: payAmount, 
                method: 'UPI/Cash' 
            });
            
            setShowPayModal(false);
            setPayAmount('');
            fetchFees();
            alert("Payment Recorded Successfully!");
        } catch (err) {
            alert(err.response?.data?.message || "Payment Failed");
        } finally {
            setIsUpdating(false);
        }
    };

    if (loading) return <Loader />;

    return (
        <div className="min-h-screen bg-void dark:bg-void pb-24 font-sans italic">
            <div className="bg-void text-white px-6 pt-12 pb-20 rounded-b-[3rem] shadow-2xl border-b border-neon/20 overflow-hidden">
                <div className="flex items-center gap-4 mb-6">
                    <button onClick={() => navigate(-1)} className="bg-white/5 p-2 rounded-xl border border-white/10 text-neon"><ArrowLeft size={20}/></button>
                    <h1 className="text-xl font-black uppercase tracking-tighter italic">Fee Management</h1>
                </div>
                
                <div className="bg-white/5 p-4 rounded-3xl backdrop-blur-md flex items-center gap-3 border border-white/10">
                    <Search size={18} className="text-neon/50" />
                    <input type="text" placeholder="Search student name..." className="bg-transparent border-none outline-none w-full text-sm placeholder:text-neon/30 text-white font-bold" />
                </div>
            </div>

            <div className="px-5 -mt-8 space-y-4">
                {fees.map((f) => (
                    <div key={f._id} className="bg-white/5 backdrop-blur-xl p-6 rounded-[2.5rem] shadow-2xl border border-white/5 flex flex-col gap-4 animate-in fade-in duration-300">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="bg-neon/10 text-neon p-3 rounded-2xl border border-neon/20 shadow-[0_0_15px_rgba(61,242,224,0.1)]">
                                    <IndianRupee size={20} />
                                </div>
                                <div>
                                    <h4 className="font-black text-white text-sm leading-none uppercase">{f.student?.name}</h4>
                                    <p className="text-[10px] text-neon/40 mt-1 font-bold uppercase tracking-widest italic">
                                        Grade: {f.student?.grade} • Due: {f.dueDate}
                                    </p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-black text-neon">₹{f.totalAmount - f.paidAmount}</p>
                                <p className={`text-[8px] font-black uppercase tracking-widest ${f.status === 'Paid' ? 'text-neon' : 'text-orange-400'}`}>
                                    {f.status}
                                </p>
                            </div>
                        </div>

                        {f.status !== 'Paid' && (
                            <button 
                                onClick={() => { setSelectedFee(f); setShowPayModal(true); }}
                                className="w-full bg-neon text-void py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest active:scale-95 transition-all shadow-[0_0_15px_rgba(61,242,224,0.3)]"
                            >
                                Record Payment
                            </button>
                        )}
                    </div>
                ))}
            </div>

            {showPayModal && (
                <div className="fixed inset-0 bg-void/80 z-[100] flex items-center justify-center p-6 backdrop-blur-md">
                    <div className="bg-void border border-neon/30 w-full max-w-sm rounded-[3rem] p-8 shadow-[0_0_50px_rgba(61,242,224,0.1)] relative animate-in zoom-in duration-300 italic">
                        <button onClick={() => setShowPayModal(false)} className="absolute top-6 right-6 p-2 bg-white/5 rounded-full text-neon/40"><X size={18} /></button>
                        
                        <div className="text-center mb-6">
                            <div className="bg-neon/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-neon/20">
                                <IndianRupee className="text-neon" size={30} />
                            </div>
                            <h3 className="font-black text-xl text-white uppercase italic">Record Fee</h3>
                            <p className="text-[10px] text-neon/40 font-black uppercase tracking-widest mt-1 italic">Identity: {selectedFee?.student?.name}</p>
                        </div>

                        <div className="space-y-4">
                            <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                                <label className="text-[9px] font-black text-neon uppercase tracking-widest block mb-1 italic">Neural Transaction Amount (₹)</label>
                                <input 
                                    type="number" 
                                    placeholder="5000" 
                                    className="w-full bg-transparent outline-none font-black text-xl text-white placeholder:text-white/20"
                                    value={payAmount}
                                    onChange={(e) => setPayAmount(e.target.value)}
                                />
                            </div>

                            <button 
                                onClick={handlePayment}
                                disabled={isUpdating}
                                className="w-full bg-neon text-void py-5 rounded-[2rem] font-black text-xs uppercase shadow-[0_0_25px_rgba(61,242,224,0.3)] active:scale-95 transition-all flex items-center justify-center gap-2 disabled:bg-slate-800 disabled:text-slate-500 italic"
                            >
                                {isUpdating ? "Synchronizing..." : (
                                    <>
                                        <CheckCircle size={18} /> Confirm Transmission
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminFees;