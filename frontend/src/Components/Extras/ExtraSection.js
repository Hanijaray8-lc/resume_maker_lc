import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { useEffect } from "react";
import {
  Box,
  Typography,
  Checkbox,
  FormControlLabel,
  TextField,
  Button,
  Grid,
  Chip,
  Container,
  Modal,
  IconButton,
  Paper,
  useTheme,
  useMediaQuery,
  Drawer,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import Sidebar from "../Sidebar";
import { useSections } from "./SectionContext";
import CloseIcon from "@mui/icons-material/Close";
import MenuIcon from "@mui/icons-material/Menu";

// Import resume components
import Resume1 from "../DuplicateResume/Resume1";
import Resume2 from "../DuplicateResume/Resume2";
import Resume3 from "../DuplicateResume/Resume3";
import Resume4 from "../DuplicateResume/Resume4";
import Resume5 from "../DuplicateResume/Resume5";
import Resume6 from "../DuplicateResume/Resume6";
import Resume7 from "../DuplicateResume/Resume7";
import Resume8 from "../DuplicateResume/Resume8";
import Resume9 from "../DuplicateResume/Resume9";
import Resume10 from "../DuplicateResume/Resume10";
import Resume11 from "../DuplicateResume/Resume11";
import Resume12 from "../DuplicateResume/Resume12";
import Resume13 from "../DuplicateResume/Resume13";
import Resume14 from "../DuplicateResume/Resume14";
import Resume15 from "../DuplicateResume/Resume15";
import Resume16 from "../DuplicateResume/Resume16";
import Resume17 from "../DuplicateResume/Resume17";
import Resume18 from "../DuplicateResume/Resume18";
import Resume19 from "../DuplicateResume/Resume19";
import Resume20 from "../DuplicateResume/Resume20";  
import Resume21 from "../DuplicateResume/Resume21";
import Resume22 from "../DuplicateResume/Resume22";
import Resume23 from "../DuplicateResume/Resume23";
import Resume24 from "../DuplicateResume/Resume24";
import Resume25 from "../DuplicateResume/Resume25";
import Resume26 from "../DuplicateResume/Resume26";
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

const sectionsList = [
  "Websites, Portfolios, Profiles",
  "Certifications",
  "Languages",
  "Accomplishments",
  "Additional Information",
  "Software",
  "References",
  "Volunteering",
  "Interests",
];

// Map section name → route
const sectionRoutes = {
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

export default function ExtraSections() {
  const [selectedSections, setSelectedSections] = useState([]);
  const [customSections, setCustomSections] = useState([]);
  const [customInput, setCustomInput] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [currentCustomSections, setCurrentCustomSections] = useState([]);

  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [selectedTemplate, setSelectedTemplate] = useState(1);
  const [selectedTheme, setSelectedTheme] = useState("#1a2b47");
  const [workExperiences, setWorkExperiences] = useState([]);
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

  useEffect(() => {
    if (location.state) {
      const { selectedTemplate: template, selectedTheme: theme } = location.state;
      if (template) setSelectedTemplate(template);
      if (theme) setSelectedTheme(theme);
    }

    // Load work experiences from localStorage
    const savedWorks = localStorage.getItem("workExperiences");
    if (savedWorks) {
      setWorkExperiences(JSON.parse(savedWorks));
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
            currentPosition:res.data.currentPosition || "",
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
  const userId = localStorage.getItem("userId");
  if (userId) {
    localStorage.removeItem(`current_custom_sections_${userId}`);
    console.log("🧹 Cleared previous current custom sections");
  }
    fetchContactData();
  }, [location.state]);

  const { setSelectedSections: saveSections } = useSections();

  const SelectedResumeComponent = templateComponents[selectedTemplate];

  const getResumeProps = () => {
    switch (selectedTemplate) {
      case 2:
        return { color: selectedTheme, workExperiences, formData, photo: preview };
      case 3:
        return { 
          color: typeof selectedTheme === 'object' ? selectedTheme.primary : selectedTheme, 
          workExperiences, 
          formData, 
          photo: preview 
        };
      case 4:
        return { 
          theme: selectedTheme, 
          color: typeof selectedTheme === 'object' ? selectedTheme.primary : selectedTheme, 
          workExperiences, 
          formData, 
          photo: preview 
        };
      case 7:
        return { 
          theme: selectedTheme, 
          color: typeof selectedTheme === 'object' ? selectedTheme.highlight : selectedTheme, 
          workExperiences, 
          formData, 
          photo: preview 
        };
      case 8:
        return { 
          theme: selectedTheme, 
          workExperiences, 
          formData, 
          photo: preview 
        };
      default:
        return { 
          color: selectedTheme, 
          workExperiences, 
          formData, 
          photo: preview 
        };
    }
  };

  // Toggle predefined section
  const handleToggle = (section) => {
    if (selectedSections.includes(section)) {
      setSelectedSections(selectedSections.filter((s) => s !== section));
    } else {
      setSelectedSections([...selectedSections, section]);
    }
  };

  // Add custom section
  {/*const handleAddCustom = () => {
    const trimmed = customInput.trim();
    if (trimmed && !customSections.includes(trimmed)) {
      setCustomSections([...customSections, trimmed]);
      setCustomInput("");
    }
  };*/}

  // In ExtraSections.js - Update handleAddCustom function
// Add this state in ExtraSections component

// Update handleAddCustom function
const handleAddCustom = () => {
  const trimmed = customInput.trim();
  if (trimmed && !customSections.includes(trimmed)) {
    const userId = localStorage.getItem("userId");
    if (userId) {
      // Initialize empty data for this custom section
      const userCustomKey = `custom_${userId}_${trimmed}`;
      const initialData = {
        sectionName: trimmed,
        items: [],
        userId: userId,
        created: new Date().toISOString()
      };
      localStorage.setItem(userCustomKey, JSON.stringify(initialData));
      console.log("➕ Initialized new custom section:", trimmed, "for user:", userId);
    }
    
    const updatedCustomSections = [...customSections, trimmed];
    setCustomSections(updatedCustomSections);
    
    // Store CURRENT custom sections for Resume3 to access
    if (userId) {
      localStorage.setItem(`current_custom_sections_${userId}`, JSON.stringify(updatedCustomSections));
      console.log("💾 Stored current custom sections:", updatedCustomSections);
    }
    
    setCustomInput("");
  }
};

// Update handleNext function to pass current sections
const handleNext = () => {
  const userId = localStorage.getItem("userId");
  if (userId) {
    // Save the CURRENT custom sections before navigating
    localStorage.setItem(`current_custom_sections_${userId}`, JSON.stringify(customSections));
    console.log("💾 Saved current custom sections before navigation:", customSections);
  }
  
  // Combine selected and custom sections
  const allSections = [...selectedSections, ...customSections];
  saveSections(allSections);
  
  // Find the first section
  const firstSection = allSections[0];
  
  if (firstSection) {
    if (sectionRoutes[firstSection]) {
      navigate(sectionRoutes[firstSection], {
        state: { selectedTemplate, selectedTheme },
      });
    } else {
      navigate(`/custom-section/${encodeURIComponent(firstSection)}`, {
        state: { selectedTemplate, selectedTheme },
      });
    }
  } else {
    navigate("/mainpage", {
      state: { selectedTemplate, selectedTheme },
    });
  }
};

  // Open preview modal
  const handlePreviewOpen = () => {
    setPreviewOpen(true);
  };

  // Close preview modal
  const handlePreviewClose = () => {
    setPreviewOpen(false);
  };

  // Toggle mobile sidebar
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

      {/* Main Content Section */}
      <Container 
        maxWidth="lg" 
        sx={{ 
          p: isSmallMobile ? 2 : isMobile ? 3 : 5,
          width: "100%",
          marginLeft: isMobile ? 0 : "auto",
          marginRight: isMobile ? 0 : "auto",
          pt: isMobile ? 8 : 5,
          ml: isMobile ? 0 : "280px",
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
          Do you have anything else to add?
        </Typography>

        <Typography 
          variant="body1" 
          sx={{ 
            mb: 3,
            fontSize: isSmallMobile ? "0.875rem" : "inherit"
          }}
        >
          These sections are optional.
        </Typography>

        <Box sx={{ display: "flex", flexDirection: isMobile ? "column" : "row", gap: 4 }}>
          {/* Left Side - Form Content */}
          <Box sx={{ flex: 1, maxWidth: isMobile ? "100%" : "600px" }}>
            {/* Predefined Sections */}
            <Grid container spacing={2} sx={{ width: "100%" }}>
              {sectionsList.map((section, i) => (
                <Grid item xs={12} key={i}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={selectedSections.includes(section)}
                        onChange={() => handleToggle(section)}
                        size={isSmallMobile ? "small" : "medium"}
                      />
                    }
                    label={
                      <Typography sx={{ fontSize: isSmallMobile ? "0.875rem" : "inherit" }}>
                        {section === "Languages" ? (
                          <>
                            {section}{" "}
                            <Chip
                              label="NEW"
                              color="error"
                              size="small"
                              sx={{ ml: 1 }}
                            />
                          </>
                        ) : (
                          section
                        )}
                      </Typography>
                    }
                  />
                </Grid>
              ))}
            </Grid>

            {/* Custom Sections */}
            <Box sx={{ mt: 3, display: "flex", alignItems: "center", gap: 2, flexDirection: isSmallMobile ? "column" : "row" }}>
              <TextField
                placeholder="Add Your Own Section"
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                fullWidth
                size={isSmallMobile ? "small" : "medium"}
              />
              <Button 
                variant="outlined" 
                onClick={handleAddCustom}
                sx={{ 
                  width: isSmallMobile ? "100%" : "auto",
                  minWidth: isSmallMobile ? "auto" : 100
                }}
              >
                Add
              </Button>
            </Box>

            {/* Show added custom sections */}
            {customSections.length > 0 && (
              <Box sx={{ mt: 2 }}>
                {customSections.map((section, i) => (
                  <Chip 
                    key={i} 
                    label={section} 
                    color="primary" 
                    sx={{ mr: 1, mb: 1 }} 
                    size={isSmallMobile ? "small" : "medium"}
                  />
                ))}
              </Box>
            )}

            {/* Bottom Buttons */}
            <Box 
              sx={{ 
                display: "flex", 
                gap: 2, 
                mt: 5,
                flexDirection: isSmallMobile ? "column" : "row"
              }}
            >
              <Button 
                variant="outlined" 
                sx={{ 
                  borderRadius: 3, 
                  px: isSmallMobile ? 2 : 4,
                  flex: isSmallMobile ? 1 : "none",
                  width: isSmallMobile ? "100%" : "auto"
                }}
                onClick={handlePreviewOpen}
              >
                Preview
              </Button>
              <Button
                variant="contained"
                sx={{
                  bgcolor: "#e91e63",
                  borderRadius: 3,
                  px: isSmallMobile ? 2 : 4,
                  flex: isSmallMobile ? 1 : "none",
                  width: isSmallMobile ? "100%" : "auto",
                  "&:hover": { 
                    bgcolor: "#d81b60",
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
          </Box>

          {/* Right Side - Small Resume Preview (Hidden on small mobile) */}
          {!isSmallMobile && (
            <Box
              sx={{
                display: "flex",
                justifyContent: isMobile ? "flex-start" : "center",
                maxHeight: isMobile ? 300 : 400,
                overflow: "hidden",
                paddingLeft: isMobile ? "10%" : 0,
                flex: 1
              }}
            >
              <Box
                sx={{
                  width: "100%",
                  maxWidth: 600,
                  transform: isMobile ? "scale(0.3)" : "scale(0.4)",
                  transformOrigin: isMobile ? "top left" : "top center",
                }}
              >
                <SelectedResumeComponent {...getResumeProps()} />
              </Box>
            </Box>
          )}
        </Box>
      </Container>

      {/* Preview Modal */}
      <Modal
        open={previewOpen}
        onClose={handlePreviewClose}
        aria-labelledby="resume-preview-modal"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: isSmallMobile ? 1 : 2,
        }}
      >
        <Paper
          sx={{
            position: "relative",
            width: "95%",
            maxWidth: "800px",
            maxHeight: "95vh",
            overflow: "auto",
            p: isSmallMobile ? 1 : 2,
          }}
        >
          {/* Close Button */}
          <IconButton
            onClick={handlePreviewClose}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              zIndex: 10,
              bgcolor: "background.paper",
              "&:hover": { bgcolor: "grey.200" },
            }}
          >
            <CloseIcon />
          </IconButton>

          {/* Resume Preview Content */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              p: isSmallMobile ? 1 : 2,
            }}
          >
            <Box
              sx={{
                width: "100%",
                transform: isSmallMobile ? "scale(0.7)" : "scale(0.9)",
                transformOrigin: "top center",
              }}
            >
              <SelectedResumeComponent {...getResumeProps()} />
            </Box>
          </Box>

          {/* Action Buttons */}
          <Box 
            sx={{ 
              display: "flex", 
              justifyContent: "center", 
              gap: 2, 
              mt: 2,
              flexDirection: isSmallMobile ? "column" : "row"
            }}
          >
            <Button 
              variant="outlined" 
              onClick={handlePreviewClose}
              sx={{ 
                borderRadius: 3, 
                px: 4,
                width: isSmallMobile ? "100%" : "auto"
              }}
            >
              Close
            </Button>
            <Button
              variant="contained"
              sx={{
                bgcolor: "#e91e63",
                borderRadius: 3,
                px: 4,
                width: isSmallMobile ? "100%" : "auto",
                "&:hover": { 
                  bgcolor: "#d81b60",
                },
              }}
              onClick={() => {
                handlePreviewClose();
                handleNext();
              }}
            >
              Continue to Next
            </Button>
          </Box>
        </Paper>
      </Modal>
    </Box>
  );
}