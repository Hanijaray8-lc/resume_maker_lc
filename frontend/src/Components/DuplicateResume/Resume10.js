import React, { useEffect, useState, useRef, useCallback } from "react";
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
} from "@mui/material";
import { ChevronLeft, ChevronRight,  DragIndicator, Reorder } from "@mui/icons-material";


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
  phone: "+123-456-7890",
  email: "hello@reallygreatsite.com",
  city: "123 Anywhere St, Any City",
  website: "reallygreatsite.com",
  profile: "I am a Sales Representative who initiates and manages customer relationships. I ensure smooth transitions from initial outreach to final purchase, either by them or someone in their household.",
};

// Separate section orders for left and right sides
const defaultLeftSectionOrder = [
  'contact',
  'education',
  'skills',
  'languages',
  'interests',
  'additionalInfo'
];

const defaultRightSectionOrder = [
  'profile',
  'workExperience',
  'certifications',
  'accomplishments',
  'volunteering',
  'references'
];

const ResumeTemplate10 = ({ 
  color = "#2b2320",
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

  // Resolve primaryColor from multiple possible shapes (theme may be string or object)
  const resolvePrimary = () => {
    if (!theme && color) return color;
    if (typeof theme === "string") return theme;
    if (theme && typeof theme === "object") {
      if (theme.primary) return theme.primary;
      if (theme.color) return theme.color;
      if (theme.hex) return theme.hex;
    }
    return color;
  };

  const primaryColor = resolvePrimary();
  const darkColor = (theme && (theme.dark || theme.secondary)) || getDarkColor(primaryColor);
  
  // Debug: log incoming color/theme so it's easy to trace why a color may not apply
  useEffect(() => {
    console.log("Resume10 - theme/color update:", { theme, color, primaryColor, darkColor });
  }, [theme, color, primaryColor, darkColor]);
  
  // State for all resume data
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
  const [draggedSection, setDraggedSection] = useState(null);
  
  // State for arrange sections dialog
  const [arrangeDialogOpen, setArrangeDialogOpen] = useState(false);

  // Helper function to darken colors
  function getDarkColor(hex) {
    let c = hex.replace('#', '');
    if (c.length === 8) c = c.slice(0, 6);
    let r = Math.max(0, parseInt(c.substring(0,2),16) - 40);
    let g = Math.max(0, parseInt(c.substring(2,4),16) - 40);
    let b = Math.max(0, parseInt(c.substring(4,6),16) - 40);
    return `#${r.toString(16).padStart(2,'0')}${g.toString(16).padStart(2,'0')}${b.toString(16).padStart(2,'0')}`;
  }

  // Debug function to check localStorage
  const debugLocalStorage = () => {
    console.log("=== localStorage Debug ===");
    const allKeys = Object.keys(localStorage);
    allKeys.forEach(key => {
      if (key.includes('reference') || key.includes('Reference') || key.includes('software') || key.includes('skill')) {
        console.log(`Key: ${key}`, JSON.parse(localStorage.getItem(key)));
      }
    });
    console.log("All keys:", allKeys);
    console.log("=== End Debug ===");
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

    // Fetch the missing data items
    const storedAdditionalInfo = JSON.parse(localStorage.getItem("additionalInfo")) || [];
    setSavedAdditionalInfo(storedAdditionalInfo);

    const storedLanguages = JSON.parse(localStorage.getItem("languagesList")) || [];
    setSavedLanguages(storedLanguages);

    const storedAccomplishments = JSON.parse(localStorage.getItem("accomplishmentsList")) || [];
    setSavedAccomplishments(storedAccomplishments);

    const storedCertifications = JSON.parse(localStorage.getItem("certificationsList")) || [];
    setSavedCertifications(storedCertifications);

    // FIXED: Software Skills data fetching
    let storedSoftwareSkills = [];
    if (localStorage.getItem("softwareSkills")) {
      storedSoftwareSkills = JSON.parse(localStorage.getItem("softwareSkills"));
    }
    console.log("Loaded software skills:", storedSoftwareSkills);
    setSoftwareSkills(storedSoftwareSkills);

    // FIXED: References data fetching - check multiple possible keys
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
    const normalizedRefs = normalizeReferences(rawRefs);
    console.log("Loaded references:", normalizedRefs);
    setSavedReferences(normalizedRefs);
    
    const storedVolunteering = JSON.parse(localStorage.getItem("volunteering")) || [];
    setSavedVolunteering(storedVolunteering);
    const storedInterests = JSON.parse(localStorage.getItem("interests")) || [];
    setSavedInterests(storedInterests);
    const storedWebsites = JSON.parse(localStorage.getItem("websites")) || [];
    setSavedWebsites(storedWebsites);

 const loadCustomSections = () => {
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

      return sectionsData;
    };

    const customSectionsData = loadCustomSections();
    setCustomSections(customSectionsData);
    console.log('📁 Loaded ONLY CURRENT custom sections:', customSectionsData);

    // Load saved section orders
    const savedLeftSectionOrder = localStorage.getItem("resume10LeftSectionOrder");
    if (savedLeftSectionOrder) {
      // 🔥 FIX: Left side-ல custom sections auto add ஆகாது - filter only
      const parsedOrder = JSON.parse(savedLeftSectionOrder);
      const filteredOrder = parsedOrder.filter(section => !section.startsWith('custom_'));
      setLeftSectionOrder(filteredOrder);
      console.log('🔄 Loaded left section order WITHOUT custom sections:', filteredOrder);
    } else {
      setLeftSectionOrder(defaultLeftSectionOrder);
    }

    const savedRightSectionOrder = localStorage.getItem("resume10RightSectionOrder");
    if (savedRightSectionOrder) {
      const parsedOrder = JSON.parse(savedRightSectionOrder);
      
      // Remove ALL old custom sections and add ONLY current sections
      const currentCustomSectionIds = Object.keys(customSectionsData).map(name => `custom_${name}`);
      const filteredOrder = parsedOrder.filter(section => !section.startsWith('custom_'));
      const allRightSections = [...filteredOrder, ...currentCustomSectionIds];
      
      setRightSectionOrder(allRightSections);
      console.log('🔄 Updated right section order with ONLY CURRENT custom sections:', allRightSections);
    } else {
      // For first time, add ONLY current custom sections to right side
      const currentCustomSectionIds = Object.keys(customSectionsData).map(name => `custom_${name}`);
      const updatedRightSectionOrder = [...defaultRightSectionOrder, ...currentCustomSectionIds];
      setRightSectionOrder(updatedRightSectionOrder);
      console.log('🆕 Initial right section order with ONLY CURRENT custom sections:', updatedRightSectionOrder);
    }
  }, []);

  // 🔥 UPDATED: Automatically add/remove custom sections based on current sections
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
        localStorage.setItem("resume10RightSectionOrder", JSON.stringify(newRightOrder));
        console.log('📝 Final right section order with ONLY CURRENT custom sections:', newRightOrder);
      }
      
      // 🔥 FIX: Left side-லிருந்து custom sections-ஐ remove செய்யவும்
      const currentLeftOrder = [...leftSectionOrder];
      const filteredLeftOrder = currentLeftOrder.filter(section => !section.startsWith('custom_'));
      if (JSON.stringify(filteredLeftOrder) !== JSON.stringify(currentLeftOrder)) {
        setLeftSectionOrder(filteredLeftOrder);
        localStorage.setItem("resume10LeftSectionOrder", JSON.stringify(filteredLeftOrder));
        console.log('🗑️ Removed custom sections from left side:', filteredLeftOrder);
      }
      
    } else if (userId && Object.keys(customSections).length === 0) {
      // If no current custom sections, remove all custom sections from both sides
      const currentRightOrder = [...rightSectionOrder];
      const filteredRightOrder = currentRightOrder.filter(section => !section.startsWith('custom_'));
      
      if (filteredRightOrder.length !== currentRightOrder.length) {
        setRightSectionOrder(filteredRightOrder);
        localStorage.setItem("resume10RightSectionOrder", JSON.stringify(filteredRightOrder));
        console.log('🗑️ Removed all custom sections from right side (no current sections)');
      }
      
      const currentLeftOrder = [...leftSectionOrder];
      const filteredLeftOrder = currentLeftOrder.filter(section => !section.startsWith('custom_'));
      if (filteredLeftOrder.length !== currentLeftOrder.length) {
        setLeftSectionOrder(filteredLeftOrder);
        localStorage.setItem("resume10LeftSectionOrder", JSON.stringify(filteredLeftOrder));
        console.log('🗑️ Removed all custom sections from left side (no current sections)');
      }
    }
  }, [customSections]);

  // Save section orders to localStorage whenever they change
  useEffect(() => {
    if (leftSectionOrder.length > 0) {
      localStorage.setItem("resume10LeftSectionOrder", JSON.stringify(leftSectionOrder));
    }
  }, [leftSectionOrder]);

  useEffect(() => {
    if (rightSectionOrder.length > 0) {
      localStorage.setItem("resume10RightSectionOrder", JSON.stringify(rightSectionOrder));
    }
  }, [rightSectionOrder]);

  const formatDate = (month, year) => {
    if (!month || !year) return "";
    return `${month} ${year}`;
  };

  // Drag and drop handlers - UPDATED for cross-side dragging
  const handleLeftDragStart = (e, index) => {
    const sectionData = {
      index,
      side: 'left',
      sectionId: leftSectionOrder[index]
    };
    e.dataTransfer.setData('text/plain', JSON.stringify(sectionData));
    setDraggedSection(sectionData);
    e.currentTarget.style.opacity = '0.5';
  };

  const handleRightDragStart = (e, index) => {
    const sectionData = {
      index,
      side: 'right',
      sectionId: rightSectionOrder[index]
    };
    e.dataTransfer.setData('text/plain', JSON.stringify(sectionData));
    setDraggedSection(sectionData);
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

    console.log('Left Drop:', { sourceSide, sourceIndex, targetIndex, sectionId });

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
      const removedSection = newRightSectionOrder.splice(sourceIndex, 1)[0];
      // Add to left side
      newLeftSectionOrder.splice(targetIndex, 0, removedSection);
      
      setLeftSectionOrder(newLeftSectionOrder);
      setRightSectionOrder(newRightSectionOrder);
    }

    setDragOverIndex(null);
    setDragOverSide(null);
    setDraggedSection(null);
    e.currentTarget.style.opacity = '1';
  };

  const handleRightDrop = (e, targetIndex) => {
    e.preventDefault();
    const data = JSON.parse(e.dataTransfer.getData('text/plain'));
    const sourceIndex = data.index;
    const sourceSide = data.side;
    const sectionId = data.sectionId;

    console.log('Right Drop:', { sourceSide, sourceIndex, targetIndex, sectionId });

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
      const removedSection = newLeftSectionOrder.splice(sourceIndex, 1)[0];
      // Add to right side
      newRightSectionOrder.splice(targetIndex, 0, removedSection);
      
      setLeftSectionOrder(newLeftSectionOrder);
      setRightSectionOrder(newRightSectionOrder);
    }

    setDragOverIndex(null);
    setDragOverSide(null);
    setDraggedSection(null);
    e.currentTarget.style.opacity = '1';
  };

  const handleDragEnd = (e) => {
    setDragOverIndex(null);
    setDragOverSide(null);
    setDraggedSection(null);
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

  // Render sidebar sections based on current order
  const renderSidebarSections = () => {
    return leftSectionOrder.map(sectionId => {
      switch (sectionId) {
        case 'contact':
          return (data.phone || data.email || data.city || data.website || savedWebsites.length > 0) ? (
            <div key="contact" className="sidebar-section">
              <Typography variant="subtitle1" sx={{ 
                fontWeight: "bold", 
                mt: sectionSpacing / 10,
                fontSize: `calc(${fontSize} * 1.1)`,
                fontFamily: font,
                fontStyle: fontStyle,
              }}>
                CONTACT
              </Typography>
              <Divider sx={{ 
                my: 1, 
                borderWidth: `${lineWeight}px`,
                backgroundColor: primaryColor,
              }} />
              <Box sx={{ fontSize: fontSize, mb: sectionSpacing / 10 }}>
                {data.email && (
                  <Typography sx={getTextStyle({ mb: paragraphSpacing / 10 })}>
                    📧 {data.email}
                  </Typography>
                )}
                {data.phone && (
                  <Typography sx={getTextStyle({ mb: paragraphSpacing / 10 })}>
                    📞 {data.phone}
                  </Typography>
                )}
                {data.city && (
                  <Typography sx={getTextStyle({ mb: paragraphSpacing / 10 })}>
                    📍 {data.city}
                  </Typography>
                )}
                {data.website && (
                  <Typography sx={getTextStyle({ mb: paragraphSpacing / 10 })}>
                    🌐 {data.website}
                  </Typography>
                )}
                {savedWebsites.map((website, index) => (
                  <Typography key={index} sx={getTextStyle({ mb: paragraphSpacing / 10 })}>
                    🌐 {website.url || website}
                  </Typography>
                ))}
              </Box>
            </div>
          ) : null;

        case 'education':
          return educationEntries.length > 0 ? (
            <div key="education" className="sidebar-section">
              <Typography variant="subtitle1" sx={{ 
                fontWeight: "bold", 
                mt: sectionSpacing / 10,
                fontSize: `calc(${fontSize} * 1.1)`,
                fontFamily: font,
                fontStyle: fontStyle,
              }}>
                EDUCATION
              </Typography>
              <Divider sx={{ 
                my: 1, 
                borderWidth: `${lineWeight}px`,
                backgroundColor: primaryColor,
              }} />
              {educationEntries.map((edu, index) => (
                <Typography key={index} variant="body2" sx={getTextStyle({ mb: paragraphSpacing / 10 })}>
                  {edu.degree} {edu.fieldOfStudy && `- ${edu.fieldOfStudy}`}<br />
                  {edu.schoolName}<br />
                  {formatDate(edu.gradMonth, edu.gradYear)}
                </Typography>
              ))}
            </div>
          ) : null;

        case 'skills':
          return (savedSkills.length > 0 || softwareSkills.length > 0) ? (
            <div key="skills" className="sidebar-section">
              <Typography variant="subtitle1" sx={{ 
                fontWeight: "bold", 
                mt: sectionSpacing / 10,
                fontSize: `calc(${fontSize} * 1.1)`,
                fontFamily: font,
                fontStyle: fontStyle,
              }}>
                SKILLS
              </Typography>
              <Divider sx={{ 
                my: 1, 
                borderWidth: `${lineWeight}px`,
                backgroundColor: primaryColor,
              }} />
              <ul style={{ 
                paddingLeft: "20px", 
                fontSize: fontSize,
                fontFamily: font,
                fontStyle: fontStyle,
                marginTop: paragraphSpacing / 10,
                marginBottom: paragraphSpacing / 10,
              }}>
                {savedSkills.map((skill, index) => (
                  <li key={index} style={globalFontStyle}>{skill.name} {skill.rating ? `(${skill.rating}%)` : ""}</li>
                ))}
                {softwareSkills.map((skill, index) => (
                  <li key={`software-${index}`} style={globalFontStyle}>
                    {skill.name} {skill.level ? `(${skill.level}%)` : ""}
                  </li>
                ))}
              </ul>
            </div>
          ) : null;

        case 'languages':
          return savedLanguages.length > 0 ? (
            <div key="languages" className="sidebar-section">
              <Typography variant="subtitle1" sx={{ 
                fontWeight: "bold", 
                mt: sectionSpacing / 10,
                fontSize: `calc(${fontSize} * 1.1)`,
                fontFamily: font,
                fontStyle: fontStyle,
              }}>
                LANGUAGES
              </Typography>
              <Divider sx={{ 
                my: 1, 
                borderWidth: `${lineWeight}px`,
                backgroundColor: primaryColor,
              }} />
              {savedLanguages.map((lang, index) => (
                <Typography key={index} variant="body2" sx={getTextStyle({ mb: paragraphSpacing / 10 })}>
                  {lang.name} {lang.level ? `(${lang.level})` : ""}
                </Typography>
              ))}
            </div>
          ) : null;

        case 'interests':
          return savedInterests.length > 0 ? (
            <div key="interests" className="sidebar-section">
              <Typography variant="subtitle1" sx={{ 
                fontWeight: "bold", 
                mt: sectionSpacing / 10,
                fontSize: `calc(${fontSize} * 1.1)`,
                fontFamily: font,
                fontStyle: fontStyle,
              }}>
                INTERESTS
              </Typography>
              <Divider sx={{ 
                my: 1, 
                borderWidth: `${lineWeight}px`,
                backgroundColor: primaryColor,
              }} />
              <ul style={{ 
                paddingLeft: "20px", 
                fontSize: fontSize,
                fontFamily: font,
                fontStyle: fontStyle,
                marginTop: paragraphSpacing / 10,
                marginBottom: paragraphSpacing / 10,
              }}>
                {savedInterests.map((interest, index) => (
                  <li key={index} style={globalFontStyle}>{interest}</li>
                ))}
              </ul>
            </div>
          ) : null;

        case 'additionalInfo':
          return savedAdditionalInfo.length > 0 ? (
            <div key="additionalInfo" className="sidebar-section">
              <Typography variant="subtitle1" sx={{ 
                fontWeight: "bold", 
                mt: sectionSpacing / 10,
                fontSize: `calc(${fontSize} * 1.1)`,
                fontFamily: font,
                fontStyle: fontStyle,
              }}>
                ADDITIONAL INFO
              </Typography>
              <Divider sx={{ 
                my: 1, 
                borderWidth: `${lineWeight}px`,
                backgroundColor: primaryColor,
              }} />
              <ul style={{ 
                paddingLeft: "20px", 
                fontSize: fontSize,
                fontFamily: font,
                fontStyle: fontStyle,
                marginTop: paragraphSpacing / 10,
                marginBottom: paragraphSpacing / 10,
              }}>
                {savedAdditionalInfo.map((info, index) => (
                  <li key={index} style={globalFontStyle}>{info}</li>
                ))}
              </ul>
            </div>
          ) : null;

        default:
          // Handle sections moved from right side
          return renderMainContentSectionsForSidebar(sectionId);
      }
    }).filter(Boolean);
  };

  // Render main content sections for sidebar (when moved from right to left)
  const renderMainContentSectionsForSidebar = (sectionId) => {
    switch (sectionId) {
      case 'profile':
        return (savedSummary || data.profile) ? (
          <div key="profile" className="sidebar-section">
            <Typography variant="subtitle1" sx={{ 
              fontWeight: "bold", 
              mt: sectionSpacing / 10,
              fontSize: `calc(${fontSize} * 1.1)`,
              fontFamily: font,
              fontStyle: fontStyle,
            }}>
              PROFILE
            </Typography>
            <Divider sx={{ 
              my: 1, 
              borderWidth: `${lineWeight}px`,
              backgroundColor: primaryColor,
            }} />
            <Typography variant="body2" sx={getTextStyle({ mb: sectionSpacing / 10 })}>
              {savedSummary || data.profile}
            </Typography>
          </div>
        ) : null;

      case 'workExperience':
        return workExperiences && workExperiences.length > 0 ? (
          <div key="workExperience" className="sidebar-section">
            <Typography variant="subtitle1" sx={{ 
              fontWeight: "bold", 
              mt: sectionSpacing / 10,
              fontSize: `calc(${fontSize} * 1.1)`,
              fontFamily: font,
              fontStyle: fontStyle,
            }}>
              WORK EXPERIENCE
            </Typography>
            <Divider sx={{ 
              my: 1, 
              borderWidth: `${lineWeight}px`,
              backgroundColor: primaryColor,
            }} />
            {workExperiences.map((work, index) => (
              <Box key={index} sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ 
                  fontFamily: font,
                  fontSize: fontSize,
                  fontWeight: "bold",
                  mb: paragraphSpacing / 20,
                  fontStyle: fontStyle,
                }}>
                  {work.jobTitle}
                </Typography>
                <Typography variant="body2" sx={getTextStyle({ mb: paragraphSpacing / 20 })}>
                  {work.employer}
                </Typography>
                <Typography variant="body2" sx={getTextStyle({ fontStyle: 'italic', mb: paragraphSpacing / 20 })}>
                  {formatDate(work.startMonth, work.startYear)} -{" "}
                  {work.current ? "Present" : formatDate(work.endMonth, work.endYear)}
                </Typography>
              </Box>
            ))}
          </div>
        ) : null;

      case 'certifications':
        return savedCertifications.length > 0 ? (
          <div key="certifications" className="sidebar-section">
            <Typography variant="subtitle1" sx={{ 
              fontWeight: "bold", 
              mt: sectionSpacing / 10,
              fontSize: `calc(${fontSize} * 1.1)`,
              fontFamily: font,
              fontStyle: fontStyle,
            }}>
              CERTIFICATIONS
            </Typography>
            <Divider sx={{ 
              my: 1, 
              borderWidth: `${lineWeight}px`,
              backgroundColor: primaryColor,
            }} />
            {savedCertifications.map((cert, index) => (
              <Box key={index} sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ 
                  fontFamily: font,
                  fontSize: fontSize,
                  fontWeight: "bold",
                  fontStyle: fontStyle,
                }}>
                  {cert.name}
                </Typography>
                <Typography variant="body2" sx={getTextStyle()}>
                  {cert.provider} {cert.year && `(${cert.year})`}
                </Typography>
              </Box>
            ))}
          </div>
        ) : null;

      case 'accomplishments':
        return savedAccomplishments.length > 0 ? (
          <div key="accomplishments" className="sidebar-section">
            <Typography variant="subtitle1" sx={{ 
              fontWeight: "bold", 
              mt: sectionSpacing / 10,
              fontSize: `calc(${fontSize} * 1.1)`,
              fontFamily: font,
              fontStyle: fontStyle,
            }}>
              ACCOMPLISHMENTS
            </Typography>
            <Divider sx={{ 
              my: 1, 
              borderWidth: `${lineWeight}px`,
              backgroundColor: primaryColor,
            }} />
            <ul style={{ 
              paddingLeft: "20px", 
              fontSize: fontSize,
              fontFamily: font,
              fontStyle: fontStyle,
              marginBottom: sectionSpacing / 10,
            }}>
              {savedAccomplishments.map((acc, index) => (
                <li key={index} style={globalFontStyle}>{acc}</li>
              ))}
            </ul>
          </div>
        ) : null;

      case 'volunteering':
        return savedVolunteering.length > 0 ? (
          <div key="volunteering" className="sidebar-section">
            <Typography variant="subtitle1" sx={{ 
              fontWeight: "bold", 
              mt: sectionSpacing / 10,
              fontSize: `calc(${fontSize} * 1.1)`,
              fontFamily: font,
              fontStyle: fontStyle,
            }}>
              VOLUNTEERING
            </Typography>
            <Divider sx={{ 
              my: 1, 
              borderWidth: `${lineWeight}px`,
              backgroundColor: primaryColor,
            }} />
            {savedVolunteering.map((vol, index) => (
              <Box key={index} sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ 
                  fontFamily: font,
                  fontSize: fontSize,
                  fontWeight: "bold",
                  fontStyle: fontStyle,
                }}>
                  {vol.subtopic}
                </Typography>
                <Typography variant="body2" sx={getTextStyle({ fontStyle: 'italic' })}>
                  {vol.fromDate} - {vol.toDate}
                </Typography>
              </Box>
            ))}
          </div>
        ) : null;

      case 'references':
        return savedReferences.length > 0 ? (
          <div key="references" className="sidebar-section">
            <Typography variant="subtitle1" sx={{ 
              fontWeight: "bold", 
              mt: sectionSpacing / 10,
              fontSize: `calc(${fontSize} * 1.1)`,
              fontFamily: font,
              fontStyle: fontStyle,
            }}>
              REFERENCES
            </Typography>
            <Divider sx={{ 
              my: 1, 
              borderWidth: `${lineWeight}px`,
              backgroundColor: primaryColor,
            }} />
            {savedReferences.map((ref, index) => (
              <Box key={index} sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ 
                  fontFamily: font, 
                  fontWeight: "bold", 
                  fontStyle: fontStyle,
                  fontSize: fontSize
                }}>
                  {ref.name || ref.referenceName || `Reference ${index + 1}`}
                </Typography>
                <Typography variant="body2" sx={getTextStyle()}>
                  {ref.position || ref.jobTitle} {ref.company && `at ${ref.company}`}
                </Typography>
              </Box>
            ))}
          </div>
        ) : null;

 default:
        // Handle custom sections in sidebar
        if (sectionId && sectionId.startsWith('custom_')) {
          const customSectionName = sectionId.replace('custom_', '');
          const items = customSections[customSectionName] || [];
          
          console.log(`🎯 Rendering custom section in sidebar: ${customSectionName}`, items);
          
          if (items && items.length > 0) {
            return (
              <div key={sectionId} className="sidebar-section">
                <Typography variant="subtitle1" sx={{ 
                  fontWeight: "bold", 
                  mt: sectionSpacing / 10,
                  fontSize: `calc(${fontSize} * 1.1)`,
                  fontFamily: font,
                  fontStyle: fontStyle,
                }}>
                  {customSectionName.toUpperCase()}
                </Typography>
                <Divider sx={{ 
                  my: 1, 
                  borderWidth: `${lineWeight}px`,
                  backgroundColor: primaryColor,
                }} />
                <ul style={{ 
                  paddingLeft: "20px", 
                  fontSize: fontSize,
                  fontFamily: font,
                  fontStyle: fontStyle,
                  marginTop: paragraphSpacing / 10,
                  marginBottom: paragraphSpacing / 10,
                }}>
                  {items.map((item, i) => (
                    <li key={i} style={globalFontStyle}>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            );
          } else {
            console.log(`⚠️ No items found for custom section in sidebar: ${customSectionName}`);
            return null;
          }
        }
        return null;

    }
  };

  // Render main content sections based on current order
  const renderMainContentSections = () => {
    return rightSectionOrder.map(sectionId => {
      switch (sectionId) {
        case 'profile':
          return (savedSummary || data.profile) ? (
            <div key="profile" className="main-section">
              <Typography variant="h6" sx={{ 
                fontWeight: "bold", 
                mb: 1,
                fontSize: headingSize,
                fontFamily: font,
                fontStyle: fontStyle,
              }}>
                About Me
              </Typography>
              <Typography variant="body2" sx={{ 
                mb: sectionSpacing / 10,
                textIndent: `${paragraphIndent}px`,
                fontFamily: font,
                fontStyle: fontStyle,
              }}>
                {savedSummary || data.profile}
              </Typography>
            </div>
          ) : null;

        case 'workExperience':
          return workExperiences && workExperiences.length > 0 ? (
            <div key="workExperience" className="main-section">
              <Typography variant="h6" sx={{ 
                fontWeight: "bold", 
                mb: 1,
                fontSize: headingSize,
                fontFamily: font,
                fontStyle: fontStyle,
              }}>
                Work Experience
              </Typography>
              <Divider sx={{ 
                mb: 2, 
                borderWidth: `${lineWeight}px`,
                backgroundColor: primaryColor,
              }} />

              {workExperiences.map((work, index) => (
                <Box key={index}>
                  <Typography variant="subtitle2" sx={{ 
                    fontFamily: font,
                    fontSize: `calc(${fontSize} * 1.05)`,
                    mb: paragraphSpacing / 10,
                    fontStyle: fontStyle,
                  }}>
                    {formatDate(work.startMonth, work.startYear)} -{" "}
                    {work.current ? "Present" : formatDate(work.endMonth, work.endYear)} | {work.employer} | {work.jobTitle}
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
            </div>
          ) : null;

        case 'certifications':
          return savedCertifications.length > 0 ? (
            <div key="certifications" className="main-section">
              <Typography variant="h6" sx={{ 
                fontWeight: "bold", 
                mt: sectionSpacing / 10, 
                mb: 1,
                fontSize: headingSize,
                fontFamily: font,
                fontStyle: fontStyle,
              }}>
                Certifications
              </Typography>
              <Divider sx={{ 
                mb: 2, 
                borderWidth: `${lineWeight}px`,
                backgroundColor: primaryColor,
              }} />
              {savedCertifications.map((cert, index) => (
                <Box key={index} sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" sx={{ 
                    fontFamily: font,
                    fontSize: `calc(${fontSize} * 1.05)`,
                    fontWeight: "bold",
                    fontStyle: fontStyle,
                  }}>
                    {cert.name}
                  </Typography>
                  <Typography variant="body2" sx={getTextStyle()}>
                    {cert.provider} {cert.year && `(${cert.year})`}
                  </Typography>
                </Box>
              ))}
            </div>
          ) : null;

        case 'accomplishments':
          return savedAccomplishments.length > 0 ? (
            <div key="accomplishments" className="main-section">
              <Typography variant="h6" sx={{ 
                fontWeight: "bold", 
                mt: sectionSpacing / 10, 
                mb: 1,
                fontSize: headingSize,
                fontFamily: font,
                fontStyle: fontStyle,
              }}>
                Accomplishments
              </Typography>
              <Divider sx={{ 
                mb: 2, 
                borderWidth: `${lineWeight}px`,
                backgroundColor: primaryColor,
              }} />
              <ul style={{ 
                paddingLeft: "20px", 
                fontSize: fontSize,
                fontFamily: font,
                fontStyle: fontStyle,
                marginBottom: sectionSpacing / 10,
              }}>
                {savedAccomplishments.map((acc, index) => (
                  <li key={index} style={globalFontStyle}>{acc}</li>
                ))}
              </ul>
            </div>
          ) : null;

        case 'volunteering':
          return savedVolunteering.length > 0 ? (
            <div key="volunteering" className="main-section">
              <Typography variant="h6" sx={{ 
                fontWeight: "bold", 
                mt: sectionSpacing / 10, 
                mb: 1,
                fontSize: headingSize,
                fontFamily: font,
                fontStyle: fontStyle,
              }}>
                Volunteering
              </Typography>
              <Divider sx={{ 
                mb: 2, 
                borderWidth: `${lineWeight}px`,
                backgroundColor: primaryColor,
              }} />
              {savedVolunteering.map((vol, index) => (
                <Box key={index} sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" sx={{ 
                    fontFamily: font,
                    fontSize: `calc(${fontSize} * 1.05)`,
                    fontWeight: "bold",
                    fontStyle: fontStyle,
                  }}>
                    {vol.subtopic}
                  </Typography>
                  <Typography variant="body2" sx={{ fontFamily: font, fontStyle: 'italic' }}>
                    {vol.fromDate} - {vol.toDate}
                  </Typography>
                  <Typography variant="body2" sx={getTextStyle()}>
                    {vol.content}
                  </Typography>
                </Box>
              ))}
            </div>
          ) : null;

        case 'references':
          return savedReferences.length > 0 ? (
            <div key="references" className="main-section">
              <Typography variant="h6" sx={{ 
                fontWeight: "bold", 
                mt: sectionSpacing / 10, 
                mb: 1,
                fontSize: headingSize,
                fontFamily: font,
                fontStyle: fontStyle,
              }}>
                References
              </Typography>
              <Divider sx={{ 
                mb: 2, 
                borderWidth: `${lineWeight}px`,
                backgroundColor: primaryColor,
              }} />
              <Box sx={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap" }}>
                {savedReferences.map((ref, index) => (
                  <Box key={index} sx={{ mb: 2, minWidth: "45%" }}>
                    <Typography variant="subtitle2" sx={{ 
                      fontFamily: font, 
                      fontWeight: "bold", 
                      fontStyle: fontStyle,
                      fontSize: `calc(${fontSize} * 1.05)`
                    }}>
                      {ref.name || ref.referenceName || `Reference ${index + 1}`}
                    </Typography>
                    <Typography variant="body2" sx={getTextStyle()}>
                      {ref.position || ref.jobTitle} {ref.company && `at ${ref.company}`}
                    </Typography>
                    {ref.phone && (
                      <Typography variant="body2" sx={getTextStyle()}>
                        📞 {ref.phone}
                      </Typography>
                    )}
                    {ref.email && (
                      <Typography variant="body2" sx={getTextStyle()}>
                        📧 {ref.email}
                      </Typography>
                    )}
                    {ref.relationship && (
                      <Typography variant="body2" sx={getTextStyle({ fontStyle: 'italic' })}>
                        Relationship: {ref.relationship}
                      </Typography>
                    )}
                  </Box>
                ))}
              </Box>
            </div>
          ) : null;
case 'website':
  return (data.website || savedWebsites.length > 0) ? (
    <div key="website" className="sidebar-section">
      <Typography variant="subtitle1" sx={{ 
        fontWeight: "bold", 
        mt: sectionSpacing / 10,
        fontSize: `calc(${fontSize} * 1.1)`,
        fontFamily: font,
        fontStyle: fontStyle,
      }}>
        WEBSITE
      </Typography>
      <Divider sx={{ 
        my: 1, 
        borderWidth: `${lineWeight}px`,
        backgroundColor: primaryColor,
      }} />
      <Box sx={{ fontSize: fontSize, mb: sectionSpacing / 10 }}>
        {data.website && (
          <Typography sx={getTextStyle({ mb: paragraphSpacing / 10 })}>
            🌐 {data.website}
          </Typography>
        )}
        {savedWebsites.map((website, index) => (
          <Typography key={index} sx={getTextStyle({ mb: paragraphSpacing / 10 })}>
            🌐 {website.url || website}
          </Typography>
        ))}
      </Box>
    </div>
  ) : null;
        default:
          // Handle sections moved from left side
          return renderSidebarSectionsForMainContent(sectionId);
      }
    }).filter(Boolean);
  };

  // Render sidebar sections for main content (when moved from left to right)
  const renderSidebarSectionsForMainContent = (sectionId) => {
    switch (sectionId) {
      case 'contact':
        return (data.phone || data.email || data.city || data.website || savedWebsites.length > 0) ? (
          <div key="contact" className="main-section">
            <Typography variant="h6" sx={{ 
              fontWeight: "bold", 
              mb: 1,
              fontSize: headingSize,
              fontFamily: font,
              fontStyle: fontStyle,
            }}>
              Contact
            </Typography>
            <Divider sx={{ 
              mb: 2, 
              borderWidth: `${lineWeight}px`,
              backgroundColor: primaryColor,
            }} />
            <Box sx={{ fontSize: fontSize, mb: sectionSpacing / 10 }}>
              {data.email && (
                <Typography sx={getTextStyle({ mb: paragraphSpacing / 10 })}>
                  📧 {data.email}
                </Typography>
              )}
              {data.phone && (
                <Typography sx={getTextStyle({ mb: paragraphSpacing / 10 })}>
                  📞 {data.phone}
                </Typography>
              )}
              {data.city && (
                <Typography sx={getTextStyle({ mb: paragraphSpacing / 10 })}>
                  📍 {data.city}
                </Typography>
              )}
              {data.website && (
                <Typography sx={getTextStyle({ mb: paragraphSpacing / 10 })}>
                  🌐 {data.website}
                </Typography>
              )}
              {savedWebsites.map((website, index) => (
                <Typography key={index} sx={getTextStyle({ mb: paragraphSpacing / 10 })}>
                  🌐 {website.url || website}
                </Typography>
              ))}
            </Box>
          </div>
        ) : null;

      case 'education':
        return educationEntries.length > 0 ? (
          <div key="education" className="main-section">
            <Typography variant="h6" sx={{ 
              fontWeight: "bold", 
              mb: 1,
              fontSize: headingSize,
              fontFamily: font,
              fontStyle: fontStyle,
            }}>
              Education
            </Typography>
            <Divider sx={{ 
              mb: 2, 
              borderWidth: `${lineWeight}px`,
              backgroundColor: primaryColor,
            }} />
            {educationEntries.map((edu, index) => (
              <Box key={index} sx={{ mb: 2 }}>
                <Typography variant="subtitle2" sx={{ 
                  fontFamily: font,
                  fontSize: `calc(${fontSize} * 1.05)`,
                  fontWeight: "bold",
                  fontStyle: fontStyle,
                }}>
                  {edu.degree} {edu.fieldOfStudy && `- ${edu.fieldOfStudy}`}
                </Typography>
                <Typography variant="body2" sx={getTextStyle()}>
                  {edu.schoolName}
                </Typography>
                <Typography variant="body2" sx={getTextStyle({ fontStyle: 'italic' })}>
                  {formatDate(edu.gradMonth, edu.gradYear)}
                </Typography>
              </Box>
            ))}
          </div>
        ) : null;

      case 'skills':
        return (savedSkills.length > 0 || softwareSkills.length > 0) ? (
          <div key="skills" className="main-section">
            <Typography variant="h6" sx={{ 
              fontWeight: "bold", 
              mb: 1,
              fontSize: headingSize,
              fontFamily: font,
              fontStyle: fontStyle,
            }}>
              Skills
            </Typography>
            <Divider sx={{ 
              mb: 2, 
              borderWidth: `${lineWeight}px`,
              backgroundColor: primaryColor,
            }} />
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {savedSkills.map((skill, index) => (
                <Paper key={index} elevation={1} sx={{ p: 1, bgcolor: '#f5f5f5' }}>
                  <Typography variant="body2" sx={getTextStyle()}>
                    {skill.name} {skill.rating ? `(${skill.rating}%)` : ""}
                  </Typography>
                </Paper>
              ))}
              {softwareSkills.map((skill, index) => (
                <Paper key={`software-${index}`} elevation={1} sx={{ p: 1, bgcolor: '#f5f5f5' }}>
                  <Typography variant="body2" sx={getTextStyle()}>
                    {skill.name} {skill.level ? `(${skill.level}%)` : ""}
                  </Typography>
                </Paper>
              ))}
            </Box>
          </div>
        ) : null;

      case 'languages':
        return savedLanguages.length > 0 ? (
          <div key="languages" className="main-section">
            <Typography variant="h6" sx={{ 
              fontWeight: "bold", 
              mb: 1,
              fontSize: headingSize,
              fontFamily: font,
              fontStyle: fontStyle,
            }}>
              Languages
            </Typography>
            <Divider sx={{ 
              mb: 2, 
              borderWidth: `${lineWeight}px`,
              backgroundColor: primaryColor,
            }} />
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {savedLanguages.map((lang, index) => (
                <Paper key={index} elevation={1} sx={{ p: 1, bgcolor: '#f5f5f5' }}>
                  <Typography variant="body2" sx={getTextStyle()}>
                    {lang.name} {lang.level ? `(${lang.level})` : ""}
                  </Typography>
                </Paper>
              ))}
            </Box>
          </div>
        ) : null;

      case 'interests':
        return savedInterests.length > 0 ? (
          <div key="interests" className="main-section">
            <Typography variant="h6" sx={{ 
              fontWeight: "bold", 
              mb: 1,
              fontSize: headingSize,
              fontFamily: font,
              fontStyle: fontStyle,
            }}>
              Interests
            </Typography>
            <Divider sx={{ 
              mb: 2, 
              borderWidth: `${lineWeight}px`,
              backgroundColor: primaryColor,
            }} />
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {savedInterests.map((interest, index) => (
                <Paper key={index} elevation={1} sx={{ p: 1, bgcolor: '#f5f5f5' }}>
                  <Typography variant="body2" sx={getTextStyle()}>
                    {interest}
                  </Typography>
                </Paper>
              ))}
            </Box>
          </div>
        ) : null;
case 'website':
  return (data.website || savedWebsites.length > 0) ? (
    <div key="website" className="main-section">
      <Typography variant="h6" sx={{ 
        fontWeight: "bold", 
        mb: 1,
        fontSize: headingSize,
        fontFamily: font,
        fontStyle: fontStyle,
      }}>
        Website
      </Typography>
      <Divider sx={{ 
        mb: 2, 
        borderWidth: `${lineWeight}px`,
        backgroundColor: primaryColor,
      }} />
      <Box sx={{ fontSize: fontSize, mb: sectionSpacing / 10 }}>
        {data.website && (
          <Typography sx={getTextStyle({ mb: paragraphSpacing / 10 })}>
            🌐 {data.website}
          </Typography>
        )}
        {savedWebsites.map((website, index) => (
          <Typography key={index} sx={getTextStyle({ mb: paragraphSpacing / 10 })}>
            🌐 {website.url || website}
          </Typography>
        ))}
      </Box>
    </div>
  ) : null;
      case 'additionalInfo':
        return savedAdditionalInfo.length > 0 ? (
          <div key="additionalInfo" className="main-section">
            <Typography variant="h6" sx={{ 
              fontWeight: "bold", 
              mb: 1,
              fontSize: headingSize,
              fontFamily: font,
              fontStyle: fontStyle,
            }}>
              Additional Information
            </Typography>
            <Divider sx={{ 
              mb: 2, 
              borderWidth: `${lineWeight}px`,
              backgroundColor: primaryColor,
            }} />
            <ul style={{ 
              paddingLeft: "20px", 
              fontSize: fontSize,
              fontFamily: font,
              fontStyle: fontStyle,
              marginBottom: sectionSpacing / 10,
            }}>
              {savedAdditionalInfo.map((info, index) => (
                <li key={index} style={globalFontStyle}>{info}</li>
              ))}
            </ul>
          </div>
        ) : null;
default:
  // Handle custom sections in main content
 if (sectionId && sectionId.startsWith('custom_')) {
          const customSectionName = sectionId.replace('custom_', '');
          const items = customSections[customSectionName] || [];
          
          console.log(`🎯 Rendering custom section in main content: ${customSectionName}`, items);
          
          if (items && items.length > 0) {
            return (
              <div key={sectionId} className="main-section">
                <Typography variant="h6" sx={{ 
                  fontWeight: "bold", 
                  mb: 1,
                  fontSize: headingSize,
                  fontFamily: font,
                  fontStyle: fontStyle,
                }}>
                  {customSectionName.toUpperCase()}
                </Typography>
                <Divider sx={{ 
                  mb: 2, 
                  borderWidth: `${lineWeight}px`,
                  backgroundColor: primaryColor,
                }} />
                <ul style={{ 
                  paddingLeft: "20px", 
                  fontSize: fontSize,
                  fontFamily: font,
                  fontStyle: fontStyle,
                  marginBottom: sectionSpacing / 10,
                }}>
                  {items.map((item, i) => (
                    <li key={i} style={globalFontStyle}>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            );
          } else {
            console.log(`⚠️ No items found for custom section in main content: ${customSectionName}`);
            return null;
          }
        }
        return null;

    }
  };

  const getSectionTitle = (sectionId) => {
    const titles = {
      'contact': 'Contact',
      'education': 'Education',
      'skills': 'Skills',
      'languages': 'Languages',
      'interests': 'Interests',
      'additionalInfo': 'Additional Information',
      'profile': 'Profile',
      'workExperience': 'Work Experience',
      'certifications': 'Certifications',
      'accomplishments': 'Accomplishments',
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
          {side === 'left' ? 'Left Sidebar' : 'Right Content'} Sections
          <Typography variant="body2" color="textSecondary" sx={{ ml: 1 }}>
            ({sections.length} sections)
          </Typography>
        </Typography>
        <Box 
          sx={{ 
            maxHeight: 400, 
            overflow: 'auto', 
            border: '1px solid #e0e0e0', 
            borderRadius: 1, 
            p: 1,
            minHeight: 200,
            backgroundColor: '#fafafa'
          }}
          onDragOver={(e) => {
            e.preventDefault();
            if (draggedSection && draggedSection.side !== side) {
              setDragOverSide(side);
            }
          }}
          onDragLeave={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget)) {
              setDragOverSide(null);
            }
          }}
          onDrop={(e) => {
            e.preventDefault();
            if (draggedSection && draggedSection.side !== side) {
              // Move section to this side at the end
              if (side === 'left') {
                const newLeftSectionOrder = [...leftSectionOrder];
                const newRightSectionOrder = [...rightSectionOrder];
                
                // Remove from right side
                const removedSection = newRightSectionOrder.splice(draggedSection.index, 1)[0];
                // Add to left side at the end
                newLeftSectionOrder.push(removedSection);
                
                setLeftSectionOrder(newLeftSectionOrder);
                setRightSectionOrder(newRightSectionOrder);
              } else {
                const newLeftSectionOrder = [...leftSectionOrder];
                const newRightSectionOrder = [...rightSectionOrder];
                
                // Remove from left side
                const removedSection = newLeftSectionOrder.splice(draggedSection.index, 1)[0];
                // Add to right side at the end
                newRightSectionOrder.push(removedSection);
                
                setLeftSectionOrder(newLeftSectionOrder);
                setRightSectionOrder(newRightSectionOrder);
              }
              setDraggedSection(null);
              setDragOverSide(null);
            }
          }}
        >
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
                  backgroundColor: dragOverIndex === index && dragOverSide === side ? '#e3f2fd' : 
                                 draggedSection?.sectionId === sectionId ? '#fff3e0' : 'white',
                  border: dragOverIndex === index && dragOverSide === side ? '2px dashed #2196f3' : '1px solid #e0e0e0',
                  boxShadow: (dragOverIndex === index && dragOverSide === side) || draggedSection?.sectionId === sectionId ? 2 : 1,
                  cursor: 'grab',
                  '&:active': {
                    cursor: 'grabbing',
                  },
                  transition: 'all 0.2s ease',
                  transform: draggedSection?.sectionId === sectionId ? 'scale(0.95)' : 'scale(1)',
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
            <Paper
              sx={{
                p: 4,
                textAlign: 'center',
                backgroundColor: dragOverSide === side ? '#e3f2fd' : 'white',
                border: dragOverSide === side ? '2px dashed #2196f3' : '1px dashed #e0e0e0',
              }}
              onDragOver={(e) => handleDragOver(e, 0, side)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => side === 'left' ? handleLeftDrop(e, 0) : handleRightDrop(e, 0)}
            >
              <Typography variant="body2" color="textSecondary">
                {dragOverSide === side ? 'Drop section here' : 'No sections. Drag sections from the other side.'}
              </Typography>
            </Paper>
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

  // Save download history function
  const saveDownloadHistory = async (format, fileName, fileSize) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const downloadData = {
        templateId: 10, // ResumeTemplate10 template ID
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
    const headerHeight = 120;
    const availableHeight = pageHeightInPx - (2 * topBottomMargin) - headerHeight;

    const sidebarContent = sidebarContentRef.current;
    const sections = Array.from(sidebarContent.querySelectorAll('.sidebar-section'));
    
    let newSidebarPages = [];
    let currentPageSections = [];
    let currentHeight = 0;
    
    sections.forEach((section, index) => {
      const sectionHeight = section.offsetHeight;
      
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
      
      if (index === sections.length - 1 && currentPageSections.length > 0) {
        newSidebarPages.push([...currentPageSections]);
      }
    });
    
    if (newSidebarPages.length === 0) {
      newSidebarPages.push([]);
    }
    
    setSidebarPages(newSidebarPages);
  }, [page.height, topBottomMargin, leftSectionOrder]);

  // Pagination for main content (right side)
  const paginateMainContent = useCallback(() => {
    if (!mainContentRef.current) return;

    const pageHeightInPx = parseFloat(page.height.replace('mm', '')) * 3.78;
    const headerHeight = 120;
    const availableHeight = pageHeightInPx - (2 * topBottomMargin) - headerHeight;

    const mainContent = mainContentRef.current;
    const sections = Array.from(mainContent.querySelectorAll('.main-section'));
    
    let newPages = [];
    let currentPageSections = [];
    let currentHeight = 0;
    
    sections.forEach((section, index) => {
      const sectionHeight = section.offsetHeight;
      
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
      
      if (index === sections.length - 1 && currentPageSections.length > 0) {
        newPages.push([...currentPageSections]);
      }
    });
    
    if (newPages.length === 0) {
      newPages.push([]);
    }
    
    setPages(newPages);
  }, [page.height, topBottomMargin, rightSectionOrder]);

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
        bgcolor: "#f0eae5",
        p: sideMargins / 5,
        fontFamily: font,
        fontSize: fontSize,
        fontStyle: fontStyle,
        "@media print": {
          width: "30%",
          display: "inline-block",
          verticalAlign: "top",
          fontFamily: font,
          fontSize: fontSize,
          fontStyle: fontStyle,
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

  // Render header section
  const renderHeader = () => (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        bgcolor: primaryColor,
        color: "white",
        p: sideMargins / 5,
        fontFamily: font,
        "@media print": {
          bgcolor: primaryColor,
          WebkitPrintColorAdjust: "exact",
          printColorAdjust: "exact",
          fontFamily: font,
        }
      }}
    >
      <Avatar
        src={photo || "https://via.placeholder.com/150"}
        alt="Profile"
        sx={{
          width: 90,
          height: 90,
          border: `${lineWeight * 3}px solid white`,
          mr: 2,
        }}
      />
      <Box>
        <Typography variant="h6" sx={{ 
          fontWeight: "bold",
          fontSize: headingSize,
          fontFamily: font,
          fontStyle: fontStyle,
        }}>
          {data.firstName} {data.lastName}
        </Typography>
        <Typography variant="body2" sx={getTextStyle()}>
          {data.currentPosition}
        </Typography>
      </Box>
    </Box>
  );

  // Calculate total pages needed
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
      <Box id="resume10-container">
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
              borderRadius: 2,
              overflow: "hidden",
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
                borderRadius: 0,
              },
              // Show all pages when exporting, only current page when viewing
              display: exporting ? 'flex' : (pageIndex === currentPage ? 'flex' : 'none'),
              '@media print': { display: 'flex' }
            }}
          >
            {/* Header Section - Show ONLY on first page */}
            {pageIndex === 0 && renderHeader()}

            <Box sx={{ display: "flex", height: "100%", flex: 1 }}>
              {/* Left Sidebar */}
              {sidebarPages[pageIndex] ? renderSidebar(pageIndex) : <Box sx={{ width: "30%", bgcolor: "#f0eae5" }} />}
              
              {/* Right Content Section */}
              <Box
                sx={{
                  flex: 1,
                  p: sideMargins / 5,
                  margin: `${topBottomMargin / 10}px 0`,
                  fontFamily: font,
                  fontSize: fontSize,
                  fontStyle: fontStyle,
                  "@media print": {
                    display: "inline-block",
                    verticalAlign: "top",
                    fontFamily: font,
                    fontSize: fontSize,
                    fontStyle: fontStyle,
                  },
                  // Add top margin to content on subsequent pages when header is not present
                  marginTop: pageIndex > 0 ? `${topBottomMargin / 5}px` : `${topBottomMargin / 10}px`,
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

// Meta information for Resume10
export const resumeMeta = {
  hasPhoto: true,
  columns: 2,
};

export default ResumeTemplate10;