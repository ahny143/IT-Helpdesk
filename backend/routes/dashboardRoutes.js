const router = require("express").Router();
const auth = require("../middlewares/authMiddleware");
const role = require("../middlewares/roleMiddleware");
const controller = require("../controllers/dashboardController");

router.use(auth);
router.get("/employee", role("EMPLOYEE"), controller.employee);

module.exports = router;
