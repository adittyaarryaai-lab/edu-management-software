const mongoose = require('mongoose');

const feeStructureSchema = new mongoose.Schema({
    schoolId: { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true },
    className: { 
        type: String, 
        required: true,
        enum: [
            'Nursery', 'LKG', 'UKG', 
            'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 
            'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10',
            'Class 11 (Science)', 'Class 11 (Commerce)', 'Class 11 (Arts)',
            'Class 12 (Science)', 'Class 12 (Commerce)', 'Class 12 (Arts)'
        ]
    },
    fees: {
        admissionFees: { amount: Number, isNone: Boolean, billingCycle: { type: String, default: 'one-time' } },
        registrationFees: { amount: Number, isNone: Boolean, billingCycle: { type: String, default: 'one-time' } },
        securityFees: { amount: Number, isNone: Boolean, billingCycle: { type: String, default: 'one-time' } },
        tuitionFees: { amount: Number, isNone: Boolean, billingCycle: { type: String, default: 'monthly' } },
        examinationFees: { amount: Number, isNone: Boolean, billingCycle: { type: String, default: 'one-time' } },
        libraryFees: { amount: Number, isNone: Boolean, billingCycle: { type: String, default: 'monthly' } },
        laboratoryFees: { amount: Number, isNone: Boolean, billingCycle: { type: String, default: 'monthly' } },
        activityFees: { amount: Number, isNone: Boolean, billingCycle: { type: String, default: 'monthly' } },
        developmentFees: { amount: Number, isNone: Boolean, billingCycle: { type: String, default: 'one-time' } },
        annualCharges: { amount: Number, isNone: Boolean, billingCycle: { type: String, default: 'one-time' } },
        smartClassFees: { amount: Number, isNone: Boolean, billingCycle: { type: String, default: 'monthly' } },
        uniformFees: { amount: Number, isNone: Boolean, billingCycle: { type: String, default: 'one-time' } },
        booksStationeryFees: { amount: Number, isNone: Boolean, billingCycle: { type: String, default: 'one-time' } },
        idCardFees: { amount: Number, isNone: Boolean, billingCycle: { type: String, default: 'one-time' } },
        lateFees: { amount: Number, isNone: Boolean, billingCycle: { type: String, default: 'one-time' } },
        readmissionFees: { amount: Number, isNone: Boolean, billingCycle: { type: String, default: 'one-time' } },
        miscellaneousCharges: { amount: Number, isNone: Boolean, billingCycle: { type: String, default: 'one-time' } }
    },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

// Ek school mein ek class ki ek hi structure honi chahiye
feeStructureSchema.index({ schoolId: 1, className: 1 }, { unique: true });

module.exports = mongoose.model('FeeStructure', feeStructureSchema);