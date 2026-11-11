const mongoose = require("mongoose");
const notificationSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    ticketId: { type: mongoose.Schema.Types.ObjectId, ref: "Ticket", default: null, index: true },
    title: { type: String, required: true, trim: true, maxlength: 200 },
    message: { type: String, required: true, trim: true, maxlength: 2000 },
    type: { type: String, required: true, trim: true, maxlength: 80 },
    isRead: { type: Boolean, default: false, index: true }
}, { timestamps: { createdAt: true, updatedAt: false }, collection: "notifications" });
notificationSchema.index({ userId: 1, isRead: 1, createdAt: -1 });
notificationSchema.index({ userId: 1, createdAt: -1 });
module.exports = mongoose.model("Notification", notificationSchema);
