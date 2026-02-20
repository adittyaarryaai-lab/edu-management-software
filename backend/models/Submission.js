const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
    schoolId: { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true }, // Added schoolId
    assignment: { type: mongoose.Schema.Types.ObjectId, ref: 'Assignment', required: true },
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String }, 
    fileUrl: { type: String }, 
    status: { type: String, default: 'Submitted' },
    grade: { type: String }, 
    feedback: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Submission', submissionSchema);