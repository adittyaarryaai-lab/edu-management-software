const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    grade: { type: String, required: true }, // e.g., "10-A"
    subject: { type: String, required: true },
    title: { type: String, required: true },
    description: String,
    dueDate: { type: Date, required: true },
    fileUrl: String, // Optional: Assignment question paper link
}, { timestamps: true });

module.exports = mongoose.model('Assignment', assignmentSchema);