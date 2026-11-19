const Ticket = require("../models/Ticket");
const TicketHistory = require("../models/TicketHistory");
const User = require("../models/User");
const slaService = require("./slaService");
const notificationService = require("./notificationService");
const responsibleUsers = async (ticket) => ticket.assigneeId ? [{ _id: ticket.assigneeId }] : User.find({ role: "ADMIN", isActive: true }).select("_id");
const scan = async ({ ticketId } = {}) => {
    const tickets = await Ticket.find({ ...(ticketId ? { _id: ticketId } : {}), status: { $nin: ["RESOLVED", "CLOSED"] }, slaDueAt: { $exists: true, $ne: null } }).select("_id ticketCode assigneeId priority status pendingType slaDueAt slaPausedAt slaRemainingMinutes slaVersion");
    let warnings = 0; let violations = 0;
    for (const ticket of tickets) {
        const state = slaService.getStatus(ticket, await slaService.currentRemaining(ticket)); if (!["NEAR_DEADLINE", "BREACHED"].includes(state)) continue;
        const action = state === "NEAR_DEADLINE" ? "SLA_WARNING" : "SLA_VIOLATION"; const dedupeKey = `${ticket._id}:${action}:${ticket.slaVersion}`;
        const users = await responsibleUsers(ticket); try {
            for (const user of users) await notificationService.create({ userId: user._id, ticketId: ticket._id, title: action === "SLA_WARNING" ? "SLA near deadline" : "SLA breached", message: `${ticket.ticketCode} requires attention.`, type: action, dedupeKey: `${dedupeKey}:${user._id}` });
            await TicketHistory.create({ ticketId: ticket._id, userId: ticket.assigneeId || users[0]?._id, action, oldValue: null, newValue: { slaVersion: ticket.slaVersion, priority: ticket.priority, slaDueAt: ticket.slaDueAt }, description: action === "SLA_WARNING" ? "SLA is near deadline" : "SLA deadline breached" });
        } catch (error) { if (error.code === 11000) continue; throw error; }
        if (action === "SLA_WARNING") warnings += 1; else violations += 1;
    }
    return { warnings, violations };
};
module.exports = { scan };
