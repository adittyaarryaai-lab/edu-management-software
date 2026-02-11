import React, { useEffect, useState } from 'react';
import API from '../api/axios';
import { Search, UserCircle, UserPlus } from 'lucide-react';
import AddStudentModal from '../components/AddStudentModal'; // Import the Modal we created

const StudentList = () => {
    const [students, setStudents] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false); // State to control Modal

    // Function to fetch students - separated so we can call it after adding a new student
    const fetchStudents = async () => {
        try {
            const res = await API.get('/students/all');
            setStudents(res.data);
        } catch (err) {
            console.error("Error fetching students:", err);
        }
    };

    useEffect(() => {
        fetchStudents();
    }, []);

    // Filter logic for search
    const filteredStudents = students.filter(s =>
        s.userId?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.rollNumber.includes(searchTerm)
    );

    return (
        <div className="space-y-6">
            {/* Header Section with Add Button */}
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-slate-800">Student Management</h2>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition shadow-lg shadow-blue-200"
                >
                    <UserPlus size={20} /> Admit Student
                </button>
            </div>

            {/* Table Card Section */}
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
                        {filteredStudents.length > 0 ? (
                            filteredStudents.map((s) => (
                                <tr key={s._id} className="hover:bg-slate-50 transition">
                                    <td className="px-6 py-4 flex items-center gap-3">
                                        <UserCircle size={32} className="text-slate-300" />
                                        <span className="font-medium text-slate-700">{s.userId?.name}</span>
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
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="px-6 py-10 text-center text-slate-400 italic">
                                    No students found matching your search.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Admit Student Modal Component */}
            <AddStudentModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onStudentAdded={fetchStudents}
            />
        </div>
    );
};

export default StudentList;