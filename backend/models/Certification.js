const mongoose = require("mongoose");

const singleCertificationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  provider: { type: String, required: true },
  year: { type: String, required: true },
});

const certificationSchema = new mongoose.Schema({
  certifications: [singleCertificationSchema],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("CertificationGroup", certificationSchema);
{/*const mongoose = require("mongoose");

const singleCertificationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  provider: { type: String, required: true },
  year: { type: String, required: true },
});

const certificationSchema = new mongoose.Schema({
  certifications: [singleCertificationSchema], // 🔹 Array of certifications
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("CertificationGroup", certificationSchema);*/}
{/*const mongoose = require("mongoose");

const certificationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  provider: {
    type: String,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Certification", certificationSchema);*/}
