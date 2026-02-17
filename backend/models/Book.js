const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    isbn: { type: String, unique: true },
    category: { type: String, required: true },
    status: { type: String, enum: ['Available', 'Issued', 'Reserved'], default: 'Available' },
    shelfLocation: { type: String }, // e.g., Rack 4-B
    description: { type: String },
    isDigital: {
        type: Boolean,
        default: false
    },
    fileUrl: {
        type: String
    } // PDF, E-pub ya Cloud storage ka link yahan save hoga
}, { timestamps: true });
// }, { timestamps: true });

module.exports = mongoose.model('Book', bookSchema);