const StudentProfile = require('../models/StudentProfile');
const Attendance = require('../models/Attendance');
const Mark = require('../models/Mark');
const FeeInvoice = require('../models/FeeInvoice');

exports.getChildDashboard = async (req, res) => {
    try {
        // 1. Find the student linked to this parent
        const student = await StudentProfile.findOne({ parentUserId: req.user.id })
            .populate('userId', ['name', 'email'])
            .populate('classId', ['className']);

        if (!student) return res.status(404).json({ msg: "No student linked to this parent account" });

        // 2. Fetch Attendance Summary
        const attendance = await Attendance.find({ 
            classId: student.classId, 
            "records.studentId": student.userId 
        });
        
        // 3. Fetch Recent Marks
        const marks = await Mark.find({ studentId: student.userId })
            .populate('examId', 'name')
            .limit(5);

        // 4. Fetch Pending Fees
        const fees = await FeeInvoice.find({ 
            studentId: student.userId, 
            status: { $ne: 'Paid' } 
        });

        res.json({
            profile: student,
            attendanceCount: attendance.length,
            recentMarks: marks,
            pendingFees: fees
        });
    } catch (err) {
        res.status(500).send("Server Error");
    }
};