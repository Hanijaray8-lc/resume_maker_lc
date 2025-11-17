const mongoose = require("mongoose");

const ContactSchema = new mongoose.Schema(
  {
      userId: { 
      type: String,   // 👈 changed from ObjectId to String
      required: true,
    },// reference to User model (safer than plain string)

    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, trim: true },

    city: { type: String, trim: true },
    country: { type: String, trim: true },
    pinCode: { type: String, match: /^[0-9]{5,10}$/ }, // only numbers, 5–10 digits

    phone: { 
      type: String, 
      match: /^[0-9]{7,15}$/, // validates numeric phone numbers
      required: true 
    },

    email: { 
      type: String, 
      required: true, 
      lowercase: true, 
      trim: true, 
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"] 
    },

    linkedIn: { type: String, trim: true },
    website: { type: String, trim: true },

    drivingLicence: { type: String, },
  },
  { timestamps: true } // adds createdAt & updatedAt
);

module.exports = mongoose.model("Contact", ContactSchema);
{/*const mongoose = require("mongoose");

const ContactSchema = new mongoose.Schema({
  userId: { type: String, required: true },  // important
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
});

module.exports = mongoose.model("Contact", ContactSchema);*/}
{/*const mongoose = require("mongoose");

const ContactSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    city: { type: String },
    country: { type: String, default: "India" },
    pinCode: { type: String },
    phone: { type: String },
    email: { type: String, required: true },
    linkedIn: { type: String },
    website: { type: String },
    drivingLicence: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Contact", ContactSchema);*/}
