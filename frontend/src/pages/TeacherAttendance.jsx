import React, { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle2, XCircle, Save, Users, Calendar, RefreshCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import API from '../api'; 
import Toast from '../components/Toast';
import Loader from '../components/Loader';

const TeacherAttendance = ({ user }) => {
  const navigate = useNavigate();
  const [selectedClass, setSelectedClass] = useState(user?.grade || '10-A'); 
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [showToast, setShowToast] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState([]);
  const [isUpdateMode, setIsUpdateMode] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const { data: stdList } = await API.get(`/users/students/${selectedClass}`);
        const { data: existing } = await API.get(`/attendance/view?grade=${selectedClass}&date=${selectedDate}`);
        
        if (existing && existing.records.length > 0) {
            const formattedData = stdList.map(s => {
                const record = existing.records.find(r => r.studentId === s._id || r.student === s._id);
                return {
                    id: s._id,
                    name: s.name,
                    roll: s.enrollmentNo,
                    status: record ? record.status : 'Present'
                };
            });
            setStudents(formattedData);
            setIsUpdateMode(true);
        } else {
            const formattedData = stdList.map(s => ({
                id: s._id,
                name: s.name,
                roll: s.enrollmentNo,
                status: 'Present' 
            }));
            setStudents(formattedData);
            setIsUpdateMode(false);
        }
      } catch (err) {
        console.error("Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedClass, selectedDate]);

  const toggleStatus = (id) => {
    setStudents(students.map(s => 
      s.id === id ? { ...s, status: s.status === 'Present' ? 'Absent' : 'Present' } : s
    ));
  };

  const handleSubmit = async () => {
    if (students.length === 0) return;
    setIsSaving(true);
    try {
        const records = students.map(s => ({
            studentId: s.id,
            name: s.name,
            status: s.status
        }));

        const payload = {
            grade: selectedClass,
            date: selectedDate,
            records: records
        };

        await API.post('/attendance/mark', payload);
        
        setShowToast(true);
        setTimeout(() => {
            setIsSaving(false);
        }, 2000);

    } catch (err) {
        alert(err.response?.data?.message || "Submission failed!");
        setIsSaving(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-10"> {/* Padding bottom kam ki */}
      {showToast && (
        <Toast 
            message={isUpdateMode ? "Records Updated Successfully!" : "Attendance Saved!"} 
            type="success" 
            onClose={() => setShowToast(false)} 
        />
      )}

      {/* Header */}
      <div className="nav-gradient text-white px-6 pt-12 pb-24 rounded-b-[3.5rem] shadow-lg relative z-10">
        <div className="flex justify-between items-center mb-6">
          <button onClick={() => navigate(-1)} className="bg-white/20 p-2 rounded-xl active:scale-90 transition-all">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-black uppercase tracking-tight italic">Register v2.0</h1>
          <div className="bg-white/20 p-2 rounded-xl"><Calendar size={20}/></div>
        </div>

        <div className="bg-slate-900/40 backdrop-blur-xl p-5 rounded-[2.5rem] border border-white/10 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center px-2">
                <div>
                    <p className="text-[9px] font-black uppercase opacity-60 tracking-widest text-blue-400">Target Grade</p>
                    <select 
                        value={selectedClass} 
                        onChange={(e) => setSelectedClass(e.target.value)}
                        className="bg-transparent font-black text-lg outline-none appearance-none cursor-pointer"
                    >
                        <option value="10-A" className="text-slate-900">10-A</option>
                        <option value="12-C" className="text-slate-900">12-C</option>
                    </select>
                </div>
                <div className="text-right">
                    <p className="text-[9px] font-black uppercase opacity-60 tracking-widest text-blue-400">Academic Date</p>
                    <input 
                        type="date" 
                        value={selectedDate} 
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="bg-transparent font-black text-sm outline-none cursor-pointer"
                    />
                </div>
            </div>
        </div>
      </div>

      {/* List Area */}
      <div className="px-5 -mt-10 space-y-4 relative z-20">
        <div className="flex justify-between items-center px-4 mb-2">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                {isUpdateMode ? '📍 Updating Records' : '📝 New Entry'}
            </span>
            <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full border border-blue-100 italic">
                Present: {students.filter(s => s.status === 'Present').length} / {students.length}
            </span>
        </div>

        {students.map((student) => (
            <div key={student.id} className="bg-white p-5 rounded-[2.5rem] flex justify-between items-center shadow-xl shadow-slate-200/50 border border-white group active:scale-[0.98] transition-all">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-900 text-white rounded-3xl flex items-center justify-center font-black text-xs shadow-lg italic">
                        {student.name.substring(0,2).toUpperCase()}
                    </div>
                    <div>
                        <h3 className="font-black text-slate-800 text-sm uppercase italic tracking-tighter">{student.name}</h3>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">ID: {student.roll}</p>
                    </div>
                </div>

                <button 
                    onClick={() => toggleStatus(student.id)}
                    className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-black text-[10px] uppercase transition-all shadow-md ${
                        student.status === 'Present' 
                        ? 'bg-green-500 text-white shadow-green-200' 
                        : 'bg-red-500 text-white shadow-red-200'
                    }`}
                >
                    {student.status === 'Present' ? <CheckCircle2 size={14}/> : <XCircle size={14}/>}
                    {student.status}
                </button>
            </div>
        ))}

        {/* --- FIXED BUTTON POSITION --- */}
        <div className="pt-10 pb-20 w-full px-4 z-30"> {/* Fixed se hata kar normal div kiya */}
            <button 
                onClick={handleSubmit}
                disabled={isSaving || students.length === 0}
                className={`w-full py-5 rounded-[2rem] font-black shadow-2xl flex items-center justify-center gap-3 active:scale-95 transition-all uppercase text-[11px] tracking-[0.2em] ${
                    isSaving ? 'bg-slate-300 text-white' : 'bg-slate-900 text-white shadow-slate-400'
                }`}
            >
                {isSaving ? "Synchronizing..." : (isUpdateMode ? "Update Attendance" : "Finalize Attendance")}
                {isUpdateMode ? <RefreshCcw size={18} /> : <Save size={18} />}
            </button>
        </div>
      </div>
    </div>
  );
};

export default TeacherAttendance;