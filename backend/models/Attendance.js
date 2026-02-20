const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    schoolId: { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true }, // Added schoolId
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    grade: { type: String, required: true },
    date: { type: String, required: true }, 
    records: [{
        studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        name: { type: String },
        status: { type: String, enum: ['Present', 'Absent', 'Late'], default: 'Present' }
    }]
}, { timestamps: true });

module.exports = mongoose.model('Attendance', attendanceSchema);