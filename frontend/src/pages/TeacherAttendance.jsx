import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2, XCircle, Save, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TeacherAttendance = () => {
  const navigate = useNavigate();
  const [selectedClass, setSelectedClass] = useState('Grade 10-B');
  
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

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-24">
      {/* Header */}
      <div className="nav-gradient text-white px-6 pt-12 pb-24 rounded-b-[3rem] shadow-lg relative z-10">
        <div className="flex justify-between items-center mb-6">
          <button onClick={() => navigate(-1)} className="bg-white/20 p-2 rounded-xl">
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

            {/* Attendance Toggle */}
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

        {/* Floating Action Button for Saving */}
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 w-full px-10">
            <button className="w-full bg-blue-500 text-white py-4 rounded-3xl font-bold shadow-2xl shadow-blue-300 flex items-center justify-center gap-2 active:scale-95 transition-all">
                <Save size={20} />
                <span>Submit Attendance</span>
            </button>
        </div>
      </div>
    </div>
  );
};

export default TeacherAttendance;