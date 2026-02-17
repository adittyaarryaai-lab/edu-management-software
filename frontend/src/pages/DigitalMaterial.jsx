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
        <div className="min-h-screen bg-[#f8fafc] pb-24 font-sans italic">
            <div className="nav-gradient text-white px-6 pt-12 pb-24 rounded-b-[3.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.2)] relative z-10 overflow-hidden">
                <button onClick={() => navigate(-1)} className="bg-white/10 backdrop-blur-md p-2.5 rounded-2xl active:scale-90 transition-all border border-white/20 mb-6">
                    <ArrowLeft size={20} />
                </button>
                <div className="flex items-center gap-4">
                    <div className="bg-blue-600 p-4 rounded-[1.8rem] shadow-[0_0_20px_rgba(59,130,246,0.5)]">
                        <Zap size={28} className="text-white fill-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black uppercase tracking-tight">Digital Vault</h1>
                        <p className="text-[10px] font-black opacity-70 uppercase tracking-[0.3em]">Encrypted Study Resources</p>
                    </div>
                </div>
            </div>

            <div className="px-5 -mt-12 relative z-20 space-y-5">
                {materials.length > 0 ? materials.map((item, i) => (
                    <div key={i} className="bg-white rounded-[2.5rem] p-6 shadow-xl border border-white flex items-center justify-between group">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-slate-900 text-white rounded-3xl flex items-center justify-center shadow-lg group-hover:bg-blue-600 transition-all">
                                <FileText size={24} />
                            </div>
                            <div>
                                <h4 className="font-black text-slate-800 text-sm uppercase leading-tight">{item.title}</h4>
                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">{item.category} • PDF</p>
                            </div>
                        </div>
                        
                        <div className="flex gap-2">
                             <a 
                                href={item.fileUrl} 
                                target="_blank" 
                                rel="noreferrer"
                                className="bg-slate-50 p-3 rounded-xl text-slate-400 hover:text-blue-600 transition-all"
                             >
                                <Eye size={18} />
                             </a>
                             <button className="bg-slate-900 text-white p-3 rounded-xl shadow-lg active:scale-90 transition-all">
                                <Download size={18} />
                             </button>
                        </div>
                    </div>
                )) : (
                    <div className="bg-white rounded-[3rem] p-16 flex flex-col items-center justify-center border border-dashed border-slate-200">
                        <ShieldCheck size={50} className="text-slate-100 mb-4" />
                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">Vault is Empty</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DigitalMaterial;