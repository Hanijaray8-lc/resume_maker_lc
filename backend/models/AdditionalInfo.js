const mongoose = require("mongoose");

const AdditionalInfoSchema = new mongoose.Schema(
  {
    userId: { type: String,  },  // link to user
    details: { type: String, maxlength: 120 }, // rich text details (limit 90 chars)
  },
  { timestamps: true }
);

module.exports = mongoose.model("AdditionalInfo", AdditionalInfoSchema);
