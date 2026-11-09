const router = require("express").Router();
const controller = require("../controllers/authController");
const auth = require("../middlewares/authMiddleware");
router.post("/register", controller.register); router.post("/login", controller.login); router.post("/logout", auth, controller.logout); router.get("/me", auth, controller.me);
module.exports = router;
