const mongoose = require('mongoose');

const SpellCorrectionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.Mixed, // ObjectId or raw token
    required: true,
  },
  resumeId: {
    type: String,
  },
  word: {
    type: String,
    required: true,
  },
  suggestion: {
    type: String,
    required: true,
  },
  context: {
    type: String,
  },
  appliedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('SpellCorrection', SpellCorrectionSchema);
