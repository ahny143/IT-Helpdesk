const router = require("express").Router();
const auth = require("../middlewares/authMiddleware");
const { upload } = require("../middlewares/uploadMiddleware");
const controller = require("../controllers/attachmentController");
router.use(auth);
router.post("/tickets/:ticketId/attachments", upload.array("files"), controller.upload);
router.get("/tickets/:ticketId/attachments", controller.list);
router.get("/attachments/:attachmentId/download", controller.download);
module.exports = router;
