import React from 'react';
import { ArrowLeft, Book, Clock, AlertCircle, Bookmark, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Library = () => {
    const navigate = useNavigate();

    const issuedBooks = [
        { title: "Introduction to Algorithms", author: "Cormen", dueDate: "20 Feb 2026", status: "Due Soon", color: "text-orange-500" },
        { title: "React Design Patterns", author: "Addy Osmani", dueDate: "05 Mar 2026", status: "Issued", color: "text-green-500" },
    ];

    return (
        <div className="min-h-screen bg-[#f8fafc] pb-24">
            {/* Header */}
            <div className="nav-gradient text-white px-6 pt-12 pb-20 rounded-b-[3rem] shadow-lg relative z-10">
                <div className="flex justify-between items-center mb-6">
                    <button onClick={() => navigate(-1)} className="bg-white/20 p-2 rounded-xl active:scale-90 transition-all">
                        <ArrowLeft size={20} />
                    </button>
                    <h1 className="text-xl font-bold uppercase tracking-tight">E-Library</h1>
                    <div className="bg-white/20 p-2 rounded-xl"><Book size={20}/></div>
                </div>
                
                <div className="relative mt-4">
                    <Search className="absolute left-4 top-3.5 text-blue-300" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search books in catalog..." 
                        className="w-full bg-white/20 text-white placeholder:text-blue-100 py-3.5 pl-12 pr-4 rounded-2xl border border-white/10 outline-none backdrop-blur-md"
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

                {/* Issued Books */}
                <div className="space-y-4">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-2">Currently Issued</p>
                    
                    {issuedBooks.map((book, i) => (
                        <div key={i} className="glass-card p-5 border-l-4 border-l-blue-500">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-4">
                                    <div className="bg-blue-50 text-blue-500 p-3 rounded-xl">
                                        <Bookmark size={20} />
                                    </div>
                                    <div>
                                        <h4 className="font-extrabold text-slate-800 text-sm leading-tight">{book.title}</h4>
                                        <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase">Author: {book.author}</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex justify-between items-center border-t border-slate-50 pt-4 mt-2">
                                <div className="flex items-center gap-2">
                                    <Clock size={14} className="text-slate-400" />
                                    <span className="text-[11px] font-bold text-slate-600">Due: {book.dueDate}</span>
                                </div>
                                <span className={`text-[9px] font-black uppercase ${book.color}`}>{book.status}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Library;