import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { X, Upload, Send, ChevronDown, CheckCircle2, Zap, ShieldAlert, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import API from '../api';

const TechnicalSupportModal = ({ isOpen, onClose, user }) => {
    const [activeTab, setActiveTab] = useState('new');
    const [loading, setLoading] = useState(false);
    const [history, setHistory] = useState([]);
    const [formData, setFormData] = useState({ issueType: '', description: '' });
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    
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
            
            showNeuralToast("Neural Signal Transmitted Successfully! 🚀");
        } catch (err) {
            showNeuralToast("Transmission Failed. Protocol Interrupted.", 'error');
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return ReactDOM.createPortal(
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 italic font-sans">
            
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-black/20 backdrop-blur-[25px] saturate-150"
            />

            <motion.div
                initial={{ scale: 0.9, y: 30, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                className="relative bg-[#0F172A] border border-white/10 w-full max-w-sm rounded-[3rem] shadow-[0_0_100px_rgba(0,0,0,1)] overflow-hidden z-[100000]"
            >
                {/* --- NEURAL TOAST OVERLAY --- */}
                <AnimatePresence>
                    {toast.show && (
                        <motion.div 
                            initial={{ y: -100, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -100, opacity: 0 }}
                            className={`absolute top-0 left-0 right-0 z-[100001] p-6 text-center font-black uppercase text-[10px] tracking-widest shadow-2xl flex items-center justify-center gap-3 ${toast.type === 'success' ? 'bg-emerald-500 text-void' : 'bg-red-500 text-white'}`}
                        >
                            {toast.type === 'success' ? <CheckCircle2 size={16}/> : <ShieldAlert size={16}/>}
                            {toast.message}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Header Node */}
                <div className="p-8 text-center border-b border-white/5 relative bg-gradient-to-b from-white/5 to-transparent">
                    {!toast.show && (
                        <button onClick={onClose} className="absolute top-6 right-6 text-white/20 hover:text-white transition-all active:scale-90 p-2">
                            <X size={24} />
                        </button>
                    )}
                    <h2 className="text-3xl font-black uppercase tracking-tighter text-white">Support</h2>
                    <p className="text-[10px] text-cyan-400 font-black uppercase tracking-[0.3em] mt-1 flex items-center justify-center gap-2">
                        <ShieldAlert size={12} /> Technical Response Node
                    </p>
                </div>

                {/* Tab Interface */}
                <div className="flex p-2 gap-2 bg-black/40 mx-6 mt-6 rounded-2xl border border-white/5">
                    <button onClick={() => setActiveTab('new')} className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${activeTab === 'new' ? 'bg-white text-slate-900 shadow-lg' : 'text-white/40 hover:text-white/60'}`}>New Query</button>
                    <button onClick={() => setActiveTab('history')} className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${activeTab === 'history' ? 'bg-white text-slate-900 shadow-lg' : 'text-white/40 hover:text-white/60'}`}>My Queries</button>
                </div>

                <div className="p-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
                    <AnimatePresence mode="wait">
                        {activeTab === 'new' ? (
                            <motion.form
                                key="new-tab"
                                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}
                                onSubmit={handleSubmit} className="space-y-5"
                            >
                                <div className="relative">
                                    <label className="text-[8px] font-black text-white/30 uppercase ml-4 mb-1 block">Anomaly Category *</label>
                                    <select
                                        value={formData.issueType}
                                        className="w-full bg-black/40 border-2 border-white/5 p-5 rounded-2xl text-xs font-black uppercase outline-none appearance-none text-white focus:border-cyan-400 transition-all cursor-pointer"
                                        onChange={(e) => setFormData({ ...formData, issueType: e.target.value })}
                                        required
                                    >
                                        <option value="">-- CHOOSE ISSUE --</option>
                                        {issueTypes.map(type => <option key={type} value={type} className="bg-slate-900 text-white">{type}</option>)}
                                    </select>
                                    <ChevronDown className="absolute right-5 top-[65%] -translate-y-1/2 text-cyan-400 pointer-events-none" size={18} />
                                </div>

                                <div>
                                    <label className="text-[8px] font-black text-white/30 uppercase ml-4 mb-1 block">Description</label>
                                    <textarea
                                        value={formData.description}
                                        placeholder="Brief the technical squad..."
                                        rows="3"
                                        className="w-full bg-black/40 border-2 border-white/5 p-5 rounded-2xl text-xs font-bold outline-none text-white focus:border-cyan-400 placeholder:text-white/10 transition-all italic"
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-3">
                                    {!preview ? (
                                        <label className="flex flex-col items-center justify-center gap-2 w-full p-6 border-2 border-dashed border-cyan-400/20 rounded-2xl bg-cyan-400/5 cursor-pointer hover:border-cyan-400 transition-all group">
                                            <Upload size={24} className="text-cyan-400 group-hover:animate-bounce" />
                                            <span className="text-[10px] font-black uppercase text-cyan-400/60 group-hover:text-cyan-400">Capture Screenshot</span>
                                            <input type="file" hidden accept="image/*" onChange={handleFileChange} />
                                        </label>
                                    ) : (
                                        <div className="relative rounded-2xl border-2 border-cyan-400/30 overflow-hidden bg-black/60 p-2">
                                            <img src={preview} className="w-full h-32 object-contain rounded-xl" alt="Preview" />
                                            <button 
                                                type="button"
                                                onClick={() => { setPreview(null); setFile(null) }} 
                                                className="absolute top-4 right-4 bg-red-500 p-1.5 rounded-full text-white shadow-lg hover:bg-red-600 transition-colors"
                                            >
                                                <X size={14} />
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <button 
                                    type="submit" 
                                    disabled={loading || toast.show} 
                                    className="w-full bg-cyan-400 text-slate-900 py-5 rounded-2xl font-black uppercase text-sm shadow-[0_10px_30px_rgba(34,211,238,0.3)] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                                >
                                    {loading ? <Loader2 size={18} className="animate-spin"/> : <Send size={18} />}
                                    {loading ? "TRANSMITTING..." : "Execute Submit"}
                                </button>
                            </motion.form>
                        ) : (
                            <motion.div
                                key="history-tab"
                                initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
                                className="space-y-4"
                            >
                                {history.length > 0 ? history.map((h, i) => (
                                    <div key={i} className="bg-white/5 p-5 rounded-[2rem] border border-white/5 relative group hover:border-white/10 transition-all">
                                        <div className="flex justify-between items-start mb-2">
                                            <h4 className="text-xs font-black text-cyan-400 uppercase tracking-tight">{h.issueType}</h4>
                                            <span className="text-[7px] text-white/20 font-black uppercase">{new Date(h.createdAt).toLocaleDateString()}</span>
                                        </div>
                                        <p className="text-[10px] text-white/50 leading-relaxed mb-3 italic">"{h.description || 'No briefing provided.'}"</p>
                                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[8px] font-black uppercase italic ${h.status === 'Resolved' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>
                                            <div className={`w-1 h-1 rounded-full animate-pulse ${h.status === 'Resolved' ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
                                            {h.status}
                                        </div>
                                    </div>
                                )) : (
                                    <div className="text-center py-10 opacity-20 flex flex-col items-center gap-2">
                                        <Zap size={40} className="text-white animate-pulse" />
                                        <p className="text-[10px] font-black uppercase tracking-widest">No Signal Logs Found</p>
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>,
        document.body
    );
};

export default TechnicalSupportModal;