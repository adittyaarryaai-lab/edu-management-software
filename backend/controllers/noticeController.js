const Notice = require('../models/Notice');

// Post a new Notice
exports.postNotice = async (req, res) => {
    try {
        const { title, message, targetAudience, expiresAt } = req.body;

        const notice = new Notice({
            instituteId: req.user.instituteId,
            title,
            message,
            targetAudience,
            expiresAt,
            postedBy: req.user.id
        });

        await notice.save();
        res.status(201).json({ msg: "Notice posted successfully", notice });
    } catch (err) {
        res.status(500).send("Server Error");
    }
};

// Get Notices based on User Role
exports.getNotices = async (req, res) => {
    try {
        const userRole = req.user.role;
        
        // Find notices for this institute that are EITHER 'all' OR match user's role
        const notices = await Notice.find({
            instituteId: req.user.instituteId,
            targetAudience: { $in: ['all', userRole] }
        }).sort({ createdAt: -1 }); // Latest first

        res.json(notices);
    } catch (err) {
        res.status(500).send("Server Error");
    }
};