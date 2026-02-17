const mongoose = require('mongoose');

const liveClassSchema = new mongoose.Schema({
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    subject: { type: String, required: true },
    grade: { type: String, required: true },
    topic: { type: String, required: true },
    startTime: { type: Date, required: true },
    meetingLink: { type: String, required: true },
    status: { type: String, enum: ['Upcoming', 'Live', 'Ended'], default: 'Upcoming' }
}, { timestamps: true });

module.exports = mongoose.model('LiveClass', liveClassSchema);