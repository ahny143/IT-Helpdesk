const mongoose = require("mongoose");
const schema = new mongoose.Schema({ name: { type: String, required: true, trim: true, maxlength: 120 }, date: { type: Date, required: true }, description: { type: String, trim: true, maxlength: 500, default: "" }, isActive: { type: Boolean, default: true }, createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true } }, { timestamps: true, collection: "holidays" });
schema.index({ date: 1 }, { unique: true });
module.exports = mongoose.model("Holiday", schema);
