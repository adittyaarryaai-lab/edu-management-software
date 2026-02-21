import React, { useState, useEffect } from 'react';
import { ArrowLeft, Book, Clock, AlertCircle, Bookmark, Search, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import Loader from '../components/Loader';

const Library = () => {
    const navigate = useNavigate();
    const [books, setBooks] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const { data } = await API.get(`/library?search=${search}`);
                setBooks(data);
            } catch (err) {
                console.error("Library fetch error:", err);
            } finally {
                setLoading(false);
            }
        };

        const delayDebounceFn = setTimeout(() => {
            fetchBooks();
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [search]);

    if (loading) return <Loader />;

    return (
        <div className="min-h-screen bg-void pb-24 font-sans italic">
            {/* Header */}
            <div className="bg-void text-white px-6 pt-12 pb-20 rounded-b-[3rem] shadow-2xl border-b border-neon/20 relative z-10 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-neon/10 to-transparent pointer-events-none"></div>
                <div className="flex justify-between items-center mb-4 relative z-10">
                    <button onClick={() => navigate(-1)} className="bg-white/5 p-2 rounded-xl active:scale-90 border border-white/10 text-neon transition-all">
                        <ArrowLeft size={20} />
                    </button>
                    <h1 className="text-xl font-black uppercase tracking-tighter italic">E-Library</h1>
                    <div className="bg-white/5 p-2 rounded-xl border border-white/10 text-neon"><Book size={20}/></div>
                </div>

                <button 
                    onClick={() => navigate('/library/digital')}
                    className="flex items-center gap-2 bg-slate-900/40 backdrop-blur-md border border-neon/20 px-4 py-2 rounded-2xl mb-6 active:scale-95 transition-all group relative z-10 shadow-[0_0_15px_rgba(61,242,224,0.1)]"
                >
                    <Zap size={14} className="text-neon group-hover:animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-neon/80">Switch to Digital Vault</span>
                </button>
                
                <div className="relative mt-4 z-10">
                    <Search className="absolute left-4 top-3.5 text-neon/40" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search books in neural catalog..." 
                        className="w-full bg-slate-900/50 text-white placeholder:text-white/20 py-3.5 pl-12 pr-4 rounded-2xl border border-neon/10 outline-none backdrop-blur-md focus:border-neon transition-all font-black text-xs uppercase tracking-widest"
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <div className="px-5 -mt-8 relative z-20 space-y-6">
                {/* Fine Alert */}
                <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl flex items-center gap-3 shadow-[0_0_20px_rgba(239,68,68,0.1)]">
                    <AlertCircle className="text-red-500 animate-pulse" size={20} />
                    <div>
                        <p className="text-[10px] font-black text-red-500 uppercase tracking-[0.3em] italic">Pending Fine Index</p>
                        <p className="text-xs font-black text-white/80 italic">₹0.00 (No Overdue Protocol)</p>
                    </div>
                </div>

                {/* Catalog Books */}
                <div className="space-y-4">
                    <p className="text-[10px] font-black text-neon/30 uppercase tracking-[0.4em] ml-2 italic">Neural Catalog Assets</p>
                    
                    {books.length > 0 ? books.map((book, i) => (
                        <div key={i} className="bg-white/5 backdrop-blur-xl rounded-[2.5rem] p-5 shadow-2xl border border-white/5 border-l-4 border-l-neon transition-all active:scale-95 group">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-4">
                                    <div className="bg-neon/10 text-neon p-3 rounded-xl border border-neon/20 shadow-inner group-hover:bg-neon group-hover:text-void transition-all">
                                        <Bookmark size={20} />
                                    </div>
                                    <div>
                                        <h4 className="font-black text-white text-sm uppercase leading-tight italic tracking-tighter group-hover:text-neon transition-colors">{book.title}</h4>
                                        <p className="text-[9px] font-black text-white/30 mt-1 uppercase tracking-widest italic">Author Node: {book.author}</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex justify-between items-center border-t border-white/5 pt-4 mt-2">
                                <div className="flex items-center gap-2">
                                    <span className="text-[11px] font-black text-neon/40 uppercase tracking-widest italic">Loc: {book.shelfLocation || 'Section A'}</span>
                                </div>
                                <span className={`text-[9px] font-black uppercase tracking-widest italic ${book.status === 'Available' ? 'text-neon animate-pulse' : 'text-orange-400'}`}>
                                    {book.status}
                                 </span>
                            </div>
                        </div>
                    )) : (
                        <div className="text-center py-20 bg-white/5 rounded-[3rem] border border-dashed border-white/10">
                             <p className="text-white/10 font-black text-[10px] uppercase tracking-[0.4em] italic">No Assets Found In Neural Database</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Library;