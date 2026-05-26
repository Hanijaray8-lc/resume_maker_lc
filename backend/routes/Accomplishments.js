// routes/accomplishments.js
const express = require("express");
const router = express.Router();
const Accomplishment = require("../models/Accomplishment");

// Save accomplishments
router.post("/", async (req, res) => {
  try {
    const { text, userId } = req.body;
    if (!text) return res.status(400).json({ success: false, message: "Accomplishments text is required" });

    const newAccomplishment = new Accomplishment({ text, userId });
    await newAccomplishment.save();
    res.status(201).json({ success: true, data: newAccomplishment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get all accomplishments (optionally for a user)
router.get("/", async (req, res) => {
  try {
    const { userId } = req.query; // optional filter by user
    const accomplishments = userId
      ? await Accomplishment.find({ userId }).sort({ createdAt: -1 })
      : await Accomplishment.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: accomplishments });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Delete an accomplishment
router.delete("/:id", async (req, res) => {
  try {
    await Accomplishment.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Accomplishment deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server Error", error: err.message });
  }
});

module.exports = router;
