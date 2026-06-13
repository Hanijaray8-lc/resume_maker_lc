// server/routes/ai.js - FIXED: Handles both skill keywords and job titles
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
    console.log('Input:', jobTitle);
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

    console.log('📡 Calling Groq API with model: llama-3.1-8b-instant');

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY.trim()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [
          {
            role: 'system',
            content: 'You are a technical career expert. The user will give you a skill name, technology, or job title. Return ONLY comma-separated related skills/technologies. No numbering, no explanations, no extra text.'
          },
          {
            role: 'user',
            content: `The user typed: "${jobTitle}"
This could be a technology, framework, programming language, or job title.
List exactly 8 related skills or technologies that someone who knows "${jobTitle}" should also know.
Return ONLY this format: Skill1, Skill2, Skill3, Skill4, Skill5, Skill6, Skill7, Skill8`
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

    let skills = content.split(',')
      .map(s => s.trim())
      .filter(s => s.length > 1 && s.length < 60)
      .filter(s => !s.match(/^(skills?|including|such as|for|role|example|here are|these are)/i))
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

// ✅ FIXED: Expanded fallback that handles skill/tech keywords too
function getIntelligentSkills(input) {
  const title = (input || '').toLowerCase().trim();
  console.log('📚 Using fallback database for:', title);

  const skillDatabase = {
    // ── Frontend Frameworks & Libraries ──────────────────────────
    react: ["JavaScript", "HTML5", "CSS3", "Redux", "React Router", "TypeScript", "Next.js", "Material UI", "Tailwind CSS", "REST APIs"],
    nextjs: ["React", "TypeScript", "Tailwind CSS", "Node.js", "Vercel", "REST APIs", "SSR", "SEO Optimization"],
    vue: ["JavaScript", "Vuex", "Vue Router", "TypeScript", "Nuxt.js", "HTML5", "CSS3", "REST APIs"],
    angular: ["TypeScript", "RxJS", "HTML5", "CSS3", "Angular Material", "REST APIs", "NgRx", "Unit Testing"],
    svelte: ["JavaScript", "TypeScript", "HTML5", "CSS3", "SvelteKit", "Vite", "REST APIs", "Node.js"],

    // ── Styling ───────────────────────────────────────────────────
    tailwind: ["HTML5", "CSS3", "React", "PostCSS", "Responsive Design", "Figma", "JavaScript", "Flexbox/Grid"],
    css: ["HTML5", "Sass/SCSS", "Tailwind CSS", "Bootstrap", "Flexbox", "CSS Grid", "Responsive Design", "Animations"],
    sass: ["CSS3", "HTML5", "BEM Methodology", "Tailwind CSS", "Bootstrap", "PostCSS", "Responsive Design", "JavaScript"],
    bootstrap: ["HTML5", "CSS3", "JavaScript", "Sass", "Responsive Design", "jQuery", "Figma", "Grid System"],
    materialui: ["React", "TypeScript", "CSS-in-JS", "Emotion", "Figma", "JavaScript", "Theming", "Responsive Design"],
    mui: ["React", "TypeScript", "CSS-in-JS", "Emotion", "Figma", "JavaScript", "Theming", "Responsive Design"],

    // ── Languages ─────────────────────────────────────────────────
    javascript: ["TypeScript", "React", "Node.js", "HTML5", "CSS3", "REST APIs", "Git", "ES6+"],
    typescript: ["JavaScript", "React", "Node.js", "Angular", "Type Safety", "ESLint", "Webpack", "OOP"],
    python: ["Django", "Flask", "FastAPI", "Pandas", "NumPy", "SQL", "REST APIs", "Machine Learning"],
    java: ["Spring Boot", "Hibernate", "SQL", "REST APIs", "Maven", "JUnit", "Microservices", "Docker"],
    csharp: [".NET", "ASP.NET Core", "SQL Server", "REST APIs", "Entity Framework", "Azure", "Unit Testing", "OOP"],
    php: ["Laravel", "MySQL", "HTML5", "CSS3", "REST APIs", "Composer", "JavaScript", "MVC Pattern"],
    ruby: ["Ruby on Rails", "PostgreSQL", "HTML5", "CSS3", "REST APIs", "RSpec", "Git", "Heroku"],
    swift: ["iOS Development", "Xcode", "UIKit", "SwiftUI", "Core Data", "REST APIs", "Objective-C", "App Store"],
    kotlin: ["Android Development", "Jetpack Compose", "Android Studio", "REST APIs", "Coroutines", "MVVM", "SQL", "Firebase"],
    go: ["Golang", "REST APIs", "Docker", "Kubernetes", "PostgreSQL", "Microservices", "gRPC", "Linux"],
    rust: ["Systems Programming", "WebAssembly", "Cargo", "Memory Safety", "Concurrency", "CLI Tools", "Linux", "C++"],
    cpp: ["C", "Data Structures", "Algorithms", "OOP", "Memory Management", "STL", "Linux", "Embedded Systems"],
    c: ["C++", "Data Structures", "Algorithms", "Pointers", "Linux", "Embedded Systems", "Makefile", "GDB"],

    // ── Backend ───────────────────────────────────────────────────
    nodejs: ["JavaScript", "Express.js", "REST APIs", "MongoDB", "SQL", "JWT", "Docker", "TypeScript"],
    express: ["Node.js", "JavaScript", "REST APIs", "MongoDB", "SQL", "JWT", "Middleware", "TypeScript"],
    django: ["Python", "PostgreSQL", "REST APIs", "Django REST Framework", "Celery", "Redis", "Docker", "HTML/CSS"],
    flask: ["Python", "REST APIs", "SQLAlchemy", "PostgreSQL", "JWT", "Docker", "Jinja2", "Redis"],
    fastapi: ["Python", "Pydantic", "REST APIs", "PostgreSQL", "Docker", "JWT", "Async Programming", "OpenAPI"],
    springboot: ["Java", "REST APIs", "Hibernate", "Maven", "SQL", "Docker", "Microservices", "JUnit"],
    laravel: ["PHP", "MySQL", "Eloquent ORM", "Blade Templates", "REST APIs", "Composer", "Vue.js", "Redis"],

    // ── Databases ─────────────────────────────────────────────────
    sql: ["MySQL", "PostgreSQL", "SQL Server", "Query Optimization", "Joins", "Stored Procedures", "Indexing", "Database Design"],
    mysql: ["SQL", "Database Design", "Query Optimization", "PHP", "Node.js", "Indexing", "Stored Procedures", "Backup & Recovery"],
    postgresql: ["SQL", "Database Design", "Query Optimization", "Node.js", "Python", "Indexing", "JSON Support", "Replication"],
    mongodb: ["NoSQL", "Mongoose", "Node.js", "Aggregation Pipeline", "Indexing", "Atlas", "REST APIs", "JSON"],
    redis: ["Caching", "Node.js", "Python", "Pub/Sub", "Session Management", "Data Structures", "Lua Scripting", "Docker"],
    firebase: ["NoSQL", "JavaScript", "React", "Authentication", "Firestore", "Realtime Database", "Cloud Functions", "Hosting"],

    // ── DevOps & Cloud ────────────────────────────────────────────
    docker: ["Kubernetes", "CI/CD", "Linux", "Bash", "Docker Compose", "Microservices", "AWS", "DevOps"],
    kubernetes: ["Docker", "Helm", "CI/CD", "AWS/GCP/Azure", "YAML", "Microservices", "Linux", "Terraform"],
    aws: ["EC2", "S3", "Lambda", "RDS", "Docker", "Terraform", "IAM", "CloudFormation"],
    azure: ["Azure DevOps", "Docker", "Terraform", "C#/.NET", "SQL Server", "Active Directory", "CI/CD", "Power BI"],
    gcp: ["BigQuery", "Kubernetes", "Terraform", "Docker", "Python", "Firebase", "Cloud Run", "CI/CD"],
    terraform: ["AWS", "Azure", "GCP", "Infrastructure as Code", "Docker", "Kubernetes", "CI/CD", "Linux"],
    linux: ["Bash Scripting", "Docker", "SSH", "Vim/Nano", "Cron Jobs", "File System", "Networking", "Package Management"],
    git: ["GitHub", "GitLab", "Branching Strategy", "CI/CD", "Code Review", "Pull Requests", "Version Control", "Merge Conflicts"],

    // ── AI / ML / Data ────────────────────────────────────────────
    machinelearning: ["Python", "TensorFlow", "PyTorch", "Scikit-learn", "Pandas", "NumPy", "SQL", "Statistics"],
    tensorflow: ["Python", "Keras", "NumPy", "Pandas", "Deep Learning", "Scikit-learn", "GPU Computing", "Model Deployment"],
    pytorch: ["Python", "Deep Learning", "NumPy", "Torchvision", "CUDA", "Computer Vision", "NLP", "Model Training"],
    datascience: ["Python", "Pandas", "NumPy", "SQL", "Machine Learning", "Tableau", "Statistics", "Jupyter"],
    pandas: ["Python", "NumPy", "SQL", "Data Visualization", "Matplotlib", "Seaborn", "Jupyter", "Excel"],

    // ── Mobile ────────────────────────────────────────────────────
    reactnative: ["JavaScript", "TypeScript", "React", "Expo", "REST APIs", "Redux", "iOS", "Android"],
    flutter: ["Dart", "iOS Development", "Android Development", "REST APIs", "Firebase", "Provider", "BLoC", "Widget Composition"],

    // ── Testing ───────────────────────────────────────────────────
    jest: ["JavaScript", "React Testing Library", "Unit Testing", "Mocking", "Code Coverage", "TypeScript", "CI/CD", "TDD"],
    cypress: ["JavaScript", "E2E Testing", "Selenium", "Automation Testing", "CI/CD", "React", "HTML/CSS", "REST APIs"],

    // ── Job Titles (original entries) ─────────────────────────────
    software: ["JavaScript", "React", "Node.js", "Python", "Git", "SQL", "TypeScript", "REST APIs"],
    developer: ["Java", "Spring Boot", "AWS", "Docker", "Kubernetes", "CI/CD", "Microservices", "Git"],
    web: ["HTML5", "CSS3", "JavaScript", "React", "Vue.js", "Responsive Design", "Web Performance", "SEO"],
    frontend: ["React", "Vue.js", "Angular", "TypeScript", "Sass", "Webpack", "UI/UX Principles", "Redux"],
    backend: ["Node.js", "Python", "Java", "SQL", "MongoDB", "Redis", "API Design", "System Architecture"],
    fullstack: ["React", "Node.js", "TypeScript", "PostgreSQL", "REST APIs", "Docker", "Git", "AWS"],
    data: ["Python", "SQL", "Pandas", "Data Analysis", "Statistics", "Machine Learning", "Excel", "Tableau"],
    analyst: ["SQL", "Excel", "Tableau", "Power BI", "Data Visualization", "Statistical Analysis", "Python", "Critical Thinking"],
    designer: ["UI/UX Design", "Figma", "Adobe XD", "Wireframing", "Prototyping", "User Research", "Visual Design", "Sketch"],
    manager: ["Project Management", "Team Leadership", "Strategic Planning", "Budget Management", "Stakeholder Management", "Agile", "Scrum", "Communication"],
    marketing: ["Digital Marketing", "SEO/SEM", "Social Media", "Content Strategy", "Google Analytics", "Email Marketing", "Copywriting", "Brand Strategy"],
    sales: ["CRM Software", "Negotiation", "Lead Generation", "Client Relations", "Presentation Skills", "Sales Strategy", "Cold Calling", "Account Management"],
    devops: ["Docker", "Kubernetes", "CI/CD", "AWS", "Linux", "Terraform", "Monitoring", "Git"],
    security: ["Penetration Testing", "OWASP", "Network Security", "Linux", "Python", "Cryptography", "Firewalls", "Incident Response"],
  };

  // ── Normalize input for matching ──────────────────────────────
  const normalized = title
    .replace(/[\s\.\-\_]/g, '')   // remove spaces, dots, dashes
    .replace(/\.js$/, '')          // "react.js" → "react"
    .replace(/\s+js$/, '');        // "node js" → "node"

  // Direct key match first (exact)
  if (skillDatabase[normalized]) {
    return skillDatabase[normalized].slice(0, 8);
  }

  // Partial match — find any key that the input contains or is contained by
  for (const [key, skills] of Object.entries(skillDatabase)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return skills.slice(0, 8);
    }
  }

  // Original word-based matching for job titles
  for (const [key, skills] of Object.entries(skillDatabase)) {
    if (title.includes(key)) {
      return skills.slice(0, 8);
    }
  }

  // Generic tech fallback
  if (title.includes('tech') || title.includes('engineer') || title.includes('programmer') || title.includes('dev')) {
    return skillDatabase.software.slice(0, 8);
  }
  if (title.includes('data') || title.includes('analytic')) {
    return skillDatabase.data.slice(0, 8);
  }
  if (title.includes('design') || title.includes('ux') || title.includes('ui')) {
    return skillDatabase.designer.slice(0, 8);
  }
  if (title.includes('manage') || title.includes('lead') || title.includes('director')) {
    return skillDatabase.manager.slice(0, 8);
  }

  // Last resort
  return ["Communication", "Problem Solving", "Teamwork", "Microsoft Office", "Time Management", "Adaptability", "Critical Thinking", "Leadership"];
}

module.exports = router;