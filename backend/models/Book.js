const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    schoolId: { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true }, // Added schoolId
    title: { type: String, required: true },
    author: { type: String, required: true },
    isbn: { type: String }, // Removed global unique: true for multi-tenant
    category: { type: String, required: true },
    status: { type: String, enum: ['Available', 'Issued', 'Reserved'], default: 'Available' },
    shelfLocation: { type: String }, 
    description: { type: String },
    isDigital: { type: Boolean, default: false },
    fileUrl: { type: String } 
}, { timestamps: true });

module.exports = mongoose.model('Book', bookSchema);