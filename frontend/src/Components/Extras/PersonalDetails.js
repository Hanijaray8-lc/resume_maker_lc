import React, { useState, useEffect } from "react";
import {
  Container,
  Grid,
  TextField,
  Typography,
  Button,
  Box,
  Avatar,
  Paper,
  AppBar,
  Toolbar,
  IconButton,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
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

const PersonalDetails = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    city: "",
    country: "India",
    pinCode: "",
    phone: "",
    email: "",
  });

  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState("");

  const { sections, currentIndex, goNext } = useSections();
  const navigate = useNavigate();
  const location = useLocation();

  const [selectedTemplate, setSelectedTemplate] = useState(1);
  const [selectedTheme, setSelectedTheme] = useState("#1a2b47");

  useEffect(() => {
    if (location.state) {
      const { selectedTemplate: template, selectedTheme: theme } = location.state;
      if (template) setSelectedTemplate(template);
      if (theme) setSelectedTheme(theme);
    }
  }, [location.state]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await axios.get("https://resume-maker-lc.onrender.com/api/contact/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data) {
          setFormData({
            firstName: res.data.firstName || "",
            lastName: res.data.lastName || "",
            city: res.data.city || "",
            country: res.data.country || "India",
            pinCode: res.data.pinCode || "",
            phone: res.data.phone || "",
            email: res.data.email || "",
          });

          if (res.data.photo) {
            setPreview(
              res.data.photo.startsWith("http")
                ? res.data.photo
                : `https://resume-maker-lc.onrender.com${res.data.photo}`
            );
          }
        }
      } catch (err) {
        console.error("Error fetching details", err);
        if (err.response?.status === 403) {
          localStorage.removeItem("token");
          alert("Session expired. Please login again.");
          navigate("/login");
        }
      }
    };

    fetchData();
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setPhoto(file);
    if (file) setPreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    try {
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
        alert("First name, Last name, Email, and Phone are required!");
        return false;
      }

      const token = localStorage.getItem("token");
      const data = new FormData();
      Object.keys(formData).forEach((key) => data.append(key, formData[key]));
      if (photo) data.append("photo", photo);

      await axios.post("https://resume-maker-lc.onrender.com/api/contact/save", data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Personal details saved successfully!");
      return true;
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("Error saving personal details");
      return false;
    }
  };

  const handleSaveNext = async () => {
    const saved = await handleSave();
    if (!saved) return;

    goNext();
    const nextSection = sections[currentIndex + 1];
    if (nextSection) {
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
    <Box sx={{ display: "flex" }}>
      {/* Header */}
      <AppBar position="fixed" sx={{ backgroundColor: "#002B5B", zIndex: 1200 }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={() => navigate(-1)}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Personal Details
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ mt: 10, ml: { xs: "60px", sm: "240px" } }}>
        <Paper elevation={0} sx={{ p: 4 }}>
          <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ color: "#24c6ef" }}>
            Personal Details
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Update your basic personal information here.
          </Typography>

          <Grid container spacing={3} sx={{ mt: 2 }}>
            <Grid item xs={12} sm={3} sx={{ textAlign: "center" }}>
              <Avatar src={preview} sx={{ width: 100, height: 100, mx: "auto", mb: 2 }} />
              <Button
                component="label"
                variant="outlined"
                startIcon={<CloudUploadIcon />}
                sx={{ textTransform: "none" }}
              >
                Upload Photo
                <input hidden accept="image/*" type="file" onChange={handleFileChange} />
              </Button>
            </Grid>

            <Grid item xs={12} sm={9}>
              <Grid container spacing={2}>
                {[
                  { label: "First Name", name: "firstName", required: true },
                  { label: "Last Name", name: "lastName", required: true },
                  { label: "City", name: "city" },
                  { label: "Country", name: "country" },
                  { label: "Pin Code", name: "pinCode" },
                  { label: "Phone", name: "phone", required: true },
                  { label: "Email", name: "email", required: true },
                ].map((field) => (
                  <Grid item xs={12} sm={field.name === "country" || field.name === "pinCode" ? 3 : 6} key={field.name}>
                    <TextField
                      fullWidth
                      label={field.label}
                      name={field.name}
                      value={formData[field.name]}
                      onChange={handleChange}
                      required={field.required || false}
                    />
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>

          <Box sx={{ mt: 4, display: "flex", justifyContent: "space-between" }}>
            <Button variant="outlined" onClick={() => navigate(-1)}>
              Back
            </Button>
            <Box sx={{ display: "flex", gap: 2 }}>
              <Button variant="contained" color="success" onClick={handleSave}>
                Save
              </Button>
              <Button
                variant="contained"
                sx={{ backgroundColor: "#24c6ef", "&:hover": { backgroundColor: "#1daed8" } }}
                onClick={handleSaveNext}
              >
                Save & Next
              </Button>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default PersonalDetails;
