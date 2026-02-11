import React, { useEffect, useState } from 'react';
import API from '../api/axios';
import { Users, IndianRupee, UserCheck } from 'lucide-react';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await API.get('/institutes/admin-stats');
                setStats(res.data);
            } catch (err) {
                console.error("Failed to fetch stats");
            }
        };
        fetchStats();
    }, []);

    if (!stats) return <div>Loading Stats...</div>;

    const cards = [
        { title: 'Total Students', value: stats.studentCount, icon: <Users className="text-blue-600" />, bg: 'bg-blue-50' },
        { title: 'Total Teachers', value: stats.teacherCount, icon: <UserCheck className="text-green-600" />, bg: 'bg-green-50' },
        { title: 'Total Revenue', value: `₹${stats.totalRevenue.toLocaleString()}`, icon: <IndianRupee className="text-purple-600" />, bg: 'bg-purple-50' },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {cards.map((card, index) => (
                <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
                    <div className={`p-4 ${card.bg} rounded-xl`}>{card.icon}</div>
                    <div>
                        <p className="text-sm text-slate-500 font-medium">{card.title}</p>
                        <p className="text-2xl font-bold text-slate-800">{card.value}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default AdminDashboard;