import React, { useState, useEffect } from 'react';
import { ArrowLeft, UserCircle, Mail, Phone, MapPin, Fingerprint, Camera, User, Users, Calendar, ShieldCheck, Heart, Hash, UserCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import API from '../api';

const MyAccount = ({ user }) => {
    const navigate = useNavigate();
    const [uploading, setUploading] = useState(false);
    const [schoolData, setSchoolData] = useState(null);

    const BASE_URL = "http://localhost:5000";
    const [preview, setPreview] = useState(
        user?.avatar ? (user.avatar.startsWith('http') ? user.avatar : `${BASE_URL}${user.avatar}`) : null
    );
    const isEditable = user?.role === 'superadmin';

    useEffect(() => {
        if (user?.role === 'admin') {
            const fetchSchoolInfo = async () => {
                try {
                    const { data } = await API.get('/school/subscription-status');
                    // FIXED: Backend se data.school ke andar nested adminDetails aur subscription aa raha hai
                    setSchoolData(data.school);
                } catch (err) { console.error("Institutional Data fetch failed"); }
            };
            fetchSchoolInfo();
        }
    }, [user]);

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('avatar', file);

        setUploading(true);
        try {
            const { data } = await API.put('/auth/update-profile', formData);

            // Fix: Purana data (Father, Mother, ID) ko naye Avatar ke saath merge karo
            const currentUser = JSON.parse(localStorage.getItem('user'));
            const updatedUser = { ...currentUser, avatar: data.avatar };

            localStorage.setItem('user', JSON.stringify(updatedUser));

            setPreview(`${BASE_URL}${data.avatar}`);
            alert("Neural Profile Updated! 🧬");
            window.location.reload();
        } catch (err) {
            alert("Upload failed. Check backend connection.");
        } finally {
            setUploading(false);
        }
    };
    const formatDate = (date) => {
        if (!date) return "N/A";
        return new Date(date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    return (
        <div className="min-h-screen bg-void pb-24 font-sans italic text-white">
            {/* Top Header */}
            <div className="bg-void text-white px-6 pt-12 pb-24 rounded-b-[3.5rem] border-b border-neon/20 relative shadow-2xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-neon/10 to-transparent pointer-events-none"></div>
                <button onClick={() => navigate(-1)} className="bg-white/5 p-2 rounded-xl mb-4 active:scale-90 border border-white/10 text-neon transition-all relative z-10">
                    <ArrowLeft size={20} />
                </button>
                <h1 className="text-xl font-black uppercase tracking-tighter italic relative z-10">
                    {user?.role === 'admin' ? 'Institutional Hub Matrix' : 'Personnel Node Matrix'}
                </h1>
            </div>

            <div className="px-6 -mt-16 relative z-20">
                <div className="bg-slate-900/80 backdrop-blur-xl rounded-[2.5rem] shadow-[0_30px_60px_rgba(0,0,0,0.8)] p-6 border border-white/5">

                    {/* --- PROFILE PIC & PRIMARY INFO --- */}
                    <div className="flex flex-col items-center -mt-16 mb-8">
                        <div className="relative group">
                            <div className="w-28 h-28 bg-void rounded-full border-4 border-slate-900 shadow-[0_0_30px_rgba(61,242,224,0.3)] flex items-center justify-center overflow-hidden">
                                {preview ? (
                                    <img src={preview} alt="profile" className="w-full h-full object-cover transition-all duration-500" />) : (
                                    <UserCircle size={70} className="text-neon/20" />
                                )}
                            </div>

                            <label className="absolute bottom-1 right-1 bg-neon text-void p-2 rounded-xl cursor-pointer shadow-[0_0_15px_rgba(61,242,224,0.4)] active:scale-90 transition-all border-2 border-slate-900">
                                <Camera size={16} />
                                <input type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
                            </label>

                            {uploading && (
                                <div className="absolute inset-0 bg-void/60 rounded-full flex items-center justify-center border border-neon">
                                    <div className="w-6 h-6 border-2 border-neon border-t-transparent rounded-full animate-spin"></div>
                                </div>
                            )}
                        </div>

                        <h2 className="text-2xl font-black text-white mt-4 uppercase tracking-tighter italic text-center">
                            {user?.role === 'admin' ? (schoolData?.schoolName || user?.name) : user?.name}
                        </h2>
                        <div className="flex gap-2 mt-2">
                            <span className="bg-neon/10 text-neon border border-neon/30 px-4 py-1 rounded-full text-[9px] font-black uppercase italic tracking-widest">
                                {user?.role === 'admin' ? 'Master Node: Authorized' : user?.role === 'student' ? `Grade: ${user.grade}` : 'Faculty Member'}
                            </span>
                            {user?.role !== 'admin' && (
                                <span className="bg-white/5 text-white/40 border border-white/10 px-4 py-1 rounded-full text-[9px] font-black uppercase italic tracking-widest">
                                    {user?.role === 'student' ? user.enrollmentNo : user.employeeId}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* --- DETAILS GRID --- */}
                    <div className="space-y-6">
                        <p className="text-[10px] font-black text-neon/30 uppercase tracking-[0.4em] border-b border-white/5 pb-2 italic">
                            {user?.role === 'admin' ? 'Entity Credentials' : 'Neural Identity Data'}
                        </p>

                        <div className="grid grid-cols-1 gap-6">
                            {user?.role === 'admin' ? (
                                // Step 3: Admin specific fields (School Details)
                                <>
                                    <div className="flex items-center gap-4 group">
                                        <div className="bg-void p-3 rounded-2xl border border-white/5 text-neon/40"><Hash size={20} /></div>
                                        <div>
                                            <p className="text-[8px] font-black text-white/20 uppercase italic">Affiliation Cipher</p>
                                            {/* FIXED: schoolData se direct access */}
                                            <p className="text-sm font-black text-white/80 uppercase">{schoolData?.affiliationNo || user?.schoolData?.affiliationNo || "N/A"}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 group">
                                        <div className="bg-void p-3 rounded-2xl border border-white/5 text-neon/40"><UserCheck size={20} /></div>
                                        <div>
                                            <p className="text-[8px] font-black text-white/20 uppercase italic">Primary Operator</p>
                                            {/* FIXED: Admin Name from schoolData */}
                                            <p className="text-sm font-black text-white/80 uppercase">{schoolData?.adminDetails?.fullName || user?.schoolData?.adminDetails?.fullName || user?.name}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 group">
                                        <div className="bg-void p-3 rounded-2xl border border-white/5 text-neon/40"><Phone size={20} /></div>
                                        <div>
                                            <p className="text-[8px] font-black text-white/20 uppercase italic">Signal Link</p>
                                            {/* FIXED: Admin Mobile */}
                                            <p className="text-sm font-black text-white/80">{schoolData?.adminDetails?.mobile || user?.schoolData?.adminDetails?.mobile || user?.phone || "N/A"}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 group">
                                        <div className="bg-void p-3 rounded-2xl border border-white/5 text-neon/40"><Mail size={20} /></div>
                                        <div>
                                            <p className="text-[8px] font-black text-white/20 uppercase italic">Network Email</p>
                                            {/* FIXED: Admin Email */}
                                            <p className="text-sm font-black text-white/80">{schoolData?.adminDetails?.email || user?.schoolData?.adminDetails?.email || user?.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4 group bg-void/40 p-4 rounded-2xl border border-white/5">
                                        <div className="bg-void p-2.5 rounded-xl border border-white/5 text-neon/40 mt-1"><MapPin size={20} /></div>
                                        <div>
                                            <p className="text-[8px] font-black text-neon/40 uppercase italic">Deployment Address</p>
                                            <p className="text-[11px] font-black text-white/60 uppercase leading-relaxed mt-1">{schoolData?.address || "Location Data Encrypted"}</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 mt-2">
                                        <div className="bg-void p-4 rounded-3xl border border-white/5">
                                            <p className="text-[8px] font-black text-white/20 uppercase mb-1 italic tracking-widest">Monthly Quota</p>
                                            <p className="text-lg font-black text-neon tracking-tighter">₹{schoolData?.subscription?.monthlyFee || 0}</p>
                                        </div>
                                        <div className="bg-void p-4 rounded-3xl border border-white/5">
                                            <p className="text-[8px] font-black text-white/20 uppercase mb-1 italic tracking-widest">Session Cycle</p>
                                            <p className="text-lg font-black text-white italic tracking-tighter">{schoolData?.sessionYear || "2026-27"}</p>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                // Student & Teacher fields (Already existing)
                                <>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="flex items-center gap-3 group">
                                            <div className="bg-void p-2.5 rounded-xl border border-white/5 text-neon/40"><User size={18} /></div>
                                            <div>
                                                <p className="text-[8px] font-black text-white/20 uppercase italic leading-none">Father's Name</p>
                                                <p className="text-xs font-black text-white/80 uppercase mt-1">{user?.fatherName || "UNSPECIFIED"}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 group">
                                            <div className="bg-void p-2.5 rounded-xl border border-white/5 text-neon/40"><Heart size={18} /></div>
                                            <div>
                                                <p className="text-[8px] font-black text-white/20 uppercase italic leading-none">Mother's Name</p>
                                                <p className="text-xs font-black text-white/80 uppercase mt-1">{user?.motherName || "UNSPECIFIED"}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="flex items-center gap-3 group">
                                            <div className="bg-void p-2.5 rounded-xl border border-white/5 text-neon/40"><Calendar size={18} /></div>
                                            <div>
                                                <p className="text-[8px] font-black text-white/20 uppercase italic leading-none">Birth Cycle</p>
                                                <p className="text-xs font-black text-white/80 uppercase mt-1">{formatDate(user?.dob)}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 group">
                                            <div className="bg-void p-2.5 rounded-xl border border-white/5 text-neon/40"><Users size={18} /></div>
                                            <div>
                                                <p className="text-[8px] font-black text-white/20 uppercase italic leading-none">Gender Node</p>
                                                <p className="text-xs font-black text-white/80 uppercase mt-1">{user?.gender || "N/A"}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="flex items-center gap-3 group">
                                            <div className="bg-void p-2.5 rounded-xl border border-white/5 text-neon/40"><Phone size={18} /></div>
                                            <div>
                                                <p className="text-[8px] font-black text-white/20 uppercase italic leading-none">Signal Link</p>
                                                <p className="text-xs font-black text-white/80 mt-1">{user?.phone || "N/A"}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 group">
                                            <div className="bg-void p-2.5 rounded-xl border border-white/5 text-neon/40"><ShieldCheck size={18} /></div>
                                            <div>
                                                <p className="text-[8px] font-black text-white/20 uppercase italic leading-none">Religion Cipher</p>
                                                <p className="text-xs font-black text-white/80 uppercase mt-1">{user?.religion || "N/A"}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 group bg-void/40 p-4 rounded-2xl border border-white/5">
                                        <div className="bg-void p-2.5 rounded-xl border border-white/5 text-neon/40">
                                            {user?.role === 'teacher' ? <Fingerprint size={18} /> : <Mail size={18} />}
                                        </div>
                                        <div>
                                            <p className="text-[8px] font-black text-neon/40 uppercase italic leading-none">
                                                {user?.role === 'teacher' ? 'Assigned Subjects' : 'Registry Email'}
                                            </p>
                                            <p className="text-xs font-black text-white/90 mt-1">
                                                {user?.role === 'teacher' ? user.subjects?.join(', ') : user?.email}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3 group bg-void/40 p-4 rounded-2xl border border-white/5">
                                        <div className="bg-void p-2.5 rounded-xl border border-white/5 text-neon/40 mt-1"><MapPin size={18} /></div>
                                        <div>
                                            <p className="text-[8px] font-black text-neon/40 uppercase italic leading-none">Deployment Sector (Address)</p>
                                            <p className="text-[11px] font-black text-white/70 mt-2 uppercase leading-relaxed">
                                                {user?.address?.fullAddress}<br />
                                                {user?.address?.district}, {user?.address?.state} - {user?.address?.pincode}
                                            </p>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                    {/* --- FOOTER SESSION --- */}
                    <button
                        onClick={() => { localStorage.clear(); navigate('/'); window.location.reload(); }}
                        className="w-full mt-10 bg-red-600/10 text-red-500 py-5 rounded-2xl font-black uppercase text-[10px] tracking-[0.3em] active:scale-95 transition-all border border-red-500/20 italic shadow-[0_0_20px_rgba(239,68,68,0.1)]"
                    >
                        Terminate Session Matrix
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MyAccount;