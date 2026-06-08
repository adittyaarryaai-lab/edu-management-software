import React, { useState, useEffect } from 'react';
import { ArrowLeft, Megaphone, Calendar, ChevronDown, ChevronUp, User, IndianRupee, Send, Layers, CheckCircle, Edit3, Trash2, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import API from '../../api';
import { motion, AnimatePresence } from 'framer-motion';

const FeesNoticeManager = () => {
  const navigate = useNavigate();
  const [noticeType, setNoticeType] = useState('');
  const [generatedContent, setGeneratedContent] = useState('');
  const [pendingData, setPendingData] = useState([]);
  const [publishedNotices, setPublishedNotices] = useState([]); // 🔥 Nayi State: Published History Ke Liye
  const [expandedClass, setExpandedClass] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showConfirm, setShowConfirm] = useState(null); // 🔥 Confirm Modal State
  
  // 🔥 TOAST NOTIFICATION STATES (FinanceGateway Equivalent)
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [editingNoticeId, setEditingNoticeId] = useState(null); // Track if we are editing an existing notice

  // --- 1. DYNAMIC SYSTEM DATE PROTOCOL ---
  const todayDate = new Date().toLocaleDateString('en-IN', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  // --- 2. CORE TERMINAL LOADER ROUTINE ---
  const loadNoticeTerminal = async () => {
    try {
      setLoading(true);
      // Fetch Class Defaulters
      const { data: classData } = await API.get('/fee-notices/pending-by-classes');
      setPendingData(classData);

      // 🔥 Fetch Fresh Published History Array
      const { data: historyData } = await API.get('/fee-notices/view');
      setPublishedNotices(historyData.notices || []);
    } catch (err) {
      console.error("Error fetching terminal records:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNoticeTerminal();
  }, []);

  // --- 3. SELECTION LOGIC MATRIX ---
  const handleNoticeSelect = (type) => {
    setNoticeType(type);
    setIsDropdownOpen(false);
    setEditingNoticeId(null); // Reset edit state on fresh selection

    if (type === 'fee_alert') {
      const savedUser = JSON.parse(localStorage.getItem('user'));
      const liveSchoolName = savedUser?.schoolData?.schoolName || "School Administration";
      setGeneratedContent(
        `Dear Parent,\n\nWe hope you are doing well. Our records show that your child's school fee is currently pending. Please make the payment at your earliest convenience.\n\nIf payment has already been made, kindly disregard this reminder.\n\nThank you for your support.\n\nRegards,\n${liveSchoolName}`
      );
    } else if (type === 'others') {
      setGeneratedContent('');
    } else {
      setGeneratedContent('');
    }
  };

  // --- 4. PUBLISH OR UPDATE BROADCAST PROTOCOL ---
  const handlePublishBroadcast = async () => {
    if (!noticeType) return alert("Please select notice type first!");
    if (!generatedContent.trim()) return alert("Notice payload content cannot be empty.");
    
    try {
      setLoading(true);
      
      if (editingNoticeId) {
        // 🔥 UPDATE LOGIC IF EDITING (PUT request payload to specific id)
        await API.put(`/fee-notices/update/${editingNoticeId}`, {
          type: noticeType,
          message: generatedContent
        });
        setToastMsg("Notice updated successfully");
      } else {
        // FRESH PUBLISH
        await API.post('/fee-notices/publish', {
          type: noticeType,
          message: generatedContent
        });
        setToastMsg("ERP Fees Notice sent successfully");
      }

      setShowToast(true);
      setNoticeType('');
      setGeneratedContent('');
      setEditingNoticeId(null);
      
      setTimeout(() => setShowToast(false), 3000);
      loadNoticeTerminal(); // Reload lists
    } catch (err) {
      console.error("Broadcast transmission failure:", err);
      setToastMsg("Broadcast communication failure");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } finally {
      setLoading(false);
    }
  };

  // --- 5. EDIT ACTION TRIGGER ---
  const handleEditTrigger = (notice) => {
    setEditingNoticeId(notice._id);
    setNoticeType(notice.noticeType);
    setGeneratedContent(notice.content);
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll back to form smoothly
  };

  // --- 6. DELETE ACTION SIGNAL ---
 const handleDeleteNotice = async (noticeId) => {
    try {
      setLoading(true);
      await API.delete(`/fee-notices/delete/${noticeId}`);
      
      // Toast success msg
      setToastMsg("Notice Deleted successfully");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      
      loadNoticeTerminal();
    } catch (err) {
      console.error("Failed to delete notice log:", err);
      setToastMsg("Termination failed");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } finally {
      setLoading(false);
      setShowConfirm(null); // Modal band karo
    }
  };

  return (
    <div className="min-h-screen bg-[#F1F5F9] text-slate-800 p-5 pb-32 italic font-sans text-[15px] overflow-x-hidden overscroll-none fixed inset-0 overflow-y-auto">

<AnimatePresence>
        {showConfirm && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-white p-8 rounded-[2rem] shadow-2xl max-w-sm w-full text-center">
              <h3 className="text-xl font-black text-slate-800 italic mb-4">Confirm Termination?</h3>
              <p className="text-slate-500 font-bold mb-8">This action cannot be undone.</p>
              <div className="flex gap-4">
                <button onClick={() => setShowConfirm(null)} className="flex-1 py-4 bg-slate-100 rounded-2xl font-black text-slate-600">No</button>
                <button onClick={() => handleDeleteNotice(showConfirm)} className="flex-1 py-4 bg-rose-500 text-white rounded-2xl font-black">Yes, Delete</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* NEURAL TOAST NOTIFICATION CONTAINER */}
      <AnimatePresence>
        {showToast && (
          <motion.div 
            initial={{ y: -100, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }} 
            exit={{ y: -100, opacity: 0 }}
            className="fixed top-8 left-1/2 -translate-x-1/2 z-[9999] bg-white border-2 border-[#42A5F5] px-10 py-5 rounded-full shadow-2xl flex items-center gap-4 w-fit not-italic"
          >
            <div className="p-2 bg-[#42A5F5] rounded-full shadow-sm">
              <CheckCircle size={18} className="text-white" />
            </div>
            <span className="text-[13px] font-black uppercase text-slate-700 tracking-wider">
              {toastMsg}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Premium Header Layout */}
      <div className="flex items-center gap-5 mb-10 border-l-4 border-[#42A5F5] pl-4">
        <button
          onClick={() => navigate(-1)}
          className="p-3 bg-white rounded-2xl border border-blue-100 shadow-md text-[#42A5F5] active:scale-90 transition-all"
        >
          <ArrowLeft size={24} />
        </button>
        <div>
          <h1 className="text-3xl font-black italic tracking-tight text-slate-800">Fees Notice Hub</h1>
          <p className="text-[11px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-1.5 mt-1 normal-case not-italic">
            <Calendar size={12} className="text-[#42A5F5]" /> {todayDate}
          </p>
        </div>
      </div>

      {/* --- NOTIFIER SELECTOR TRIGGER (Blue Card Style) --- */}
      <div className="bg-[#42A5F5] p-8 rounded-[3rem] mb-6 shadow-xl shadow-blue-100 relative overflow-visible">
        <div className="absolute top-0 right-0 p-10 opacity-10 rotate-12 pointer-events-none">
          <Megaphone size={100} className="text-white" />
        </div>

        <div className="relative z-[60]">
          <button
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-full bg-white p-5 rounded-3xl text-[20px] font-black text-slate-700 flex justify-between items-center transition-all italic shadow-md active:scale-95"
          >
            <span>
              {noticeType === 'fee_alert' ? 'Fee Alert' :
               noticeType === 'others' ? 'Others (Custom Notice)' :
               'Choose Notice Template'}
            </span>
            <ChevronDown size={22} className={`text-[#42A5F5] transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {isDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                className="absolute z-[70] w-full mt-3 bg-white border border-blue-100 rounded-[2rem] shadow-2xl p-3"
              >
                <div
                  onClick={() => handleNoticeSelect('fee_alert')}
                  className={`p-4 mb-1 rounded-2xl cursor-pointer font-bold italic transition-all border-b border-slate-50 ${noticeType === 'fee_alert' ? 'bg-blue-50 text-[#42A5F5]' : 'text-slate-600 hover:bg-slate-50'}`}
                >
                  Fee Alert (Pending Balance Notice)
                </div>

                <div
                  onClick={() => handleNoticeSelect('others')}
                  className={`p-4 rounded-2xl cursor-pointer font-bold italic transition-all ${noticeType === 'others' ? 'bg-blue-50 text-[#42A5F5]' : 'text-slate-600 hover:bg-slate-50'} ${noticeType ? 'border-b border-slate-50 mb-1' : ''}`}
                >
                  Others (Custom Manual Input)
                </div>

                {noticeType && (
                  <div
                    onClick={() => {
                      setNoticeType('');
                      setGeneratedContent('');
                      setIsDropdownOpen(false);
                      setEditingNoticeId(null);
                    }}
                    className="p-4 rounded-2xl cursor-pointer font-black italic text-rose-500 hover:bg-rose-50 bg-rose-50/20 transition-all uppercase text-center text-xs tracking-widest mt-1 border border-rose-100"
                  >
                    ❌ Cancel Selection
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* --- SINGLE LARGE COMPILE CONTAINER CARD --- */}
      <AnimatePresence>
        {noticeType && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: 15 }}
            className="mb-8 p-5 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-4 text-left"
          >
            <div className="relative rounded-xl overflow-hidden bg-slate-50 border border-slate-200 shadow-inner">
              <textarea
                value={generatedContent}
                onChange={(e) => setGeneratedContent(e.target.value)}
                placeholder={noticeType === 'others' ? "Write your message here..." : "Compiling template content..."}
                className="w-full bg-transparent p-4 outline-none text-base font-bold text-slate-700 leading-relaxed resize-none h-64 custom-scrollbar not-italic"
              />
            </div>
            
            <button
              onClick={handlePublishBroadcast}
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#42A5F5] to-blue-600 text-white py-3.5 rounded-xl font-black uppercase text-sm tracking-widest shadow-md flex items-center justify-center gap-2 active:scale-98 transition-all"
            >
              <Send size={14} /> {editingNoticeId ? "Update Notice Logs" : "Send Notice"}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- 🔥 NEW SECTION: HISTORY MATRIX LISTING LOGS (Activity History Like Gateway) --- */}
      <div className="mb-10 space-y-4 text-left">
        <h3 className="text-[18px] font-black text-slate-700 uppercase tracking-widest ml-4 italic">
          Fee Notice History
        </h3>
        <div className="space-y-4">
          {publishedNotices.length > 0 ? publishedNotices.map((notice, i) => {
            const isAlert = notice.noticeType === 'fee_alert';
            const noticePubDate = new Date(notice.createdAt || notice.date);

            return (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                key={notice._id}
                className="bg-white p-6 rounded-[2rem] border border-[#DDE3EA] shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
              >
                <div className="flex items-start gap-4 min-w-0 w-full md:w-auto">
                  <div className={`p-4 rounded-2xl shrink-0 border ${isAlert ? 'bg-rose-50 border-rose-100 text-rose-500' : 'bg-amber-50 border-amber-100 text-amber-500'}`}>
                    <Megaphone size={26} />
                  </div>
                  <div className="w-full truncate">
                    <p className="text-[20px] font-black text-slate-700 uppercase tracking-tight truncate">{notice.title}</p>
                    <p className="text-[15px] font-bold text-slate-800 mt-1 truncate not-italic">{notice.content}</p>
                    <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-800 font-bold uppercase tracking-wider not-italic">
                      <span className="flex items-center gap-1"><Clock size={12} className="text-[#42A5F5]" /> {noticePubDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      <span>•</span>
                      <span>{noticePubDate.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                    </div>
                  </div>
                </div>

                {/* Actions Hub Matrix */}
                <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
                  <button 
                    onClick={() => handleEditTrigger(notice)}
                    className="p-3 bg-blue-50 text-[#42A5F5] rounded-xl border border-blue-100 hover:bg-[#42A5F5] hover:text-white transition-all active:scale-90"
                  >
                    <Edit3 size={16} />
                  </button>
                  <button 
                    onClick={() => setShowConfirm(notice._id)}
                    className="p-3 bg-red-50 text-red-500 rounded-xl border border-red-100 hover:bg-red-500 hover:text-white transition-all active:scale-90"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </motion.div>
            );
          }) : (
            <p className="text-[12px] font-bold text-slate-300 uppercase text-center py-8 italic border-2 border-dashed border-blue-100 rounded-[2.5rem] bg-white/50">No published logs found in system archive</p>
          )}
        </div>
      </div>

      {/* --- CONFIGURATING DEFICIT ACCORDIONS LIST --- */}
      <div className="space-y-4 text-left">
        <h3 className="text-[18px] font-black text-blue-400 uppercase tracking-widest ml-4 italic">
          Pending Fees by Class
        </h3>

        {loading && pendingData.length === 0 ? (
          <div className="py-12 flex flex-col items-center justify-center gap-4">
            <div className="text-slate-700 font-bold text-[15px] uppercase animate-pulse tracking-wider">
              Synchronizing Fee Records...
            </div>
            <div className="w-8 h-8 border-4 border-slate-200 border-t-[#42A5F5] rounded-full animate-spin"></div>
          </div>
        ) : pendingData.length === 0 ? (
          <p className="text-[12px] font-bold text-slate-300 uppercase text-center py-8 italic border-2 border-dashed border-blue-100 rounded-[2.5rem] bg-white/50">
            All Class Accounts Are Up to Date
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {pendingData.map((cls) => (
              <div key={cls.className} className="bg-gradient-to-r from-white to-blue-50 p-6 rounded-[2.5rem] border border-blue-100 transition-all shadow-sm">

                <div
                  onClick={() => setExpandedClass(expandedClass === cls.className ? null : cls.className)}
                  className="flex justify-between items-center cursor-pointer select-none"
                >
                  <div className="flex items-center gap-5">
                    <div className="bg-[#42A5F5] p-4 rounded-2xl text-white shadow-md shadow-blue-200">
                      <Layers size={22} />
                    </div>
                    <div>
                      <p className="text-[20px] font-black text-slate-700 italic capitalize">Class {cls.className}</p>
                      <p className="text-[13px] text-rose-500 font-bold uppercase tracking-widest flex items-center gap-1 mt-1">
                        {cls.students.length} Fee Defaulters Found
                      </p>
                    </div>
                  </div>
                  <ChevronDown size={20} className={`text-slate-800 transition-transform duration-300 ${expandedClass === cls.className ? 'rotate-180' : ''}`} />
                </div>

                <AnimatePresence>
                  {expandedClass === cls.className && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="mt-6 space-y-3 border-t border-slate-100 pt-4 overflow-hidden"
                    >
                      {cls.students.map((std, index) => (
                        <div key={index} className="bg-white/60 p-4 rounded-2xl border border-slate-100 flex justify-between items-center shadow-inner">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="p-2 bg-slate-100 text-slate-500 rounded-xl shrink-0">
                              <User size={14} />
                            </div>
                            <p className="text-[15px] font-bold text-slate-700 capitalize truncate">{std.name}</p>
                          </div>
                          <div className="flex items-center gap-1 text-slate-800 font-black italic text-[15px] bg-amber-50 border border-amber-100/50 p-2 rounded-xl shrink-0">
                            <IndianRupee size={11} strokeWidth={2.5} className="text-amber-600" />
                            {std.totalPending.toLocaleString()}
                          </div>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FeesNoticeManager;