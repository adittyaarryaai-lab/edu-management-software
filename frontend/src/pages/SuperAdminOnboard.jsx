import React, { useState } from 'react';
import { ArrowLeft, School, UserCheck, CreditCard, Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import Toast from '../components/Toast';

const SuperAdminOnboard = () => {
    const navigate = useNavigate();
    const [msg, setMsg] = useState('');
    const [loading, setLoading] = useState(false);
    const [logoFile, setLogoFile] = useState(null);

    const [formData, setFormData] = useState({
        schoolInfo: { schoolName: '', address: '', affiliationNo: '', logo: '' },
        adminInfo: { fullName: '', mobile: '', email: '', designation: 'Principal', fatherName: 'Institutional Root', motherName: 'System Core', gender: 'Other', religion: 'Global' },
        subscription: { monthlyFee: 0, totalPaid: 0 },
        tempPassword: '',
        sessionYear: '2026-27'
    });

    const handleOnboard = async (e) => {
        e.preventDefault();
        setLoading(true);
        const data = new FormData();
        data.append('schoolInfo', JSON.stringify(formData.schoolInfo));
        data.append('adminInfo', JSON.stringify(formData.adminInfo));
        data.append('subscription', JSON.stringify(formData.subscription));
        data.append('tempPassword', formData.tempPassword);
        data.append('sessionYear', formData.sessionYear);
        if (logoFile) data.append('logo', logoFile);

        try {
            await API.post('/superadmin/onboard-school', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setMsg("Institution Integrated Successfully! 🚀");
            setTimeout(() => navigate('/superadmin/dashboard'), 2000);
        } catch (err) {
            alert(err.response?.data?.message || "Onboarding Failed");
        } finally { setLoading(false); }
    };

    return (
        <div className="min-h-screen bg-void pb-24 font-sans italic text-white">
            <div className="bg-void text-white px-6 pt-12 pb-24 rounded-b-[4rem] shadow-2xl border-b border-neon/20 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-neon/10 to-transparent pointer-events-none"></div>
                <button onClick={() => navigate(-1)} className="bg-white/5 p-2 rounded-xl mb-6 border border-white/10 text-neon transition-all relative z-10"><ArrowLeft size={20} /></button>
                <h1 className="text-2xl font-black uppercase tracking-tighter italic relative z-10">Neural Node Deployment</h1>
                <p className="text-[10px] font-black text-neon/40 uppercase tracking-[0.4em] mt-1 relative z-10 italic">Initializing New Institution Hub</p>
            </div>

            <form onSubmit={handleOnboard} className="px-5 -mt-12 space-y-6 relative z-20">
                <div className="bg-slate-900/80 backdrop-blur-xl p-8 rounded-[3rem] shadow-2xl border border-white/5 space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                        <Upload className="text-neon animate-bounce" size={18} />
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-neon/40">Institution Iconography</h3>
                    </div>
                    <div className="flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-3xl p-6 bg-void/50 group hover:border-neon/30 transition-all">
                        <input type="file" accept="image/*" id="logoUpload" className="hidden" onChange={(e) => setLogoFile(e.target.files[0])} />
                        <label htmlFor="logoUpload" className="cursor-pointer flex flex-col items-center gap-2">
                            {logoFile ? (
                                <span className="text-[10px] font-black text-neon uppercase tracking-widest italic">{logoFile.name} Loaded!</span>
                            ) : (
                                <>
                                    <div className="bg-void p-3 rounded-2xl border border-white/5 text-neon/20 group-hover:text-neon transition-all"><Upload size={20} /></div>
                                    <span className="text-[10px] font-black text-white/20 uppercase tracking-widest text-center group-hover:text-white/40">Upload official institutional identity</span>
                                </>
                            )}
                        </label>
                    </div>
                </div>

                <div className="bg-slate-900/80 backdrop-blur-xl p-8 rounded-[3rem] shadow-2xl border border-white/5 space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                        <School className="text-neon" size={18} />
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-neon/40">Entity Credentials</h3>
                    </div>
                    <input type="text" placeholder="Institution Name" className="w-full bg-void p-4 rounded-2xl border border-white/5 outline-none focus:border-neon font-black italic text-sm text-white uppercase tracking-tight"
                        onChange={(e) => setFormData({ ...formData, schoolInfo: { ...formData.schoolInfo, schoolName: e.target.value } })} required />
                    <input type="text" placeholder="Full Address (Plot/Building No., Area, City, State)" className="w-full bg-void p-4 rounded-2xl border border-white/5 outline-none focus:border-neon font-black italic text-sm text-white uppercase"
                        onChange={(e) => setFormData({ ...formData, schoolInfo: { ...formData.schoolInfo, address: e.target.value } })} required />
                    <input type="text" placeholder="Affiliation Registration Code" className="w-full bg-void p-4 rounded-2xl border border-white/5 outline-none focus:border-neon font-black italic text-sm text-white uppercase"
                        onChange={(e) => setFormData({ ...formData, schoolInfo: { ...formData.schoolInfo, affiliationNo: e.target.value } })} required />
                </div>

                <div className="bg-slate-900/80 backdrop-blur-xl p-8 rounded-[3rem] shadow-2xl border border-white/5 space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                        <UserCheck className="text-neon" size={18} />
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-neon/40">Primary Operator</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <input type="text" placeholder="Admin Name" className="p-4 bg-void rounded-2xl border border-white/5 font-black italic text-sm text-white outline-none focus:border-neon"
                            onChange={(e) => setFormData({ ...formData, adminInfo: { ...formData.adminInfo, fullName: e.target.value } })} required />
                        <input type="text" placeholder="Signal Contact" className="p-4 bg-void rounded-2xl border border-white/5 font-black italic text-sm text-white outline-none focus:border-neon"
                            onChange={(e) => setFormData({ ...formData, adminInfo: { ...formData.adminInfo, mobile: e.target.value } })} required />
                    </div>
                    <input type="email" placeholder="Network Access Email" className="w-full bg-void p-4 rounded-2xl border border-white/5 font-black italic text-sm text-white outline-none focus:border-neon"
                        onChange={(e) => setFormData({ ...formData, adminInfo: { ...formData.adminInfo, email: e.target.value } })} required />
                    <input type="password" placeholder="Password" className="w-full bg-void p-4 rounded-2xl border border-white/5 font-black italic text-sm text-white outline-none focus:border-neon"
                        onChange={(e) => setFormData({ ...formData, tempPassword: e.target.value })} required />
                </div>

                <div className="bg-slate-900/80 backdrop-blur-xl p-8 rounded-[3rem] shadow-2xl border border-white/5 space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                        <CreditCard className="text-neon" size={18} />
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-neon/40">Credit Agreement</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <input type="number" placeholder="Monthly Quota (₹)" className="p-4 bg-void rounded-2xl border border-white/5 font-black italic text-sm text-neon"
                            onChange={(e) => setFormData({ ...formData, subscription: { ...formData.subscription, monthlyFee: Number(e.target.value) } })} required />
                        <input type="number" placeholder="Initial Deposit (₹)" className="p-4 bg-void rounded-2xl border border-white/5 font-black italic text-sm text-white"
                            onChange={(e) => setFormData({ ...formData, subscription: { ...formData.subscription, totalPaid: Number(e.target.value) } })} required />
                    </div>
                </div>

                <button type="submit" disabled={loading} className="w-full bg-neon text-void py-6 rounded-[2.5rem] font-black uppercase text-sm tracking-[0.4em] shadow-[0_0_40px_rgba(61,242,224,0.4)] active:scale-95 transition-all italic">
                    {loading ? "INITIALIZING NODE CORE..." : "ACTIVATE INSTITUTION MATRIX"}
                </button>
            </form>
            {msg && <Toast message={msg} onClose={() => setMsg('')} />}
        </div>
    );
};

export default SuperAdminOnboard;