import React, { useState, useEffect } from 'react';
import { ArrowLeft, FileText, Download, Eye, Zap, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import Loader from '../components/Loader';

const DigitalMaterial = () => {
    const navigate = useNavigate();
    const [materials, setMaterials] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDigital = async () => {
            try {
                const { data } = await API.get('/library/ebooks');
                setMaterials(data);
            } catch (err) { console.error(err); }
            finally { setLoading(false); }
        };
        fetchDigital();
    }, []);

    if (loading) return <Loader />;

    return (
        <div className="min-h-screen bg-void pb-24 font-sans italic">
            <div className="bg-void text-white px-6 pt-12 pb-24 rounded-b-[3.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.5)] border-b border-neon/20 relative z-10 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-neon/5 to-transparent pointer-events-none"></div>
                <button onClick={() => navigate(-1)} className="bg-white/5 backdrop-blur-md p-2.5 rounded-2xl active:scale-90 transition-all border border-white/10 text-neon mb-6">
                    <ArrowLeft size={20} />
                </button>
                <div className="flex items-center gap-4 relative z-10">
                    <div className="bg-neon text-void p-4 rounded-[1.8rem] shadow-[0_0_25px_rgba(61,242,224,0.4)]">
                        <Zap size={28} className="fill-void" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black uppercase tracking-tighter italic">Digital Vault</h1>
                        <p className="text-[10px] font-black text-neon/40 uppercase tracking-[0.4em]">Decrypted Learning Blocks</p>
                    </div>
                </div>
            </div>

            <div className="px-5 -mt-12 relative z-20 space-y-5">
                {materials.length > 0 ? materials.map((item, i) => (
                    <div key={i} className="bg-white/5 backdrop-blur-xl rounded-[2.5rem] p-6 shadow-2xl border border-white/5 flex items-center justify-between group hover:border-neon/30 transition-all">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-neon/10 text-neon rounded-3xl flex items-center justify-center border border-neon/20 shadow-inner group-hover:bg-neon group-hover:text-void transition-all">
                                <FileText size={24} />
                            </div>
                            <div>
                                <h4 className="font-black text-white text-sm uppercase leading-tight italic tracking-tight">{item.title}</h4>
                                <p className="text-[9px] font-black text-neon/40 uppercase tracking-widest mt-1 italic">{item.category} • Neural PDF</p>
                            </div>
                        </div>
                        
                        <div className="flex gap-2">
                             <a 
                                href={item.fileUrl} 
                                target="_blank" 
                                rel="noreferrer"
                                className="bg-void p-3 rounded-xl text-neon/60 border border-neon/10 hover:text-neon hover:border-neon/40 transition-all"
                             >
                                <Eye size={18} />
                             </a>
                             <button className="bg-neon text-void p-3 rounded-xl shadow-[0_0_15px_rgba(61,242,224,0.3)] active:scale-90 transition-all">
                                <Download size={18} />
                             </button>
                        </div>
                    </div>
                )) : (
                    <div className="bg-white/5 rounded-[3rem] p-16 flex flex-col items-center justify-center border border-dashed border-neon/10">
                        <ShieldCheck size={50} className="text-neon/10 mb-4 animate-pulse" />
                        <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.5em] italic">Vault Storage Empty</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DigitalMaterial;