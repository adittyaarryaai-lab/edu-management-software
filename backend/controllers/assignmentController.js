const Assignment = require('../models/Assignment');
const StudentProfile = require('../models/StudentProfile');

// Teacher posts an assignment
exports.createAssignment = async (req, res) => {
    try {
        const { classId, subject, title, description, dueDate } = req.body;

        const assignment = new Assignment({
            instituteId: req.user.instituteId,
            classId,
            teacherId: req.user.id,
            subject,
            title,
            description,
            dueDate
        });

        await assignment.save();
        res.status(201).json({ msg: "Assignment created successfully", assignment });
    } catch (err) {
        res.status(500).send("Server Error");
    }
};

// Student/Teacher fetches assignments for a class
exports.getAssignmentsByClass = async (req, res) => {
    try {
        const { classId } = req.params;
        const assignments = await Assignment.find({ classId }).sort({ dueDate: 1 });
        res.json(assignments);
    } catch (err) {
        res.status(500).send("Server Error");
    }
};