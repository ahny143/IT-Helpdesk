const { z } = require("zod");
const createCommentSchema = z.object({ content: z.string().trim().min(1).max(5000), commentType: z.enum(["PUBLIC", "INTERNAL"]).default("PUBLIC") }).strict();
module.exports = { createCommentSchema };
