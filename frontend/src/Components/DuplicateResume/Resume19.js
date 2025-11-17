import React, { useEffect, useState, useRef, useCallback } from 'react';
import { 
  Grid, 
  Box, 
  Typography, 
  List, 
  ListItem, 
  Divider, 
  LinearProgress, 
  IconButton, 
  Button,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { styled } from '@mui/system';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import HomeIcon from '@mui/icons-material/Home';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import { ChevronLeft, ChevronRight, Print, Download, DragIndicator, Reorder } from "@mui/icons-material";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

// --- Styled Components for Theming ---

const HeaderTitle = styled(Typography)(({ color, font, fontSize }) => ({
  fontFamily: font || 'serif',
  fontWeight: 'bold',
  letterSpacing: '2px',
  color: color || '#4e342e',
  textTransform: 'uppercase',
  fontSize: fontSize || '2.5rem',
}));

const SectionHeader = styled(Typography)(({ color, font, fontSize }) => ({
  fontFamily: font || 'sans-serif',
  fontWeight: 'bold',
  color: color || '#5d4037',
  textTransform: 'uppercase',
  marginBottom: '10px',
  paddingBottom: '5px',
  borderBottom: `2px solid ${color || '#795548'}`,
  fontSize: fontSize || '1.2rem',
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
    fontSize: '1rem',
    marginRight: '10px',
    color: color || '#795548',
  },
}));

const SkillBarContainer = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  marginBottom: '8px',
});

const SkillBarText = styled(Typography)(({ font, fontSize, fontStyle, lineSpacing }) => ({
  width: '120px',
  flexShrink: 0,
  fontFamily: font || 'Arial, sans-serif',
  fontSize: fontSize || '0.9rem',
  fontStyle: fontStyle || 'normal',
  lineHeight: lineSpacing ? `${lineSpacing}px` : 'normal',
}));

const BulletPoint = styled('span')(({ color }) => ({
  marginRight: '8px',
  color: color || '#5d4037',
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
  firstName: "DONNA",
  lastName: "STROUPE",
  currentPosition: "Sales Representative",
  phone: "+1 456-789-0123",
  email: "hello@email.com",
  city: "Anywhere St, Anytown",
  website: "www.example.com",
  profile: "I am a Sales Representative with extensive experience in the fast-moving consumer goods industry. I am a professional who initiates and manages relationships with clients, who serves as their point of contact, and I am adept at following up with leads.",
};

// Section orders for left and right sides
const defaultLeftSectionOrder = [
  'contact',
  'skills',
  'softwareSkills',
  'languages',
  'interests',
  'certifications'
];

const defaultRightSectionOrder = [
  'workExperience',
  'volunteering',
  'education',
  'accomplishments',
  'additionalInfo',
  'references',
  'websites'
];

// --- Resume Component ---

const Resume19 = ({
  color = '#795548',
  nameColor = '#4e342e',
  sidebarBackground = '#f5f5f5',
  headerBackground = '#fff',
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
  
  // Merge with default data
  const data = { ...defaultData, ...formData };
  
  // State for pagination
  const [currentPage, setCurrentPage] = useState(0);
  const [pages, setPages] = useState([]);
  const mainContentRef = useRef(null);
  const sidebarContentRef = useRef(null);
  
  // State for dynamic data from localStorage
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

  // State for section ordering
  const [leftSectionOrder, setLeftSectionOrder] = useState(defaultLeftSectionOrder);
  const [rightSectionOrder, setRightSectionOrder] = useState(defaultRightSectionOrder);
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const [dragOverSide, setDragOverSide] = useState(null);
  
  // State for arrange sections dialog
  const [arrangeDialogOpen, setArrangeDialogOpen] = useState(false);

  // Get page dimensions
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
  };

  // Calculate font sizes based on the fontSize prop
  const getFontSize = (multiplier = 1) => {
    const baseSize = parseInt(fontSize) || 14;
    return `${baseSize * multiplier}px`;
  };

  // Load data from localStorage
  useEffect(() => {
    // Education
    const storedEntries = localStorage.getItem("educationEntries");
    if (storedEntries) {
      setEducationEntries(JSON.parse(storedEntries));
    }
    
    // Skills
    const storedSkills = localStorage.getItem("skills");
    if (storedSkills) {
      setSavedSkills(JSON.parse(storedSkills));
    }
    
    // Summary
    const storedSummaries = JSON.parse(localStorage.getItem("summaries")) || [];
    if (storedSummaries.length > 0) {
      setSavedSummary(storedSummaries[storedSummaries.length - 1]);
    }
    
    // Additional Info
    const storedAdditionalInfo = JSON.parse(localStorage.getItem("additionalInfo")) || [];
    setSavedAdditionalInfo(storedAdditionalInfo);
    
    // Languages
    const storedLanguages = JSON.parse(localStorage.getItem("languagesList")) || [];
    setSavedLanguages(storedLanguages);
    
    // Accomplishments
    const storedAccomplishments = JSON.parse(localStorage.getItem("accomplishmentsList")) || [];
    setSavedAccomplishments(storedAccomplishments);
    
    // Certifications
    const storedCertifications = JSON.parse(localStorage.getItem("certificationsList")) || [];
    setSavedCertifications(storedCertifications);
    
    // References
    const storedReferences = JSON.parse(localStorage.getItem("referencesList")) || [];
    setSavedReferences(storedReferences);
    
    // Software Skills
    const storedSoftwareSkills = JSON.parse(localStorage.getItem("softwareSkills")) || [];
    setSoftwareSkills(storedSoftwareSkills);
    
    // Volunteering
    const storedVolunteering = JSON.parse(localStorage.getItem("volunteering")) || [];
    setSavedVolunteering(storedVolunteering);
    
    // Interests
    const storedInterests = JSON.parse(localStorage.getItem("interests")) || [];
    setSavedInterests(storedInterests);
    
    // Websites
    const storedWebsites = JSON.parse(localStorage.getItem("websites")) || [];
    setSavedWebsites(storedWebsites);
    
    // Custom Sections - Resume9 mathiri load pannuvom
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
  const savedLeftSectionOrder = localStorage.getItem("resume19LeftSectionOrder");
  if (savedLeftSectionOrder) {
    // 🔥 FIX: Left side-ல custom sections auto add ஆகாது - filter only
    const parsedOrder = JSON.parse(savedLeftSectionOrder);
    const filteredOrder = parsedOrder.filter(section => !section.startsWith('custom_'));
    setLeftSectionOrder(filteredOrder);
    console.log('🔄 Loaded left section order WITHOUT custom sections:', filteredOrder);
  } else {
    setLeftSectionOrder(defaultLeftSectionOrder);
  }

  const savedRightSectionOrder = localStorage.getItem("resume19RightSectionOrder");
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
      localStorage.setItem("resume19RightSectionOrder", JSON.stringify(newRightOrder));
      console.log('📝 Final right section order with ONLY CURRENT custom sections:', newRightOrder);
    }
    
    // 🔥 FIX: Left side-லிருந்து custom sections-ஐ remove செய்யவும்
    const currentLeftOrder = [...leftSectionOrder];
    const filteredLeftOrder = currentLeftOrder.filter(section => !section.startsWith('custom_'));
    if (JSON.stringify(filteredLeftOrder) !== JSON.stringify(currentLeftOrder)) {
      setLeftSectionOrder(filteredLeftOrder);
      localStorage.setItem("resume19LeftSectionOrder", JSON.stringify(filteredLeftOrder));
      console.log('🗑️ Removed custom sections from left side:', filteredLeftOrder);
    }
    
  } else if (userId && Object.keys(customSections).length === 0) {
    // If no current custom sections, remove all custom sections from both sides
    const currentRightOrder = [...rightSectionOrder];
    const filteredRightOrder = currentRightOrder.filter(section => !section.startsWith('custom_'));
    
    if (filteredRightOrder.length !== currentRightOrder.length) {
      setRightSectionOrder(filteredRightOrder);
      localStorage.setItem("resume19RightSectionOrder", JSON.stringify(filteredRightOrder));
      console.log('🗑️ Removed all custom sections from right side (no current sections)');
    }
    
    const currentLeftOrder = [...leftSectionOrder];
    const filteredLeftOrder = currentLeftOrder.filter(section => !section.startsWith('custom_'));
    if (filteredLeftOrder.length !== currentLeftOrder.length) {
      setLeftSectionOrder(filteredLeftOrder);
      localStorage.setItem("resume19LeftSectionOrder", JSON.stringify(filteredLeftOrder));
      console.log('🗑️ Removed all custom sections from left side (no current sections)');
    }
  }
}, [customSections]);

  // Save section orders to localStorage whenever they change
  useEffect(() => {
    if (leftSectionOrder.length > 0) {
      localStorage.setItem("resume19LeftSectionOrder", JSON.stringify(leftSectionOrder));
    }
  }, [leftSectionOrder]);

  useEffect(() => {
    if (rightSectionOrder.length > 0) {
      localStorage.setItem("resume19RightSectionOrder", JSON.stringify(rightSectionOrder));
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
    const customSectionIds = Object.keys(customSections).map(name => `custom_${name}`);
    const newDefaultRightOrder = [...defaultRightSectionOrder, ...customSectionIds];
    setRightSectionOrder(newDefaultRightOrder);
  };

  const resetAllSectionOrder = () => {
    setLeftSectionOrder(defaultLeftSectionOrder);
    const customSectionIds = Object.keys(customSections).map(name => `custom_${name}`);
    const newDefaultRightOrder = [...defaultRightSectionOrder, ...customSectionIds];
    setRightSectionOrder(newDefaultRightOrder);
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
      'softwareSkills': 'Software Skills',
      'languages': 'Languages',
      'interests': 'Interests',
      'certifications': 'Certifications',
      'workExperience': 'Work Experience',
      'volunteering': 'Volunteering',
      'education': 'Education',
      'accomplishments': 'Accomplishments',
      'additionalInfo': 'Additional Information',
      'references': 'References',
      'websites': 'Websites/Profiles'
    };
    
    if (sectionId.startsWith('custom_')) {
      const customName = sectionId.replace('custom_', '');
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

  // Function to add font styles to HTML content
  const addFontStylesToHTML = (htmlContent) => {
    if (!htmlContent) return '';
    
    return htmlContent
      .replace(/<div/g, `<div style="font-family: ${font}; font-style: ${fontStyle}; font-size: ${fontSize}; line-height: ${lineSpacing}px;"`)
      .replace(/<p/g, `<p style="font-family: ${font}; font-style: ${fontStyle}; font-size: ${fontSize}; line-height: ${lineSpacing}px;"`)
      .replace(/<span/g, `<span style="font-family: ${font}; font-style: ${fontStyle};"`)
      .replace(/<h1/g, `<h1 style="font-family: ${font}; font-style: ${fontStyle};"`)
      .replace(/<h2/g, `<h2 style="font-family: ${font}; font-style: ${fontStyle};"`)
      .replace(/<h3/g, `<h3 style="font-family: ${font}; font-style: ${fontStyle};"`)
      .replace(/<h4/g, `<h4 style="font-family: ${font}; font-style: ${fontStyle};"`)
      .replace(/<h5/g, `<h5 style="font-family: ${font}; font-style: ${fontStyle};"`)
      .replace(/<h6/g, `<h6 style="font-family: ${font}; font-style: ${fontStyle};"`)
      .replace(/<li/g, `<li style="font-family: ${font}; font-style: ${fontStyle}; font-size: ${fontSize}; line-height: ${lineSpacing}px;"`)
      .replace(/<ul/g, `<ul style="font-family: ${font}; font-style: ${fontStyle};"`)
      .replace(/<ol/g, `<ol style="font-family: ${font}; font-style: ${fontStyle};"`)
      .replace(/<td/g, `<td style="font-family: ${font}; font-style: ${fontStyle};"`)
      .replace(/<th/g, `<th style="font-family: ${font}; font-style: ${fontStyle};"`)
      .replace(/<tr/g, `<tr style="font-family: ${font}; font-style: ${fontStyle};"`)
      .replace(/<table/g, `<table style="font-family: ${font}; font-style: ${fontStyle};"`);
  };

  // Render sidebar sections based on current order
  const renderSidebarSections = () => {
    return leftSectionOrder.map(sectionId => {
      switch (sectionId) {
        case 'contact':
          return (
            <div key="contact" className="sidebar-section">
              <Box sx={{ mb: sectionSpacing / 10 }}>
                <SectionHeader
                  color={palette.accentColor}
                  font={font}
                  fontSize={getFontSize(1.2)}
                >
                  Contact
                </SectionHeader>

                <InfoItem 
                  color={palette.accentColor} 
                  font={font}
                  fontSize={fontSize}
                  fontStyle={fontStyle}
                  lineSpacing={lineSpacing}
                >
                  <PhoneIcon sx={{ color: palette.accentColor }} />
                  <Typography
                    variant="body2"
                    sx={{
                      fontFamily: font,
                      fontSize: fontSize,
                      fontStyle: fontStyle,
                      lineHeight: `${lineSpacing}px`,
                      color: 'black',
                    }}
                  >
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
                  <EmailIcon sx={{ color: palette.accentColor }} />
                  <Typography
                    variant="body2"
                    sx={{
                      fontFamily: font,
                      fontSize: fontSize,
                      fontStyle: fontStyle,
                      lineHeight: `${lineSpacing}px`,
                      color: "black",
                    }}
                  >
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
                  <HomeIcon sx={{ color: palette.accentColor }} />
                  <Typography
                    variant="body2"
                    sx={{
                      fontFamily: font,
                      fontSize: fontSize,
                      fontStyle: fontStyle,
                      lineHeight: `${lineSpacing}px`,
                      color: "black",
                    }}
                  >
                    {data.city}
                  </Typography>
                </InfoItem>

                {savedWebsites.length > 0 && (
                  <InfoItem 
                    color={palette.accentColor} 
                    font={font}
                    fontSize={fontSize}
                    fontStyle={fontStyle}
                    lineSpacing={lineSpacing}
                  >
                    <LinkedInIcon sx={{ color: palette.accentColor }} />
                    <Typography
                      variant="body2"
                      sx={{
                        fontFamily: font,
                        fontSize: fontSize,
                        fontStyle: fontStyle,
                        lineHeight: `${lineSpacing}px`,
                        color: "black",
                      }}
                    >
                      {savedWebsites[0].url || savedWebsites[0]}
                    </Typography>
                  </InfoItem>
                )}
              </Box>
            </div>
          );

        case 'skills':
          return savedSkills.length > 0 ? (
            <div key="skills" className="sidebar-section">
              <Box sx={{ mb: sectionSpacing / 10 }}>
                <SectionHeader color={palette.accentColor} font={font} fontSize={getFontSize(1.2)}>
                  Skills
                </SectionHeader>
                <Box>
                  {savedSkills.map((skill, index) => (
                    <SkillBarContainer key={index}>
                      <SkillBarText 
                        font={font} 
                        fontSize={fontSize}
                        fontStyle={fontStyle}
                        lineSpacing={lineSpacing}
                      >
                        {skill.name}
                      </SkillBarText>
                      <LinearProgress 
                        variant="determinate" 
                        value={skill.rating || 0} 
                        sx={{ 
                          flexGrow: 1, 
                          height: 8, 
                          borderRadius: 5, 
                          backgroundColor: '#e0e0e0', 
                          '& .MuiLinearProgress-bar': { 
                            backgroundColor: palette.accentColor 
                          } 
                        }} 
                      />
                    </SkillBarContainer>
                  ))}
                </Box>
              </Box>
            </div>
          ) : null;

        case 'softwareSkills':
          return softwareSkills.length > 0 ? (
            <div key="softwareSkills" className="sidebar-section">
              <Box sx={{ mb: sectionSpacing / 10 }}>
                <SectionHeader color={palette.accentColor} font={font} fontSize={getFontSize(1.2)}>
                  Software Skills
                </SectionHeader>
                <Box>
                  {softwareSkills.map((skill, index) => (
                    <SkillBarContainer key={index}>
                      <SkillBarText 
                        font={font} 
                        fontSize={fontSize}
                        fontStyle={fontStyle}
                        lineSpacing={lineSpacing}
                      >
                        {skill.name}
                      </SkillBarText>
                      <LinearProgress 
                        variant="determinate" 
                        value={skill.level || skill.rating || 0} 
                        sx={{ 
                          flexGrow: 1, 
                          height: 8, 
                          borderRadius: 5, 
                          backgroundColor: '#e0e0e0', 
                          '& .MuiLinearProgress-bar': { 
                            backgroundColor: palette.accentColor 
                          } 
                        }} 
                      />
                    </SkillBarContainer>
                  ))}
                </Box>
              </Box>
            </div>
          ) : null;

        case 'languages':
          return savedLanguages.length > 0 ? (
            <div key="languages" className="sidebar-section">
              <Box sx={{ mb: sectionSpacing / 10 }}>
                <SectionHeader color={palette.accentColor} font={font} fontSize={getFontSize(1.2)}>
                  Languages
                </SectionHeader>
                {savedLanguages.map((lang, index) => (
                  <SkillBarContainer key={index}>
                    <SkillBarText 
                      font={font} 
                      fontSize={fontSize}
                      fontStyle={fontStyle}
                      lineSpacing={lineSpacing}
                    >
                      {lang.name}
                    </SkillBarText>
                    <LinearProgress 
                      variant="determinate" 
                      value={lang.level ? parseInt(lang.level) : 100} 
                      sx={{ 
                        flexGrow: 1, 
                        height: 8, 
                        borderRadius: 5, 
                        backgroundColor: '#e0e0e0', 
                        '& .MuiLinearProgress-bar': { 
                          backgroundColor: palette.accentColor 
                        } 
                      }} 
                    />
                  </SkillBarContainer>
                ))}
              </Box>
            </div>
          ) : null;

        case 'interests':
          return savedInterests.length > 0 ? (
            <div key="interests" className="sidebar-section">
              <Box sx={{ mb: sectionSpacing / 10 }}>
                <SectionHeader color={palette.accentColor} font={font} fontSize={getFontSize(1.2)}>
                  Interests
                </SectionHeader>
                <List dense>
                  {savedInterests.map((interest, index) => (
                    <ListItem key={index} sx={{ 
                      py: 0.5, 
                      fontFamily: font,
                      fontSize: fontSize,
                      fontStyle: fontStyle,
                      lineHeight: `${lineSpacing}px`,
                    }}>
                      <BulletPoint color={palette.accentColor}>•</BulletPoint>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          fontFamily: font, 
                          fontSize: fontSize, 
                          fontStyle: fontStyle,
                          lineHeight: `${lineSpacing}px`,
                        }}
                      >
                        {interest}
                      </Typography>
                    </ListItem>
                  ))}
                </List>
              </Box>
            </div>
          ) : null;

        case 'certifications':
          return savedCertifications.length > 0 ? (
            <div key="certifications" className="sidebar-section">
              <Box sx={{ mb: sectionSpacing / 10 }}>
                <SectionHeader color={palette.accentColor} font={font} fontSize={getFontSize(1.2)}>
                  Certifications
                </SectionHeader>
                <List dense>
                  {savedCertifications.map((cert, index) => (
                    <ListItem key={index} sx={{ 
                      py: 0.5, 
                      fontFamily: font,
                      fontSize: fontSize,
                      fontStyle: fontStyle,
                      lineHeight: `${lineSpacing}px`,
                    }}>
                      <BulletPoint color={palette.accentColor}>•</BulletPoint>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          fontFamily: font, 
                          fontSize: fontSize, 
                          fontStyle: fontStyle,
                          lineHeight: `${lineSpacing}px`,
                        }}
                      >
                        {cert.name} - {cert.provider} ({cert.year})
                      </Typography>
                    </ListItem>
                  ))}
                </List>
              </Box>
            </div>
          ) : null;

        case 'websites':
          return savedWebsites.length > 0 ? (
            <div key="websites" className="sidebar-section">
              <Box sx={{ mb: sectionSpacing / 10 }}>
                <SectionHeader color={palette.accentColor} font={font} fontSize={getFontSize(1.2)}>
                  Websites/Profiles
                </SectionHeader>
                <List dense>
                  {savedWebsites.map((site, index) => (
                    <ListItem key={index} sx={{ 
                      py: 0.5, 
                      fontFamily: font,
                      fontSize: fontSize,
                      fontStyle: fontStyle,
                      lineHeight: `${lineSpacing}px`,
                    }}>
                      <BulletPoint color={palette.accentColor}>•</BulletPoint>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          fontFamily: font, 
                          fontSize: fontSize, 
                          fontStyle: fontStyle,
                          lineHeight: `${lineSpacing}px`,
                        }}
                      >
                        {site.url || site}
                      </Typography>
                    </ListItem>
                  ))}
                </List>
              </Box>
            </div>
          ) : null;

        default:
          if (sectionId.startsWith('custom_')) {
            const customSectionName = sectionId.replace('custom_', '');
            const items = customSections[customSectionName] || [];
            return items.length > 0 ? (
              <div key={sectionId} className="sidebar-section">
                <Box sx={{ mb: sectionSpacing / 10 }}>
                  <SectionHeader color={palette.accentColor} font={font} fontSize={getFontSize(1.2)}>
                    {customSectionName.charAt(0).toUpperCase() + customSectionName.slice(1)}
                  </SectionHeader>
                  <List dense>
                    {items.map((item, i) => (
                      <ListItem key={i} sx={{ 
                        py: 0.5, 
                        fontFamily: font,
                        fontSize: fontSize,
                        fontStyle: fontStyle,
                        lineHeight: `${lineSpacing}px`,
                      }}>
                        <BulletPoint color={palette.accentColor}>•</BulletPoint>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            fontFamily: font, 
                            fontSize: fontSize, 
                            fontStyle: fontStyle,
                            lineHeight: `${lineSpacing}px`,
                          }}
                        >
                          {item}
                        </Typography>
                      </ListItem>
                    ))}
                  </List>
                </Box>
              </div>
            ) : null;
          }
          
          switch (sectionId) {
            case 'workExperience':
              return workExperiences && workExperiences.length > 0 ? (
                <div key="workExperience" className="sidebar-section">
                  <Box sx={{ mb: sectionSpacing / 10 }}>
                    <SectionHeader color={palette.accentColor} font={font} fontSize={getFontSize(1.2)}>
                      Work Experience
                    </SectionHeader>
                    {workExperiences.slice(0, 2).map((work, index) => (
                      <Box key={index} sx={{ 
                        mb: 1, 
                        fontFamily: font,
                        fontSize: fontSize,
                        fontStyle: fontStyle,
                        lineHeight: `${lineSpacing}px`,
                      }}>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            fontWeight: 'bold', 
                            fontFamily: font,
                            fontSize: fontSize,
                            fontStyle: fontStyle,
                            lineHeight: `${lineSpacing}px`,
                          }}
                        >
                          {work.jobTitle}
                        </Typography>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            color: palette.lightText,
                            fontFamily: font,
                            fontSize: '0.8rem',
                            fontStyle: fontStyle,
                            lineHeight: `${lineSpacing}px`,
                          }}
                        >
                          {work.employer}
                        </Typography>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            fontStyle: 'italic', 
                            color: palette.lightText,
                            fontFamily: font,
                            fontSize: '0.7rem',
                            lineHeight: `${lineSpacing}px`,
                          }}
                        >
                          {formatDate(work.startMonth, work.startYear)} -{" "}
                          {work.current ? "Present" : formatDate(work.endMonth, work.endYear)}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </div>
              ) : null;

            case 'education':
              return educationEntries.length > 0 ? (
                <div key="education" className="sidebar-section">
                  <Box sx={{ mb: sectionSpacing / 10 }}>
                    <SectionHeader color={palette.accentColor} font={font} fontSize={getFontSize(1.2)}>
                      Education
                    </SectionHeader>
                    {educationEntries.slice(0, 2).map((edu, index) => (
                      <Box key={index} sx={{ 
                        mb: 1, 
                        fontFamily: font,
                        fontSize: fontSize,
                        fontStyle: fontStyle,
                        lineHeight: `${lineSpacing}px`,
                      }}>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            fontWeight: 'bold',
                            fontFamily: font,
                            fontSize: fontSize,
                            fontStyle: fontStyle,
                            lineHeight: `${lineSpacing}px`,
                          }}
                        >
                          {edu.degree}
                        </Typography>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            color: palette.lightText,
                            fontFamily: font,
                            fontSize: '0.8rem',
                            fontStyle: fontStyle,
                            lineHeight: `${lineSpacing}px`,
                          }}
                        >
                          {edu.schoolName}
                        </Typography>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            fontStyle: 'italic', 
                            color: palette.lightText,
                            fontFamily: font,
                            fontSize: '0.7rem',
                            lineHeight: `${lineSpacing}px`,
                          }}
                        >
                          {formatDate(edu.gradMonth, edu.gradYear)}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </div>
              ) : null;

            case 'accomplishments':
              return savedAccomplishments.length > 0 ? (
                <div key="accomplishments" className="sidebar-section">
                  <Box sx={{ mb: sectionSpacing / 10 }}>
                    <SectionHeader color={palette.accentColor} font={font} fontSize={getFontSize(1.2)}>
                      Accomplishments
                    </SectionHeader>
                    <List dense>
                      {savedAccomplishments.slice(0, 3).map((acc, index) => (
                        <ListItem key={index} sx={{ 
                          py: 0.5, 
                          fontFamily: font,
                          fontSize: fontSize,
                          fontStyle: fontStyle,
                          lineHeight: `${lineSpacing}px`,
                        }}>
                          <BulletPoint color={palette.accentColor}>•</BulletPoint>
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              fontFamily: font,
                              fontSize: fontSize,
                              fontStyle: fontStyle,
                              lineHeight: `${lineSpacing}px`,
                            }}
                          >
                            {acc}
                          </Typography>
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                </div>
              ) : null;

            case 'references':
              return savedReferences.length > 0 ? (
                <div key="references" className="sidebar-section">
                  <Box sx={{ mb: sectionSpacing / 10 }}>
                    <SectionHeader color={palette.accentColor} font={font} fontSize={getFontSize(1.2)}>
                      References
                    </SectionHeader>
                    {savedReferences.slice(0, 2).map((ref, index) => (
                      <Box key={index} sx={{ 
                        mb: 1, 
                        fontFamily: font,
                        fontSize: fontSize,
                        fontStyle: fontStyle,
                        lineHeight: `${lineSpacing}px`,
                      }}>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            fontWeight: 'bold',
                            fontFamily: font,
                            fontSize: fontSize,
                            fontStyle: fontStyle,
                            lineHeight: `${lineSpacing}px`,
                          }}
                        >
                          {ref.name || ref}
                        </Typography>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            color: palette.lightText,
                            fontFamily: font,
                            fontSize: '0.8rem',
                            fontStyle: fontStyle,
                            lineHeight: `${lineSpacing}px`,
                          }}
                        >
                          {ref.position || 'Reference'}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </div>
              ) : null;

            default:
              return null;
          }
      }
    }).filter(Boolean);
  };

  // Render main content sections based on current order
  const renderMainContentSections = () => {
    return rightSectionOrder.map(sectionId => {
      switch (sectionId) {
        case 'workExperience':
          return workExperiences && workExperiences.length > 0 ? (
            <div key="workExperience" className="resume-section">
              <Box sx={{ mb: sectionSpacing / 10 }}>
                <SectionHeader color={palette.accentColor} font={font} fontSize={getFontSize(1.2)}>
                  Work Experience
                </SectionHeader>
                
                {workExperiences.map((work, index) => (
                  <Box key={index} sx={{ 
                    mb: 2, 
                    fontFamily: font,
                    fontSize: fontSize,
                    fontStyle: fontStyle,
                    lineHeight: `${lineSpacing}px`,
                  }}>
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'flex-start', 
                      fontFamily: font,
                      fontSize: fontSize,
                      fontStyle: fontStyle,
                      lineHeight: `${lineSpacing}px`,
                    }}>
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          fontWeight: 'bold', 
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
                          fontFamily: font,
                          fontSize: fontSize,
                          fontStyle: fontStyle,
                          lineHeight: `${lineSpacing}px`,
                        }}
                      >
                        {formatDate(work.startMonth, work.startYear)} -{" "}
                        {work.current ? "Present" : formatDate(work.endMonth, work.endYear)}
                      </Typography>
                    </Box>
                    <Typography 
                      variant="subtitle1" 
                      sx={{ 
                        color: palette.accentColor, 
                        mb: 1,
                        fontFamily: font,
                        fontSize: fontSize,
                        fontStyle: fontStyle,
                        lineHeight: `${lineSpacing}px`,
                      }}
                    >
                      {work.employer}
                    </Typography>
                    {work.description && (
                      <Box
                        sx={{
                          fontFamily: font,
                          fontSize: fontSize,
                          fontStyle: fontStyle,
                          lineHeight: `${lineSpacing}px`,
                          textIndent: `${paragraphIndent}px`,
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
                        }}
                        dangerouslySetInnerHTML={{
                          __html: work.description
                            .replace(/\*\*(.*?)\*\*/g, `<strong style="font-family: ${font}; font-weight: bold; font-style: ${fontStyle}; font-size: ${fontSize}; line-height: ${lineSpacing}px">$1</strong>`)
                            .replace(/\*(.*?)\*/g, `<em style="font-family: ${font}; font-style: italic; font-size: ${fontSize}; line-height: ${lineSpacing}px">$1</em>`)
                            .replace(/<u>(.*?)<\/u>/g, `<u style="font-family: ${font}; font-size: ${fontSize}; line-height: ${lineSpacing}px">$1</u>`)
                            .replace(/\n/g, `<br style="font-family: ${font}; font-size: ${fontSize}; line-height: ${lineSpacing}px" />`),
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
              <Box sx={{ mb: sectionSpacing / 10 }}>
                <SectionHeader color={palette.accentColor} font={font} fontSize={getFontSize(1.2)}>
                  Volunteering Experience
                </SectionHeader>
                {savedVolunteering.map((volunteer, index) => (
                  <Box key={index} sx={{ 
                    mb: 2, 
                    fontFamily: font,
                    fontSize: fontSize,
                    fontStyle: fontStyle,
                    lineHeight: `${lineSpacing}px`,
                  }}>
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'flex-start', 
                      fontFamily: font,
                      fontSize: fontSize,
                      fontStyle: fontStyle,
                      lineHeight: `${lineSpacing}px`,
                    }}>
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          fontWeight: 'bold', 
                          color: palette.textColor,
                          fontFamily: font,
                          fontSize: getFontSize(1.1),
                          fontStyle: fontStyle,
                          lineHeight: `${lineSpacing}px`,
                        }}
                      >
                        {volunteer.subtopic || volunteer.role}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          fontStyle: 'italic', 
                          color: palette.lightText,
                          fontFamily: font,
                          fontSize: fontSize,
                          fontStyle: fontStyle,
                          lineHeight: `${lineSpacing}px`,
                        }}
                      >
                        {volunteer.fromDate} - {volunteer.toDate}
                      </Typography>
                    </Box>
                    <Typography 
                      variant="subtitle1" 
                      sx={{ 
                        color: palette.accentColor, 
                        mb: 1,
                        fontFamily: font,
                        fontSize: fontSize,
                        fontStyle: fontStyle,
                        lineHeight: `${lineSpacing}px`,
                      }}
                    >
                      {volunteer.organization}
                    </Typography>
                    {volunteer.content && (
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          fontFamily: font,
                          fontSize: fontSize,
                          fontStyle: fontStyle,
                          lineHeight: `${lineSpacing}px`,
                          textIndent: `${paragraphIndent}px`,
                        }}
                      >
                        {volunteer.content}
                      </Typography>
                    )}
                  </Box>
                ))}
              </Box>
            </div>
          ) : null;

        case 'education':
          return educationEntries.length > 0 ? (
            <div key="education" className="resume-section">
              <Box sx={{ mb: sectionSpacing / 10 }}>
                <SectionHeader color={palette.accentColor} font={font} fontSize={getFontSize(1.2)}>
                  Education
                </SectionHeader>
                {educationEntries.map((edu, index) => (
                  <Box key={index} sx={{ 
                    mb: 2, 
                    fontFamily: font,
                    fontSize: fontSize,
                    fontStyle: fontStyle,
                    lineHeight: `${lineSpacing}px`,
                  }}>
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'flex-start', 
                      fontFamily: font,
                      fontSize: fontSize,
                      fontStyle: fontStyle,
                      lineHeight: `${lineSpacing}px`,
                    }}>
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          fontWeight: 'bold', 
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
                          fontStyle: 'italic', 
                          color: palette.lightText,
                          fontFamily: font,
                          fontSize: fontSize,
                          fontStyle: fontStyle,
                          lineHeight: `${lineSpacing}px`,
                        }}
                      >
                        {formatDate(edu.gradMonth, edu.gradYear)}
                      </Typography>
                    </Box>
                    <Typography 
                      variant="subtitle1" 
                      sx={{ 
                        color: palette.accentColor,
                        fontFamily: font,
                        fontSize: fontSize,
                        fontStyle: fontStyle,
                        lineHeight: `${lineSpacing}px`,
                      }}
                    >
                      {edu.schoolName}, {edu.schoolLocation}
                    </Typography>
                    {edu.additionalCoursework && (
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          fontFamily: font,
                          fontSize: fontSize,
                          fontStyle: fontStyle,
                          lineHeight: `${lineSpacing}px`,
                          textIndent: `${paragraphIndent}px`,
                        }}
                      >
                        {edu.additionalCoursework}
                      </Typography>
                    )}
                  </Box>
                ))}
              </Box>
            </div>
          ) : null;

        case 'accomplishments':
          return savedAccomplishments.length > 0 ? (
            <div key="accomplishments" className="resume-section">
              <Box sx={{ mb: sectionSpacing / 10 }}>
                <SectionHeader color={palette.accentColor} font={font} fontSize={getFontSize(1.2)}>
                  Accomplishments
                </SectionHeader>
                <List disablePadding>
                  {savedAccomplishments.map((acc, index) => (
                    <ListItem key={index} sx={{ 
                      py: 0.5, 
                      px: 0, 
                      fontFamily: font,
                      fontSize: fontSize,
                      fontStyle: fontStyle,
                      lineHeight: `${lineSpacing}px`,
                    }}>
                      <BulletPoint color={palette.accentColor}>•</BulletPoint>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          fontFamily: font,
                          fontSize: fontSize,
                          fontStyle: fontStyle,
                          lineHeight: `${lineSpacing}px`,
                        }}
                      >
                        {acc}
                      </Typography>
                    </ListItem>
                  ))}
                </List>
              </Box>
            </div>
          ) : null;

        case 'additionalInfo':
          return savedAdditionalInfo.length > 0 ? (
            <div key="additionalInfo" className="resume-section">
              <Box sx={{ mb: sectionSpacing / 10 }}>
                <SectionHeader color={palette.accentColor} font={font} fontSize={getFontSize(1.2)}>
                  Additional Info
                </SectionHeader>
                <List dense>
                  {savedAdditionalInfo.map((info, index) => (
                    <ListItem key={index} sx={{ 
                      py: 0.5, 
                      fontFamily: font,
                      fontSize: fontSize,
                      fontStyle: fontStyle,
                      lineHeight: `${lineSpacing}px`,
                    }}>
                      <BulletPoint color={palette.accentColor}>•</BulletPoint>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          fontFamily: font, 
                          fontSize: fontSize, 
                          fontStyle: fontStyle,
                          lineHeight: `${lineSpacing}px`,
                        }}
                      >
                        {info}
                      </Typography>
                    </ListItem>
                  ))}
                </List>
              </Box>
            </div>
          ) : null;

        case 'references':
          return savedReferences.length > 0 ? (
            <div key="references" className="resume-section">
              <Box>
                <SectionHeader color={palette.accentColor} font={font} fontSize={getFontSize(1.2)}>
                  References
                </SectionHeader>
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  flexWrap: 'wrap', 
                  fontFamily: font,
                  fontSize: fontSize,
                  fontStyle: fontStyle,
                  lineHeight: `${lineSpacing}px`,
                }}>
                  {savedReferences.map((ref, index) => (
                    <Box key={index} sx={{ 
                      width: { xs: '100%', md: '48%' }, 
                      mb: 2, 
                      fontFamily: font,
                      fontSize: fontSize,
                      fontStyle: fontStyle,
                      lineHeight: `${lineSpacing}px`,
                    }}>
                      <Typography 
                        variant="subtitle1" 
                        fontWeight="bold" 
                        sx={{ 
                          fontFamily: font, 
                          fontStyle: fontStyle,
                          fontSize: fontSize,
                          lineHeight: `${lineSpacing}px`,
                        }}
                      >
                        {ref.name || ref}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            </div>
          ) : null;

        case 'websites':
          return savedWebsites.length > 0 ? (
            <div key="websites" className="resume-section">
              <Box sx={{ mb: sectionSpacing / 10 }}>
                <SectionHeader color={palette.accentColor} font={font} fontSize={getFontSize(1.2)}>
                  Websites / Profiles
                </SectionHeader>
                {savedWebsites.map((site, index) => (
                  <Typography 
                    key={index} 
                    sx={{ 
                      mb: `${paragraphSpacing / 10}px`, 
                      fontSize: fontSize, 
                      fontFamily: font, 
                      color: "black",
                      fontStyle: fontStyle,
                      lineHeight: `${lineSpacing}px`,
                    }}
                  >
                    {site.url} {site.addToHeader ? "(Shown in Header)" : ""}
                  </Typography>
                ))}
              </Box>
            </div>
          ) : null;

        default:
          if (sectionId.startsWith('custom_')) {
            const customSectionName = sectionId.replace('custom_', '');
            const items = customSections[customSectionName] || [];
            return items.length > 0 ? (
              <div key={sectionId} className="resume-section">
                <Box sx={{ mb: sectionSpacing / 10 }}>
                  <SectionHeader color={palette.accentColor} font={font} fontSize={getFontSize(1.2)}>
                    {customSectionName.charAt(0).toUpperCase() + customSectionName.slice(1)}
                  </SectionHeader>
                  {items.map((item, i) => (
                    <Typography 
                      key={i} 
                      sx={{ 
                        mb: `${paragraphSpacing / 10}px`, 
                        fontSize: fontSize, 
                        fontFamily: font, 
                        color: "black",
                        fontStyle: fontStyle,
                        lineHeight: `${lineSpacing}px`,
                        textIndent: `${paragraphIndent}px`,
                      }} 
                      whiteSpace="pre-line"
                    >
                      {item}
                    </Typography>
                  ))}
                </Box>
              </div>
            ) : null;
          }
          
          switch (sectionId) {
            case 'contact':
              return (
                <div key="contact" className="resume-section">
                  <Box sx={{ mb: sectionSpacing / 10 }}>
                    <SectionHeader color={palette.accentColor} font={font} fontSize={getFontSize(1.2)}>
                      Contact
                    </SectionHeader>
                    <Box sx={{ 
                      display: 'flex', 
                      flexWrap: 'wrap', 
                      gap: 2, 
                      fontFamily: font,
                      fontSize: fontSize,
                      fontStyle: fontStyle,
                      lineHeight: `${lineSpacing}px`,
                    }}>
                      <Box>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            fontFamily: font, 
                            fontSize: fontSize, 
                            fontStyle: fontStyle,
                            lineHeight: `${lineSpacing}px`,
                          }}
                        >
                          <strong>Phone:</strong> {data.phone}
                        </Typography>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            fontFamily: font, 
                            fontSize: fontSize, 
                            fontStyle: fontStyle,
                            lineHeight: `${lineSpacing}px`,
                          }}
                        >
                          <strong>Email:</strong> {data.email}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            fontFamily: font, 
                            fontSize: fontSize, 
                            fontStyle: fontStyle,
                            lineHeight: `${lineSpacing}px`,
                          }}
                        >
                          <strong>Location:</strong> {data.city}
                        </Typography>
                        {savedWebsites.length > 0 && (
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              fontFamily: font, 
                              fontSize: fontSize, 
                              fontStyle: fontStyle,
                              lineHeight: `${lineSpacing}px`,
                            }}
                          >
                            <strong>Website:</strong> {savedWebsites[0].url || savedWebsites[0]}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  </Box>
                </div>
              );

            case 'skills':
              return savedSkills.length > 0 ? (
                <div key="skills" className="resume-section">
                  <Box sx={{ mb: sectionSpacing / 10 }}>
                    <SectionHeader color={palette.accentColor} font={font} fontSize={getFontSize(1.2)}>
                      Skills
                    </SectionHeader>
                    <Box sx={{ 
                      display: 'flex', 
                      flexWrap: 'wrap', 
                      gap: 2, 
                      fontFamily: font,
                      fontSize: fontSize,
                      fontStyle: fontStyle,
                      lineHeight: `${lineSpacing}px`,
                    }}>
                      {savedSkills.map((skill, index) => (
                        <Box key={index} sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          fontFamily: font,
                          fontSize: fontSize,
                          fontStyle: fontStyle,
                          lineHeight: `${lineSpacing}px`,
                        }}>
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              fontFamily: font, 
                              fontSize: fontSize, 
                              fontStyle: fontStyle, 
                              mr: 1,
                              lineHeight: `${lineSpacing}px`,
                            }}
                          >
                            {skill.name}:
                          </Typography>
                          <LinearProgress 
                            variant="determinate" 
                            value={skill.rating || 0} 
                            sx={{ 
                              width: '100px',
                              height: 8, 
                              borderRadius: 5, 
                              backgroundColor: '#e0e0e0', 
                              '& .MuiLinearProgress-bar': { 
                                backgroundColor: palette.accentColor 
                              } 
                            }} 
                          />
                        </Box>
                      ))}
                    </Box>
                  </Box>
                </div>
              ) : null;

            case 'softwareSkills':
              return softwareSkills.length > 0 ? (
                <div key="softwareSkills" className="resume-section">
                  <Box sx={{ mb: sectionSpacing / 10 }}>
                    <SectionHeader color={palette.accentColor} font={font} fontSize={getFontSize(1.2)}>
                      Software Skills
                    </SectionHeader>
                    <Box sx={{ 
                      display: 'flex', 
                      flexWrap: 'wrap', 
                      gap: 2, 
                      fontFamily: font,
                      fontSize: fontSize,
                      fontStyle: fontStyle,
                      lineHeight: `${lineSpacing}px`,
                    }}>
                      {softwareSkills.map((skill, index) => (
                        <Box key={index} sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          fontFamily: font,
                          fontSize: fontSize,
                          fontStyle: fontStyle,
                          lineHeight: `${lineSpacing}px`,
                        }}>
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              fontFamily: font, 
                              fontSize: fontSize, 
                              fontStyle: fontStyle, 
                              mr: 1,
                              lineHeight: `${lineSpacing}px`,
                            }}
                          >
                            {skill.name}:
                          </Typography>
                          <LinearProgress 
                            variant="determinate" 
                            value={skill.level || skill.rating || 0} 
                            sx={{ 
                              width: '100px',
                              height: 8, 
                              borderRadius: 5, 
                              backgroundColor: '#e0e0e0', 
                              '& .MuiLinearProgress-bar': { 
                                backgroundColor: palette.accentColor 
                              } 
                            }} 
                          />
                        </Box>
                      ))}
                    </Box>
                  </Box>
                </div>
              ) : null;

            case 'languages':
              return savedLanguages.length > 0 ? (
                <div key="languages" className="resume-section">
                  <Box sx={{ mb: sectionSpacing / 10 }}>
                    <SectionHeader color={palette.accentColor} font={font} fontSize={getFontSize(1.2)}>
                      Languages
                    </SectionHeader>
                    <Box sx={{ 
                      display: 'flex', 
                      flexWrap: 'wrap', 
                      gap: 2, 
                      fontFamily: font,
                      fontSize: fontSize,
                      fontStyle: fontStyle,
                      lineHeight: `${lineSpacing}px`,
                    }}>
                      {savedLanguages.map((lang, index) => (
                        <Box key={index} sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          fontFamily: font,
                          fontSize: fontSize,
                          fontStyle: fontStyle,
                          lineHeight: `${lineSpacing}px`,
                        }}>
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              fontFamily: font, 
                              fontSize: fontSize, 
                              fontStyle: fontStyle, 
                              mr: 1,
                              lineHeight: `${lineSpacing}px`,
                            }}
                          >
                            {lang.name}:
                          </Typography>
                          <LinearProgress 
                            variant="determinate" 
                            value={lang.level ? parseInt(lang.level) : 100} 
                            sx={{ 
                              width: '100px',
                              height: 8, 
                              borderRadius: 5, 
                              backgroundColor: '#e0e0e0', 
                              '& .MuiLinearProgress-bar': { 
                                backgroundColor: palette.accentColor 
                              } 
                            }} 
                          />
                        </Box>
                      ))}
                    </Box>
                  </Box>
                </div>
              ) : null;

            case 'interests':
              return savedInterests.length > 0 ? (
                <div key="interests" className="resume-section">
                  <Box sx={{ mb: sectionSpacing / 10 }}>
                    <SectionHeader color={palette.accentColor} font={font} fontSize={getFontSize(1.2)}>
                      Interests
                    </SectionHeader>
                    <Box sx={{ 
                      display: 'flex', 
                      flexWrap: 'wrap', 
                      gap: 1, 
                      fontFamily: font,
                      fontSize: fontSize,
                      fontStyle: fontStyle,
                      lineHeight: `${lineSpacing}px`,
                    }}>
                      {savedInterests.map((interest, index) => (
                        <Typography 
                          key={index} 
                          variant="body2" 
                          sx={{ 
                            fontFamily: font,
                            fontSize: fontSize,
                            fontStyle: fontStyle,
                            lineHeight: `${lineSpacing}px`,
                            mr: 2,
                            mb: 1
                          }}
                        >
                          • {interest}
                        </Typography>
                      ))}
                    </Box>
                  </Box>
                </div>
              ) : null;

            case 'certifications':
              return savedCertifications.length > 0 ? (
                <div key="certifications" className="resume-section">
                  <Box sx={{ mb: sectionSpacing / 10 }}>
                    <SectionHeader color={palette.accentColor} font={font} fontSize={getFontSize(1.2)}>
                      Certifications
                    </SectionHeader>
                    <List dense>
                      {savedCertifications.map((cert, index) => (
                        <ListItem key={index} sx={{ 
                          py: 0.5, 
                          fontFamily: font,
                          fontSize: fontSize,
                          fontStyle: fontStyle,
                          lineHeight: `${lineSpacing}px`,
                        }}>
                          <BulletPoint color={palette.accentColor}>•</BulletPoint>
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              fontFamily: font, 
                              fontSize: fontSize, 
                              fontStyle: fontStyle,
                              lineHeight: `${lineSpacing}px`,
                            }}
                          >
                            {cert.name} - {cert.provider} ({cert.year})
                          </Typography>
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                </div>
              ) : null;

            default:
              return null;
          }
      }
    }).filter(Boolean);
  };

  // Improved pagination logic with proper sidebar content continuation
  const paginateContent = useCallback(() => {
    if (!mainContentRef.current || !sidebarContentRef.current) return;

    const mainSections = Array.from(mainContentRef.current.querySelectorAll('.resume-section'));
    const sidebarSections = Array.from(sidebarContentRef.current.querySelectorAll('.sidebar-section'));
    
    // Convert page height from mm to pixels (1mm ≈ 3.78px for print)
    const pageHeightInPx = parseFloat(page.height.replace('mm', '')) * 3.78;
    const availableHeight = pageHeightInPx - (2 * topBottomMargin);

    let newPages = [];
    let currentMainIndex = 0;
    let currentSidebarIndex = 0;

    // Process until all sections are placed
    while (currentMainIndex < mainSections.length || currentSidebarIndex < sidebarSections.length) {
      let currentPageMainSections = [];
      let currentPageSidebarSections = [];
      let currentHeight = 0;

      // Helper function to calculate section height
      const getSectionHeight = (section) => {
        return section.offsetHeight + sectionSpacing / 10;
      };

      // Add sidebar sections first (they have fixed height)
      while (currentSidebarIndex < sidebarSections.length) {
        const sidebarSection = sidebarSections[currentSidebarIndex];
        const sidebarSectionHeight = getSectionHeight(sidebarSection);

        if (currentHeight + sidebarSectionHeight <= availableHeight) {
          currentPageSidebarSections.push(sidebarSection);
          currentHeight += sidebarSectionHeight;
          currentSidebarIndex++;
        } else {
          break;
        }
      }

      // Add main sections to fill remaining space
      while (currentMainIndex < mainSections.length) {
        const mainSection = mainSections[currentMainIndex];
        const mainSectionHeight = getSectionHeight(mainSection);

        if (currentHeight + mainSectionHeight <= availableHeight) {
          currentPageMainSections.push(mainSection);
          currentHeight += mainSectionHeight;
          currentMainIndex++;
        } else {
          break;
        }
      }

      // Add the page if we have any content
      if (currentPageMainSections.length > 0 || currentPageSidebarSections.length > 0) {
        newPages.push({
          main: [...currentPageMainSections],
          sidebar: [...currentPageSidebarSections],
        });
      }

      // If we couldn't add any sections due to height constraints, force add at least one section
      if (currentPageMainSections.length === 0 && currentPageSidebarSections.length === 0) {
        if (currentSidebarIndex < sidebarSections.length) {
          currentPageSidebarSections.push(sidebarSections[currentSidebarIndex]);
          currentSidebarIndex++;
          newPages.push({
            main: [...currentPageMainSections],
            sidebar: [...currentPageSidebarSections],
          });
        } else if (currentMainIndex < mainSections.length) {
          currentPageMainSections.push(mainSections[currentMainIndex]);
          currentMainIndex++;
          newPages.push({
            main: [...currentPageMainSections],
            sidebar: [...currentPageSidebarSections],
          });
        }
      }
    }

    // Ensure we have at least one page
    if (newPages.length === 0) {
      newPages.push({
        main: [],
        sidebar: [],
      });
    }

    setPages(newPages);
  }, [page.height, topBottomMargin, sectionSpacing, leftSectionOrder, rightSectionOrder, font, fontSize, fontStyle, lineSpacing, paragraphIndent]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      paginateContent();
    }, 100);

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
    color,
    font,
    fontSize,
    fontStyle,
    lineSpacing,
    paragraphIndent,
    sectionSpacing,
  ]);

  // Render sidebar content for measurement (without header)
  const renderSidebarContentToMeasure = () => (
    <Box ref={sidebarContentRef} sx={{ visibility: 'hidden', position: 'absolute', left: '-9999px', fontFamily: font }}>
      {renderSidebarSections()}
    </Box>
  );

  // Render main content for measurement (hidden) - without header
  const renderMainContentToMeasure = () => (
    <Box ref={mainContentRef} sx={{ visibility: 'hidden', position: 'absolute', left: '-9999px', fontFamily: font }}>
      {renderMainContentSections()}
    </Box>
  );

  // Render header separately (only for first page)
  const renderHeader = () => (
    <Box sx={{ mb: sectionSpacing / 10 }}>
      <HeaderTitle 
        color={palette.nameColor} 
        font={font}
        fontSize={headingSize}
        variant="h3"
      >
        {data.firstName} {data.lastName}
      </HeaderTitle>
      <Typography 
        variant="h6" 
        sx={{ 
          color: palette.lightText, 
          mt: 1, 
          textTransform: 'uppercase',
          fontFamily: font,
          fontSize: getFontSize(1.2),
          fontStyle: fontStyle,
          lineHeight: `${lineSpacing}px`,
        }}
      >
        {data.currentPosition}
      </Typography>
      <Typography 
        variant="body1" 
        sx={{ 
          mt: 2, 
          color: palette.textColor,
          fontFamily: font,
          fontSize: fontSize,
          fontStyle: fontStyle,
          lineHeight: `${lineSpacing}px`,
          textIndent: `${paragraphIndent}px`,
        }}
      >
        {savedSummary || data.profile}
      </Typography>
    </Box>
  );

  // Render actual visible sidebar content for a specific page
  const renderSidebarContentForPage = (pageIndex) => {
    if (!pages[pageIndex]) return null;
    
    return (
      <>
        {pages[pageIndex].sidebar.map((section, index) => (
          <div 
            key={`sidebar-${pageIndex}-${index}`}
            dangerouslySetInnerHTML={{ __html: section.outerHTML }}
          />
        ))}
      </>
    );
  };

  // Render actual visible main content for a specific page
  const renderMainContentForPage = (pageIndex) => {
    if (!pages[pageIndex]) return null;
    
    return (
      <>
        {pages[pageIndex].main.map((section, index) => (
          <div 
            key={`main-${pageIndex}-${index}`}
            dangerouslySetInnerHTML={{ __html: addFontStylesToHTML(section.outerHTML) }}
          />
        ))}
      </>
    );
  };

  // Save download history function
  const saveDownloadHistory = async (format, fileName, fileSize) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const downloadData = {
        templateId: 19,
        fileName: fileName,
        fileFormat: format,
        fileSize: fileSize,
        themeColor: color,
        downloadedAt: new Date().toISOString()
      };

      await fetch("https://resume-maker-lc.onrender.com/api/resumes/save-download", {
        method: "POST",
        headers: { 
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(downloadData),
      });
    } catch (error) {
      console.error("Error saving download history:", error);
    }
  };

  // Handle PDF download
  const handlePDFDownload = async () => {
    const resumeElement = document.getElementById('resume-container');
    if (!resumeElement) return;

    try {
      const resumePages = resumeElement.querySelectorAll('.resume-page');
      
      if (resumePages.length === 0) {
        console.error("No resume pages found");
        return;
      }

      const pdf = new jsPDF("p", "mm", pageSize.toLowerCase());
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      for (let i = 0; i < resumePages.length; i++) {
        const pageElement = resumePages[i];
        
        if (i > 0) {
          pdf.addPage();
        }

        const canvas = await html2canvas(pageElement, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: "#ffffff",
          logging: false
        });

        const imgData = canvas.toDataURL("image/png");
        
        const imgWidth = pageWidth;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        
        pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight, undefined, 'FAST');
      }
      
      const pdfBlob = pdf.output('blob');
      const fileSize = pdfBlob.size;
      
      await saveDownloadHistory("pdf", "resume", fileSize);
      
      pdf.save("resume.pdf");
      
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Error generating PDF. Please try again.");
    }
  };

  // Handle PNG download
  const handlePNGDownload = async () => {
    const resumeElement = document.getElementById('resume-container');
    if (!resumeElement) return;

    try {
      const resumePages = resumeElement.querySelectorAll('.resume-page');
      
      if (resumePages.length === 0) {
        console.error("No resume pages found");
        return;
      }

      for (let i = 0; i < resumePages.length; i++) {
        const pageElement = resumePages[i];
        
        const canvas = await html2canvas(pageElement, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: "#ffffff"
        });
        
        const link = document.createElement('a');
        
        if (resumePages.length === 1) {
          link.download = `resume.png`;
        } else {
          link.download = `resume-page-${i + 1}.png`;
        }
        
        link.href = canvas.toDataURL();
        
        if (i === 0) {
          link.click();
        } else {
          setTimeout(() => {
            link.click();
          }, i * 500);
        }
      }

      await saveDownloadHistory("png", "resume", 0);

      if (resumePages.length > 1) {
        alert(`Downloading ${resumePages.length} PNG files. Please check your downloads folder.`);
      }
      
    } catch (error) {
      console.error("Error generating PNG:", error);
      alert("Error generating PNG files. Please try again.");
    }
  };

  // Handle Print
  const handlePrint = () => {
    window.print();
  };

  // Combined download handler
  const handleDownload = (format) => {
    if (format === 'pdf') {
      handlePDFDownload();
    } else if (format === 'png') {
      handlePNGDownload();
    }
  };

  return (
    <Box sx={{ width: "100%", position: "relative", m: 5, fontFamily: font }}>
      {!exporting && (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 2, gap: 2, '@media print': { display: 'none' }, fontFamily: font }}>
          <IconButton onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))} disabled={currentPage === 0} color="primary" sx={{ fontFamily: font }}><ChevronLeft /></IconButton>
          <Typography sx={{ mx: 2, fontFamily: font }}>Page {currentPage + 1} of {Math.max(1, pages.length)}</Typography>
          <IconButton onClick={() => setCurrentPage(prev => Math.min(pages.length - 1, prev + 1))} disabled={currentPage === Math.max(0, pages.length - 1)} color="primary" sx={{ fontFamily: font }}><ChevronRight /></IconButton>
          
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
      {renderMainContentToMeasure()}
      {renderSidebarContentToMeasure()}
      
      {/* Visible resume content */}
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
                bgcolor: palette.header,
                boxShadow: index === currentPage ? 4 : 0,
                fontFamily: font,
                fontSize: fontSize,
                fontStyle: fontStyle,
                lineHeight: `${lineSpacing}px`,
                my: topBottomMargin / 10,
                p: `${topBottomMargin / 2}px ${sideMargins / 2}px`,
                border: `${lineWeight}px solid ${palette.accentColor}`,
                display: "flex",
                flexDirection: "row",
                pageBreakAfter: "always",
                "@media print": {
                  width: page.width,
                  height: "auto",
                  minHeight: page.height,
                  boxShadow: "none",
                  m: 0,
                  p: 0,
                  border: "none",
                  fontFamily: font,
                  fontSize: fontSize,
                  fontStyle: fontStyle,
                  lineHeight: `${lineSpacing}px`,
                },
                display: exporting ? 'flex' : (index === currentPage ? 'flex' : 'none'),
                '@media print': { display: 'flex' }
              }}
            >
              <Grid container sx={{ height: '100%', fontFamily: font }}>
                {/* Sidebar - Full height on all pages */}
                <Grid item xs={12} md={4} sx={{ 
                  backgroundColor: palette.sidebarBackground, 
                  p: sideMargins / 5,
                  width: "30%",
                  boxSizing: "border-box",
                  display: 'flex',
                  flexDirection: 'column',
                  fontFamily: font,
                  fontSize: fontSize,
                  fontStyle: fontStyle,
                  lineHeight: `${lineSpacing}px`,
                }}>
                  {/* Header only on first page */}
                  {index === 0 && (
                    <Box sx={{ mb: sectionSpacing / 10, display: { xs: 'block', md: 'none' }, fontFamily: font }}>
                      {renderHeader()}
                    </Box>
                  )}
                  
                  {/* Sidebar content for this specific page */}
                  {renderSidebarContentForPage(index)}
                  
                  {/* Fill remaining space to ensure full height sidebar */}
                  <Box sx={{ flexGrow: 1 }} />
                </Grid>
                
                {/* Main Content */}
                <Grid item xs={12} md={8} sx={{ 
                  p: sideMargins / 5, 
                  width: "70%",
                  boxSizing: "border-box",
                  fontFamily: font,
                  fontSize: fontSize,
                  fontStyle: fontStyle,
                  lineHeight: `${lineSpacing}px`,
                }}>
                  {/* Header only on first page */}
                  {index === 0 && (
                    <Box sx={{ mb: sectionSpacing / 10, display: { xs: 'none', md: 'block' }, fontFamily: font }}>
                      {renderHeader()}
                    </Box>
                  )}
                  
                  {/* Main content for this specific page */}
                  {renderMainContentForPage(index)}
                </Grid>
              </Grid>
            </Box>
          ))
        ) : (
          // Fallback single page when no pagination data
          <Box
            className="resume-page"
            sx={{
              width: page.width,
              minHeight: page.height,
              mx: "auto",
              bgcolor: palette.header,
              boxShadow: 4,
              fontFamily: font,
              fontSize: fontSize,
              fontStyle: fontStyle,
              lineHeight: `${lineSpacing}px`,
              my: topBottomMargin / 10,
              p: `${topBottomMargin / 2}px ${sideMargins / 2}px`,
              border: `${lineWeight}px solid ${palette.accentColor}`,
              display: "flex",
              flexDirection: "row",
              "@media print": {
                width: page.width,
                height: "auto",
                minHeight: page.height,
                boxShadow: "none",
                m: 0,
                p: 0,
                border: "none",
                fontFamily: font,
                fontSize: fontSize,
                fontStyle: fontStyle,
                lineHeight: `${lineSpacing}px`,
              },
            }}
          >
            <Grid container sx={{ height: '100%', fontFamily: font }}>
              {/* Sidebar */}
              <Grid item xs={12} md={4} sx={{ 
                backgroundColor: palette.sidebarBackground, 
                p: sideMargins / 5,
                width: "30%",
                boxSizing: "border-box",
                display: 'flex',
                flexDirection: 'column',
                fontFamily: font,
                fontSize: fontSize,
                fontStyle: fontStyle,
                lineHeight: `${lineSpacing}px`,
              }}>
                {/* Header on mobile */}
                <Box sx={{ mb: sectionSpacing / 10, display: { xs: 'block', md: 'none' }, fontFamily: font }}>
                  {renderHeader()}
                </Box>
                
                {renderSidebarSections()}
                
                {/* Fill remaining space */}
                <Box sx={{ flexGrow: 1 }} />
              </Grid>
              
              {/* Main Content */}
              <Grid item xs={12} md={8} sx={{ 
                p: sideMargins / 5, 
                width: "70%",
                boxSizing: "border-box",
                fontFamily: font,
                fontSize: fontSize,
                fontStyle: fontStyle,
                lineHeight: `${lineSpacing}px`,
              }}>
                {/* Header on desktop */}
                <Box sx={{ mb: sectionSpacing / 10, display: { xs: 'none', md: 'block' }, fontFamily: font }}>
                  {renderHeader()}
                </Box>
                
                {renderMainContentSections()}
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

// Meta information for the resume
export const resumeMeta = {
  hasPhoto: false,
  columns: 2,
  colorOptions: [
    { value: '#795548', label: 'Brown' },
    { value: '#3f51b5', label: 'Indigo' },
    { value: '#2196f3', label: 'Blue' },
    { value: '#f44336', label: 'Red' },
    { value: '#4caf50', label: 'Green' },
    { value: '#ff9800', label: 'Orange' },
    { value: '#9c27b0', label: 'Purple' }
  ],
  nameColorOptions: [
    { value: '#4e342e', label: 'Dark Brown' },
    { value: '#333333', label: 'Dark Gray' },
    { value: '#000000', label: 'Black' },
    { value: '#1a2b47', label: 'Dark Blue' },
    { value: '#2e7d32', label: 'Green' }
  ],
  sidebarBackgroundOptions: [
    { value: '#f5f5f5', label: 'Light Gray' },
    { value: '#e6f3f9ff', label: 'Light Blue' },
    { value: '#f0f8e6ff', label: 'Light Green' },
    { value: '#f9e6f3ff', label: 'Light Pink' },
    { value: '#e6e6f9ff', label: 'Light Lavender' },
    { value: '#f9f3e6ff', label: 'Light Beige' }
  ],
  headerBackgroundOptions: [
    { value: '#fff', label: 'White' },
    { value: '#f8f9fa', label: 'Light Gray' },
    { value: '#e3f2fd', label: 'Very Light Blue' },
    { value: '#f3e5f5', label: 'Very Light Purple' },
    { value: '#e8f5e9', label: 'Very Light Green' }
  ],
  experienceLevel: ["No Experience", "Less than 3 years", "3-5 Years"]
};

export default Resume19;