const mongoose = require('mongoose');

const timetableSchema = new mongoose.Schema({
    schoolId: { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true },
    grade: { type: String, required: true }, 
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
                    room: { type: String, default: "N/A" }, // Room field added
                    teacherEmpId: { type: String, required: true } // EMP ID based mapping
                }
            ]
        }
    ]
}, { timestamps: true });

module.exports = mongoose.model('Timetable', timetableSchema);