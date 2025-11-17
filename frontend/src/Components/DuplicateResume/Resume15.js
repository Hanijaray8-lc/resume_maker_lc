import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  Box,
  Typography,
  Avatar,
  Divider,
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

// Separate section orders for left and right sides
const defaultLeftSectionOrder = [
  'contact',
  'education',
  'skills',
  'languages'
];

const defaultRightSectionOrder = [
  'aboutMe',
  'workExperience',
  'accomplishments',
  'certifications',
  'softwareSkills',
  'volunteering',
  'interests',
  'websites',
  'additionalInfo',
  'references'
];

const Resume = ({ 
  color = '#b1cddcff', 
  nameColor = '#333333', 
  sidebarBackground = '#e6f3f9ff', 
  headerBackground = '#d3d6d8ff',
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
  enableDragDrop = true,
}) => {
  const page = pageSizeMap[pageSize] || pageSizeMap.A4;
  const data = { ...defaultData, ...formData };
  
  // Use theme color if provided, otherwise use the color prop
  const primaryColor = theme?.primary || color;
  
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
  const [sidebarPages, setSidebarPages] = useState([]);
  const mainContentRef = useRef(null);
  const sidebarContentRef = useRef(null);

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

  // Calculate spacing values based on props
  const getSectionSpacing = () => sectionSpacing / 10;
  const getParagraphSpacing = () => paragraphSpacing / 10;
  const getListItemSpacing = () => paragraphSpacing / 15;

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
    // References: accept multiple possible keys and normalize to objects
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
    const savedLeftSectionOrder = localStorage.getItem("resumeLeftSectionOrder");
    if (savedLeftSectionOrder) {
      const parsedOrder = JSON.parse(savedLeftSectionOrder);
      const filteredOrder = parsedOrder.filter(section => !section.startsWith('custom_'));
      setLeftSectionOrder(filteredOrder);
      console.log('🔄 Loaded left section order WITHOUT custom sections:', filteredOrder);
    } else {
      setLeftSectionOrder(defaultLeftSectionOrder);
    }

    const savedRightSectionOrder = localStorage.getItem("resumeRightSectionOrder");
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
        localStorage.setItem("resumeRightSectionOrder", JSON.stringify(newRightOrder));
        console.log('📝 Final right section order with ONLY CURRENT custom sections:', newRightOrder);
      }
      
      // 🔥 FIX: Left side-லிருந்து custom sections-ஐ remove செய்யவும்
      const currentLeftOrder = [...leftSectionOrder];
      const filteredLeftOrder = currentLeftOrder.filter(section => !section.startsWith('custom_'));
      if (JSON.stringify(filteredLeftOrder) !== JSON.stringify(currentLeftOrder)) {
        setLeftSectionOrder(filteredLeftOrder);
        localStorage.setItem("resumeLeftSectionOrder", JSON.stringify(filteredLeftOrder));
        console.log('🗑️ Removed custom sections from left side:', filteredLeftOrder);
      }
      
    } else if (userId && Object.keys(customSections).length === 0) {
      // If no current custom sections, remove all custom sections from both sides
      const currentRightOrder = [...rightSectionOrder];
      const filteredRightOrder = currentRightOrder.filter(section => !section.startsWith('custom_'));
      
      if (filteredRightOrder.length !== currentRightOrder.length) {
        setRightSectionOrder(filteredRightOrder);
        localStorage.setItem("resumeRightSectionOrder", JSON.stringify(filteredRightOrder));
        console.log('🗑️ Removed all custom sections from right side (no current sections)');
      }
      
      const currentLeftOrder = [...leftSectionOrder];
      const filteredLeftOrder = currentLeftOrder.filter(section => !section.startsWith('custom_'));
      if (filteredLeftOrder.length !== currentLeftOrder.length) {
        setLeftSectionOrder(filteredLeftOrder);
        localStorage.setItem("resumeLeftSectionOrder", JSON.stringify(filteredLeftOrder));
        console.log('🗑️ Removed all custom sections from left side (no current sections)');
      }
    }
  }, [customSections]);

  // Save section orders to localStorage whenever they change
  useEffect(() => {
    if (leftSectionOrder.length > 0) {
      localStorage.setItem("resumeLeftSectionOrder", JSON.stringify(leftSectionOrder));
    }
  }, [leftSectionOrder]);

  useEffect(() => {
    if (rightSectionOrder.length > 0) {
      localStorage.setItem("resumeRightSectionOrder", JSON.stringify(rightSectionOrder));
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
      'education': 'Education',
      'skills': 'Skills',
      'languages': 'Languages',
      'aboutMe': 'About Me',
      'workExperience': 'Work Experience',
      'accomplishments': 'Accomplishments',
      'certifications': 'Certifications',
      'softwareSkills': 'Software Skills',
      'volunteering': 'Volunteering',
      'interests': 'Interests',
      'websites': 'Websites/Profiles',
      'additionalInfo': 'Additional Information',
      'references': 'References'
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

  // Helper function to render any section content (used for both left and right sides)
  const renderSectionContent = (sectionId, inSidebar = false) => {
    const textColor = inSidebar ? palette.textColor : 'inherit';
    const lightTextColor = inSidebar ? palette.lightText : 'text.secondary';
    
    // Apply spacing based on props
    const sectionMarginBottom = getSectionSpacing();
    const paragraphMarginBottom = getParagraphSpacing();
    const listItemMarginBottom = getListItemSpacing();
    
    switch (sectionId) {
      case 'contact':
        return (
          <Box sx={{ mb: sectionMarginBottom }}>
            <Typography variant="h6" fontWeight="bold" sx={{ 
              mb: 1, 
              color: palette.accentColor,
              fontSize: `calc(${headingSize} * 0.8)`,
              ...globalFontStyle
            }}>
              Contact
            </Typography>
            <Box display="flex" alignItems="center" mb={1}>
              <PhoneIcon sx={{ mr: 1, color: palette.accentColor }} />
              <Typography variant="body2" sx={getTextStyle({ color: textColor })}>
                {data.phone}
              </Typography>
            </Box>
            <Box display="flex" alignItems="center" mb={1}>
              <EmailIcon sx={{ mr: 1, color: palette.accentColor }} />
              <Typography variant="body2" sx={getTextStyle({ color: textColor })}>
                {data.email}
              </Typography>
            </Box>
            <Box display="flex" alignItems="center">
              <LocationOnIcon sx={{ mr: 1, color: palette.accentColor }} />
              <Typography variant="body2" sx={getTextStyle({ color: textColor })}>
                {data.city}
              </Typography>
            </Box>
          </Box>
        );

      case 'education':
        return (
          <Box sx={{ mb: sectionMarginBottom }}>
            <Typography variant="h6" fontWeight="bold" sx={{ 
              mb: 1, 
              color: palette.accentColor,
              fontSize: `calc(${headingSize} * 0.8)`,
              ...globalFontStyle
            }}>
              Education
            </Typography>
            {educationEntries.length > 0 ? (
              educationEntries.map((edu) => (
                <Box key={edu.id} sx={{ mb: paragraphMarginBottom }}>
                  <Typography variant="subtitle2" fontWeight="bold" sx={getTextStyle({ color: textColor })}>
                    {edu.degree} {edu.fieldOfStudy && `- ${edu.fieldOfStudy}`}
                  </Typography>
                  <Typography variant="body2" sx={getTextStyle({ color: lightTextColor })}>
                    {edu.schoolName}
                  </Typography>
                  <Typography variant="body2" sx={getTextStyle({ color: lightTextColor })}>
                    {formatDate(edu.gradMonth, edu.gradYear)}
                  </Typography>
                </Box>
              ))
            ) : (
              <Box sx={{ mb: paragraphMarginBottom }}>
                <Typography variant="subtitle2" fontWeight="bold" sx={getTextStyle({ color: textColor })}>
                  B.A. Sales and Commerce
                </Typography>
                <Typography variant="body2" sx={getTextStyle({ color: lightTextColor })}>
                  Western University
                </Typography>
                <Typography variant="body2" sx={getTextStyle({ color: lightTextColor })}>
                  2019 - 2024
                </Typography>
              </Box>
            )}
          </Box>
        );

      case 'skills':
        return (
          <Box sx={{ mb: sectionMarginBottom }}>
            <Typography variant="h6" fontWeight="bold" sx={{ 
              mb: 1, 
              color: palette.accentColor,
              fontSize: `calc(${headingSize} * 0.8)`,
              ...globalFontStyle
            }}>
              Skills
            </Typography>
            <Box component="ul" sx={{ listStyleType: 'none', p: 0 }}>
              {savedSkills.length > 0 ? (
                savedSkills.map((skill, i) => (
                  <Typography key={i} component="li" variant="body2" sx={getTextStyle({ 
                    mb: listItemMarginBottom, 
                    textIndent: `${paragraphIndent}px`, 
                    color: textColor 
                  })}>
                    • {skill.name} {skill.rating ? `(${skill.rating}%)` : ''}
                  </Typography>
                ))
              ) : (
                <>
                  <Typography component="li" variant="body2" sx={getTextStyle({ 
                    mb: listItemMarginBottom, 
                    textIndent: `${paragraphIndent}px`, 
                    color: textColor 
                  })}>
                    • Fast-moving consumer goods
                  </Typography>
                  <Typography component="li" variant="body2" sx={getTextStyle({ 
                    mb: listItemMarginBottom, 
                    textIndent: `${paragraphIndent}px`, 
                    color: textColor 
                  })}>
                    • Packaged consumer goods sales
                  </Typography>
                  <Typography component="li" variant="body2" sx={getTextStyle({ 
                    textIndent: `${paragraphIndent}px`, 
                    color: textColor 
                  })}>
                    • Corporate sales account management
                  </Typography>
                </>
              )}
            </Box>
          </Box>
        );

      case 'languages':
        return (
          <Box sx={{ mb: sectionMarginBottom }}>
            <Typography variant="h6" fontWeight="bold" sx={{ 
              mb: 1, 
              color: palette.accentColor,
              fontSize: `calc(${headingSize} * 0.8)`,
              ...globalFontStyle
            }}>
              Languages
            </Typography>
            <Box component="ul" sx={{ listStyleType: 'none', p: 0 }}>
              {savedLanguages.length > 0 ? (
                savedLanguages.map((lang, i) => (
                  <Typography key={i} component="li" variant="body2" sx={getTextStyle({ 
                    mb: listItemMarginBottom, 
                    textIndent: `${paragraphIndent}px`, 
                    color: textColor 
                  })}>
                    • {lang.name} {lang.level ? `(${lang.level})` : ''}
                  </Typography>
                ))
              ) : (
                <>
                  <Typography component="li" variant="body2" sx={getTextStyle({ 
                    mb: listItemMarginBottom, 
                    textIndent: `${paragraphIndent}px`, 
                    color: textColor 
                  })}>
                    • English
                  </Typography>
                  <Typography component="li" variant="body2" sx={getTextStyle({ 
                    textIndent: `${paragraphIndent}px`, 
                    color: textColor 
                  })}>
                    • French
                  </Typography>
                </>
              )}
            </Box>
          </Box>
        );

      case 'aboutMe':
        return (
          <Box sx={{ mb: sectionMarginBottom }}>
            <Typography variant="h6" fontWeight="bold" sx={{ 
              mb: 1, 
              color: palette.accentColor,
              fontSize: `calc(${headingSize} * 0.8)`,
              ...globalFontStyle
            }}>
              About Me
            </Typography>
            <Typography variant="body2" sx={getTextStyle({ 
              textIndent: `${paragraphIndent}px`, 
              color: textColor 
            })}>
              {savedSummary || "I am a Sales Representative with extensive experience in the fast-moving consumer goods industry. I am a professional who initiates and manages relationships with clients, who serves as their point of contact, and I am adept at following up with leads."}
            </Typography>
          </Box>
        );

      case 'workExperience':
        return (
          <Box sx={{ mb: sectionMarginBottom }}>
            <Typography variant="h6" fontWeight="bold" sx={{ 
              mb: 2, 
              color: palette.accentColor,
              fontSize: `calc(${headingSize} * 0.8)`,
              ...globalFontStyle
            }}>
              Work Experience
            </Typography>

            {workExperiences && workExperiences.length > 0 ? (
              workExperiences.map((work, i) => (
                <Box key={i} sx={{ mb: paragraphMarginBottom }}>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="subtitle1" fontWeight="bold" sx={getTextStyle({ color: textColor })}>
                      {work.jobTitle}
                    </Typography>
                    <Typography variant="body2" sx={getTextStyle({ color: lightTextColor })}>
                      {formatDate(work.startMonth, work.startYear)} -{" "}
                      {work.current ? "Present" : formatDate(work.endMonth, work.endYear)}
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={getTextStyle({ mb: 1, color: lightTextColor })}>
                    {work.employer}
                  </Typography>
                  {work.description && (
                    <Box
                      sx={{ 
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
                          .replace(/\*\*(.*?)\*\*/g, `<strong style="font-family: ${font}; font-size: ${fontSize}; font-style: ${fontStyle}; color: ${textColor};">$1</strong>`)
                          .replace(/\*(.*?)\*/g, `<em style="font-family: ${font}; font-size: ${fontSize}; color: ${textColor};">$1</em>`)
                          .replace(/<u>(.*?)<\/u>/g, `<u style="font-family: ${font}; font-size: ${fontSize}; font-style: ${fontStyle}; color: ${textColor};">$1</u>`)
                          .replace(/\n/g, "<br/>"),
                      }}
                    />
                  )}
                </Box>
              ))
            ) : (
              <Box sx={{ mb: paragraphMarginBottom }}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="subtitle1" fontWeight="bold" sx={getTextStyle({ color: textColor })}>
                    Consumer Goods Seller
                  </Typography>
                  <Typography variant="body2" sx={getTextStyle({ color: lightTextColor })}>
                    Aug 2018 - Present
                  </Typography>
                </Box>
                <Typography variant="body2" sx={getTextStyle({ mb: 1, color: lightTextColor })}>
                  Impressive Industries
                </Typography>
                <Typography variant="body2" sx={getTextStyle({ 
                  mb: listItemMarginBottom,
                  textIndent: `${paragraphIndent}px`, 
                  color: textColor 
                })}>
                  • Offer consumer goods packages to corporate and clients
                </Typography>
                <Typography variant="body2" sx={getTextStyle({ 
                  textIndent: `${paragraphIndent}px`, 
                  color: textColor 
                })}>
                  • Meet with clients every quarter to update or renew services
                </Typography>
              </Box>
            )}
          </Box>
        );

      case 'accomplishments':
        return savedAccomplishments.length > 0 ? (
          <Box sx={{ mb: sectionMarginBottom }}>
            <Typography variant="h6" fontWeight="bold" sx={{ 
              mb: 2, 
              color: palette.accentColor,
              fontSize: `calc(${headingSize} * 0.8)`,
              ...globalFontStyle
            }}>
              Accomplishments
            </Typography>
            {savedAccomplishments.map((acc, index) => (
              <Typography key={index} variant="body2" sx={getTextStyle({ 
                mb: listItemMarginBottom, 
                textIndent: `${paragraphIndent}px`, 
                color: textColor 
              })}>
                • {acc}
              </Typography>
            ))}
          </Box>
        ) : null;

      case 'certifications':
        return savedCertifications.length > 0 ? (
          <Box sx={{ mb: sectionMarginBottom }}>
            <Typography variant="h6" fontWeight="bold" sx={{ 
              mb: 2, 
              color: palette.accentColor,
              fontSize: `calc(${headingSize} * 0.8)`,
              ...globalFontStyle
            }}>
              Certifications
            </Typography>
            {savedCertifications.map((cert, index) => (
              <Typography key={index} variant="body2" sx={getTextStyle({ mb: listItemMarginBottom, color: textColor })}>
                {cert.name} – {cert.provider} ({cert.year})
              </Typography>
            ))}
          </Box>
        ) : null;

      case 'softwareSkills':
        return softwareSkills.length > 0 ? (
          <Box sx={{ mb: sectionMarginBottom }}>
            <Typography variant="h6" fontWeight="bold" sx={{ 
              mb: 2, 
              color: palette.accentColor,
              fontSize: `calc(${headingSize} * 0.8)`,
              ...globalFontStyle
            }}>
              Software Skills
            </Typography>
            {softwareSkills.map((skill, index) => (
              <Typography key={index} variant="body2" sx={getTextStyle({ 
                mb: listItemMarginBottom, 
                textIndent: `${paragraphIndent}px`, 
                color: textColor 
              })}>
                • {skill.name} {skill.level && `— ${skill.level}%`}
              </Typography>
            ))}
          </Box>
        ) : null;

      case 'volunteering':
        return savedVolunteering.length > 0 ? (
          <Box sx={{ mb: sectionMarginBottom }}>
            <Typography variant="h6" fontWeight="bold" sx={{ 
              mb: 2, 
              color: palette.accentColor,
              fontSize: `calc(${headingSize} * 0.8)`,
              ...globalFontStyle
            }}>
              Volunteering
            </Typography>
            {savedVolunteering.map((vol, index) => (
              <Box key={index} sx={{ mb: paragraphMarginBottom }}>
                <Typography variant="subtitle2" fontWeight="bold" sx={getTextStyle({ color: textColor })}>
                  {vol.subtopic || vol.organization}
                </Typography>
                <Typography variant="body2" sx={getTextStyle({ color: lightTextColor, fontStyle: "italic" })}>
                  {vol.fromDate} - {vol.toDate}
                </Typography>
                {vol.content && (
                  <Typography variant="body2" sx={getTextStyle({ 
                    whiteSpace: "pre-line", 
                    mt: 0.5, 
                    color: textColor 
                  })}>
                    {vol.content}
                  </Typography>
                )}
              </Box>
            ))}
          </Box>
        ) : null;

      case 'interests':
        return savedInterests.length > 0 ? (
          <Box sx={{ mb: sectionMarginBottom }}>
            <Typography variant="h6" fontWeight="bold" sx={{ 
              mb: 2, 
              color: palette.accentColor,
              fontSize: `calc(${headingSize} * 0.8)`,
              ...globalFontStyle
            }}>
              Interests
            </Typography>
            {savedInterests.map((interest, index) => (
              <Typography key={index} variant="body2" sx={getTextStyle({ 
                mb: listItemMarginBottom, 
                textIndent: `${paragraphIndent}px`, 
                color: textColor 
              })}>
                • {interest}
              </Typography>
            ))}
          </Box>
        ) : null;

      case 'websites':
        return savedWebsites.length > 0 ? (
          <Box sx={{ mb: sectionMarginBottom }}>
            <Typography variant="h6" fontWeight="bold" sx={{ 
              mb: 2, 
              color: palette.accentColor,
              fontSize: `calc(${headingSize} * 0.8)`,
              ...globalFontStyle
            }}>
              Websites / Profiles
            </Typography>
            {savedWebsites.map((site, index) => (
              <Typography key={index} variant="body2" sx={getTextStyle({ mb: listItemMarginBottom, color: textColor })}>
                • <a href={site.url} style={{ 
                  color: palette.accentColor, 
                  fontFamily: font, 
                  fontSize: fontSize, 
                  fontStyle: fontStyle 
                }} target="_blank" rel="noopener noreferrer">
                  {site.url}
                </a>
              </Typography>
            ))}
          </Box>
        ) : null;

      case 'additionalInfo':
        return savedAdditionalInfo.length > 0 ? (
          <Box sx={{ mb: sectionMarginBottom }}>
            <Typography variant="h6" fontWeight="bold" sx={{ 
              mb: 2, 
              color: palette.accentColor,
              fontSize: `calc(${headingSize} * 0.8)`,
              ...globalFontStyle
            }}>
              Additional Information
            </Typography>
            {savedAdditionalInfo.map((info, index) => (
              <Typography key={index} variant="body2" sx={getTextStyle({ 
                mb: listItemMarginBottom, 
                textIndent: `${paragraphIndent}px`, 
                color: textColor 
              })}>
                • {info}
              </Typography>
            ))}
          </Box>
        ) : null;

      case 'references':
        return savedReferences.length > 0 ? (
          <Box sx={{ mb: sectionMarginBottom }}>
            <Typography variant="h6" fontWeight="bold" sx={{ 
              mb: 2, 
              color: palette.accentColor,
              fontSize: `calc(${headingSize} * 0.8)`,
              ...globalFontStyle
            }}>
              References
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              {savedReferences.map((ref, index) => (
                <Box key={index} sx={{ width: { xs: '100%', sm: 'calc(50% - 8px)' } }}>
                  <Typography variant="subtitle1" fontWeight="bold" sx={getTextStyle({ color: textColor })}>
                    {ref.name}
                  </Typography>
                  <Typography variant="body2" sx={getTextStyle({ color: lightTextColor })}>
                    {ref.position}, {ref.company}
                  </Typography>
                  <Typography variant="body2" sx={getTextStyle({ color: lightTextColor })}>
                    <a href={`mailto:${ref.email}`} style={{ 
                      color: palette.lightText, 
                      fontFamily: font, 
                      fontSize: fontSize, 
                      fontStyle: fontStyle 
                    }}>{ref.email}</a>
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        ) : null;

      default:
        // Handle custom sections
        if (sectionId && sectionId.startsWith('custom_')) {
          const customSectionName = sectionId.replace('custom_', '');
          const items = customSections[customSectionName] || [];
          
          console.log(`🎯 Rendering custom section: ${customSectionName}`, items);
          
          if (items && items.length > 0) {
            return (
              <Box sx={{ mb: sectionMarginBottom }}>
                <Typography variant="h6" fontWeight="bold" sx={{ 
                  mb: 2, 
                  color: palette.accentColor,
                  fontSize: `calc(${headingSize} * 0.8)`,
                  ...globalFontStyle
                }}>
                  {customSectionName.toUpperCase()}
                </Typography>
                {items.map((item, i) => (
                  <Typography 
                    key={i} 
                    variant="body2" 
                    sx={getTextStyle({ 
                      mb: listItemMarginBottom, 
                      textIndent: `${paragraphIndent}px`, 
                      color: textColor,
                      whiteSpace: "pre-line"
                    })} 
                  >
                    • {item}
                  </Typography>
                ))}
              </Box>
            );
          } else {
            console.log(`⚠️ No items found for custom section: ${customSectionName}`);
            return null;
          }
        }
        return null;
    }
  };

  // Render sidebar sections based on current order
  const renderSidebarSections = () => {
    return leftSectionOrder.map(sectionId => (
      <div key={sectionId} className="sidebar-section">
        {renderSectionContent(sectionId, true)}
      </div>
    )).filter(Boolean);
  };

  // Render main content sections based on current order
  const renderMainContentSections = () => {
    return rightSectionOrder.map(sectionId => (
      <div key={sectionId} className="resume-section">
        {renderSectionContent(sectionId, false)}
      </div>
    )).filter(Boolean);
  };

  // Save download history function
  const saveDownloadHistory = async (format, fileName, fileSize) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const downloadData = {
        templateId: 7, // This template ID
        fileName: fileName,
        fileFormat: format,
        fileSize: fileSize,
        themeColor: primaryColor,
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

  // Pagination for sidebar content
  const paginateSidebarContent = useCallback(() => {
    if (!sidebarContentRef.current) return;

    const pageHeightInPx = parseFloat(page.height.replace('mm', '')) * 3.78;
    const headerHeight = pageHeightInPx > 1000 ? 200 : 150; // Adjust header height based on page size
    const availableHeight = pageHeightInPx - (2 * topBottomMargin) - headerHeight;

    const sidebarContent = sidebarContentRef.current;
    const sections = Array.from(sidebarContent.querySelectorAll('.sidebar-section'));
    
    let newSidebarPages = [];
    let currentPageSections = [];
    let currentHeight = 0;
    
    sections.forEach((section, index) => {
      const sectionHeight = section.offsetHeight;
      
      // If adding this section exceeds available height, start new page
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
      
      // Add the last page
      if (index === sections.length - 1 && currentPageSections.length > 0) {
        newSidebarPages.push([...currentPageSections]);
      }
    });
    
    // If no content, still create one empty page
    if (newSidebarPages.length === 0) {
      newSidebarPages.push([]);
    }
    
    setSidebarPages(newSidebarPages);
  }, [page.height, topBottomMargin, leftSectionOrder, sectionSpacing, paragraphSpacing]);

  // Pagination for main content (right side)
  const paginateMainContent = useCallback(() => {
    if (!mainContentRef.current) return;

    const pageHeightInPx = parseFloat(page.height.replace('mm', '')) * 3.78;
    const headerHeight = pageHeightInPx > 1000 ? 200 : 150; // Adjust header height based on page size
    const availableHeight = pageHeightInPx - (2 * topBottomMargin) - headerHeight;

    const mainContent = mainContentRef.current;
    const sections = Array.from(mainContent.querySelectorAll('.resume-section'));
    
    let newPages = [];
    let currentPageSections = [];
    let currentHeight = 0;
    
    sections.forEach((section, index) => {
      const sectionHeight = section.offsetHeight;
      
      // If adding this section exceeds available height, start new page
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
      
      // Add the last page
      if (index === sections.length - 1 && currentPageSections.length > 0) {
        newPages.push([...currentPageSections]);
      }
    });
    
    // If no content, still create one empty page
    if (newPages.length === 0) {
      newPages.push([]);
    }
    
    setPages(newPages);
  }, [page.height, topBottomMargin, rightSectionOrder, sectionSpacing, paragraphSpacing]);

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
    color,
    sectionSpacing,
    paragraphSpacing,
    lineSpacing,
    paragraphIndent
  ]);

  // Render sidebar content for measurement (hidden)
  const renderSidebarForMeasurement = () => (
    <Box ref={sidebarContentRef} sx={{ visibility: 'hidden', position: 'absolute', top: -1000, width: '30%', ...globalFontStyle }}>
      {renderSidebarSections()}
    </Box>
  );

  // Render main content for measurement (hidden)
  const renderMainContentForMeasurement = () => (
    <Box ref={mainContentRef} sx={{ visibility: 'hidden', position: 'absolute', top: -1000, width: '70%', ...globalFontStyle }}>
      {renderMainContentSections()}
    </Box>
  );

  // Render actual sidebar content based on current page
  const renderSidebar = (pageIndex) => (
    <Box
      sx={{
        width: "30%",
        bgcolor: palette.sidebarBackground, 
        p: sideMargins / 5, 
        ...globalFontStyle,
        "@media print": {
          width: "30%",
          display: "inline-block",
          verticalAlign: "top",
        },
      }}
    >
      {sidebarPages[pageIndex] ? (
        <div 
          style={globalFontStyle}
          dangerouslySetInnerHTML={{ 
            __html: addFontToHtmlContent(sidebarPages[pageIndex].join('')) 
          }} 
        />
      ) : (
        <Typography sx={getTextStyle()}>Loading sidebar content...</Typography>
      )}
    </Box>
  );

  // Render header section (only for first page)
  const renderHeader = () => (
    <Box 
      sx={{
        display: 'flex',
        alignItems: 'center',
        bgcolor: palette.header,
        p: sideMargins / 5,
        borderTopRightRadius: 0,
        borderBottomRightRadius: 0,
        flexDirection: { xs: 'column', sm: 'row' },
        gap: { xs: 2, sm: 8 },
        "@media print": {
          bgcolor: palette.header,
          WebkitPrintColorAdjust: "exact",
          printColorAdjust: "exact",
        }
      }}
    >
      <Box>
        <Avatar
          alt="Profile"
          src={photo || "/path/to/your/image.jpg"}
          sx={{ 
            width: 120, 
            height: 120, 
            mb: { xs: 2, sm: 0 }, 
            ml: "40px",
            border: `${lineWeight * 2}px solid white`,
          }}
        />
      </Box>
       <Box sx={{ ml: "35px" }}>
             <Typography variant="h4" component="h1" fontWeight="bold" sx={{ 
               color: palette.nameColor,
               fontSize: `calc(${headingSize} * 1.5)`,
               fontFamily: font,
             }}>
               {data.firstName} {data.lastName}
             </Typography>
             <Typography variant="subtitle1" sx={{ 
               color: palette.lightText,
               fontSize: `calc(${fontSize} * 1.1)`,
               fontFamily: font,
             }}>
               {data.currentPosition}
             </Typography>
           </Box>
    </Box>
  );

  // Calculate total pages needed (max of sidebar pages and main content pages)
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
              bgcolor: "#fff",
              boxShadow: pageIndex === currentPage ? 3 : 0,
              ...globalFontStyle,
              display: "flex",
              flexDirection: "column",
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
            {/* Header Section - Show only on first page */}
            {pageIndex === 0 && renderHeader()}

            <Box sx={{ 
              display: "flex", 
              height: "100%", 
              p: `${topBottomMargin}px ${sideMargins}px`,
              flex: 1,
              // Add gap between sidebar and main content on ALL pages
              gap: 2
            }}>
              {/* Left Sidebar - Show on all pages if there's sidebar content */}
              {sidebarPages[pageIndex] ? renderSidebar(pageIndex) : <Box sx={{ width: "30%", bgcolor: palette.sidebarBackground, p: sideMargins / 5 }} />}
              
              {/* Vertical Divider - Show only when both sidebar and content exist */}
              {(sidebarPages[pageIndex] && pages[pageIndex]) && (
                <Divider 
                  orientation="vertical" 
                  flexItem 
                  sx={{ 
                    // Adjust divider position to work with gap
                    mx: 1,
                    borderRightWidth: lineWeight 
                  }} 
                />
              )}
              
              {/* Right Content Section */}
              <Box
                sx={{
                  width: sidebarPages[pageIndex] ? "70%" : "100%",
                  // Remove left padding since we're using gap instead
                  "@media print": {
                    width: sidebarPages[pageIndex] ? "70%" : "100%",
                    display: "inline-block",
                    verticalAlign: "top",
                  },
                }}
              >
                {pages[pageIndex] ? (
                  <div 
                    style={globalFontStyle}
                    dangerouslySetInnerHTML={{ 
                      __html: addFontToHtmlContent(pages[pageIndex].join('')) 
                    }} 
                  />
                ) : (
                  <Typography sx={getTextStyle()}>No content for this page</Typography>
                )}
              </Box>
            </Box>
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
  hasPhoto: true,
  columns: 2,
  colorOptions: [
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
    { value: '#e6f3f9ff', label: 'Light Blue' },
    { value: '#f0f8e6ff', label: 'Light Green' },
    { value: '#f9e6f3ff', label: 'Light Pink' },
    { value: '#e6e6f9ff', label: 'Light Lavender' },
    { value: '#f9f3e6ff', label: 'Light Beige' }
  ],
  headerBackgroundOptions: [
    { value: '#d3d6d8ff', label: 'Light Gray' },
    { value: '#d1ecf1ff', label: 'Light Cyan' },
    { value: '#f8d7daff', label: 'Light Red' },
    { value: '#d4eddaff', label: 'Light Mint' },
    { value: '#e2e3e5ff', label: 'Light Silver' }
  ]
};

export default Resume;