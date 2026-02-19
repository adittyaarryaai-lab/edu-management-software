const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { 
        type: String, 
        // FIXED: Added 'superadmin' to the role list
        enum: ['student', 'teacher', 'admin', 'superadmin'], 
        default: 'student' 
    },
    // Day 64: School identification for Multi-tenant SaaS
    schoolId: { type: mongoose.Schema.Types.ObjectId, ref: 'School' },

    // Common fields
    phone: String,
    address: String,

    // Day 52: Avatar field added for Profile Pictures
    avatar: { 
        type: String, 
        default: 'https://cdn-icons-png.flaticon.com/512/149/149071.png' 
    },
    
    // Student specific
    enrollmentNo: String,
    grade: String, // e.g. 10-B
    
    // Teacher specific
    employeeId: String,
    subjects: [String]
}, { timestamps: true });

// Password hashing before saving
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

module.exports = mongoose.model('User', userSchema);