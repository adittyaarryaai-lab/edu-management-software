import React, { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle2, X, FileText, Clock, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import API from '../api';

const LeaveReview = () => {
    const navigate = useNavigate();
    const [requests, setRequests] = useState([]);

  // LeaveReview.jsx mein isse change kar:
const fetchRequests = async () => {
    try {
        // Sirf /leaves/requests likh, kyunki base URL mein /api pehle se hai
        const { data } = await API.get('/leaves/requests'); 
        setRequests(data);
    } catch (err) {
        console.error("Error fetching requests:", err);
    }
};

    useEffect(() => { fetchRequests(); }, []);

    const handleAction = async (id, status) => {
        await API.post('/api/leaves/status', { id, status });
        fetchRequests(); // List reload
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] p-6 italic font-sans text-[15px]">
            {/* Header */}
            <div className="flex items-center gap-5 mb-8">
                <button onClick={() => navigate(-1)} className="p-3 bg-white rounded-2xl shadow-sm"><ArrowLeft /></button>
                <h1 className="text-3xl font-black italic">Pending Requests</h1>
            </div>

            {/* List */}
            <div className="space-y-6">
                {requests.map(req => (
                    <div key={req._id} className="bg-white p-8 rounded-[2.5rem] border border-[#DDE3EA] shadow-sm">
                        <div className="flex justify-between items-center mb-6">
                            <div className="flex items-center gap-4">
                                <div className="p-4 bg-blue-50 rounded-2xl text-[#42A5F5]"><User /></div>
                                <div>
                                    <h3 className="text-[18px] font-black italic">{req.student.name}</h3>
                                    <p className="text-[12px] font-bold text-slate-400">{req.student.grade} • {req.leaveType}</p>
                                </div>
                            </div>
                            <span className="bg-amber-50 text-amber-600 px-4 py-2 rounded-full font-black text-[12px] italic">{req.reason}</span>
                        </div>
                        
                        <p className="text-[14px] text-slate-600 mb-6 font-bold italic">
                            {new Date(req.fromDate).toLocaleDateString()} {req.toDate ? `to ${new Date(req.toDate).toLocaleDateString()}` : ''}
                        </p>

                        <div className="flex gap-4">
                            <button onClick={() => handleAction(req._id, 'Approved')} className="flex-1 bg-emerald-500 text-white p-5 rounded-2xl font-black italic">Approve</button>
                            <button onClick={() => handleAction(req._id, 'Rejected')} className="flex-1 bg-rose-500 text-white p-5 rounded-2xl font-black italic">Reject</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LeaveReview;