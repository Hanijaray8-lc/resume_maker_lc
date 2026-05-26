const express = require("express");
const router = express.Router();
const Language = require("../models/Language");

// ➤ Add multiple languages (append, not replace)
router.post("/saveAll", async (req, res) => {
  try {
    const { userId, languages } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    // Insert new languages (append to old ones)
    const saved = await Language.insertMany(
      languages.map((lang) => ({
        userId,
        name: lang.name,
        level: lang.level || "",
      }))
    );

    res.json(saved);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// ➤ Get all languages of a user
// Get latest languages (latest added batch)
router.get("/latest", async (req, res) => {
  try {
    const latestLanguages = await Language.find()
      .sort({ createdAt: -1 }) // newest first
      .limit(1);               // only the latest

    res.json({ success: true, data: latestLanguages[0] || null });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
});


// ➤ Update language level
router.put("/:id", async (req, res) => {
  try {
    const { level } = req.body;
    const updated = await Language.findByIdAndUpdate(
      req.params.id,
      { level },
      { new: true }
    );
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// ➤ Delete a language
router.delete("/:id", async (req, res) => {
  try {
    await Language.findByIdAndDelete(req.params.id);
    res.json({ message: "Language deleted" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
