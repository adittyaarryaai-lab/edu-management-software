import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, ArrowRight, Layout } from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans overflow-x-hidden italic font-bold">
      {/* --- Header / Navbar --- */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 py-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-2">
          <div className="bg-[#42A5F5] p-2 rounded-xl text-white shadow-lg shadow-blue-100">
            <Layout size={20} />
          </div>
          <span className="text-xl font-black text-slate-800 tracking-tighter uppercase italic">EduFlowAI</span>
        </div>

        {/* Login Button at Right Corner */}
        <button 
          onClick={() => navigate('/login')}
          className="bg-[#42A5F5] text-white px-8 py-3 rounded-2xl font-black uppercase text-[13px] tracking-widest shadow-xl shadow-blue-100 active:scale-95 transition-all flex items-center gap-2"
        >
          Portal Login <ArrowRight size={16} />
        </button>
      </nav>

      {/* --- Hero Section (Simplified) --- */}
      <main className="pt-40 px-6 text-center max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 bg-blue-50 text-[#42A5F5] px-6 py-2 rounded-full text-[12px] uppercase tracking-[0.2em] mb-8">
            <Zap size={14} className="fill-[#42A5F5]" /> Intelligence in Motion
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 leading-tight uppercase tracking-tighter mb-8 italic">
            Revolutionizing School <br />
            <span className="text-[#42A5F5]">Management System</span>
          </h1>
          <p className="text-slate-400 text-lg md:text-xl font-medium mb-12 italic uppercase leading-relaxed">
            A next-generation neural platform for students, <br /> teachers, and administrators. 
          </p>
          
          <div className="p-10 bg-white rounded-[3rem] border border-slate-100 shadow-2xl">
             <p className="text-slate-300 text-sm tracking-[0.3em] uppercase italic">System Overview Details Coming in Day 181...</p>
          </div>
        </motion.div>
      </main>

      {/* Footer Placeholder */}
      <footer className="py-10 text-center opacity-30 mt-20">
         <p className="text-[10px] font-black uppercase tracking-widest text-slate-900">EduFlowAI Protocol v2.0 • 2026</p>
      </footer>
    </div>
  );
};

export default LandingPage;