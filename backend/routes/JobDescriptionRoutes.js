const express = require("express");
const JobDescription = require("../models/JobDescription");
const router = express.Router();
const axios = require("axios");

// ➤ Save a job description
router.post("/add", async (req, res) => {
  try {
    const { userId, workId, description } = req.body;

    if (!workId || !description) {
      return res.status(400).json({ success: false, message: "workId and description are required" });
    }

    const newDesc = new JobDescription({ userId, workId, description });
    await newDesc.save();

    res.status(201).json({ success: true, message: "Description saved!", data: newDesc });
  } catch (error) {
    console.error("❌ Error saving description:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});



// GET /api/job-descriptions/work/:workId
router.get("/work/:workId", async (req, res) => {
  try {
    const descriptions = await JobDescription.find({ workId: req.params.workId });
    res.json(descriptions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ➤ Get all descriptions
router.get("/", async (req, res) => {
  try {
    const descriptions = await JobDescription.find()
      .populate("workId") // 🔑 include work experience fields
      .sort({ createdAt: -1 });
    res.json(descriptions);
  } catch (error) {
    console.error("❌ Error fetching descriptions:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});



// ➤ Update description
router.put("/update/:id", async (req, res) => {
  try {
    const { description } = req.body;
    const { id } = req.params;

    if (!description) {
      return res.status(400).json({ success: false, message: "Description required" });
    }

    const updated = await JobDescription.findByIdAndUpdate(
      id,
      { description },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: "Description not found" });
    }

    res.json({ success: true, message: "Description updated", data: updated });
  } catch (error) {
    console.error("❌ Error updating description:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ➤ Get all descriptions for a user
router.get("/user/:userId", async (req, res) => {
  try {
    const descriptions = await JobDescription.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.json(descriptions);
  } catch (error) {
    console.error("❌ Error fetching descriptions:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ➤ Delete description
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await JobDescription.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Description not found" });
    }
    res.json({ success: true, message: "Description deleted" });
  } catch (error) {
    console.error("❌ Error deleting description:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});


function getFallbackSuggestions(jobTitle) {
  const fallbacks = {
    software: [
      "Developed and maintained software applications using modern programming languages and frameworks",
      "Collaborated with cross-functional teams to design, develop, and implement new features",
      "Wrote clean, efficient, and well-documented code following best practices and coding standards"
    ],
    web: [
      "Built responsive web applications using HTML, CSS, JavaScript and modern frameworks",
      "Optimized website performance and ensured cross-browser compatibility",
      "Implemented user interface designs and integrated with backend APIs"
    ],
    default: [
      `Engineered solutions for ${jobTitle} responsibilities and tasks`,
      `Collaborated with team members to achieve project goals as a ${jobTitle}`,
      `Applied specialized knowledge in ${jobTitle} to solve complex problems`
    ]
  };

  const lowerTitle = jobTitle.toLowerCase();
  if (lowerTitle.includes("software")) return fallbacks.software;
  if (lowerTitle.includes("web")) return fallbacks.web;
  
  return fallbacks.default;
}

router.post("/ai-suggestions", async (req, res) => {
  const { jobTitle } = req.body;
  console.log("📩 AI Suggestion Request:", jobTitle);

  if (!jobTitle) {
    return res.status(400).json({ success: false, message: "Job title is required" });
  }

  try {
    // Try the primary CXGenie API endpoint first
    let response;
    try {
      response = await axios.post(
        "https://api.cxgenie.ai/v1/jd/generate",
        { role: jobTitle },
        {
          headers: {
            Authorization: `Bearer ${process.env.CXGENIE_API_KEY}`,
            "Content-Type": "application/json",
          },
          timeout: 8000
        }
      );
      console.log("✅ CXGenie Response received");
    } catch (apiError) {
      console.warn("⚠️ Primary API failed, trying alternative endpoint...");
      
      // Try an alternative endpoint (common pattern)
      try {
        response = await axios.post(
          "https://api.cxgenie.ai/v1/generate/jd",
          { role: jobTitle },
          {
            headers: {
              Authorization: `Bearer ${process.env.CXGENIE_API_KEY}`,
              "Content-Type": "application/json",
            },
            timeout: 8000
          }
        );
        console.log("✅ Alternative endpoint worked");
      } catch (altError) {
        console.warn("⚠️ All API endpoints failed, using fallback suggestions");
        throw new Error("All API endpoints failed");
      }
    }

    // Process successful response
    const suggestions = extractSuggestions(response.data);
    
    res.json({ 
      success: true, 
      suggestions,
      source: response.config.url.includes('alternative') ? 'alternative' : 'primary'
    });
    
  } catch (error) {
    console.error("❌ All API attempts failed, using fallback:", error.message);
    
    // Provide high-quality fallback suggestions
    const fallbackSuggestions = getFallbackSuggestions(jobTitle);
    
    res.json({
      success: false,
      message: "Using fallback suggestions",
      suggestions: fallbackSuggestions,
      source: "fallback"
    });
  }
});

// Helper function to extract suggestions from different response formats
function extractSuggestions(data) {
  if (!data) return [];
  
  // Try different response structures
  if (data.suggestions && Array.isArray(data.suggestions)) return data.suggestions;
  if (data.choices && Array.isArray(data.choices)) return data.choices.map(c => c.text?.trim() || JSON.stringify(c));
  if (data.data && Array.isArray(data.data)) return data.data;
  if (typeof data === 'string') return [data];
  if (data.message) return [data.message];
  
  // If we have data but can't parse it, return as string
  try {
    return [JSON.stringify(data)];
  } catch {
    return ["Received response from API"];
  }
}

// Enhanced fallback suggestions
function getFallbackSuggestions(jobTitle) {
  const lowerTitle = jobTitle.toLowerCase();
  
  // Categorized fallback suggestions
  const categories = {
    software: [
      "Developed scalable software solutions using modern technologies and best practices",
      "Collaborated with cross-functional teams to design, implement and deploy new features",
      "Wrote clean, maintainable code and conducted thorough testing to ensure quality",
      "Optimized application performance and resolved complex technical issues",
      "Participated in code reviews and contributed to architectural decisions"
    ],
    web: [
      "Built responsive web applications using HTML, CSS, JavaScript and modern frameworks",
      "Implemented user interface designs and ensured cross-browser compatibility",
      "Optimized website performance for faster loading and better user experience",
      "Integrated with RESTful APIs and third-party services",
      "Developed and maintained front-end components and back-end services"
    ],
    data: [
      "Designed and implemented data processing pipelines and ETL workflows",
      "Developed predictive models and performed statistical analysis",
      "Created data visualizations and reports to support business decisions",
      "Managed databases and optimized queries for performance",
      "Cleaned, processed and analyzed large datasets to extract insights"
    ],
    manager: [
      "Led and mentored team members to achieve project goals and deadlines",
      "Managed project timelines, resources and stakeholder communications",
      "Developed strategic plans and coordinated cross-functional initiatives",
      "Implemented processes to improve team efficiency and productivity",
      "Recruited, trained and evaluated team performance"
    ],
    default: [
      "Applied specialized knowledge and skills to achieve project objectives",
      "Collaborated with team members to solve complex problems and deliver results",
      "Maintained documentation and followed established procedures and guidelines",
      "Contributed to continuous improvement initiatives and process optimization",
      "Communicated effectively with stakeholders and team members"
    ]
  };

  // Determine the most relevant category
  let selectedCategory = 'default';
  if (lowerTitle.includes('software') || lowerTitle.includes('developer') || lowerTitle.includes('engineer')) {
    selectedCategory = 'software';
  } else if (lowerTitle.includes('web') || lowerTitle.includes('frontend') || lowerTitle.includes('backend')) {
    selectedCategory = 'web';
  } else if (lowerTitle.includes('data') || lowerTitle.includes('analyst') || lowerTitle.includes('scientist')) {
    selectedCategory = 'data';
  } else if (lowerTitle.includes('manager') || lowerTitle.includes('lead') || lowerTitle.includes('director')) {
    selectedCategory = 'manager';
  }

  // Return 3 random suggestions from the selected category
  const suggestions = [...categories[selectedCategory]];
  return suggestions.sort(() => 0.5 - Math.random()).slice(0, 3);
}

// API Diagnostic endpoint
router.get("/api-test", async (req, res) => {
  try {
    console.log("Testing CXGenie API connection...");
    
    // Test the API connection
    const testResponse = await axios.get("https://api.cxgenie.ai", {
      headers: {
        Authorization: `Bearer ${process.env.CXGENIE_API_KEY}`,
      },
      timeout: 5000
    }).catch(err => {
      return { status: err.response?.status, data: err.response?.data };
    });

    res.json({
      apiKeyPresent: !!process.env.CXGENIE_API_KEY,
      apiKeyLength: process.env.CXGENIE_API_KEY?.length || 0,
      testResponse: testResponse.data,
      status: testResponse.status
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
      apiKeyPresent: !!process.env.CXGENIE_API_KEY
    });
  }
});


// Check environment configuration on startup
console.log("🔑 CXGENIE API Key present:", !!process.env.CXGENIE_API_KEY);
console.log("🌐 API Base URL:", process.env.CXGENIE_API_URL || "https://api.cxgenie.ai");



module.exports = router;
