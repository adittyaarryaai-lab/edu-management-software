const User = require('../models/User');
const StudentProfile = require('../models/StudentProfile');
const bcrypt = require('bcryptjs');

// 1. Admit a new student
exports.admitStudent = async (req, res) => {
    try {
        const { name, email, password, classId, rollNumber, parentName, parentContact } = req.body;

        // User Account Creation
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            role: 'student',
            instituteId: req.user.instituteId
        });
        const savedUser = await newUser.save();

        // Student Profile Creation
        const newStudent = new StudentProfile({
            userId: savedUser._id,
            instituteId: req.user.instituteId,
            classId,
            rollNumber,
            parentName,
            parentContact
        });
        await newStudent.save();

        res.status(201).json({ msg: "Student admitted successfully", student: newStudent });
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({ msg: "Roll number already exists in this class" });
        }
        res.status(500).send("Server Error");
    }
};

// 2. Get students by a specific Class (Existing logic)
exports.getStudentsByClass = async (req, res) => {
    try {
        const students = await StudentProfile.find({ classId: req.params.classId })
            .populate('userId', ['name', 'email']);
        res.json(students);
    } catch (err) {
        res.status(500).send("Server Error");
    }
};

// 3. Get ALL students for the Institute (New logic for Day 23)
exports.getAllStudents = async (req, res) => {
    try {
        // We find all students belonging to the logged-in admin's institute
        // We use .populate to "join" the User data and the Class data
        const students = await StudentProfile.find({ instituteId: req.user.instituteId })
            .populate('userId', ['name', 'email'])
            .populate('classId', ['className']); // This gives us the name of the class (e.g., "Grade 10")
        
        res.json(students);
    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
};