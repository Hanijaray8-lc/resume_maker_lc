const express = require("express");
const OpenAI = require("openai");
const router = express.Router();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Make sure this is set in .env
});

router.post("/", async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ error: "Text is required" });
    }

    // 🧩 Ask OpenAI for only spelling corrections (JSON format)
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0,
      messages: [
        {
          role: "system",
          content:
            'You are a spelling correction assistant. Return ONLY JSON like this: [{"word":"recieve","suggestion":"receive"}]. Do not rewrite the full text, only list misspelled words and their corrections.',
        },
        {
          role: "user",
          content: `Find all misspelled words in this text and their correct spellings: ${text}`,
        },
      ],
    });

    const aiResponse = response.choices[0].message.content.trim();

    let corrections = [];
    try {
      corrections = JSON.parse(aiResponse);
    } catch (err) {
      console.error("Failed to parse AI response:", aiResponse);
      return res.json({ corrections: [] });
    }

    res.json({ corrections });
  } catch (error) {
    console.error("Spellcheck error:", error);
    res.status(500).json({ error: "Spell check failed" });
  }
});

module.exports = router;
