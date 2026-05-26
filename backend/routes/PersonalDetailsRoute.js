const express = require("express");
const PersonalDetails = require("../models/PersonalDetails.js");

const router = express.Router();

// ✅ Save personal details
router.post("/", async (req, res) => {
  try {
    const newDetails = new PersonalDetails(req.body);
    const savedDetails = await newDetails.save();
    res.status(201).json(savedDetails);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Get all personal details
router.get("/", async (req, res) => {
  try {
    const details = await PersonalDetails.find();
    res.json(details);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Get personal details by ID
router.get("/:id", async (req, res) => {
  try {
    const details = await PersonalDetails.findById(req.params.id);
    if (!details) return res.status(404).json({ message: "Not Found" });
    res.json(details);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Update personal details
router.put("/:id", async (req, res) => {
  try {
    const updated = await PersonalDetails.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Delete personal details
router.delete("/:id", async (req, res) => {
  try {
    await PersonalDetails.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted Successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;   // ✅ CommonJS export
