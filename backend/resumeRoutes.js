// resumeRoutes.js (backend folder root-ல் இருக்கணும்)

require("dotenv").config();
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const pdfParseModule = require("pdf-parse");
const mammoth = require("mammoth");
const path = require("path");
const Groq = require("groq-sdk");

// ==========================
// 🤖 GROQ CLIENT
// ==========================
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// ==========================
// 🔐 AUTH MIDDLEWARE
// ==========================
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.startsWith("Bearer ")
    ? req.headers.authorization.split(" ")[1]
    : null;
  if (!token) return res.status(401).json({ success: false, error: "Unauthorized" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch {
    res.status(401).json({ success: false, error: "Invalid token" });
  }
};

// ==========================
// 📄 RESUME ANALYSIS SCHEMA
// ==========================
const resumeAnalysisSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  fileName: String,
  extractedText: String,
  atsScore: Number,
  missingSkills: [String],
  skillsFound: [String],
  education: [String],
  experience: [String],
  grammarCorrections: [String],
  suggestions: [String],
  strengths: [String],
  weaknesses: [String],
  matchingRoles: [{ role: String, matchPercentage: Number }],
  createdAt: { type: Date, default: Date.now }
});
const ResumeAnalysis = mongoose.model("ResumeAnalysis", resumeAnalysisSchema);

// ==========================
// 📁 MULTER CONFIG
// ==========================
const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ];
    const allowedExtensions = [".pdf", ".docx"];
    const ext = path.extname(file.originalname || "").toLowerCase();
    if (allowedMimeTypes.includes(file.mimetype) || allowedExtensions.includes(ext))
      cb(null, true);
    else cb(new Error("Only PDF and DOCX files are allowed"));
  },
  limits: { fileSize: 5 * 1024 * 1024 }
});

// ==========================
// 📝 TEXT EXTRACTION HELPERS
// ==========================
const extractPDF = async (buffer) => {
  try {
    if (typeof pdfParseModule === "function") {
      const data = await pdfParseModule(buffer);
      return data?.text || "";
    }
    if (typeof pdfParseModule?.default === "function") {
      const data = await pdfParseModule.default(buffer);
      return data?.text || "";
    }
    if (typeof pdfParseModule?.PDFParse === "function") {
      const parser = new pdfParseModule.PDFParse({ data: buffer });
      try {
        const data = await parser.getText();
        return data?.text || "";
      } finally {
        await parser.destroy();
      }
    }
    throw new Error("No compatible PDF parser was found.");
  } catch (error) {
    throw new Error(`PDF text extraction failed: ${error.message}`);
  }
};

const extractDOCX = async (buffer) => {
  const result = await mammoth.extractRawText({ buffer });
  return result.value;
};

const extractText = async (buffer, mimeType, fileName = "") => {
  const ext = path.extname(fileName).toLowerCase();
  if (mimeType === "application/pdf" || ext === ".pdf") return extractPDF(buffer);
  if (
    mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    ext === ".docx"
  )
    return extractDOCX(buffer);
  throw new Error("Unsupported file type");
};

const normalizeResumeText = (text) =>
  text.replace(/\r/g, "\n").replace(/[ \t]+/g, " ").replace(/\n{3,}/g, "\n\n").trim();

// ==========================
// 🔁 FALLBACK: Rule-based analysis
// ==========================
const analyzeResumeFallback = (text) => {
  const t = text.toLowerCase();
  const allSkills = [
    "javascript","typescript","python","java","c++","c#","react","angular","vue",
    "node.js","express","mongodb","mysql","postgresql","sql","aws","azure","docker",
    "kubernetes","git","github","html","css","tailwind","bootstrap","php","django",
    "flask","spring","rest api","graphql","machine learning","deep learning","ai",
    "tensorflow","pytorch","pandas","numpy","power bi","excel","figma","ui/ux",
    "linux","firebase","android","data analysis"
  ];
  const found = allSkills.filter(s => t.includes(s));
  const missing = allSkills.filter(s => !t.includes(s)).slice(0, 8);
  const hasEducation = /(b\.?tech|bachelor|master|degree|university|college|cgpa|gpa)/i.test(text);
  const hasExperience = /(experience|intern|developer|engineer|worked|built|managed|led)/i.test(text);
  const hasMetrics = /(\d+%|\d+\+|\d+\s*(users|clients|projects|months|years))/i.test(text);
  const hasContact = /(\S+@\S+\.\S+|\+?\d[\d\s-]{8,})/.test(text);

  let atsScore = 35;
  atsScore += Math.min(found.length * 4, 28);
  if (text.length > 800) atsScore += 10;
  if (hasEducation) atsScore += 8;
  if (hasExperience) atsScore += 8;
  if (hasMetrics) atsScore += 7;
  if (hasContact) atsScore += 5;
  atsScore = Math.min(atsScore, 100);

  return {
    atsScore,
    skillsFound: found,
    missingSkills: missing,
    education: [],
    experience: [],
    grammarCorrections: ["No obvious spelling errors."],
    suggestions: ["Add measurable achievements.", "Include LinkedIn profile.", "Add contact details."],
    strengths: ["Resume structure is present."],
    weaknesses: ["Could be more detailed."],
    matchingRoles: [{ role: "Software Developer", matchPercentage: 60 }]
  };
};

// ==========================
// 🚀 API ROUTES
// ==========================

// 1️⃣ POST /api/resume/analyze
router.post("/resume/analyze", authMiddleware, (req, res) => {
  upload.single("resume")(req, res, async (uploadErr) => {
    try {
      if (uploadErr) {
        const status = uploadErr.code === "LIMIT_FILE_SIZE" ? 413 : 400;
        return res.status(status).json({ success: false, error: uploadErr.message });
      }
      if (!req.file) return res.status(400).json({ success: false, error: "No file uploaded" });

      const rawText = await extractText(req.file.buffer, req.file.mimetype, req.file.originalname);
      const cleaned = normalizeResumeText(rawText);

      if (!cleaned)
        return res.status(400).json({
          success: false,
          error: "Could not extract text. Please upload a text-based PDF or DOCX file."
        });

      // 🤖 GROQ AI Analysis
      const prompt = `You are an expert ATS resume analyzer. Analyze the resume below and return ONLY a valid JSON object. No markdown, no explanation, no code blocks.

RESUME:
"""
${cleaned.substring(0, 4000)}
"""

Return this exact JSON structure:
{
  "atsScore": <number 0-100>,
  "skillsFound": [<technical skills actually in the resume>],
  "missingSkills": [<6-8 important skills NOT found but relevant to this candidate's field>],
  "education": [<education lines as strings>],
  "experience": [<experience/project lines as strings>],
  "grammarCorrections": [<spelling or grammar issues found, or ["No obvious spelling errors."]>],
  "suggestions": [<5-7 specific actionable suggestions for THIS resume>],
  "strengths": [<4-5 specific strengths of THIS resume>],
  "weaknesses": [<4-5 specific weaknesses of THIS resume>],
  "matchingRoles": [
    {"role": "<title>", "matchPercentage": <0-100>},
    {"role": "<title>", "matchPercentage": <0-100>},
    {"role": "<title>", "matchPercentage": <0-100>}
  ]
}`;

      let analysis;
      try {
        const chatCompletion = await groq.chat.completions.create({
          model: "llama-3.1-8b-instant",
          messages: [
            {
              role: "system",
              content: "You are an expert ATS resume analyzer. Return only valid JSON, nothing else."
            },
            { role: "user", content: prompt }
          ],
          temperature: 0.3,
          max_tokens: 2000
        });

        let responseText = chatCompletion.choices[0].message.content.trim();
        responseText = responseText
          .replace(/^```json\s*/i, "")
          .replace(/^```\s*/i, "")
          .replace(/\s*```$/i, "")
          .trim();

        const jsonStart = responseText.indexOf("{");
        const jsonEnd = responseText.lastIndexOf("}");
        if (jsonStart !== -1 && jsonEnd !== -1) {
          responseText = responseText.substring(jsonStart, jsonEnd + 1);
        }

        analysis = JSON.parse(responseText);
      } catch (aiErr) {
        console.error("Groq AI error, using fallback:", aiErr.message);
        analysis = analyzeResumeFallback(cleaned);
      }

      const analysisWithText = {
        ...analysis,
        fileName: req.file.originalname,
        extractedText: cleaned.substring(0, 5000)
      };

      const saved = new ResumeAnalysis({
        user: req.userId,
        fileName: req.file.originalname,
        extractedText: analysisWithText.extractedText,
        atsScore: analysis.atsScore,
        missingSkills: analysis.missingSkills || [],
        skillsFound: analysis.skillsFound || [],
        education: analysis.education || [],
        experience: analysis.experience || [],
        grammarCorrections: analysis.grammarCorrections || [],
        suggestions: analysis.suggestions || [],
        strengths: analysis.strengths || [],
        weaknesses: analysis.weaknesses || [],
        matchingRoles: analysis.matchingRoles || []
      });
      await saved.save();

      res.json({ success: true, analysis: analysisWithText, analysisId: saved._id });
    } catch (err) {
      console.error("Resume analyze error:", err);
      res.status(500).json({ success: false, error: err.message || "Resume analysis failed" });
    }
  });
});

// 2️⃣ GET /api/resume/history
router.get("/resume/history", authMiddleware, async (req, res) => {
  try {
    const history = await ResumeAnalysis.find({ user: req.userId }).sort("-createdAt");
    res.json(history);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3️⃣ POST /api/resume/improve
router.post("/resume/improve", authMiddleware, async (req, res) => {
  try {
    const { originalText, suggestions } = req.body;
    if (!originalText) return res.status(400).json({ error: "Missing text" });

    const prompt = `You are an expert resume writer. Improve the following resume.

ORIGINAL RESUME:
"""
${originalText.substring(0, 3000)}
"""

SUGGESTIONS TO APPLY:
${suggestions?.length ? suggestions.map((s, i) => `${i + 1}. ${s}`).join("\n") : "General improvement"}

Rewrite and improve:
- Add measurable achievements with numbers/percentages
- Use strong action verbs (Led, Built, Developed, Increased, etc.)
- Include relevant technical keywords for ATS
- Make it professional and impactful
- Keep the same person's information

Return ONLY the improved resume text. No explanations, no markdown.`;

    const chatCompletion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content: "You are an expert resume writer. Return only the improved resume text, nothing else."
        },
        { role: "user", content: prompt }
      ],
      temperature: 0.5,
      max_tokens: 2000
    });

    res.json({ improvedText: chatCompletion.choices[0].message.content.trim() });
  } catch (err) {
    console.error("Resume improve error:", err);
    res.status(500).json({ error: err.message || "Resume improvement failed" });
  }
});

module.exports = router;