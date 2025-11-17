import React, { useState } from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  LinearProgress,
  IconButton,
  Collapse,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";

const steps = [
  { label: "Heading", path: "/HeadingContactPage" },
  { 
    label: "Work history", 
    path: "/WorkHistry",
    submenu: [
      { label: "Work History Tips", path: "/WorkHistry1" },
      // { label: "Work Experience Form", path: "/WorkExperienceForm" },
      // { label: "Job Description", path: "/JobDescriptionForm" },
      { label: "Work Summary", path: "/WorkHistrySummary" },
    ]
  },
  { 
    label: "Education", 
    path: "/EducationTips",
    submenu: [
      { label: "Education Section", path: "/EducationSection" },
      { label: "Education Summary", path: "/EducationSummary" },
    ]
  },
  { 
    label: "Skills", 
    path: "/skills",
    submenu: [
      { label: "Skills Section", path: "/SkillSection" },
    ]
  },
  { 
    label: "Summary", 
    path: "/ResumeSummary",
    submenu: [
      { label: "Final Summary", path: "/ResumeSummarySection" },
      // { label: "ExtraSection", path: "/ExtraSection" },
    ]
  },
  { label: "Complete", path: "/ExtraSection" },
];


  const Sidebar = ({ onToggle }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(true);
  const [workHistoryOpen, setWorkHistoryOpen] = useState(false);
  const [educationOpen, setEducationOpen] = useState(false);
  const [skillsOpen, setSkillsOpen] = useState(false);
  const [summaryOpen, setSummaryOpen] = useState(false);

  // Find current step based on current path
  const currentStepIndex = steps.findIndex(step => 
    location.pathname === step.path ||
    (step.submenu && step.submenu.some(sub => 
      location.pathname === sub.path
    ))
  );
  
  // Calculate progress percentage (0-100)
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  // Check if current page is in submenus
  const isInWorkHistory = steps[1].submenu.some(sub => 
    location.pathname === sub.path
  );
  const isInEducation = steps[2].submenu.some(sub => 
    location.pathname === sub.path
  );
  const isInSkills = steps[3].submenu.some(sub => 
    location.pathname === sub.path
  );
  const isInSummary = steps[4].submenu.some(sub => 
    location.pathname === sub.path
  );

  // Auto-expand sections if on their pages
  React.useEffect(() => {
    if (isInWorkHistory) setWorkHistoryOpen(true);
    if (isInEducation) setEducationOpen(true);
    if (isInSkills) setSkillsOpen(true);
    if (isInSummary) setSummaryOpen(true);
  }, [isInWorkHistory, isInEducation, isInSkills, isInSummary]);

  const handleToggle = () => {
    setOpen(!open);
    if (onToggle) {
      onToggle(!open);
    }
  };

  const handleMainItemClick = (step, index) => {
    const hasSubmenu = step.submenu && step.submenu.length > 0;
    
    if (hasSubmenu) {
      switch(index) {
        case 1: setWorkHistoryOpen(!workHistoryOpen); break;
        case 2: setEducationOpen(!educationOpen); break;
        case 3: setSkillsOpen(!skillsOpen); break;
        case 4: setSummaryOpen(!summaryOpen); break;
        default: break;
      }
    } else {
      navigate(step.path);
    }
  };


  return (
    <>

    <IconButton
        onClick={handleToggle}
        sx={{
          position: "fixed",
          top: 16,
          left: open ? 240 : 60,
          zIndex: 2000,
          backgroundColor: "#002B5B",
          color: "white",
          "&:hover": { backgroundColor: "#004080" },
          transition: "left 0.3s ease",
        }}
      >
        {open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
      </IconButton>

      {/* Sidebar */}
      <Box
        sx={{
          width: open ? 240 : 60,
          overflowX: "hidden",
          backgroundColor: "#002B5B",
          color: "white",
          p: open ? 3 : 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          minHeight: "100vh",
          transition: "width 0.3s ease, padding 0.3s ease",
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: 1000,
        }}
      >
      

        <Box>
          {/* Title (hide when collapsed) */}
          {open && (
            <Typography
              variant="h6"
              sx={{
                fontWeight: "bold",
                mb: 3,
                color: "#ff4081",
                cursor: "pointer",
              }}
              onClick={() => navigate("/")}
            >
              Resume Builder
            </Typography>
          )}

          {/* Steps */}
          <List>
            {steps.map((step, index) => {
              const isActive = index === currentStepIndex;
              const isCompleted = index < currentStepIndex;
              const hasSubmenu = step.submenu && step.submenu.length > 0;
              
              // Determine if this section should be expanded
              let isExpanded = false;
              if (index === 1) isExpanded = workHistoryOpen;
              if (index === 2) isExpanded = educationOpen;
              if (index === 3) isExpanded = skillsOpen;
              if (index === 4) isExpanded = summaryOpen;
              
              return (
                <Box key={step.label}>
                  <ListItem
                    onClick={() => handleMainItemClick(step, index)}
                    sx={{
                      fontSize: open ? "0.9rem" : "0rem",
                      display: "flex",
                      alignItems: "center",
                      gap: open ? 1 : 0,
                      cursor: "pointer",
                      color: isActive || isCompleted ? "white" : "rgba(255,255,255,0.7)",
                      backgroundColor: isActive ? "rgba(255, 64, 129, 0.2)" : "transparent",
                      borderRadius: 1,
                      padding: "8px 12px",
                      marginBottom: 1,
                      "&:hover": {
                        backgroundColor: "rgba(255, 255, 255, 0.1)",
                      },
                    }}
                  >
                    <Box
                      sx={{
                        width: 28,
                        height: 28,
                        borderRadius: "50%",
                        backgroundColor: isActive 
                          ? "#ff4081" 
                          : isCompleted 
                          ? "#4caf50" 
                          : "#1976d2",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "0.75rem",
                        color: "white",
                        flexShrink: 0,
                      }}
                    >
                      {index + 1}
                    </Box>
                    {open && (
                      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
                        <span>{step.label}</span>
                        {hasSubmenu && (isExpanded ? <ExpandLess /> : <ExpandMore />)}
                      </Box>
                    )}
                  </ListItem>

                  {/* Submenus */}
                  {open && hasSubmenu && (
                    <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                      <List component="div" disablePadding>
                        {step.submenu.map((subItem) => {
                          const isSubActive = location.pathname === subItem.path;
                          
                          return (
                            <ListItem
                              key={subItem.label}
                              onClick={() => navigate(subItem.path)}
                              sx={{
                                pl: 4,
                                cursor: "pointer",
                                backgroundColor: isSubActive ? "rgba(255, 64, 129, 0.2)" : "transparent",
                                color: isSubActive ? "white" : "rgba(255,255,255,0.7)",
                                borderRadius: 1,
                                padding: "6px 12px",
                                marginBottom: 0.5,
                                fontSize: "0.8rem",
                                "&:hover": {
                                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                                },
                              }}
                            >
                              • {subItem.label}
                            </ListItem>
                          );
                        })}
                      </List>
                    </Collapse>
                  )}
                </Box>
              );
            })}
          </List>

          {/* Progress Bar (hide when collapsed) */}
          {open && (
            <Box mt={3}>
              <Typography variant="caption">RESUME COMPLETENESS:</Typography>
              <LinearProgress
                variant="determinate"
                value={progress}
                sx={{
                  mt: 1,
                  backgroundColor: "rgba(255,255,255,0.3)",
                  "& .MuiLinearProgress-bar": {
                    backgroundColor: "#4caf50",
                  },
                }}
              />
              <Typography variant="caption" display="block" textAlign="center" mt={1}>
                {Math.round(progress)}% Complete
              </Typography>
            </Box>
          )}
        </Box>

        {/* Footer (hide when collapsed) */}
        {open && (
          <Box>
            <Typography
              variant="body2"
              sx={{ color: "lightgreen", cursor: "pointer", mb: 1 }}
            >
              Terms & Conditions
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "lightgreen", cursor: "pointer", mb: 1 }}
            >
              Privacy Policy
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "lightgreen", cursor: "pointer", mb: 1 }}
            >
              Accessibility
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "lightgreen", cursor: "pointer", mb: 1 }}
            >
              Contact Us
            </Typography>
            <Typography variant="caption" display="block" mt={1}>
              © 2025, Bold Limited. All rights reserved.
            </Typography>
          </Box>
        )}
      </Box>
    </>
  );
};

export default Sidebar;
