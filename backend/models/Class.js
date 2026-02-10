const mongoose = require('mongoose');

const ClassSchema = new mongoose.Schema({
    className: { type: String, required: true }, // e.g., "10th Grade"
    sections: [{ type: String }], // e.g., ["A", "B", "C"]
    instituteId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Institute', 
        required: true 
    },
    academicYear: { type: String, required: true } // e.g., "2025-2026"
}, { timestamps: true });

module.exports = mongoose.model('Class', ClassSchema);