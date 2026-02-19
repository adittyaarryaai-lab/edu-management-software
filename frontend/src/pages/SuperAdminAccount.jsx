import React, { useState } from 'react';
import { ArrowLeft, ShieldCheck, Key, Mail, Phone, Camera, MapPin, Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import Toast from '../components/Toast';

const SuperAdminAccount = ({ user }) => {
    const navigate = useNavigate();
    const [msg, setMsg] = useState('');
    const [loading, setLoading] = useState(false);
    const [editData, setEditData] = useState({ 
        name: user?.name || '', 
        email: user?.email || '',
        mobile: user?.mobile || '',
        address: user?.address || ''
    });
    const [avatarFile, setAvatarFile] = useState(null);
    const [preview, setPreview] = useState(null); 

    // Photo selection logic
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatarFile(file);
            setPreview(URL.createObjectURL(file)); 
        }
    };

    // DAY 66: Master Profile Sync Logic (FIXED)
    const handleUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        const data = new FormData();
        data.append('name', editData.name);
        data.append('email', editData.email);
        data.append('mobile', editData.mobile);
        data.append('address', editData.address);
        if (avatarFile) data.append('avatar', avatarFile);

        try {
            const res = await API.put('/superadmin/update-profile', data);
            // LocalStorage update with new data including mobile/address
            localStorage.setItem('user', JSON.stringify(res.data));
            setMsg("Master Profile Synchronized! ⚡");
            
            setTimeout(() => window.location.reload(), 1500);
        } catch (err) {
            console.error("Sync Error Detail:", err.response?.data);
            alert(err.response?.data?.message || "Sync Failed!");
        } finally { setLoading(false); }
    };

    return (
        <div className="min-h-screen bg-[#f1f5f9] p-6 font-sans italic">
            {msg && <Toast message={msg} onClose={() => setMsg('')} />}
            <button onClick={() => navigate(-1)} className="bg-white p-3 rounded-2xl shadow-md mb-8 active:scale-90 transition-all"><ArrowLeft size={20}/></button>
            <h1 className="text-3xl font-black text-slate-900 mb-10 tracking-tighter italic uppercase">Master Control Profile</h1>

            <form onSubmit={handleUpdate} className="bg-white rounded-[3.5rem] p-10 shadow-2xl border border-white space-y-8">
                <div className="flex items-center gap-6 pb-8 border-b border-slate-100">
                    <div className="relative">
                        <div className="w-24 h-24 bg-slate-900 text-white rounded-[2.5rem] flex items-center justify-center text-4xl font-black shadow-2xl overflow-hidden border-4 border-white">
                            {preview ? (
                                <img src={preview} className="w-full h-full object-cover" alt="Preview" />
                            ) : user?.avatar ? (
                                <img src={`http://localhost:5000${user.avatar}`} className="w-full h-full object-cover" alt="Root" />
                            ) : ("SA")}
                        </div>
                        <label className="absolute -bottom-2 -right-2 bg-blue-600 p-2 rounded-xl text-white cursor-pointer shadow-lg hover:scale-110 transition-all border-2 border-white">
                            <Camera size={14} />
                            <input type="file" className="hidden" onChange={handleFileChange} />
                        </label>
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-slate-800 italic uppercase tracking-tighter">{editData.name}</h2>
                        <div className="flex items-center gap-2 mt-2">
                            <ShieldCheck size={14} className="text-blue-500" />
                            <span className="bg-blue-100 text-blue-600 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest inline-block">System Root</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase ml-2 italic tracking-widest">Full Name</label>
                        <div className="bg-slate-50 p-5 rounded-3xl border flex items-center gap-4">
                            <input type="text" value={editData.name} onChange={(e) => setEditData({...editData, name: e.target.value})} className="bg-transparent font-bold outline-none w-full text-slate-700" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase ml-2 italic tracking-widest">Access Email</label>
                        <div className="bg-slate-50 p-5 rounded-3xl border flex items-center gap-4">
                            <Mail className="text-slate-300" size={20}/>
                            <input type="email" value={editData.email} onChange={(e) => setEditData({...editData, email: e.target.value})} className="bg-transparent font-bold outline-none w-full text-slate-700" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase ml-2 italic tracking-widest">Mobile Endpoint</label>
                        <div className="bg-slate-50 p-5 rounded-3xl border flex items-center gap-4">
                            <Phone className="text-slate-300" size={20}/>
                            <input type="text" value={editData.mobile} placeholder="Enter Mobile" onChange={(e) => setEditData({...editData, mobile: e.target.value})} className="bg-transparent font-bold outline-none w-full text-slate-700" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase ml-2 italic tracking-widest">Root Address</label>
                        <div className={`bg-slate-50 p-5 rounded-3xl border flex items-center gap-4`}>
                            <MapPin className="text-slate-300" size={20}/>
                            <input type="text" value={editData.address} placeholder="System Location" onChange={(e) => setEditData({...editData, address: e.target.value})} className="bg-transparent font-bold outline-none w-full text-slate-700" />
                        </div>
                    </div>
                </div>

                <button type="submit" disabled={loading} className="w-full bg-slate-900 text-white py-5 rounded-[2rem] font-black uppercase text-xs tracking-[0.4em] shadow-xl active:scale-95 transition-all flex items-center justify-center gap-3">
                    {loading ? "Synchronizing..." : <><Save size={18}/> Synchronize Master Details</>}
                </button>
            </form>
        </div>
    );
};

export default SuperAdminAccount;