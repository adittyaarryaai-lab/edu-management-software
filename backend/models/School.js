const mongoose = require('mongoose');

const schoolSchema = new mongoose.Schema({
    schoolName: { type: String, required: true },
    address: { type: String, required: true },
    affiliationNo: { type: String, required: true, unique: true },
    logo: { type: String },
    adminDetails: {
        fullName: String,
        mobile: String,
        email: { type: String, unique: true },
        designation: String
    },
    subscription: {
        monthlyFee: { type: Number, default: 0 },
        totalPaid: { type: Number, default: 0 },
        status: { type: String, enum: ['Active', 'Terminated'], default: 'Active' },
        onboardingDate: { type: Date, default: Date.now }
    },
    sessionYear: { type: String, default: '2026-27' },
    isDeleted: { type: Boolean, default: false } // Day 68 fix for revenue preservation
}, { timestamps: true });

module.exports = mongoose.model('School', schoolSchema);