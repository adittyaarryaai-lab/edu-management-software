const mongoose = require('mongoose');

const timetableSchema = new mongoose.Schema({
    grade: { 
        type: String, 
        required: true,
        unique: true 
    },
    schedule: [
        {
            day: { 
                type: String, 
                enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
                required: true
            },
            periods: [
                {
                    startTime: { type: String, required: true },
                    endTime: { type: String, required: true },
                    subject: { type: String, required: true },
                    // FIX: Isko optional rehne do
                    teacher: { 
                        type: mongoose.Schema.Types.ObjectId, 
                        ref: 'User',
                        required: false 
                    }
                }
            ]
        }
    ]
}, { timestamps: true });

module.exports = mongoose.model('Timetable', timetableSchema);