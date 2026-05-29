const express = require("express");
const fetch = require('node-fetch');

const router = express.Router();

router.post("/", async (req, res) => {
  // ✅ CHANGE DEFAULT COUNT FROM 3 TO 5
  const { jobTitle, count = 5 } = req.body;  // Default 5 summaries
  const summaryCount = Math.min(Math.max(parseInt(count) || 5, 1), 10);  // Allow 1-10, default 5

  if (!jobTitle || !jobTitle.trim()) {
    return res.status(400).json({ message: "Job title is required" });
  }

  console.log(`🎯 Generating ${summaryCount} summaries for:`, jobTitle);
  console.log('Using Groq API (free)');

  try {
    const prompt = `You are a professional resume writer.

Generate exactly ${summaryCount} distinct professional resume summary paragraphs for a "${jobTitle}".

STRICT RULES:
1. Each summary MUST contain exactly 4 to 5 complete sentences.
2. No "...", no trailing dots, no cutting short.
3. Each summary must be between 80 and 120 words.
4. Cover: years of experience, key skills, achievements, career objective.
5. Make all summaries different in tone and style.
6. Separate each summary with: |||
7. Return ONLY the summaries separated by ||| — no extra text.`;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [
          {
            role: "system",
            content: "You are an expert resume writer. Always write complete, full paragraphs. Never use '...'.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 450 * summaryCount,  // Increased for more summaries
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Groq API Error:', response.status, errorText);
      throw new Error(`Groq API error: ${response.status}`);
    }

    const data = await response.json();
    const text = data.choices[0].message.content.trim();

    let summaries = text
      .split("|||")
      .map(s => s.trim())
      .filter(s => s.length > 60);

    if (summaries.length === 0) {
      throw new Error("No valid summaries");
    }

    console.log(`✅ Generated ${summaries.length} summaries using Groq AI`);
    
    res.json({ 
      summaries: summaries.slice(0, summaryCount),
      source: 'groq',
      model: 'llama-3.1-8b-instant'
    });

  } catch (err) {
    console.error("Error:", err.message);
    
    // Dynamic fallback based on requested count (5-6 summaries)
    const fallbackSummaries = [];
    for (let i = 0; i < summaryCount; i++) {
      fallbackSummaries.push(getFallbackSummary(jobTitle, i + 1));
    }
    
    res.json({ 
      summaries: fallbackSummaries,
      source: 'fallback',
      message: 'Using fallback summaries'
    });
  }
});

function getFallbackSummary(jobTitle, variant) {
  const summaries = [
    `Experienced ${jobTitle} with over 5 years of hands-on expertise in designing and delivering high-quality solutions. Skilled in collaborating with cross-functional teams to meet project deadlines and exceed client expectations. Demonstrated ability to analyze complex problems and implement effective, scalable strategies. Passionate about continuous learning and staying updated with the latest industry trends and best practices.`,
    
    `Results-driven ${jobTitle} with a strong foundation in both technical execution and strategic planning. Proven track record of successfully leading projects from inception to completion while maintaining the highest standards of quality. Adept at leveraging modern tools and methodologies to optimize workflows and improve overall team productivity. Committed to delivering measurable impact and contributing to organizational growth.`,
    
    `Detail-oriented ${jobTitle} with comprehensive expertise in end-to-end project management and stakeholder communication. Recognized for consistently delivering projects on time and within budget through strong organizational and problem-solving skills. Experienced in mentoring junior team members and fostering a collaborative and inclusive work environment. Eager to bring a proactive mindset and a passion for excellence to a dynamic and forward-thinking organization.`,
    
    `Innovative ${jobTitle} with expertise in leveraging cutting-edge technologies to solve complex business challenges. Successfully implemented solutions that increased operational efficiency by 40% and reduced costs by 25%. Strong analytical and creative problem-solving abilities with a focus on delivering measurable results. Committed to professional growth and contributing to organizational success through continuous improvement.`,
    
    `Strategic ${jobTitle} with proven ability to align technical solutions with business objectives. Demonstrated success in leading cross-functional initiatives and driving digital transformation. Excellent communication skills with experience presenting to stakeholders at all levels. Dedicated to fostering innovation and maintaining high standards of quality in all deliverables.`,
    
    `Versatile ${jobTitle} with experience across multiple industries and technologies. Adaptable to changing requirements and able to quickly master new tools and methodologies. Strong track record of meeting deadlines and exceeding performance targets. Seeking to leverage diverse experience in a challenging role that values initiative and problem-solving.`,
    
    `Motivated ${jobTitle} with exceptional organizational and leadership abilities. Recognized for improving team productivity by 30% through effective mentoring and process optimization. Skilled in managing multiple priorities while maintaining attention to detail. Eager to contribute to a dynamic team and drive continuous improvement initiatives.`,
    
    `Analytical ${jobTitle} with strong background in data-driven decision making and performance optimization. Successfully implemented metrics and KPIs that improved business outcomes by 35%. Proficient in using various tools and methodologies to analyze complex problems and develop effective solutions. Committed to delivering value and driving innovation in fast-paced environments.`,
    
    `Customer-focused ${jobTitle} with excellent interpersonal and communication skills. Proven ability to build strong relationships with clients and stakeholders, resulting in 95% satisfaction ratings. Skilled in identifying needs and developing tailored solutions that exceed expectations. Dedicated to providing exceptional service and creating positive experiences.`,
    
    `Goal-oriented ${jobTitle} with track record of achieving ambitious targets and driving business growth. Successfully led initiatives that increased revenue by 25% and market share by 15%. Strong leadership and collaboration skills with ability to motivate teams toward common objectives. Seeking to apply strategic thinking and execution skills to drive organizational success.`
  ];
  
  return summaries[(variant - 1) % summaries.length];
}

module.exports = router;