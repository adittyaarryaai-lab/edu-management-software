import React, { useState, useEffect } from 'react';
import { ArrowLeft, Send, Users, GraduationCap, Globe, Check, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import Toast from '../components/Toast';
import { motion, AnimatePresence } from 'framer-motion';

const AdminGlobalNotice = () => {
    const navigate = useNavigate();
    const [showToast, setShowToast] = useState(false);
    const [loading, setLoading] = useState(false);

    // Meta Data States
    const [availableClasses, setAvailableClasses] = useState([]);
    const [availableTeachers, setAvailableTeachers] = useState([]);
    const [isClassMenuOpen, setIsClassMenuOpen] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        content: '',
        audience: 'all',
        targetGrade: [], // Now an Array for multiple classes
        targetTeachers: [] // Array for multiple teachers
    });

    // --- DAY 127: FETCH METADATA ---
    useEffect(() => {
        const fetchMeta = async () => {
            try {
                const [classRes, teacherRes] = await Promise.all([
                    API.get('/notices/meta/classes'),
                    API.get('/notices/meta/teachers')
                ]);
                setAvailableClasses(classRes.data);
                setAvailableTeachers(teacherRes.data);
            } catch (err) { console.error("Meta Sync Error"); }
        };
        fetchMeta();
    }, []);

    // Selection Logic
    const toggleGrade = (grade) => {
        setFormData(prev => ({
            ...prev,
            targetGrade: prev.targetGrade.includes(grade)
                ? prev.targetGrade.filter(g => g !== grade)
                : [...prev.targetGrade, grade]
        }));
    };

    const handleBroadcast = async (e) => {
    e.preventDefault();

    if (formData.audience === 'specific_grade' && formData.targetGrade.length === 0) {
        return alert("Neural Link Error: Please select at least one class.");
    }

    setLoading(true);
    try {
        // --- YE LOGIC ADD KARO ---
        let finalTargetGrade = formData.targetGrade;
        
        if (formData.audience === 'specific_grade') {
            // Agar Admin ne saari classes select kar li hain
            if (formData.targetGrade.length === availableClasses.length) {
                finalTargetGrade = "All"; 
            }
        } else {
            finalTargetGrade = "All"; // Staff ya All ke liye
        }

        await API.post('/notices/create', {
            ...formData,
            targetGrade: finalTargetGrade // Ab yahan dynamic value jayegi
        });

        setShowToast(true);
        setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err) {
        alert(err.response?.data?.message || "Notice Failed");
    } finally {
        setLoading(false);
    }
};

    return (
        <div className="min-h-screen bg-[#F8FAFC] pb-24 font-sans italic text-slate-800 overscroll-none fixed inset-0 overflow-y-auto">
            {showToast && <Toast message="Notice sent successfully! 🚀" type="success" onClose={() => setShowToast(false)} />}

            {/* Header Area */}
            <div className="bg-[#42A5F5] text-white px-6 pt-12 pb-24 rounded-b-[4rem] shadow-xl relative overflow-visible text-center">
                <button
                    onClick={() => navigate(-1)}
                    className="absolute top-12 left-6 bg-white/20 p-3 rounded-2xl border border-white/30 text-white transition-all active:scale-90"
                >
                    <ArrowLeft size={24} />
                </button>
                <h1 className="text-4xl font-black uppercase tracking-tighter italic flex items-center justify-center gap-3 px-16">
                    School announcements
                </h1>
                <p className="text-[14px] font-black text-blue-100 uppercase tracking-[0.2em] mt-2 italic">Communication center</p>
            </div>

            <div className="px-5 -mt-12 relative z-20">
                <form onSubmit={handleBroadcast} className="bg-white p-8 rounded-[3rem] shadow-2xl border border-slate-100 space-y-8 ring-1 ring-slate-50">

                    {/* Audience Selector */}
                    <div className="space-y-3">
                        <label className="text-[19px] font-black text-slate-900 uppercase ml-4 tracking-widest italic">Select recipients</label>
                        <br />
                        <br />
                        <div className="grid grid-cols-3 gap-3">
                            {[
                                { id: 'all', label: 'All', icon: <Globe size={24} /> },
                                { id: 'teachers', label: 'Staff', icon: <Users size={24} /> },
                                { id: 'specific_grade', label: 'Class', icon: <GraduationCap size={24} /> }
                            ].map((opt) => (
                                <button
                                    key={opt.id}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, audience: opt.id })}
                                    className={`py-5 rounded-3xl flex flex-col items-center gap-2 border transition-all ${formData.audience === opt.id ? 'bg-[#42A5F5] text-white border-[#42A5F5] shadow-lg shadow-blue-100' : 'bg-slate-50 text-slate-400 border-slate-100 hover:bg-slate-100'}`}
                                >
                                    {opt.icon}
                                    <span className="text-[18px] font-black uppercase">{opt.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Multi-Class Selection UI */}
                    {/* --- SMART CLASS SECTOR DROPDOWN (MULTI-SELECT) --- */}
                    {formData.audience === 'specific_grade' && (
                        <div className="animate-in fade-in slide-in-from-top-2 space-y-3 relative">
                            <label className="text-[19px] font-black text-slate-700 uppercase ml-4 tracking-widest italic">
                                Select Class 
                            </label>

                            {/* Dropdown Trigger */}
                            <div
                                onClick={() => setIsClassMenuOpen(!isClassMenuOpen)}
                                className="w-full p-5 bg-slate-50 rounded-[2rem] border border-slate-600 flex items-center justify-between cursor-pointer active:scale-[0.98] transition-all shadow-sm"
                            >
                                <div className="flex flex-wrap gap-2 overflow-hidden max-h-8">
                                    {formData.targetGrade.length === 0 ? (
                                        <span className="text-[17px] font-bold text-slate-400 italic uppercase">Classes</span>
                                    ) : (
                                        <span className="text-[17px] font-bold text-[#42A5F5] italic uppercase">
                                            {formData.targetGrade.length === availableClasses.length
                                                ? "All classes selected"
                                                : `${formData.targetGrade.length} classes selected`}
                                        </span>
                                    )}
                                </div>
                                <Plus size={20} className={`text-[#42A5F5] transition-transform duration-300 ${isClassMenuOpen ? 'rotate-45' : 'rotate-0'}`} />
                            </div>

                            {/* Dropdown Menu */}
                            <AnimatePresence>
                                {isClassMenuOpen && (
                                    <>
                                        {/* Backdrop to close */}
                                        <div className="fixed inset-0 z-[130]" onClick={() => setIsClassMenuOpen(false)} />

                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className="absolute left-0 right-0 top-[110%] z-[140] bg-white border border-blue-50 rounded-[2.5rem] shadow-2xl overflow-hidden ring-1 ring-slate-100"
                                        >
                                            {/* SELECT ALL OPTION */}
                                            <div
                                                onClick={() => {
                                                    if (formData.targetGrade.length === availableClasses.length) {
                                                        setFormData({ ...formData, targetGrade: [] });
                                                    } else {
                                                        setFormData({ ...formData, targetGrade: availableClasses });
                                                    }
                                                }}
                                                className="p-5 bg-blue-50/50 flex items-center justify-between border-b border-blue-100 cursor-pointer hover:bg-blue-50"
                                            >
                                                <span className="text-[16px] font-black text-[#42A5F5] uppercase italic">Select all Classes</span>
                                                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${formData.targetGrade.length === availableClasses.length ? 'bg-[#42A5F5] border-[#42A5F5]' : 'border-slate-300'}`}>
                                                    {formData.targetGrade.length === availableClasses.length && <Check size={14} className="text-white" />}
                                                </div>
                                            </div>

                                            {/* CLASS LIST (SCROLLABLE) */}
                                            <div className="max-h-60 overflow-y-auto">
                                                {availableClasses.map((cls) => (
                                                    <div
                                                        key={cls}
                                                        onClick={() => toggleGrade(cls)}
                                                        className="p-5 flex items-center justify-between border-b border-slate-50 last:border-none cursor-pointer hover:bg-slate-50 transition-all"
                                                    >
                                                        <span className={`text-[16px] font-bold uppercase italic ${formData.targetGrade.includes(cls) ? 'text-[#42A5F5]' : 'text-slate-600'}`}>
                                                            {cls}
                                                        </span>
                                                        {formData.targetGrade.includes(cls) && <Check size={18} className="text-[#42A5F5]" />}
                                                    </div>
                                                ))}
                                            </div>

                                            {/* CLOSE BUTTON */}
                                            <div
                                                onClick={() => setIsClassMenuOpen(false)}
                                                className="p-4 bg-slate-800 text-white text-center text-[12px] font-black uppercase tracking-widest cursor-pointer"
                                            >
                                                Confirm Selection
                                            </div>
                                        </motion.div>
                                    </>
                                )}
                            </AnimatePresence>
                        </div>
                    )}

                    {/* Broadcast Inputs */}
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[19px] font-black text-slate-700 uppercase ml-4 tracking-[0.1em] italic">Notice Title</label>
                            <input
                                type="text"
                                placeholder="e.g. URGENT: HOLIDAY NOTICE"
                                className="w-full p-5 bg-slate-50 rounded-2xl border border-slate-600 outline-none text-[18px] font-bold text-slate-700 focus:border-[#42A5F5] italic transition-all"
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[19px] font-black text-slate-700 uppercase ml-4 tracking-[0.1em] italic">Notice Details</label>
                            <textarea
                                rows="5"
                                placeholder="Type your message here..."
                                className="w-full p-5 bg-slate-50 rounded-2xl border border-slate-600 outline-none text-[18px] font-bold text-slate-700 focus:border-[#42A5F5] italic leading-relaxed transition-all"
                                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                required
                            ></textarea>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        disabled={loading}
                        className="w-full bg-[#42A5F5] text-white py-6 rounded-[2.5rem] font-black uppercase text-[16px] tracking-widest shadow-xl shadow-blue-100 active:scale-95 transition-all flex items-center justify-center gap-3 italic"
                    >
                        {loading ? "Transmitting..." : <><Send size={20} /> Initiate Notice</>}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminGlobalNotice;