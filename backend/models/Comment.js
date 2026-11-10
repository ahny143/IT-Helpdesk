const mongoose = require("mongoose");
const commentSchema = new mongoose.Schema({
    ticketId: { type: mongoose.Schema.Types.ObjectId, ref: "Ticket", required: true, index: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true, trim: true, minlength: 1, maxlength: 5000 },
    commentType: { type: String, enum: ["PUBLIC", "INTERNAL"], required: true, default: "PUBLIC" }
}, { timestamps: { createdAt: true, updatedAt: false }, collection: "comments" });
commentSchema.index({ ticketId: 1, createdAt: 1 });
module.exports = mongoose.model("Comment", commentSchema);
