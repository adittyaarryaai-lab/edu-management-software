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
        onboardingDate: { type: Date, default: Date.now },
        
        // --- DAY 73: AUTOMATED BILLING FIELDS ---
        lastPaymentDate: { type: Date, default: Date.now },
        nextPaymentDate: { 
            type: Date, 
            default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // Default: 30 days from now
        },
        hasPaidAdvance: { type: Boolean, default: false } 
    },
    sessionYear: { type: String, default: '2026-27' },
    // --- DAY 95: PENALTY CONFIGURATION ---
    penaltySettings: {
        dailyRate: { type: Number, default: 0 }, // Agar 0 hai toh koi fine nahi lagega
        isActive: { type: Boolean, default: false }
    },

    // --- DAY 110: ONLINE PAYMENT GATEWAY CONFIG ---
    paymentSettings: {
        upiId: { type: String, default: "" }, // Finance teacher yahan apni UPI ID dalega (e.g. school@upi)
        merchantName: { type: String, default: "" }, // QR scan karte waqt jo naam dikhega
        isActive: { type: Boolean, default: false } // Kya ye school online payments accept kar raha hai?
    },

    isDeleted: { type: Boolean, default: false } 
}, { timestamps: true });

module.exports = mongoose.model('School', schoolSchema);