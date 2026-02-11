import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import { X } from 'lucide-react';

const AddStudentModal = ({ isOpen, onClose, onStudentAdded }) => {
    const [classes, setClasses] = useState([]);
    const [formData, setFormData] = useState({
        name: '', email: '', password: 'studentpassword123',
        classId: '', rollNumber: '', parentName: '', parentContact: ''
    });

    useEffect(() => {
        if (isOpen) {
            // Fetch classes so the admin can select one
            API.get('/classes').then(res => setClasses(res.data));
        }
    }, [isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await API.post('/students/admit', formData);
            onStudentAdded(); // Refresh the list in the parent component
            onClose(); // Close the modal
        } catch (err) {
            alert(err.response?.data?.msg || "Error adding student");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
                <div className="p-6 border-b flex justify-between items-center bg-slate-50">
                    <h3 className="text-xl font-bold text-slate-800">Admit New Student</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X /></button>
                </div>
                
                <form onSubmit={handleSubmit} className="p-6 grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                        <label className="text-sm font-semibold text-slate-600">Full Name</label>
                        <input type="text" required className="w-full border p-2 rounded-lg" 
                            onChange={e => setFormData({...formData, name: e.target.value})} />
                    </div>
                    <div>
                        <label className="text-sm font-semibold text-slate-600">Email</label>
                        <input type="email" required className="w-full border p-2 rounded-lg" 
                            onChange={e => setFormData({...formData, email: e.target.value})} />
                    </div>
                    <div>
                        <label className="text-sm font-semibold text-slate-600">Roll Number</label>
                        <input type="text" required className="w-full border p-2 rounded-lg" 
                            onChange={e => setFormData({...formData, rollNumber: e.target.value})} />
                    </div>
                    <div className="col-span-2">
                        <label className="text-sm font-semibold text-slate-600">Select Class</label>
                        <select required className="w-full border p-2 rounded-lg" 
                            onChange={e => setFormData({...formData, classId: e.target.value})}>
                            <option value="">-- Select --</option>
                            {classes.map(c => <option key={c._id} value={c._id}>{c.className}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="text-sm font-semibold text-slate-600">Parent Name</label>
                        <input type="text" required className="w-full border p-2 rounded-lg" 
                            onChange={e => setFormData({...formData, parentName: e.target.value})} />
                    </div>
                    <div>
                        <label className="text-sm font-semibold text-slate-600">Parent Contact</label>
                        <input type="text" required className="w-full border p-2 rounded-lg" 
                            onChange={e => setFormData({...formData, parentContact: e.target.value})} />
                    </div>
                    
                    <button type="submit" className="col-span-2 mt-4 bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition">
                        Confirm Admission
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddStudentModal;