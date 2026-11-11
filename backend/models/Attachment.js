const mongoose = require("mongoose");
const attachmentSchema = new mongoose.Schema({
    ticketId: { type: mongoose.Schema.Types.ObjectId, ref: "Ticket", required: true, index: true },
    commentId: { type: mongoose.Schema.Types.ObjectId, ref: "Comment", default: null, index: true },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    fileName: { type: String, required: true, trim: true, maxlength: 255 },
    fileUrl: { type: String, required: true },
    fileType: { type: String, required: true },
    fileSize: { type: Number, required: true, min: 1 }
}, { timestamps: { createdAt: true, updatedAt: false }, collection: "attachments" });
attachmentSchema.index({ ticketId: 1, createdAt: 1 });
module.exports = mongoose.model("Attachment", attachmentSchema);
