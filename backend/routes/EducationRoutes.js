// routes/EducationRoutes.js
const express = require("express");
const Education = require("../models/EducationSection.js"); // also make sure model uses module.exports

const router = express.Router();

// POST: Add education
router.post("/", async (req, res) => {
  try {
    const newEducation = new Education(req.body);
    const savedEducation = await newEducation.save();
    res.status(201).json(savedEducation);
  } catch (error) {
    res.status(500).json({ message: "Error saving education", error });
  }
});
// Get latest education
router.get("/latest", async (req, res) => {
  try {
    const latestEducation = await Education.find()
      .sort({ createdAt: -1 }) // newest first
      .limit(1);               // only the latest

    res.json({ success: true, data: latestEducation[0] || null });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
});


// GET all
router.get("/", async (req, res) => {
  try {
    const educations = await Education.find().sort({ createdAt: -1 });
    res.status(200).json(educations);
  } catch (error) {
    res.status(500).json({ message: "Error fetching education data", error });
  }
});

// GET by ID
router.get("/:id", async (req, res) => {
  try {
    const education = await Education.findById(req.params.id);
    if (!education) return res.status(404).json({ message: "Education not found" });
    res.status(200).json(education);
  } catch (error) {
    res.status(500).json({ message: "Error fetching education data", error });
  }
});

module.exports = router;
