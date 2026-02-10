const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { 
        type: String, 
        enum: ['super-admin', 'admin', 'teacher', 'student', 'parent'], 
        required: true 
    },
    // CRITICAL: Every user belongs to an institute
    instituteId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Institute',
        required: function() { return this.role !== 'super-admin'; } 
    }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);