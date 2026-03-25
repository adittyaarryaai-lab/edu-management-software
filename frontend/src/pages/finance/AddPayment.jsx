import React, { useState, useEffect } from 'react';
import { IndianRupee, User, Calendar, CreditCard, Zap, Layers, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import API from '../../api';
import Toast from '../../components/Toast';

const AddPayment = () => {
    const navigate = useNavigate();
    const [msg, setMsg] = useState('');
    const [classes, setClasses] = useState([]);
    const [students, setStudents] = useState([]);
    const [activeFields, setActiveFields] = useState([]);

    const [formData, setFormData] = useState({
        grade: '',
        enrollmentNo: '',
        paymentMode: 'Cash',
        feeCategory: '', // can be single or 'ALL'
        amountPaid: '',
        day: new Date().getDate(),
        month: new Date().toLocaleString('default', { month: 'long' }),
        year: new Date().getFullYear(),
        remarks: ''
    });

    useEffect(() => {
        const fetchClasses = async () => {
            const { data } = await API.get('/fees/setup/classes');
            setClasses(data);
        };
        fetchClasses();
    }, []);

    // 1. Jab Class select ho
    const handleClassChange = async (grade) => {
        setFormData({ ...formData, grade, studentId: '', feeCategory: '' });
        const resStudents = await API.get(`/fees/setup/students/${grade}`);
        setStudents(resStudents.data);
        const resFields = await API.get(`/fees/setup/fields/${grade}`);
        setActiveFields(resFields.data);
    };

    const handleAllSelect = () => {
        const total = activeFields.reduce((sum, f) => sum + f.amount, 0);
        setFormData({ ...formData, feeCategory: 'ALL', amountPaid: total, remarks: 'Full Settlement' });
    };

    const handlePayment = async (e) => {
        e.preventDefault();
        try {
            const { data } = await API.post('/users/finance/add-payment', formData);
            setMsg("Payment Synchronized! ✅");
            setTimeout(() => navigate(`/finance/receipt/${data.feeRecord._id}`), 2000);
        } catch (err) { alert("Failed to log payment"); }
    };

    return (
        <div className="min-h-screen bg-[#0B0F14] text-white font-sans pb-32 px-5 pt-10 italic">
            <h1 className="text-xl font-black uppercase tracking-widest mb-8 border-l-4 border-cyan-400 pl-4">Fee Entry Terminal</h1>

            <form onSubmit={handlePayment} className="space-y-6">

                {/* STEP 1: CLASS SELECTION */}
                <div className="bg-slate-900/60 p-6 rounded-[2.5rem] border border-white/5 shadow-xl">
                    <label className="text-[10px] font-bold text-white/40 uppercase ml-4 flex items-center gap-1"><Layers size={10} /> 1. Select Class</label>
                    <select
                        className="w-full bg-[#0B0F14] p-4 mt-2 rounded-2xl border border-white/5 text-sm text-cyan-400 font-black outline-none"
                        onChange={(e) => handleClassChange(e.target.value)}
                        required
                    >
                        <option value="">-- CHOOSE CLASS --</option>
                        {classes.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>

                {formData.grade && (
                    <>
                        {/* STEP 2: STUDENT SELECTION */}
                        <div className="bg-slate-900/60 p-6 rounded-[2.5rem] border border-white/5 shadow-xl">
                            <label className="text-[10px] font-bold text-white/40 uppercase ml-4 flex items-center gap-1"><User size={10} /> 2. Select Student</label>
                            <select
                                className="w-full bg-[#0B0F14] p-4 mt-2 rounded-2xl border border-white/5 text-sm text-white font-black outline-none"
                                value={formData.enrollmentNo}
                                onChange={(e) => setFormData({ ...formData, enrollmentNo: e.target.value })}
                                required
                            >
                                <option value="">-- CHOOSE STUDENT --</option>
                                {students.map(s => (
                                    // Value mein s.enrollmentNo jayega backend ke liye
                                    <option key={s._id} value={s.enrollmentNo}>
                                        {s.enrollmentNo} - {s.name.toUpperCase()}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* STEP 3: PAYMENT MODE */}
                        <div className="bg-slate-900/40 p-6 rounded-[2.5rem] border border-white/5 shadow-xl">
                            <label className="text-[10px] font-bold text-white/40 uppercase ml-4 flex items-center gap-1"><CreditCard size={10} /> 3. Payment Method</label>
                            <div className="flex gap-2 mt-2">
                                {['Cash', 'Online', 'Bank'].map(mode => (
                                    <button
                                        key={mode} type="button"
                                        onClick={() => setFormData({ ...formData, paymentMode: mode })}
                                        className={`flex-1 py-4 rounded-xl text-[10px] font-black uppercase transition-all ${formData.paymentMode === mode ? 'bg-cyan-400 text-black shadow-lg' : 'bg-white/5 text-white/40'}`}
                                    >
                                        {mode}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* STEP 4: FEE PURPOSE & AMOUNT */}
                        <div className="bg-slate-900/60 p-6 rounded-[2.5rem] border border-white/5 shadow-xl space-y-4">
                            <div className="flex justify-between items-center">
                                <label className="text-[10px] font-bold text-white/40 uppercase ml-4 flex items-center gap-1"><Zap size={10} /> 4. Fee Purpose</label>
                                <button type="button" onClick={handleAllSelect} className="text-[8px] font-black text-cyan-400 border border-cyan-400/30 px-3 py-1 rounded-full uppercase hover:bg-cyan-400 hover:text-black">Select All Fields</button>
                            </div>

                            {/* // AddPayment.jsx mein Fee Purpose ka select dropdown update karo */}
                            <select
                                className="w-full bg-[#0B0F14] p-4 rounded-2xl border border-white/5 text-xs text-cyan-400 font-bold outline-none"
                                // Yahan hum state se wahi key nikalenge jo label se match kare
                                value={activeFields.find(f => f.label === formData.feeCategory)?.key || formData.feeCategory}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    const selected = activeFields.find(f => f.key === val);

                                    setFormData({
                                        ...formData,
                                        // Database mein 'label' jaye (e.g. ADMISSION FEES)
                                        feeCategory: selected ? selected.label : val,
                                        amountPaid: selected ? selected.amount : ''
                                    });
                                }}
                                required
                            >
                                <option value="">-- CHOOSE FEE TYPE --</option>
                                <option value="ALL" className="font-black text-white bg-cyan-900">ALL (FULL SETTLEMENT)</option>
                                {activeFields.map(f => (
                                    <option key={f.key} value={f.key}>
                                        {f.label} - ₹{f.amount}
                                    </option>
                                ))}
                            </select>

                            <div className="relative mt-4">
                                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-cyan-400 font-black text-lg">₹</div>
                                <input
                                    type="number"
                                    placeholder="Enter Amount"
                                    className="w-full bg-[#0B0F14] p-5 pl-10 rounded-2xl border border-white/5 text-xl text-white font-black outline-none focus:border-cyan-400 transition-all"
                                    value={formData.amountPaid}
                                    onChange={(e) => setFormData({ ...formData, amountPaid: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        {/* STEP 5: DATE LOGISTICS */}
                        <div className="grid grid-cols-3 gap-3">
                            <input type="number" placeholder="Day" className="bg-[#0B0F14] p-4 rounded-2xl border border-white/5 text-xs font-bold text-center" value={formData.day} onChange={(e) => setFormData({ ...formData, day: e.target.value })} />
                            <select className="bg-[#0B0F14] p-4 rounded-2xl border border-white/5 text-xs font-bold" value={formData.month} onChange={(e) => setFormData({ ...formData, month: e.target.value })}>
                                {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map(m => <option key={m} value={m}>{m}</option>)}
                            </select>
                            <input type="number" placeholder="Year" className="bg-[#0B0F14] p-4 rounded-2xl border border-white/5 text-xs font-bold text-center" value={formData.year} onChange={(e) => setFormData({ ...formData, year: e.target.value })} />
                        </div>

                        <button type="submit" className="w-full bg-cyan-400 text-black py-6 rounded-[2rem] font-black text-xs uppercase shadow-[0_0_30px_rgba(61,242,224,0.2)] active:scale-95 transition-all mt-4">
                            Finalize & Record Ledger
                        </button>
                    </>
                )}
            </form>
            {msg && <Toast message={msg} onClose={() => setMsg('')} />}
        </div>
    );
};

export default AddPayment;