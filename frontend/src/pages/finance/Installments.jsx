import React, { useState, useEffect } from 'react';
import { Calendar, AlertCircle, CheckCircle, Clock, Search } from 'lucide-react';
import API from '../../api';

const Installments = () => {
    const [installments, setInstallments] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchInstallments = async () => {
            setLoading(true);
            try {
                // Route check: /users/finance/installments/list
                // Make sure your proxy or BASE_URL is correct in api.js
                const { data } = await API.get('/fees/installments/list');
                setInstallments(data);
            } catch (err) {
                console.error("Installments Fetch Error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchInstallments();
    }, []);

    return (
        <div className="min-h-screen bg-void text-white font-sans italic pb-24 pt-10 px-5">
            <h1 className="text-xl font-black uppercase tracking-widest text-neon mb-6 border-l-4 border-neon pl-4">Installment Tracker</h1>

            {/* Search Bar */}
            <div className="bg-slate-900/60 p-4 rounded-2xl border border-white/5 flex items-center gap-3 mb-8">
                <Search size={18} className="text-white/20" />
                <input
                    type="text"
                    placeholder="SEARCH STUDENT..."
                    className="bg-transparent outline-none text-xs w-full uppercase font-black"
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Installment Cards */}
            <div className="space-y-4">
                {installments.length > 0 ? installments
                    .filter(ins => ins.studentName.toLowerCase().includes(searchTerm.toLowerCase())) // Search filter add kiya
                    .map((ins, i) => (
                        <div key={i} className="bg-slate-900/40 p-6 rounded-[2.5rem] border border-white/5 flex justify-between items-center group">
                            <div className="flex items-center gap-4">
                                <div className={`p-3 rounded-2xl ${ins.status === 'Paid' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                                    {ins.status === 'Paid' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                                </div>
                                <div>
                                    <h3 className="text-xs font-black uppercase">{ins.studentName}</h3>
                                    <p className="text-[8px] font-bold text-white/30 uppercase mt-1">Due: {new Date(ins.dueDate).toLocaleDateString()} • {ins.type}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                {ins.penalty > 0 && (
                                    <div className="mb-1">
                                        <p className="text-[6px] font-black text-rose-500 uppercase tracking-tighter animate-pulse">
                                            {ins.daysLate} DAYS OVERDUE
                                        </p>
                                        <p className="text-[8px] font-black text-rose-500 uppercase">
                                            + ₹{ins.penalty} FINE
                                        </p>
                                    </div>
                                )}

                                <p className="text-sm font-black text-white">
                                    ₹{ins.totalWithPenalty}
                                </p>

                                <span className={`text-[7px] font-black uppercase tracking-widest ${ins.status === 'Paid' ? 'text-emerald-500' : 'text-rose-500'}`}>
                                    {ins.status}
                                </span>
                            </div>
                        </div>
                    )) : (
                    <div className="py-20 text-center opacity-10 flex flex-col items-center">
                        <Clock size={40} className="mb-2" />
                        <p className="text-[8px] font-black uppercase tracking-widest">No Installment Schedules Found</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Installments;