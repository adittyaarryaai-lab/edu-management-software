import React, { useState, useEffect } from 'react';
import { ArrowLeft, Book, Clock, AlertCircle, Bookmark, Search, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import API from '../api'; // Day 56: Connectivity added
import Loader from '../components/Loader'; // Day 56: Loader added

const Library = () => {
    const navigate = useNavigate();
    const [books, setBooks] = useState([]); // Day 56: Data from backend
    const [search, setSearch] = useState(''); // Day 56: Search state
    const [loading, setLoading] = useState(true);

    // Day 56: Fetch books from backend with debounced search
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
        <div className="min-h-screen bg-[#f8fafc] pb-24 font-sans italic">
            {/* Header */}
            <div className="nav-gradient text-white px-6 pt-12 pb-20 rounded-b-[3rem] shadow-lg relative z-10">
                <div className="flex justify-between items-center mb-4">
                    <button onClick={() => navigate(-1)} className="bg-white/20 p-2 rounded-xl active:scale-90 transition-all">
                        <ArrowLeft size={20} />
                    </button>
                    <h1 className="text-xl font-bold uppercase tracking-tight">E-Library</h1>
                    <div className="bg-white/20 p-2 rounded-xl"><Book size={20}/></div>
                </div>

                {/* Day 57: Digital Vault Switcher Added */}
                <button 
                    onClick={() => navigate('/library/digital')}
                    className="flex items-center gap-2 bg-slate-900/40 backdrop-blur-md border border-white/10 px-4 py-2 rounded-2xl mb-6 active:scale-95 transition-all group"
                >
                    <Zap size={14} className="text-yellow-400 group-hover:animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Switch to Digital Vault</span>
                </button>
                
                <div className="relative mt-4">
                    <Search className="absolute left-4 top-3.5 text-blue-300" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search books in catalog..." 
                        className="w-full bg-white/20 text-white placeholder:text-blue-100 py-3.5 pl-12 pr-4 rounded-2xl border border-white/10 outline-none backdrop-blur-md"
                        onChange={(e) => setSearch(e.target.value)} // Day 56: Search handler
                    />
                </div>
            </div>

            <div className="px-5 -mt-8 relative z-20 space-y-6">
                {/* Fine Alert */}
                <div className="bg-red-50 border border-red-100 p-4 rounded-2xl flex items-center gap-3">
                    <AlertCircle className="text-red-500" size={20} />
                    <div>
                        <p className="text-[10px] font-black text-red-500 uppercase tracking-widest">Pending Fine</p>
                        <p className="text-xs font-bold text-red-700">₹0.00 (No Overdue)</p>
                    </div>
                </div>

                {/* Issued & Catalog Books */}
                <div className="space-y-4">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-2">Book Catalog</p>
                    
                    {books.length > 0 ? books.map((book, i) => (
                        <div key={i} className="bg-white rounded-[2.5rem] p-5 shadow-xl border border-white border-l-4 border-l-blue-500 transition-all active:scale-95">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-4">
                                    <div className="bg-blue-50 text-blue-500 p-3 rounded-xl">
                                        <Bookmark size={20} />
                                    </div>
                                    <div>
                                        <h4 className="font-extrabold text-slate-800 text-sm leading-tight uppercase tracking-tighter">{book.title}</h4>
                                        <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">Author: {book.author}</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex justify-between items-center border-t border-slate-50 pt-4 mt-2">
                                <div className="flex items-center gap-2">
                                    <span className="text-[11px] font-bold text-slate-500 uppercase">Loc: {book.shelfLocation || 'Section A'}</span>
                                </div>
                                <span className={`text-[9px] font-black uppercase ${book.status === 'Available' ? 'text-green-500' : 'text-orange-500'}`}>
                                    {book.status}
                                </span>
                            </div>
                        </div>
                    )) : (
                        <div className="text-center py-20 bg-white rounded-[3rem] border border-dashed border-slate-200">
                             <p className="text-slate-300 font-black text-[10px] uppercase tracking-[0.2em]">No Books Found In Neural Database</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Library;