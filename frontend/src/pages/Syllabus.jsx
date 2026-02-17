import React, { useState, useEffect } from 'react';
import { ArrowLeft, BookOpen, Download, Hash, Star, Award, Zap, Cpu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import Loader from '../components/Loader';

const Syllabus = ({ user }) => {
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSyllabus = async () => {
            // Fallback: Agar prop late hai toh localStorage se dekho
            const currentUser = user || JSON.parse(localStorage.getItem('user'));
            const userGrade = currentUser?.grade;

            if (!userGrade) {
                // Pehli baar mein warning na aaye isliye silent check
                if (user) console.warn("User grade missing for:", user.name);
                setLoading(false);
                return;
            }

            setLoading(true);
            try {
                const { data } = await API.get(`/syllabus/${encodeURIComponent(userGrade)}`);
                setData(data);
            } catch (err) { 
                console.error("Syllabus fetch error:", err.response?.data?.message || err.message); 
                setData([]); 
            } finally { 
                setLoading(false); 
            }
        };

        fetchSyllabus();
    }, [user]); // user prop badalne par trigger hoga

    if (loading) return <Loader />;

    return (
        <div className="min-h-screen bg-[#f8fafc] pb-24 font-sans italic">
            <div className="nav-gradient text-white px-6 pt-12 pb-24 rounded-b-[3.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.2)] relative z-10 overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
                <div className="flex justify-between items-center mb-6 relative z-10">
                    <button onClick={() => navigate(-1)} className="bg-white/10 backdrop-blur-md p-2.5 rounded-2xl active:scale-90 transition-all border border-white/20 shadow-xl">
                        <ArrowLeft size={20} />
                    </button>
                    <div className="flex flex-col items-center">
                        <h1 className="text-xl font-black uppercase tracking-[0.2em]">Syllabus</h1>
                        <div className="h-1 w-12 bg-blue-400 rounded-full mt-1 shadow-[0_0_10px_rgba(96,165,250,1)]"></div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md p-2.5 rounded-2xl border border-white/20 shadow-xl">
                        <Cpu size={20} className="text-blue-300 animate-pulse" />
                    </div>
                </div>
                <div className="bg-slate-900/40 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-6 flex items-center justify-between relative z-10 shadow-2xl">
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-400 mb-1">Current Academic Load</p>
                        <h2 className="text-3xl font-black tracking-tighter italic">Grade: {user?.grade || 'N/A'}</h2>
                    </div>
                    <div className="bg-gradient-to-tr from-blue-600 to-cyan-400 p-4 rounded-[1.8rem] shadow-[0_0_25px_rgba(59,130,246,0.5)]">
                        <Zap size={28} className="text-white fill-white" />
                    </div>
                </div>
            </div>

            <div className="px-5 -mt-12 relative z-20 space-y-5">
                <div className="flex items-center gap-2 ml-3">
                    <div className="w-1.5 h-4 bg-blue-600 rounded-full"></div>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Neural Course Mapping</p>
                </div>
                {data.length > 0 ? data.map((sub, i) => (
                    <div key={i} className="bg-white rounded-[2.5rem] p-6 shadow-[0_15px_40px_rgba(0,0,0,0.04)] border border-white/60 group hover:border-blue-200 transition-all duration-500">
                        <div className="flex justify-between items-start mb-5">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 bg-slate-900 text-white rounded-3xl flex items-center justify-center font-black text-sm shadow-xl shadow-slate-200 group-hover:bg-blue-600 group-hover:scale-110 transition-all duration-300">
                                    {sub.subject.substring(0,2).toUpperCase()}
                                </div>
                                <div>
                                    <h4 className="font-black text-slate-800 text-base leading-tight uppercase tracking-tighter italic">{sub.subject}</h4>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">{sub.title}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-xl flex flex-col items-center shadow-inner">
                                <span className="text-[10px] font-black text-slate-800">2026</span>
                                <span className="text-[7px] font-bold text-slate-400 uppercase tracking-widest">Session</span>
                            </div>
                        </div>
                        <p className="text-[11px] text-slate-500 font-medium mb-5 px-1 leading-relaxed italic opacity-80 line-clamp-2">{sub.description || "Course roadmap and objectives are outlined in the encrypted document below."}</p>
                        <button className="w-full bg-slate-950 hover:bg-blue-600 text-white py-4 rounded-[1.8rem] shadow-[0_10px_20px_rgba(0,0,0,0.1)] hover:shadow-blue-500/30 transition-all duration-300 flex items-center justify-center gap-3 group/btn overflow-hidden relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/btn:animate-[shimmer_1.5s_infinite]"></div>
                            <Download size={18} className="relative z-10 group-hover/btn:animate-bounce" />
                            <span className="text-[11px] font-black uppercase tracking-widest relative z-10">Download Encrypted PDF</span>
                        </button>
                    </div>
                )) : (
                    <div className="bg-white rounded-[3rem] p-16 flex flex-col items-center justify-center border border-dashed border-slate-200 shadow-inner">
                        <div className="bg-slate-50 p-6 rounded-full mb-4"><BookOpen size={40} className="text-slate-200" /></div>
                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] text-center">No Neural Data Found For Your Grade</p>
                    </div>
                )}
            </div>
            <div className="fixed bottom-10 right-10 w-2 h-2 bg-blue-500/20 rounded-full animate-ping pointer-events-none"></div>
        </div>
    );
};

export default Syllabus;