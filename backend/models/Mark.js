const mongoose = require('mongoose');

const MarkSchema = new mongoose.Schema({
    instituteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Institute', required: true },
    examId: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam', required: true },
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
    subject: { type: String, required: true },
    marksObtained: { type: Number, required: true },
    maxMarks: { type: Number, default: 100 },
    remarks: { type: String }
}, { timestamps: true });

// Ensure a student can only have ONE mark record for a specific subject in a specific exam
MarkSchema.index({ examId: 1, studentId: 1, subject: 1 }, { unique: true });

module.exports = mongoose.model('Mark', MarkSchema);