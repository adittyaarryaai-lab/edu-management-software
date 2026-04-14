const mongoose = require('mongoose');

const homeworkSchema = new mongoose.Schema({
    schoolId: { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true },
    teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    className: { type: String, required: true }, // e.g., "9-C"
    subject: { type: String, required: true },
    date: { type: String, required: true }, // Format: YYYY-MM-DD (easier to filter)
    content: { type: String, required: true },
    remarks: { type: String }
}, { timestamps: true });

// Indexing for faster search (Same class, subject, date logic)
homeworkSchema.index({ className: 1, subject: 1, date: 1, schoolId: 1 });

module.exports = mongoose.model('Homework', homeworkSchema);