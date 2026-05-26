const mongoose = require("mongoose");

const summarySchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Summary", summarySchema);