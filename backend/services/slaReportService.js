const Ticket = require("../models/Ticket");
const slaService = require("./slaService");
const scope = (user) => user.role === "ADMIN" ? {} : user.role === "IT_SUPPORT" ? { assigneeId: user._id } : { employeeId: user._id };
const report = async (user, query = {}) => {
    const filter = { ...scope(user), slaDueAt: { $exists: true, $ne: null } };
    if (query.from || query.to) { filter.createdAt = {}; if (query.from) filter.createdAt.$gte = new Date(query.from); if (query.to) filter.createdAt.$lte = new Date(query.to); }
    const tickets = await Ticket.find(filter).select("ticketCode title priority status resolvedAt slaDueAt slaPausedAt pendingType");
    const result = { total: tickets.length, completedOnTime: 0, completedLate: 0, breached: 0, paused: 0, onTrack: 0, nearDeadline: 0, breachedTickets: [], nearDeadlineTickets: [], byPriority: {}, byStatus: {} };
    for (const ticket of tickets) {
        let actual;
        if (["RESOLVED", "CLOSED"].includes(ticket.status)) actual = ticket.resolvedAt && ticket.slaDueAt && ticket.resolvedAt <= ticket.slaDueAt ? "COMPLETED_ON_TIME" : "COMPLETED_LATE";
        else if (ticket.slaPausedAt && ticket.status === "PENDING" && ticket.pendingType === "WAITING_EMPLOYEE") actual = "PAUSED";
        else actual = slaService.getStatus(ticket, await slaService.currentRemaining(ticket));
        const summary = { ticketId: ticket._id, ticketCode: ticket.ticketCode, title: ticket.title, priority: ticket.priority, status: ticket.status, slaDueAt: ticket.slaDueAt };
        if (actual === "COMPLETED_ON_TIME") result.completedOnTime += 1; else if (actual === "COMPLETED_LATE") result.completedLate += 1; else if (actual === "PAUSED") result.paused += 1; else if (actual === "BREACHED") { result.breached += 1; result.breachedTickets.push(summary); } else if (actual === "NEAR_DEADLINE") { result.nearDeadline += 1; result.nearDeadlineTickets.push(summary); } else result.onTrack += 1;
        result.byPriority[ticket.priority] = (result.byPriority[ticket.priority] || 0) + 1; result.byStatus[ticket.status] = (result.byStatus[ticket.status] || 0) + 1;
    }
    const evaluated = result.completedOnTime + result.completedLate;
    return { ...result, completionRate: evaluated ? Number((result.completedOnTime / evaluated * 100).toFixed(2)) : 0 };
};
module.exports = { report };
