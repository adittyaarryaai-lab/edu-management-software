const mongoose = require('mongoose');

const installmentSchema = new mongoose.Schema({
    schoolId: { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true },
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    installmentNumber: { type: Number, required: true }, // e.g. 1st, 2nd
    amountDue: { type: Number, required: true },
    dueDate: { type: Date, required: true },
    status: { type: String, enum: ['Paid', 'Pending', 'Overdue'], default: 'Pending' },
    paymentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Fee' } // Agar pay ho gayi toh link
}, { timestamps: true });

module.exports = mongoose.model('Installment', installmentSchema);