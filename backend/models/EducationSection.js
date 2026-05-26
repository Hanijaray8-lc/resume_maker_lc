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


// const mongoose = require("mongoose");

// const EducationSchema = new mongoose.Schema({
//   educationLevel: { 
//     type: String, 
//     enum: ["school", "college"], 
//     required: true 
//   },
//   schoolType: { 
//     type: String, 
//     enum: ["10th", "11th", "12th", ""] 
//   },
//   collegeType: { 
//     type: String, 
//     enum: ["ug", "pg", "diploma", "phd", ""] 
//   },
//   institutionName: { 
//     type: String, 
//     required: true 
//   },
//   institutionLocation: { 
//     type: String, 
//     required: true 
//   },
//   district: { 
//     type: String 
//   },
//   percentage: { 
//     type: String 
//   },
//   cgpa: { 
//     type: String 
//   },
//   grade: { 
//     type: String 
//   },
//   stream: { 
//     type: String, 
//     enum: ["science", "commerce", "arts", "vocational", ""] 
//   },
//   degreeType: { 
//     type: String, 
//     enum: ["arts", "science", "commerce", "engineering", "medical", "law", "management", "other", ""] 
//   },
//   degreeName: { 
//     type: String 
//   },
//   department: { 
//     type: String 
//   },
//   graduationMonth: { 
//     type: String 
//   },
//   graduationYear: { 
//     type: String 
//   },
//   additionalCoursework: { 
//     type: String 
//   },
// }, { 
//   timestamps: true 
// });

// module.exports = mongoose.model("Education", EducationSchema);