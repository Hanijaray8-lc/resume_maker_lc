import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Grid,
  TextField,
  Typography,
  IconButton,
  Slider,
  Card,
  CardContent,
  CardActions,
  AppBar,
  Toolbar,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate, useLocation } from "react-router-dom";
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

const SoftwareSkills = () => {
  const [skills, setSkills] = useState([]);
  const [currentSkill, setCurrentSkill] = useState({ name: "", level: 50 });
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
    const saved = localStorage.getItem("softwareSkills");
    if (saved) setSkills(JSON.parse(saved));
  }, []);

  const handleChange = (field, value) => {
    setCurrentSkill((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (!currentSkill.name.trim()) return;

    let updatedSkills;
    if (editIndex !== null) {
      updatedSkills = [...skills];
      updatedSkills[editIndex] = currentSkill;
      setEditIndex(null);
    } else {
      updatedSkills = [...skills, currentSkill];
    }

    setSkills(updatedSkills);
    localStorage.setItem("softwareSkills", JSON.stringify(updatedSkills));
    setCurrentSkill({ name: "", level: 50 });
  };

  const handleEdit = (index) => {
    setCurrentSkill(skills[index]);
    setEditIndex(index);
  };

  const handleDelete = (index) => {
    const updated = skills.filter((_, i) => i !== index);
    setSkills(updated);
    localStorage.setItem("softwareSkills", JSON.stringify(updated));
  };

  const handleNext = () => {
    const currentSection = "Software";
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
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Software Skills
          </Typography>
        </Toolbar>
      </AppBar>

      <Box sx={{ p: 4, ml: 3 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          What software skills do you have?
        </Typography>

        {/* Input for skill */}
        <Grid container spacing={2} alignItems="center" sx={{ mb: 3 }}>
          <Grid item xs={4}>
            <TextField
              fullWidth
              placeholder="Skill name"
              value={currentSkill.name}
              onChange={(e) => handleChange("name", e.target.value)}
            />
          </Grid>

          <Grid item>
            <Slider
              value={currentSkill.level}
              onChange={(e, newVal) => handleChange("level", newVal)}
              min={0}
              max={100}
              step={5}
              valueLabelDisplay="auto"
              sx={{
                width: "200px",
                height: 6,
                "& .MuiSlider-thumb": {
                  borderRadius: "4px",
                  width: 20,
                  height: 10,
                },
              }}
            />
          </Grid>
        </Grid>

        <Box sx={{ display: "flex", gap: 2, mb: 4 }}>
          <Button variant="contained" color="primary" onClick={handleSave}>
            {editIndex !== null ? "Update" : "Save"}
          </Button>
          <Button variant="contained" color="secondary" onClick={handleNext}>
            Next
          </Button>
        </Box>

        {/* Saved skills cards */}
        <Box mt={2}>
          <Typography variant="h6" mb={2}>
            Saved Skills
          </Typography>
          {skills.map((skill, index) => (
            <Card key={index} sx={{ mb: 2, boxShadow: 2 }}>
              <CardContent>
                <Typography variant="subtitle1" fontWeight="bold">
                  {skill.name}
                </Typography>
                <Typography variant="body2">Level: {skill.level}%</Typography>
              </CardContent>
              <CardActions>
                <IconButton color="primary" onClick={() => handleEdit(index)}>
                  <EditIcon />
                </IconButton>
                <IconButton color="error" onClick={() => handleDelete(index)}>
                  <DeleteIcon />
                </IconButton>
              </CardActions>
            </Card>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default SoftwareSkills;
