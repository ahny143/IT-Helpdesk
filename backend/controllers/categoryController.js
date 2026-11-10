const service = require("../services/categoryService");
const { createCategorySchema, updateCategorySchema, statusSchema, listQuerySchema } = require("../validators/categoryValidator");
const canSeeInactive = (req) => req.user.role === "ADMIN";
const list = async (req, res, next) => { try { const query = listQuerySchema.parse(req.query); const isActive = query.isActive === undefined ? undefined : query.isActive === "true"; const categories = await service.list({ isActive, includeInactive: canSeeInactive(req) }); res.json({ success: true, data: { categories } }); } catch (e) { next(e); } };
const getById = async (req, res, next) => { try { const category = await service.getById(req.params.id, canSeeInactive(req)); res.json({ success: true, data: { category } }); } catch (e) { next(e); } };
const create = async (req, res, next) => { try { const category = await service.create(createCategorySchema.parse(req.body)); res.status(201).json({ success: true, data: { category } }); } catch (e) { next(e); } };
const update = async (req, res, next) => { try { const category = await service.update(req.params.id, updateCategorySchema.parse(req.body)); res.json({ success: true, data: { category } }); } catch (e) { next(e); } };
const setStatus = async (req, res, next) => { try { const category = await service.update(req.params.id, statusSchema.parse(req.body)); res.json({ success: true, data: { category } }); } catch (e) { next(e); } };
module.exports = { list, getById, create, update, setStatus };
