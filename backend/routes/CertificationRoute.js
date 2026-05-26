const express = require("express");
const router = express.Router();
const CertificationGroup = require("../models/Certification");

// Save multiple certifications
router.post("/bulk", async (req, res) => {
  console.log("Request Body:", req.body);
  try {
    const { certifications } = req.body;
    if (!certifications || certifications.length === 0) {
      return res.status(400).json({ success: false, message: "No certifications provided" });
    }

    const newGroup = new CertificationGroup({ certifications });
    await newGroup.save();
    console.log("Saved:", newGroup);
    res.status(201).json({ success: true, data: [newGroup] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});


// Get all certifications
router.get("/", async (req, res) => {
  try {
    const groups = await CertificationGroup.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: groups });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Delete a certification group
router.delete("/:id", async (req, res) => {
  try {
    await CertificationGroup.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Certification deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server Error", error: err.message });
  }
});

module.exports = router;
{/*const express = require("express");
const router = express.Router();
const CertificationGroup = require("../models/Certification");

// Save multiple certifications
router.post("/bulk", async (req, res) => {
  try {
    const { certifications } = req.body;

    if (!certifications || certifications.length === 0) {
      return res.status(400).json({ success: false, message: "No certifications provided" });
    }

    const newGroup = new CertificationGroup({ certifications });
    await newGroup.save();
    res.status(201).json({ success: true, data: [newGroup] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});



// Get all certifications
router.get("/", async (req, res) => {
  try {
    const groups = await CertificationGroup.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: groups });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await CertificationGroup.findByIdAndDelete(req.params.id); // ✅ correct model
    res.status(200).json({ success: true, message: "Certification deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server Error", error: err.message });
  }
});


module.exports = router; // 🔥 Must export router*/}

{/*const express = require("express");
const router = express.Router();
const Certification = require("../models/Certification");

// ➤ Add Certification
// routes/certifications.js
router.post("/bulk", async (req, res) => {
  try {
    const { certifications } = req.body;
    const saved = await Certification.insertMany(certifications);
    res.status(201).json({ success: true, data: saved });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});


// ➤ Get All Certifications
router.get("/", async (req, res) => {
  try {
    const certifications = await Certification.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: certifications });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server Error", error: err.message });
  }
});

// ➤ Delete Certification
router.delete("/:id", async (req, res) => {
  try {
    await Certification.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Certification deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server Error", error: err.message });
  }
});

module.exports = router;*/}
