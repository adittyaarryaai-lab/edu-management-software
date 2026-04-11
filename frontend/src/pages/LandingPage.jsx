import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { 
  Zap, ArrowRight, Layout, ShieldCheck, Cpu, 
  Users, BarChart3, Bot, Globe, CheckCircle2,
  Clock, CreditCard, Megaphone, MessageCircle, 
  ChevronRight, Laptop, Smartphone, BookOpen
} from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();
  const scrollRef = useRef(null);

  // Compact Modules Data
  const systemModules = [
    { title: "Smart Attendance", desc: "Automated tracking for students and staff with real-time sync.", icon: <CheckCircle2 />, color: "bg-blue-500" },
    { title: "Neural Timetable", desc: "Dynamic schedule generator that eliminates overlaps and optimizes hours.", icon: <Clock />, color: "bg-indigo-500" },
    { title: "Finance Core", desc: "Digital fee collection, automated receipts, and deep ledger analytics.", icon: <CreditCard />, color: "bg-emerald-500" },
    { title: "Broadcast Hub", desc: "Instant notice delivery across the entire institution network.", icon: <Megaphone />, color: "bg-orange-500" },
    { title: "Support Protocol", desc: "Dedicated technical desk for teachers and students via Neural-Link.", icon: <MessageCircle />, color: "bg-rose-500" },
    { title: "Digital Library", desc: "Cloud-based access to study materials and academic resources.", icon: <BookOpen />, color: "bg-cyan-500" },
  ];

  return (
    <div className="min-h-screen bg-[#F1F5F9] font-sans text-slate-900 selection:bg-[#42A5F5] selection:text-white">
      
      {/* --- PREMIUM NAVIGATION --- */}
      <nav className="fixed top-0 left-0 w-full z-[100] bg-white/80 backdrop-blur-2xl border-b border-slate-200/60 px-6 md:px-20 py-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-3">
          <div className="bg-[#42A5F5] p-2 rounded-xl text-white shadow-lg rotate-3">
            <Layout size={22} />
          </div>
          <span className="text-xl font-black tracking-tighter text-slate-800 italic">EduFlowAI</span>
        </div>

        <div className="flex items-center gap-4 md:gap-8">
          <button onClick={() => navigate('/login')} className="hidden md:block text-[14px] font-bold text-slate-500 hover:text-[#42A5F5] transition-all">Support</button>
          <button 
            onClick={() => navigate('/login')}
            className="bg-slate-900 text-white px-6 py-2.5 rounded-2xl font-bold text-[13px] shadow-xl hover:bg-[#42A5F5] transition-all active:scale-95 flex items-center gap-2"
          >
           Login 
          </button>
        </div>
      </nav>

      {/* --- HERO SECTION: COMPACT & POWERFUL --- */}
      <header className="relative pt-32 pb-20 md:pt-48 md:pb-40 px-6 overflow-hidden">
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-200/30 rounded-full blur-[120px] -z-10 translate-x-1/2 -translate-y-1/2"></div>
        
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 text-[#42A5F5] px-4 py-1.5 rounded-full text-[12px] font-bold mb-8 shadow-sm">
              <Zap size={14} className="fill-[#42A5F5]" /> Next-Gen School Management
            </div>
            
            <h1 className="text-4xl md:text-7xl font-black leading-tight tracking-tight text-slate-900 mb-6 italic">
              Experience the <span className="text-[#42A5F5]">Neural Flow</span> <br className="hidden md:block" /> of Modern Education.
            </h1>
            
            <p className="text-slate-500 text-[16px] md:text-xl font-medium mb-10 max-w-2xl mx-auto leading-relaxed italic">
              Automate your institution's daily cycles with our unified platform. Built for students, refined for teachers, and mastered by admins.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <button onClick={() => navigate('/login')} className="bg-[#42A5F5] text-white px-10 py-5 rounded-[1.5rem] font-bold text-[16px] shadow-2xl shadow-blue-200 hover:scale-105 transition-all flex items-center gap-3">
                Get Started Now <ArrowRight size={20} />
              </button>
              <div className="flex items-center gap-3 px-6 py-4 bg-white rounded-[1.5rem] border border-slate-200 text-slate-400 text-[14px] font-bold">
                <Smartphone size={18} /> <Laptop size={18} /> Fully Responsive
              </div>
            </div>
          </motion.div>
        </div>
      </header>

      {/* --- THE SCROLLING MODULE MATRIX (Khatarnak Section) --- */}
      <section className="py-20 bg-slate-900 overflow-hidden">
        <div className="px-6 md:px-20 mb-12 flex flex-col md:flex-row justify-between items-end gap-6">
          <div className="text-left">
            <h2 className="text-3xl md:text-5xl font-black text-white italic tracking-tighter mb-4">Powerful Core Modules</h2>
            <p className="text-slate-400 font-bold text-[14px] md:text-[16px] uppercase tracking-widest italic">Swipe to explore our neural architecture</p>
          </div>
          <div className="flex gap-2 text-slate-500 text-sm font-bold italic uppercase">
            Scroll Right <ChevronRight size={18} />
          </div>
        </div>

        {/* Horizontal Scroll Container */}
        <div className="flex overflow-x-auto gap-6 px-6 md:px-20 pb-10 no-scrollbar cursor-grab active:cursor-grabbing">
          {systemModules.map((m, i) => (
            <motion.div 
              key={i}
              whileHover={{ scale: 1.02 }}
              className="min-w-[280px] md:min-w-[350px] bg-white/5 border border-white/10 p-8 rounded-[2.5rem] backdrop-blur-md flex flex-col justify-between group transition-all hover:bg-white"
            >
              <div>
                <div className={`${m.color} w-14 h-14 rounded-2xl flex items-center justify-center text-white mb-8 shadow-lg group-hover:scale-110 transition-transform`}>
                  {m.icon}
                </div>
                <h3 className="text-2xl font-black text-white group-hover:text-slate-900 italic mb-4 transition-colors">{m.title}</h3>
                <p className="text-slate-400 group-hover:text-slate-600 text-[15px] leading-relaxed font-medium transition-colors">
                  {m.desc}
                </p>
              </div>
              <button className="mt-10 flex items-center gap-2 text-[#42A5F5] font-bold text-sm italic uppercase tracking-wider">
                Learn Protocol <ChevronRight size={16} />
              </button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* --- DEEP INTEGRATION SECTION --- */}
      <section className="py-24 px-6 md:px-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="order-2 md:order-1">
             <div className="relative p-2 bg-gradient-to-tr from-[#42A5F5] to-indigo-600 rounded-[3rem] shadow-3xl">
                <div className="bg-white rounded-[2.8rem] p-1 shadow-inner overflow-hidden">
                    <img 
                      src="https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=1000" 
                      alt="System Dashboard" 
                      className="w-full h-full object-cover rounded-[2.5rem]"
                    />
                </div>
                {/* Floating Stats Card */}
                <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-[2rem] shadow-2xl border border-slate-100 flex items-center gap-4 animate-bounce-slow">
                   <div className="p-3 bg-emerald-50 text-emerald-500 rounded-xl"><Users size={24} /></div>
                   <div>
                     <p className="text-[12px] font-bold text-slate-400 uppercase italic">Active Nodes</p>
                     <p className="text-xl font-black text-slate-800 tracking-tighter">1,240+ Users</p>
                   </div>
                </div>
             </div>
          </div>
          
          <div className="order-1 md:order-2 text-left">
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 italic tracking-tighter mb-8 leading-none">
              Intelligence built <br /> for every <span className="text-[#42A5F5]">Role.</span>
            </h2>
            
            <div className="space-y-6">
               <div className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm flex gap-5 hover:border-[#42A5F5] transition-all group">
                  <div className="p-4 bg-blue-50 text-[#42A5F5] rounded-2xl h-fit group-hover:bg-[#42A5F5] group-hover:text-white transition-all"><Bot size={24} /></div>
                  <div>
                    <h4 className="text-lg font-black italic text-slate-800 mb-1">For Administrators</h4>
                    <p className="text-slate-500 text-sm font-medium">Total control over staff, student enrollment, and financial reports with military encryption.</p>
                  </div>
               </div>
               <div className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm flex gap-5 hover:border-[#42A5F5] transition-all group">
                  <div className="p-4 bg-indigo-50 text-indigo-500 rounded-2xl h-fit group-hover:bg-indigo-500 group-hover:text-white transition-all"><Cpu size={24} /></div>
                  <div>
                    <h4 className="text-lg font-black italic text-slate-800 mb-1">For Faculty</h4>
                    <p className="text-slate-500 text-sm font-medium">Manage attendance, assignments, and digital syllabus without touching a single paper.</p>
                  </div>
               </div>
               <div className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm flex gap-5 hover:border-[#42A5F5] transition-all group">
                  <div className="p-4 bg-cyan-50 text-cyan-500 rounded-2xl h-fit group-hover:bg-cyan-500 group-hover:text-white transition-all"><Globe size={24} /></div>
                  <div>
                    <h4 className="text-lg font-black italic text-slate-800 mb-1">For Students</h4>
                    <p className="text-slate-500 text-sm font-medium">Access live classes, view fees, and track performance records in one personalized portal.</p>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- CTA: READY TO UPGRADE --- */}
      <section className="py-20 px-6">
         <motion.div 
           whileInView={{ scale: [0.95, 1], opacity: [0, 1] }}
           className="max-w-5xl mx-auto bg-[#42A5F5] rounded-[3.5rem] p-12 md:p-20 text-center text-white relative overflow-hidden shadow-3xl shadow-blue-200"
         >
           <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
           <h2 className="text-3xl md:text-6xl font-black italic tracking-tighter mb-8 relative z-10 leading-tight">Ready to synchronize your school <br className="hidden md:block" /> with the future?</h2>
           <p className="text-blue-100 font-bold uppercase tracking-[0.2em] mb-12 relative z-10">Limited onboardings available for 2026</p>
           <button onClick={() => navigate('/login')} className="bg-white text-[#42A5F5] px-12 py-5 rounded-2xl font-black text-lg uppercase shadow-2xl hover:bg-slate-900 hover:text-white transition-all relative z-10">
             Start integration
           </button>
         </motion.div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="py-16 px-6 md:px-20 border-t border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12 text-center md:text-left">
          <div>
            <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
              <div className="bg-slate-900 p-2 rounded-lg text-white"><Layout size={18} /></div>
              <span className="text-lg font-black tracking-tighter italic">EduFlowAI</span>
            </div>
            <p className="text-slate-400 text-sm font-bold italic uppercase tracking-wider">Neural Education Protocol v2.0</p>
          </div>
          
          <div className="flex gap-10 text-xs font-black uppercase tracking-widest text-slate-500 italic">
            <a href="#" className="hover:text-[#42A5F5]">Privacy</a>
            <a href="#" className="hover:text-[#42A5F5]">Security</a>
            <a href="#" className="hover:text-[#42A5F5]">Logs</a>
            <a href="#" className="hover:text-[#42A5F5]">Status</a>
          </div>
          
          <p className="text-[11px] font-bold text-slate-300 uppercase tracking-[0.4em]">© 2026 EduFlowAI Intelligence Hub</p>
        </div>
      </footer>

      {/* Custom Styles for Scrolling */}
      <style dangerouslySetInnerHTML={{ __html: `
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-bounce-slow { animation: bounce-slow 4s ease-in-out infinite; }
      `}} />
    </div>
  );
};

export default LandingPage;