const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  firstName: String,
  lastName: String,
  currentPosition: String,
  city: String,
  country: { type: String, default: "India" },
  pinCode: String,
  phone: String,
  linkedIn: String,
  website: String,
  drivingLicence: String,
  photo: String,
});

module.exports = mongoose.model("User", userSchema);
