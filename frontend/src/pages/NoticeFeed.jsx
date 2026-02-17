import React, { useState, useEffect } from 'react';
import { ArrowLeft, Megaphone, Calendar, ExternalLink, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import API from '../api'; // Backend connection ke liye
import Loader from '../components/Loader';

const NoticeFeed = () => {
    const navigate = useNavigate();
    const [notices, setNotices] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNotices = async () => {
            try {
                const { data } = await API.get('/notices');
                setNotices(data);
            } catch (err) {
                console.error("Error fetching notices:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchNotices();
    }, []);

    if (loading) return <Loader />;

    return (
        <div className="min-h-screen bg-[#f8fafc] pb-24 font-sans italic">
            {/* Header Area */}
            <div className="nav-gradient text-white px-6 pt-12 pb-24 rounded-b-[3.5rem] shadow-lg relative z-10">
                <div className="flex justify-between items-center mb-6">
                    <button onClick={() => navigate(-1)} className="bg-white/20 p-2 rounded-xl active:scale-90 transition-all">
                        <ArrowLeft size={20} />
                    </button>
                    <h1 className="text-xl font-bold uppercase tracking-tight">Notice Board</h1>
                    <div className="bg-white/20 p-2 rounded-xl"><Megaphone size={20}/></div>
                </div>
                <p className="text-[11px] opacity-90 font-medium ml-2 uppercase tracking-widest">Quantum Announcement Feed</p>
            </div>

            {/* Notice List (Real Data - No Images) */}
            <div className="px-5 -mt-12 relative z-20 space-y-6">
                {notices.length > 0 ? notices.map((n, i) => (
                    <div key={i} className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-white p-6">
                        
                        <div className="flex justify-between items-center mb-3">
                            <span className={`${n.category === 'Exam' ? 'bg-red-500' : 'bg-blue-500'} text-white text-[8px] font-black uppercase px-2 py-0.5 rounded-full tracking-widest`}>
                                {n.category || 'General'}
                            </span>
                            <div className="flex items-center gap-1.5 text-slate-400">
                                <Calendar size={12} />
                                <span className="text-[10px] font-bold uppercase">
                                    {new Date(n.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                        </div>

                        <h3 className="font-black text-slate-800 text-base leading-tight mb-2 uppercase tracking-tighter">
                            {n.title}
                        </h3>
                        <p className="text-xs text-slate-500 leading-relaxed font-medium">
                            {n.content}
                        </p>

                        <div className="mt-4 pt-4 border-t border-slate-50 flex justify-between items-center">
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">
                                By: {n.postedBy?.name || 'Admin'}
                            </span>
                            
                            <div className="flex gap-2">
                                <button className="flex items-center gap-1.5 text-slate-600 font-bold text-[10px] uppercase bg-slate-50 px-3 py-1.5 rounded-xl active:scale-95 transition-all">
                                    <ExternalLink size={14} /> View Details
                                </button>
                            </div>
                        </div>
                    </div>
                )) : (
                    <div className="text-center py-20 bg-white rounded-[3rem] border border-dashed border-slate-200 shadow-inner">
                        <Megaphone className="mx-auto text-slate-100 mb-4" size={60} />
                        <p className="text-slate-300 font-black text-[10px] uppercase tracking-[0.2em]">No Active Notices</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NoticeFeed;