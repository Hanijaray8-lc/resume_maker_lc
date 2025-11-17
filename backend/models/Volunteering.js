const mongoose = require("mongoose");

const volunteeringSchema = new mongoose.Schema(
  {
   // In volunteering schema
userId: {
  type: String, // temporarily
  required: false,
}
,
    subtopic: {
      type: String,
      required: true,
      trim: true,
    },
    fromDate: {
      type: Date,
      required: true,
    },
    toDate: {
      type: Date,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Volunteering", volunteeringSchema);


{/*const mongoose = require("mongoose");

const volunteeringSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // or whichever user model you have
      required: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Volunteering", volunteeringSchema);*/}
