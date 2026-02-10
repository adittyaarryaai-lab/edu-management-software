const mongoose = require('mongoose');

const DocumentSchema = new mongoose.Schema({
    instituteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Institute', required: true },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    fileName: { type: String, required: true },
    fileUrl: { type: String, required: true }, // The URL where the file is stored (S3/Cloudinary)
    fileType: { type: String, enum: ['pdf', 'image', 'doc'], required: true },
    category: { 
        type: String, 
        enum: ['id_proof', 'report_card', 'assignment', 'other'], 
        default: 'other' 
    },
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } // Optional: link to a specific student
}, { timestamps: true });

module.exports = mongoose.model('Document', DocumentSchema);