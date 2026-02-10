const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded; 
            return next(); // <--- This MUST be inside the success block
        } catch (error) {
            return res.status(401).json({ msg: "Not authorized, token failed" });
        }
    }

    // If we reach here, it means no token was found
    if (!token) {
        return res.status(401).json({ msg: "No token, authorization denied" });
    }
};

// Middleware to restrict access by Role
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ msg: `User role ${req.user.role} is not authorized` });
        }
        next();
    };
};

module.exports = { protect, authorize };