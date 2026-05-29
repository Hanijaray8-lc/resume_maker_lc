// server/routes/ai.js - USING WORKING GROQ MODEL
const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

router.post('/skills', async (req, res) => {
  try {
    const { jobTitle } = req.body;

    if (!jobTitle || jobTitle.trim() === '') {
      return res.status(400).json({ error: 'Job title is required' });
    }

    console.log('\n=================================');
    console.log('🎯 AI Skills Request');
    console.log('Job Title:', jobTitle);
    console.log('=================================');

    // Check API key
    if (!process.env.GROQ_API_KEY) {
      console.error('❌ GROQ_API_KEY not found');
      return res.json({ 
        skills: getIntelligentSkills(jobTitle),
        source: 'fallback',
        message: 'API key not configured'
      });
    }

    // USE THE WORKING MODEL ONLY
    console.log('📡 Calling Groq API with model: llama-3.1-8b-instant');
    
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY.trim()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',  // ✅ This model works!
        messages: [
          {
            role: 'system',
            content: 'You are a career expert. Return ONLY comma-separated skills, no extra text, no numbering, no explanations.'
          },
          {
            role: 'user',
            content: `List exactly 8 key skills for a "${jobTitle}" role. Include both technical and soft skills. Return ONLY this format: Skill1, Skill2, Skill3, Skill4, Skill5, Skill6, Skill7, Skill8`
          }
        ],
        temperature: 0.3,
        max_tokens: 150,
      })
    });

    console.log('Groq Response Status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Groq API Error:', response.status, errorText);
      return res.json({ 
        skills: getIntelligentSkills(jobTitle),
        source: 'fallback',
        message: 'API error, using database'
      });
    }

    const data = await response.json();
    console.log('✅ Groq API Success!');
    
    const content = data.choices[0]?.message?.content || '';
    console.log('AI Response:', content);

    // Parse skills from response
    let skills = content.split(',')
      .map(s => s.trim())
      .filter(s => s.length > 2 && s.length < 50)
      .filter(s => !s.match(/^(skills?|including|such as|for|role|example)/i))
      .slice(0, 8);
    
    console.log('📝 Extracted skills:', skills);
    
    if (skills.length < 3) {
      console.log('⚠️ Not enough skills, using fallback');
      return res.json({ 
        skills: getIntelligentSkills(jobTitle),
        source: 'fallback',
        message: 'Could not parse AI response'
      });
    }

    // SUCCESS - Return AI generated skills
    res.json({ 
      skills: skills,
      source: 'groq-ai',
      model: 'llama-3.1-8b-instant',
      message: '✅ AI generated skills successfully!'
    });

  } catch (error) {
    console.error('❌ Server Error:', error.message);
    const skills = getIntelligentSkills(req.body.jobTitle || '');
    res.json({ 
      skills: skills,
      source: 'fallback',
      error: error.message
    });
  }
});

// Intelligent fallback function
function getIntelligentSkills(jobTitle) {
  const title = (jobTitle || '').toLowerCase();
  console.log('📚 Using fallback database for:', title);
  
  const skillDatabase = {
    software: ["JavaScript", "React", "Node.js", "Python", "Git", "SQL", "TypeScript", "REST APIs"],
    developer: ["Java", "Spring Boot", "AWS", "Docker", "Kubernetes", "CI/CD", "Microservices", "Git"],
    web: ["HTML5", "CSS3", "JavaScript", "React", "Vue.js", "Responsive Design", "Web Performance", "SEO"],
    frontend: ["React", "Vue.js", "Angular", "TypeScript", "SASS", "Webpack", "UI/UX Principles", "Redux"],
    backend: ["Node.js", "Python", "Java", "SQL", "MongoDB", "Redis", "API Design", "System Architecture"],
    data: ["Python", "SQL", "Pandas", "Data Analysis", "Statistics", "Machine Learning", "Excel", "Tableau"],
    analyst: ["SQL", "Excel", "Tableau", "Power BI", "Data Visualization", "Statistical Analysis", "Python", "Critical Thinking"],
    designer: ["UI/UX Design", "Figma", "Adobe Creative Suite", "Wireframing", "Prototyping", "User Research", "Visual Design", "Sketch"],
    manager: ["Project Management", "Team Leadership", "Strategic Planning", "Budget Management", "Stakeholder Management", "Agile", "Scrum", "Communication"],
    marketing: ["Digital Marketing", "SEO/SEM", "Social Media", "Content Strategy", "Google Analytics", "Email Marketing", "Copywriting", "Brand Strategy"],
    sales: ["CRM Software", "Negotiation", "Lead Generation", "Client Relations", "Presentation Skills", "Sales Strategy", "Cold Calling", "Account Management"],
    soft: ["Communication", "Teamwork", "Problem Solving", "Leadership", "Time Management", "Adaptability", "Critical Thinking", "Creativity"]
  };

  let matchedSkills = [];
  
  for (const [key, skills] of Object.entries(skillDatabase)) {
    if (title.includes(key) && key !== 'soft') {
      matchedSkills.push(...skills);
    }
  }

  if (matchedSkills.length === 0) {
    if (title.includes('tech') || title.includes('engineer') || title.includes('programmer') || title.includes('dev')) {
      matchedSkills = [...skillDatabase.software, ...skillDatabase.developer];
    } else if (title.includes('data') || title.includes('analysis') || title.includes('analytics')) {
      matchedSkills = [...skillDatabase.data, ...skillDatabase.analyst];
    } else if (title.includes('design') || title.includes('creative') || title.includes('ux') || title.includes('ui')) {
      matchedSkills = [...skillDatabase.designer];
    } else if (title.includes('manage') || title.includes('lead') || title.includes('director')) {
      matchedSkills = [...skillDatabase.manager];
    } else if (title.includes('market') || title.includes('sale') || title.includes('growth')) {
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
  return allSkills.slice(0, 8);
}

module.exports = router;