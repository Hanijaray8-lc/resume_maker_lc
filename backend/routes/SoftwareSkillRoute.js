const express = require("express");
const router = express.Router();
const SoftwareSkill = require("../models/SoftWareSkill");

// Save or Update all skills
router.post("/saveAll", async (req, res) => {
  try {
    const { userId, skills } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    // Upsert (create if not exists, else update)
    const saved = await SoftwareSkill.findOneAndUpdate(
      { userId },
      { userId, skills },
      { upsert: true, new: true }
    );

    res.json(saved);
  } catch (error) {
    console.error("Error saving skills:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Get skills by userId
router.get("/:userId", async (req, res) => {
  try {
    const skills = await SoftwareSkill.findOne({ userId: req.params.userId });
    if (!skills) {
      return res.status(404).json({ message: "No skills found" });
    }
    res.json(skills);
  } catch (error) {
    console.error("Error fetching skills:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
