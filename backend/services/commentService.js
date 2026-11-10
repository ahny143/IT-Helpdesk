const mongoose = require("mongoose");
const Comment = require("../models/Comment");
const Ticket = require("../models/Ticket");

const fail = (message, status) => Object.assign(new Error(message), { status });
const validId = (id) => { if (!mongoose.isValidObjectId(id)) throw fail("Invalid ticket id", 400); return id; };
const ticketFilter = (user, ticketId) => user.role === "ADMIN" ? { _id: ticketId } : user.role === "IT_SUPPORT" ? { _id: ticketId, assigneeId: user._id } : { _id: ticketId, employeeId: user._id };
const getTicket = async (user, ticketId) => { const ticket = await Ticket.findOne(ticketFilter(user, validId(ticketId))); if (!ticket) throw fail("Ticket not found or access denied", 404); return ticket; };
const list = async (user, ticketId) => { await getTicket(user, ticketId); const filter = { ticketId: validId(ticketId) }; if (user.role === "EMPLOYEE") filter.commentType = "PUBLIC"; return Comment.find(filter).populate("userId", "fullName role").sort({ createdAt: 1 }); };
const create = async (user, ticketId, data) => { await getTicket(user, ticketId); if (data.commentType === "INTERNAL" && !["IT_SUPPORT", "ADMIN"].includes(user.role)) throw fail("Employees cannot create internal notes", 403); const comment = await Comment.create({ ticketId: validId(ticketId), userId: user._id, content: data.content, commentType: data.commentType }); return Comment.findById(comment._id).populate("userId", "fullName role"); };
module.exports = { list, create };
