import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  TextField,
  Checkbox,
  FormControlLabel,
  Button,
  Box,
  Grid,
  Stack,
  Card,
  CardContent,
  Typography,
  IconButton,
  AppBar,
  Toolbar,
} from "@mui/material";
import { Edit, Delete, ArrowBack } from "@mui/icons-material";
import { useSections } from "./SectionContext";

// Map section name → route
const sectionRoutes = {
  "Photo, Personal Details": "/PersonalDetail",
  "Websites, Portfolios, Profiles": "/WebsiteSection",
  Certifications: "/Certifications",
  Languages: "/Language",
  Accomplishments: "/AccomplishmentsSection",
  "Additional Information": "/AdditionalInfoForm",
  Software: "/SoftWare",
  References: "/Refferences",
  Volunteering: "/Volunteer",
  Interests: "/Interest",
};

const WebsitesSection = () => {
  const [links, setLinks] = useState([
    { url: "", addToHeader: false, placeholder: "github.com/yourusername" },
    { url: "", addToHeader: false, placeholder: "linkedin.com/in/yourname" },
    { url: "", addToHeader: false, placeholder: "yourportfolio.com" },
  ]);
  const [savedLinks, setSavedLinks] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const { sections } = useSections();
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [selectedTheme, setSelectedTheme] = useState(null);

  // Load saved links
  useEffect(() => {
    const stored = localStorage.getItem("websites");
    if (stored) setSavedLinks(JSON.parse(stored));
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("websites", JSON.stringify(savedLinks));
  }, [savedLinks]);

  // Load selected template/theme from navigation
  useEffect(() => {
    if (location.state) {
      const { selectedTemplate: template, selectedTheme: theme } = location.state;
      if (template) setSelectedTemplate(template);
      if (theme) setSelectedTheme(theme);
    }
  }, [location.state]);

  const handleLinkChange = (index, value) => {
    const updated = [...links];
    updated[index].url = value;
    setLinks(updated);
  };

  const handleCheckboxChange = (index, checked) => {
    const updated = [...links];
    updated[index].addToHeader = checked;
    setLinks(updated);
  };

  const addNewLink = () => setLinks([...links, { url: "", addToHeader: false }]);

  const handleSave = () => {
    setSavedLinks([...savedLinks, ...links.filter((l) => l.url.trim() !== "")]);
    setLinks([{ url: "", addToHeader: false }]);
  };

  const handleDelete = (index) => {
    const updated = [...savedLinks];
    updated.splice(index, 1);
    setSavedLinks(updated);
  };

  const handleEdit = (index) => {
    const linkToEdit = savedLinks[index];
    setLinks([linkToEdit]);
    handleDelete(index);
  };

  const handlePreview = () => console.log("Preview data:", savedLinks);

  const handleNext = () => {
    const currentSection = "Websites, Portfolios, Profiles";
    const currentIndex = sections.indexOf(currentSection);

    if (currentIndex < sections.length - 1) {
      const nextSection = sections[currentIndex + 1];
      navigate(sectionRoutes[nextSection], {
        state: { selectedTemplate, selectedTheme },
      });
    } else {
      navigate("/mainpage", {
        state: { selectedTemplate, selectedTheme },
      });
    }
  };

  return (
    <Box>
      {/* Header */}
      <AppBar position="static" sx={{ backgroundColor: "#002B5B" }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={() => navigate(-1)}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Websites, Portfolios, Profiles
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Box sx={{ maxWidth: 600, mx: "auto", mt: 4, p: 2 }}>
        {/* Input Fields */}
        <Grid container spacing={2}>
          {links.map((link, index) => (
            <Grid item xs={12} key={index}>
              <Box display="flex" alignItems="center" gap={2}>
                <TextField
                  fullWidth
                  label="Link / URL"
                  placeholder={link.placeholder || "ex. linkedin.com/in/yourname"}
                  value={link.url}
                  onChange={(e) => handleLinkChange(index, e.target.value)}
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={link.addToHeader}
                      onChange={(e) => handleCheckboxChange(index, e.target.checked)}
                    />
                  }
                  label="Add to header"
                />
              </Box>
            </Grid>
          ))}
        </Grid>

        <Button
          onClick={addNewLink}
          sx={{ mt: 2, color: "primary.main", textTransform: "none" }}
        >
          + Add another link
        </Button>

        {/* Bottom Buttons */}
        <Stack direction="row" justifyContent="space-between" sx={{ mt: 4 }}>
          <Button variant="outlined" sx={{ px: 4, borderRadius: 3 }} onClick={handlePreview}>
            Preview
          </Button>
          <Stack direction="row" gap={2}>
            <Button
              variant="contained"
              sx={{
                px: 5,
                borderRadius: 3,
                fontWeight: "bold",
                backgroundColor: "#4caf50",
                "&:hover": { backgroundColor: "#43a047" },
              }}
              onClick={handleSave}
            >
              Save
            </Button>
            <Button
              variant="contained"
              sx={{
                px: 5,
                borderRadius: 3,
                fontWeight: "bold",
                backgroundColor: "#1976d2",
                "&:hover": { backgroundColor: "#1565c0" },
              }}
              onClick={handleNext}
            >
              Next
            </Button>
          </Stack>
        </Stack>

        {/* Saved Links */}
        <Box sx={{ mt: 4 }}>
          {savedLinks.map((link, index) => (
            <Card key={index} sx={{ mb: 2, boxShadow: 2 }}>
              <CardContent
                sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
              >
                <Box>
                  <Typography variant="body1">{link.url}</Typography>
                  {link.addToHeader && (
                    <Typography variant="caption" color="text.secondary">
                      (Added to header)
                    </Typography>
                  )}
                </Box>
                <Box>
                  <IconButton onClick={() => handleEdit(index)} color="primary">
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(index)} color="error">
                    <Delete />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default WebsitesSection;
