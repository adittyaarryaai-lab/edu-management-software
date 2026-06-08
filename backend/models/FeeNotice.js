const mongoose = require('mongoose');

const feeNoticeSchema = new mongoose.Schema({
    schoolId: { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    noticeType: { type: String, enum: ['fee_alert', 'others'], required: true },
    date: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('FeeNotice', feeNoticeSchema);