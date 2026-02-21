import React, { useState, useEffect } from 'react';
import { ArrowLeft, TrendingUp, Award, BookOpen, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import API from '../api'; 
import Loader from '../components/Loader'; 

const Performance = () => {
    const navigate = useNavigate();
    const [results, setResults] = useState([]); 
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const { data } = await API.get(`/assignments/my-results?t=${new Date().getTime()}`, {
                    headers: {
                        'Cache-Control': 'no-cache',
                        'Pragma': 'no-cache',
                        'Expires': '0',
                    }
                });
                
                if (data && Array.isArray(data)) {
                    setResults(data);
                } else {
                    setResults([]);
                }
            } catch (err) {
                console.error("Error fetching performance data", err);
                setResults([]);
            } finally {
                setLoading(false);
            }
        };
        fetchResults();
    }, []);

    if (loading) return <Loader />;

    return (
        <div className="min-h-screen bg-void pb-24 font-sans italic">
            <div className="bg-void text-white px-6 pt-12 pb-28 rounded-b-[3.5rem] shadow-2xl border-b border-neon/20 relative z-10 text-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-neon/10 to-transparent pointer-events-none"></div>
                <div className="flex justify-between items-center mb-6 relative z-10">
                    <button onClick={() => navigate(-1)} className="bg-white/5 p-2 rounded-xl active:scale-90 border border-white/10 text-neon transition-all">
                        <ArrowLeft size={20} />
                    </button>
                    <h1 className="text-xl font-black uppercase tracking-tighter italic">Academic Results</h1>
                    <div className="bg-neon/10 p-2 rounded-xl border border-neon/30 text-neon"><TrendingUp size={20}/></div>
                </div>

                <div className="inline-flex flex-col items-center justify-center bg-void/50 backdrop-blur-md rounded-full w-32 h-32 border-4 border-neon/20 shadow-[0_0_30px_rgba(61,242,224,0.3)] mx-auto relative z-10">
                    <span className="text-4xl font-black text-white">{results?.length || 0}</span>
                    <span className="text-[9px] font-black uppercase text-neon/60 tracking-widest leading-none">Tasks Graded</span>
                </div>
                <p className="mt-4 text-[10px] font-black uppercase tracking-[0.4em] text-neon/40 relative z-10 italic">Session 2026 • Neural Term 1</p>
            </div>

            <div className="px-5 -mt-16 relative z-20 space-y-6">
                <div className="bg-white/5 backdrop-blur-xl rounded-[2.5rem] p-6 shadow-2xl flex justify-around items-center border border-white/10">
                    <div className="text-center border-r border-white/10 pr-8">
                        <p className="text-[9px] font-black text-neon/40 uppercase mb-1 tracking-widest italic">Signal Status</p>
                        <p className="text-lg font-black text-neon uppercase italic tracking-tighter">Verified</p>
                    </div>
                    <div className="text-center pl-4">
                        <p className="text-[9px] font-black text-neon/40 uppercase mb-1 tracking-widest italic">Achievement</p>
                        <p className="text-lg font-black text-white uppercase italic tracking-tighter">Active</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="text-[10px] font-black text-neon/30 uppercase tracking-[0.3em] ml-4 flex items-center gap-2 italic">
                        <Award size={14} className="text-neon animate-pulse" /> Graded Submissions
                    </h3>

                    {results && results.length > 0 ? results.map((item, i) => (
                        <div key={item._id || i} className="bg-white/5 backdrop-blur-xl p-6 rounded-[2.5rem] shadow-2xl border border-white/5 space-y-4 hover:border-neon/30 transition-all group">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="bg-neon/10 text-neon p-3 rounded-2xl border border-neon/20 shadow-inner group-hover:bg-neon group-hover:text-void transition-all">
                                        <BookOpen size={20} />
                                    </div>
                                    <div>
                                        <h4 className="font-black text-white text-sm leading-tight uppercase italic tracking-tight group-hover:text-neon transition-colors">
                                            {item.assignment?.title || "Untitled Assignment"}
                                        </h4>
                                        <p className="text-[9px] font-black text-neon/40 uppercase mt-1 italic tracking-widest">
                                            {item.assignment?.subject || "General"} • {item.updatedAt ? new Date(item.updatedAt).toLocaleDateString() : 'Recent'}
                                        </p>
                                    </div>
                                </div>
                                <div className="bg-void border border-neon/30 text-neon px-4 py-2 rounded-xl shadow-[0_0_15px_rgba(61,242,224,0.2)]">
                                    <span className="text-xs font-black italic tracking-tighter uppercase">{item.grade || 'N/A'}</span>
                                </div>
                            </div>

                            <div className="bg-void/40 p-4 rounded-2xl border border-dashed border-neon/20 flex gap-3 items-start">
                                <MessageSquare size={16} className="text-neon mt-0.5 shrink-0" />
                                <div>
                                    <p className="text-[8px] font-black text-neon/40 uppercase tracking-widest mb-1 italic">Faculty Evaluation Node</p>
                                    <p className="text-[11px] text-white/70 font-black italic leading-relaxed">
                                        "{item.feedback || 'Excellent work! High-level compliance detected.'}"
                                    </p>
                                </div>
                            </div>
                        </div>
                    )) : (
                        <div className="text-center py-20 bg-void rounded-[3rem] border border-dashed border-white/5 shadow-inner">
                            <Award className="mx-auto text-white/5 mb-4 animate-pulse" size={60} />
                            <p className="text-white/20 font-black text-[10px] uppercase tracking-[0.4em] italic">No Neural Records Logged</p>
                        </div>
                    )}
                </div>

                <button className="w-full bg-neon text-void py-5 rounded-[2.5rem] font-black shadow-[0_0_25px_rgba(61,242,224,0.4)] flex items-center justify-center gap-3 active:scale-95 transition-all uppercase text-[10px] tracking-widest mt-4 italic">
                    <TrendingUp size={18} />
                    Generate Progress Report
                </button>
            </div>
        </div>
    );
};

export default Performance;