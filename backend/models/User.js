const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { 
        type: String, 
        enum: ['student', 'teacher', 'admin', 'superadmin'], 
        default: 'student' 
    },
    // FIXED: Multi-tenant SaaS Identity
    schoolId: { type: mongoose.Schema.Types.ObjectId, ref: 'School' }, 

    phone: String,
    address: String,
    avatar: { 
        type: String, 
        default: 'https://cdn-icons-png.flaticon.com/512/149/149071.png' 
    },
    enrollmentNo: String,
    grade: String, 
    employeeId: String,
    subjects: [String]
}, { timestamps: true });

userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

module.exports = mongoose.model('User', userSchema);