const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
    instituteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Institute', required: true },
    invoiceId: { type: mongoose.Schema.Types.ObjectId, ref: 'FeeInvoice', required: true },
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    amountPaid: { type: Number, required: true },
    paymentMethod: { type: String, enum: ['Cash', 'Cheque', 'Online', 'Transfer'], required: true },
    transactionId: { type: String }, // For online/cheque reference
    paymentDate: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Payment', PaymentSchema);