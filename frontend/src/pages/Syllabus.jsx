import React, { useState, useEffect } from 'react';
import { ArrowLeft, BookOpen, Download, Zap, Cpu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import Loader from '../components/Loader';

const Syllabus = ({ user }) => {
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSyllabus = async () => {
            const currentUser = user || JSON.parse(localStorage.getItem('user'));
            const userGrade = currentUser?.grade;

            if (!userGrade) {
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
    }, [user]);

    if (loading) return <Loader />;

    return (
        <div className="min-h-screen bg-void pb-24 font-sans italic text-white">
            <div className="bg-void text-white px-6 pt-12 pb-24 rounded-b-[3.5rem] shadow-2xl border-b border-neon/20 relative z-10 overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-neon/5 rounded-full blur-3xl animate-pulse"></div>
                <div className="flex justify-between items-center mb-6 relative z-10">
                    <button onClick={() => navigate(-1)} className="bg-white/5 backdrop-blur-md p-2.5 rounded-2xl active:scale-90 transition-all border border-white/10 text-neon">
                        <ArrowLeft size={20} />
                    </button>
                    <div className="flex flex-col items-center">
                        <h1 className="text-xl font-black uppercase tracking-[0.2em] italic">Syllabus</h1>
                        <div className="h-0.5 w-12 bg-neon rounded-full mt-1 shadow-[0_0_15px_rgba(61,242,224,1)]"></div>
                    </div>
                    <div className="bg-neon/10 p-2.5 rounded-2xl border border-neon/30 text-neon">
                        <Cpu size={20} className="animate-pulse" />
                    </div>
                </div>
                <div className="bg-slate-900/60 backdrop-blur-2xl border border-neon/20 rounded-[2.5rem] p-6 flex items-center justify-between relative z-10 shadow-2xl">
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-neon/60 mb-1 italic">Academic Workload Index</p>
                        <h2 className="text-3xl font-black tracking-tighter italic uppercase text-white">Grade: {user?.grade || 'N/A'}</h2>
                    </div>
                    <div className="bg-neon text-void p-4 rounded-[1.8rem] shadow-[0_0_20px_rgba(61,242,224,0.4)]">
                        <Zap size={28} className="fill-void" />
                    </div>
                </div>
            </div>

            <div className="px-5 -mt-12 relative z-20 space-y-5">
                <div className="flex items-center gap-2 ml-3">
                    <div className="w-1.5 h-4 bg-neon rounded-full shadow-[0_0_10px_rgba(61,242,224,1)]"></div>
                    <p className="text-[10px] font-black text-neon/40 uppercase tracking-[0.2em] italic">Neural Course Mapping</p>
                </div>
                {data.length > 0 ? data.map((sub, i) => (
                    <div key={i} className="bg-white/5 backdrop-blur-xl rounded-[2.5rem] p-6 shadow-2xl border border-white/5 group hover:border-neon/30 transition-all duration-500">
                        <div className="flex justify-between items-start mb-5">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 bg-void text-neon border border-neon/20 rounded-3xl flex items-center justify-center font-black text-sm shadow-inner group-hover:bg-neon group-hover:text-void transition-all duration-300 italic">
                                    {sub.subject.substring(0,2).toUpperCase()}
                                </div>
                                <div>
                                    <h4 className="font-black text-white text-base leading-tight uppercase tracking-tighter italic group-hover:text-neon transition-colors">{sub.subject}</h4>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-[9px] font-black text-neon uppercase tracking-widest bg-neon/10 px-2 py-0.5 rounded-md border border-neon/20 italic">{sub.title}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-void border border-white/5 px-3 py-1.5 rounded-xl flex flex-col items-center shadow-inner">
                                <span className="text-[10px] font-black text-white/80 italic">2026</span>
                                <span className="text-[7px] font-black text-neon/40 uppercase tracking-widest leading-none">Cycle</span>
                            </div>
                        </div>
                        <p className="text-[11px] text-white/40 font-medium mb-5 px-1 leading-relaxed italic opacity-80 line-clamp-2">{sub.description || "Course roadmap and objectives are outlined in the encrypted document below."}</p>
                        <button className="w-full bg-neon text-void py-4 rounded-[1.8rem] shadow-[0_0_20px_rgba(61,242,224,0.3)] hover:shadow-[0_0_30px_rgba(61,242,224,0.5)] transition-all duration-300 flex items-center justify-center gap-3 group/btn relative overflow-hidden">
                            <Download size={18} className="relative z-10 group-hover/btn:animate-bounce" />
                            <span className="text-[11px] font-black uppercase tracking-widest relative z-10 italic">Download Encrypted PDF</span>
                        </button>
                    </div>
                )) : (
                    <div className="bg-white/5 rounded-[3rem] p-16 flex flex-col items-center justify-center border border-dashed border-neon/10 shadow-inner">
                        <div className="bg-neon/5 p-6 rounded-full mb-4 border border-neon/10"><BookOpen size={40} className="text-neon/20" /></div>
                        <p className="text-[10px] font-black text-neon/20 uppercase tracking-[0.3em] text-center italic">No Neural Data Found For Your Node</p>
                    </div>
                )}
            </div>
            <div className="fixed bottom-10 right-10 w-2 h-2 bg-neon/20 rounded-full animate-ping pointer-events-none"></div>
        </div>
    );
};

export default Syllabus;