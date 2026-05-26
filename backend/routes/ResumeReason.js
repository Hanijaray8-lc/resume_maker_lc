const express = require("express");
const ResumeStep = require("../models/Resumereason.js");

const router = express.Router();

// Save resume purpose
router.post("/", async (req, res) => {
  try {
    const { purpose } = req.body;
    const newStep = new ResumeStep({ purpose });
    const savedStep = await newStep.save();
    res.status(201).json(savedStep);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all resume purposes
router.get("/", async (req, res) => {
  try {
    const steps = await ResumeStep.find();
    res.json(steps);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
