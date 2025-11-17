import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  Box,
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
 
  DragIndicator,
  Reorder
} from "@mui/icons-material";


// Separate section orders for left and right sides
const defaultLeftSectionOrder = [
  'contact',
  'aboutMe',
  'skills',
  'education'
];

const defaultRightSectionOrder = [
  'experience',
  'languages',
  'certifications',
  'accomplishments',
  'volunteering',
  'interests',
  'websites',
  'additionalInfo',
  'references',
  'softwareSkills'
];

const Resume9 = ({ 
  color = "#8b4b2b",
  font = "Arial",
  fontSize = "14px",
  fontStyle = "normal",
  headingSize = "24px",
  sectionSpacing = 10,
  paragraphSpacing = 10,
  lineSpacing = 20,
  topBottomMargin = 20,
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
    firstName: "Laila",
    lastName: "Muhammad",
   currentPosition : "Content Creator",
    phone: "+123-456-7890",
    email: "hello@email.com",
    city: "123 Anywhere St, City",
    website: "www.reallygreatsite.com",
    profile: "A creative writer/designer with a knack for crafting visually appealing and impactful designs. Adept at balancing functionality with aesthetics to produce engaging designs."
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
      'aboutMe': 'About Me',
      'skills': 'Skills',
      'education': 'Education',
      'experience': 'Experience',
      'languages': 'Languages',
      'certifications': 'Certifications',
      'accomplishments': 'Accomplishments',
      'volunteering': 'Volunteering',
      'interests': 'Interests',
      'websites': 'Websites/Profiles',
      'additionalInfo': 'Additional Information',
      'references': 'References',
      'softwareSkills': 'Software Skills'
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
          {side === 'left' ? 'Left Sidebar' : 'Right Content'} Sections
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

  // Add global font style to HTML content
  const addFontToHtmlContent = (htmlContent) => {
    if (!htmlContent) return '';
    
    // Add font family to all HTML content elements
    return htmlContent
      .replace(/<div/g, `<div style="font-family: ${font}; font-size: ${fontSize}; font-style: ${fontStyle}; line-height: ${lineSpacing}px;"`)
      .replace(/<p/g, `<p style="font-family: ${font}; font-size: ${fontSize}; font-style: ${fontStyle}; line-height: ${lineSpacing}px;"`)
      .replace(/<span/g, `<span style="font-family: ${font}; font-size: ${fontSize}; font-style: ${fontStyle}; line-height: ${lineSpacing}px;"`)
      .replace(/<h1/g, `<h1 style="font-family: ${font}; font-size: ${headingSize}; font-style: ${fontStyle};"`)
      .replace(/<h2/g, `<h2 style="font-family: ${font}; font-size: ${headingSize}; font-style: ${fontStyle};"`)
      .replace(/<h3/g, `<h3 style="font-family: ${font}; font-size: ${headingSize}; font-style: ${fontStyle};"`)
      .replace(/<h4/g, `<h4 style="font-family: ${font}; font-size: ${headingSize}; font-style: ${fontStyle};"`)
      .replace(/<h5/g, `<h5 style="font-family: ${font}; font-size: ${headingSize}; font-style: ${fontStyle};"`)
      .replace(/<h6/g, `<h6 style="font-family: ${font}; font-size: ${headingSize}; font-style: ${fontStyle};"`)
      .replace(/<li/g, `<li style="font-family: ${font}; font-size: ${fontSize}; font-style: ${fontStyle}; line-height: ${lineSpacing}px;"`)
      .replace(/<ul/g, `<ul style="font-family: ${font}; font-size: ${fontSize}; font-style: ${fontStyle}; line-height: ${lineSpacing}px;"`)
      .replace(/<ol/g, `<ol style="font-family: ${font}; font-size: ${fontSize}; font-style: ${fontStyle}; line-height: ${lineSpacing}px;"`);
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
    // Load the custom section with most items (most content) - Resume22 mathiri
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
  const savedLeftSectionOrder = localStorage.getItem("resume9LeftSectionOrder");
  if (savedLeftSectionOrder) {
    // 🔥 FIX: Left side-ல custom sections auto add ஆகாது - filter only
    const parsedOrder = JSON.parse(savedLeftSectionOrder);
    const filteredOrder = parsedOrder.filter(section => !section.startsWith('custom_'));
    setLeftSectionOrder(filteredOrder);
    console.log('🔄 Loaded left section order WITHOUT custom sections:', filteredOrder);
  } else {
    setLeftSectionOrder(defaultLeftSectionOrder);
  }

  const savedRightSectionOrder = localStorage.getItem("resume9RightSectionOrder");
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

// Add this useEffect to automatically add/remove custom sections
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
      localStorage.setItem("resume9RightSectionOrder", JSON.stringify(newRightOrder));
      console.log('📝 Final right section order with ONLY CURRENT custom sections:', newRightOrder);
    }
    
    // 🔥 FIX: Left side-லிருந்து custom sections-ஐ remove செய்யவும்
    const currentLeftOrder = [...leftSectionOrder];
    const filteredLeftOrder = currentLeftOrder.filter(section => !section.startsWith('custom_'));
    if (JSON.stringify(filteredLeftOrder) !== JSON.stringify(currentLeftOrder)) {
      setLeftSectionOrder(filteredLeftOrder);
      localStorage.setItem("resume9LeftSectionOrder", JSON.stringify(filteredLeftOrder));
      console.log('🗑️ Removed custom sections from left side:', filteredLeftOrder);
    }
    
  } else if (userId && Object.keys(customSections).length === 0) {
    // If no current custom sections, remove all custom sections from both sides
    const currentRightOrder = [...rightSectionOrder];
    const filteredRightOrder = currentRightOrder.filter(section => !section.startsWith('custom_'));
    
    if (filteredRightOrder.length !== currentRightOrder.length) {
      setRightSectionOrder(filteredRightOrder);
      localStorage.setItem("resume9RightSectionOrder", JSON.stringify(filteredRightOrder));
      console.log('🗑️ Removed all custom sections from right side (no current sections)');
    }
    
    const currentLeftOrder = [...leftSectionOrder];
    const filteredLeftOrder = currentLeftOrder.filter(section => !section.startsWith('custom_'));
    if (filteredLeftOrder.length !== currentLeftOrder.length) {
      setLeftSectionOrder(filteredLeftOrder);
      localStorage.setItem("resume9LeftSectionOrder", JSON.stringify(filteredLeftOrder));
      console.log('🗑️ Removed all custom sections from left side (no current sections)');
    }
  }
}, [customSections]);
  // Save section orders to localStorage whenever they change
  useEffect(() => {
    if (leftSectionOrder.length > 0) {
      localStorage.setItem("resume9LeftSectionOrder", JSON.stringify(leftSectionOrder));
    }
  }, [leftSectionOrder]);

  useEffect(() => {
    if (rightSectionOrder.length > 0) {
      localStorage.setItem("resume9RightSectionOrder", JSON.stringify(rightSectionOrder));
    }
  }, [rightSectionOrder]);

  // Render right sections based on current order
  const renderRightSections = () => {
    
    return rightSectionOrder.map(sectionId => {
      switch (sectionId) {
        
        case 'experience':
          return (
            <div key="experience" className="resume-section">
              <Typography variant="h6" sx={{ 
                fontWeight: "bold", 
                mb: 1,
                fontSize: headingSize,
                fontFamily: font,
                fontStyle: fontStyle,
              }}>
                Experience
              </Typography>
              <Divider sx={{ 
                mb: 2, 
                borderWidth: `${lineWeight}px`,
                backgroundColor: primaryColor,
              }} />
              {workExperiences && workExperiences.length > 0 ? (
                workExperiences.map((work, i) => (
                  <Box key={i} mb={paragraphSpacing / 5}>
                    <Typography variant="subtitle2" sx={{ 
                      fontWeight: "bold",
                      fontSize: `calc(${fontSize} * 1.1)`,
                      fontFamily: font,
                      fontStyle: fontStyle,
                    }}>
                      {work.jobTitle}
                    </Typography>
                    <Typography variant="caption" sx={getTextStyle()}>
                      {formatDate(work.startMonth, work.startYear)} -{" "}
                      {work.current ? "Present" : formatDate(work.endMonth, work.endYear)}
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
                ))
              ) : (
                <Box mb={paragraphSpacing / 5}>
                  <Typography variant="subtitle2" sx={{ 
                    fontWeight: "bold",
                    fontSize: `calc(${fontSize} * 1.1)`,
                    fontFamily: font,
                    fontStyle: fontStyle,
                  }}>
                    Owner & Manager of Content Agency
                  </Typography>
                  <Typography variant="caption" sx={getTextStyle()}>2020 - 2016</Typography>
                  <Typography variant="body2" sx={{ 
                    mt: 1,
                    textIndent: `${paragraphIndent}px`,
                    fontFamily: font,
                    fontStyle: fontStyle,
                  }}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sit
                    amet sem facilisis scelerisque.
                  </Typography>
                </Box>
              )}
            </div>
          );

        case 'languages':
          return savedLanguages.length > 0 ? (
            <div key="languages" className="resume-section">
              <Typography variant="h6" sx={{ 
                fontWeight: "bold", 
                mb: 1,
                fontSize: headingSize,
                fontFamily: font,
                fontStyle: fontStyle,
              }}>
                Languages
              </Typography>
              <Divider sx={{ 
                mb: 2, 
                borderWidth: `${lineWeight}px`,
                backgroundColor: primaryColor,
              }} />
              {savedLanguages.map((lang, index) => (
                <Typography key={index} variant="body2" sx={{ mb: 1, ...globalFontStyle }}>
                  {lang.name} {lang.level ? `– ${lang.level}` : ""}
                </Typography>
              ))}
            </div>
          ) : null;

        case 'certifications':
          return savedCertifications.length > 0 ? (
            <div key="certifications" className="resume-section">
              <Typography variant="h6" sx={{ 
                fontWeight: "bold", 
                mb: 1,
                fontSize: headingSize,
                fontFamily: font,
                fontStyle: fontStyle,
              }}>
                Certifications
              </Typography>
              <Divider sx={{ 
                mb: 2, 
                borderWidth: `${lineWeight}px`,
                backgroundColor: primaryColor,
              }} />
              {savedCertifications.map((cert, index) => (
                <Typography key={index} variant="body2" sx={{ mb: 1, ...globalFontStyle }}>
                  {cert.name} – {cert.provider} ({cert.year})
                </Typography>
              ))}
            </div>
          ) : null;

        case 'accomplishments':
          return savedAccomplishments.length > 0 ? (
            <div key="accomplishments" className="resume-section">
              <Typography variant="h6" sx={{ 
                fontWeight: "bold", 
                mb: 1,
                fontSize: headingSize,
                fontFamily: font,
                fontStyle: fontStyle,
              }}>
                Accomplishments
              </Typography>
              <Divider sx={{ 
                mb: 2, 
                borderWidth: `${lineWeight}px`,
                backgroundColor: primaryColor,
              }} />
              {savedAccomplishments.map((acc, index) => (
                <Typography key={index} variant="body2" sx={{ mb: 1, ...globalFontStyle, whiteSpace: "pre-line" }}>
                  {acc}
                </Typography>
              ))}
            </div>
          ) : null;

        case 'volunteering':
          return savedVolunteering.length > 0 ? (
            <div key="volunteering" className="resume-section">
              <Typography variant="h6" sx={{ 
                fontWeight: "bold", 
                mb: 1,
                fontSize: headingSize,
                fontFamily: font,
                fontStyle: fontStyle,
              }}>
                Volunteering
              </Typography>
              <Divider sx={{ 
                mb: 2, 
                borderWidth: `${lineWeight}px`,
                backgroundColor: primaryColor,
              }} />
              {savedVolunteering.map((vol, index) => (
                <Box key={index} sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" sx={{ 
                    fontWeight: "bold",
                    fontSize: `calc(${fontSize} * 1.1)`,
                    fontFamily: font,
                    fontStyle: fontStyle,
                  }}>
                    {vol.subtopic}
                  </Typography>
                  <Typography variant="caption" sx={getTextStyle()}>
                    {vol.fromDate} - {vol.toDate}
                  </Typography>
                  <Typography variant="body2" sx={{ 
                    mt: 1,
                    ...globalFontStyle,
                    whiteSpace: "pre-line"
                  }}>
                    {vol.content}
                  </Typography>
                </Box>
              ))}
            </div>
          ) : null;

        case 'interests':
          return savedInterests.length > 0 ? (
            <div key="interests" className="resume-section">
              <Typography variant="h6" sx={{ 
                fontWeight: "bold", 
                mb: 1,
                fontSize: headingSize,
                fontFamily: font,
                fontStyle: fontStyle,
              }}>
                Interests
              </Typography>
              <Divider sx={{ 
                mb: 2, 
                borderWidth: `${lineWeight}px`,
                backgroundColor: primaryColor,
              }} />
              <List dense>
                {savedInterests.map((interest, index) => (
                  <ListItem key={index} sx={{ p: 0, mb: paragraphSpacing / 20 }}>
                    <ListItemText 
                      primary={`• ${interest}`}
                      sx={{ 
                        '& .MuiTypography-root': {
                          fontSize: fontSize,
                          fontFamily: font,
                          fontStyle: fontStyle,
                          lineHeight: `${lineSpacing}px`,
                        }
                      }}
                    />
                  </ListItem>
                ))}
              </List>
            </div>
          ) : null;

        case 'websites':
          return savedWebsites.length > 0 ? (
            <div key="websites" className="resume-section">
              <Typography variant="h6" sx={{ 
                fontWeight: "bold", 
                mb: 1,
                fontSize: headingSize,
                fontFamily: font,
                fontStyle: fontStyle,
              }}>
                Websites / Profiles
              </Typography>
              <Divider sx={{ 
                mb: 2, 
                borderWidth: `${lineWeight}px`,
                backgroundColor: primaryColor,
              }} />
              {savedWebsites.map((site, index) => (
                <Typography key={index} variant="body2" sx={{ mb: 1, ...globalFontStyle }}>
                  {site.url} {site.addToHeader ? "(Shown in Header)" : ""}
                </Typography>
              ))}
            </div>
          ) : null;

        case 'additionalInfo':
          return savedAdditionalInfo.length > 0 ? (
            <div key="additionalInfo" className="resume-section">
              <Typography variant="h6" sx={{ 
                fontWeight: "bold", 
                mb: 1,
                fontSize: headingSize,
                fontFamily: font,
                fontStyle: fontStyle,
              }}>
                Additional Information
              </Typography>
              <Divider sx={{ 
                mb: 2, 
                borderWidth: `${lineWeight}px`,
                backgroundColor: primaryColor,
              }} />
              {savedAdditionalInfo.map((info, index) => (
                <Typography key={index} variant="body2" sx={{ mb: 1, ...globalFontStyle }}>
                  {info}
                </Typography>
              ))}
            </div>
          ) : null;

        case 'references':
          return savedReferences.length > 0 ? (
            <div key="references" className="resume-section">
              <Typography variant="h6" sx={{ 
                fontWeight: "bold", 
                mb: 1,
                fontSize: headingSize,
                fontFamily: font,
                fontStyle: fontStyle,
              }}>
                References
              </Typography>
              <Divider sx={{ 
                mb: 2, 
                borderWidth: `${lineWeight}px`,
                backgroundColor: primaryColor,
              }} />
              {savedReferences.map((ref, index) => (
                <Typography key={index} variant="body2" sx={{ mb: 1, ...globalFontStyle, whiteSpace: "pre-line" }}>
                  {ref}
                </Typography>
              ))}
            </div>
          ) : null;

        case 'softwareSkills':
          return softwareSkills.length > 0 ? (
            <div key="softwareSkills" className="resume-section">
              <Typography variant="h6" sx={{ 
                fontWeight: "bold", 
                mb: 1,
                fontSize: headingSize,
                fontFamily: font,
                fontStyle: fontStyle,
              }}>
                Software Skills
              </Typography>
              <Divider sx={{ 
                mb: 2, 
                borderWidth: `${lineWeight}px`,
                backgroundColor: primaryColor,
              }} />
              {softwareSkills.map((skill, index) => (
                <Typography key={index} variant="body2" sx={{ mb: 1, ...globalFontStyle }}>
                  {skill.name} — {skill.level}%
                </Typography>
              ))}
            </div>
          ) : null;

        // Handle left-side sections when they are moved to right side
        case 'contact':
          return (
            <div key="contact" className="resume-section">
              <Typography variant="h6" sx={{ 
                fontWeight: "bold", 
                mb: 1,
                fontSize: headingSize,
                fontFamily: font,
                fontStyle: fontStyle,
              }}>
                Contact
              </Typography>
              <Divider sx={{ 
                mb: 2, 
                borderWidth: `${lineWeight}px`,
                backgroundColor: primaryColor,
              }} />
              <Typography variant="body2" sx={{ mb: paragraphSpacing / 10, ...globalFontStyle }}>📞 {data.phone}</Typography>
              <Typography variant="body2" sx={{ mb: paragraphSpacing / 10, ...globalFontStyle }}>✉️ {data.email}</Typography>
              <Typography variant="body2" sx={{ mb: paragraphSpacing / 10, ...globalFontStyle }}>🏠 {data.city}</Typography>
              <Typography variant="body2" sx={getTextStyle()}>🌐 {data.website}</Typography>
            </div>
          );

        case 'aboutMe':
          return (
            <div key="aboutMe" className="resume-section">
              <Typography variant="h6" sx={{ 
                fontWeight: "bold", 
                mb: 1,
                fontSize: headingSize,
                fontFamily: font,
                fontStyle: fontStyle,
              }}>
                About Me
              </Typography>
              <Divider sx={{ 
                mb: 2, 
                borderWidth: `${lineWeight}px`,
                backgroundColor: primaryColor,
              }} />
              <Typography variant="body2" sx={{ textIndent: `${paragraphIndent}px`, ...globalFontStyle }}>
                {savedSummary || data.profile}
              </Typography>
            </div>
          );

        case 'skills':
          return (
            <div key="skills" className="resume-section">
              <Typography variant="h6" sx={{ 
                fontWeight: "bold", 
                mb: 1,
                fontSize: headingSize,
                fontFamily: font,
                fontStyle: fontStyle,
              }}>
                Skills
              </Typography>
              <Divider sx={{ 
                mb: 2, 
                borderWidth: `${lineWeight}px`,
                backgroundColor: primaryColor,
              }} />
              <List dense>
                {savedSkills.length > 0 ? (
                  savedSkills.map((skill, i) => (
                    <ListItem key={i} sx={{ p: 0, mb: paragraphSpacing / 20 }}>
                      <ListItemText 
                        primary={skill.name} 
                        sx={{ 
                          '& .MuiTypography-root': {
                            fontSize: fontSize,
                            fontFamily: font,
                            fontStyle: fontStyle,
                            lineHeight: `${lineSpacing}px`,
                          }
                        }}
                      />
                    </ListItem>
                  ))
                ) : (
                  [
                    "Creative writing & solutions",
                    "Copywriting",
                    "Communication",
                    "Strategic planning",
                    "Project coordination",
                    "Storytelling",
                    "Presentation skills",
                  ].map((skill, i) => (
                    <ListItem key={i} sx={{ p: 0, mb: paragraphSpacing / 20 }}>
                      <ListItemText 
                        primary={skill} 
                        sx={{ 
                          '& .MuiTypography-root': {
                            fontSize: fontSize,
                            fontFamily: font,
                            fontStyle: fontStyle,
                            lineHeight: `${lineSpacing}px`,
                          }
                        }}
                      />
                    </ListItem>
                  ))
                )}
              </List>
            </div>
          );

        case 'education':
          return educationEntries.length > 0 ? (
            <div key="education" className="resume-section">
              <Typography variant="h6" sx={{ 
                fontWeight: "bold", 
                mb: 1,
                fontSize: headingSize,
                fontFamily: font,
                fontStyle: fontStyle,
              }}>
                Education
              </Typography>
              <Divider sx={{ 
                mb: 2, 
                borderWidth: `${lineWeight}px`,
                backgroundColor: primaryColor,
              }} />
              {educationEntries.map((edu) => (
                <Box key={edu.id} sx={{ mb: 2 }}>
                  <Typography variant="body2" sx={{ fontWeight: "bold", ...globalFontStyle }}>
                    {edu.degree} - {edu.fieldOfStudy}
                  </Typography>
                  <Typography variant="body2" sx={getTextStyle()}>{edu.schoolName}, {edu.schoolLocation}</Typography>
                  <Typography variant="body2" sx={{ fontStyle: "italic", ...globalFontStyle }}>
                    {formatDate(edu.gradMonth, edu.gradYear)}
                  </Typography>
                </Box>
              ))}
            </div>
          ) : null;

        default:
          // Handle custom sections
          if (sectionId && sectionId.startsWith('custom_')) {
    const customSectionName = sectionId.replace('custom_', '');
    const items = customSections[customSectionName] || [];
    
    console.log(`🎯 Rendering custom section: ${customSectionName}`, items);
    
    if (items && items.length > 0) {
      return (
        <div key={sectionId} className="resume-section">
          <Typography variant="h6" sx={{ 
            fontWeight: "bold", 
            mb: 1,
            fontSize: headingSize,
            fontFamily: font,
            fontStyle: fontStyle,
          }}>
            {customSectionName.toUpperCase()}
          </Typography>
          <Divider sx={{ 
            mb: 2, 
            borderWidth: `${lineWeight}px`,
            backgroundColor: primaryColor,
          }} />
          {items.map((item, i) => (
            <Typography 
              key={i} 
              variant="body2" 
              sx={{ 
                mb: 1, 
                ...globalFontStyle,
                whiteSpace: "pre-line" 
              }} 
            >
              • {item}
            </Typography>
          ))}
        </div>
      );
    } else {
      console.log(`⚠️ No items found for custom section: ${customSectionName}`);
      return null;
    }
  }
  return null;
      }
    }).filter(Boolean);
  };

  // Render left sidebar sections based on current order
  const renderLeftSidebar = (pageIndex) => {
    return leftSectionOrder.map(sectionId => {
      switch (sectionId) {
        case 'contact':
          return pageIndex === 0 ? (
            <Box key="contact" sx={{ width: "100%", mb: sectionSpacing / 5 }}>
              <Typography variant="h6" sx={{ 
                fontWeight: "bold", 
                mb: 1,
                fontSize: headingSize,
                fontFamily: font,
                fontStyle: fontStyle,
              }}>
                Contact
              </Typography>
              <Typography variant="body2" sx={{ mb: paragraphSpacing / 10, ...globalFontStyle }}>📞 {data.phone}</Typography>
              <Typography variant="body2" sx={{ mb: paragraphSpacing / 10, ...globalFontStyle }}>✉️ {data.email}</Typography>
              <Typography variant="body2" sx={{ mb: paragraphSpacing / 10, ...globalFontStyle }}>🏠 {data.city}</Typography>
              <Typography variant="body2" sx={getTextStyle()}>🌐 {data.website}</Typography>
            </Box>
          ) : null;

        case 'aboutMe':
          return pageIndex === 0 ? (
            <Box key="aboutMe" sx={{ width: "100%", mb: sectionSpacing / 5 }}>
              <Typography variant="h6" sx={{ 
                fontWeight: "bold", 
                mb: 1,
                fontSize: headingSize,
                fontFamily: font,
                fontStyle: fontStyle,
              }}>
                About Me
              </Typography>
              <Typography variant="body2" sx={{ textIndent: `${paragraphIndent}px`, ...globalFontStyle }}>
                {savedSummary || data.profile}
              </Typography>
            </Box>
          ) : null;

        case 'skills':
          return pageIndex === 0 ? (
            <Box key="skills" sx={{ width: "100%", mb: sectionSpacing / 5 }}>
              <Typography variant="h6" sx={{ 
                fontWeight: "bold", 
                mb: 1,
                fontSize: headingSize,
                fontFamily: font,
                fontStyle: fontStyle,
              }}>
                Skills
              </Typography>
              <List dense>
                {savedSkills.length > 0 ? (
                  savedSkills.map((skill, i) => (
                    <ListItem key={i} sx={{ p: 0, mb: paragraphSpacing / 20 }}>
                      <ListItemText 
                        primary={skill.name} 
                        sx={{ 
                          '& .MuiTypography-root': {
                            fontSize: fontSize,
                            fontFamily: font,
                            fontStyle: fontStyle,
                            color: 'white',
                            lineHeight: `${lineSpacing}px`,
                          }
                        }}
                      />
                    </ListItem>
                  ))
                ) : (
                  [
                    "Creative writing & solutions",
                    "Copywriting",
                    "Communication",
                    "Strategic planning",
                    "Project coordination",
                    "Storytelling",
                    "Presentation skills",
                  ].map((skill, i) => (
                    <ListItem key={i} sx={{ p: 0, mb: paragraphSpacing / 20 }}>
                      <ListItemText 
                        primary={skill} 
                        sx={{ 
                          '& .MuiTypography-root': {
                            fontSize: fontSize,
                            fontFamily: font,
                            fontStyle: fontStyle,
                            color: 'white',
                            lineHeight: `${lineSpacing}px`,
                          }
                        }}
                      />
                    </ListItem>
                  ))
                )}
              </List>
            </Box>
          ) : null;

        case 'education':
          return pageIndex === 0 && educationEntries.length > 0 ? (
            <Box key="education" sx={{ width: "100%", mb: sectionSpacing / 5 }}>
              <Typography variant="h6" sx={{ 
                fontWeight: "bold", 
                mb: 1,
                fontSize: headingSize,
                fontFamily: font,
                fontStyle: fontStyle,
              }}>
                Education
              </Typography>
              {educationEntries.map((edu) => (
                <Box key={edu.id} sx={{ mb: 2 }}>
                  <Typography variant="body2" sx={{ fontWeight: "bold", ...globalFontStyle }}>
                    {edu.degree} - {edu.fieldOfStudy}
                  </Typography>
                  <Typography variant="body2" sx={getTextStyle()}>{edu.schoolName}, {edu.schoolLocation}</Typography>
                  <Typography variant="body2" sx={{ fontStyle: "italic", ...globalFontStyle }}>
                    {formatDate(edu.gradMonth, edu.gradYear)}
                  </Typography>
                </Box>
              ))}
            </Box>
          ) : null;

        default:
          // Handle sections moved from right side to left sidebar
          if (sectionId.startsWith('custom_')) {
            const customSectionName = sectionId.replace('custom_', '');
            const items = customSections[customSectionName] || [];
            return pageIndex === 0 && items.length > 0 ? (
              <Box key={sectionId} sx={{ width: "100%", mb: sectionSpacing / 5 }}>
                <Typography variant="h6" sx={{ 
                  fontWeight: "bold", 
                  mb: 1,
                  fontSize: headingSize,
                  fontFamily: font,
                  fontStyle: fontStyle,
                }}>
                  {customSectionName.toUpperCase()}
                </Typography>
                <List dense>
                  {items.map((item, i) => (
                    <ListItem key={i} sx={{ p: 0, mb: paragraphSpacing / 20 }}>
                      <ListItemText 
                        primary={item} 
                        sx={{ 
                          '& .MuiTypography-root': {
                            fontSize: fontSize,
                            fontFamily: font,
                            fontStyle: fontStyle,
                            color: 'white',
                            lineHeight: `${lineSpacing}px`,
                          }
                        }}
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            ) : null;
          }

          // Handle right-side sections when they are moved to left sidebar
          return pageIndex === 0 ? (
            <Box key={sectionId} sx={{ width: "100%", mb: sectionSpacing / 5 }}>
              <Typography variant="h6" sx={{ 
                fontWeight: "bold", 
                mb: 1,
                fontSize: headingSize,
                fontFamily: font,
                fontStyle: fontStyle,
              }}>
                {getSectionTitle(sectionId)}
              </Typography>
              {/* For right-side sections moved to left sidebar, we need to render them differently */}
              {renderRightSectionInSidebar(sectionId)}
            </Box>
          ) : null;
      }
    }).filter(Boolean);
  };

  // Helper function to render right-side sections in the left sidebar
  const renderRightSectionInSidebar = (sectionId) => {
    switch (sectionId) {
      case 'experience':
        return workExperiences && workExperiences.length > 0 ? (
          workExperiences.slice(0, 2).map((work, i) => (
            <Box key={i} sx={{ mb: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: "bold", ...globalFontStyle, color: 'white' }}>
                {work.jobTitle}
              </Typography>
              <Typography variant="caption" sx={{ ...globalFontStyle, color: 'rgba(255,255,255,0.8)' }}>
                {formatDate(work.startMonth, work.startYear)} -{" "}
                {work.current ? "Present" : formatDate(work.endMonth, work.endYear)}
              </Typography>
            </Box>
          ))
        ) : null;

      case 'languages':
        return savedLanguages.length > 0 ? (
          savedLanguages.map((lang, index) => (
            <Typography key={index} variant="body2" sx={{ mb: 0.5, ...globalFontStyle, color: 'white' }}>
              {lang.name} {lang.level ? `– ${lang.level}` : ""}
            </Typography>
          ))
        ) : null;

      case 'certifications':
        return savedCertifications.length > 0 ? (
          savedCertifications.map((cert, index) => (
            <Typography key={index} variant="body2" sx={{ mb: 0.5, ...globalFontStyle, color: 'white' }}>
              {cert.name}
            </Typography>
          ))
        ) : null;

      case 'accomplishments':
        return savedAccomplishments.length > 0 ? (
          savedAccomplishments.slice(0, 3).map((acc, index) => (
            <Typography key={index} variant="body2" sx={{ mb: 0.5, ...globalFontStyle, color: 'white' }}>
              • {acc.substring(0, 50)}...
            </Typography>
          ))
        ) : null;

      case 'volunteering':
        return savedVolunteering.length > 0 ? (
          savedVolunteering.slice(0, 2).map((vol, index) => (
            <Box key={index} sx={{ mb: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: "bold", ...globalFontStyle, color: 'white' }}>
                {vol.subtopic}
              </Typography>
              <Typography variant="caption" sx={{ ...globalFontStyle, color: 'rgba(255,255,255,0.8)' }}>
                {vol.fromDate} - {vol.toDate}
              </Typography>
            </Box>
          ))
        ) : null;

      case 'interests':
        return savedInterests.length > 0 ? (
          <List dense>
            {savedInterests.map((interest, index) => (
              <ListItem key={index} sx={{ p: 0, mb: paragraphSpacing / 20 }}>
                <ListItemText 
                  primary={`• ${interest}`}
                  sx={{ 
                    '& .MuiTypography-root': {
                      fontSize: fontSize,
                      fontFamily: font,
                      fontStyle: fontStyle,
                      color: 'white',
                      lineHeight: `${lineSpacing}px`,
                    }
                  }}
                />
              </ListItem>
            ))}
          </List>
        ) : null;

      case 'websites':
        return savedWebsites.length > 0 ? (
          savedWebsites.map((site, index) => (
            <Typography key={index} variant="body2" sx={{ mb: 0.5, ...globalFontStyle, color: 'white' }}>
              {site.url}
            </Typography>
          ))
        ) : null;

      case 'additionalInfo':
        return savedAdditionalInfo.length > 0 ? (
          savedAdditionalInfo.map((info, index) => (
            <Typography key={index} variant="body2" sx={{ mb: 0.5, ...globalFontStyle, color: 'white' }}>
              • {info}
            </Typography>
          ))
        ) : null;

      case 'references':
        return savedReferences.length > 0 ? (
          savedReferences.slice(0, 2).map((ref, index) => (
            <Typography key={index} variant="body2" sx={{ mb: 0.5, ...globalFontStyle, color: 'white' }}>
              {ref.substring(0, 50)}...
            </Typography>
          ))
        ) : null;

      case 'softwareSkills':
        return softwareSkills.length > 0 ? (
          softwareSkills.map((skill, index) => (
            <Typography key={index} variant="body2" sx={{ mb: 0.5, ...globalFontStyle, color: 'white' }}>
              {skill.name} — {skill.level}%
            </Typography>
          ))
        ) : null;

      default:
        return null;
    }
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
    
    // Always create at least one page
    if (mainSections.length === 0) {
      newPages.push({ main: [] });
    }
    
    // Distribute main content across pages
    mainSections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      
      // If adding this section to the current page exceeds the limit
      if (currentMainHeight + sectionHeight > mainAvailableHeight) {
        // Start a new page
        newPages.push({
          main: currentMainPageSections,
        });
        currentMainPageSections = [section];
        currentMainHeight = sectionHeight;
      } else {
        // Add to the current page
        currentMainPageSections.push(section);
        currentMainHeight += sectionHeight;
      }
    });
    
    // Add the last page
    if (currentMainPageSections.length > 0) {
      newPages.push({
        main: currentMainPageSections,
      });
    }
    
    setPages(newPages);
  }, [page.height, topBottomMargin, rightSectionOrder]);

  useEffect(() => {
    // Re-calculate pagination whenever dependencies change
    const timeoutId = setTimeout(() => {
      paginateContent();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [
    paginateContent,
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
    rightSectionOrder,
  ]);

  // Render main content for measurement (hidden)
  const renderMainContentToMeasure = () => (
    <Box ref={mainContentRef} sx={{ visibility: 'hidden', position: 'absolute', ...globalFontStyle }}>
      <Box sx={{ p: `${topBottomMargin}px ${sideMargins}px` }}>
        {renderRightSections()}
      </Box>
    </Box>
  );

  return (
    <Box sx={{ width: "100%", position: "relative", m: 5 }}>
      {/* Controls */}
      {!exporting && (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 2, gap: 2, '@media print': { display: 'none' } }}>
          <IconButton onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))} disabled={currentPage === 0} color="primary">
            <ChevronLeft />
          </IconButton>
          <Typography sx={{ mx: 2 }}>Page {currentPage + 1} of {Math.max(1, pages.length)}</Typography>
          <IconButton onClick={() => setCurrentPage(prev => Math.min(pages.length - 1, prev + 1))} disabled={currentPage === Math.max(0, pages.length - 1)} color="primary">
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
      
      {renderMainContentToMeasure()}
      
      <Box id="resume-container">
        {pages.length > 0 ? (
          pages.map((pageContent, index) => (
            <Box
              key={index}
              className="resume-page"
              sx={{
                width: page.width,
                minHeight: page.height,
                margin: `${topBottomMargin}px auto`,
                boxShadow: index === currentPage ? 3 : 0,
                borderRadius: "16px",
                overflow: "hidden",
                display: "flex",
                fontFamily: font,
                fontSize: fontSize,
                fontStyle: fontStyle,
                lineHeight: `${lineSpacing}px`,
                // Show all pages when exporting, only current page when viewing
                display: exporting ? 'flex' : (index === currentPage ? 'flex' : 'none'),
                '@media print': { 
                  display: 'flex',
                  boxShadow: 'none',
                  borderRadius: 0,
                  margin: '0 auto'
                }
              }}
            >
              {/* Left Sidebar */}
              <Box
                sx={{
                  width: "25%",
                  bgcolor: primaryColor,
                  color: "white",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  p: 3,
                  position: "relative",
                  fontFamily: font,
                  fontSize: fontSize,
                  fontStyle: fontStyle,
                }}
              >
                {/* Top angled image section - only on first page */}
                {index === 0 && (
                  <Box
                    sx={{
                      width: "100%",
                      bgcolor: primaryColor,
                      clipPath: "polygon(0 0, 100% 0, 100% 70%, 50% 100%, 0 70%)",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      mb: sectionSpacing / 10,
                      pt: 4,
                    }}
                  >
                    <Avatar
                      src={photo || "https://via.placeholder.com/150"}
                      sx={{
                        width: 140,
                        height: 140,
                        border: `${lineWeight}px solid white`,
                        boxShadow: 3,
                      }}
                    />
                  </Box>
                )}

                {/* Render left sidebar sections */}
                {renderLeftSidebar(index)}

                {/* Additional sections in sidebar for subsequent pages if needed */}
                {index > 0 && (
                  <Box sx={{ width: "100%" }}>
                    <Typography variant="h6" sx={{ 
                      fontWeight: "bold", 
                      mb: 1,
                      fontSize: headingSize,
                      fontFamily: font,
                      fontStyle: fontStyle,
                    }}>
                     
                    </Typography>
                    {/* You can add more sidebar content for subsequent pages here */}
                  </Box>
                )}
              </Box>

              {/* Right Section */}
              <Box sx={{ 
                flex: 1, 
                bgcolor: "#f8f2ee", 
                p: sideMargins / 10,
                margin: `${topBottomMargin / 10}px 0`,
                fontFamily: font,
                fontSize: fontSize,
                fontStyle: fontStyle,
              }}>
                {/* Header - only on first page */}
                {index === 0 && (
                  <Box mb={sectionSpacing / 5}>
                    <Typography variant="h4" sx={{ 
                      fontWeight: "bold",
                      fontSize: `calc(${headingSize} * 1.5)`,
                      fontFamily: font,
                      fontStyle: fontStyle,
                    }}>
                      {data.firstName.toUpperCase()} {data.lastName.toUpperCase()}
                    </Typography>
                    <Typography variant="subtitle1" sx={{ 
                      color: primaryColor,
                      fontSize: `calc(${fontSize} * 1.2)`,
                      fontFamily: font,
                      fontStyle: fontStyle,
                    }}>
                      {data.currentPosition}
                    </Typography>
                  </Box>
                )}

                {/* Main Content */}
                <div 
                  style={globalFontStyle}
                  dangerouslySetInnerHTML={{ 
                    __html: addFontToHtmlContent(pageContent.main.map(s => s.outerHTML).join('')) 
                  }} 
                />
              </Box>
            </Box>
          ))
        ) : (
          <Box
            sx={{
              width: page.width,
              minHeight: page.height,
              margin: `${topBottomMargin}px auto`,
              boxShadow: 3,
              borderRadius: "16px",
              overflow: "hidden",
              display: "flex",
              fontFamily: font,
              fontSize: fontSize,
              fontStyle: fontStyle,
              lineHeight: `${lineSpacing}px`,
            }}
          >
            {/* Fallback content */}
            <Typography sx={getTextStyle()}>Loading resume...</Typography>
          </Box>
        )}
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

// Meta for filtering
export const resumeMeta = {
  columns: 2,
  hasPhoto: true,
  hasHeadshot: true,
};

export default Resume9;