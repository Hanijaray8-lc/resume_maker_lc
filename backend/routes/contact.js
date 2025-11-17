const express = require("express");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");

const router = express.Router();

// ⚡ Setup storage for images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // folder to store images
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // unique filename
  },
});

const upload = multer({ storage });

// ✅ Save or update contact details with image upload
router.post("/save", upload.single("photo"), async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }

    const userId = decoded.id;

    const contactData = {
      firstName: req.body.firstName || "",
      lastName: req.body.lastName || "",
      city: req.body.city || "",
      country: req.body.country || "India",
      pinCode: req.body.pinCode || "",
      phone: req.body.phone || "",
      email: req.body.email || "",
       currentPosition: req.body.currentPosition || "",
      linkedIn: req.body.linkedIn || "",
      website: req.body.website || "",
      drivingLicence: req.body.drivingLicence || "",
    };

    // If photo uploaded → save filename
    if (req.file) {
      contactData.photo = `/uploads/${req.file.filename}`;
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: contactData },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "Contact saved successfully", user: updatedUser });
  } catch (err) {
    console.error("Error in /save:", err.message);
    res.status(500).json({ message: "Error saving contact" });
  }
});

// ✅ Fetch contact details
router.get("/me", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    console.error("Error in /me:", err.message);
    res.status(500).json({ message: "Error fetching contact" });
  }
});

module.exports = router;
