const express = require('express');
const router = express.Router();
const Notice = require('../models/Notice');
const { protect } = require('../middleware/authMiddleware');

router.post('/create', protect, async (req, res) => {
    try {
        const { title, content, audience, targetGrade, category } = req.body;

        if (req.user.role === 'teacher' && audience !== 'specific_grade') {
            return res.status(403).json({ message: 'Teachers can only broadcast to specific grades.' });
        }

        const notice = await Notice.create({
            schoolId: req.user.schoolId, // FIXED
            title,
            content,
            audience: audience || 'all',
            targetGrade: audience === 'specific_grade' ? targetGrade : 'All',
            category: category || 'General',
            postedBy: req.user._id,
            authorRole: req.user.role
        });

        res.status(201).json(notice);
    } catch (error) {
        res.status(500).json({ message: 'Error creating notice' });
    }
});

// --- DAY 134: FETCH NOTICES (WITH STRICT FINANCE FILTERING) ---
router.get('/my-notices', protect, async (req, res) => {
    try {
        let baseQuery = { schoolId: req.user.schoolId };

        if (req.user.role === 'student') {
            const studentGrade = req.user.grade ? req.user.grade.trim().toUpperCase() : '';
            baseQuery.$or = [
                { audience: 'all' },
                // ✅ FIX: Ab bache ko wo notice bhi dikhega jisme 'All' likha ho 
                // ya phir specifically uski apni class likhi ho
                { 
                    audience: 'specific_grade', 
                    targetGrade: { $in: [studentGrade, 'All'] } 
                }
            ];
        } 
        // FIX: Finance Teacher ke liye alag logic
        else if (req.user.role === 'finance') {
            baseQuery.$or = [
                { audience: 'all' },       // Jo Admin ne sabko bheje (Teachers + Students)
                { audience: 'teachers' }    // Jo Admin ne sirf staff/teachers ko bheje
            ];
        }
        else if (req.user.role === 'teacher') {
            baseQuery.$or = [
                { audience: 'all' },
                { audience: 'teachers' },
                { postedBy: req.user._id } // Khud ke bheje hue
            ];
        }

        const notices = await Notice.find(baseQuery)
            .populate('postedBy', 'name role')
            .sort({ createdAt: -1 });

        const unreadCount = req.user.role === 'admin' ? 0 : notices.filter(n => !n.viewedBy?.includes(req.user._id)).length;

        res.json({ notices, unreadCount });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching notices' });
    }
});

router.put('/mark-all-read', protect, async (req, res) => {
    try {
        await Notice.updateMany(
            { schoolId: req.user.schoolId, viewedBy: { $ne: req.user._id } }, // FIXED Isolation
            { $addToSet: { viewedBy: req.user._id } }
        );
        res.json({ message: 'All notices marked as read' });
    } catch (error) {
        res.status(500).json({ message: 'Error clearing notifications' });
    }
});

router.put('/:id', protect, async (req, res) => {
    try {
        const notice = await Notice.findOne({ _id: req.params.id, schoolId: req.user.schoolId }); // FIXED Security
        if (!notice) return res.status(404).json({ message: 'Notice not found' });

        if (req.user.role === 'admin' || notice.postedBy.toString() === req.user._id.toString()) {
            const updatedNotice = await Notice.findByIdAndUpdate(req.params.id, req.body, { new: true });
            res.json(updatedNotice);
        } else {
            res.status(403).json({ message: 'Unauthorized' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Update failed' });
    }
});

router.delete('/:id', protect, async (req, res) => {
    try {
        const notice = await Notice.findOne({ _id: req.params.id, schoolId: req.user.schoolId });
        if (!notice) return res.status(404).json({ message: 'Notice not found' });

        // Ensure user is root admin or owner
        const isMaster = req.user.role.toLowerCase() === 'admin';
        const isOwner = notice.postedBy.toString() === req.user._id.toString();

        if (isMaster || isOwner) {
            await notice.deleteOne();
            res.json({ message: 'Notice deleted successfully' });
        } else {
            res.status(403).json({ message: 'Neural Access Denied: Unauthorized Node' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Internal Matrix Failure' });
    }
});

// --- DAY 127: FETCH DYNAMIC CLASSES FOR DROPDOWN ---
router.get('/meta/classes', protect, async (req, res) => {
    try {
        const User = require('../models/User');
        // School ke saare students se unique grades uthao
        const classes = await User.distinct('grade', {
            schoolId: req.user.schoolId,
            role: 'student'
        });
        res.json(classes.sort());
    } catch (error) {
        res.status(500).json({ message: 'Error fetching classes' });
    }
});

// --- DAY 127: FETCH DYNAMIC TEACHERS FOR DROPDOWN ---
router.get('/meta/teachers', protect, async (req, res) => {
    try {
        const User = require('../models/User');
        const teachers = await User.find({
            schoolId: req.user.schoolId,
            role: 'teacher'
        }).select('name _id');
        res.json(teachers);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching teachers' });
    }
});

module.exports = router;