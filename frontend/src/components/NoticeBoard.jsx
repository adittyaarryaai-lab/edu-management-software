import React, { useState, useEffect } from 'react';
import { Megaphone, Clock, User } from 'lucide-react';
import API from '../api';

const NoticeBoard = () => {
    const [notices, setNotices] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNotices = async () => {
            try {
                const { data } = await API.get('/notices');
                setNotices(data);
            } catch (err) {
                console.error("Notices fetch karne mein error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchNotices();
    }, []);

    if (loading) return <div className="p-5 text-center text-[10px] font-black uppercase text-neon animate-pulse">Syncing Intelligence...</div>;

    return (
        <div className="mx-5 my-6 bg-void rounded-[2.5rem] p-6 shadow-2xl border border-neon/10 overflow-hidden relative group">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="bg-neon text-void p-2.5 rounded-2xl shadow-[0_0_15px_rgba(61,242,224,0.4)]">
                        <Megaphone size={18} />
                    </div>
                    <div>
                        <h2 className="font-black text-white uppercase text-xs tracking-tighter italic">Global Notices</h2>
                        <p className="text-[8px] font-bold text-neon/60 uppercase tracking-widest">Real-time Broadcast</p>
                    </div>
                </div>
                <div className="bg-neon/10 px-3 py-1 rounded-full border border-neon/20">
                    <span className="text-[8px] font-black text-neon uppercase">{notices.length} New</span>
                </div>
            </div>
            
            {/* Notices List */}
            <div className="space-y-4 max-h-72 overflow-y-auto pr-1 scrollbar-hide">
                {notices.length > 0 ? notices.map((notice) => (
                    <div key={notice._id} className="bg-white/5 p-4 rounded-[1.5rem] border border-white/5 hover:border-neon/30 transition-all cursor-default group/item">
                        <div className="flex justify-between items-start mb-2">
                            <span className="bg-neon/20 text-neon text-[7px] font-black px-2 py-0.5 rounded-md uppercase tracking-widest border border-neon/20">
                                {notice.category || 'General'}
                            </span>
                        </div>
                        <h4 className="font-black text-white/90 text-xs uppercase mb-1 leading-tight group-hover/item:text-neon transition-colors">{notice.title}</h4>
                        <p className="text-[10px] text-white/50 font-medium leading-relaxed mb-3">{notice.content}</p>
                        
                        <div className="flex items-center justify-between pt-2 border-t border-white/5">
                            <div className="flex items-center gap-1.5">
                                <User size={10} className="text-neon/40" />
                                <span className="text-[8px] font-black text-neon/60 uppercase tracking-tighter">
                                    {notice.postedBy?.name || 'Admin'}
                                </span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Clock size={10} className="text-neon/40" />
                                <span className="text-[8px] font-bold text-neon/40">
                                    {new Date(notice.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    </div>
                )) : (
                    <div className="text-center py-10">
                        <p className="text-[10px] font-black text-white/20 uppercase tracking-widest italic">Neural Feed Empty</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NoticeBoard;