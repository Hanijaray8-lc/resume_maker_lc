const express = require("express");
const OpenAI = require("openai");

const router = express.Router();

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// POST /api/generate
router.post("/", async (req, res) => {
  const { jobTitle } = req.body;

  if (!jobTitle || !jobTitle.trim()) {
    return res.status(400).json({ message: "Job title is required" });
  }

  try {
    const prompt = `You are a professional resume writer.

Generate exactly 3 distinct professional resume summary paragraphs for a "${jobTitle}".

STRICT RULES — follow every rule exactly:
1. Each summary MUST contain exactly 4 to 5 complete sentences.
2. Each sentence must be FULLY written — absolutely NO "...", NO trailing dots, NO cutting short.
3. Each summary must be between 80 and 120 words.
4. Cover these points across the sentences: years of experience, key technical skills, notable achievements, and career objective.
5. Use strong action verbs and industry keywords relevant to ${jobTitle}.
6. Make all 3 summaries different in tone and focus (e.g. one leadership-focused, one technical-focused, one achievement-focused).
7. Do NOT number the summaries.
8. Separate each summary with the delimiter: |||
9. Return ONLY the 3 summaries separated by ||| — no extra text, no headings, no markdown.

Example format:
[Full 4-5 sentence paragraph 1]|||[Full 4-5 sentence paragraph 2]|||[Full 4-5 sentence paragraph 3]`;

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are an expert resume writer. Always write complete, full paragraphs. Never truncate. Never use '...'. Always write exactly 4-5 sentences per summary.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 1200,
      temperature: 0.7,
    });

    const text = response.choices[0].message.content.trim();

    // Split by delimiter
    let summaries = text
      .split("|||")
      .map((s) => s.trim())
      .map((s) => s.replace(/^\d+[\.\)]\s*/, "")) // remove "1. " or "1) " if AI adds it
      .map((s) => s.replace(/\.{2,}$/, "").trim()) // remove trailing "..." or ".."
      .filter((s) => s.length > 60); // must be a real paragraph, not empty/short

    // Validate — must have at least 1 good summary
    if (summaries.length === 0) {
      throw new Error("AI returned invalid summaries");
    }

    // Return max 3
    res.json({ summaries: summaries.slice(0, 3) });

  } catch (err) {
    console.error("Generate error:", err.message);

    // Fallback — NO "..." — full sentences
    res.json({
      summaries: [
        `Experienced ${jobTitle} with over 5 years of hands-on expertise in designing and delivering high-quality solutions. Skilled in collaborating with cross-functional teams to meet project deadlines and exceed client expectations. Demonstrated ability to analyze complex problems and implement effective, scalable strategies. Passionate about continuous learning and staying updated with the latest industry trends and best practices.`,
        `Results-driven ${jobTitle} with a strong foundation in both technical execution and strategic planning. Proven track record of successfully leading projects from inception to completion while maintaining the highest standards of quality. Adept at leveraging modern tools and methodologies to optimize workflows and improve overall team productivity. Committed to delivering measurable impact and contributing to organizational growth.`,
        `Detail-oriented ${jobTitle} with comprehensive expertise in end-to-end project management and stakeholder communication. Recognized for consistently delivering projects on time and within budget through strong organizational and problem-solving skills. Experienced in mentoring junior team members and fostering a collaborative and inclusive work environment. Eager to bring a proactive mindset and a passion for excellence to a dynamic and forward-thinking organization.`,
      ],
    });
  }
});

module.exports = router;