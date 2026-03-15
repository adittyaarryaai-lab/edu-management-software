const mongoose = require('mongoose');

const installmentSchema = new mongoose.Schema({
    schoolId: { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true },
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    installmentNumber: { type: Number, required: true }, 
    amountDue: { type: Number, required: true },
    penaltyAmount: { type: Number, default: 0 }, 
    dueDate: { type: Date, required: true },
    status: { type: String, enum: ['Paid', 'Pending', 'Overdue'], default: 'Pending' },
    paymentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Fee' },
    type: { type: String, default: '' } // Ye line add kar do 
}, { timestamps: true });

module.exports = mongoose.model('Installment', installmentSchema);