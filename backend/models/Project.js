const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    projects: [
      {
        title: { type: String, required: true },
        description: { type: String, required: true },
        technologies: { type: [String], required: true },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Project", projectSchema);
