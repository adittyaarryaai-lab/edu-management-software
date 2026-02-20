const mongoose = require('mongoose');

const feeSchema = new mongoose.Schema({
    schoolId: { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true }, // Added schoolId
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    totalAmount: { type: Number, required: true },
    paidAmount: { type: Number, default: 0 },
    dueDate: { type: String, required: true }, 
    status: { 
        type: String, 
        enum: ['Paid', 'Pending', 'Partially Paid'], 
        default: 'Pending' 
    },
    paymentHistory: [
        {
            amount: Number,
            date: { type: Date, default: Date.now },
            method: String 
        }
    ]
}, { timestamps: true });

module.exports = mongoose.model('Fee', feeSchema);