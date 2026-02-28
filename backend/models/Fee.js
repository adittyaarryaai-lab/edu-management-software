const mongoose = require('mongoose');

const feeSchema = new mongoose.Schema({
    schoolId: { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true },
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    amountPaid: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    month: { type: String, required: true }, // e.g., "February"
    year: { type: Number, required: true },
    paymentMode: { type: String, enum: ['Cash', 'UPI', 'Bank'], default: 'Cash' }
}, { timestamps: true });

module.exports = mongoose.model('Fee', feeSchema);