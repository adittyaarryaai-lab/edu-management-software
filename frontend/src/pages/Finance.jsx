import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import { Printer, CreditCard, Search, Loader2 } from 'lucide-react';

const Finance = () => {
    const [invoices, setInvoices] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchInvoices = async () => {
            try {
                const res = await API.get('/finance/invoices');
                setInvoices(res.data);
            } catch (err) {
                console.error("Error fetching invoices:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchInvoices();
    }, []);

    const filteredInvoices = invoices.filter(inv => 
        inv.studentId?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handlePrint = () => {
        window.print(); 
    };

    if (loading) return (
        <div className="flex justify-center items-center h-64 text-slate-500">
            <Loader2 className="animate-spin mr-2" /> Loading Financial Records...
        </div>
    );

    return (
        <div className="space-y-6">
            {/* Header section */}
            <div className="flex justify-between items-center no-print">
                <h2 className="text-2xl font-bold text-slate-800">Fee Management</h2>
                <div className="relative w-64">
                    <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search student name..."
                        className="pl-10 pr-4 py-2 w-full border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Table section */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 text-slate-500 uppercase text-xs font-semibold">
                        <tr>
                            <th className="px-6 py-4">Student</th>
                            <th className="px-6 py-4">Total Fee</th>
                            <th className="px-6 py-4">Paid</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 no-print">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {filteredInvoices.length > 0 ? filteredInvoices.map((inv) => (
                            <tr key={inv._id} className="hover:bg-slate-50 transition">
                                <td className="px-6 py-4 font-medium text-slate-800">{inv.studentId?.name || 'Unknown Student'}</td>
                                <td className="px-6 py-4 text-slate-600">₹{inv.totalAmount}</td>
                                <td className="px-6 py-4 text-green-600 font-bold">₹{inv.paidAmount}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                        inv.status === 'Paid' ? 'bg-green-100 text-green-700' : 
                                        inv.status === 'Partially Paid' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                                    }`}>
                                        {inv.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 flex gap-2 no-print">
                                    <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg" title="Record Payment"><CreditCard size={18}/></button>
                                    <button onClick={handlePrint} className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg" title="Print Receipt"><Printer size={18}/></button>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="5" className="px-6 py-10 text-center text-slate-400">No invoices found. Generate some in the "Class" module first.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Finance;