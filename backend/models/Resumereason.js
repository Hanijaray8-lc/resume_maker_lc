const mongoose = require("mongoose");

const ResumeStepSchema = new mongoose.Schema({
  purpose: {
    type: String,
    enum: ["Job Seeking", "Different Reason"],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("ResumeStep", ResumeStepSchema);
