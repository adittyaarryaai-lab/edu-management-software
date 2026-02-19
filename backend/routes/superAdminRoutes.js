const express = require('express');
const router = express.Router();
const mongoose = require('mongoose'); // FIXED: ObjectId conversion ke liye
const School = require('../models/School');
const User = require('../models/User');
const { protect, superAdminOnly } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const generateToken = require('../utils/generateToken');

// 1. Add New School & Create its Admin
router.post('/onboard-school', protect, superAdminOnly, upload.single('logo'), async (req, res) => {
    try {
        const schoolInfo = JSON.parse(req.body.schoolInfo);
        const adminInfo = JSON.parse(req.body.adminInfo);
        const subscription = JSON.parse(req.body.subscription);

        const logoPath = req.file ? `/${req.file.path.replace(/\\/g, "/")}` : '/uploads/default-school.png';
        
        const newSchool = await School.create({
            ...schoolInfo,
            logo: logoPath,
            adminDetails: adminInfo,
            subscription,
            sessionYear: req.body.sessionYear
        });

        // FIXED: Using newSchool._id directly as it is a valid ObjectId
        await User.create({
            name: adminInfo.fullName,
            email: adminInfo.email,
            password: req.body.tempPassword,
            role: 'admin',
            schoolId: newSchool._id, 
            grade: 'N/A'
        });

        res.status(201).json(newSchool);
    } catch (error) {
        console.error("Onboarding Error:", error);
        res.status(500).json({ message: error.message });
    }
});

// Update SuperAdmin Profile
router.put('/update-profile', protect, superAdminOnly, upload.single('avatar'), async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ message: 'Master Root not found' });

        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.mobile = req.body.mobile || user.mobile;
        user.address = req.body.address || user.address;

        if (req.file) {
            user.avatar = `/${req.file.path.replace(/\\/g, "/")}`;
        }

        const updatedUser = await user.save();
        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
            mobile: updatedUser.mobile,
            address: updatedUser.address,
            avatar: updatedUser.avatar,
            token: req.headers.authorization.split(' ')[1]
        });
    } catch (error) {
        console.error("Update Error:", error);
        res.status(500).json({ message: 'Master Sync Failed' });
    }
});

// DAY 68: FIXED Delete Protocol (Soft Delete to keep Revenue)
router.delete('/delete-school/:id', protect, superAdminOnly, async (req, res) => {
    try {
        const school = await School.findById(req.params.id);
        if (!school) return res.status(404).json({ message: 'School not found' });

        await User.deleteMany({ schoolId: req.params.id });
        school.subscription.status = 'Terminated';
        school.isDeleted = true; 
        await school.save();

        res.json({ message: 'Institution deactivated. Revenue records preserved. 🗑️' });
    } catch (error) {
        res.status(500).json({ message: 'Deletion failed' });
    }
});

// Ghost Login (FIXED: Improved ID matching)
router.get('/login-as-school/:id', protect, superAdminOnly, async (req, res) => {
    try {
        const targetId = req.params.id;
        
        // FIXED: Searching by schoolId ensuring it matches the stored format
        const schoolAdmin = await User.findOne({ 
            schoolId: targetId, 
            role: 'admin' 
        });

        if (!schoolAdmin) {
            // Log for debugging
            console.log("No Admin found for schoolId:", targetId);
            return res.status(404).json({ message: 'Admin for this institution not found. Check if the school was created correctly.' });
        }

        res.json({
            _id: schoolAdmin._id,
            name: schoolAdmin.name,
            email: schoolAdmin.email,
            role: schoolAdmin.role,
            schoolId: schoolAdmin.schoolId,
            token: generateToken(schoolAdmin._id)
        });
    } catch (error) {
        console.error("Ghost Login Error:", error);
        res.status(500).json({ message: 'Ghost login authorization failed' });
    }
});

router.put('/update-school/:id', protect, superAdminOnly, async (req, res) => {
    try {
        const updatedSchool = await School.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedSchool);
    } catch (error) {
        res.status(500).json({ message: 'Update failed' });
    }
});

// Stats Route 
router.get('/stats', protect, superAdminOnly, async (req, res) => {
    try {
        const allSchools = await School.find(); 
        const totalRevenue = allSchools.reduce((acc, curr) => acc + curr.subscription.totalPaid, 0);
        
        const visibleSchools = allSchools.filter(s => !s.isDeleted);
        const activeSchools = visibleSchools.filter(s => s.subscription.status === 'Active').length;
        
        res.json({
            totalSchools: visibleSchools.length,
            activeSchools,
            totalRevenue,
            schools: visibleSchools 
        });
    } catch (error) {
        res.status(500).json({ message: 'Stats fetch failed' });
    }
});

module.exports = router;