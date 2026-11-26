const service = require("../services/ratingService");
const { ratingSchema } = require("../validators/ratingValidator");
const create = async (req, res, next) => { try { res.status(201).json({ success: true, data: { rating: await service.create(req.user, req.params.ticketId, ratingSchema.parse(req.body)) } }); } catch (e) { next(e); } };
const getForTicket = async (req, res, next) => { try { res.json({ success: true, data: { rating: await service.getForTicket(req.user, req.params.ticketId) } }); } catch (e) { next(e); } };
const list = async (req, res, next) => { try { res.json({ success: true, data: await service.list(req.query) }); } catch (e) { next(e); } };
const statistics = async (req, res, next) => { try { res.json({ success: true, data: await service.statistics() }); } catch (e) { next(e); } };
module.exports = { create, getForTicket, list, statistics };
