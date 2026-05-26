// models/Accomplishment.js
const mongoose = require("mongoose");

const accomplishmentSchema = new mongoose.Schema({
  userId: { type: String }, // optional if you want user-specific data
  // no maxlength — allow unlimited accomplishment text
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Accomplishment", accomplishmentSchema);
