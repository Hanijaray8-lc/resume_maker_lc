const express = require("express");
const Summary = require("../models/ResumeSummary");

const router = express.Router();

// ➕ Add new summary
router.post("/", async (req, res) => {
  try {
    const { description } = req.body;
    const newSummary = new Summary({ description });
    await newSummary.save();
    res.status(201).json(newSummary);
  } catch (error) {
    res.status(500).json({ message: "Error saving summary", error });
  }
});

// GET latest summary
router.get("/latest", async (req, res) => {
  try {
    // Find the most recent summary
    const latestSummary = await Summary.findOne().sort({ createdAt: -1 });
    if (!latestSummary) {
      return res.status(404).json({ message: "No summary found" });
    }
    res.json({ success: true, data: latestSummary });
  } catch (error) {
    res.status(500).json({ message: "Error fetching latest summary", error });
  }
});


// ✏️ Update summary by ID
router.put("/:id", async (req, res) => {
  try {
    const updatedSummary = await Summary.findByIdAndUpdate(
      req.params.id,
      { description: req.body.description },
      { new: true }
    );
    res.json(updatedSummary);
  } catch (error) {
    res.status(500).json({ message: "Error updating summary", error });
  }
});

// 🗑️ Delete summary by ID
router.delete("/:id", async (req, res) => {
  try {
    await Summary.findByIdAndDelete(req.params.id);
    res.json({ message: "Summary deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting summary", error });
  }
});

module.exports = router;
