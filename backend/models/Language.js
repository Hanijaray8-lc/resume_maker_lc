const mongoose = require("mongoose");

const languageSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // link to user
  name: { type: String, required: true },
  level: { type: String, required: true },
});

module.exports = mongoose.model("Language", languageSchema);
