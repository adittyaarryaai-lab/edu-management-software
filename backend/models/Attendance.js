const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    grade: { type: String, required: true },
    date: { type: String, required: true }, // Format: YYYY-MM-DD
    records: [{
        studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        name: { type: String },
        status: { type: String, enum: ['Present', 'Absent', 'Late'], default: 'Present' }
    }]
}, { timestamps: true });

module.exports = mongoose.model('Attendance', attendanceSchema);