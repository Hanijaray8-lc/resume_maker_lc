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


// const express = require("express");
// const Education = require("../models/EducationSection");

// const router = express.Router();

// // POST: Add education
// router.post("/", async (req, res) => {
//   try {
//     const newEducation = new Education(req.body);
//     const savedEducation = await newEducation.save();
//     res.status(201).json(savedEducation);
//   } catch (error) {
//     console.error("Error saving education:", error);
//     res.status(500).json({ 
//       message: "Error saving education", 
//       error: error.message 
//     });
//   }
// });

// // GET: Get all education entries
// router.get("/", async (req, res) => {
//   try {
//     const educations = await Education.find().sort({ createdAt: -1 });
//     res.status(200).json(educations);
//   } catch (error) {
//     console.error("Error fetching education data:", error);
//     res.status(500).json({ 
//       message: "Error fetching education data", 
//       error: error.message 
//     });
//   }
// });

// // GET: Get single education by ID
// router.get("/:id", async (req, res) => {
//   try {
//     const education = await Education.findById(req.params.id);
//     if (!education) {
//       return res.status(404).json({ message: "Education not found" });
//     }
//     res.status(200).json(education);
//   } catch (error) {
//     console.error("Error fetching education data:", error);
//     res.status(500).json({ 
//       message: "Error fetching education data", 
//       error: error.message 
//     });
//   }
// });

// // PUT: Update education
// router.put("/:id", async (req, res) => {
//   try {
//     const updatedEducation = await Education.findByIdAndUpdate(
//       req.params.id,
//       req.body,
//       { new: true, runValidators: true }
//     );
    
//     if (!updatedEducation) {
//       return res.status(404).json({ message: "Education not found" });
//     }
    
//     res.status(200).json(updatedEducation);
//   } catch (error) {
//     console.error("Error updating education:", error);
//     res.status(500).json({ 
//       message: "Error updating education", 
//       error: error.message 
//     });
//   }
// });

// // DELETE: Delete education
// router.delete("/:id", async (req, res) => {
//   try {
//     const deletedEducation = await Education.findByIdAndDelete(req.params.id);
    
//     if (!deletedEducation) {
//       return res.status(404).json({ message: "Education not found" });
//     }
    
//     res.status(200).json({ 
//       message: "Education deleted successfully",
//       deletedEducation 
//     });
//   } catch (error) {
//     console.error("Error deleting education:", error);
//     res.status(500).json({ 
//       message: "Error deleting education", 
//       error: error.message 
//     });
//   }
// });

// // GET: Get latest education (for resume template)
// router.get("/latest", async (req, res) => {
//   try {
//     const latestEducation = await Education.find()
//       .sort({ createdAt: -1 })
//       .limit(1);
    
//     res.json({ 
//       success: true, 
//       data: latestEducation[0] || null 
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ 
//       success: false, 
//       message: err.message 
//     });
//   }
// });

// module.exports = router;