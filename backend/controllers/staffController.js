const User = require('../models/User');
const StaffProfile = require('../models/StaffProfile');
const bcrypt = require('bcryptjs');

exports.addStaff = async (req, res) => {
    try {
        const { name, email, password, role, designation, qualification, salary } = req.body;

        // 1. Check if user already exists
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ msg: "User already exists" });

        // 2. Hash Password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 3. Create User Account
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            role, // teacher, accountant, etc.
            instituteId: req.user.instituteId
        });
        const savedUser = await newUser.save();

        // 4. Create Staff Profile
        const newStaffProfile = new StaffProfile({
            userId: savedUser._id,
            instituteId: req.user.instituteId,
            designation,
            qualification,
            salary
        });
        await newStaffProfile.save();

        res.status(201).json({ msg: "Staff added successfully", staff: savedUser });
    } catch (err) {
        res.status(500).send("Server Error");
    }
};

exports.getStaff = async (req, res) => {
    try {
        const staffList = await StaffProfile.find({ instituteId: req.user.instituteId }).populate('userId', ['name', 'email', 'role']);
        res.json(staffList);
    } catch (err) {
        res.status(500).send("Server Error");
    }
};