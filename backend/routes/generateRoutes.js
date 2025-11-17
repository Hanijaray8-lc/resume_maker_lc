const express = require("express");
const OpenAI = require("openai");

const router = express.Router();

// Initialize OpenAI
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// POST /api/generate
router.post("/", async (req, res) => {
  const { jobTitle } = req.body;

  try {
    const prompt = `Generate exactly 3 distinct professional resume summary examples for a ${jobTitle}.
    Each summary should be 2-3 sentences, concise, ATS-friendly, and highlight different aspects of the role.
    Format the response with each summary separated by "|||" and make each one unique.`;

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    const text = response.choices[0].message.content;

    let summaries = text.split("|||").map(s => s.trim()).filter(s => s.length > 0);

    if (summaries.length < 3) {
      summaries = [
        `Experienced ${jobTitle} with proven track record...`,
        `Professional ${jobTitle} with comprehensive expertise...`,
        `Qualified ${jobTitle} with strong background...`
      ];
    }

    res.json({ summaries: summaries.slice(0, 3) });
  } catch (err) {
    console.error(err);
    res.json({
      summaries: [
        `Experienced ${jobTitle} with proven track record...`,
        `Professional ${jobTitle} with comprehensive expertise...`,
        `Qualified ${jobTitle} with strong background...`
      ]
    });
  }
});

module.exports = router;   // ✅ Correct export
