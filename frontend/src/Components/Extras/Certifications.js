import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  IconButton,
  Divider,
  Card,
  CardContent,
  CardActions,
  AppBar,
  Toolbar,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
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

const CertificationsForm = () => {
  const [certification, setCertification] = useState({ name: "", provider: "", year: "" });
  const [savedCertifications, setSavedCertifications] = useState([]);
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
    const saved = localStorage.getItem("certificationsList");
    if (saved) setSavedCertifications(JSON.parse(saved));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCertification({ ...certification, [name]: value });
  };

  const handleSave = () => {
    if (!certification.name.trim() || !certification.provider.trim() || !certification.year.trim()) return;

    const updatedList =
      editIndex !== null
        ? savedCertifications.map((c, i) => (i === editIndex ? certification : c))
        : [...savedCertifications, certification];

    setSavedCertifications(updatedList);
    localStorage.setItem("certificationsList", JSON.stringify(updatedList));
    setCertification({ name: "", provider: "", year: "" });
    setEditIndex(null);
  };

  const handleEdit = (index) => {
    setCertification(savedCertifications[index]);
    setEditIndex(index);
  };

  const handleDelete = (index) => {
    const updatedList = savedCertifications.filter((_, i) => i !== index);
    setSavedCertifications(updatedList);
    localStorage.setItem("certificationsList", JSON.stringify(updatedList));
  };

  const handleNext = () => {
    const currentSection = "Certifications";
    const currentIndex = sections.indexOf(currentSection);

    if (currentIndex < sections.length - 1) {
      const nextSection = sections[currentIndex + 1];
      navigate(sectionRoutes[nextSection], { state: { selectedTemplate, selectedTheme } });
    } else {
      navigate("/mainpage", { state: { selectedTemplate, selectedTheme } });
    }
  };

  return (
    <Box display="flex" bgcolor="#f9fafc" minHeight="100vh">
      {/* Sidebar can be added here if you have one */}
      <Box flex={1}>
        {/* Header / AppBar */}
        <AppBar position="static" sx={{ backgroundColor: "#002B5B" }}>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={() => navigate(-1)}>
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Certifications
            </Typography>
          </Toolbar>
        </AppBar>

        {/* Main Content */}
        <Container maxWidth="lg" sx={{ mt: 5 }}>
          <Grid container spacing={4}>
            {/* Form */}
            <Grid item xs={12} md={5}>
              <Paper elevation={4} sx={{ p: 4, borderRadius: 3, bgcolor: "white" }}>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold", color: "#1976d2" }}>
                  Add Certification
                </Typography>
                <Divider sx={{ mb: 3 }} />
                <TextField
                  label="Certification Name"
                  name="name"
                  fullWidth
                  value={certification.name}
                  onChange={handleChange}
                  sx={{ mb: 2 }}
                />
                <TextField
                  label="Provider"
                  name="provider"
                  fullWidth
                  value={certification.provider}
                  onChange={handleChange}
                  sx={{ mb: 2 }}
                />
                <TextField
                  label="Year"
                  name="year"
                  type="number"
                  fullWidth
                  value={certification.year}
                  onChange={handleChange}
                  sx={{ mb: 2 }}
                />
                <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{ flex: 1, borderRadius: 2, py: 1.2, fontWeight: "bold" }}
                    onClick={handleSave}
                  >
                    {editIndex !== null ? "Update Certification" : "Save Certification"}
                  </Button>
                  <Button
                    variant="contained"
                    color="success"
                    sx={{ flex: 1, borderRadius: 2, py: 1.2, fontWeight: "bold" }}
                    onClick={handleNext}
                  >
                    Next
                  </Button>
                </Box>
              </Paper>
            </Grid>

            {/* Display List */}
            <Grid item xs={12} md={7}>
              <Paper elevation={4} sx={{ p: 4, borderRadius: 3, bgcolor: "white" }}>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold", color: "#1976d2" }}>
                  Saved Certifications
                </Typography>
                <Divider sx={{ mb: 3 }} />
                {savedCertifications.length > 0 ? (
                  savedCertifications.map((cert, index) => (
                    <Card key={index} sx={{ mb: 2, boxShadow: 2 }}>
                      <CardContent>
                        <Typography variant="h6">{cert.name}</Typography>
                        <Typography variant="body2" color="textSecondary">
                          {cert.provider} • Year: {cert.year}
                        </Typography>
                      </CardContent>
                      <CardActions>
                        <IconButton onClick={() => handleEdit(index)} color="primary">
                          <EditIcon />
                        </IconButton>
                        <IconButton onClick={() => handleDelete(index)} color="error">
                          <DeleteIcon />
                        </IconButton>
                      </CardActions>
                    </Card>
                  ))
                ) : (
                  <Typography variant="body2" color="textSecondary" sx={{ mt: 2, textAlign: "center" }}>
                    No certifications added yet.
                  </Typography>
                )}
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default CertificationsForm;
