const express = require("express");
const router = express.Router();
const Volunteering = require("../models/Volunteering");

// Save volunteering
router.post("/save", async (req, res) => {
  try {
    const { userId, subtopic, fromDate, toDate, content } = req.body;

    if (!userId || !subtopic || !fromDate || !content) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const volunteering = new Volunteering({
      userId,
      subtopic,
      fromDate,
      toDate,
      content,
    });

    await volunteering.save();

    res.status(201).json({ message: "Saved successfully", volunteering });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Update volunteering
router.put("/:id", async (req, res) => {
  try {
    const { subtopic, fromDate, toDate, content } = req.body;
    const updated = await Volunteering.findByIdAndUpdate(
      req.params.id,
      { subtopic, fromDate, toDate, content },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Not found" });
    }

    res.json({ message: "Updated successfully", updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Get latest volunteering for a user
// Get latest volunteering (overall)
router.get("/latest", async (req, res) => {
  try {
    const latest = await Volunteering.find()
      .sort({ createdAt: -1 })
      .limit(1);

    res.json({ success: true, data: latest[0] || null });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
});



module.exports = router;


{/*const express = require("express");
const Volunteering = require("../models/Volunteering");

const router = express.Router();


router.post("/save", async (req, res) => {
  try {
    const { userId, subtopic, fromDate, toDate, content } = req.body;

    if (!userId || !subtopic || !fromDate || !content) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const volunteering = new Volunteering({
      userId,
      subtopic,
      fromDate,
      toDate,
      content,
    });
    await volunteering.save();

    res.status(201).json({ message: "Saved successfully", volunteering });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});


// Get volunteering entries by userId
router.get("/:userId", async (req, res) => {
  try {
    const volunteering = await Volunteering.find({ userId: req.params.userId });
    res.json(volunteering);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});*/}

// Save volunteering entry
{/*router.post("/save", async (req, res) => {
  try {
    const { userId, content } = req.body;

    if (!userId || !content) {
      return res.status(400).json({ message: "userId and content required" });
    }

    const volunteering = new Volunteering({ userId, content });
    await volunteering.save();

    res.status(201).json({ message: "Saved successfully", volunteering });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});*/}

// Update volunteering entry
{/*router.put("/:id", async (req, res) => {
  try {
    const updated = await Volunteering.findByIdAndUpdate(
      req.params.id,
      { content: req.body.content },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Not found" });
    }

    res.json({ message: "Updated successfully", updated });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});*/}
{/*router.put("/:id", async (req, res) => {
  try {
    const { subtopic, fromDate, toDate, content } = req.body;
    const updated = await Volunteering.findByIdAndUpdate(
      req.params.id,
      { subtopic, fromDate, toDate, content },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Not found" });
    }

    res.json({ message: "Updated successfully", updated });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});


// Delete volunteering entry
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Volunteering.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Not found" });
    }

    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;*/}
