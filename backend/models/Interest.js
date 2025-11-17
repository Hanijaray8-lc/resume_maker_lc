const mongoose = require("mongoose");

const interestSchema = new mongoose.Schema({
  interests: [{ type: String, required: true }],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Interest", interestSchema);
