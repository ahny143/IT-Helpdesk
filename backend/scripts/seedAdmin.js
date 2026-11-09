require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/User");
const run = async () => {
    const { SEED_ADMIN_NAME, SEED_ADMIN_EMAIL, SEED_ADMIN_PASSWORD, MONGODB_URI } = process.env;
    if (!SEED_ADMIN_NAME || !SEED_ADMIN_EMAIL || !SEED_ADMIN_PASSWORD || !MONGODB_URI) throw new Error("Seed admin variables are required");
    await mongoose.connect(MONGODB_URI);
    const email = SEED_ADMIN_EMAIL.trim().toLowerCase();
    if (await User.findOne({ email })) { console.log("Admin email already exists; no changes made."); return; }
    await User.create({ fullName: SEED_ADMIN_NAME, email, password: SEED_ADMIN_PASSWORD, role: "ADMIN", isActive: true });
    console.log("Initial admin created successfully.");
};
run().catch((error) => { console.error("Admin seed failed:", error.message); process.exitCode = 1; }).finally(async () => { if (mongoose.connection.readyState) await mongoose.disconnect(); });
