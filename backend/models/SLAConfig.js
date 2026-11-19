const mongoose = require("mongoose");
const PRIORITIES = ["CRITICAL", "HIGH", "MEDIUM", "LOW"];
const schema = new mongoose.Schema({ priority: { type: String, enum: PRIORITIES, required: true, unique: true }, resolutionMinutes: { type: Number, required: true, min: 1 }, isActive: { type: Boolean, default: true }, updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" } }, { timestamps: true, collection: "sla_configs" });
module.exports = mongoose.model("SLAConfig", schema);
module.exports.PRIORITIES = PRIORITIES;
