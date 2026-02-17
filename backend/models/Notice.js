const mongoose = require('mongoose');

const noticeSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    targetGrade: { type: String, default: 'All' }, // 'All' ya specific class ke liye
    category: { type: String, enum: ['Exam', 'Event', 'Holiday', 'General'], default: 'General' }
}, { timestamps: true });

module.exports = mongoose.model('Notice', noticeSchema);