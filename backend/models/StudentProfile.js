const mongoose = require('mongoose');

const StudentProfileSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // Add this field to your existing StudentProfileSchema
    parentUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    instituteId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Institute',
        required: true
    },
    classId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Class',
        required: true
    },
    rollNumber: { type: String, required: true },
    parentName: { type: String, required: true },
    parentContact: { type: String, required: true },
    admissionDate: { type: Date, default: Date.now },
    status: { type: String, enum: ['active', 'dropped', 'graduated'], default: 'active' }
}, { timestamps: true });

// We ensure a roll number is unique ONLY within the same class of the same institute
StudentProfileSchema.index({ classId: 1, rollNumber: 1 }, { unique: true });

module.exports = mongoose.model('StudentProfile', StudentProfileSchema);