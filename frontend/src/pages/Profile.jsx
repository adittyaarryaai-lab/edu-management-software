import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import { User, ShieldCheck, Key, Save } from 'lucide-react';

const Profile = ({ user }) => {
    const [profile, setProfile] = useState(null);
    const [passwords, setPasswords] = useState({ current: '', new: '' });

    useEffect(() => {
        API.get('/auth/me').then(res => setProfile(res.data));
    }, []);

    const handlePasswordUpdate = async (e) => {
        e.preventDefault();
        try {
            await API.put('/auth/update-password', passwords);
            alert("Password updated successfully!");
            setPasswords({ current: '', new: '' });
        } catch (err) {
            alert(err.response?.data?.msg || "Update failed");
        }
    };

    if (!profile) return <div className="p-8">Loading Profile...</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <h2 className="text-3xl font-bold text-slate-800">Account Settings</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* 1. Profile Info Card */}
                <div className="md:col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-slate-100 text-center">
                    <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <User size={48} className="text-blue-600" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800">{profile.name}</h3>
                    <p className="text-slate-500 uppercase text-xs font-bold tracking-widest mt-1">{profile.role}</p>
                    <div className="mt-6 pt-6 border-t border-slate-50 text-left">
                        <p className="text-xs text-slate-400 font-bold uppercase">Email Address</p>
                        <p className="text-slate-700">{profile.email}</p>
                    </div>
                </div>

                {/* 2. Security Form */}
                <div className="md:col-span-2 bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                    <div className="flex items-center gap-3 mb-6">
                        <ShieldCheck className="text-green-500" />
                        <h3 className="text-xl font-bold text-slate-800">Security & Password</h3>
                    </div>
                    <form onSubmit={handlePasswordUpdate} className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-slate-600 mb-1">Current Password</label>
                            <input 
                                type="password" required className="w-full border p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                                value={passwords.current}
                                onChange={e => setPasswords({...passwords, current: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-600 mb-1">New Password</label>
                            <input 
                                type="password" required className="w-full border p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                                value={passwords.new}
                                onChange={e => setPasswords({...passwords, new: e.target.value})}
                            />
                        </div>
                        <button className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-black transition">
                            <Key size={18} /> Update Password
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Profile;