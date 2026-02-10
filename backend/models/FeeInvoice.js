const mongoose = require('mongoose');

const FeeInvoiceSchema = new mongoose.Schema({
    instituteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Institute', required: true },
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
    feeDetails: [
        {
            category: { type: String, required: true },
            amount: { type: Number, required: true }
        }
    ],
    totalAmount: { type: Number, required: true },
    dueDate: { type: Date, required: true },
    status: { type: String, enum: ['Paid', 'Unpaid', 'Partially Paid'], default: 'Unpaid' },
    paidAmount: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('FeeInvoice', FeeInvoiceSchema);