const router = require("express").Router();
const auth = require("../middlewares/authMiddleware");
const controller = require("../controllers/commentController");
router.use(auth);
router.get("/", controller.list);
router.post("/", controller.create);
module.exports = router;
