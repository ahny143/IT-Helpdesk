const User = require("../models/User");
const safe = (user) => user.toSafeObject();
const updateProfile = async (user, data) => { Object.assign(user, data); await user.save(); return user; };
const createStaff = async (data) => User.create({ ...data, email: data.email.trim().toLowerCase() });
module.exports = { safe, updateProfile, createStaff };
