const { z } = require("zod");
const { ROLES } = require("../models/User");
const profileSchema = z.object({ fullName: z.string().trim().min(2).max(100), phone: z.string().trim().max(30).optional(), department: z.string().trim().max(100).optional() }).strict();
const createUserSchema = z.object({ fullName: z.string().trim().min(2).max(100), email: z.string().trim().toLowerCase().email(), password: z.string().min(8).max(128), phone: z.string().trim().max(30).optional().default(""), department: z.string().trim().max(100).optional().default(""), role: z.enum(ROLES.filter((role) => role !== "EMPLOYEE")) });
const statusSchema = z.object({ isActive: z.boolean() });
module.exports = { profileSchema, createUserSchema, statusSchema };
