import React, { useState } from 'react';
import { ArrowLeft, UserCircle, Mail, Phone, MapPin, Fingerprint, Camera } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import API from '../api'; // Backend connection ke liye

const MyAccount = ({ user }) => {
    const navigate = useNavigate();
    const [uploading, setUploading] = useState(false);
    
    // Backend Base URL
    const BASE_URL = "http://localhost:5000";

    // Initial avatar check: Backend URL add karke dikhao
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
            
            // LocalStorage update taaki refresh par purani photo na aaye
            localStorage.setItem('user', JSON.stringify(data));
            
            // Preview update with Full URL
            setPreview(`${BASE_URL}${data.avatar}`);
            
            alert("Neural Profile Updated! 🧬");
            
            // Force reload taaki Navbar aur baki jagah bhi photo change ho jaye
            window.location.reload();
        } catch (err) {
            alert("Upload failed. Check backend connection.");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white pb-24 font-sans italic">
            <div className="nav-gradient text-white px-6 pt-12 pb-24 rounded-b-[3.5rem] relative">
                <button onClick={() => navigate(-1)} className="bg-white/20 p-2 rounded-xl mb-4 active:scale-90 transition-all">
                    <ArrowLeft size={20}/>
                </button>
                <h1 className="text-xl font-bold uppercase tracking-tight italic">My Profile</h1>
            </div>

            <div className="px-6 -mt-16 relative z-10">
                <div className="bg-white rounded-[2.5rem] shadow-2xl p-6 border border-slate-50">
                    <div className="flex flex-col items-center -mt-16 mb-6">
                        
                        {/* PROFILE IMAGE SECTION WITH UPLOAD LOGIC */}
                        <div className="relative group">
                            <div className="w-24 h-24 bg-slate-100 rounded-full border-4 border-white shadow-lg flex items-center justify-center overflow-hidden">
                                {preview ? (
                                    <img src={preview} alt="profile" className="w-full h-full object-cover" />
                                ) : (
                                    <UserCircle size={60} className="text-slate-300" />
                                )}
                            </div>
                            
                            {/* Hidden Input and Camera Icon */}
                            <label className="absolute bottom-0 right-0 bg-slate-900 text-white p-1.5 rounded-xl cursor-pointer shadow-lg active:scale-90 transition-all border-2 border-white">
                                <Camera size={14} />
                                <input 
                                    type="file" 
                                    className="hidden" 
                                    onChange={handleFileChange} 
                                    accept="image/*"
                                />
                            </label>
                            
                            {uploading && (
                                <div className="absolute inset-0 bg-white/60 rounded-full flex items-center justify-center">
                                    <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                </div>
                            )}
                        </div>

                        <h2 className="text-xl font-black text-slate-800 mt-2 uppercase tracking-tighter italic">{user?.name}</h2>
                        <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-[10px] font-black uppercase mt-1 italic tracking-widest">
                            {user?.role === 'student' ? 'Active Student' : 'Authorized Faculty'}
                        </span>
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-center gap-4">
                            <Fingerprint className="text-slate-400" size={20}/>
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Personnel ID</p>
                                <p className="text-sm font-bold text-slate-700">{user?._id?.slice(-10).toUpperCase()}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <Mail className="text-slate-400" size={20}/>
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Institutional Email</p>
                                <p className="text-sm font-bold text-slate-700">{user?.email}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <Phone className="text-slate-400" size={20}/>
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Mobile Network</p>
                                <p className="text-sm font-bold text-slate-700">+91 98765-43210</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <MapPin className="text-slate-400" size={20}/>
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Deployment Zone</p>
                                <p className="text-sm font-bold text-slate-700">Panipat, Haryana, India</p>
                            </div>
                        </div>
                    </div>
                    
                    {/* LOGOUT BUTTON */}
                    <button 
                        onClick={() => { localStorage.clear(); navigate('/'); window.location.reload(); }}
                        className="w-full mt-8 bg-red-50 text-red-600 py-4 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] active:scale-95 transition-all border border-red-100"
                    >
                        Terminate Session
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MyAccount;