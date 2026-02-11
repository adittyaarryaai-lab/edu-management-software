import React, { useEffect, useState } from 'react';
import API from '../api/axios';
import { Search, UserCircle } from 'lucide-react';

const StudentList = () => {
    const [students, setStudents] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchStudents = async () => {
            const res = await API.get('/students/all');
            setStudents(res.data);
        };
        fetchStudents();
    }, []);

    // Filter logic for search
    const filteredStudents = students.filter(s => 
        s.userId.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.rollNumber.includes(searchTerm)
    );

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <h3 className="text-xl font-bold text-slate-800">Student Directory</h3>
                <div className="relative w-64">
                    <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
                    <input 
                        type="text" placeholder="Search by name or roll..."
                        className="pl-10 pr-4 py-2 w-full border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>
            <table className="w-full text-left">
                <thead className="bg-slate-50 text-slate-500 uppercase text-xs font-semibold">
                    <tr>
                        <th className="px-6 py-4">Name</th>
                        <th className="px-6 py-4">Roll No.</th>
                        <th className="px-6 py-4">Class</th>
                        <th className="px-6 py-4">Parent Contact</th>
                        <th className="px-6 py-4">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {filteredStudents.map((s) => (
                        <tr key={s._id} className="hover:bg-slate-50 transition">
                            <td className="px-6 py-4 flex items-center gap-3">
                                <UserCircle size={32} className="text-slate-300" />
                                <span className="font-medium text-slate-700">{s.userId.name}</span>
                            </td>
                            <td className="px-6 py-4 text-slate-600">{s.rollNumber}</td>
                            <td className="px-6 py-4">
                                <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-sm uppercase">
                                    {s.classId?.className || "N/A"}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-slate-600">{s.parentContact}</td>
                            <td className="px-6 py-4">
                                <button className="text-blue-600 hover:underline font-medium">View Profile</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default StudentList;