import React, { useState } from 'react';
import { ArrowLeft, Calendar, Search, Eye, User, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Notifications = () => {
    const navigate = useNavigate();
    const [fromDate, setFromDate] = useState('14/01/2026');
    const [toDate, setToDate] = useState('13/02/2026');

    const notificationList = [
        {
            from: "SHANAWAZ ALAM (9310)",
            to: "Vipin Tanwar (25KRMUCS001M21826330)",
            title: "Sitting Plan for 14-Feb-2026 Makeup exam",
            date: "13/02/2026",
            medium: "ERP Notification",
            status: "Sent"
        },
        {
            from: "SHANAWAZ ALAM (9310)",
            to: "Vipin Tanwar (25KRMUCS001M21826330)",
            title: "Official Notification - Release of Makeup Examination Date Sheet 2026",
            date: "12/02/2026",
            medium: "ERP Notification",
            status: "Sent"
        }
    ];

    return (
        <div className="min-h-screen bg-[#f8fafc] pb-24">
            {/* Blue Header Section */}
            <div className="nav-gradient text-white px-6 pt-12 pb-24 rounded-b-[3rem] shadow-lg relative z-10">
                <div className="flex items-center gap-4 mb-4">
                    <button onClick={() => navigate(-1)} className="bg-white/20 p-2 rounded-xl active:scale-90 transition-all">
                        <ArrowLeft size={20} />
                    </button>
                    <h1 className="text-xl font-bold uppercase tracking-tight">Central Notification</h1>
                </div>
                <p className="text-[11px] opacity-90 font-medium ml-2 leading-relaxed max-w-[280px]">
                    To obtain the Notification list, please choose the date range.
                </p>
            </div>

            {/* Date Selection Card */}
            <div className="px-5 -mt-14 relative z-20">
                <div className="bg-white rounded-[2.5rem] p-6 shadow-xl shadow-blue-100/50 border border-white space-y-4">
                    <div className="space-y-1">
                        <div className="relative">
                            <input 
                                type="text" value={fromDate} readOnly
                                className="w-full bg-slate-50 border border-slate-100 py-3.5 px-4 rounded-2xl text-sm font-bold text-slate-700 outline-none"
                            />
                            <Calendar className="absolute right-4 top-3.5 text-slate-400" size={18} />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <div className="relative">
                            <input 
                                type="text" value={toDate} readOnly
                                className="w-full bg-slate-50 border border-slate-100 py-3.5 px-4 rounded-2xl text-sm font-bold text-slate-700 outline-none"
                            />
                            <Calendar className="absolute right-4 top-3.5 text-slate-400" size={18} />
                        </div>
                    </div>
                    <button className="w-full bg-blue-500 text-white py-3.5 rounded-full font-bold shadow-lg shadow-blue-200 active:scale-95 transition-all flex items-center justify-center gap-2">
                        <Search size={18} /> Search
                    </button>
                </div>

                {/* List Section */}
                <h3 className="text-sm font-bold text-slate-800 mt-8 mb-4 ml-2">Notification List</h3>
                
                <div className="space-y-4">
                    {notificationList.map((n, i) => (
                        <div key={i} className="bg-white rounded-[2rem] p-6 shadow-md border border-slate-50">
                            <div className="grid grid-cols-2 gap-y-4 text-[10px]">
                                <div>
                                    <p className="font-bold text-slate-400 uppercase mb-1">Communication From</p>
                                    <p className="font-extrabold text-slate-800">{n.from}</p>
                                </div>
                                <div>
                                    <p className="font-bold text-slate-400 uppercase mb-1">Communication Sent To</p>
                                    <p className="font-extrabold text-slate-800 break-words">{n.to}</p>
                                </div>
                                <div className="col-span-2 py-2 border-y border-slate-50">
                                    <p className="font-bold text-slate-400 uppercase mb-1">Communication Title</p>
                                    <p className="font-extrabold text-blue-600 text-[11px] leading-tight">{n.title}</p>
                                </div>
                                <div>
                                    <p className="font-bold text-slate-400 uppercase mb-1">Communication Medium</p>
                                    <p className="font-extrabold text-slate-800">{n.medium}</p>
                                </div>
                                <div>
                                    <p className="font-bold text-slate-400 uppercase mb-1">Communication Date</p>
                                    <p className="font-extrabold text-slate-800">{n.date}</p>
                                </div>
                                <div>
                                    <p className="font-bold text-slate-400 uppercase mb-1">View Communication</p>
                                    <button className="bg-blue-500 text-white px-4 py-1.5 rounded-lg flex items-center gap-1.5 active:scale-90 transition-all mt-1">
                                        <Eye size={14} /> <span className="font-bold text-[9px]">View</span>
                                    </button>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-slate-400 uppercase mb-1">Status</p>
                                    <p className="font-extrabold text-green-500 flex items-center justify-end gap-1">
                                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span> {n.status}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Notifications;