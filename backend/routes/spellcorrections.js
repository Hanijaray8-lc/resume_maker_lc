const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const SpellCorrection = require('../models/SpellCorrection');

// Auth helper (compatible with existing resumes route behavior)
const authOptional = (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '') || null;
    if (!token) {
      req.userId = null;
      req.rawToken = null;
      return next();
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.userId = decoded.id;
    } catch (e) {
      req.userId = null;
    }

    req.rawToken = token;
    next();
  } catch (err) {
    req.userId = null;
    req.rawToken = null;
    next();
  }
};

// Save one or multiple corrections
router.post('/', authOptional, async (req, res) => {
  try {
    const { resumeId = null, corrections } = req.body;

    if (!corrections || !Array.isArray(corrections) || corrections.length === 0) {
      return res.status(400).json({ message: 'Corrections array required' });
    }

    const userIdentifier = req.userId || req.rawToken || req.body.userId;
    if (!userIdentifier) {
      return res.status(401).json({ message: 'Unauthorized: missing user token or userId' });
    }

    const docs = corrections.map((c) => ({
      userId: mongoose.Types.ObjectId.isValid(userIdentifier)
        ? new mongoose.Types.ObjectId(userIdentifier)
        : userIdentifier,
      resumeId,
      word: c.word,
      suggestion: c.suggestion || c.newWord || c.correction,
      context: c.context || '',
    }));

    const created = await SpellCorrection.insertMany(docs);
    res.json({ message: 'Corrections saved', count: created.length });
  } catch (error) {
    console.error('Failed to save corrections', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get corrections for current user (optional filter by resumeId)
router.get('/', authOptional, async (req, res) => {
  try {
    const resumeId = req.query.resumeId || null;
    const userIdentifier = req.userId || req.rawToken;
    if (!userIdentifier) return res.status(401).json({ message: 'Unauthorized' });

    const query = {
      userId: mongoose.Types.ObjectId.isValid(userIdentifier)
        ? new mongoose.Types.ObjectId(userIdentifier)
        : userIdentifier,
    };
    if (resumeId) query.resumeId = resumeId;

    const results = await SpellCorrection.find(query).sort({ appliedAt: 1 });
    res.json({ corrections: results });
  } catch (error) {
    console.error('Failed to fetch corrections', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
