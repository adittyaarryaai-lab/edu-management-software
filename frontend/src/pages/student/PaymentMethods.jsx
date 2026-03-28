import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { useNavigate } from 'react-router-dom';
import { Loader2, CheckCircle2, Smartphone, Zap, ShieldCheck, Landmark, ArrowRight, ArrowLeft, Construction, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import API from '../../api';

const PaymentMethods = () => {
    const [summary, setSummary] = useState(null);
    const [paymentMode, setPaymentMode] = useState(null); // 'upi' or 'netbanking'
    const [selectedApp, setSelectedApp] = useState(null); // specific upi app
    const [isProcessing, setIsProcessing] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const loadData = async () => {
            try {
                const { data } = await API.get('/fees/student-summary');
                setSummary(data);
            } catch (err) { console.error("Payment Data Load Error", err); }
        };
        loadData();
    }, []);

    const executePaymentCapture = async (methodName) => {
        setIsProcessing(true);
        try {
            await API.post('/fees/capture-online-payment', {
                amount: summary.remainingFees,
                method: methodName
            });
            setTimeout(() => navigate('/student/fees', { replace: true }), 2000);
        } catch (err) {
            navigate('/student/fees', { replace: true });
        }
    };

    useEffect(() => {
        if (selectedApp && paymentMode === 'upi') {
            const timer = setTimeout(() => executePaymentCapture(selectedApp), 8000);
            return () => clearTimeout(timer);
        }
    }, [selectedApp, paymentMode]);

    if (!summary) return <div className="p-20 text-center text-neon animate-pulse font-black uppercase">Initializing Neural Gateway...</div>;

    return (
        <div className="min-h-screen bg-void text-white font-sans italic flex flex-col items-center justify-center relative overflow-hidden">

            <AnimatePresence mode="wait">
                {/* STEP 1: SELECT MODE */}
                {!paymentMode && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -20 }} className="w-full max-w-md space-y-6 p-6">
                        <h1 className="text-xl font-black uppercase text-center mb-10 tracking-widest border-b-2 border-neon/20 pb-4">Select Payment Mode</h1>

                        <button onClick={() => setPaymentMode('upi')} className="w-full p-8 bg-slate-900 border border-neon/20 rounded-[2.5rem] flex items-center gap-6 hover:bg-neon/5 transition-all group shadow-2xl">
                            <div className="p-4 bg-neon/10 rounded-2xl group-hover:bg-neon group-hover:text-void transition-all"><Zap size={24} /></div>
                            <div className="text-left">
                                <span className="block font-black text-sm uppercase tracking-widest">UPI Portal</span>
                                <span className="text-[9px] text-white/40 uppercase">GPay, PhonePe, Paytm QR</span>
                            </div>
                            <ArrowRight size={20} className="ml-auto text-white/20 group-hover:text-neon" />
                        </button>

                        <button onClick={() => setPaymentMode('netbanking')} className="w-full p-8 bg-slate-900 border border-neon/20 rounded-[2.5rem] flex items-center gap-6 hover:bg-neon/5 transition-all group shadow-2xl">
                            <div className="p-4 bg-cyan-500/10 rounded-2xl group-hover:bg-cyan-500 group-hover:text-void transition-all"><Landmark size={24} /></div>
                            <div className="text-left">
                                <span className="block font-black text-sm uppercase tracking-widest">Net Banking</span>
                                <span className="text-[9px] text-white/40 uppercase">Direct Bank Link Transmission</span>
                            </div>
                            <ArrowRight size={20} className="ml-auto text-white/20 group-hover:text-cyan-400" />
                        </button>

                        <button onClick={() => navigate(-1)} className="w-full text-center text-[10px] font-black uppercase text-white/20 tracking-widest pt-4 hover:text-white">Back to Summary</button>
                    </motion.div>
                )}

                {/* STEP 2: UPI APP SELECTION */}
                {paymentMode === 'upi' && !selectedApp && (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="w-full max-w-md p-6">
                        <button onClick={() => setPaymentMode(null)} className="flex items-center gap-2 text-[9px] font-black uppercase text-neon/40 mb-6 hover:text-neon"><ArrowLeft size={12} /> Back to Modes</button>
                        <h1 className="text-xl font-black uppercase text-center mb-10 tracking-widest">Select UPI App</h1>
                        <div className="space-y-4">
                            {['PhonePe', 'Google Pay', 'Paytm'].map(app => (
                                <button key={app} onClick={() => setSelectedApp(app)} className="w-full p-6 bg-slate-900/50 border border-white/5 rounded-2xl flex justify-between items-center hover:border-neon transition-all">
                                    <span className="font-black uppercase text-xs tracking-widest">{app}</span>
                                    <div className="w-2 h-2 bg-neon rounded-full animate-pulse shadow-[0_0_10px_rgba(61,242,224,1)]"></div>
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* STEP 2: NETBANKING - UNDER CONSTRUCTION SCREEN */}
                {paymentMode === 'netbanking' && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="relative z-10 flex flex-col items-center text-center p-6 w-full max-w-lg"
                    >
                        {/* --- NEURAL BACK NAVIGATION --- */}
                        <div className="absolute -top-16 left-6 z-50">
                            <button
                                onClick={() => setPaymentMode(null)}
                                className="bg-white/5 p-4 rounded-[1.5rem] active:scale-90 border border-white/10 text-neon hover:bg-neon/10 transition-all shadow-[0_0_20px_rgba(61,242,224,0.2)] flex items-center gap-2 group"
                            >
                                <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                                <span className="text-[10px] font-black uppercase tracking-widest pr-2">Return to Payment mode</span>
                            </button>
                        </div>

                        {/* Background Glow Effect */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-neon/10 blur-[120px] rounded-full pointer-events-none"></div>

                        <div className="mb-8 relative">
                            <div className="absolute inset-0 bg-neon/20 blur-2xl rounded-full animate-pulse"></div>
                            <div className="bg-slate-900 border border-neon/30 p-8 rounded-[2.5rem] relative">
                                <Construction size={60} className="text-neon animate-bounce" strokeWidth={1.5} />
                            </div>
                            <Zap size={24} className="absolute -top-2 -right-2 text-neon fill-neon animate-pulse" />
                        </div>

                        <h1 className="text-4xl font-black uppercase tracking-[0.2em] mb-4 italic leading-none text-white">
                            Module <span className="text-neon">Under</span> <br /> Construction
                        </h1>

                        <div className="h-[2px] w-24 bg-gradient-to-r from-transparent via-neon to-transparent mb-6"></div>

                        <p className="text-[11px] text-white/40 font-bold uppercase tracking-[0.4em] max-w-[300px] leading-relaxed">
                            Neural network for direct bank link is being synchronized. <br />
                            <span className="text-neon/60">Estimated deploy: Coming soon</span>
                        </p>

                        {/* Status Indicator */}
                        <div className="mt-12 flex items-center gap-3 bg-white/5 px-6 py-3 rounded-full border border-white/10">
                            <div className="w-2 h-2 bg-neon rounded-full animate-ping"></div>
                            <span className="text-[9px] font-black uppercase tracking-widest text-white/60">
                                System Protocol 129: Active
                            </span>
                        </div>
                    </motion.div>
                )}

                {/* STEP 3: UPI SUCCESS/PROCESSING OVERLAY */}
                {paymentMode === 'upi' && selectedApp && (
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md w-full bg-slate-900 p-10 rounded-[3.5rem] border border-neon/20 text-center shadow-2xl relative">
                        {isProcessing ? (
                            <div className="py-10 space-y-6">
                                <Loader2 size={48} className="mx-auto text-neon animate-spin" />
                                <h2 className="text-xl font-black uppercase tracking-widest">Authorizing Portal</h2>
                                <p className="text-[10px] text-white/40 uppercase font-black">Connecting to Secure Bank Server...</p>
                            </div>
                        ) : (
                            <>
                                <div className="bg-white p-6 rounded-[2.5rem] inline-block mb-10 border-4 border-neon shadow-[0_0_40px_rgba(61,242,224,0.2)]">
                                    <QRCodeSVG value={`upi://pay?pa=${summary.schoolPhone}&pn=${summary.schoolName}&am=${summary.remainingFees}`} size={180} />
                                </div>
                                <p className="text-3xl font-black mb-6 italic">₹{summary.remainingFees.toLocaleString()}</p>
                                <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center gap-3">
                                    <CheckCircle2 size={16} className="text-emerald-500 animate-bounce" />
                                    <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest italic text-center">Sync Active: Waiting for Confirmation</span>
                                </div>
                                <button onClick={() => setSelectedApp(null)} className="mt-8 text-[9px] font-black text-white/20 uppercase tracking-widest hover:text-white transition-all underline underline-offset-4">Cancel Payment</button>
                            </>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default PaymentMethods;