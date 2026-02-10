const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema({
    instituteId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Institute', 
        required: true 
    },
    classId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Class', 
        required: true 
    },
    date: { 
        type: Date, 
        required: true 
    },
    records: [
        {
            studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            status: { type: String, enum: ['Present', 'Absent', 'Late', 'Leave'], default: 'Present' }
        }
    ],
    markedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

// Prevent marking attendance for the same class on the same date twice
AttendanceSchema.index({ classId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', AttendanceSchema);