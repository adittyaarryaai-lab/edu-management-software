const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
    schoolId: { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true }, // Added schoolId
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    grade: { type: String, required: true }, 
    subject: { type: String, required: true },
    title: { type: String, required: true },
    description: String,
    dueDate: { type: Date, required: true },
    fileUrl: String, 
}, { timestamps: true });

module.exports = mongoose.model('Assignment', assignmentSchema);