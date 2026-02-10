const mongoose = require('mongoose');

const AssignmentSchema = new mongoose.Schema({
    instituteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Institute', required: true },
    classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
    teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    subject: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String },
    dueDate: { type: Date, required: true },
    attachments: [{ type: String }], // URLs for PDFs or Images (we'll handle uploads later)
}, { timestamps: true });

module.exports = mongoose.model('Assignment', AssignmentSchema);