import React, { useEffect, useState, useRef, useCallback } from 'react';
import { 
  Grid, 
  Box, 
  Typography, 
  Divider, 
  LinearProgress, 
  IconButton, 
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper
} from '@mui/material';
import { styled } from '@mui/system';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import PublicIcon from '@mui/icons-material/Public';
import SchoolIcon from '@mui/icons-material/School';

import {
  ChevronLeft,
  ChevronRight,
  DragIndicator,
  Reorder
} from "@mui/icons-material";

// --- Styled Components for Consistent Theming ---

const HeaderBackground = styled(Box)(({ color }) => ({
  backgroundColor: color || '#f0f0f0',
  color: '#333',
  padding: '30px 40px',
  textAlign: 'center',
  marginBottom: '30px',
}));

const NameTitle = styled(Typography)(({ color, font, fontSize }) => ({
  fontFamily: font || 'Montserrat, sans-serif',
  fontWeight: 800,
  fontSize: fontSize || '2.5rem',
  lineHeight: 1,
  textTransform: 'uppercase',
  color: color || '#333',
}));

const RoleTitle = styled(Typography)(({ color, font, fontSize }) => ({
  fontFamily: font || 'Roboto, sans-serif',
  fontWeight: 400,
  fontSize: fontSize || '1rem',
  textTransform: 'uppercase',
  letterSpacing: '2px',
  marginTop: '5px',
  color: color || '#555',
}));

const SidebarSectionHeader = styled(Typography)(({ color, font, fontSize }) => ({
  fontFamily: font || 'Montserrat, sans-serif',
  fontWeight: 700,
  fontSize: fontSize || '1.1rem',
  color: color || '#333',
  textTransform: 'uppercase',
  marginBottom: '15px',
  paddingBottom: '5px',
  borderBottom: `1px solid ${color ? 'rgba(0,0,0,0.1)' : '#ddd'}`,
}));

const MainContentSectionHeader = styled(Typography)(({ color, font, fontSize }) => ({
  fontFamily: font || 'Montserrat, sans-serif',
  fontWeight: 700,
  fontSize: fontSize || '1.1rem',
  color: color || '#333',
  textTransform: 'uppercase',
  marginBottom: '15px',
  paddingBottom: '5px',
  borderBottom: `1px solid ${color ? 'rgba(0,0,0,0.1)' : '#ddd'}`,
}));

const InfoItem = styled(Box)(({ color, font, fontSize, fontStyle, lineSpacing }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: '8px',
  fontFamily: font || 'Arial, sans-serif',
  fontSize: fontSize || '14px',
  fontStyle: fontStyle || 'normal',
  lineHeight: lineSpacing ? `${lineSpacing}px` : 'normal',
  '& .MuiSvgIcon-root': {
    fontSize: '1.1rem',
    marginRight: '10px',
    color: color || '#777',
  },
  '& .MuiTypography-root': {
    color: '#555',
    fontFamily: font || 'Roboto, sans-serif',
    fontSize: fontSize || '0.9rem',
    fontStyle: fontStyle || 'normal',
    lineHeight: lineSpacing ? `${lineSpacing}px` : 'normal',
  }
}));

const SkillBarWrapper = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  marginBottom: '15px',
});

const SkillLabel = styled(Typography)(({ color, font, fontSize, fontStyle, lineSpacing }) => ({
  fontFamily: font || 'Roboto, sans-serif',
  fontWeight: 600,
  color: color || '#333',
  textTransform: 'uppercase',
  marginBottom: '5px',
  fontSize: fontSize || '0.9rem',
  fontStyle: fontStyle || 'normal',
  lineHeight: lineSpacing ? `${lineSpacing}px` : 'normal',
}));

const SkillBar = styled(LinearProgress)(({ color }) => ({
  height: 8,
  borderRadius: 4,
  backgroundColor: '#e0e0e0',
  '& .MuiLinearProgress-bar': {
    backgroundColor: color || '#777',
  },
}));

const TimelineItem = styled(Box)({
  display: 'flex',
  position: 'relative',
  marginBottom: '20px',
  '&::before': {
    content: '""',
    position: 'absolute',
    left: '8px',
    top: '0',
    bottom: '0',
    width: '2px',
    backgroundColor: '#ddd',
  },
});

const TimelineIcon = styled(Box)(({ color }) => ({
  backgroundColor: color || '#777',
  borderRadius: '50%',
  width: '18px',
  height: '18px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1,
  color: '#fff',
  marginLeft: '0px',
  marginRight: '20px',
  '& .MuiSvgIcon-root': {
    fontSize: '0.9rem',
  },
}));

// Page size mapping
const pageSizeMap = {
  A4: { width: "210mm", height: "297mm" },
  Letter: { width: "216mm", height: "279mm" },
  Legal: { width: "216mm", height: "356mm" },
  A3: { width: "297mm", height: "420mm" },
  Executive: { width: "184mm", height: "267mm" },
};

// Default data
const defaultData = {
  firstName: "John",
  lastName: "Smith",
  currentPosition: "Copywriter",
  phone: "123-456-7890",
  email: "your@email.com",
  city: "1234 Main Street, Your City 20200",
  website: "www.yourcompany.com",
  profile: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum do",
};

// Separate section orders for left and right sides
const defaultLeftSectionOrder = [
  'profile',
  'education',
  'skills'
];

const defaultRightSectionOrder = [
  'aboutMe',
  'experience',
  'languages',
  'accomplishments',
  'certifications',
  'softwareSkills',
  'volunteering',
  'interests',
  'websites',
  'references',
  'additionalInfo'
];

// --- Resume Component ---

const Resume21 = ({
  color = '#f0f0f0',
  nameColor = '#333',
  sidebarBackground = '#fff',
  headerBackground = '#f0f0f0',
  accentColor = '#777',
  font = 'Arial, sans-serif',
  fontSize = '14px',
  fontStyle = 'normal',
  headingSize = '24px',
  sectionSpacing = 30,
  paragraphSpacing = 10,
  lineSpacing = 20,
  topBottomMargin = 30,
  sideMargins = 20,
  paragraphIndent = 0,
  lineWeight = 1,
  pageSize = 'A4',
  theme,
  formData = {},
  workExperiences = [],
  exporting = false,
  enableDragDrop = true,
}) => {
  // Use theme color if provided, otherwise use the color prop
  const primaryColor = theme?.primary || color;
  
  // Merge default data with form data
  const data = { ...defaultData, ...formData };
  
  // State for data from localStorage
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

  const page = pageSizeMap[pageSize] || pageSizeMap.A4;

  // Define a color palette for the template with customizable colors
  const palette = {
    mainBackground: '#FFFFFF',
    sidebarBackground: sidebarBackground,
    accentColor: primaryColor,
    textColor: '#333333',
    lightText: '#666666',
    header: headerBackground,
    nameColor: nameColor,
    sidebarText: '#555',
  };

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

  // Calculate font sizes based on the fontSize prop
  const getFontSize = (multiplier = 1) => {
    const baseSize = parseInt(fontSize) || 14;
    return `${baseSize * multiplier}px`;
  };

  // Format date helper function
  const formatDate = (month, year) => {
    if (!month || !year) return "";
    return `${month} ${year}`;
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
  const savedLeftSectionOrder = localStorage.getItem("resume21LeftSectionOrder");
  if (savedLeftSectionOrder) {
    // 🔥 FIX: Left side-ல custom sections auto add ஆகாது - filter only
    const parsedOrder = JSON.parse(savedLeftSectionOrder);
    const filteredOrder = parsedOrder.filter(section => !section.startsWith('custom_'));
    setLeftSectionOrder(filteredOrder);
    console.log('🔄 Loaded left section order WITHOUT custom sections:', filteredOrder);
  } else {
    setLeftSectionOrder(defaultLeftSectionOrder);
  }

  const savedRightSectionOrder = localStorage.getItem("resume21RightSectionOrder");
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
      localStorage.setItem("resume21RightSectionOrder", JSON.stringify(newRightOrder));
      console.log('📝 Final right section order with ONLY CURRENT custom sections:', newRightOrder);
    }
    
    // 🔥 FIX: Left side-லிருந்து custom sections-ஐ remove செய்யவும்
    const currentLeftOrder = [...leftSectionOrder];
    const filteredLeftOrder = currentLeftOrder.filter(section => !section.startsWith('custom_'));
    if (JSON.stringify(filteredLeftOrder) !== JSON.stringify(currentLeftOrder)) {
      setLeftSectionOrder(filteredLeftOrder);
      localStorage.setItem("resume21LeftSectionOrder", JSON.stringify(filteredLeftOrder));
      console.log('🗑️ Removed custom sections from left side:', filteredLeftOrder);
    }
    
  } else if (userId && Object.keys(customSections).length === 0) {
    // If no current custom sections, remove all custom sections from both sides
    const currentRightOrder = [...rightSectionOrder];
    const filteredRightOrder = currentRightOrder.filter(section => !section.startsWith('custom_'));
    
    if (filteredRightOrder.length !== currentRightOrder.length) {
      setRightSectionOrder(filteredRightOrder);
      localStorage.setItem("resume21RightSectionOrder", JSON.stringify(filteredRightOrder));
      console.log('🗑️ Removed all custom sections from right side (no current sections)');
    }
    
    const currentLeftOrder = [...leftSectionOrder];
    const filteredLeftOrder = currentLeftOrder.filter(section => !section.startsWith('custom_'));
    if (filteredLeftOrder.length !== currentLeftOrder.length) {
      setLeftSectionOrder(filteredLeftOrder);
      localStorage.setItem("resume21LeftSectionOrder", JSON.stringify(filteredLeftOrder));
      console.log('🗑️ Removed all custom sections from left side (no current sections)');
    }
  }
}, [customSections]);

  // Save section orders to localStorage whenever they change
  useEffect(() => {
    if (leftSectionOrder.length > 0) {
      localStorage.setItem("resume21LeftSectionOrder", JSON.stringify(leftSectionOrder));
    }
  }, [leftSectionOrder]);

  useEffect(() => {
    if (rightSectionOrder.length > 0) {
      localStorage.setItem("resume21RightSectionOrder", JSON.stringify(rightSectionOrder));
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
      'profile': 'Profile',
      'education': 'Education',
      'skills': 'Skills',
      'aboutMe': 'About Me',
      'experience': 'Professional Experience',
      'languages': 'Languages',
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
    if (!htmlContent) return '';
    
    return htmlContent
      .replace(/<div/g, `<div style="font-family: ${font}; font-style: ${fontStyle}; font-size: ${fontSize}; line-height: ${lineSpacing}px;"`)
      .replace(/<p/g, `<p style="font-family: ${font}; font-style: ${fontStyle}; font-size: ${fontSize}; line-height: ${lineSpacing}px;"`)
      .replace(/<span/g, `<span style="font-family: ${font}; font-style: ${fontStyle};"`)
      .replace(/<h1/g, `<h1 style="font-family: ${font}; font-style: ${fontStyle}; font-size: ${headingSize};"`)
      .replace(/<h2/g, `<h2 style="font-family: ${font}; font-style: ${fontStyle}; font-size: ${headingSize};"`)
      .replace(/<h3/g, `<h3 style="font-family: ${font}; font-style: ${fontStyle}; font-size: ${headingSize};"`)
      .replace(/<h4/g, `<h4 style="font-family: ${font}; font-style: ${fontStyle}; font-size: ${headingSize};"`)
      .replace(/<h5/g, `<h5 style="font-family: ${font}; font-style: ${fontStyle}; font-size: ${headingSize};"`)
      .replace(/<h6/g, `<h6 style="font-family: ${font}; font-style: ${fontStyle}; font-size: ${headingSize};"`)
      .replace(/<li/g, `<li style="font-family: ${font}; font-style: ${fontStyle}; font-size: ${fontSize}; line-height: ${lineSpacing}px;"`)
      .replace(/<ul/g, `<ul style="font-family: ${font}; font-style: ${fontStyle};"`)
      .replace(/<ol/g, `<ol style="font-family: ${font}; font-style: ${fontStyle};"`)
      .replace(/<td/g, `<td style="font-family: ${font}; font-style: ${fontStyle};"`)
      .replace(/<th/g, `<th style="font-family: ${font}; font-style: ${fontStyle};"`)
      .replace(/<tr/g, `<tr style="font-family: ${font}; font-style: ${fontStyle};"`)
      .replace(/<table/g, `<table style="font-family: ${font}; font-style: ${fontStyle};"`);
  };

  // Render functions for different sections
  const renderProfileSection = (inSidebar = false) => (
    <Box sx={{ mb: sectionSpacing / 10 }} className="resume-section">
      <SidebarSectionHeader 
        color={palette.nameColor} 
        font={font}
        fontSize={getFontSize(1.2)}
      >
        PROFILE
      </SidebarSectionHeader>
      <Box sx={{ mt: 2 }}>
        <InfoItem 
          color={palette.accentColor} 
          font={font}
          fontSize={fontSize}
          fontStyle={fontStyle}
          lineSpacing={lineSpacing}
        >
          <LocationOnIcon />
          <Typography sx={getTextStyle()}>
            {data.city}
          </Typography>
        </InfoItem>
        <InfoItem 
          color={palette.accentColor} 
          font={font}
          fontSize={fontSize}
          fontStyle={fontStyle}
          lineSpacing={lineSpacing}
        >
          <PhoneIcon />
          <Typography sx={getTextStyle()}>
            {data.phone}
          </Typography>
        </InfoItem>
        <InfoItem 
          color={palette.accentColor} 
          font={font}
          fontSize={fontSize}
          fontStyle={fontStyle}
          lineSpacing={lineSpacing}
        >
          <EmailIcon />
          <Typography sx={getTextStyle()}>
            {data.email}
          </Typography>
        </InfoItem>
        <InfoItem 
          color={palette.accentColor} 
          font={font}
          fontSize={fontSize}
          fontStyle={fontStyle}
          lineSpacing={lineSpacing}
        >
          <PublicIcon />
          <Typography sx={getTextStyle()}>
            {data.website}
          </Typography>
        </InfoItem>
      </Box>
    </Box>
  );

  const renderEducationSection = (inSidebar = false) => (
    <Box sx={{ mb: sectionSpacing / 10 }} className="resume-section">
      <SidebarSectionHeader 
        color={palette.nameColor} 
        font={font}
        fontSize={getFontSize(1.2)}
          headingSize={headingSize}
      >
        EDUCATION
      </SidebarSectionHeader>
      <Box sx={{ mt: 2 }}>
        {educationEntries.length > 0 ? (
          educationEntries.map((edu, index) => (
            <TimelineItem key={index}>
              <TimelineIcon color={palette.accentColor}><SchoolIcon /></TimelineIcon>
              <Box>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: palette.lightText, 
                    display: 'block',
                    ...globalFontStyle
                  }}
                >
                  {formatDate(edu.gradMonth, edu.gradYear)}
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontWeight: 600, 
                    color: palette.textColor,
                    fontFamily: font,
                    fontSize: getFontSize(1.1),
                    fontStyle: fontStyle,
                    lineHeight: `${lineSpacing}px`,
                  }}
                >
                  {edu.degree} - {edu.fieldOfStudy}
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: palette.textColor,
                    ...globalFontStyle
                  }}
                >
                  {edu.schoolName}, {edu.schoolLocation}
                </Typography>
                {edu.additionalCoursework && (
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: palette.textColor,
                      ...globalFontStyle,
                      textIndent: `${paragraphIndent}px`,
                    }}
                  >
                    {edu.additionalCoursework}
                  </Typography>
                )}
              </Box>
            </TimelineItem>
          ))
        ) : (
          // Default education entries
          <>
            <TimelineItem>
              <TimelineIcon color={palette.accentColor}><SchoolIcon /></TimelineIcon>
              <Box>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: palette.lightText, 
                    display: 'block',
                    ...globalFontStyle
                  }}
                >
                  2014
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontWeight: 600, 
                    color: palette.textColor,
                    fontFamily: font,
                    fontSize: getFontSize(1.1),
                    fontStyle: fontStyle,
                    lineHeight: `${lineSpacing}px`,
                  }}
                >
                  ENTER YOUR DEGREE
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: palette.textColor,
                    ...globalFontStyle
                  }}
                >
                  YOUR SCHOOL
                </Typography>
              </Box>
            </TimelineItem>
            <TimelineItem>
              <TimelineIcon color={palette.accentColor}><SchoolIcon /></TimelineIcon>
              <Box>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: palette.lightText, 
                    display: 'block',
                    ...globalFontStyle
                  }}
                >
                  2016
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontWeight: 600, 
                    color: palette.textColor,
                    fontFamily: font,
                    fontSize: getFontSize(1.1),
                    fontStyle: fontStyle,
                    lineHeight: `${lineSpacing}px`,
                  }}
                >
                  ENTER YOUR DEGREE
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: palette.textColor,
                    ...globalFontStyle
                  }}
                >
                  YOUR SCHOOL
                </Typography>
              </Box>
            </TimelineItem>
          </>
        )}
      </Box>
    </Box>
  );

  const renderSkillsSection = (inSidebar = false) => (
    <Box className="resume-section">
      <SidebarSectionHeader 
        color={palette.nameColor} 
        font={font}
        fontSize={getFontSize(1.2)}
      >
        SKILLS
      </SidebarSectionHeader>
      <Box sx={{ mt: 2 }}>
        {savedSkills.length > 0 ? (
          savedSkills.map((skill, index) => (
            <SkillBarWrapper key={index}>
              <SkillLabel 
                color={palette.accentColor} 
                font={font}
                fontSize={fontSize}
                fontStyle={fontStyle}
                lineSpacing={lineSpacing}
              >
                {skill.name} ({skill.rating || 0}%)
              </SkillLabel>
              <SkillBar color={palette.nameColor} variant="determinate" value={skill.rating || 0} />
            </SkillBarWrapper>
          ))
        ) : (
          // Default skills
          <>
            <SkillBarWrapper>
              <SkillLabel 
                color={palette.accentColor} 
                font={font}
                fontSize={fontSize}
                fontStyle={fontStyle}
                lineSpacing={lineSpacing}
              >
                YOUR SKILL 1
              </SkillLabel>
              <SkillBar color={palette.nameColor} variant="determinate" value={90} />
            </SkillBarWrapper>
            <SkillBarWrapper>
              <SkillLabel 
                color={palette.accentColor} 
                font={font}
                fontSize={fontSize}
                fontStyle={fontStyle}
                lineSpacing={lineSpacing}
              >
                YOUR SKILL 2
              </SkillLabel>
              <SkillBar color={palette.nameColor} variant="determinate" value={80} />
            </SkillBarWrapper>
            <SkillBarWrapper>
              <SkillLabel 
                color={palette.accentColor} 
                font={font}
                fontSize={fontSize}
                fontStyle={fontStyle}
                lineSpacing={lineSpacing}
              >
                YOUR SKILL 3
              </SkillLabel>
              <SkillBar color={palette.nameColor} variant="determinate" value={95} />
            </SkillBarWrapper>
            <SkillBarWrapper>
              <SkillLabel 
                color={palette.accentColor} 
                font={font}
                fontSize={fontSize}
                fontStyle={fontStyle}
                lineSpacing={lineSpacing}
              >
                YOUR SKILL 4
              </SkillLabel>
              <SkillBar color={palette.nameColor} variant="determinate" value={75} />
            </SkillBarWrapper>
          </>
        )}
      </Box>
    </Box>
  );

  const renderAboutMeSection = (inSidebar = false) => (
    <Box sx={{ mb: sectionSpacing / 10 }} className="resume-section">
      <MainContentSectionHeader 
        color={palette.nameColor} 
        font={font}
        fontSize={getFontSize(1.2)}
      >
        ABOUT ME
      </MainContentSectionHeader>
      <Typography 
        variant="body2" 
        sx={{ 
          color: palette.textColor, 
          lineHeight: 1.6, 
          ...globalFontStyle,
          textIndent: `${paragraphIndent}px`,
        }}
      >
        {savedSummary || data.profile}
      </Typography>
    </Box>
  );

  const renderExperienceSection = (inSidebar = false) => (
    <Box sx={{ mb: sectionSpacing / 10 }} className="resume-section">
      <MainContentSectionHeader 
        color={palette.nameColor} 
        font={font}
        fontSize={getFontSize(1.2)}
      >
        PROFESSIONAL EXPERIENCE
      </MainContentSectionHeader>
      
      {workExperiences && workExperiences.length > 0 ? (
        workExperiences.map((work, index) => (
          <Box key={index} sx={{ mb: 3 }}>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 600, 
                color: palette.textColor, 
                fontFamily: font,
                fontSize: getFontSize(1.1),
                fontStyle: fontStyle,
                lineHeight: `${lineSpacing}px`,
              }}
            >
              {work.jobTitle}
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                fontStyle: 'italic', 
                color: palette.lightText, 
                ...globalFontStyle
              }}
            >
              {work.employer} ({formatDate(work.startMonth, work.startYear)} -{" "}
              {work.current ? "Present" : formatDate(work.endMonth, work.endYear)})
            </Typography>
            {work.description && (
              <Box
                sx={{ 
                  mt: 1, 
                  ...globalFontStyle,
                  textIndent: `${paragraphIndent}px`,
                  "& strong": { 
                    fontWeight: "bold",
                    fontFamily: font,
                    fontStyle: fontStyle,
                    fontSize: fontSize,
                    lineHeight: `${lineSpacing}px`,
                  }, 
                  "& em": { 
                    fontStyle: "italic",
                    fontFamily: font,
                    fontSize: fontSize,
                    lineHeight: `${lineSpacing}px`,
                  }, 
                  "& u": { 
                    textDecoration: "underline",
                    fontFamily: font,
                    fontStyle: fontStyle,
                    fontSize: fontSize,
                    lineHeight: `${lineSpacing}px`,
                  } 
                }}
                dangerouslySetInnerHTML={{
                  __html: work.description
                    .replace(/\*\*(.*?)\*\*/g, `<strong style="font-family: ${font}; font-weight: bold; font-style: ${fontStyle}; font-size: ${fontSize}; line-height: ${lineSpacing}px">$1</strong>`)
                    .replace(/\*(.*?)\*/g, `<em style="font-family: ${font}; font-style: italic; font-size: ${fontSize}; line-height: ${lineSpacing}px">$1</em>`)
                    .replace(/<u>(.*?)<\/u>/g, `<u style="font-family: ${font}; font-size: ${fontSize}; font-style: ${fontStyle}; line-height: ${lineSpacing}px">$1</u>`)
                    .replace(/\n/g, `<br style="font-family: ${font}; font-size: ${fontSize}; line-height: ${lineSpacing}px" />`),
                }}
              />
            )}
          </Box>
        ))
      ) : (
        <Typography 
          variant="body2" 
          sx={{ 
            color: palette.textColor, 
            lineHeight: 1.6, 
            ...globalFontStyle,
            textIndent: `${paragraphIndent}px`,
          }}
        >
          No work experiences added yet.
        </Typography>
      )}
    </Box>
  );

  // Render left sidebar sections based on order
  const renderLeftSectionContent = (sectionId) => {
    switch (sectionId) {
      case 'profile':
        return renderProfileSection(true);
      case 'education':
        return renderEducationSection(true);
      case 'skills':
        return renderSkillsSection(true);
      default:
        // Handle sections that were moved from right side
        return renderRightSectionContent(sectionId, true);
    }
  };

  // Render right main content sections based on order
  const renderRightSectionContent = (sectionId, inSidebar = false) => {
    const textColor = inSidebar ? palette.sidebarText : palette.textColor;
    const SectionHeader = inSidebar ? SidebarSectionHeader : MainContentSectionHeader;
    
    switch (sectionId) {
      case 'profile':
        return renderProfileSection(inSidebar);
      
      case 'education':
        return renderEducationSection(inSidebar);
      
      case 'skills':
        return renderSkillsSection(inSidebar);
      
      case 'aboutMe':
        return (
          <div className="resume-section">
            <SectionHeader 
              color={palette.nameColor} 
              font={font}
              fontSize={getFontSize(1.2)}
              
            >
              ABOUT ME
            </SectionHeader>
            <Typography 
              variant="body2" 
              sx={{ 
                color: textColor, 
                lineHeight: 1.6, 
                ...globalFontStyle,
                textIndent: `${paragraphIndent}px`,
              }}
            >
              {savedSummary || data.profile}
            </Typography>
          </div>
        );
      
      case 'experience':
        return (
          <div className="resume-section">
            <SectionHeader 
              color={palette.nameColor} 
              font={font}
              fontSize={getFontSize(1.2)}
            >
              PROFESSIONAL EXPERIENCE
            </SectionHeader>
            
            {workExperiences && workExperiences.length > 0 ? (
              workExperiences.map((work, index) => (
                <Box key={index} sx={{ mb: 3 }}>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontWeight: 600, 
                      color: textColor, 
                      fontFamily: font,
                      fontSize: getFontSize(1.1),
                      fontStyle: fontStyle,
                      lineHeight: `${lineSpacing}px`,
                    }}
                  >
                    {work.jobTitle}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      fontStyle: 'italic', 
                      color: inSidebar ? 'rgba(255,255,255,0.8)' : palette.lightText, 
                      ...globalFontStyle
                    }}
                  >
                    {work.employer} ({formatDate(work.startMonth, work.startYear)} -{" "}
                    {work.current ? "Present" : formatDate(work.endMonth, work.endYear)})
                  </Typography>
                  {work.description && (
                    <Box
                      sx={{ 
                        mt: 1, 
                        ...globalFontStyle,
                        color: textColor,
                        textIndent: `${paragraphIndent}px`,
                        "& strong": { 
                          fontWeight: "bold",
                          fontFamily: font,
                          fontStyle: fontStyle,
                          fontSize: fontSize,
                          lineHeight: `${lineSpacing}px`,
                        }, 
                        "& em": { 
                          fontStyle: "italic",
                          fontFamily: font,
                          fontSize: fontSize,
                          lineHeight: `${lineSpacing}px`,
                        }, 
                        "& u": { 
                          textDecoration: "underline",
                          fontFamily: font,
                          fontStyle: fontStyle,
                          fontSize: fontSize,
                          lineHeight: `${lineSpacing}px`,
                        } 
                      }}
                      dangerouslySetInnerHTML={{
                        __html: work.description
                          .replace(/\*\*(.*?)\*\*/g, `<strong style="font-family: ${font}; font-weight: bold; font-style: ${fontStyle}; font-size: ${fontSize}; line-height: ${lineSpacing}px">$1</strong>`)
                          .replace(/\*(.*?)\*/g, `<em style="font-family: ${font}; font-style: italic; font-size: ${fontSize}; line-height: ${lineSpacing}px">$1</em>`)
                          .replace(/<u>(.*?)<\/u>/g, `<u style="font-family: ${font}; font-size: ${fontSize}; font-style: ${fontStyle}; line-height: ${lineSpacing}px">$1</u>`)
                          .replace(/\n/g, `<br style="font-family: ${font}; font-size: ${fontSize}; line-height: ${lineSpacing}px" />`),
                      }}
                    />
                  )}
                </Box>
              ))
            ) : (
              <Typography 
                variant="body2" 
                sx={{ 
                  color: textColor, 
                  lineHeight: 1.6, 
                  ...globalFontStyle,
                  textIndent: `${paragraphIndent}px`,
                }}
              >
                No work experiences added yet.
              </Typography>
            )}
          </div>
        );
      
      case 'languages':
        return savedLanguages.length > 0 ? (
          <div className="resume-section">
            <SectionHeader 
              color={palette.nameColor} 
              font={font}
              fontSize={getFontSize(1.2)}
                headingSize={headingSize}
            >
              LANGUAGES
            </SectionHeader>
            {savedLanguages.map((lang, index) => (
              <Typography key={index} sx={{ 
                mb: `${paragraphSpacing / 10}px`, 
                ...globalFontStyle,
                color: textColor 
              }}>
                {lang.name} {lang.level ? `– ${lang.level}` : ""}
              </Typography>
            ))}
          </div>
        ) : null;
      
      case 'accomplishments':
        return savedAccomplishments.length > 0 ? (
          <div className="resume-section">
            <SectionHeader 
              color={palette.nameColor} 
              font={font}
              fontSize={getFontSize(1.2)}
            >
              ACCOMPLISHMENTS
            </SectionHeader>
            {savedAccomplishments.map((acc, index) => (
              <Typography key={index} sx={{ 
                mb: `${paragraphSpacing / 10}px`, 
                ...globalFontStyle,
                color: textColor 
              }} whiteSpace="pre-line">
                {acc}
              </Typography>
            ))}
          </div>
        ) : null;
      
      case 'certifications':
        return savedCertifications.length > 0 ? (
          <div className="resume-section">
            <SectionHeader 
              color={palette.nameColor} 
              font={font}
              fontSize={getFontSize(1.2)}
            >
              CERTIFICATIONS
            </SectionHeader>
            {savedCertifications.map((cert, index) => (
              <Typography key={index} sx={{ 
                mb: `${paragraphSpacing / 10}px`, 
                ...globalFontStyle,
                color: textColor 
              }}>
                {cert.name} – {cert.provider} ({cert.year})
              </Typography>
            ))}
          </div>
        ) : null;
      
      case 'softwareSkills':
        return softwareSkills.length > 0 ? (
          <div className="resume-section">
            <SectionHeader 
              color={palette.nameColor} 
              font={font}
              fontSize={getFontSize(1.2)}
            >
              SOFTWARE SKILLS
            </SectionHeader>
            {softwareSkills.map((skill, index) => (
              <Typography key={index} sx={{ 
                mb: `${paragraphSpacing / 10}px`, 
                ...globalFontStyle,
                color: textColor 
              }}>
                {skill.name} — {skill.level}%
              </Typography>
            ))}
          </div>
        ) : null;
      
      case 'volunteering':
        return savedVolunteering.length > 0 ? (
          <div className="resume-section">
            <SectionHeader 
              color={palette.nameColor} 
              font={font}
              fontSize={getFontSize(1.2)}
            >
              VOLUNTEERING
            </SectionHeader>
            {savedVolunteering.map((vol, index) => (
              <Box key={index} sx={{ mb: 1 }}>
                <Typography sx={{ 
                  fontSize: fontSize, 
                  fontWeight: "bold", 
                  ...globalFontStyle,
                  color: textColor 
                }}>{vol.subtopic}</Typography>
                <Typography sx={{ 
                  fontSize: fontSize, 
                  color: inSidebar ? "rgba(255,255,255,0.8)" : "gray", 
                  ...globalFontStyle 
                }}>{vol.fromDate} - {vol.toDate}</Typography>
                <Typography sx={{ 
                  fontSize: fontSize, 
                  whiteSpace: "pre-line", 
                  mt: 0.5, 
                  ...globalFontStyle,
                  color: textColor 
                }}>{vol.content}</Typography>
              </Box>
            ))}
          </div>
        ) : null;
      
      case 'interests':
        return savedInterests.length > 0 ? (
          <div className="resume-section">
            <SectionHeader 
              color={palette.nameColor} 
              font={font}
              fontSize={getFontSize(1.2)}
            >
              INTERESTS
            </SectionHeader>
            {savedInterests.map((interest, index) => (
              <Typography key={index} sx={{ 
                mb: `${paragraphSpacing / 10}px`, 
                ...globalFontStyle,
                color: textColor 
              }}>• {interest}</Typography>
            ))}
          </div>
        ) : null;
      
      case 'websites':
        return savedWebsites.length > 0 ? (
          <div className="resume-section">
            <SectionHeader 
              color={palette.nameColor} 
              font={font}
              fontSize={getFontSize(1.2)}
            >
              WEBSITES / PROFILES
            </SectionHeader>
            {savedWebsites.map((site, index) => (
              <Typography key={index} sx={{ 
                mb: `${paragraphSpacing / 10}px`, 
                ...globalFontStyle,
                color: textColor 
              }}>
                {site.url} {site.addToHeader ? "(Shown in Header)" : ""}
              </Typography>
            ))}
          </div>
        ) : null;
      
      case 'references':
        return savedReferences.length > 0 ? (
          <div className="resume-section">
            <SectionHeader 
              color={palette.nameColor} 
              font={font}
              fontSize={getFontSize(1.2)}
            >
              REFERENCES
            </SectionHeader>
            {savedReferences.map((ref, index) => (
              <Typography key={index} sx={{ 
                mb: `${paragraphSpacing / 10}px`, 
                ...globalFontStyle,
                color: textColor 
              }} whiteSpace="pre-line">
                {ref}
              </Typography>
            ))}
          </div>
        ) : null;
      
      case 'additionalInfo':
        return savedAdditionalInfo.length > 0 ? (
          <div className="resume-section">
            <SectionHeader 
              color={palette.nameColor} 
              font={font}
              fontSize={getFontSize(1.2)}
            >
              ADDITIONAL INFORMATION
            </SectionHeader>
            {savedAdditionalInfo.map((info, index) => (
              <Typography key={index} sx={{ 
                mb: `${paragraphSpacing / 10}px`, 
                ...globalFontStyle,
                color: textColor 
              }}> {info}</Typography>
            ))}
          </div>
        ) : null;
      
      default:
        // Handle custom sections
        if (sectionId.startsWith('custom_')) {
          const customSectionName = sectionId.replace('custom_', '');
          const items = customSections[customSectionName] || [];
          return items.length > 0 ? (
            <div className="resume-section">
              <SectionHeader 
                color={palette.nameColor} 
                font={font}
                fontSize={getFontSize(1.2)}
              >
                {customSectionName.toUpperCase()}
              </SectionHeader>
              {items.map((item, i) => (
                <Typography key={i} sx={{ 
                  mb: `${paragraphSpacing / 10}px`, 
                  ...globalFontStyle,
                  color: textColor 
                }} whiteSpace="pre-line">
                  {item}
                </Typography>
              ))}
            </div>
          ) : null;
        }
        return null;
    }
  };

  // Pagination logic - Only paginate main content
  const paginateContent = useCallback(() => {
    if (!mainContentRef.current) return;

    const mainSections = Array.from(mainContentRef.current.querySelectorAll('.resume-section'));
    
    const pageHeightInPx = parseFloat(page.height.replace('mm', '')) * 3.78;
    // Calculate available height for main content (subtracting header, footer, and margins)
    const headerFooterHeight = 200; // Approximate height of header and footer
    const mainAvailableHeight = pageHeightInPx - headerFooterHeight - (2 * topBottomMargin);

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
      if (currentMainHeight + sectionHeight > mainAvailableHeight && currentMainPageSections.length > 0) {
        // Start a new page with only main content
        newPages.push({
          main: currentMainPageSections,
          isFirstPage: newPages.length === 0
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
        isFirstPage: newPages.length === 0
      });
    }
    
    setPages(newPages);
  }, [page.height, topBottomMargin, sectionSpacing, font, fontSize, fontStyle, lineSpacing, paragraphIndent]);

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
    leftSectionOrder,
    rightSectionOrder,
    font,
    fontSize,
    fontStyle,
    lineSpacing,
    paragraphIndent,
    sectionSpacing,
  ]);

  // Render content for measurement (hidden)
  const renderMainContentToMeasure = () => (
    <Box ref={mainContentRef} sx={{ visibility: 'hidden', position: 'absolute', top: '-9999px', fontFamily: font }}>
      <Box sx={{ p: `${topBottomMargin}px ${sideMargins}px`, width: '55%', fontFamily: font }}>
        {/* Render right side sections in the specified order */}
        {rightSectionOrder.map(sectionId => (
          <React.Fragment key={sectionId}>
            {renderRightSectionContent(sectionId)}
          </React.Fragment>
        ))}
      </Box>
    </Box>
  );

  // Render sidebar content (only for first page)
  const renderSidebar = () => (
    <Grid item xs={12} md={4} sx={{ 
      width: "45%",
      p: 4, 
      borderRight: { md: '1px solid #eee' },
      backgroundColor: palette.sidebarBackground,
      fontFamily: font,
      fontSize: fontSize,
      fontStyle: fontStyle,
      lineHeight: `${lineSpacing}px`,
    }}>
      {/* Render left side sections in the specified order */}
      {leftSectionOrder.map((sectionId, index) => (
        <React.Fragment key={sectionId}>
          {renderLeftSectionContent(sectionId)}
          {index < leftSectionOrder.length - 1 && (
            <Divider sx={{ 
              my: sectionSpacing / 10, 
              borderColor: '#eee',
              borderBottomWidth: lineWeight,
            }} />
          )}
        </React.Fragment>
      ))}
    </Grid>
  );

  // Render main content area
  const renderMainContent = (pageContent, isFirstPage = false) => (
    <Grid item xs={12} md={8} sx={{ 
      p: 4, 
      width: isFirstPage ? "55%" : "100%",
      fontFamily: font,
      fontSize: fontSize,
      fontStyle: fontStyle,
      lineHeight: `${lineSpacing}px`,
    }}>
      {/* Apply font styles to the HTML content */}
      <div 
        style={{ 
          fontFamily: font, 
          fontStyle: fontStyle, 
          fontSize: fontSize,
          lineHeight: `${lineSpacing}px`
        }}
        dangerouslySetInnerHTML={{ 
          __html: addFontStylesToHTML(pageContent.main.map(s => s.outerHTML).join('')) 
        }} 
      />
    </Grid>
  );

  return (
    <Box sx={{ width: "100%", position: "relative", m: 5, fontFamily: font }}>
      {!exporting && (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 2, gap: 2, '@media print': { display: 'none' }, fontFamily: font }}>
          <IconButton onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))} disabled={currentPage === 0} color="primary" sx={{ fontFamily: font }}>
            <ChevronLeft />
          </IconButton>
          <Typography sx={{ mx: 2, fontFamily: font }}>Page {currentPage + 1} of {Math.max(1, pages.length)}</Typography>
          <IconButton onClick={() => setCurrentPage(prev => Math.min(pages.length - 1, prev + 1))} disabled={currentPage === Math.max(0, pages.length - 1)} color="primary" sx={{ fontFamily: font }}>
            <ChevronRight />
          </IconButton>
          
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
      
      {/* Hidden content for measurement */}
      {renderMainContentToMeasure()}
      
      {/* Main resume container */}
      <Box id="resume-container" sx={{ fontFamily: font }}>
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
                fontFamily: font,
                fontSize: fontSize,
                fontStyle: fontStyle,
                lineHeight: `${lineSpacing}px`,
                display: "flex",
                flexDirection: "column",
                pageBreakAfter: "always",
                "@media print": {
                  width: page.width,
                  height: "auto",
                  minHeight: page.height,
                  boxShadow: "none",
                  m: 0,
                  fontFamily: font,
                  fontSize: fontSize,
                  fontStyle: fontStyle,
                  lineHeight: `${lineSpacing}px`,
                },
                // Show all pages when exporting, only current page when viewing
                display: exporting ? 'flex' : (index === currentPage ? 'flex' : 'none'),
                '@media print': { display: 'flex' },
                border: `${lineWeight}px solid ${palette.accentColor}`,
                my: topBottomMargin / 10,
                p: `${topBottomMargin / 2}px ${sideMargins / 2}px`,
              }}
            >
              {/* Header - Only show on first page */}
              {index === 0 && (
                <HeaderBackground color={palette.header}>
                  <NameTitle 
                    color={palette.nameColor} 
                    font={font}
                    fontSize={headingSize}
                  >
                    {data.firstName} {data.lastName}
                  </NameTitle>
                  <RoleTitle 
                    color={palette.nameColor} 
                    font={font}
                    fontSize={getFontSize(1.1)}
                  >
                    {data.currentPosition}
                  </RoleTitle>
                </HeaderBackground>
              )}

              {/* Main Content Grid */}
              <Grid container sx={{ flex: 1 }}>
                {/* Sidebar - Only show on first page */}
                {index === 0 ? renderSidebar() : null}
                
                {/* Main Content */}
                {renderMainContent(pageContent, index === 0)}
              </Grid>

              {/* Footer - Show on all pages */}
              <Box sx={{ 
                height: '30px', 
                backgroundColor: palette.header,
                borderTop: `${lineWeight}px solid ${palette.accentColor}`
              }} />
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
              fontFamily: font,
              fontSize: fontSize,
              fontStyle: fontStyle,
              lineHeight: `${lineSpacing}px`,
              display: "flex",
              flexDirection: "column",
              "@media print": {
                width: page.width,
                height: "auto",
                minHeight: page.height,
                boxShadow: "none",
                m: 0,
                fontFamily: font,
                fontSize: fontSize,
                fontStyle: fontStyle,
                lineHeight: `${lineSpacing}px`,
              },
              border: `${lineWeight}px solid ${palette.accentColor}`,
              my: topBottomMargin / 10,
              p: `${topBottomMargin / 2}px ${sideMargins / 2}px`,
            }}
          >
            {/* Header */}
            <HeaderBackground color={palette.header}>
              <NameTitle 
                color={palette.nameColor} 
                font={font}
                fontSize={headingSize}
              >
                {data.firstName} {data.lastName}
              </NameTitle>
              <RoleTitle 
                color={palette.nameColor} 
                font={font}
                fontSize={getFontSize(1.1)}
              >
                {data.currentPosition}
              </RoleTitle>
            </HeaderBackground>

            {/* Main Content Grid */}
            <Grid container sx={{ flex: 1 }}>
              {/* Sidebar */}
              {renderSidebar()}
              
              {/* Main Content */}
              <Grid item xs={12} md={8} sx={{ 
                p: 4, 
                width: "55%",
                fontFamily: font,
                fontSize: fontSize,
                fontStyle: fontStyle,
                lineHeight: `${lineSpacing}px`,
              }}>
                {renderAboutMeSection()}
                {renderExperienceSection()}
              </Grid>
            </Grid>

            {/* Footer */}
            <Box sx={{ 
              height: '30px', 
              backgroundColor: palette.header,
              borderTop: `${lineWeight}px solid ${palette.accentColor}`
            }} />
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

// Add metadata for filtering
export const resumeMeta = {
  hasPhoto: false,
  columns: 2,
  colorOptions: [
    { value: '#f0f0f0', label: 'Light Gray' },
    { value: '#e3f2fd', label: 'Light Blue' },
    { value: '#f1f8e9', label: 'Light Green' },
    { value: '#ffebee', label: 'Light Pink' },
    { value: '#fff3e0', label: 'Light Orange' }
  ],
  nameColorOptions: [
    { value: '#333', label: 'Dark Gray' },
    { value: '#1565c0', label: 'Blue' },
    { value: '#33691e', label: 'Green' },
    { value: '#c62828', label: 'Red' },
    { value: '#e65100', label: 'Orange' }
  ],
  sidebarBackgroundOptions: [
    { value: '#fff', label: 'White' },
    { value: '#f8f9fa', label: 'Light Gray' },
    { value: '#e3f2fd', label: 'Very Light Blue' },
    { value: '#f3e5f5', label: 'Very Light Purple' },
    { value: '#e8f5e9', label: 'Very Light Green' }
  ],
  headerBackgroundOptions: [
    { value: '#f0f0f0', label: 'Light Gray' },
    { value: '#e3f2fd', label: 'Light Blue' },
    { value: '#f1f8e9', label: 'Light Green' },
    { value: '#ffebee', label: 'Light Pink' },
    { value: '#fff3e0', label: 'Light Orange' }
  ],
  accentColorOptions: [
    { value: '#777', label: 'Medium Gray' },
    { value: '#1976d2', label: 'Blue' },
    { value: '#689f38', label: 'Green' },
    { value: '#d32f2f', label: 'Red' },
    { value: '#f57c00', label: 'Orange' }
  ],
  experienceLevel: ["No Experience", "Less than 3 years", "3-5 Years", "5-10 Years", "10+ Years"]
};

export default Resume21;