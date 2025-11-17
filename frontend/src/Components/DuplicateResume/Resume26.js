import React, { useEffect, useState, useRef, useCallback } from "react";
import { 
  Container, Grid, Box, Typography, Avatar, LinearProgress, List, ListItem, ListItemText,
  ListItemIcon, IconButton, Button, Chip, Dialog, DialogTitle, DialogContent, DialogActions,
  Paper, Divider
} from '@mui/material';
// --- Icons ---
import PhoneIcon from '@mui/icons-material/Phone';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WebIcon from '@mui/icons-material/Web';
import CircleIcon from '@mui/icons-material/Circle';
import WorkIcon from '@mui/icons-material/Work';
import SchoolIcon from '@mui/icons-material/School';
import PersonIcon from '@mui/icons-material/Person';
import StarIcon from '@mui/icons-material/Star';
import CodeIcon from '@mui/icons-material/Code';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import {
  ChevronLeft,
  ChevronRight,
  Print,
  Download,
  DragIndicator,
  Reorder
} from "@mui/icons-material";
import html2pdf from "html2pdf.js";

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
const primaryLight = '#7FFFD4';
const primaryDark = '#008080';
const textDark = '#333333';
const textLight = '#666666';
const backgroundGray = '#d2fbf9ff';
const mainContainerBg = '#eaf5f4ff';

const defaultData = {
  firstName: "AARTHI",
  lastName: "R.",
  currentPosition: "PRODUCT DESIGNER",
  phone: "+91 98765 43210",
  email: "aarthi.design@email.com",
  city: "Chennai, Tamil Nadu",
  website: "www.portfolio.com",
  profile: "Highly motivated and results-oriented Product Designer with 5+ years of experience in leading end-to-end design processes for SaaS and mobile applications. Expertise in user research, prototyping, and design system creation. Focused on delivering elegant, user-centric solutions.",
  skills: [
    { name: "Figma", level: 95 },
    { name: "UX Research", level: 85 },
    { name: "Prototyping (Principle)", level: 80 },
    { name: "HTML/CSS", level: 70 },
  ],
  experience: [
    {
      years: "2021 - Present",
      title: "Senior Product Designer",
      company: "TechSolutions Inc.",
      description: "Led design for core features of the flagship B2B platform. Reduced task completion time by 15% through iterative usability testing and redesign. Mentored junior designers.",
    },
  ],
  education: [
    {
      years: "2014 - 2018",
      degree: "B.E. Computer Science & Engineering",
      institution: "Anna University",
    },
    {
      years: "2019 - 2020",
      degree: "Certification in Advanced Interaction Design",
      institution: "IIT Madras",
    },
  ],
  interests: ["Photography", "Travel", "Sketching", "Fitness"],
  accomplishments: [
    "Won Best Design Award at Tech Innovation Summit 2022",
    "Published research paper on UX Design Patterns in International Journal",
  ],
  software: [
    { name: "Adobe Creative Suite", level: 90 },
    { name: "Sketch", level: 85 },
    { name: "InVision", level: 80 },
    { name: "Framer", level: 75 }
  ]
};

// Separate section orders for left and right sides
const defaultLeftSectionOrder = [
  'contact',
  'skills',
  'interests','languages',
];

const defaultRightSectionOrder = [
  'profile',
  'experience',
  'education',
  'softwareSkills',
  'accomplishments',
  'websites', // WEBSITES SECTION ADDED HERE
  'additionalInfo',
  'certifications',
  'volunteering',
  'references'
];

// --- Reusable Component for Section Heading ---
const SectionHeader = ({ title, icon: Icon, color, accentColor, lineWeight }) => (
  <Box sx={{ 
    display: 'flex', 
    alignItems: 'center', 
    mb: 2, 
    borderBottom: `${lineWeight}px solid ${accentColor}`,
    pb: 0.5 
  }}>
    <Icon sx={{ color: color, mr: 1.5, fontSize: 24 }} />
    <Typography variant="h6" sx={{ fontWeight: 'bold', color: textDark, textTransform: 'uppercase', letterSpacing: 1 }}>
      {title}
    </Typography>
  </Box>
);

const ModernResume = ({
  color = primaryDark,
  accentColor = color,
  font = "inherit",
  fontSize = "12px",
  headingSize = "2px",
  fontStyle = "normal",
  sectionSpacing = 1,
  paragraphSpacing = 1,
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
  
  // State for section ordering - separate for left and right
  const [leftSectionOrder, setLeftSectionOrder] = useState(defaultLeftSectionOrder);
  const [rightSectionOrder, setRightSectionOrder] = useState(defaultRightSectionOrder);
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const [dragOverSide, setDragOverSide] = useState(null);
  
  // State for arrange sections dialog
  const [arrangeDialogOpen, setArrangeDialogOpen] = useState(false);

  // State initialization logic for local storage data
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
    // WEBSITES DATA LOAD
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
  const savedLeftSectionOrder = localStorage.getItem("modernResumeLeftSectionOrder");
  if (savedLeftSectionOrder) {
    // 🔥 FIX: Left side-ல custom sections auto add ஆகாது - filter only
    const parsedOrder = JSON.parse(savedLeftSectionOrder);
    const filteredOrder = parsedOrder.filter(section => !section.startsWith('custom_'));
    setLeftSectionOrder(filteredOrder);
    console.log('🔄 Loaded left section order WITHOUT custom sections:', filteredOrder);
  } else {
    setLeftSectionOrder(defaultLeftSectionOrder);
  }

  const savedRightSectionOrder = localStorage.getItem("modernResumeRightSectionOrder");
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
      localStorage.setItem("modernResumeRightSectionOrder", JSON.stringify(newRightOrder));
      console.log('📝 Final right section order with ONLY CURRENT custom sections:', newRightOrder);
    }
    
    // 🔥 FIX: Left side-லிருந்து custom sections-ஐ remove செய்யவும்
    const currentLeftOrder = [...leftSectionOrder];
    const filteredLeftOrder = currentLeftOrder.filter(section => !section.startsWith('custom_'));
    if (JSON.stringify(filteredLeftOrder) !== JSON.stringify(currentLeftOrder)) {
      setLeftSectionOrder(filteredLeftOrder);
      localStorage.setItem("modernResumeLeftSectionOrder", JSON.stringify(filteredLeftOrder));
      console.log('🗑️ Removed custom sections from left side:', filteredLeftOrder);
    }
    
  } else if (userId && Object.keys(customSections).length === 0) {
    // If no current custom sections, remove all custom sections from both sides
    const currentRightOrder = [...rightSectionOrder];
    const filteredRightOrder = currentRightOrder.filter(section => !section.startsWith('custom_'));
    
    if (filteredRightOrder.length !== currentRightOrder.length) {
      setRightSectionOrder(filteredRightOrder);
      localStorage.setItem("modernResumeRightSectionOrder", JSON.stringify(filteredRightOrder));
      console.log('🗑️ Removed all custom sections from right side (no current sections)');
    }
    
    const currentLeftOrder = [...leftSectionOrder];
    const filteredLeftOrder = currentLeftOrder.filter(section => !section.startsWith('custom_'));
    if (filteredLeftOrder.length !== currentLeftOrder.length) {
      setLeftSectionOrder(filteredLeftOrder);
      localStorage.setItem("modernResumeLeftSectionOrder", JSON.stringify(filteredLeftOrder));
      console.log('🗑️ Removed all custom sections from left side (no current sections)');
    }
  }
}, [customSections]);

  // Save section orders to localStorage whenever they change
  useEffect(() => {
    if (leftSectionOrder.length > 0) {
      localStorage.setItem("modernResumeLeftSectionOrder", JSON.stringify(leftSectionOrder));
    }
  }, [leftSectionOrder]);

  useEffect(() => {
    if (rightSectionOrder.length > 0) {
      localStorage.setItem("modernResumeRightSectionOrder", JSON.stringify(rightSectionOrder));
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
      'interests': 'Interests',
      'profile': 'Profile',
      'experience': 'Experience',
          'languages':'languages',
      'education': 'Education',
      'softwareSkills': 'Software Skills',
      'accomplishments': 'Accomplishments',
      'websites': 'Websites & Profiles', // WEBSITES TITLE ADDED
      'additionalInfo': 'Additional Information',
      'certifications': 'Certifications',
      'volunteering': 'Volunteering',
      'references': 'References'
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
          {side === 'left' ? 'Left Sidebar' : 'Right Main'} Sections
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

 const renderLeftSectionContent = (sectionId) => {
  const textColor = textLight;
  
  switch (sectionId) {
    case 'contact':
      return (
        <div className="resume-section">
          <Box sx={{ mb: sectionSpacing / 2 }}>
            <SectionHeader title="Contact" icon={PhoneIcon} color={color} accentColor={color} lineWeight={lineWeight} />
            <List dense disablePadding>
              <ListItem disableGutters sx={{ py: 0.5 }}>
                <ListItemIcon sx={{ minWidth: 35 }}>
                  <PhoneIcon sx={{ fontSize: 18, color: color }} />
                </ListItemIcon>
                <ListItemText 
                  primary={data.phone} 
                  primaryTypographyProps={{ color: textColor, fontSize: fontSize, fontFamily: font }} 
                />
              </ListItem>
              <ListItem disableGutters sx={{ py: 0.5 }}>
                <ListItemIcon sx={{ minWidth: 35 }}>
                  <MailOutlineIcon sx={{ fontSize: 18, color: color }} />
                </ListItemIcon>
                <ListItemText 
                  primary={data.email} 
                  primaryTypographyProps={{ color: textColor, fontSize: fontSize, fontFamily: font }} 
                />
              </ListItem>
              <ListItem disableGutters sx={{ py: 0.5 }}>
                <ListItemIcon sx={{ minWidth: 35 }}>
                  <LocationOnIcon sx={{ fontSize: 18, color: color }} />
                </ListItemIcon>
                <ListItemText 
                  primary={data.city} 
                  primaryTypographyProps={{ color: textColor, fontSize: fontSize, fontFamily: font }} 
                />
              </ListItem>
              {savedWebsites.length > 0 ? (
                savedWebsites.filter(site => site.addToHeader).map((site, index) => (
                  <ListItem key={index} disableGutters sx={{ py: 0.5 }}>
                    <ListItemIcon sx={{ minWidth: 35 }}>
                      <WebIcon sx={{ fontSize: 18, color: color }} />
                    </ListItemIcon>
                    <ListItemText 
                      primary={site.url} 
                      primaryTypographyProps={{ color: textColor, fontSize: fontSize, fontFamily: font }} 
                    />
                  </ListItem>
                ))
              ) : data.website && (
                <ListItem disableGutters sx={{ py: 0.5 }}>
                  <ListItemIcon sx={{ minWidth: 35 }}>
                    <WebIcon sx={{ fontSize: 18, color: color }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary={data.website} 
                    primaryTypographyProps={{ color: textColor, fontSize: fontSize, fontFamily: font }} 
                  />
                </ListItem>
              )}
            </List>
          </Box>
        </div>
      );
    
    case 'skills':
      return (
        <div className="resume-section">
          <Box sx={{ mb: sectionSpacing / 2 }}>
            <SectionHeader title="Skills" icon={CircleIcon} color={color} accentColor={color} lineWeight={lineWeight} />
            <List dense disablePadding>
              {(savedSkills.length > 0 ? savedSkills.map(skill => ({ 
                name: typeof skill === 'object' ? skill.name : skill, 
                level: 80 
              })) : data.skills).map((skill, index) => (
                <ListItem key={index} disableGutters sx={{ display: 'block', mb: paragraphSpacing / 2 }}>
                  <Typography variant="body2" sx={{ color: textColor, fontWeight: 'bold', mb: 0.5, fontSize: fontSize, fontFamily: font }}>
                    {skill.name}
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={skill.level} 
                    sx={{ 
                      height: 6, 
                      borderRadius: 3, 
                      backgroundColor: '#E0E0E0',
                      '& .MuiLinearProgress-bar': {
                          backgroundColor: color,
                      }
                    }} 
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        </div>
      );
    
    case 'interests':
      return (
        <div className="resume-section">
          <Box sx={{ mb: sectionSpacing / 2 }}>
            <SectionHeader title="Interests" icon={CircleIcon} color={color} accentColor={color} lineWeight={lineWeight} />
            <Typography variant="body2" sx={{ color: textColor, fontSize: fontSize, fontFamily: font }}>
              {(savedInterests.length > 0 ? savedInterests : data.interests).join(' | ')}
            </Typography>
          </Box>
        </div>
      );
    
    case 'languages':
      return savedLanguages.length > 0 ? (
        <div className="resume-section">
          <Box sx={{ mb: sectionSpacing / 2 }}>
            <SectionHeader title="Languages" icon={CircleIcon} color={color} accentColor={color} lineWeight={lineWeight} />
            {savedLanguages.map((lang, index) => (
              <Typography
                key={index}
                sx={{
                  mb: `${paragraphSpacing / 10}px`,
                  fontSize: fontSize,
                  fontFamily: font,
                  color: textLight,
                }}
              >
                {lang.name} {lang.level ? `– ${lang.level}` : ""}
              </Typography>
            ))}
          </Box>
        </div>
      ) : null;
    
    default:
      // For sections that were moved from right side to left side
      return renderRightSectionContent(sectionId, true);
  }
};

const renderRightSectionContent = (sectionId, inSidebar = false) => {
  const textColor = inSidebar ? textLight : textLight;
  
  switch (sectionId) {
    case 'profile':
      return (
        <div className="resume-section">
          <Box sx={{ mb: sectionSpacing, mt: inSidebar ? 0 : 4 }}>
            <SectionHeader title="Profile" icon={PersonIcon} color={color} accentColor={color} lineWeight={lineWeight} />
            <Typography variant="body2" sx={{ color: textColor, fontSize: fontSize, lineHeight: `${lineSpacing / 20}`, textAlign: 'justify', fontFamily: font }}>
              {savedSummary || data.profile}
            </Typography>
          </Box>
        </div>
      );
    
    case 'experience':
      return (
        <div className="resume-section">
          <Box sx={{ mb: sectionSpacing }}>
            <SectionHeader title="Experience" icon={WorkIcon} color={color} accentColor={color} lineWeight={lineWeight} />
            {(workExperiences && workExperiences.length > 0 ? workExperiences.map(exp => ({
              years: `${formatDate(exp.startMonth, exp.startYear)} - ${exp.current ? "Present" : formatDate(exp.endMonth, exp.endYear)}`,
              title: exp.jobTitle,
              company: exp.employer,
              description: exp.description
            })) : data.experience).map((exp, index) => (
              <Box key={index} sx={{ mb: paragraphSpacing, borderLeft: `${lineWeight + 2}px solid ${accentColor}`, pl: 2, fontFamily: font }}>
                <Typography variant="caption" sx={{ color: color, fontWeight: 'bold', fontFamily: font }}>
                  {exp.years}
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: textDark, mt: 0.5, lineHeight: 1.2, fontFamily: font }}>
                  {exp.title}
                </Typography>
                <Typography variant="body1" sx={{ color: textColor, mb: 1, fontStyle: 'italic', fontSize: fontSize, fontFamily: font }}>
                  {exp.company}
                </Typography>
                <Typography variant="body2" sx={{ color: textColor, fontSize: fontSize, fontFamily: font, lineHeight: `${lineSpacing / 20}` }}>
                  {exp.description}
                </Typography>
              </Box>
            ))}
          </Box>
        </div>
      );
    
    case 'education':
      return (
        <div className="resume-section">
          <Box sx={{ mb: sectionSpacing }}>
            <SectionHeader title="Education" icon={SchoolIcon} color={color} accentColor={color} lineWeight={lineWeight} />
            {(educationEntries.length > 0 ? educationEntries.map(edu => ({
              years: formatDate(edu.gradMonth, edu.gradYear),
              degree: edu.degree,
              institution: edu.schoolName
            })) : data.education).map((edu, index) => (
              <Box key={index} sx={{ mb: paragraphSpacing, borderLeft: `${lineWeight + 2}px solid ${accentColor}`, pl: 2 }}>
                <Typography variant="caption" sx={{ color: color, fontWeight: 'bold', fontFamily: font }}>
                  {edu.years}
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: textDark, mt: 0.5, lineHeight: 1.2, fontFamily: font }}>
                  {edu.degree}
                </Typography>
                <Typography variant="body1" sx={{ color: textColor, fontStyle: 'italic', fontSize: fontSize, fontFamily: font }}>
                  {edu.institution}
                </Typography>
              </Box>
            ))}
          </Box>
        </div>
      );
    
    case 'softwareSkills':
      return (softwareSkills.length > 0 || data.software) ? (
        <div className="resume-section">
          <Box sx={{ mb: sectionSpacing }}>
            <SectionHeader title="Software Skills" icon={CodeIcon} color={color} accentColor={color} lineWeight={lineWeight} />
            <List dense disablePadding>
              {(softwareSkills.length > 0 ? softwareSkills : data.software).map((software, index) => (
                <ListItem key={index} disableGutters sx={{ display: 'block', mb: paragraphSpacing / 2 }}>
                  <Typography variant="body2" sx={{ color: textColor, fontWeight: 'bold', mb: 0.5, fontSize: fontSize, fontFamily: font }}>
                    {software.name}
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={software.level} 
                    sx={{ 
                      height: 6, 
                      borderRadius: 3, 
                      backgroundColor: '#E0E0E0',
                      '& .MuiLinearProgress-bar': {
                          backgroundColor: color,
                      }
                    }} 
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        </div>
      ) : null;
    
    case 'accomplishments':
      return (savedAccomplishments.length > 0 || data.accomplishments) ? (
        <div className="resume-section">
          <Box sx={{ mb: sectionSpacing }}>
            <SectionHeader title="Accomplishments" icon={EmojiEventsIcon} color={color} accentColor={color} lineWeight={lineWeight} />
            {(savedAccomplishments.length > 0 ? savedAccomplishments : data.accomplishments).map((accomplishment, index) => (
              <Box key={index} sx={{ mb: paragraphSpacing / 2, display: 'flex', alignItems: 'flex-start' }}>
                <StarIcon sx={{ color: color, fontSize: 16, mt: 0.5, mr: 1.5 }} />
                <Typography variant="body2" sx={{ color: textColor, fontSize: fontSize, fontFamily: font, lineHeight: `${lineSpacing / 20}` }}>
                  {accomplishment}
                </Typography>
              </Box>
            ))}
          </Box>
        </div>
      ) : null;
    
    case 'languages':
      return savedLanguages.length > 0 ? (
        <div className="resume-section">
          <Box sx={{ mb: sectionSpacing }}>
            <SectionHeader title="Languages" icon={CircleIcon} color={color} accentColor={color} lineWeight={lineWeight} />
            {savedLanguages.map((lang, index) => (
              <Typography
                key={index}
                sx={{
                  mb: `${paragraphSpacing / 10}px`,
                  fontSize: fontSize,
                  fontFamily: font,
                  color: textLight,
                }}
              >
                {lang.name} {lang.level ? `– ${lang.level}` : ""}
              </Typography>
            ))}
          </Box>
        </div>
      ) : null;
    
    case 'websites':
      return savedWebsites.length > 0 ? (
        <div className="resume-section">
          <Box sx={{ mb: sectionSpacing }}>
            <SectionHeader 
              title="Websites & Profiles" 
              icon={WebIcon} 
              color={color} 
              accentColor={color} 
              lineWeight={lineWeight} 
            />
            {savedWebsites.map((site, index) => (
              <Box key={index} sx={{ mb: paragraphSpacing / 2, display: 'flex', alignItems: 'flex-start' }}>
                <WebIcon sx={{ color: color, fontSize: 16, mt: 0.5, mr: 1.5 }} />
                <Box>
                  <Typography variant="body2" sx={{ color: textColor, fontWeight: 'bold', fontSize: fontSize, fontFamily: font }}>
                    {site.url}
                  </Typography>
                  {site.addToHeader && (
                    <Typography variant="caption" sx={{ color: color, fontStyle: 'italic' }}>
                      (Shown in Header)
                    </Typography>
                  )}
                </Box>
              </Box>
            ))}
          </Box>
        </div>
      ) : null;
    
    case 'additionalInfo':
      return savedAdditionalInfo.length > 0 ? (
        <div className="resume-section">
          <Box sx={{ mb: sectionSpacing }}>
            <SectionHeader title="Additional Information" icon={CircleIcon} color={color} accentColor={color} lineWeight={lineWeight} />
            {savedAdditionalInfo.map((info, index) => (
              <Typography key={index} sx={{ mb: 1, color: textColor, fontSize: fontSize, fontFamily: font }}>
                • {info}
              </Typography>
            ))}
          </Box>
        </div>
      ) : null;
    
    case 'certifications':
      return savedCertifications.length > 0 ? (
        <div className="resume-section">
          <Box sx={{ mb: sectionSpacing }}>
            <SectionHeader title="Certifications" icon={SchoolIcon} color={color} accentColor={color} lineWeight={lineWeight} />
            {savedCertifications.map((cert, index) => (
              <Box key={index} sx={{ mb: paragraphSpacing, borderLeft: `${lineWeight + 2}px solid ${accentColor}`, pl: 2 }}>
                <Typography variant="caption" sx={{ color: color, fontWeight: 'bold', fontFamily: font }}>
                  {cert.year}
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: textDark, mt: 0.5, lineHeight: 1.2, fontFamily: font }}>
                  {cert.name}
                </Typography>
                <Typography variant="body1" sx={{ color: textColor, fontStyle: 'italic', fontSize: fontSize, fontFamily: font }}>
                  {cert.provider}
                </Typography>
              </Box>
            ))}
          </Box>
        </div>
      ) : null;
    
    case 'volunteering':
      return savedVolunteering.length > 0 ? (
        <div className="resume-section">
          <Box sx={{ mb: sectionSpacing }}>
            <SectionHeader title="Volunteering" icon={WorkIcon} color={color} accentColor={color} lineWeight={lineWeight} />
            {savedVolunteering.map((vol, index) => (
              <Box key={index} sx={{ mb: paragraphSpacing, borderLeft: `${lineWeight + 2}px solid ${accentColor}`, pl: 2 }}>
                <Typography variant="caption" sx={{ color: color, fontWeight: 'bold', fontFamily: font }}>
                  {vol.fromDate} - {vol.toDate}
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: textDark, mt: 0.5, lineHeight: 1.2, fontFamily: font }}>
                  {vol.subtopic}
                </Typography>
                <Typography variant="body2" sx={{ color: textColor, fontFamily: font, fontSize: fontSize, lineHeight: `${lineSpacing / 20}` }}>
                  {vol.content}
                </Typography>
              </Box>
            ))}
          </Box>
        </div>
      ) : null;
     case 'websites':
        return savedWebsites.length > 0 ? (
          <div className="resume-section">
            <Box sx={{ mb: sectionSpacing }}>
              <SectionHeader 
                title="Websites & Profiles" 
                icon={WebIcon} 
                color={color} 
                accentColor={color} 
                lineWeight={lineWeight} 
              />
              {savedWebsites.map((site, index) => (
                <Box key={index} sx={{ mb: paragraphSpacing / 2, display: 'flex', alignItems: 'flex-start' }}>
                  <WebIcon sx={{ color: color, fontSize: 16, mt: 0.5, mr: 1.5 }} />
                  <Box>
                    <Typography variant="body2" sx={{ color: textColor, fontWeight: 'bold', fontSize: fontSize ,fontFamily:font}}>
                      {site.url}
                    </Typography>
                    {site.addToHeader && (
                      <Typography variant="caption" sx={{ color: color, fontStyle: 'italic' }}>
                        (Shown in Header)
                      </Typography>
                    )}
                  </Box>
                </Box>
              ))}
            </Box>
          </div>
        ) : null;

    case 'references':
      return savedReferences.length > 0 ? (
        <div className="resume-section">
          <Box sx={{ mb: sectionSpacing }}>
            <SectionHeader 
              title="References" 
              icon={PersonIcon} 
              color={color} 
              accentColor={color} 
              lineWeight={lineWeight} 
            />
            {savedReferences.map((ref, index) => (
              <Box key={index} sx={{ mb: 3, borderLeft: `3px solid ${accentColor}`, pl: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: textDark, mt: 0.5, lineHeight: 1.2, fontFamily: font }}>
                  {typeof ref === 'object' ? ref.name : ref}
                </Typography>
                {typeof ref === 'object' && (
                  <Typography variant="body1" sx={{ color: textColor, fontStyle: 'italic', fontSize: fontSize, fontFamily: font }}>
                    {ref.position} @ {ref.company}
                  </Typography>
                )}
              </Box>
            ))}
          </Box>
        </div>
      ) : null;
    
    case 'contact':
    case 'skills':
    case 'interests':
      // These are typically left sidebar sections, but if moved to right, render them
      return renderLeftSectionContent(sectionId);
    
   // renderRightSectionContent function-ல் default case-ல் custom section rendering-ஐ சரி செய்யவும்
default:
  // Handle custom sections
  if (sectionId && sectionId.startsWith('custom_')) {
    const customSectionName = sectionId.replace('custom_', '');
    const items = customSections[customSectionName] || [];
    
    console.log(`🎯 Rendering custom section in ModernResume: ${customSectionName}`, items);
    
    if (items && items.length > 0) {
      return (
        <div key={sectionId} className="resume-section">
          <Box sx={{ mb: sectionSpacing }}>
            <SectionHeader 
              title={customSectionName.toUpperCase()} 
              icon={CircleIcon} 
              color={color} 
              accentColor={accentColor} 
              lineWeight={lineWeight} 
            />
            {items.map((item, i) => (
              <Typography 
                key={i} 
                sx={{ 
                  mb: paragraphSpacing / 2, 
                  color: textColor, 
                  fontSize: fontSize, 
                  fontFamily: font,
                  lineHeight: `${lineSpacing / 20}`
                }}
              >
                • {typeof item === 'object' ? JSON.stringify(item) : item}
              </Typography>
            ))}
          </Box>
        </div>
      );
    } else {
      console.log(`⚠️ No items found for custom section in ModernResume: ${customSectionName}`);
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
    
    // Convert mm to pixels (1mm = 3.78px for print)
    const pageHeightInPx = parseFloat(page.height.replace('mm', '')) * 3.78;
    const headerHeight = 150; 
    const mainAvailableHeightPage1 = pageHeightInPx - headerHeight - (topBottomMargin * 2);
    const mainAvailableHeightSubsequent = pageHeightInPx - (topBottomMargin * 2);
    const sidebarAvailableHeight = pageHeightInPx - headerHeight - (topBottomMargin * 2);

    let newPages = [];
    
    // ----------------------------------------------------------------------
    // STEP 1: Paginate Sidebar Content 
    // ----------------------------------------------------------------------
    let paginatedSidebarChunks = [];
    let currentSidebarChunk = [];
    let currentSidebarHeight = 0;
    const sidebarVerticalPadding = 4 * 16 * 2;

    sidebarSections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      
      if (currentSidebarHeight + sectionHeight > sidebarAvailableHeight - sidebarVerticalPadding && currentSidebarChunk.length > 0) {
        paginatedSidebarChunks.push(currentSidebarChunk);
        currentSidebarChunk = [section];
        currentSidebarHeight = sectionHeight;
      } else {
        currentSidebarChunk.push(section);
        currentSidebarHeight += sectionHeight;
      }
    });
    
    if (currentSidebarChunk.length > 0) {
      paginatedSidebarChunks.push(currentSidebarChunk);
    }

    // ----------------------------------------------------------------------
    // STEP 2: Paginate Main Content
    // ----------------------------------------------------------------------
    let currentMainPageSections = [];
    let currentMainHeight = 0;
    const mainVerticalPadding = topBottomMargin * 2;
    let pageIndex = 0;

    mainSections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      
      const effectiveMainAvailableHeight = pageIndex === 0 
        ? mainAvailableHeightPage1 - mainVerticalPadding
        : mainAvailableHeightSubsequent - mainVerticalPadding;

      if (currentMainHeight + sectionHeight > effectiveMainAvailableHeight && currentMainPageSections.length > 0) {
        newPages.push({
          main: currentMainPageSections,
          sidebar: [], 
        });
        currentMainPageSections = [section];
        currentMainHeight = sectionHeight;
        pageIndex++;
      } else {
        currentMainPageSections.push(section);
        currentMainHeight += sectionHeight;
      }
    });

    if (currentMainPageSections.length > 0) {
      newPages.push({
        main: currentMainPageSections,
        sidebar: [], 
      });
    }

    // ----------------------------------------------------------------------
    // STEP 3: Merge Sidebar with Main Pages
    // ----------------------------------------------------------------------
    const totalPagesNeeded = Math.max(newPages.length, paginatedSidebarChunks.length);
    
    // Ensure newPages has enough entries
    while (newPages.length < totalPagesNeeded) {
      newPages.push({ main: [], sidebar: [] });
    }

    // Assign sidebar chunks to pages
    for (let i = 0; i < totalPagesNeeded; i++) {
      newPages[i].sidebar = paginatedSidebarChunks[i] || [];
    }

    setPages(newPages); 
    if (currentPage >= newPages.length && newPages.length > 0) {
      setCurrentPage(newPages.length - 1);
    }
  }, [page.height, topBottomMargin, currentPage]);

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
    fontSize, headingSize, sectionSpacing, lineSpacing, topBottomMargin, sideMargins, lineWeight, pageSize, font, color, accentColor
  ]);
  
 

  const calculateHeadingSizes = (baseSize) => {
    const size = parseInt(baseSize.replace('px', ''));
    return {
      name: `${size * 1.5}px`,
      role: `${size * 0.75}px`
    };
  }
  const sizes = calculateHeadingSizes(headingSize);


  // -------------------------------------------
  // RENDER SIDEBAR CONTENT
  // -------------------------------------------

  const renderSidebarContent = (sidebarSections = []) => {
    // If sidebar sections array is empty, show empty sidebar (no content)
    if (sidebarSections.length === 0) {
      return (
        <Box sx={{ 
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start"
        }}>
        </Box>
      );
    }

    // If sidebar sections are provided, render them
    return (
      <Box sx={{ 
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start"
      }}>
        {sidebarSections.map((section, index) => (
          <div key={index} dangerouslySetInnerHTML={{ __html: section.outerHTML }} />
        ))}
      </Box>
    );
  };

  const renderSidebarContentToMeasure = () => (
    <Box ref={sidebarContentRef} sx={{ visibility: 'hidden', position: 'absolute', top: '-9999px', width: "30%" }}>
      <Box sx={{
        backgroundColor: backgroundGray,
        color: textLight,
        p: 4,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start'
      }}>
        {leftSectionOrder.map(sectionId => renderLeftSectionContent(sectionId))}
      </Box>
    </Box>
  );

  const renderMainContentToMeasure = () => (
    <Box ref={mainContentRef} sx={{ visibility: 'hidden', position: 'absolute', top: '-9999px', width: "70%" }}>
      <Box sx={{ 
        p: `${topBottomMargin}px ${sideMargins}px`
      }}>
        {rightSectionOrder.map(sectionId => renderRightSectionContent(sectionId))}
      </Box>
    </Box>
  );

  const nameBoxStyle = {
    px: 4, 
    py: 4, 
    backgroundColor: 'white',
    borderBottom: `${lineWeight}px solid ${accentColor}`,
    position: 'relative',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
  };

  return (
    <Box sx={{ width: "100%", position: "relative", m: 5 }}>
      {!exporting && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 2, '@media print': { display: 'none' } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))} disabled={currentPage === 0} color="primary">
              <ChevronLeft />
            </IconButton>
            <Typography sx={{ mx: 2 ,fontFamily:font}}>Page {currentPage + 1} of {Math.max(1, pages.length)}</Typography>
            <IconButton onClick={() => setCurrentPage(prev => Math.min(pages.length - 1, prev + 1))} disabled={currentPage === Math.max(0, pages.length - 1)} color="primary">
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
        </Box>
      )}
      
      {renderMainContentToMeasure()}
      {renderSidebarContentToMeasure()}
      
      <Box id="resume-container">
        {pages.length > 0 ? (
          pages.map((pageContent, index) => (
            <Box
              key={index}
              className="resume-page"
              sx={{
                width: page.width,
                height: page.height,
                mx: "auto",
                bgcolor: mainContainerBg,
                boxShadow: index === currentPage ? 3 : 0,
                fontFamily: font,
                fontSize: fontSize,
                fontStyle: fontStyle,
                lineHeight: `${lineSpacing / 20}`,
                display: "flex",
                flexDirection: "column",
                pageBreakAfter: "always",
                overflow: "hidden",
                "@media print": {
                  width: page.width,
                  height: page.height,
                  boxShadow: "none",
                  m: 0,
                  pageBreakAfter: "always",
                },
                display: exporting ? 'flex' : (index === currentPage ? 'flex' : 'none'),
                '@media print': { display: 'flex' }
              }}
            >
              {index === 0 && (
                <div className="resume-section">
                  <Box sx={nameBoxStyle}>
                    <Grid container spacing={4} alignItems="center">
                      <Grid item xs={12} sm={2} sx={{ display: { xs: 'none', sm: 'block' } }}>
                        <Avatar 
                          src={photo}
                          sx={{ 
                            width: 100, 
                            height: 100, 
                            border: `3px solid ${color}`,
                            boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)'
                          }} 
                        />
                      </Grid>
                      <Grid item xs={12} sm={10}>
                        <Typography variant="h2" sx={{ 
                          fontWeight: '900', 
                          color: textDark, 
                          lineHeight: 1.1,fontFamily:font, 
                          fontSize: sizes.name
                        }}>
                          {data.firstName} {data.lastName}
                        </Typography>
                        <Typography variant="h5" sx={{ 
                          color: color,
                          fontWeight: 'bold', 
                          letterSpacing: 2, 
                          textTransform: 'uppercase', 
                          mt: 0.5,
                          fontFamily:font,
                          fontSize: sizes.role
                        }}>
                          {data.currentPosition}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Box>
                </div>
              )}

              <Grid container sx={{ 
                height: index === 0 ? `calc(100% - 150px)` : `100%`, 
                margin: 0,
                overflow: 'hidden'
              }}>
                <Grid
                  item
                  xs={12}
                  sm={4}
                  sx={{
                    width: "30%",
                    height: "100%",
                    margin: 0,
                    padding: 0,
                    backgroundColor: backgroundGray,
                    "@media print": {
                      width: "30%",
                      height: "100%",
                      backgroundColor: backgroundGray,
                      WebkitPrintColorAdjust: "exact",
                      printColorAdjust: "exact",
                      margin: 0,
                      padding: 0,
                    },
                  }}
                >
                  <Box sx={{ 
                    backgroundColor: backgroundGray,
                    color: textLight,
                    p: 4,
                    height: "100%",
                    margin: 0,
                    display: "flex",
                    flexDirection: "column",
                    overflow: "hidden",
                    "@media print": {
                      backgroundColor: backgroundGray,
                      WebkitPrintColorAdjust: "exact",
                      printColorAdjust: "exact",
                      height: "100%",
                      margin: 0,
                    },
                  }}>
                    {renderSidebarContent(pageContent.sidebar)}
                  </Box>
                </Grid>

                <Grid
                  item
                  xs={12}
                  sm={8}
                  sx={{
                    p: `${topBottomMargin}px ${sideMargins}px`,
                    width: "70%",
                    height: "100%",
                    margin: 0,
                    overflow: "hidden",
                    "@media print": { 
                      p: 2,
                      height: "100%",
                      margin: 0,
                      overflow: "hidden",
                    },
                  }}
                >
                  <Box sx={{ 
                    height: "100%", 
                    overflow: "hidden",
                    "& > *": {
                      overflow: "hidden"
                    }
                  }}>
                    <div dangerouslySetInnerHTML={{ 
                      __html: pageContent.main.map(s => s.outerHTML).join('') 
                    }} />
                  </Box>
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
              bgcolor: mainContainerBg,
              boxShadow: 3,
              fontFamily: font,
              fontSize: fontSize,
              fontStyle: fontStyle,
              lineHeight: `${lineSpacing / 20}`,
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              "@media print": {
                width: page.width,
                height: page.height,
                boxShadow: "none",
                m: 0,
              },
            }}
          >
            <div className="resume-section">
              <Box sx={nameBoxStyle}>
                <Grid container spacing={4} alignItems="center">
                  <Grid item xs={12} sm={2} sx={{ display: { xs: 'none', sm: 'block' } }}>
                    <Avatar 
                      src={photo}
                      sx={{ 
                        width: 100, 
                        height: 100, 
                        border: `3px solid ${color}`, 
                        boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)'
                      }} 
                    />
                  </Grid>
                  <Grid item xs={12} sm={10}>
                    <Typography variant="h2" sx={{ 
                      fontWeight: '900', 
                      color: textDark, 
                      lineHeight: 1.1, 
                      fontFamily:font,
                      fontSize: sizes.name 
                    }}>
                      {data.firstName} {data.lastName}
                    </Typography>
                    <Typography variant="h5" sx={{ 
                      color: color, 
                      fontWeight: 'bold', 
                      letterSpacing: 2, 
                      textTransform: 'uppercase', 
                      mt: 0.5,fontFamily:font,
                      fontSize: sizes.role
                    }}>
                      {data.currentPosition}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            </div>

            <Grid container sx={{ 
              height: `calc(100% - 150px)`,
              margin: 0,
              overflow: 'hidden'
            }}>
              <Grid
                item
                xs={12}
                sm={4}
                sx={{
                  width: "30%",
                  height: "100%",
                  margin: 0,
                  padding: 0,
                }}
              >
                <Box sx={{ 
                  backgroundColor: backgroundGray,
                  color: textLight,
                  p: 4,
                  height: "100%",
                  margin: 0,
                  display: "flex",
                  flexDirection: "column",
                  overflow: "hidden",
                  "@media print": {
                    backgroundColor: backgroundGray,
                    WebkitPrintColorAdjust: "exact",
                    printColorAdjust: "exact",
                    height: "100%",
                    margin: 0,
                  },
                }}>
                  {renderSidebarContent()}
                </Box>
              </Grid>
              <Grid
                item
                xs={12}
                sm={8}
                sx={{
                  p: `${topBottomMargin}px ${sideMargins}px`,
                  width: "70%",
                  height: "100%",
                  margin: 0,
                  overflow: "hidden",
                  "@media print": { 
                    p: 2,
                    height: "100%",
                    margin: 0,
                  },
                }}
              >
                <Typography>Loading resume...</Typography>
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

export default ModernResume;