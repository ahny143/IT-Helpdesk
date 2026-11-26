const { z } = require("zod");
const ratingSchema = z.object({ score: z.number().int().min(1).max(5), feedback: z.string().trim().max(2000).optional().default("") }).strict();
module.exports = { ratingSchema };
