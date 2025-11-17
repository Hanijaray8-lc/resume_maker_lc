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
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate, useLocation } from "react-router-dom";
import Sidebar from "../Components/Sidebar";
import axios from "axios";

// Import all resume components
import Resume1 from "./DuplicateResume/Resume1";
import Resume2 from "./DuplicateResume/Resume2";
import Resume3 from "./DuplicateResume/Resume3";
import Resume4 from "./DuplicateResume/Resume4";
import Resume5 from "./DuplicateResume/Resume5";
import Resume6 from "./DuplicateResume/Resume6";
import Resume7 from "./DuplicateResume/Resume7";
import Resume8 from "./DuplicateResume/Resume8";
import Resume9 from "./DuplicateResume/Resume9";
import Resume10 from "./DuplicateResume/Resume10";
import Resume11 from "./DuplicateResume/Resume11";
import Resume12 from "./DuplicateResume/Resume12";
import Resume13 from "./DuplicateResume/Resume13";
import Resume14 from "./DuplicateResume/Resume14";
import Resume15 from "./DuplicateResume/Resume15";
import Resume16 from "./DuplicateResume/Resume16";
import Resume17 from "./DuplicateResume/Resume17";
import Resume18 from "./DuplicateResume/Resume18";
import Resume19 from "./DuplicateResume/Resume19";
import Resume20 from "./DuplicateResume/Resume20";  
import Resume21 from "./DuplicateResume/Resume21";
import Resume22 from "./DuplicateResume/Resume22";
import Resume23 from "./DuplicateResume/Resume23";
import Resume24 from "./DuplicateResume/Resume24";
import Resume25 from "./DuplicateResume/Resume25";
import Resume26 from "./DuplicateResume/Resume26";

const templateComponents = {
  1: Resume1,
  2: Resume2,
  3: Resume3,
  4: Resume4,
  5: Resume5,
  6: Resume6,
  7: Resume7,
  8: Resume8,
  9: Resume9,
  10: Resume10,
  11: Resume11,
  12: Resume12,
  13: Resume13,
  14: Resume14,
  15: Resume15,
  16: Resume16,
  17: Resume17, 
  18: Resume18,
  19: Resume19,
  20: Resume20,
  21: Resume21,  
  22: Resume22,     
  23: Resume23,     
  24: Resume24,     
  25: Resume25,     
  26: Resume26,     
   
};

const ContactForm = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    city: "",
    country: "India",
    pinCode: "",
    phone: "",
    email: "",
    currentPosition: "", 
    linkedIn: "",
    website: "",
    drivingLicence: "",
  });

  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState(1);
  const [selectedTheme, setSelectedTheme] = useState("#1a2b47");

  const [showLinkedIn, setShowLinkedIn] = useState(false);
  const [showWebsite, setShowWebsite] = useState(false);
  const [showDL, setShowDL] = useState(false);
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();
  const location = useLocation();

  // Get selected template and theme from navigation state
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
              currentPosition: res.data.currentPosition || "",
            linkedIn: res.data.linkedIn || "",
            website: res.data.website || "",
            drivingLicence: res.data.drivingLicence || "",
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
        console.error("Error fetching contact", err);
        if (err.response && err.response.status === 403) {
          localStorage.removeItem("token");
          alert("Session expired. Please login again.");
          navigate("/login");
        }
      }
    };

    fetchData();
  }, []);

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle photo upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setPhoto(file);
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  // Convert photo file to base64
  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const handleSave = async () => {
    try {
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
        alert("First name, Last name, Email, and Phone are required!");
        return;
      }

      const token = localStorage.getItem("token");

      // ⚡ Use FormData
      const data = new FormData();
      for (const key in formData) {
        data.append(key, formData[key]);
      }
      if (photo) {
        data.append("photo", photo);
      }

      const res = await axios.post("https://resume-maker-lc.onrender.com/api/contact/save", data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Contact saved successfully!");
      console.log(res.data);
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("Error saving contact");
    }
  };

  const SelectedResumeComponent = templateComponents[selectedTemplate];

  const getResumeProps = () => {
    switch (selectedTemplate) {
      case 2:
        return { color: selectedTheme };
      case 3:
        return { color: typeof selectedTheme === 'object' ? selectedTheme.primary : selectedTheme };
      case 4:
        return { theme: selectedTheme, color: typeof selectedTheme === 'object' ? selectedTheme.primary : selectedTheme };
      case 7:
        return { theme: selectedTheme, color: typeof selectedTheme === 'object' ? selectedTheme.highlight : selectedTheme };
      case 8:
        return { theme: selectedTheme };
      default:
        return { color: selectedTheme };
    }
  };

  return (
    <Box sx={{ display: "flex",  }}>
      <Sidebar />
      <Container maxWidth="lg"  sx={{ mt: 4, display: "flex", gap: 1, ml: { xs: "60px", sm: "240px" } }}>
        {/* Left: Contact Form */}
        <Paper elevation={0} sx={{ p: 4,  width: "70%" }}>
          <Typography
            variant="h5"
            fontWeight="bold"
            gutterBottom
            sx={{ color: "#24c6ef" }}
          >
            What's the preferred way for employers to connect with you?
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            For better communication, you must share your email and phone details.
          </Typography>

          <Grid container spacing={3} sx={{ mt: 2 }}>
            {/* Left: Avatar + Upload */}
            <Grid item xs={12} sm={3} sx={{ textAlign: "center" }}>
              <Avatar
                src={preview || (formData.photo ? `https://resume-maker-lc.onrender.com${formData.photo}` : "")}
                sx={{ width: 100, height: 100, mx: "auto", mb: 2 }}
              />

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

            {/* Right: Form Fields */}
            <Grid item xs={12} sm={9}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="First Name"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Last Name"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="City"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <TextField
                    fullWidth
                    label="Country"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <TextField
                    fullWidth
                    label="Pin Code"
                    name="pinCode"
                    value={formData.pinCode}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 22 1234 5677"
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="spatel@sample.in"
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
  <TextField
    fullWidth
    label="Current Position"
    name="currentPosition"
    value={formData.currentPosition}
    onChange={handleChange}
    placeholder="e.g., Software Engineer, Project Manager"
  />
</Grid>
              </Grid>
            </Grid>
          </Grid>

          <Box sx={{ mt: 4 }}>
            <Typography
              variant="subtitle1"
              fontWeight="bold"
              sx={{ mb: 2, color: "#555" }}
            >
              Add More Contact Details
            </Typography>

            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 2 }}>
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={() => setShowLinkedIn(!showLinkedIn)}
              >
                LinkedIn
              </Button>
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={() => setShowWebsite(!showWebsite)}
              >
                Website
              </Button>
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={() => setShowDL(!showDL)}
              >
                Driving Licence
              </Button>
            </Box>

            <Grid container spacing={2}>
              {showLinkedIn && (
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Enter LinkedIn URL"
                    name="linkedIn"
                    value={formData.linkedIn}
                    onChange={handleChange}
                    variant="outlined"
                    fullWidth
                  />
                </Grid>
              )}
              {showWebsite && (
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Enter Website URL"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    variant="outlined"
                    fullWidth
                  />
                </Grid>
              )}
              {showDL && (
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Enter Driving Licence Number"
                    name="drivingLicence"
                    value={formData.drivingLicence}
                    onChange={handleChange}
                    variant="outlined"
                    fullWidth
                  />
                </Grid>
              )}
            </Grid>
          </Box>

          {/* Bottom Buttons */}
          <Box sx={{ mt: 4, display: "flex", justifyContent: "space-between" }}>
            <Button
              variant="outlined"
              sx={{
                borderStyle: "dashed",
                color: "#555",
                borderColor: "#bbb",
                "&:hover": {
                  borderColor: "#24c6ef",
                  color: "#24c6ef",
                },
              }}
              onClick={() => navigate("/PersonalDetails")}
            >
              Optional: Personal Details
            </Button>

            <Box sx={{ display: "flex", gap: 2 }}>
              <Button variant="outlined">Preview</Button>
              <Button variant="contained" color="success" onClick={handleSave}>
                Save
              </Button>
       <Button
  variant="contained"
  sx={{
    backgroundColor: "#24c6ef",
    "&:hover": { backgroundColor: "#1daed8" },
  }}
  onClick={() => {
    handleSave();
    navigate("/WorkHistry", {
      state: { selectedTemplate, selectedTheme }, // <-- Pass here
    });
  }}
>
  Next: Work history
</Button>

            </Box>
          </Box>
        </Paper>

        {/* Right: Resume Preview */}
     <Paper elevation={0} sx={{ p: 2, width: "30%", display: "flex", flexDirection: "column" ,  height: "100vh",  overflow: "hidden"}}>
  <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ textAlign: "center" }}>
    Resume Preview
  </Typography>

  <Box
    sx={{
      flexGrow: 1,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      p: 2,
    }}
  >
   <Box
  sx={{
    transform: "scale(0.3)",
    transformOrigin: "top center",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "fit-content",
  }}
>
  <SelectedResumeComponent
    {...getResumeProps()}
    formData={formData}
    photo={preview}
  />
</Box>

  </Box>

</Paper>

      </Container>
    </Box>
  );
};

export default ContactForm;
