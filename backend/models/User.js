const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const ROLES = ["EMPLOYEE", "IT_SUPPORT", "ADMIN"];

const userSchema = new mongoose.Schema({
    fullName: { type: String, required: true, trim: true, minlength: 2, maxlength: 100 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, maxlength: 254 },
    password: { type: String, required: true, minlength: 8, select: false },
    phone: { type: String, trim: true, maxlength: 30, default: "" },
    department: { type: String, trim: true, maxlength: 100, default: "" },
    role: { type: String, enum: ROLES, required: true, default: "EMPLOYEE" },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

userSchema.index({ email: 1 }, { unique: true });

userSchema.pre("save", async function(next) {
    this.email = this.email.trim().toLowerCase();
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

userSchema.methods.comparePassword = function(candidate) {
    return bcrypt.compare(candidate, this.password);
};

userSchema.methods.toSafeObject = function() {
    const value = this.toObject();
    delete value.password;
    return value;
};

module.exports = mongoose.model("User", userSchema);
module.exports.ROLES = ROLES;
