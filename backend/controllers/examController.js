const Exam = require('../models/Exam');
const Mark = require('../models/Mark');

// Create an Exam Entry
exports.createExam = async (req, res) => {
    try {
        const { name, academicYear, startDate, endDate } = req.body;
        const exam = new Exam({
            instituteId: req.user.instituteId,
            name, academicYear, startDate, endDate
        });
        await exam.save();
        res.status(201).json(exam);
    } catch (err) {
        res.status(500).send("Server Error");
    }
};

// Record Marks (Bulk or Single)
exports.uploadMarks = async (req, res) => {
    try {
        const { examId, studentId, classId, subject, marksObtained, maxMarks, remarks } = req.body;
        
        const mark = await Mark.findOneAndUpdate(
            { examId, studentId, subject },
            { instituteId: req.user.instituteId, classId, marksObtained, maxMarks, remarks },
            { upsert: true, new: true } // Update if exists, create if not
        );

        res.json({ msg: "Marks recorded successfully", mark });
    } catch (err) {
        res.status(500).send("Server Error");
    }
};

// Get Report Card for a Student
exports.getStudentResult = async (req, res) => {
    try {
        const { studentId, examId } = req.params;
        const results = await Mark.find({ studentId, examId }).populate('examId', 'name');
        res.json(results);
    } catch (err) {
        res.status(500).send("Server Error");
    }
};