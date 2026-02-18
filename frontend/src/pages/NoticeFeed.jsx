import React, { useState, useEffect } from 'react';
import { ArrowLeft, Megaphone, Calendar, ExternalLink, Clock, ShieldCheck, User, Trash2, Edit3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import API from '../api'; 
import Loader from '../components/Loader';

const NoticeFeed = ({ user }) => {
    const navigate = useNavigate();
    const [notices, setNotices] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNotices = async () => {
            try {
                setLoading(true);
                const { data } = await API.get('/notices/my-notices');
                setNotices(data.notices);

                if (user?.role !== 'admin' && data.unreadCount > 0) {
                    await API.put('/notices/mark-all-read');
                }
            } catch (err) {
                console.error("Error fetching neural broadcasts:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchNotices();
    }, [user]);

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this broadcast?")) {
            try {
                await API.delete(`/notices/${id}`);
                setNotices(notices.filter(n => n._id !== id));
            } catch (err) {
                alert(err.response?.data?.message || "Delete failed!");
            }
        }
    };

    if (loading) return <Loader />;

    return (
        <div className="min-h-screen bg-[#f8fafc] pb-24 font-sans italic">
            <div className="nav-gradient text-white px-6 pt-12 pb-24 rounded-b-[3.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.2)] relative z-10">
                <div className="flex justify-between items-center mb-6">
                    <button onClick={() => navigate(-1)} className="bg-white/20 backdrop-blur-md p-2.5 rounded-2xl active:scale-90 transition-all border border-white/10">
                        <ArrowLeft size={20} />
                    </button>
                    <div className="flex flex-col items-center">
                        <h1 className="text-xl font-black uppercase tracking-[0.2em]">Broadcasts</h1>
                        <div className="h-1 w-12 bg-blue-400 rounded-full mt-1 shadow-[0_0_10px_rgba(96,165,250,1)]"></div>
                    </div>
                    <div className="bg-white/20 p-2.5 rounded-2xl border border-white/10">
                        <Megaphone size={20} className="animate-pulse text-blue-300"/>
                    </div>
                </div>
                <p className="text-[10px] opacity-80 font-black text-center uppercase tracking-[0.3em]">Neural Announcement Feed</p>
            </div>

            <div className="px-5 -mt-12 relative z-20 space-y-6">
                {notices.length > 0 ? notices.map((n, i) => {
                    // FIXED: Reliable check for ownership (handles object or string ID)
                    const postedById = typeof n.postedBy === 'object' ? n.postedBy?._id : n.postedBy;
                    const isOwner = user?.role === 'admin' || (postedById === user?._id);

                    return (
                        <div key={i} className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-white p-6 group hover:border-blue-200 transition-all duration-500">
                            <div className="flex justify-between items-center mb-4">
                                <div className="flex gap-2">
                                    <span className={`text-white text-[8px] font-black uppercase px-3 py-1 rounded-lg tracking-widest shadow-md ${
                                        n.authorRole === 'admin' ? 'bg-slate-900' : 'bg-blue-600'
                                    }`}>
                                        {n.authorRole || 'System'}
                                    </span>
                                    {n.audience === 'specific_grade' && (
                                        <span className="bg-orange-50 text-orange-600 border border-orange-100 text-[8px] font-black uppercase px-2 py-1 rounded-lg">
                                            Grade {n.targetGrade}
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center gap-1.5 text-slate-400">
                                    <Clock size={12} />
                                    <span className="text-[9px] font-black uppercase tracking-tighter">
                                        {new Date(n.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                                    </span>
                                </div>
                            </div>

                            <h3 className="font-black text-slate-800 text-base leading-tight mb-2 uppercase tracking-tighter italic group-hover:text-blue-600 transition-colors">
                                {n.title}
                            </h3>
                            <p className="text-[11px] text-slate-500 leading-relaxed font-medium opacity-80 italic">
                                {n.content}
                            </p>

                            <div className="mt-5 pt-4 border-t border-slate-50 flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center">
                                        <User size={12} className="text-slate-400" />
                                    </div>
                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                                        Posted by {n.postedBy?.name || n.authorRole}
                                    </span>
                                </div>

                                <div className="flex gap-2">
                                    {/* FIXED: Buttons now show up for Admin and the Teacher who posted */}
                                    {isOwner && (
                                        <>
                                            <button 
                                                onClick={() => navigate(`/edit-notice/${n._id}`)}
                                                className="p-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all border border-blue-100"
                                            >
                                                <Edit3 size={14} />
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(n._id)}
                                                className="p-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-500 hover:text-white transition-all border border-red-100"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                }) : (
                    <div className="text-center py-20 bg-white rounded-[3rem] border border-dashed border-slate-200 shadow-inner italic">
                        <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Megaphone className="text-slate-200" size={40} />
                        </div>
                        <p className="text-slate-300 font-black text-[10px] uppercase tracking-[0.3em]">No Neural Data Found</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NoticeFeed;