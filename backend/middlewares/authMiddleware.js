const jwt = require("jsonwebtoken");
const User = require("../models/User");

module.exports = async (req, res, next) => {
    try {
        const header = req.headers.authorization;
        const token = req.cookies?.accessToken || (header && header.startsWith("Bearer ") ? header.slice(7) : null);
        if (!token) return res.status(401).json({ success: false, message: "Authentication required" });
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(payload.userId);
        if (!user || !user.isActive) return res.status(401).json({ success: false, message: "Account is inactive or unavailable" });
        req.user = user;
        next();
    } catch (error) { return res.status(401).json({ success: false, message: "Invalid or expired token" }); }
};
