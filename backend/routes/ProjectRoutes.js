const express = require("express");
const router = express.Router();
const Project = require("../models/Project");

// ➤ Save multiple projects (overwrite old)
// ➤ Append projects instead of replace
router.post("/", async (req, res) => {
  try {
    const { userId, projects } = req.body;

    if (!projects || !Array.isArray(projects) || projects.length === 0) {
      return res.status(400).json({ error: "Projects array required" });
    }

    const updated = await Project.findOneAndUpdate(
      { userId },
      { $push: { projects: { $each: projects } } },  // ✅ append
      { new: true, upsert: true }
    );

    res.status(201).json(updated);
  } catch (error) {
    console.error("❌ Error saving projects:", error);
    res.status(500).json({ error: "Server error" });
  }
});


// GET latest project for a user
router.get("/latest", async (req, res) => {
  try {
    // Find the latest project document based on creation time
    const latestProjectDoc = await Project.findOne()
      .sort({ createdAt: -1 }) // newest document first
      .lean(); // optional, gives plain JS object

    if (!latestProjectDoc || latestProjectDoc.projects.length === 0) {
      return res.status(404).json({ error: "No projects found" });
    }

    // Get the last project in that document (latest added project)
    const latestProject = latestProjectDoc.projects[latestProjectDoc.projects.length - 1];

    res.json(latestProject);
  } catch (error) {
    console.error("❌ Error fetching latest project:", error);
    res.status(500).json({ error: "Server error" });
  }
});



// ➤ Delete one project from the array
router.delete("/:userId/:index", async (req, res) => {
  try {
    const { userId, index } = req.params;

    const projectDoc = await Project.findOne({ userId });
    if (!projectDoc) return res.status(404).json({ error: "No projects found" });

    if (index < 0 || index >= projectDoc.projects.length) {
      return res.status(400).json({ error: "Invalid project index" });
    }

    projectDoc.projects.splice(index, 1);
    await projectDoc.save();

    res.json({
      message: "Project deleted successfully",
      projects: projectDoc.projects,
    });
  } catch (error) {
    console.error("❌ Error deleting project:", error);
    res.status(500).json({ error: "Server error" });
  }
});



module.exports = router;
