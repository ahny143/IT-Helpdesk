const jwt = require("jsonwebtoken");
const User = require("../models/User");

const publicUser = (user) => user.toSafeObject ? user.toSafeObject() : user;
const signToken = (user) => {
    if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET is not configured");
    return jwt.sign({ userId: user._id.toString(), role: user.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || "1d" });
};
const findByEmail = (email) => User.findOne({ email: email.trim().toLowerCase() }).select("+password");
const registerEmployee = async (data) => {
    const user = await User.create({ ...data, email: data.email.trim().toLowerCase(), role: "EMPLOYEE" });
    return user;
};
const authenticate = async (email, password) => {
    const user = await findByEmail(email);
    if (!user || !(await user.comparePassword(password))) throw Object.assign(new Error("Invalid email or password"), { status: 401 });
    if (!user.isActive) throw Object.assign(new Error("Account is inactive"), { status: 403 });
    return user;
};
module.exports = { publicUser, signToken, findByEmail, registerEmployee, authenticate };
