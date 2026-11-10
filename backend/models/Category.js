const mongoose = require("mongoose");
const categorySchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true, minlength: 1, maxlength: 100 },
    description: { type: String, trim: true, maxlength: 500, default: "" },
    isActive: { type: Boolean, default: true }
}, { timestamps: true, collection: "categories" });
categorySchema.index({ isActive: 1, name: 1 });
module.exports = mongoose.model("Category", categorySchema);
