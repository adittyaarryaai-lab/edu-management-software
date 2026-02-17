const mongoose = require('mongoose');

const syllabusSchema = new mongoose.Schema({
    grade: { type: String, required: true },
    subject: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String },
    fileUrl: { type: String }, // PDF link ke liye
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Syllabus', syllabusSchema);