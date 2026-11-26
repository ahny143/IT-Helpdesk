const router = require("express").Router();
const auth = require("../middlewares/authMiddleware");
const role = require("../middlewares/roleMiddleware");
const controller = require("../controllers/ratingController");
router.use(auth);
router.get("/", role("ADMIN"), controller.list);
router.get("/statistics", role("ADMIN"), controller.statistics);
module.exports = router;
