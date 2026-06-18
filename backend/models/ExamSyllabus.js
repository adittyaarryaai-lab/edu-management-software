const mongoose = require('mongoose');

const examSyllabusSchema = new mongoose.Schema({
    schoolId: { type: String, required: true },
    grade: { type: String, required: true }, // Class name (e.g., "9 A")
    title: { type: String, required: true }, // e.g., "Unit Test 1"
    classTeacherId: { type: String, required: true }, // Jisne initiate kiya
    status: { type: String, enum: ['collecting', 'published'], default: 'collecting' },
    subjects: [{
        subjectName: { type: String, required: true },
        assignedTeachers: [{ type: String }], // Un sabhi teachers ke Emp IDs jo ye subject padhate hain
        submittedBy: { type: String }, // Jis teacher ne syllabus bhara uska Emp ID
        content: { type: String, default: "" }, // Syllabus detail
        isSubmitted: { type: Boolean, default: false }
    }]
}, { timestamps: true });

module.exports = mongoose.model('ExamSyllabus', examSyllabusSchema);