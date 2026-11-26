const dashboardService = require("../services/dashboardService");

const employee = async (req, res, next) => {
    try { res.json({ success: true, data: await dashboardService.getEmployeeDashboard(req.user._id) }); }
    catch (error) { next(error); }
};

module.exports = { employee };
