import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Card,
  CardContent,
  CardActions,
  IconButton,
  AppBar,
  Toolbar,
} from "@mui/material";
import { Edit, Delete, ArrowBack } from "@mui/icons-material";
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

const CustomSectionPage = () => {
  const { name } = useParams();
  const navigate = useNavigate();
  const { sections } = useSections();

  const [description, setDescription] = useState("");
  const [savedItems, setSavedItems] = useState([]);
  const [editIndex, setEditIndex] = useState(null);

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
    const stored = JSON.parse(localStorage.getItem(`custom_${name}`)) || [];
    setSavedItems(stored);
  }, [name]);

  useEffect(() => {
    localStorage.setItem(`custom_${name}`, JSON.stringify(savedItems));
  }, [savedItems, name]);

 

 // In CustomSectionPage.js
useEffect(() => {
  const userId = localStorage.getItem("userId");
  if (userId) {
    const userCustomKey = `custom_${userId}_${name}`;
    const stored = JSON.parse(localStorage.getItem(userCustomKey)) || { items: [] };
    setSavedItems(stored.items || []);
    console.log("📥 Loaded custom section for user:", userId, "Section:", name, stored);
  }
}, [name]);

useEffect(() => {
  const userId = localStorage.getItem("userId");
  if (userId && savedItems.length > 0) {
    const userCustomKey = `custom_${userId}_${name}`;
    const dataToStore = {
      sectionName: name,
      items: savedItems,
      userId: userId,
      lastUpdated: new Date().toISOString()
    };
    localStorage.setItem(userCustomKey, JSON.stringify(dataToStore));
    console.log("💾 Saved custom section for user:", userId, "Section:", name, dataToStore);
  }
}, [savedItems, name]);

const handleSave = () => {
  if (!description.trim()) return;

  const userId = localStorage.getItem("userId");
  if (!userId) {
    alert("Please login to save custom sections");
    return;
  }

  if (editIndex !== null) {
    const updated = [...savedItems];
    updated[editIndex] = description;
    setSavedItems(updated);
    setEditIndex(null);
  } else {
    setSavedItems([...savedItems, description]);
  }
  setDescription("");
  
  // Update the current custom sections storage to ensure Resume3 has latest data
  const currentCustomSections = JSON.parse(localStorage.getItem(`current_custom_sections_${userId}`)) || [];
  if (!currentCustomSections.includes(name)) {
    currentCustomSections.push(name);
    localStorage.setItem(`current_custom_sections_${userId}`, JSON.stringify(currentCustomSections));
    console.log("🔄 Updated current custom sections with:", name);
  }
};

  const handleEdit = (index) => {
    setDescription(savedItems[index]);
    setEditIndex(index);
  };

  const handleDelete = (index) => {
    const updated = savedItems.filter((_, i) => i !== index);
    setSavedItems(updated);
  };

  const handleSaveAndNext = () => {
    const currentIndex = sections.indexOf(name);

    if (currentIndex < sections.length - 1) {
      const nextSection = sections[currentIndex + 1];
      if (sectionRoutes[nextSection]) {
        navigate(sectionRoutes[nextSection], {
          state: { selectedTemplate, selectedTheme },
        });
      } else {
        navigate(`/custom-section/${encodeURIComponent(nextSection)}`, {
          state: { selectedTemplate, selectedTheme },
        });
      }
    } else {
      navigate("/mainpage", {
        state: { selectedTemplate, selectedTheme },
      });
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
      {/* Header */}
      <AppBar position="static" sx={{ backgroundColor: "#002B5B" }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={() => navigate(-1)}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            {name}
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Content */}
      <Box sx={{ p: 4, display: "flex", justifyContent: "center" }}>
        <Paper sx={{ p: 4, width: "750px", borderRadius: 3 }}>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Add details for your custom section:
          </Typography>

          <TextField
            placeholder={`Describe your ${name}...`}
            multiline
            rows={4}
            fullWidth
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            variant="outlined"
          />

          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
            <Button variant="outlined" onClick={() => navigate(-1)}>
              Back
            </Button>
            <Box sx={{ display: "flex", gap: 2 }}>
              <Button variant="contained" color="secondary" onClick={handleSave}>
                {editIndex !== null ? "Update" : "Save"}
              </Button>
              <Button variant="contained" color="primary" onClick={handleSaveAndNext}>
                Save & Next
              </Button>
            </Box>
          </Box>

          {/* Saved Items */}
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              Saved {name}
            </Typography>
            {savedItems.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                No {name} added yet.
              </Typography>
            ) : (
              savedItems.map((item, index) => (
                <Card key={index} sx={{ mb: 2 }}>
                  <CardContent>
                    <Typography>{item}</Typography>
                  </CardContent>
                  <CardActions>
                    <IconButton onClick={() => handleEdit(index)}>
                      <Edit color="primary" />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(index)}>
                      <Delete color="error" />
                    </IconButton>
                  </CardActions>
                </Card>
              ))
            )}
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default CustomSectionPage;
