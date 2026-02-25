import React, { useState, useEffect } from 'react';
import { Users, CreditCard, Megaphone, PlusCircle, Database, X, Bot, Activity, BarChart3, ClipboardList, Zap, FileText, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import Toast from '../components/Toast';

const AdminHome = () => {
    const navigate = useNavigate();
    const [showTeacherForm, setShowTeacherForm] = useState(false);
    const [showStudentForm, setShowStudentForm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState('');

    const [subData, setSubData] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [teacherData, setTeacherData] = useState({
        name: '', email: '', password: '', subjects: '', assignedClass: '',
        fatherName: '', motherName: '', dob: '', gender: 'Male', religion: '',
        phone: '', address: { pincode: '', district: '', state: '', fullAddress: '' }
    });

    const [studentData, setStudentData] = useState({
        name: '', email: '', password: '', grade: '',
        fatherName: '', motherName: '', dob: '', gender: 'Male', religion: '', admissionNo: '',
        phone: '', address: { pincode: '', district: '', state: '', fullAddress: '' }
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data: sub } = await API.get('/school/subscription-status');
                setSubData(sub.subscription);
                const { data: txs } = await API.get('/school/transactions');
                setTransactions(txs);
            } catch (err) { console.error("Data Fetch Error", err); }
        };
        fetchData();
    }, []);

    const downloadInvoice = async (txId, txNumber) => {
        try {
            const response = await API.get(`/school/invoice/${txId}`, { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Invoice-${txNumber}.pdf`);
            document.body.appendChild(link);
            link.click();
        } catch (err) { alert("Could not download invoice."); }
    };

    const handleAdvancePayment = async () => {
        if (!window.confirm("Confirm Advance Payment for next month?")) return;
        setLoading(true);
        try {
            const { data } = await API.post('/school/pay-advance');
            setMsg(data.message);
            setSubData(data.subscription);
            const { data: updatedTxs } = await API.get('/school/transactions');
            setTransactions(updatedTxs);
        } catch (err) { alert("Payment Gateway Simulated."); }
        finally { setLoading(false); }
    };

    const handleAddTeacher = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Logged in admin ki details nikalna
            const currentUser = JSON.parse(localStorage.getItem('user'));
            const sId = currentUser?.schoolId;

            const processedData = {
                ...teacherData,
                role: 'teacher',
                schoolId: sId, // STRICTLY SENDING SCHOOL ID
                assignedClass: teacherData.assignedClass ? teacherData.assignedClass.trim().toUpperCase() : null, // DAY 85
                subjects: teacherData.subjects ? teacherData.subjects.split(',').map(s => s.trim()) : []
            };

            const { data } = await API.post('/auth/register', processedData);
            setMsg(`Teacher Node Active: ID ${data.generatedId} ⚡`);
            setShowTeacherForm(false);
            // Reset form
            setTeacherData({
                name: '', email: '', password: '', subjects: '', assignedClass: '',
                fatherName: '', motherName: '', dob: '', gender: 'Male', religion: '',
                phone: '', address: { pincode: '', district: '', state: '', fullAddress: '' }
            });
        } catch (err) { alert(err.response?.data?.message || "Error adding teacher"); } finally { setLoading(false); }
    };

    const handleAddStudent = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Logged in admin ki details nikalna
            const currentUser = JSON.parse(localStorage.getItem('user'));
            const sId = currentUser?.schoolId;

            const processedData = {
                ...studentData,
                role: 'student',
                schoolId: sId, // STRICTLY SENDING SCHOOL ID
                address: {
                    pincode: studentData.address.pincode,
                    district: studentData.address.district,
                    state: studentData.address.state,
                    fullAddress: studentData.address.fullAddress
                }
            };

            const { data } = await API.post('/auth/register', processedData);
            setMsg(`Student Enrolled: ID ${data.generatedId} ⚡`);
            setShowStudentForm(false);
            // Reset form
            setStudentData({
                name: '', email: '', password: '', grade: '',
                fatherName: '', motherName: '', dob: '', gender: 'Male', religion: '', admissionNo: '',
                phone: '', address: { pincode: '', district: '', state: '', fullAddress: '' }
            });
        } catch (err) { alert(err.response?.data?.message || "Error adding student"); } finally { setLoading(false); }
    };

    const adminStats = [
        { label: 'Total Students', value: '1,240', icon: <Users size={14} /> },
        { label: 'Total Teachers', value: '85', icon: <Bot size={14} /> },
        { label: 'Fees Collected', value: '₹12.5L', icon: <Activity size={14} /> },
    ];

    const managementModules = [
        { id: 'add-student', title: 'Add Student', icon: <PlusCircle size={24} />, desc: 'Enroll new students', color: 'bg-neon/10 text-neon border-neon/20' },
        { id: 'add-staff', title: 'Manage Staff', icon: <Users size={24} />, desc: 'Assign roles & classes', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
        { id: 'attendance-report', title: 'Attendance Insights', icon: <BarChart3 size={24} />, desc: 'Class-wise tracking', color: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' },
        { id: 'fees', title: 'Fee Manager', icon: <CreditCard size={24} />, desc: 'Track pending payments', color: 'bg-green-500/10 text-green-400 border-green-500/20' },
        { id: 'notice', title: 'Global Notice', icon: <Megaphone size={24} />, desc: 'Send alerts to all', color: 'bg-orange-500/10 text-orange-400 border-orange-500/20' },
        { id: 'notice-feed', title: 'Notice Archive', icon: <ClipboardList size={24} />, desc: 'Manage & Delete Notices', color: 'bg-rose-500/10 text-rose-400 border-rose-500/20' },
        { id: 'timetable', title: 'Timetable Master', icon: <Database size={24} />, desc: 'Schedule all classes', color: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' },
        { id: 'edit-timetable', title: 'Edit Timetable', icon: <Database size={24} />, desc: 'Modify existing schedules', color: 'bg-rose-500/10 text-rose-400 border-rose-500/20' },
        { id: 'manage-users', title: 'Node Manager', icon: <Users size={24} />, desc: 'Edit or Purge Personnel', color: 'bg-neon/10 text-neon border-neon/20' },
        // { id: 'edit-timetable', title: 'Edit Timetable', icon: <Database size={24} />, desc: 'Modify existing schedules', color: 'bg-rose-500/10 text-rose-400 border-rose-500/20' },
    ];

    return (
        <div className="px-5 -mt-10 space-y-6 pb-24 relative z-10 font-sans italic">
            {/* Subscription Card */}
            <div className={`p-6 rounded-[2.5rem] border backdrop-blur-xl shadow-2xl transition-all ${subData?.hasPaidAdvance ? 'bg-neon/10 border-neon/30' : 'bg-slate-900/80 border-neon/20'}`}>
                <div className="flex justify-between items-start">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <Zap size={16} className={subData?.hasPaidAdvance ? 'text-neon' : 'text-neon/60'} />
                            <h3 className="font-black text-white text-xs uppercase tracking-widest italic underline decoration-neon/30">Service Subscription</h3>
                        </div>
                        <p className="text-neon font-black text-xl italic tracking-tighter">₹{subData?.monthlyFee || '0'} <span className="text-[10px] text-white/40 uppercase">/ Month</span></p>
                        <p className="text-[10px] font-bold text-white/30 mt-1 italic uppercase tracking-widest">Next Billing: {subData?.nextPaymentDate ? new Date(subData.nextPaymentDate).toLocaleDateString() : 'N/A'}</p>
                    </div>
                    <button onClick={handleAdvancePayment} disabled={loading || subData?.hasPaidAdvance} className={`px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${subData?.hasPaidAdvance ? 'bg-neon text-void' : 'bg-void border border-neon text-neon shadow-[0_0_15px_rgba(61,242,224,0.2)] active:scale-95'}`}>
                        {subData?.hasPaidAdvance ? "Month Secured" : "Pay Advance"}
                    </button>
                </div>
                {subData?.hasPaidAdvance && (
                    <p className="text-[9px] font-black text-neon uppercase mt-4 tracking-tighter italic">Automatic debit paused. System synchronized. ✅</p>
                )}
            </div>

            {/* Billing History */}
            <div className="bg-slate-900/50 backdrop-blur-xl border border-neon/10 rounded-[2.5rem] p-6 shadow-2xl overflow-hidden">
                <div className="flex items-center gap-2 mb-6 ml-2">
                    <FileText size={16} className="text-neon animate-pulse" />
                    <h3 className="text-[10px] font-black text-neon/40 uppercase tracking-[0.3em] italic">Billing History</h3>
                </div>
                <div className="space-y-3">
                    {transactions.length > 0 ? (
                        transactions.map((tx, idx) => (
                            <div key={idx} className="bg-void/60 p-4 rounded-3xl border border-neon/5 flex items-center justify-between group hover:border-neon/30 transition-all">
                                <div className="flex items-center gap-4">
                                    <div className="bg-neon/10 p-3 rounded-2xl text-neon border border-neon/10"><CreditCard size={18} /></div>
                                    <div>
                                        <p className="text-white font-black text-xs uppercase italic tracking-tighter">{tx.month}</p>
                                        <p className="text-[8px] text-neon/30 font-bold uppercase mt-0.5 tracking-widest">{tx.transactionId}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 text-right">
                                    <div>
                                        <p className="text-neon font-black text-xs italic">₹{tx.amount}</p>
                                        <span className="text-[7px] font-black text-white/30 uppercase tracking-widest">Secured</span>
                                    </div>
                                    <button onClick={() => downloadInvoice(tx._id, tx.transactionId)} className="bg-neon/10 p-2 rounded-xl text-neon hover:bg-neon hover:text-void transition-all"><Download size={14} /></button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-6 opacity-20 italic font-black text-[10px] uppercase tracking-widest text-white">No transactions archived.</div>
                    )}
                </div>
            </div>

            {/* Stats */}
            <div className="bg-void border border-neon/10 rounded-[2.5rem] p-6 shadow-2xl grid grid-cols-3 gap-2">
                {adminStats.map((stat, i) => (
                    <div key={i} className="text-center border-r last:border-0 border-neon/5 px-1">
                        <div className="flex justify-center text-neon mb-1">{stat.icon}</div>
                        <p className="text-[18px] font-black text-white leading-none tracking-tighter">{stat.value}</p>
                        <p className="text-[7px] font-black text-neon/40 uppercase mt-1 tracking-widest leading-none">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Modules */}
            <div className="grid grid-cols-1 gap-4">
                <h3 className="text-[10px] font-black text-neon/30 uppercase tracking-[0.3em] ml-2 italic">Administrative Core</h3>
                {managementModules.map((m, i) => (
                    <div key={i} onClick={() => {
                        if (m.id === 'manage-users') navigate('/admin/manage-users');
                        if (m.id === 'add-staff') setShowTeacherForm(true);
                        if (m.id === 'add-student') setShowStudentForm(true);
                        if (m.id === 'timetable') navigate('/admin/timetable');
                        if (m.id === 'fees') navigate('/admin/fees');
                        if (m.id === 'attendance-report') navigate('/admin/attendance-report');
                        if (m.id === 'notice') navigate('/admin/global-notice');
                        if (m.id === 'notice-feed') navigate('/notice-feed');
                        if (m.id === 'edit-timetable') navigate('/admin/edit-timetable');
                    }} className="bg-slate-900/40 backdrop-blur-xl p-5 rounded-[2.2rem] border border-white/5 flex items-center justify-between active:scale-95 transition-all cursor-pointer group hover:border-neon/20">
                        <div className="flex items-center gap-4">
                            <div className={`${m.color} p-3 rounded-2xl border`}>{m.icon}</div>
                            <div>
                                <h4 className="font-black text-white/80 text-sm leading-none uppercase italic tracking-tighter">{m.title}</h4>
                                <p className="text-[10px] text-white/30 mt-1 font-bold italic uppercase tracking-tighter leading-none">{m.desc}</p>
                            </div>
                        </div>
                        <div className="bg-void p-2 rounded-full border border-white/5"><PlusCircle size={14} className="text-white/20 group-hover:text-neon" /></div>
                    </div>
                ))}
            </div>

            {/* MODALS WITH ALL DAY 78 FIELDS */}
            {(showTeacherForm || showStudentForm) && (
                <div className="fixed inset-0 bg-slate-950/90 z-[100] flex items-center justify-center p-4 backdrop-blur-md overflow-y-auto">
                    <div className="bg-slate-900 border border-neon/20 w-full max-w-2xl rounded-[3rem] p-8 shadow-2xl relative my-8 italic">
                        <button onClick={() => { setShowTeacherForm(false); setShowStudentForm(false) }} className="absolute top-6 right-6 p-2 bg-white/5 rounded-full text-neon/40"><X size={20} /></button>
                        <h3 className="font-black text-2xl text-white mb-6 uppercase italic text-center underline decoration-neon/20">{showTeacherForm ? 'Deploy Faculty Node' : 'Initialize Student Link'}</h3>

                        <form onSubmit={showTeacherForm ? handleAddTeacher : handleAddStudent} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Common Fields */}
                            <input type="text" placeholder="FULL NAME" className="w-full p-4 bg-void rounded-2xl border border-white/5 outline-none text-xs text-white focus:border-neon uppercase"
                                onChange={(e) => showTeacherForm ? setTeacherData({ ...teacherData, name: e.target.value }) : setStudentData({ ...studentData, name: e.target.value })} required />

                            <input type="email" placeholder="Institutional Email" className="w-full p-4 bg-void rounded-2xl border border-white/5 outline-none text-xs text-white focus:border-neon"
                                onChange={(e) => showTeacherForm ? setTeacherData({ ...teacherData, email: e.target.value }) : setStudentData({ ...studentData, email: e.target.value })} required />

                            <input type="password" placeholder="Access Cipher (Password)" className="w-full p-4 bg-void rounded-2xl border border-white/5 outline-none text-xs text-white focus:border-neon"
                                onChange={(e) => showTeacherForm ? setTeacherData({ ...teacherData, password: e.target.value }) : setStudentData({ ...studentData, password: e.target.value })} required />

                            <input type="text" placeholder="Mobile Signal" className="w-full p-4 bg-void rounded-2xl border border-white/5 outline-none text-xs text-white focus:border-neon"
                                onChange={(e) => showTeacherForm ? setTeacherData({ ...teacherData, phone: e.target.value }) : setStudentData({ ...studentData, phone: e.target.value })} required />

                            {/* Specific Fields */}
                            {showStudentForm && <input type="text" placeholder="Grade Sector (e.g. 10-A)" className="w-full p-4 bg-void rounded-2xl border border-white/5 outline-none text-xs text-white focus:border-neon uppercase"
                                onChange={(e) => setStudentData({ ...studentData, grade: e.target.value })} required />}

                            {showTeacherForm && <input type="text" placeholder="Assigned Subjects (Comma Sep)" className="w-full p-4 bg-void rounded-2xl border border-white/5 outline-none text-xs text-white focus:border-neon uppercase"
                                onChange={(e) => setTeacherData({ ...teacherData, subjects: e.target.value })} />}
                            {/* DAY 85: New Field for Class Assignment */}
                            {showTeacherForm && (
                                <div className="md:col-span-2">
                                    <label className="text-[8px] text-neon/40 ml-4 font-black uppercase">Assign Primary Attendance Class (Optional)</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. 10-A (Leave blank if no class assigned)"
                                        className="w-full p-4 bg-void rounded-2xl border border-white/5 outline-none text-xs text-white focus:border-neon uppercase mt-1"
                                        value={teacherData.assignedClass}
                                        onChange={(e) => setTeacherData({ ...teacherData, assignedClass: e.target.value })}
                                    />
                                </div>
                            )}
                            <input type="text" placeholder="Father's Name" className="w-full p-4 bg-void rounded-2xl border border-white/5 outline-none text-xs text-white focus:border-neon uppercase"
                                onChange={(e) => showTeacherForm ? setTeacherData({ ...teacherData, fatherName: e.target.value }) : setStudentData({ ...studentData, fatherName: e.target.value })} />

                            <input type="text" placeholder="Mother's Name" className="w-full p-4 bg-void rounded-2xl border border-white/5 outline-none text-xs text-white focus:border-neon uppercase"
                                onChange={(e) => showTeacherForm ? setTeacherData({ ...teacherData, motherName: e.target.value }) : setStudentData({ ...studentData, motherName: e.target.value })} />

                            <div className="flex flex-col gap-1">
                                <label className="text-[8px] text-neon/40 ml-4 font-black uppercase">Birth Date</label>
                                <input type="date" className="w-full p-4 bg-void rounded-2xl border border-white/5 outline-none text-xs text-white focus:border-neon"
                                    onChange={(e) => showTeacherForm ? setTeacherData({ ...teacherData, dob: e.target.value }) : setStudentData({ ...studentData, dob: e.target.value })} />
                            </div>

                            <select className="w-full p-4 bg-void rounded-2xl border border-white/5 outline-none text-xs text-white focus:border-neon uppercase"
                                onChange={(e) => showTeacherForm ? setTeacherData({ ...teacherData, gender: e.target.value }) : setStudentData({ ...studentData, gender: e.target.value })}>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </select>

                            <input type="text" placeholder="Religion" className="w-full p-4 bg-void rounded-2xl border border-white/5 outline-none text-xs text-white focus:border-neon uppercase"
                                onChange={(e) => showTeacherForm ? setTeacherData({ ...teacherData, religion: e.target.value }) : setStudentData({ ...studentData, religion: e.target.value })} />

                            {showStudentForm && <input type="text" placeholder="Admission Number" className="w-full p-4 bg-void rounded-2xl border border-white/5 outline-none text-xs text-white focus:border-neon uppercase"
                                onChange={(e) => setStudentData({ ...studentData, admissionNo: e.target.value })} />}

                            {/* Address Object Fields */}
                            <div className="md:col-span-2 grid grid-cols-3 gap-2">
                                <input type="text" placeholder="Pincode" className="p-4 bg-void rounded-2xl border border-white/5 outline-none text-[10px] text-white focus:border-neon"
                                    onChange={(e) => showTeacherForm ? setTeacherData({ ...teacherData, address: { ...teacherData.address, pincode: e.target.value } }) : setStudentData({ ...studentData, address: { ...studentData.address, pincode: e.target.value } })} />
                                <input type="text" placeholder="District" className="p-4 bg-void rounded-2xl border border-white/5 outline-none text-[10px] text-white focus:border-neon uppercase"
                                    onChange={(e) => showTeacherForm ? setTeacherData({ ...teacherData, address: { ...teacherData.address, district: e.target.value } }) : setStudentData({ ...studentData, address: { ...studentData.address, district: e.target.value } })} />
                                <input type="text" placeholder="State" className="p-4 bg-void rounded-2xl border border-white/5 outline-none text-[10px] text-white focus:border-neon uppercase"
                                    onChange={(e) => showTeacherForm ? setTeacherData({ ...teacherData, address: { ...teacherData.address, state: e.target.value } }) : setStudentData({ ...studentData, address: { ...studentData.address, state: e.target.value } })} />
                            </div>

                            <textarea placeholder="FULL PERMANENT ADDRESS..." className="md:col-span-2 p-4 bg-void rounded-2xl border border-white/5 outline-none text-xs text-white focus:border-neon uppercase"
                                onChange={(e) => showTeacherForm ? setTeacherData({ ...teacherData, address: { ...teacherData.address, fullAddress: e.target.value } }) : setStudentData({ ...studentData, address: { ...studentData.address, fullAddress: e.target.value } })}></textarea>

                            <button type="submit" disabled={loading} className="md:col-span-2 w-full bg-neon text-void py-5 rounded-[2rem] font-black text-xs uppercase shadow-[0_0_30px_rgba(61,242,224,0.3)] active:scale-95 transition-all mt-4">
                                {loading ? "TRANSMITTING DATA..." : (showTeacherForm ? "AUTHORIZE FACULTY" : "SYNC STUDENT LINK")}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            <div className="bg-void border border-neon/20 rounded-[2.5rem] p-6 text-white shadow-2xl relative overflow-hidden">
                <div className="relative z-10 flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Bot size={18} className="text-neon" />
                            <h3 className="font-black text-sm uppercase italic tracking-tighter">System: Sovereign</h3>
                        </div>
                        <p className="text-[10px] text-neon/30 font-black uppercase tracking-widest italic">ENCRYPTED ADMIN SESSION ACTIVE</p>
                    </div>
                    <Activity className="text-neon/20 animate-pulse" size={40} />
                </div>
            </div>

            {msg && <Toast message={msg} onClose={() => setMsg('')} />}
        </div>
    );
};

export default AdminHome;