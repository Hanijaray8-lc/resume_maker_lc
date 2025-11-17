import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Typography,
  TextField,
  IconButton,
  Card,
  CardContent,
  CardActions,
  Grid,
  MenuItem,
  Select,
  Chip,
  AppBar,
  Toolbar,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useSections } from "./SectionContext";

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

const languageOptions = ["English", "Hindi", "Tamil", "Telugu", "Marathi"];
const levelOptions = ["Beginner", "Intermediate", "Fluent", "Native"];

const LanguagesSection = () => {
  const [languages, setLanguages] = useState([]);
  const [newLanguage, setNewLanguage] = useState("");
  const [editIndex, setEditIndex] = useState(null);

  const { sections } = useSections();
  const navigate = useNavigate();
  const location = useLocation();

  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [selectedTheme, setSelectedTheme] = useState(null);

  useEffect(() => {
    if (location.state) {
      const { selectedTemplate: template, selectedTheme: theme } = location.state;
      if (template) setSelectedTemplate(template);
      if (theme) setSelectedTheme(theme);
    }
  }, [location.state]);

  useEffect(() => {
    const saved = localStorage.getItem("languagesList");
    if (saved) setLanguages(JSON.parse(saved));
  }, []);

  const handleQuickAdd = (lang) => {
    if (!languages.find((l) => l.name === lang)) {
      setLanguages([...languages, { name: lang, level: "" }]);
    }
  };

  const handleLevelChange = (index, newLevel) => {
    const updated = [...languages];
    updated[index].level = newLevel;
    setLanguages(updated);
  };

  const handleAddNewLanguage = () => {
    if (newLanguage && !languages.find((l) => l.name === newLanguage)) {
      setLanguages([...languages, { name: newLanguage, level: "" }]);
      setNewLanguage("");
    }
  };

  const handleSave = () => {
    localStorage.setItem("languagesList", JSON.stringify(languages));
  };

  const handleEdit = (index) => {
    setNewLanguage(languages[index].name);
    setEditIndex(index);
  };

  const handleUpdate = () => {
    if (editIndex !== null && newLanguage.trim()) {
      const updated = [...languages];
      updated[editIndex].name = newLanguage;
      setLanguages(updated);
      localStorage.setItem("languagesList", JSON.stringify(updated));
      setNewLanguage("");
      setEditIndex(null);
    }
  };

  const handleDelete = (index) => {
    const updated = languages.filter((_, i) => i !== index);
    setLanguages(updated);
    localStorage.setItem("languagesList", JSON.stringify(updated));
  };

  const handleNext = () => {
    const currentSection = "Languages";
    const currentIndex = sections.indexOf(currentSection);

    if (currentIndex < sections.length - 1) {
      const nextSection = sections[currentIndex + 1];
      navigate(sectionRoutes[nextSection], {
        state: { selectedTemplate, selectedTheme },
      });
    } else {
      navigate("/mainpage", { state: { selectedTemplate, selectedTheme } });
    }
  };

  return (
    <Box>
      {/* Header */}
      <AppBar position="static" sx={{ backgroundColor: "#002B5B" }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={() => navigate(-1)}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Languages
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Main content */}
      <Box sx={{ p: 4, ml: 0 }}>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Include your native language and additional languages you speak.
        </Typography>

        {/* Quick add */}
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 3 }}>
          {languageOptions.map((lang, idx) => (
            <Button
              key={idx}
              variant="outlined"
              endIcon={<AddIcon />}
              onClick={() => handleQuickAdd(lang)}
              sx={{ borderRadius: "20px", textTransform: "none", px: 2 }}
            >
              {lang}
            </Button>
          ))}
        </Box>

        {/* Add custom */}
        <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
          <TextField
            label="Add new language"
            variant="outlined"
            size="small"
            value={newLanguage}
            onChange={(e) => setNewLanguage(e.target.value)}
          />
          {editIndex !== null ? (
            <Button variant="contained" onClick={handleUpdate}>
              Update
            </Button>
          ) : (
            <Button variant="contained" onClick={handleAddNewLanguage}>
              Add
            </Button>
          )}
        </Box>

        {/* Saved languages */}
        <Box>
          {languages.map((lang, idx) => (
            <Card key={idx} sx={{ mb: 2, boxShadow: 2 }}>
              <CardContent>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={4}>
                    <Chip label={lang.name} color="primary" />
                  </Grid>
                  <Grid item xs={4}>
                    <Select
                      fullWidth
                      value={lang.level}
                      displayEmpty
                      onChange={(e) => handleLevelChange(idx, e.target.value)}
                    >
                      <MenuItem value="">Select Level</MenuItem>
                      {levelOptions.map((lvl, i) => (
                        <MenuItem key={i} value={lvl}>
                          {lvl}
                        </MenuItem>
                      ))}
                    </Select>
                  </Grid>
                </Grid>
              </CardContent>
              <CardActions>
                <IconButton color="primary" onClick={() => handleEdit(idx)}>
                  <EditIcon />
                </IconButton>
                <IconButton color="error" onClick={() => handleDelete(idx)}>
                  <DeleteIcon />
                </IconButton>
              </CardActions>
            </Card>
          ))}
        </Box>

        {/* Save + Next */}
        <Box sx={{ mt: 4, display: "flex", justifyContent: "flex-end", gap: 2 }}>
          <Button variant="contained" color="primary" onClick={handleSave}>
            Save
          </Button>
          <Button variant="contained" color="secondary" onClick={handleNext}>
            Next
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default LanguagesSection;
