const mongoose = require("mongoose");
const PRIORITIES = ["LOW", "MEDIUM", "HIGH", "CRITICAL"];
const STATUSES = ["OPEN", "ASSIGNED", "IN_PROGRESS", "PENDING", "RESOLVED", "CLOSED"];
const ticketSchema = new mongoose.Schema({
    ticketCode: { type: String, required: true, unique: true, index: true, trim: true },
    title: { type: String, required: true, trim: true, minlength: 3, maxlength: 200 },
    description: { type: String, required: true, trim: true, minlength: 5, maxlength: 5000 },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    employeeId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    assigneeId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null, index: true },
    priority: { type: String, enum: PRIORITIES, required: true, default: "MEDIUM", index: true },
    status: { type: String, enum: STATUSES, required: true, default: "OPEN", index: true },
    pendingReason: { type: String, trim: true, maxlength: 1000, default: "" },
    pendingType: { type: String, enum: ["WAITING_EMPLOYEE", "OTHER", null], default: null },
    resolution: { cause: { type: String, trim: true, maxlength: 2000 }, solution: { type: String, trim: true, maxlength: 5000 } },
    slaStartedAt: Date, slaDueAt: Date, slaPausedAt: Date, slaRemainingMinutes: Number, slaVersion: Number,
    resolvedAt: Date, closedAt: Date, reopenDeadline: Date
}, { timestamps: true, collection: "tickets" });
ticketSchema.index({ employeeId: 1, createdAt: -1 });
ticketSchema.index({ assigneeId: 1, status: 1 });
ticketSchema.index({ status: 1, priority: 1 });
module.exports = mongoose.model("Ticket", ticketSchema);
module.exports.PRIORITIES = PRIORITIES;
module.exports.STATUSES = STATUSES;
