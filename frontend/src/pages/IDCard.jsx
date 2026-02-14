import React from 'react';
import { ArrowLeft, Share2, Download, ShieldCheck, QrCode } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const IDCard = ({ user }) => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#f1f5f9] pb-24">
            {/* Header */}
            <div className="nav-gradient text-white px-6 pt-12 pb-24 rounded-b-[3rem] shadow-lg relative z-10">
                <div className="flex justify-between items-center mb-6">
                    <button onClick={() => navigate(-1)} className="bg-white/20 p-2 rounded-xl active:scale-90 transition-all">
                        <ArrowLeft size={20} />
                    </button>
                    <h1 className="text-xl font-bold uppercase tracking-tight">Digital ID Card</h1>
                    <div className="bg-white/20 p-2 rounded-xl"><Share2 size={20}/></div>
                </div>
            </div>

            {/* ID Card Container */}
            <div className="px-6 -mt-16 relative z-20">
                <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100 flex flex-col">
                    {/* Top Strip */}
                    <div className="bg-blue-600 h-4 w-full"></div>
                    
                    <div className="p-8 flex flex-col items-center">
                        <div className="text-center mb-6">
                            <h2 className="text-lg font-black text-blue-600 leading-tight">KR MANGALAM UNIVERSITY</h2>
                            <p className="text-[8px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">Gurugram, Haryana</p>
                        </div>

                        {/* Student Photo */}
                        <div className="relative mb-6">
                            <div className="w-32 h-32 bg-slate-100 rounded-3xl border-4 border-slate-50 shadow-inner flex items-center justify-center overflow-hidden">
                                <img 
                                    src="https://via.placeholder.com/150" 
                                    alt="Student" 
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="absolute -bottom-2 -right-2 bg-green-500 text-white p-1.5 rounded-full border-4 border-white">
                                <ShieldCheck size={16} />
                            </div>
                        </div>

                        {/* Details */}
                        <div className="text-center space-y-1 mb-8">
                            <h3 className="text-xl font-black text-slate-800 uppercase">{user?.name}</h3>
                            <p className="text-blue-600 font-bold text-xs uppercase tracking-wider">B.Tech CSE (Full Stack)</p>
                            <p className="text-slate-400 font-bold text-[10px] mt-1 uppercase tracking-[0.1em]">Roll No: 2501350071</p>
                        </div>

                        {/* QR Code Section */}
                        <div className="bg-slate-50 p-6 rounded-[2rem] border-2 border-dashed border-slate-200 flex flex-col items-center">
                            <div className="bg-white p-3 rounded-2xl shadow-sm mb-3">
                                <QrCode size={100} className="text-slate-800" />
                            </div>
                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest italic">Scan at Main Gate</p>
                        </div>
                    </div>

                    {/* Bottom Info Strip */}
                    <div className="bg-slate-50 px-8 py-4 flex justify-between items-center border-t border-slate-100">
                        <div>
                            <p className="text-[8px] font-bold text-slate-400 uppercase">Validity</p>
                            <p className="text-[10px] font-black text-slate-700">2025 - 2029</p>
                        </div>
                        <div>
                            <p className="text-[8px] font-bold text-slate-400 uppercase text-right">Blood Group</p>
                            <p className="text-[10px] font-black text-red-500 text-right">O+ POSITIVE</p>
                        </div>
                    </div>
                </div>

                {/* Download Button */}
                <button className="w-full mt-8 bg-slate-900 text-white py-4 rounded-3xl font-bold shadow-xl flex items-center justify-center gap-2 active:scale-95 transition-all">
                    <Download size={20} />
                    <span>Download Offline Card</span>
                </button>
            </div>
        </div>
    );
};

export default IDCard;