const mongoose = require("mongoose");

const EducationSchema = new mongoose.Schema({
  schoolName: { type: String, required: true },
  schoolLocation: { type: String },
  degree: { type: String, required: true },
  fieldOfStudy: { type: String },
  gradMonth: { type: String },
  gradYear: { type: Number },
  additionalCoursework: { type: String },
}, { timestamps: true });

module.exports = mongoose.model("Education", EducationSchema);
