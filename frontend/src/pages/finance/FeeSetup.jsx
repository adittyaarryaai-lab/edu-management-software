import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, Layers, CheckCircle2, Edit3, Trash2, Eye, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import API from '../../api';

const FeeSetup = () => {
    const navigate = useNavigate();
    const [selectedClass, setSelectedClass] = useState('');
    const [loading, setLoading] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');
    const [configuredList, setConfiguredList] = useState([]);
    const [isEditMode, setIsEditMode] = useState(true); // Control Edit vs View

    // --- FEE TYPES LIST ---
    const feeCategories = [
        { key: 'admissionFees', label: '1. Admission Fees', desc: 'One-time fee at joining' },
        { key: 'registrationFees', label: '2. Registration Fees', desc: 'Paid while applying admission' },
        { key: 'securityFees', label: '3. Security Fees', desc: 'Refundable deposit' },
        { key: 'tuitionFees', label: '4. Tuition Fees', desc: 'Main academic fee (monthly)' },
        { key: 'examinationFees', label: '6. Examination Fees', desc: 'Charged during exams' },
        { key: 'libraryFees', label: '7. Library Fees', desc: 'Library resources' },
        { key: 'laboratoryFees', label: '8. Laboratory Fees', desc: 'Science/Computer labs' },
        { key: 'activityFees', label: '9. Activity Fees', desc: 'Sports, events, etc.' },
        { key: 'developmentFees', label: '10. Development Fees', desc: 'Infrastructure' },
        { key: 'annualCharges', label: '11. Annual Charges', desc: 'Yearly maintenance' },
        { key: 'smartClassFees', label: '12. Smart Class Fees', desc: 'Digital learning' },
        { key: 'uniformFees', label: '13. Uniform Fees', desc: 'School uniform' },
        { key: 'booksStationeryFees', label: '14. Books & Stationery', desc: 'Study material' },
        { key: 'idCardFees', label: '15. ID Card Fees', desc: 'Student identification' },
        { key: 'lateFees', label: '16. Late Fees / Fine', desc: 'Delayed payment charge' },
        { key: 'readmissionFees', label: '17. Re-admission Fees', desc: 'Rejoining student' },
        { key: 'miscellaneousCharges', label: '18. Misc Charges', desc: 'Extra trips, etc.' }
    ];

    // Update initial state logic
    const initialFeesState = feeCategories.reduce((acc, cat) => {
        // Default logic: Tuition/Library/Lab/Activity/SmartClass ko monthly baaki ko one-time
        const isDefaultMonthly = ['tuitionFees', 'libraryFees', 'laboratoryFees', 'activityFees', 'smartClassFees'].includes(cat.key);
        acc[cat.key] = { amount: 0, isNone: false, billingCycle: isDefaultMonthly ? 'monthly' : 'one-time' };
        return acc;
    }, {});

    const [feeData, setFeeData] = useState(initialFeesState);

    const fetchConfiguredList = async () => {
        try {
            const { data } = await API.get('/fees/structure/list/all');
            setConfiguredList(data);
        } catch (err) { console.error("List Fetch Error"); }
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
                    setIsEditMode(true); // Nayi class ke liye hamesha edit mode
                }
            } catch (err) { console.error("Fetch Error"); }
        };
        fetchStructure();
    }, [selectedClass]);

    const handleSave = async () => {
        if (!selectedClass) return alert("Select Class first!");
        setLoading(true);
        try {
            await API.post('/fees/structure/update', {
                className: selectedClass,
                fees: feeData
            });
            setSuccessMsg(`${selectedClass} Structure Locked! ⚡`);
            setSelectedClass('');
            setFeeData(initialFeesState);
            fetchConfiguredList();
            setTimeout(() => setSuccessMsg(''), 3000);
        } catch (err) { alert("Sync Failed."); } finally { setLoading(false); }
    };

    return (
        <div className="min-h-screen bg-void text-white p-5 pb-32 italic font-sans">
            <div className="flex items-center gap-4 mb-10 border-l-4 border-neon pl-4">
                <button onClick={() => navigate(-1)} className="p-2 bg-white/5 rounded-xl border border-white/10 active:scale-90 transition-all">
                    <ArrowLeft size={20} className="text-neon" />
                </button>
                <h1 className="text-xl font-black uppercase tracking-tighter">Fees Details Setup</h1>
            </div>

            {/* --- CONFIGURED CLASSES INVENTORY --- */}
            <div className="mb-10 space-y-4">
                <h3 className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] ml-2 italic">Configured Nodes</h3>
                <div className="grid grid-cols-1 gap-3">
                    {configuredList.length > 0 ? configuredList.map((item, idx) => (
                        <div key={idx} className="bg-slate-900/40 p-5 rounded-[2rem] border border-white/5 flex justify-between items-center group hover:border-neon/30 transition-all">
                            {/* View Action (List Click) */}
                            <div className="flex items-center gap-4 cursor-pointer flex-1" onClick={() => { setSelectedClass(item.className); setIsEditMode(false); }}>
                                <div className="bg-neon/10 p-3 rounded-xl text-neon"><Layers size={16} /></div>
                                <div>
                                    <p className="text-xs font-black uppercase italic text-white group-hover:text-neon transition-colors">{item.className}</p>
                                    <p className="text-[7px] text-emerald-400 font-bold uppercase tracking-widest flex items-center gap-1 mt-1">
                                        <Eye size={8} /> View Record
                                    </p>
                                </div>
                            </div>
                            {/* Edit Action (Button Click) */}
                            <button onClick={() => { setSelectedClass(item.className); setIsEditMode(true); }} className="p-3 bg-white/5 rounded-xl border border-white/10 text-white/40 hover:text-neon hover:border-neon transition-all">
                                <Edit3 size={14} />
                            </button>
                        </div>
                    )) : (
                        <p className="text-[8px] font-black text-white/10 uppercase text-center py-4 italic">No Classes Defined Yet</p>
                    )}
                </div>
            </div>

            {/* Class Selector Dropdown */}
            <div className="bg-slate-900/60 p-6 rounded-[2.5rem] border border-white/5 mb-8 shadow-2xl">
                <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] mb-4 italic">Initialize New Class Structure</p>
                <select
                    value={selectedClass}
                    onChange={(e) => { setSelectedClass(e.target.value); setIsEditMode(true); }}
                    className="w-full bg-void border border-neon/20 p-5 rounded-3xl text-sm font-black text-neon uppercase outline-none focus:border-neon transition-all appearance-none cursor-pointer"
                >
                    <option value="">-- CHOOSE CLASS --</option>
                    {[
                        'Nursery', 'LKG', 'UKG', 'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5',
                        'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10',
                        'Class 11 (Science)', 'Class 11 (Commerce)', 'Class 11 (Arts)',
                        'Class 12 (Science)', 'Class 12 (Commerce)', 'Class 12 (Arts)'
                    ].map(cls => <option key={cls} value={cls}>{cls}</option>)}
                </select>
            </div>

            {selectedClass && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-5 duration-500">
                    <div className={`p-6 rounded-[2.5rem] border flex items-center justify-between ${isEditMode ? 'bg-neon/5 border-neon/20' : 'bg-slate-900/80 border-white/10'}`}>
                        <div className="flex items-center gap-4">
                            {isEditMode ? <Edit3 size={24} className="text-neon" /> : <Lock size={24} className="text-white/40" />}
                            <div>
                                <h2 className="text-lg font-black uppercase italic tracking-tighter text-white">{selectedClass}</h2>
                                <p className="text-[9px] font-black text-white/30 uppercase tracking-widest italic">
                                    {isEditMode ? 'Edit Mode: Neural Modification Active' : 'View Mode: Read-Only Access'}
                                </p>
                            </div>
                        </div>
                        <button onClick={() => { setSelectedClass(''); setFeeData(initialFeesState); }} className="p-2 text-white/20 hover:text-rose-500 transition-colors"><Trash2 size={20} /></button>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        {feeCategories.map((cat) => (
                            <div key={cat.key} className={`p-6 rounded-[2.5rem] border transition-all ${feeData[cat.key].isNone ? 'bg-white/5 border-white/5 opacity-40' : 'bg-slate-900/40 border-white/10 shadow-xl'}`}>
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h4 className="text-xs font-black uppercase tracking-tight text-white/80 italic">{cat.label}</h4>
                                        <p className="text-[8px] font-bold text-white/20 uppercase mt-0.5 italic">{cat.desc}</p>
                                    </div>
                                    <div className="flex items-center gap-3 bg-void/50 p-2 rounded-xl border border-white/5">
                                    <select
                                        disabled={!isEditMode || feeData[cat.key].isNone}
                                        value={feeData[cat.key].billingCycle || 'one-time'}
                                        onChange={(e) => setFeeData({ ...feeData, [cat.key]: { ...feeData[cat.key], billingCycle: e.target.value } })}
                                        className="bg-transparent text-[8px] font-black uppercase text-neon outline-none cursor-pointer border-r border-white/10 pr-2"
                                    >
                                        <option value="one-time">One Time</option>
                                        <option value="monthly">Per Month</option>
                                    </select>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            disabled={!isEditMode}
                                            checked={feeData[cat.key].isNone}
                                            onChange={(e) => setFeeData({ ...feeData, [cat.key]: { ...feeData[cat.key], isNone: e.target.checked, amount: e.target.checked ? 0 : feeData[cat.key].amount } })}
                                            className="accent-neon w-3 h-3 cursor-pointer disabled:opacity-20"
                                        />
                                        <label className="text-[8px] font-black text-white/40 uppercase cursor-pointer italic">None</label>
                                    </div>
                                    </div>
                                </div>

                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neon/40 font-black italic text-lg">₹</span>
                                    <input
                                        type="number"
                                        disabled={!isEditMode || feeData[cat.key].isNone}
                                        value={feeData[cat.key].amount === 0 ? '' : feeData[cat.key].amount}
                                        onFocus={(e) => { if (isEditMode && feeData[cat.key].amount === 0) setFeeData({ ...feeData, [cat.key]: { ...feeData[cat.key], amount: '' } }) }}
                                        onBlur={(e) => { if (isEditMode && e.target.value === '') setFeeData({ ...feeData, [cat.key]: { ...feeData[cat.key], amount: 0 } }) }}
                                        onChange={(e) => setFeeData({ ...feeData, [cat.key]: { ...feeData[cat.key], amount: e.target.value === '' ? 0 : Number(e.target.value) } })}
                                        className="w-full bg-void/80 border border-white/5 p-4 pl-10 rounded-2xl outline-none text-sm font-black italic focus:border-neon transition-all disabled:opacity-50"
                                        placeholder={isEditMode ? "ENTER AMOUNT" : "NOT SET"}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Commit Button - Only shows in Edit Mode */}
                    {isEditMode && (
                        <button
                            onClick={handleSave}
                            disabled={loading}
                            className="fixed bottom-10 left-1/2 -translate-x-1/2 w-[90%] bg-neon text-void py-6 rounded-[2.5rem] font-black uppercase text-xs tracking-[0.3em] shadow-[0_0_50px_rgba(34,211,238,0.4)] z-50 flex items-center justify-center gap-3 active:scale-95 transition-all italic"
                        >
                            {loading ? "Transmitting Protocol..." : <><Save size={20} strokeWidth={3} /> Commit Structure</>}
                        </button>
                    )}
                </div>
            )}

            {successMsg && (
                <div className="fixed top-10 left-1/2 -translate-x-1/2 bg-emerald-500 text-void px-8 py-4 rounded-full font-black text-[10px] uppercase tracking-widest shadow-2xl z-[100] flex items-center gap-3 animate-bounce italic">
                    <CheckCircle2 size={16} /> {successMsg}
                </div>
            )}
        </div>
    );
};

export default FeeSetup;