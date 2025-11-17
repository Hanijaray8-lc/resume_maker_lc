const express = require("express");
const router = express.Router();
const AdditionalInfo = require("../models/AdditionalInfo");

// Save or update additional info
router.post("/", async (req, res) => {
  try {
    const { userId, details } = req.body;
    if (!userId || !details) return res.status(400).json({ success: false, message: "Missing fields" });

    // Check if info already exists for user
    let info = await AdditionalInfo.findOne({ userId });
    if (info) {
      info.details = details;
      await info.save();
    } else {
      info = await AdditionalInfo.create({ userId, details });
    }

    res.json({ success: true, data: info });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Fetch user info
router.get("/:userId", async (req, res) => {
  try {
    const info = await AdditionalInfo.findOne({ userId: req.params.userId });
    res.json({ success: true, data: info });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
