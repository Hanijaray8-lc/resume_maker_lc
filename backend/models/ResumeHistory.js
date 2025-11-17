// models/ResumeHistory.js
const mongoose = require('mongoose');

const ResumeHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.Mixed, // accept ObjectId or raw token string
    required: true
  },
  templateId: {
    type: Number,
    required: true
  },
  fileName: {
    type: String,
    required: true
  },
  fileFormat: {
    type: String,
    required: true,
    enum: ['pdf', 'png', 'txt']
  },
  fileSize: {
    type: Number,
    required: true
  },
  themeColor: {
    type: String
  },
  downloadedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('ResumeHistory', ResumeHistorySchema);