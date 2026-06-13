import React, { useEffect, useState } from 'react';
import { ArrowLeft, Clock, ShieldCheck, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from "framer-motion";
import API from '../api';

const StudentLeaveHistory = () => {
    const [history, setHistory] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const { data } = await API.get('/leaves/my-history');
                setHistory(data);
            } catch (err) { console.error("History fetch failed"); }
        };
        fetchHistory();
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="min-h-screen bg-[#F8FAFC] pb-24 font-sans italic text-slate-800 text-[15px] overflow-x-hidden fixed inset-0 overflow-y-auto"
        >
            {/* Header */}
            <motion.div
                initial={{ y: -40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="bg-[#42A5F5] text-white px-6 pt-12 pb-24 rounded-b-[3.5rem] shadow-lg mb-8"
            >
                <div className="flex items-center gap-5">
                    <button onClick={() => navigate(-1)} className="p-3 bg-white/20 rounded-2xl border border-white/10 active:scale-90 transition-all">
                        <ArrowLeft size={24} />
                    </button>
                    <div>
                        <h1 className="text-4xl font-black italic tracking-tight capitalize">Leave History</h1>
                        <p className="text-[15px] font-bold text-white/80 tracking-widest mt-1">Track your applications</p>
                    </div>
                </div>
            </motion.div>

            <div className="px-8 -mt-16 space-y-6">
                <AnimatePresence>
                    {history.length > 0 ? history.map((req, index) => (
                        <motion.div
                            key={req._id}
                            initial={{ opacity: 0, y: 30, scale: 0.96 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{
                                duration: 0.35,
                                delay: index * 0.08
                            }}
                            whileTap={{ scale: 0.98 }}
                            whileHover={{ y: -3 }}
                            className="bg-white p-8 rounded-[2.5rem] border border-[#DDE3EA] shadow-sm flex justify-between items-center transition-all"
                        >
                            <div>
                                <p className="text-[19px] font-black italic">{req.reason}</p>
                                <p className="text-[14px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                                    {new Date(req.fromDate).toLocaleDateString()} • {req.status}
                                </p>
                            </div>
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.2 }}
                                className={`px-4 py-2 rounded-full font-black text-[11px] uppercase ${req.status === 'Approved' ? 'bg-emerald-50 text-emerald-600' :
                                    req.status === 'Rejected' ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-600'
                                    }`}>
                                {req.status}
                            </motion.div>

                        </motion.div>

                    )) : (

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                            className="text-center text-slate-700 font-bold mt-40  text-2xl"
                        >
                            No history found.
                        </motion.p>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
};

export default StudentLeaveHistory;