const express = require('express');
const router = express.Router();
const School = require('../models/School');
const User = require('../models/User');
const { protect, superAdminOnly } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

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

// DAY 66: Update SuperAdmin Profile Logic (FIXED)
router.put('/update-profile', protect, superAdminOnly, upload.single('avatar'), async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ message: 'Master Root not found' });

        // Updating fields explicitly
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.mobile = req.body.mobile || user.mobile;
        user.address = req.body.address || user.address;

        if (req.file) {
            user.avatar = `/${req.file.path.replace(/\\/g, "/")}`;
        }

        const updatedUser = await user.save();
        
        // Pura object with token return kar rahe hain taaki frontend crash na ho
        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
            mobile: updatedUser.mobile,
            address: updatedUser.address,
            avatar: updatedUser.avatar,
            token: req.headers.authorization.split(' ')[1] // Token preservation
        });
    } catch (error) {
        console.error("Update Error:", error);
        res.status(500).json({ message: 'Master Sync Failed' });
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

router.get('/stats', protect, superAdminOnly, async (req, res) => {
    try {
        const schools = await School.find();
        const totalRevenue = schools.reduce((acc, curr) => acc + curr.subscription.totalPaid, 0);
        const activeSchools = schools.filter(s => s.subscription.status === 'Active').length;
        
        res.json({
            totalSchools: schools.length,
            activeSchools,
            totalRevenue,
            schools 
        });
    } catch (error) {
        res.status(500).json({ message: 'Stats fetch failed' });
    }
});

module.exports = router;