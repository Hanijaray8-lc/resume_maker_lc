import React, { useState, useEffect } from "react";
import {
  Container,
  Box,
  Typography,
  Button,
  TextField,
  useTheme,
  useMediaQuery,
  Drawer,
  IconButton,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import MenuIcon from "@mui/icons-material/Menu";

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
import Sidebar from "./Sidebar";

const steps = [
  "Heading",
  "Work history",
  "Education",
  "Skills",
  "Summary",
  "Finalize",
];

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

const Skills = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [selectedTemplate, setSelectedTemplate] = useState(1);
  const [selectedTheme, setSelectedTheme] = useState("#1a2b47");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    currentPosition:"",
    city: "",
    country: "India",
    pinCode: "",
    phone: "",
    email: "",
    linkedIn: "",
    website: "",
    drivingLicence: "",
  });
  const [preview, setPreview] = useState("");
  const [skills, setSkills] = useState("");
  const [skillsList, setSkillsList] = useState([]);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Load selected template + user data
  useEffect(() => {
    if (location.state) {
      const { selectedTemplate: template, selectedTheme: theme } = location.state;
      if (template) setSelectedTemplate(template);
      if (theme) setSelectedTheme(theme);
    }

    // Fetch contact data
    const fetchContactData = async () => {
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
            currentPosition:res.data.currentPosition ||"",
            city: res.data.city || "",
            country: res.data.country || "India",
            pinCode: res.data.pinCode || "",
            phone: res.data.phone || "",
            email: res.data.email || "",
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
      }
    };

    fetchContactData();
  }, [location.state]);

  const SelectedResumeComponent = templateComponents[selectedTemplate];

  const getResumeProps = () => {
    switch (selectedTemplate) {
      case 2:
        return { color: selectedTheme, formData, photo: preview };
      case 3:
        return {
          color: typeof selectedTheme === "object" ? selectedTheme.primary : selectedTheme,
          formData,
          photo: preview,
        };
      case 4:
        return {
          theme: selectedTheme,
          color: typeof selectedTheme === "object" ? selectedTheme.primary : selectedTheme,
          formData,
          photo: preview,
        };
      case 7:
        return {
          theme: selectedTheme,
          color: typeof selectedTheme === "object" ? selectedTheme.highlight : selectedTheme,
          formData,
          photo: preview,
        };
      case 8:
        return { theme: selectedTheme, formData, photo: preview };
      default:
        return { color: selectedTheme, formData, photo: preview };
    }
  };

  const handleAddSkill = () => {
    if (skills.trim() !== "") {
      setSkillsList([...skillsList, skills]);
      setSkills("");
    }
  };

  const handleNext = () => {
    // Save skills to backend/localStorage here
    console.log("Skills Saved:", skillsList);
    navigate("/SkillSection", {
      state: { selectedTemplate, selectedTheme },
    });
  };

  const toggleMobileSidebar = () => {
    setMobileSidebarOpen(!mobileSidebarOpen);
  };

  return (
    <Box display="flex" minHeight="100vh">
      {/* Desktop Sidebar */}
      {!isMobile && <Sidebar />}

      {/* Mobile Sidebar Drawer */}
      {isMobile && (
        <>
          {/* Hamburger Menu Button */}
          <IconButton
            onClick={toggleMobileSidebar}
            sx={{
              position: "fixed",
              top: 16,
              left: 16,
              zIndex: 1300,
              backgroundColor: "white",
              boxShadow: 2,
              "&:hover": {
                backgroundColor: "grey.100",
              },
            }}
          >
            <MenuIcon />
          </IconButton>

          {/* Mobile Drawer */}
          <Drawer
            variant="temporary"
            open={mobileSidebarOpen}
            onClose={toggleMobileSidebar}
            ModalProps={{
              keepMounted: true,
            }}
            sx={{
              display: { xs: "block", md: "none" },
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: 280,
                backgroundColor: "#f5f5f5",
              },
            }}
          >
            <Sidebar onMobileClose={toggleMobileSidebar} />
          </Drawer>
        </>
      )}

      {/* Main Content */}
      <Container 
        maxWidth="md" 
        sx={{ 
          p: isSmallMobile ? 2 : isMobile ? 3 : 5,
          width: "100%",
          marginLeft: isMobile ? 0 : "auto",
          marginRight: isMobile ? 0 : "auto",
          pt: isMobile ? 8 : 5,
        }}
      >
        {/* Back Button */}
        <Typography
          variant="body2"
          sx={{
            color: "#002B5B",
            fontWeight: "bold",
            mb: 1,
            cursor: "pointer",
            "&:hover": {
              color: "#e91e63",
              textDecoration: "underline",
            },
            transition: "color 0.3s ease",
            fontSize: isSmallMobile ? "0.875rem" : "inherit",
          }}
          onClick={() => navigate(-1)}
        >
          ← Go Back
        </Typography>

        {/* Title */}
        <Typography 
          variant={isMobile ? "h6" : "h5"} 
          fontWeight="bold" 
          gutterBottom
          sx={{ fontSize: isSmallMobile ? "1.25rem" : "inherit" }}
        >
          Next, let's take care of your
        </Typography>
        <Typography 
          variant={isMobile ? "h5" : "h4"} 
          fontWeight="bold" 
          gutterBottom
          sx={{ fontSize: isSmallMobile ? "1.5rem" : "inherit" }}
        >
          Skills
        </Typography>

        {/* Subtitle */}
        <Typography 
          variant="body1" 
          color="text.secondary" 
          gutterBottom
          sx={{ 
            fontSize: isSmallMobile ? "0.875rem" : "inherit",
            lineHeight: 1.6,
          }}
        >
          Employers scan skills for relevant keywords. We'll help you choose the best ones.
        </Typography>
        
        <Typography 
          sx={{ 
            color: "#0a316c", 
            fontWeight: "bold", 
            mt: 2,
            fontSize: isSmallMobile ? "0.875rem" : "inherit"
          }}
        >
          ✦ Our AI now makes writing easier!
        </Typography>
        <Typography 
          variant="body2" 
          color="text.secondary" 
          gutterBottom
          sx={{ 
            fontSize: isSmallMobile ? "0.8rem" : "inherit",
            lineHeight: 1.6,
          }}
        >
          We'll help you fix mistakes or rephrase sentences to suit your needs.
        </Typography>


        {/* Skills List */}
        {skillsList.length > 0 && (
          <Box sx={{ mt: 2, mb: 3 }}>
            <Typography 
              variant="body1" 
              fontWeight="bold" 
              sx={{ 
                mb: 1, 
                fontSize: isSmallMobile ? "0.875rem" : "inherit" 
              }}
            >
              Your Skills:
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {skillsList.map((skill, index) => (
                <Box
                  key={index}
                  sx={{
                    backgroundColor: "#e0e0e0",
                    borderRadius: 16,
                    px: isSmallMobile ? 1.5 : 2,
                    py: isSmallMobile ? 0.75 : 1,
                    transition: "all 0.2s ease",
                    "&:hover": {
                      backgroundColor: "#d5d5d5",
                      transform: "scale(1.05)",
                    }
                  }}
                >
                  <Typography 
                    variant="body2"
                    sx={{ fontSize: isSmallMobile ? "0.75rem" : "0.875rem" }}
                  >
                    {skill}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        )}

        {/* Resume Preview */}
        <Box
          sx={{
            mt: isMobile ? 3 : 4,
            display: "flex",
            justifyContent: isMobile ? "flex-start" : "center",
            maxHeight: isMobile ? 300 : 400,
            overflow: "hidden",
            paddingLeft: isMobile ? "10%" : 0,
          }}
        >
          <Box
            sx={{
              width: "100%",
              maxWidth: 600,
              transform: isSmallMobile ? "scale(0.25)" : isMobile ? "scale(0.3)" : "scale(0.3)",
              transformOrigin: isMobile ? "top left" : "top center",
            }}
          >
            <SelectedResumeComponent {...getResumeProps()} />
          </Box>
        </Box>



        {/* Bottom Navigation */}
        <Box
          sx={{
            mt: isMobile ? 4 : 6,
            display: "flex",
            gap: 3,
            flexDirection: isMobile ? "row" : "row",
            alignItems: "center",
            justifyContent: isMobile ? "space-between" : "center",
            width: "100%",
            maxWidth: isMobile ? "100%" : "400px",
            margin: isMobile ? "0" : "0 auto",
          }}
        >
          <Button 
            variant="outlined" 
            sx={{ 
              px: isMobile ? 3 : 5, 
              borderRadius: 3, 
              fontWeight: "bold", 
              height: 45,
              width: isMobile ? "48%" : "auto",
              minWidth: isMobile ? "auto" : 120,
              "&:hover": {
                borderColor: "#e91e63",
                color: "#e91e63",
                backgroundColor: "rgba(233, 30, 99, 0.04)",
              }
            }}
          >
            Preview
          </Button>
          <Button
            variant="contained"
            sx={{
              px: isMobile ? 3 : 5,
              borderRadius: 3,
              fontWeight: "bold",
              height: 45,
              backgroundColor: "#e91e63",
              width: isMobile ? "48%" : "auto",
              minWidth: isMobile ? "auto" : 120,
              "&:hover": { 
                backgroundColor: "#d81b60",
                transform: "translateY(-2px)",
                boxShadow: "0 4px 12px rgba(233, 30, 99, 0.3)",
              },
              transition: "all 0.3s ease",
            }}
            onClick={handleNext}
          >
            Next
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default Skills;