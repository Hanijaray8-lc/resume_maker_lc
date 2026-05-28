const mongoose = require("mongoose");

const AdditionalInfoSchema = new mongoose.Schema(
  {
    userId: { type: String,  },  // link to user
    details: { type: String }, // rich text details (no maxlength)
  },
  { timestamps: true }
);

module.exports = mongoose.model("AdditionalInfo", AdditionalInfoSchema);
