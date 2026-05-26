// server/routes/ai.js - Updated with current Groq models
const express = require('express');
const router = express.Router();

router.post('/skills', async (req, res) => {
  try {
    const { jobTitle } = req.body;

    if (!jobTitle || jobTitle.trim() === '') {
      return res.status(400).json({ error: 'Job title is required' });
    }

    console.log('Fetching AI skills for:', jobTitle);

    // Groq API Call with CURRENT models
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        // Use one of these CURRENT models:
        model: 'llama-3.1-8b-instant', // Fast and free
        // model: 'llama-3.1-70b-versatile', // More powerful
        // model: 'mixtral-8x7b-32768', // Alternative
        messages: [
          {
            role: 'user',
            content: `You are a career expert. List exactly 8 key skills for a "${jobTitle}" role.
                     Include both technical and soft skills. 
                     Return ONLY a comma-separated list without numbers, bullet points, or additional text.
                     Format: Skill1, Skill2, Skill3, Skill4, Skill5, Skill6, Skill7, Skill8
                     Example: JavaScript, React, Node.js, Communication, Problem Solving, Teamwork, Git, Agile Methodology`
          }
        ],
        temperature: 0.7,
        max_tokens: 200,
        stream: false
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Groq API response error:', response.status, errorText);
      throw new Error(`Groq API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('Groq API response received');

    const content = data.choices[0]?.message?.content || '';
    console.log('AI Response content:', content);

    // Extract skills from response
    const skills = extractSkillsFromAIResponse(content, jobTitle);
    
    res.json({ 
      skills: skills,
      source: 'groq-ai',
      model: data.model || 'llama-3.1-8b-instant'
    });

  } catch (error) {
    console.error('Groq API Error:', error.message);
    const skills = getIntelligentSkills(req.body.jobTitle || '');
    res.json({ 
      skills: skills,
      source: 'fallback',
      message: 'AI service unavailable, using enhanced database'
    });
  }
});

// Improved skill extraction
function extractSkillsFromAIResponse(content, jobTitle) {
  try {
    console.log('Raw AI response:', content);
    
    // Multiple extraction strategies
    let skills = [];

    // Strategy 1: Direct comma separation
    if (content.includes(',')) {
      skills = content.split(',')
        .map(skill => skill.trim())
        .filter(skill => isValidSkill(skill));
    }

    // Strategy 2: Extract from numbered list
    if (skills.length < 4) {
      skills = content.split('\n')
        .map(line => line.replace(/^[0-9]\.?\s*[-•]*\s*/i, '').trim())
        .filter(skill => isValidSkill(skill));
    }

    // Strategy 3: Extract from any text
    if (skills.length < 4) {
      // Split by common separators
      const separators = /[,\.\-\n•]/;
      skills = content.split(separators)
        .map(skill => skill.trim())
        .filter(skill => isValidSkill(skill));
    }

    // Final cleanup
    skills = skills
      .map(skill => skill.replace(/["']/g, ''))
      .filter(skill => skill && skill.length > 0)
      .slice(0, 8);

    console.log('Extracted skills:', skills);

    // If not enough valid skills, use fallback
    if (skills.length < 4) {
      console.log('Not enough skills from AI, using fallback');
      return getIntelligentSkills(jobTitle);
    }

    return skills;

  } catch (error) {
    console.error('Skill extraction error:', error);
    return getIntelligentSkills(jobTitle);
  }
}

// Helper function to validate skills
function isValidSkill(skill) {
  return skill && 
         skill.length > 2 && 
         skill.length < 50 &&
         !skill.match(/^(skills?|including|such as|for|role|position|example|format)/i) &&
         !skill.match(/^[0-9\.\-\*]/) &&
         !skill.match(/^and\s+/i) &&
         !skill.match(/^or\s+/i);
}

// Enhanced intelligent fallback (same as before)
function getIntelligentSkills(jobTitle) {
  const title = (jobTitle || '').toLowerCase();
  
  const skillDatabase = {
    software: ["JavaScript", "React", "Node.js", "Python", "Git", "SQL", "TypeScript", "REST APIs"],
    developer: ["Java", "Spring Boot", "AWS", "Docker", "Kubernetes", "CI/CD", "Microservices"],
    web: ["HTML5", "CSS3", "JavaScript", "React", "Vue.js", "Responsive Design", "Web Performance"],
    frontend: ["React", "Vue.js", "Angular", "TypeScript", "SASS", "Webpack", "UI/UX Principles"],
    backend: ["Node.js", "Python", "Java", "SQL", "MongoDB", "Redis", "API Design", "System Architecture"],
    data: ["Python", "SQL", "Pandas", "Data Analysis", "Statistics", "Machine Learning", "Excel", "Tableau"],
    analyst: ["SQL", "Excel", "Tableau", "Power BI", "Data Visualization", "Statistical Analysis"],
    designer: ["UI/UX Design", "Figma", "Adobe Creative Suite", "Wireframing", "Prototyping", "User Research"],
    manager: ["Project Management", "Team Leadership", "Strategic Planning", "Budget Management", "Stakeholder Management"],
    marketing: ["Digital Marketing", "SEO/SEM", "Social Media", "Content Strategy", "Google Analytics", "Email Marketing"],
    sales: ["CRM Software", "Negotiation", "Lead Generation", "Client Relations", "Presentation Skills", "Sales Strategy"],
    soft: ["Communication", "Teamwork", "Problem Solving", "Leadership", "Time Management", "Adaptability", "Critical Thinking"]
  };

  let matchedSkills = [];
  
  Object.keys(skillDatabase).forEach(key => {
    if (title.includes(key) && key !== 'soft') {
      matchedSkills = [...matchedSkills, ...skillDatabase[key]];
    }
  });

  if (matchedSkills.length === 0) {
    if (title.includes('tech') || title.includes('engineer') || title.includes('programmer')) {
      matchedSkills = [...skillDatabase.software, ...skillDatabase.developer];
    } else if (title.includes('data') || title.includes('analysis')) {
      matchedSkills = [...skillDatabase.data, ...skillDatabase.analyst];
    } else if (title.includes('design') || title.includes('creative')) {
      matchedSkills = [...skillDatabase.designer, ...skillDatabase.ui];
    } else if (title.includes('manage') || title.includes('lead')) {
      matchedSkills = [...skillDatabase.manager, ...skillDatabase.project];
    } else if (title.includes('market') || title.includes('sale')) {
      matchedSkills = [...skillDatabase.marketing, ...skillDatabase.sales];
    } else {
      matchedSkills = [
        "Communication", "Problem Solving", "Teamwork", 
        "Microsoft Office", "Time Management", "Adaptability",
        "Critical Thinking", "Leadership"
      ];
    }
  }

  const allSkills = [...new Set([...matchedSkills, ...skillDatabase.soft])];
  
  return allSkills
    .sort(() => Math.random() - 0.5)
    .slice(0, 8);
}

module.exports = router;