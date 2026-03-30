import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { useNavigate } from 'react-router-dom';
import { Loader2, CheckCircle2, Smartphone, Zap, ShieldCheck, Landmark, ArrowRight, ArrowLeft, Construction, ShieldAlert, Upload, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import API from '../../api';

const PaymentMethods = () => {
    const [summary, setSummary] = useState(null);
    const [paymentMode, setPaymentMode] = useState(null); // 'upi' or 'netbanking'
    const [selectedApp, setSelectedApp] = useState(null); // specific upi app
    const [isProcessing, setIsProcessing] = useState(false);

    // --- DAY 130: NEW SCREENSHOT STATES ---
    const [screenshot, setScreenshot] = useState(null);
    const [preview, setPreview] = useState(null);

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

    // --- DAY 130: FILE SELECTION LOGIC ---
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setScreenshot(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    // --- DAY 130: MANUAL TRANSMISSION LOGIC ---
    const handleFinalSubmit = async () => {
        if (!screenshot) return alert("Please upload payment screenshot first! 🛡️");

        setIsProcessing(true);
        const formData = new FormData();
        formData.append('screenshot', screenshot);
        formData.append('amount', summary.grandTotal);
        formData.append('method', selectedApp);

        try {
            // Backend route name: capture-with-screenshot
            await API.post('/fees/capture-with-screenshot', formData);
            alert("Neural Signal Transmitted! Awaiting Finance Verification. 📡");
            navigate('/student/fees', { replace: true });
        } catch (err) {
            alert("Protocol Failure: Upload Failed.");
            setIsProcessing(false);
        }
    };

    if (!summary) return <div className="p-20 text-center text-neon animate-pulse font-black uppercase tracking-widest">Initializing Neural Gateway...</div>;

    // UPI Link generation using Teacher's configured UPI ID
    const upiLink = `upi://pay?pa=${summary.schoolPhone}&pn=${summary.schoolName}&am=${summary.grandTotal}&cu=INR`;

    return (
        <div className="min-h-screen bg-void text-white font-sans italic flex flex-col items-center justify-center relative overflow-hidden p-6">

            <AnimatePresence mode="wait">
                {/* STEP 1: SELECT MODE */}
                {!paymentMode && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -20 }} className="w-full max-w-md space-y-6">
                        <h1 className="text-xl font-black uppercase text-center mb-10 tracking-widest border-b-2 border-neon/20 pb-4">Select Gateway</h1>

                        <button onClick={() => setPaymentMode('upi')} className="w-full p-8 bg-slate-900 border border-neon/20 rounded-[2.5rem] flex items-center gap-6 hover:bg-neon/5 transition-all group shadow-2xl">
                            <div className="p-4 bg-neon/10 rounded-2xl group-hover:bg-neon group-hover:text-void transition-all"><Zap size={24} /></div>
                            <div className="text-left">
                                <span className="block font-black text-sm uppercase tracking-widest">UPI Portal</span>
                                <span className="text-[9px] text-white/40 uppercase">GPay, PhonePe, Paytm QR</span>
                            </div>
                            <ArrowRight size={20} className="ml-auto text-white/20 group-hover:text-neon" />
                        </button>

                        <button onClick={() => setPaymentMode('netbanking')} className="w-full p-8 bg-slate-900 border border-white/5 rounded-[2.5rem] flex items-center gap-6 group shadow-2xl opacity-60">
                            <div className="p-4 bg-white/5 rounded-2xl"><Landmark size={24} /></div>
                            <div className="text-left">
                                <span className="block font-black text-sm uppercase tracking-widest">Net Banking</span>
                                <span className="text-[9px] text-white/40 uppercase">Coming Soon</span>
                            </div>
                        </button>

                        <button onClick={() => navigate(-1)} className="w-full text-center text-[10px] font-black uppercase text-white/20 tracking-widest pt-4 hover:text-white transition-colors underline underline-offset-4">Back to Summary</button>
                    </motion.div>
                )}

                {/* STEP 2: UPI APP SELECTION */}
                {paymentMode === 'upi' && !selectedApp && (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="w-full max-w-md">
                        <button onClick={() => setPaymentMode(null)} className="flex items-center gap-2 text-[9px] font-black uppercase text-neon/40 mb-6 hover:text-neon"><ArrowLeft size={12} /> Back to Modes</button>
                        <h1 className="text-xl font-black uppercase text-center mb-10 tracking-widest">Select Method</h1>
                        <div className="space-y-4">
                            {['PhonePe', 'Google Pay', 'Paytm', 'Manual QR'].map(app => (
                                <button key={app} onClick={() => setSelectedApp(app)} className="w-full p-6 bg-slate-900/50 border border-white/5 rounded-2xl flex justify-between items-center hover:border-neon transition-all group">
                                    <span className="font-black uppercase text-xs tracking-widest group-hover:text-neon">{app}</span>
                                    <div className="w-2 h-2 bg-neon rounded-full animate-pulse shadow-[0_0_10px_rgba(61,242,224,1)]"></div>
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* STEP 2: NETBANKING - CONSTRUCTION SCREEN (Reused from your code) */}
                {paymentMode === 'netbanking' && (
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="relative z-10 flex flex-col items-center text-center w-full max-w-lg">
                        <div className="absolute -top-16 left-6 z-50">
                            <button onClick={() => setPaymentMode(null)} className="bg-white/5 p-4 rounded-[1.5rem] active:scale-90 border border-white/10 text-neon hover:bg-neon/10 transition-all flex items-center gap-2 group shadow-lg">
                                <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                                <span className="text-[10px] font-black uppercase tracking-widest pr-2">Return</span>
                            </button>
                        </div>
                        <div className="mb-8 relative">
                            <div className="bg-slate-900 border border-neon/30 p-8 rounded-[2.5rem] relative">
                                <Construction size={60} className="text-neon animate-bounce" />
                            </div>
                        </div>
                        <h1 className="text-4xl font-black uppercase tracking-[0.2em] mb-4 italic text-white">Module <span className="text-neon">Under</span> Construction</h1>
                        <p className="text-[11px] text-white/40 font-bold uppercase tracking-[0.4em]">System Protocol 130: Active</p>
                    </motion.div>
                )}

                {/* STEP 3: QR & SCREENSHOT UPLOAD PANEL (DAY 130) */}
                {paymentMode === 'upi' && selectedApp && (
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md w-full bg-slate-900 p-8 rounded-[3.5rem] border border-neon/20 text-center shadow-2xl relative">

                        {isProcessing ? (
                            <div className="py-20 space-y-6">
                                <Loader2 size={48} className="mx-auto text-neon animate-spin" />
                                <h2 className="text-xl font-black uppercase tracking-widest">Finalizing Uplink</h2>
                                <p className="text-[10px] text-white/40 uppercase font-black italic">Uploading evidence to school node...</p>
                            </div>
                        ) : (
                            <>
                                <h2 className="text-[10px] font-black text-neon uppercase tracking-[0.3em] mb-6 flex items-center justify-center gap-2">
                                    <ShieldCheck size={14} /> Institutional Payment Hub
                                </h2>

                                {/* QR DISPLAY (Teacher's UPI ID used here) */}
                                <div className="bg-white p-5 rounded-[2.5rem] inline-block mb-6 border-4 border-neon shadow-[0_0_30px_rgba(61,242,224,0.2)]">
                                    <QRCodeSVG value={upiLink} size={180} />
                                </div>

                                <div className="space-y-1 mb-8">
                                    <p className="text-3xl font-black italic tracking-tighter">₹{summary.grandTotal.toLocaleString()}</p>
                                    <p className="text-[9px] text-white/30 uppercase font-bold tracking-widest">ID: {summary.schoolPhone}</p>
                                </div>

                                {/* --- SCREENSHOT UPLOAD AREA --- */}
                                <div className="space-y-4">
                                    {!preview ? (
                                        <label className="flex flex-col items-center justify-center w-full p-8 border-2 border-dashed border-white/10 rounded-3xl bg-white/5 cursor-pointer hover:border-neon hover:bg-neon/5 transition-all group">
                                            <Upload className="text-neon/40 group-hover:text-neon group-hover:animate-bounce mb-3" size={32} />
                                            <span className="text-[10px] font-black uppercase text-white/40 group-hover:text-white tracking-widest">Upload Payment Screenshot</span>
                                            <input type="file" hidden accept="image/*" onChange={handleFileChange} />
                                        </label>
                                    ) : (
                                        <div className="relative group">
                                            <img src={preview} className="w-full h-40 object-contain rounded-3xl border border-neon/30 bg-black/40" alt="Payment Preview" />
                                            <button
                                                onClick={() => { setPreview(null); setScreenshot(null) }}
                                                className="absolute -top-3 -right-3 bg-red-500 p-2 rounded-full shadow-lg hover:bg-red-600 transition-colors"
                                            >
                                                <X size={16} />
                                            </button>
                                            <p className="text-[9px] font-black text-emerald-400 uppercase mt-2 italic flex items-center justify-center gap-1">
                                                <CheckCircle2 size={12} /> Screenshot Captured
                                            </p>
                                        </div>
                                    )}

                                    {/* Action Button: Sirf tab dikhega jab screenshot select hoga */}
                                    <AnimatePresence>
                                        {screenshot && (
                                            <motion.button
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                onClick={handleFinalSubmit}
                                                className="w-full py-5 bg-neon text-void rounded-2xl font-black uppercase text-xs tracking-widest shadow-[0_10px_20px_rgba(61,242,224,0.3)] hover:scale-[1.02] active:scale-95 transition-all mt-4"
                                            >
                                                Payment Completed
                                            </motion.button>
                                        )}
                                    </AnimatePresence>
                                </div>

                                <button onClick={() => setSelectedApp(null)} className="mt-8 text-[9px] font-black text-white/20 uppercase tracking-widest hover:text-white transition-all underline underline-offset-4 decoration-white/10">Change Method</button>
                            </>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Footer Mesh */}
            <div className="absolute bottom-6 opacity-10 flex items-center gap-2">
                <ShieldAlert size={12} />
                <p className="text-[8px] font-black uppercase tracking-[0.5em]">EduFlowAI Secure Payment Mesh</p>
            </div>
        </div>
    );
};

export default PaymentMethods;