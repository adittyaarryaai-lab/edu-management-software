import React from 'react';
import { ArrowLeft, UserCircle, Mail, Phone, MapPin, Fingerprint } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MyAccount = ({ user }) => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-white pb-24">
            <div className="nav-gradient text-white px-6 pt-12 pb-24 rounded-b-[3.5rem] relative">
                <button onClick={() => navigate(-1)} className="bg-white/20 p-2 rounded-xl mb-4"><ArrowLeft size={20}/></button>
                <h1 className="text-xl font-bold uppercase tracking-tight">My Profile</h1>
            </div>

            <div className="px-6 -mt-16">
                <div className="bg-white rounded-[2.5rem] shadow-2xl p-6 border border-slate-50">
                    <div className="flex flex-col items-center -mt-16 mb-6">
                        <div className="w-24 h-24 bg-slate-100 rounded-full border-4 border-white shadow-lg flex items-center justify-center overflow-hidden">
                            <UserCircle size={60} className="text-slate-300" />
                        </div>
                        <h2 className="text-xl font-black text-slate-800 mt-2">{user?.name}</h2>
                        <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-[10px] font-black uppercase mt-1">Active Student</span>
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-center gap-4">
                            <Fingerprint className="text-slate-400" size={20}/>
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase">Admission Number</p>
                                <p className="text-sm font-bold text-slate-700">25KRMUCS001M21826330</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <Mail className="text-slate-400" size={20}/>
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase">Institutional Email</p>
                                <p className="text-sm font-bold text-slate-700">{user?.name?.toLowerCase().replace(' ', '.')}@university.edu</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <Phone className="text-slate-400" size={20}/>
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase">Parent's Mobile</p>
                                <p className="text-sm font-bold text-slate-700">+91 98765-43210</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <MapPin className="text-slate-400" size={20}/>
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase">Address</p>
                                <p className="text-sm font-bold text-slate-700">Panipat, Haryana, India</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyAccount;