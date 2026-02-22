const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// @desc    Register a new user (with ID Generation Logic)
const registerUser = async (req, res) => {
    const {
        name, email, password, role, grade, subjects, schoolId,
        fatherName, motherName, dob, gender, religion, admissionNo,
        phone, address
    } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
    }

    let generatedId = "";
    const currentSchoolId = schoolId || req.user?.schoolId;

    if (role === 'student') {
        // 1. Grade ko clean karo (e.g., "10-A" becomes "10A")
        const classCode = grade ? grade.replace(/[^a-zA-Z0-9]/g, "").toUpperCase() : "GEN";

        // 2. Sirf IS School aur IS Specific Grade ke bacho ko dhundo
        const lastStudent = await User.findOne({
            role: 'student',
            schoolId: currentSchoolId,
            grade: grade // Strict Grade check
        }).sort({ createdAt: -1 });

        // 3. Sequence logic
        let lastNum = 0;
        if (lastStudent && lastStudent.enrollmentNo) {
            // ID ke aakhri 3 digit nikalo
            const parts = lastStudent.enrollmentNo.match(/\d+$/);
            lastNum = parts ? parseInt(parts[0]) : 0;
        }

        generatedId = `STU${classCode}${String(lastNum + 1).padStart(3, '0')}`;

    } else if (role === 'teacher') {
        // Teachers are only isolated by school, not by class
        const lastTeacher = await User.findOne({
            role: 'teacher',
            schoolId: currentSchoolId
        }).sort({ createdAt: -1 });

        const lastNum = (lastTeacher && lastTeacher.employeeId)
            ? parseInt(lastTeacher.employeeId.replace('EMP', ''))
            : 0;

        generatedId = `EMP${String(lastNum + 1).padStart(3, '0')}`;
    }

    const user = await User.create({
        name,
        email,
        password,
        role,
        grade,
        enrollmentNo: role === 'student' ? generatedId : undefined,
        employeeId: role === 'teacher' ? generatedId : undefined,
        subjects,
        schoolId: currentSchoolId,
        fatherName,
        motherName,
        dob,
        gender,
        religion,
        admissionNo,
        phone,
        address
    });

    if (user) {
        res.status(201).json({
            ...user._doc, // Teacher jaisa logic: Pura document bhej do
            generatedId: generatedId,
            token: generateToken(user._id),
        });
    } else {
        res.status(400).json({ message: 'Invalid user data' });
    }
};

const authUser = async (req, res) => {
    const { email, password } = req.body;

    // 1. Saari fields fetch karo database se
    const user = await User.findOne({ email });

    if (user && (await require('bcryptjs').compare(password, user.password))) {
        // 2. RESPONSE MEIN SAARI DETAILS BHEJO (Jo MyAccount ko chahiye)
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            grade: user.grade,
            schoolId: user.schoolId,
            avatar: user.avatar,

            // --- DAY 78: SYNC ALL IDENTITY DATA ---
            fatherName: user.fatherName,
            motherName: user.motherName,
            dob: user.dob,
            gender: user.gender,
            religion: user.religion,
            admissionNo: user.admissionNo,
            phone: user.phone,
            address: user.address, // Full address object (pincode, district, etc.)

            enrollmentNo: user.enrollmentNo, // STU10A001 wala format
            employeeId: user.employeeId,     // EMP001 wala format
            subjects: user.subjects,

            token: generateToken(user._id),
        });
    } else {
        res.status(401).json({ message: 'Invalid email or password' });
    }
};

const changePassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);

    if (user && (await require('bcryptjs').compare(oldPassword, user.password))) {
        user.password = newPassword;
        await user.save();
        res.json({ message: 'Password Encryption Updated! 🔐' });
    } else {
        res.status(401).json({ message: 'Your current password is incorrect ❌' });
    }
};

module.exports = { registerUser, authUser, changePassword };