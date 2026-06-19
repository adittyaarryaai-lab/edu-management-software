import React, { useState, useEffect } from 'react';
import { ArrowLeft, Trash2, Calendar, FileText, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import API from '../../api';
import Toast from '../../components/Toast';
import { motion, AnimatePresence } from "framer-motion";
import Loader from '../../components/Loader';

const AdminManageDatesheets = () => {
    const navigate = useNavigate();
    const [publishedList, setPublishedList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showToast, setShowToast] = useState({ show: false, message: '', type: '' });
    const [deleteModal, setDeleteModal] = useState({ show: false, id: null });

    const [availableClasses, setAvailableClasses] = useState([]);

    useEffect(() => {
        fetchPublishedList();
        fetchClasses(); // Ye naya add kiya hai
    }, []);

    const fetchClasses = async () => {
        try {
            const { data } = await API.get('/notices/meta/classes');
            setAvailableClasses(data);
        } catch (err) {
            console.log("Failed to fetch classes");
        }
    };

    const fetchPublishedList = async () => {
        try {
            const { data } = await API.get('/datesheet/all');
            setPublishedList(data);
        } catch (err) {
            triggerToast("Failed to load uploaded datesheets", "error");
        } finally {
            setLoading(false);
        }
    };

    const triggerToast = (msg, type = "success") => {
        setShowToast({ show: true, message: msg, type });
        setTimeout(() => setShowToast({ show: false, message: '', type: '' }), 3000);
    };

    // Ye bas modal open karega
    const confirmDelete = (id) => {
        setDeleteModal({ show: true, id });
    };

    // Ye actual mein backend se delete karega jab 'Yes' dabega
    const executeDelete = async () => {
        setLoading(true);
        try {
            await API.delete(`/datesheet/${deleteModal.id}`);
            triggerToast("Datesheet Deleted! 🗑️", "success");
            setDeleteModal({ show: false, id: null }); // Modal band
            fetchPublishedList(); // List refresh
        } catch (err) {
            triggerToast("Failed to delete.", "error");
            setDeleteModal({ show: false, id: null });
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <Loader />;

    return (
        <div className="min-h-screen bg-[#F8FAFC] pb-24 font-sans italic text-slate-800 text-[15px] overflow-x-hidden fixed inset-0 overflow-y-auto">
            {showToast.show && <Toast message={showToast.message} type={showToast.type} onClose={() => setShowToast({ show: false, message: '', type: '' })} />}

            {/* Header */}
            <div className="bg-[#42A5F5] text-white px-6 pt-12 pb-24 rounded-b-[4rem] shadow-lg relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-blue-400 to-transparent pointer-events-none opacity-50"></div>
                <div className="flex justify-between items-center relative z-10">
                    <button onClick={() => navigate(-1)} className="p-3 bg-white/20 rounded-2xl border border-white/30 text-white active:scale-90 transition-all shadow-sm">
                        <ArrowLeft size={24} />
                    </button>
                    <div className="text-center">
                        <h1 className="text-4xl font-black italic tracking-tight capitalize">Manage Datesheets</h1>
                    </div>
                    <div className="p-3 bg-white/20 rounded-2xl border border-white/30 text-white shadow-sm"><Calendar size={24} /></div>
                </div>
            </div>

            <div className="px-5 -mt-10 relative z-20 space-y-8 max-w-4xl mx-auto">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-[3.5rem] p-8 shadow-2xl border border-[#DDE3EA]">

                    {publishedList.length === 0 ? (
                        <div className="text-center py-10">
                            <FileText size={48} className="mx-auto text-slate-300 mb-4" />
                            <p className="text-slate-400 font-bold uppercase tracking-widest">No datesheets published yet.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {publishedList.map((ds, index) => (
                                <motion.div
                                    initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }}
                                    key={ds._id}
                                    className="flex flex-col md:flex-row justify-between items-center bg-slate-50 p-6 rounded-[2.5rem] border border-slate-200 hover:shadow-md transition-all gap-4"
                                >
                                    <div className="flex-1 w-full">
                                        <h3 className="text-xl font-black text-slate-800 uppercase tracking-wider mb-1">{ds.title}</h3>
                                        <div className="flex flex-wrap gap-2">
                                            <span className="bg-blue-100 text-[#42A5F5] px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest">
                                                {ds.isManual ? 'Manual Upload' : 'AI Generated'}
                                            </span>
                                            <span className="bg-slate-200 text-slate-600 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest">
                                                {ds.classes.length === availableClasses.length && availableClasses.length > 0
                                                    ? 'Classes: ALL CLASSES'
                                                    : `Classes: ${ds.classes.join(', ')}`}
                                            </span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => confirmDelete(ds._id)}
                                        className="w-full md:w-auto bg-red-50 text-red-500 p-4 rounded-2xl hover:bg-red-500 hover:text-white transition-all shadow-sm flex items-center justify-center gap-2"
                                    >
                                        <Trash2 size={24} /> <span className="md:hidden font-black uppercase tracking-widest text-sm">Delete</span>
                                    </button>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </motion.div>
            </div>
            {/* --- DELETE CONFIRMATION MODAL --- */}
            <AnimatePresence>
                {deleteModal.show && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDeleteModal({ show: false, id: null })} className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" />

                        <motion.div initial={{ scale: 0.9, y: 20, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.9, y: 20, opacity: 0 }} className="bg-white w-full max-w-sm rounded-[3.5rem] p-8 shadow-2xl relative z-10 text-center border border-[#DDE3EA]">
                            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                <AlertTriangle className="text-red-500" size={36} />
                            </div>
                            <h2 className="text-2xl font-black text-slate-800 mb-2">Delete Datesheet?</h2>
                            <p className="text-slate-500 font-bold mb-8 leading-relaxed">
                                Are you sure? This will permanently remove it from all Student Dashboards.
                            </p>

                            <div className="flex gap-4">
                                <button disabled={loading} onClick={executeDelete} className="flex-1 bg-red-500 text-white py-4 rounded-[2rem] font-black uppercase tracking-widest shadow-lg active:scale-95 transition-all flex justify-center items-center hover:bg-red-600">
                                    {loading ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> : "Delete"}
                                </button>
                                <button onClick={() => setDeleteModal({ show: false, id: null })} className="flex-1 bg-slate-100 text-slate-600 py-4 rounded-[2rem] font-black uppercase tracking-widest active:scale-95 transition-all hover:bg-slate-200">
                                    Cancel
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminManageDatesheets;