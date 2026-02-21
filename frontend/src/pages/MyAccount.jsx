import React, { useState } from 'react';
import { ArrowLeft, UserCircle, Mail, Phone, MapPin, Fingerprint, Camera } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import API from '../api'; 

const MyAccount = ({ user }) => {
    const navigate = useNavigate();
    const [uploading, setUploading] = useState(false);
    
    const BASE_URL = "http://localhost:5000";
    const [preview, setPreview] = useState(
        user?.avatar ? `${BASE_URL}${user.avatar}` : null
    );

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('avatar', file);

        setUploading(true);
        try {
            const { data } = await API.put('/auth/update-profile', formData);
            localStorage.setItem('user', JSON.stringify(data));
            setPreview(`${BASE_URL}${data.avatar}`);
            alert("Neural Profile Updated! 🧬");
            window.location.reload();
        } catch (err) {
            alert("Upload failed. Check backend connection.");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="min-h-screen bg-void pb-24 font-sans italic">
            <div className="bg-void text-white px-6 pt-12 pb-24 rounded-b-[3.5rem] border-b border-neon/20 relative shadow-2xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-neon/10 to-transparent pointer-events-none"></div>
                <button onClick={() => navigate(-1)} className="bg-white/5 p-2 rounded-xl mb-4 active:scale-90 border border-white/10 text-neon transition-all relative z-10">
                    <ArrowLeft size={20}/>
                </button>
                <h1 className="text-xl font-black uppercase tracking-tighter italic relative z-10">My Profile Matrix</h1>
            </div>

            <div className="px-6 -mt-16 relative z-20">
                <div className="bg-slate-900/80 backdrop-blur-xl rounded-[2.5rem] shadow-[0_30px_60px_rgba(0,0,0,0.8)] p-6 border border-white/5">
                    <div className="flex flex-col items-center -mt-16 mb-8">
                        
                        <div className="relative group">
                            <div className="w-24 h-24 bg-void rounded-full border-4 border-slate-900 shadow-[0_0_30px_rgba(61,242,224,0.3)] flex items-center justify-center overflow-hidden">
                                {preview ? (
                                    <img src={preview} alt="profile" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                                ) : (
                                    <UserCircle size={60} className="text-neon/20" />
                                )}
                            </div>
                            
                            <label className="absolute bottom-0 right-0 bg-neon text-void p-1.5 rounded-xl cursor-pointer shadow-[0_0_15px_rgba(61,242,224,0.4)] active:scale-90 transition-all border-2 border-slate-900">
                                <Camera size={14} />
                                <input 
                                    type="file" 
                                    className="hidden" 
                                    onChange={handleFileChange} 
                                    accept="image/*"
                                />
                            </label>
                            
                            {uploading && (
                                <div className="absolute inset-0 bg-void/60 rounded-full flex items-center justify-center border border-neon">
                                    <div className="w-6 h-6 border-2 border-neon border-t-transparent rounded-full animate-spin"></div>
                                </div>
                            )}
                        </div>

                        <h2 className="text-xl font-black text-white mt-4 uppercase tracking-tighter italic">{user?.name}</h2>
                        <span className="bg-neon/10 text-neon border border-neon/30 px-4 py-1 rounded-full text-[9px] font-black uppercase mt-1 italic tracking-widest">
                            {user?.role === 'student' ? 'Active Node: Student' : 'Authorized Access: Faculty'}
                        </span>
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-center gap-4 group">
                            <div className="bg-void p-3 rounded-2xl border border-white/5 text-neon group-hover:border-neon/30 transition-all"><Fingerprint size={20}/></div>
                            <div>
                                <p className="text-[9px] font-black text-neon/40 uppercase italic tracking-widest">Personnel Identity</p>
                                <p className="text-sm font-black text-white/80 font-mono tracking-tight">{user?._id?.slice(-12).toUpperCase()}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 group">
                            <div className="bg-void p-3 rounded-2xl border border-white/5 text-neon group-hover:border-neon/30 transition-all"><Mail size={20}/></div>
                            <div>
                                <p className="text-[9px] font-black text-neon/40 uppercase italic tracking-widest">Institutional Network</p>
                                <p className="text-sm font-black text-white/80 italic tracking-tight">{user?.email}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 group">
                            <div className="bg-void p-3 rounded-2xl border border-white/5 text-neon group-hover:border-neon/30 transition-all"><Phone size={20}/></div>
                            <div>
                                <p className="text-[9px] font-black text-neon/40 uppercase italic tracking-widest">Signal Transponder</p>
                                <p className="text-sm font-black text-white/80 italic tracking-tight">+91 98765-XXXXX</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 group">
                            <div className="bg-void p-3 rounded-2xl border border-white/5 text-neon group-hover:border-neon/30 transition-all"><MapPin size={20}/></div>
                            <div>
                                <p className="text-[9px] font-black text-neon/40 uppercase italic tracking-widest">Deployment Sector</p>
                                <p className="text-sm font-black text-white/80 italic uppercase tracking-tight">Panipat, Haryana Node</p>
                            </div>
                        </div>
                    </div>
                    
                    <button 
                        onClick={() => { localStorage.clear(); navigate('/'); window.location.reload(); }}
                        className="w-full mt-10 bg-red-600/10 text-red-500 py-4 rounded-2xl font-black uppercase text-[10px] tracking-[0.3em] active:scale-95 transition-all border border-red-500/20 italic"
                    >
                        Terminate Session Hub
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MyAccount;