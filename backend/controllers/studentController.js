const User = require('../models/User');
const StudentProfile = require('../models/StudentProfile');
const bcrypt = require('bcryptjs');

exports.admitStudent = async (req, res) => {
    try {
        const { name, email, password, classId, rollNumber, parentName, parentContact } = req.body;

        // 1. User Account Creation
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

        // 2. Student Profile Creation
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

exports.getStudentsByClass = async (req, res) => {
    try {
        const students = await StudentProfile.find({ classId: req.params.classId })
            .populate('userId', ['name', 'email']);
        res.json(students);
    } catch (err) {
        res.status(500).send("Server Error");
    }
};