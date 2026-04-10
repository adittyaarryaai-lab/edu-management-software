import React, { useState } from 'react';
import { ArrowLeft, UserCheck, Zap, PlusCircle, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import Toast from '../components/Toast';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect } from 'react';

const AddTeacher = () => {
    const navigate = useNavigate();
    const [showPass, setShowPass] = useState(false);
    const [confirmPass, setConfirmPass] = useState(''); // Confirm password track karne ke liye
    const [loading, setLoading] = useState(false);
    const [isFinance, setIsFinance] = useState(false);
    const [isGenderOpen, setIsGenderOpen] = useState(false);
    const [msg, setMsg] = useState('');
    const [teacherData, setTeacherData] = useState({
        name: '', email: '', password: '', subjects: '', assignedClass: '',
        fatherName: '', motherName: '', dob: '', gender: 'Male', religion: '',
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
            setTeacherData({
                ...teacherData,
                dob: `${updatedParts.yyyy}-${updatedParts.mm}-${updatedParts.dd}`
            });
        }
    };

    const handleAddTeacher = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const currentUser = JSON.parse(localStorage.getItem('user'));
            const processedData = {
                ...teacherData,
                role: isFinance ? 'finance' : 'teacher',
                schoolId: currentUser?.schoolId,
                assignedClass: isFinance ? null : (teacherData.assignedClass?.trim().toUpperCase() || null),
                subjects: isFinance ? [] : (teacherData.subjects ? teacherData.subjects.split(',').map(s => s.trim()) : [])
            };

            const { data } = await API.post('/auth/register', processedData);
            setMsg(`${isFinance ? 'Finance Personnel' : 'Faculty Node'} Active: EMP ID ${data.generatedId} ⚡`);
            setTimeout(() => navigate('/admin/manage-users'), 2000);
        } catch (err) {
            alert(err.response?.data?.message || "Error adding teacher");
        } finally {
            setLoading(false);
        }
    };

    // AddTeacher.jsx ke top par components ke andar
    const [financeExists, setFinanceExists] = useState(false);

    useEffect(() => {
        const checkFinance = async () => {
            try {
                const { data } = await API.get('/users/check-finance-exists'); // Iska path apne according check kar lena
                setFinanceExists(data.exists);
            } catch (err) {
                console.error("Finance check failed");
            }
        };
        checkFinance();
    }, []);

    const [availableClasses, setAvailableClasses] = useState([]);
    const [isClassDropdownOpen, setIsClassDropdownOpen] = useState(false);

    useEffect(() => {
        const fetchAvailable = async () => {
            try {
                const { data } = await API.get('/users/available-classes');
                setAvailableClasses(data);
            } catch (err) { console.error("Classes fetch failed"); }
        };
        if (!isFinance) fetchAvailable();
    }, [isFinance]);

    return (
        <div className="min-h-screen bg-[#F8FAFC] pb-24 font-sans italic text-slate-800 text-[15px] overflow-x-hidden overscroll-none fixed inset-0 overflow-y-auto">
            <div className="bg-[#42A5F5] px-6 pt-12 pb-24 rounded-b-[4rem] shadow-xl relative z-10">
                <button onClick={() => navigate(-1)} className="p-3 bg-white rounded-2xl text-[#42A5F5] shadow-md active:scale-95 transition-all mb-8">
                    <ArrowLeft size={24} />
                </button>
                <div className="text-center text-white">
                    <h1 className="text-3xl font-black italic tracking-tight uppercase">Create teacher access link</h1>
                    <p className="text-[12px] font-black uppercase tracking-widest opacity-60 mt-1"></p>
                </div>
            </div>

            <div className="px-6 -mt-10 relative z-20">
                <form onSubmit={handleAddTeacher} className="bg-white p-8 rounded-[3rem] shadow-xl border border-[#DDE3EA] space-y-6">

                    {/* --- FINANCE TOGGLE (ONLY SHOW IF NOT EXISTS) --- */}
                    {!financeExists && (
                        <div className="flex items-center gap-4 bg-blue-50/50 p-5 rounded-3xl border border-blue-100 cursor-pointer mb-6"
                            onClick={() => setIsFinance(!isFinance)}>
                            <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${isFinance ? 'bg-[#42A5F5] border-[#42A5F5]' : 'border-slate-300'}`}>
                                {isFinance && <PlusCircle size={14} className="text-white" />}
                            </div>
                            <label className="text-[15px] font-black uppercase italic text-[#42A5F5] cursor-pointer">
                                Assign as finance teacher (Accountant role)
                            </label>
                        </div>
                    )}

                    {/* AGAR FINANCE PEHLE SE HAI TOH OPTIONAL MESSAGE (Optional) */}
                    {financeExists && (
                        <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 mb-6">
                            <p className="text-[12px] text-amber-700 font-bold italic uppercase text-center">
                                ⚠️ Finance Faculty already deployed for your School.
                            </p>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1">
                            <label className="text-[19px] text-slate-700 ml-4 font-black uppercase">Full name</label>
                            <input type="text" placeholder="e.g. Rahul Kumar" className="w-full p-5 bg-slate-50 rounded-2xl border border-slate-200 outline-none text-[19px] font-bold text-slate-700 focus:border-[#42A5F5] uppercase"
                                onChange={(e) => setTeacherData({ ...teacherData, name: e.target.value })} required />
                        </div>

                        <div className="space-y-1">
                            <label className="text-[19px] text-slate-700 ml-4 font-black uppercase">School email</label>
                            <input type="email" placeholder="faculty@school.edu" className="w-full p-5 bg-slate-50 rounded-2xl border border-slate-200 outline-none text-[19px] font-bold text-slate-700 focus:border-[#42A5F5]"
                                onChange={(e) => setTeacherData({ ...teacherData, email: e.target.value })} required />
                        </div>

                        {/* --- PASSWORD MATRIX (FIXED) --- */}
                        <div className="space-y-6 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">

                            {/* 1. Main Password Box */}
                            <div className="space-y-1">
                                <label className="text-[19px] text-slate-700 ml-4 font-black uppercase italic">Password</label>
                                <div className="relative group">
                                    <input
                                        type={showPass ? "text" : "password"}
                                        placeholder="••••••••"
                                        className="w-full p-5 pr-14 bg-slate-50 rounded-2xl border border-slate-200 outline-none text-[19px] font-bold text-slate-700 focus:border-[#42A5F5] italic transition-all"
                                        // Yahan galti thi: setStudentData ko setTeacherData kiya
                                        onChange={(e) => setTeacherData({ ...teacherData, password: e.target.value })}
                                        required
                                    />
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
                                        className={`w-full p-5 bg-slate-50 rounded-2xl border outline-none text-[19px] font-bold text-slate-700 italic transition-all ${confirmPass && teacherData.password !== confirmPass
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
                                    {confirmPass && teacherData.password !== confirmPass && (
                                        <p className="text-[11px] text-rose-500 font-black uppercase mt-1 ml-4 italic">Passwords do not match! ⚠️</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-[19px] text-slate-700 ml-4 font-black uppercase">Mobile No.</label>
                            <input type="text" placeholder="10 Digit Number" className="w-full p-5 bg-slate-50 rounded-2xl border border-slate-200 outline-none text-[19px] font-bold text-slate-700 focus:border-[#42A5F5]"
                                onChange={(e) => setTeacherData({ ...teacherData, phone: e.target.value })} required />
                        </div>

                        {/* --- RELIGION NODE --- */}
                        <div className="space-y-1">
                            <label className="text-[19px] text-slate-700 ml-4 font-black uppercase">Religion</label>
                            <input type="text" placeholder="e.g. Hindu" className="w-full p-5 bg-slate-50 rounded-2xl border border-slate-200 outline-none text-[19px] font-bold text-slate-700 focus:border-[#42A5F5] uppercase"
                                onChange={(e) => setTeacherData({ ...teacherData, religion: e.target.value })}
                                required
                            />
                        </div>

                        {!isFinance && (
                            <>
                                <div className="space-y-1">
                                    <label className="text-[19px] text-slate-700 ml-4 font-black uppercase">Assign subjects</label>
                                    <input type="text" placeholder="Math, Science..." className="w-full p-5 bg-slate-50 rounded-2xl border border-slate-200 outline-none text-[19px] font-bold text-slate-700 focus:border-[#42A5F5] uppercase"
                                        onChange={(e) => setTeacherData({ ...teacherData, subjects: e.target.value })} />
                                </div>
                                <div className="space-y-1 relative">
                                    <label className="text-[19px] text-slate-700 ml-4 font-black uppercase italic">Assign Class (Optional)</label>

                                    {/* Dropdown Trigger */}
                                    <div
                                        onClick={() => setIsClassDropdownOpen(!isClassDropdownOpen)}
                                        className="w-full p-5 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between cursor-pointer active:scale-[0.98] transition-all"
                                    >
                                        <span className="text-[19px] font-bold text-slate-400 italic uppercase">
                                            {teacherData.assignedClass || "Select Class"}
                                        </span>
                                        <div className={`transition-transform duration-300 ${isClassDropdownOpen ? 'rotate-180' : 'rotate-0'}`}>
                                            <PlusCircle size={22} className="text-[#42A5F5]" />
                                        </div>
                                    </div>

                                    {/* Dropdown Menu */}
                                    <AnimatePresence>
                                        {isClassDropdownOpen && (
                                            <>
                                                <div className="fixed inset-0 z-[110]" onClick={() => setIsClassDropdownOpen(false)} />
                                                <motion.div
                                                    initial={{ opacity: 0, y: -10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -10 }}
                                                    className="absolute left-0 right-0 top-[110%] z-[120] bg-white border border-blue-100 rounded-[2rem] shadow-2xl overflow-y-auto max-h-60 custom-scrollbar"
                                                >
                                                    {availableClasses.length > 0 ? (
                                                        availableClasses.map((cls) => (
                                                            <div
                                                                key={cls}
                                                                onClick={() => {
                                                                    setTeacherData({ ...teacherData, assignedClass: cls });
                                                                    setIsClassDropdownOpen(false);
                                                                }}
                                                                className={`p-5 text-[19px] font-black italic uppercase transition-all cursor-pointer border-b border-slate-50 last:border-none
                                            ${teacherData.assignedClass === cls ? 'bg-blue-50 text-[#42A5F5]' : 'text-slate-600 hover:bg-slate-50'}
                                        `}
                                                            >
                                                                {cls}
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <div className="p-5 text-center text-slate-400 font-bold italic">
                                                            No vacant classes available
                                                        </div>
                                                    )}

                                                    {/* Option to clear selection */}
                                                    <div
                                                        onClick={() => {
                                                            setTeacherData({ ...teacherData, assignedClass: '' });
                                                            setIsClassDropdownOpen(false);
                                                        }}
                                                        className="p-4 bg-slate-50 text-rose-500 text-center text-[12px] font-black uppercase cursor-pointer hover:bg-rose-50"
                                                    >
                                                        Clear Selection
                                                    </div>
                                                </motion.div>
                                            </>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </>
                        )}

                        <div className="space-y-1">
                            <label className="text-[19px] text-slate-700 ml-4 font-black uppercase">Father's name</label>
                            <input type="text" placeholder="Full Name" className="w-full p-5 bg-slate-50 rounded-2xl border border-slate-200 outline-none text-[19px] font-bold text-slate-700 focus:border-[#42A5F5] uppercase"
                                onChange={(e) => setTeacherData({ ...teacherData, fatherName: e.target.value })} required />
                        </div>

                        <div className="space-y-1">
                            <label className="text-[19px] text-slate-700 ml-4 font-black uppercase">Mother's name</label>
                            <input type="text" placeholder="Full Name" className="w-full p-5 bg-slate-50 rounded-2xl border border-slate-200 outline-none text-[19px] font-bold text-slate-700 focus:border-[#42A5F5] uppercase"
                                onChange={(e) => setTeacherData({ ...teacherData, motherName: e.target.value })} required />
                        </div>

                        <div className="space-y-1 md:col-span-2">
                            {/* Label: 19px, Black, Sentence Case */}
                            <label className="text-[19px] text-slate-700 ml-4 font-black uppercase italic">
                                Date of birth
                                <br />
                                (eg. 15 08 1990)
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

                        {/* --- MANUAL GENDER SELECTION MATRIX (FACULTY) --- */}
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
                                <span className="text-[19px] font-bold text-slate-700 italic uppercase">
                                    {teacherData.gender || "Select gender"}
                                </span>
                                <div className={`transition-transform duration-300 ${isGenderOpen ? 'rotate-180' : 'rotate-0'}`}>
                                    <PlusCircle size={22} className="text-[#42A5F5]" />
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
                                                        // ✅ Corrected: Using setTeacherData instead of setStudentData
                                                        setTeacherData({ ...teacherData, gender: option });
                                                        setIsGenderOpen(false);
                                                    }}
                                                    className={`p-5 text-[19px] font-black italic uppercase transition-all cursor-pointer border-b border-slate-50 last:border-none
                                ${teacherData.gender === option ? 'bg-blue-50 text-[#42A5F5]' : 'text-slate-600 hover:bg-slate-50'}
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

                        <div className="md:col-span-2 space-y-1">
                            <label className="text-[19px] text-slate-700 ml-4 font-black uppercase">Full Address</label>
                            <textarea placeholder="House No, Street, Landmark..." className="w-full p-5 bg-slate-50 rounded-2xl border border-slate-200 outline-none text-[19px] font-bold text-slate-700 focus:border-[#42A5F5] uppercase h-24"
                                onChange={(e) => setTeacherData({ ...teacherData, address: { ...teacherData.address, fullAddress: e.target.value } })} required />
                        </div>
                    </div>

                    {/* --- HORIZONTAL LONG ADDRESS NODES (TEACHER) --- */}
                    <div className="md:col-span-2 space-y-6">

                        {/* 1. PINCODE NODE */}
                        <div className="space-y-1">
                            <label className="text-[19px] text-slate-700 ml-4 font-black uppercase italic">Pincode</label>
                            <input
                                type="text"
                                placeholder="6 Digit Pincode"
                                maxLength="6"
                                className="w-full p-5 bg-slate-50 rounded-2xl border border-slate-200 outline-none text-[19px] font-bold text-slate-700 focus:border-[#42A5F5] italic transition-all"
                                onChange={(e) => setTeacherData({ ...teacherData, address: { ...teacherData.address, pincode: e.target.value } })}
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
                                onChange={(e) => setTeacherData({ ...teacherData, address: { ...teacherData.address, district: e.target.value } })}
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
                                onChange={(e) => setTeacherData({ ...teacherData, address: { ...teacherData.address, state: e.target.value } })}
                                required
                            />
                        </div>

                    </div>

                    <button type="submit" disabled={loading} className="w-full bg-[#42A5F5] text-white py-6 rounded-[2.5rem] font-black text-[16px] uppercase shadow-xl shadow-blue-100 active:scale-95 transition-all mt-6">
                        {loading ? "Transmitting data..." : "Authorize faculty"}
                    </button>
                </form>
            </div>
            {msg && <Toast message={msg} onClose={() => setMsg('')} />}
        </div>
    );
};

export default AddTeacher;