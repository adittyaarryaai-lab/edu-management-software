import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { useNavigate } from 'react-router-dom';
import { Loader2, CheckCircle2, Smartphone, Zap, ShieldCheck } from 'lucide-react';
import API from '../../api';

const PaymentMethods = () => {
    const [summary, setSummary] = useState(null);
    const [schoolInfo, setSchoolInfo] = useState(null);
    const [selectedApp, setSelectedApp] = useState(null);
    const navigate = useNavigate();

    // 1. Initial Data Load
    useEffect(() => {
        const loadData = async () => {
            try {
                const { data } = await API.get('/fees/student-summary');
                setSummary(data);
                setSchoolInfo(data.paymentSettings);
            } catch (err) { console.error("Payment Data Load Error", err); }
        };
        loadData();
    }, []);

    // --- DAY 111: REAL-TIME AUTO-CAPTURE & REDIRECT ---
    useEffect(() => {
        let captureTimer;

        const executePaymentCapture = async () => {
            try {
                const { data } = await API.post('/fees/capture-online-payment', {
                    amount: summary.remainingFees,
                    method: selectedApp
                });

                if (data.success) {
                    // SUCCESS: alert hatane ke liye direct navigate
                    navigate('/student/fees', { replace: true });
                }
            } catch (err) {
                console.error("Neural Capture Error:", err);
                // Alert tabhi dikhao jab such mein koi dikat ho
                alert("Syncing with Bank... Please wait.");
                navigate('/student/fees', { replace: true });
            }
        };

        if (selectedApp && summary) {
            // Hum 8 second ka wait karenge (Parent PIN dal raha hai simulation)
            // 8 second baad khud-ba-khud backend call hogi aur entry ban jayegi
            captureTimer = setTimeout(() => {
                executePaymentCapture();
            }, 8000);
        }

        return () => clearTimeout(captureTimer);
    }, [selectedApp, summary, navigate]);

    const generateUPILink = () => {
        const upiId = schoolInfo?.upiId;
        const name = schoolInfo?.merchantName || "School Finance";
        const amount = summary?.remainingFees || 0;
        const note = `Fee: ${summary?.studentName} (${summary?.enrollmentNo})`;
        if (!upiId) return "";
        return `upi://pay?pa=${upiId}&pn=${encodeURIComponent(name)}&am=${amount}&cu=INR&tn=${encodeURIComponent(note)}`;
    };

    if (!summary) return <div className="p-20 text-center text-neon animate-pulse uppercase font-black">Connecting to Banking Node...</div>;

    const appIcons = {
        'PhonePe': <Zap size={20} className="text-purple-400" />,
        'Google Pay': <Smartphone size={20} className="text-blue-400" />,
        'Paytm': <ShieldCheck size={20} className="text-sky-500" />
    };

    return (
        <div className="min-h-screen bg-void text-white p-6 font-sans italic flex flex-col items-center justify-center">
            {!selectedApp ? (
                <div className="w-full max-w-md">
                    <h1 className="text-xl font-black uppercase text-center mb-10 tracking-widest border-b-2 border-neon/20 pb-4">Select Gateway</h1>
                    <div className="grid grid-cols-1 gap-5">
                        {['PhonePe', 'Google Pay', 'Paytm'].map(app => (
                            <button
                                key={app}
                                onClick={() => setSelectedApp(app)}
                                className="group p-6 bg-slate-900 border border-white/5 rounded-[2rem] flex justify-between items-center hover:border-neon hover:bg-neon/5 transition-all active:scale-95 shadow-xl"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-white/5 rounded-xl group-hover:bg-neon/10 transition-colors">
                                        {appIcons[app]}
                                    </div>
                                    <span className="font-black uppercase tracking-widest text-xs">{app}</span>
                                </div>
                                <div className="w-6 h-6 rounded-full border-2 border-white/10 group-hover:border-neon flex items-center justify-center transition-all">
                                    <div className="w-2 h-2 bg-neon rounded-full opacity-0 group-hover:opacity-100 transition-all"></div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="max-w-md w-full bg-slate-900/60 p-10 rounded-[3.5rem] border border-neon/20 text-center relative shadow-[0_0_100px_rgba(34,211,238,0.1)]">
                    <div className="absolute top-6 right-6 animate-spin text-neon/40"><Loader2 size={16} /></div>

                    <div className="mb-8">
                        <p className="text-[9px] font-black text-neon uppercase mb-2 tracking-[0.4em] animate-pulse">Neural Signal Sent</p>
                        <h2 className="text-xs font-black text-white/40 uppercase tracking-widest">Processing via {selectedApp}</h2>
                    </div>

                    <div className="bg-white p-7 rounded-[2.5rem] inline-block mb-10 border-4 border-neon shadow-[0_0_40px_rgba(34,211,238,0.2)]">
                        <QRCodeSVG value={generateUPILink()} size={200} />
                    </div>

                    <div className="space-y-3 mb-10">
                        <p className="text-4xl font-black text-white tracking-tighter">₹{summary.remainingFees.toLocaleString()}</p>
                        <div className="flex items-center justify-center gap-2 text-[8px] font-bold text-white/20 uppercase tracking-[0.2em]">
                            <ShieldCheck size={10} /> Automated Sync Active
                        </div>
                    </div>

                    <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center gap-3">
                        <CheckCircle2 size={16} className="text-emerald-500 animate-bounce" />
                        <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest italic text-center">
                            Scan Complete.<br />Finalizing Transaction...
                        </span>
                    </div>

                    <button onClick={() => setSelectedApp(null)} className="mt-8 text-[9px] font-black text-white/20 uppercase tracking-widest hover:text-white transition-all underline underline-offset-4">
                        Cancel Payment
                    </button>
                </div>
            )}
        </div>
    );
};

export default PaymentMethods;