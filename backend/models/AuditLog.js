const mongoose = require('mongoose');

const AuditLogSchema = new mongoose.Schema({
    instituteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Institute', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    action: { type: String, required: true }, // e.g., "ADMIT_STUDENT", "MARK_PAID"
    module: { type: String, required: true }, // e.g., "Finance", "Academics"
    details: { type: String }, // e.g., "Admitted student Rahul (ID: 101)"
    ipAddress: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('AuditLog', AuditLogSchema);