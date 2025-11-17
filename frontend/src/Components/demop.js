import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  Box,
  Typography,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Button,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SchoolIcon from '@mui/icons-material/School';
import WorkIcon from '@mui/icons-material/Work';
import LanguageIcon from '@mui/icons-material/Language';
import ComputerIcon from '@mui/icons-material/Computer';
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

// Map page size to CSS dimensions
const pageSizeMap = {
  A4: { width: '210mm', height: '297mm' },
  Letter: { width: '216mm', height: '279mm' },
  Legal: { width: '216mm', height: '356mm' },
  A3: { width: '297mm', height: '420mm' },
  Executive: { width: '184mm', height: '267mm' },
};

const defaultData = {
  firstName: "Donna",
  lastName: "Stroupe",
 currentPosition : "Sales Representative",
  phone: "+1 456-789-0123",
  email: "hello@email.com",
  city: "Anywhere St, Anytown",
  profile: "I am a Sales Representative with extensive experience in the fast-moving consumer goods industry. I am a professional who initiates and manages relationships with clients, who serves as their point of contact, and I am adept at following up with leads.",
  skills: [
    "Fast-moving consumer goods",
    "Packaged consumer goods sales", 
    "Corporate sales account management"
  ],
  references: [
    {
      name: "Estelle Denny",
      position: "Associate Director, COO",
      email: "estelledenny@gmail.com",
    },
    {
      name: "Harper Russo", 
      position: "Associate Director, CEO",
      email: "harperrusso@gmail.com",
    }
  ]
};

// Separate section orders for left and right sides
const defaultLeftSectionOrder = [
  'photo',
  'contact',
  'education',
  'skills',
  'languages'
];

const defaultRightSectionOrder = [
  'nameTitle',
  'aboutMe',
  'workExperience',
  'certifications',
  'accomplishments',
  'softwareSkills',
  'volunteering',
  'interests',
  'websites',
  'additionalInfo',
  'references'
];

const Resume16 = ({
  color = '#a7ad63ff',
  nameColor = '#333333',
  sidebarBackground = '#a7ad63ff',
  headerBackground = '#a7ad63ff',
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
  borderTopRightRadius = '100px',
  borderTopLeftRadius = '100px',
  theme,
  formData = {},
  photo = "",
  workExperiences = [],
  exporting = false,
  enableDragDrop = true,
}) => {
  const page = pageSizeMap[pageSize] || pageSizeMap.A4;
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
  const sidebarRef = useRef(null);

  // State for section ordering - separate for left and right
  const [leftSectionOrder, setLeftSectionOrder] = useState(defaultLeftSectionOrder);
  const [rightSectionOrder, setRightSectionOrder] = useState(defaultRightSectionOrder);
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const [dragOverSide, setDragOverSide] = useState(null);
  
  // State for arrange sections dialog
  const [arrangeDialogOpen, setArrangeDialogOpen] = useState(false);

  // Use theme color if provided, otherwise use the color prop
  const primaryColor = theme?.primary || color;
  
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

  useEffect(() => {
    // Load data from localStorage (same as Resume1.js)
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
    // References: try multiple keys and normalize entries to objects
    const referenceKeys = ["references", "referencesList", "referenceList", "savedReferences"];
    let rawRefs = [];
    for (const k of referenceKeys) {
      const v = localStorage.getItem(k);
      if (v) {
        try { rawRefs = JSON.parse(v); break; } catch (e) { continue; }
      }
    }
    const normalizeReferences = (arr) => {
      if (!Array.isArray(arr)) return [];
      return arr.map(r => {
        if (typeof r === "string") return { name: r };
        if (typeof r === "object" && r !== null) {
          return {
            name: r.name || r.referenceName || r.reference || "",
            position: r.position || r.jobTitle || r.currentPosition || "",
            company: r.company || r.companyName || "",
            phone: r.phone || r.contact || "",
            email: r.email || r.mail || ""
          };
        }
        return { name: String(r) };
      });
    };
    setSavedReferences(normalizeReferences(rawRefs));
    
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
  const savedLeftSectionOrder = localStorage.getItem("resume16LeftSectionOrder");
  if (savedLeftSectionOrder) {
    // 🔥 FIX: Left side-ல custom sections auto add ஆகாது - filter only
    const parsedOrder = JSON.parse(savedLeftSectionOrder);
    const filteredOrder = parsedOrder.filter(section => !section.startsWith('custom_'));
    setLeftSectionOrder(filteredOrder);
    console.log('🔄 Loaded left section order WITHOUT custom sections:', filteredOrder);
  } else {
    setLeftSectionOrder(defaultLeftSectionOrder);
  }

  const savedRightSectionOrder = localStorage.getItem("resume16RightSectionOrder");
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

// 🔥 ADD THIS useEffect TO AUTOMATICALLY ADD/REMOVE CUSTOM SECTIONS
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
      localStorage.setItem("resume16RightSectionOrder", JSON.stringify(newRightOrder));
      console.log('📝 Final right section order with ONLY CURRENT custom sections:', newRightOrder);
    }
    
    // 🔥 FIX: Left side-லிருந்து custom sections-ஐ remove செய்யவும்
    const currentLeftOrder = [...leftSectionOrder];
    const filteredLeftOrder = currentLeftOrder.filter(section => !section.startsWith('custom_'));
    if (JSON.stringify(filteredLeftOrder) !== JSON.stringify(currentLeftOrder)) {
      setLeftSectionOrder(filteredLeftOrder);
      localStorage.setItem("resume16LeftSectionOrder", JSON.stringify(filteredLeftOrder));
      console.log('🗑️ Removed custom sections from left side:', filteredLeftOrder);
    }
    
  } else if (userId && Object.keys(customSections).length === 0) {
    // If no current custom sections, remove all custom sections from both sides
    const currentRightOrder = [...rightSectionOrder];
    const filteredRightOrder = currentRightOrder.filter(section => !section.startsWith('custom_'));
    
    if (filteredRightOrder.length !== currentRightOrder.length) {
      setRightSectionOrder(filteredRightOrder);
      localStorage.setItem("resume16RightSectionOrder", JSON.stringify(filteredRightOrder));
      console.log('🗑️ Removed all custom sections from right side (no current sections)');
    }
    
    const currentLeftOrder = [...leftSectionOrder];
    const filteredLeftOrder = currentLeftOrder.filter(section => !section.startsWith('custom_'));
    if (filteredLeftOrder.length !== currentLeftOrder.length) {
      setLeftSectionOrder(filteredLeftOrder);
      localStorage.setItem("resume16LeftSectionOrder", JSON.stringify(filteredLeftOrder));
      console.log('🗑️ Removed all custom sections from left side (no current sections)');
    }
  }
}, [customSections]);

  // Save section orders to localStorage whenever they change
  useEffect(() => {
    if (leftSectionOrder.length > 0) {
      localStorage.setItem("resume16LeftSectionOrder", JSON.stringify(leftSectionOrder));
    }
  }, [leftSectionOrder]);

  useEffect(() => {
    if (rightSectionOrder.length > 0) {
      localStorage.setItem("resume16RightSectionOrder", JSON.stringify(rightSectionOrder));
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
      'photo': 'Profile Photo',
      'contact': 'Contact',
      'education': 'Education',
      'skills': 'Skills',
      'languages': 'Languages',
      'nameTitle': 'Name & Title',
      'aboutMe': 'About Me',
      'workExperience': 'Work Experience',
      'certifications': 'Certifications',
      'accomplishments': 'Accomplishments',
      'softwareSkills': 'Software Skills',
      'volunteering': 'Volunteering',
      'interests': 'Interests',
      'websites': 'Websites/Profiles',
      'additionalInfo': 'Additional Information',
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

  const renderLeftSectionContent = (sectionId) => {
    switch (sectionId) {
      case 'photo':
        return (
          <Avatar
            alt="Profile"
            src={photo || "/path/to/your/image.jpg"}
            sx={{
              width: 140,
              height: 140,
              mb: 2,
              border: '3px solid white',
              bgcolor: palette.accentColor,
              '@media print': {
                bgcolor: palette.accentColor,
                border: '3px solid white',
              },
            }}
          />
        );
      
      case 'contact':
        return (
          <>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ 
                fontSize: headingSize, 
                fontWeight: 'bold', 
                mb: 1, 
                mt: 1,
                fontFamily: font,
                fontStyle: fontStyle,
              }}
            >
              CONTACT
            </Typography>
            <List dense sx={{ width: '100%', fontFamily: font }}>
              <ListItem sx={{ mb: `${paragraphSpacing / 20}px`, px: 0, fontFamily: font }}>
                <ListItemIcon sx={{ color: 'white', minWidth: '30px', fontFamily: font }}>
                  <PhoneIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText
                  primary={data.phone}
                  primaryTypographyProps={{
                    color: 'white',
                    fontSize: fontSize,
                    style: { fontStyle },
                    fontFamily: font,
                  }}
                  sx={{ fontFamily: font }}
                />
              </ListItem>
              <ListItem sx={{ mb: `${paragraphSpacing / 20}px`, px: 0, fontFamily: font }}>
                <ListItemIcon sx={{ color: 'white', minWidth: '30px', fontFamily: font }}>
                  <EmailIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText
                  primary={data.email}
                  primaryTypographyProps={{
                    color: 'white',
                    fontSize: fontSize,
                    style: { fontStyle },
                    fontFamily: font,
                  }}
                  sx={{ fontFamily: font }}
                />
              </ListItem>
              <ListItem sx={{ mb: `${paragraphSpacing / 20}px`, px: 0, fontFamily: font }}>
                <ListItemIcon sx={{ color: 'white', minWidth: '30px', fontFamily: font }}>
                  <LocationOnIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText
                  primary={data.city}
                  primaryTypographyProps={{
                    color: 'white',
                    fontSize: fontSize,
                    style: { fontStyle },
                    fontFamily: font,
                  }}
                  sx={{ fontFamily: font }}
                />
              </ListItem>
              {data.website && (
                <ListItem sx={{ mb: `${paragraphSpacing / 20}px`, px: 0, fontFamily: font }}>
                  <ListItemIcon sx={{ color: 'white', minWidth: '30px', fontFamily: font }}>
                    <ComputerIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText
                    primary={data.website}
                    primaryTypographyProps={{
                      color: 'white',
                      fontSize: fontSize,
                      style: { fontStyle },
                      fontFamily: font,
                    }}
                    sx={{ fontFamily: font }}
                  />
                </ListItem>
              )}
            </List>
          </>
        );
      
      case 'education':
        return (
          <>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ 
                fontSize: headingSize, 
                fontWeight: 'bold', 
                mb: 1, 
                mt: 1,
                fontFamily: font,
                fontStyle: fontStyle,
              }}
            >
              EDUCATION
            </Typography>
            <Box sx={{ width: '100%', pl: 1, fontFamily: font }}>
              {educationEntries.length > 0 ? (
                educationEntries.map((edu) => (
                  <Box key={edu.id} sx={{ mb: 2, fontFamily: font }}>
                    <Typography
                      sx={{
                        fontWeight: 'bold',
                        fontSize: fontSize,
                        fontStyle: fontStyle,
                        fontFamily: font,
                        lineHeight: `${lineSpacing}px`,
                      }}
                    >
                      {edu.degree} {edu.fieldOfStudy && `- ${edu.fieldOfStudy}`}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: fontSize,
                        fontStyle: fontStyle,
                        fontFamily: font,
                        lineHeight: `${lineSpacing}px`,
                      }}
                    >
                      {edu.schoolName}
                      {edu.schoolLocation && `, ${edu.schoolLocation}`}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: fontSize,
                        fontStyle: 'italic',
                        fontFamily: font,
                        lineHeight: `${lineSpacing}px`,
                      }}
                    >
                      {formatDate(edu.gradMonth, edu.gradYear)}
                    </Typography>
                    {edu.additionalCoursework && (
                      <Typography
                        sx={{
                          fontSize: fontSize,
                          fontStyle: fontStyle,
                          fontFamily: font,
                          lineHeight: `${lineSpacing}px`,
                        }}
                      >
                        {edu.additionalCoursework}
                      </Typography>
                    )}
                  </Box>
                ))
              ) : (
                <Box sx={{ mb: 2, fontFamily: font }}>
                  <Typography
                    sx={{
                      fontWeight: 'bold',
                      fontSize: fontSize,
                      fontStyle: fontStyle,
                      fontFamily: font,
                      lineHeight: `${lineSpacing}px`,
                    }}
                  >
                    B.A. Sales and Commerce
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: fontSize,
                      fontStyle: fontStyle,
                      fontFamily: font,
                      lineHeight: `${lineSpacing}px`,
                    }}
                  >
                    Western University
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: fontSize,
                      fontStyle: 'italic',
                      fontFamily: font,
                      lineHeight: `${lineSpacing}px`,
                    }}
                  >
                    2019 - 2024
                  </Typography>
                </Box>
              )}
            </Box>
          </>
        );
      
      case 'skills':
        return (
          <>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ 
                fontSize: headingSize, 
                fontWeight: 'bold', 
                mb: 1, 
                mt: 1,
                fontFamily: font,
                fontStyle: fontStyle,
              }}
            >
              SKILLS
            </Typography>
            <Box sx={{ width: '100%', pl: 1, fontFamily: font }}>
              {savedSkills.length > 0 ? (
                savedSkills.map((skill, index) => (
                  <Typography
                    key={index}
                    sx={{
                      mb: `${paragraphSpacing / 20}px`,
                      fontSize: fontSize,
                      fontStyle: fontStyle,
                      fontFamily: font,
                      lineHeight: `${lineSpacing}px`,
                    }}
                  >
                    • {skill.name} {skill.rating ? `(${skill.rating}%)` : ''}
                  </Typography>
                ))
              ) : (
                data.skills.map((skill, index) => (
                  <Typography
                    key={index}
                    sx={{
                      mb: `${paragraphSpacing / 20}px`,
                      fontSize: fontSize,
                      fontStyle: fontStyle,
                      fontFamily: font,
                      lineHeight: `${lineSpacing}px`,
                    }}
                  >
                    • {skill}
                  </Typography>
                ))
              )}
            </Box>
          </>
        );
      
      case 'languages':
        return savedLanguages.length > 0 ? (
          <>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ 
                fontSize: headingSize, 
                fontWeight: 'bold', 
                mb: 1, 
                mt: 1,
                fontFamily: font,
                fontStyle: fontStyle,
              }}
            >
              LANGUAGES
            </Typography>
            <Box sx={{ width: '100%', pl: 1, fontFamily: font }}>
              {savedLanguages.map((lang, index) => (
                <Typography
                  key={index}
                  sx={{
                    mb: `${paragraphSpacing / 20}px`,
                    fontSize: fontSize,
                    fontStyle: fontStyle,
                    fontFamily: font,
                    lineHeight: `${lineSpacing}px`,
                  }}
                >
                  • {lang.name} {lang.level ? `– ${lang.level}` : ''}
                </Typography>
              ))}
            </Box>
          </>
        ) : null;
      
      default:
        // For sections that were moved from right side, use renderRightSectionContent with inSidebar=true
        return renderRightSectionContent(sectionId, true);
    }
  };

  const renderRightSectionContent = (sectionId, inSidebar = false) => {
    const textColor = inSidebar ? "white" : "inherit";
    
    switch (sectionId) {
      case 'nameTitle':
        return (
          <div className="resume-section">
            <Typography
              sx={{
                mb: `${paragraphSpacing / 10}px`,
                fontSize: '2.2rem',
                fontWeight: 'bold',
                color: inSidebar ? 'white' : palette.nameColor,
                fontFamily: font,
                fontStyle: fontStyle,
                lineHeight: `${lineSpacing}px`,
              }}
            >
              {data.firstName} <span style={{ color: inSidebar ? 'white' : palette.accentColor, fontFamily: font, fontStyle: fontStyle }}>{data.lastName}</span>
            </Typography>
            <Typography
              sx={{
                mb: 3,
                fontSize: '1.4rem',
                fontStyle: fontStyle,
                color: inSidebar ? 'white' : '#666',
                fontFamily: font,
                lineHeight: `${lineSpacing}px`,
              }}
            >
              {data.currentPosition}
            </Typography>
          </div>
        );
      
      case 'aboutMe':
        return (
          <div className="resume-section">
            <Box sx={{ mt: 3, fontFamily: font }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, fontFamily: font }}>
                <WorkIcon sx={{ color: inSidebar ? 'white' : palette.accentColor, mr: 1, fontSize: '28px', fontFamily: font }} />
                <Typography
                  sx={{
                    fontSize: headingSize,
                    fontWeight: 'bold',
                    color: inSidebar ? 'white' : palette.accentColor,
                    fontFamily: font,
                    fontStyle: fontStyle,
                    lineHeight: `${lineSpacing}px`,
                  }}
                >
                  ABOUT ME
                </Typography>
              </Box>
              <Typography
                sx={{
                  mb: `${paragraphSpacing / 20}px`,
                  fontSize: fontSize,
                  fontStyle: fontStyle,
                  textIndent: `${paragraphIndent}px`,
                  fontFamily: font,
                  lineHeight: `${lineSpacing}px`,
                  color: textColor,
                }}
              >
                {savedSummary || data.profile}
              </Typography>
            </Box>
          </div>
        );
      
      case 'workExperience':
        return (
          <div className="resume-section">
            <Box sx={{ mt: 3, fontFamily: font }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, fontFamily: font }}>
                <WorkIcon sx={{ color: inSidebar ? 'white' : palette.accentColor, mr: 1, fontSize: '28px', fontFamily: font }} />
                <Typography
                  sx={{
                    fontSize: headingSize,
                    fontWeight: 'bold',
                    color: inSidebar ? 'white' : palette.accentColor,
                    fontFamily: font,
                    fontStyle: fontStyle,
                    lineHeight: `${lineSpacing}px`,
                  }}
                >
                  WORK EXPERIENCE
                </Typography>
              </Box>

              {workExperiences && workExperiences.length > 0 ? (
                workExperiences.map((work, i) => (
                  <Box key={i} sx={{ mb: 3, fontFamily: font }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ fontFamily: font }}>
                      <Typography
                        sx={{
                          fontWeight: 'bold',
                          fontSize: '1.1rem',
                          fontStyle: fontStyle,
                          fontFamily: font,
                          lineHeight: `${lineSpacing}px`,
                          color: textColor,
                        }}
                      >
                        {work.jobTitle}
                      </Typography>
                      <Typography
                        sx={{
                          fontStyle: 'italic',
                          fontSize: fontSize,
                          color: inSidebar ? 'rgba(255,255,255,0.8)' : '#666',
                          fontFamily: font,
                          lineHeight: `${lineSpacing}px`,
                        }}
                      >
                        {formatDate(work.startMonth, work.startYear)} -{' '}
                        {work.current ? 'Present' : formatDate(work.endMonth, work.endYear)}
                      </Typography>
                    </Box>
                    <Typography
                      sx={{
                        mb: 1,
                        color: inSidebar ? 'rgba(255,255,255,0.8)' : palette.lightText,
                        fontSize: fontSize,
                        fontStyle: fontStyle,
                        fontFamily: font,
                        lineHeight: `${lineSpacing}px`,
                      }}
                    >
                      {work.employer} {work.companyName && `| ${work.companyName}`}
                    </Typography>
                    {work.description && (
                      <Box
                        sx={{
                          mb: `${paragraphSpacing / 20}px`,
                          fontSize: fontSize,
                          fontStyle: fontStyle,
                          textIndent: `${paragraphIndent}px`,
                          fontFamily: font,
                          lineHeight: `${lineSpacing}px`,
                          color: textColor,
                        }}
                        dangerouslySetInnerHTML={{
                          __html: work.description
                            .replace(/\*\*(.*?)\*\*/g, '<strong style="font-family: ' + font + '; font-weight: bold; color: ' + textColor + ';">$1</strong>')
                            .replace(/\*(.*?)\*/g, '<em style="font-family: ' + font + '; font-style: italic; color: ' + textColor + ';">$1</em>')
                            .replace(/<u>(.*?)<\/u>/g, '<u style="font-family: ' + font + '; color: ' + textColor + ';">$1</u>')
                            .replace(/\n/g, '<br style="font-family: ' + font + ';"/>'),
                        }}
                      />
                    )}
                  </Box>
                ))
              ) : (
                // Default work experience if none provided
                <>
                  <Box sx={{ mb: 3, fontFamily: font }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ fontFamily: font }}>
                      <Typography
                        sx={{
                          fontWeight: 'bold',
                          fontSize: '1.1rem',
                          fontStyle: fontStyle,
                          fontFamily: font,
                          lineHeight: `${lineSpacing}px`,
                          color: textColor,
                        }}
                      >
                        Consumer Goods Seller
                      </Typography>
                      <Typography
                        sx={{
                          fontStyle: 'italic',
                          fontSize: fontSize,
                          color: inSidebar ? 'rgba(255,255,255,0.8)' : '#666',
                          fontFamily: font,
                          lineHeight: `${lineSpacing}px`,
                        }}
                      >
                        Aug 2018 - Present
                      </Typography>
                    </Box>
                    <Typography
                      sx={{
                        mb: 1,
                        color: inSidebar ? 'rgba(255,255,255,0.8)' : palette.lightText,
                        fontSize: fontSize,
                        fontStyle: fontStyle,
                        fontFamily: font,
                        lineHeight: `${lineSpacing}px`,
                      }}
                    >
                      Impressive Industries
                    </Typography>
                    <Typography
                      sx={{
                        mb: `${paragraphSpacing / 20}px`,
                        fontSize: fontSize,
                        fontStyle: fontStyle,
                        textIndent: `${paragraphIndent}px`,
                        fontFamily: font,
                        lineHeight: `${lineSpacing}px`,
                        color: textColor,
                      }}
                    >
                      • Offer consumer goods packages to corporate and clients
                      <br />
                      • Meet with clients every quarter to update or renew services
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 3, fontFamily: font }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ fontFamily: font }}>
                      <Typography
                        sx={{
                          fontWeight: 'bold',
                          fontSize: '1.1rem',
                          fontStyle: fontStyle,
                          fontFamily: font,
                          lineHeight: `${lineSpacing}px`,
                          color: textColor,
                        }}
                      >
                        PMCG Sales Agent
                      </Typography>
                      <Typography
                        sx={{
                          fontStyle: 'italic',
                          fontSize: fontSize,
                          color: inSidebar ? 'rgba(255,255,255,0.8)' : '#666',
                          fontFamily: font,
                          lineHeight: `${lineSpacing}px`,
                        }}
                      >
                        Jul 2016 - Aug 2018
                      </Typography>
                    </Box>
                    <Typography
                      sx={{
                        mb: 1,
                        color: inSidebar ? 'rgba(255,255,255,0.8)' : palette.lightText,
                        fontSize: fontSize,
                        fontStyle: fontStyle,
                        fontFamily: font,
                        lineHeight: `${lineSpacing}px`,
                      }}
                    >
                      Fast-moving Industries
                    </Typography>
                    <Typography
                      sx={{
                        mb: `${paragraphSpacing / 20}px`,
                        fontSize: fontSize,
                        fontStyle: fontStyle,
                        textIndent: `${paragraphIndent}px`,
                        fontFamily: font,
                        lineHeight: `${lineSpacing}px`,
                        color: textColor,
                      }}
                    >
                      • Visited corporate client offices to renew latest products
                      <br />
                      • Built relationships with clients to maintain sales goals and create new
                      opportunities
                    </Typography>
                  </Box>
                </>
              )}
            </Box>
          </div>
        );
      
      case 'certifications':
        return savedCertifications.length > 0 ? (
          <div className="resume-section">
            <Box sx={{ mt: 3, fontFamily: font }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, fontFamily: font }}>
                <SchoolIcon sx={{ color: inSidebar ? 'white' : palette.accentColor, mr: 1, fontSize: '28px', fontFamily: font }} />
                <Typography
                  sx={{
                    fontSize: headingSize,
                    fontWeight: 'bold',
                    color: inSidebar ? 'white' : palette.accentColor,
                    fontFamily: font,
                    fontStyle: fontStyle,
                    lineHeight: `${lineSpacing}px`,
                  }}
                >
                  CERTIFICATIONS
                </Typography>
              </Box>
              {savedCertifications.map((cert, index) => (
                <Typography
                  key={index}
                  sx={{
                    mb: `${paragraphSpacing / 20}px`,
                    fontSize: fontSize,
                    fontStyle: fontStyle,
                    fontFamily: font,
                    lineHeight: `${lineSpacing}px`,
                    color: textColor,
                  }}
                >
                  • {cert.name} – {cert.provider} ({cert.year})
                </Typography>
              ))}
            </Box>
          </div>
        ) : null;
      
      case 'accomplishments':
        return savedAccomplishments.length > 0 ? (
          <div className="resume-section">
            <Box sx={{ mt: 3, fontFamily: font }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, fontFamily: font }}>
                <WorkIcon sx={{ color: inSidebar ? 'white' : palette.accentColor, mr: 1, fontSize: '28px', fontFamily: font }} />
                <Typography
                  sx={{
                    fontSize: headingSize,
                    fontWeight: 'bold',
                    color: inSidebar ? 'white' : palette.accentColor,
                    fontFamily: font,
                    fontStyle: fontStyle,
                    lineHeight: `${lineSpacing}px`,
                  }}
                >
                  ACCOMPLISHMENTS
                </Typography>
              </Box>
              {savedAccomplishments.map((acc, index) => (
                <Typography
                  key={index}
                  sx={{
                    mb: `${paragraphSpacing / 20}px`,
                    fontSize: fontSize,
                    fontStyle: fontStyle,
                    whiteSpace: 'pre-line',
                    fontFamily: font,
                    lineHeight: `${lineSpacing}px`,
                    color: textColor,
                  }}
                >
                  • {acc}
                </Typography>
              ))}
            </Box>
          </div>
        ) : null;
      
      case 'softwareSkills':
        return softwareSkills.length > 0 ? (
          <div className="resume-section">
            <Box sx={{ mt: 3, fontFamily: font }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, fontFamily: font }}>
                <ComputerIcon sx={{ color: inSidebar ? 'white' : palette.accentColor, mr: 1, fontSize: '28px', fontFamily: font }} />
                <Typography
                  sx={{
                    fontSize: headingSize,
                    fontWeight: 'bold',
                    color: inSidebar ? 'white' : palette.accentColor,
                    fontFamily: font,
                    fontStyle: fontStyle,
                    lineHeight: `${lineSpacing}px`,
                  }}
                >
                  SOFTWARE SKILLS
                </Typography>
              </Box>
              {softwareSkills.map((skill, index) => (
                <Typography
                  key={index}
                  sx={{
                    mb: `${paragraphSpacing / 20}px`,
                    fontSize: fontSize,
                    fontStyle: fontStyle,
                    fontFamily: font,
                    lineHeight: `${lineSpacing}px`,
                    color: textColor,
                  }}
                >
                  • {skill.name} {skill.level && `— ${skill.level}%`}
                </Typography>
              ))}
            </Box>
          </div>
        ) : null;
      
      case 'volunteering':
        return savedVolunteering.length > 0 ? (
          <div className="resume-section">
            <Box sx={{ mt: 3, fontFamily: font }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, fontFamily: font }}>
                <WorkIcon sx={{ color: inSidebar ? 'white' : palette.accentColor, mr: 1, fontSize: '28px', fontFamily: font }} />
                <Typography
                  sx={{
                    fontSize: headingSize,
                    fontWeight: 'bold',
                    color: inSidebar ? 'white' : palette.accentColor,
                    fontFamily: font,
                    fontStyle: fontStyle,
                    lineHeight: `${lineSpacing}px`,
                  }}
                >
                  VOLUNTEERING
                </Typography>
              </Box>
              {savedVolunteering.map((vol, index) => (
                <Box key={index} sx={{ mb: 2, fontFamily: font }}>
                  <Typography
                    sx={{
                      fontSize: fontSize,
                      fontWeight: 'bold',
                      fontStyle: fontStyle,
                      fontFamily: font,
                      lineHeight: `${lineSpacing}px`,
                      color: textColor,
                    }}
                  >
                    {vol.subtopic || vol.organization}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: fontSize,
                      color: inSidebar ? 'rgba(255,255,255,0.8)' : 'gray',
                      fontStyle: 'italic',
                      fontFamily: font,
                      lineHeight: `${lineSpacing}px`,
                    }}
                  >
                    {vol.fromDate} - {vol.toDate}
                  </Typography>
                  {vol.content && (
                    <Typography
                      sx={{
                        fontSize: fontSize,
                        whiteSpace: 'pre-line',
                        mt: 0.5,
                        fontStyle: fontStyle,
                        fontFamily: font,
                        lineHeight: `${lineSpacing}px`,
                        color: textColor,
                      }}
                    >
                      {vol.content}
                    </Typography>
                  )}
                </Box>
              ))}
            </Box>
          </div>
        ) : null;
      
      case 'interests':
        return savedInterests.length > 0 ? (
          <div className="resume-section">
            <Box sx={{ mt: 3, fontFamily: font }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, fontFamily: font }}>
                <ComputerIcon sx={{ color: inSidebar ? 'white' : palette.accentColor, mr: 1, fontSize: '28px', fontFamily: font }} />
                <Typography
                  sx={{
                    fontSize: headingSize,
                    fontWeight: 'bold',
                    color: inSidebar ? 'white' : palette.accentColor,
                    fontFamily: font,
                    fontStyle: fontStyle,
                    lineHeight: `${lineSpacing}px`,
                  }}
                >
                  INTERESTS
                </Typography>
              </Box>
              {savedInterests.map((interest, i) => (
                <Typography
                  key={i}
                  sx={{
                    mb: `${paragraphSpacing / 20}px`,
                    fontSize: fontSize,
                    fontStyle: fontStyle,
                    fontFamily: font,
                    lineHeight: `${lineSpacing}px`,
                    color: textColor,
                  }}
                >
                  • {interest}
                </Typography>
              ))}
            </Box>
          </div>
        ) : null;
      
      case 'websites':
        return savedWebsites.length > 0 ? (
          <div className="resume-section">
            <Box sx={{ mt: 3, fontFamily: font }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, fontFamily: font }}>
                <ComputerIcon sx={{ color: inSidebar ? 'white' : palette.accentColor, mr: 1, fontSize: '28px', fontFamily: font }} />
                <Typography
                  sx={{
                    fontSize: headingSize,
                    fontWeight: 'bold',
                    color: inSidebar ? 'white' : palette.accentColor,
                    fontFamily: font,
                    fontStyle: fontStyle,
                    lineHeight: `${lineSpacing}px`,
                  }}
                >
                  WEBSITES / PROFILES
                </Typography>
              </Box>
              {savedWebsites.map((site, index) => (
                <Typography
                  key={index}
                  sx={{
                    mb: `${paragraphSpacing / 20}px`,
                    fontSize: fontSize,
                    fontStyle: fontStyle,
                    fontFamily: font,
                    lineHeight: `${lineSpacing}px`,
                    color: textColor,
                  }}
                >
                  • <a href={site.url} style={{ color: inSidebar ? 'white' : palette.accentColor, fontFamily: font, fontStyle: fontStyle }} target="_blank" rel="noopener noreferrer">
                      {site.url}
                    </a>
                </Typography>
              ))}
            </Box>
          </div>
        ) : null;
      
      case 'additionalInfo':
        return savedAdditionalInfo.length > 0 ? (
          <div className="resume-section">
            <Box sx={{ mt: 3, fontFamily: font }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, fontFamily: font }}>
                <ComputerIcon sx={{ color: inSidebar ? 'white' : palette.accentColor, mr: 1, fontSize: '28px', fontFamily: font }} />
                <Typography
                  sx={{
                    fontSize: headingSize,
                    fontWeight: 'bold',
                    color: inSidebar ? 'white' : palette.accentColor,
                    fontFamily: font,
                    fontStyle: fontStyle,
                    lineHeight: `${lineSpacing}px`,
                  }}
                >
                  ADDITIONAL INFORMATION
                </Typography>
              </Box>
              {savedAdditionalInfo.map((info, index) => (
                <Typography
                  key={index}
                  sx={{
                    mb: `${paragraphSpacing / 20}px`,
                    fontSize: fontSize,
                    fontStyle: fontStyle,
                    fontFamily: font,
                    lineHeight: `${lineSpacing}px`,
                    color: textColor,
                  }}
                >
                  • {info}
                </Typography>
              ))}
            </Box>
          </div>
        ) : null;
      
      case 'references':
        return (
          <div className="resume-section">
            <Box sx={{ mt: 3, fontFamily: font }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, fontFamily: font }}>
                <WorkIcon sx={{ color: inSidebar ? 'white' : palette.accentColor, mr: 1, fontSize: '28px', fontFamily: font }} />
                <Typography
                  sx={{
                    fontSize: headingSize,
                    fontWeight: 'bold',
                    color: inSidebar ? 'white' : palette.accentColor,
                    fontFamily: font,
                    fontStyle: fontStyle,
                    lineHeight: `${lineSpacing}px`,
                  }}
                >
                  REFERENCES
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', fontFamily: font }}>
                {savedReferences.length > 0 ? (
                  savedReferences.map((ref, index) => (
                    <Box key={index} sx={{ width: '48%', fontFamily: font }}>
                      <Typography
                        sx={{
                          fontWeight: 'bold',
                          fontSize: '1.1rem',
                          fontStyle: fontStyle,
                          fontFamily: font,
                          lineHeight: `${lineSpacing}px`,
                          color: textColor,
                        }}
                      >
                        {ref.name}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: fontSize,
                          fontStyle: fontStyle,
                          color: inSidebar ? 'rgba(255,255,255,0.8)' : '#666',
                          fontFamily: font,
                          lineHeight: `${lineSpacing}px`,
                        }}
                      >
                        {ref.position}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: fontSize,
                          fontStyle: fontStyle,
                          color: inSidebar ? 'rgba(255,255,255,0.8)' : '#666',
                          fontFamily: font,
                          lineHeight: `${lineSpacing}px`,
                        }}
                      >
                        {ref.email}
                      </Typography>
                    </Box>
                  ))
                ) : (
                  data.references.map((ref, index) => (
                    <Box key={index} sx={{ width: '48%', fontFamily: font }}>
                      <Typography
                        sx={{
                          fontWeight: 'bold',
                          fontSize: '1.1rem',
                          fontStyle: fontStyle,
                          fontFamily: font,
                          lineHeight: `${lineSpacing}px`,
                          color: textColor,
                        }}
                      >
                        {ref.name}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: fontSize,
                          fontStyle: fontStyle,
                          color: inSidebar ? 'rgba(255,255,255,0.8)' : '#666',
                          fontFamily: font,
                          lineHeight: `${lineSpacing}px`,
                        }}
                      >
                        {ref.position}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: fontSize,
                          fontStyle: fontStyle,
                          color: inSidebar ? 'rgba(255,255,255,0.8)' : '#666',
                          fontFamily: font,
                          lineHeight: `${lineSpacing}px`,
                        }}
                      >
                        {ref.email}
                      </Typography>
                    </Box>
                  ))
                )}
              </Box>
            </Box>
          </div>
        );
      
      // Handle left-side sections when they are moved to right side
      case 'photo':
        return !inSidebar ? (
          <div className="resume-section">
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
              <Avatar
                alt="Profile"
                src={photo || "/path/to/your/image.jpg"}
                sx={{
                  width: 140,
                  height: 140,
                  border: '3px solid #f0f0f0',
                  bgcolor: palette.accentColor,
                }}
              />
            </Box>
          </div>
        ) : null;
      
      case 'contact':
        return !inSidebar ? (
          <div className="resume-section">
            <Typography
              variant="h6"
              gutterBottom
              sx={{ 
                fontSize: headingSize, 
                fontWeight: 'bold', 
                mb: 1, 
                mt: 1,
                fontFamily: font,
                fontStyle: fontStyle,
              }}
            >
              CONTACT
            </Typography>
            <List dense sx={{ width: '100%', fontFamily: font }}>
              <ListItem sx={{ mb: `${paragraphSpacing / 20}px`, px: 0, fontFamily: font }}>
                <ListItemIcon sx={{ color: palette.accentColor, minWidth: '30px', fontFamily: font }}>
                  <PhoneIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText
                  primary={data.phone}
                  primaryTypographyProps={{
                    color: 'inherit',
                    fontSize: fontSize,
                    style: { fontStyle },
                    fontFamily: font,
                  }}
                  sx={{ fontFamily: font }}
                />
              </ListItem>
              <ListItem sx={{ mb: `${paragraphSpacing / 20}px`, px: 0, fontFamily: font }}>
                <ListItemIcon sx={{ color: palette.accentColor, minWidth: '30px', fontFamily: font }}>
                  <EmailIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText
                  primary={data.email}
                  primaryTypographyProps={{
                    color: 'inherit',
                    fontSize: fontSize,
                    style: { fontStyle },
                    fontFamily: font,
                  }}
                  sx={{ fontFamily: font }}
                />
              </ListItem>
              <ListItem sx={{ mb: `${paragraphSpacing / 20}px`, px: 0, fontFamily: font }}>
                <ListItemIcon sx={{ color: palette.accentColor, minWidth: '30px', fontFamily: font }}>
                  <LocationOnIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText
                  primary={data.city}
                  primaryTypographyProps={{
                    color: 'inherit',
                    fontSize: fontSize,
                    style: { fontStyle },
                    fontFamily: font,
                  }}
                  sx={{ fontFamily: font }}
                />
              </ListItem>
              {data.website && (
                <ListItem sx={{ mb: `${paragraphSpacing / 20}px`, px: 0, fontFamily: font }}>
                  <ListItemIcon sx={{ color: palette.accentColor, minWidth: '30px', fontFamily: font }}>
                    <ComputerIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText
                    primary={data.website}
                    primaryTypographyProps={{
                      color: 'inherit',
                      fontSize: fontSize,
                      style: { fontStyle },
                      fontFamily: font,
                    }}
                    sx={{ fontFamily: font }}
                  />
                </ListItem>
              )}
            </List>
          </div>
        ) : null;
      
      case 'education':
        return !inSidebar ? (
          <div className="resume-section">
            <Typography
              variant="h6"
              gutterBottom
              sx={{ 
                fontSize: headingSize, 
                fontWeight: 'bold', 
                mb: 1, 
                mt: 1,
                fontFamily: font,
                fontStyle: fontStyle,
              }}
            >
              EDUCATION
            </Typography>
            <Box sx={{ width: '100%', pl: 1, fontFamily: font }}>
              {educationEntries.length > 0 ? (
                educationEntries.map((edu) => (
                  <Box key={edu.id} sx={{ mb: 2, fontFamily: font }}>
                    <Typography
                      sx={{
                        fontWeight: 'bold',
                        fontSize: fontSize,
                        fontStyle: fontStyle,
                        fontFamily: font,
                        lineHeight: `${lineSpacing}px`,
                      }}
                    >
                      {edu.degree} {edu.fieldOfStudy && `- ${edu.fieldOfStudy}`}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: fontSize,
                        fontStyle: fontStyle,
                        fontFamily: font,
                        lineHeight: `${lineSpacing}px`,
                      }}
                    >
                      {edu.schoolName}
                      {edu.schoolLocation && `, ${edu.schoolLocation}`}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: fontSize,
                        fontStyle: 'italic',
                        fontFamily: font,
                        lineHeight: `${lineSpacing}px`,
                      }}
                    >
                      {formatDate(edu.gradMonth, edu.gradYear)}
                    </Typography>
                    {edu.additionalCoursework && (
                      <Typography
                        sx={{
                          fontSize: fontSize,
                          fontStyle: fontStyle,
                          fontFamily: font,
                          lineHeight: `${lineSpacing}px`,
                        }}
                      >
                        {edu.additionalCoursework}
                      </Typography>
                    )}
                  </Box>
                ))
              ) : (
                <Box sx={{ mb: 2, fontFamily: font }}>
                  <Typography
                    sx={{
                      fontWeight: 'bold',
                      fontSize: fontSize,
                      fontStyle: fontStyle,
                      fontFamily: font,
                      lineHeight: `${lineSpacing}px`,
                    }}
                  >
                    B.A. Sales and Commerce
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: fontSize,
                      fontStyle: fontStyle,
                      fontFamily: font,
                      lineHeight: `${lineSpacing}px`,
                    }}
                  >
                    Western University
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: fontSize,
                      fontStyle: 'italic',
                      fontFamily: font,
                      lineHeight: `${lineSpacing}px`,
                    }}
                  >
                    2019 - 2024
                  </Typography>
                </Box>
              )}
            </Box>
          </div>
        ) : null;
      
      case 'skills':
        return !inSidebar ? (
          <div className="resume-section">
            <Typography
              variant="h6"
              gutterBottom
              sx={{ 
                fontSize: headingSize, 
                fontWeight: 'bold', 
                mb: 1, 
                mt: 1,
                fontFamily: font,
                fontStyle: fontStyle,
              }}
            >
              SKILLS
            </Typography>
            <Box sx={{ width: '100%', pl: 1, fontFamily: font }}>
              {savedSkills.length > 0 ? (
                savedSkills.map((skill, index) => (
                  <Typography
                    key={index}
                    sx={{
                      mb: `${paragraphSpacing / 20}px`,
                      fontSize: fontSize,
                      fontStyle: fontStyle,
                      fontFamily: font,
                      lineHeight: `${lineSpacing}px`,
                    }}
                  >
                    • {skill.name} {skill.rating ? `(${skill.rating}%)` : ''}
                  </Typography>
                ))
              ) : (
                data.skills.map((skill, index) => (
                  <Typography
                    key={index}
                    sx={{
                      mb: `${paragraphSpacing / 20}px`,
                      fontSize: fontSize,
                      fontStyle: fontStyle,
                      fontFamily: font,
                      lineHeight: `${lineSpacing}px`,
                    }}
                  >
                    • {skill}
                  </Typography>
                ))
              )}
            </Box>
          </div>
        ) : null;
      
      case 'languages':
        return !inSidebar && savedLanguages.length > 0 ? (
          <div className="resume-section">
            <Typography
              variant="h6"
              gutterBottom
              sx={{ 
                fontSize: headingSize, 
                fontWeight: 'bold', 
                mb: 1, 
                mt: 1,
                fontFamily: font,
                fontStyle: fontStyle,
              }}
            >
              LANGUAGES
            </Typography>
            <Box sx={{ width: '100%', pl: 1, fontFamily: font }}>
              {savedLanguages.map((lang, index) => (
                <Typography
                  key={index}
                  sx={{
                    mb: `${paragraphSpacing / 20}px`,
                    fontSize: fontSize,
                    fontStyle: fontStyle,
                    fontFamily: font,
                    lineHeight: `${lineSpacing}px`,
                  }}
                >
                  • {lang.name} {lang.level ? `– ${lang.level}` : ''}
                </Typography>
              ))}
            </Box>
          </div>
        ) : null;
      
      default:
        // Handle custom sections
        if (sectionId.startsWith('custom_')) {
          const customSectionName = sectionId.replace('custom_', '');
          const items = customSections[customSectionName] || [];
          return items.length > 0 ? (
            <div className="resume-section">
              <Box sx={{ mt: 3, fontFamily: font }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, fontFamily: font }}>
                  <WorkIcon sx={{ color: inSidebar ? 'white' : palette.accentColor, mr: 1, fontSize: '28px', fontFamily: font }} />
                  <Typography
                    sx={{
                      fontSize: headingSize,
                      fontWeight: 'bold',
                      color: inSidebar ? 'white' : palette.accentColor,
                      fontFamily: font,
                      fontStyle: fontStyle,
                      lineHeight: `${lineSpacing}px`,
                    }}
                  >
                    {customSectionName.toUpperCase()}
                  </Typography>
                </Box>
                {items.map((item, i) => (
                  <Typography
                    key={i}
                    sx={{
                      mb: `${paragraphSpacing / 20}px`,
                      fontSize: fontSize,
                      fontStyle: fontStyle,
                      fontFamily: font,
                      lineHeight: `${lineSpacing}px`,
                      color: textColor,
                    }}
                  >
                    • {item}
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
  // include design/layout props so measurement updates immediately when user changes color/font/spacing
  }, [
    page.height,
    topBottomMargin,
    rightSectionOrder,
    color,
    theme,
    font,
    fontSize,
    fontStyle,
    headingSize,
    sectionSpacing,
    paragraphSpacing,
    lineSpacing,
    sideMargins,
    lineWeight,
    pageSize,
    sidebarBackground,
    headerBackground,
    nameColor,
    borderTopRightRadius,
    borderTopLeftRadius,
  ]);

  useEffect(() => {
    // Run immediately to avoid visible lag, then a short debounced re-measure
    paginateContent();
    const timeoutId = setTimeout(() => {
      paginateContent();
    }, 250);

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
    // design props
    color,
    theme,
    font,
    fontSize,
    fontStyle,
    headingSize,
    sectionSpacing,
    paragraphSpacing,
    lineSpacing,
    topBottomMargin,
    sideMargins,
    lineWeight,
    pageSize,
    sidebarBackground,
    headerBackground,
    nameColor,
    borderTopRightRadius,
    borderTopLeftRadius,
  ]);

  const renderMainContentToMeasure = () => (
    <Box ref={mainContentRef} sx={{ visibility: 'hidden', position: 'absolute', fontFamily: font }}>
      <Box sx={{ p: `${topBottomMargin}px ${sideMargins}px`, width: '70%', fontFamily: font }}>
        {/* Render right side sections in the specified order */}
        {rightSectionOrder.map(sectionId => (
          <React.Fragment key={sectionId}>
            {renderRightSectionContent(sectionId)}
          </React.Fragment>
        ))}
      </Box>
    </Box>
  );

  const renderSidebar = (isFirstPage = false) => {
    return (
      <Box
        sx={{
          width: '30%',
          bgcolor: palette.accentColor,
          color: 'white',
          p: isFirstPage ? 3 : 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          minHeight: "297mm", 
          borderTopRightRadius: borderTopRightRadius,
          borderTopLeftRadius: borderTopLeftRadius,
          borderBottomLeftRadius: 0,
          fontFamily: font,
          fontSize: fontSize,
          fontStyle: fontStyle,
          lineHeight: `${lineSpacing}px`,
          '@media print': {
            bgcolor: palette.sidebarBackground,
            color: 'white',
            p: isFirstPage ? 2 : 0,
            width: '30%',
            display: 'inline-block',
            verticalAlign: 'top',
            WebkitPrintColorAdjust: 'exact',
            printColorAdjust: 'exact',
            borderTopRightRadius: borderTopRightRadius,
            borderTopLeftRadius: borderTopLeftRadius,
            borderBottomLeftRadius: 0,
            fontFamily: font,
            fontSize: fontSize,
            fontStyle: fontStyle,
            lineHeight: `${lineSpacing}px`,
          },
        }}
      >
        {isFirstPage ? (
          <Box display="flex" flexDirection="column" alignItems="center" sx={{ flexGrow: 1 }}>
            {/* Render left side sections in the specified order */}
            {leftSectionOrder.map((sectionId, index) => (
              <React.Fragment key={sectionId}>
                {renderLeftSectionContent(sectionId)}
                {index < leftSectionOrder.length - 1 && (
                  <Divider
                    sx={{
                      bgcolor: 'white',
                      my: sectionSpacing / 20,
                      width: '100%',
                      borderBottomWidth: lineWeight,
                      fontFamily: font,
                    }}
                  />
                )}
              </React.Fragment>
            ))}
          </Box>
        ) : (
          // Empty sidebar for subsequent pages
          <Box sx={{ minHeight: '100%', fontFamily: font }} />
        )}
      </Box>
    );
  };

  // Save download history function
  const saveDownloadHistory = async (format, fileName, fileSize) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const downloadData = {
        templateId: 16, // Resume16 template ID
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
      // Get all resume pages
      const resumePages = resumeElement.querySelectorAll('.resume-page');
      
      if (resumePages.length === 0) {
        console.error("No resume pages found");
        return;
      }

      const pdf = new jsPDF("p", "mm", pageSize.toLowerCase());
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      // Process each page individually
      for (let i = 0; i < resumePages.length; i++) {
        const pageElement = resumePages[i];
        
        // Add new page for all except the first one
        if (i > 0) {
          pdf.addPage();
        }

        // Capture the current page
        const canvas = await html2canvas(pageElement, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: "#ffffff",
          logging: false
        });

        const imgData = canvas.toDataURL("image/png");
        
        // Calculate dimensions to fit the page
        const imgWidth = pageWidth;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        
        // Add image to PDF
        pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight, undefined, 'FAST');
      }
      
      // Generate blob and get file size
      const pdfBlob = pdf.output('blob');
      const fileSize = pdfBlob.size;
      
      // Save download history
      await saveDownloadHistory("pdf", "resume", fileSize);
      
      // Save the PDF
      pdf.save("resume.pdf");
      
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Error generating PDF. Please try again.");
    }
  };

  // Handle PNG download - multiple images for multiple pages
  const handlePNGDownload = async () => {
    const resumeElement = document.getElementById('resume-container');
    if (!resumeElement) return;

    try {
      // Get all resume pages
      const resumePages = resumeElement.querySelectorAll('.resume-page');
      
      if (resumePages.length === 0) {
        console.error("No resume pages found");
        return;
      }

      // Download each page as a separate PNG file
      for (let i = 0; i < resumePages.length; i++) {
        const pageElement = resumePages[i];
        
        const canvas = await html2canvas(pageElement, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: "#ffffff"
        });
        
        const link = document.createElement('a');
        
        // Create unique filename for each page
        if (resumePages.length === 1) {
          link.download = `resume.png`;
        } else {
          link.download = `resume-page-${i + 1}.png`;
        }
        
        link.href = canvas.toDataURL();
        
        // For multiple pages, use setTimeout to allow previous download to complete
        if (i === 0) {
          link.click();
        } else {
          setTimeout(() => {
            link.click();
          }, i * 500);
        }
      }

      // Save download history for PNG
      await saveDownloadHistory("png", "resume", 0);

      // Show notification for multiple pages
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
    <Box sx={{ width: '100%', position: 'relative', m: 5, fontFamily: font }}>
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

      <Box id="resume-container" sx={{ fontFamily: font }}>
        {pages.length > 0 ? (
          pages.map((pageContent, index) => (
            <Box
              key={index}
              className="resume-page"
              sx={{
                width: page.width,
                minHeight: page.height,
                mx: 'auto',
                bgcolor: '#fff',
                boxShadow: index === currentPage ? 3 : 0,
                fontFamily: font,
                fontSize: fontSize,
                fontStyle: fontStyle,
                lineHeight: `${lineSpacing}px`,
                display: 'flex',
                pageBreakAfter: 'always',
                '@media print': {
                  width: page.width,
                  height: 'auto',
                  minHeight: page.height,
                  boxShadow: 'none',
                  m: 0,
                  fontFamily: font,
                  fontSize: fontSize,
                  fontStyle: fontStyle,
                  lineHeight: `${lineSpacing}px`,
                },
                // Show all pages when exporting, only current page when viewing
                display: exporting ? 'flex' : (index === currentPage ? 'flex' : 'none'),
                '@media print': { display: 'flex' }
              }}
            >
              <Box sx={{ display: 'flex', height: '100%', width: '100%', fontFamily: font }}>
                {renderSidebar(index === 0)}
                <Box
                  sx={{
                    width: '70%',
                    p: index === 0 ? 4 : `${topBottomMargin}px ${sideMargins}px`,
                    fontFamily: font,
                    fontSize: fontSize,
                    fontStyle: fontStyle,
                    lineHeight: `${lineSpacing}px`,
                    '@media print': {
                      p: index === 0 ? 3 : 2,
                      fontFamily: font,
                      fontSize: fontSize,
                      fontStyle: fontStyle,
                      lineHeight: `${lineSpacing}px`,
                    },
                  }}
                >
                  <div dangerouslySetInnerHTML={{ __html: pageContent.main.map(s => s.outerHTML).join('') }} />
                </Box>
              </Box>
            </Box>
          ))
        ) : (
          <Box
            className="resume-page"
            sx={{
              width: page.width,
              minHeight: page.height,
              mx: 'auto',
              bgcolor: '#fff',
              boxShadow: 3,
              fontFamily: font,
              fontSize: fontSize,
              fontStyle: fontStyle,
              lineHeight: `${lineSpacing}px`,
              display: 'flex',
              '@media print': {
                width: page.width,
                height: 'auto',
                minHeight: page.height,
                boxShadow: 'none',
                m: 0,
                fontFamily: font,
                fontSize: fontSize,
                fontStyle: fontStyle,
                lineHeight: `${lineSpacing}px`,
              },
            }}
          >
            <Box sx={{ display: 'flex', height: '100%', width: '100%', fontFamily: font }}>
              {renderSidebar(true)}
              <Box
                sx={{
                  width: '70%',
                  p: 4,
                  fontFamily: font,
                  fontSize: fontSize,
                  fontStyle: fontStyle,
                  lineHeight: `${lineSpacing}px`,
                  '@media print': {
                    p: 3,
                    fontFamily: font,
                    fontSize: fontSize,
                    fontStyle: fontStyle,
                    lineHeight: `${lineSpacing}px`,
                  },
                }}
              >
                <Typography sx={{ fontFamily: font }}>Loading resume...</Typography>
              </Box>
            </Box>
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

// Meta information for the resume (same as original)
export const resumeMeta = {
  hasPhoto: true,
  columns: 2,
  colorOptions: [
    { value: '#a7ad63ff', label: 'Olive Green' },
    { value: '#b1cddcff', label: 'Light Blue' },
    { value: '#3A5A78', label: 'Default Blue' },
    { value: '#1a2b47', label: 'Dark Blue' },
    { value: '#6a1b9a', label: 'Purple' },
    { value: '#2e7d32', label: 'Green' },
    { value: '#d32f2f', label: 'Red' }
  ],
  nameColorOptions: [
    { value: '#333333', label: 'Dark Gray' },
    { value: '#000000', label: 'Black' },
    { value: '#1a2b47', label: 'Dark Blue' },
    { value: '#2e7d32', label: 'Green' },
    { value: '#d32f2f', label: 'Red' }
  ],
  sidebarBackgroundOptions: [
    { value: '#a7ad63ff', label: 'Olive Green' },
    { value: '#e6f3f9ff', label: 'Light Blue' },
    { value: '#f0f8e6ff', label: 'Light Green' },
    { value: '#f9e6f3ff', label: 'Light Pink' },
    { value: '#e6e6f9ff', label: 'Light Lavender' },
    { value: '#f9f3e6ff', label: 'Light Beige' }
  ],
  headerBackgroundOptions: [
    { value: '#a7ad63ff', label: 'Olive Green' },
    { value: '#d3d6d8ff', label: 'Light Gray' },
    { value: '#d1ecf1ff', label: 'Light Cyan' },
    { value: '#f8d7daff', label: 'Light Red' },
    { value: '#d4eddaff', label: 'Light Mint' },
    { value: '#e2e3e5ff', label: 'Light Silver' }
  ]
};

export default Resume16;