const express = require('express');
const router = express.Router();
const Notice = require('../models/Notice');
const { protect } = require('../middleware/authMiddleware');

// @desc    Post a new notice (Admin & Teacher Logic)
router.post('/create', protect, async (req, res) => {
    try {
        const { title, content, audience, targetGrade, category } = req.body;

        if (req.user.role === 'teacher' && audience !== 'specific_grade') {
            return res.status(403).json({ 
                message: 'Access Denied: Teachers can only broadcast to specific grades.' 
            });
        }

        const notice = await Notice.create({
            title,
            content,
            audience: audience || 'all',
            targetGrade: audience === 'specific_grade' ? targetGrade.trim().toUpperCase() : null,
            category: category || 'General',
            postedBy: req.user._id,
            authorRole: req.user.role
        });

        res.status(201).json(notice);
    } catch (error) {
        res.status(500).json({ message: 'Error creating notice' });
    }
});

// @desc    Get filtered notices for the logged-in user
router.get('/my-notices', protect, async (req, res) => {
    try {
        let query = {};

        if (req.user.role === 'student') {
            const studentGrade = req.user.grade ? req.user.grade.trim().toUpperCase() : '';
            query = {
                $or: [
                    { audience: 'all' },
                    { audience: 'specific_grade', targetGrade: studentGrade }
                ]
            };
        } else if (req.user.role === 'teacher') {
            query = {
                $or: [
                    { audience: 'all' },
                    { audience: 'teachers' },
                    { postedBy: req.user._id }
                ]
            };
        } else if (req.user.role === 'admin') {
            query = {}; // Admin sees everything
        }

        const notices = await Notice.find(query)
            .populate('postedBy', 'name role')
            .sort({ createdAt: -1 });

        // Admin ke liye unreadCount hamesha 0 rahega
        const unreadCount = req.user.role === 'admin' ? 0 : notices.filter(n => !n.viewedBy?.includes(req.user._id)).length;

        res.json({
            notices,
            unreadCount
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching notices' });
    }
});

// ================= NEW: DAY 63 UPDATES START =================

// @desc    Mark all notices as read for the user (Bell click logic)
router.put('/mark-all-read', protect, async (req, res) => {
    try {
        // Un saare notices ko dhundho jo user ne abhi tak nahi dekhe
        await Notice.updateMany(
            { viewedBy: { $ne: req.user._id } }, 
            { $addToSet: { viewedBy: req.user._id } }
        );
        res.json({ message: 'All notices marked as read' });
    } catch (error) {
        res.status(500).json({ message: 'Error clearing notifications' });
    }
});

// @desc    Update a notice (Edit Logic)
router.put('/:id', protect, async (req, res) => {
    try {
        const notice = await Notice.findById(req.params.id);
        if (!notice) return res.status(404).json({ message: 'Notice not found' });

        // Security: Admin ya wahi Teacher jisne post kiya hai
        if (req.user.role === 'admin' || notice.postedBy.toString() === req.user._id.toString()) {
            const updatedNotice = await Notice.findByIdAndUpdate(req.params.id, req.body, { new: true });
            res.json(updatedNotice);
        } else {
            res.status(403).json({ message: 'Unauthorized to edit this notice' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Update failed' });
    }
});

// @desc    Delete a notice
router.delete('/:id', protect, async (req, res) => {
    try {
        const notice = await Notice.findById(req.params.id);
        if (!notice) return res.status(404).json({ message: 'Notice not found' });

        // Security: Admin sabka, Teacher sirf apna
        if (req.user.role === 'admin' || notice.postedBy.toString() === req.user._id.toString()) {
            await notice.deleteOne();
            res.json({ message: 'Notice deleted successfully' });
        } else {
            res.status(403).json({ message: 'Access denied: You can only delete your own notices' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Delete failed' });
    }
});

// ================= DAY 63 UPDATES END =================

// @desc    Mark single notice as read
router.put('/:id/read', protect, async (req, res) => {
    try {
        const notice = await Notice.findById(req.params.id);
        if (notice) {
            if (!notice.viewedBy.includes(req.user._id)) {
                notice.viewedBy.push(req.user._id);
                await notice.save();
            }
            res.json({ message: 'Notice marked as read' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error updating notice status' });
    }
});

module.exports = router;