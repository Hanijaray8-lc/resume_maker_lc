import React, { useState, useEffect } from "react";
import { Box, Button, Typography } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

// ✅ Import resume templates
import Resume1 from "./DuplicateResume/Resume1";
import Resume2 from "./DuplicateResume/Resume2";
import Resume3 from "./DuplicateResume/Resume3";
import Resume4 from "./DuplicateResume/Resume4";
import Resume5 from "./DuplicateResume/Resume5";
import Resume6 from "./DuplicateResume/Resume6";
import Resume7 from "./DuplicateResume/Resume7";
import Resume8 from "./DuplicateResume/Resume8";
import Sidebar from "./Sidebar";

const templateComponents = {
  1: Resume1,
  2: Resume2,
  3: Resume3,
  4: Resume4,
  5: Resume5,
  6: Resume6,
  7: Resume7,
  8: Resume8,
};

export default function CompleteResume() {
  const location = useLocation();
  const navigate = useNavigate();

  const [selectedTemplate, setSelectedTemplate] = useState(1);
  const [selectedTheme, setSelectedTheme] = useState("#1a2b47");
  const [workExperiences, setWorkExperiences] = useState([]);
  const [formData, setFormData] = useState({});
  const [preview, setPreview] = useState("");

  // ✅ Load saved data (same logic as SummaryStep)
  useEffect(() => {
    if (location.state) {
      const { selectedTemplate: template, selectedTheme: theme } = location.state;
      if (template) setSelectedTemplate(template);
      if (theme) setSelectedTheme(theme);
    }

    const savedWorks = localStorage.getItem("workExperiences");
    if (savedWorks) setWorkExperiences(JSON.parse(savedWorks));

    const fetchContactData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await axios.get("https://resume-maker-lc.onrender.com/api/contact/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data) {
          setFormData(res.data);
          if (res.data.photo) {
            setPreview(
              res.data.photo.startsWith("http")
                ? res.data.photo
                : `https://resume-maker-lc.onrender.com${res.data.photo}`
            );
          }
        }
      } catch (err) {
        console.error("Error fetching contact", err);
      }
    };

    fetchContactData();
  }, [location.state]);

  const SelectedResumeComponent = templateComponents[selectedTemplate];

  // ✅ Resume props (same switch as before)
  const getResumeProps = () => {
    switch (selectedTemplate) {
      case 2:
        return { color: selectedTheme, workExperiences, formData, photo: preview };
      case 3:
        return {
          color: typeof selectedTheme === "object" ? selectedTheme.primary : selectedTheme,
          workExperiences,
          formData,
          photo: preview,
        };
      case 4:
        return {
          theme: selectedTheme,
          color: typeof selectedTheme === "object" ? selectedTheme.primary : selectedTheme,
          workExperiences,
          formData,
          photo: preview,
        };
      case 7:
        return {
          theme: selectedTheme,
          color: typeof selectedTheme === "object" ? selectedTheme.highlight : selectedTheme,
          workExperiences,
          formData,
          photo: preview,
        };
      case 8:
        return { theme: selectedTheme, workExperiences, formData, photo: preview };
      default:
        return { color: selectedTheme, workExperiences, formData, photo: preview };
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f9fafb", p: 2 }}>
      <Sidebar />
      <Typography variant="h5" sx={{ mb: 1, textAlign: "center" }}>
        🎉 Your Complete Resume
      </Typography>

      <Box
  sx={{
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  }}
>
  {/* Scaled preview wrapped in overflow-hidden box */}
  <Box
    sx={{
      width: "100%",
      maxWidth: 600,
      overflow: "hidden",
      height: 1300 * 0.5, // Adjust based on your resume height and scale
      display: "flex",
      justifyContent: "center",
    }}
  >
    <Box
      sx={{
        transform: "scale(0.5)",
        transformOrigin: "top center",
      }}
    >
      <SelectedResumeComponent {...getResumeProps()} />
    </Box>
  </Box>

  {/* Buttons immediately below preview */}
  <Box
    sx={{
      mt: 1,
      display: "flex",
      justifyContent: "center",
      gap: 2,
    }}
  >
    <Button
      variant="outlined"
      color="primary"
      onClick={() => navigate(-1)}
    >
      ⬅ Back
    </Button>
    <Button
      variant="contained"
      color="primary"
      onClick={() =>
    navigate("/mainpage", {
      state: { selectedTemplate, selectedTheme },
    })
  }
    >
      Next ➡
    </Button>
  </Box>
</Box>



    </Box>
  );
}
