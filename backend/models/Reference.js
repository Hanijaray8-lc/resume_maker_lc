const mongoose = require("mongoose");

const ReferenceSchema = new mongoose.Schema({
  userId: {
    type: String, // if you have User model, use ObjectId instead
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Reference", ReferenceSchema);
