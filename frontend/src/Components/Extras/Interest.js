import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  IconButton,
  AppBar,
  Toolbar,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useSections } from "./SectionContext";

const sectionRoutes = {
  "Photo, Personal Details": "/PersonalDetail",
  "Websites, Portfolios, Profiles": "/WebsiteSection",
  "Certifications": "/Certifications",
  "Languages": "/Language",
  "Accomplishments": "/AccomplishmentsSection",
  "Additional Information": "/AdditionalInfoForm",
  "Software": "/SoftWare",
  "References": "/Refferences",
  "Volunteering": "/Volunteer",
  "Interests": "/Interest",
};

const InterestPage = () => {
  const [interests, setInterests] = useState([""]);
  const [savedInterests, setSavedInterests] = useState([]);
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
    const stored = JSON.parse(localStorage.getItem("interests")) || [];
    setSavedInterests(stored);
  }, []);

  const handleChange = (index, e) => {
    const newInterests = [...interests];
    newInterests[index] = e.target.value;
    setInterests(newInterests);
  };

  const handleAddField = () => {
    setInterests([...interests, ""]);
  };

  const handleSave = () => {
    const updated = [...savedInterests, ...interests.filter((i) => i.trim() !== "")];
    setSavedInterests(updated);
    localStorage.setItem("interests", JSON.stringify(updated));
    setInterests([""]);
  };

  const handleEdit = (index) => {
    const itemToEdit = savedInterests[index];
    setInterests([itemToEdit]);
    handleDelete(index, false);
  };

  const handleDelete = (index, updateStorage = true) => {
    const updated = savedInterests.filter((_, i) => i !== index);
    setSavedInterests(updated);
    if (updateStorage) localStorage.setItem("interests", JSON.stringify(updated));
  };

  const handleNext = () => {
    const currentSection = "Interests";
    const currentIndex = sections.indexOf(currentSection);

    if (currentIndex < sections.length - 1) {
      const nextSection = sections[currentIndex + 1];
      navigate(sectionRoutes[nextSection], { state: { selectedTemplate, selectedTheme } });
    } else {
      navigate("/mainpage", { state: { selectedTemplate, selectedTheme } });
    }
  };

  const handleSkip = () => {
    const currentSection = "Interests";
    const currentIndex = sections.indexOf(currentSection);

    if (currentIndex < sections.length - 1) {
      const nextSection = sections[currentIndex + 1];
      navigate(sectionRoutes[nextSection]);
    } else {
      navigate("/mainpage");
    }
  };

  return (
    <Box display="flex" bgcolor="#f9fafc" minHeight="100vh">
      {/* Header */}
      <AppBar position="fixed" sx={{ backgroundColor: "#002B5B", zIndex: 1300 }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={() => navigate(-1)}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Add Your Interests
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Main content */}
      <Container maxWidth="md" sx={{ mt: 10, ml: "270px" }}>
        <Paper sx={{ p: 4, borderRadius: 3 }}>
          <Grid container spacing={2} sx={{ mt: 2 }}>
            {interests.map((interest, index) => (
              <Grid item xs={12} key={index}>
                <TextField
                  label={`Interest ${index + 1}`}
                  fullWidth
                  value={interest}
                  onChange={(e) => handleChange(index, e)}
                />
              </Grid>
            ))}
          </Grid>

          <Button variant="outlined" sx={{ mt: 2, mr: 1 }} onClick={handleAddField}>
            + Add Another Interest
          </Button>

          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
            <Button variant="text" color="secondary" onClick={handleSkip}>
              Skip
            </Button>
            <Box>
              <Button variant="contained" color="success" sx={{ mr: 2 }} onClick={handleSave}>
                Save
              </Button>
              <Button variant="contained" color="primary" onClick={handleNext}>
                Next
              </Button>
            </Box>
          </Box>
        </Paper>

        {/* Saved Interests */}
        {savedInterests.length > 0 && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
              Saved Interests
            </Typography>
            <Grid container spacing={2}>
              {savedInterests.map((item, index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <Card sx={{ p: 2 }}>
                    <CardContent sx={{ display: "flex", justifyContent: "space-between" }}>
                      <Typography>{item}</Typography>
                      <Box>
                        <IconButton onClick={() => handleEdit(index)}>
                          <EditIcon color="primary" />
                        </IconButton>
                        <IconButton onClick={() => handleDelete(index)}>
                          <DeleteIcon color="error" />
                        </IconButton>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default InterestPage;
