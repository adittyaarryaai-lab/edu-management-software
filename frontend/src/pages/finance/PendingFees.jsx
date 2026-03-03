import React, { useState, useEffect } from 'react';
import { AlertTriangle, Phone, User, MessageSquare, Search } from 'lucide-react';
import API from '../../api';

const PendingFees = () => {
    const [defaulters, setDefaulters] = useState([]);
    const [search, setSearch] = useState('');

    useEffect(() => {
        const fetchDefaulters = async () => {
            const { data } = await API.get('/fees/defaulters/list');
            setDefaulters(data);
        };
        fetchDefaulters();
    }, []);

    return (
        <div className="min-h-screen bg-void text-white p-5 pb-24 italic">
            {/* Header Section */}
            <div className="flex items-center gap-3 mb-8 border-l-4 border-rose-500 pl-4">
                <AlertTriangle className="text-rose-500 animate-pulse" />
                <h1 className="text-xl font-black uppercase tracking-tighter">Defaulter Matrix</h1>
            </div>

            {/* Search Bar - Day 94 Fix (Ab header se bahar hai) */}
            <div className="bg-slate-900/60 p-5 rounded-3xl border border-white/5 flex items-center gap-4 mb-8 focus-within:border-rose-500/30 transition-all">
                <Search size={18} className="text-white/20" />
                <input
                    type="text"
                    placeholder="SEARCH DEFAULTER NAME..."
                    className="bg-transparent outline-none text-xs w-full uppercase font-black"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            {/* Defaulter List */}
            <div className="space-y-4">
                {defaulters
                    .filter(def => def.student.name.toLowerCase().includes(search.toLowerCase()))
                    .map((def, i) => (
                        <div key={i} className="bg-slate-900/60 p-6 rounded-[2.5rem] border border-rose-500/20 shadow-xl">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-sm font-black uppercase text-rose-500">{def.student.name}</h3>
                                    <p className="text-[8px] font-bold text-white/30 uppercase tracking-widest mt-1">
                                        {def.student.enrollmentNo} • SEC: {def.student.grade}
                                    </p>
                                </div>
                                <span className="bg-rose-500/10 text-rose-500 px-3 py-1 rounded-full text-[7px] font-black uppercase">Overdue</span>
                            </div>

                            <div className="flex justify-between items-center bg-void/50 p-4 rounded-2xl mb-4 border border-white/5">
                                <div>
                                    <p className="text-[7px] font-black text-white/20 uppercase italic">Pending Balance</p>
                                    <p className="text-lg font-black tracking-tighter text-white">₹{def.amountDue || def.amount}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[7px] font-black text-white/20 uppercase italic">Was Due On</p>
                                    <p className="text-[10px] font-black text-rose-400">{new Date(def.dueDate).toLocaleDateString()}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                <a href={`tel:${def.student.phone}`} className="flex items-center justify-center gap-2 bg-white/5 py-3 rounded-xl text-[8px] font-black uppercase hover:bg-neon hover:text-void transition-all">
                                    <Phone size={12} /> Call Parent
                                </a>
                                <button className="flex items-center justify-center gap-2 bg-white/5 py-3 rounded-xl text-[8px] font-black uppercase hover:bg-cyan-400 hover:text-void transition-all">
                                    <MessageSquare size={12} /> Send Alert
                                </button>
                            </div>
                        </div>
                    ))}
            </div>
        </div>
    );
};

export default PendingFees;