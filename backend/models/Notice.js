const mongoose = require('mongoose');

const noticeSchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: true 
    },
    content: { 
        type: String, 
        required: true 
    },
    postedBy: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
    },
    authorRole: { 
        type: String 
    }, // 'admin' ya 'teacher' store karne ke liye
    audience: { 
        type: String, 
        enum: ['all', 'teachers', 'specific_grade'], 
        default: 'all' 
    }, // Kis group ko notice dikhana hai
    targetGrade: { 
        type: String, 
        default: 'All' 
    }, // 'All' ya specific class (e.g., '10-A')
    category: { 
        type: String, 
        enum: ['Exam', 'Event', 'Holiday', 'General'], 
        default: 'General' 
    },
    viewedBy: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
    }] // Dashboard par unread count (Notification Badge) dikhane ke liye
}, { timestamps: true });

module.exports = mongoose.model('Notice', noticeSchema);