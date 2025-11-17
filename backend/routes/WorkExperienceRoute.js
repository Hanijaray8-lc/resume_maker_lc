const express = require("express");
const WorkExperience = require("../models/WorkExperience");

const router = express.Router();

// ✅ Create new Work Experience
router.post("/", async (req, res) => {
  try {
    const newWork = new WorkExperience(req.body);
    const savedWork = await newWork.save();
    res.status(201).json({ message: "Work experience saved successfully", data: savedWork });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET /api/work-experiences/latest
router.get("/latest", async (req, res) => {
  try {
    const latest = await WorkExperience.findOne().sort({ createdAt: -1 });
    res.json(latest);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Get all Work Experiences
router.get("/", async (req, res) => {
  try {
    const works = await WorkExperience.find().sort({ createdAt: -1 });
    res.json({ success: true, data: works });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});


// ✅ Get all work experiences of a user
// Get all Work Experiences for a particular user
router.get("/user/:userId", async (req, res) => {
  try {
    const works = await WorkExperience.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.json({ success: true, data: works });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});




// ✅ Get all Work Experiences
router.get("/", async (req, res) => {
  try {
    const works = await WorkExperience.find();
    res.json(works);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Get Work Experience by ID
router.get("/:id", async (req, res) => {
  try {
    const work = await WorkExperience.findById(req.params.id);
    if (!work) return res.status(404).json({ message: "Not Found" });
    res.json(work);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Update Work Experience
router.put("/:id", async (req, res) => {
  try {
    const updated = await WorkExperience.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Delete Work Experience
router.delete("/:id", async (req, res) => {
  try {
    await WorkExperience.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted Successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
{/*const express = require("express");
const WorkExperience = require("../models/WorkExperience");

const router = express.Router();




// ✅ Create new Work Experience
router.post("/", async (req, res) => {
  try {
    const newWork = new WorkExperience(req.body);
    const savedWork = await newWork.save();
    res.status(201).json(savedWork);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Get all Work Experiences
router.get("/", async (req, res) => {
  try {
    const works = await WorkExperience.find();
    res.json(works);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const newExperience = new WorkExperience(req.body);
    await newExperience.save();
    res.status(201).json({ message: "Work experience saved successfully", data: newExperience });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ✅ Get all work experiences (for testing/fetching later)
router.get("/", async (req, res) => {
  try {
    const experiences = await WorkExperience.find();
    res.json(experiences);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Get Work Experience by ID
router.get("/:id", async (req, res) => {
  try {
    const work = await WorkExperience.findById(req.params.id);
    if (!work) return res.status(404).json({ message: "Not Found" });
    res.json(work);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Update Work Experience
// routes/WorkExperienceRoute.js
router.put("/:id", async (req, res) => {
  try {
    const updated = await WorkExperience.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ✅ Delete Work Experience
router.delete("/:id", async (req, res) => {
  try {
    await WorkExperience.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted Successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;*/}
