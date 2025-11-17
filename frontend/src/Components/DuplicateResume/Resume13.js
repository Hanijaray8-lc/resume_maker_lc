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
import LinkIcon from '@mui/icons-material/Link';
import {
  ChevronLeft,
  ChevronRight,
  Print,
  Download,
  DragIndicator,
  Reorder
} from '@mui/icons-material';
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

// Map page size to CSS dimensions
const pageSizeMap = {
  A4: { width: "210mm", height: "297mm" },
  Letter: { width: "216mm", height: "279mm" },
  Legal: { width: "216mm", height: "356mm" },
  A3: { width: "297mm", height: "420mm" },
  Executive: { width: "184mm", height: "267mm" },
};

const defaultData = {
  firstName: "DONNA",
  lastName: "STROUPE",
  currentPosition: "Sales Representative",
  phone: "+1 456-789-0123",
  email: "hello@email.com",
  city: "Anywhere St, Anytown",
  website: "",
  profile: "",
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
  'certifications',
  'accomplishments',
  'softwareSkills',
  'volunteering',
  'interests',
  'websites',
  'additionalInfo',
  'references'
];

const Resume13 = ({ 
  color = '#3A5A78',
  nameColor = '#333333',
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
  photo = "",
  formData = {},
  exporting = false,
  enableDragDrop = true,
}) => {
  const page = pageSizeMap[pageSize] || pageSizeMap.A4;
  const data = { ...defaultData, ...formData };
  
  // Use theme color if provided, otherwise use the color prop
  const primaryColor = theme?.primary || color;
  
  const [currentPage, setCurrentPage] = useState(0);
  const [pages, setPages] = useState([]);
  const [sidebarPages, setSidebarPages] = useState([]);
  const mainContentRef = useRef(null);
  const sidebarContentRef = useRef(null);
  
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
  const [workExperiences, setWorkExperiences] = useState([]);

  // State for section ordering - separate for left and right
  const [leftSectionOrder, setLeftSectionOrder] = useState(defaultLeftSectionOrder);
  const [rightSectionOrder, setRightSectionOrder] = useState(defaultRightSectionOrder);
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const [dragOverSide, setDragOverSide] = useState(null);
  
  // State for arrange sections dialog
  const [arrangeDialogOpen, setArrangeDialogOpen] = useState(false);

  // Global font style for all text - applied consistently throughout
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

  // Helper function to darken colors
  function getDarkColor(hex) {
    let c = hex.replace('#', '');
    if (c.length === 8) c = c.slice(0, 6);
    let r = Math.max(0, parseInt(c.substring(0,2),16) - 40);
    let g = Math.max(0, parseInt(c.substring(2,4),16) - 40);
    let b = Math.max(0, parseInt(c.substring(4,6),16) - 40);
    return `#${r.toString(16).padStart(2,'0')}${g.toString(16).padStart(2,'0')}${b.toString(16).padStart(2,'0')}`;
  }

  // Helper to load references (and normalize) so we can refresh without full reload
  const loadReferences = () => {
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
            position: r.position || r.jobTitle || r.relationship || "",
            company: r.company || r.companyName || "",
            phone: r.phone || r.contact || "",
            email: r.email || r.mail || ""
          };
        }
        return { name: String(r) };
      });
    };
    setSavedReferences(normalizeReferences(rawRefs));
  };

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

    // Load references via helper (keeps normalization consistent)
    loadReferences();
    
    const storedSoftwareSkills = JSON.parse(localStorage.getItem("softwareSkills")) || [];
    setSoftwareSkills(storedSoftwareSkills);
    const storedVolunteering = JSON.parse(localStorage.getItem("volunteering")) || [];
    setSavedVolunteering(storedVolunteering);
    const storedInterests = JSON.parse(localStorage.getItem("interests")) || [];
    setSavedInterests(storedInterests);
    const storedWebsites = JSON.parse(localStorage.getItem("websites")) || [];
    setSavedWebsites(storedWebsites);
    const storedWorkExperiences = JSON.parse(localStorage.getItem("workExperiences")) || [];
    setWorkExperiences(storedWorkExperiences);

    // Get all keys from localStorage that start with "custom_"
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
  const savedLeftSectionOrder = localStorage.getItem("resume13LeftSectionOrder");
  if (savedLeftSectionOrder) {
    // 🔥 FIX: Left side-ல custom sections auto add ஆகாது - filter only
    const parsedOrder = JSON.parse(savedLeftSectionOrder);
    const filteredOrder = parsedOrder.filter(section => !section.startsWith('custom_'));
    setLeftSectionOrder(filteredOrder);
    console.log('🔄 Loaded left section order WITHOUT custom sections:', filteredOrder);
  } else {
    setLeftSectionOrder(defaultLeftSectionOrder);
  }

  const savedRightSectionOrder = localStorage.getItem("resume13RightSectionOrder");
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
 

    // Keep references in sync:
    // - 'storage' event updates from other tabs/windows
    // - custom 'referencesUpdated' event for in-page updates (dispatch after you write to localStorage)
    const storageHandler = (e) => {
      if (!e || !e.key) {
        loadReferences();
        return;
      }
      if (["references", "referencesList", "referenceList", "savedReferences"].includes(e.key)) {
        loadReferences();
      }
    };
    window.addEventListener('storage', storageHandler);
    window.addEventListener('referencesUpdated', loadReferences);

    return () => {
      window.removeEventListener('storage', storageHandler);
      window.removeEventListener('referencesUpdated', loadReferences);
    };
  }, []);


  // Resume13-ல் custom section auto-update useEffect-ஐ add பண்ணவும்
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
      localStorage.setItem("resume13RightSectionOrder", JSON.stringify(newRightOrder));
      console.log('📝 Final right section order with ONLY CURRENT custom sections:', newRightOrder);
    }
    
    // 🔥 FIX: Left side-லிருந்து custom sections-ஐ remove செய்யவும்
    const currentLeftOrder = [...leftSectionOrder];
    const filteredLeftOrder = currentLeftOrder.filter(section => !section.startsWith('custom_'));
    if (JSON.stringify(filteredLeftOrder) !== JSON.stringify(currentLeftOrder)) {
      setLeftSectionOrder(filteredLeftOrder);
      localStorage.setItem("resume13LeftSectionOrder", JSON.stringify(filteredLeftOrder));
      console.log('🗑️ Removed custom sections from left side:', filteredLeftOrder);
    }
    
  } else if (userId && Object.keys(customSections).length === 0) {
    // If no current custom sections, remove all custom sections from both sides
    const currentRightOrder = [...rightSectionOrder];
    const filteredRightOrder = currentRightOrder.filter(section => !section.startsWith('custom_'));
    
    if (filteredRightOrder.length !== currentRightOrder.length) {
      setRightSectionOrder(filteredRightOrder);
      localStorage.setItem("resume13RightSectionOrder", JSON.stringify(filteredRightOrder));
      console.log('🗑️ Removed all custom sections from right side (no current sections)');
    }
    
    const currentLeftOrder = [...leftSectionOrder];
    const filteredLeftOrder = currentLeftOrder.filter(section => !section.startsWith('custom_'));
    if (filteredLeftOrder.length !== currentLeftOrder.length) {
      setLeftSectionOrder(filteredLeftOrder);
      localStorage.setItem("resume13LeftSectionOrder", JSON.stringify(filteredLeftOrder));
      console.log('🗑️ Removed all custom sections from left side (no current sections)');
    }
  }
}, [customSections]);

  // Save section orders to localStorage whenever they change
  useEffect(() => {
    if (leftSectionOrder.length > 0) {
      localStorage.setItem("resume13LeftSectionOrder", JSON.stringify(leftSectionOrder));
    }
  }, [leftSectionOrder]);

  useEffect(() => {
    if (rightSectionOrder.length > 0) {
      localStorage.setItem("resume13RightSectionOrder", JSON.stringify(rightSectionOrder));
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
    const customName = sectionId.replace('custom_', '').replace(/_/g, ' ');
    return customName.charAt(0).toUpperCase() + customName.slice(1);
  }
    
    return titles[sectionId] || sectionId;
  };

  const renderDragPanel = (side, sections) => {
    return (
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', ...getTextStyle() }}>
          <DragIndicator sx={{ mr: 1 }} />
          {side === 'left' ? 'Left Sidebar' : 'Right Content'} Sections
          <Typography variant="body2" color="textSecondary" sx={{ ml: 1, ...getTextStyle() }}>
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
                <Typography sx={{ ml: 1, flexGrow: 1, ...getTextStyle() }}>
                  {getSectionTitle(sectionId)}
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={getTextStyle()}>
                  {index + 1}
                </Typography>
              </Paper>
            ))
          ) : (
            <Typography variant="body2" color="textSecondary" sx={{ p: 2, textAlign: 'center', ...getTextStyle() }}>
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

  // Define a color palette for the template with customizable accent color
  const palette = {
    mainBackground: '#FFFFFF',
    sidebarBackground: primaryColor + '15', // 15 hex = ~8% opacity
    accentColor: primaryColor,
    textColor: '#333333',
    lightText: '#666666',
    nameColor: nameColor,
  };

  // Render sidebar sections based on current order
  const renderSidebarSections = () => {
    return leftSectionOrder.map(sectionId => {
      switch (sectionId) {
        case 'contact':
          return (
            <div key="contact" className="sidebar-section" style={{ marginBottom: sectionSpacing / 10 }}>
              <Box sx={{ mb: sectionSpacing / 10 }}>
                <Typography variant="h6" fontWeight="bold" sx={{ 
                  mb: 1, 
                  color: palette.accentColor,
                  fontSize: `calc(${headingSize} * 0.8)`,
                  fontFamily: font,
                }}>
                  Contact
                </Typography>
                <Box display="flex" alignItems="center" mb={1}>
                  <PhoneIcon sx={{ mr: 1, color: palette.accentColor }} />
                  <Typography variant="body2" sx={getTextStyle()}>
                    {data.phone}
                  </Typography>
                </Box>
                <Box display="flex" alignItems="center" mb={1}>
                  <EmailIcon sx={{ mr: 1, color: palette.accentColor }} />
                  <Typography variant="body2" sx={getTextStyle()}>
                    {data.email}
                  </Typography>
                </Box>
                <Box display="flex" alignItems="center">
                  <LocationOnIcon sx={{ mr: 1, color: palette.accentColor }} />
                  <Typography variant="body2" sx={getTextStyle()}>
                    {data.city}
                  </Typography>
                </Box>
                {data.website && (
                  <Box display="flex" alignItems="center" mt={1}>
                    <LinkIcon sx={{ mr: 1, color: palette.accentColor }} />
                    <Typography variant="body2" sx={getTextStyle()}>
                      {data.website}
                    </Typography>
                  </Box>
                )}
              </Box>

              <Divider sx={{ 
                my: paragraphSpacing / 5, 
                borderWidth: `${lineWeight}px`,
              }} />
            </div>
          );

        case 'education':
          return educationEntries.length > 0 ? (
            <div key="education" className="sidebar-section" style={{ marginBottom: sectionSpacing / 10 }}>
              <Box sx={{ mb: sectionSpacing / 10 }}>
                <Typography variant="h6" fontWeight="bold" sx={{ 
                  mb: 1, 
                  color: palette.accentColor,
                  fontSize: `calc(${headingSize} * 0.8)`,
                  fontFamily: font,
                }}>
                  Education
                </Typography>
                {educationEntries.map((edu) => (
                  <Box key={edu.id} sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" fontWeight="bold" sx={getTextStyle()}>
                      {edu.degree} {edu.fieldOfStudy && `- ${edu.fieldOfStudy}`}
                    </Typography>
                    <Typography variant="body2" sx={getTextStyle({ 
                      color: palette.lightText,
                    })}>
                      {edu.schoolName}
                    </Typography>
                    <Typography variant="body2" sx={getTextStyle({ 
                      color: palette.lightText,
                    })}>
                      {formatDate(edu.gradMonth, edu.gradYear)}
                    </Typography>
                  </Box>
                ))}
              </Box>

              <Divider sx={{ 
                my: paragraphSpacing / 5, 
                borderWidth: `${lineWeight}px`,
              }} />
            </div>
          ) : null;

        case 'skills':
          return (savedSkills.length > 0) ? (
            <div key="skills" className="sidebar-section" style={{ marginBottom: sectionSpacing / 10 }}>
              <Box sx={{ mb: sectionSpacing / 10 }}>
                <Typography variant="h6" fontWeight="bold" sx={{ 
                  mb: 1, 
                  color: palette.accentColor,
                  fontSize: `calc(${headingSize} * 0.8)`,
                  fontFamily: font,
                }}>
                  Skills
                </Typography>
                <Box component="ul" sx={{ listStyleType: 'none', p: 0 }}>
                  {savedSkills.map((skill, i) => (
                    <Typography key={i} component="li" variant="body2" sx={getTextStyle({ 
                      mb: 1,
                      textIndent: `${paragraphIndent}px`,
                    })}>
                      • {skill.name} {skill.rating && `(${skill.rating}%)`}
                    </Typography>
                  ))}
                </Box>
              </Box>

              <Divider sx={{ 
                my: paragraphSpacing / 5, 
                borderWidth: `${lineWeight}px`,
              }} />
            </div>
          ) : null;

        case 'languages':
          return savedLanguages.length > 0 ? (
            <div key="languages" className="sidebar-section">
              <Box>
                <Typography variant="h6" fontWeight="bold" sx={{ 
                  mb: 1, 
                  color: palette.accentColor,
                  fontSize: `calc(${headingSize} * 0.8)`,
                  fontFamily: font,
                }}>
                  Languages
                </Typography>
                <Box component="ul" sx={{ listStyleType: 'none', p: 0 }}>
                  {savedLanguages.map((lang, index) => (
                    <Typography key={index} component="li" variant="body2" sx={getTextStyle({ 
                      mb: 1,
                      textIndent: `${paragraphIndent}px`,
                    })}>
                      • {lang.name} {lang.level && `(${lang.level})`}
                    </Typography>
                  ))}
                </Box>
              </Box>
            </div>
          ) : null;

       // renderSidebarSections function-ல் default case-ஐ replace பண்ணவும்:

default:
  // Handle custom sections in sidebar
  if (sectionId.startsWith('custom_')) {
    const customSectionName = sectionId.replace('custom_', '');
    const items = customSections[customSectionName] || [];
    return items.length > 0 ? (
      <div key={sectionId} className="sidebar-section" style={{ marginBottom: sectionSpacing / 10 }}>
        <Box sx={{ mb: sectionSpacing / 10 }}>
          <Typography variant="h6" fontWeight="bold" sx={{ 
            mb: 1, 
            color: palette.accentColor,
            fontSize: `calc(${headingSize} * 0.8)`,
            fontFamily: font,
          }}>
            {customSectionName.toUpperCase()}
          </Typography>
          <Box component="ul" sx={{ listStyleType: 'none', p: 0 }}>
            {items.map((item, i) => (
              <Typography key={i} component="li" variant="body2" sx={getTextStyle({ 
                mb: 1,
                textIndent: `${paragraphIndent}px`,
                color: 'white'
              })}>
                • {item}
              </Typography>
            ))}
          </Box>
        </Box>
        <Divider sx={{ 
          my: paragraphSpacing / 5, 
          borderWidth: `${lineWeight}px`,
        }} />
      </div>
    ) : null;
  }
  
  // Handle sections moved from right side
  return renderMainContentSectionsForSidebar(sectionId);}
    }).filter(Boolean);
  };

  // Render main content sections for sidebar (when moved from right to left)
  const renderMainContentSectionsForSidebar = (sectionId) => {
    switch (sectionId) {
      case 'aboutMe':
        return savedSummary ? (
          <div key="aboutMe" className="sidebar-section" style={{ marginBottom: sectionSpacing / 10 }}>
            <Box sx={{ mb: sectionSpacing / 10 }}>
              <Typography variant="h6" fontWeight="bold" sx={{ 
                mb: 1, 
                color: palette.accentColor,
                fontSize: `calc(${headingSize} * 0.8)`,
                fontFamily: font,
              }}>
                About Me
              </Typography>
              <Typography variant="body2" sx={getTextStyle({ 
                textIndent: `${paragraphIndent}px`,
                whiteSpace: "pre-line",
                color: 'white'
              })}>
                {savedSummary}
              </Typography>
            </Box>
            <Divider sx={{ 
              my: paragraphSpacing / 5, 
              borderWidth: `${lineWeight}px`,
            }} />
          </div>
        ) : null;

      case 'workExperience':
        return workExperiences && workExperiences.length > 0 ? (
          <div key="workExperience" className="sidebar-section" style={{ marginBottom: sectionSpacing / 10 }}>
            <Box sx={{ mb: sectionSpacing / 10 }}>
              <Typography variant="h6" fontWeight="bold" sx={{ 
                mb: 2, 
                color: palette.accentColor,
                fontSize: `calc(${headingSize} * 0.8)`,
                fontFamily: font,
              }}>
                Work Experience
              </Typography>

              {workExperiences.map((work, i) => (
                <Box key={i} sx={{ mb: sectionSpacing / 10 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="subtitle1" fontWeight="bold" sx={getTextStyle({ color: 'white' })}>
                      {work.jobTitle}
                    </Typography>
                    <Typography variant="body2" sx={getTextStyle({ color: 'rgba(255,255,255,0.8)' })}>
                      {formatDate(work.startMonth, work.startYear)} - {work.current ? "Present" : formatDate(work.endMonth, work.endYear)}
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={getTextStyle({ 
                    mb: 1, 
                    color: 'rgba(255,255,255,0.7)',
                  })}>
                    {work.employer} {work.companyName && `| ${work.companyName}`} {work.location && `| ${work.location}`}
                  </Typography>
                  {work.description && (
                    <Box
                      sx={{
                        "& strong": { 
                          fontWeight: "bold", 
                          fontFamily: font,
                          fontSize: fontSize,
                          fontStyle: fontStyle,
                          color: 'white'
                        },
                        "& em": { 
                          fontStyle: "italic", 
                          fontFamily: font,
                          fontSize: fontSize,
                          color: 'white'
                        },
                        "& u": { 
                          textDecoration: "underline", 
                          fontFamily: font,
                          fontSize: fontSize,
                          fontStyle: fontStyle,
                          color: 'white'
                        },
                        "& *": {
                          fontFamily: font,
                          fontSize: fontSize,
                          fontStyle: fontStyle,
                          lineHeight: `${lineSpacing}px`,
                          color: 'white'
                        },
                        ...globalFontStyle,
                        color: 'white'
                      }}
                      dangerouslySetInnerHTML={{
                        __html: work.description
                          .replace(/\*\*(.*?)\*\*/g, `<strong style="font-family: ${font}; font-size: ${fontSize}; font-style: ${fontStyle}; color: white;">$1</strong>`)
                          .replace(/\*(.*?)\*/g, `<em style="font-family: ${font}; font-size: ${fontSize}; color: white;">$1</em>`)
                          .replace(/<u>(.*?)<\/u>/g, `<u style="font-family: ${font}; font-size: ${fontSize}; font-style: ${fontStyle}; color: white;">$1</u>`)
                          .replace(/\n/g, "<br/>"),
                      }}
                    />
                  )}
                </Box>
              ))}
            </Box>
            <Divider sx={{ 
              my: paragraphSpacing / 5, 
              borderWidth: `${lineWeight}px`,
            }} />
          </div>
        ) : null;

      case 'certifications':
        return savedCertifications.length > 0 ? (
          <div key="certifications" className="sidebar-section" style={{ marginBottom: sectionSpacing / 10 }}>
            <Box sx={{ mb: sectionSpacing / 10 }}>
              <Typography variant="h6" fontWeight="bold" sx={{ 
                mb: 2, 
                color: palette.accentColor,
                fontSize: `calc(${headingSize} * 0.8)`,
                fontFamily: font,
              }}>
                Certifications
              </Typography>
              {savedCertifications.map((cert, index) => (
                <Box key={index} sx={{ mb: 1 }}>
                  <Typography variant="subtitle2" fontWeight="bold" sx={getTextStyle({ color: 'white' })}>
                    {cert.name}
                  </Typography>
                  <Typography variant="body2" sx={getTextStyle({ color: 'rgba(255,255,255,0.8)' })}>
                    {cert.provider} {cert.year && `(${cert.year})`}
                  </Typography>
                  {cert.description && (
                    <Typography variant="body2" sx={getTextStyle({ color: 'white' })}>
                      {cert.description}
                    </Typography>
                  )}
                </Box>
              ))}
            </Box>
            <Divider sx={{ 
              my: paragraphSpacing / 5, 
              borderWidth: `${lineWeight}px`,
            }} />
          </div>
        ) : null;

      case 'accomplishments':
        return savedAccomplishments.length > 0 ? (
          <div key="accomplishments" className="sidebar-section" style={{ marginBottom: sectionSpacing / 10 }}>
            <Box sx={{ mb: sectionSpacing / 10 }}>
              <Typography variant="h6" fontWeight="bold" sx={{ 
                mb: 2, 
                color: palette.accentColor,
                fontSize: `calc(${headingSize} * 0.8)`,
                fontFamily: font,
              }}>
                Accomplishments
              </Typography>
              {savedAccomplishments.map((acc, index) => (
                <Typography key={index} variant="body2" sx={getTextStyle({ 
                  mb: 1,
                  textIndent: `${paragraphIndent}px`,
                  color: 'white'
                })}>
                  • {acc}
                </Typography>
              ))}
            </Box>
            <Divider sx={{ 
              my: paragraphSpacing / 5, 
              borderWidth: `${lineWeight}px`,
            }} />
          </div>
        ) : null;

      case 'softwareSkills':
        return softwareSkills.length > 0 ? (
          <div key="softwareSkills" className="sidebar-section" style={{ marginBottom: sectionSpacing / 10 }}>
            <Box sx={{ mb: sectionSpacing / 10 }}>
              <Typography variant="h6" fontWeight="bold" sx={{ 
                mb: 2, 
                color: palette.accentColor,
                fontSize: `calc(${headingSize} * 0.8)`,
                fontFamily: font,
              }}>
                Software Skills
              </Typography>
              {softwareSkills.map((skill, index) => (
                <Typography key={index} variant="body2" sx={getTextStyle({ 
                  mb: 1,
                  textIndent: `${paragraphIndent}px`,
                  color: 'white'
                })}>
                  • {skill.name} {skill.level && `— ${skill.level}%`}
                </Typography>
              ))}
            </Box>
            <Divider sx={{ 
              my: paragraphSpacing / 5, 
              borderWidth: `${lineWeight}px`,
            }} />
          </div>
        ) : null;

      case 'volunteering':
        return savedVolunteering.length > 0 ? (
          <div key="volunteering" className="sidebar-section" style={{ marginBottom: sectionSpacing / 10 }}>
            <Box sx={{ mb: sectionSpacing / 10 }}>
              <Typography variant="h6" fontWeight="bold" sx={{ 
                mb: 2, 
                color: palette.accentColor,
                fontSize: `calc(${headingSize} * 0.8)`,
                fontFamily: font,
              }}>
                Volunteering
              </Typography>
              {savedVolunteering.map((vol, index) => (
                <Box key={index} sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" fontWeight="bold" sx={getTextStyle({ color: 'white' })}>
                    {vol.subtopic || vol.organization}
                  </Typography>
                  <Typography variant="body2" sx={getTextStyle({ 
                    color: 'rgba(255,255,255,0.8)',
                    fontStyle: "italic"
                  })}>
                    {vol.fromDate} - {vol.toDate}
                  </Typography>
                  {vol.content && (
                    <Typography variant="body2" sx={getTextStyle({ 
                      whiteSpace: "pre-line",
                      mt: 0.5,
                      color: 'white'
                    })}>
                      {vol.content}
                    </Typography>
                  )}
                </Box>
              ))}
            </Box>
            <Divider sx={{ 
              my: paragraphSpacing / 5, 
              borderWidth: `${lineWeight}px`,
            }} />
          </div>
        ) : null;

      case 'interests':
        return savedInterests.length > 0 ? (
          <div key="interests" className="sidebar-section" style={{ marginBottom: sectionSpacing / 10 }}>
            <Box sx={{ mb: sectionSpacing / 10 }}>
              <Typography variant="h6" fontWeight="bold" sx={{ 
                mb: 2, 
                color: palette.accentColor,
                fontSize: `calc(${headingSize} * 0.8)`,
                fontFamily: font,
              }}>
                Interests
              </Typography>
              {savedInterests.map((interest, index) => (
                <Typography key={index} variant="body2" sx={getTextStyle({ 
                  mb: 1,
                  textIndent: `${paragraphIndent}px`,
                  color: 'white'
                })}>
                  • {interest}
                </Typography>
              ))}
            </Box>
            <Divider sx={{ 
              my: paragraphSpacing / 5, 
              borderWidth: `${lineWeight}px`,
            }} />
          </div>
        ) : null;

      case 'websites':
        return savedWebsites.length > 0 ? (
          <div key="websites" className="sidebar-section" style={{ marginBottom: sectionSpacing / 10 }}>
            <Box sx={{ mb: sectionSpacing / 10 }}>
              <Typography variant="h6" fontWeight="bold" sx={{ 
                mb: 2, 
                color: palette.accentColor,
                fontSize: `calc(${headingSize} * 0.8)`,
                fontFamily: font,
              }}>
                Websites / Profiles
              </Typography>
              {savedWebsites.map((site, index) => (
                <Typography key={index} variant="body2" sx={getTextStyle({ 
                  mb: 1,
                  color: 'white'
                })}>
                  • <a href={site.url} style={{ color: 'white', fontFamily: font, fontSize: fontSize, fontStyle: fontStyle }} target="_blank" rel="noopener noreferrer">
                    {site.url}
                  </a>
                </Typography>
              ))}
            </Box>
            <Divider sx={{ 
              my: paragraphSpacing / 5, 
              borderWidth: `${lineWeight}px`,
            }} />
          </div>
        ) : null;

      case 'additionalInfo':
        return savedAdditionalInfo.length > 0 ? (
          <div key="additionalInfo" className="sidebar-section" style={{ marginBottom: sectionSpacing / 10 }}>
            <Box sx={{ mb: sectionSpacing / 10 }}>
              <Typography variant="h6" fontWeight="bold" sx={{ 
                mb: 2, 
                color: palette.accentColor,
                fontSize: `calc(${headingSize} * 0.8)`,
                fontFamily: font,
              }}>
                Additional Information
              </Typography>
              {savedAdditionalInfo.map((info, index) => (
                <Typography key={index} variant="body2" sx={getTextStyle({ 
                  mb: 1,
                  textIndent: `${paragraphIndent}px`,
                  color: 'white'
                })}>
                  • {info}
                </Typography>
              ))}
            </Box>
            <Divider sx={{ 
              my: paragraphSpacing / 5, 
              borderWidth: `${lineWeight}px`,
            }} />
          </div>
        ) : null;

      case 'references':
        return savedReferences.length > 0 ? (
          <div key="references" className="sidebar-section">
            <Box>
              <Typography variant="h6" fontWeight="bold" sx={{ 
                mb: 2, 
                color: palette.accentColor,
                fontSize: `calc(${headingSize} * 0.8)`,
                fontFamily: font,
              }}>
                References
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                {savedReferences.map((ref, index) => (
                  <Box key={index} sx={{ width: { xs: '100%', sm: 'calc(50% - 8px)' } }}>
                    <Typography variant="subtitle1" fontWeight="bold" sx={getTextStyle({ color: 'white' })}>
                      {ref.name || `Reference ${index + 1}`}
                    </Typography>
                    <Typography variant="body2" sx={getTextStyle({ color: 'rgba(255,255,255,0.8)' })}>
                      {ref.position || ref.relationship}
                    </Typography>
                    <Typography variant="body2" sx={getTextStyle({ color: 'rgba(255,255,255,0.8)' })}>
                      {ref.company && `${ref.company} | `}
                      {ref.phone && `Phone: ${ref.phone}`}
                    </Typography>
                    <Typography variant="body2" sx={getTextStyle({ color: 'rgba(255,255,255,0.8)' })}>
                      {ref.email && (
                        <a href={`mailto:${ref.email}`} style={{ color: 'rgba(255,255,255,0.8)', fontFamily: font, fontSize: fontSize, fontStyle: fontStyle }}>
                          {ref.email}
                        </a>
                      )}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </div>
        ) : null;

      // renderMainContentSectionsForSidebar function-ல் default case-ஐ replace பண்ணவும்:

default:
  // Handle custom sections
  if (sectionId.startsWith('custom_')) {
    const customSectionName = sectionId.replace('custom_', '');
    const items = customSections[customSectionName] || [];
    return items.length > 0 ? (
      <div key={sectionId} className="sidebar-section" style={{ marginBottom: sectionSpacing / 10 }}>
        <Box sx={{ mb: sectionSpacing / 10 }}>
          <Typography variant="h6" fontWeight="bold" sx={{ 
            mb: 2, 
            color: palette.accentColor,
            fontSize: `calc(${headingSize} * 0.8)`,
            fontFamily: font,
          }}>
            {customSectionName.toUpperCase()}
          </Typography>
          {items.map((item, i) => (
            <Typography key={i} variant="body2" sx={getTextStyle({ 
              mb: 1,
              whiteSpace: "pre-line",
              color: 'white'
            })}>
              • {item}
            </Typography>
          ))}
        </Box>
        <Divider sx={{ 
          my: paragraphSpacing / 5, 
          borderWidth: `${lineWeight}px`,
        }} />
      </div>
    ) : null;
  }
  return null;
    }
  };

  // Render main content sections based on current order
  const renderMainContentSections = () => {
    return rightSectionOrder.map(sectionId => {
      switch (sectionId) {
        case 'aboutMe':
          return savedSummary ? (
            <div key="aboutMe" className="resume-section" style={{ marginBottom: sectionSpacing / 10 }}>
              <Box sx={{ mb: sectionSpacing / 10 }}>
                <Typography variant="h6" fontWeight="bold" sx={{ 
                  mb: 1, 
                  color: palette.accentColor,
                  fontSize: `calc(${headingSize} * 0.8)`,
                  fontFamily: font,
                }}>
                  About Me
                </Typography>
                <Typography variant="body2" sx={getTextStyle({ 
                  textIndent: `${paragraphIndent}px`,
                  whiteSpace: "pre-line"
                })}>
                  {savedSummary}
                </Typography>
              </Box>
              <Divider sx={{ 
                my: paragraphSpacing / 5, 
                borderWidth: `${lineWeight}px`,
              }} />
            </div>
          ) : null;

        case 'workExperience':
          return workExperiences && workExperiences.length > 0 ? (
            <div key="workExperience" className="resume-section" style={{ marginBottom: sectionSpacing / 10 }}>
              <Box sx={{ mb: sectionSpacing / 10 }}>
                <Typography variant="h6" fontWeight="bold" sx={{ 
                  mb: 2, 
                  color: palette.accentColor,
                  fontSize: `calc(${headingSize} * 0.8)`,
                  fontFamily: font,
                }}>
                  Work Experience
                </Typography>

                {workExperiences.map((work, i) => (
                  <Box key={i} sx={{ mb: sectionSpacing / 10 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Typography variant="subtitle1" fontWeight="bold" sx={getTextStyle()}>
                        {work.jobTitle}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={getTextStyle()}>
                        {formatDate(work.startMonth, work.startYear)} - {work.current ? "Present" : formatDate(work.endMonth, work.endYear)}
                      </Typography>
                    </Box>
                    <Typography variant="body2" sx={getTextStyle({ 
                      mb: 1, 
                      color: palette.lightText,
                    })}>
                      {work.employer} {work.companyName && `| ${work.companyName}`} {work.location && `| ${work.location}`}
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
                            .replace(/\*\*(.*?)\*\*/g, `<strong style="font-family: ${font}; font-size: ${fontSize}; font-style: ${fontStyle};">$1</strong>`)
                            .replace(/\*(.*?)\*/g, `<em style="font-family: ${font}; font-size: ${fontSize};">$1</em>`)
                            .replace(/<u>(.*?)<\/u>/g, `<u style="font-family: ${font}; font-size: ${fontSize}; font-style: ${fontStyle};">$1</u>`)
                            .replace(/\n/g, "<br/>"),
                        }}
                      />
                    )}
                  </Box>
                ))}
              </Box>
              <Divider sx={{ 
                my: paragraphSpacing / 5, 
                borderWidth: `${lineWeight}px`,
              }} />
            </div>
          ) : null;

        case 'certifications':
          return savedCertifications.length > 0 ? (
            <div key="certifications" className="resume-section" style={{ marginBottom: sectionSpacing / 10 }}>
              <Box sx={{ mb: sectionSpacing / 10 }}>
                <Typography variant="h6" fontWeight="bold" sx={{ 
                  mb: 2, 
                  color: palette.accentColor,
                  fontSize: `calc(${headingSize} * 0.8)`,
                  fontFamily: font,
                }}>
                  Certifications
                </Typography>
                {savedCertifications.map((cert, index) => (
                  <Box key={index} sx={{ mb: 1 }}>
                    <Typography variant="subtitle2" fontWeight="bold" sx={getTextStyle()}>
                      {cert.name}
                    </Typography>
                    <Typography variant="body2" sx={getTextStyle({ color: palette.lightText })}>
                      {cert.provider} {cert.year && `(${cert.year})`}
                    </Typography>
                    {cert.description && (
                      <Typography variant="body2" sx={getTextStyle()}>
                        {cert.description}
                      </Typography>
                    )}
                  </Box>
                ))}
              </Box>
              <Divider sx={{ 
                my: paragraphSpacing / 5, 
                borderWidth: `${lineWeight}px`,
              }} />
            </div>
          ) : null;

        case 'accomplishments':
          return savedAccomplishments.length > 0 ? (
            <div key="accomplishments" className="resume-section" style={{ marginBottom: sectionSpacing / 10 }}>
              <Box sx={{ mb: sectionSpacing / 10 }}>
                <Typography variant="h6" fontWeight="bold" sx={{ 
                  mb: 2, 
                  color: palette.accentColor,
                  fontSize: `calc(${headingSize} * 0.8)`,
                  fontFamily: font,
                }}>
                  Accomplishments
                </Typography>
                {savedAccomplishments.map((acc, index) => (
                  <Typography key={index} variant="body2" sx={getTextStyle({ 
                    mb: 1,
                    textIndent: `${paragraphIndent}px`,
                  })}>
                    • {acc}
                  </Typography>
                ))}
              </Box>
              <Divider sx={{ 
                my: paragraphSpacing / 5, 
                borderWidth: `${lineWeight}px`,
              }} />
            </div>
          ) : null;

        case 'softwareSkills':
          return softwareSkills.length > 0 ? (
            <div key="softwareSkills" className="resume-section" style={{ marginBottom: sectionSpacing / 10 }}>
              <Box sx={{ mb: sectionSpacing / 10 }}>
                <Typography variant="h6" fontWeight="bold" sx={{ 
                  mb: 2, 
                  color: palette.accentColor,
                  fontSize: `calc(${headingSize} * 0.8)`,
                  fontFamily: font,
                }}>
                  Software Skills
                </Typography>
                {softwareSkills.map((skill, index) => (
                  <Typography key={index} variant="body2" sx={getTextStyle({ 
                    mb: 1,
                    textIndent: `${paragraphIndent}px`,
                  })}>
                    • {skill.name} {skill.level && `— ${skill.level}%`}
                  </Typography>
                ))}
              </Box>
              <Divider sx={{ 
                my: paragraphSpacing / 5, 
                borderWidth: `${lineWeight}px`,
              }} />
            </div>
          ) : null;

        case 'volunteering':
          return savedVolunteering.length > 0 ? (
            <div key="volunteering" className="resume-section" style={{ marginBottom: sectionSpacing / 10 }}>
              <Box sx={{ mb: sectionSpacing / 10 }}>
                <Typography variant="h6" fontWeight="bold" sx={{ 
                  mb: 2, 
                  color: palette.accentColor,
                  fontSize: `calc(${headingSize} * 0.8)`,
                  fontFamily: font,
                }}>
                  Volunteering
                </Typography>
                {savedVolunteering.map((vol, index) => (
                  <Box key={index} sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" fontWeight="bold" sx={getTextStyle()}>
                      {vol.subtopic || vol.organization}
                    </Typography>
                    <Typography variant="body2" sx={getTextStyle({ 
                      color: palette.lightText,
                      fontStyle: "italic"
                    })}>
                      {vol.fromDate} - {vol.toDate}
                    </Typography>
                    {vol.content && (
                      <Typography variant="body2" sx={getTextStyle({ 
                        whiteSpace: "pre-line",
                        mt: 0.5
                      })}>
                        {vol.content}
                      </Typography>
                    )}
                  </Box>
                ))}
              </Box>
              <Divider sx={{ 
                my: paragraphSpacing / 5, 
                borderWidth: `${lineWeight}px`,
              }} />
            </div>
          ) : null;

        case 'interests':
          return savedInterests.length > 0 ? (
            <div key="interests" className="resume-section" style={{ marginBottom: sectionSpacing / 10 }}>
              <Box sx={{ mb: sectionSpacing / 10 }}>
                <Typography variant="h6" fontWeight="bold" sx={{ 
                  mb: 2, 
                  color: palette.accentColor,
                  fontSize: `calc(${headingSize} * 0.8)`,
                  fontFamily: font,
                }}>
                  Interests
                </Typography>
                {savedInterests.map((interest, index) => (
                  <Typography key={index} variant="body2" sx={getTextStyle({ 
                    mb: 1,
                    textIndent: `${paragraphIndent}px`,
                  })}>
                    • {interest}
                  </Typography>
                ))}
              </Box>
              <Divider sx={{ 
                my: paragraphSpacing / 5, 
                borderWidth: `${lineWeight}px`,
              }} />
            </div>
          ) : null;

        case 'websites':
          return savedWebsites.length > 0 ? (
            <div key="websites" className="resume-section" style={{ marginBottom: sectionSpacing / 10 }}>
              <Box sx={{ mb: sectionSpacing / 10 }}>
                <Typography variant="h6" fontWeight="bold" sx={{ 
                  mb: 2, 
                  color: palette.accentColor,
                  fontSize: `calc(${headingSize} * 0.8)`,
                  fontFamily: font,
                }}>
                  Websites / Profiles
                </Typography>
                {savedWebsites.map((site, index) => (
                  <Typography key={index} variant="body2" sx={getTextStyle({ 
                    mb: 1,
                  })}>
                    • <a href={site.url} style={{ color: palette.accentColor, fontFamily: font, fontSize: fontSize, fontStyle: fontStyle }} target="_blank" rel="noopener noreferrer">
                      {site.url}
                    </a>
                  </Typography>
                ))}
              </Box>
              <Divider sx={{ 
                my: paragraphSpacing / 5, 
                borderWidth: `${lineWeight}px`,
              }} />
            </div>
          ) : null;

        case 'additionalInfo':
          return savedAdditionalInfo.length > 0 ? (
            <div key="additionalInfo" className="resume-section" style={{ marginBottom: sectionSpacing / 10 }}>
              <Box sx={{ mb: sectionSpacing / 10 }}>
                <Typography variant="h6" fontWeight="bold" sx={{ 
                  mb: 2, 
                  color: palette.accentColor,
                  fontSize: `calc(${headingSize} * 0.8)`,
                  fontFamily: font,
                }}>
                  Additional Information
                </Typography>
                {savedAdditionalInfo.map((info, index) => (
                  <Typography key={index} variant="body2" sx={getTextStyle({ 
                    mb: 1,
                    textIndent: `${paragraphIndent}px`,
                  })}>
                    • {info}
                  </Typography>
                ))}
              </Box>
              <Divider sx={{ 
                my: paragraphSpacing / 5, 
                borderWidth: `${lineWeight}px`,
              }} />
            </div>
          ) : null;

        case 'references':
          return savedReferences.length > 0 ? (
            <div key="references" className="resume-section">
              <Box>
                <Typography variant="h6" fontWeight="bold" sx={{ 
                  mb: 2, 
                  color: palette.accentColor,
                  fontSize: `calc(${headingSize} * 0.8)`,
                  fontFamily: font,
                }}>
                  References
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                  {savedReferences.map((ref, index) => (
                    <Box key={index} sx={{ width: { xs: '100%', sm: 'calc(50% - 8px)' } }}>
                      <Typography variant="subtitle1" fontWeight="bold" sx={getTextStyle()}>
                        {ref.name || `Reference ${index + 1}`}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={getTextStyle()}>
                        {ref.position || ref.relationship}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={getTextStyle()}>
                        {ref.company && `${ref.company} | `}
                        {ref.phone && `Phone: ${ref.phone}`}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={getTextStyle()}>
                        {ref.email && (
                          <a href={`mailto:${ref.email}`} style={{ color: palette.lightText, fontFamily: font, fontSize: fontSize, fontStyle: fontStyle }}>
                            {ref.email}
                          </a>
                        )}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            </div>
          ) : null;

        // renderSidebarSectionsForMainContent function-ல் default case-ஐ replace பண்ணவும்:

default:
  // Handle custom sections
  if (sectionId.startsWith('custom_')) {
    const customSectionName = sectionId.replace('custom_', '');
    const items = customSections[customSectionName] || [];
    return items.length > 0 ? (
      <div key={sectionId} className="resume-section" style={{ marginBottom: sectionSpacing / 10 }}>
        <Box sx={{ mb: sectionSpacing / 10 }}>
          <Typography variant="h6" fontWeight="bold" sx={{ 
            mb: 1, 
            color: palette.accentColor,
            fontSize: `calc(${headingSize} * 0.8)`,
            fontFamily: font,
          }}>
            {customSectionName.toUpperCase()}
          </Typography>
          <Box component="ul" sx={{ listStyleType: 'none', p: 0 }}>
            {items.map((item, i) => (
              <Typography key={i} component="li" variant="body2" sx={getTextStyle({ 
                mb: 1,
                textIndent: `${paragraphIndent}px`,
              })}>
                • {item}
              </Typography>
            ))}
          </Box>
        </Box>
        <Divider sx={{ 
          my: paragraphSpacing / 5, 
          borderWidth: `${lineWeight}px`,
        }} />
      </div>
    ) : null;
  }
  return null;}
    }).filter(Boolean);
  };

  // Render sidebar sections for main content (when moved from left to right)
  const renderSidebarSectionsForMainContent = (sectionId) => {
    switch (sectionId) {
      case 'contact':
        return (
          <div key="contact" className="resume-section" style={{ marginBottom: sectionSpacing / 10 }}>
            <Box sx={{ mb: sectionSpacing / 10 }}>
              <Typography variant="h6" fontWeight="bold" sx={{ 
                mb: 1, 
                color: palette.accentColor,
                fontSize: `calc(${headingSize} * 0.8)`,
                fontFamily: font,
              }}>
                Contact
              </Typography>
              <Box display="flex" alignItems="center" mb={1}>
                <PhoneIcon sx={{ mr: 1, color: palette.accentColor }} />
                <Typography variant="body2" sx={getTextStyle()}>
                  {data.phone}
                </Typography>
              </Box>
              <Box display="flex" alignItems="center" mb={1}>
                <EmailIcon sx={{ mr: 1, color: palette.accentColor }} />
                <Typography variant="body2" sx={getTextStyle()}>
                  {data.email}
                </Typography>
              </Box>
              <Box display="flex" alignItems="center">
                <LocationOnIcon sx={{ mr: 1, color: palette.accentColor }} />
                <Typography variant="body2" sx={getTextStyle()}>
                  {data.city}
                </Typography>
              </Box>
              {data.website && (
                <Box display="flex" alignItems="center" mt={1}>
                  <LinkIcon sx={{ mr: 1, color: palette.accentColor }} />
                  <Typography variant="body2" sx={getTextStyle()}>
                    {data.website}
                  </Typography>
                </Box>
              )}
            </Box>

            <Divider sx={{ 
              my: paragraphSpacing / 5, 
              borderWidth: `${lineWeight}px`,
            }} />
          </div>
        );

      case 'education':
        return educationEntries.length > 0 ? (
          <div key="education" className="resume-section" style={{ marginBottom: sectionSpacing / 10 }}>
            <Box sx={{ mb: sectionSpacing / 10 }}>
              <Typography variant="h6" fontWeight="bold" sx={{ 
                mb: 1, 
                color: palette.accentColor,
                fontSize: `calc(${headingSize} * 0.8)`,
                fontFamily: font,
              }}>
                Education
              </Typography>
              {educationEntries.map((edu) => (
                <Box key={edu.id} sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" fontWeight="bold" sx={getTextStyle()}>
                    {edu.degree} {edu.fieldOfStudy && `- ${edu.fieldOfStudy}`}
                  </Typography>
                  <Typography variant="body2" sx={getTextStyle({ 
                    color: palette.lightText,
                  })}>
                    {edu.schoolName}
                  </Typography>
                  <Typography variant="body2" sx={getTextStyle({ 
                    color: palette.lightText,
                  })}>
                    {formatDate(edu.gradMonth, edu.gradYear)}
                  </Typography>
                </Box>
              ))}
            </Box>

            <Divider sx={{ 
              my: paragraphSpacing / 5, 
              borderWidth: `${lineWeight}px`,
            }} />
          </div>
        ) : null;

      case 'skills':
        return (savedSkills.length > 0) ? (
          <div key="skills" className="resume-section" style={{ marginBottom: sectionSpacing / 10 }}>
            <Box sx={{ mb: sectionSpacing / 10 }}>
              <Typography variant="h6" fontWeight="bold" sx={{ 
                mb: 1, 
                color: palette.accentColor,
                fontSize: `calc(${headingSize} * 0.8)`,
                fontFamily: font,
              }}>
                Skills
              </Typography>
              <Box component="ul" sx={{ listStyleType: 'none', p: 0 }}>
                {savedSkills.map((skill, i) => (
                  <Typography key={i} component="li" variant="body2" sx={getTextStyle({ 
                    mb: 1,
                    textIndent: `${paragraphIndent}px`,
                  })}>
                    • {skill.name} {skill.rating && `(${skill.rating}%)`}
                  </Typography>
                ))}
              </Box>
            </Box>

            <Divider sx={{ 
              my: paragraphSpacing / 5, 
              borderWidth: `${lineWeight}px`,
            }} />
          </div>
        ) : null;

      case 'languages':
        return savedLanguages.length > 0 ? (
          <div key="languages" className="resume-section">
            <Box>
              <Typography variant="h6" fontWeight="bold" sx={{ 
                mb: 1, 
                color: palette.accentColor,
                fontSize: `calc(${headingSize} * 0.8)`,
                fontFamily: font,
              }}>
                Languages
              </Typography>
              <Box component="ul" sx={{ listStyleType: 'none', p: 0 }}>
                {savedLanguages.map((lang, index) => (
                  <Typography key={index} component="li" variant="body2" sx={getTextStyle({ 
                    mb: 1,
                    textIndent: `${paragraphIndent}px`,
                  })}>
                    • {lang.name} {lang.level && `(${lang.level})`}
                  </Typography>
                ))}
              </Box>
            </Box>
          </div>
        ) : null;

      default:
        // Handle custom sections
        if (sectionId.startsWith('custom_')) {
          const customSectionName = sectionId.replace('custom_', '');
          const items = customSections[customSectionName] || [];
          return items.length > 0 ? (
            <div key={sectionId} className="resume-section" style={{ marginBottom: sectionSpacing / 10 }}>
              <Box sx={{ mb: sectionSpacing / 10 }}>
                <Typography variant="h6" fontWeight="bold" sx={{ 
                  mb: 1, 
                  color: palette.accentColor,
                  fontSize: `calc(${headingSize} * 0.8)`,
                  fontFamily: font,
                }}>
                  {customSectionName.toUpperCase()}
                </Typography>
                <Box component="ul" sx={{ listStyleType: 'none', p: 0 }}>
                  {items.map((item, i) => (
                    <Typography key={i} component="li" variant="body2" sx={getTextStyle({ 
                      mb: 1,
                      textIndent: `${paragraphIndent}px`,
                    })}>
                      • {item}
                    </Typography>
                  ))}
                </Box>
              </Box>
              <Divider sx={{ 
                my: paragraphSpacing / 5, 
                borderWidth: `${lineWeight}px`,
              }} />
            </div>
          ) : null;
        }
        return null;
    }
  };

  // Pagination for sidebar content
  const paginateSidebarContent = useCallback(() => {
    if (!sidebarContentRef.current) return;

    const pageHeightInPx = parseFloat(page.height.replace('mm', '')) * 3.78;
    const headerHeight = 200; // Approximate header height for first page
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
  }, [page.height, topBottomMargin, leftSectionOrder, sectionSpacing, paragraphSpacing, lineWeight]);

  // Pagination for main content (right side)
  const paginateMainContent = useCallback(() => {
    if (!mainContentRef.current) return;

    const pageHeightInPx = parseFloat(page.height.replace('mm', '')) * 3.78;
    const headerHeight = 200; // Approximate header height for first page
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
  }, [page.height, topBottomMargin, rightSectionOrder, sectionSpacing, paragraphSpacing, lineWeight]);

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
    font,
    fontSize,
    fontStyle,
    headingSize,
    sectionSpacing,
    paragraphSpacing,
    lineSpacing,
    topBottomMargin,
    sideMargins,
    paragraphIndent,
    lineWeight,
    pageSize
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
        fontFamily: font,
        fontSize: fontSize,
        fontStyle: fontStyle,
        lineHeight: `${lineSpacing}px`,
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
            __html: sidebarPages[pageIndex].join('') 
          }} 
        />
      ) : (
        <Typography sx={getTextStyle()}>Loading sidebar content...</Typography>
      )}
    </Box>
  );

  // Render header section - ONLY on first page
  const renderHeader = (pageIndex) => {
    if (pageIndex > 0) return null; // Show header only on first page
    
    return (
      <Box 
        sx={{
          display: 'flex',
          alignItems: 'center',
          bgcolor: palette.sidebarBackground,
          p: sideMargins / 5,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 0,
          borderBottomLeftRadius: 20,
          borderBottomRightRadius: 0,
          flexDirection: { xs: 'column', sm: 'row' },
          gap: { xs: 2, sm: 8 },
          mt: "50px",
          mb: "50px",
          ml: "100px",
          "@media print": {
            bgcolor: palette.sidebarBackground,
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
              border: `${lineWeight * 2}px solid white`,
            }}
          />
        </Box>
        <Box>
          <Typography variant="h4" component="h1" fontWeight="bold" sx={{ 
            color: palette.nameColor,
            fontSize: headingSize,
            fontFamily: font,
            fontStyle: fontStyle,
            lineHeight: `${parseInt(lineSpacing) * 1.5}px`,
          }}>
            {data.firstName} {data.lastName}
          </Typography>
          <Typography variant="subtitle1" sx={{ 
            color: palette.lightText,
            fontSize: `calc(${fontSize} * 1.1)`,
            fontFamily: font,
            fontStyle: fontStyle,
            lineHeight: `${lineSpacing}px`,
          }}>
            {data.currentPosition}
          </Typography>
        </Box>
      </Box>
    );
  };

  // Calculate total pages needed (max of sidebar pages and main content pages)
  const totalPages = Math.max(sidebarPages.length, pages.length, 1);

  return (
    <Box sx={{ width: "100%", position: "relative", m: 5, ...globalFontStyle }}>
      {!exporting && (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 2, gap: 2, '@media print': { display: 'none' } }}>
          <IconButton onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))} disabled={currentPage === 0} color="primary">
            <ChevronLeft />
          </IconButton>
          <Typography sx={{ mx: 2, ...getTextStyle() }}>Page {currentPage + 1} of {totalPages}</Typography>
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
      <Box id="resume13-container">
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
              },
              // Show all pages when exporting, only current page when viewing
              display: exporting ? 'flex' : (pageIndex === currentPage ? 'flex' : 'none'),
              '@media print': { display: 'flex' }
            }}
          >
            {/* Header Section - Show only on first page */}
            {renderHeader(pageIndex)}

            <Box sx={{ 
              display: "flex", 
              height: "100%", 
              p: `${topBottomMargin}px ${sideMargins}px`, 
              flex: 1,
              // Add gap between sidebar and main content
              gap: 1
            }}>
              {/* Left Sidebar - Show on all pages if there's sidebar content */}
              {sidebarPages[pageIndex] ? renderSidebar(pageIndex) : <Box sx={{ width: "30%", bgcolor: palette.sidebarBackground, p: sideMargins / 5 }} />}
              
              {/* Vertical Divider - Show only when both sidebar and content exist */}
              {(sidebarPages[pageIndex] && pages[pageIndex]) && (
                <Divider 
                  orientation="vertical" 
                  flexItem 
                  sx={{ 
                    borderRightWidth: lineWeight,
                    // Adjust divider position to create proper gap
                    mx: 1
                  }} 
                />
              )}
              
              {/* Right Content Section */}
              <Box
                sx={{
                  width: sidebarPages[pageIndex] ? "70%" : "100%",
                  fontFamily: font,
                  fontSize: fontSize,
                  fontStyle: fontStyle,
                  lineHeight: `${lineSpacing}px`,
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
                      __html: pages[pageIndex].join('') 
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
        <DialogTitle sx={getTextStyle()}>
          <Box display="flex" alignItems="center">
            <Reorder sx={{ mr: 1 }} />
            Arrange Resume Sections
          </Box>
        </DialogTitle>

        <DialogContent>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 3, ...getTextStyle() }}>
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

// Meta information for Resume13
export const resumeMeta = {
  hasPhoto: true,
  columns: 2,
  colorOptions: [
    { value: '#3A5A78', label: 'Default Blue' },
    { value: '#1a2b47', label: 'Dark Blue' },
    { value: '#6a1b9a', label: 'Purple' },
    { value: '#88c4d4ff', label: 'Green' },
    { value: '#d32f2f', label: 'Red' }
  ],
  nameColorOptions: [
    { value: '#333333', label: 'Dark Gray' },
    { value: '#000000', label: 'Black' },
    { value: '#1a2b47', label: 'Dark Blue' },
    { value: '#2e7d32', label: 'Green' },
    { value: '#d32f2f', label: 'Red' }
  ]
};

export default Resume13;