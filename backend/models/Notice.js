const mongoose = require('mongoose');

const NoticeSchema = new mongoose.Schema({
    instituteId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Institute', 
        required: true 
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    targetAudience: { 
        type: String, 
        enum: ['all', 'teacher', 'student', 'parent'], 
        default: 'all' 
    },
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    expiresAt: { type: Date } // Optional: To auto-hide old notices
}, { timestamps: true });

module.exports = mongoose.model('Notice', NoticeSchema);