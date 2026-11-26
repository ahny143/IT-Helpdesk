const Ticket = require("../models/Ticket");
const slaService = require("./slaService");

const STATUSES = ["OPEN", "ASSIGNED", "IN_PROGRESS", "PENDING", "RESOLVED", "CLOSED"];
const SLA_STATES = ["ON_TRACK", "NEAR_DEADLINE", "BREACHED", "PAUSED", "COMPLETED"];

const getEmployeeDashboard = async (userId) => {
    const filter = { employeeId: userId };
    const [statusCounts, recentTickets, slaTickets, total] = await Promise.all([
        Ticket.aggregate([{ $match: filter }, { $group: { _id: "$status", count: { $sum: 1 } } }]),
        Ticket.find(filter).select("ticketCode title priority status createdAt assigneeId").populate("assigneeId", "fullName email").sort({ createdAt: -1 }).limit(5),
        Ticket.find({ ...filter, slaDueAt: { $exists: true, $ne: null } }).select("status pendingType slaDueAt slaPausedAt slaRemainingMinutes"),
        Ticket.countDocuments(filter)
    ]);
    const countsByStatus = Object.fromEntries(STATUSES.map((status) => [status, 0]));
    for (const item of statusCounts) countsByStatus[item._id] = item.count;
    const slaSummary = Object.fromEntries(SLA_STATES.map((state) => [state, 0]));
    for (const ticket of slaTickets) {
        const state = slaService.getStatus(ticket, await slaService.currentRemaining(ticket));
        slaSummary[state] += 1;
    }
    return { total, countsByStatus, recentTickets, slaSummary };
};

module.exports = { getEmployeeDashboard };
