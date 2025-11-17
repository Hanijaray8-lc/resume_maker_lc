const mongoose = require("mongoose");

const WorkExperienceSchema = new mongoose.Schema(
  {
    jobTitle: { type: String, required: true },
    employer: { type: String, required: true },
    CompanyName:{type:String,required:true},
    location: { type: String },
    remote: { type: Boolean, default: false },
    startMonth: { type: String, required: true },
    startYear: { type: String, required: true },
    endMonth: { type: String },
    endYear: { type: String },
    current: { type: Boolean, default: false },
    
  },
  { timestamps: true }
);

module.exports = mongoose.model("WorkExperience", WorkExperienceSchema);
