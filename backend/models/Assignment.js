const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
    schoolId: { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true },
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    grade: { type: String, required: true },
    subject: { type: String, required: true },
    title: { type: String, required: true },
    description: String,
    dueDate: { type: Date, required: true },
    totalMarks: {
        type: Number,
        required: true,
        min: 1
    }, // Naya field
    fileUrl: String,
}, { timestamps: true });

module.exports = mongoose.model('Assignment', assignmentSchema);