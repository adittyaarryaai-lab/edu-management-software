import React, { useState } from 'react';
import { ArrowLeft, School, UserCheck, CreditCard, ShieldCheck, Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import Toast from '../components/Toast';

const SuperAdminOnboard = () => {
    const navigate = useNavigate();
    const [msg, setMsg] = useState('');
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        schoolInfo: { schoolName: '', address: '', affiliationNo: '', logo: '' },
        adminInfo: { fullName: '', mobile: '', email: '', designation: 'Principal' },
        subscription: { monthlyFee: 0, totalPaid: 0 },
        tempPassword: '',
        sessionYear: '2026-27'
    });

    const handleOnboard = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await API.post('/superadmin/onboard-school', formData);
            setMsg("Institution Integrated Successfully! 🚀");
            setTimeout(() => navigate('/superadmin/dashboard'), 2000);
        } catch (err) {
            alert(err.response?.data?.message || "Onboarding Failed");
        } finally { setLoading(false); }
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] pb-24 font-sans italic">
            <div className="bg-slate-900 text-white px-6 pt-12 pb-24 rounded-b-[4rem] shadow-2xl">
                <button onClick={() => navigate(-1)} className="bg-white/10 p-2 rounded-xl mb-6"><ArrowLeft size={20}/></button>
                <h1 className="text-2xl font-black uppercase tracking-tighter italic">New Onboarding</h1>
                <p className="text-[10px] font-black opacity-50 uppercase tracking-[0.3em] mt-1 italic">Deploying New Neural Node</p>
            </div>

            <form onSubmit={handleOnboard} className="px-5 -mt-12 space-y-6 relative z-10">
                {/* 1. School Profile */}
                <div className="bg-white p-8 rounded-[3rem] shadow-xl border border-white space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                        <School className="text-blue-500" size={18} />
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">School Profile</h3>
                    </div>
                    <input type="text" placeholder="Official School Name" className="w-full bg-slate-50 p-4 rounded-2xl border outline-none focus:border-blue-500 font-bold" 
                        onChange={(e) => setFormData({...formData, schoolInfo: {...formData.schoolInfo, schoolName: e.target.value}})} required />
                    <input type="text" placeholder="Full Address (City, State, Pin)" className="w-full bg-slate-50 p-4 rounded-2xl border outline-none focus:border-blue-500 font-bold" 
                        onChange={(e) => setFormData({...formData, schoolInfo: {...formData.schoolInfo, address: e.target.value}})} required />
                    <input type="text" placeholder="Affiliation Number (CBSE/ICSE)" className="w-full bg-slate-50 p-4 rounded-2xl border outline-none focus:border-blue-500 font-bold uppercase" 
                        onChange={(e) => setFormData({...formData, schoolInfo: {...formData.schoolInfo, affiliationNo: e.target.value}})} required />
                </div>

                {/* 2. Admin & Credentials */}
                <div className="bg-white p-8 rounded-[3rem] shadow-xl border border-white space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                        <UserCheck className="text-purple-500" size={18} />
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Primary Administrator</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <input type="text" placeholder="Admin Full Name" className="p-4 bg-slate-50 rounded-2xl border font-bold" 
                            onChange={(e) => setFormData({...formData, adminInfo: {...formData.adminInfo, fullName: e.target.value}})} required />
                        <input type="text" placeholder="Mobile Number" className="p-4 bg-slate-50 rounded-2xl border font-bold" 
                            onChange={(e) => setFormData({...formData, adminInfo: {...formData.adminInfo, mobile: e.target.value}})} required />
                    </div>
                    <input type="email" placeholder="Official Email Address" className="w-full bg-slate-50 p-4 rounded-2xl border font-bold" 
                        onChange={(e) => setFormData({...formData, adminInfo: {...formData.adminInfo, email: e.target.value}})} required />
                    <input type="password" placeholder="Temporary Access Key (Password)" className="w-full bg-slate-50 p-4 rounded-2xl border font-bold" 
                        onChange={(e) => setFormData({...formData, tempPassword: e.target.value})} required />
                </div>

                {/* 3. Subscription & Billing */}
                <div className="bg-white p-8 rounded-[3rem] shadow-xl border border-white space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                        <CreditCard className="text-green-500" size={18} />
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Financial Agreement</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <input type="number" placeholder="Monthly Fee (₹)" className="p-4 bg-slate-50 rounded-2xl border font-bold text-green-600" 
                            onChange={(e) => setFormData({...formData, subscription: {...formData.subscription, monthlyFee: Number(e.target.value)}})} required />
                        <input type="number" placeholder="Advance Paid (₹)" className="p-4 bg-slate-50 rounded-2xl border font-bold text-blue-600" 
                            onChange={(e) => setFormData({...formData, subscription: {...formData.subscription, totalPaid: Number(e.target.value)}})} required />
                    </div>
                </div>

                <button type="submit" disabled={loading} className="w-full bg-slate-900 text-white py-6 rounded-[2.5rem] font-black uppercase text-sm tracking-[0.3em] shadow-2xl active:scale-95 transition-all">
                    {loading ? "INITIALIZING NODE..." : "ACTIVATE INSTITUTION"}
                </button>
            </form>
            {msg && <Toast message={msg} onClose={() => setMsg('')} />}
        </div>
    );
};

export default SuperAdminOnboard;