const express = require("express");
const router = express.Router();
const Reference = require("../models/Reference");

// Save or Update
router.post("/save", async (req, res) => {
  try {
    const { userId, content } = req.body;

    if (!userId) return res.status(400).json({ error: "userId is required" });

    const saved = await Reference.findOneAndUpdate(
      { userId },
      { userId, content },
      { upsert: true, new: true }
    );

    res.json(saved);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Get by userId
router.get("/:userId", async (req, res) => {
  try {
    const data = await Reference.findOne({ userId: req.params.userId });
    res.json(data || {});
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
