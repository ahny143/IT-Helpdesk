const { z } = require("zod");
const attachmentRequestSchema = z.object({ commentId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid comment id").optional() }).strict();
module.exports = { attachmentRequestSchema };
