const { z } = require("zod");
const fields = { name: z.string().trim().min(1, "Category name is required").max(100), description: z.string().trim().max(500).optional().default("") };
const createCategorySchema = z.object(fields).strict();
const updateCategorySchema = z.object(fields).partial().strict().refine((data) => Object.keys(data).length > 0, { message: "At least one field is required" });
const statusSchema = z.object({ isActive: z.boolean() }).strict();
const listQuerySchema = z.object({ isActive: z.enum(["true", "false"]).optional() }).strict();
module.exports = { createCategorySchema, updateCategorySchema, statusSchema, listQuerySchema };
