const Institute = require('../models/Institute');
const User = require('../models/User');
const PLANS = require('../config/plans');

const checkLimit = (resourceType) => {
    return async (req, res, next) => {
        try {
            const institute = await Institute.findById(req.user.instituteId);
            const currentPlan = PLANS[institute.plan];

            if (resourceType === 'student') {
                const studentCount = await User.countDocuments({ 
                    instituteId: req.user.instituteId, 
                    role: 'student' 
                });

                if (studentCount >= currentPlan.studentLimit) {
                    return res.status(403).json({ 
                        msg: `Plan limit reached. Your ${institute.plan} plan allows only ${currentPlan.studentLimit} students.` 
                    });
                }
            }
            // Add more resource checks (staff, etc.) here
            next();
        } catch (err) {
            res.status(500).send("Server Error in Plan Guard");
        }
    };
};

module.exports = { checkLimit };