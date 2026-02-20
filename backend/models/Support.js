const mongoose = require('mongoose');

const supportSchema = new mongoose.Schema({
    schoolId: { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true }, // Added schoolId
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, 
    subject: { type: String, required: true },
    query: { type: String, required: true },
    status: { type: String, enum: ['Pending', 'Resolved'], default: 'Pending' },
    answer: { type: String },
    isUrgent: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Support', supportSchema);