const express = require('express');
const router = express.Router();
const School = require('../models/School');
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// 1. Add New School & Create its Admin
router.post('/onboard-school', protect, upload.single('logo'), async (req, res) => {
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

// FIXED: Update School Route added for Edit functionality
router.put('/update-school/:id', protect, async (req, res) => {
    try {
        const updatedSchool = await School.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedSchool);
    } catch (error) {
        res.status(500).json({ message: 'Update failed' });
    }
});

// 2. Dashboard Stats
router.get('/stats', protect, async (req, res) => {
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