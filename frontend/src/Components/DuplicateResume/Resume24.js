import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  Container,
  Grid,
  Box,
  Typography,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper
} from "@mui/material";
import {
  ChevronLeft,
  ChevronRight,
  Print,
  Download,
  Phone as PhoneIcon,
  MailOutline as MailOutlineIcon,
  LocationOn as LocationOnIcon,
  Circle as CircleIcon,
  Square as SquareIcon,
  DragIndicator,
  Reorder
} from "@mui/icons-material";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import LanguageIcon from '@mui/icons-material/Language';

export const resumeMeta = {
  hasPhoto: true,
  columns: 2,
};

const pageSizeMap = {
  A4: { width: "210mm", height: "297mm" },
  Letter: { width: "216mm", height: "279mm" },
  Legal: { width: "216mm", height: "356mm" },
  A3: { width: "297mm", height: "420mm" },
  Executive: { width: "184mm", height: "267mm" },
};

// --- Styling Constants (FIXED: Defined here) ---
const darkBlue = '#0A3870';
const lightGrayText = '#ccc';
const sectionHeadingColor = darkBlue;
const secondaryText = '#666';

const defaultData = {
  firstName: "JONATHAN",
  lastName: "PATTERSON",
  currentPosition: "Marketing Manager",
  phone: "+123-456-7890",
  email: "hello@reallygreatsite.com",
  city: "123 Anywhere St., Any City",
  website: "www.reallygreatsite.com",
  profile: "As a marketing manager, I have had the privilege of working with a diverse range of clients across various industries. I have developed marketing methodologies, started 13 new established organizations, and have consistently delivered results that exceeded their expectations.",
  skills: [
    "Management Skills", "Creativity", "Digital Marketing", "Negotiation",
    "Critical Thinking", "Leadership"
  ],
  references: [
    {
      name: "Harumi Kobayashi",
      company: "Salford & Co.",
      position: "CEO",
      phone: "123-456-7890",
      email: "hello@reallygreatsite.com",
    },
    {
      name: "Bailey Dupont",
      company: "Arrowwai Industries",
      position: "CEO",
      phone: "123-456-7890",
      email: "hello@reallygreatsite.com",
    },
  ],
};

// Separate section orders for left and right sides
const defaultLeftSectionOrder = [
  'aboutMe',
  'contact',
  'skills',
  'languages',
  'interests'
];

const defaultRightSectionOrder = [
  'experience',
  'education',
  'certifications',
  'softwareSkills',
  'volunteering',
  'references',
  'accomplishments',
  'websites',
  'additionalInfo'
];

const Resume24 = ({
  color = darkBlue,
  font = "inherit",
  fontSize = "14px",
  headingSize = "24px",
  fontStyle = "normal",
  sectionSpacing = 50,
  paragraphSpacing = 30,
  lineSpacing = 20,
  topBottomMargin = 40,
  sideMargins = 40,
  lineWeight = 1,
  pageSize = "A4",
  formData = {},
  photo = "",
  workExperiences = [],
  exporting = false,
  enableDragDrop = true,
}) => {
  const page = pageSizeMap[pageSize] || pageSizeMap.A4;
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
   // Load only the most recent custom section - SIMPLIFIED VERSION
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
  const savedLeftSectionOrder = localStorage.getItem("resume24LeftSectionOrder");
  if (savedLeftSectionOrder) {
    // 🔥 FIX: Left side-ல custom sections auto add ஆகாது - filter only
    const parsedOrder = JSON.parse(savedLeftSectionOrder);
    const filteredOrder = parsedOrder.filter(section => !section.startsWith('custom_'));
    setLeftSectionOrder(filteredOrder);
    console.log('🔄 Loaded left section order WITHOUT custom sections:', filteredOrder);
  } else {
    setLeftSectionOrder(defaultLeftSectionOrder);
  }

  const savedRightSectionOrder = localStorage.getItem("resume24RightSectionOrder");
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

// Add this useEffect to automatically add/remove custom sections (Resume9 logic)
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
      localStorage.setItem("resume24RightSectionOrder", JSON.stringify(newRightOrder));
      console.log('📝 Final right section order with ONLY CURRENT custom sections:', newRightOrder);
    }
    
    // 🔥 FIX: Left side-லிருந்து custom sections-ஐ remove செய்யவும்
    const currentLeftOrder = [...leftSectionOrder];
    const filteredLeftOrder = currentLeftOrder.filter(section => !section.startsWith('custom_'));
    if (JSON.stringify(filteredLeftOrder) !== JSON.stringify(currentLeftOrder)) {
      setLeftSectionOrder(filteredLeftOrder);
      localStorage.setItem("resume24LeftSectionOrder", JSON.stringify(filteredLeftOrder));
      console.log('🗑️ Removed custom sections from left side:', filteredLeftOrder);
    }
    
  } else if (userId && Object.keys(customSections).length === 0) {
    // If no current custom sections, remove all custom sections from both sides
    const currentRightOrder = [...rightSectionOrder];
    const filteredRightOrder = currentRightOrder.filter(section => !section.startsWith('custom_'));
    
    if (filteredRightOrder.length !== currentRightOrder.length) {
      setRightSectionOrder(filteredRightOrder);
      localStorage.setItem("resume24RightSectionOrder", JSON.stringify(filteredRightOrder));
      console.log('🗑️ Removed all custom sections from right side (no current sections)');
    }
    
    const currentLeftOrder = [...leftSectionOrder];
    const filteredLeftOrder = currentLeftOrder.filter(section => !section.startsWith('custom_'));
    if (filteredLeftOrder.length !== currentLeftOrder.length) {
      setLeftSectionOrder(filteredLeftOrder);
      localStorage.setItem("resume24LeftSectionOrder", JSON.stringify(filteredLeftOrder));
      console.log('🗑️ Removed all custom sections from left side (no current sections)');
    }
  }
}, [customSections]);


  
  // Save section orders to localStorage whenever they change
  useEffect(() => {
    if (leftSectionOrder.length > 0) {
      localStorage.setItem("resume24LeftSectionOrder", JSON.stringify(leftSectionOrder));
    }
  }, [leftSectionOrder]);

  useEffect(() => {
    if (rightSectionOrder.length > 0) {
      localStorage.setItem("resume24RightSectionOrder", JSON.stringify(rightSectionOrder));
    }
  }, [rightSectionOrder]);

 // Add rightSectionOrder to dependencies
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
      'aboutMe': 'About Me',
      'contact': 'Contact',
      'skills': 'Skills',
      'languages': 'Languages',
      'interests': 'Interests',
      'experience': 'Experience',
      'education': 'Education',
      'certifications': 'Certifications',
      'softwareSkills': 'Software Skills',
      'volunteering': 'Volunteering',
      'references': 'References',
      'accomplishments': 'Accomplishments',
      'websites': 'Websites/Profiles',
      'additionalInfo': 'Additional Information'
    };
    
    if (sectionId.startsWith('custom_')) {
      return sectionId.replace('custom_', '').toUpperCase();
    }
    
    return titles[sectionId] || sectionId;
  };

 


  // Function to add font styles to HTML content
  const addFontStylesToHTML = (htmlContent) => {
    // Add font family and style to all elements in the HTML
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

  // --- Language Proficiency Circle Component ---
  const LanguageProficiency = ({ name, proficiency }) => {
    const circleSize = 60;
    const strokeWidth = 5;
    const radius = (circleSize - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (proficiency / 100) * circumference;

    return (
      <Box sx={{ textAlign: 'center', mb: 1, px: 0.5, fontFamily: font }}>
        <svg width={circleSize} height={circleSize} style={{ transform: 'rotate(-90deg)' }}>
          <circle
            stroke={lightGrayText}
            fill="transparent"
            strokeWidth={strokeWidth}
            r={radius}
            cx={circleSize / 2}
            cy={circleSize / 2}
          />
          <circle
            stroke="white"
            fill="transparent"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference + ' ' + circumference}
            style={{ strokeDashoffset: offset }}
            r={radius}
            cx={circleSize / 2}
            cy={circleSize / 2}
          />
        </svg>
        <Typography variant="caption" sx={{ color: 'white', display: 'block', mt: -3, fontFamily: font, fontStyle: fontStyle }}>
          {proficiency}%
        </Typography>
        <Typography variant="body2" sx={{ color: 'white', mt: 0.5, fontFamily: font, fontStyle: fontStyle }}>
          {name}
        </Typography>
      </Box>
    );
  };

  // Render left sidebar sections based on order
  const renderLeftSectionContent = (sectionId) => {
    switch (sectionId) {
      case 'aboutMe':
        return (
          <div className="resume-section">
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1, textTransform: 'uppercase', fontSize: '1.1rem', fontFamily: font, fontStyle: fontStyle }}>
              About Me
            </Typography>
            <Typography variant="body2" sx={{ color: lightGrayText, mb: 4, fontSize: '0.8rem', lineHeight: 1.4, fontFamily: font, fontStyle: fontStyle }}>
              {savedSummary || data.profile}
            </Typography>
          </div>
        );
      
      case 'contact':
        return (
          <div className="resume-section">
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1, textTransform: 'uppercase', fontSize: '1.1rem', fontFamily: font, fontStyle: fontStyle }}>
              Contact
            </Typography>
            <List dense disablePadding sx={{ mb: 4, fontFamily: font }}>
              <ListItem disableGutters sx={{ py: 0.2, fontFamily: font }}>
                <ListItemIcon sx={{ minWidth: 30, fontFamily: font }}><PhoneIcon sx={{ fontSize: 16, color: 'white' }} /></ListItemIcon>
                <ListItemText primary={data.phone} primaryTypographyProps={{ color: 'white', fontSize: '0.8rem', fontFamily: font, fontStyle: fontStyle }} />
              </ListItem>
              <ListItem disableGutters sx={{ py: 0.2, fontFamily: font }}>
                <ListItemIcon sx={{ minWidth: 30, fontFamily: font }}><MailOutlineIcon sx={{ fontSize: 16, color: 'white' }} /></ListItemIcon>
                <ListItemText primary={data.email} primaryTypographyProps={{ color: 'white', fontSize: '0.8rem', fontFamily: font, fontStyle: fontStyle }} />
              </ListItem>
              <ListItem disableGutters sx={{ py: 0.2, fontFamily: font }}>
                <ListItemIcon sx={{ minWidth: 30, fontFamily: font }}><CircleIcon sx={{ fontSize: 16, color: 'transparent' }} /></ListItemIcon>
                <ListItemText primary={data.website} primaryTypographyProps={{ color: 'white', fontSize: '0.8rem', fontFamily: font, fontStyle: fontStyle }} />
              </ListItem>
              <ListItem disableGutters sx={{ py: 0.2, fontFamily: font }}>
                <ListItemIcon sx={{ minWidth: 30, fontFamily: font }}><LocationOnIcon sx={{ fontSize: 16, color: 'white' }} /></ListItemIcon>
                <ListItemText primary={data.city} primaryTypographyProps={{ color: 'white', fontSize: '0.8rem', fontFamily: font, fontStyle: fontStyle }} />
              </ListItem>
            </List>
          </div>
        );
      
      case 'skills':
        return (
          <div className="resume-section">
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1, textTransform: 'uppercase', fontSize: '1.1rem', fontFamily: font, fontStyle: fontStyle }}>
              Skills
            </Typography>
            <List dense disablePadding sx={{ mb: 4, fontFamily: font }}>
              {(savedSkills.length > 0 ? savedSkills : data.skills).map((skill, index) => (
                <ListItem key={index} disableGutters sx={{ py: 0.2, fontFamily: font }}>
                  <ListItemIcon sx={{ minWidth: 30, fontFamily: font }}><CircleIcon sx={{ fontSize: 6, color: 'white' }} /></ListItemIcon>
                  <ListItemText 
                    primary={typeof skill === 'object' ? skill.name : skill} 
                    primaryTypographyProps={{ color: 'white', fontSize: '0.8rem', fontFamily: font, fontStyle: fontStyle }} 
                  />
                </ListItem>
              ))}
            </List>
          </div>
        );
      
      case 'languages':
        return savedLanguages.length > 0 ? (
          <div className="resume-section">
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1, textTransform: 'uppercase', fontSize: '1.1rem', fontFamily: font, fontStyle: fontStyle }}>
              Language
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-around', alignItems: 'flex-end', flexWrap: 'wrap', fontFamily: font }}>
              {savedLanguages.map((lang, index) => (
                <LanguageProficiency key={index} name={lang.name} proficiency={lang.level || 70} />
              ))}
            </Box>
          </div>
        ) : null;
      
      case 'interests':
        return savedInterests.length > 0 ? (
          <div className="resume-section">
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1, textTransform: 'uppercase', fontSize: '1.1rem', mt: 3, fontFamily: font, fontStyle: fontStyle }}>
              Interests
            </Typography>
            {savedInterests.map((interest, index) => (
              <Typography key={index} sx={{ color: 'white', fontSize: '0.8rem', mb: 1, fontFamily: font, fontStyle: fontStyle }}>
                • {interest}
              </Typography>
            ))}
          </div>
        ) : null;
      
    default:
  // Handle sections moved from right side to left sidebar
  if (sectionId.startsWith('custom_')) {
    const customSectionName = sectionId.replace('custom_', '');
    const items = customSections[customSectionName] || [];
    return items.length > 0 ? (
      <div className="resume-section">
        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1, textTransform: 'uppercase', fontSize: '1.1rem', fontFamily: font, fontStyle: fontStyle }}>
          {customSectionName.toUpperCase()}
        </Typography>
        <List dense disablePadding sx={{ mb: 4, fontFamily: font }}>
          {items.map((item, i) => (
            <ListItem key={i} disableGutters sx={{ py: 0.2, fontFamily: font }}>
              <ListItemIcon sx={{ minWidth: 30, fontFamily: font }}><CircleIcon sx={{ fontSize: 6, color: 'white' }} /></ListItemIcon>
              <ListItemText 
                primary={item}
                primaryTypographyProps={{ color: 'white', fontSize: '0.8rem', fontFamily: font, fontStyle: fontStyle }} 
              />
            </ListItem>
          ))}
        </List>
      </div>
    ) : null;
  }

  // Handle right-side sections when they are moved to left sidebar
  return renderRightSectionContent(sectionId, true);
    }
  };

  // Render right main content sections based on order
  const renderRightSectionContent = (sectionId, inSidebar = false) => {
    const textColor = inSidebar ? 'white' : 'inherit';
    const secondaryTextColor = inSidebar ? lightGrayText : secondaryText;
    
    switch (sectionId) {
      case 'experience':
        return (
          <div className="resume-section">
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: inSidebar ? 'white' : color, mb: 2, textTransform: 'uppercase', mt: { xs: 2, sm: 0 }, fontFamily: font, fontStyle: fontStyle }}>
              Experience
            </Typography>
            {workExperiences && workExperiences.length > 0 ? (
              workExperiences.map((exp, index) => (
                <Box key={index} sx={{ mb: 2, fontFamily: font }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5, fontFamily: font }}>
                    <Typography variant="body1" sx={{ fontWeight: 'bold', color: inSidebar ? 'white' : color, fontFamily: font, fontStyle: fontStyle }}>
                      {exp.employer}
                    </Typography>
                    <Typography variant="caption" sx={{ color: secondaryTextColor, fontFamily: font, fontStyle: fontStyle }}>
                      {formatDate(exp.startMonth, exp.startYear)} - {exp.current ? "Present" : formatDate(exp.endMonth, exp.endYear)}
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ fontWeight: 'bold', color: secondaryTextColor, mb: 1, fontFamily: font, fontStyle: fontStyle }}>
                    {exp.jobTitle}
                  </Typography>
                  {exp.description && (
                    <Box
                      sx={{ 
                        mt: 1, 
                        fontFamily: font,
                        color: textColor,
                        "& strong": { fontWeight: "bold", fontFamily: font }, 
                        "& em": { fontStyle: "italic", fontFamily: font }, 
                        "& u": { textDecoration: "underline", fontFamily: font } 
                      }}
                      dangerouslySetInnerHTML={{
                        __html: exp.description
                          .replace(/\*\*(.*?)\*\*/g, `<strong style="font-family: ${font}; font-weight: bold; font-style: ${fontStyle}; color: ${textColor}">$1</strong>`)
                          .replace(/\*(.*?)\*/g, `<em style="font-family: ${font}; font-style: italic; color: ${textColor}">$1</em>`)
                          .replace(/<u>(.*?)<\/u>/g, `<u style="font-family: ${font}; color: ${textColor}">$1</u>`)
                          .replace(/\n/g, `<br style="font-family: ${font}" />`),
                      }}
                    />
                  )}
                </Box>
              ))
            ) : (
              <Typography sx={{ fontSize: fontSize, fontFamily: font, fontStyle: fontStyle, color: textColor }}>No work experiences added yet.</Typography>
            )}
          </div>
        );
      
      case 'education':
        return educationEntries.length > 0 ? (
          <div className="resume-section">
            <Divider sx={{ my: 3, borderColor: inSidebar ? 'rgba(255,255,255,0.3)' : '#e0e0e0' }} />
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: inSidebar ? 'white' : color, mb: 2, textTransform: 'uppercase', fontFamily: font, fontStyle: fontStyle }}>
              Education
            </Typography>
            {educationEntries.map((edu, index) => (
              <Box key={index} sx={{ mb: 2, fontFamily: font }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5, fontFamily: font }}>
                  <Typography variant="body1" sx={{ fontWeight: 'bold', color: inSidebar ? 'white' : color, fontFamily: font, fontStyle: fontStyle }}>
                    {edu.schoolName}
                  </Typography>
                  <Typography variant="caption" sx={{ color: secondaryTextColor, fontFamily: font, fontStyle: fontStyle }}>
                    {formatDate(edu.gradMonth, edu.gradYear)}
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ fontWeight: 'bold', color: secondaryTextColor, fontSize: '0.9rem', fontFamily: font, fontStyle: fontStyle }}>
                  {edu.degree} {edu.fieldOfStudy ? `- ${edu.fieldOfStudy}` : ''}
                </Typography>
              </Box>
            ))}
          </div>
        ) : null;
      
      case 'certifications':
        return savedCertifications.length > 0 ? (
          <div className="resume-section">
            <Divider sx={{ my: 3, borderColor: inSidebar ? 'rgba(255,255,255,0.3)' : '#e0e0e0' }} />
            <Box sx={{ mb: 2, fontFamily: font }}>
              <Typography variant="h5" sx={{ fontWeight: 'bold', color: inSidebar ? 'white' : color, mb: 2, textTransform: 'uppercase', fontFamily: font, fontStyle: fontStyle }}>
                Certifications
              </Typography>
              {savedCertifications.map((cert, index) => (
                <Box key={index} sx={{ mb: 2, fontFamily: font }}>
                  <Typography variant="body1" sx={{ fontWeight: 'bold', color: inSidebar ? 'white' : color, fontFamily: font, fontStyle: fontStyle }}>
                    {cert.name}
                  </Typography>
                  <Typography variant="body2" sx={{ color: secondaryTextColor, mb: 0.5, fontFamily: font, fontStyle: fontStyle }}>
                    {cert.provider} • {cert.year}
                  </Typography>
                  {cert.description && (
                    <Typography variant="body2" sx={{ fontSize: fontSize, fontFamily: font, fontStyle: fontStyle, color: textColor }}>
                      {cert.description}
                    </Typography>
                  )}
                </Box>
              ))}
            </Box>
          </div>
        ) : null;

         case 'aboutMe':
      return (
        <div className="resume-section">
          <Typography variant="h5" sx={{ fontWeight: 'bold', color: inSidebar ? 'white' : color, mb: 2, textTransform: 'uppercase', mt: { xs: 2, sm: 0 }, fontFamily: font, fontStyle: fontStyle }}>
            About Me
          </Typography>
          <Typography variant="body1" sx={{ color: textColor, mb: 4, fontSize: fontSize, lineHeight: 1.6, fontFamily: font, fontStyle: fontStyle }}>
            {savedSummary || data.profile}
          </Typography>
        </div>
      );
    
    case 'contact':
      return (
        <div className="resume-section">
          <Typography variant="h5" sx={{ fontWeight: 'bold', color: inSidebar ? 'white' : color, mb: 2, textTransform: 'uppercase', fontFamily: font, fontStyle: fontStyle }}>
            Contact
          </Typography>
          <Box sx={{ mb: 4, fontFamily: font }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5, fontFamily: font }}>
              <PhoneIcon sx={{ fontSize: 18, mr: 1.5, color: inSidebar ? 'white' : color }} />
              <Typography variant="body1" sx={{ color: textColor, fontSize: fontSize, fontFamily: font, fontStyle: fontStyle }}>
                {data.phone}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5, fontFamily: font }}>
              <MailOutlineIcon sx={{ fontSize: 18, mr: 1.5, color: inSidebar ? 'white' : color }} />
              <Typography variant="body1" sx={{ color: textColor, fontSize: fontSize, fontFamily: font, fontStyle: fontStyle }}>
                {data.email}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5, fontFamily: font }}>
              <LanguageIcon sx={{ fontSize: 18, mr: 1.5, color: inSidebar ? 'white' : color }} />
              <Typography variant="body1" sx={{ color: textColor, fontSize: fontSize, fontFamily: font, fontStyle: fontStyle }}>
                {data.website}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5, fontFamily: font }}>
              <LocationOnIcon sx={{ fontSize: 18, mr: 1.5, color: inSidebar ? 'white' : color }} />
              <Typography variant="body1" sx={{ color: textColor, fontSize: fontSize, fontFamily: font, fontStyle: fontStyle }}>
                {data.city}
              </Typography>
            </Box>
          </Box>
        </div>
      );
    
    case 'skills':
      return (
        <div className="resume-section">
          <Typography variant="h5" sx={{ fontWeight: 'bold', color: inSidebar ? 'white' : color, mb: 2, textTransform: 'uppercase', fontFamily: font, fontStyle: fontStyle }}>
            Skills
          </Typography>
          <Box sx={{ mb: 4, fontFamily: font }}>
            {(savedSkills.length > 0 ? savedSkills : data.skills).map((skill, index) => (
              <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1, fontFamily: font }}>
                <CircleIcon sx={{ fontSize: 6, mr: 1.5, color: inSidebar ? 'white' : color }} />
                <Typography variant="body1" sx={{ color: textColor, fontSize: fontSize, fontFamily: font, fontStyle: fontStyle }}>
                  {typeof skill === 'object' ? skill.name : skill}
                </Typography>
              </Box>
            ))}
          </Box>
        </div>
      );
    
    case 'languages':
      return savedLanguages.length > 0 ? (
        <div className="resume-section">
          <Typography variant="h5" sx={{ fontWeight: 'bold', color: inSidebar ? 'white' : color, mb: 2, textTransform: 'uppercase', fontFamily: font, fontStyle: fontStyle }}>
            Languages
          </Typography>
          <Box sx={{ mb: 4, fontFamily: font }}>
            {savedLanguages.map((lang, index) => (
              <Box key={index} sx={{ mb: 2, fontFamily: font }}>
                <Typography variant="body1" sx={{ fontWeight: 'bold', color: textColor, fontSize: fontSize, mb: 0.5, fontFamily: font, fontStyle: fontStyle }}>
                  {typeof lang === 'object' ? lang.language || lang.name : lang}
                </Typography>
                {typeof lang === 'object' && lang.level && (
                  <Box sx={{ 
                    width: '100%', 
                    height: '8px', 
                    backgroundColor: inSidebar ? 'rgba(255,255,255,0.3)' : lightGrayText,
                    borderRadius: '4px',
                    overflow: 'hidden',
                    fontFamily: font,
                  }}>
                    <Box 
                      sx={{ 
                        width: `${lang.level}%`, 
                        height: '100%', 
                        backgroundColor: inSidebar ? 'white' : color,
                        fontFamily: font,
                      }} 
                    />
                  </Box>
                )}
              </Box>
            ))}
          </Box>
        </div>
      ) : null;
    
    case 'interests':
      return savedInterests.length > 0 ? (
        <div className="resume-section">
          <Typography variant="h5" sx={{ fontWeight: 'bold', color: inSidebar ? 'white' : color, mb: 2, textTransform: 'uppercase', fontFamily: font, fontStyle: fontStyle }}>
            Interests
          </Typography>
          <Box sx={{ mb: 4, fontFamily: font }}>
            {savedInterests.map((interest, index) => (
              <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1, fontFamily: font }}>
                <CircleIcon sx={{ fontSize: 6, mr: 1.5, color: inSidebar ? 'white' : color }} />
                <Typography variant="body1" sx={{ color: textColor, fontSize: fontSize, fontFamily: font, fontStyle: fontStyle }}>
                  {interest}
                </Typography>
              </Box>
            ))}
          </Box>
        </div>
      ) : null;
    
      
      case 'softwareSkills':
        return softwareSkills.length > 0 ? (
          <div className="resume-section">
            <Divider sx={{ my: 3, borderColor: inSidebar ? 'rgba(255,255,255,0.3)' : '#e0e0e0' }} />
            <Box sx={{ mb: 2, fontFamily: font }}>
              <Typography variant="h5" sx={{ fontWeight: 'bold', color: inSidebar ? 'white' : color, mb: 2, textTransform: 'uppercase', fontFamily: font, fontStyle: fontStyle }}>
                Software Skills
              </Typography>
              <Grid container spacing={1} sx={{ fontFamily: font }}>
                {softwareSkills.map((skill, index) => (
                  <Grid item xs={6} key={index} sx={{ fontFamily: font }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1, fontFamily: font }}>
                      <Typography variant="body2" sx={{ fontSize: fontSize, fontFamily: font, fontStyle: fontStyle, color: textColor }}>
                        {skill.name}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', fontFamily: font }}>
                        <Box sx={{ 
                          width: '60px', 
                          height: '6px', 
                          backgroundColor: inSidebar ? 'rgba(255,255,255,0.3)' : lightGrayText,
                          borderRadius: '3px',
                          overflow: 'hidden',
                          mr: 1,
                          fontFamily: font,
                        }}>
                          <Box 
                            sx={{ 
                              width: `${skill.level}%`, 
                              height: '100%', 
                              backgroundColor: inSidebar ? 'white' : color,
                              fontFamily: font,
                            }} 
                          />
                        </Box>
                        <Typography variant="caption" sx={{ fontSize: '0.7rem', fontFamily: font, fontStyle: fontStyle, color: textColor }}>
                          {skill.level}%
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </div>
        ) : null;
      
      case 'volunteering':
        return savedVolunteering.length > 0 ? (
          <div className="resume-section">
            <Divider sx={{ my: 3, borderColor: inSidebar ? 'rgba(255,255,255,0.3)' : '#e0e0e0' }} />
            <Box sx={{ mb: 2, fontFamily: font }}>
              <Typography variant="h5" sx={{ fontWeight: 'bold', color: inSidebar ? 'white' : color, mb: 2, textTransform: 'uppercase', fontFamily: font, fontStyle: fontStyle }}>
                Volunteering
              </Typography>
              {savedVolunteering.map((vol, index) => (
                <Box key={index} sx={{ mb: 2, fontFamily: font }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5, fontFamily: font }}>
                    <Typography variant="body1" sx={{ fontWeight: 'bold', color: inSidebar ? 'white' : color, fontFamily: font, fontStyle: fontStyle }}>
                      {vol.subtopic}
                    </Typography>
                    <Typography variant="caption" sx={{ color: secondaryTextColor, fontFamily: font, fontStyle: fontStyle }}>
                      {vol.fromDate} - {vol.toDate}
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ fontSize: fontSize, whiteSpace: "pre-line", fontFamily: font, fontStyle: fontStyle, color: textColor }}>
                    {vol.content}
                  </Typography>
                </Box>
              ))}
            </Box>
          </div>
        ) : null;
      
      case 'references':
        return (savedReferences.length > 0 || data.references.length > 0) ? (
          <div className="resume-section">
            <Divider sx={{ my: 3, borderColor: inSidebar ? 'rgba(255,255,255,0.3)' : '#e0e0e0' }} />
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: inSidebar ? 'white' : color, mb: 2, textTransform: 'uppercase', fontFamily: font, fontStyle: fontStyle }}>
              References
            </Typography>
            <Grid container spacing={2} sx={{ fontFamily: font }}>
              {(savedReferences.length > 0 ? savedReferences : data.references).map((ref, index) => (
                <Grid item xs={12} sm={6} key={index} sx={{ fontFamily: font }}>
                  <Typography variant="body1" sx={{ fontWeight: 'bold',  fontFamily: font, fontStyle: fontStyle }}>
                    {typeof ref === 'object' ? ref.name : ref}
                  </Typography>
                  {typeof ref === 'object' && (
                    <>
                      <Typography variant="body2" sx={{ color: secondaryTextColor, fontSize: '0.85rem', fontFamily: font, fontStyle: fontStyle }}>
                        {ref.position} @ {ref.company}
                      </Typography>
                      <Typography variant="body2" sx={{ color: secondaryTextColor, fontSize: '0.85rem', fontFamily: font, fontStyle: fontStyle }}>
                        Phone: {ref.phone}
                      </Typography>
                      <Typography variant="body2" sx={{ color: secondaryTextColor, fontSize: '0.85rem', fontFamily: font, fontStyle: fontStyle }}>
                        Email: {ref.email}
                      </Typography>
                    </>
                  )}
                </Grid>
              ))}
            </Grid>
          </div>
        ) : null;
      
      case 'accomplishments':
        return savedAccomplishments.length > 0 ? (
          <div className="resume-section">
            <Divider sx={{ my: 3, borderColor: inSidebar ? 'rgba(255,255,255,0.3)' : '#e0e0e0' }} />
            <Box sx={{ mb: 2, fontFamily: font }}>
              <Typography variant="h5" sx={{ fontWeight: 'bold', color: inSidebar ? 'white' : color, mb: 2, textTransform: 'uppercase', fontFamily: font, fontStyle: fontStyle }}>
                Accomplishments
              </Typography>
              {savedAccomplishments.map((acc, index) => (
                <Typography key={index} sx={{ mb: `${paragraphSpacing / 10}px`, fontSize: fontSize, fontFamily: font, fontStyle: fontStyle, color: textColor }} whiteSpace="pre-line">
                  • {acc}
                </Typography>
              ))}
            </Box>
          </div>
        ) : null;
      
      case 'websites':
        return savedWebsites.length > 0 ? (
          <div className="resume-section">
            <Divider sx={{ my: 3, borderColor: inSidebar ? 'rgba(255,255,255,0.3)' : '#e0e0e0' }} />
            <Box sx={{ mb: 2, fontFamily: font }}>
              <Typography variant="h5" sx={{ fontWeight: 'bold', color: inSidebar ? 'white' : color, mb: 2, textTransform: 'uppercase', fontFamily: font, fontStyle: fontStyle }}>
                Websites / Profiles
              </Typography>
              {savedWebsites.map((site, index) => (
                <Typography key={index} sx={{ mb: `${paragraphSpacing / 10}px`, fontSize: fontSize, fontFamily: font, fontStyle: fontStyle, color: textColor }}>
                  {site.url} {site.addToHeader ? "(Shown in Header)" : ""}
                </Typography>
              ))}
            </Box>
          </div>
        ) : null;
      
      case 'additionalInfo':
        return savedAdditionalInfo.length > 0 ? (
          <div className="resume-section">
            <Divider sx={{ my: 3, borderColor: inSidebar ? 'rgba(255,255,255,0.3)' : '#e0e0e0' }} />
            <Box sx={{ mb: 2, fontFamily: font }}>
              <Typography variant="h5" sx={{ fontWeight: 'bold', color: inSidebar ? 'white' : color, mb: 2, textTransform: 'uppercase', fontFamily: font, fontStyle: fontStyle }}>
                Additional Information
              </Typography>
              {savedAdditionalInfo.map((info, index) => (
                <Typography key={index} sx={{ mb: `${paragraphSpacing / 10}px`, fontSize: fontSize, fontFamily: font, fontStyle: fontStyle, color: textColor }}>
                  {info}
                </Typography>
              ))}
            </Box>
          </div>
        ) : null;
      
     default:
  if (sectionId.startsWith('custom_')) {
    const customSectionName = sectionId.replace('custom_', '');
    const items = customSections[customSectionName] || [];
    
    console.log(`🎯 Rendering custom section: ${customSectionName}`, items);
    
    if (items && items.length > 0) {
      return (
        <div className="resume-section">
          <Divider sx={{ my: 3, borderColor: inSidebar ? 'rgba(255,255,255,0.3)' : '#e0e0e0' }} />
          <Box sx={{ mb: 2, fontFamily: font }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: inSidebar ? 'white' : color, mb: 2, textTransform: 'uppercase', fontFamily: font, fontStyle: fontStyle }}>
              {customSectionName.toUpperCase()}
            </Typography>
            {items.map((item, i) => (
              <Typography key={i} sx={{ mb: `${paragraphSpacing / 10}px`, fontSize: fontSize, fontFamily: font, fontStyle: fontStyle, color: textColor }} whiteSpace="pre-line">
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
  return null;
  }
};
    

  const paginateContent = useCallback(() => {
    if (!mainContentRef.current || !sidebarContentRef.current) return;

    const mainSections = Array.from(mainContentRef.current.querySelectorAll('.resume-section'));
    const sidebarSections = Array.from(sidebarContentRef.current.querySelectorAll('.resume-section'));
    
    const pageHeightInPx = parseFloat(page.height.replace('mm', '')) * 3.78;
    const mainAvailableHeight = pageHeightInPx - (2 * topBottomMargin);
    const sidebarAvailableHeight = pageHeightInPx - (2 * topBottomMargin);

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
      
      // If adding this section to the current page exceeds the limit
      if (currentMainHeight + sectionHeight > mainAvailableHeight) {
        // Start a new page
        newPages.push({
          main: currentMainPageSections,
          sidebar: currentSidebarPageSections,
        });
        currentMainPageSections = [section];
        currentMainHeight = sectionHeight;
        currentSidebarPageSections = [];
        currentSidebarHeight = 0;
      } else {
        // Add to the current page
        currentMainPageSections.push(section);
        currentMainHeight += sectionHeight;
      }
    });
    
    // Distribute sidebar content across pages
    sidebarSections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      
      // Find the appropriate page for this sidebar section
      let targetPageIndex = 0;
      let minHeightDiff = Infinity;
      
      // Find the page with the least height difference between main and sidebar
      newPages.forEach((page, index) => {
        const mainHeight = page.main.reduce((sum, s) => sum + s.offsetHeight, 0);
        const sidebarHeight = page.sidebar.reduce((sum, s) => sum + s.offsetHeight, 0);
        const heightDiff = Math.abs(mainHeight - (sidebarHeight + sectionHeight));
        
        if (heightDiff < minHeightDiff && (sidebarHeight + sectionHeight) <= sidebarAvailableHeight) {
          minHeightDiff = heightDiff;
          targetPageIndex = index;
        }
      });
      
      // If no suitable page found or it's the first section, add to current page
      if (newPages.length === 0 || minHeightDiff === Infinity) {
        if (currentSidebarHeight + sectionHeight <= sidebarAvailableHeight) {
          currentSidebarPageSections.push(section);
          currentSidebarHeight += sectionHeight;
        } else {
          // Start new page if current sidebar is full
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
        // Add to existing page
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
  }, [page.height, topBottomMargin]);

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
  ]);

  const renderSidebarContentToMeasure = () => (
    <Box ref={sidebarContentRef} sx={{ visibility: 'hidden', position: 'absolute', fontFamily: font }}>
      <Box sx={{ 
        p: 4, 
        bgcolor: color, 
        color: 'white', 
        height: '100%',
        pb: { xs: 4, sm: 4 },
        borderBottomLeftRadius: '50px', 
        borderBottomRightRadius: { xs: '0', sm: '50px' },
        borderTopLeftRadius: '5px',
        fontFamily: font,
        fontSize: fontSize,
        fontStyle: fontStyle,
        lineHeight: `${lineSpacing}px`,
      }}>
        {/* Render left side sections in the specified order */}
        {leftSectionOrder.map(sectionId => (
          <React.Fragment key={sectionId}>
            {renderLeftSectionContent(sectionId)}
          </React.Fragment>
        ))}
      </Box>
    </Box>
  );

  const renderMainContentToMeasure = () => (
    <Box ref={mainContentRef} sx={{ visibility: 'hidden', position: 'absolute', fontFamily: font }}>
      <Box sx={{ p: `${topBottomMargin}px ${sideMargins}px`, fontFamily: font, fontSize: fontSize, fontStyle: fontStyle, lineHeight: `${lineSpacing}px` }}>
        {/* Name & Title Section */}
        <div className="resume-section">
          <Box sx={{display:"flex", justifyContent: "space-between", alignItems: "flex-start", fontFamily: font}}>
            <Box sx={{ fontFamily: font }}>
              <Typography variant="h3" sx={{ fontWeight: '900', color: color, lineHeight: 1.1, fontFamily: font, fontStyle: fontStyle }}>
                {data.firstName} {data.lastName}
              </Typography>
              <Typography variant="h6" sx={{ color: secondaryText, mb: 3, fontSize: '1.2rem', fontFamily: font, fontStyle: fontStyle }}>
                {data.currentPosition}
              </Typography>
            </Box>

            {/* Profile Image - Capsule Shape */}
            {photo && (
              <Box sx={{ 
                width: '150px', 
                height: '120px', 
                borderRadius: '90px / 120px', 
                overflow: 'hidden', 
                ml: 3, 
                mb: 3,
                boxShadow: 3,
                fontFamily: font,
              }}>
                <Avatar 
                  src={photo}
                  sx={{ 
                    width: '100%', 
                    height: '100%', 
                    borderRadius: '0',
                    objectFit: 'cover'
                  }} 
                />
              </Box>
            )}
          </Box>
        </div>

        {/* Render right side sections in the specified order */}
        {rightSectionOrder.map(sectionId => (
          <React.Fragment key={sectionId}>
            {renderRightSectionContent(sectionId)}
          </React.Fragment>
        ))}
      </Box>
    </Box>
  );

  const renderSidebarContent = (sidebarSections = []) => {
    if (sidebarSections.length === 0) {
      return (
        <Box sx={{ 
          minHeight: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          fontFamily: font,
        }}>
          {/* Empty sidebar - just the colored background */}
          <Box sx={{ flexGrow: 1 }}>
            {/* This empty box takes up remaining space */}
          </Box>
        </Box>
      );
    }

    return (
      <Box display="flex" flexDirection="column" sx={{ 
        flexGrow: 1,
        minHeight: "100%",
        justifyContent: "flex-start",
        fontFamily: font,
      }}>
        {sidebarSections.map((section, index) => (
          <div key={index} dangerouslySetInnerHTML={{ __html: section.outerHTML }} />
        ))}
      </Box>
    );
  };

  return (
    <Box sx={{ width: "100%", position: "relative", m: 5, fontFamily: font }}>
      {!exporting && (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 2, gap: 2, '@media print': { display: 'none' }, fontFamily: font }}>
          <IconButton onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))} disabled={currentPage === 0} color="primary" sx={{ fontFamily: font }}><ChevronLeft /></IconButton>
          <Typography sx={{ mx: 2, fontFamily: font }}>Page {currentPage + 1} of {Math.max(1, pages.length)}</Typography>
          <IconButton onClick={() => setCurrentPage(prev => Math.min(pages.length - 1, prev + 1))} disabled={currentPage === Math.max(0, pages.length - 1)} color="primary" sx={{ fontFamily: font }}><ChevronRight /></IconButton>
          
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
      
      <Box id="resume-container" sx={{ fontFamily: font }}>
        {pages.length > 0 ? (
          pages.map((pageContent, index) => (
            <Box
              key={index}
              className="resume-page"
              sx={{
                width: page.width,
                height: page.height,
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
                overflow: "hidden",
                "@media print": {
                  width: page.width,
                  height: page.height,
                  boxShadow: "none",
                  m: 0,
                  fontFamily: font,
                  fontSize: fontSize,
                  fontStyle: fontStyle,
                },
                // Show all pages when exporting, only current page when viewing
                display: exporting ? 'flex' : (index === currentPage ? 'flex' : 'none'),
                '@media print': { display: 'flex' }
              }}
            >
              <Grid container sx={{ height: "100%", margin: 0, fontFamily: font }}>
                {/* Sidebar Column - Fixed A4 Height */}
                <Grid
                  item
                  xs={12}
                  md={4}
                  sx={{
                    width: "30%",
                    height: "100%",
                    margin: 0,
                    padding: 0,
                    fontFamily: font,
                    "@media print": {
                      width: "30%",
                      height: "100%",
                      bgcolor: color,
                      color: "white",
                      WebkitPrintColorAdjust: "exact",
                      printColorAdjust: "exact",
                      margin: 0,
                      padding: 0,
                      fontFamily: font,
                    },
                  }}
                >
                  <Box sx={{ 
                    backgroundColor: color,
                    color: 'white',
                    p: 4,
                    height: "100%",
                    margin: 0,
                    borderBottomLeftRadius: '50px', 
                    borderBottomRightRadius: { xs: '0', sm: '50px' },
                    borderTopLeftRadius: '5px',
                    display: "flex",
                    flexDirection: "column",
                    fontFamily: font,
                    fontSize: fontSize,
                    fontStyle: fontStyle,
                    lineHeight: `${lineSpacing}px`,
                    "@media print": {
                      bgcolor: color,
                      color: "white",
                      WebkitPrintColorAdjust: "exact",
                      printColorAdjust: "exact",
                      height: "100%",
                      borderBottomLeftRadius: '50px', 
                      borderBottomRightRadius: '50px',
                      borderTopLeftRadius: '5px',
                      margin: 0,
                      fontFamily: font,
                      fontSize: fontSize,
                      fontStyle: fontStyle,
                    },
                  }}>
                    {renderSidebarContent(pageContent.sidebar)}
                  </Box>
                </Grid>

                {/* Main Content Column */}
                <Grid
                  item
                  xs={12}
                  md={8}
                  sx={{
                    p: `${topBottomMargin}px ${sideMargins}px`,
                    width: "70%",
                    height: "100%",
                    margin: 0,
                    fontFamily: font,
                    fontSize: fontSize,
                    fontStyle: fontStyle,
                    lineHeight: `${lineSpacing}px`,
                    "@media print": { 
                      p: 2,
                      height: "100%",
                      margin: 0,
                      overflow: "visible",
                      fontFamily: font,
                      fontSize: fontSize,
                      fontStyle: fontStyle,
                    },
                  }}
                >
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
              </Grid>
            </Box>
          ))
        ) : (
          <Box
            className="resume-page"
            sx={{
              width: page.width,
              height: page.height,
              mx: "auto",
              bgcolor: "#fff",
              boxShadow: 3,
              fontFamily: font,
              fontSize: fontSize,
              fontStyle: fontStyle,
              lineHeight: `${lineSpacing}px`,
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              "@media print": {
                width: page.width,
                height: page.height,
                boxShadow: "none",
                m: 0,
                fontFamily: font,
                fontSize: fontSize,
                fontStyle: fontStyle,
              },
            }}
          >
            <Grid container sx={{ height: "100%", margin: 0, fontFamily: font }}>
              <Grid
                item
                xs={12}
                md={4}
                sx={{
                  width: "30%",
                  height: "100%",
                  margin: 0,
                  padding: 0,
                  fontFamily: font,
                }}
              >
                <Box sx={{ 
                  backgroundColor: color,
                  color: 'white',
                  p: 4,
                  height: "100%",
                  margin: 0,
                  borderBottomLeftRadius: '50px', 
                  borderBottomRightRadius: { xs: '0', sm: '50px' },
                  borderTopLeftRadius: '5px',
                  display: "flex",
                  flexDirection: "column",
                  fontFamily: font,
                  fontSize: fontSize,
                  fontStyle: fontStyle,
                  lineHeight: `${lineSpacing}px`,
                  "@media print": {
                    bgcolor: color,
                    color: "white",
                    WebkitPrintColorAdjust: "exact",
                    printColorAdjust: "exact",
                    height: "100%",
                    margin: 0,
                    fontFamily: font,
                    fontSize: fontSize,
                    fontStyle: fontStyle,
                  },
                }}>
                  {renderSidebarContent()}
                </Box>
              </Grid>
              <Grid
                item
                xs={12}
                md={8}
                sx={{
                  p: `${topBottomMargin}px ${sideMargins}px`,
                  width: "70%",
                  height: "100%",
                  margin: 0,
                  fontFamily: font,
                  fontSize: fontSize,
                  fontStyle: fontStyle,
                  lineHeight: `${lineSpacing}px`,
                  "@media print": { 
                    p: 2,
                    height: "100%",
                    margin: 0,
                    fontFamily: font,
                    fontSize: fontSize,
                    fontStyle: fontStyle,
                  },
                }}
              >
                <Typography sx={{ fontFamily: font, fontStyle: fontStyle }}>Loading resume...</Typography>
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

export default Resume24;