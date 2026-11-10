const { z } = require("zod");
const { PRIORITIES, STATUSES } = require("../models/Ticket");
const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId");
const createTicketSchema = z.object({ title: z.string().trim().min(3).max(200), description: z.string().trim().min(5).max(5000), categoryId: objectId, priority: z.enum(PRIORITIES) }).strict();
const updateTicketSchema = z.object({ title: z.string().trim().min(3).max(200).optional(), description: z.string().trim().min(5).max(5000).optional(), categoryId: objectId.optional(), priority: z.enum(PRIORITIES).optional() }).strict().refine((data) => Object.keys(data).length > 0, { message: "At least one field is required" });
const assignTicketSchema = z.object({ assigneeId: objectId }).strict();
const statusSchema = z.object({ status: z.enum(STATUSES), pendingReason: z.string().trim().max(1000).optional(), pendingType: z.enum(["WAITING_EMPLOYEE", "OTHER"]).optional(), cause: z.string().trim().max(2000).optional(), solution: z.string().trim().max(5000).optional(), reopenReason: z.string().trim().min(1).max(1000).optional() }).strict();
const listQuerySchema = z.object({ page: z.coerce.number().int().min(1).default(1), limit: z.coerce.number().int().min(1).max(100).default(20), status: z.enum(STATUSES).optional(), priority: z.enum(PRIORITIES).optional(), categoryId: objectId.optional(), assigneeId: objectId.optional() }).strict();
module.exports = { createTicketSchema, updateTicketSchema, assignTicketSchema, statusSchema, listQuerySchema };
