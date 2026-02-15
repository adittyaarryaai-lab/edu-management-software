const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
    assignment: { type: mongoose.Schema.Types.ObjectId, ref: 'Assignment', required: true },
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String }, // For text-based answers
    fileUrl: { type: String }, // For PDF/Image uploads
    status: { type: String, enum: ['Submitted', 'Graded'], default: 'Submitted' },
    grade: { type: String }, // Teacher baad mein grade dega
    feedback: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Submission', submissionSchema);