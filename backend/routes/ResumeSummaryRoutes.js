const express = require("express");
const Summary = require("../models/ResumeSummary");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

// ─── GET all summaries for logged-in user ────────────────────────────────────
router.get("/all", authMiddleware, async (req, res) => {
  try {
    const summaries = await Summary.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(summaries);
  } catch (err) {
    res.status(500).json({ message: "Error fetching summaries", error: err.message });
  }
});

// ─── GET latest summary for logged-in user ───────────────────────────────────
router.get("/latest", authMiddleware, async (req, res) => {
  try {
    const latest = await Summary.findOne({ userId: req.user.id }).sort({ createdAt: -1 });
    if (!latest) return res.status(404).json({ message: "No summary found" });
    res.json({ success: true, data: latest });
  } catch (err) {
    res.status(500).json({ message: "Error fetching latest summary", error: err.message });
  }
});

// ─── POST save new summary ────────────────────────────────────────────────────
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { description } = req.body;
    if (!description || !description.trim()) {
      return res.status(400).json({ message: "Description is required" });
    }
    const newSummary = new Summary({
      userId: req.user.id,
      description: description.trim(),
    });
    await newSummary.save();
    res.status(201).json(newSummary);
  } catch (err) {
    res.status(500).json({ message: "Error saving summary", error: err.message });
  }
});

// ─── PUT update summary by ID ─────────────────────────────────────────────────
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const updated = await Summary.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { description: req.body.description },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Summary not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Error updating summary", error: err.message });
  }
});

// ─── DELETE summary by ID ─────────────────────────────────────────────────────
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    await Summary.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    res.json({ message: "Summary deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting summary", error: err.message });
  }
});

module.exports = router;