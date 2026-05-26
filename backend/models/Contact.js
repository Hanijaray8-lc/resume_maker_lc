const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  firstName: String,
  lastName: String,
  city: String,
  country: String,
  pinCode: String,
  phone: String,
  email: String,
  linkedIn: String,
  website: String,
  drivingLicence: String,
  photo: String, // optional: store filename or base64
});

module.exports = mongoose.model("Contact", contactSchema);
