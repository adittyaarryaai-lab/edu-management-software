import React, { useState, useEffect } from 'react';
import { ArrowLeft, IndianRupee, Search, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import Loader from '../components/Loader';

const AdminFees = () => {
    const navigate = useNavigate();
    const [fees, setFees] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFees = async () => {
            try {
                const { data } = await API.get('/fees/all');
                setFees(data);
            } catch (err) {
                console.error("Error fetching fees");
            } finally {
                setLoading(false);
            }
        };
        fetchFees();
    }, []);

    if (loading) return <Loader />;

    return (
        <div className="min-h-screen bg-[#f8fafc] pb-24">
            <div className="nav-gradient text-white px-6 pt-12 pb-20 rounded-b-[3rem] shadow-lg">
                <div className="flex items-center gap-4 mb-6">
                    <button onClick={() => navigate(-1)} className="bg-white/20 p-2 rounded-xl"><ArrowLeft size={20}/></button>
                    <h1 className="text-xl font-bold uppercase tracking-tight">Fee Management</h1>
                </div>
                
                <div className="bg-white/10 p-4 rounded-3xl backdrop-blur-md flex items-center gap-3">
                    <Search size={18} className="opacity-50" />
                    <input type="text" placeholder="Search student name..." className="bg-transparent border-none outline-none w-full text-sm placeholder:text-white/50" />
                </div>
            </div>

            <div className="px-5 -mt-8 space-y-4">
                {fees.map((f) => (
                    <div key={f._id} className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-50 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="bg-green-50 text-green-600 p-3 rounded-2xl">
                                <IndianRupee size={20} />
                            </div>
                            <div>
                                <h4 className="font-black text-slate-800 text-sm leading-none">{f.student?.name}</h4>
                                <p className="text-[10px] text-slate-400 mt-1 font-bold uppercase tracking-tighter">
                                    Grade: {f.student?.grade} • Due: {f.dueDate}
                                </p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-sm font-black text-slate-800">₹{f.totalAmount - f.paidAmount}</p>
                            <p className={`text-[8px] font-black uppercase tracking-widest ${f.status === 'Paid' ? 'text-green-500' : 'text-orange-500'}`}>
                                {f.status}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminFees;