import React, { useState, useEffect } from 'react';
import { ArrowLeft, Image as ImageIcon, UploadCloud, Trash2, CheckCircle2, RefreshCw, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import API from '../../api';
import Loader from '../../components/Loader';
import Toast from '../../components/Toast';
import { motion, AnimatePresence } from 'framer-motion';

const AdminSchoolLogo = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false); // Default false kiya
    const [isFetching, setIsFetching] = useState(true); // Naya state sirf initial load ke liye
    const [viewMode, setViewMode] = useState('manage');
    const [logo, setLogo] = useState(null);
    const [showToast, setShowToast] = useState({ show: false, message: '', type: '' });
    const [deleteModal, setDeleteModal] = useState(false);

    useEffect(() => {
        fetchLogo();
    }, []);

    const fetchLogo = async () => {
        try {
            const { data } = await API.get('/school/logo');
            setLogo(data.logo);
        } catch (err) {
            triggerToast("Failed to fetch logo.", "error");
        } finally {
            setIsFetching(false); // Yahan isFetching ko false kiya
        }
    };

    const triggerToast = (msg, type = "success") => {
        setShowToast({ show: true, message: msg, type });
        setTimeout(() => setShowToast({ show: false, message: '', type: '' }), 3000);
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            // 🔥 FRONTEND GUARD: Check if it's actually an image
            if (!file.type.startsWith('image/')) {
                return triggerToast("Please upload an image file only! 🚫", "error");
            }

            if (file.size > 2 * 1024 * 1024) {
                return triggerToast("File size must be under 2MB", "error");
            }
            
            const reader = new FileReader();
            reader.onloadend = async () => {
                await uploadLogoToDB(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const uploadLogoToDB = async (base64String) => {
        setLoading(true);
        try {
            await API.post('/school/logo', { logoBase64: base64String }); // Adjust URL
            setLogo(base64String);

            // SHOW SUCCESS ANIMATION
            setViewMode('success');
            setTimeout(() => {
                setViewMode('manage'); // Revert back to manage view
            }, 2500);

        } catch (err) {
            triggerToast("Upload failed.", "error");
        } finally {
            setLoading(false);
        }
    };

    const confirmDelete = () => {
        setDeleteModal(true);
    };

    const executeDelete = async () => {
        setLoading(true);
        try {
            await API.delete('/school/logo'); // Adjust URL
            setLogo(null);
            triggerToast("Logo removed successfully! 🗑️", "success");
        } catch (err) {
            triggerToast("Failed to remove logo.", "error");
        } finally {
            setLoading(false);
            setDeleteModal(false); // Action ke baad modal band
        }
    };

    if (isFetching) return <Loader />; // Ab upload ke time ye trigger nahi hoga

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
                        <h1 className="text-3xl md:text-4xl font-black italic tracking-tight capitalize">School Brand</h1>
                    </div>
                    <div className="p-3 bg-white/20 rounded-2xl border border-white/30 text-white shadow-sm"><ImageIcon size={24} /></div>
                </div>
            </div>

            <div className="px-5 -mt-10 relative z-20 space-y-8 max-w-lg mx-auto">
                <AnimatePresence mode="wait">

                    {/* --- VIEW 1: MANAGE LOGO --- */}
                    {viewMode === 'manage' && (
                        <motion.div key="manage" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-[3.5rem] p-8 shadow-2xl border border-[#DDE3EA]">
                            <h2 className="text-2xl font-black text-center text-slate-800 mb-2 uppercase">Official Logo</h2>
                            {/* <p className="text-slate-500 font-bold text-center mb-8 text-[13px] uppercase tracking-widest">Appears on Admit Cards & Results</p> */}

                            {!logo ? (
                                /* UPLOAD STATE */
                                <div className="border-2 border-dashed border-[#42A5F5] rounded-[2.5rem] p-10 flex flex-col items-center justify-center bg-blue-50/50 hover:bg-blue-50 transition-all">
                                    <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-4 shadow-inner text-[#42A5F5]">
                                        <UploadCloud size={40} />
                                    </div>
                                    <h3 className="font-black text-slate-700 text-lg mb-2 uppercase">Upload Image</h3>
                                    <p className="font-bold text-slate-400 mb-6 text-[12px] uppercase tracking-widest text-center">Best Size: 500x500px (PNG/JPG)</p>

                                    <label className="cursor-pointer bg-[#42A5F5] text-white px-8 py-4 rounded-[2rem] font-black uppercase tracking-[0.2em] shadow-xl hover:bg-blue-600 transition-all active:scale-95 flex items-center gap-2">
                                        {loading ? (
                                            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                        ) : (
                                            "Browse File"
                                        )}
                                        <input type="file" accept="image/png, image/jpeg" disabled={loading} onChange={handleFileUpload} className="hidden" />
                                    </label>
                                </div>
                            ) : (
                                /* DISPLAY/MANAGE STATE */
                                <div className="flex flex-col items-center">
                                    <div className="w-48 h-48 bg-slate-50 border border-slate-200 rounded-[2.5rem] p-4 flex items-center justify-center shadow-inner mb-8">
                                        <img src={logo} alt="School Logo" className="max-w-full max-h-full object-contain drop-shadow-sm" />
                                    </div>

                                    <div className="flex w-full gap-4">
                                        <label className="flex-1 cursor-pointer bg-slate-900 text-white py-5 rounded-[2rem] font-black uppercase tracking-widest shadow-xl hover:bg-slate-800 transition-all active:scale-95 flex items-center justify-center gap-2 text-[13px]">
                                            {loading ? (
                                                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                            ) : (
                                                <>
                                                    <RefreshCw size={20} /> Change
                                                </>
                                            )}
                                            <input type="file" accept="image/png, image/jpeg" disabled={loading} onChange={handleFileUpload} className="hidden" />
                                        </label>

                                        <button onClick={confirmDelete} className="bg-red-50 text-red-500 px-6 py-5 rounded-[2rem] font-black shadow-sm hover:bg-red-500 hover:text-white transition-all active:scale-95 flex items-center justify-center">
                                            <Trash2 size={24} />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    )}

                    {/* --- VIEW 2: LIVE UPLOAD SUCCESS ANIMATION --- */}
                    {viewMode === 'success' && (
                        <motion.div key="success" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center py-16 bg-white rounded-[3.5rem] shadow-2xl border border-[#DDE3EA]">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: [0, 1.2, 1] }}
                                transition={{ duration: 0.5, type: "spring" }}
                                className="w-40 h-40 bg-emerald-100 rounded-full flex items-center justify-center relative shadow-[0_0_80px_rgba(52,211,153,0.5)] border-8 border-emerald-50"
                            >
                                <div className="absolute inset-0 bg-emerald-400 opacity-30 blur-2xl rounded-full animate-pulse"></div>
                                <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}>
                                    <CheckCircle2 size={80} className="text-emerald-500 relative z-10" strokeWidth={2.5} />
                                </motion.div>
                            </motion.div>
                            <motion.h2 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="text-2xl font-black text-emerald-600 mt-8 uppercase tracking-[0.2em] text-center">
                                Logo Uploaded
                            </motion.h2>
                        </motion.div>
                    )}

                </AnimatePresence>
            </div>
            {/* --- DELETE CONFIRMATION MODAL --- */}
            <AnimatePresence>
                {deleteModal && (
                    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDeleteModal(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" />

                        <motion.div initial={{ scale: 0.9, y: 20, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.9, y: 20, opacity: 0 }} className="bg-white w-full max-w-sm rounded-[3.5rem] p-8 shadow-2xl relative z-10 text-center border border-[#DDE3EA]">
                            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                <AlertTriangle className="text-red-500" size={36} />
                            </div>
                            <h2 className="text-2xl font-black text-slate-800 mb-2">Remove Logo?</h2>
                            <p className="text-slate-500 font-bold mb-8 leading-relaxed">
                                Are you sure you want to permanently delete the official school logo?
                            </p>

                            <div className="flex gap-4">
                                <button disabled={loading} onClick={executeDelete} className="flex-1 bg-red-500 text-white py-4 rounded-[2rem] font-black uppercase tracking-widest shadow-lg active:scale-95 transition-all flex justify-center items-center hover:bg-red-600">
                                    {loading ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> : "Delete"}
                                </button>
                                <button onClick={() => setDeleteModal(false)} className="flex-1 bg-slate-100 text-slate-600 py-4 rounded-[2rem] font-black uppercase tracking-widest active:scale-95 transition-all hover:bg-slate-200">
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

export default AdminSchoolLogo;