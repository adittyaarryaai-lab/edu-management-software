const mongoose = require('mongoose');

const StaffProfileSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    instituteId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Institute', 
        required: true 
    },
    designation: { type: String, required: true }, // e.g., Senior Teacher
    qualification: { type: String },
    joiningDate: { type: Date, default: Date.now },
    salary: { type: Number },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' }
}, { timestamps: true });

module.exports = mongoose.model('StaffProfile', StaffProfileSchema);