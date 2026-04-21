import React, { useState } from 'react';
import { ArrowLeft, UserPlus, Zap, Eye, EyeOff, PlusCircle, Download } from 'lucide-react';
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

    const handleBulkUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        setLoading(true);
        try {
            const { data } = await API.post('/auth/bulk-register-students', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            setMsg(data.message);
            // Agar errors aaye hain toh alert mein dikhao
            if (data.errors) {
                console.log("Bulk partial errors:", data.errors);
                alert("Some students skipped. Check console for details.");
            }
            setTimeout(() => navigate('/admin/manage-users'), 2000);
        } catch (err) {
            alert(err.response?.data?.message || "Neural Link Failed during Bulk Sync! 🛡️");
        } finally {
            setLoading(false);
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
                {/* 🔥 NAYA: NEURAL BULK IMPORT SECTION (FORM KE UPAR) */}
                <div className="bg-[#EEF7FF] p-8 rounded-[3rem] border-2 border-dashed border-[#42A5F5] text-center space-y-4 shadow-inner mb-10">
                    <div className="flex flex-col items-center gap-2">
                        <div className="p-4 bg-white rounded-3xl text-[#42A5F5] shadow-sm">
                            <Zap size={32} fill="#42A5F5" className="animate-pulse" />
                        </div>
                        <h3 className="text-xl font-black italic uppercase text-slate-700 tracking-tighter leading-none">Neural bulk import</h3>
                        <p className="text-[16px] font-bold text-slate-800 px-6 italic">Upload a CSV file to add many students at once.</p>
                    </div>

                    <div className="flex flex-col gap-3 pt-4">
                        {/* Hidden Input */}
                        <input
                            type="file"
                            id="bulkFile"
                            hidden
                            accept=".csv"
                            onChange={handleBulkUpload} // Iska function maine pichle msg mein diya tha
                            disabled={loading}
                        />

                        {/* Action Button */}
                        <label
                            htmlFor="bulkFile"
                            className={`w-full py-5 bg-white text-[#42A5F5] rounded-2xl font-black uppercase text-[15px] tracking-[0.2em] shadow-md border border-blue-100 cursor-pointer active:scale-95 transition-all flex items-center justify-center gap-2 ${loading ? 'opacity-50 pointer-events-none' : ''}`}
                        >
                            <PlusCircle size={18} /> Upload Student CSV
                        </label>

                        {/* Template Download */}
                        <button
                            type="button"
                            onClick={() => {
                                const csvContent = "name,grade,fatherName,motherName,dob,gender,religion,phone,admissionNo,pincode,district,state,fullAddress\n" +
                                    "Rahul Kumar,10-C,Sunil Kumar,Anita Devi,2010-05-15,Male,Hindu,9876543210,ADM001,110001,Delhi,Delhi,Noida Sec 15";
                                const blob = new Blob([csvContent], { type: 'text/csv' });
                                const url = window.URL.createObjectURL(blob);
                                const a = document.createElement('a');
                                a.href = url;
                                a.download = 'EduFlowAI_Student_Template.csv';
                                a.click();
                            }}
                            className="w-full py-5 bg-white text-[#42A5F5] rounded-2xl font-black uppercase text-[15px] tracking-[0.2em] shadow-md border border-blue-100 cursor-pointer active:scale-95 transition-all flex items-center justify-center gap-2"
                        >
                            {/* Agar Download icon import kiya hai toh theek warna hata dena */}
                            Download CSV Blueprint (Sample)
                        </button>
                    </div>
                </div>

                {/* --- SEPARATOR --- */}
                <div className="flex items-center gap-4 mb-8 px-4">
                    <div className="h-[1px] flex-1 bg-slate-400"></div>
                    <span className="text-[15px] font-black text-slate-600 uppercase tracking-[0.3em]">Or Manual Entry</span>
                    <div className="h-[1px] flex-1 bg-slate-400"></div>
                </div>
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