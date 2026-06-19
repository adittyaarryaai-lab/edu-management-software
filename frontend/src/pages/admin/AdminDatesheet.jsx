import React, { useState, useEffect, useRef } from "react";
import { ArrowLeft, Calendar as CalendarIcon, Clock, CheckSquare, Upload, Zap, Printer, ChevronDown, Check, FileUp, AlertTriangle, FileCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import API from '../../api';
import Toast from '../../components/Toast';
import { AnimatePresence, motion } from 'framer-motion';

const AdminDatesheet = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [showToast, setShowToast] = useState({ show: false, message: '', type: '' });
    
    // UI States
    const [activeTab, setActiveTab] = useState('ai'); // 'ai' or 'manual'
    const [publishConfirmModal, setPublishConfirmModal] = useState({ show: false, type: '' }); // type: 'ai' or 'manual'

    // Dropdown & Calendar States
    const [availableClasses, setAvailableClasses] = useState([]);
    const [isClassOpen, setIsClassOpen] = useState(false);
    const [isManualClassOpen, setIsManualClassOpen] = useState(false);
    
    // AI Form States
    const [isStartDateOpen, setIsStartDateOpen] = useState(false);
    const [isResultDateOpen, setIsResultDateOpen] = useState(false);
    const [isAmPmOpen, setIsAmPmOpen] = useState(false);
    const [isToAmPmOpen, setIsToAmPmOpen] = useState(false);
    const [isFromAmPmOpen, setIsFromAmPmOpen] = useState(false);
    const [startViewDate, setStartViewDate] = useState(new Date());
    const [resultViewDate, setResultViewDate] = useState(new Date());
    
    const startCalendarRef = useRef(null);
    const resultCalendarRef = useRef(null);
    const fromAmPmRef = useRef(null);
    const toAmPmRef = useRef(null);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // AI Form Data
    const [formData, setFormData] = useState({
        title: '', classes: [], startDate: '', gapDays: '',
        fromTime: '', fromAmPm: 'AM', toTime: '', toAmPm: 'PM',
        resultDate: '', notes: '', signatures: { incharge: '', principal: '' }
    });

    // Manual Upload Form Data
    const [manualData, setManualData] = useState({
        title: '', classes: [], fileData: ''
    });

    const [generatedSchedule, setGeneratedSchedule] = useState(null);
    const [currentSchoolName, setCurrentSchoolName] = useState("EduFlowAI Public School");

    useEffect(() => {
        fetchClasses();
        fetchSchoolProfile();
    }, []);

    const fetchSchoolProfile = async () => {
        try {
            const userStr = localStorage.getItem('user');
            if (userStr) {
                const userObj = JSON.parse(userStr);
                if (userObj.schoolId && userObj.schoolId.name) {
                    setCurrentSchoolName(userObj.schoolId.name);
                }
            }
        } catch (error) { console.log("Using default school name"); }
    };

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (startCalendarRef.current && !startCalendarRef.current.contains(e.target)) setIsStartDateOpen(false);
            if (resultCalendarRef.current && !resultCalendarRef.current.contains(e.target)) setIsResultDateOpen(false);
            if (fromAmPmRef.current && !fromAmPmRef.current.contains(e.target)) setIsFromAmPmOpen(false);
            if (toAmPmRef.current && !toAmPmRef.current.contains(e.target)) setIsToAmPmOpen(false);
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const fetchClasses = async () => {
        try {
            const { data } = await API.get('/notices/meta/classes');
            const sorted = data.sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }));
            setAvailableClasses(sorted);
        } catch (err) { triggerToast("Failed to fetch classes", "error"); }
    };

    const triggerToast = (msg, type = "success") => {
        setShowToast({ show: true, message: msg, type });
        setTimeout(() => setShowToast({ show: false, message: '', type: '' }), 3000);
    };

    // Class Selection Toggles
    const toggleClassAI = (cls) => {
        setFormData(prev => ({
            ...prev, classes: prev.classes.includes(cls) ? prev.classes.filter(c => c !== cls) : [...prev.classes, cls]
        }));
    };
    const handleSelectAllAI = () => {
        setFormData(prev => ({ ...prev, classes: prev.classes.length === availableClasses.length ? [] : [...availableClasses] }));
    };

    const toggleClassManual = (cls) => {
        setManualData(prev => ({
            ...prev, classes: prev.classes.includes(cls) ? prev.classes.filter(c => c !== cls) : [...prev.classes, cls]
        }));
    };
    const handleSelectAllManual = () => {
        setManualData(prev => ({ ...prev, classes: prev.classes.length === availableClasses.length ? [] : [...availableClasses] }));
    };

    // File Uploads
    const handleSignatureUpload = (e, type) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setFormData(prev => ({ ...prev, signatures: { ...prev.signatures, [type]: reader.result } }));
            reader.readAsDataURL(file);
        }
    };

    const handleManualFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setManualData(prev => ({ ...prev, fileData: reader.result }));
            reader.readAsDataURL(file);
        }
    };

    // AI Generation
    const handleGenerate = async (e) => {
        e.preventDefault();
        if (formData.classes.length === 0) return triggerToast("Please select classes! ⚠️", "error");
        if (!formData.startDate || !formData.resultDate) return triggerToast("Please select dates! ⚠️", "error");
        if (!formData.fromTime || !formData.toTime) return triggerToast("Please set timings! ⚠️", "error");

        setLoading(true);
        try {
            const combinedTiming = `${formData.fromTime} ${formData.fromAmPm} - ${formData.toTime} ${formData.toAmPm}`;
            const payload = { ...formData, timing: combinedTiming };
            const { data } = await API.post('/datesheet/generate-preview', payload);
            
            setGeneratedSchedule(data.schedule);
            if(data.schoolName) setCurrentSchoolName(data.schoolName);
            triggerToast("Datesheet Generated Successfully! ✨", "success");
        } catch (err) { triggerToast(err.response?.data?.message || "Generation failed.", "error"); } 
        finally { setLoading(false); }
    };

  // PUBLISH LOGIC (Triggered from Modal)
    const executePublish = async () => {
        setLoading(true);
        try {
            if (publishConfirmModal.type === 'ai') {
                const combinedTiming = `${formData.fromTime} ${formData.fromAmPm} - ${formData.toTime} ${formData.toAmPm}`;
                await API.post('/datesheet/save', { ...formData, timing: combinedTiming, schedule: generatedSchedule });
                
                // --- RESET AI FORM & PREVIEW ---
                setFormData({
                    title: '', classes: [], startDate: '', gapDays: '',
                    fromTime: '', fromAmPm: 'AM', toTime: '', toAmPm: 'PM',
                    resultDate: '', notes: '', signatures: { incharge: '', principal: '' }
                });
                setGeneratedSchedule(null); // Preview close karega aur wapas form par layega
                
            } else {
                await API.post('/datesheet/save-manual', manualData);
                
                // --- RESET MANUAL FORM ---
                setManualData({
                    title: '', classes: [], fileData: ''
                });
            }

            setPublishConfirmModal({ show: false, type: '' });
            triggerToast("Published Officially to Students! 🚀", "success");
            
            // Redirection HATA diya yahan se. Ab admin usi page par rahega.

        } catch (err) {
            setPublishConfirmModal({ show: false, type: '' });
            triggerToast("Publish failed.", "error");
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="min-h-screen bg-[#F8FAFC] pb-24 font-sans italic text-slate-800 text-[15px] overflow-x-hidden fixed inset-0 overflow-y-auto">
            {showToast.show && <Toast message={showToast.message} type={showToast.type} onClose={() => setShowToast({ show: false, message: '', type: '' })} />}

            {/* Header */}
            {/* Header */}
            <div className="bg-[#42A5F5] text-white px-6 pt-12 pb-24 rounded-b-[4rem] shadow-lg relative overflow-hidden">
                <div className="flex justify-between items-center gap-2 relative z-10">
                    <button onClick={() => navigate(-1)} className="p-2 md:p-3 bg-white/20 rounded-2xl border border-white/30 text-white active:scale-90 transition-all shadow-sm">
                        <ArrowLeft size={24} />
                    </button>
                    <div className="text-center">
                        {/* Responsive Font Size for Header */}
                        <h1 className="text-2xl md:text-4xl font-black italic tracking-tight capitalize">Datesheet Engine</h1>
                    </div>
                    <div className="p-2 md:p-3 bg-white/20 rounded-2xl border border-white/30 text-white shadow-sm">
                        <Zap size={24} />
                    </div>
                </div>
            </div>

            <div className="px-5 -mt-10 relative z-20 space-y-8 max-w-6xl mx-auto">

                {/* --- TOGGLE TABS (RESPONSIVE FIX) --- */}
                {!generatedSchedule && (
                    <div className="flex gap-2 md:gap-4 mb-6 bg-white p-2 rounded-[2.5rem] shadow-md w-full max-w-md mx-auto border border-[#DDE3EA]">
                        <button 
                            onClick={() => setActiveTab('ai')}
                            className={`flex-1 px-2 md:px-8 py-3 rounded-[2rem] text-[10px] md:text-sm font-black uppercase tracking-widest transition-all text-center ${activeTab === 'ai' ? 'bg-[#42A5F5] text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
                        >
                            AI Generator
                        </button>
                        <button 
                            onClick={() => setActiveTab('manual')}
                            className={`flex-1 px-2 md:px-8 py-3 rounded-[2rem] text-[10px] md:text-sm font-black uppercase tracking-widest transition-all text-center ${activeTab === 'manual' ? 'bg-indigo-500 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
                        >
                            Manual Upload
                        </button>
                    </div>
                )}

                {/* --- TAB 1: AI GENERATOR --- */}
                {activeTab === 'ai' && !generatedSchedule && (
                    <motion.form initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} onSubmit={handleGenerate} className="bg-white rounded-[3.5rem] p-8 shadow-2xl border border-[#DDE3EA]">
                        {/* Same AI Form Code ... */}
                        <div className="space-y-6">
                            {/* Exam Title */}
                            <div>
                                <label className="text-[13px] font-black text-slate-500 uppercase ml-2 mb-2 block tracking-widest">Exam Datesheet Heading</label>
                                <input type="text" placeholder="e.g. MID TERM EXAMINATION JUNE / JULY" className="w-full bg-slate-50 p-5 rounded-2xl border border-slate-200 text-[16px] font-bold outline-none focus:border-[#42A5F5] uppercase"
                                    value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
                            </div>

                            {/* Animated Class Dropdown */}
                            <div>
                                <label className="text-[13px] font-black text-slate-500 uppercase ml-2 mb-2 block tracking-widest">Classes</label>
                                <div className="relative">
                                    <button type="button" onClick={() => setIsClassOpen(!isClassOpen)} className="w-full flex items-center justify-between bg-slate-50 p-5 rounded-2xl border border-slate-200 font-bold text-slate-700 outline-none transition-all">
                                        <span>{formData.classes.length > 0 ? `${formData.classes.length} Classes Selected` : 'Select Classes from Dropdown'}</span>
                                        <ChevronDown size={20} className={`text-[#42A5F5] transition-transform ${isClassOpen ? 'rotate-180' : ''}`} />
                                    </button>

                                    <AnimatePresence>
                                        {isClassOpen && (
                                            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="absolute z-50 w-full mt-2 bg-white border border-slate-200 rounded-3xl shadow-2xl p-4 max-h-72 overflow-y-auto">
                                                <button type="button" onClick={handleSelectAllAI} className="w-full mb-3 bg-blue-50 text-[#42A5F5] py-3 rounded-2xl font-black uppercase tracking-widest hover:bg-blue-100 transition-all">
                                                    {formData.classes.length === availableClasses.length ? 'Deselect All' : 'Select All Classes'}
                                                </button>
                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                                    {availableClasses.map(cls => (
                                                        <button key={cls} type="button" onClick={() => toggleClassAI(cls)} className={`flex justify-between items-center px-4 py-3 rounded-xl font-bold transition-all ${formData.classes.includes(cls) ? 'bg-[#42A5F5] text-white shadow-md' : 'bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100'}`}>
                                                            Class {cls} {formData.classes.includes(cls) && <Check size={16} />}
                                                        </button>
                                                    ))}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>

                            {/* Calendars & Gaps */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {/* Exct same start/result/gap fields from previous code */}
                                <div className="relative" ref={startCalendarRef}>
                                    <label className="text-[13px] font-black text-slate-500 uppercase ml-2 mb-2 block tracking-widest">Exam Starting Date</label>
                                    <button type="button" onClick={() => { setIsStartDateOpen(!isStartDateOpen); setIsResultDateOpen(false); }} className="w-full bg-slate-50 p-5 rounded-2xl border border-slate-200 font-bold text-left">{formData.startDate || "Select Date"}</button>
                                    <AnimatePresence>
                                        {isStartDateOpen && (
                                            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="absolute z-50 w-full mt-3 bg-white border border-[#DDE3EA] rounded-[2.5rem] shadow-2xl p-5">
                                                <div className="flex justify-between items-center mb-4">
                                                    {(startViewDate.getMonth() !== today.getMonth() || startViewDate.getFullYear() !== today.getFullYear()) ? (
                                                        <button type="button" onClick={() => setStartViewDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))} className="font-black text-slate-700">←</button>
                                                    ) : (<div className="w-6"></div>)}
                                                    <span className="font-black text-[#42A5F5]">{startViewDate.toLocaleDateString("en-GB", { month: "short", year: "numeric" })}</span>
                                                    <button type="button" onClick={() => setStartViewDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))} className="font-black text-slate-700">→</button>
                                                </div>
                                                <div className="grid grid-cols-7 gap-2 text-center text-[12px] font-bold text-slate-400 mb-2">
                                                    {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map(d => (<span key={d}>{d}</span>))}
                                                </div>
                                                {(() => {
                                                    const year = startViewDate.getFullYear(); const month = startViewDate.getMonth(); const firstDay = new Date(year, month, 1); const lastDate = new Date(year, month + 1, 0).getDate();
                                                    let startDay = firstDay.getDay(); startDay = startDay === 0 ? 6 : startDay - 1;
                                                    const days = [];
                                                    for (let i = 0; i < startDay; i++) { days.push(<div key={i}></div>); }
                                                    for (let day = 1; day <= lastDate; day++) {
                                                        const tempDate = new Date(year, month, day); tempDate.setHours(0, 0, 0, 0);
                                                        const isCurrentMonth = month === today.getMonth() && year === today.getFullYear();
                                                        const isPast = isCurrentMonth && tempDate < today;
                                                        const formatted = tempDate.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
                                                        days.push(
                                                            <button type="button" key={day} disabled={isPast} onClick={() => { if (isPast) return; setFormData({ ...formData, startDate: formatted }); setIsStartDateOpen(false); }} className={`p-2 rounded-xl text-[13px] font-black ${isPast ? "opacity-20 cursor-not-allowed" : "text-slate-600 hover:bg-blue-100"}`}>{day}</button>
                                                        );
                                                    }
                                                    return <div className="grid grid-cols-7 gap-2">{days}</div>;
                                                })()}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                <div className="relative" ref={resultCalendarRef}>
                                    <label className="text-[13px] font-black text-slate-500 uppercase ml-2 mb-2 block tracking-widest">Result Declaration</label>
                                    <button type="button" onClick={() => { setIsResultDateOpen(!isResultDateOpen); setIsStartDateOpen(false); }} className="w-full bg-slate-50 p-5 rounded-2xl border border-slate-200 font-bold text-left">{formData.resultDate || "Select Date"}</button>
                                    <AnimatePresence>
                                        {isResultDateOpen && (
                                            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="absolute z-50 w-full mt-3 bg-white border border-[#DDE3EA] rounded-[2.5rem] shadow-2xl p-5">
                                                <div className="flex justify-between items-center mb-4">
                                                    {(resultViewDate.getMonth() !== today.getMonth() || resultViewDate.getFullYear() !== today.getFullYear()) ? (
                                                        <button type="button" onClick={() => setResultViewDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))} className="font-black text-slate-700">←</button>
                                                    ) : (<div className="w-6"></div>)}
                                                    <span className="font-black text-[#42A5F5]">{resultViewDate.toLocaleDateString("en-GB", { month: "short", year: "numeric" })}</span>
                                                    <button type="button" onClick={() => setResultViewDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))} className="font-black text-slate-700">→</button>
                                                </div>
                                                <div className="grid grid-cols-7 gap-2 text-center text-[12px] font-bold text-slate-400 mb-2">
                                                    {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map(d => (<span key={d}>{d}</span>))}
                                                </div>
                                                {(() => {
                                                    const year = resultViewDate.getFullYear(); const month = resultViewDate.getMonth(); const firstDay = new Date(year, month, 1); const lastDate = new Date(year, month + 1, 0).getDate();
                                                    let startDay = firstDay.getDay(); startDay = startDay === 0 ? 6 : startDay - 1;
                                                    const days = [];
                                                    for (let i = 0; i < startDay; i++) { days.push(<div key={i}></div>); }
                                                    for (let day = 1; day <= lastDate; day++) {
                                                        const tempDate = new Date(year, month, day); tempDate.setHours(0, 0, 0, 0);
                                                        const isCurrentMonth = month === today.getMonth() && year === today.getFullYear();
                                                        const isPast = isCurrentMonth && tempDate < today;
                                                        const formatted = tempDate.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
                                                        days.push(
                                                            <button type="button" key={day} disabled={isPast} onClick={() => { if (isPast) return; setFormData({ ...formData, resultDate: formatted }); setIsResultDateOpen(false); }} className={`p-2 rounded-xl text-[13px] font-black ${isPast ? "opacity-20 cursor-not-allowed" : "text-slate-600 hover:bg-blue-100"}`}>{day}</button>
                                                        );
                                                    }
                                                    return <div className="grid grid-cols-7 gap-2">{days}</div>;
                                                })()}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                                
                                <div>
                                    <label className="text-[13px] font-black text-slate-500 uppercase ml-2 mb-2 block tracking-widest">Gap Days (Excl. Sunday)</label>
                                    <input type="number" min="0" placeholder="e.g. 1" className="w-full bg-slate-50 p-5 rounded-2xl border border-slate-200 font-bold outline-none focus:border-[#42A5F5]" value={formData.gapDays} onChange={(e) => setFormData({ ...formData, gapDays: e.target.value })} required />
                                </div>
                            </div>

                            {/* Timing */}
                            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200">
                                <label className="text-[13px] font-black text-slate-500 uppercase mb-4 block tracking-widest flex items-center gap-2"><Clock size={16} className="text-[#42A5F5]" /> School Timing</label>
                                <div className="flex flex-col md:flex-row items-center gap-4">
                                    <div className="flex-1 w-full flex items-center gap-2 bg-white p-3 rounded-2xl border border-slate-200 shadow-sm">
                                        <span className="font-bold text-slate-400 pl-2">From</span>
                                        <input type="text" placeholder="09:00" className="w-full text-center font-black outline-none bg-transparent text-lg" value={formData.fromTime} onChange={(e) => setFormData({ ...formData, fromTime: e.target.value })} required />
                                        <div className="relative" ref={fromAmPmRef}>
                                            <button type="button" onClick={() => setIsFromAmPmOpen(!isFromAmPmOpen)} className="w-full bg-blue-50 text-[#42A5F5] font-black rounded-xl p-3 outline-none flex justify-between items-center">{formData.fromAmPm}</button>
                                            <AnimatePresence>
                                                {isFromAmPmOpen && (
                                                    <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="absolute top-full left-0 mt-2 w-full bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden z-50">
                                                        {["AM", "PM"].map((period) => (
                                                            <button key={period} type="button" onClick={() => { setFormData({ ...formData, fromAmPm: period }); setIsFromAmPmOpen(false); }} className={`w-full text-left px-4 py-3 font-black transition-all ${formData.fromAmPm === period ? "bg-blue-100 text-[#42A5F5]" : "hover:bg-slate-50 text-slate-700"}`}>{period}</button>
                                                        ))}
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    </div>
                                    <span className="font-black text-slate-300">TO</span>
                                    <div className="flex-1 w-full flex items-center gap-2 bg-white p-3 rounded-2xl border border-slate-200 shadow-sm">
                                        <input type="text" placeholder="12:30" className="w-full text-center font-black outline-none bg-transparent text-lg" value={formData.toTime} onChange={(e) => setFormData({ ...formData, toTime: e.target.value })} required />
                                        <div className="relative" ref={toAmPmRef}>
                                            <button type="button" onClick={() => setIsToAmPmOpen(!isToAmPmOpen)} className="w-full bg-blue-50 text-[#42A5F5] font-black rounded-xl p-3 outline-none flex justify-between items-center">{formData.toAmPm}</button>
                                            <AnimatePresence>
                                                {isToAmPmOpen && (
                                                    <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="absolute top-full left-0 mt-2 w-full bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden z-50">
                                                        {["AM", "PM"].map((period) => (
                                                            <button key={period} type="button" onClick={() => { setFormData({ ...formData, toAmPm: period }); setIsToAmPmOpen(false); }} className={`w-full text-left px-4 py-3 font-black transition-all ${formData.toAmPm === period ? "bg-blue-100 text-[#42A5F5]" : "hover:bg-slate-50 text-slate-700"}`}>{period}</button>
                                                        ))}
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Instructions Box & Sigs */}
                            <div>
                                <label className="text-[13px] font-black text-slate-500 uppercase ml-2 mb-2 block tracking-widest">Instructions / Kindly Note</label>
                                <textarea rows="3" placeholder="Write exam instructions here..." className="w-full bg-slate-50 p-5 rounded-2xl border border-slate-200 font-bold outline-none focus:border-[#42A5F5] resize-none" value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} required />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-6 rounded-3xl border border-slate-200">
                                <div>
                                    <label className="text-[13px] font-black text-slate-500 uppercase ml-2 mb-2 block tracking-widest">Examination Incharge Sign</label>
                                    <input type="file" accept="image/*" onChange={(e) => handleSignatureUpload(e, 'incharge')} required className="w-full text-sm font-bold file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-sm file:font-black file:bg-[#42A5F5] file:text-white hover:file:bg-blue-600" />
                                </div>
                                <div>
                                    <label className="text-[13px] font-black text-slate-500 uppercase ml-2 mb-2 block tracking-widest">Principal Sign</label>
                                    <input type="file" accept="image/*" onChange={(e) => handleSignatureUpload(e, 'principal')} required className="w-full text-sm font-bold file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-sm file:font-black file:bg-[#42A5F5] file:text-white hover:file:bg-blue-600" />
                                </div>
                            </div>

                            <button type="submit" disabled={loading} className="w-full py-6 bg-slate-900 text-white rounded-[2.5rem] font-black uppercase tracking-[0.2em] shadow-xl hover:bg-[#42A5F5] transition-all flex items-center justify-center gap-2">
                                {loading ? <span className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></span> : <><Zap size={24} /> Generate AI Datesheet</>}
                            </button>
                        </div>
                    </motion.form>
                )}

                {/* --- TAB 2: MANUAL UPLOAD --- */}
                {activeTab === 'manual' && !generatedSchedule && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-[3.5rem] p-8 shadow-2xl border border-indigo-100">
                        <h2 className="text-2xl font-black text-indigo-900 mb-6 flex items-center gap-2">
                            <FileUp className="text-indigo-500" /> Upload Existing Datesheet
                        </h2>

                        <div className="space-y-6">
                            <div>
                                <label className="text-[13px] font-black text-slate-500 uppercase ml-2 mb-2 block tracking-widest">Exam Datesheet Heading</label>
                                <input type="text" placeholder="e.g. MID TERM EXAMINATION JUNE / JULY" className="w-full bg-indigo-50/50 p-5 rounded-2xl border border-indigo-100 text-[16px] font-bold outline-none focus:border-indigo-400 uppercase"
                                    value={manualData.title} onChange={(e) => setManualData({ ...manualData, title: e.target.value })} />
                            </div>

                            {/* Dropdown for Manual */}
                            <div>
                                <label className="text-[13px] font-black text-slate-500 uppercase ml-2 mb-2 block tracking-widest">Classes</label>
                                <div className="relative">
                                    <button type="button" onClick={() => setIsManualClassOpen(!isManualClassOpen)} className="w-full flex items-center justify-between bg-indigo-50/50 p-5 rounded-2xl border border-indigo-100 font-bold text-indigo-900 outline-none transition-all">
                                        <span>{manualData.classes.length > 0 ? `${manualData.classes.length} Classes Selected` : 'Select Classes from Dropdown'}</span>
                                        <ChevronDown size={20} className={`text-indigo-500 transition-transform ${isManualClassOpen ? 'rotate-180' : ''}`} />
                                    </button>

                                    <AnimatePresence>
                                        {isManualClassOpen && (
                                            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="absolute z-50 w-full mt-2 bg-white border border-indigo-100 rounded-3xl shadow-2xl p-4 max-h-72 overflow-y-auto">
                                                <button type="button" onClick={handleSelectAllManual} className="w-full mb-3 bg-indigo-50 text-indigo-600 py-3 rounded-2xl font-black uppercase tracking-widest hover:bg-indigo-100 transition-all">
                                                    {manualData.classes.length === availableClasses.length ? 'Deselect All' : 'Select All Classes'}
                                                </button>
                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                                    {availableClasses.map(cls => (
                                                        <button key={cls} type="button" onClick={() => toggleClassManual(cls)} className={`flex justify-between items-center px-4 py-3 rounded-xl font-bold transition-all ${manualData.classes.includes(cls) ? 'bg-indigo-500 text-white shadow-md' : 'bg-slate-50 border border-slate-200 text-slate-600 hover:bg-indigo-50 hover:text-indigo-600'}`}>
                                                            Class {cls} {manualData.classes.includes(cls) && <Check size={16} />}
                                                        </button>
                                                    ))}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>

                            {/* File Upload Box */}
                            {/* Premium File Upload Box */}
                            <div className="border-2 border-dashed border-indigo-200 rounded-[3.5rem] p-10 min-h-[350px] flex flex-col items-center justify-center bg-indigo-50/30 transition-all hover:bg-indigo-50/50">
                                {manualData.fileData ? (
                                    <div className="relative flex flex-col items-center justify-center w-full animate-in fade-in zoom-in duration-300">
                                        
                                        {/* Smart Check: Image Preview vs PDF Icon */}
                                        {manualData.fileData.includes('application/pdf') ? (
                                            <div className="bg-white p-8 rounded-[2rem] shadow-lg border border-indigo-100 flex flex-col items-center justify-center mb-6 w-64 h-64">
                                                <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-4 shadow-inner">
                                                    <FileCheck size={40} className="text-emerald-500" />
                                                </div>
                                                <p className="font-black text-slate-700 text-lg uppercase tracking-widest text-center">PDF Ready</p>
                                                <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-wider text-center">Document Verified</p>
                                            </div>
                                        ) : (
                                            <div className="bg-white p-4 rounded-[2rem] shadow-lg border border-indigo-100 mb-6 inline-block">
                                                <img src={manualData.fileData} alt="Preview" className="max-h-64 object-contain rounded-2xl" />
                                            </div>
                                        )}

                                        <button 
                                            onClick={() => setManualData({...manualData, fileData: ''})} 
                                            className="px-6 py-3 bg-red-50 text-red-500 rounded-[1.5rem] font-black text-[13px] uppercase tracking-[0.1em] hover:bg-red-500 hover:text-white transition-all shadow-sm active:scale-95 flex items-center gap-2"
                                        >
                                            Remove Document
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center w-full">
                                        <div className="w-28 h-28 bg-indigo-100 rounded-[2.5rem] flex items-center justify-center mb-6 shadow-inner rotate-3 hover:rotate-0 transition-transform duration-300">
                                            <FileUp size={48} className="text-indigo-500" />
                                        </div>
                                        <h3 className="font-black text-slate-700 text-xl mb-2 capitalize">Upload Datesheet</h3>
                                        <p className="font-bold text-slate-400 mb-8 text-[13px] uppercase tracking-widest">Select Image (JPG/PNG) or PDF</p>
                                        
                                        {/* Custom styled file input button */}
                                        <label className="cursor-pointer bg-indigo-500 text-white px-10 py-5 rounded-[2rem] font-black uppercase tracking-[0.2em] shadow-xl hover:bg-indigo-600 transition-all hover:scale-105 active:scale-95 flex items-center gap-2">
                                            Browse Files
                                            <input 
                                                type="file" 
                                                accept="image/*,application/pdf" 
                                                onChange={handleManualFileUpload} 
                                                className="hidden" 
                                            />
                                        </label>
                                    </div>
                                )}
                            </div>

                            <button 
                                onClick={() => {
                                    if(!manualData.title || manualData.classes.length === 0 || !manualData.fileData) return triggerToast("Fill all fields & upload file! ⚠️", "error");
                                    setPublishConfirmModal({ show: true, type: 'manual' });
                                }}
                                className="w-full py-6 bg-indigo-600 text-white rounded-[2.5rem] font-black uppercase tracking-[0.2em] shadow-xl hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
                            >
                                <Upload size={24} /> Publish Publicly
                            </button>
                        </div>
                    </motion.div>
                )}


                {/* --- GENERATED AI PREVIEW SECTION (INVERTED MATRIX) --- */}
                {generatedSchedule && (
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-[1rem] p-8 shadow-2xl border border-slate-800 print:shadow-none print:border-none print:p-0">
                        {/* Excatly Same Generated UI as Before */}
                        <div className="text-center mb-8 border-b-2 border-slate-800 pb-6">
                            <h1 className="text-3xl font-black uppercase text-slate-900 tracking-wider mb-2">
                                {currentSchoolName || "EDULFLOWAI PUBLIC SCHOOL"}
                            </h1>
                            <h2 className="text-xl font-bold uppercase text-slate-800 mb-1">{formData.title}</h2>
                            <h3 className="text-lg font-bold uppercase text-slate-700">Date Sheet</h3>
                        </div>

                        <div className="overflow-x-auto mb-8">
                            <table className="w-full border-collapse border-2 border-slate-800 text-center text-sm font-bold text-slate-800">
                                <thead className="bg-slate-100">
                                    <tr>
                                        <th className="border-2 border-slate-800 p-3 uppercase tracking-wider bg-slate-200">Class \ Date</th>
                                        {generatedSchedule.map((col, idx) => (
                                            <th key={idx} className="border-2 border-slate-800 p-3">
                                                <div className="font-black whitespace-nowrap">{col.date}</div>
                                                <div className="text-slate-600 font-semibold">{col.day}</div>
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {formData.classes.map(cls => (
                                        <tr key={cls}>
                                            <td className="border-2 border-slate-800 p-3 font-black uppercase whitespace-nowrap bg-slate-50 text-lg">Class {cls}</td>
                                            {generatedSchedule.map((col, idx) => (
                                                <td key={idx} className="border-2 border-slate-800 p-3 capitalize">{col.classExams[cls]}</td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="mb-24">
                            <h4 className="font-black text-slate-800 mb-4 underline">Kindly Note:</h4>
                            <ul className="list-disc pl-5 font-bold text-sm text-slate-700 space-y-2">
                                <li className="text-slate-900">
                                    <strong>Examination Timing:</strong> The examination will be conducted strictly from <span className="underline">{formData.fromTime} {formData.fromAmPm}</span> to <span className="underline">{formData.toTime} {formData.toAmPm}</span>.
                                </li>
                                <li className="text-slate-900">
                                    <strong>Result Declaration:</strong> The results for the above classes will be declared on <span className="underline">{formData.resultDate}</span>.
                                </li>
                                {formData.notes.split('\n').map((note, i) => (
                                    note.trim() && <li key={i}>{note}</li>
                                ))}
                            </ul>
                        </div>

                        <div className="flex justify-between items-end px-10">
                            <div className="text-left w-48">
                                {formData.signatures.incharge && <img src={formData.signatures.incharge} alt="Incharge Sign" className="h-16 mb-2 object-contain" />}
                                <p className="font-black border-t-2 border-slate-800 pt-2 uppercase">Examination Incharge</p>
                            </div>
                            <div className="text-right w-48">
                                {formData.signatures.principal && <img src={formData.signatures.principal} alt="Principal Sign" className="h-16 mb-2 object-contain ml-auto" />}
                                <p className="font-black border-t-2 border-slate-800 pt-2 uppercase">Principal</p>
                            </div>
                        </div>

                        <div className="mt-16 flex gap-4 print:hidden">
                            <button onClick={() => window.print()} className="flex-1 py-4 bg-slate-100 text-slate-700 border border-slate-300 rounded-[2rem] font-black uppercase tracking-widest hover:bg-slate-200 transition-all flex justify-center items-center gap-2">
                                <Printer size={20} /> Print Document
                            </button>
                            <button onClick={() => setPublishConfirmModal({ show: true, type: 'ai' })} className="flex-1 py-4 bg-[#42A5F5] text-white rounded-[2rem] font-black uppercase tracking-widest shadow-lg hover:bg-blue-600 transition-all flex justify-center items-center gap-2">
                                <Upload size={20} /> Publish Publicly
                            </button>
                            <button onClick={() => setGeneratedSchedule(null)} className="py-4 px-8 bg-red-50 text-red-500 rounded-[2rem] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all">
                                Discard
                            </button>
                        </div>

                    </motion.div>
                )}

                {/* --- CONFIRMATION MODAL (For both AI and Manual Publish) --- */}
                <AnimatePresence>
                    {publishConfirmModal.show && (
                        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setPublishConfirmModal({ show: false, type: '' })} className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" />
                            <motion.div initial={{ scale: 0.9, y: 20, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.9, y: 20, opacity: 0 }} className="bg-white w-full max-w-sm rounded-[3.5rem] p-8 shadow-2xl relative z-10 text-center border border-[#DDE3EA]">
                                <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <AlertTriangle className="text-[#42A5F5]" size={36} />
                                </div>
                                <h2 className="text-2xl font-black text-slate-800 mb-2">Publish Datesheet</h2>
                                <p className="text-slate-500 font-bold mb-8 leading-relaxed">
                                    Are you sure you want to publish this {publishConfirmModal.type === 'ai' ? 'Generated' : 'Manual'} Datesheet to students?
                                </p>

                                <div className="flex gap-4">
                                    <button disabled={loading} onClick={executePublish} className="flex-1 bg-[#42A5F5] text-white py-4 rounded-[2rem] font-black uppercase tracking-widest shadow-lg active:scale-95 transition-all flex justify-center items-center">
                                        {loading ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> : "Yes, Publish"}
                                    </button>
                                    <button onClick={() => setPublishConfirmModal({ show: false, type: '' })} className="flex-1 bg-slate-100 text-slate-600 py-4 rounded-[2rem] font-black uppercase tracking-widest active:scale-95 transition-all hover:bg-slate-200">
                                        Cancel
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

            </div>
        </div>
    );
};

export default AdminDatesheet;