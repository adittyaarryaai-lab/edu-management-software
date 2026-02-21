const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    schoolId: { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true },
    amount: { type: Number, required: true },
    paymentDate: { type: Date, default: Date.now },
    status: { type: String, enum: ['Success', 'Failed'], default: 'Success' },
    transactionId: { type: String, unique: true }, // e.g., INV-100234
    month: { type: String } // e.g., "March 2026"
}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema);