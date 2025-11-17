import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  Container,
  Grid,
  Paper,
  Box,
  Typography,
  Avatar,
  Divider,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper as MuiPaper
} from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import LanguageIcon from '@mui/icons-material/Language';
import WorkIcon from '@mui/icons-material/Work';
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

// Separate section orders for left and right sides
const defaultLeftSectionOrder = [
  'about',
  'contact',
  'skills',
  'languages',
  'education'
];

const defaultRightSectionOrder = [
  'experience',
  'projects',
  'softwareSkills',
  'interests',
  'additionalInfo',
  'references',
  'websites'
];

const Resume11 = ({ 
  color = '#36454F',
  font = "Arial, sans-serif",
  fontSize = "14px",
  fontStyle = "normal",
  headingSize = "24px",
  sectionSpacing = 30,
  paragraphSpacing = 10,
  lineSpacing = 20,
  topBottomMargin = 30,
  sideMargins = 20,
  paragraphIndent = 0,
  lineWeight = 1,
  pageSize = "A4",
  theme,
  formData = {},
  photo = "",
  workExperiences = [],
  exporting = false,
  enableDragDrop = true
}) => {
  // Use theme color if provided, otherwise use the color prop
  const primaryColor = theme?.primary || color;
  const darkColor = theme?.dark || getDarkColor(primaryColor);
  
  // State for fetched data
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
  const mainContentRef = useRef(null);

  // State for section ordering - separate for left and right
  const [leftSectionOrder, setLeftSectionOrder] = useState(defaultLeftSectionOrder);
  const [rightSectionOrder, setRightSectionOrder] = useState(defaultRightSectionOrder);
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const [dragOverSide, setDragOverSide] = useState(null);
  
  // State for arrange sections dialog
  const [arrangeDialogOpen, setArrangeDialogOpen] = useState(false);

  // Default data
  const defaultData = {
    firstName: "John",
    lastName: "Doe",
    currentPosition: "Senior Graphic Designer",
    phone: "+1 (555) 123-4567",
    email: "johndoe@email.com",
    city: "New York, NY",
    website: "linkedin.com/in/johndoe",
    profile: "A creative and results-driven graphic designer with over 7 years of experience in visual branding and marketing. Passionate about creating designs that solve business problems and delight customers."
  };

  const data = { ...defaultData, ...formData };

  // Page size mapping
  const pageSizeMap = {
    A4: { width: "210mm", height: "297mm" },
    Letter: { width: "216mm", height: "279mm" },
    Legal: { width: "216mm", height: "356mm" },
    A3: { width: "297mm", height: "420mm" },
    Executive: { width: "184mm", height: "267mm" },
  };

  const page = pageSizeMap[pageSize] || pageSizeMap.A4;
  
  // Helper function to darken colors
  function getDarkColor(hex) {
    let c = hex.replace('#', '');
    if (c.length === 8) c = c.slice(0, 6);
    let r = Math.max(0, parseInt(c.substring(0,2),16) - 40);
    let g = Math.max(0, parseInt(c.substring(2,4),16) - 40);
    let b = Math.max(0, parseInt(c.substring(4,6),16) - 40);
    return `#${r.toString(16).padStart(2,'0')}${g.toString(16).padStart(2,'0')}${b.toString(16).padStart(2,'0')}`;
  }

  // Format date helper
  const formatDate = (month, year) => {
    if (!month || !year) return "";
    return `${month} ${year}`;
  };

  // Load data from localStorage
  useEffect(() => {
    const loadData = () => {
      console.log("🔄 Loading resume data from localStorage...");
      
      // Load basic data
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
      
      // Load custom sections
      const userId = localStorage.getItem("userId");
      console.log("👤 Current userId:", userId);
      
      let sectionsData = {};

      if (userId) {
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
        }
      }

      setCustomSections(sectionsData);

      // Load section orders with custom sections handling
      const savedLeftSectionOrder = localStorage.getItem("resume11LeftSectionOrder");
      const savedRightSectionOrder = localStorage.getItem("resume11RightSectionOrder");
      
      const currentCustomSectionIds = Object.keys(sectionsData).map(name => `custom_${name}`);
      
      // Handle left section order
      if (savedLeftSectionOrder) {
        const parsedOrder = JSON.parse(savedLeftSectionOrder);
        // Remove custom sections from left side (they should only be on right side)
        const filteredOrder = parsedOrder.filter(section => !section.startsWith('custom_'));
        setLeftSectionOrder(filteredOrder);
      } else {
        setLeftSectionOrder(defaultLeftSectionOrder);
      }

      // Handle right section order
      if (savedRightSectionOrder) {
        const parsedOrder = JSON.parse(savedRightSectionOrder);
        // Remove old custom sections and add current ones
        const filteredOrder = parsedOrder.filter(section => !section.startsWith('custom_'));
        const allRightSections = [...filteredOrder, ...currentCustomSectionIds];
        setRightSectionOrder(allRightSections);
      } else {
        // First time setup - add custom sections to right side
        const updatedRightSectionOrder = [...defaultRightSectionOrder, ...currentCustomSectionIds];
        setRightSectionOrder(updatedRightSectionOrder);
      }
    };

    loadData();
  }, []);

  // Save section orders to localStorage
  useEffect(() => {
    if (leftSectionOrder.length > 0) {
      localStorage.setItem("resume11LeftSectionOrder", JSON.stringify(leftSectionOrder));
    }
  }, [leftSectionOrder]);

  useEffect(() => {
    if (rightSectionOrder.length > 0) {
      localStorage.setItem("resume11RightSectionOrder", JSON.stringify(rightSectionOrder));
    }
  }, [rightSectionOrder]);

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
      const newSectionOrder = [...leftSectionOrder];
      const [movedSection] = newSectionOrder.splice(sourceIndex, 1);
      newSectionOrder.splice(targetIndex, 0, movedSection);
      setLeftSectionOrder(newSectionOrder);
    } else if (sourceSide === 'right') {
      const newLeftSectionOrder = [...leftSectionOrder];
      const newRightSectionOrder = [...rightSectionOrder];
      
      newRightSectionOrder.splice(sourceIndex, 1);
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
      const newSectionOrder = [...rightSectionOrder];
      const [movedSection] = newSectionOrder.splice(sourceIndex, 1);
      newSectionOrder.splice(targetIndex, 0, movedSection);
      setRightSectionOrder(newSectionOrder);
    } else if (sourceSide === 'left') {
      const newLeftSectionOrder = [...leftSectionOrder];
      const newRightSectionOrder = [...rightSectionOrder];
      
      newLeftSectionOrder.splice(sourceIndex, 1);
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

  // Common typography styles function
  const getTypographyStyles = (isHeading = false, isSidebar = false, customColor = null) => {
    const baseStyles = {
      fontFamily: font,
      fontStyle: fontStyle,
      lineHeight: `${lineSpacing}px`,
    };

    if (isHeading) {
      return {
        ...baseStyles,
        fontSize: headingSize,
        fontWeight: "bold",
        color: customColor || (isSidebar ? '#F8F8F8' : '#333333'),
        mb: sectionSpacing / 10,
      };
    }

    return {
      ...baseStyles,
      fontSize: fontSize,
      color: customColor || (isSidebar ? '#F8F8F8' : '#333333'),
      textIndent: `${paragraphIndent}px`,
      mb: paragraphSpacing / 10,
    };
  };

  // Common box container styles
  const getContainerStyles = (isSidebar = false) => ({
    fontFamily: font,
    fontSize: fontSize,
    fontStyle: fontStyle,
    lineHeight: `${lineSpacing}px`,
    ...(isSidebar && {
      bgcolor: primaryColor,
      color: '#F8F8F8',
    })
  });

  // Render left sidebar content
  const renderLeftSectionContent = (sectionId) => {
    const textColor = '#F8F8F8';
    const isSidebar = true;
    
    switch (sectionId) {
      case 'about':
        return (
          <Box key="about" sx={{ mb: sectionSpacing / 10, ...getContainerStyles(isSidebar) }}>
            <Avatar
              alt={`${data.firstName} ${data.lastName}`}
              src={photo || "/path/to/your/image.jpg"}
              sx={{ 
                width: 120, 
                height: 120, 
                margin: '0 auto', 
                mb: sectionSpacing / 10,
                border: `${lineWeight * 2}px solid ${textColor}`,
              }}
            />
            <Typography 
              variant="h5" 
              component="h2" 
              sx={getTypographyStyles(true, isSidebar, textColor)}
            >
              About Me
            </Typography>
            <Typography sx={getTypographyStyles(false, isSidebar, textColor)}>
              {savedSummary || data.profile}
            </Typography>
          </Box>
        );

      case 'contact':
        return (
          <Box key="contact" sx={{ mb: sectionSpacing / 10, ...getContainerStyles(isSidebar) }}>
            <Typography 
              variant="h5" 
              sx={getTypographyStyles(true, isSidebar, textColor)}
            >
              Contact
            </Typography>
            <Box display="flex" mb={paragraphSpacing / 10} sx={getContainerStyles(isSidebar)}>
              <PhoneIcon sx={{ mr: 1, color: textColor, fontSize: fontSize }} />
              <Typography sx={getTypographyStyles(false, isSidebar, textColor)}>
                {data.phone}
              </Typography>
            </Box>
            <Box display="flex" alignItems="center" mb={paragraphSpacing / 10} sx={getContainerStyles(isSidebar)}>
              <EmailIcon sx={{ mr: 1, color: textColor, fontSize: fontSize }} />
              <Typography sx={getTypographyStyles(false, isSidebar, textColor)}>
                {data.email}
              </Typography>
            </Box>
            <Box display="flex" alignItems="center" mb={paragraphSpacing / 10} sx={getContainerStyles(isSidebar)}>
              <LocationOnIcon sx={{ mr: 1, color: textColor, fontSize: fontSize }} />
              <Typography sx={getTypographyStyles(false, isSidebar, textColor)}>
                {data.city}
              </Typography>
            </Box>
            <Box display="flex" alignItems="center" sx={getContainerStyles(isSidebar)}>
              <LinkedInIcon sx={{ mr: 1, color: textColor, fontSize: fontSize }} />
              <Typography sx={getTypographyStyles(false, isSidebar, textColor)}>
                {data.website}
              </Typography>
            </Box>
          </Box>
        );

      case 'skills':
        return (
          <Box key="skills" sx={{ mb: sectionSpacing / 10, ...getContainerStyles(isSidebar) }}>
            <Typography 
              variant="h5" 
              sx={getTypographyStyles(true, isSidebar, textColor)}
            >
              Skills
            </Typography>
            <Box component="ul" sx={{ listStyleType: 'none', p: 0, ...getContainerStyles(isSidebar) }}>
              {savedSkills.length > 0 ? (
                savedSkills.map((skill, i) => (
                  <Box key={i} component="li" sx={{ mb: paragraphSpacing / 10, ...getContainerStyles(isSidebar) }}>
                    <Typography sx={getTypographyStyles(false, isSidebar, textColor)}>
                      {skill.name}
                    </Typography>
                  </Box>
                ))
              ) : (
                <>
                  <Box component="li" sx={{ mb: paragraphSpacing / 10, ...getContainerStyles(isSidebar) }}>
                    <Typography sx={getTypographyStyles(false, isSidebar, textColor)}>
                      Adobe Creative Suite
                    </Typography>
                  </Box>
                  <Box component="li" sx={{ mb: paragraphSpacing / 10, ...getContainerStyles(isSidebar) }}>
                    <Typography sx={getTypographyStyles(false, isSidebar, textColor)}>
                      UI/UX Design
                    </Typography>
                  </Box>
                  <Box component="li" sx={{ mb: paragraphSpacing / 10, ...getContainerStyles(isSidebar) }}>
                    <Typography sx={getTypographyStyles(false, isSidebar, textColor)}>
                      Branding & Identity
                    </Typography>
                  </Box>
                  <Box component="li" sx={{ mb: paragraphSpacing / 10, ...getContainerStyles(isSidebar) }}>
                    <Typography sx={getTypographyStyles(false, isSidebar, textColor)}>
                      Print & Digital Media
                    </Typography>
                  </Box>
                </>
              )}
            </Box>
          </Box>
        );

      case 'languages':
        return savedLanguages.length > 0 ? (
          <Box key="languages" sx={{ mb: sectionSpacing / 10, ...getContainerStyles(isSidebar) }}>
            <Typography 
              variant="h5" 
              sx={getTypographyStyles(true, isSidebar, textColor)}
            >
              Languages
            </Typography>
            <Box component="ul" sx={{ listStyleType: 'none', p: 0, ...getContainerStyles(isSidebar) }}>
              {savedLanguages.map((lang, i) => (
                <Box key={i} component="li" sx={{ mb: paragraphSpacing / 10, ...getContainerStyles(isSidebar) }}>
                  <Typography sx={getTypographyStyles(false, isSidebar, textColor)}>
                    {lang.name} {lang.level ? `- ${lang.level}` : ""}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        ) : null;

      case 'education':
        return (
          <Box key="education" sx={getContainerStyles(isSidebar)}>
            <Typography 
              variant="h5" 
              sx={getTypographyStyles(true, isSidebar, textColor)}
            >
              Education
            </Typography>
            {educationEntries.length > 0 ? (
              educationEntries.map((edu) => (
                <Box key={edu.id} sx={{ mb: sectionSpacing / 10, ...getContainerStyles(isSidebar) }}>
                  <Typography 
                    variant="subtitle1" 
                    fontWeight="bold" 
                    sx={getTypographyStyles(false, isSidebar, textColor)}
                  >
                    {edu.degree} - {edu.fieldOfStudy}
                  </Typography>
                  <Typography sx={getTypographyStyles(false, isSidebar, textColor)}>
                    {edu.schoolName}, {edu.schoolLocation}
                  </Typography>
                  <Typography sx={getTypographyStyles(false, isSidebar, textColor)}>
                    Graduated: {formatDate(edu.gradMonth, edu.gradYear)}
                  </Typography>
                </Box>
              ))
            ) : (
              <>
                <Typography 
                  variant="subtitle1" 
                  fontWeight="bold" 
                  sx={getTypographyStyles(false, isSidebar, textColor)}
                >
                  B.F.A. in Graphic Design
                </Typography>
                <Typography sx={getTypographyStyles(false, isSidebar, textColor)}>
                  New York School of Design
                </Typography>
                <Typography sx={getTypographyStyles(false, isSidebar, textColor)}>
                  Graduated: May 2018
                </Typography>
              </>
            )}
          </Box>
        );
      default:
        if (sectionId && sectionId.startsWith('custom_')) {
          const customSectionName = sectionId.replace('custom_', '');
          const items = customSections[customSectionName] || [];
          
          if (items && items.length > 0) {
            return (
              <Box key={sectionId} sx={{ mb: sectionSpacing / 10, ...getContainerStyles(isSidebar) }}>
                <Typography 
                  variant="h5" 
                  sx={getTypographyStyles(true, isSidebar, textColor)}
                >
                  {customSectionName.toUpperCase()}
                </Typography>
                {items.map((item, i) => (
                  <Typography 
                    key={i} 
                    sx={getTypographyStyles(false, isSidebar, textColor)}
                  >
                    • {item}
                  </Typography>
                ))}
              </Box>
            );
          }
          return null;
        }
        
        return renderRightSectionContent(sectionId, true);
    }
  };

  // Render right content sections
  const renderRightSectionContent = (sectionId, inSidebar = false) => {
    const textColor = inSidebar ? '#F8F8F8' : '#333333';
    const dustyBlue = primaryColor;
    const isSidebar = inSidebar;
    
    switch (sectionId) {
      case 'experience':
        return (
          <div key="experience" className="resume-section" style={getContainerStyles(isSidebar)}>
            <Typography 
              variant="h4" 
              sx={getTypographyStyles(true, isSidebar, textColor)}
            >
              Experience
            </Typography>

            {workExperiences && workExperiences.length > 0 ? (
              workExperiences.map((work, i) => (
                <Box key={i} sx={{ mb: sectionSpacing / 10, ...getContainerStyles(isSidebar) }}>
                  <Box display="flex" justifyContent="space-between" alignItems="center" sx={getContainerStyles(isSidebar)}>
                    <Typography 
                      variant="h6" 
                      fontWeight="bold" 
                      sx={getTypographyStyles(false, isSidebar, textColor)}
                    >
                      {work.jobTitle}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{
                        ...getTypographyStyles(false, isSidebar, inSidebar ? "rgba(255,255,255,0.8)" : "text.secondary"),
                        fontStyle: 'italic'
                      }}
                    >
                      {formatDate(work.startMonth, work.startYear)} -{" "}
                      {work.current ? "Present" : formatDate(work.endMonth, work.endYear)}
                    </Typography>
                  </Box>
                  <Typography 
                    variant="subtitle2" 
                    sx={{
                      ...getTypographyStyles(false, isSidebar, inSidebar ? "rgba(255,255,255,0.8)" : "text.secondary"),
                      mb: paragraphSpacing / 10,
                      fontStyle: 'italic'
                    }}
                  >
                    {work.company} | {work.location}
                  </Typography>
                  <Typography sx={{
                    ...getTypographyStyles(false, isSidebar, textColor),
                    whiteSpace: "pre-line",
                  }}>
                    {work.description || "No description provided."}
                  </Typography>
                </Box>
              ))
            ) : (
              <>
                <Box sx={{ mb: sectionSpacing / 10, ...getContainerStyles(isSidebar) }}>
                  <Box display="flex" justifyContent="space-between" alignItems="center" sx={getContainerStyles(isSidebar)}>
                    <Typography 
                      variant="h6" 
                      fontWeight="bold" 
                      sx={getTypographyStyles(false, isSidebar, textColor)}
                    >
                      Lead Designer
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{
                        ...getTypographyStyles(false, isSidebar, inSidebar ? "rgba(255,255,255,0.8)" : "text.secondary"),
                        fontStyle: 'italic'
                      }}
                    >
                      Jan 2022 - Present
                    </Typography>
                  </Box>
                  <Typography 
                    variant="subtitle2" 
                    sx={{
                      ...getTypographyStyles(false, isSidebar, inSidebar ? "rgba(255,255,255,0.8)" : "text.secondary"),
                      mb: paragraphSpacing / 10,
                      fontStyle: 'italic'
                    }}
                  >
                    Creative Solutions Inc. | New York, NY
                  </Typography>
                  <Typography sx={getTypographyStyles(false, isSidebar, textColor)}>
                    • Led a team of 5 designers on major branding projects, increasing client satisfaction by 25%.
                  </Typography>
                  <Typography sx={getTypographyStyles(false, isSidebar, textColor)}>
                    • Developed and executed design strategies that resulted in a 15% growth in new business.
                  </Typography>
                </Box>
              </>
            )}
          </div>
        );
case 'projects':
  return (
    <div key="projects" className="resume-section" style={getContainerStyles(isSidebar)}>
      {/* CERTIFICATIONS SECTION */}
      {savedCertifications.length > 0 && (
        <>
          <Typography 
            variant="h4" 
            sx={getTypographyStyles(true, isSidebar, textColor)}
          >
            Certifications
          </Typography>
          {savedCertifications.map((cert, index) => (
            <Box key={index} sx={{ mb: paragraphSpacing / 5, ...getContainerStyles(isSidebar) }}>
              <Box display="flex" alignItems="center" sx={{ mb: paragraphSpacing / 10, ...getContainerStyles(isSidebar) }}>
                <WorkIcon sx={{ mr: 1, color: inSidebar ? '#F8F8F8' : dustyBlue, fontSize: fontSize }} />
                <Typography 
                  variant="h6" 
                  fontWeight="bold" 
                  sx={getTypographyStyles(false, isSidebar, textColor)}
                >
                  {cert.name} - {cert.provider}
                </Typography>
              </Box>
              <Typography sx={getTypographyStyles(false, isSidebar, textColor)}>
                • Completed in {cert.year}
              </Typography>
            </Box>
          ))}
        </>
      )}

      {/* ACCOMPLISHMENTS SECTION */}
      {savedAccomplishments.length > 0 && (
        <>
          <Typography 
            variant="h4" 
            sx={getTypographyStyles(true, isSidebar, textColor)}
          >
            Accomplishments
          </Typography>
          {savedAccomplishments.map((acc, index) => (
            <Box key={index} sx={{ mb: paragraphSpacing / 5, ...getContainerStyles(isSidebar) }}>
              <Box display="flex" alignItems="center" sx={{ mb: paragraphSpacing / 10, ...getContainerStyles(isSidebar) }}>
                <WorkIcon sx={{ mr: 1, color: inSidebar ? '#F8F8F8' : dustyBlue, fontSize: fontSize }} />
                <Typography 
                  variant="h6" 
                  fontWeight="bold" 
                  sx={getTypographyStyles(false, isSidebar, textColor)}
                >
                  Accomplishment {index + 1}
                </Typography>
              </Box>
              <Typography sx={{
                ...getTypographyStyles(false, isSidebar, textColor),
                whiteSpace: "pre-line",
              }}>
                {acc}
              </Typography>
            </Box>
          ))}
        </>
      )}

      {/* VOLUNTEERING SECTION */}
      {savedVolunteering.length > 0 && (
        <>
          <Typography 
            variant="h4" 
            sx={getTypographyStyles(true, isSidebar, textColor)}
          >
            Volunteering
          </Typography>
          {savedVolunteering.map((vol, index) => (
            <Box key={index} sx={{ mb: paragraphSpacing / 5, ...getContainerStyles(isSidebar) }}>
              <Box display="flex" alignItems="center" sx={{ mb: paragraphSpacing / 10, ...getContainerStyles(isSidebar) }}>
                <WorkIcon sx={{ mr: 1, color: inSidebar ? '#F8F8F8' : dustyBlue, fontSize: fontSize }} />
                <Typography 
                  variant="h6" 
                  fontWeight="bold" 
                  sx={getTypographyStyles(false, isSidebar, textColor)}
                >
                  {vol.subtopic}
                </Typography>
              </Box>
              <Typography sx={{
                ...getTypographyStyles(false, isSidebar, textColor),
                whiteSpace: "pre-line",
              }}>
                {vol.content}
              </Typography>
            </Box>
          ))}
        </>
      )}

      {/* DEFAULT CONTENT - Only show if all sections are empty */}
      {savedAccomplishments.length === 0 && savedCertifications.length === 0 && savedVolunteering.length === 0 && (
        <>
          <Typography 
            variant="h4" 
            sx={getTypographyStyles(true, isSidebar, textColor)}
          >
            Projects & Accomplishments
          </Typography>
          
          <Box sx={{ mb: paragraphSpacing / 5, ...getContainerStyles(isSidebar) }}>
            <Box display="flex" alignItems="center" sx={{ mb: paragraphSpacing / 10, ...getContainerStyles(isSidebar) }}>
              <WorkIcon sx={{ mr: 1, color: inSidebar ? '#F8F8F8' : dustyBlue, fontSize: fontSize }} />
              <Typography 
                variant="h6" 
                fontWeight="bold" 
                sx={getTypographyStyles(false, isSidebar, textColor)}
              >
                E-commerce Brand Redesign
              </Typography>
            </Box>
            <Typography sx={getTypographyStyles(false, isSidebar, textColor)}>
              • Led the full visual redesign of an e-commerce platform, improving user experience and increasing conversion rates by 10%.
            </Typography>
            <Typography sx={getTypographyStyles(false, isSidebar, textColor)}>
              • Created a comprehensive brand style guide, including new logo, color palette, and typography.
            </Typography>
          </Box>
          
          <Box sx={getContainerStyles(isSidebar)}>
            <Box display="flex" alignItems="center" sx={{ mb: paragraphSpacing / 10, ...getContainerStyles(isSidebar) }}>
              <WorkIcon sx={{ mr: 1, color: inSidebar ? '#F8F8F8' : dustyBlue, fontSize: fontSize }} />
              <Typography 
                variant="h6" 
                fontWeight="bold" 
                sx={getTypographyStyles(false, isSidebar, textColor)}
              >
                Mobile App UI/UX
              </Typography>
            </Box>
            <Typography sx={getTypographyStyles(false, isSidebar, textColor)}>
              • Designed the complete user interface and user experience for a new mobile application.
            </Typography>
            <Typography sx={getTypographyStyles(false, isSidebar, textColor)}>
              • Conducted user research and usability testing to inform design decisions and improve flow.
            </Typography>
          </Box>
        </>
      )}
    </div>
  );

      case 'softwareSkills':
        return softwareSkills.length > 0 ? (
          <div key="softwareSkills" className="resume-section" style={getContainerStyles(isSidebar)}>
            <Typography 
              variant="h4" 
              sx={getTypographyStyles(true, isSidebar, textColor)}
            >
              Software Skills
            </Typography>
            {softwareSkills.map((skill, index) => (
              <Typography 
                key={index} 
                sx={getTypographyStyles(false, isSidebar, textColor)}
              >
                {skill.name} — {skill.level}%
              </Typography>
            ))}
          </div>
        ) : null;

      case 'interests':
        return savedInterests.length > 0 ? (
          <div key="interests" className="resume-section" style={getContainerStyles(isSidebar)}>
            <Typography 
              variant="h4" 
              sx={getTypographyStyles(true, isSidebar, textColor)}
            >
              Interests
            </Typography>
            {savedInterests.map((interest, index) => (
              <Typography 
                key={index} 
                sx={getTypographyStyles(false, isSidebar, textColor)}
              >
                • {interest}
              </Typography>
            ))}
          </div>
        ) : null;

      case 'additionalInfo':
        return savedAdditionalInfo.length > 0 ? (
          <div key="additionalInfo" className="resume-section" style={getContainerStyles(isSidebar)}>
            <Typography 
              variant="h4" 
              sx={getTypographyStyles(true, isSidebar, textColor)}
            >
              Additional Information
            </Typography>
            {savedAdditionalInfo.map((info, index) => (
              <Typography 
                key={index} 
                sx={getTypographyStyles(false, isSidebar, textColor)}
              >
                {info}
              </Typography>
            ))}
          </div>
        ) : null;

      case 'references':
        return savedReferences.length > 0 ? (
          <div key="references" className="resume-section" style={getContainerStyles(isSidebar)}>
            <Typography 
              variant="h4" 
              sx={getTypographyStyles(true, isSidebar, textColor)}
            >
              References
            </Typography>
            {savedReferences.map((ref, index) => (
              <Typography 
                key={index} 
                sx={{
                  ...getTypographyStyles(false, isSidebar, textColor),
                  whiteSpace: "pre-line",
                }}
              >
                {ref}
              </Typography>
            ))}
          </div>
        ) : null;

      case 'websites':
        return savedWebsites.length > 0 ? (
          <div key="websites" className="resume-section" style={getContainerStyles(isSidebar)}>
            <Typography 
              variant="h4" 
              sx={getTypographyStyles(true, isSidebar, textColor)}
            >
              Websites / Profiles
            </Typography>
            {savedWebsites.map((site, index) => (
              <Typography 
                key={index} 
                sx={getTypographyStyles(false, isSidebar, textColor)}
              >
                {site.url} {site.addToHeader ? "(Shown in Header)" : ""}
              </Typography>
            ))}
          </div>
        ) : null;

      case 'about':
        return (
          <div key="about" className="resume-section" style={getContainerStyles(isSidebar)}>
            <Typography 
              variant="h4" 
              sx={getTypographyStyles(true, isSidebar, textColor)}
            >
              About Me
            </Typography>
            {!inSidebar && (
              <Avatar
                alt={`${data.firstName} ${data.lastName}`}
                src={photo || "/path/to/your/image.jpg"}
                sx={{ 
                  width: 120, 
                  height: 120, 
                  margin: '0 auto', 
                  mb: sectionSpacing / 10,
                  border: `${lineWeight * 2}px solid ${textColor}`,
                }}
              />
            )}
            <Typography sx={getTypographyStyles(false, isSidebar, textColor)}>
              {savedSummary || data.profile}
            </Typography>
          </div>
        );

      case 'contact':
        return (
          <div key="contact" className="resume-section" style={getContainerStyles(isSidebar)}>
            <Typography 
              variant="h4" 
              sx={getTypographyStyles(true, isSidebar, textColor)}
            >
              Contact
            </Typography>
            <Box display="flex" mb={paragraphSpacing / 10} sx={getContainerStyles(isSidebar)}>
              <PhoneIcon sx={{ mr: 1, color: inSidebar ? '#F8F8F8' : dustyBlue, fontSize: fontSize }} />
              <Typography sx={getTypographyStyles(false, isSidebar, textColor)}>
                {data.phone}
              </Typography>
            </Box>
            <Box display="flex" alignItems="center" mb={paragraphSpacing / 10} sx={getContainerStyles(isSidebar)}>
              <EmailIcon sx={{ mr: 1, color: inSidebar ? '#F8F8F8' : dustyBlue, fontSize: fontSize }} />
              <Typography sx={getTypographyStyles(false, isSidebar, textColor)}>
                {data.email}
              </Typography>
            </Box>
            <Box display="flex" alignItems="center" mb={paragraphSpacing / 10} sx={getContainerStyles(isSidebar)}>
              <LocationOnIcon sx={{ mr: 1, color: inSidebar ? '#F8F8F8' : dustyBlue, fontSize: fontSize }} />
              <Typography sx={getTypographyStyles(false, isSidebar, textColor)}>
                {data.city}
              </Typography>
            </Box>
            <Box display="flex" alignItems="center" sx={getContainerStyles(isSidebar)}>
              <LinkedInIcon sx={{ mr: 1, color: inSidebar ? '#F8F8F8' : dustyBlue, fontSize: fontSize }} />
              <Typography sx={getTypographyStyles(false, isSidebar, textColor)}>
                {data.website}
              </Typography>
            </Box>
          </div>
        );

      case 'skills':
        return (
          <div key="skills" className="resume-section" style={getContainerStyles(isSidebar)}>
            <Typography 
              variant="h4" 
              sx={getTypographyStyles(true, isSidebar, textColor)}
            >
              Skills
            </Typography>
            <Box component="ul" sx={{ listStyleType: 'none', p: 0, ...getContainerStyles(isSidebar) }}>
              {savedSkills.length > 0 ? (
                savedSkills.map((skill, i) => (
                  <Box key={i} component="li" sx={{ mb: paragraphSpacing / 10, ...getContainerStyles(isSidebar) }}>
                    <Typography sx={getTypographyStyles(false, isSidebar, textColor)}>
                      {skill.name}
                    </Typography>
                  </Box>
                ))
              ) : (
                <>
                  <Box component="li" sx={{ mb: paragraphSpacing / 10, ...getContainerStyles(isSidebar) }}>
                    <Typography sx={getTypographyStyles(false, isSidebar, textColor)}>
                      Adobe Creative Suite
                    </Typography>
                  </Box>
                  <Box component="li" sx={{ mb: paragraphSpacing / 10, ...getContainerStyles(isSidebar) }}>
                    <Typography sx={getTypographyStyles(false, isSidebar, textColor)}>
                      UI/UX Design
                    </Typography>
                  </Box>
                  <Box component="li" sx={{ mb: paragraphSpacing / 10, ...getContainerStyles(isSidebar) }}>
                    <Typography sx={getTypographyStyles(false, isSidebar, textColor)}>
                      Branding & Identity
                    </Typography>
                  </Box>
                  <Box component="li" sx={{ mb: paragraphSpacing / 10, ...getContainerStyles(isSidebar) }}>
                    <Typography sx={getTypographyStyles(false, isSidebar, textColor)}>
                      Print & Digital Media
                    </Typography>
                  </Box>
                </>
              )}
            </Box>
          </div>
        );

      case 'languages':
        return savedLanguages.length > 0 ? (
          <div key="languages" className="resume-section" style={getContainerStyles(isSidebar)}>
            <Typography 
              variant="h4" 
              sx={getTypographyStyles(true, isSidebar, textColor)}
            >
              Languages
            </Typography>
            <Box component="ul" sx={{ listStyleType: 'none', p: 0, ...getContainerStyles(isSidebar) }}>
              {savedLanguages.map((lang, i) => (
                <Box key={i} component="li" sx={{ mb: paragraphSpacing / 10, ...getContainerStyles(isSidebar) }}>
                  <Typography sx={getTypographyStyles(false, isSidebar, textColor)}>
                    {lang.name} {lang.level ? `- ${lang.level}` : ""}
                  </Typography>
                </Box>
              ))}
            </Box>
          </div>
        ) : null;

      case 'education':
        return (
          <div key="education" className="resume-section" style={getContainerStyles(isSidebar)}>
            <Typography 
              variant="h4" 
              sx={getTypographyStyles(true, isSidebar, textColor)}
            >
              Education
            </Typography>
            {educationEntries.length > 0 ? (
              educationEntries.map((edu) => (
                <Box key={edu.id} sx={{ mb: sectionSpacing / 10, ...getContainerStyles(isSidebar) }}>
                  <Typography 
                    variant="subtitle1" 
                    fontWeight="bold" 
                    sx={getTypographyStyles(false, isSidebar, inSidebar ? '#F8F8F8' : dustyBlue)}
                  >
                    {edu.degree} - {edu.fieldOfStudy}
                  </Typography>
                  <Typography sx={getTypographyStyles(false, isSidebar, textColor)}>
                    {edu.schoolName}, {edu.schoolLocation}
                  </Typography>
                  <Typography sx={getTypographyStyles(false, isSidebar, textColor)}>
                    Graduated: {formatDate(edu.gradMonth, edu.gradYear)}
                  </Typography>
                </Box>
              ))
            ) : (
              <>
                <Typography 
                  variant="subtitle1" 
                  fontWeight="bold" 
                  sx={getTypographyStyles(false, isSidebar, inSidebar ? '#F8F8F8' : dustyBlue)}
                >
                  B.F.A. in Graphic Design
                </Typography>
                <Typography sx={getTypographyStyles(false, isSidebar, textColor)}>
                  New York School of Design
                </Typography>
                <Typography sx={getTypographyStyles(false, isSidebar, textColor)}>
                  Graduated: May 2018
                </Typography>
              </>
            )}
          </div>
        );
      default:
        if (sectionId && sectionId.startsWith('custom_')) {
          const customSectionName = sectionId.replace('custom_', '');
          const items = customSections[customSectionName] || [];
          
          if (items && items.length > 0) {
            return (
              <div key={sectionId} className="resume-section" style={getContainerStyles(isSidebar)}>
                <Typography 
                  variant="h4" 
                  sx={getTypographyStyles(true, isSidebar, textColor)}
                >
                  {customSectionName.toUpperCase()}
                </Typography>
                {items.map((item, i) => (
                  <Typography 
                    key={i} 
                    sx={getTypographyStyles(false, isSidebar, textColor)}
                  >
                    • {item}
                  </Typography>
                ))}
              </div>
            );
          }
          return null;
        }
        
        return renderLeftSectionContent(sectionId, true);
    }
  };

  const getSectionTitle = (sectionId) => {
    const titles = {
      'about': 'About Me',
      'contact': 'Contact',
      'skills': 'Skills',
      'languages': 'Languages',
      'education': 'Education',
      'experience': 'Experience',
      'projects': 'Projects & Accomplishments',
      'softwareSkills': 'Software Skills',
      'interests': 'Interests',
      'additionalInfo': 'Additional Information',
      'references': 'References',
      'websites': 'Websites/Profiles',
      'volunteering': 'Volunteering',

    };
    
    if (sectionId.startsWith('custom_')) {
      return sectionId.replace('custom_', '').toUpperCase();
    }
    
    return titles[sectionId] || sectionId;
  };

  const renderDragPanel = (side, sections) => {
    return (
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
          <DragIndicator sx={{ mr: 1 }} />
          {side === 'left' ? 'Right Content' : 'Left Sidebar'} Sections
          <Typography variant="body2" color="textSecondary" sx={{ ml: 1 }}>
            ({sections.length} sections)
          </Typography>
        </Typography>
        <Box sx={{ maxHeight: 400, overflow: 'auto', border: '1px solid #e0e0e0', borderRadius: 1, p: 1 }}>
          {sections.length > 0 ? (
            sections.map((sectionId, index) => (
              <MuiPaper
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
              </MuiPaper>
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

  // Pagination function
  const paginateContent = useCallback(() => {
    if (!mainContentRef.current) return;

    const mainSections = Array.from(mainContentRef.current.querySelectorAll('.resume-section'));
    
    const pageHeightInPx = parseFloat(page.height.replace('mm', '')) * 3.78;
    const mainAvailableHeight = pageHeightInPx - (2 * topBottomMargin);

    let newPages = [];
    let currentMainPageSections = [];
    let currentMainHeight = 0;
    
    if (mainSections.length === 0) {
      newPages.push({ main: [] });
    }
    
    mainSections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      
      if (currentMainHeight + sectionHeight > mainAvailableHeight) {
        newPages.push({
          main: currentMainPageSections,
        });
        currentMainPageSections = [section];
        currentMainHeight = sectionHeight;
      } else {
        currentMainPageSections.push(section);
        currentMainHeight += sectionHeight;
      }
    });
    
    if (currentMainPageSections.length > 0) {
      newPages.push({
        main: currentMainPageSections,
      });
    }
    
    setPages(newPages);
  }, [page.height, topBottomMargin]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      paginateContent();
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [paginateContent, rightSectionOrder, customSections]);

  // Render right content sections for measurement
  const renderRightContentSections = () => {
    return rightSectionOrder.map(sectionId => (
      <React.Fragment key={sectionId}>
        {renderRightSectionContent(sectionId)}
      </React.Fragment>
    ));
  };

  // Render main content for measurement (hidden)
  const renderMainContentToMeasure = () => (
    <Box ref={mainContentRef} sx={{ visibility: 'hidden', position: 'absolute', ...getContainerStyles() }}>
      <Box sx={{ p: `${topBottomMargin}px ${sideMargins}px` }}>
        {renderRightContentSections()}
      </Box>
    </Box>
  );

  // Render sidebar sections based on current order
  const renderSidebarSections = (pageIndex) => {
    if (pageIndex === 0) {
      return leftSectionOrder.map((sectionId, index) => (
        <React.Fragment key={sectionId}>
          {renderLeftSectionContent(sectionId)}
          {index < leftSectionOrder.length - 1 && (
            <Divider sx={{ 
              my: sectionSpacing / 10, 
              bgcolor: '#F8F8F8',
              borderWidth: `${lineWeight}px`,
              ...getContainerStyles(true),
            }} />
          )}
        </React.Fragment>
      ));
    }
    return null;
  };

  return (
    <Box sx={{ width: "100%", position: "relative", m: 5, ...getContainerStyles() }}>
      {!exporting && (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 2, gap: 2, '@media print': { display: 'none' }, ...getContainerStyles() }}>
          <IconButton onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))} disabled={currentPage === 0} color="primary" sx={getContainerStyles()}>
            <ChevronLeft />
          </IconButton>
          <Typography sx={{ mx: 2, ...getContainerStyles() }}>Page {currentPage + 1} of {Math.max(1, pages.length)}</Typography>
          <IconButton onClick={() => setCurrentPage(prev => Math.min(pages.length - 1, prev + 1))} disabled={currentPage === Math.max(0, pages.length - 1)} color="primary" sx={getContainerStyles()}>
            <ChevronRight />
          </IconButton>
          
          {enableDragDrop && (
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', ml: 2, ...getContainerStyles() }}>
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
      
      {renderMainContentToMeasure()}
      
      <Box id="resume-container" sx={getContainerStyles()}>
        {pages.length > 0 ? (
          pages.map((pageContent, index) => (
            <Paper
              key={index}
              elevation={3}
              className="resume-page"
              sx={{ 
                borderRadius: 2, 
                width: page.width,
                minHeight: page.height,
                margin: `${topBottomMargin}px auto`,
                ...getContainerStyles(),
                display: exporting ? 'block' : (index === currentPage ? 'block' : 'none'),
                boxShadow: index === currentPage ? 3 : 0,
                '@media print': { 
                  display: 'block',
                  boxShadow: 'none',
                  borderRadius: 0,
                  margin: '0 auto',
                  ...getContainerStyles(),
                }
              }}
            >
              <Grid container sx={{ display: "flex", ...getContainerStyles() }}>
                {/* HEADER SECTION - Main Content Area */}
                <Grid item xs={12} md={8} sx={{ 
                  p: sideMargins / 5, 
                  width: "70%",
                  margin: `${topBottomMargin / 10}px 0`,
                  ...getContainerStyles(),
                }}>
                  {index === 0 && (
                    <Box sx={{ mb: sectionSpacing / 10, ...getContainerStyles() }}>
                      <Typography variant="h2" component="h1" fontWeight="bold" sx={{ 
                        color: primaryColor,
                        fontSize: `calc(${headingSize} * 1.8)`,
                        fontFamily: font,
                        fontStyle: fontStyle,
                        lineHeight: `${lineSpacing * 1.2}px`,
                      }}>
                        {data.firstName.toUpperCase()} {data.lastName.toUpperCase()}
                      </Typography>
                      <Typography variant="h5" color={'#333333'} sx={{ 
                        letterSpacing: 2,
                        fontSize: `calc(${fontSize} * 1.3)`,
                        fontFamily: font,
                        fontStyle: fontStyle,
                        lineHeight: `${lineSpacing}px`,
                      }}>
                        {data.currentPosition}
                      </Typography>
                    </Box>
                  )}
                  
                  {index === 0 && <Divider sx={{ 
                    my: sectionSpacing / 10, 
                    borderWidth: `${lineWeight}px`,
                    ...getContainerStyles(),
                  }} />}

                  {/* MAIN CONTENT - All sections with instant design formatting */}
                  <Box sx={getContainerStyles()}>
                    {renderRightContentSections()}
                  </Box>
                </Grid>

                {/* SIDEBAR SECTION - With instant design formatting */}
                <Grid item xs={12} md={4} sx={{ 
                  ...getContainerStyles(true),
                  p: sideMargins / 5, 
                  width: "30%",
                  height: "100%",   
                  minHeight: "297mm", 
                }}>
                  {renderSidebarSections(index)}
                  
                  {index > 0 && (
                    <Box sx={{ width: "100%", ...getContainerStyles(true) }}>
                      <Typography variant="h5" fontWeight="bold" sx={{ 
                        mb: 2,
                        fontSize: `calc(${headingSize} * 0.9)`,
                        fontFamily: font,
                        fontStyle: fontStyle,
                        lineHeight: `${lineSpacing}px`,
                      }}>
                      </Typography>
                    </Box>
                  )}
                </Grid>
              </Grid>
            </Paper>
          ))
        ) : (
          <Paper elevation={3} sx={{ 
            borderRadius: 2, 
            width: page.width,
            minHeight: page.height,
            margin: `${topBottomMargin}px auto`,
            ...getContainerStyles(),
          }}>
            <Typography sx={getContainerStyles()}>Loading resume...</Typography>
          </Paper>
        )}
      </Box>

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
            Drag and drop sections to reorder them within each side or move sections between left sidebar and right content.
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

// Meta information for Resume11
export const resumeMeta = {
  hasPhoto: true,
  columns: 2,
};

export default Resume11;