import React from 'react';
import { ArrowLeft, CreditCard, Home, Bus, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Fees = ({ user }) => {
    const navigate = useNavigate();

    const feeModules = [
        { title: 'All Fees (Incd.)', icon: <CreditCard size={32} />, color: 'text-blue-500', border: 'border-blue-500' },
        { title: 'Fees', icon: <Info size={32} />, color: 'text-orange-400', border: 'border-slate-100' },
        { title: 'Apply Hostel', icon: <Home size={32} />, color: 'text-red-400', border: 'border-slate-100' },
        { title: 'Transport', icon: <Bus size={32} />, color: 'text-yellow-500', border: 'border-slate-100' },
    ];

    return (
        <div className="min-h-screen bg-[#f8fafc]">
            {/* Header section with fixed height */}
            <div className="nav-gradient text-white px-6 pt-12 pb-24 rounded-b-[3rem] shadow-lg relative z-10">
                <div className="flex items-center gap-4 mb-4">
                    <button onClick={() => navigate(-1)} className="bg-white/20 p-2 rounded-xl active:scale-90 transition-all">
                        <ArrowLeft size={20} />
                    </button>
                    <h1 className="text-xl font-bold uppercase tracking-tight">Fees</h1>
                </div>
                <p className="text-sm opacity-90 font-medium ml-2">My Fees</p>
            </div>

            {/* Profile Card section - Adjusted margin to not hide info */}
            <div className="px-5 -mt-14 relative z-20">
                <div className="bg-white rounded-[2.5rem] p-6 shadow-xl shadow-blue-100/50 border border-white">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-16 h-16 bg-slate-100 border border-slate-200 rounded-full flex-shrink-0 flex items-center justify-center overflow-hidden">
                           <span className="text-xl font-bold text-slate-400">{user?.name?.charAt(0)}</span>
                        </div>
                        <div className="overflow-hidden">
                            <h2 className="text-xl font-extrabold text-slate-800 truncate">{user?.name || "Vipin Tanwar"}</h2>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 leading-none">Admission No</p>
                            <p className="text-[11px] font-bold text-blue-600 break-all">25KRMUCS001M21826330</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-y-4 border-t border-slate-50 pt-5">
                        <div className="pr-2">
                            <p className="text-[10px] font-bold text-slate-400 uppercase leading-none mb-1">Division</p>
                            <p className="text-[11px] font-bold text-slate-700">SectionB-FS</p>
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase leading-none mb-1">Roll No.</p>
                            <p className="text-[11px] font-bold text-slate-700">2501350071</p>
                        </div>
                        <div className="col-span-2">
                            <p className="text-[10px] font-bold text-slate-400 uppercase leading-none mb-1">Programme</p>
                            <p className="text-[11px] font-bold text-slate-700">B.TECH CSE (FULL STACK) [ FS001 ]</p>
                        </div>
                    </div>
                </div>

                {/* Fee Type Grid */}
                <div className="grid grid-cols-3 gap-3 mt-8 pb-10">
                    {feeModules.map((m, i) => (
                        <div key={i} className={`bg-white p-4 rounded-2xl flex flex-col items-center justify-center gap-2 border-2 ${m.border} shadow-sm active:scale-95 transition-all cursor-pointer`}>
                            <div className={`${m.color}`}>
                                {m.icon}
                            </div>
                            <span className="text-[9px] font-extrabold text-slate-700 text-center leading-tight uppercase">
                                {m.title}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Fees;