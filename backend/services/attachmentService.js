const mongoose = require("mongoose");
const path = require("path");
const Attachment = require("../models/Attachment");
const Comment = require("../models/Comment");
const Ticket = require("../models/Ticket");
const cloudinary = require("../config/cloudinary");
const { maxSize } = require("../middlewares/uploadMiddleware");

const fail = (message, status) => Object.assign(new Error(message), { status });
const id = (value, label) => { if (!mongoose.isValidObjectId(value)) throw fail(`Invalid ${label}`, 400); return value; };
const allowedTypes = () => (process.env.ALLOWED_FILE_TYPES || "image/jpeg,image/png,application/pdf").split(",").map((v) => v.trim().toLowerCase()).filter(Boolean);
const accessFilter = (user, ticketId) => user.role === "ADMIN" ? { _id: ticketId } : user.role === "IT_SUPPORT" ? { _id: ticketId, assigneeId: user._id } : { _id: ticketId, employeeId: user._id };
const getTicket = async (user, ticketId) => { const ticket = await Ticket.findOne(accessFilter(user, id(ticketId, "ticket id"))); if (!ticket) throw fail("Ticket not found or access denied", 404); return ticket; };
const inspectFile = async (file) => { if (!file || !file.buffer?.length) throw fail("A non-empty file is required", 400); if (file.size > maxSize) throw fail("File exceeds the configured size limit", 400); const type = (await import("file-type")).fileTypeFromBuffer; const detected = await type(file.buffer); const allowed = allowedTypes(); const extension = path.extname(file.originalname).toLowerCase().slice(1); const extensionMatches = extension === detected?.ext || (detected?.ext === "jpg" && extension === "jpeg"); if (!detected || !allowed.includes(detected.mime) || detected.mime !== file.mimetype.toLowerCase() || !extensionMatches) throw fail("File type is not allowed or does not match its content", 400); return detected; };
const uploadBuffer = (buffer, options) => new Promise((resolve, reject) => { const stream = cloudinary.uploader.upload_stream(options, (error, result) => error ? reject(error) : resolve(result)); stream.end(buffer); });
const createMany = async (user, ticketId, files, commentId) => {
    const ticket = await getTicket(user, ticketId);
    if (!Array.isArray(files) || files.length === 0) throw fail("At least one file is required", 400);
    let comment = null;
    if (commentId) {
        comment = await Comment.findOne({ _id: id(commentId, "comment id"), ticketId: ticket._id });
        if (!comment) throw fail("Comment not found for this ticket", 404);
        if (comment.commentType === "INTERNAL" && user.role === "EMPLOYEE") throw fail("Employees cannot access internal note attachments", 403);
    }
    // Inspect every file before uploading any of them, so validation failure leaves no orphaned asset.
    const inspected = [];
    for (const file of files) inspected.push({ file, detected: await inspectFile(file) });
    const uploaded = [];
    const createdIds = [];
    try {
        for (const { file, detected } of inspected) {
            const asset = await uploadBuffer(file.buffer, { folder: "it-helpdesk/tickets", resource_type: "auto", public_id: `${ticket._id.toString()}-${new mongoose.Types.ObjectId().toString()}` });
            uploaded.push(asset);
            const attachment = await Attachment.create({ ticketId: ticket._id, commentId: comment?._id || null, uploadedBy: user._id, fileName: file.originalname, fileUrl: asset.secure_url, fileType: detected.mime, fileSize: file.size });
            createdIds.push(attachment._id);
        }
        return await Attachment.find({ _id: { $in: createdIds } }).populate("uploadedBy", "fullName role").sort({ createdAt: 1 });
    } catch (error) {
        if (createdIds.length) await Attachment.deleteMany({ _id: { $in: createdIds } }).catch(() => {});
        await Promise.all(uploaded.map((asset) => cloudinary.uploader.destroy(asset.public_id, { resource_type: asset.resource_type || "image" }).catch(() => {})));
        throw error;
    }
};
const create = async (user, ticketId, file, commentId) => (await createMany(user, ticketId, [file], commentId))[0];
const list = async (user, ticketId) => { const ticket = await getTicket(user, ticketId); const attachments = await Attachment.find({ ticketId: ticket._id }).select("-fileUrl").populate("uploadedBy", "fullName role").sort({ createdAt: 1 }); if (user.role === "EMPLOYEE") { const internalIds = await Comment.find({ ticketId: ticket._id, commentType: "INTERNAL" }).distinct("_id"); return attachments.filter((item) => !item.commentId || !internalIds.some((commentId) => commentId.equals(item.commentId))); } return attachments; };
const getForDownload = async (user, attachmentId) => { if (!mongoose.isValidObjectId(attachmentId)) throw fail("Invalid attachment id", 400); const attachment = await Attachment.findById(attachmentId); if (!attachment) throw fail("Attachment not found", 404); await getTicket(user, attachment.ticketId); if (user.role === "EMPLOYEE" && attachment.commentId) { const comment = await Comment.findById(attachment.commentId).select("commentType"); if (comment?.commentType === "INTERNAL") throw fail("Employees cannot access internal note attachments", 403); } return attachment; };
module.exports = { create, createMany, list, getForDownload };
