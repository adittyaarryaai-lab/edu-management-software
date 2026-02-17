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

    if (loading) return <div className="p-5 text-center text-[10px] font-black uppercase text-slate-400">Syncing Intelligence...</div>;

    return (
        <div className="mx-5 my-6 bg-white rounded-[2.5rem] p-6 shadow-xl shadow-blue-100/20 border border-slate-50 overflow-hidden relative group">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="bg-blue-600 text-white p-2.5 rounded-2xl shadow-lg shadow-blue-200">
                        <Megaphone size={18} />
                    </div>
                    <div>
                        <h2 className="font-black text-slate-800 uppercase text-xs tracking-tighter">Global Notices</h2>
                        <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Real-time Broadcast</p>
                    </div>
                </div>
                <div className="bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
                    <span className="text-[8px] font-black text-blue-500 uppercase">{notices.length} New</span>
                </div>
            </div>
            
            {/* Notices List */}
            <div className="space-y-4 max-h-72 overflow-y-auto pr-1 scrollbar-hide">
                {notices.length > 0 ? notices.map((notice) => (
                    <div key={notice._id} className="bg-slate-50/50 p-4 rounded-[1.5rem] border border-slate-100 hover:border-blue-200 transition-all cursor-default">
                        <div className="flex justify-between items-start mb-2">
                            <span className="bg-blue-100 text-blue-600 text-[7px] font-black px-2 py-0.5 rounded-md uppercase tracking-widest">
                                {notice.category || 'General'}
                            </span>
                        </div>
                        <h4 className="font-black text-slate-800 text-xs uppercase mb-1 leading-tight">{notice.title}</h4>
                        <p className="text-[10px] text-slate-500 font-medium leading-relaxed mb-3">{notice.content}</p>
                        
                        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                            <div className="flex items-center gap-1.5">
                                <User size={10} className="text-slate-400" />
                                <span className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">
                                    {notice.postedBy?.name || 'Admin'}
                                </span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Clock size={10} className="text-slate-400" />
                                <span className="text-[8px] font-bold text-slate-300">
                                    {new Date(notice.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    </div>
                )) : (
                    <div className="text-center py-10">
                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Neural Feed Empty</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NoticeBoard;