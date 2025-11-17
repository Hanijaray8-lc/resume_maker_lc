const express = require("express");
const router = express.Router();
const Interest = require("../models/Interest");

// Save interests
router.post("/", async (req, res) => {
  try {
    const { interests } = req.body;
    if (!interests || interests.length === 0) {
      return res.status(400).json({ success: false, message: "No interests provided" });
    }

    const newInterests = new Interest({ interests });
    await newInterests.save();

    res.status(201).json({ success: true, data: newInterests });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get all interests
router.get("/", async (req, res) => {
  try {
    const allInterests = await Interest.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: allInterests });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Delete an interest entry
router.delete("/:id", async (req, res) => {
  try {
    await Interest.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Interest deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
