import React, { useEffect, useState, useRef, useCallback } from "react";
import { 
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
  Grid,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from "@mui/material";
import {
  ChevronLeft,
  ChevronRight,
  Print,
  Download,
  DragIndicator,
  Reorder
} from "@mui/icons-material";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import LocationOnIcon from "@mui/icons-material/LocationOn";


const lighten = (hex, amount = 0.4) => {
  hex = hex.replace('#', '');
  if (hex.length === 8) hex = hex.slice(0,6);
  let r = parseInt(hex.substring(0,2),16);
  let g = parseInt(hex.substring(2,4),16);
  let b = parseInt(hex.substring(4,6),16);
  r = Math.min(255, r + Math.round((255 - r) * amount));
  g = Math.min(255, g + Math.round((255 - g) * amount));
  b = Math.min(255, b + Math.round((255 - b) * amount));
  return `#${r.toString(16).padStart(2,'0')}${g.toString(16).padStart(2,'0')}${b.toString(16).padStart(2,'0')}`;
};

// Separate section orders for left and right sides
const defaultLeftSectionOrder = [
  'contact',
  'skills',
  'education',
  'languages'
];

const defaultRightSectionOrder = [
  'about',
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

// Font size mapping
const fontSizeMap = {
  small: "12px",
  normal: "14px",
  medium: "16px",
  large: "18px"
};

// Font family options
const fontFamilyMap = {
  arial: "Arial, sans-serif",
  times: "Times New Roman, serif",
  helvetica: "Helvetica, Arial, sans-serif",
  georgia: "Georgia, serif",
  verdana: "Verdana, Geneva, sans-serif",
  trebuchet: "Trebuchet MS, sans-serif",
  courier: "Courier New, monospace"
};

// Font style options
const fontStyleMap = {
  normal: "normal",
  italic: "italic"
};

// Line spacing options
const lineSpacingMap = {
  tight: "1.2",
  normal: "1.5",
  relaxed: "1.8",
  loose: "2.0"
};

const Resume17 = ({
  color = "#3f51b5",
  nameColor = "#ffffff",
  sidebarBackground,
  headerBackground,
  font = "Arial, sans-serif",
  fontSize = "normal",
  fontStyle = "normal",
  lineSpacing = "normal",
  headingSize = "24px",
  sectionSpacing = 30,
  paragraphSpacing = 10,
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
  // Use theme color if provided, otherwise use the color prop
  const primaryColor = theme?.primary || color;

  // Compute effective values
  const effectiveSidebarBackground = sidebarBackground || lighten(primaryColor, 0.95);
  const effectiveHeaderBackground = headerBackground || `linear-gradient(135deg, ${primaryColor}, ${lighten(primaryColor, 0.4)})`;
  const effectiveNameColor = nameColor || "#ffffff";
  
  // Define a color palette for the template with customizable colors
  const palette = {
    mainBackground: '#FFFFFF',
    sidebarBackground: effectiveSidebarBackground,
    accentColor: primaryColor,
    textColor: '#333333',
    lightText: '#666666',
    header: effectiveHeaderBackground,
    nameColor: effectiveNameColor,
  };

  // Page size mapping
  const pageSizeMap = {
    A4: { width: "210mm", height: "297mm" },
    Letter: { width: "216mm", height: "279mm" },
    Legal: { width: "216mm", height: "356mm" },
    A3: { width: "297mm", height: "420mm" },
    Executive: { width: "184mm", height: "267mm" },
  };

  const page = pageSizeMap[pageSize] || pageSizeMap.A4;
  
  // Default data with formData override
  const defaultData = {
    firstName: "John",
    lastName: "Doe",
    currentPosition: "Sales Representative",
    phone: "+1 456-789-0123",
    email: "hello@email.com",
    city: "Anywhere St, Anytown",
    website: "",
    profile: "I am a Sales Representative with extensive experience in the fast-moving consumer goods industry. I am a professional who initiates and manages relationships with clients, who serves as their point of contact, and I am adept at following up with leads."
  };

  const data = { ...defaultData, ...formData };

  // State for dynamic content
  const [currentPage, setCurrentPage] = useState(0);
  const [pages, setPages] = useState([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
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

  // Formatting functions - MOVED BEFORE ANY USAGE
  const getFontFamily = () => {
    return fontFamilyMap[font] || font;
  };

  const getFontSize = () => {
    return fontSizeMap[fontSize] || fontSize;
  };

  const getFontStyle = () => {
    return fontStyleMap[fontStyle] || fontStyle;
  };

  const getLineHeight = () => {
    const baseSize = parseInt(getFontSize(), 10);
    const multiplier = lineSpacingMap[lineSpacing] || 1.5;
    return `${Math.round(baseSize * multiplier)}px`;
  };

  const getHeadingSize = () => {
    const baseSize = parseInt(getFontSize(), 10);
    return `${baseSize * 1.5}px`;
  };

  const getSubheadingSize = () => {
    const baseSize = parseInt(getFontSize(), 10);
    return `${baseSize * 1.2}px`;
  };

  // NOW define globalFontStyle AFTER the functions are defined
  const globalFontStyle = {
    fontFamily: getFontFamily(),
    fontSize: getFontSize(),
    fontStyle: getFontStyle(),
    lineHeight: getLineHeight(),
  };

  // Common text styles
  const textStyles = {
    fontFamily: getFontFamily(),
    fontSize: getFontSize(),
    fontStyle: getFontStyle(),
    lineHeight: getLineHeight(),
  };

  const headingStyles = {
    fontFamily: getFontFamily(),
    fontSize: getHeadingSize(),
    fontStyle: getFontStyle(),
    lineHeight: getLineHeight(),
    fontWeight: "bold",
  };

  const subheadingStyles = {
    fontFamily: getFontFamily(),
    fontSize: getSubheadingSize(),
    fontStyle: getFontStyle(),
    lineHeight: getLineHeight(),
    fontWeight: "bold",
  };

  // Load all data from localStorage including custom sections
  const loadAllData = useCallback(() => {
    console.log("Loading data from localStorage...");
    
    try {
      // Education
      const storedEntries = localStorage.getItem("educationEntries");
      if (storedEntries) {
        const parsed = JSON.parse(storedEntries);
        setEducationEntries(parsed);
        console.log("Education entries loaded:", parsed.length);
      }

      // Skills
      const storedSkills = localStorage.getItem("skills");
      if (storedSkills) {
        const parsed = JSON.parse(storedSkills);
        setSavedSkills(parsed);
        console.log("Skills loaded:", parsed.length);
      }

      // Summary
      const storedSummaries = JSON.parse(localStorage.getItem("summaries") || "[]");
      if (storedSummaries.length > 0) {
        setSavedSummary(storedSummaries[storedSummaries.length - 1]);
        console.log("Summary loaded");
      }

      // Additional Info
      const storedAdditionalInfo = JSON.parse(localStorage.getItem("additionalInfo") || "[]");
      setSavedAdditionalInfo(storedAdditionalInfo);
      console.log("Additional info loaded:", storedAdditionalInfo.length);

      // Languages
      const storedLanguages = JSON.parse(localStorage.getItem("languagesList") || "[]");
      setSavedLanguages(storedLanguages);
      console.log("Languages loaded:", storedLanguages.length);

      // Accomplishments
      const storedAccomplishments = JSON.parse(localStorage.getItem("accomplishmentsList") || "[]");
      setSavedAccomplishments(storedAccomplishments);
      console.log("Accomplishments loaded:", storedAccomplishments.length);

      // Certifications
      const storedCertifications = JSON.parse(localStorage.getItem("certificationsList") || "[]");
      setSavedCertifications(storedCertifications);
      console.log("Certifications loaded:", storedCertifications.length);

      // References
      const storedReferences = JSON.parse(localStorage.getItem("referencesList") || "[]");
      setSavedReferences(storedReferences);
      console.log("References loaded:", storedReferences.length);

      // Software Skills
      const storedSoftwareSkills = JSON.parse(localStorage.getItem("softwareSkills") || "[]");
      setSoftwareSkills(storedSoftwareSkills);
      console.log("Software skills loaded:", storedSoftwareSkills.length);

      // Volunteering
      const storedVolunteering = JSON.parse(localStorage.getItem("volunteering") || "[]");
      setSavedVolunteering(storedVolunteering);
      console.log("Volunteering loaded:", storedVolunteering.length);

      // Interests
      const storedInterests = JSON.parse(localStorage.getItem("interests") || "[]");
      setSavedInterests(storedInterests);
      console.log("Interests loaded:", storedInterests.length);

      // Websites
      const storedWebsites = JSON.parse(localStorage.getItem("websites") || "[]");
      setSavedWebsites(storedWebsites);
      console.log("Websites loaded:", storedWebsites.length);

      // Custom Sections - Load ONLY CURRENT custom sections like Resume9
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
      const savedLeftSectionOrder = localStorage.getItem("resume17LeftSectionOrder");
      if (savedLeftSectionOrder) {
        // 🔥 FIX: Left side-ல custom sections auto add ஆகாது - filter only
        const parsedOrder = JSON.parse(savedLeftSectionOrder);
        const filteredOrder = parsedOrder.filter(section => !section.startsWith('custom_'));
        setLeftSectionOrder(filteredOrder);
        console.log('🔄 Loaded left section order WITHOUT custom sections:', filteredOrder);
      } else {
        setLeftSectionOrder(defaultLeftSectionOrder);
      }

      const savedRightSectionOrder = localStorage.getItem("resume17RightSectionOrder");
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

      setIsDataLoaded(true);
    } catch (error) {
      console.error("Error loading data from localStorage:", error);
      setIsDataLoaded(true); // Still set to true to avoid infinite loading
    }
  }, []);

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  // Add this useEffect to automatically add/remove custom sections like Resume9
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
        localStorage.setItem("resume17RightSectionOrder", JSON.stringify(newRightOrder));
        console.log('📝 Final right section order with ONLY CURRENT custom sections:', newRightOrder);
      }
      
      // 🔥 FIX: Left side-லிருந்து custom sections-ஐ remove செய்யவும்
      const currentLeftOrder = [...leftSectionOrder];
      const filteredLeftOrder = currentLeftOrder.filter(section => !section.startsWith('custom_'));
      if (JSON.stringify(filteredLeftOrder) !== JSON.stringify(currentLeftOrder)) {
        setLeftSectionOrder(filteredLeftOrder);
        localStorage.setItem("resume17LeftSectionOrder", JSON.stringify(filteredLeftOrder));
        console.log('🗑️ Removed custom sections from left side:', filteredLeftOrder);
      }
      
    } else if (userId && Object.keys(customSections).length === 0) {
      // If no current custom sections, remove all custom sections from both sides
      const currentRightOrder = [...rightSectionOrder];
      const filteredRightOrder = currentRightOrder.filter(section => !section.startsWith('custom_'));
      
      if (filteredRightOrder.length !== currentRightOrder.length) {
        setRightSectionOrder(filteredRightOrder);
        localStorage.setItem("resume17RightSectionOrder", JSON.stringify(filteredRightOrder));
        console.log('🗑️ Removed all custom sections from right side (no current sections)');
      }
      
      const currentLeftOrder = [...leftSectionOrder];
      const filteredLeftOrder = currentLeftOrder.filter(section => !section.startsWith('custom_'));
      if (filteredLeftOrder.length !== currentLeftOrder.length) {
        setLeftSectionOrder(filteredLeftOrder);
        localStorage.setItem("resume17LeftSectionOrder", JSON.stringify(filteredLeftOrder));
        console.log('🗑️ Removed all custom sections from left side (no current sections)');
      }
    }
  }, [customSections]);

  // Save section orders to localStorage whenever they change
  useEffect(() => {
    if (leftSectionOrder.length > 0) {
      localStorage.setItem("resume17LeftSectionOrder", JSON.stringify(leftSectionOrder));
    }
  }, [leftSectionOrder]);

  useEffect(() => {
    if (rightSectionOrder.length > 0) {
      localStorage.setItem("resume17RightSectionOrder", JSON.stringify(rightSectionOrder));
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
    // Include custom sections in the reset
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
      'education': 'Education',
      'languages': 'Languages',
      'about': 'About Me',
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
      const customName = sectionId.replace('custom_', '').replace(/_/g, ' ');
      return customName.charAt(0).toUpperCase() + customName.slice(1);
    }
    
    return titles[sectionId] || sectionId;
  };

  const renderDragPanel = (side, sections) => {
    return (
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', ...headingStyles }}>
          <DragIndicator sx={{ mr: 1 }} />
          {side === 'left' ? 'Left Sidebar' : 'Right Content'} Sections
          <Typography variant="body2" color="textSecondary" sx={{ ml: 1, ...textStyles }}>
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
                <Typography sx={{ ml: 1, flexGrow: 1, ...textStyles }}>
                  {getSectionTitle(sectionId)}
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ ...textStyles }}>
                  {index + 1}
                </Typography>
              </Paper>
            ))
          ) : (
            <Typography variant="body2" color="textSecondary" sx={{ p: 2, textAlign: 'center', ...textStyles }}>
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

  const paginateContent = useCallback(() => {
    if (!mainContentRef.current || !sidebarContentRef.current || !isDataLoaded) {
      console.log("Skipping pagination - refs not ready or data not loaded");
      return;
    }

    console.log("Starting pagination...");
    
    const mainSections = Array.from(mainContentRef.current.querySelectorAll('.resume-section'));
    const sidebarSections = Array.from(sidebarContentRef.current.querySelectorAll('.sidebar-section'));
    
    console.log("Main sections found:", mainSections.length);
    console.log("Sidebar sections found:", sidebarSections.length);
    
    const pageHeightInPx = parseFloat(page.height.replace('mm', '')) * 3.78;
    const headerHeight = 200; // Fixed header height for first page
    const mainAvailableHeightFirstPage = pageHeightInPx - headerHeight - (2 * topBottomMargin);
    const mainAvailableHeightOtherPages = pageHeightInPx - (2 * topBottomMargin);

    console.log("Page height:", pageHeightInPx, "First page available:", mainAvailableHeightFirstPage);

    let newPages = [];
    
    // Always create at least one page
    if (mainSections.length === 0 && sidebarSections.length === 0) {
      newPages.push({ 
        main: [], 
        sidebar: [],
        hasHeader: true 
      });
      setPages(newPages);
      return;
    }
    
    // Process first page separately (with header)
    let isFirstPage = true;
    let mainIndex = 0;
    let sidebarIndex = 0;
    
    while (mainIndex < mainSections.length || sidebarIndex < sidebarSections.length) {
      const currentAvailableHeight = isFirstPage ? mainAvailableHeightFirstPage : mainAvailableHeightOtherPages;
      
      let currentMainPageSections = [];
      let currentSidebarPageSections = [];
      let currentMainHeight = 0;
      let currentSidebarHeight = 0;
      
      // Add main content sections to current page
      while (mainIndex < mainSections.length) {
        const section = mainSections[mainIndex];
        const sectionHeight = section.offsetHeight;
        
        console.log(`Main Section ${mainIndex} height:`, sectionHeight, "Current height:", currentMainHeight, "Available:", currentAvailableHeight);
        
        // If adding this section to the current page exceeds the limit
        if (currentMainHeight + sectionHeight > currentAvailableHeight) {
          // If it's the first section and it doesn't fit, we have to include it anyway
          if (currentMainPageSections.length === 0) {
            currentMainPageSections.push(section);
            currentMainHeight += sectionHeight;
            mainIndex++;
          }
          break;
        } else {
          // Add to the current page
          currentMainPageSections.push(section);
          currentMainHeight += sectionHeight;
          mainIndex++;
        }
      }
      
      // Add sidebar content sections to current page (only once per section)
      while (sidebarIndex < sidebarSections.length) {
        const section = sidebarSections[sidebarIndex];
        const sectionHeight = section.offsetHeight;
        
        console.log(`Sidebar Section ${sidebarIndex} height:`, sectionHeight, "Current sidebar height:", currentSidebarHeight, "Available:", currentAvailableHeight);
        
        // If adding this section to the current page exceeds the limit
        if (currentSidebarHeight + sectionHeight > currentAvailableHeight) {
          // If it's the first section and it doesn't fit, we have to include it anyway
          if (currentSidebarPageSections.length === 0) {
            currentSidebarPageSections.push(section);
            currentSidebarHeight += sectionHeight;
            sidebarIndex++;
          }
          break;
        } else {
          // Add to the current page
          currentSidebarPageSections.push(section);
          currentSidebarHeight += sectionHeight;
          sidebarIndex++;
        }
      }
      
      newPages.push({
        main: [...currentMainPageSections],
        sidebar: [...currentSidebarPageSections],
        hasHeader: isFirstPage
      });
      
      console.log(`Created page ${newPages.length} with ${currentMainPageSections.length} main sections and ${currentSidebarPageSections.length} sidebar sections`);
      isFirstPage = false;
    }
    
    // If no pages were created but we have content, create at least one page
    if (newPages.length === 0 && (mainSections.length > 0 || sidebarSections.length > 0)) {
      newPages.push({
        main: [...mainSections],
        sidebar: [...sidebarSections],
        hasHeader: true
      });
    }
    
    setPages(newPages);
    console.log("Pagination completed. Total pages:", newPages.length);
  }, [page.height, topBottomMargin, isDataLoaded, leftSectionOrder, rightSectionOrder, font, fontSize, fontStyle, lineSpacing, headingSize, sectionSpacing, paragraphSpacing, sideMargins, paragraphIndent, lineWeight]);

  useEffect(() => {
    if (!isDataLoaded) return;

    // Re-calculate pagination whenever dependencies change
    const timeoutId = setTimeout(() => {
      paginateContent();
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [
    paginateContent,
    isDataLoaded,
    educationEntries,
    savedSkills,
    savedSummary,
    workExperiences,
    savedAdditionalInfo,
    savedLanguages,
    savedAccomplishments,
    savedCertifications,
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
    headingSize,
    sectionSpacing,
    paragraphSpacing,
    topBottomMargin,
    sideMargins,
    paragraphIndent,
    lineWeight,
    pageSize
  ]);

  const renderSidebarSections = () => {
    return leftSectionOrder.map(sectionId => renderSection(sectionId, true)).filter(Boolean);
  };

  const renderRightContentSections = () => {
    return rightSectionOrder.map(sectionId => renderSection(sectionId, false)).filter(Boolean);
  };

  const renderSection = (sectionId, inSidebar = false) => {
    const textColor = inSidebar ? palette.textColor : palette.textColor;
    const bgColor = inSidebar ? palette.sidebarBackground : palette.mainBackground;

    // Apply section spacing and paragraph spacing
    const sectionStyle = {
      marginBottom: `${sectionSpacing / 10}px`,
      ...textStyles
    };

    const paragraphStyle = {
      marginBottom: `${paragraphSpacing / 10}px`,
      ...textStyles
    };

    switch (sectionId) {
   case 'contact':
  return (
    <div
      key="contact"
      className={inSidebar ? "sidebar-section" : "resume-section"}
      style={sectionStyle}
    >
      <Typography
        variant="h6"
        sx={{
          fontWeight: "bold",
          color: palette.accentColor,
          mb: 1,
          ...subheadingStyles,
          ...textStyles,
        }}
      >
        Contact
      </Typography>

      <List dense>
        <ListItem>
          <ListItemIcon>
            <PhoneIcon
              color="primary"
              sx={{
                fontSize: "1.2rem",
                ...subheadingStyles,
                ...textStyles,
              }}
            />
          </ListItemIcon>
          <ListItemText
            primaryTypographyProps={{
              sx: { ...subheadingStyles, ...textStyles },
            }}
            primary={data.phone}
          />
        </ListItem>

        <ListItem>
          <ListItemIcon>
            <EmailIcon
              color="primary"
              sx={{
                fontSize: "1.2rem",
                ...subheadingStyles,
                ...textStyles,
              }}
            />
          </ListItemIcon>
          <ListItemText
            primaryTypographyProps={{
              sx: { ...subheadingStyles, ...textStyles },
            }}
            primary={data.email}
          />
        </ListItem>

        <ListItem>
          <ListItemIcon>
            <LocationOnIcon
              color="primary"
              sx={{
                fontSize: "1.2rem",
                ...subheadingStyles,
                ...textStyles,
              }}
            />
          </ListItemIcon>
          <ListItemText
            primaryTypographyProps={{
              sx: { ...subheadingStyles, ...textStyles },
            }}
            primary={data.city}
          />
        </ListItem>
      </List>
    </div>
  );


      case 'skills':
        return savedSkills.length > 0 ? (
          <div key="skills" className={inSidebar ? "sidebar-section" : "resume-section"} style={sectionStyle}>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: "bold", 
                color: palette.accentColor, 
                mb: 1,
                ...subheadingStyles
              }}
            >
              Skills
            </Typography>
            {savedSkills.map((skill, index) => (
              <Typography key={index} sx={{ ...paragraphStyle, color: textColor, backgroundColor: bgColor }}>
                • {skill.name}
              </Typography>
            ))}
          </div>
        ) : null;

      case 'education':
        return educationEntries.length > 0 ? (
          <div key="education" className={inSidebar ? "sidebar-section" : "resume-section"} style={sectionStyle}>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: "bold", 
                color: palette.accentColor, 
                mb: 1,
                ...subheadingStyles
              }}
            >
              Education
            </Typography>
            {educationEntries.map((edu, i) => (
              <Box key={i} sx={{ ...paragraphStyle, backgroundColor: bgColor }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ ...textStyles }}>
                  <Typography 
                    variant="subtitle1" 
                    fontWeight="bold" 
                    sx={{ 
                      ...subheadingStyles,
                      color: textColor,
                    }}
                  >
                    {edu.degree} - {edu.fieldOfStudy}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    color="text.secondary" 
                    sx={{ 
                      ...textStyles
                    }}
                  > {formatDate(edu.gradMonth, edu.gradYear)}
                  
                  </Typography>
                </Box>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    mb: 1, 
                    color: inSidebar ? palette.lightText : palette.lightText,
                    ...textStyles
                  }}
                >
                {edu.schoolName}, {edu.schoolLocation}
                </Typography>
                {edu.description && (
                  <Box
                    sx={{ 
                      "& strong": { fontWeight: "bold", ...textStyles }, 
                      "& em": { fontStyle: "italic", ...textStyles }, 
                      "& u": { textDecoration: "underline", ...textStyles },
                      ...textStyles,
                      color: textColor,
                    }}
                    dangerouslySetInnerHTML={{
                      __html: edu.description
                        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                        .replace(/\*(.*?)\*/g, "<em>$1</em>")
                        .replace(/<u>(.*?)<\/u>/g, "<u>$1</u>")
                        .replace(/\n/g, "<br/>"),
                    }}
                  />
                )}                                    {edu.additionalCoursework}
                         

              </Box>
            ))}
          </div>
        ) : null;

       

      case 'languages':
        return savedLanguages.length > 0 ? (
          <div key="languages" className={inSidebar ? "sidebar-section" : "resume-section"} style={sectionStyle}>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: "bold", 
                color: palette.accentColor, 
                mb: 1,
                ...subheadingStyles
              }}
            >
              Languages
            </Typography>
            {savedLanguages.map((lang, index) => (
              <Typography key={index} sx={{ ...paragraphStyle, color: textColor, backgroundColor: bgColor }}>
                {lang.name} {lang.level ? `– ${lang.level}` : ""}
              </Typography>
            ))}
          </div>
        ) : null;
      
      case 'about':
        return savedSummary || data.profile ? (
          <div key="about" className={inSidebar ? "sidebar-section" : "resume-section"} style={sectionStyle}>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: "bold", 
                color: palette.accentColor, 
                mb: 1,
                ...subheadingStyles
              }}
            >
              About Me
            </Typography>
            <Typography 
              sx={{ 
                ...paragraphStyle, 
                color: textColor,
                ...textStyles,
                textIndent: `${paragraphIndent}px`,
                backgroundColor: bgColor,
              }}
            >
              {savedSummary || data.profile}
            </Typography>
          </div>
        ) : null;

      case 'workExperience':
        return workExperiences && workExperiences.length > 0 ? (
          <div key="workExperience" className={inSidebar ? "sidebar-section" : "resume-section"} style={sectionStyle}>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: "bold", 
                color: palette.accentColor, 
                mb: 1,
                ...subheadingStyles
              }}
            >
              Work Experience
            </Typography>
            
            {workExperiences.map((work, i) => (
              <Box key={i} sx={{ ...paragraphStyle, backgroundColor: bgColor }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ ...textStyles }}>
                  <Typography 
                    variant="subtitle1" 
                    fontWeight="bold" 
                    sx={{ 
                      ...subheadingStyles,
                      color: textColor,
                    }}
                  >
                    {work.jobTitle}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    color="text.secondary" 
                    sx={{ 
                      ...textStyles
                    }}
                  >
                    {formatDate(work.startMonth, work.startYear)} -{" "}
                    {work.current ? "Present" : formatDate(work.endMonth, work.endYear)}
                  </Typography>
                </Box>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    mb: 1, 
                    color: inSidebar ? palette.lightText : palette.lightText,
                    ...textStyles
                  }}
                >
                  {work.employer}
                </Typography>
                {work.description && (
                  <Box
                    sx={{ 
                      "& strong": { fontWeight: "bold", ...textStyles }, 
                      "& em": { fontStyle: "italic", ...textStyles }, 
                      "& u": { textDecoration: "underline", ...textStyles },
                      ...textStyles,
                      color: textColor,
                    }}
                    dangerouslySetInnerHTML={{
                      __html: work.description
                        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                        .replace(/\*(.*?)\*/g, "<em>$1</em>")
                        .replace(/<u>(.*?)<\/u>/g, "<u>$1</u>")
                        .replace(/\n/g, "<br/>"),
                    }}
                  />
                )}
              </Box>
            ))}
          </div>
        ) : null;

      case 'accomplishments':
        return savedAccomplishments.length > 0 ? (
          <div key="accomplishments" className={inSidebar ? "sidebar-section" : "resume-section"} style={sectionStyle}>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: "bold", 
                color: palette.accentColor, 
                mb: 1,
                ...subheadingStyles
              }}
            >
              Accomplishments
            </Typography>
            {savedAccomplishments.map((acc, index) => (
              <Typography key={index} sx={{ 
                ...paragraphStyle, 
                ...textStyles,
                whiteSpace: "pre-line",
                color: textColor,
                backgroundColor: bgColor,
              }}>
                • {acc}
              </Typography>
            ))}
          </div>
        ) : null;

      case 'certifications':
        return savedCertifications.length > 0 ? (
          <div key="certifications" className={inSidebar ? "sidebar-section" : "resume-section"} style={sectionStyle}>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: "bold", 
                color: palette.accentColor, 
                mb: 1,
                ...subheadingStyles
              }}
            >
              Certifications
            </Typography>
            {savedCertifications.map((cert, index) => (
              <Typography key={index} sx={{ 
                ...paragraphStyle, 
                ...textStyles,
                color: textColor,
                backgroundColor: bgColor,
              }}>
                • {cert.name} – {cert.provider} ({cert.year})
              </Typography>
            ))}
          </div>
        ) : null;

      case 'softwareSkills':
        return softwareSkills.length > 0 ? (
          <div key="softwareSkills" className={inSidebar ? "sidebar-section" : "resume-section"} style={sectionStyle}>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: "bold", 
                color: palette.accentColor, 
                mb: 1,
                ...subheadingStyles
              }}
            >
              Software Skills
            </Typography>
            {softwareSkills.map((skill, index) => (
              <Typography key={index} sx={{ 
                ...paragraphStyle, 
                ...textStyles,
                color: textColor,
                backgroundColor: bgColor,
              }}>
                • {skill.name} — {skill.level}%
              </Typography>
            ))}
          </div>
        ) : null;

      case 'volunteering':
        return savedVolunteering.length > 0 ? (
          <div key="volunteering" className={inSidebar ? "sidebar-section" : "resume-section"} style={sectionStyle}>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: "bold", 
                color: palette.accentColor, 
                mb: 1,
                ...subheadingStyles
              }}
            >
              Volunteering
            </Typography>
            {savedVolunteering.map((vol, index) => (
              <Box key={index} sx={{ ...paragraphStyle, backgroundColor: bgColor }}>
                <Typography sx={{ 
                  ...subheadingStyles,
                  color: textColor,
                }}>
                  {vol.subtopic}
                </Typography>
                <Typography sx={{ 
                  ...textStyles,
                  color: "gray", 
                }}>
                  {vol.fromDate} - {vol.toDate}
                </Typography>
                <Typography sx={{ 
                  ...textStyles,
                  whiteSpace: "pre-line", 
                  mt: 0.5, 
                  color: textColor,
                }}>
                  {vol.content}
                </Typography>
              </Box>
            ))}
          </div>
        ) : null;

      case 'interests':
        return savedInterests.length > 0 ? (
          <div key="interests" className={inSidebar ? "sidebar-section" : "resume-section"} style={sectionStyle}>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: "bold", 
                color: palette.accentColor, 
                mb: 1,
                ...subheadingStyles
              }}
            >
              Interests
            </Typography>
            {savedInterests.map((interest, index) => (
              <Typography key={index} sx={{ 
                ...paragraphStyle, 
                ...textStyles,
                color: textColor,
                backgroundColor: bgColor,
              }}>
                • {interest}
              </Typography>
            ))}
          </div>
        ) : null;

      case 'websites':
        return savedWebsites.length > 0 ? (
          <div key="websites" className={inSidebar ? "sidebar-section" : "resume-section"} style={sectionStyle}>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: "bold", 
                color: palette.accentColor, 
                mb: 1,
                ...subheadingStyles
              }}
            >
              Websites / Profiles
            </Typography>
            {savedWebsites.map((site, index) => (
              <Typography key={index} sx={{ 
                ...paragraphStyle, 
                ...textStyles,
                color: textColor,
                backgroundColor: bgColor,
              }}>
                • {site.url} {site.addToHeader ? "(Shown in Header)" : ""}
              </Typography>
            ))}
          </div>
        ) : null;

      case 'references':
        return savedReferences.length > 0 ? (
          <div key="references" className={inSidebar ? "sidebar-section" : "resume-section"} style={sectionStyle}>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: "bold", 
                color: palette.accentColor, 
                mb: 1,
                ...subheadingStyles
              }}
            >
              References
            </Typography>
            {savedReferences.map((ref, index) => (
              <Typography key={index} sx={{ 
                ...paragraphStyle, 
                ...textStyles,
                whiteSpace: "pre-line",
                color: textColor,
                backgroundColor: bgColor,
              }}>
                • {ref}
              </Typography>
            ))}
          </div>
        ) : null;

      case 'additionalInfo':
        return savedAdditionalInfo.length > 0 ? (
          <div key="additionalInfo" className={inSidebar ? "sidebar-section" : "resume-section"} style={sectionStyle}>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: "bold", 
                color: palette.accentColor, 
                mb: 1,
                ...subheadingStyles
              }}
            >
              Additional Information
            </Typography>
            {savedAdditionalInfo.map((info, index) => (
              <Typography key={index} sx={{ 
                ...paragraphStyle, 
                ...textStyles,
                color: textColor,
                backgroundColor: bgColor,
              }}>
                • {info}
              </Typography>
            ))}
          </div>
        ) : null;

      default:
        // Handle custom sections - LIKE RESUME9
        if (sectionId && sectionId.startsWith('custom_')) {
          const customSectionName = sectionId.replace('custom_', '');
          const items = customSections[customSectionName] || [];
          
          console.log(`🎯 Rendering custom section: ${customSectionName}`, items);
          
          if (items && items.length > 0) {
            return (
              <div key={sectionId} className={inSidebar ? "sidebar-section" : "resume-section"} style={sectionStyle}>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: "bold", 
                    color: palette.accentColor, 
                    mb: 1,
                    ...subheadingStyles
                  }}
                >
                  {customSectionName.toUpperCase()}
                </Typography>
                {items.map((item, i) => (
                  <Typography 
                    key={i} 
                    sx={{ 
                      ...paragraphStyle, 
                      ...textStyles,
                      whiteSpace: "pre-line",
                      color: textColor,
                      backgroundColor: bgColor,
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

  // Render main content for measurement (hidden)
  const renderMainContentToMeasure = () => (
    <Box sx={{ visibility: 'hidden', position: 'absolute', left: '-9999px', ...textStyles }}>
      <Box ref={mainContentRef} sx={{ p: `${topBottomMargin}px ${sideMargins}px`, width: '70%', ...textStyles }}>
        {renderRightContentSections()}
      </Box>

      {/* Sidebar content for measurement */}
      <Box ref={sidebarContentRef} sx={{ p: sideMargins / 5, width: '30%', ...textStyles }}>
        {renderSidebarSections()}
      </Box>
    </Box>
  );

  // Render actual content for display
  const renderMainContent = (pageContent) => (
    <Box sx={{ 
      width: "70%", 
      p: sideMargins / 5, 
      ...textStyles 
    }}>
      {pageContent.main.length > 0 ? (
        <div dangerouslySetInnerHTML={{ __html: pageContent.main.map(s => s.outerHTML).join('') }} />
      ) : (
        <Typography sx={{ ...textStyles }}>No content available</Typography>
      )}
    </Box>
  );

  // Render sidebar content
  const renderSidebar = (pageContent) => (
    <Box sx={{
      width: "30%",
      bgcolor: palette.sidebarBackground,
      p: sideMargins / 5,
      borderRight: `${lineWeight}px solid #eee`,
      ...textStyles
    }}>
      {pageContent.sidebar.length > 0 ? (
        <div dangerouslySetInnerHTML={{ __html: pageContent.sidebar.map(s => s.outerHTML).join('') }} />
      ) : (
        <Typography sx={{ ...textStyles }}></Typography>
      )}
    </Box>
  );

  // Render header (only for first page)
  const renderHeader = (hasHeader) => {
    if (!hasHeader) return null;
    
    return (
      <Box
        sx={{
          width: "100%",
          height: "200px",
          background: palette.header,
          clipPath: "polygon(0 0, 100% 0, 100% 75%, 50% 100%, 0 75%)",
          position: "relative",
          display: "flex",
          justifyContent: "center",
          color: "white",
          ...textStyles
        }}
      >
        <Box sx={{ textAlign: "center", px: 3, mt: 2, ...textStyles }}>
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: "bold", 
              color: palette.nameColor,
              fontSize: `calc(${getHeadingSize()} * 1.5)`,
              ...headingStyles
            }}
          >
            {data.firstName} {data.lastName}
          </Typography>
          <Typography 
            variant="subtitle1" 
            sx={{ 
              color: palette.nameColor, 
              fontSize: `calc(${getFontSize()} * 1.1)`,
              ...subheadingStyles,
              mb: 1,
              mt:1 
            }}
          >
            {data.currentPosition}
          </Typography>
        </Box>
        <Avatar
          src={photo || "https://via.placeholder.com/150"}
          sx={{
            width: 100,
            height: 100,
            border: "4px solid white",
            position: "absolute",
            bottom: "-3px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
          }}
        />
      </Box>
    );
  };

  if (!isDataLoaded) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px', ...textStyles }}>
        <Typography sx={{ ...textStyles }}>Loading resume data...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%", position: "relative", m: 5, ...textStyles }}>
      {!exporting && (
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          mb: 2, 
          gap: 2, 
          '@media print': { display: 'none' }, 
          ...textStyles 
        }}>
          <IconButton 
            onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))} 
            disabled={currentPage === 0} 
            color="primary" 
            sx={{ ...textStyles }}
          >
            <ChevronLeft />
          </IconButton>
          <Typography sx={{ mx: 2, ...textStyles }}>Page {currentPage + 1} of {Math.max(1, pages.length)}</Typography>
          <IconButton 
            onClick={() => setCurrentPage(prev => Math.min(pages.length - 1, prev + 1))} 
            disabled={currentPage === Math.max(0, pages.length - 1)} 
            color="primary" 
            sx={{ ...textStyles }}
          >
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
      
      <Box id="resume-container" sx={{ ...textStyles }}>
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
                ...textStyles,
                display: "flex",
                flexDirection: "column",
                pageBreakAfter: "always",
                "@media print": {
                  width: page.width,
                  height: "auto",
                  minHeight: page.height,
                  boxShadow: "none",
                  m: 0,
                  ...textStyles
                },
                // Show all pages when exporting, only current page when viewing
                display: exporting ? 'flex' : (index === currentPage ? 'flex' : 'none'),
                '@media print': { display: 'flex' }
              }}
            >
              {renderHeader(pageContent.hasHeader)}
              
              {/* Two Column Layout */}
              <Box sx={{ 
                display: "flex", 
                flex: 1, 
                mt: pageContent.hasHeader ? 2 : 0,
                minHeight: pageContent.hasHeader ? `calc(100% - 200px)` : '100%',
                ...textStyles
              }}>
                {renderSidebar(pageContent)}
                {renderMainContent(pageContent)}
              </Box>
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
              ...textStyles,
              display: "flex",
              flexDirection: "column",
              "@media print": {
                width: page.width,
                height: "auto",
                minHeight: page.height,
                boxShadow: "none",
                m: 0,
                ...textStyles
              },
            }}
          >
            {/* V Shape Header */}
            <Box
              sx={{
                width: "100%",
                height: "200px",
                background: palette.header,
                clipPath: "polygon(0 0, 100% 0, 100% 75%, 50% 100%, 0 75%)",
                position: "relative",
                display: "flex",
                justifyContent: "center",
                color: "white",
                ...textStyles
              }}
            >
              <Box sx={{ textAlign: "center", px: 3, mt: 2, ...textStyles }}>
                <Typography 
                  variant="h4" 
                  sx={{ 
                    fontWeight: "bold", 
                    color: palette.nameColor,
                    fontSize: `calc(${getHeadingSize()} * 1.5)`,
                    ...headingStyles
                  }}
                >
                  {data.firstName} {data.lastName}
                </Typography>
                <Typography 
                  variant="subtitle1" 
                  sx={{ 
                    color: palette.nameColor, 
                    fontSize: `calc(${getFontSize()} * 1.1)`,
                    ...subheadingStyles,
                    mb: 1 
                  }}
                >
                  {data.currentPosition}
                </Typography>
              </Box>
              <Avatar
                src={photo || "https://via.placeholder.com/150"}
                sx={{
                  width: 100,
                  height: 100,
                  border: "4px solid white",
                  position: "absolute",
                  bottom: "-3px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                }}
              />
            </Box>

            {/* Two Column Layout */}
            <Box sx={{ display: "flex", flex: 1, mt: 2, ...textStyles }}>
              <Box sx={{
                width: "30%",
                bgcolor: palette.sidebarBackground,
                p: sideMargins / 5,
                borderRight: `${lineWeight}px solid #eee`,
                ...textStyles
              }}>
                <Typography sx={{ ...textStyles }}>Loading sidebar content...</Typography>
              </Box>
              <Box sx={{ 
                width: "70%", 
                p: sideMargins / 5, 
                ...textStyles 
              }}>
                <Typography sx={{ ...textStyles }}>Loading main content...</Typography>
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
          <Typography variant="body2" color="textSecondary" sx={{ mb: 3, ...textStyles }}>
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
    { value: '#3f51b5', label: 'Indigo' },
    { value: '#2196f3', label: 'Blue' },
    { value: '#f44336', label: 'Red' },
    { value: '#4caf50', label: 'Green' },
    { value: '#ff9800', label: 'Orange' },
    { value: '#9c27b0', label: 'Purple' }
  ],
  nameColorOptions: [
    { value: '#f3ededff', label: 'Light' },
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
    { value: 'linear-gradient(135deg, #3f51b5, #2196f3)', label: 'Blue Gradient' },
    { value: 'linear-gradient(135deg, #f44336, #ff9800)', label: 'Red-Orange Gradient' },
    { value: 'linear-gradient(135deg, #4caf50, #8bc34a)', label: 'Green Gradient' },
    { value: 'linear-gradient(135deg, #9c27b0, #e91e63)', label: 'Purple-Pink Gradient' },
    { value: 'linear-gradient(135deg, #607d8b, #9e9e9e)', label: 'Gray Gradient' }
  ],
  fontFamilyOptions: [
    { value: 'arial', label: 'Arial' },
    { value: 'times', label: 'Times New Roman' },
    { value: 'helvetica', label: 'Helvetica' },
    { value: 'georgia', label: 'Georgia' },
    { value: 'verdana', label: 'Verdana' },
    { value: 'trebuchet', label: 'Trebuchet MS' },
    { value: 'courier', label: 'Courier New' }
  ],
  fontSizeOptions: [
    { value: 'small', label: 'Small' },
    { value: 'normal', label: 'Normal' },
    { value: 'medium', label: 'Medium' },
    { value: 'large', label: 'Large' }
  ],
  fontStyleOptions: [
    { value: 'normal', label: 'Normal' },
    { value: 'italic', label: 'Italic' }
  ],
  lineSpacingOptions: [
    { value: 'tight', label: 'Tight' },
    { value: 'normal', label: 'Normal' },
    { value: 'relaxed', label: 'Relaxed' },
    { value: 'loose', label: 'Loose' }
  ],
  experienceLevel: ["No Experience", "Less than 3 years", "3-5 Years"]
};

export default Resume17;