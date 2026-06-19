const mongoose = require('mongoose');

const datesheetSchema = new mongoose.Schema({
    schoolId: { type: String, required: true },
    title: { type: String, required: true }, // e.g., "MID TERM EXAMINATION JUNE/JULY - 2026"
    classes: [{ type: String }],
    
    // --- SMART VALIDATION: Only required if it is an AI Generated Datesheet ---
    startDate: { 
        type: Date, 
        required: function() { return !this.isManual; } // Agar manual nahi hai, tabhi required hai
    },
    timing: { 
        type: String, 
        required: function() { return !this.isManual; } 
    },
    resultDate: { 
        type: Date, 
        required: function() { return !this.isManual; } 
    },

    gapDays: { type: Number, default: 0 },
    notes: { type: String },
    
    isManual: { type: Boolean, default: false },
    fileUrl: { type: String }, // Base64 ya URL store karne ke liye
    
    schedule: [{
        date: String,
        day: String,
        timing: String,
        classExams: { type: Map, of: String } // Key: Class Name, Value: Subject
    }],
    signatures: {
        incharge: { type: String }, // Base64 or URL
        principal: { type: String } // Base64 or URL
    }
}, { timestamps: true });

module.exports = mongoose.model('Datesheet', datesheetSchema);