import React, { useState, useEffect } from "react";
import {
  Container,
  Box,
  Typography,
  Button,
  useTheme,
  useMediaQuery,
  Drawer,
  IconButton,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import Sidebar from "../Sidebar";
import MenuIcon from "@mui/icons-material/Menu";

// Import all resume components
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
  21: Resume21,  
    22: Resume22,     
  23: Resume23,     
  24: Resume24,     
  25: Resume25,     
  26: Resume26,
};

const ResumeStepPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [selectedTemplate, setSelectedTemplate] = useState(1);
  const [selectedTheme, setSelectedTheme] = useState("#1a2b47");
  const [selectedPurpose, setSelectedPurpose] = useState(null);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const handleChoice = async (purpose) => {
    setSelectedPurpose(purpose);
    try {
      const res = await fetch("https://resume-maker-lc.onrender.com/api/resume-reason", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ purpose }),
      });
      const data = await res.json();
      console.log("Saved Purpose:", data);
    } catch (err) {
      console.error("Error:", err);
    }
  };

  // Fetch selected template & theme from location.state
  useEffect(() => {
    if (location.state) {
      const { selectedTemplate: template, selectedTheme: theme } = location.state;
      if (template) setSelectedTemplate(template);
      if (theme) setSelectedTheme(theme);
    }
  }, [location.state]);

  const SelectedResumeComponent = templateComponents[selectedTemplate];

  const getResumeProps = () => {
    switch (selectedTemplate) {
      case 2:
        return { color: selectedTheme };
      case 3:
        return {
          color: typeof selectedTheme === "object" ? selectedTheme.primary : selectedTheme,
        };
      case 4:
        return {
          theme: selectedTheme,
          color: typeof selectedTheme === "object" ? selectedTheme.primary : selectedTheme,
        };
      case 7:
        return {
          theme: selectedTheme,
          color: typeof selectedTheme === "object" ? selectedTheme.highlight : selectedTheme,
        };
      case 8:
        return { theme: selectedTheme };
      default:
        return { color: selectedTheme };
    }
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
              keepMounted: true, // Better mobile performance
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
          pt: isMobile ? 8 : 5, // Add top padding for mobile to account for hamburger menu
        }}
      >
        <Typography 
          variant={isMobile ? "h6" : "h5"} 
          fontWeight="bold" 
          textAlign="center" 
          gutterBottom
          sx={{ fontSize: isSmallMobile ? "1.25rem" : "inherit" }}
        >
          Why do you need a resume?
        </Typography>
        <Typography 
          variant="body1" 
          textAlign="center" 
          color="text.secondary" 
          gutterBottom
          sx={{ 
            fontSize: isSmallMobile ? "0.875rem" : "inherit",
            px: isSmallMobile ? 1 : 0
          }}
        >
          We'll show you a personalized experience based on your response.
        </Typography>

        {/* Choices */}
        <Box 
          sx={{ 
            display: "flex", 
            justifyContent: "center", 
            gap: 2, 
            mt: 4,
            flexDirection: isSmallMobile ? "column" : "row",
            alignItems: "center"
          }}
        >
          <Button
            variant={selectedPurpose === "Job Seeking" ? "contained" : "outlined"}
            sx={{ 
              width: isSmallMobile ? "100%" : 220,
              maxWidth: isSmallMobile ? "280px" : "none",
              height: 60, 
              fontSize: isSmallMobile ? "0.9rem" : "1rem", 
              borderRadius: 2,
              borderColor: selectedPurpose === "Job Seeking" ? "transparent" : "#e91e63",
              backgroundColor: selectedPurpose === "Job Seeking" ? "#e91e63" : "transparent",
              color: selectedPurpose === "Job Seeking" ? "white" : "#e91e63",
              "&:hover": {
                backgroundColor: selectedPurpose === "Job Seeking" ? "#d81b60" : "rgba(233, 30, 99, 0.1)",
                borderColor: "#d81b60",
                transform: "translateY(-2px)",
                boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                transition: "all 0.3s ease"
              },
              transition: "all 0.3s ease"
            }}
            onClick={() => handleChoice("Job Seeking")}
          >
            Job Seeking
          </Button>
          <Button
            variant={selectedPurpose === "Different Reason" ? "contained" : "outlined"}
            sx={{ 
              width: isSmallMobile ? "100%" : 220,
              maxWidth: isSmallMobile ? "280px" : "none",
              height: 60, 
              fontSize: isSmallMobile ? "0.9rem" : "1rem", 
              borderRadius: 2,
              borderColor: selectedPurpose === "Different Reason" ? "transparent" : "#e91e63",
              backgroundColor: selectedPurpose === "Different Reason" ? "#e91e63" : "transparent",
              color: selectedPurpose === "Different Reason" ? "white" : "#e91e63",
              "&:hover": {
                backgroundColor: selectedPurpose === "Different Reason" ? "#d81b60" : "rgba(233, 30, 99, 0.1)",
                borderColor: "#d81b60",
                transform: "translateY(-2px)",
                boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                transition: "all 0.3s ease"
              },
              transition: "all 0.3s ease"
            }}
            onClick={() => handleChoice("Different Reason")}
          >
            A Different Reason
          </Button>
        </Box>

        {/* Skip / Next */}
        <Box
          sx={{
            mt: isMobile ? 4 : 6,
            display: "flex",
            justifyContent: isSmallMobile ? "space-between" : "flex-end",
            alignItems: "center",
            gap: 3,
            flexDirection: isSmallMobile ? "column" : "row",
          }}
        >
          <Typography
            variant="body2"
            sx={{ 
              color: "#002B5B", 
              fontWeight: "bold", 
              cursor: "pointer",
              "&:hover": {
                color: "#e91e63",
                textDecoration: "underline",
                transition: "color 0.3s ease"
              },
              transition: "color 0.3s ease",
              textAlign: isSmallMobile ? "center" : "left",
              width: isSmallMobile ? "100%" : "auto"
            }}
            onClick={() =>
              navigate("/WorkHistry1", { state: { selectedTemplate, selectedTheme } })
            }
          >
            Skip for now
          </Typography>
          <Button
            variant="contained"
            sx={{
              px: isSmallMobile ? 3 : 5,
              borderRadius: 3,
              fontWeight: "bold",
              height: 45,
              backgroundColor: "#e91e63",
              width: isSmallMobile ? "100%" : "auto",
              maxWidth: isSmallMobile ? "200px" : "none",
              "&:hover": { 
                backgroundColor: "#d81b60",
                transform: "translateY(-2px)",
                boxShadow: "0 4px 12px rgba(233, 30, 99, 0.3)",
                transition: "all 0.3s ease"
              },
              transition: "all 0.3s ease"
            }}
            onClick={() =>
              navigate("/WorkHistry1", { state: { selectedTemplate, selectedTheme } })
            }
          >
            Next
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default ResumeStepPage;
