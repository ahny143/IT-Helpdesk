const multer = require("multer");

const maxSize = Number(process.env.MAX_FILE_SIZE || 10 * 1024 * 1024);
const maxFiles = Number(process.env.MAX_FILES_PER_UPLOAD || 5);
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: maxSize, files: maxFiles }, fileFilter: (req, file, cb) => { if (!file.originalname || !file.mimetype) return cb(new Error("Invalid file")); cb(null, true); } });
module.exports = { upload, maxSize, maxFiles };
