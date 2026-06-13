const mongoose = require('mongoose');

const leaveRequestSchema = new mongoose.Schema({
    schoolId: { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true },
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    leaveType: { type: String, enum: ['One Day', 'Multiple Days'], required: true },
    fromDate: { type: Date, required: true },
    toDate: { type: Date, default: null },
    reason: { type: String, required: true, trim: true },
    document: { type: String, default: '' },
    documentType: { type: String, enum: ['Lab Report', 'Leave Application'], required: true },
    status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' }
}, { timestamps: true });

module.exports = mongoose.model('LeaveRequest', leaveRequestSchema);