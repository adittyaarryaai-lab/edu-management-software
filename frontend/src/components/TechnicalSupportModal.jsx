import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { X, Upload, Send, ChevronDown, CheckCircle2, Zap, ShieldAlert, Loader2, MessageSquare, Clock as HistoryIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import API from '../api';

const TechnicalSupportModal = ({ isOpen, onClose, user }) => {
    const [activeTab, setActiveTab] = useState('new');
    const [loading, setLoading] = useState(false);
    const [history, setHistory] = useState([]);
    const [formData, setFormData] = useState({ issueType: '', description: '' });
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    // --- DAY 138: NEURAL TOAST STATE ---
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

    const issueTypes = [
        "Bug Report", "App Crash", "Login Issue", "Attendance Issue",
        "Results Issue", "Timetable Issue", "Notification Issue",
        "App Performance", "UI / Design Issue", "Feature Request", "Other"
    ];

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
            // Reset Toast when closing
            setToast({ show: false, message: '', type: 'success' });
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);

    const fetchHistory = async () => {
        try {
            const { data } = await API.get('/technical/my-history');
            setHistory(data);
        } catch (err) { console.error("History Fetch Error:", err); }
    };

    useEffect(() => {
        if (isOpen && activeTab === 'history') fetchHistory();
    }, [isOpen, activeTab]);

    const handleFileChange = (e) => {
        const selected = e.target.files[0];
        if (selected) {
            setFile(selected);
            setPreview(URL.createObjectURL(selected));
        }
    };

    const showNeuralToast = (msg, type = 'success') => {
        setToast({ show: true, message: msg, type });
        setTimeout(() => {
            setToast({ show: false, message: '', type: 'success' });
            if (type === 'success') onClose(); // Success par hi close hoga
        }, 3000);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.issueType) return showNeuralToast("Select Issue Type! 🛡️", 'error');

        setLoading(true);
        const data = new FormData();
        data.append('issueType', formData.issueType);
        data.append('description', formData.description);
        if (file) data.append('screenshot', file);

        try {
            await API.post('/technical/report', data);
            setLoading(false);
            // --- DAY 138: FULL RESET PROTOCOL ---
            setFormData({ issueType: '', description: '' });
            setFile(null);
            setPreview(null);

            showNeuralToast("Your signal was transmitted successfully! 🚀");
        } catch (err) {
            showNeuralToast("Transmission Failed. Protocol Interrupted.", 'error');
            setLoading(false);
        }
    };

    // if (!isOpen) return null;

    return ReactDOM.createPortal(
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 italic font-sans overflow-hidden">
            <motion.div
                initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
                animate={{ opacity: 1, backdropFilter: "blur(12px)" }}
                exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                onClick={onClose}
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
            />

            <motion.div
                initial={{ scale: 0.85, y: 80, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
               exit={{ scale: 0.85, y: 80, opacity: 0 }}
                transition={{
                    type: "spring",
                    stiffness: 120,
                    damping: 18
                }}
                className="relative bg-white border border-[#DDE3EA] w-full max-w-sm rounded-[3.5rem] shadow-2xl overflow-hidden z-[100000]"
            >
                {/* --- NEURAL TOAST OVERLAY --- */}
                <AnimatePresence>
                    {toast.show && (
                        <motion.div
                            initial={{ y: -100 }} animate={{ y: 0 }} exit={{ y: -100 }}
                            className={`absolute top-0 left-0 right-0 z-[100001] p-6 text-center font-black text-[13px] italic shadow-lg flex items-center justify-center gap-3 ${toast.type === 'success' ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'}`}
                        >
                            {toast.type === 'success' ? <CheckCircle2 size={18} /> : <ShieldAlert size={18} />}
                            {toast.message}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Header Node */}
                <div className="p-8 text-center border-b border-slate-50 relative bg-gradient-to-b from-blue-50/50 to-transparent">
                    {!toast.show && (
                        <button onClick={onClose} className="absolute top-6 right-8 text-slate-300 hover:text-slate-600 transition-all p-2 bg-slate-50 rounded-full border border-slate-100">
                            <X size={20} />
                        </button>
                    )}
                    <h2 className="text-4xl font-black italic tracking-tighter text-slate-800 capitalize">Support</h2>
                    <p className="text-[15px] text-[#42A5F5] font-bold tracking-widest mt-1 flex items-center justify-center gap-2 italic capitalize">
                        <ShieldAlert size={14} /> Technical Problems
                    </p>
                </div>

                {/* Tab Interface */}
                <div className="flex p-2 gap-2 bg-slate-50 mx-6 mt-6 rounded-2xl border border-slate-100">
                    <button onClick={() => setActiveTab('new')} className={`flex-1 py-3 rounded-xl text-[15px] font-black italic transition-all flex items-center justify-center gap-2 ${activeTab === 'new' ? 'bg-white text-[#42A5F5] shadow-sm border border-slate-100' : 'text-slate-400'}`}>
                        <MessageSquare size={18} /> New query
                    </button>
                    <button onClick={() => setActiveTab('history')} className={`flex-1 py-3 rounded-xl text-[15px] font-black italic transition-all flex items-center justify-center gap-2 ${activeTab === 'history' ? 'bg-white text-[#42A5F5] shadow-sm border border-slate-100' : 'text-slate-400'}`}>
                        <HistoryIcon size={18} /> My history
                    </button>
                </div>

                <div className="p-6 max-h-[55vh] overflow-y-auto custom-scrollbar">
                    <AnimatePresence mode="wait">
                        {activeTab === 'new' ? (
                            <motion.form
                                key="new-tab"
                                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                                onSubmit={handleSubmit} className="space-y-5"
                            >
                                <div className="relative">
                                    <label className="text-[15px] font-black text-black uppercase tracking-widest ml-4 mb-2 block italic">Category *</label>

                                    <div
                                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                        className={`w-full bg-slate-50 border ${isDropdownOpen ? 'border-[#42A5F5] bg-white' : 'border-[#DDE3EA]'} p-5 rounded-2xl text-[18px] font-bold italic flex justify-between items-center cursor-pointer transition-all`}
                                    >
                                        <span className={formData.issueType ? 'text-black/40' : 'text-black/40'}>
                                            {formData.issueType || "Choose issue type..."}
                                        </span>
                                        <ChevronDown className={`text-slate-400 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} size={20} />
                                    </div>
                                    {/* Dropdown Options List */}
                                    <AnimatePresence>
                                        {isDropdownOpen && (
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                                animate={{ opacity: 1, scale: 1, y: 5 }}
                                                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                                                className="absolute z-[110] left-0 right-0 bg-white border border-[#DDE3EA] rounded-2xl shadow-xl overflow-hidden max-h-48 overflow-y-auto custom-scrollbar"
                                            >
                                                {issueTypes.map((type) => (
                                                    <div
                                                        key={type}
                                                        onClick={() => {
                                                            setFormData({ ...formData, issueType: type });
                                                            setIsDropdownOpen(false);
                                                        }}
                                                        className="p-4 text-[15px] font-bold text-slate-600 hover:bg-blue-50 hover:text-[#42A5F5] cursor-pointer transition-colors border-b border-slate-50 last:border-0 italic"
                                                    >
                                                        {type}
                                                    </div>
                                                ))}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                <div>
                                    <label className="text-[15px] font-black text-black uppercase tracking-widest ml-4 mb-2 block italic">Detailed description *</label>
                                    <textarea
                                        value={formData.description}
                                        placeholder="Brief the technical issue..."
                                        rows="3"
                                        className="w-full bg-slate-50 border border-[#DDE3EA] p-5 rounded-2xl text-[18px] font-medium outline-none text-slate-700 focus:border-[#42A5F5] focus:bg-white placeholder:text-black/40 transition-all italic"
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    />
                                </div>

                                <div>
                                    {!preview ? (
                                        <label className="flex flex-col items-center justify-center gap-2 w-full p-8 border-2 border-dashed border-blue-100 rounded-3xl bg-blue-50/30 cursor-pointer hover:bg-blue-50 transition-all group">
                                            <Upload size={28} className="text-[#42A5F5] group-hover:animate-bounce" />
                                            <span className="text-[18px] font-black text-[#42A5F5] italic tracking-tight">Capture screenshot</span>
                                            <input type="file" hidden accept="image/*" onChange={handleFileChange} />
                                        </label>
                                    ) : (
                                        <div className="relative rounded-3xl border border-[#DDE3EA] overflow-hidden bg-slate-50 p-2">
                                            <img src={preview} className="w-full h-32 object-contain rounded-2xl" alt="Preview" />
                                            <button
                                                type="button"
                                                onClick={() => { setPreview(null); setFile(null) }}
                                                className="absolute top-4 right-4 bg-rose-500 p-2 rounded-full text-white shadow-lg active:scale-90"
                                            >
                                                <X size={14} />
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading || toast.show}
                                    className="w-full bg-[#42A5F5] text-white py-5 rounded-[2rem] font-black italic text-[16px] shadow-lg shadow-blue-100 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                                >
                                    {loading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
                                    {loading ? "Transmitting..." : "Submit"}
                                </button>
                            </motion.form>
                        ) : (
                            <motion.div
                                key="history-tab"
                                initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
                                className="space-y-4 pb-4"
                            >
                                {history.length > 0 ? history.map((h, i) => (
                                    <div key={i} className="bg-white p-5 rounded-[2rem] border border-[#DDE3EA] relative group shadow-sm">
                                        <div className="flex justify-between items-start mb-2">
                                            <h4 className="text-[16px] font-black text-slate-800 italic tracking-tight">{h.issueType}</h4>
                                            <span className="text-[15px] text-black/40 font-bold italic">{new Date(h.createdAt).toLocaleDateString('en-GB')}</span>
                                        </div>
                                        <p className="text-[19px] text-black/40 leading-relaxed mb-4 italic">"{h.description || 'No briefing provided.'}"</p>
                                        <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-[15px] font-black italic capitalize ${h.status === 'Resolved' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>
                                            <div className={`w-1.5 h-1.5 rounded-full ${h.status === 'Resolved' ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`}></div>
                                            {h.status?.toLowerCase()}
                                        </div>
                                    </div>
                                )) : (
                                    <div className="text-center py-16 opacity-30 flex flex-col items-center gap-4">
                                        <Zap size={48} className="text-slate-200" />
                                        <p className="text-[20px] font-bold text-black italic">No Logs Found</p>
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
                <div className="bg-slate-50 py-4 border-t border-slate-100 flex items-center justify-center gap-2">
                    {/* <ShieldAlert size={12} className="text-slate-300" />
                    <p className="text-[12px] font-black text-black uppercase tracking-[0.4em]">EduFlowAI v2</p> */}
                </div>
            </motion.div>
        </div>,
        document.body
    );
};

export default TechnicalSupportModal;