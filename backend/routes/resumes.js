// routes/resumes.js
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const ResumeHistory = require('../models/ResumeHistory'); // use central model

// Auth middleware: decodes JWT and also preserves raw token (for older records)
const auth = (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    // try to decode token to get user id
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.userId = decoded.id;
    } catch (e) {
      // token couldn't be decoded (but we still keep raw token) — continue so we can match older saved records
      req.userId = null;
    }

    req.rawToken = token; // used to match old documents that stored token as userId
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// Save download history
router.post('/save-download', auth, async (req, res) => {
  try {
    // prefer decoded userId; fallback to raw token (to maintain compatibility with older records)
    const userIdentifier = req.userId || req.rawToken;
    if (!userIdentifier) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const resumeHistory = new ResumeHistory({
      userId: mongoose.Types.ObjectId.isValid(userIdentifier) ? new mongoose.Types.ObjectId(userIdentifier) : userIdentifier,
      templateId: req.body.templateId,
      fileName: req.body.fileName,
      fileFormat: req.body.fileFormat,
      fileSize: req.body.fileSize,
      themeColor: req.body.themeColor,
    });

    await resumeHistory.save();
    res.json({ message: 'Download history saved', id: resumeHistory._id });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get resume history
router.get('/history', auth, async (req, res) => {
  try {
    const userId = req.userId;
    const rawToken = req.rawToken;

    console.log('[DEBUG] /api/resumes/history userId=', userId, ' rawToken=', rawToken);

    const query = { $or: [] };
    if (userId && mongoose.Types.ObjectId.isValid(userId)) query.$or.push({ userId: new mongoose.Types.ObjectId(userId) });
    if (rawToken) query.$or.push({ userId: rawToken });

    console.log('[DEBUG] /api/resumes/history query=', JSON.stringify(query));

    if (!query.$or.length) {
      return res.status(200).json([]);
    }

    const resumeHistory = await ResumeHistory.find(query).sort({ downloadedAt: -1 });
    res.status(200).json(resumeHistory);
  } catch (error) {
    console.error("Error fetching resume history:", error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete resume (only if it belongs to this user or raw token)
router.delete('/:id', auth, async (req, res) => {
  try {
    const doc = await ResumeHistory.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: 'Resume not found' });

    const ownerIdStr = doc.userId ? doc.userId.toString() : null;
    const reqUserId = req.userId ? req.userId.toString() : null;

    const allowed =
      (reqUserId && ownerIdStr === reqUserId) ||
      (req.rawToken && ownerIdStr === req.rawToken) ||
      (ownerIdStr === req.rawToken);

    if (!allowed) {
      return res.status(403).json({ message: 'Not authorized to delete this resume' });
    }

    await ResumeHistory.findByIdAndDelete(req.params.id);
    res.json({ message: 'Resume deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;