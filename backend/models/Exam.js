const mongoose = require('mongoose');

const ExamSchema = new mongoose.Schema({
    instituteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Institute', required: true },
    name: { type: String, required: true }, // e.g., "Term 1 Examination"
    academicYear: { type: String, required: true }, // e.g., "2025-26"
    startDate: { type: Date },
    endDate: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Exam', ExamSchema);