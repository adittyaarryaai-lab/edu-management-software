import React, { useState, useEffect } from 'react';
import { Download, Printer, Layers, Calendar, ArrowLeft} from 'lucide-react';
import API from '../../api';
import { useNavigate } from 'react-router-dom';

const FeeReports = () => {
    const navigate = useNavigate();
    const [report, setReport] = useState({
        totalCollected: 0,
        transactionCount: 0,
        classWise: [],
        history: [],
        schoolName: "",
        schoolAddress: ""
    });

    useEffect(() => {
        const fetchReport = async () => {
            try {
                // Pehle stats se school info uthayenge (Auto Generate)
                const { data: statsData } = await API.get('/users/finance/stats');
                const { data: reportData } = await API.get('/fees/reports/summary');

                setReport({
                    ...reportData,
                    schoolName: statsData.schoolName,
                    schoolAddress: statsData.schoolAddress
                });
            } catch (err) {
                console.error("Report Fetch Error");
            }
        };
        fetchReport();
    }, []);

    return (
        <div className="min-h-screen bg-void text-white p-5 pb-24 italic print:bg-white print:text-black print:p-0">

            {/* CSS TO REMOVE BROWSER HEADERS (Localhost/Date/Frontend) */}
            <style dangerouslySetInnerHTML={{
                __html: `
                @media print {
                    @page { margin: 15mm; }
                    body { -webkit-print-color-adjust: exact; }
                    header, footer, .no-print { display: none !important; }
                }
            `}} />

            {/* --- AUTO GENERATED OFFICIAL HEADER --- */}
            <div className="hidden print:flex flex-col items-center border-b-4 border-black pb-8 mb-10 text-center">
                <h1 className="text-5xl font-black uppercase tracking-tighter leading-tight">{report.schoolName}</h1>
                <p className="text-sm uppercase font-bold text-gray-700 mt-2">{report.schoolAddress}</p>
                <div className="mt-8 bg-black text-white px-10 py-2 font-black uppercase italic text-xs tracking-widest">
                    FEES COLLECTION REPORT
                </div>
            </div>

            {/* --- SCREEN HEADER --- */}
            <div className="flex justify-between items-center mb-10 border-l-4 border-neon pl-4 print:hidden">
                <div className="flex items-center gap-5">
                    {/* --- BACK NAVIGATION BUTTON --- */}
                    <button
                        onClick={() => navigate(-1)}
                        className="p-3 bg-white/5 rounded-2xl border border-white/10 hover:border-neon/50 hover:bg-neon/5 transition-all active:scale-90 group shadow-lg"
                    >
                        <ArrowLeft className="text-white/40 group-hover:text-neon transition-colors" size={20} />
                    </button>

                    <div>
                        <h1 className="text-xl font-black uppercase tracking-tighter italic">FEE RECORDS</h1>
                        <p className="text-[8px] text-white/20 uppercase font-black tracking-[0.3em] italic">Institutional Accounts Node</p>
                    </div>
                </div>

                <button onClick={() => window.print()} className="p-4 bg-white/5 rounded-2xl text-neon hover:bg-neon hover:text-void transition-all shadow-xl">
                    <Printer size={20} />
                </button>
            </div>

            {/* --- TOTAL SUMMARY (Simple Names) --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10 print:grid-cols-2 print:gap-10">
                <div className="bg-slate-900/60 p-10 rounded-[3rem] border border-white/5 text-center print:border-2 print:border-black print:bg-transparent print:rounded-none">
                    <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-3 print:text-black">TOTAL FEES RECEIVED</p>
                    <h2 className="text-5xl font-black tracking-tighter text-neon print:text-black">₹{report.totalCollected.toLocaleString()}</h2>
                    <p className="text-[8px] font-bold text-white/30 mt-4 uppercase print:text-black italic">Total {report.transactionCount} Successful Payments</p>
                </div>

                <div className="bg-slate-900/40 rounded-[2.5rem] border border-white/5 p-8 print:border-2 print:border-black print:bg-transparent print:rounded-none">
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-6 print:text-black">CLASS-WISE SUMMARY</h3>
                    <div className="space-y-3">
                        {report.classWise.map((item, i) => (
                            <div key={i} className="flex justify-between text-[11px] border-b border-white/5 pb-2 print:border-black">
                                <span className="font-black">CLASS {item._id}</span>
                                <span className="font-bold text-neon print:text-black">₹{item.total.toLocaleString()}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* --- STUDENT LIST (Simple Table) --- */}
            <div className="bg-slate-900/20 rounded-[2.5rem] border border-white/5 overflow-hidden print:border-2 print:border-black print:rounded-none">
                <div className="p-6 border-b border-white/5 bg-white/5 print:bg-gray-100 print:border-black">
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-white/40 print:text-black">ALL PAYMENTS LIST</h3>
                </div>
                <table className="w-full text-left text-[11px]">
                    <thead className="bg-white/5 uppercase font-black text-white/40 border-b border-white/5 print:text-black print:border-black">
                        <tr>
                            <th className="p-5">Date</th>
                            <th className="p-5">Student Name</th>
                            <th className="p-5">Grade</th>
                            <th className="p-5 text-right">Amount</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 print:divide-black">
                        {report.history?.map((fee, i) => (
                            <tr key={i} className="print:text-black">
                                <td className="p-5 font-bold">{new Date(fee.date).toLocaleDateString()}</td>
                                <td className="p-5 font-black uppercase">{fee.student?.name || '---'}</td>
                                <td className="p-5 font-bold">Class {fee.student?.grade}</td>
                                <td className="p-5 text-right font-black">₹{fee.amountPaid.toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* --- SIGNATURES --- */}
            <div className="hidden print:flex justify-between mt-32 px-10">
                <div className="text-center">
                    <div className="w-48 border-b-2 border-black mb-2"></div>
                    <p className="text-[10px] font-black uppercase italic">Finance Teacher</p>
                </div>
                <div className="text-center">
                    <div className="w-48 border-b-2 border-black mb-2"></div>
                    <p className="text-[10px] font-black uppercase italic">Principal Stamp</p>
                </div>
            </div>
        </div>
    );
};

export default FeeReports;