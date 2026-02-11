const AuditLog = require('../models/AuditLog');

const logActivity = async (req, action, module, details) => {
    try {
        const log = new AuditLog({
            instituteId: req.user.instituteId,
            userId: req.user.id,
            action,
            module,
            details,
            ipAddress: req.ip
        });
        await log.save();
    } catch (err) {
        console.error("Audit Log Error:", err);
    }
};

module.exports = logActivity;