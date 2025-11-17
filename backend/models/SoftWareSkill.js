const mongoose = require("mongoose");

const SoftwareSkillSchema = new mongoose.Schema({
  userId: {
    type: String,    // ✅ allow any string (no ObjectId casting)
    required: true,
  },
  skills: [
    {
      name: { type: String, required: true },
      level: { type: Number, default: 50 },
    },
  ],
});

module.exports = mongoose.model("SoftwareSkill", SoftwareSkillSchema);
