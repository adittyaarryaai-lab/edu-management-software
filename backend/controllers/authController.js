const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// @desc    Register a new user
// @route   POST /api/auth/register
const registerUser = async (req, res) => {
    const { name, email, password, role, grade, enrollmentNo, employeeId, subjects } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({ 
        name, 
        email, 
        password, 
        role,
        grade,
        enrollmentNo,
        employeeId,
        subjects 
    });

    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            grade: user.grade,
            avatar: user.avatar, // FIXED: Register par bhi avatar bhejna hai
            token: generateToken(user._id),
        });
    } else {
        res.status(400).json({ message: 'Invalid user data' });
    }
};

// @desc    Auth user & get token
const authUser = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await require('bcryptjs').compare(password, user.password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            grade: user.grade, // LOGIN PAR BHI GRADE BHEJNA JARURI HAI
            avatar: user.avatar, // FIXED: Login par avatar field add kar di hai
            token: generateToken(user._id),
        });
    } else {
        res.status(401).json({ message: 'Invalid email or password' });
    }
};

module.exports = { registerUser, authUser };