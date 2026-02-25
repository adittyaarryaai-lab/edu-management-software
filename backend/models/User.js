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
    schoolId: { type: mongoose.Schema.Types.ObjectId, ref: 'School' }, 
    
    // NEW FIELDS FOR DAY 78
    fatherName: String,
    motherName: String,
    dob: Date,
    gender: { type: String, enum: ['Male', 'Female', 'Other'] },
    religion: String,
    admissionNo: String, // Manual Admission Number
    
    phone: String,
    address: {
        pincode: String,
        district: String,
        state: String,
        country: { type: String, default: 'India' },
        fullAddress: String
    },
    
    avatar: { 
        type: String, 
        default: 'https://cdn-icons-png.flaticon.com/512/149/149071.png' 
    },
    
    // SYSTEM GENERATED IDs
    enrollmentNo: String, // STU001 Format
    employeeId: String,   // EMP001 Format
    
    grade: String, 
    assignedClass: { type: String, default: null }, // Day 85: Single class assigned to a teacher
    subjects: [String],
    resetOTP: String,
    otpExpires: Date
}, { timestamps: true });

userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

module.exports = mongoose.model('User', userSchema);