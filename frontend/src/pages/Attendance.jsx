import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import { CheckCircle, XCircle, Save } from 'lucide-react';

const Attendance = () => {
    const [classes, setClasses] = useState([]);
    const [selectedClass, setSelectedClass] = useState('');
    const [students, setStudents] = useState([]);
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [attendanceData, setAttendanceData] = useState({}); 

    useEffect(() => {
        API.get('/classes').then(res => setClasses(res.data));
    }, []);

    const fetchStudents = async (classId) => {
        if(!classId) return;
        setSelectedClass(classId);
        try {
            const res = await API.get(`/students/class/${classId}`);
            setStudents(res.data);
            
            // Critical Fix: Map by the Profile ID to ensure stability
            const initialData = {};
            res.data.forEach(s => {
                initialData[s._id] = 'Present';
            });
            setAttendanceData(initialData);
        } catch (err) {
            console.error("Error fetching students:", err);
        }
    };

    const toggleStatus = (profileId) => {
        setAttendanceData(prev => ({
            ...prev,
            [profileId]: prev[profileId] === 'Present' ? 'Absent' : 'Present'
        }));
    };

    const submitAttendance = async () => {
        // Convert Profile IDs back to User IDs for the backend records
        const records = students.map(s => ({
            studentId: s.userId._id,
            status: attendanceData[s._id]
        }));

        try {
            await API.post('/attendance', { classId: selectedClass, date, records });
            alert("✅ Attendance marked successfully!");
        } catch (err) {
            alert(err.response?.data?.msg || "Error marking attendance");
        }
    };

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-wrap gap-4 items-end">
                <div className="flex-1 min-w-[200px]">
                    <label className="block text-sm font-semibold text-slate-600 mb-1">Select Class</label>
                    <select 
                        className="w-full border p-2 rounded-lg"
                        onChange={(e) => fetchStudents(e.target.value)}
                    >
                        <option value="">-- Choose Class --</option>
                        {classes.map(c => <option key={c._id} value={c._id}>{c.className}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-semibold text-slate-600 mb-1">Date</label>
                    <input 
                        type="date" 
                        value={date}
                        className="border p-2 rounded-lg"
                        onChange={(e) => setDate(e.target.value)}
                    />
                </div>
            </div>

            {students.length > 0 && (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 text-slate-500 uppercase text-xs font-semibold">
                            <tr>
                                <th className="px-6 py-4">Roll No.</th>
                                <th className="px-6 py-4">Student Name</th>
                                <th className="px-6 py-4 text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {students.map((s) => (
                                <tr key={s._id} className="hover:bg-slate-50 transition">
                                    <td className="px-6 py-4 font-medium text-slate-600">{s.rollNumber}</td>
                                    <td className="px-6 py-4 font-bold text-slate-800">{s.userId.name}</td>
                                    <td className="px-6 py-4 flex justify-center">
                                        <button 
                                            type="button"
                                            onClick={() => toggleStatus(s._id)}
                                            className={`flex items-center gap-2 px-4 py-1.5 rounded-full font-bold transition-all duration-200 ${
                                                attendanceData[s._id] === 'Present' 
                                                ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                                                : 'bg-red-100 text-red-700 hover:bg-red-200'
                                            }`}
                                        >
                                            {attendanceData[s._id] === 'Present' ? <CheckCircle size={16}/> : <XCircle size={16}/>}
                                            {attendanceData[s._id]}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="p-6 bg-slate-50 flex justify-end">
                        <button 
                            onClick={submitAttendance}
                            className="bg-blue-600 text-white px-6 py-2 rounded-xl flex items-center gap-2 hover:bg-blue-700 font-bold transition shadow-lg shadow-blue-200"
                        >
                            <Save size={20}/> Save Attendance
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Attendance;