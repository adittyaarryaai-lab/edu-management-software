import React, { useState, useEffect } from 'react';
import { ArrowLeft, Megaphone, Clock, User, Trash2, Edit3, ShieldAlert, X, Check, Save, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import Loader from '../components/Loader';
import { motion, AnimatePresence } from 'framer-motion';

const NoticeFeed = ({ user }) => {
    const navigate = useNavigate();
    const [notices, setNotices] = useState([]);
    const [loading, setLoading] = useState(true);

    // --- MODAL STATES ---
    const [editModal, setEditModal] = useState({ isOpen: false, data: null });
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null });
    const [isUpdating, setIsUpdating] = useState(false);

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

    // --- LOGIC: DELETE ---
    const confirmDelete = async () => {
        try {
            await API.delete(`/notices/${deleteModal.id}`);
            setNotices(notices.filter(n => n._id !== deleteModal.id));
            setDeleteModal({ isOpen: false, id: null });
        } catch (err) {
            alert("Delete failed!");
        }
    };

    // --- LOGIC: UPDATE ---
    const handleUpdate = async (e) => {
        e.preventDefault();
        setIsUpdating(true);
        try {
            const { data } = await API.put(`/notices/${editModal.data._id}`, {
                title: editModal.data.title,
                content: editModal.data.content
            });
            setNotices(notices.map(n => n._id === data._id ? data : n));
            setEditModal({ isOpen: false, data: null });
        } catch (err) {
            alert("Update failed!");
        } finally {
            setIsUpdating(false);
        }
    };

    if (loading) return <Loader />;

    return (
        <div className="min-h-screen bg-void pb-24 font-sans italic text-white">
            {/* Header Section */}
            <div className="bg-void text-white px-6 pt-12 pb-24 rounded-b-[3.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.6)] border-b border-neon/20 relative z-10 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-neon/10 to-transparent pointer-events-none"></div>
                <div className="flex justify-between items-center mb-6 relative z-10">
                    <button onClick={() => navigate(-1)} className="bg-white/5 backdrop-blur-md p-2.5 rounded-2xl active:scale-90 border border-white/10 text-neon"><ArrowLeft size={20} /></button>
                    <div className="flex flex-col items-center">
                        <h1 className="text-xl font-black uppercase tracking-[0.3em] italic"> All Notices</h1>
                        <div className="h-0.5 w-16 bg-neon mt-1 shadow-[0_0_15px_rgba(61,242,224,1)]"></div>
                    </div>
                    <div className="bg-neon/10 p-2.5 rounded-2xl border border-neon/30 text-neon"><Megaphone size={20} className="animate-pulse" /></div>
                </div>
                {user?.role === 'admin' && (
                    <p className="text-[7px] text-emerald-400 font-black text-center uppercase tracking-[0.4em] mt-2 animate-pulse">
                        <ShieldAlert size={8} className="inline mr-1 mb-0.5" /> Admin Control 
                    </p>
                )}
            </div>

            <div className="px-5 -mt-12 relative z-20 space-y-6">
                {notices.length > 0 ? notices.map((n, i) => {
                    const postedById = n.postedBy?._id || n.postedBy;
                    const currentUserId = user?._id || user?.id;
                    const isMasterAdmin = user?.role?.toLowerCase() === 'admin';
                    const isOwner = postedById?.toString() === currentUserId?.toString();
                    const hasControl = isMasterAdmin || isOwner;

                    // --- TARGET LABEL LOGIC (FIXED) ---
                    let targetLabel = "";
                    if (n.audience === 'all') {
                        targetLabel = "ALL TEACHERS AND STUDENTS";
                    } else if (n.audience === 'teachers') {
                        targetLabel = "ALL TEACHERS";
                    } else if (n.audience === 'specific_grade') {
                        // Check karo agar array hai (multi-selection) ya string (single)
                        if (Array.isArray(n.targetGrade)) {
                            targetLabel = n.targetGrade.length > 1 ? `MULTI: ${n.targetGrade.join(', ')}` : `SEC: ${n.targetGrade[0]}`;
                        } else {
                            targetLabel = `SEC: ${n.targetGrade || 'N/A'}`;
                        }
                    }

                    return (
                        <div key={i} className={`bg-slate-900/60 backdrop-blur-xl rounded-[2.5rem] shadow-2xl border p-6 group transition-all duration-500 ${isMasterAdmin ? 'border-emerald-500/20' : 'border-white/5 hover:border-neon/30'}`}>
                            <div className="flex justify-between items-center mb-4">
                                <div className="flex gap-2">
                                    <span className="text-void text-[8px] font-black uppercase px-3 py-1 rounded-lg tracking-widest bg-neon shadow-[0_0_10px_rgba(61,242,224,0.3)]">{n.authorRole || 'Root'}</span>
                                    <span className="bg-void text-neon border border-neon/20 text-[8px] font-black uppercase px-2 py-1 rounded-lg">Send To: {targetLabel}</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-neon/30">
                                    <Clock size={12} />
                                    <span className="text-[9px] font-black uppercase tracking-tighter italic">{new Date(n.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}</span>
                                </div>
                            </div>
                            <h3 className="font-black text-white text-base leading-tight mb-2 uppercase tracking-tight italic group-hover:text-neon transition-colors">{n.title}</h3>
                            <p className="text-[11px] text-white/50 font-medium leading-relaxed italic opacity-80">{n.content}</p>

                            <div className="mt-5 pt-4 border-t border-white/5 flex justify-between items-center">
                                <span className="text-[9px] font-black text-white/30 uppercase italic">Teacher Name: {n.postedBy?.name || n.authorRole}</span>
                                <div className="flex gap-2">
                                    {hasControl && (
                                        <>
                                            <button onClick={() => setEditModal({ isOpen: true, data: n })} className="p-2 bg-neon/10 text-neon rounded-xl border border-neon/20"><Edit3 size={14} /></button>
                                            <button onClick={() => setDeleteModal({ isOpen: true, id: n._id })} className="p-2 bg-red-600/10 text-red-500 rounded-xl border border-red-500/20"><Trash2 size={14} /></button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                }) : <div className="text-center py-20 text-white/20 uppercase font-black text-[10px] tracking-widest">No Notices Available 📢</div>}
            </div>

            {/* --- EDIT MODAL (CENTERED & BLURRED) --- */}
            <AnimatePresence>
                {editModal.isOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setEditModal({ isOpen: false, data: null })} className="absolute inset-0 bg-void/90 backdrop-blur-xl" />
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative w-full max-w-md bg-slate-900 border border-neon/30 p-8 rounded-[3rem] shadow-[0_0_50px_rgba(61,242,224,0.1)]">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="bg-neon/10 p-2 rounded-xl border border-neon/30 text-neon"><Edit3 size={20} /></div>
                                <h3 className="text-xl font-black uppercase italic tracking-tighter">Edit Notice</h3>
                                <p className="text-[9px] text-neon/40 uppercase font-black tracking-widest mb-4 italic">Modifying: {editModal.data.targetGrade}</p>
                            </div>
                            <form onSubmit={handleUpdate} className="space-y-4">
                                <input
                                    className="w-full bg-void p-4 rounded-2xl border border-white/5 text-white font-black italic outline-none focus:border-neon transition-all"
                                    value={editModal.data.title}
                                    onChange={(e) => setEditModal({ ...editModal, data: { ...editModal.data, title: e.target.value } })}
                                    placeholder="TITLE"
                                />
                                <textarea
                                    rows="5"
                                    className="w-full bg-void p-4 rounded-2xl border border-white/5 text-white font-bold italic outline-none focus:border-neon transition-all"
                                    value={editModal.data.content}
                                    onChange={(e) => setEditModal({ ...editModal, data: { ...editModal.data, content: e.target.value } })}
                                    placeholder="MESSAGE CONTENT"
                                />
                                <div className="grid grid-cols-2 gap-4 pt-4">
                                    <button type="button" onClick={() => setEditModal({ isOpen: false, data: null })} className="py-4 bg-white/5 rounded-2xl font-black uppercase text-[10px] text-white/40">Cancel</button>
                                    <button disabled={isUpdating} className="py-4 bg-neon text-void rounded-2xl font-black uppercase text-[10px] shadow-[0_10px_20px_rgba(61,242,224,0.3)]">{isUpdating ? 'Syncing...' : 'Update Notice'}</button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* --- DELETE CONFIRM MODAL --- */}
            <AnimatePresence>
                {deleteModal.isOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDeleteModal({ isOpen: false, id: null })} className="absolute inset-0 bg-void/90 backdrop-blur-xl" />
                        <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="relative w-full max-w-sm bg-slate-900 border border-red-500/30 p-10 rounded-[3rem] text-center shadow-[0_0_50px_rgba(239,68,68,0.2)]">
                            <div className="bg-red-500/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-500/20">
                                <AlertTriangle size={40} className="text-red-500 animate-pulse" />
                            </div>
                            <h3 className="text-xl font-black uppercase italic text-white tracking-tighter">End Notice?</h3>
                            <p className="text-[10px] text-white/40 uppercase font-black tracking-widest mt-2 leading-relaxed">This action will permanently delete this notice.</p>
                            <div className="grid grid-cols-2 gap-4 mt-10">
                                <button onClick={() => setDeleteModal({ isOpen: false, id: null })} className="py-4 bg-white/5 rounded-2xl font-black uppercase text-[10px] text-white/60">NO</button>
                                <button onClick={confirmDelete} className="py-4 bg-red-500 text-white rounded-2xl font-black uppercase text-[10px] shadow-[0_10px_20px_rgba(239,68,68,0.3)] border-b-4 border-red-800 active:border-b-0 transition-all">YES</button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default NoticeFeed;