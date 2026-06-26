const mongoose = require('mongoose');

const liveClassSchema = new mongoose.Schema({
    schoolId: { type: String, required: true },
    proposerId: { type: String, required: true }, // Teacher's Emp ID
    proposerName: { type: String, required: true },
    grade: { type: String, required: true }, // Exact class e.g., "9-A"
    subjectName: { type: String, required: true },
    platform: { type: String, enum: ['Zoom', 'Google Meet'], required: true },
    date: { type: String, required: true }, // Format: "DD-MM-YYYY" or standard string
    startTime: { type: String, required: true }, // "09:00 AM"
    endTime: { type: String, required: true },   // "10:00 AM"
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    hostLink: { type: String }, // Auto-generated upon approval
    studentLink: { type: String } // Auto-generated upon approval
}, { timestamps: true });

module.exports = mongoose.model('LiveClass', liveClassSchema);