const mongoose = require('mongoose');

const technicalIssueSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    schoolId: { type: mongoose.Schema.Types.ObjectId, ref: 'School' },
    issueType: { type: String, required: true },
    description: { type: String },
    screenshot: { type: String }, // Path to uploaded image
    status: { type: String, enum: ['Pending', 'In Progress', 'Resolved'], default: 'Pending' },
}, { timestamps: true });

module.exports = mongoose.model('TechnicalIssue', technicalIssueSchema);