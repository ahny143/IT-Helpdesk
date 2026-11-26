const mongoose = require("mongoose");
const ratingSchema = new mongoose.Schema({
    ticketId: { type: mongoose.Schema.Types.ObjectId, ref: "Ticket", required: true, unique: true },
    employeeId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    score: { type: Number, required: true, min: 1, max: 5, validate: { validator: Number.isInteger, message: "Score must be an integer" } },
    feedback: { type: String, trim: true, maxlength: 2000, default: "" }
}, { timestamps: { createdAt: true, updatedAt: false }, collection: "ratings" });
module.exports = mongoose.model("Rating", ratingSchema);
