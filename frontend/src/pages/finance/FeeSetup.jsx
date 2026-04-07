import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, Layers, CheckCircle2, Edit3, Trash2, Eye, Lock, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import API from '../../api';
import { motion, AnimatePresence } from 'framer-motion';


const FeeSetup = () => {
    const navigate = useNavigate();
    const [selectedClass, setSelectedClass] = useState('');
    const [loading, setLoading] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');
    const [configuredList, setConfiguredList] = useState([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(true);
    const [openCycleId, setOpenCycleId] = useState(null);

    const feeCategories = [
        { key: 'admissionFees', label: '1. Admission fees', desc: 'One-time fee at joining' },
        { key: 'registrationFees', label: '2. Registration fees', desc: 'Paid while applying admission' },
        { key: 'securityFees', label: '3. Security fees', desc: 'Refundable deposit' },
        { key: 'tuitionFees', label: '4. Tuition fees', desc: 'Main academic fee (monthly)' },
        { key: 'examinationFees', label: '6. Examination fees', desc: 'Charged during exams' },
        { key: 'libraryFees', label: '7. Library fees', desc: 'Library resources' },
        { key: 'laboratoryFees', label: '8. Laboratory fees', desc: 'Science/Computer labs' },
        { key: 'activityFees', label: '9. Activity fees', desc: 'Sports, events, etc.' },
        { key: 'developmentFees', label: '10. Development fees', desc: 'Infrastructure' },
        { key: 'annualCharges', label: '11. Annual charges', desc: 'Yearly maintenance' },
        { key: 'smartClassFees', label: '12. Smart class fees', desc: 'Digital learning' },
        { key: 'uniformFees', label: '13. Uniform fees', desc: 'School uniform' },
        { key: 'booksStationeryFees', label: '14. Books & stationery', desc: 'Study material' },
        { key: 'idCardFees', label: '15. Id card fees', desc: 'Student identification' },
        { key: 'lateFees', label: '16. Late fees / Fine', desc: 'Delayed payment charge' },
        { key: 'readmissionFees', label: '17. Re-admission fees', desc: 'Rejoining student' },
        { key: 'miscellaneousCharges', label: '18. Miscellaneous charges', desc: 'Extra trips, etc.' }
    ];

    const initialFeesState = feeCategories.reduce((acc, cat) => {
        const isDefaultMonthly = ['tuitionFees', 'libraryFees', 'laboratoryFees', 'activityFees', 'smartClassFees'].includes(cat.key);
        acc[cat.key] = { amount: 0, isNone: false, billingCycle: isDefaultMonthly ? 'monthly' : 'one-time' };
        return acc;
    }, {});

    const [feeData, setFeeData] = useState(initialFeesState);

    const fetchConfiguredList = async () => {
        try {
            const { data } = await API.get('/fees/structure/list/all');
            setConfiguredList(data);
        } catch (err) { console.error("List fetch error"); }
    };

    useEffect(() => { fetchConfiguredList(); }, []);

    useEffect(() => {
        const fetchStructure = async () => {
            if (!selectedClass) return;
            try {
                const { data } = await API.get(`/fees/structure/${selectedClass}`);
                if (!data.notFound) {
                    setFeeData(data.fees);
                } else {
                    setFeeData(initialFeesState);
                    setIsEditMode(true);
                }
            } catch (err) { console.error("Fetch error"); }
        };
        fetchStructure();
    }, [selectedClass]);

    const handleSave = async () => {
        if (!selectedClass) return alert("Select class first!");
        setLoading(true);
        try {
            await API.post('/fees/structure/update', {
                className: selectedClass,
                fees: feeData
            });
            setSuccessMsg(`${selectedClass} Structure locked! ⚡`);
            setSelectedClass('');
            setFeeData(initialFeesState);
            fetchConfiguredList();
            setTimeout(() => setSuccessMsg(''), 3000);
        } catch (err) { alert("Sync failed."); } finally { setLoading(false); }
    };

    return (
        <div className="min-h-screen bg-[#F1F5F9] text-slate-800 p-5 pb-32 italic font-sans text-[15px] overflow-x-hidden overscroll-none fixed inset-0 overflow-y-auto">
            {/* Header */}
            <div className="flex items-center gap-5 mb-10 border-l-4 border-[#42A5F5] pl-4">
                <button
                    onClick={() => navigate(-1)}
                    className="p-3 bg-white rounded-2xl border border-blue-100 shadow-md text-[#42A5F5] active:scale-90 transition-all"
                >
                    <ArrowLeft size={24} />
                </button>
                <h1 className="text-3xl font-black italic tracking-tight text-slate-800">Set Fee Structure</h1>
            </div>

            {/* --- CONFIGURED NODES SECTION (Blue Cards) --- */}
            <div className="mb-10 space-y-4">
                <h3 className="text-[12px] font-black text-blue-400 uppercase tracking-widest ml-4 italic">Active configured Classes</h3>
                <div className="grid grid-cols-1 gap-4">
                    {configuredList.length > 0 ? configuredList.map((item, idx) => (
                        <div key={idx} className="bg-gradient-to-r from-white to-blue-50 p-6 rounded-[2.5rem] border border-blue-100 flex justify-between items-center group hover:shadow-lg hover:border-[#42A5F5] transition-all shadow-sm">
                            <div className="flex items-center gap-5 cursor-pointer flex-1" onClick={() => { setSelectedClass(item.className); setIsEditMode(false); }}>
                                <div className="bg-[#42A5F5] p-4 rounded-2xl text-white shadow-md shadow-blue-200">
                                    <Layers size={22} />
                                </div>
                                <div>
                                    <p className="text-[17px] font-black text-slate-700 italic capitalize">{item.className}</p>
                                    <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest flex items-center gap-1.5 mt-1">
                                        <Eye size={12} /> View live structure
                                    </p>
                                </div>
                            </div>
                            <button onClick={() => { setSelectedClass(item.className); setIsEditMode(true); }} className="p-4 bg-white rounded-2xl border border-blue-100 text-[#42A5F5] hover:bg-[#42A5F5] hover:text-white transition-all shadow-sm">
                                <Edit3 size={18} />
                            </button>
                        </div>
                    )) : (
                        <p className="text-[12px] font-bold text-slate-300 uppercase text-center py-8 italic border-2 border-dashed border-blue-100 rounded-[2.5rem] bg-white/50">No classes defined yet</p>
                    )}
                </div>
            </div>

            {/* --- NEW CLASS SELECTOR (Deep Blue Accent) --- */}
            <div className="bg-[#42A5F5] p-8 rounded-[3rem] mb-10 shadow-xl shadow-blue-100 relative overflow-visible">
                <div className="absolute top-0 right-0 p-10 opacity-10 rotate-12 pointer-events-none"><Layers size={100} className="text-white" /></div>
                <p className="text-[12px] font-black text-blue-100 uppercase tracking-widest mb-4 ml-2 italic relative z-10">Create Fee Structure(Class) </p>
                <div className="relative z-[60]"> {/* Higher Z-index taaki menu upar dikhe */}
                    {/* Trigger Button */}
                    <button
                        type="button"
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="w-full bg-white p-5 rounded-3xl text-[16px] font-black text-slate-700 flex justify-between items-center transition-all italic shadow-md active:scale-95"
                    >
                        <span>{selectedClass || "Choose class"}</span>
                        <ChevronDown size={22} className={`text-[#42A5F5] transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {/* Animated Dropdown Menu */}
                    <AnimatePresence>
                        {isDropdownOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                className="absolute z-[70] w-full mt-3 bg-white border border-blue-100 rounded-[2rem] shadow-2xl max-h-72 overflow-y-auto p-3 custom-scrollbar"
                            >
                                {[
                                    'Nursery', 'LKG', 'UKG', 'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5',
                                    'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10',
                                    'Class 11 (Science)', 'Class 11 (Commerce)', 'Class 11 (Arts)',
                                    'Class 12 (Science)', 'Class 12 (Commerce)', 'Class 12 (Arts)'
                                ].map(cls => (
                                    <div
                                        key={cls}
                                        onClick={() => {
                                            setSelectedClass(cls);
                                            setIsEditMode(true);
                                            setIsDropdownOpen(false);
                                        }}
                                        className={`p-4 mb-1 rounded-2xl cursor-pointer font-bold italic transition-all border-b border-slate-50 last:border-none ${selectedClass === cls ? 'bg-blue-50 text-[#42A5F5]' : 'text-slate-600 hover:bg-slate-50'}`}
                                    >
                                        {cls}
                                    </div>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {selectedClass && (
                <div className="space-y-8">
                    {/* MODE STATUS BOX */}
                    <div className={`p-7 rounded-[3rem] border shadow-md flex items-center justify-between transition-all ${isEditMode ? 'bg-blue-600 border-blue-700 text-white' : 'bg-slate-800 border-slate-900 text-white'}`}>
                        <div className="flex items-center gap-5">
                            {isEditMode ? <Edit3 size={28} className="text-blue-100" /> : <Lock size={28} className="text-slate-400" />}
                            <div>
                                <h2 className="text-2xl font-black italic tracking-tight capitalize">{selectedClass}</h2>
                                <p className={`text-[11px] font-bold uppercase tracking-widest mt-1 ${isEditMode ? 'text-blue-200' : 'text-slate-400'}`}>
                                    {isEditMode ? 'Edit mode: Neural modification active' : 'View mode: Read-only access'}
                                </p>
                            </div>
                        </div>
                        <button onClick={() => { setSelectedClass(''); setFeeData(initialFeesState); }} className="p-4 text-white/50 hover:text-white transition-colors bg-white/10 rounded-2xl border border-white/10"><Trash2 size={22} /></button>
                    </div>

                    {/* FEE CARDS GRID */}
                    <div className="grid grid-cols-1 gap-6">
                        {feeCategories.map((cat) => (
                            <div key={cat.key} className={`p-8 rounded-[3.5rem] border-2 transition-all ${feeData[cat.key].isNone ? 'bg-slate-50 border-slate-200 opacity-40' : 'bg-white border-blue-50 shadow-sm hover:border-[#42A5F5]'}`}>
                                <div className="flex justify-between items-start mb-6">
                                    <div className="flex-1">
                                        <h4 className={`text-[17px] font-black italic capitalize ${feeData[cat.key].isNone ? 'text-slate-400' : 'text-slate-700'}`}>{cat.label}</h4>
                                        <p className="text-[12px] font-bold text-slate-600 mt-1 italic">{cat.desc}</p>
                                    </div>
                                    <div className="flex items-center gap-3 bg-blue-50/50 p-2.5 rounded-[1.5rem] border border-blue-100">
                                        {/* --- CUSTOM BILLING CYCLE DROPDOWN --- */}
                                        <div className="relative">
                                            <button
                                                type="button"
                                                disabled={!isEditMode || feeData[cat.key].isNone}
                                                onClick={() => {
                                                    // Hum state mein us category ki key save karenge jo khuli hai
                                                    setOpenCycleId(openCycleId === cat.key ? null : cat.key);
                                                }}
                                                className="flex items-center gap-1 bg-transparent text-[11px] font-black uppercase text-[#42A5F5] outline-none cursor-pointer border-r border-blue-200 pr-3 disabled:opacity-30"
                                            >
                                                <span>{feeData[cat.key].billingCycle === 'monthly' ? 'Per month' : 'One time'}</span>
                                                <ChevronDown size={10} className={`transition-transform ${openCycleId === cat.key ? 'rotate-180' : ''}`} />
                                            </button>

                                            <AnimatePresence>
                                                {openCycleId === cat.key && (
                                                    <motion.div
                                                        initial={{ opacity: 0, scale: 0.9, y: 10 }}
                                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                                        exit={{ opacity: 0, scale: 0.9, y: 10 }}
                                                        className="absolute right-0 mt-2 w-32 bg-white border border-blue-100 rounded-2xl shadow-xl z-[100] p-1 overflow-hidden"
                                                    >
                                                        <div
                                                            onClick={() => {
                                                                setFeeData({ ...feeData, [cat.key]: { ...feeData[cat.key], billingCycle: 'one-time' } });
                                                                setOpenCycleId(null);
                                                            }}
                                                            className={`p-3 text-[10px] font-black uppercase rounded-xl cursor-pointer transition-all ${feeData[cat.key].billingCycle === 'one-time' ? 'bg-blue-50 text-[#42A5F5]' : 'text-slate-500 hover:bg-slate-50'}`}
                                                        >
                                                            One time
                                                        </div>
                                                        <div
                                                            onClick={() => {
                                                                setFeeData({ ...feeData, [cat.key]: { ...feeData[cat.key], billingCycle: 'monthly' } });
                                                                setOpenCycleId(null);
                                                            }}
                                                            className={`p-3 text-[10px] font-black uppercase rounded-xl cursor-pointer transition-all ${feeData[cat.key].billingCycle === 'monthly' ? 'bg-blue-50 text-[#42A5F5]' : 'text-slate-500 hover:bg-slate-50'}`}
                                                        >
                                                            Per month
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                        <div className="flex items-center gap-2 px-1">
                                            <input
                                                type="checkbox"
                                                disabled={!isEditMode}
                                                checked={feeData[cat.key].isNone}
                                                onChange={(e) => setFeeData({ ...feeData, [cat.key]: { ...feeData[cat.key], isNone: e.target.checked, amount: e.target.checked ? 0 : feeData[cat.key].amount } })}
                                                className="accent-[#42A5F5] w-5 h-5 cursor-pointer disabled:opacity-20"
                                            />
                                            <label className="text-[11px] font-black text-slate-500 uppercase italic">None</label>
                                        </div>
                                    </div>
                                </div>

                                <div className={`relative rounded-[2rem] overflow-hidden transition-all ${feeData[cat.key].isNone ? 'bg-slate-100' : 'bg-slate-50 shadow-inner border border-slate-100'}`}>
                                    <span className="absolute left-6 top-1/2 -translate-y-1/2 text-[#42A5F5] font-black italic text-2xl">₹</span>
                                    <input
                                        type="number"
                                        disabled={!isEditMode || feeData[cat.key].isNone}
                                        value={feeData[cat.key].amount === 0 ? '' : feeData[cat.key].amount}
                                        onFocus={(e) => { if (isEditMode && feeData[cat.key].amount === 0) setFeeData({ ...feeData, [cat.key]: { ...feeData[cat.key], amount: '' } }) }}
                                        onBlur={(e) => { if (isEditMode && e.target.value === '') setFeeData({ ...feeData, [cat.key]: { ...feeData[cat.key], amount: 0 } }) }}
                                        onChange={(e) => setFeeData({ ...feeData, [cat.key]: { ...feeData[cat.key], amount: e.target.value === '' ? 0 : Number(e.target.value) } })}
                                        className="w-full bg-transparent p-7 pl-16 outline-none text-3xl font-black italic text-slate-700 placeholder:text-slate-300"
                                        placeholder={isEditMode ? "0000" : "N/A"}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* COMMIT BUTTON */}
                    {isEditMode && (
                        <button
                            onClick={handleSave}
                            disabled={loading}
                            className="fixed bottom-10 left-1/2 -translate-x-1/2 w-[92%] bg-gradient-to-r from-[#42A5F5] to-blue-600 text-white py-7 rounded-[2.5rem] font-black uppercase text-[16px] tracking-widest shadow-[0_20px_50px_rgba(66,165,245,0.4)] z-50 flex items-center justify-center gap-4 active:scale-95 transition-all italic border-t border-white/20"
                        >
                            {loading ? "Transmitting structure..." : <><Save size={26} /> Commit structure</>}
                        </button>
                    )}
                </div>
            )}

            {/* Success Toast */}
            {successMsg && (
                <div className="fixed top-10 left-1/2 -translate-x-1/2 bg-emerald-500 text-white px-12 py-5 rounded-full font-black text-[14px] uppercase tracking-widest shadow-2xl z-[100] flex items-center gap-4 animate-bounce italic border-2 border-white/20">
                    <CheckCircle2 size={24} /> {successMsg}
                </div>
            )}
        </div>
    );
};

export default FeeSetup;