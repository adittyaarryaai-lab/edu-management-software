import React, { useState } from 'react';
import { ArrowLeft, UserPlus, Zap, Eye, EyeOff, PlusCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import Toast from '../components/Toast';
import { AnimatePresence, motion } from 'framer-motion';

const handleDateTyping = (e) => {
    let val = e.target.value.replace(/\D/g, ""); // Sirf numbers allowed
    if (val.length > 8) val = val.slice(0, 8);

    // Auto-format: DD/MM/YYYY
    let formatted = val;
    if (val.length > 2) formatted = val.slice(0, 2) + "/" + val.slice(2);
    if (val.length > 4) formatted = formatted.slice(0, 5) + "/" + formatted.slice(5);

    // Backend compatibility (YYYY-MM-DD)
    if (val.length === 8) {
        const d = val.slice(0, 2);
        const m = val.slice(2, 4);
        const y = val.slice(4, 8);
        setStudentData({ ...studentData, dob: `${y}-${m}-${d}` });
    }
};
const AddStudent = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [showPass, setShowPass] = useState(false);
    const [isGenderOpen, setIsGenderOpen] = useState(false);
    const [confirmPass, setConfirmPass] = useState(''); // Confirm password track karne ke liye
    const [msg, setMsg] = useState('');
    const [studentData, setStudentData] = useState({
        name: '', email: '', password: '', grade: '',
        fatherName: '', motherName: '', dob: '', gender: 'Male', religion: '', admissionNo: '',
        phone: '', address: { pincode: '', district: '', state: '', fullAddress: '' }
    });

    const [dobParts, setDobParts] = useState({ dd: '', mm: '', yyyy: '' });

    const handlePartChange = (part, value) => {
        // Sirf numbers allowed aur length check
        const val = value.replace(/\D/g, "");
        const updatedParts = { ...dobParts, [part]: val };
        setDobParts(updatedParts);

        // Agar teeno fill ho jayein toh main studentData update karo (YYYY-MM-DD)
        if (updatedParts.dd.length === 2 && updatedParts.mm.length === 2 && updatedParts.yyyy.length === 4) {
            setStudentData({
                ...studentData,
                dob: `${updatedParts.yyyy}-${updatedParts.mm}-${updatedParts.dd}`
            });
        }
    };

    const handleAddStudent = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const currentUser = JSON.parse(localStorage.getItem('user'));
            const processedData = {
                ...studentData,
                role: 'student',
                schoolId: currentUser?.schoolId
            };

            const { data } = await API.post('/auth/register', processedData);
            setMsg(`Student enrolled: ID ${data.generatedId} ⚡`);
            setTimeout(() => navigate('/admin/manage-users'), 2000);
        } catch (err) {
            alert(err.response?.data?.message || "Error adding student");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] pb-24 font-sans italic text-slate-800 text-[15px] overflow-x-hidden overscroll-none fixed inset-0 overflow-y-auto">
            <div className="bg-[#42A5F5] px-6 pt-12 pb-24 rounded-b-[4rem] shadow-xl relative z-10">
                <button onClick={() => navigate(-1)} className="p-3 bg-white rounded-2xl text-[#42A5F5] shadow-md active:scale-95 transition-all mb-8">
                    <ArrowLeft size={24} />
                </button>
                <div className="text-center text-white">
                    <h1 className="text-3xl font-black italic tracking-tight uppercase">Create student access link</h1>
                    <p className="text-[15px] font-black uppercase tracking-widest opacity-60 mt-1">Enroll new student</p>
                </div>
            </div>

            <div className="px-6 -mt-10 relative z-20">
                <form onSubmit={handleAddStudent} className="bg-white p-8 rounded-[3rem] shadow-xl border border-[#DDE3EA] space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1">
                            <label className="text-[19px] text-slate-700 ml-4 font-black uppercase">Full name</label>
                            <input type="text" placeholder="e.g. Rahul Kumar" className="w-full p-5 bg-slate-50 rounded-2xl border border-slate-200 outline-none text-[19px] font-bold text-slate-700 focus:border-[#42A5F5] uppercase"
                                onChange={(e) => setStudentData({ ...studentData, name: e.target.value })} required />
                        </div>

                        <div className="space-y-1">
                            <label className="text-[19px] text-slate-700 ml-4 font-black uppercase">School email</label>
                            <input type="email" placeholder="student@school.edu" className="w-full p-5 bg-slate-50 rounded-2xl border border-slate-200 outline-none text-[19px] font-bold text-slate-700 focus:border-[#42A5F5]"
                                onChange={(e) => setStudentData({ ...studentData, email: e.target.value })} required />
                        </div>

                        {/* --- PASSWORD MATRIX --- */}
                        <div className="space-y-6 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">

                            {/* 1. Main Password Box */}
                            <div className="space-y-1">
                                <label className="text-[19px] text-slate-700 ml-4 font-black uppercase italic">Password</label>
                                <div className="relative group">
                                    <input
                                        type={showPass ? "text" : "password"}
                                        placeholder="••••••••"
                                        className="w-full p-5 pr-14 bg-slate-50 rounded-2xl border border-slate-200 outline-none text-[19px] font-bold text-slate-700 focus:border-[#42A5F5] italic transition-all"
                                        onChange={(e) => setStudentData({ ...studentData, password: e.target.value })}
                                        required
                                    />
                                    {/* Eye Icon Button */}
                                    <button
                                        type="button"
                                        onClick={() => setShowPass(!showPass)}
                                        className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#42A5F5] transition-colors"
                                    >
                                        {showPass ? <EyeOff size={22} /> : <Eye size={22} />}
                                    </button>
                                </div>
                            </div>

                            {/* 2. Confirm Password Box */}
                            <div className="space-y-1">
                                <label className="text-[19px] text-slate-700 ml-4 font-black uppercase italic">Confirm password</label>
                                <div className="relative">
                                    <input
                                        type={showPass ? "text" : "password"}
                                        placeholder="••••••••"
                                        className={`w-full p-5 bg-slate-50 rounded-2xl border outline-none text-[19px] font-bold text-slate-700 italic transition-all ${confirmPass && studentData.password !== confirmPass
                                            ? 'border-rose-400 focus:border-rose-500'
                                            : 'border-slate-200 focus:border-[#42A5F5]'
                                            }`}
                                        value={confirmPass}
                                        onChange={(e) => setConfirmPass(e.target.value)}
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPass(!showPass)}
                                        className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#42A5F5] transition-colors"
                                    >
                                        {showPass ? <EyeOff size={22} /> : <Eye size={22} />}
                                    </button>
                                    {/* Validation Message */}
                                    {confirmPass && studentData.password !== confirmPass && (
                                        <p className="text-[11px] text-rose-500 font-black uppercase mt-1 ml-4 italic">Password do not match! ⚠️</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-[19px] text-slate-700 ml-4 font-black uppercase">Mobile No.</label>
                            <input type="text" placeholder="10 Digit Number" className="w-full p-5 bg-slate-50 rounded-2xl border border-slate-200 outline-none text-[19px] font-bold text-slate-700 focus:border-[#42A5F5]"
                                onChange={(e) => setStudentData({ ...studentData, phone: e.target.value })} required />
                        </div>

                        <div className="space-y-1">
                            <label className="text-[19px] text-slate-700 ml-4 font-black uppercase">Class</label>
                            <input type="text" placeholder="e.g. 10-A" className="w-full p-5 bg-slate-50 rounded-2xl border border-slate-200 outline-none text-[19px] font-bold text-slate-700 focus:border-[#42A5F5] uppercase"
                                onChange={(e) => setStudentData({ ...studentData, grade: e.target.value })} required />
                        </div>

                        <div className="space-y-1">
                            <label className="text-[19px] text-slate-700 ml-4 font-black uppercase">Admission number</label>
                            <input type="text" placeholder="ADM-2026-001" className="w-full p-5 bg-slate-50 rounded-2xl border border-slate-200 outline-none text-[19px] font-bold text-slate-700 focus:border-[#42A5F5] uppercase"
                                onChange={(e) => setStudentData({ ...studentData, admissionNo: e.target.value })} required />
                        </div>

                        <div className="space-y-1">
                            <label className="text-[19px] text-slate-700 ml-4 font-black uppercase">Father's name</label>
                            <input type="text" placeholder="Full Name" className="w-full p-5 bg-slate-50 rounded-2xl border border-slate-200 outline-none text-[19px] font-bold text-slate-700 focus:border-[#42A5F5] uppercase"
                                onChange={(e) => setStudentData({ ...studentData, fatherName: e.target.value })} required />
                        </div>

                        <div className="space-y-1">
                            <label className="text-[19px] text-slate-700 ml-4 font-black uppercase">Mother's name</label>
                            <input type="text" placeholder="Full Name" className="w-full p-5 bg-slate-50 rounded-2xl border border-slate-200 outline-none text-[19px] font-bold text-slate-700 focus:border-[#42A5F5] uppercase"
                                onChange={(e) => setStudentData({ ...studentData, motherName: e.target.value })} required />
                        </div>

                        <div className="space-y-1 md:col-span-2">
                            {/* Label: 19px, Black, Sentence Case */}
                            <label className="text-[19px] text-slate-700 ml-4 font-black uppercase italic">
                                Date of birth
                            </label>

                            <div className="grid grid-cols-3 gap-4">
                                {/* DATE BOX */}
                                <div className="space-y-1">
                                    <input
                                        type="text"
                                        placeholder="DD"
                                        maxLength="2"
                                        className="w-full p-5 bg-slate-50 rounded-2xl border border-slate-200 outline-none text-[19px] font-bold text-slate-700 focus:border-[#42A5F5] text-center italic"
                                        value={dobParts.dd}
                                        onChange={(e) => handlePartChange('dd', e.target.value)}
                                        required
                                    />
                                </div>

                                {/* MONTH BOX */}
                                <div className="space-y-1">
                                    <input
                                        type="text"
                                        placeholder="MM"
                                        maxLength="2"
                                        className="w-full p-5 bg-slate-50 rounded-2xl border border-slate-200 outline-none text-[19px] font-bold text-slate-700 focus:border-[#42A5F5] text-center italic"
                                        value={dobParts.mm}
                                        onChange={(e) => handlePartChange('mm', e.target.value)}
                                        required
                                    />
                                </div>

                                {/* YEAR BOX */}
                                <div className="space-y-1">
                                    <input
                                        type="text"
                                        placeholder="YYYY"
                                        maxLength="4"
                                        className="w-full p-5 bg-slate-50 rounded-2xl border border-slate-200 outline-none text-[19px] font-bold text-slate-700 focus:border-[#42A5F5] text-center italic"
                                        value={dobParts.yyyy}
                                        onChange={(e) => handlePartChange('yyyy', e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            <p className="text-[14px] text-slate-700 ml-4 font-bold uppercase italic mt-1">Enter day, month, and year</p>
                        </div>

                        {/* --- MANUAL GENDER SELECTION MATRIX --- */}
                        <div className="space-y-1 relative">
                            {/* Label: 19px, Black, Sentence Case */}
                            <label className="text-[19px] text-slate-700 ml-4 font-black uppercase italic">
                                Gender
                            </label>

                            {/* Custom Trigger Button */}
                            <div
                                onClick={() => setIsGenderOpen(!isGenderOpen)}
                                className="w-full p-5 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between cursor-pointer active:scale-95 transition-all"
                            >
                                <span className="text-[19px] font-bold text-slate-400 italic uppercase">
                                    {studentData.gender || "Select gender"}
                                </span>
                                <div className={`transition-transform duration-300 ${isGenderOpen ? 'rotate-180' : 'rotate-0'}`}>
                                    <PlusCircle size={20} className="text-[#42A5F5]" />
                                </div>
                            </div>

                            {/* Custom Manual Dropdown Menu */}
                            <AnimatePresence>
                                {isGenderOpen && (
                                    <>
                                        {/* Overlay to close menu when clicking outside */}
                                        <div
                                            className="fixed inset-0 z-[110]"
                                            onClick={() => setIsGenderOpen(false)}
                                        />

                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className="absolute left-0 right-0 top-[110%] z-[120] bg-white border border-blue-100 rounded-[2rem] shadow-2xl overflow-hidden"
                                        >
                                            {["Male", "Female", "Other"].map((option) => (
                                                <div
                                                    key={option}
                                                    onClick={() => {
                                                        setStudentData({ ...studentData, gender: option });
                                                        setIsGenderOpen(false);
                                                    }}
                                                    className={`p-5 text-[15px] font-black italic uppercase transition-all cursor-pointer border-b border-slate-50 last:border-none
                                ${studentData.gender === option ? 'bg-blue-50 text-[#42A5F5]' : 'text-slate-600 hover:bg-slate-50'}
                            `}
                                                >
                                                    {option}
                                                </div>
                                            ))}
                                        </motion.div>
                                    </>
                                )}
                            </AnimatePresence>
                        </div>

                        <div className="space-y-1">
                            <label className="text-[19px] text-slate-700 ml-4 font-black uppercase">Religion</label>
                            <input type="text" placeholder="e.g. Hindu" className="w-full p-5 bg-slate-50 rounded-2xl border border-slate-200 outline-none text-[19px] font-bold text-slate-700 focus:border-[#42A5F5] uppercase"
                                onChange={(e) => setStudentData({ ...studentData, religion: e.target.value })} required />
                        </div>

                        <div className="md:col-span-2 space-y-1">
                            <label className="text-[19px] text-slate-700 ml-4 font-black uppercase">Full address</label>
                            <textarea placeholder="House No, Street, Landmark..." className="w-full p-5 bg-slate-50 rounded-3xl border border-slate-200 outline-none text-[19px] font-bold text-slate-700 focus:border-[#42A5F5] uppercase h-24"
                                onChange={(e) => setStudentData({ ...studentData, address: { ...studentData.address, fullAddress: e.target.value } })} required />
                        </div>

                        {/* --- HORIZONTAL LONG ADDRESS NODES --- */}
                        <div className="md:col-span-2 space-y-6">

                            {/* 1. PINCODE NODE */}
                            <div className="space-y-1">
                                <label className="text-[19px] text-slate-700 ml-4 font-black uppercase italic">Pincode</label>
                                <input
                                    type="text"
                                    placeholder="6 Digit Pincode"
                                    maxLength="6"
                                    className="w-full p-5 bg-slate-50 rounded-2xl border border-slate-200 outline-none text-[19px] font-bold text-slate-700 focus:border-[#42A5F5] italic transition-all"
                                    onChange={(e) => setStudentData({ ...studentData, address: { ...studentData.address, pincode: e.target.value } })}
                                    required
                                />
                            </div>

                            {/* 2. DISTRICT NODE */}
                            <div className="space-y-1">
                                <label className="text-[19px] text-slate-700 ml-4 font-black uppercase italic">District</label>
                                <input
                                    type="text"
                                    placeholder="District Name"
                                    className="w-full p-5 bg-slate-50 rounded-2xl border border-slate-200 outline-none text-[19px] font-bold text-slate-700 focus:border-[#42A5F5] uppercase italic transition-all"
                                    onChange={(e) => setStudentData({ ...studentData, address: { ...studentData.address, district: e.target.value } })}
                                    required
                                />
                            </div>

                            {/* 3. STATE NODE */}
                            <div className="space-y-1">
                                <label className="text-[19px] text-slate-700 ml-4 font-black uppercase italic">State</label>
                                <input
                                    type="text"
                                    placeholder="State Name"
                                    className="w-full p-5 bg-slate-50 rounded-2xl border border-slate-200 outline-none text-[19px] font-bold text-slate-700 focus:border-[#42A5F5] uppercase italic transition-all"
                                    onChange={(e) => setStudentData({ ...studentData, address: { ...studentData.address, state: e.target.value } })}
                                    required
                                />
                            </div>

                        </div>
                    </div>

                    <button type="submit" disabled={loading} className="w-full bg-[#42A5F5] text-white py-6 rounded-[2.5rem] font-black text-[16px] uppercase shadow-xl shadow-blue-100 active:scale-95 transition-all mt-6">
                        {loading ? "Transmitting data..." : "Sync student link"}
                    </button>
                </form>
            </div >
            {msg && <Toast message={msg} onClose={() => setMsg('')} />}
        </div >
    );
};

export default AddStudent;