import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  Box,
  Grid,
  Typography,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper
} from "@mui/material";
import {
  ChevronLeft,
  ChevronRight,
  
  Email,
  Phone,
  LocationOn,
  Language,
  DragIndicator,
  Reorder
} from "@mui/icons-material";


export const resumeMeta = {
  hasPhoto: true,
  columns: 2,
};

const pageSizeMap = {
  A4: { width: "210mm", height: "297mm" },
  Letter: { width: "216mm", height: "279mm" },
  Legal: { width: "216mm", height: "356mm" },
  A3: { width: "297mm", height: "420mm" },
  Executive: { width: "184mm", height: "267mm" }
};

const defaultData = {
  firstName: "JONATHAN",
  lastName: "PATTERSON",
  currentPosition: "Art Director",
  phone: "+123-456-7890",
  email: "hello@reallygreatsite.com",
  city: "123 Anywhere St., Any City",
  website: "www.reallygreatsite.com",
  profile: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  skills: [
    "Creativity", 
    "Digital Marketing", 
    "Registration", 
    "Critical Thinking", 
    "Leadership"
  ]
};

// Separate section orders for left and right sides
const defaultLeftSectionOrder = [
  'contact',
  'skills',
  'languages'
];

const defaultRightSectionOrder = [
  'profile',
  'education',
  'workExperience',
  'accomplishments',
  'certifications',
  'softwareSkills',
  'volunteering',
  'interests',
  'websites',
  'references',
  'additionalInfo'
];

const Resume22 = ({
  color = "#0951b0ff",
  nameColor = "#ffffff",
  accentColor = "#e74c3c",
  font = "EB Garamond",
  fontSize = "14px",
  headingSize = "24px",
  fontStyle = "normal",
  sectionSpacing = 50,
  paragraphSpacing = 30,
  lineSpacing = 20,
  topBottomMargin = 40,
  sideMargins = 40,
  paragraphIndent = 0,
  lineWeight = 1,
  pageSize = "A4",
  formData = {},
  photo = "",
  workExperiences = [],
  exporting = false,
  enableDragDrop = true,
  designSettings = {}
}) => {
  // Merge design settings with props
  const mergedDesignSettings = {
    color: designSettings.color || color,
    nameColor: designSettings.nameColor || nameColor,
    accentColor: designSettings.accentColor || accentColor,
    font: designSettings.font || font,
    fontSize: designSettings.fontSize || fontSize,
    headingSize: designSettings.headingSize || headingSize,
    fontStyle: designSettings.fontStyle || fontStyle,
    sectionSpacing: designSettings.sectionSpacing !== undefined ? designSettings.sectionSpacing : sectionSpacing,
    paragraphSpacing: designSettings.paragraphSpacing !== undefined ? designSettings.paragraphSpacing : paragraphSpacing,
    lineSpacing: designSettings.lineSpacing !== undefined ? designSettings.lineSpacing : lineSpacing,
    topBottomMargin: designSettings.topBottomMargin !== undefined ? designSettings.topBottomMargin : topBottomMargin,
    sideMargins: designSettings.sideMargins !== undefined ? designSettings.sideMargins : sideMargins,
    paragraphIndent: designSettings.paragraphIndent !== undefined ? designSettings.paragraphIndent : paragraphIndent,
    lineWeight: designSettings.lineWeight !== undefined ? designSettings.lineWeight : lineWeight,
    pageSize: designSettings.pageSize || pageSize
  };

  const page = pageSizeMap[mergedDesignSettings.pageSize] || pageSizeMap.A4;
  const data = { ...defaultData, ...formData };
  const [currentPage, setCurrentPage] = useState(0);
  const [pages, setPages] = useState([]);
  const mainContentRef = useRef(null);
  const sidebarContentRef = useRef(null);
  
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

  // State for section ordering - separate for left and right
  const [leftSectionOrder, setLeftSectionOrder] = useState(defaultLeftSectionOrder);
  const [rightSectionOrder, setRightSectionOrder] = useState(defaultRightSectionOrder);
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const [dragOverSide, setDragOverSide] = useState(null);
  
  // State for arrange sections dialog
  const [arrangeDialogOpen, setArrangeDialogOpen] = useState(false);

  useEffect(() => {
    // Load data from localStorage
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
  const savedLeftSectionOrder = localStorage.getItem("resume22LeftSectionOrder");
  if (savedLeftSectionOrder) {
    // 🔥 FIX: Left side-ல custom sections auto add ஆகாது - filter only
    const parsedOrder = JSON.parse(savedLeftSectionOrder);
    const filteredOrder = parsedOrder.filter(section => !section.startsWith('custom_'));
    setLeftSectionOrder(filteredOrder);
    console.log('🔄 Loaded left section order WITHOUT custom sections:', filteredOrder);
  } else {
    setLeftSectionOrder(defaultLeftSectionOrder);
  }

  const savedRightSectionOrder = localStorage.getItem("resume22RightSectionOrder");
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

  // Save section orders to localStorage
  useEffect(() => {
    if (leftSectionOrder.length > 0) {
      localStorage.setItem("resume22LeftSectionOrder", JSON.stringify(leftSectionOrder));
    }
  }, [leftSectionOrder]);

  useEffect(() => {
    if (rightSectionOrder.length > 0) {
      localStorage.setItem("resume22RightSectionOrder", JSON.stringify(rightSectionOrder));
    }
  }, [rightSectionOrder]);

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
      localStorage.setItem("resume22RightSectionOrder", JSON.stringify(newRightOrder));
      console.log('📝 Final right section order with ONLY CURRENT custom sections:', newRightOrder);
    }
    
    // 🔥 FIX: Left side-லிருந்து custom sections-ஐ remove செய்யவும்
    const currentLeftOrder = [...leftSectionOrder];
    const filteredLeftOrder = currentLeftOrder.filter(section => !section.startsWith('custom_'));
    if (JSON.stringify(filteredLeftOrder) !== JSON.stringify(currentLeftOrder)) {
      setLeftSectionOrder(filteredLeftOrder);
      localStorage.setItem("resume22LeftSectionOrder", JSON.stringify(filteredLeftOrder));
      console.log('🗑️ Removed custom sections from left side:', filteredLeftOrder);
    }
    
  } else if (userId && Object.keys(customSections).length === 0) {
    // If no current custom sections, remove all custom sections from both sides
    const currentRightOrder = [...rightSectionOrder];
    const filteredRightOrder = currentRightOrder.filter(section => !section.startsWith('custom_'));
    
    if (filteredRightOrder.length !== currentRightOrder.length) {
      setRightSectionOrder(filteredRightOrder);
      localStorage.setItem("resume22RightSectionOrder", JSON.stringify(filteredRightOrder));
      console.log('🗑️ Removed all custom sections from right side (no current sections)');
    }
    
    const currentLeftOrder = [...leftSectionOrder];
    const filteredLeftOrder = currentLeftOrder.filter(section => !section.startsWith('custom_'));
    if (filteredLeftOrder.length !== currentLeftOrder.length) {
      setLeftSectionOrder(filteredLeftOrder);
      localStorage.setItem("resume22LeftSectionOrder", JSON.stringify(filteredLeftOrder));
      console.log('🗑️ Removed all custom sections from left side (no current sections)');
    }
  }
}, [customSections]);

  const formatDate = (month, year) => {
    if (!month || !year) return "";
    return `${month} ${year}`;
  };

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
    
    // Force re-pagination after a short delay
    setTimeout(() => {
      paginateContent();
    }, 100);
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
    
    // Force re-pagination after a short delay
    setTimeout(() => {
      paginateContent();
    }, 100);
  };

  const handleDragEnd = (e) => {
    setDragOverIndex(null);
    setDragOverSide(null);
    e.currentTarget.style.opacity = '1';
  };

  // Reset functions
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

  // Arrange sections dialog handler
  const handleArrangeSectionsClick = () => {
    setArrangeDialogOpen(true);
  };

  const handleArrangeDialogClose = () => {
    setArrangeDialogOpen(false);
  };

  const renderDragPanel = (side, sections) => {
    return (
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
          <DragIndicator sx={{ mr: 1 }} />
          {side === 'left' ? 'Left Side' : 'Right Side'} Sections
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

  const getSectionTitle = (sectionId) => {
    const titles = {
      'contact': 'Contact',
      'skills': 'Skills',
      'languages': 'Languages',
      'profile': 'Profile Info',
      'education': 'Education',
      'workExperience': 'Work Experience',
      'accomplishments': 'Accomplishments',
      'certifications': 'Certifications',
      'softwareSkills': 'Software Skills',
      'volunteering': 'Volunteering',
      'interests': 'Interests',
      'websites': 'Websites/Profiles',
      'references': 'References',
      'additionalInfo': 'Additional Information'
    };
    
    if (sectionId.startsWith('custom_')) {
      return sectionId.replace('custom_', '').toUpperCase();
    }
    
    return titles[sectionId] || sectionId;
  };

  // Function to add font styles to HTML content
  const addFontStylesToHTML = (htmlContent) => {
    return htmlContent
      .replace(/<div/g, `<div style="font-family: ${mergedDesignSettings.font}; font-style: ${mergedDesignSettings.fontStyle}; font-size: ${mergedDesignSettings.fontSize}; line-height: ${mergedDesignSettings.lineSpacing}px;"`)
      .replace(/<p/g, `<p style="font-family: ${mergedDesignSettings.font}; font-style: ${mergedDesignSettings.fontStyle}; font-size: ${mergedDesignSettings.fontSize}; line-height: ${mergedDesignSettings.lineSpacing}px;"`)
      .replace(/<span/g, `<span style="font-family: ${mergedDesignSettings.font}; font-style: ${mergedDesignSettings.fontStyle};"`)
      .replace(/<h1/g, `<h1 style="font-family: ${mergedDesignSettings.font}; font-style: ${mergedDesignSettings.fontStyle};"`)
      .replace(/<h2/g, `<h2 style="font-family: ${mergedDesignSettings.font}; font-style: ${mergedDesignSettings.fontStyle};"`)
      .replace(/<h3/g, `<h3 style="font-family: ${mergedDesignSettings.font}; font-style: ${mergedDesignSettings.fontStyle};"`)
      .replace(/<h4/g, `<h4 style="font-family: ${mergedDesignSettings.font}; font-style: ${mergedDesignSettings.fontStyle};"`)
      .replace(/<h5/g, `<h5 style="font-family: ${mergedDesignSettings.font}; font-style: ${mergedDesignSettings.fontStyle};"`)
      .replace(/<h6/g, `<h6 style="font-family: ${mergedDesignSettings.font}; font-style: ${mergedDesignSettings.fontStyle};"`)
      .replace(/<li/g, `<li style="font-family: ${mergedDesignSettings.font}; font-style: ${mergedDesignSettings.fontStyle}; font-size: ${mergedDesignSettings.fontSize}; line-height: ${mergedDesignSettings.lineSpacing}px;"`)
      .replace(/<ul/g, `<ul style="font-family: ${mergedDesignSettings.font}; font-style: ${mergedDesignSettings.fontStyle};"`)
      .replace(/<ol/g, `<ol style="font-family: ${mergedDesignSettings.font}; font-style: ${mergedDesignSettings.fontStyle};"`)
      .replace(/<td/g, `<td style="font-family: ${mergedDesignSettings.font}; font-style: ${mergedDesignSettings.fontStyle};"`)
      .replace(/<th/g, `<th style="font-family: ${mergedDesignSettings.font}; font-style: ${mergedDesignSettings.fontStyle};"`)
      .replace(/<tr/g, `<tr style="font-family: ${mergedDesignSettings.font}; font-style: ${mergedDesignSettings.fontStyle};"`)
      .replace(/<table/g, `<table style="font-family: ${mergedDesignSettings.font}; font-style: ${mergedDesignSettings.fontStyle};"`);
  };

  const renderLeftSectionContent = (sectionId) => {
    switch (sectionId) {
      case 'contact':
        return (
          <div className="resume-section">
            <Box sx={{ mb: 3, mt: 4, fontFamily: mergedDesignSettings.font }}>
              <Typography sx={{ 
                fontWeight: 'bold', 
                mb: 2,
                color: '#ecf0f1',
                fontSize: mergedDesignSettings.headingSize,
                borderBottom: `2px solid ${mergedDesignSettings.accentColor}`,
                pb: 0.5,
                display: 'inline-block',
                mt:8,
                fontFamily: mergedDesignSettings.font,
                fontStyle: mergedDesignSettings.fontStyle,
              }}>
                CONTACT
              </Typography>
              <List dense sx={{ fontFamily: mergedDesignSettings.font }}>
                <ListItem disableGutters sx={{ alignItems: 'flex-start', mb: 1.5, fontFamily: mergedDesignSettings.font }}>
                  <Phone sx={{ fontSize: 18, mr: 1.5, color: mergedDesignSettings.accentColor, mt: 0.5 }} />
                  <ListItemText 
                    primary={data.phone} 
                    primaryTypographyProps={{ 
                      color: "white", 
                      fontSize: mergedDesignSettings.fontSize, 
                      style: { fontStyle: mergedDesignSettings.fontStyle },
                      fontFamily: mergedDesignSettings.font,
                    }} 
                  />
                </ListItem>
                <ListItem disableGutters sx={{ alignItems: 'flex-start', mb: 1.5, fontFamily: mergedDesignSettings.font }}>
                  <Email sx={{ fontSize: 18, mr: 1.5, color: mergedDesignSettings.accentColor, mt: 0.5 }} />
                  <ListItemText 
                    primary={data.email} 
                    primaryTypographyProps={{ 
                      color: "white", 
                      fontSize: mergedDesignSettings.fontSize, 
                      style: { fontStyle: mergedDesignSettings.fontStyle },
                      fontFamily: mergedDesignSettings.font,
                    }} 
                  />
                </ListItem>
                <ListItem disableGutters sx={{ alignItems: 'flex-start', mb: 1.5, fontFamily: mergedDesignSettings.font }}>
                  <LocationOn sx={{ fontSize: 18, mr: 1.5, color: mergedDesignSettings.accentColor, mt: 0.5 }} />
                  <ListItemText 
                    primary={data.city} 
                    primaryTypographyProps={{ 
                      color: "white", 
                      fontSize: mergedDesignSettings.fontSize, 
                      style: { fontStyle: mergedDesignSettings.fontStyle },
                      fontFamily: mergedDesignSettings.font,
                    }} 
                  />
                </ListItem>
                <ListItem disableGutters sx={{ alignItems: 'flex-start', mb: 1.5, fontFamily: mergedDesignSettings.font }}>
                  <Language sx={{ fontSize: 18, mr: 1.5, color: mergedDesignSettings.accentColor, mt: 0.5 }} />
                  <ListItemText 
                    primary={data.website} 
                    primaryTypographyProps={{ 
                      color: "white", 
                      fontSize: mergedDesignSettings.fontSize, 
                      style: { fontStyle: mergedDesignSettings.fontStyle },
                      fontFamily: mergedDesignSettings.font,
                    }} 
                  />
                </ListItem>
              </List>
            </Box>
          </div>
        );
      
      case 'skills':
        return (
          <div className="resume-section">
            <Box sx={{ mb: 3, fontFamily: mergedDesignSettings.font }}>
              <Typography sx={{ 
                fontWeight: 'bold', 
                mb: 2,
                color: '#ecf0f1',
                fontSize: mergedDesignSettings.headingSize,
                borderBottom: `2px solid ${mergedDesignSettings.accentColor}`,
                pb: 0.5,
                display: 'inline-block',
                fontFamily: mergedDesignSettings.font,
                fontStyle: mergedDesignSettings.fontStyle,
              }}>
                SKILLS
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, fontFamily: mergedDesignSettings.font }}>
                {(savedSkills.length > 0 ? savedSkills : data.skills).map((skill, index) => (
                  <Chip 
                    key={index}
                    label={typeof skill === 'object' ? skill.name : skill}
                    size="small"
                    sx={{ 
                      mb: 1,
                      backgroundColor: mergedDesignSettings.accentColor,
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: '0.75rem',
                      fontFamily: mergedDesignSettings.font,
                      fontStyle: mergedDesignSettings.fontStyle,
                    }}
                  />
                ))}
              </Box>
            </Box>
          </div>
        );
      
      case 'languages':
        return (
          <div className="resume-section">
            <Box sx={{ mb: 3, fontFamily: mergedDesignSettings.font }}>
              <Typography sx={{ 
                fontWeight: 'bold', 
                mb: 2,
                color: '#ecf0f1',
                fontSize: mergedDesignSettings.headingSize,
                borderBottom: `2px solid ${mergedDesignSettings.accentColor}`,
                pb: 0.5,
                display: 'inline-block',
                fontFamily: mergedDesignSettings.font,
                fontStyle: mergedDesignSettings.fontStyle,
              }}>
                LANGUAGES
              </Typography>
              {(savedLanguages.length > 0 ? savedLanguages : []).map((lang, index) => (
                <Box key={index} sx={{ mb: 1.5, fontFamily: mergedDesignSettings.font }}>
                  <Typography sx={{ 
                    fontWeight: 'bold',
                    color: '#ecf0f1',
                    fontSize: mergedDesignSettings.fontSize,
                    fontFamily: mergedDesignSettings.font,
                    fontStyle: mergedDesignSettings.fontStyle,
                  }}>
                    {typeof lang === 'object' ? lang.language || lang.name : lang}
                  </Typography>
                  {typeof lang === 'object' && lang.level && (
                    <Typography sx={{ 
                      color: '#bdc3c7',
                      fontStyle: 'italic',
                      fontSize: mergedDesignSettings.fontSize,
                      fontFamily: mergedDesignSettings.font,
                      fontStyle: mergedDesignSettings.fontStyle,
                    }}>
                      {lang.level}
                    </Typography>
                  )}
                </Box>
              ))}
            </Box>
          </div>
        );
      
      default:
        // IMPORTANT: For sections moved from right side, render with inSidebar=true
        return renderRightSectionContent(sectionId, true);
    }
  };

  const renderRightSectionContent = (sectionId, inSidebar = false) => {
    const textColor = inSidebar ? "white" : "#34495e";
    const accentBorderColor = inSidebar ? "#ecf0f1" : mergedDesignSettings.accentColor;
    
    switch (sectionId) {
      case 'profile':
        return (
          <div className="resume-section">
            <Typography sx={{ 
              mb: 1, 
              fontSize: mergedDesignSettings.headingSize, 
              fontWeight: "bold",
              color: inSidebar ? '#ecf0f1' : mergedDesignSettings.color,
              borderBottom: `2px solid ${accentBorderColor}`,
              pb: 1,
              display: 'inline-block',
              fontFamily: mergedDesignSettings.font,
              fontStyle: mergedDesignSettings.fontStyle,
            }}>
              PROFILE INFO
            </Typography>
            <Typography sx={{ 
              mb: `${mergedDesignSettings.paragraphSpacing / 10}px`, 
              fontSize: mergedDesignSettings.fontSize,
              lineHeight: 1.6,
              color: textColor,
              textAlign: 'justify',
              fontFamily: mergedDesignSettings.font,
              fontStyle: mergedDesignSettings.fontStyle,
            }}>
              {savedSummary || data.profile}
            </Typography>
          </div>
        );
      
      case 'education':
        return (
          <div className="resume-section">
            <Box sx={{ mb: 3, fontFamily: mergedDesignSettings.font }}>
              <Typography sx={{ 
                fontWeight: 'bold', 
                mb: 2,
                color: inSidebar ? '#ecf0f1' : mergedDesignSettings.color,
                fontSize: mergedDesignSettings.headingSize,
                borderBottom: `2px solid ${accentBorderColor}`,
                pb: 0.5,
                display: 'inline-block',
                fontFamily: mergedDesignSettings.font,
                fontStyle: mergedDesignSettings.fontStyle,
              }}>
                EDUCATION
              </Typography>
              {educationEntries.length > 0 ? (
                educationEntries.map((edu, index) => (
                  <Box key={index} sx={{ mb: 2, fontFamily: mergedDesignSettings.font }}>
                    <Typography sx={{ 
                      color: textColor,
                      fontSize: mergedDesignSettings.fontSize,
                      fontFamily: mergedDesignSettings.font,
                      fontStyle: mergedDesignSettings.fontStyle,
                    }}>
                      {edu.degree} {edu.fieldOfStudy ? `- ${edu.fieldOfStudy}` : ''}
                    </Typography>
                    <Typography sx={{ 
                      color: textColor,
                      fontSize: mergedDesignSettings.fontSize,
                      fontFamily: mergedDesignSettings.font,
                      fontStyle: mergedDesignSettings.fontStyle,
                    }}>
                      {edu.schoolName}
                    </Typography>
                    <Typography sx={{ 
                      color: textColor,
                      fontStyle: 'italic',
                      fontSize: mergedDesignSettings.fontSize,
                      fontFamily: mergedDesignSettings.font,
                      fontStyle: mergedDesignSettings.fontStyle,
                    }}>
                      {formatDate(edu.gradMonth, edu.gradYear)}
                    </Typography>
                  </Box>
                ))
              ) : (
                <Typography sx={{ color: inSidebar ? '#bdc3c7' : '#bdc3c7', fontSize: mergedDesignSettings.fontSize, fontFamily: mergedDesignSettings.font, fontStyle: mergedDesignSettings.fontStyle }}>
                  No education entries added yet.
                </Typography>
              )}
            </Box>
          </div>
        );
      
      case 'workExperience':
        return (
          <div className="resume-section">
            <Typography sx={{ 
              mb: 1, 
              fontSize: mergedDesignSettings.headingSize, 
              fontWeight: "bold",
              color: inSidebar ? '#ecf0f1' : mergedDesignSettings.color,
              borderBottom: `2px solid ${accentBorderColor}`,
              pb: 1,
              display: 'inline-block',
              fontFamily: mergedDesignSettings.font,
              fontStyle: mergedDesignSettings.fontStyle,
            }}>
              WORK EXPERIENCE
            </Typography>
            <Box sx={{ mt: 2, fontFamily: mergedDesignSettings.font }}>
              {workExperiences && workExperiences.length > 0 ? (
                workExperiences.map((work, index) => (
                  <Box key={index} sx={{ 
                    mb: 2, 
                    pl: 2, 
                    borderLeft: `3px solid ${accentBorderColor}`,
                    position: 'relative',
                    fontFamily: mergedDesignSettings.font,
                  }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1, fontFamily: mergedDesignSettings.font }}>
                      <Typography sx={{ 
                        fontWeight: 'bold',
                        color: inSidebar ? '#ecf0f1' : mergedDesignSettings.color,
                        fontSize: mergedDesignSettings.fontSize,
                        fontFamily: mergedDesignSettings.font,
                        fontStyle: mergedDesignSettings.fontStyle,
                      }}>
                        {work.jobTitle} @ {work.employer}
                      </Typography>
                      <Typography sx={{ 
                        color: accentBorderColor,
                        fontWeight: 'bold',
                        backgroundColor: inSidebar ? 'rgba(255,255,255,0.1)' : '#f9f9f9',
                        px: 1,
                        py: 0.5,
                        borderRadius: 1,
                        fontSize: mergedDesignSettings.fontSize,
                        fontFamily: mergedDesignSettings.font,
                        fontStyle: mergedDesignSettings.fontStyle,
                      }}>
                        {formatDate(work.startMonth, work.startYear)} -{" "}
                        {work.current ? "Present" : formatDate(work.endMonth, work.endYear)}
                      </Typography>
                    </Box>
                    <Typography sx={{ 
                      fontWeight: 'bold', 
                      mb: 1,
                      color: textColor,
                      fontStyle: 'italic',
                      fontSize: mergedDesignSettings.fontSize,
                      fontFamily: mergedDesignSettings.font,
                      fontStyle: mergedDesignSettings.fontStyle,
                    }}>
                      {work.companyName} | {work.location}
                    </Typography>
                    {work.description && (
                      <Box
                        sx={{ 
                          mt: 1, 
                          "& strong": { fontWeight: "bold", fontFamily: mergedDesignSettings.font }, 
                          "& em": { fontStyle: "italic", fontFamily: mergedDesignSettings.font }, 
                          "& u": { textDecoration: "underline", fontFamily: mergedDesignSettings.font },
                          lineHeight: 1.6,
                          color: textColor,
                          fontSize: mergedDesignSettings.fontSize,
                          fontFamily: mergedDesignSettings.font,
                          fontStyle: mergedDesignSettings.fontStyle,
                        }}
                        dangerouslySetInnerHTML={{
                          __html: work.description
                            .replace(/\*\*(.*?)\*\*/g, `<strong style="font-family: ${mergedDesignSettings.font}; font-weight: bold; font-style: ${mergedDesignSettings.fontStyle}">$1</strong>`)
                            .replace(/\*(.*?)\*/g, `<em style="font-family: ${mergedDesignSettings.font}; font-style: italic">$1</em>`)
                            .replace(/<u>(.*?)<\/u>/g, `<u style="font-family: ${mergedDesignSettings.font}">$1</u>`)
                            .replace(/\n/g, `<br style="font-family: ${mergedDesignSettings.font}" />`),
                        }}
                      />
                    )}
                  </Box>
                ))
              ) : (
                <Typography sx={{ fontSize: mergedDesignSettings.fontSize, color: inSidebar ? '#bdc3c7' : '#7f8c8d', fontFamily: mergedDesignSettings.font, fontStyle: mergedDesignSettings.fontStyle }}>
                  No work experiences added yet.
                </Typography>
              )}
            </Box>
          </div>
        );

      case 'accomplishments':
        return savedAccomplishments.length > 0 ? (
          <div className="resume-section">
            <Box sx={{ mb: 2, fontFamily: mergedDesignSettings.font }}>
              <Typography sx={{ mb: 1, fontSize: mergedDesignSettings.headingSize, fontWeight: "bold", color: inSidebar ? '#ecf0f1' : mergedDesignSettings.color, borderBottom: `2px solid ${accentBorderColor}`, pb: 1, display: 'inline-block', fontFamily: mergedDesignSettings.font, fontStyle: mergedDesignSettings.fontStyle }}>ACCOMPLISHMENTS</Typography>
              {savedAccomplishments.map((acc, index) => (<Typography key={index} sx={{ mb: `${mergedDesignSettings.paragraphSpacing / 10}px`, fontSize: mergedDesignSettings.fontSize, fontFamily: mergedDesignSettings.font, fontStyle: mergedDesignSettings.fontStyle, color: textColor }} whiteSpace="pre-line">{acc}</Typography>))}
            </Box>
          </div>
        ) : null;
      
      case 'certifications':
        return savedCertifications.length > 0 ? (
          <div className="resume-section">
            <Box sx={{ mb: 2, fontFamily: mergedDesignSettings.font }}>
              <Typography sx={{ mb: 1, fontSize: mergedDesignSettings.headingSize, fontWeight: "bold", color: inSidebar ? '#ecf0f1' : mergedDesignSettings.color, borderBottom: `2px solid ${accentBorderColor}`, pb: 1, display: 'inline-block', fontFamily: mergedDesignSettings.font, fontStyle: mergedDesignSettings.fontStyle }}>CERTIFICATIONS</Typography>
              {savedCertifications.map((cert, index) => (<Typography key={index} sx={{ mb: `${mergedDesignSettings.paragraphSpacing / 10}px`, fontSize: mergedDesignSettings.fontSize, fontFamily: mergedDesignSettings.font, fontStyle: mergedDesignSettings.fontStyle, color: textColor }}>{cert.name} – {cert.provider} ({cert.year})</Typography>))}
            </Box>
          </div>
        ) : null;
      
      case 'softwareSkills':
        return softwareSkills.length > 0 ? (
          <div className="resume-section">
            <Box sx={{ mb: 2, fontFamily: mergedDesignSettings.font }}>
              <Typography sx={{ mb: 1, fontSize: mergedDesignSettings.headingSize, fontWeight: "bold", color: inSidebar ? '#ecf0f1' : mergedDesignSettings.color, borderBottom: `2px solid ${accentBorderColor}`, pb: 1, display: 'inline-block', fontFamily: mergedDesignSettings.font, fontStyle: mergedDesignSettings.fontStyle }}>SOFTWARE SKILLS</Typography>
              {softwareSkills.map((skill, index) => (<Typography key={index} sx={{ mb: `${mergedDesignSettings.paragraphSpacing / 10}px`, fontSize: mergedDesignSettings.fontSize, fontFamily: mergedDesignSettings.font, fontStyle: mergedDesignSettings.fontStyle, color: textColor }}>{skill.name} — {skill.level}%</Typography>))}
            </Box>
          </div>
        ) : null;
      
      case 'volunteering':
        return savedVolunteering.length > 0 ? (
          <div className="resume-section">
            <Box sx={{ mb: 2, fontFamily: mergedDesignSettings.font }}>
              <Typography sx={{ mb: 1, fontSize: mergedDesignSettings.headingSize, fontWeight: "bold", color: inSidebar ? '#ecf0f1' : mergedDesignSettings.color, borderBottom: `2px solid ${accentBorderColor}`, pb: 1, display: 'inline-block', fontFamily: mergedDesignSettings.font, fontStyle: mergedDesignSettings.fontStyle }}>VOLUNTEERING</Typography>
              {savedVolunteering.map((vol, index) => (
                <Box key={index} sx={{ mb: 1, fontFamily: mergedDesignSettings.font }}>
                  <Typography sx={{ fontSize: mergedDesignSettings.fontSize, fontWeight: "bold", fontFamily: mergedDesignSettings.font, fontStyle: mergedDesignSettings.fontStyle, color: textColor }}>{vol.subtopic}</Typography>
                  <Typography sx={{ fontSize: mergedDesignSettings.fontSize, color: inSidebar ? '#bdc3c7' : "gray", fontFamily: mergedDesignSettings.font, fontStyle: mergedDesignSettings.fontStyle }}>{vol.fromDate} - {vol.toDate}</Typography>
                  <Typography sx={{ fontSize: mergedDesignSettings.fontSize, whiteSpace: "pre-line", mt: 0.5, fontFamily: mergedDesignSettings.font, fontStyle: mergedDesignSettings.fontStyle, color: textColor }}>{vol.content}</Typography>
                </Box>
              ))}
            </Box>
          </div>
        ) : null;
      
      case 'interests':
        return savedInterests.length > 0 ? (
          <div className="resume-section">
            <Box sx={{ mb: 2, fontFamily: mergedDesignSettings.font }}>
              <Typography sx={{ mb: 1, fontSize: mergedDesignSettings.headingSize, fontWeight: "bold", color: inSidebar ? '#ecf0f1' : mergedDesignSettings.color, borderBottom: `2px solid ${accentBorderColor}`, pb: 1, display: 'inline-block', fontFamily: mergedDesignSettings.font, fontStyle: mergedDesignSettings.fontStyle }}>INTERESTS</Typography>
              {savedInterests.map((interest, index) => (<Typography key={index} sx={{ mb: `${mergedDesignSettings.paragraphSpacing / 10}px`, fontSize: mergedDesignSettings.fontSize, fontFamily: mergedDesignSettings.font, fontStyle: mergedDesignSettings.fontStyle, color: textColor }}>• {interest}</Typography>))}
            </Box>
          </div>
        ) : null;
      
      case 'websites':
        return savedWebsites.length > 0 ? (
          <div className="resume-section">
            <Box sx={{ mb: 2, fontFamily: mergedDesignSettings.font }}>
              <Typography sx={{ mb: 1, fontSize: mergedDesignSettings.headingSize, fontWeight: "bold", color: inSidebar ? '#ecf0f1' : mergedDesignSettings.color, borderBottom: `2px solid ${accentBorderColor}`, pb: 1, display: 'inline-block', fontFamily: mergedDesignSettings.font, fontStyle: mergedDesignSettings.fontStyle }}>WEBSITES / PROFILES</Typography>
              {savedWebsites.map((site, index) => (<Typography key={index} sx={{ mb: `${mergedDesignSettings.paragraphSpacing / 10}px`, fontSize: mergedDesignSettings.fontSize, fontFamily: mergedDesignSettings.font, fontStyle: mergedDesignSettings.fontStyle, color: textColor }}>{site.url} {site.addToHeader ? "(Shown in Header)" : ""}</Typography>))}
            </Box>
          </div>
        ) : null;
      
      case 'references':
        return savedReferences.length > 0 ? (
          <div className="resume-section">
            <Box sx={{ mb: 2, fontFamily: mergedDesignSettings.font }}>
              <Typography sx={{ mb: 1, fontSize: mergedDesignSettings.headingSize, fontWeight: "bold", color: inSidebar ? '#ecf0f1' : mergedDesignSettings.color, borderBottom: `2px solid ${accentBorderColor}`, pb: 1, display: 'inline-block', fontFamily: mergedDesignSettings.font, fontStyle: mergedDesignSettings.fontStyle }}>REFERENCES</Typography>
              {savedReferences.map((ref, index) => (<Typography key={index} sx={{ mb: `${mergedDesignSettings.paragraphSpacing / 10}px`, fontSize: mergedDesignSettings.fontSize, fontFamily: mergedDesignSettings.font, fontStyle: mergedDesignSettings.fontStyle, color: textColor }} whiteSpace="pre-line">{ref}</Typography>))}
            </Box>
          </div>
        ) : null;
      
      case 'additionalInfo':
        return savedAdditionalInfo.length > 0 ? (
          <div className="resume-section">
            <Box sx={{ mb: 2, fontFamily: mergedDesignSettings.font }}>
              <Typography sx={{ mb: 1, fontSize: mergedDesignSettings.headingSize, fontWeight: "bold", color: inSidebar ? '#ecf0f1' : mergedDesignSettings.color, borderBottom: `2px solid ${accentBorderColor}`, pb: 1, display: 'inline-block', fontFamily: mergedDesignSettings.font, fontStyle: mergedDesignSettings.fontStyle }}>ADDITIONAL INFORMATION</Typography>
              {savedAdditionalInfo.map((info, index) => (<Typography key={index} sx={{ mb: `${mergedDesignSettings.paragraphSpacing / 10}px`, fontSize: mergedDesignSettings.fontSize, fontFamily: mergedDesignSettings.font, fontStyle: mergedDesignSettings.fontStyle, color: textColor }}> {info}</Typography>))}
            </Box>
          </div>
        ) : null;

      case 'skills':
        return (
          <div className="resume-section">
            <Box sx={{ mb: 3, fontFamily: mergedDesignSettings.font }}>
              <Typography sx={{ 
                fontWeight: 'bold', 
                mb: 2,
                color: inSidebar ? '#ecf0f1' : mergedDesignSettings.color,
                fontSize: mergedDesignSettings.headingSize,
                borderBottom: `2px solid ${accentBorderColor}`,
                pb: 0.5,
                display: 'inline-block',
                fontFamily: mergedDesignSettings.font,
                fontStyle: mergedDesignSettings.fontStyle,
              }}>
                SKILLS
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, fontFamily: mergedDesignSettings.font }}>
                {(savedSkills.length > 0 ? savedSkills : data.skills).map((skill, index) => (
                  <Chip 
                    key={index}
                    label={typeof skill === 'object' ? skill.name : skill}
                    size="small"
                    sx={{ 
                      mb: 1,
                      backgroundColor: inSidebar ? mergedDesignSettings.accentColor : mergedDesignSettings.color,
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: '0.75rem',
                      fontFamily: mergedDesignSettings.font,
                      fontStyle: mergedDesignSettings.fontStyle,
                    }}
                  />
                ))}
              </Box>
            </Box>
          </div>
        );

      case 'contact':
        return (
          <div className="resume-section">
            <Box sx={{ mb: 3, mt: inSidebar ? 4 : 0, fontFamily: mergedDesignSettings.font }}>
              <Typography sx={{ 
                fontWeight: 'bold', 
                mb: 2,
                color: inSidebar ? '#ecf0f1' : mergedDesignSettings.color,
                fontSize: mergedDesignSettings.headingSize,
                borderBottom: `2px solid ${accentBorderColor}`,
                pb: 0.5,
                display: 'inline-block',
                mt: inSidebar ? 8 : 0,
                fontFamily: mergedDesignSettings.font,
                fontStyle: mergedDesignSettings.fontStyle,
              }}>
                CONTACT
              </Typography>
              <List dense sx={{ fontFamily: mergedDesignSettings.font }}>
                <ListItem disableGutters sx={{ alignItems: 'flex-start', mb: 1.5, fontFamily: mergedDesignSettings.font }}>
                  <Phone sx={{ fontSize: 18, mr: 1.5, color: accentBorderColor, mt: 0.5 }} />
                  <ListItemText 
                    primary={data.phone} 
                    primaryTypographyProps={{ 
                      color: textColor, 
                      fontSize: mergedDesignSettings.fontSize, 
                      style: { fontStyle: mergedDesignSettings.fontStyle },
                      fontFamily: mergedDesignSettings.font,
                    }} 
                  />
                </ListItem>
                <ListItem disableGutters sx={{ alignItems: 'flex-start', mb: 1.5, fontFamily: mergedDesignSettings.font }}>
                  <Email sx={{ fontSize: 18, mr: 1.5, color: accentBorderColor, mt: 0.5 }} />
                  <ListItemText 
                    primary={data.email} 
                    primaryTypographyProps={{ 
                      color: textColor, 
                      fontSize: mergedDesignSettings.fontSize, 
                      style: { fontStyle: mergedDesignSettings.fontStyle },
                      fontFamily: mergedDesignSettings.font,
                    }} 
                  />
                </ListItem>
                <ListItem disableGutters sx={{ alignItems: 'flex-start', mb: 1.5, fontFamily: mergedDesignSettings.font }}>
                  <LocationOn sx={{ fontSize: 18, mr: 1.5, color: accentBorderColor, mt: 0.5 }} />
                  <ListItemText 
                    primary={data.city} 
                    primaryTypographyProps={{ 
                      color: textColor, 
                      fontSize: mergedDesignSettings.fontSize, 
                      style: { fontStyle: mergedDesignSettings.fontStyle },
                      fontFamily: mergedDesignSettings.font,
                    }} 
                  />
                </ListItem>
                <ListItem disableGutters sx={{ alignItems: 'flex-start', mb: 1.5, fontFamily: mergedDesignSettings.font }}>
                  <Language sx={{ fontSize: 18, mr: 1.5, color: accentBorderColor, mt: 0.5 }} />
                  <ListItemText 
                    primary={data.website} 
                    primaryTypographyProps={{ 
                      color: textColor, 
                      fontSize: mergedDesignSettings.fontSize, 
                      style: { fontStyle: mergedDesignSettings.fontStyle },
                      fontFamily: mergedDesignSettings.font,
                    }} 
                  />
                </ListItem>
              </List>
            </Box>
          </div>
        );
         
      case 'languages':
        return (
          <div className="resume-section">
            <Box sx={{ mb: 3, fontFamily: mergedDesignSettings.font }}>
              <Typography sx={{ 
                fontWeight: 'bold', 
                mb: 2,
                color: inSidebar ? '#ecf0f1' : mergedDesignSettings.color,
                fontSize: mergedDesignSettings.headingSize,
                borderBottom: `2px solid ${accentBorderColor}`,
                pb: 0.5,
                display: 'inline-block',
                fontFamily: mergedDesignSettings.font,
                fontStyle: mergedDesignSettings.fontStyle,
              }}>
                LANGUAGES
              </Typography>
              {(savedLanguages.length > 0 ? savedLanguages : []).map((lang, index) => (
                <Box key={index} sx={{ mb: 1.5, fontFamily: mergedDesignSettings.font }}>
                  <Typography sx={{ 
                    fontWeight: 'bold',
                    color: textColor,
                    fontSize: mergedDesignSettings.fontSize,
                    fontFamily: mergedDesignSettings.font,
                    fontStyle: mergedDesignSettings.fontStyle,
                  }}>
                    {typeof lang === 'object' ? lang.language || lang.name : lang}
                  </Typography>
                  {typeof lang === 'object' && lang.level && (
                    <Typography sx={{ 
                      color: inSidebar ? '#bdc3c7' : '#7f8c8d',
                      fontStyle: 'italic',
                      fontSize: mergedDesignSettings.fontSize,
                      fontFamily: mergedDesignSettings.font,
                      fontStyle: mergedDesignSettings.fontStyle,
                    }}>
                      {lang.level}
                    </Typography>
                  )}
                </Box>
              ))}
            </Box>
          </div>
        );
     default:
  // Handle custom sections
  if (sectionId && sectionId.startsWith('custom_')) {
    const customSectionName = sectionId.replace('custom_', '');
    const items = customSections[customSectionName] || [];
    
    console.log(`🎯 Rendering custom section: ${customSectionName}`, items);
    
    if (items && items.length > 0) {
      return (
        <div className="resume-section">
          <Typography sx={{ 
            mb: 1, 
            fontSize: mergedDesignSettings.headingSize, 
            fontWeight: "bold",
            color: inSidebar ? '#ecf0f1' : mergedDesignSettings.color,
            borderBottom: `2px solid ${accentBorderColor}`,
            pb: 1,
            display: 'inline-block',
            fontFamily: mergedDesignSettings.font,
            fontStyle: mergedDesignSettings.fontStyle,
          }}>
            {customSectionName.toUpperCase()}
          </Typography>
          {items.map((item, i) => (
            <Typography 
              key={i} 
              sx={{ 
                mb: 1, 
                fontSize: mergedDesignSettings.fontSize, 
                fontFamily: mergedDesignSettings.font, 
                fontStyle: mergedDesignSettings.fontStyle, 
                color: textColor 
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
  };

  const paginateContent = useCallback(() => {
    if (!mainContentRef.current || !sidebarContentRef.current) return;

    const mainSections = Array.from(mainContentRef.current.querySelectorAll('.resume-section'));
    const sidebarSections = Array.from(sidebarContentRef.current.querySelectorAll('.resume-section'));
    
    const pageHeightInPx = parseFloat(page.height.replace('mm', '')) * 3.78;
    const mainAvailableHeight = pageHeightInPx - (2 * mergedDesignSettings.topBottomMargin);
    const sidebarAvailableHeight = pageHeightInPx - (2 * mergedDesignSettings.topBottomMargin);

    let newPages = [];
    let currentMainPageSections = [];
    let currentSidebarPageSections = [];
    let currentMainHeight = 0;
    let currentSidebarHeight = 0;
    
    // Always create at least one page
    if (mainSections.length === 0 && sidebarSections.length === 0) {
      newPages.push({ main: [], sidebar: [] });
    }
    
    // Distribute main content across pages
    mainSections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      
      if (currentMainHeight + sectionHeight > mainAvailableHeight && currentMainPageSections.length > 0) {
        newPages.push({
          main: currentMainPageSections,
          sidebar: currentSidebarPageSections,
        });
        currentMainPageSections = [section];
        currentMainHeight = sectionHeight;
        currentSidebarPageSections = [];
        currentSidebarHeight = 0;
      } else {
        currentMainPageSections.push(section);
        currentMainHeight += sectionHeight;
      }
    });
    
    // Distribute sidebar content across pages
    sidebarSections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      
      let targetPageIndex = 0;
      let minHeightDiff = Infinity;
      
      // Try to find the best page to add this sidebar section
      newPages.forEach((page, index) => {
        const mainHeight = page.main.reduce((sum, s) => sum + s.offsetHeight, 0);
        const sidebarHeight = page.sidebar.reduce((sum, s) => sum + s.offsetHeight, 0);
        const heightDiff = Math.abs(mainHeight - (sidebarHeight + sectionHeight));
        
        if (heightDiff < minHeightDiff && (sidebarHeight + sectionHeight) <= sidebarAvailableHeight) {
          minHeightDiff = heightDiff;
          targetPageIndex = index;
        }
      });
      
      if (newPages.length === 0 || minHeightDiff === Infinity) {
        // Add to current page if it fits, otherwise create new page
        if (currentSidebarHeight + sectionHeight <= sidebarAvailableHeight) {
          currentSidebarPageSections.push(section);
          currentSidebarHeight += sectionHeight;
        } else {
          newPages.push({
            main: currentMainPageSections,
            sidebar: currentSidebarPageSections,
          });
          currentSidebarPageSections = [section];
          currentSidebarHeight = sectionHeight;
          currentMainPageSections = [];
          currentMainHeight = 0;
        }
      } else {
        newPages[targetPageIndex].sidebar.push(section);
      }
    });
    
    // Add the last page
    if (currentMainPageSections.length > 0 || currentSidebarPageSections.length > 0) {
      newPages.push({
        main: currentMainPageSections,
        sidebar: currentSidebarPageSections,
      });
    }
    
    setPages(newPages);
  }, [page.height, mergedDesignSettings.topBottomMargin, leftSectionOrder, rightSectionOrder]);
  

  useEffect(() => {
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
    leftSectionOrder,
    rightSectionOrder,
    mergedDesignSettings, // Add this to re-paginate when design settings change
  ]);

  const renderSidebarContent = (sidebarSections = []) => {
    if (sidebarSections.length === 0) {
      return (
        <Box sx={{ minHeight: "100%", fontFamily: mergedDesignSettings.font }}>
          {/* Empty sidebar for subsequent pages */}
        </Box>
      );
    }

    return (
      <Box display="flex" flexDirection="column" sx={{ flexGrow: 1, p: 3, mt: 12, fontFamily: mergedDesignSettings.font }}>
        {sidebarSections.map((section, index) => (
          <div key={index} dangerouslySetInnerHTML={{ __html: section.outerHTML }} />
        ))}
      </Box>
    );
  };

  const renderSidebarContentToMeasure = () => (
    <Box ref={sidebarContentRef} sx={{ visibility: 'hidden', position: 'absolute', fontFamily: mergedDesignSettings.font }}>
      <Box sx={{ 
        p: 3, 
        bgcolor: mergedDesignSettings.color, 
        color: "white", 
        width: "29%",
        borderTopLeftRadius: '50px',
        borderTopRightRadius: '50px',
        borderBottomLeftRadius: '8px',
        ml: 1,
        mt: '-300px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        zIndex: 2,
        fontFamily: mergedDesignSettings.font,
        fontSize: mergedDesignSettings.fontSize,
        fontStyle: mergedDesignSettings.fontStyle,
        lineHeight: `${mergedDesignSettings.lineSpacing}px`,
      }}>
        {/* Render left side sections in the specified order */}
        {leftSectionOrder.map((sectionId, index) => (
          <React.Fragment key={sectionId}>
            {renderLeftSectionContent(sectionId)}
            {index < leftSectionOrder.length - 1 && (
              <Divider sx={{ bgcolor: "#7f8c8d", my: 2, borderBottomWidth: mergedDesignSettings.lineWeight, fontFamily: mergedDesignSettings.font }} />
            )}
          </React.Fragment>
        ))}
      </Box>
    </Box>
  );

  const renderMainContentToMeasure = () => (
    <Box ref={mainContentRef} sx={{ visibility: 'hidden', position: 'absolute', fontFamily: mergedDesignSettings.font }}>
      <Box sx={{ p: `${mergedDesignSettings.topBottomMargin}px ${mergedDesignSettings.sideMargins}px`, width: "69%", fontFamily: mergedDesignSettings.font }}>
        {/* Render right side sections in the specified order */}
        {rightSectionOrder.map(sectionId => (
          <React.Fragment key={sectionId}>
            {renderRightSectionContent(sectionId)}
          </React.Fragment>
        ))}
      </Box>
    </Box>
  );

  return (
    <Box sx={{ width: "100%", position: "relative", m: 5, fontFamily: mergedDesignSettings.font }}>
      {!exporting && (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 2, gap: 2, '@media print': { display: 'none' }, fontFamily: mergedDesignSettings.font }}>
          <IconButton onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))} disabled={currentPage === 0} color="primary" sx={{ fontFamily: mergedDesignSettings.font }}><ChevronLeft /></IconButton>
          <Typography sx={{ mx: 2, fontFamily: mergedDesignSettings.font }}>Page {currentPage + 1} of {Math.max(1, pages.length)}</Typography>
          <IconButton onClick={() => setCurrentPage(prev => Math.min(pages.length - 1, prev + 1))} disabled={currentPage === Math.max(0, pages.length - 1)} color="primary" sx={{ fontFamily: mergedDesignSettings.font }}><ChevronRight /></IconButton>
          
          {enableDragDrop && (
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
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
      {renderSidebarContentToMeasure()}
      
      <Box id="resume-container" sx={{ fontFamily: mergedDesignSettings.font }}>
        {pages.length > 0 ? (
          pages.map((pageContent, index) => (
            <Box
              key={index}
              className="resume-page"
              sx={{
                width: page.width,
                minHeight: page.height,
                mx: "auto",
                bgcolor: "#fff",
                boxShadow: index === currentPage ? 3 : 0,
                fontFamily: mergedDesignSettings.font,
                fontSize: mergedDesignSettings.fontSize,
                fontStyle: mergedDesignSettings.fontStyle,
                lineHeight: `${mergedDesignSettings.lineSpacing}px`,
                display: "flex",
                flexDirection: "column",
                pageBreakAfter: "always",
                "@media print": {
                  width: page.width,
                  height: "auto",
                  minHeight: page.height,
                  boxShadow: "none",
                  m: 0,
                  fontFamily: mergedDesignSettings.font,
                  fontSize: mergedDesignSettings.fontSize,
                  fontStyle: mergedDesignSettings.fontStyle,
                },
                // Show all pages when exporting, only current page when viewing
                display: exporting ? 'flex' : (index === currentPage ? 'flex' : 'none'),
                '@media print': { display: 'flex' }
              }}
            >
              {/* Header Section - Only on first page */}
              {index === 0 && (
                <Box
                  sx={{
                    backgroundColor: mergedDesignSettings.color,
                    color: mergedDesignSettings.nameColor,
                    p: 4,
                    textAlign: 'center',
                    pl: 10,
                    position: 'relative',
                    fontFamily: mergedDesignSettings.font,
                    fontStyle: mergedDesignSettings.fontStyle,
                  }}
                >
                  <Typography
                    sx={{
                      fontWeight: 'bold',
                      fontSize: '3rem',
                      letterSpacing: 2,
                      lineHeight: 1.2,
                      fontFamily: mergedDesignSettings.font,
                      fontStyle: mergedDesignSettings.fontStyle,
                    }}
                  >
                    {data.firstName} {data.lastName}
                  </Typography>

                  <Typography
                    sx={{
                      mt: 1,
                      opacity: 0.9,
                      letterSpacing: 1,
                      fontSize: mergedDesignSettings.headingSize,
                      fontFamily: mergedDesignSettings.font,
                      fontStyle: mergedDesignSettings.fontStyle,
                    }}
                  >
                    {data.currentPosition}
                  </Typography>
                </Box>
              )}

              <Grid container sx={{ height: "100%", position: 'relative', minHeight: '800px', fontFamily: mergedDesignSettings.font }}>
                {/* Sidebar Column */}
                <Grid
                  item
                  xs={12}
                  md={4}
                  sx={{
                    bgcolor: mergedDesignSettings.color,
                    color: "white",
                    width: "29%",
                    display: "flex",
                    flexDirection: "column",
                    minHeight: page.height,
                    position: 'relative',
                    borderTopLeftRadius: index === 0 ? '50px' : 0,
                    borderTopRightRadius: index === 0 ? '50px' : 0,
                    borderBottomLeftRadius: index === 0 ? '8px' : 0,
                    ml: 1,
                    mt: index === 0 ? '-180px' : 0,
                    boxShadow: index === 0 ? '0 4px 12px rgba(0,0,0,0.15)' : 'none',
                    zIndex: 2,
                    fontFamily: mergedDesignSettings.font,
                    fontSize: mergedDesignSettings.fontSize,
                    fontStyle: mergedDesignSettings.fontStyle,
                    lineHeight: `${mergedDesignSettings.lineSpacing}px`,
                    "@media print": {
                      bgcolor: mergedDesignSettings.color,
                      color: "white",
                      WebkitPrintColorAdjust: "exact",
                      printColorAdjust: "exact",
                      minHeight: page.height,
                      top: 0,
                      mt: index === 0 ? '-100px' : 0,
                      fontFamily: mergedDesignSettings.font,
                      fontSize: mergedDesignSettings.fontSize,
                      fontStyle: mergedDesignSettings.fontStyle,
                    },
                  }}
                >
                  {/* Photo only on first page */}
                  {index === 0 && (
                    <Box sx={{ 
                      position: 'absolute',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: 140,
                      height: 140,
                      borderRadius: '50%',
                      border: '6px solid white',
                      backgroundColor: 'white',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      overflow: 'hidden',
                      zIndex: 10,
                    }}>
                      <Avatar 
                        src={photo || "https://via.placeholder.com/150"} 
                        sx={{ 
                          width: 128, 
                          height: 128, 
                          borderRadius: '50%'
                        }}
                      >
                        <Typography variant="h4" sx={{ fontWeight: 'bold', color: mergedDesignSettings.color, fontFamily: mergedDesignSettings.font }}>
                          {data.firstName?.[0]}{data.lastName?.[0]}
                        </Typography>
                      </Avatar>
                    </Box>
                  )}
                  
                  {/* Apply font styles to sidebar content */}
                  <div 
                    style={{ 
                      fontFamily: mergedDesignSettings.font, 
                      fontStyle: mergedDesignSettings.fontStyle, 
                      fontSize: mergedDesignSettings.fontSize,
                      lineHeight: `${mergedDesignSettings.lineSpacing}px`
                    }}
                  >
                    {renderSidebarContent(pageContent.sidebar)}
                  </div>
                </Grid>

                {/* Main Content Column */}
                <Grid
                  item
                  xs={12}
                  md={8}
                  sx={{
                    p: `${mergedDesignSettings.topBottomMargin}px ${mergedDesignSettings.sideMargins}px`,
                    width: "69%",
                    fontFamily: mergedDesignSettings.font,
                    fontSize: mergedDesignSettings.fontSize,
                    fontStyle: mergedDesignSettings.fontStyle,
                    lineHeight: `${mergedDesignSettings.lineSpacing}px`,
                    "@media print": { 
                      p: 2,
                      fontFamily: mergedDesignSettings.font,
                      fontSize: mergedDesignSettings.fontSize,
                      fontStyle: mergedDesignSettings.fontStyle,
                    },
                  }}
                >
                  {/* Apply font styles to main content */}
                  <div 
                    style={{ 
                      fontFamily: mergedDesignSettings.font, 
                      fontStyle: mergedDesignSettings.fontStyle, 
                      fontSize: mergedDesignSettings.fontSize,
                      lineHeight: `${mergedDesignSettings.lineSpacing}px`
                    }}
                    dangerouslySetInnerHTML={{ 
                      __html: addFontStylesToHTML(pageContent.main.map(s => s.outerHTML).join('')) 
                    }} 
                  />
                </Grid>
              </Grid>
            </Box>
          ))
        ) : (
          <Box
            className="resume-page"
            sx={{
              width: page.width,
              minHeight: page.height,
              mx: "auto",
              bgcolor: "#fff",
              boxShadow: 3,
              fontFamily: mergedDesignSettings.font,
              fontSize: mergedDesignSettings.fontSize,
              fontStyle: mergedDesignSettings.fontStyle,
              lineHeight: `${mergedDesignSettings.lineSpacing}px`,
              display: "flex",
              flexDirection: "column",
              "@media print": {
                width: page.width,
                height: "auto",
                minHeight: page.height,
                boxShadow: "none",
                m: 0,
                fontFamily: mergedDesignSettings.font,
                fontSize: mergedDesignSettings.fontSize,
                fontStyle: mergedDesignSettings.fontStyle,
              },
            }}
          >
            {/* Header Section */}
            <Box sx={{ 
              backgroundColor: mergedDesignSettings.color, 
              color: mergedDesignSettings.nameColor,
              p: 4,
              textAlign: 'center',
              pl: 10,
              position: 'relative',
              fontFamily: mergedDesignSettings.font,
              fontStyle: mergedDesignSettings.fontStyle,
            }}>
              <Typography sx={{ 
                fontWeight: 'bold', 
                fontSize: '3rem',
                letterSpacing: 2,
                lineHeight: 1.2,
                fontFamily: mergedDesignSettings.font,
                fontStyle: mergedDesignSettings.fontStyle,
              }}>
                {data.firstName}
              </Typography>
              <Typography sx={{ 
                fontWeight: 'bold', 
                fontSize: '3rem',
                letterSpacing: 2,
                lineHeight: 1.2,
                fontFamily: mergedDesignSettings.font,
                fontStyle: mergedDesignSettings.fontStyle,
              }}>
                {data.lastName}
              </Typography>
              <Typography sx={{ 
                mt: 1, 
                opacity: 0.9,
                letterSpacing: 1,
                fontSize: mergedDesignSettings.headingSize,
                fontFamily: mergedDesignSettings.font,
                fontStyle: mergedDesignSettings.fontStyle,
              }}>
                {data.currentPosition}
              </Typography>
            </Box>

            <Grid container sx={{ height: "100%", position: 'relative', minHeight: '800px', fontFamily: mergedDesignSettings.font }}>
              <Grid
                item
                xs={12}
                md={4}
                sx={{
                  bgcolor: mergedDesignSettings.color,
                  color: "white",
                  width: "29%",
                  p: 3,
                  display: "flex",
                  flexDirection: "column",
                  minHeight: page.height,
                  position: 'relative',
                  borderTopLeftRadius: '50px',
                  borderTopRightRadius: '50px',
                  borderBottomLeftRadius: '8px',
                  ml: 1,
                  mt: '-100px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  zIndex: 2,
                  fontFamily: mergedDesignSettings.font,
                  fontSize: mergedDesignSettings.fontSize,
                  fontStyle: mergedDesignSettings.fontStyle,
                  lineHeight: `${mergedDesignSettings.lineSpacing}px`,
                  "@media print": {
                    p: 2,
                    bgcolor: mergedDesignSettings.color,
                    color: "white",
                    WebkitPrintColorAdjust: "exact",
                    printColorAdjust: "exact",
                    minHeight: page.height,
                    top: 0,
                    mt: '-100px',
                    fontFamily: mergedDesignSettings.font,
                    fontSize: mergedDesignSettings.fontSize,
                    fontStyle: mergedDesignSettings.fontStyle,
                  },
                }}
              >
                {/* Photo container for first page */}
                <Box sx={{ 
                  position: 'absolute',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 140,
                  height: 140,
                  borderRadius: '50%',
                  border: '6px solid white',
                  backgroundColor: 'white',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  zIndex: 10,
                }}>
                  <Avatar 
                    src={photo || "https://via.placeholder.com/150"} 
                    sx={{ 
                      width: 128, 
                      height: 128, 
                      borderRadius: '50%'
                    }}
                  >
                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: mergedDesignSettings.color, fontFamily: mergedDesignSettings.font }}>
                      {data.firstName?.[0]}{data.lastName?.[0]}
                    </Typography>
                  </Avatar>
                </Box>

                <div style={{ fontFamily: mergedDesignSettings.font, fontStyle: mergedDesignSettings.fontStyle, fontSize: mergedDesignSettings.fontSize, lineHeight: `${mergedDesignSettings.lineSpacing}px` }}>
                  {renderSidebarContent()}
                </div>
              </Grid>
              {/* Main Content Column */}
              <Grid
                item
                xs={12}
                md={8}
                sx={{
                  p: `${mergedDesignSettings.topBottomMargin}px ${mergedDesignSettings.sideMargins}px`,
                  width: "69%",
                  fontFamily: mergedDesignSettings.font,
                  fontSize: mergedDesignSettings.fontSize,
                  fontStyle: mergedDesignSettings.fontStyle,
                  lineHeight: `${mergedDesignSettings.lineSpacing}px`,
                  "@media print": { 
                    p: 2,
                    fontFamily: mergedDesignSettings.font,
                    fontSize: mergedDesignSettings.fontSize,
                    fontStyle: mergedDesignSettings.fontStyle,
                  },
                }}
              >
                <Typography sx={{ fontFamily: mergedDesignSettings.font, fontStyle: mergedDesignSettings.fontStyle }}>Loading resume...</Typography>
              </Grid>
            </Grid>
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
            Drag and drop sections to reorder them within each side or move sections between left and right sides.
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

export default Resume22;