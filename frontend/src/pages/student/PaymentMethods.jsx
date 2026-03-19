import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { useNavigate } from 'react-router-dom';
import API from '../../api';

const PaymentMethods = () => {
    const [summary, setSummary] = useState(null);
    const [schoolInfo, setSchoolInfo] = useState(null);
    const [selectedApp, setSelectedApp] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
    const loadData = async () => {
        try {
            const { data } = await API.get('/fees/student-summary');
            setSummary(data);
            // FIX: schoolSettings ko badal kar paymentSettings kiya
            setSchoolInfo(data.paymentSettings); 
        } catch (err) {
            console.error("Payment Data Load Error", err);
        }
    };
    loadData();
}, []);

    // --- DAY 110: DYNAMIC UPI STRING GENERATION ---
    // Ye string hi magic hai, isse scan karte hi amount bhar jata hai
    const generateUPILink = () => {
    // Agar schoolInfo load nahi hua toh blank string bhejenge taaki user scan na kar paye galat ID
    const upiId = schoolInfo?.upiId; 
    const name = schoolInfo?.merchantName || "School Finance";
    const amount = summary?.remainingFees || 0;
    const note = `Fee: ${summary?.studentName || 'Student'} (${summary?.enrollmentNo || 'NA'})`;

    if(!upiId) return ""; // Jab tak ID na mile QR generate mat karo

    return `upi://pay?pa=${upiId}&pn=${encodeURIComponent(name)}&am=${amount}&cu=INR&tn=${encodeURIComponent(note)}`;
};

    const handleSuccessSimulation = async () => {
        // Asli payment gateway mein webhook aata hai, abhi hum button se simulate karenge
        alert("Simulating Payment Success... Updating Ledger");
        // Yahan se backend ko data jayega payment record create karne ke liye
        navigate('/student/fees');
    };

    if (!summary) return <div className="p-20 text-center text-neon">INITIALIZING GATEWAY...</div>;

    return (
        <div className="min-h-screen bg-void text-white p-6 font-sans italic">
            <h1 className="text-xl font-black uppercase text-center mb-10 tracking-widest">Select Payment App</h1>

            {!selectedApp ? (
                <div className="grid grid-cols-1 gap-4 max-w-md mx-auto">
                    {['PhonePe', 'Google Pay', 'Paytm', 'Any UPI App'].map(app => (
                        <button 
                            key={app}
                            onClick={() => setSelectedApp(app)}
                            className="p-6 bg-slate-900 border border-white/5 rounded-3xl flex justify-between items-center hover:border-neon transition-all"
                        >
                            <span className="font-black uppercase tracking-widest">{app}</span>
                            <div className="w-8 h-8 rounded-full bg-neon/10 border border-neon/20"></div>
                        </button>
                    ))}
                </div>
            ) : (
                <div className="max-w-md mx-auto bg-slate-900/60 p-10 rounded-[3rem] border border-neon/20 text-center animate-in zoom-in-95 duration-300">
                    <p className="text-[10px] font-black text-neon uppercase mb-6 tracking-[0.4em]">Scan to Pay via {selectedApp}</p>
                    
                    <div className="bg-white p-6 rounded-3xl inline-block mb-8 border-4 border-neon shadow-[0_0_30px_rgba(34,211,238,0.2)]">
                        <QRCodeSVG value={generateUPILink()} size={200} />
                    </div>

                    <div className="mb-8">
                        <p className="text-2xl font-black text-white">₹{summary.remainingFees.toLocaleString()}</p>
                        <p className="text-[8px] font-bold text-white/30 uppercase mt-2">Automatic Amount Detection Enabled</p>
                    </div>

                    <button 
                        onClick={handleSuccessSimulation}
                        className="w-full py-4 bg-emerald-500 text-black rounded-2xl font-black uppercase tracking-widest text-[10px]"
                    >
                        I've Completed Payment
                    </button>
                    <button onClick={() => setSelectedApp(null)} className="mt-4 text-[8px] opacity-40 uppercase">Change App</button>
                </div>
            )}
        </div>
    );
};

export default PaymentMethods;