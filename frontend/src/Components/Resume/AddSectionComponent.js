// AddSectionComponent.js
import React, { useState } from "react";
import {
  Box,
  Typography,
  Checkbox,
  FormControlLabel,
  Button,
  TextField,
  Divider,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { useSections } from "../Extras/SectionContext"; 

const AddSectionComponent = ({ onAdd }) => {
  const [selectedSections, setSelectedSections] = useState([]);
  const [customSections, setCustomSections] = useState([]);
  const [customInput, setCustomInput] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const { setSelectedSections: saveSections } = useSections();

  // ✅ Get template/theme from location state
  const { selectedTemplate, selectedTheme } = location.state || {};

  const sectionRoutes = {
    "Photo, Personal Details": "/PersonalDetail",
    Languages: "/Language",
    "Additional Information": "/AdditionalInfoForm",
    Accomplishments: "/AccomplishmentsSection",
    "Websites, Portfolios, Profiles": "/WebsiteSection",
    Certifications: "/Certifications",
    References: "/Refferences",
    Software: "/SoftWare",
    Volunteering: "/Volunteer",
    Interests: "/Interest",
  };

  const predefinedSections = Object.keys(sectionRoutes);

  const handleToggle = (section) => {
    setSelectedSections((prev) =>
      prev.includes(section)
        ? prev.filter((s) => s !== section)
        : [...prev, section]
    );
  };

  const handleAddCustom = () => {
    const trimmed = customInput.trim();
    if (trimmed && !customSections.includes(trimmed)) {
      setCustomSections([...customSections, trimmed]);
      setCustomInput("");
    }
  };

  // ✅ Navigate with template/theme
  const handleNext = () => {
    const allSections = [...selectedSections, ...customSections];

    if (allSections.length === 0) return;

    saveSections(allSections);
    if (onAdd) onAdd(allSections);

    const firstSection = allSections[0];

    if (sectionRoutes[firstSection]) {
      navigate(sectionRoutes[firstSection], {
        state: { 
          remainingSections: allSections.slice(1),
          selectedTemplate,
          selectedTheme,
        },
      });
    } else {
      navigate(`/custom-section/${encodeURIComponent(firstSection)}`, {
        state: { 
          remainingSections: allSections.slice(1),
          selectedTemplate,
          selectedTheme,
        },
      });
    }

    // Reset
    setSelectedSections([]);
    setCustomSections([]);
    setCustomInput("");
  };

  return (
    <Box sx={{ width: "90%", p: 2 }}>
      <Typography variant="h6" fontWeight="bold" mb={2}>
        Add section
      </Typography>

      {/* Predefined Sections */}
      <Box display="flex" flexDirection="column">
        {predefinedSections.map((section, idx) => (
          <FormControlLabel
            key={idx}
            control={
              <Checkbox
                checked={selectedSections.includes(section)}
                onChange={() => handleToggle(section)}
              />
            }
            label={section}
          />
        ))}
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Custom Sections */}
      <Box display="flex" gap={1} alignItems="center">
        <TextField
          size="small"
          placeholder="Add Your Own"
          value={customInput}
          onChange={(e) => setCustomInput(e.target.value)}
          fullWidth
        />
        <Button variant="outlined" onClick={handleAddCustom}>
          Add
        </Button>
      </Box>

      {/* Show added custom sections */}
      {customSections.length > 0 && (
        <Box sx={{ mt: 2 }}>
          {customSections.map((section, i) => (
            <Typography
              key={i}
              sx={{
                display: "inline-block",
                mr: 1,
                mb: 1,
                p: 0.5,
                bgcolor: "#e0e0e0",
                borderRadius: 1,
              }}
            >
              {section}
            </Typography>
          ))}
        </Box>
      )}

      {/* Buttons */}
      <Box mt={3} display="flex" gap={2}>
        <Button
          variant="outlined"
          fullWidth
          onClick={() => {
            setSelectedSections([]);
            setCustomSections([]);
            setCustomInput("");
          }}
        >
          Cancel
        </Button>
        <Button variant="contained" fullWidth onClick={handleNext}>
          Next
        </Button>
      </Box>
    </Box>
  );
};

export default AddSectionComponent;
