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
        <div className="min-h-screen bg-[#F8FAFC] pb-24 font-sans italic text-slate-800 text-[15px] overflow-x-hidden overscroll-none fixed inset-0 overflow-y-auto">
            {/* Header Section */}
            <div className="bg-[#42A5F5] text-white px-6 pt-12 pb-24 rounded-b-[3.5rem] shadow-lg relative z-10 overflow-hidden">
                <div className="flex justify-between items-center mb-6 relative z-10">
                    <button onClick={() => navigate(-1)} className="bg-white/20 p-2.5 rounded-2xl active:scale-90 border border-white/10 text-white">
                        <ArrowLeft size={24} />
                    </button>
                    <div className="flex flex-col items-center">
                        <h1 className="text-4xl font-black italic tracking-tight capitalize">Notice board</h1>
                        <p className="text-[15px] font-bold text-white/80 tracking-widest mt-1 capitalize">Announcements</p>
                    </div>
                    <div className="bg-white/20 p-2.5 rounded-2xl border border-white/10 text-white">
                        <Megaphone size={24} className="animate-pulse" />
                    </div>
                </div>
                {user?.role === 'admin' && (
                    <p className="text-[15px] text-white font-black text-center uppercase tracking-[0.2em] mt-2 opacity-90">
                        <ShieldAlert size={12} className="inline mr-2 mb-0.5" /> Admin control
                    </p>
                )}
            </div>

            <div className="px-8 -mt-12 relative z-20 space-y-6">
                {notices.length > 0 ? notices.map((n, i) => {
                    const postedById = n.postedBy?._id || n.postedBy;
                    const currentUserId = user?._id || user?.id;
                    const isMasterAdmin = user?.role?.toLowerCase() === 'admin';
                    const isOwner = postedById?.toString() === currentUserId?.toString();
                    const hasControl = isMasterAdmin || isOwner;

                    // --- TARGET LABEL LOGIC (FIXED) ---
                    <br />
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
                        <div key={i} className={`bg-white rounded-[2.5rem] shadow-md border p-6 group transition-all duration-300 ${isMasterAdmin ? 'border-blue-100 shadow-blue-100/50' : 'border-[#DDE3EA]'}`}>
                            <div className="flex justify-between items-center mb-4">
                                <div className="flex flex-wrap gap-2">
                                    <div className="flex flex-col items-start gap-2">
                                        <span className="inline-block text-white text-[15px] font-black uppercase px-3 py-1 rounded-lg tracking-wider bg-[#42A5F5] shadow-sm">
                                            {n.authorRole || 'Root'}
                                        </span>

                                        <span className="inline-block bg-blue-50 text-[#42A5F5] border border-blue-100 text-[12px] font-black uppercase px-2 py-1 rounded-lg">
                                            To: {targetLabel}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1.5 text-black-300">
                                    <Clock size={14} />
                                    <span className="text-[13px] font-black italic">
                                        {new Date(n.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                                    </span>
                                </div>
                            </div>
                            <h3 className="font-black text-slate-800 text-[25px] leading-tight mb-2 capitalize italic group-hover:text-[#42A5F5] transition-colors">
                                {n.title.toLowerCase()}
                            </h3>
                            <p className="text-[20px] text-slate-500 font-medium leading-relaxed italic opacity-90 whitespace-pre-wrap">
                                {n.content}
                            </p>
                            <div className="mt-5 pt-4 border-t border-slate-50 flex justify-between items-center">
                                <span className="text-[18px] font-bold text-slate-400 italic capitalize">
                                     By: {n.postedBy?.name?.toLowerCase() || n.authorRole?.toLowerCase()}
                                </span>
                                <div className="flex gap-2">
                                    {hasControl && (
                                        <>
                                            <button onClick={() => setEditModal({ isOpen: true, data: n })} className="p-2 bg-blue-50 text-[#42A5F5] rounded-xl border border-blue-100 active:scale-90 transition-all">
                                                <Edit3 size={16} />
                                            </button>
                                            <button onClick={() => setDeleteModal({ isOpen: true, id: n._id })} className="p-2 bg-rose-50 text-rose-500 rounded-xl border border-rose-100 active:scale-90 transition-all">
                                                <Trash2 size={16} />
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                }) : (
                    <div className="text-center py-24 bg-white rounded-[3rem] border border-dashed border-[#DDE3EA] mx-1">
                        <Megaphone className="mx-auto text-slate-200 mb-4" size={56} />
                        <p className="text-slate-400 font-bold text-[16px] italic text-center capitalize">No notices available found 📢</p>
                    </div>
                )}
            </div>

            {/* --- EDIT MODAL (CENTERED & BLURRED) --- */}
            <AnimatePresence>
                {editModal.isOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setEditModal({ isOpen: false, data: null })} className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" />
                        <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="relative w-full max-w-md bg-white border border-[#DDE3EA] p-8 rounded-[3.5rem] shadow-2xl">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="bg-blue-50 p-2.5 rounded-2xl text-[#42A5F5]"><Edit3 size={24} /></div>
                                <h3 className="text-[20px] font-black italic tracking-tight text-slate-800 capitalize">Edit notice</h3>
                            </div>
                            <form onSubmit={handleUpdate} className="space-y-4">
                                <div className="space-y-1">
                                    <label className="text-[15px] font-black text-slate-400 uppercase tracking-widest ml-4 italic">Notice title</label>
                                    <input
                                        className="text-[19px] w-full bg-slate-50 p-7 rounded-3xl border border-slate-100 text-slate-700 font-bold italic outline-none focus:border-[#42A5F5] transition-all"
                                        value={editModal.data.title}
                                        onChange={(e) => setEditModal({ ...editModal, data: { ...editModal.data, title: e.target.value } })}
                                        placeholder="Enter title"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[15px] font-black text-slate-400 uppercase tracking-widest ml-4 italic">Message content</label>
                                    <textarea
                                        rows="5"
                                        className=" text-[19px] w-full bg-slate-50 p-7 rounded-3xl border border-slate-100 text-slate-600 font-medium italic outline-none focus:border-[#42A5F5] transition-all"
                                        value={editModal.data.content}
                                        onChange={(e) => setEditModal({ ...editModal, data: { ...editModal.data, content: e.target.value } })}
                                        placeholder="Enter content"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4 pt-4">
                                    <button type="button" onClick={() => setEditModal({ isOpen: false, data: null })} className="py-4 bg-slate-100 rounded-2xl font-black text-[18px] text-slate-400 capitalize">Cancel</button>
                                    <button disabled={isUpdating} className="py-4 bg-[#42A5F5] text-white rounded-2xl font-black text-[18px] shadow-lg shadow-blue-200 capitalize">
                                        {isUpdating ? 'Syncing...' : 'Update notice'}
                                    </button>
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
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDeleteModal({ isOpen: false, id: null })} className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" />
                        <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="relative w-full max-w-sm bg-white border border-rose-100 p-10 rounded-[3.5rem] text-center shadow-2xl">
                            <div className="bg-rose-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 border border-rose-100 shadow-inner">
                                <AlertTriangle size={48} className="text-rose-500 animate-pulse" />
                            </div>
                            <h3 className="text-4xl font-black italic text-slate-800 tracking-tight capitalize">Delete Notice?</h3>
                            <p className="text-[16px] text-slate-400 font-bold mt-2 leading-relaxed italic">This action will permanently delete this notice.</p>
                            <div className="grid grid-cols-2 gap-4 mt-10">
                                <button onClick={() => setDeleteModal({ isOpen: false, id: null })} className="py-5 bg-slate-50 border border-slate-200 rounded-3xl font-black text-[16px] text-slate-500 capitalize">No</button>
                                <button onClick={confirmDelete} className="py-5 bg-rose-500 text-white rounded-3xl font-black text-[16px] shadow-xl shadow-rose-200 capitalize">Yes</button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default NoticeFeed;