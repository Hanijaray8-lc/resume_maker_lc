import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  Container,
  Grid,
  Box,
  Typography,
  Avatar,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Button,
  IconButton,
  Divider,
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
  Phone as PhoneIcon,
  MailOutline as MailOutlineIcon,
  LocationOn as LocationOnIcon,
  Language as LanguageIcon,
  Star as StarIcon,
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
  Executive: { width: "184mm", height: "267mm" },
};

// --- Styling Constants ---
const darkBg = '#1A202C'; 
const lightViolet = '#C0A0E0'; 
const darkViolet = '#7F509E'; 
const textGray = '#E0E0E0'; 
const lightText = '#555';    
const lightGrayText = '#ccc'; 
const lineViolet = darkViolet;

const defaultData = {
  firstName: "JULIANA",
  lastName: "SILVA",
  currentPosition: "GRAPHIC DESIGNER",
  phone: "+123-456-7890",
  email: "hello@reallygreatsite.com",
  city: "123 Anywhere St., Any City",
  website: "www.reallygreatsite.com",
  profile: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.",
  skills: [
    { name: "Skill 1", proficiency: 80 },
    { name: "Skill 2", proficiency: 90 },
    { name: "Skill 3", proficiency: 75 },
    { name: "Skill 4", proficiency: 60 }
  ],
  languages: [
    { name: "Indonesian" },
    { name: "English" }
  ],
  experience: [
    {
      years: "2017-2022",
      title: "LEADER PROJECT",
      company: "Borcelle Company",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation."
    },
    {
      years: "2014-2017",
      title: "SENIOR GRAPHIC DESIGNER",
      company: "Borcelle Company",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation."
    },
    {
      years: "2012-2014",
      title: "JUNIOR GRAPHIC DESIGNER",
      company: "Borcelle Company",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation."
    }
  ],
  education: [
    {
      years: "2015-2017",
      degree: "Master Of Graphic Designer",
      institution: "Borcelle University"
    },
    {
      years: "2010-2014",
      degree: "Major Of Graphic Designer",
      institution: "Borcelle University"
    }
  ],
  interests: ["Photography", "Travel", "Reading", "Music"],
  references: [
    {
      name: "John Smith",
      position: "Creative Director",
      company: "Design Studio Inc.",
      contact: "john@designstudio.com"
    },
    {
      name: "Sarah Johnson",
      position: "Art Director", 
      company: "Creative Agency Ltd.",
      contact: "sarah@creativeagency.com"
    }
  ]
};

// Separate section orders for left and right sides
const defaultLeftSectionOrder = [
  'profilePhoto',
  'aboutMe',
  'skills',
  'languages',
  'interests'
];

const defaultRightSectionOrder = [
  'nameTitle',
  'contact',
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

const Resume25 = ({
  color = darkBg,
  accentColor = lightViolet,
  font = "inherit",
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

    // Load only the most recent custom section
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
  const savedLeftSectionOrder = localStorage.getItem("resume25LeftSectionOrder");
  if (savedLeftSectionOrder) {
    // 🔥 FIX: Left side-ல custom sections auto add ஆகாது - filter only
    const parsedOrder = JSON.parse(savedLeftSectionOrder);
    const filteredOrder = parsedOrder.filter(section => !section.startsWith('custom_'));
    setLeftSectionOrder(filteredOrder);
    console.log('🔄 Loaded left section order WITHOUT custom sections:', filteredOrder);
  } else {
    setLeftSectionOrder(defaultLeftSectionOrder);
  }

  const savedRightSectionOrder = localStorage.getItem("resume25RightSectionOrder");
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
      localStorage.setItem("resume25RightSectionOrder", JSON.stringify(newRightOrder));
      console.log('📝 Final right section order with ONLY CURRENT custom sections:', newRightOrder);
    }
    
    // 🔥 FIX: Left side-லிருந்து custom sections-ஐ remove செய்யவும்
    const currentLeftOrder = [...leftSectionOrder];
    const filteredLeftOrder = currentLeftOrder.filter(section => !section.startsWith('custom_'));
    if (JSON.stringify(filteredLeftOrder) !== JSON.stringify(currentLeftOrder)) {
      setLeftSectionOrder(filteredLeftOrder);
      localStorage.setItem("resume25LeftSectionOrder", JSON.stringify(filteredLeftOrder));
      console.log('🗑️ Removed custom sections from left side:', filteredLeftOrder);
    }
    
  } else if (userId && Object.keys(customSections).length === 0) {
    // If no current custom sections, remove all custom sections from both sides
    const currentRightOrder = [...rightSectionOrder];
    const filteredRightOrder = currentRightOrder.filter(section => !section.startsWith('custom_'));
    
    if (filteredRightOrder.length !== currentRightOrder.length) {
      setRightSectionOrder(filteredRightOrder);
      localStorage.setItem("resume25RightSectionOrder", JSON.stringify(filteredRightOrder));
      console.log('🗑️ Removed all custom sections from right side (no current sections)');
    }
    
    const currentLeftOrder = [...leftSectionOrder];
    const filteredLeftOrder = currentLeftOrder.filter(section => !section.startsWith('custom_'));
    if (filteredLeftOrder.length !== currentLeftOrder.length) {
      setLeftSectionOrder(filteredLeftOrder);
      localStorage.setItem("resume25LeftSectionOrder", JSON.stringify(filteredLeftOrder));
      console.log('🗑️ Removed all custom sections from left side (no current sections)');
    }
  }
}, [customSections]);

  // Save section orders to localStorage whenever they change
  useEffect(() => {
    if (leftSectionOrder.length > 0) {
      localStorage.setItem("resume25LeftSectionOrder", JSON.stringify(leftSectionOrder));
    }
  }, [leftSectionOrder]);

  useEffect(() => {
    if (rightSectionOrder.length > 0) {
      localStorage.setItem("resume25RightSectionOrder", JSON.stringify(rightSectionOrder));
    }
  }, [rightSectionOrder]);

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
      'profilePhoto': 'Profile Photo',
      'aboutMe': 'About Me',
      'skills': 'Skills',
      'languages': 'Languages',
      'interests': 'Interests',
      'nameTitle': 'Name & Title',
      'contact': 'Contact',
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

  // --- Centered Heading Component with Lines ---
  const CenteredHeadingWithLines = ({ title, lineColor = lineViolet, centerBg = darkViolet }) => (
    <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        mb: mergedDesignSettings.sectionSpacing / 20, 
        width: '100%',
        fontFamily: mergedDesignSettings.font,
    }}>
        <Box sx={{ flexGrow: 1, height: `${mergedDesignSettings.lineWeight}px`, backgroundColor: lineColor, borderRadius: '5px', maxWidth: '30px' }} />
        <Box 
            sx={{ 
                backgroundColor: centerBg, 
                color: 'white', 
                px: 3, 
                py: 1, 
                mx: 2, 
                borderRadius: '20px', 
                fontWeight: 'bold',
                textTransform: 'uppercase',
                fontSize: `calc(${mergedDesignSettings.headingSize} * 0.75)`,
                whiteSpace: 'nowrap',
                fontFamily: mergedDesignSettings.font,
                fontStyle: mergedDesignSettings.fontStyle,
            }}
        >
            {title}
        </Box>
        <Box sx={{ flexGrow: 1, height: `${mergedDesignSettings.lineWeight}px`, backgroundColor: lineColor, borderRadius: '5px', maxWidth: '30px' }} />
    </Box>
  );

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

  // Render left sidebar sections based on order
  const renderLeftSectionContent = (sectionId) => {
    switch (sectionId) {
      case 'profilePhoto':
        return (
          <div className="resume-section">
            <Box sx={{ 
              width: 180, 
              height: 180, 
              borderRadius: '50%', 
              overflow: 'hidden', 
              mx: 'auto', 
              mb: mergedDesignSettings.sectionSpacing / 10,
              border: `5px solid ${mergedDesignSettings.accentColor}`,
              boxShadow: `0 0 0 3px ${mergedDesignSettings.color}`
            }}>
              <Avatar 
                src={photo}
                sx={{ 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'cover',
                  borderRadius: '0' 
                }} 
              />
            </Box>
          </div>
        );
      
      case 'aboutMe':
        return (
          <div className="resume-section">
            <Box sx={{ textAlign: 'center', mb: mergedDesignSettings.sectionSpacing / 10, fontFamily: mergedDesignSettings.font }}>
              <CenteredHeadingWithLines title="About Me" lineColor={mergedDesignSettings.accentColor} centerBg={darkViolet} />
              <Typography variant="body2" sx={{ 
                color: textGray, 
                fontSize: mergedDesignSettings.fontSize, 
                lineHeight: 1.4, 
                px: 2, 
                fontFamily: mergedDesignSettings.font, 
                fontStyle: mergedDesignSettings.fontStyle 
              }}>
                {savedSummary || data.profile}
              </Typography>
            </Box>
          </div>
        );
      
      case 'skills':
        return (
          <div className="resume-section">
            <Box sx={{ textAlign: 'center', mb: mergedDesignSettings.sectionSpacing / 10, fontFamily: mergedDesignSettings.font }}>
              <CenteredHeadingWithLines title="Skill" lineColor={mergedDesignSettings.accentColor} centerBg={darkViolet} />
              <List dense disablePadding sx={{ fontFamily: mergedDesignSettings.font }}>
                {(savedSkills.length > 0 ? savedSkills.map(skill => ({ name: typeof skill === 'object' ? skill.name : skill, proficiency: 80 })) : data.skills).map((skill, index) => (
                  <ListItem key={index} disableGutters sx={{ display: 'flex', alignItems: 'center', mb: 1, fontFamily: mergedDesignSettings.font }}>
                    <Typography sx={{ 
                      color: textGray, 
                      fontSize: mergedDesignSettings.fontSize, 
                      minWidth: '60px', 
                      textAlign: 'left', 
                      mr: 2, 
                      fontFamily: mergedDesignSettings.font, 
                      fontStyle: mergedDesignSettings.fontStyle 
                    }}>
                      {skill.name}
                    </Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={skill.proficiency} 
                      sx={{ 
                        flexGrow: 1, 
                        height: 8, 
                        borderRadius: 5, 
                        backgroundColor: lightGrayText,
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: mergedDesignSettings.accentColor
                        }
                      }} 
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          </div>
        );
      
      case 'languages':
        return (
          <div className="resume-section">
            <Box sx={{ textAlign: 'center', mb: mergedDesignSettings.sectionSpacing / 10, fontFamily: mergedDesignSettings.font }}>
              <CenteredHeadingWithLines title="Language" lineColor={mergedDesignSettings.accentColor} centerBg={darkViolet} />
              <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 1, fontFamily: mergedDesignSettings.font }}>
                {(savedLanguages.length > 0 ? savedLanguages : data.languages).map((lang, index) => (
                  <Button 
                    key={index}
                    variant="outlined" 
                    sx={{ 
                      color: 'white', 
                      borderColor: mergedDesignSettings.accentColor, 
                      borderRadius: '20px', 
                      textTransform: 'none',
                      fontSize: mergedDesignSettings.fontSize,
                      fontFamily: mergedDesignSettings.font,
                      fontStyle: mergedDesignSettings.fontStyle,
                      '&:hover': {
                        backgroundColor: mergedDesignSettings.accentColor,
                        borderColor: mergedDesignSettings.accentColor,
                      }
                    }}
                  >
                    {typeof lang === 'object' ? lang.name || lang.language : lang}
                  </Button>
                ))}
              </Box>
            </Box>
          </div>
        );
      
      case 'interests':
        return (savedInterests.length > 0 || data.interests) ? (
          <div className="resume-section">
            <Box sx={{ textAlign: 'center', mb: mergedDesignSettings.sectionSpacing / 10, fontFamily: mergedDesignSettings.font }}>
              <CenteredHeadingWithLines title="Interests" lineColor={mergedDesignSettings.accentColor} centerBg={darkViolet} />
              <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 1, fontFamily: mergedDesignSettings.font }}>
                {(savedInterests.length > 0 ? savedInterests : data.interests).map((interest, index) => (
                  <Chip
                    key={index}
                    label={interest}
                    size="small"
                    sx={{
                      color: 'white',
                      border: `1px solid ${mergedDesignSettings.accentColor}`,
                      fontSize: mergedDesignSettings.fontSize,
                      fontFamily: mergedDesignSettings.font,
                      fontStyle: mergedDesignSettings.fontStyle,
                    }}
                  />
                ))}
              </Box>
            </Box>
          </div>
        ) : null;
      
    default:
      if (sectionId.startsWith('custom_')) {
        const customSectionName = sectionId.replace('custom_', '');
        const items = customSections[customSectionName] || [];

        return items.length > 0 ? (
          <div className="resume-section">
            <Box sx={{ textAlign: 'center', mb: mergedDesignSettings.sectionSpacing / 10, fontFamily: mergedDesignSettings.font }}>
              <CenteredHeadingWithLines 
                title={customSectionName} 
                lineColor={mergedDesignSettings.accentColor} 
                centerBg={darkViolet} 
              />
              {items.map((item, i) => (
                <Typography
                  key={i}
                  sx={{
                    mb: 1,
                    fontSize: mergedDesignSettings.fontSize,
                    color: textGray,
                    fontFamily: mergedDesignSettings.font,
                    fontStyle: mergedDesignSettings.fontStyle,
                    textAlign: 'left',
                    px: 2
                  }}
                >
                  • {typeof item === 'object' ? JSON.stringify(item) : item}
                </Typography>
              ))}
            </Box>
          </div>
        ) : null;
      }
      return renderRightSectionContent(sectionId, true);
    }
  };

  // Render right main content sections based on order
  const renderRightSectionContent = (sectionId, inSidebar = false) => {
    const textColor = inSidebar ? textGray : lightText;
    const headingColor = inSidebar ? 'white' : mergedDesignSettings.color;
    const accentColorUsed = inSidebar ? mergedDesignSettings.accentColor : darkViolet;
    
    switch (sectionId) {
      case 'nameTitle':
        return (
          <div className="resume-section">
            <Typography variant="h4" sx={{ 
              fontWeight: '900', 
              color: headingColor, 
              lineHeight: 1.1, 
              fontFamily: mergedDesignSettings.font, 
              fontStyle: mergedDesignSettings.fontStyle,
              fontSize: mergedDesignSettings.headingSize
            }}>
              {data.firstName} {data.lastName}
            </Typography>
            <Typography variant="h6" sx={{ 
              color: textColor, 
              mb: mergedDesignSettings.sectionSpacing / 10, 
              fontSize: mergedDesignSettings.fontSize, 
              fontFamily: mergedDesignSettings.font, 
              fontStyle: mergedDesignSettings.fontStyle 
            }}>
              {data.currentPosition}
            </Typography>
          </div>
        );
      
      case 'contact':
        return (
          <div className="resume-section">
            <Box sx={{ textAlign: 'center', mb: mergedDesignSettings.sectionSpacing / 10, fontFamily: mergedDesignSettings.font }}>
              <CenteredHeadingWithLines title="Contact" lineColor={inSidebar ? mergedDesignSettings.accentColor : lineViolet} centerBg={accentColorUsed} />
              <List dense disablePadding sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: { xs: 1, sm: 2 }, fontFamily: mergedDesignSettings.font }}>
                <ListItem disableGutters sx={{ width: 'auto', py: 0.2, fontFamily: mergedDesignSettings.font }}>
                  <ListItemIcon sx={{ minWidth: 30 }}><PhoneIcon sx={{ fontSize: 16, color: accentColorUsed }} /></ListItemIcon>
                  <ListItemText 
                    primary={data.phone} 
                    primaryTypographyProps={{ 
                      color: textColor, 
                      fontSize: mergedDesignSettings.fontSize, 
                      fontFamily: mergedDesignSettings.font, 
                      fontStyle: mergedDesignSettings.fontStyle 
                    }} 
                  />
                </ListItem>
                <ListItem disableGutters sx={{ width: 'auto', py: 0.2, fontFamily: mergedDesignSettings.font }}>
                  <ListItemIcon sx={{ minWidth: 30 }}><MailOutlineIcon sx={{ fontSize: 16, color: accentColorUsed }} /></ListItemIcon>
                  <ListItemText 
                    primary={data.email} 
                    primaryTypographyProps={{ 
                      color: textColor, 
                      fontSize: mergedDesignSettings.fontSize, 
                      fontFamily: mergedDesignSettings.font, 
                      fontStyle: mergedDesignSettings.fontStyle 
                    }} 
                  />
                </ListItem>
                <ListItem disableGutters sx={{ width: 'auto', py: 0.2, fontFamily: mergedDesignSettings.font }}>
                  <ListItemIcon sx={{ minWidth: 30 }}><LocationOnIcon sx={{ fontSize: 16, color: accentColorUsed }} /></ListItemIcon>
                  <ListItemText 
                    primary={data.city} 
                    primaryTypographyProps={{ 
                      color: textColor, 
                      fontSize: mergedDesignSettings.fontSize, 
                      fontFamily: mergedDesignSettings.font, 
                      fontStyle: mergedDesignSettings.fontStyle 
                    }} 
                  />
                </ListItem>
                <ListItem disableGutters sx={{ width: 'auto', py: 0.2, fontFamily: mergedDesignSettings.font }}>
                  <ListItemIcon sx={{ minWidth: 30 }}><LanguageIcon sx={{ fontSize: 16, color: accentColorUsed }} /></ListItemIcon>
                  <ListItemText 
                    primary={data.website} 
                    primaryTypographyProps={{ 
                      color: textColor, 
                      fontSize: mergedDesignSettings.fontSize, 
                      fontFamily: mergedDesignSettings.font, 
                      fontStyle: mergedDesignSettings.fontStyle 
                    }} 
                  />
                </ListItem>
              </List>
            </Box>
          </div>
        );

      case 'profilePhoto':
        return (
          <div className="resume-section">
            <Box sx={{ 
              width: 150, 
              height: 150, 
              borderRadius: '50%', 
              overflow: 'hidden', 
              mx: 'auto', 
              mb: mergedDesignSettings.sectionSpacing / 10,
              border: `4px solid ${accentColorUsed}`,
              boxShadow: `0 0 0 2px ${headingColor}`
            }}>
              <Avatar 
                src={photo}
                sx={{ 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'cover',
                  borderRadius: '0' 
                }} 
              />
            </Box>
          </div>
        );
      
      case 'aboutMe':
        return (
          <div className="resume-section">
            <Box sx={{ mb: mergedDesignSettings.sectionSpacing / 10, fontFamily: mergedDesignSettings.font }}>
              <CenteredHeadingWithLines title="About Me" lineColor={inSidebar ? mergedDesignSettings.accentColor : lineViolet} centerBg={accentColorUsed} />
              <Typography variant="body1" sx={{ 
                color: textColor, 
                fontSize: mergedDesignSettings.fontSize, 
                lineHeight: 1.6, 
                textAlign: 'justify', 
                fontFamily: mergedDesignSettings.font, 
                fontStyle: mergedDesignSettings.fontStyle 
              }}>
                {savedSummary || data.profile}
              </Typography>
            </Box>
          </div>
        );
      
      case 'skills':
        return (
          <div className="resume-section">
            <Box sx={{ mb: mergedDesignSettings.sectionSpacing / 10, fontFamily: mergedDesignSettings.font }}>
              <CenteredHeadingWithLines title="Skills" lineColor={inSidebar ? mergedDesignSettings.accentColor : lineViolet} centerBg={accentColorUsed} />
              <Box sx={{ fontFamily: mergedDesignSettings.font }}>
                {(savedSkills.length > 0 ? savedSkills.map(skill => ({ name: typeof skill === 'object' ? skill.name : skill, proficiency: 80 })) : data.skills).map((skill, index) => (
                  <Box key={index} sx={{ mb: 2, fontFamily: mergedDesignSettings.font }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5, fontFamily: mergedDesignSettings.font }}>
                      <Typography variant="body2" sx={{ 
                        color: textColor, 
                        fontSize: mergedDesignSettings.fontSize, 
                        fontFamily: mergedDesignSettings.font, 
                        fontStyle: mergedDesignSettings.fontStyle 
                      }}>
                        {skill.name}
                      </Typography>
                      <Typography variant="caption" sx={{ 
                        color: accentColorUsed, 
                        fontSize: `calc(${mergedDesignSettings.fontSize} * 0.8)`, 
                        fontFamily: mergedDesignSettings.font, 
                        fontStyle: mergedDesignSettings.fontStyle 
                      }}>
                        {skill.proficiency}%
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={skill.proficiency} 
                      sx={{ 
                        width: '100%', 
                        height: 8, 
                        borderRadius: 5, 
                        backgroundColor: inSidebar ? 'rgba(255,255,255,0.3)' : lightGrayText,
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: accentColorUsed
                        }
                      }} 
                    />
                  </Box>
                ))}
              </Box>
            </Box>
          </div>
        );
      
      case 'languages':
        return (
          <div className="resume-section">
            <Box sx={{ mb: mergedDesignSettings.sectionSpacing / 10, fontFamily: mergedDesignSettings.font }}>
              <CenteredHeadingWithLines title="Languages" lineColor={inSidebar ? mergedDesignSettings.accentColor : lineViolet} centerBg={accentColorUsed} />
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, fontFamily: mergedDesignSettings.font }}>
                {(savedLanguages.length > 0 ? savedLanguages : data.languages).map((lang, index) => (
                  <Chip
                    key={index}
                    label={typeof lang === 'object' ? lang.name || lang.language : lang}
                    size="small"
                    sx={{
                      color: 'white',
                      backgroundColor: accentColorUsed,
                      fontSize: mergedDesignSettings.fontSize,
                      fontFamily: mergedDesignSettings.font,
                      fontStyle: mergedDesignSettings.fontStyle,
                      '&:hover': {
                        backgroundColor: headingColor,
                      }
                    }}
                  />
                ))}
              </Box>
            </Box>
          </div>
        );
      
      case 'interests':
        return (savedInterests.length > 0 || data.interests) ? (
          <div className="resume-section">
            <Box sx={{ mb: mergedDesignSettings.sectionSpacing / 10, fontFamily: mergedDesignSettings.font }}>
              <CenteredHeadingWithLines title="Interests" lineColor={inSidebar ? mergedDesignSettings.accentColor : lineViolet} centerBg={accentColorUsed} />
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, fontFamily: mergedDesignSettings.font }}>
                {(savedInterests.length > 0 ? savedInterests : data.interests).map((interest, index) => (
                  <Chip
                    key={index}
                    label={interest}
                    size="small"
                    sx={{
                      color: textColor,
                      backgroundColor: inSidebar ? 'rgba(255,255,255,0.1)' : '#f5f5f5',
                      border: `1px solid ${accentColorUsed}`,
                      fontSize: mergedDesignSettings.fontSize,
                      fontFamily: mergedDesignSettings.font,
                      fontStyle: mergedDesignSettings.fontStyle,
                    }}
                  />
                ))}
              </Box>
            </Box>
          </div>
        ) : null;
      
      case 'experience':
        return (
          <div className="resume-section">
            <Box sx={{ mb: mergedDesignSettings.sectionSpacing / 10, fontFamily: mergedDesignSettings.font }}>
              <CenteredHeadingWithLines title="Experience" lineColor={inSidebar ? mergedDesignSettings.accentColor : lineViolet} centerBg={accentColorUsed} />
              {(workExperiences && workExperiences.length > 0 ? workExperiences.map(exp => ({
                years: `${formatDate(exp.startMonth, exp.startYear)} - ${exp.current ? "Present" : formatDate(exp.endMonth, exp.endYear)}`,
                title: exp.jobTitle,
                company: exp.employer,
                description: exp.description
              })) : data.experience).map((exp, index) => (
                <Box key={index} sx={{ mb: 2, display: 'flex', fontFamily: mergedDesignSettings.font }}>
                  <Typography variant="caption" sx={{ 
                    color: textColor, 
                    minWidth: '80px', 
                    mr: 2, 
                    flexShrink: 0, 
                    fontFamily: mergedDesignSettings.font, 
                    fontStyle: mergedDesignSettings.fontStyle,
                    fontSize: mergedDesignSettings.fontSize
                  }}>
                    {exp.years}
                  </Typography>
                  <Box sx={{ fontFamily: mergedDesignSettings.font }}>
                    <Typography variant="body1" sx={{ 
                      fontWeight: 'bold', 
                      color: headingColor, 
                      lineHeight: 1.2, 
                      fontFamily: mergedDesignSettings.font, 
                      fontStyle: mergedDesignSettings.fontStyle,
                      fontSize: mergedDesignSettings.fontSize
                    }}>
                      {exp.title}
                    </Typography>
                    <Typography variant="body2" sx={{ 
                      fontWeight: 'bold', 
                      color: accentColorUsed, 
                      mb: 0.5, 
                      fontSize: mergedDesignSettings.fontSize, 
                      fontFamily: mergedDesignSettings.font, 
                      fontStyle: mergedDesignSettings.fontStyle 
                    }}>
                      {exp.company}
                    </Typography>
                    <Typography variant="body2" sx={{ 
                      color: textColor, 
                      fontSize: mergedDesignSettings.fontSize, 
                      fontFamily: mergedDesignSettings.font, 
                      fontStyle: mergedDesignSettings.fontStyle 
                    }}>
                      {exp.description}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </div>
        );
      
      case 'education':
        return (
          <div className="resume-section">
            <Box sx={{ mb: mergedDesignSettings.sectionSpacing / 10, fontFamily: mergedDesignSettings.font }}>
              <CenteredHeadingWithLines title="Education" lineColor={inSidebar ? mergedDesignSettings.accentColor : lineViolet} centerBg={accentColorUsed} />
              {(educationEntries.length > 0 ? educationEntries.map(edu => ({
                years: formatDate(edu.gradMonth, edu.gradYear),
                degree: edu.degree,
                institution: edu.schoolName
              })) : data.education).map((edu, index) => (
                <Box key={index} sx={{ mb: 2, display: 'flex', fontFamily: mergedDesignSettings.font }}>
                  <Typography variant="caption" sx={{ 
                    color: textColor, 
                    minWidth: '80px', 
                    mr: 2, 
                    flexShrink: 0, 
                    fontFamily: mergedDesignSettings.font, 
                    fontStyle: mergedDesignSettings.fontStyle,
                    fontSize: mergedDesignSettings.fontSize
                  }}>
                    {edu.years}
                  </Typography>
                  <Box sx={{ fontFamily: mergedDesignSettings.font }}>
                    <Typography variant="body1" sx={{ 
                      fontWeight: 'bold', 
                      color: headingColor, 
                      lineHeight: 1.2, 
                      fontFamily: mergedDesignSettings.font, 
                      fontStyle: mergedDesignSettings.fontStyle,
                      fontSize: mergedDesignSettings.fontSize
                    }}>
                      {edu.degree}
                    </Typography>
                    <Typography variant="body2" sx={{ 
                      fontWeight: 'bold', 
                      color: accentColorUsed, 
                      fontSize: mergedDesignSettings.fontSize, 
                      fontFamily: mergedDesignSettings.font, 
                      fontStyle: mergedDesignSettings.fontStyle 
                    }}>
                      {edu.institution}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </div>
        );
      
      case 'certifications':
        return savedCertifications.length > 0 ? (
          <div className="resume-section">
            <Box sx={{ mb: mergedDesignSettings.sectionSpacing / 10, fontFamily: mergedDesignSettings.font }}>
              <CenteredHeadingWithLines title="Certifications" lineColor={inSidebar ? mergedDesignSettings.accentColor : lineViolet} centerBg={accentColorUsed} />
              {savedCertifications.map((cert, index) => (
                <Box key={index} sx={{ mb: 1, display: 'flex', fontFamily: mergedDesignSettings.font }}>
                  <Typography variant="caption" sx={{ 
                    color: textColor, 
                    minWidth: '80px', 
                    mr: 2, 
                    flexShrink: 0, 
                    fontFamily: mergedDesignSettings.font, 
                    fontStyle: mergedDesignSettings.fontStyle,
                    fontSize: mergedDesignSettings.fontSize
                  }}>
                    {cert.year}
                  </Typography>
                  <Box sx={{ fontFamily: mergedDesignSettings.font }}>
                    <Typography variant="body1" sx={{ 
                      fontWeight: 'bold', 
                      color: headingColor, 
                      lineHeight: 1.2, 
                      fontFamily: mergedDesignSettings.font, 
                      fontStyle: mergedDesignSettings.fontStyle,
                      fontSize: mergedDesignSettings.fontSize
                    }}>
                      {cert.name}
                    </Typography>
                    <Typography variant="body2" sx={{ 
                      fontWeight: 'bold', 
                      color: accentColorUsed, 
                      fontSize: mergedDesignSettings.fontSize, 
                      fontFamily: mergedDesignSettings.font, 
                      fontStyle: mergedDesignSettings.fontStyle 
                    }}>
                      {cert.provider}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </div>
        ) : null;
      
      case 'softwareSkills':
        return softwareSkills.length > 0 ? (
          <div className="resume-section">
            <Box sx={{ mb: mergedDesignSettings.sectionSpacing / 10, fontFamily: mergedDesignSettings.font }}>
              <CenteredHeadingWithLines title="Software Skills" lineColor={inSidebar ? mergedDesignSettings.accentColor : lineViolet} centerBg={accentColorUsed} />
              <Grid container spacing={1} sx={{ fontFamily: mergedDesignSettings.font }}>
                {softwareSkills.map((skill, index) => (
                  <Grid item xs={6} key={index} sx={{ fontFamily: mergedDesignSettings.font }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1, fontFamily: mergedDesignSettings.font }}>
                      <Typography variant="body2" sx={{ 
                        fontSize: mergedDesignSettings.fontSize, 
                        fontFamily: mergedDesignSettings.font, 
                        fontStyle: mergedDesignSettings.fontStyle, 
                        color: textColor 
                      }}>
                        {skill.name}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', fontFamily: mergedDesignSettings.font }}>
                        <Box sx={{ 
                          width: '60px', 
                          height: '6px', 
                          backgroundColor: inSidebar ? 'rgba(255,255,255,0.3)' : lightGrayText,
                          borderRadius: '3px',
                          overflow: 'hidden',
                          mr: 1
                        }}>
                          <Box 
                            sx={{ 
                              width: `${skill.level}%`, 
                              height: '100%', 
                              backgroundColor: accentColorUsed 
                            }} 
                          />
                        </Box>
                        <Typography variant="caption" sx={{ 
                          fontSize: `calc(${mergedDesignSettings.fontSize} * 0.8)`, 
                          fontFamily: mergedDesignSettings.font, 
                          fontStyle: mergedDesignSettings.fontStyle, 
                          color: textColor 
                        }}>
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
            <Box sx={{ mb: mergedDesignSettings.sectionSpacing / 10, fontFamily: mergedDesignSettings.font }}>
              <CenteredHeadingWithLines title="Volunteering" lineColor={inSidebar ? mergedDesignSettings.accentColor : lineViolet} centerBg={accentColorUsed} />
              {savedVolunteering.map((vol, index) => (
                <Box key={index} sx={{ mb: 2, display: 'flex', fontFamily: mergedDesignSettings.font }}>
                  <Typography variant="caption" sx={{ 
                    color: textColor, 
                    minWidth: '80px', 
                    mr: 2, 
                    flexShrink: 0, 
                    fontFamily: mergedDesignSettings.font, 
                    fontStyle: mergedDesignSettings.fontStyle,
                    fontSize: mergedDesignSettings.fontSize
                  }}>
                    {vol.fromDate} - {vol.toDate}
                  </Typography>
                  <Box sx={{ fontFamily: mergedDesignSettings.font }}>
                    <Typography variant="body1" sx={{ 
                      fontWeight: 'bold', 
                      color: headingColor, 
                      lineHeight: 1.2, 
                      fontFamily: mergedDesignSettings.font, 
                      fontStyle: mergedDesignSettings.fontStyle,
                      fontSize: mergedDesignSettings.fontSize
                    }}>
                      {vol.subtopic}
                    </Typography>
                    <Typography variant="body2" sx={{ 
                      color: textColor, 
                      fontSize: mergedDesignSettings.fontSize, 
                      fontFamily: mergedDesignSettings.font, 
                      fontStyle: mergedDesignSettings.fontStyle 
                    }}>
                      {vol.content}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </div>
        ) : null;
      
      case 'references':
        return (savedReferences.length > 0 || data.references) ? (
          <div className="resume-section">
            <Box sx={{ mb: mergedDesignSettings.sectionSpacing / 10, fontFamily: mergedDesignSettings.font }}>
              <CenteredHeadingWithLines title="References" lineColor={inSidebar ? mergedDesignSettings.accentColor : lineViolet} centerBg={accentColorUsed} />
              {(savedReferences.length > 0 ? savedReferences : data.references).map((ref, index) => (
                <Box key={index} sx={{ mb: 2, fontFamily: mergedDesignSettings.font }}>
                  <Typography variant="body1" sx={{ 
                    color: textColor, 
                    lineHeight: 1.2, 
                    fontFamily: mergedDesignSettings.font, 
                    fontStyle: mergedDesignSettings.fontStyle,
                    fontSize: mergedDesignSettings.fontSize
                  }}>
                    {typeof ref === 'object' ? ref.name : ref}
                  </Typography>
                  {typeof ref === 'object' && (
                    <>
                      <Typography variant="body2" sx={{ 
                        color: accentColorUsed, 
                        fontSize: mergedDesignSettings.fontSize, 
                        fontFamily: mergedDesignSettings.font, 
                        fontStyle: mergedDesignSettings.fontStyle 
                      }}>
                        {ref.position} @ {ref.company}
                      </Typography>
                      <Typography variant="body2" sx={{ 
                        color: textColor, 
                        fontSize: mergedDesignSettings.fontSize, 
                        fontFamily: mergedDesignSettings.font, 
                        fontStyle: mergedDesignSettings.fontStyle 
                      }}>
                        {ref.contact}
                      </Typography>
                    </>
                  )}
                </Box>
              ))}
            </Box>
          </div>
        ) : null;
      
      case 'accomplishments':
        return savedAccomplishments.length > 0 ? (
          <div className="resume-section">
            <Box sx={{ mb: mergedDesignSettings.sectionSpacing / 10, fontFamily: mergedDesignSettings.font }}>
              <CenteredHeadingWithLines title="Accomplishments" lineColor={inSidebar ? mergedDesignSettings.accentColor : lineViolet} centerBg={accentColorUsed} />
              {savedAccomplishments.map((acc, index) => (
                <Typography key={index} sx={{ 
                  mb: 1, 
                  fontSize: mergedDesignSettings.fontSize, 
                  color: textColor, 
                  fontFamily: mergedDesignSettings.font, 
                  fontStyle: mergedDesignSettings.fontStyle ,
                  paragraphIndent:mergedDesignSettings.paragraphIndent,paragraphSpacing:mergedDesignSettings.paragraphSpacing,

                }}>
                  • {acc}
                </Typography>
              ))}
            </Box>
          </div>
        ) : null;
    
      case 'additionalInfo':
        return savedAdditionalInfo.length > 0 ? (
          <div className="resume-section">
            <Box sx={{ mb: mergedDesignSettings.sectionSpacing / 10, fontFamily: mergedDesignSettings.font }}>
              <CenteredHeadingWithLines title="Additional Information" lineColor={inSidebar ? mergedDesignSettings.accentColor : lineViolet} centerBg={accentColorUsed} />
              {savedAdditionalInfo.map((info, index) => (
                <Typography key={index} sx={{ 
                  mb: 1, 
                  fontSize: mergedDesignSettings.fontSize, 
                  color: textColor, 
                  fontFamily: mergedDesignSettings.font, 
                  fontStyle: mergedDesignSettings.fontStyle,
                  paragraphIndent:mergedDesignSettings.paragraphIndent,paragraphSpacing:mergedDesignSettings.paragraphSpacing,
                }}>
                  • {info}
                </Typography>
              ))}
            </Box>
          </div>
        ) : null;

      case 'websites':
        return savedWebsites.length > 0 ? (
          <div className="resume-section">
            <Box sx={{ mb: mergedDesignSettings.sectionSpacing / 10, fontFamily: mergedDesignSettings.font }}>
              <CenteredHeadingWithLines title="Websites & Profiles" lineColor={inSidebar ? mergedDesignSettings.accentColor : lineViolet} centerBg={accentColorUsed} />
              {savedWebsites.map((site, index) => (
                <Box key={index} sx={{ mb: 1, display: 'flex', alignItems: 'center', fontFamily: mergedDesignSettings.font }}>
                  <StarIcon sx={{ fontSize: 16, color: accentColorUsed, mr: 1 }} />
                  <Typography variant="body2" sx={{ 
                    color: textColor, 
                    fontSize: mergedDesignSettings.fontSize, 
                    fontFamily: mergedDesignSettings.font, 
                    fontStyle: mergedDesignSettings.fontStyle 
                  }}>
                    {site.url} {site.addToHeader && "(Header)"}
                  </Typography>
                </Box>
              ))}
            </Box>
          </div>
        ) : null;
      
      default:
        if (sectionId.startsWith('custom_')) {
          const customSectionName = sectionId.replace('custom_', '');
          const items = customSections[customSectionName] || [];

          return items.length > 0 ? (
            <div className="resume-section">
              <Box sx={{ mb: mergedDesignSettings.sectionSpacing / 10, fontFamily: mergedDesignSettings.font }}>
                <CenteredHeadingWithLines
                  title={customSectionName}
                  lineColor={inSidebar ? mergedDesignSettings.accentColor : lineViolet}
                  centerBg={inSidebar ? darkViolet : accentColor}
                />
                {items.map((item, i) => (
                  <Typography
                    key={i}
                    sx={{
                      mb: 1,
                      fontSize: mergedDesignSettings.fontSize,
                      color: inSidebar ? textGray : lightText,
                      fontFamily: mergedDesignSettings.font,
                      fontStyle: mergedDesignSettings.fontStyle,
                    }}
                  >
                    • {typeof item === 'object' ? JSON.stringify(item) : item}
                  </Typography>
                ))}
              </Box>
            </div>
          ) : null;
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
    
    if (mainSections.length === 0 && sidebarSections.length === 0) {
      newPages.push({ main: [], sidebar: [] });
    }
    
    mainSections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      
      if (currentMainHeight + sectionHeight > mainAvailableHeight) {
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
    
    sidebarSections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      
      let targetPageIndex = 0;
      let minHeightDiff = Infinity;
      
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
    
    if (currentMainPageSections.length > 0 || currentSidebarPageSections.length > 0) {
      newPages.push({
        main: currentMainPageSections,
        sidebar: currentSidebarPageSections,
      });
    }
    
    setPages(newPages);
  }, [page.height, mergedDesignSettings.topBottomMargin]);

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

  const renderSidebarContentToMeasure = () => (
    <Box ref={sidebarContentRef} sx={{ visibility: 'hidden', position: 'absolute', fontFamily: mergedDesignSettings.font }}>
      <Box sx={{ 
        p: 4, 
        bgcolor: mergedDesignSettings.color, 
        color: 'white', 
        height: '100%',
        minHeight: page.height,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        fontFamily: mergedDesignSettings.font,
        fontSize: mergedDesignSettings.fontSize,
        fontStyle: mergedDesignSettings.fontStyle,
        lineHeight: `${mergedDesignSettings.lineSpacing}px`,
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
    <Box ref={mainContentRef} sx={{ visibility: 'hidden', position: 'absolute', fontFamily: mergedDesignSettings.font }}>
      <Box sx={{ 
        p: `${mergedDesignSettings.topBottomMargin}px ${mergedDesignSettings.sideMargins}px`, 
        fontFamily: mergedDesignSettings.font, 
        fontSize: mergedDesignSettings.fontSize, 
        fontStyle: mergedDesignSettings.fontStyle, 
        lineHeight: `${mergedDesignSettings.lineSpacing}px` 
      }}>
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
          fontFamily: mergedDesignSettings.font,
        }}>
          <Box sx={{ flexGrow: 1 }}>
            {/* Empty space for proper height distribution */}
          </Box>
        </Box>
      );
    }

    return (
      <Box display="flex" flexDirection="column" sx={{ 
        flexGrow: 1,
        minHeight: "100%",
        justifyContent: "flex-start",
        fontFamily: mergedDesignSettings.font,
      }}>
        {sidebarSections.map((section, index) => (
          <div key={index} dangerouslySetInnerHTML={{ __html: section.outerHTML }} />
        ))}
      </Box>
    );
  };

  return (
    <Box sx={{ 
      width: "100%", 
      position: "relative", 
      m: 5, 
      fontFamily: mergedDesignSettings.font 
    }}>
      {!exporting && (
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          mb: 2, 
          gap: 2, 
          '@media print': { display: 'none' }, 
          fontFamily: mergedDesignSettings.font 
        }}>
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
                height: page.height,
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
                overflow: "hidden",
                "@media print": {
                  width: page.width,
                  height: page.height,
                  boxShadow: "none",
                  m: 0,
                  fontFamily: mergedDesignSettings.font,
                  fontSize: mergedDesignSettings.fontSize,
                  fontStyle: mergedDesignSettings.fontStyle,
                },
                display: exporting ? 'flex' : (index === currentPage ? 'flex' : 'none'),
                '@media print': { display: 'flex' }
              }}
            >
              <Grid container sx={{ height: "100%", margin: 0, fontFamily: mergedDesignSettings.font }}>
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
                    fontFamily: mergedDesignSettings.font,
                    fontSize: mergedDesignSettings.fontSize,
                    fontStyle: mergedDesignSettings.fontStyle,
                    "@media print": {
                      width: "30%",
                      height: "100%",
                      bgcolor: mergedDesignSettings.color,
                      color: "white",
                      WebkitPrintColorAdjust: "exact",
                      printColorAdjust: "exact",
                      margin: 0,
                      padding: 0,
                      fontFamily: mergedDesignSettings.font,
                      fontSize: mergedDesignSettings.fontSize,
                      fontStyle: mergedDesignSettings.fontStyle,
                    },
                  }}
                >
                  <Box sx={{ 
                    backgroundColor: mergedDesignSettings.color,
                    color: 'white',
                    p: 4,
                    height: "100%",
                    margin: 0,
                    display: "flex",
                    flexDirection: "column",
                    fontFamily: mergedDesignSettings.font,
                    fontSize: mergedDesignSettings.fontSize,
                    fontStyle: mergedDesignSettings.fontStyle,
                    "@media print": {
                      bgcolor: mergedDesignSettings.color,
                      color: "white",
                      WebkitPrintColorAdjust: "exact",
                      printColorAdjust: "exact",
                      height: "100%",
                      margin: 0,
                      fontFamily: mergedDesignSettings.font,
                      fontSize: mergedDesignSettings.fontSize,
                      fontStyle: mergedDesignSettings.fontStyle,
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
                    p: `${mergedDesignSettings.topBottomMargin}px ${mergedDesignSettings.sideMargins}px`,
                    width: "70%",
                    height: "100%",
                    margin: 0,
                    overflow: "hidden",
                    fontFamily: mergedDesignSettings.font,
                    fontSize: mergedDesignSettings.fontSize,
                    fontStyle: mergedDesignSettings.fontStyle,
                    
                    "@media print": { 
                      p: 2,
                      height: "100%",
                      margin: 0,
                      overflow: "hidden",
                      fontFamily: mergedDesignSettings.font,
                      fontSize: mergedDesignSettings.fontSize,
                      fontStyle: mergedDesignSettings.fontStyle,
                    },
                  }}
                >
                  {/* Apply font styles to the HTML content */}
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
              height: page.height,
              mx: "auto",
              bgcolor: "#fff",
              boxShadow: 3,
              fontFamily: mergedDesignSettings.font,
              fontSize: mergedDesignSettings.fontSize,
              fontStyle: mergedDesignSettings.fontStyle,
              lineHeight: `${mergedDesignSettings.lineSpacing}px`,
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              "@media print": {
                width: page.width,
                height: page.height,
                boxShadow: "none",
                m: 0,
                fontFamily: mergedDesignSettings.font,
                fontSize: mergedDesignSettings.fontSize,
                fontStyle: mergedDesignSettings.fontStyle,
              },
            }}
          >
            <Grid container sx={{ height: "100%", margin: 0, fontFamily: mergedDesignSettings.font }}>
              <Grid
                item
                xs={12}
                md={4}
                sx={{
                  width: "30%",
                  height: "100%",
                  margin: 0,
                  padding: 0,
                  fontFamily: mergedDesignSettings.font,
                }}
              >
                <Box sx={{ 
                  backgroundColor: mergedDesignSettings.color,
                  color: 'white',
                  p: 4,
                  height: "100%",
                  margin: 0,
                  display: "flex",
                  flexDirection: "column",
                  fontFamily: mergedDesignSettings.font,
                  fontSize: mergedDesignSettings.fontSize,
                  fontStyle: mergedDesignSettings.fontStyle,
                  "@media print": {
                    bgcolor: mergedDesignSettings.color,
                    color: "white",
                    WebkitPrintColorAdjust: "exact",
                    printColorAdjust: "exact",
                    height: "100%",
                    margin: 0,
                    fontFamily: mergedDesignSettings.font,
                    fontSize: mergedDesignSettings.fontSize,
                    fontStyle: mergedDesignSettings.fontStyle,
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
                  p: `${mergedDesignSettings.topBottomMargin}px ${mergedDesignSettings.sideMargins}px`,
                  width: "70%",
                  height: "100%",
                  margin: 0,
                  fontFamily: mergedDesignSettings.font,
                  fontSize: mergedDesignSettings.fontSize,
                  fontStyle: mergedDesignSettings.fontStyle,
                  "@media print": { 
                    p: 2,
                    height: "100%",
                    margin: 0,
                    fontFamily: mergedDesignSettings.font,
                    fontSize: mergedDesignSettings.fontSize,
                    fontStyle: mergedDesignSettings.fontStyle,
                  },
                }}
              >
                <Typography sx={{ fontFamily: mergedDesignSettings.font }}>Loading resume...</Typography>
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

export default Resume25;