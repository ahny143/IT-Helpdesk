const { z } = require("zod");

const password = z.string().min(8).max(128);
const email = z.string().trim().toLowerCase().email().max(254);

const registerSchema = z.object({
    fullName: z.string().trim().min(2).max(100), email, password,
    confirmPassword: password, phone: z.string().trim().max(30).optional().default(""),
    department: z.string().trim().max(100).optional().default("")
}).refine((data) => data.password === data.confirmPassword, { path: ["confirmPassword"], message: "Passwords do not match" });

const loginSchema = z.object({ email, password: z.string().min(1).max(128) });
module.exports = { registerSchema, loginSchema };
