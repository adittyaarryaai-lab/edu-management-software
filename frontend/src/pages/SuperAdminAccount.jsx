import React, { useState } from 'react';
import { ArrowLeft, ShieldCheck, Key, Mail, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SuperAdminAccount = ({ user }) => {
    const navigate = useNavigate();
    const [editData, setEditData] = useState({ ...user });

    return (
        <div className="min-h-screen bg-[#f1f5f9] p-6 font-sans italic">
            <button onClick={() => navigate(-1)} className="bg-white p-3 rounded-2xl shadow-md mb-8"><ArrowLeft /></button>
            <h1 className="text-3xl font-black text-slate-900 mb-10 tracking-tighter italic uppercase">Master Control Profile</h1>

            <div className="bg-white rounded-[3.5rem] p-10 shadow-2xl border border-white space-y-8">
                <div className="flex items-center gap-6 pb-8 border-b border-slate-100">
                    <div className="w-24 h-24 bg-slate-900 text-white rounded-[2.5rem] flex items-center justify-center text-4xl font-black shadow-2xl">SA</div>
                    <div>
                        <h2 className="text-2xl font-black text-slate-800 italic uppercase tracking-tighter">{user?.name}</h2>
                        <span className="bg-blue-100 text-blue-600 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mt-2 inline-block">System Root</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase ml-2 italic">Access Email</label>
                        <div className="bg-slate-50 p-5 rounded-3xl border flex items-center gap-4">
                            <Mail className="text-slate-300" size={20}/>
                            <input type="text" value={editData.email} className="bg-transparent font-bold outline-none w-full" readOnly />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase ml-2 italic">Global Key (Password)</label>
                        <div className="bg-slate-50 p-5 rounded-3xl border flex items-center gap-4">
                            <Key className="text-slate-300" size={20}/>
                            <input type="password" value="********" className="bg-transparent font-bold outline-none w-full" readOnly />
                            <button className="text-blue-600 font-black text-[10px] uppercase">Rotate</button>
                        </div>
                    </div>
                </div>

                <button className="w-full bg-slate-900 text-white py-5 rounded-[2rem] font-black uppercase text-xs tracking-[0.4em] shadow-xl">
                    Synchronize Master Details
                </button>
            </div>
        </div>
    );
};

export default SuperAdminAccount;