import React, { useState, useEffect } from 'react';
import { ArrowLeft, IndianRupee, Search, X, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import Loader from '../components/Loader';

const AdminFees = () => {
    const navigate = useNavigate();
    const [fees, setFees] = useState([]);
    const [loading, setLoading] = useState(true);

    // STEP 2: Payment Modal States
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

    // STEP 2: Payment Handle Logic
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
            fetchFees(); // Refresh list after payment
            alert("Payment Recorded Successfully!");
        } catch (err) {
            alert(err.response?.data?.message || "Payment Failed");
        } finally {
            setIsUpdating(false);
        }
    };

    if (loading) return <Loader />;

    return (
        <div className="min-h-screen bg-[#f8fafc] pb-24">
            <div className="nav-gradient text-white px-6 pt-12 pb-20 rounded-b-[3rem] shadow-lg">
                <div className="flex items-center gap-4 mb-6">
                    <button onClick={() => navigate(-1)} className="bg-white/20 p-2 rounded-xl"><ArrowLeft size={20}/></button>
                    <h1 className="text-xl font-bold uppercase tracking-tight">Fee Management</h1>
                </div>
                
                <div className="bg-white/10 p-4 rounded-3xl backdrop-blur-md flex items-center gap-3">
                    <Search size={18} className="opacity-50" />
                    <input type="text" placeholder="Search student name..." className="bg-transparent border-none outline-none w-full text-sm placeholder:text-white/50" />
                </div>
            </div>

            <div className="px-5 -mt-8 space-y-4">
                {fees.map((f) => (
                    <div key={f._id} className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-50 flex flex-col gap-4 animate-in fade-in duration-300">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="bg-green-50 text-green-600 p-3 rounded-2xl">
                                    <IndianRupee size={20} />
                                </div>
                                <div>
                                    <h4 className="font-black text-slate-800 text-sm leading-none">{f.student?.name}</h4>
                                    <p className="text-[10px] text-slate-400 mt-1 font-bold uppercase tracking-tighter">
                                        Grade: {f.student?.grade} • Due: {f.dueDate}
                                    </p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-black text-slate-800">₹{f.totalAmount - f.paidAmount}</p>
                                <p className={`text-[8px] font-black uppercase tracking-widest ${f.status === 'Paid' ? 'text-green-500' : 'text-orange-500'}`}>
                                    {f.status}
                                </p>
                            </div>
                        </div>

                        {/* STEP 2: Record Payment Button */}
                        {f.status !== 'Paid' && (
                            <button 
                                onClick={() => { setSelectedFee(f); setShowPayModal(true); }}
                                className="w-full bg-blue-600/10 text-blue-600 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest active:scale-95 transition-all"
                            >
                                Record Payment
                            </button>
                        )}
                    </div>
                ))}
            </div>

            {/* STEP 2: Payment Modal UI */}
            {showPayModal && (
                <div className="fixed inset-0 bg-slate-900/60 z-[100] flex items-center justify-center p-6 backdrop-blur-md">
                    <div className="bg-white w-full max-w-sm rounded-[3rem] p-8 shadow-2xl relative animate-in zoom-in duration-300">
                        <button onClick={() => setShowPayModal(false)} className="absolute top-6 right-6 p-2 bg-slate-100 rounded-full text-slate-400"><X size={18} /></button>
                        
                        <div className="text-center mb-6">
                            <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <IndianRupee className="text-blue-600" size={30} />
                            </div>
                            <h3 className="font-black text-xl text-slate-800">Record Fee</h3>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Student: {selectedFee?.student?.name}</p>
                        </div>

                        <div className="space-y-4">
                            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Enter Amount (₹)</label>
                                <input 
                                    type="number" 
                                    placeholder="5000" 
                                    className="w-full bg-transparent outline-none font-black text-xl text-slate-800"
                                    value={payAmount}
                                    onChange={(e) => setPayAmount(e.target.value)}
                                />
                            </div>

                            <button 
                                onClick={handlePayment}
                                disabled={isUpdating}
                                className="w-full bg-blue-600 text-white py-5 rounded-[2rem] font-black text-xs uppercase shadow-xl shadow-blue-100 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:bg-slate-300"
                            >
                                {isUpdating ? "Processing..." : (
                                    <>
                                        <CheckCircle size={18} /> Confirm Payment
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