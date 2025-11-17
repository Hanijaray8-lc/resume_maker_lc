import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  Box,
  Grid,
  Typography,
  Avatar,
  List,
  ListItem,
  ListItemText,
  Divider,
  IconButton,
  Button,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from "@mui/material";
import { 
  ChevronLeft, 
  ChevronRight, 
  Print, 
  Download, 
  DragIndicator,
  Reorder 
} from "@mui/icons-material";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const pageSizeMap = {
  A4: { width: "210mm", height: "297mm" },
  Letter: { width: "216mm", height: "279mm" },
  Legal: { width: "216mm", height: "356mm" },
  A3: { width: "297mm", height: "420mm" },
  Executive: { width: "184mm", height: "267mm" },
};

// Separate section orders for left and right sides
const defaultLeftSectionOrder = [
  'profile',
  'workExperience',
  'volunteering',
  'education',
  'certifications',
  'accomplishments',
  'additionalInfo'
];

const defaultRightSectionOrder = [
  'contact',
  'skills',
  'languages',
  'interests',
  'references'
];

const Resume7 = ({
  theme = { primary: "#0951b0ff", dark: "#063a80" },
  color = "#0951b0ff",
  font = "EB Garamond",
  fontSize = "14px",
  fontStyle = "normal",
  headingSize = "24px",
  sectionSpacing = 10,
  paragraphSpacing = 10,
  lineSpacing = 20,
  topBottomMargin = 20,
  sideMargins = 40,
  paragraphIndent = 0,
  lineWeight = 1,
  pageSize = "A4",
  formData = {},
  photo = "",
  workExperiences = [],
  exporting = false,
  enableDragDrop = true,
}) => {
  // State for all data from localStorage
  const [educationEntries, setEducationEntries] = useState([]);
  const [savedSkills, setSavedSkills] = useState([]);
  const [savedSummary, setSavedSummary] = useState("");
  const [savedAdditionalInfo, setSavedAdditionalInfo] = useState([]);
  const [savedLanguages, setSavedLanguages] = useState([]);
  const [savedAccomplishments, setSavedAccomplishments] = useState([]);
  const [savedCertifications, setSavedCertifications] = useState([]);
  const [savedReferences, setSavedReferences] = useState([]);
  const [softwareSkills, setSoftwareSkills] = useState([]);
  const [savedVolunteering, setSavedVolunteering] = useState([]);
  const [savedInterests, setSavedInterests] = useState([]);
  const [savedWebsites, setSavedWebsites] = useState([]);
  const [customSections, setCustomSections] = useState({});

  // Pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const [pages, setPages] = useState([]);
  const [sidebarPages, setSidebarPages] = useState([]);
  const mainContentRef = useRef(null);
  const rightContentRef = useRef(null);
  const sidebarContentRef = useRef(null);

  // State for section ordering - separate for left and right
  const [leftSectionOrder, setLeftSectionOrder] = useState(defaultLeftSectionOrder);
  const [rightSectionOrder, setRightSectionOrder] = useState(defaultRightSectionOrder);
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const [dragOverSide, setDragOverSide] = useState(null);
  
  // State for arrange sections dialog
  const [arrangeDialogOpen, setArrangeDialogOpen] = useState(false);

  const page = pageSizeMap[pageSize] || pageSizeMap.A4;

  // Global font style for all text
  const globalFontStyle = {
    fontFamily: font,
    fontSize: fontSize,
    fontStyle: fontStyle,
    lineHeight: `${lineSpacing}px`,
  };

  // Style object for consistent font family application
  const getTextStyle = (additionalStyles = {}) => ({
    ...globalFontStyle,
    ...additionalStyles
  });

  // Default data
  const defaultData = {
    firstName: "John",
    lastName: "Doe",
    currentPosition: "Full Stack Developer",
    phone: "+91 9876543210",
    email: "johndoe@email.com",
    city: "Chennai, India",
    website: "www.johndoe.com",
    profile: "Highly motivated Full Stack Developer with experience in building scalable MERN stack applications. Passionate about problem solving and creating user-friendly solutions.",
  };

  const data = { ...defaultData, ...formData };

  // Updated theme colors to use the color prop correctly
  const currentTheme = {
    mainBg: "#b3e4e6ff", // White background for main content
    sideBg: color || theme.primary || "#0951b0ff", // Use the color prop for sidebar
    highlight: color || theme.primary || "#0951b0ff", // Use the color prop for highlights
    text: "#000000", // Black text for main content
    sideText: "#ffffff" // White text for sidebar
  };

  // Load data from localStorage
  useEffect(() => {
    const storedEntries = localStorage.getItem("educationEntries");
    if (storedEntries) {
      setEducationEntries(JSON.parse(storedEntries));
    }

    const storedSkills = localStorage.getItem("skills");
    if (storedSkills) {
      setSavedSkills(JSON.parse(storedSkills));
    }

    const storedSummaries = JSON.parse(localStorage.getItem("summaries")) || [];
    if (storedSummaries.length > 0) {
      setSavedSummary(storedSummaries[storedSummaries.length - 1]);
    }

    const storedAdditionalInfo = JSON.parse(localStorage.getItem("additionalInfo")) || [];
    setSavedAdditionalInfo(storedAdditionalInfo);

    const storedLanguages = JSON.parse(localStorage.getItem("languagesList")) || [];
    setSavedLanguages(storedLanguages);

    const storedAccomplishments = JSON.parse(localStorage.getItem("accomplishmentsList")) || [];
    setSavedAccomplishments(storedAccomplishments);

    const storedCertifications = JSON.parse(localStorage.getItem("certificationsList")) || [];
    setSavedCertifications(storedCertifications);

    const storedReferences = JSON.parse(localStorage.getItem("referencesList")) || [];
    setSavedReferences(storedReferences);

    const storedSoftwareSkills = JSON.parse(localStorage.getItem("softwareSkills")) || [];
    setSoftwareSkills(storedSoftwareSkills);

    const storedVolunteering = JSON.parse(localStorage.getItem("volunteering")) || [];
    setSavedVolunteering(storedVolunteering);

    const storedInterests = JSON.parse(localStorage.getItem("interests")) || [];
    setSavedInterests(storedInterests);

    const storedWebsites = JSON.parse(localStorage.getItem("websites")) || [];
    setSavedWebsites(storedWebsites);

    // Load the custom section with most items (most content) - Resume9 mathiri
  const userId = localStorage.getItem("userId");
  console.log("👤 Current userId:", userId);
  
  let sectionsData = {};

  if (userId) {
    // Get the CURRENT custom sections from ExtraSections page state
    const currentCustomSections = JSON.parse(localStorage.getItem(`current_custom_sections_${userId}`)) || [];
    
    console.log("🔍 Current custom sections to display:", currentCustomSections);
    
    if (currentCustomSections.length > 0) {
      currentCustomSections.forEach(sectionName => {
        const userCustomKey = `custom_${userId}_${sectionName}`;
        try {
          const customSectionData = localStorage.getItem(userCustomKey);
          if (customSectionData) {
            const parsedData = JSON.parse(customSectionData);
            const items = parsedData.items || [];
            
            // Only include if it has actual content
            const validItems = items.filter(item => item && item.trim() !== '');
            
            if (validItems.length > 0) {
              sectionsData[sectionName] = validItems;
              console.log(`✅ Loaded current custom section: ${sectionName} with ${validItems.length} items`);
            }
          }
        } catch (error) {
          console.error(`❌ Error loading current custom section ${sectionName}:`, error);
        }
      });
    } else {
      console.log(`📝 No current custom sections found for user ${userId}`);
    }
  } else {
    console.log('❌ No userId found in localStorage');
  }

  setCustomSections(sectionsData);
  console.log('📁 Loaded ONLY CURRENT custom sections:', sectionsData);

  // Load saved section orders
  const savedLeftSectionOrder = localStorage.getItem("resume7LeftSectionOrder");
  if (savedLeftSectionOrder) {
    // 🔥 FIX: Left side-ல custom sections auto add ஆகாது - filter only
    const parsedOrder = JSON.parse(savedLeftSectionOrder);
    const filteredOrder = parsedOrder.filter(section => !section.startsWith('custom_'));
    setLeftSectionOrder(filteredOrder);
    console.log('🔄 Loaded left section order WITHOUT custom sections:', filteredOrder);
  } else {
    setLeftSectionOrder(defaultLeftSectionOrder);
  }

  const savedRightSectionOrder = localStorage.getItem("resume7RightSectionOrder");
  if (savedRightSectionOrder) {
    const parsedOrder = JSON.parse(savedRightSectionOrder);
    
    // Remove ALL old custom sections and add ONLY current sections
    const currentCustomSectionIds = Object.keys(sectionsData).map(name => `custom_${name}`);
    const filteredOrder = parsedOrder.filter(section => !section.startsWith('custom_'));
    const allRightSections = [...filteredOrder, ...currentCustomSectionIds];
    
    setRightSectionOrder(allRightSections);
    console.log('🔄 Updated right section order with ONLY CURRENT custom sections:', allRightSections);
  } else {
    // For first time, add ONLY current custom sections to right side
    const currentCustomSectionIds = Object.keys(sectionsData).map(name => `custom_${name}`);
    const updatedRightSectionOrder = [...defaultRightSectionOrder, ...currentCustomSectionIds];
    setRightSectionOrder(updatedRightSectionOrder);
    console.log('🆕 Initial right section order with ONLY CURRENT custom sections:', updatedRightSectionOrder);
  }
}, []);
// Add this useEffect to automatically add/remove custom sections - UPDATED VERSION
useEffect(() => {
  const userId = localStorage.getItem("userId");
  if (userId && Object.keys(customSections).length > 0) {
    const currentRightOrder = [...rightSectionOrder];
    let updated = false;
    
    // Get ONLY CURRENT custom section IDs
    const currentCustomSectionIds = Object.keys(customSections).map(name => `custom_${name}`);
    
    console.log("🔄 Processing CURRENT custom sections:", currentCustomSectionIds);
    
    // Remove ALL custom sections and add ONLY current ones to right side
    const filteredRightOrder = currentRightOrder.filter(section => !section.startsWith('custom_'));
    const newRightOrder = [...filteredRightOrder, ...currentCustomSectionIds];
    
    if (JSON.stringify(newRightOrder) !== JSON.stringify(currentRightOrder)) {
      setRightSectionOrder(newRightOrder);
      localStorage.setItem("resume7RightSectionOrder", JSON.stringify(newRightOrder));
      console.log('📝 Final right section order with ONLY CURRENT custom sections:', newRightOrder);
    }
    
    // 🔥 FIX: Left side-லிருந்து custom sections-ஐ remove செய்யவும்
    const currentLeftOrder = [...leftSectionOrder];
    const filteredLeftOrder = currentLeftOrder.filter(section => !section.startsWith('custom_'));
    if (JSON.stringify(filteredLeftOrder) !== JSON.stringify(currentLeftOrder)) {
      setLeftSectionOrder(filteredLeftOrder);
      localStorage.setItem("resume7LeftSectionOrder", JSON.stringify(filteredLeftOrder));
      console.log('🗑️ Removed custom sections from left side:', filteredLeftOrder);
    }
    
  } else if (userId && Object.keys(customSections).length === 0) {
    // If no current custom sections, remove all custom sections from both sides
    const currentRightOrder = [...rightSectionOrder];
    const filteredRightOrder = currentRightOrder.filter(section => !section.startsWith('custom_'));
    
    if (filteredRightOrder.length !== currentRightOrder.length) {
      setRightSectionOrder(filteredRightOrder);
      localStorage.setItem("resume7RightSectionOrder", JSON.stringify(filteredRightOrder));
      console.log('🗑️ Removed all custom sections from right side (no current sections)');
    }
    
    const currentLeftOrder = [...leftSectionOrder];
    const filteredLeftOrder = currentLeftOrder.filter(section => !section.startsWith('custom_'));
    if (filteredLeftOrder.length !== currentLeftOrder.length) {
      setLeftSectionOrder(filteredLeftOrder);
      localStorage.setItem("resume7LeftSectionOrder", JSON.stringify(filteredLeftOrder));
      console.log('🗑️ Removed all custom sections from left side (no current sections)');
    }
  }
}, [customSections]);
  // Save section orders to localStorage whenever they change
  useEffect(() => {
    if (leftSectionOrder.length > 0) {
      localStorage.setItem("resume7LeftSectionOrder", JSON.stringify(leftSectionOrder));
    }
  }, [leftSectionOrder]);

  useEffect(() => {
    if (rightSectionOrder.length > 0) {
      localStorage.setItem("resume7RightSectionOrder", JSON.stringify(rightSectionOrder));
    }
  }, [rightSectionOrder]);

  // Format date helper function
  const formatDate = (month, year) => {
    if (!month || !year) return "";
    return `${month} ${year}`;
  };

  // Drag and drop handlers
  const handleLeftDragStart = (e, index) => {
    e.dataTransfer.setData('text/plain', JSON.stringify({
      index,
      side: 'left',
      sectionId: leftSectionOrder[index]
    }));
    e.currentTarget.style.opacity = '0.5';
  };

  const handleRightDragStart = (e, index) => {
    e.dataTransfer.setData('text/plain', JSON.stringify({
      index,
      side: 'right',
      sectionId: rightSectionOrder[index]
    }));
    e.currentTarget.style.opacity = '0.5';
  };

  const handleDragOver = (e, index, side) => {
    e.preventDefault();
    setDragOverIndex(index);
    setDragOverSide(side);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOverIndex(null);
    setDragOverSide(null);
  };

  const handleLeftDrop = (e, targetIndex) => {
    e.preventDefault();
    const data = JSON.parse(e.dataTransfer.getData('text/plain'));
    const sourceIndex = data.index;
    const sourceSide = data.side;
    const sectionId = data.sectionId;

    if (sourceSide === 'left' && sourceIndex !== targetIndex) {
      // Reorder within left side
      const newSectionOrder = [...leftSectionOrder];
      const [movedSection] = newSectionOrder.splice(sourceIndex, 1);
      newSectionOrder.splice(targetIndex, 0, movedSection);
      setLeftSectionOrder(newSectionOrder);
    } else if (sourceSide === 'right') {
      // Move from right side to left side
      const newLeftSectionOrder = [...leftSectionOrder];
      const newRightSectionOrder = [...rightSectionOrder];
      
      // Remove from right side
      newRightSectionOrder.splice(sourceIndex, 1);
      // Add to left side
      newLeftSectionOrder.splice(targetIndex, 0, sectionId);
      
      setLeftSectionOrder(newLeftSectionOrder);
      setRightSectionOrder(newRightSectionOrder);
    }

    setDragOverIndex(null);
    setDragOverSide(null);
    e.currentTarget.style.opacity = '1';
  };

  const handleRightDrop = (e, targetIndex) => {
    e.preventDefault();
    const data = JSON.parse(e.dataTransfer.getData('text/plain'));
    const sourceIndex = data.index;
    const sourceSide = data.side;
    const sectionId = data.sectionId;

    if (sourceSide === 'right' && sourceIndex !== targetIndex) {
      // Reorder within right side
      const newSectionOrder = [...rightSectionOrder];
      const [movedSection] = newSectionOrder.splice(sourceIndex, 1);
      newSectionOrder.splice(targetIndex, 0, movedSection);
      setRightSectionOrder(newSectionOrder);
    } else if (sourceSide === 'left') {
      // Move from left side to right side
      const newLeftSectionOrder = [...leftSectionOrder];
      const newRightSectionOrder = [...rightSectionOrder];
      
      // Remove from left side
      newLeftSectionOrder.splice(sourceIndex, 1);
      // Add to right side
      newRightSectionOrder.splice(targetIndex, 0, sectionId);
      
      setLeftSectionOrder(newLeftSectionOrder);
      setRightSectionOrder(newRightSectionOrder);
    }

    setDragOverIndex(null);
    setDragOverSide(null);
    e.currentTarget.style.opacity = '1';
  };

  const handleDragEnd = (e) => {
    setDragOverIndex(null);
    setDragOverSide(null);
    e.currentTarget.style.opacity = '1';
  };

  const resetLeftSectionOrder = () => {
    setLeftSectionOrder(defaultLeftSectionOrder);
  };

  const resetRightSectionOrder = () => {
    setRightSectionOrder(defaultRightSectionOrder);
  };

  const resetAllSectionOrder = () => {
    setLeftSectionOrder(defaultLeftSectionOrder);
    setRightSectionOrder(defaultRightSectionOrder);
  };

  const handleArrangeSectionsClick = () => {
    setArrangeDialogOpen(true);
  };

  const handleArrangeDialogClose = () => {
    setArrangeDialogOpen(false);
  };

  const getSectionTitle = (sectionId) => {
    const titles = {
      'contact': 'Contact',
      'skills': 'Skills',
      'languages': 'Languages',
      'interests': 'Interests',
      'references': 'References',
      'profile': 'Profile',
      'workExperience': 'Work Experience',
      'volunteering': 'Volunteering',
      'education': 'Education',
      'certifications': 'Certifications',
      'accomplishments': 'Accomplishments',
      'additionalInfo': 'Additional Information'
    };
    
   if (sectionId.startsWith('custom_')) {
    const customName = sectionId.replace('custom_', '').replace(/_/g, ' ');
    return customName.charAt(0).toUpperCase() + customName.slice(1);
  }
    
    return titles[sectionId] || sectionId;
  };

  const renderDragPanel = (side, sections) => {
    return (
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
          <DragIndicator sx={{ mr: 1 }} />
          {side === 'left' ? 'Left Content' : 'Right Sidebar'} Sections
          <Typography variant="body2" color="textSecondary" sx={{ ml: 1 }}>
            ({sections.length} sections)
          </Typography>
        </Typography>
        <Box sx={{ maxHeight: 400, overflow: 'auto', border: '1px solid #e0e0e0', borderRadius: 1, p: 1 }}>
          {sections.length > 0 ? (
            sections.map((sectionId, index) => (
              <Paper
                key={sectionId}
                draggable
                onDragStart={(e) => side === 'left' ? handleLeftDragStart(e, index) : handleRightDragStart(e, index)}
                onDragOver={(e) => handleDragOver(e, index, side)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => side === 'left' ? handleLeftDrop(e, index) : handleRightDrop(e, index)}
                onDragEnd={handleDragEnd}
                sx={{
                  p: 2,
                  mb: 1,
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: dragOverIndex === index && dragOverSide === side ? '#f0f0f0' : 'white',
                  boxShadow: dragOverIndex === index && dragOverSide === side ? 2 : 1,
                  cursor: 'grab',
                  '&:active': {
                    cursor: 'grabbing',
                  },
                  transition: 'all 0.2s ease',
                }}
              >
                <DragIndicator color="action" />
                <Typography sx={{ ml: 1, flexGrow: 1 }}>
                  {getSectionTitle(sectionId)}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {index + 1}
                </Typography>
              </Paper>
            ))
          ) : (
            <Typography variant="body2" color="textSecondary" sx={{ p: 2, textAlign: 'center' }}>
              No sections. Drag sections from the other side.
            </Typography>
          )}
        </Box>
        <Button 
          onClick={side === 'left' ? resetLeftSectionOrder : resetRightSectionOrder} 
          variant="outlined" 
          size="small" 
          sx={{ mt: 1 }}
        >
          Reset {side === 'left' ? 'Left' : 'Right'} Order
        </Button>
      </Box>
    );
  };

  // Render left content sections based on current order
  const renderLeftContentSections = () => {
    return leftSectionOrder.map(sectionId => {
      switch (sectionId) {
        case 'profile':
          return (
            <div key="profile" className="resume-section">
              <Box sx={{ 
                bgcolor: 'black', 
                p: 3,
                marginBottom: `${sectionSpacing}px`
              }}>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    color: "#ffffff",
                    fontSize: fontSize,
                    lineHeight: `${lineSpacing}px`,
                    marginBottom: `${paragraphSpacing}px`,
                    fontFamily: font,
                    fontStyle: fontStyle,
                  }}
                >
                  {savedSummary || data.profile}
                </Typography>
              </Box>
            </div>
          );
 case 'workExperience':
  return workExperiences && workExperiences.length > 0 ? (
    <div key="workExperience" className="resume-section">
      <Box sx={{ 
        bgcolor: currentTheme.highlight, 
        color: "#ffffff", 
        p: 1,
        marginBottom: `${sectionSpacing / 2}px`
      }}>
        <Typography 
          variant="h6" 
          fontWeight="bold"
          sx={{ 
            fontSize: headingSize,
            fontFamily: font,
            fontStyle: fontStyle,
          }}
        >
          Professional Experience
        </Typography>
      </Box>
      <Box p={3} sx={{ marginBottom: `${sectionSpacing}px`, }}>
        {workExperiences.map((work, i) => (
          <Box key={i} sx={{ marginBottom: `${paragraphSpacing}px`, }}>
            <Typography 
              fontWeight="bold"
              sx={{ 
                fontSize: `calc(${fontSize} * 1.2)`,
                lineHeight: `${lineSpacing}px`,
                marginBottom: `${paragraphSpacing / 2}px`,
                fontFamily: font,
                fontStyle: fontStyle,
              }}
            >
              {work.employer} @ {work.jobTitle}
              <span style={{ float: "right", fontFamily: font, fontStyle: fontStyle }}>
                {formatDate(work.startMonth, work.startYear)} -{" "}
                {work.current
                  ? "Present"
                  : formatDate(work.endMonth, work.endYear)}
              </span>
            </Typography>
            <Typography 
              variant="body2" 
              fontStyle="italic"
              sx={{ 
                fontSize: fontSize,
                marginBottom: `${paragraphSpacing}px`,
                fontFamily: font,
              }}
            >
              {work.companyName} | {work.location}
            </Typography>
            {work.description && (
              <Box
                sx={{
                  mt: 1,
                  "& strong": { 
                    fontWeight: "bold",
                    fontFamily: font,
                    fontSize: fontSize,
                    fontStyle: fontStyle,
                  },
                  "& em": { 
                    fontStyle: "italic",
                    fontFamily: font,
                    fontSize: fontSize,
                  },
                  "& u": { 
                    textDecoration: "underline",
                    fontFamily: font,
                    fontSize: fontSize,
                    fontStyle: fontStyle,
                  },
                  "& *": {
                    fontFamily: font,
                    fontSize: fontSize,
                    fontStyle: fontStyle,
                    lineHeight: `${lineSpacing}px`,
                  },
                  ...globalFontStyle
                }}
                dangerouslySetInnerHTML={{
                  __html: work.description
                    .replace(/\*\*(.*?)\*\*/g, `<strong style="font-family: ${font}; font-size: ${fontSize}; font-style: ${fontStyle};">$1</strong>`)
                    .replace(/\*(.*?)\*/g, `<em style="font-family: ${font}; font-size: ${fontSize};">$1</em>`)
                    .replace(/<u>(.*?)<\/u>/g, `<u style="font-family: ${font}; font-size: ${fontSize}; font-style: ${fontStyle};">$1</u>`)
                    .replace(/\n/g, "<br/>"),
                }}
              />
            )}
          </Box>
        ))}
      </Box>
    </div>
  ) : null;
        case 'volunteering':
          return savedVolunteering.length > 0 ? (
            <div key="volunteering" className="resume-section">
              <Box sx={{ 
                bgcolor: currentTheme.highlight, 
                color: "#ffffff", 
                p: 1,
                marginBottom: `${sectionSpacing / 2}px`
              }}>
                <Typography 
                  variant="h6" 
                  fontWeight="bold"
                  sx={{ 
                    fontSize: headingSize,
                    fontFamily: font,
                    fontStyle: fontStyle,
                  }}
                >
                  Volunteering Experience
                </Typography>
              </Box>
              <Box p={3} sx={{ marginBottom: `${sectionSpacing}px` }}>
                {savedVolunteering.map((vol, index) => (
                  <Box key={index} sx={{ mb: 2 }}>
                    <Box 
                      sx={{ 
                        display: "flex", 
                        justifyContent: "space-between", 
                        alignItems: "center",
                        fontSize: fontSize,
                        fontStyle: fontStyle,
                        fontWeight: "bold",
                        fontFamily: font,
                      }}
                    >
                      <Typography 
                        sx={{ 
                          fontWeight: "bold", 
                          fontSize: fontSize,
                          fontStyle: fontStyle,
                          fontFamily: font,
                        }}
                      >
                        {vol.subtopic}
                      </Typography>
                      <Typography 
                        sx={{ 
                          fontSize: fontSize,
                          fontStyle: 'italic',
                          color: 'white',
                          fontFamily: font,
                        }}
                      >
                        {vol.fromDate} - {vol.toDate}
                      </Typography>
                    </Box>
                    <Typography 
                      sx={{ 
                        fontSize: fontSize,
                        fontStyle: fontStyle,
                        mt: 0.5,
                        fontFamily: font,
                      }}
                    >
                      {vol.content}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </div>
          ) : null;

        case 'education':
          return educationEntries.length > 0 ? (
            <div key="education" className="resume-section">
              <Box sx={{ 
                bgcolor: currentTheme.highlight, 
                color: "#ffffff", 
                p: 1,
                marginBottom: `${sectionSpacing / 2}px`
              }}>
                <Typography 
                  variant="h6" 
                  fontWeight="bold"
                  sx={{ 
                    fontSize: headingSize,
                    fontFamily: font,
                    fontStyle: fontStyle,
                  }}
                >
                  Education
                </Typography>
              </Box>
              <Box p={3}>
                {educationEntries.map((edu, i) => (
                  <Box key={i} sx={{ marginBottom: `${paragraphSpacing}px` }}>
                    <Typography 
                      fontWeight="bold"
                      sx={{ 
                        fontSize: `calc(${fontSize} * 1.2)`,
                        lineHeight: `${lineSpacing}px`,
                        marginBottom: `${paragraphSpacing / 2}px`,
                        fontFamily: font,
                        fontStyle: fontStyle,
                      }}
                    >
                      {edu.degree} - {edu.fieldOfStudy}
                      <span style={{ float: "right", fontFamily: font, fontStyle: fontStyle }}>
                        {formatDate(edu.gradMonth, edu.gradYear)}
                      </span>
                    </Typography>
                    <Typography 
                      variant="body2"
                      sx={{ 
                        fontSize: fontSize,
                        marginBottom: `${paragraphSpacing / 2}px`,
                        fontFamily: font,
                        fontStyle: fontStyle,
                      }}
                    >
                      {edu.schoolName}, {edu.schoolLocation}
                    </Typography>
                    {edu.additionalCoursework && (
                      <Typography sx={{ 
                        fontSize: fontSize,
                        fontFamily: font,
                        fontStyle: fontStyle,
                      }}>
                        {edu.additionalCoursework}
                      </Typography>
                    )}
                  </Box>
                ))}
              </Box>
            </div>
          ) : null;

        case 'certifications':
          return savedCertifications.length > 0 ? (
            <div key="certifications" className="resume-section">
              <Box sx={{ 
                bgcolor: currentTheme.highlight, 
                color: "#ffffff", 
                p: 1,
                marginBottom: `${sectionSpacing / 2}px`
              }}>
                <Typography 
                  variant="h6" 
                  fontWeight="bold"
                  sx={{ 
                    fontSize: headingSize,
                    fontFamily: font,
                    fontStyle: fontStyle,
                  }}
                >
                  Certifications
                </Typography>
              </Box>
              <Box p={3}>
                {savedCertifications.map((cert, i) => (
                  <Typography
                    key={i}
                    sx={{ 
                      fontSize: fontSize,
                      marginBottom: `${paragraphSpacing / 2}px`,
                      fontFamily: font,
                      fontStyle: fontStyle,
                    }}
                  >
                    {cert.name} – {cert.provider} ({cert.year})
                  </Typography>
                ))}
              </Box>
            </div>
          ) : null;

        case 'accomplishments':
          return savedAccomplishments.length > 0 ? (
            <div key="accomplishments" className="resume-section">
              <Box sx={{ 
                bgcolor: currentTheme.highlight, 
                color: "#ffffff", 
                p: 1,
                marginBottom: `${sectionSpacing / 2}px`
              }}>
                <Typography 
                  variant="h6" 
                  fontWeight="bold"
                  sx={{ 
                    fontSize: headingSize,
                    fontFamily: font,
                    fontStyle: fontStyle,
                  }}
                >
                  Accomplishments
                </Typography>
              </Box>
              <Box p={3}>
                {savedAccomplishments.map((acc, i) => (
                  <Typography
                    key={i}
                    sx={{ 
                      fontSize: fontSize,
                      marginBottom: `${paragraphSpacing / 2}px`,
                      fontFamily: font,
                      fontStyle: fontStyle,
                    }}
                    whiteSpace="pre-line"
                  >
                    • {acc}
                  </Typography>
                ))}
              </Box>
            </div>
          ) : null;

        case 'additionalInfo':
          return savedAdditionalInfo.length > 0 ? (
            <div key="additionalInfo" className="resume-section">
              <Box sx={{ 
                bgcolor: currentTheme.highlight, 
                color: "#ffffff", 
                p: 1,
                marginBottom: `${sectionSpacing / 2}px`
              }}>
                <Typography 
                  variant="h6" 
                  fontWeight="bold"
                  sx={{ 
                    fontSize: headingSize,
                    fontFamily: font,
                    fontStyle: fontStyle,
                  }}
                >
                  Additional Information
                </Typography>
              </Box>
              <Box p={3}>
                {savedAdditionalInfo.map((info, i) => (
                  <Typography
                    key={i}
                    sx={{ 
                      fontSize: fontSize,
                      marginBottom: `${paragraphSpacing / 2}px`,
                      fontFamily: font,
                      fontStyle: fontStyle,
                    }}
                    whiteSpace="pre-line"
                  >
                    • {info}
                  </Typography>
                ))}
              </Box>
            </div>
          ) : null;

        // Handle sections moved from right side
        case 'contact':
          return (
            <div key="contact" className="resume-section">
              <Box sx={{ 
                bgcolor: currentTheme.highlight, 
                color: "#ffffff", 
                p: 1,
                marginBottom: `${sectionSpacing / 2}px`
              }}>
                <Typography 
                  variant="h6" 
                  fontWeight="bold"
                  sx={{ 
                    fontSize: headingSize,
                    fontFamily: font,
                    fontStyle: fontStyle,
                  }}
                >
                  Contact
                </Typography>
              </Box>
              <Box p={3}>
                <Avatar
                  src={photo || "/profile.jpg"}
                  alt="profile"
                  sx={{ 
                    width: 120, 
                    height: 120, 
                    mx: "auto", 
                    mb: 2,
                    border: `${lineWeight}px solid ${currentTheme.sideBg}`
                  }}
                />
                <Typography sx={getTextStyle({ textAlign: 'center', mb: 2, color: "#000000" })}>
                  {data.city && <>{data.city}<br /></>}
                  {data.phone && <>{data.phone}<br /></>}
                  {data.email && <>{data.email}<br /></>}
                  {data.website && <>{data.website}<br /></>}
                  
                  {savedWebsites.length > 0 && savedWebsites.map((website, i) => (
                    <span key={i} style={{...globalFontStyle, color: "#000000"}}>
                      {website.url}<br />
                    </span>
                  ))}
                </Typography>
              </Box>
            </div>
          );

        case 'skills':
          return (savedSkills.length > 0 || softwareSkills.length > 0) ? (
            <div key="skills" className="resume-section">
              <Box sx={{ 
                bgcolor: currentTheme.highlight, 
                color: "#ffffff", 
                p: 1,
                marginBottom: `${sectionSpacing / 2}px`
              }}>
                <Typography 
                  variant="h6" 
                  fontWeight="bold"
                  sx={{ 
                    fontSize: headingSize,
                    fontFamily: font,
                    fontStyle: fontStyle,
                  }}
                >
                  Key Skills
                </Typography>
              </Box>
              <Box p={3}>
                {savedSkills.map((skill, i) => (
                  <Typography
                    key={i}
                    sx={{ 
                      fontSize: fontSize,
                      marginBottom: `${paragraphSpacing / 2}px`,
                      fontFamily: font,
                      fontStyle: fontStyle,
                    }}
                  >
                    • {skill.name}{skill.rating ? ` (${skill.rating}%)` : ''}
                  </Typography>
                ))}
                {softwareSkills.map((skill, i) => (
                  <Typography
                    key={`software-${i}`}
                    sx={{ 
                      fontSize: fontSize,
                      marginBottom: `${paragraphSpacing / 2}px`,
                      fontFamily: font,
                      fontStyle: fontStyle,
                    }}
                  >
                    • {skill.name}{skill.level ? ` (${skill.level}%)` : ''}
                  </Typography>
                ))}
              </Box>
            </div>
          ) : null;

        case 'languages':
          return savedLanguages.length > 0 ? (
            <div key="languages" className="resume-section">
              <Box sx={{ 
                bgcolor: currentTheme.highlight, 
                color: "#ffffff", 
                p: 1,
                marginBottom: `${sectionSpacing / 2}px`
              }}>
                <Typography 
                  variant="h6" 
                  fontWeight="bold"
                  sx={{ 
                    fontSize: headingSize,
                    fontFamily: font,
                    fontStyle: fontStyle,
                  }}
                >
                  Languages
                </Typography>
              </Box>
              <Box p={3}>
                {savedLanguages.map((lang, i) => (
                  <Typography
                    key={i}
                    sx={{ 
                      fontSize: fontSize,
                      marginBottom: `${paragraphSpacing / 2}px`,
                      fontFamily: font,
                      fontStyle: fontStyle,
                    }}
                  >
                    • {lang.name}{lang.level ? ` - ${lang.level}` : ''}
                  </Typography>
                ))}
              </Box>
            </div>
          ) : null;

        case 'interests':
          return savedInterests.length > 0 ? (
            <div key="interests" className="resume-section">
              <Box sx={{ 
                bgcolor: currentTheme.highlight, 
                color: "#ffffff", 
                p: 1,
                marginBottom: `${sectionSpacing / 2}px`
              }}>
                <Typography 
                  variant="h6" 
                  fontWeight="bold"
                  sx={{ 
                    fontSize: headingSize,
                    fontFamily: font,
                    fontStyle: fontStyle,
                  }}
                >
                  Interests
                </Typography>
              </Box>
              <Box p={3}>
                {savedInterests.map((interest, i) => (
                  <Typography
                    key={i}
                    sx={{ 
                      fontSize: fontSize,
                      marginBottom: `${paragraphSpacing / 2}px`,
                      fontFamily: font,
                      fontStyle: fontStyle,
                    }}
                  >
                    • {interest}
                  </Typography>
                ))}
              </Box>
            </div>
          ) : null;

        case 'references':
          return savedReferences.length > 0 ? (
            <div key="references" className="resume-section">
              <Box sx={{ 
                bgcolor: currentTheme.highlight, 
                color: "#ffffff", 
                p: 1,
                marginBottom: `${sectionSpacing / 2}px`
              }}>
                <Typography 
                  variant="h6" 
                  fontWeight="bold"
                  sx={{ 
                    fontSize: headingSize,
                    fontFamily: font,
                    fontStyle: fontStyle,
                  }}
                >
                  References
                </Typography>
              </Box>
              <Box p={3}>
                {savedReferences.map((ref, i) => (
                  <Typography
                    key={i}
                    sx={{ 
                      fontSize: fontSize,
                      marginBottom: `${paragraphSpacing / 2}px`,
                      fontFamily: font,
                      fontStyle: fontStyle,
                    }}
                  >
                    • {ref}
                  </Typography>
                ))}
              </Box>
            </div>
          ) : null;

        // renderLeftContentSections function-ல் default case-ஐ update பண்ணவும்:
default:
  // Handle custom sections
  if (sectionId && sectionId.startsWith('custom_')) {
    const customSectionName = sectionId.replace('custom_', '');
    const items = customSections[customSectionName] || [];
    
    console.log(`🎯 Rendering custom section: ${customSectionName}`, items);
    
    if (items && items.length > 0) {
      return (
        <div key={sectionId} className="resume-section">
          <Box sx={{ 
            bgcolor: currentTheme.highlight, 
            color: "#ffffff", 
            p: 1,
            marginBottom: `${sectionSpacing / 2}px`
          }}>
            <Typography 
              variant="h6" 
              fontWeight="bold"
              sx={{ 
                fontSize: headingSize,
                fontFamily: font,
                fontStyle: fontStyle,
              }}
            >
              {customSectionName.replace(/_/g, ' ').toUpperCase()}
            </Typography>
          </Box>
          <Box p={3}>
            {items.map((item, i) => (
              <Typography
                key={i}
                sx={{ 
                  fontSize: fontSize,
                  marginBottom: `${paragraphSpacing / 2}px`,
                  fontFamily: font,
                  fontStyle: fontStyle,
                }}
                whiteSpace="pre-line"
              >
                • {item}
              </Typography>
            ))}
          </Box>
        </div>
      );
    } else {
      console.log(`⚠️ No items found for custom section: ${customSectionName}`);
      return null;
    }
  }
  return null;}
    }).filter(Boolean);
  };

  // Render sidebar sections based on current order
  const renderSidebarSections = () => {
    return rightSectionOrder.map(sectionId => {
      switch (sectionId) {
        case 'contact':
          return (
            <div key="contact" className="sidebar-section">
              <Avatar
                src={photo || "/profile.jpg"}
                alt="profile"
                sx={{ 
                  width: 150, 
                  height: 150, 
                  mx: "auto", 
                  mb: 2,
                  border: `${lineWeight}px solid ${currentTheme.highlight}`
                }}
              />

              <Typography 
                variant="body1" 
                mb={2}
                sx={{...getTextStyle(), color: currentTheme.sideText}}
              >
                {data.city && <>{data.city}<br /></>}
                {data.phone && <>{data.phone}<br /></>}
                {data.email && <>{data.email}<br /></>}
                {data.website && <>{data.website}<br /></>}
                
                {/* Display saved websites */}
                {savedWebsites.length > 0 && savedWebsites.map((website, i) => (
                  <span key={i} style={{...globalFontStyle, color: currentTheme.sideText}}>
                    {website.url}<br />
                  </span>
                ))}
              </Typography>

              <Divider sx={{ 
                bgcolor: currentTheme.highlight, 
                my: 2,
                height: `${lineWeight}px`
              }} />
            </div>
          );

        case 'skills':
          return (savedSkills.length > 0 || softwareSkills.length > 0) ? (
            <div key="skills" className="sidebar-section">
              <Typography
                variant="h6"
                fontWeight="bold"
                sx={{ 
                  color: currentTheme.sideText, 
                  mb: 2,
                  fontSize: headingSize,
                  fontFamily: font,
                  fontStyle: fontStyle,
                }}
              >
                Key Skills
              </Typography>
              <List dense>
                {savedSkills.map((skill, i) => (
                  <ListItem 
                    key={i} 
                    sx={{ 
                      py: 0,
                      paddingLeft: `${paragraphIndent}px`
                    }}
                  >
                    <ListItemText 
                      primary={`• ${skill.name}${skill.rating ? ` (${skill.rating}%)` : ''}`}
                      sx={{...getTextStyle(), color: currentTheme.sideText}}
                    />
                  </ListItem>
                ))}
                {softwareSkills.map((skill, i) => (
                  <ListItem 
                    key={`software-${i}`} 
                    sx={{ 
                      py: 0,
                      paddingLeft: `${paragraphIndent}px`
                    }}
                  >
                    <ListItemText 
                      primary={`• ${skill.name}${skill.level ? ` (${skill.level}%)` : ''}`}
                      sx={{...getTextStyle(), color: currentTheme.sideText}}
                    />
                  </ListItem>
                ))}
              </List>
              <Divider sx={{ 
                bgcolor: currentTheme.highlight, 
                my: 2,
                height: `${lineWeight}px`
              }} />
            </div>
          ) : null;

        case 'languages':
          return savedLanguages.length > 0 ? (
            <div key="languages" className="sidebar-section">
              <Typography
                variant="h6"
                fontWeight="bold"
                sx={{ 
                  color: currentTheme.sideText, 
                  mb: 2,
                  fontSize: headingSize,
                  fontFamily: font,
                  fontStyle: fontStyle,
                }}
              >
                Languages
              </Typography>
              <List dense>
                {savedLanguages.map((lang, i) => (
                  <ListItem 
                    key={i} 
                    sx={{ 
                      py: 0,
                      paddingLeft: `${paragraphIndent}px`
                    }}
                  >
                    <ListItemText 
                      primary={`• ${lang.name}${lang.level ? ` - ${lang.level}` : ''}`}
                      sx={{...getTextStyle(), color: currentTheme.sideText}}
                    />
                  </ListItem>
                ))}
              </List>
              <Divider sx={{ 
                bgcolor: currentTheme.highlight, 
                my: 2,
                height: `${lineWeight}px`
              }} />
            </div>
          ) : null;

        case 'interests':
          return savedInterests.length > 0 ? (
            <div key="interests" className="sidebar-section">
              <Typography
                variant="h6"
                fontWeight="bold"
                sx={{ 
                  color: currentTheme.sideText, 
                  mb: 2,
                  fontSize: headingSize,
                  fontFamily: font,
                  fontStyle: fontStyle,
                }}
              >
                Interests
              </Typography>
              <List dense>
                {savedInterests.map((interest, i) => (
                  <ListItem 
                    key={i} 
                    sx={{ 
                      py: 0,
                      paddingLeft: `${paragraphIndent}px`
                    }}
                  >
                    <ListItemText 
                      primary={`• ${interest}`}
                      sx={{...getTextStyle(), color: currentTheme.sideText}}
                    />
                  </ListItem>
                ))}
              </List>
              <Divider sx={{ 
                bgcolor: currentTheme.highlight, 
                my: 2,
                height: `${lineWeight}px`
              }} />
            </div>
          ) : null;

        case 'references':
          return savedReferences.length > 0 ? (
            <div key="references" className="sidebar-section">
              <Typography
                variant="h6"
                fontWeight="bold"
                sx={{ 
                  color: currentTheme.sideText, 
                  mb: 2,
                  fontSize: headingSize,
                  fontFamily: font,
                  fontStyle: fontStyle,
                }}
              >
                References
              </Typography>
              <List dense>
                {savedReferences.map((ref, i) => (
                  <ListItem 
                    key={i} 
                    sx={{ 
                      py: 0,
                      paddingLeft: `${paragraphIndent}px`
                    }}
                  >
                    <ListItemText 
                      primary={`• ${ref}`}
                      sx={{...getTextStyle(), color: currentTheme.sideText}}
                    />
                  </ListItem>
                ))}
              </List>
            </div>
          ) : null;

        // Handle sections moved from left side
        case 'profile':
          return (
            <div key="profile" className="sidebar-section">
              <Typography
                variant="h6"
                fontWeight="bold"
                sx={{ 
                  color: 'black', 
                  mb: 2,
                  fontSize: headingSize,
                  fontFamily: font,
                  fontStyle: fontStyle,
                }}
              >
                Profile
              </Typography>
              <Typography 
                sx={{...getTextStyle({ mb: 2 }), color: currentTheme.sideText}}
              >
                {savedSummary || data.profile}
              </Typography>
              <Divider sx={{ 
                bgcolor: currentTheme.highlight, 
                my: 2,
                height: `${lineWeight}px`
              }} />
            </div>
          );

        case 'workExperience':
          return workExperiences && workExperiences.length > 0 ? (
            <div key="workExperience" className="sidebar-section">
              <Typography
                variant="h6"
                fontWeight="bold"
                sx={{ 
                  color: currentTheme.sideText, 
                  mb: 2,
                  fontSize: headingSize,
                  fontFamily: font,
                  fontStyle: fontStyle,
                }}
              >
                Work Experience
              </Typography>
              {workExperiences.slice(0, 2).map((work, i) => (
                <Box key={i} sx={{ mb: 2 }}>
                  <Typography 
                    fontWeight="bold"
                    sx={{...getTextStyle({ fontSize: `calc(${fontSize} * 0.9)` }), color: currentTheme.sideText}}
                  >
                    {work.jobTitle}
                  </Typography>
                  <Typography 
                    sx={{...getTextStyle({ fontSize: `calc(${fontSize} * 0.8)`, fontStyle: 'italic' }), color: currentTheme.sideText}}
                  >
                    {work.employer}
                  </Typography>
                  <Typography 
                    sx={{...getTextStyle({ fontSize: `calc(${fontSize} * 0.8)` }), color: currentTheme.sideText}}
                  >
                    {formatDate(work.startMonth, work.startYear)} -{" "}
                    {work.current ? "Present" : formatDate(work.endMonth, work.endYear)}
                  </Typography>
                </Box>
              ))}
              <Divider sx={{ 
                bgcolor: currentTheme.highlight, 
                my: 2,
                height: `${lineWeight}px`
              }} />
            </div>
          ) : null;

        case 'education':
          return educationEntries.length > 0 ? (
            <div key="education" className="sidebar-section">
              <Typography
                variant="h6"
                fontWeight="bold"
                sx={{ 
                  color: currentTheme.sideText, 
                  mb: 2,
                  fontSize: headingSize,
                  fontFamily: font,
                  fontStyle: fontStyle,
                }}
              >
                Education
              </Typography>
              {educationEntries.slice(0, 2).map((edu, i) => (
                <Box key={i} sx={{ mb: 2 }}>
                  <Typography 
                    fontWeight="bold"
                    sx={{...getTextStyle({ fontSize: `calc(${fontSize} * 0.9)` }), color: currentTheme.sideText}}
                  >
                    {edu.degree}
                  </Typography>
                  <Typography 
                    sx={{...getTextStyle({ fontSize: `calc(${fontSize} * 0.8)` }), color: currentTheme.sideText}}
                  >
                    {edu.schoolName}
                  </Typography>
                  <Typography 
                    sx={{...getTextStyle({ fontSize: `calc(${fontSize} * 0.8)` }), color: currentTheme.sideText}}
                  >
                    {formatDate(edu.gradMonth, edu.gradYear)}
                  </Typography>
                </Box>
              ))}
              <Divider sx={{ 
                bgcolor: currentTheme.highlight, 
                my: 2,
                height: `${lineWeight}px`
              }} />
            </div>
          ) : null;

        case 'certifications':
          return savedCertifications.length > 0 ? (
            <div key="certifications" className="sidebar-section">
              <Typography
                variant="h6"
                fontWeight="bold"
                sx={{ 
                  color: currentTheme.sideText, 
                  mb: 2,
                  fontSize: headingSize,
                  fontFamily: font,
                  fontStyle: fontStyle,
                }}
              >
                Certifications
              </Typography>
              <List dense>
                {savedCertifications.slice(0, 3).map((cert, i) => (
                  <ListItem 
                    key={i} 
                    sx={{ 
                      py: 0,
                      paddingLeft: `${paragraphIndent}px`
                    }}
                  >
                    <ListItemText 
                      primary={`• ${cert.name}`}
                      sx={{...getTextStyle(), color: currentTheme.sideText}}
                    />
                  </ListItem>
                ))}
              </List>
              <Divider sx={{ 
                bgcolor: currentTheme.highlight, 
                my: 2,
                height: `${lineWeight}px`
              }} />
            </div>
          ) : null;

        // renderSidebarSections function-ல் default case-ஐ update பண்ணவும்:
default:
  // Handle custom sections
  if (sectionId && sectionId.startsWith('custom_')) {
    const customSectionName = sectionId.replace('custom_', '');
    const items = customSections[customSectionName] || [];
    
    console.log(`🎯 Rendering sidebar custom section: ${customSectionName}`, items);
    
    if (items && items.length > 0) {
      return (
        <div key={sectionId} className="sidebar-section">
          <Typography
            variant="h6"
            fontWeight="bold"
            sx={{ 
              color: currentTheme.sideText, 
              mb: 2,
              fontSize: headingSize,
              fontFamily: font,
              fontStyle: fontStyle,
            }}
          >
            {customSectionName.replace(/_/g, ' ').toUpperCase()}
          </Typography>
          <List dense>
            {items.slice(0, 3).map((item, i) => (
              <ListItem 
                key={i} 
                sx={{ 
                  py: 0,
                  paddingLeft: `${paragraphIndent}px`
                }}
              >
                <ListItemText 
                  primary={`• ${item}`}
                  sx={{...getTextStyle(), color: currentTheme.sideText}}
                />
              </ListItem>
            ))}
          </List>
          <Divider sx={{ 
            bgcolor: currentTheme.highlight, 
            my: 2,
            height: `${lineWeight}px`
          }} />
        </div>
      );
    } else {
      console.log(`⚠️ No items found for sidebar custom section: ${customSectionName}`);
      return null;
    }
  }
  return null;}
    }).filter(Boolean);
  };

  // Pagination for sidebar content
  const paginateSidebarContent = useCallback(() => {
    if (!sidebarContentRef.current) return;

    const pageHeightInPx = parseFloat(page.height.replace('mm', '')) * 3.78;
    const headerHeight = 120;
    const availableHeight = pageHeightInPx - (2 * topBottomMargin) - headerHeight;

    const sidebarContent = sidebarContentRef.current;
    const sections = Array.from(sidebarContent.querySelectorAll('.sidebar-section'));
    
    let newSidebarPages = [];
    let currentPageSections = [];
    let currentHeight = 0;
    
    sections.forEach((section, index) => {
      const sectionHeight = section.offsetHeight;
      
      if (currentHeight + sectionHeight > availableHeight) {
        if (currentPageSections.length > 0) {
          newSidebarPages.push([...currentPageSections]);
        }
        currentPageSections = [section.outerHTML];
        currentHeight = sectionHeight;
      } else {
        currentPageSections.push(section.outerHTML);
        currentHeight += sectionHeight;
      }
      
      if (index === sections.length - 1 && currentPageSections.length > 0) {
        newSidebarPages.push([...currentPageSections]);
      }
    });
    
    if (newSidebarPages.length === 0) {
      newSidebarPages.push([]);
    }
    
    setSidebarPages(newSidebarPages);
  }, [page.height, topBottomMargin, rightSectionOrder]);

  // Pagination for main content (left side)
  const paginateMainContent = useCallback(() => {
    if (!rightContentRef.current) return;

    const pageHeightInPx = parseFloat(page.height.replace('mm', '')) * 3.78;
    const headerHeight = 120;
    const availableHeight = pageHeightInPx - (2 * topBottomMargin) - headerHeight;

    const rightContent = rightContentRef.current;
    const sections = Array.from(rightContent.querySelectorAll('.resume-section'));
    
    let newPages = [];
    let currentPageSections = [];
    let currentHeight = 0;
    
    sections.forEach((section, index) => {
      const sectionHeight = section.offsetHeight;
      
      if (currentHeight + sectionHeight > availableHeight) {
        if (currentPageSections.length > 0) {
          newPages.push([...currentPageSections]);
        }
        currentPageSections = [section.outerHTML];
        currentHeight = sectionHeight;
      } else {
        currentPageSections.push(section.outerHTML);
        currentHeight += sectionHeight;
      }
      
      if (index === sections.length - 1 && currentPageSections.length > 0) {
        newPages.push([...currentPageSections]);
      }
    });
    
    if (newPages.length === 0) {
      newPages.push([]);
    }
    
    setPages(newPages);
  }, [page.height, topBottomMargin, leftSectionOrder]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      paginateSidebarContent();
      paginateMainContent();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [
    paginateSidebarContent,
    paginateMainContent,
    educationEntries,
    savedSkills,
    savedSummary,
    workExperiences,
    savedAdditionalInfo,
    savedLanguages,
    savedAccomplishments,
    savedCertifications,
    savedReferences,
    softwareSkills,
    savedVolunteering,
    savedInterests,
    savedWebsites,
    customSections,
    leftSectionOrder,
    rightSectionOrder,
     customSections,
    color, // Add color to dependencies
    font, // Add font to dependencies
    fontSize, // Add fontSize to dependencies
    fontStyle, // Add fontStyle to dependencies
    headingSize, // Add headingSize to dependencies
    sectionSpacing, // Add sectionSpacing to dependencies
    paragraphSpacing, // Add paragraphSpacing to dependencies
    lineSpacing, // Add lineSpacing to dependencies
    topBottomMargin, // Add topBottomMargin to dependencies
    sideMargins, // Add sideMargins to dependencies
    paragraphIndent, // Add paragraphIndent to dependencies
    lineWeight, // Add lineWeight to dependencies
    pageSize, // Add pageSize to dependencies
  ]);

  // Render sidebar content for measurement (hidden)
  const renderSidebarForMeasurement = () => (
    <Box ref={sidebarContentRef} sx={{ visibility: 'hidden', position: 'absolute', top: -1000, width: '30%', ...globalFontStyle }}>
      {renderSidebarSections()}
    </Box>
  );

  // Render main content for measurement (hidden)
  const renderMainContentForMeasurement = () => (
    <Box ref={rightContentRef} sx={{ visibility: 'hidden', position: 'absolute', top: -1000, width: '70%', ...globalFontStyle }}>
      {/* Header */}
      <div className="resume-section">
        <Box sx={{ 
          bgcolor: currentTheme.highlight, 
          color: "#ffffffff", 
          p: 3,
          marginBottom: `${sectionSpacing}px`,
          fontFamily: font,
        }}>
          <Typography 
            variant="h4" 
            fontWeight="bold"
            sx={{ 
              fontSize: `calc(${headingSize} * 1.5)`,
              lineHeight: `${lineSpacing * 2}px`,
              fontFamily: font,
              fontStyle: fontStyle,
            }}
          >
            {data.firstName} {data.lastName}
          </Typography>
          <Typography 
            variant="h6"
            sx={{ 
              fontSize: `calc(${headingSize} * 0.8)`,
              lineHeight: `${lineSpacing}px`,
              fontFamily: font,
              fontStyle: fontStyle,
            }}
          >
            {data.currentPosition}
          </Typography>
        </Box>
      </div>

      {renderLeftContentSections()}
    </Box>
  );

  // Render actual sidebar content based on current page
  const renderSidebar = (pageIndex) => (
    <Grid
      item
      xs={4}
      sx={{
        bgcolor: currentTheme.sideBg,
        color: currentTheme.sideText,
        textAlign: "center",
        p: 3,
        width: '30%',
        fontFamily: font,
        fontSize: fontSize,
        fontStyle: fontStyle,
        "@media print": {
          width: "30%",
          display: "inline-block",
          verticalAlign: "top",
          bgcolor: currentTheme.sideBg,
          color: currentTheme.sideText,
          WebkitPrintColorAdjust: "exact",
          printColorAdjust: "exact",
          fontFamily: font,
          fontSize: fontSize,
          fontStyle: fontStyle,
        },
      }}
    >
      {sidebarPages[pageIndex] ? (
        <div 
          style={globalFontStyle}
          dangerouslySetInnerHTML={{ 
            __html: sidebarPages[pageIndex].join('') 
          }} 
        />
      ) : (
        <Typography sx={getTextStyle()}>Loading sidebar content...</Typography>
      )}
    </Grid>
  );

  // Calculate total pages needed
  const totalPages = Math.max(sidebarPages.length, pages.length, 1);

  return (
    <Box sx={{ width: "100%", position: "relative", m: 5 }}>
      {/* Page Navigation Controls */}
      {!exporting && (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 2, gap: 2, '@media print': { display: 'none' } }}>
          <IconButton onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))} disabled={currentPage === 0} color="primary">
            <ChevronLeft />
          </IconButton>
          <Typography sx={{ mx: 2 }}>Page {currentPage + 1} of {totalPages}</Typography>
          <IconButton onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))} disabled={currentPage === totalPages - 1} color="primary">
            <ChevronRight />
          </IconButton>
          
          {enableDragDrop && (
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', ml: 2 }}>
              <Button 
                onClick={handleArrangeSectionsClick}
                variant="contained" 
                startIcon={<Reorder />}
                color="primary"
              >
                Arrange Sections
              </Button>
              
              <Button onClick={resetAllSectionOrder} variant="outlined" color="secondary" size="small">
                Reset All Sections
              </Button>
            </Box>
          )}
        </Box>
      )}
      
      {/* Hidden content for measurement */}
      {renderSidebarForMeasurement()}
      {renderMainContentForMeasurement()}
      
      {/* Visible resume content */}
      <Box id="resume-container">
        {Array.from({ length: totalPages }).map((_, pageIndex) => (
          <Box
            key={pageIndex}
            className="resume-page"
            sx={{
              width: page.width,
              minHeight: page.height,
              mx: "auto",
              bgcolor: currentTheme.mainBg,
              color: currentTheme.text,
              boxShadow: pageIndex === currentPage ? 5 : 0,
              display: "flex",
              flexDirection: "column",
              fontFamily: font,
              fontStyle: fontStyle,
              pageBreakAfter: "always",
              "@media print": {
                width: page.width,
                height: "auto",
                minHeight: page.height,
                boxShadow: "none",
                m: 0,
              },
              // Show all pages when exporting, only current page when viewing
              display: exporting ? 'flex' : (pageIndex === currentPage ? 'flex' : 'none'),
              '@media print': { display: 'flex' }
            }}
          >
            <Grid container sx={{ height: "100%", flex: 1 }}>
              {/* LEFT MAIN CONTENT (70%) */}
              <Grid item xs={8} sx={{
                bgcolor: currentTheme.mainBg,
                width: '70%',
                padding: `${sectionSpacing / 2}px`,
                fontFamily: font,
                fontSize: fontSize,
                fontStyle: fontStyle,
                "@media print": {
                  width: "70%",
                  display: "inline-block",
                  verticalAlign: "top",
                  bgcolor: currentTheme.mainBg,
                  color: currentTheme.text,
                  WebkitPrintColorAdjust: "exact",
                  printColorAdjust: "exact",
                  fontFamily: font,
                  fontSize: fontSize,
                  fontStyle: fontStyle,
                },
              }}>
                {pages[pageIndex] ? (
                  <div 
                    style={globalFontStyle}
                    dangerouslySetInnerHTML={{ 
                      __html: pages[pageIndex].join('') 
                    }} 
                  />
                ) : (
                  <Typography sx={getTextStyle()}>No content for this page</Typography>
                )}
              </Grid>

              {/* RIGHT SIDEBAR (30%) */}
              {sidebarPages[pageIndex] ? renderSidebar(pageIndex) : (
                <Grid
                  item
                  xs={4}
                  sx={{
                    bgcolor: currentTheme.sideBg,
                    color: currentTheme.sideText,
                    textAlign: "center",
                    p: 3,
                    width: '30%',
                    fontFamily: font,
                    fontSize: fontSize,
                    fontStyle: fontStyle,
                    "@media print": {
                      width: "30%",
                      display: "inline-block",
                      verticalAlign: "top",
                      bgcolor: currentTheme.sideBg,
                      color: currentTheme.sideText,
                      WebkitPrintColorAdjust: "exact",
                      printColorAdjust: "exact",
                      fontFamily: font,
                      fontSize: fontSize,
                      fontStyle: fontStyle,
                    },
                  }}
                />
              )}
            </Grid>
          </Box>
        ))}
      </Box>

      {/* Arrange Sections Dialog */}
      <Dialog
        open={arrangeDialogOpen}
        onClose={handleArrangeDialogClose}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" alignItems="center">
            <Reorder sx={{ mr: 1 }} />
            Arrange Resume Sections
          </Box>
        </DialogTitle>

        <DialogContent>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
            Drag and drop sections to reorder them within each side or move sections between left content and right sidebar.
          </Typography>

          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              gap: 3,
              width: "100%",
            }}
          >
            <Box sx={{ flex: 1, width: "50%" }}>
              {renderDragPanel("left", leftSectionOrder)}
            </Box>

            <Box sx={{ flex: 1, width: "50%" }}>
              {renderDragPanel("right", rightSectionOrder)}
            </Box>
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={resetAllSectionOrder} color="secondary">
            Reset All
          </Button>
          <Button onClick={handleArrangeDialogClose} variant="contained">
            Done
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export const resumeMeta = {
  hasPhoto: true,
  columns: 2,
};

export default Resume7;