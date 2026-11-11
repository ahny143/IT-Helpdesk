const service = require("../services/notificationService");
const list = async (req, res, next) => { try { res.json({ success: true, data: await service.list(req.user._id, req.query) }); } catch (e) { next(e); } };
const unreadCount = async (req, res, next) => { try { res.json({ success: true, data: { count: await service.unreadCount(req.user._id) } }); } catch (e) { next(e); } };
const markRead = async (req, res, next) => { try { res.json({ success: true, data: { notification: await service.markRead(req.user._id, req.params.id) } }); } catch (e) { next(e); } };
const markAllRead = async (req, res, next) => { try { const result = await service.markAllRead(req.user._id); res.json({ success: true, data: { modifiedCount: result.modifiedCount } }); } catch (e) { next(e); } };
module.exports = { list, unreadCount, markRead, markAllRead };
