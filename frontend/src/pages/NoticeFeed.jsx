import React, { useState, useEffect } from 'react';
import { ArrowLeft, Megaphone, Clock, User, Trash2, Edit3, Cpu } from 'lucide-react';
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
        if (window.confirm("Confirm Broadcast Deletion?")) {
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
        <div className="min-h-screen bg-void pb-24 font-sans italic">
            <div className="bg-void text-white px-6 pt-12 pb-24 rounded-b-[3.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.6)] border-b border-neon/20 relative z-10 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-neon/10 to-transparent pointer-events-none"></div>
                <div className="flex justify-between items-center mb-6 relative z-10">
                    <button onClick={() => navigate(-1)} className="bg-white/5 backdrop-blur-md p-2.5 rounded-2xl active:scale-90 transition-all border border-white/10 text-neon">
                        <ArrowLeft size={20} />
                    </button>
                    <div className="flex flex-col items-center">
                        <h1 className="text-xl font-black uppercase tracking-[0.3em] italic">Broadcasts</h1>
                        <div className="h-0.5 w-16 bg-neon mt-1 shadow-[0_0_15px_rgba(61,242,224,1)]"></div>
                    </div>
                    <div className="bg-neon/10 p-2.5 rounded-2xl border border-neon/30 text-neon">
                        <Megaphone size={20} className="animate-pulse"/>
                    </div>
                </div>
                <p className="text-[9px] text-neon/40 font-black text-center uppercase tracking-[0.4em] italic mt-2">Active Neural Announcement Feed</p>
            </div>

            <div className="px-5 -mt-12 relative z-20 space-y-6">
                {notices.length > 0 ? notices.map((n, i) => {
                    const postedById = typeof n.postedBy === 'object' ? n.postedBy?._id : n.postedBy;
                    const isOwner = user?.role === 'admin' || (postedById === user?._id);

                    return (
                        <div key={i} className="bg-slate-900/60 backdrop-blur-xl rounded-[2.5rem] shadow-2xl border border-white/5 p-6 group hover:border-neon/30 transition-all duration-500">
                            <div className="flex justify-between items-center mb-4">
                                <div className="flex gap-2">
                                    <span className={`text-void text-[8px] font-black uppercase px-3 py-1 rounded-lg tracking-widest shadow-[0_0_10px_rgba(61,242,224,0.3)] ${
                                        n.authorRole === 'admin' ? 'bg-neon' : 'bg-neon/80'
                                    }`}>
                                        {n.authorRole || 'Root'}
                                    </span>
                                    {n.audience === 'specific_grade' && (
                                        <span className="bg-void text-neon border border-neon/20 text-[8px] font-black uppercase px-2 py-1 rounded-lg">
                                            Sector {n.targetGrade}
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center gap-1.5 text-neon/30">
                                    <Clock size={12} />
                                    <span className="text-[9px] font-black uppercase tracking-tighter italic">
                                        {new Date(n.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                                    </span>
                                </div>
                            </div>

                            <h3 className="font-black text-white text-base leading-tight mb-2 uppercase tracking-tight italic group-hover:text-neon transition-colors">
                                {n.title}
                            </h3>
                            <p className="text-[11px] text-white/50 font-medium leading-relaxed italic opacity-80">
                                {n.content}
                            </p>

                            <div className="mt-5 pt-4 border-t border-white/5 flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 bg-void border border-white/10 rounded-full flex items-center justify-center">
                                        <User size={12} className="text-neon/40" />
                                    </div>
                                    <span className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em] italic">
                                        Node: {n.postedBy?.name || n.authorRole}
                                    </span>
                                </div>

                                <div className="flex gap-2">
                                    {isOwner && (
                                        <>
                                            <button 
                                                onClick={() => navigate(`/edit-notice/${n._id}`)}
                                                className="p-2 bg-neon/10 text-neon rounded-xl hover:bg-neon hover:text-void transition-all border border-neon/20 shadow-inner"
                                            >
                                                <Edit3 size={14} />
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(n._id)}
                                                className="p-2 bg-red-600/10 text-red-500 rounded-xl hover:bg-red-600 hover:text-white transition-all border border-red-500/20"
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
                    <div className="text-center py-20 bg-void rounded-[3rem] border border-dashed border-white/5 shadow-inner">
                        <div className="bg-neon/5 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/5">
                            <Megaphone className="text-neon/10" size={40} />
                        </div>
                        <p className="text-white/20 font-black text-[10px] uppercase tracking-[0.4em] italic">No Broadcast Signals Found</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NoticeFeed;