const mongoose = require("mongoose");

const interestSchema = new mongoose.Schema({
  interests: [{ type: String, required: true, maxlength: 70 }],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Interest", interestSchema);
