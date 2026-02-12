const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// 1. Register a new user
exports.register = async (req, res) => {
    try {
        const { name, email, password, role, instituteId } = req.body;

        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ msg: "User already exists" });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = new User({
            name,
            email,
            password: hashedPassword,
            role,
            instituteId
        });

        await user.save();
        res.status(201).json({ msg: "User registered successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};

// 2. Login User
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: "Invalid Credentials" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: "Invalid Credentials" });

        const token = jwt.sign(
            { id: user._id, role: user.role, instituteId: user.instituteId },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.json({
            token,
            user: { id: user._id, name: user.name, role: user.role, instituteId: user.instituteId }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};

// 3. Get Current User Profile (NEW)
exports.getMe = async (req, res) => {
    try {
        // Find user by ID from token (req.user.id comes from authMiddleware)
        const user = await User.findById(req.user.id).select('-password');
        if (!user) return res.status(404).json({ msg: "User not found" });
        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
};

// 4. Update Password (NEW)
exports.updatePassword = async (req, res) => {
    try {
        const { current, new: newPassword } = req.body;
        const user = await User.findById(req.user.id);

        // Verify old password
        const isMatch = await bcrypt.compare(current, user.password);
        if (!isMatch) return res.status(400).json({ msg: "Current password is incorrect" });

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);

        await user.save();
        res.json({ msg: "Password updated successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
};