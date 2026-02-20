const mongoose = require('mongoose');

const noticeSchema = new mongoose.Schema({
    schoolId: { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true }, // Added schoolId
    title: { type: String, required: true },
    content: { type: String, required: true },
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    authorRole: { type: String }, 
    audience: { 
        type: String, 
        enum: ['all', 'teachers', 'specific_grade'], 
        default: 'all' 
    }, 
    targetGrade: { type: String, default: 'All' }, 
    category: { 
        type: String, 
        enum: ['Exam', 'Event', 'Holiday', 'General'], 
        default: 'General' 
    },
    viewedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] 
}, { timestamps: true });

module.exports = mongoose.model('Notice', noticeSchema);