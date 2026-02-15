const mongoose = require('mongoose');

const feeSchema = new mongoose.Schema({
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    totalAmount: { type: Number, required: true },
    paidAmount: { type: Number, default: 0 },
    dueDate: { type: String, required: true }, // Format: YYYY-MM-DD
    status: { 
        type: String, 
        enum: ['Paid', 'Pending', 'Partially Paid'], 
        default: 'Pending' 
    },
    paymentHistory: [
        {
            amount: Number,
            date: { type: Date, default: Date.now },
            method: String // e.g., 'UPI', 'Cash', 'Card'
        }
    ]
}, { timestamps: true });

module.exports = mongoose.model('Fee', feeSchema);