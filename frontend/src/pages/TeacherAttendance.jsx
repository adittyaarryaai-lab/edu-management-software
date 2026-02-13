import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2, XCircle, Save, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Toast from '../components/Toast'; // Step 14 Import

const TeacherAttendance = () => {
  const navigate = useNavigate();
  const [selectedClass, setSelectedClass] = useState('Grade 10-B');
  const [showToast, setShowToast] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Mock Student List
  const [students, setStudents] = useState([
    { id: 1, name: 'Rahul Kumar', roll: '101', status: 'Present' },
    { id: 2, name: 'New Test Student', roll: '105', status: 'Present' },
    { id: 3, name: 'Ravi Sharma', roll: '110', status: 'Absent' },
    { id: 4, name: 'Anjali Singh', roll: '112', status: 'Present' },
  ]);

  const toggleStatus = (id) => {
    setStudents(students.map(s => 
      s.id === id ? { ...s, status: s.status === 'Present' ? 'Absent' : 'Present' } : s
    ));
  };

  // Step 14: Submit logic with Feedback
  const handleSubmit = () => {
    setIsSaving(true);
    // Fake loading for 1.5 seconds to simulate API call
    setTimeout(() => {
        setIsSaving(false);
        setShowToast(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-24 relative">
      {/* Step 14: Show Toast when triggered */}
      {showToast && (
        <Toast 
            message="Attendance Saved Successfully!" 
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

        <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-md border border-white/10">
            <p className="text-[10px] font-bold uppercase opacity-70 mb-1">Active Class</p>
            <h2 className="text-lg font-bold">{selectedClass}</h2>
        </div>
      </div>

      {/* Student List Grid */}
      <div className="px-5 -mt-12 space-y-4 relative z-20">
        <div className="flex justify-between items-center px-2 mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Students: {students.length}</span>
            <span className="text-xs font-bold text-green-500 uppercase">Present: {students.filter(s => s.status === 'Present').length}</span>
        </div>

        {students.map((student) => (
          <div key={student.id} className="glass-card p-5 flex justify-between items-center">
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center font-bold text-xs shadow-inner">
                    {student.roll}
                </div>
                <div>
                    <h3 className="font-bold text-slate-800 text-sm leading-none">{student.name}</h3>
                    <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-tighter">Roll No: {student.roll}</p>
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
        ))}

        {/* Floating Action Button - Updated with Loading State */}
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 w-full px-10 z-30">
            <button 
                onClick={handleSubmit}
                disabled={isSaving}
                className={`w-full py-4 rounded-3xl font-bold shadow-2xl flex items-center justify-center gap-2 active:scale-95 transition-all ${
                    isSaving ? 'bg-slate-300 text-white' : 'bg-blue-500 text-white shadow-blue-300'
                }`}
            >
                {isSaving ? (
                    <span className="animate-pulse flex items-center gap-2 text-sm">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Submitting...
                    </span>
                ) : (
                    <>
                        <Save size={20} />
                        <span>Submit Attendance</span>
                    </>
                )}
            </button>
        </div>
      </div>
    </div>
  );
};

export default TeacherAttendance;