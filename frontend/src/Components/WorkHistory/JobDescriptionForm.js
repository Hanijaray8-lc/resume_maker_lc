import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  IconButton,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate, useLocation } from "react-router-dom";
import Sidebar from "../Sidebar";
import DescriptionBox from "../DescriptionBox";
import axios from "axios";

const API_URL = "https://resume-maker-lc.onrender.com/api/job-descriptions";



const JobDescriptionForm = () => {
  const [search, setSearch] = useState();
  const [description, setDescription] = useState("");
  const [aiSuggestions, setAISuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [workData, setWorkData] = useState({}); // ✅ Added here

  const navigate = useNavigate();
  const { state } = useLocation();

  useEffect(() => {
    const savedData = localStorage.getItem("workExperience");
    if (savedData) {
      setWorkData(JSON.parse(savedData));
    }
  }, []);



  // ✅ Work data passed from previous page

  const jobTitle = workData.jobTitle || "Job Title";
  const employer = workData.employer || "Employer";
  const company = workData.CompanyName || "";
  const location = workData.location || "Location";
  const startMonth = workData.startMonth || "";
  const startYear = workData.startYear || "";
  const endMonth = workData.current ? "Current" : workData.endMonth || "";
  const endYear = workData.current ? "" : workData.endYear || "";

  // ✅ Fetch AI Suggestions from cxgenie.ai
const fetchAISuggestions = async () => {
  if (!search.trim()) return;
  setLoading(true);

  try {
    const res = await axios.post(`${API_URL}/ai-suggestions`, {
      jobTitle: search,
    });

    // Always set suggestions, even if API returned success: false
    setAISuggestions(res.data.suggestions || []);
    
    if (!res.data.success) {
      // Show warning but still use the fallback suggestions
      console.warn("API returned fallback suggestions:", res.data.message);
    }
  } catch (err) {
    console.error("❌ AI fetch error:", err.response?.data || err.message);
    // Use local fallbacks if API completely fails
    setAISuggestions(getLocalFallbacks(search));
  } finally {
    setLoading(false);
  }
};

// Local fallback function for complete API failure
const getLocalFallbacks = (jobTitle) => {
  return [
    `Developed and implemented solutions for ${jobTitle} role`,
    `Collaborated with team members on ${jobTitle} projects`,
    `Applied technical skills to solve problems as a ${jobTitle}`
  ];
};


  // ✅ Save description
const handleSave = () => {
  if (!description.trim()) {
    alert("Description cannot be empty");
    return;
  }

  try {
    // ✅ Save description + related workData to localStorage
    const jobDescriptionData = {
      ...workData,
      description,
    };
    localStorage.setItem("jobDescription", JSON.stringify(jobDescriptionData));

    console.log("✅ Saved to localStorage:", jobDescriptionData);

    navigate("/WorkHistrySummary");
  } catch (err) {
    console.error("❌ Error saving description:", err.message);
  }
};


  return (
    <Box>
      <Sidebar />

      <Box display="flex" minHeight="100vh" sx={{ ml: 30 }}>
        <Container maxWidth="lg" sx={{ p: 5 }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            What did you do as a {jobTitle}?
          </Typography>
          <Typography variant="subtitle1" gutterBottom color="text.secondary">
            To get started, you can choose from our personalized suggestions.
          </Typography>

          <Box display="flex" gap={3} mt={4}>
            {/* Left: Suggestions */}
            <Box flex={1}>
              <Box display="flex" gap={1}>
                <TextField
                  fullWidth
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search job title examples"
                  InputProps={{
                    endAdornment: (
                      <IconButton onClick={fetchAISuggestions}>
                        <SearchIcon />
                      </IconButton>
                    ),
                  }}
                  sx={{ mb: 2 }}
                />
              
              </Box>

              {(aiSuggestions.length > 0
                ? aiSuggestions
                : [
                    "Coded websites using HTML, CSS, JavaScript, and jQuery languages.",
                    "Planned website development, converting mockups into usable web presence with HTML, JavaScript, AJAX, and JSON coding.",
                    "Provided front-end website development using WordPress, Hubspot, and other editing software.",
                  ]
              ).map((s, idx) => (
                <Box
                  key={idx}
                  sx={{
                    p: 2,
                    mb: 2,
                    border: "1px solid #ddd",
                    borderRadius: 2,
                    backgroundColor: "#f9f9f9",
                    cursor: "pointer",
                  }}
                  onClick={() => setDescription(s)}
                >
                  <Typography variant="body2" sx={{ fontWeight: "bold", mb: 1 }}>
                    ⭐ {aiSuggestions.length > 0 ? "AI Suggested" : "Expert Recommended"}
                  </Typography>
                  <Typography variant="body2">{s}</Typography>
                </Box>
              ))}
            </Box>

            {/* Right: Job Description */}
            <Box flex={1}>
              <Typography variant="h6" fontWeight="bold">
                {jobTitle} | {employer}
              </Typography>
              <Typography variant="h6" fontWeight="bold">
                {company}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {location} – {startMonth} {startYear} – {endMonth} {endYear}
              </Typography>

              <DescriptionBox
                value={description}
                onChange={(val) => setDescription(val)}
              />
            </Box>
          </Box>

          {/* Navigation */}
        <Box mt={6} display="flex" justifyContent="center" gap={3}>
  <Button variant="outlined" sx={{ px: 5, borderRadius: 3 }}>
    Preview
  </Button>

  {/* Skip Now Button */}
  <Button
    variant="outlined"
    sx={{
      px: 5,
      borderRadius: 3,
      fontWeight: "bold",
      color: "#1976d2",
      borderColor: "#1976d2",
      "&:hover": { borderColor: "#125ea2", color: "#125ea2" },
    }}
    onClick={() => navigate("/WorkHistrySummary")} // ✅ directly go to next page
  >
    Skip Now
  </Button>

  {/* Next Button */}
  <Button
    variant="contained"
    sx={{
      px: 5,
      borderRadius: 3,
      fontWeight: "bold",
      backgroundColor: "#e91e63",
      "&:hover": { backgroundColor: "#d81b60" },
    }}
    onClick={handleSave} // ✅ Save before navigating
  >
    Next
  </Button>
</Box>

        </Container>
      </Box>
    </Box>
  );
};

export default JobDescriptionForm;