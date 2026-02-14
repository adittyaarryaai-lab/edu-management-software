import React, { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle2, XCircle, Save, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import API from '../api'; 
import Toast from '../components/Toast';
import Loader from '../components/Loader';

const TeacherAttendance = () => {
  const navigate = useNavigate();
  const [selectedClass, setSelectedClass] = useState('10-A'); 
  const [showToast, setShowToast] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const { data } = await API.get(`/users/students/${selectedClass}`);
        
        const formattedData = data.map(s => ({
          id: s._id,
          name: s.name,
          roll: s.enrollmentNo,
          status: 'Present' 
        }));
        
        setStudents(formattedData);
      } catch (err) {
        console.error("Fetch Error:", err);
        alert("Failed to fetch student list from Database");
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, [selectedClass]);

  const toggleStatus = (id) => {
    setStudents(students.map(s => 
      s.id === id ? { ...s, status: s.status === 'Present' ? 'Absent' : 'Present' } : s
    ));
  };

  // ================= DAY 35 UPDATE: REAL SUBMISSION START =================
  const handleSubmit = async () => {
    if (students.length === 0) return;
    
    setIsSaving(true);
    try {
        // 1. Backend ke schema ke hisaab se records taiyar kar rahe hain
        const records = students.map(s => ({
            student: s.id,
            status: s.status
        }));

        // 2. Payload structure as per Attendance Model
        const payload = {
            grade: selectedClass,
            date: new Date().toISOString().split('T')[0], // YYYY-MM-DD format
            records: records
        };

        // 3. Real API Call to Backend
        await API.post('/attendance/save', payload);
        
        // 4. Success UI Feedback
        setShowToast(true);
        
        // 5. Thoda wait karke wapas dashboard par bhej denge
        setTimeout(() => {
            setIsSaving(false);
            navigate('/dashboard');
        }, 2000);

    } catch (err) {
        console.error("Submit Error:", err);
        alert(err.response?.data?.message || "Attendance submission failed!");
        setIsSaving(false);
    }
  };
  // ================= DAY 35 UPDATE: END =================

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-white"><Loader /></div>;

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-24 relative">
      {showToast && (
        <Toast 
            message="Attendance Saved to Cloud!" 
            type="success" 
            onClose={() => setShowToast(false)} 
        />
      )}

      {/* Header */}
      <div className="nav-gradient text-white px-6 pt-12 pb-24 rounded-b-[3rem] shadow-lg relative z-10">
        <div className="flex justify-between items-center mb-6">
          <button onClick={() => navigate(-1)} className="bg-white/20 p-2 rounded-xl active:scale-90 transition-all">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-bold uppercase tracking-tight">Mark Attendance</h1>
          <div className="bg-white/20 p-2 rounded-xl"><Users size={20}/></div>
        </div>

        <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-md border border-white/10 flex justify-between items-center">
            <div>
                <p className="text-[10px] font-bold uppercase opacity-70 mb-1">Active Class</p>
                <h2 className="text-lg font-bold">Grade {selectedClass}</h2>
            </div>
            <div className="text-right">
                <p className="text-[10px] font-bold uppercase opacity-70 mb-1">Date</p>
                <h2 className="text-sm font-bold uppercase">{new Date().toLocaleDateString('en-GB')}</h2>
            </div>
        </div>
      </div>

      {/* Student List Grid */}
      <div className="px-5 -mt-12 space-y-4 relative z-20">
        <div className="flex justify-between items-center px-2 mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Database: {students.length} Students</span>
            <span className="text-xs font-bold text-green-500 uppercase font-black">Present: {students.filter(s => s.status === 'Present').length}</span>
        </div>

        {students.length === 0 ? (
            <div className="bg-white p-10 rounded-[2.5rem] text-center border-2 border-dashed border-slate-100">
                <p className="text-slate-400 font-bold text-sm">No students found in {selectedClass}</p>
                <p className="text-[10px] text-slate-300 uppercase mt-2">Check Admin Enrollment</p>
            </div>
        ) : (
            students.map((student) => (
                <div key={student.id} className="glass-card p-5 flex justify-between items-center">
                  <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center font-bold text-xs shadow-inner">
                          {student.name.charAt(0)}
                      </div>
                      <div>
                          <h3 className="font-bold text-slate-800 text-sm leading-none">{student.name}</h3>
                          <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-tighter">Roll: {student.roll}</p>
                      </div>
                  </div>
      
                  <button 
                      onClick={() => toggleStatus(student.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-2xl font-bold text-[10px] uppercase transition-all shadow-sm ${
                          student.status === 'Present' 
                          ? 'bg-green-50 text-green-600 border border-green-100' 
                          : 'bg-red-50 text-red-500 border border-red-100'
                      }`}
                  >
                      {student.status === 'Present' ? <CheckCircle2 size={14}/> : <XCircle size={14}/>}
                      {student.status}
                  </button>
                </div>
              ))
        )}

        {/* Action Button */}
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 w-full px-10 z-30">
            <button 
                onClick={handleSubmit}
                disabled={isSaving || students.length === 0}
                className={`w-full py-4 rounded-3xl font-bold shadow-2xl flex items-center justify-center gap-2 active:scale-95 transition-all ${
                    isSaving || students.length === 0 ? 'bg-slate-300 text-white' : 'bg-blue-500 text-white shadow-blue-300'
                }`}
            >
                {isSaving ? (
                    <span className="animate-pulse flex items-center gap-2 text-sm">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Saving...
                    </span>
                ) : (
                    <>
                        <Save size={20} />
                        <span>Submit {selectedClass} Attendance</span>
                    </>
                )}
            </button>
        </div>
      </div>
    </div>
  );
};

export default TeacherAttendance;