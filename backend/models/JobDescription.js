const mongoose = require("mongoose");

const JobDescriptionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // optional now
    workId: { type: mongoose.Schema.Types.ObjectId, ref: "WorkExperience", required: true },
    description: { type: String, required: true },
  },
  { timestamps: true }
);


module.exports = mongoose.model("JobDescription", JobDescriptionSchema);
