// controllers/attendanceController.js
const User = require('../models/User');

exports.getMyClassList = async (req, res) => {
    try {
        // Teacher ka poora data fetch karo assignedClass ke saath
        const teacher = await User.findById(req.user._id);
        
        if (!teacher || !teacher.assignedClass) {
            return res.status(404).json({ message: "No class assigned to this teacher" });
        }

        // assignedClass (e.g. "9-C") se match karne wale saare students dhoondo
        const students = await User.find({ 
            role: 'student', 
            grade: teacher.assignedClass, // Students ki grade field assignedClass se match honi chahiye
            schoolId: req.user.schoolId 
        }).select('name enrollmentNo phone fatherName grade avatar');

        res.status(200).json({ 
            className: teacher.assignedClass, 
            students 
        });
    } catch (err) {
        console.error("Backend Error:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
};