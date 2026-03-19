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
        admissionFees: { amount: { type: Number, default: 0 }, isNone: { type: Boolean, default: false } },
        registrationFees: { amount: { type: Number, default: 0 }, isNone: { type: Boolean, default: false } },
        securityFees: { amount: { type: Number, default: 0 }, isNone: { type: Boolean, default: false } },
        tuitionFees: { amount: { type: Number, default: 0 }, isNone: { type: Boolean, default: false } },
        transportFees: { amount: { type: Number, default: 0 }, isNone: { type: Boolean, default: false } },
        examinationFees: { amount: { type: Number, default: 0 }, isNone: { type: Boolean, default: false } },
        libraryFees: { amount: { type: Number, default: 0 }, isNone: { type: Boolean, default: false } },
        laboratoryFees: { amount: { type: Number, default: 0 }, isNone: { type: Boolean, default: false } },
        activityFees: { amount: { type: Number, default: 0 }, isNone: { type: Boolean, default: false } },
        developmentFees: { amount: { type: Number, default: 0 }, isNone: { type: Boolean, default: false } },
        annualCharges: { amount: { type: Number, default: 0 }, isNone: { type: Boolean, default: false } },
        smartClassFees: { amount: { type: Number, default: 0 }, isNone: { type: Boolean, default: false } },
        uniformFees: { amount: { type: Number, default: 0 }, isNone: { type: Boolean, default: false } },
        booksStationeryFees: { amount: { type: Number, default: 0 }, isNone: { type: Boolean, default: false } },
        idCardFees: { amount: { type: Number, default: 0 }, isNone: { type: Boolean, default: false } },
        lateFees: { amount: { type: Number, default: 0 }, isNone: { type: Boolean, default: false } },
        readmissionFees: { amount: { type: Number, default: 0 }, isNone: { type: Boolean, default: false } },
        miscellaneousCharges: { amount: { type: Number, default: 0 }, isNone: { type: Boolean, default: false } }
    },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

// Ek school mein ek class ki ek hi structure honi chahiye
feeStructureSchema.index({ schoolId: 1, className: 1 }, { unique: true });

module.exports = mongoose.model('FeeStructure', feeStructureSchema);