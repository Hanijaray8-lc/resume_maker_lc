const mongoose = require("mongoose");

const SkillSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },   // User reference
    skills: [
      {
        name: { type: String, required: true },
        rating: { type: Number, default: 0 },
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Skill", SkillSchema);
{/*const mongoose = require("mongoose");

const SkillSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },       // skill name
    rating: { type: Number, default: 0 },         // rating (0–5)
  },
  { timestamps: true }
);

module.exports = mongoose.model("Skill", SkillSchema);*/}
