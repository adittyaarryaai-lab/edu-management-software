const mongoose = require('mongoose');

const InstituteSchema = new mongoose.Schema({
    name: { type: String, required: true },
    subdomain: { type: String, required: true, unique: true }, // e.g., 'stanford' for stanford.eduflow.ai
    adminEmail: { type: String, required: true },
    plan: { type: String, enum: ['free', 'pro', 'enterprise'], default: 'free' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Institute', InstituteSchema);