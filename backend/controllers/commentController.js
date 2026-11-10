const service = require("../services/commentService");
const { createCommentSchema } = require("../validators/commentValidator");
const list = async (req, res, next) => { try { res.json({ success: true, data: { comments: await service.list(req.user, req.params.ticketId) } }); } catch (e) { next(e); } };
const create = async (req, res, next) => { try { const comment = await service.create(req.user, req.params.ticketId, createCommentSchema.parse(req.body)); res.status(201).json({ success: true, data: { comment } }); } catch (e) { next(e); } };
module.exports = { list, create };
