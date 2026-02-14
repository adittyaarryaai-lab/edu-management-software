const mongoose = require('mongoose');

const timetableSchema = new mongoose.Schema({
    grade: { type: String, required: true }, // e.g., "10-A"
    schedule: [
        {
            day: { type: String, enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] },
            periods: [
                {
                    startTime: String, // e.g., "09:00 AM"
                    endTime: String,   // e.g., "10:00 AM"
                    subject: String,
                    teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
                }
            ]
        }
    ]
}, { timestamps: true });

module.exports = mongoose.model('Timetable', timetableSchema);