const mongoose = require("mongoose");
const historySchema = new mongoose.Schema({
    ticketId: { type: mongoose.Schema.Types.ObjectId, ref: "Ticket", required: true, index: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    action: { type: String, required: true, trim: true },
    oldValue: { type: mongoose.Schema.Types.Mixed, default: null },
    newValue: { type: mongoose.Schema.Types.Mixed, default: null },
    description: { type: String, required: true, trim: true, maxlength: 1000 }
}, { timestamps: { createdAt: true, updatedAt: false }, collection: "ticket_histories" });
historySchema.index({ ticketId: 1, createdAt: -1 });
module.exports = mongoose.model("TicketHistory", historySchema);
