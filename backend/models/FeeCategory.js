const mongoose = require('mongoose');

const FeeCategorySchema = new mongoose.Schema({
    instituteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Institute', required: true },
    name: { type: String, required: true }, // e.g., "Monthly Tuition Fee"
    description: { type: String },
    amount: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model('FeeCategory', FeeCategorySchema);