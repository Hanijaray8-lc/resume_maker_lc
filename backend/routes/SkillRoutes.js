const express = require("express");
const router = express.Router();
const Skill = require("../models/Skill");

// ➤ Save / Update all skills for a user
router.post("/", async (req, res) => {
  try {
    const { userId, skills } = req.body;

    if (!userId) return res.status(400).json({ error: "userId required" });

    // Check if document exists for user
    let userSkills = await Skill.findOne({ userId });

    if (userSkills) {
      userSkills.skills = skills;  // update existing skills array
      await userSkills.save();
    } else {
      userSkills = new Skill({ userId, skills });
      await userSkills.save();
    }

    res.json(userSkills);
  } catch (err) {
    console.error("Error saving skills:", err);
    res.status(500).json({ error: "Failed to save skills" });
  }
});

// ➤ Get skills for a user
router.get("/", async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: "userId required" });

    // Find the latest skills document for the user
    const userSkills = await Skill.findOne({ userId });
    if (!userSkills) {
      return res.status(404).json({ error: "No skills found for this user" });
    }

    res.json({ success: true, skills: userSkills.skills });
  } catch (err) {
    console.error("Error fetching skills:", err);
    res.status(500).json({ error: "Failed to fetch skills" });
  }
});

module.exports = router;
{/*const express = require("express");
const router = express.Router();
const Skill = require("../models/Skill");

// ➤ Add a new skill
router.post("/", async (req, res) => {
  try {
    const { name, rating, userId } = req.body;

    if (!name) return res.status(400).json({ error: "Skill name required" });

    const skill = new Skill({ name, rating, userId });
    await skill.save();

    res.json(skill);
  } catch (err) {
    console.error("Error adding skill:", err);
    res.status(500).json({ error: "Failed to add skill" });
  }
});

// ➤ Get all skills (optionally by userId)
router.get("/", async (req, res) => {
  try {
    const { userId } = req.query;
    const filter = userId ? { userId } : {};
    const skills = await Skill.find(filter);
    res.json(skills);
  } catch (err) {
    console.error("Error fetching skills:", err);
    res.status(500).json({ error: "Failed to fetch skills" });
  }
});

// ➤ Update skill
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, rating } = req.body;

    const updatedSkill = await Skill.findByIdAndUpdate(
      id,
      { name, rating },
      { new: true }
    );

    if (!updatedSkill) return res.status(404).json({ error: "Skill not found" });

    res.json(updatedSkill);
  } catch (err) {
    console.error("Error updating skill:", err);
    res.status(500).json({ error: "Failed to update skill" });
  }
});

// ➤ Delete skill
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const deletedSkill = await Skill.findByIdAndDelete(id);
    if (!deletedSkill) return res.status(404).json({ error: "Skill not found" });

    res.json({ message: "Skill deleted", deletedSkill });
  } catch (err) {
    console.error("Error deleting skill:", err);
    res.status(500).json({ error: "Failed to delete skill" });
  }
});

module.exports = router;*/}
