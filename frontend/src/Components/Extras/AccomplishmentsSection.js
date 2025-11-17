import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Paper,
  Typography,
  IconButton,
  TextField,
  Card,
  CardContent,
  CardActions,
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

const preWrittenExamples = [
  "Achieved [Result] by introducing [Software] for [Type] tasks.",
  "Achieved [Result] through effectively helping with [Task].",
  "Collaborated with team of [Number] in the development of [Project name].",
  "Resolved product issue through consumer testing.",
  "Used Microsoft Excel to develop inventory tracking spreadsheets.",
  "Achieved [Result] by completing [Task] with accuracy and efficiency.",
  "Supervised team of [Number] staff members.",
  "Documented and resolved [Issue] which led to [Results].",
];

const AccomplishmentsSection = () => {
  const [accomplishments, setAccomplishments] = useState("");
  const [savedAccomplishments, setSavedAccomplishments] = useState([]);
  const [editIndex, setEditIndex] = useState(null);

  const navigate = useNavigate();
  const { sections } = useSections();
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

  // ✅ Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("accomplishmentsList");
    if (saved) {
      setSavedAccomplishments(JSON.parse(saved));
    }
  }, []);

  const handleAddExample = (example) => {
    setAccomplishments((prev) => (prev ? prev + "\n" + example : example));
  };

  const handleChange = (e) => {
    setAccomplishments(e.target.value);
  };

  const handleSave = () => {
    if (!accomplishments.trim()) return;

    let updatedList;
    if (editIndex !== null) {
      updatedList = [...savedAccomplishments];
      updatedList[editIndex] = accomplishments;
      setEditIndex(null);
    } else {
      updatedList = [...savedAccomplishments, accomplishments];
    }

    setSavedAccomplishments(updatedList);
    localStorage.setItem("accomplishmentsList", JSON.stringify(updatedList));
    setAccomplishments("");
  };

  const handleEdit = (index) => {
    setAccomplishments(savedAccomplishments[index]);
    setEditIndex(index);
  };

  const handleDelete = (index) => {
    const updatedList = savedAccomplishments.filter((_, i) => i !== index);
    setSavedAccomplishments(updatedList);
    localStorage.setItem("accomplishmentsList", JSON.stringify(updatedList));
  };

  const handleNext = () => {
    const currentSection = "Accomplishments";
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
      {/* ✅ Header with Back button */}
      <AppBar position="static" sx={{ backgroundColor: "#002B5B" }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={() => navigate(-1)}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Accomplishments
          </Typography>
        </Toolbar>
      </AppBar>

      {/* ✅ Main content */}
      <Box sx={{ display: "flex", gap: 4, mt: 4, px: 4, ml: "280px" }}>
        {/* Left side: examples */}
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6" mb={2}>
            Pre-written Examples
          </Typography>
          {preWrittenExamples.map((example, index) => (
            <Paper
              key={index}
              sx={{
                p: 1,
                mb: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                cursor: "pointer",
              }}
              onClick={() => handleAddExample(example)}
            >
              <Typography variant="body2">{example}</Typography>
              <IconButton size="small">
                <AddIcon fontSize="small" />
              </IconButton>
            </Paper>
          ))}
        </Box>

        {/* Right side: textarea */}
        <Box sx={{ flex: 2 }}>
          <Typography variant="h6" mb={2}>
            Tell us about your accomplishments
          </Typography>
          <TextField
            multiline
            minRows={5}
            fullWidth
            value={accomplishments}
            onChange={handleChange}
            placeholder="Write your accomplishments here..."
            variant="outlined"
          />

          <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
            <Button variant="contained" color="primary" onClick={handleSave}>
              {editIndex !== null ? "Update" : "Save"}
            </Button>

            <Button
              variant="contained"
              sx={{
                backgroundColor: "#e91e63",
                "&:hover": { backgroundColor: "#d81b60" },
              }}
              onClick={handleNext}
            >
              Next
            </Button>
          </Box>

          {/* Saved accomplishments list */}
          <Box mt={4}>
            <Typography variant="h6" mb={2}>
              Saved Accomplishments
            </Typography>
            {savedAccomplishments.map((item, index) => (
              <Card key={index} sx={{ mb: 2, boxShadow: 2 }}>
                <CardContent>
                  <Typography variant="body2" whiteSpace="pre-line">
                    {item}
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
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default AccomplishmentsSection;
