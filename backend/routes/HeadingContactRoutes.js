const express = require("express");
const Contact = require("../models/Contact");
const router = express.Router();

// Save or Update Contact
router.post("/", async (req, res) => {
  try {
    const { userId, ...rest } = req.body;

    if (!userId) return res.status(400).json({ message: "User ID required" });

    let contact = await Contact.findOne({ userId });

    if (contact) {
      // Update existing
      contact.set(rest);
      await contact.save();
      return res.json({ message: "Contact updated", contact });
    } else {
      // Create new
      const newContact = new Contact({ userId, ...rest });
      await newContact.save();
      return res.json({ message: "Contact saved", contact: newContact });
    }
  } catch (err) {
    console.error("Contact error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Fetch Contact by userId
router.get("/:userId", async (req, res) => {
  try {
    const contact = await Contact.findOne({ userId: req.params.userId });
    res.json(contact || {});
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
