const mongoose = require("mongoose");

const PersonalDetailsSchema = new mongoose.Schema({
  dob: { type: String, required: false },
  nationality: { type: String, required: false },
  maritalStatus: { type: String, required: false },
  visaStatus: { type: String, required: false },
  gender: { type: String, required: false },
  religion: { type: String, required: false },
  passport: { type: String, required: false },
  other: { type: String, required: false },
});

module.exports = mongoose.model("PersonalDetails", PersonalDetailsSchema);
