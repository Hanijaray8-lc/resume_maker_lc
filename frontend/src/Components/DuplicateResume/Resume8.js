import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Box,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Avatar,
  Button,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from "@mui/material";
import { ChevronLeft, ChevronRight,  DragIndicator, Reorder } from "@mui/icons-material";

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

// Separate section orders for left and right sides
const defaultLeftSectionOrder = [
  'photo',
  'nameTitle',
  'contact',
  'skills',
  'languages',
  'interests',
  'references'
];

const defaultRightSectionOrder = [
  'profile',
  'career',
  'education',
  'certifications',
  'accomplishments',
  'softwareSkills',
  'volunteering',
  'websites',
  'additionalInfo'
];

const ResumeTemplate = ({
  theme = { primary: "#f4b400", dark: "#000" },
  font = "Arial",
  fontSize = "14px",
  fontStyle = "normal",
  headingSize = "24px",
  sectionSpacing = 10,
  paragraphSpacing = 10,
  lineSpacing = 20,
  topBottomMargin = 20,
  sideMargins = 20,
  paragraphIndent = 0,
  lineWeight = 1,
  pageSize = "A4",
  photo = "",
  formData = {},
  exporting = false,
  enableDragDrop = true,
}) => {
  const [themeColor, setThemeColor] = useState(
    typeof theme === "string" ? { primary: theme, dark: "#000" } : theme
  );
  
  // State for all data from localStorage
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
  const [localFormData, setLocalFormData] = useState({});

  // Pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const [pages, setPages] = useState([]);
  const [sidebarPages, setSidebarPages] = useState([]);
  const mainContentRef = useRef(null);
  const rightContentRef = useRef(null);
  const sidebarContentRef = useRef(null);

  // State for section ordering - separate for left and right
  const [leftSectionOrder, setLeftSectionOrder] = useState(defaultLeftSectionOrder);
  const [rightSectionOrder, setRightSectionOrder] = useState(defaultRightSectionOrder);
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const [dragOverSide, setDragOverSide] = useState(null);
  
  // State for arrange sections dialog
  const [arrangeDialogOpen, setArrangeDialogOpen] = useState(false);

  const page = pageSizeMap[pageSize] || pageSizeMap.A4;

  // Global font style for all text - CORRECTED IMPLEMENTATION
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

  // Get section spacing with proper units
  const getSectionSpacing = () => {
    return sectionSpacing;
  };

  // Get paragraph spacing with proper units
  const getParagraphSpacing = () => {
    return paragraphSpacing;
  };

  useEffect(() => {
    setThemeColor(
      typeof theme === "string" ? { primary: theme, dark: "#000" } : theme
    );
  }, [theme]);

  useEffect(() => {
    // Load all data from localStorage
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

    const storedWorkExperiences = JSON.parse(localStorage.getItem("workExperiences")) || [];
    setWorkExperiences(storedWorkExperiences);

    const storedFormData = JSON.parse(localStorage.getItem("formData")) || {};
    setLocalFormData(storedFormData);

    
  
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
  const savedLeftSectionOrder = localStorage.getItem("resumeTemplateLeftSectionOrder");
  if (savedLeftSectionOrder) {
    // 🔥 FIX: Left side-ல custom sections auto add ஆகாது - filter only
    const parsedOrder = JSON.parse(savedLeftSectionOrder);
    const filteredOrder = parsedOrder.filter(section => !section.startsWith('custom_'));
    setLeftSectionOrder(filteredOrder);
    console.log('🔄 Loaded left section order WITHOUT custom sections:', filteredOrder);
  } else {
    setLeftSectionOrder(defaultLeftSectionOrder);
  }

  const savedRightSectionOrder = localStorage.getItem("resumeTemplateRightSectionOrder");
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
      localStorage.setItem("resumeTemplateRightSectionOrder", JSON.stringify(newRightOrder));
      console.log('📝 Final right section order with ONLY CURRENT custom sections:', newRightOrder);
    }
    
    // 🔥 FIX: Left side-லிருந்து custom sections-ஐ remove செய்யவும்
    const currentLeftOrder = [...leftSectionOrder];
    const filteredLeftOrder = currentLeftOrder.filter(section => !section.startsWith('custom_'));
    if (JSON.stringify(filteredLeftOrder) !== JSON.stringify(currentLeftOrder)) {
      setLeftSectionOrder(filteredLeftOrder);
      localStorage.setItem("resumeTemplateLeftSectionOrder", JSON.stringify(filteredLeftOrder));
      console.log('🗑️ Removed custom sections from left side:', filteredLeftOrder);
    }
    
  } else if (userId && Object.keys(customSections).length === 0) {
    // If no current custom sections, remove all custom sections from both sides
    const currentRightOrder = [...rightSectionOrder];
    const filteredRightOrder = currentRightOrder.filter(section => !section.startsWith('custom_'));
    
    if (filteredRightOrder.length !== currentRightOrder.length) {
      setRightSectionOrder(filteredRightOrder);
      localStorage.setItem("resumeTemplateRightSectionOrder", JSON.stringify(filteredRightOrder));
      console.log('🗑️ Removed all custom sections from right side (no current sections)');
    }
    
    const currentLeftOrder = [...leftSectionOrder];
    const filteredLeftOrder = currentLeftOrder.filter(section => !section.startsWith('custom_'));
    if (filteredLeftOrder.length !== currentLeftOrder.length) {
      setLeftSectionOrder(filteredLeftOrder);
      localStorage.setItem("resumeTemplateLeftSectionOrder", JSON.stringify(filteredLeftOrder));
      console.log('🗑️ Removed all custom sections from left side (no current sections)');
    }
  }
}, [customSections]);


   


  // Save section orders to localStorage whenever they change
  useEffect(() => {
    if (leftSectionOrder.length > 0) {
      localStorage.setItem("resumeTemplateLeftSectionOrder", JSON.stringify(leftSectionOrder));
    }
  }, [leftSectionOrder]);

  useEffect(() => {
    if (rightSectionOrder.length > 0) {
      localStorage.setItem("resumeTemplateRightSectionOrder", JSON.stringify(rightSectionOrder));
    }
  }, [rightSectionOrder]);

  const defaultData = {
    firstName: "Alan",
    lastName: "Brown",
    currentPosition: "Job Title",
    phone: "+123-456-7890",
    email: "hello@email.com",
    city: "123, Main Street, Birmingham",
    website: "linkedin.com/in/alanbrown",
    profile: "Write a short brief introduction of just a few short paragraphs explaining your key skills, career background, and what you're looking for. Keep it professional and simple.",
  };

  const data = { 
    ...defaultData, 
    ...localFormData, 
    ...formData 
  };

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
  // Reset to default + current custom sections
  const currentCustomSectionIds = Object.keys(customSections).map(name => `custom_${name}`);
  const updatedRightSectionOrder = [...defaultRightSectionOrder, ...currentCustomSectionIds];
  setRightSectionOrder(updatedRightSectionOrder);
};

const resetAllSectionOrder = () => {
  setLeftSectionOrder(defaultLeftSectionOrder);
  
  // Reset right side with current custom sections
  const currentCustomSectionIds = Object.keys(customSections).map(name => `custom_${name}`);
  const updatedRightSectionOrder = [...defaultRightSectionOrder, ...currentCustomSectionIds];
  setRightSectionOrder(updatedRightSectionOrder);
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
      'nameTitle': 'Name & Title',
      'contact': 'Contact',
      'skills': 'Professional Skills',
      'languages': 'Languages',
      'interests': 'Interests',
      'references': 'References',
      'profile': 'Profile',
      'career': 'Career/Work Experience',
      'education': 'Education',
      'certifications': 'Certifications',
      'accomplishments': 'Accomplishments',
      'softwareSkills': 'Software Skills',
      'volunteering': 'Volunteering',
      'websites': 'Websites & Profiles',
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

  // Render sidebar sections based on current order
  const renderSidebarSections = () => {
    return leftSectionOrder.map(sectionId => {
      switch (sectionId) {
        case 'photo':
          return resumeMeta.hasPhoto ? (
            <div key="photo" className="sidebar-section">
              <Box textAlign="center" mb={3}>
                <Avatar
                  src={photo || "/profile.jpg"}
                  alt="profile"
                  sx={{ width: 100, height: 100, mx: "auto", mb: 2 }}
                />
              </Box>
            </div>
          ) : null;

        case 'nameTitle':
          return (
            <div key="nameTitle" className="sidebar-section">
              <Typography
                variant="h4"
                fontWeight="bold"
                sx={{ 
                  fontSize: headingSize,
                  fontFamily: font,
                  fontStyle: fontStyle,
                  lineHeight: `${lineSpacing}px`,
                }}
              >
                {data.firstName.toUpperCase()}{" "}
                {data.lastName.toUpperCase()}
              </Typography>

              <Typography
                variant="subtitle1"
                sx={{
                  mt: 1,
                  bgcolor: "black",
                  color: "white",
                  textAlign: "center",
                  p: 1,
                  fontFamily: font,
                  fontSize: fontSize,
                  fontStyle: fontStyle,
                  lineHeight: `${lineSpacing}px`,
                }}
              >
                {data.currentPosition.toUpperCase()}
              </Typography>
            </div>
          );

        case 'contact':
          return (
            <div key="contact" className="sidebar-section">
              <Box sx={{ mt: getSectionSpacing() }}>
                <Typography variant="h6" sx={getTextStyle({ fontWeight: "bold" })}>CONTACT</Typography>
                <List>
                  <ListItem disableGutters dense>
                    <ListItemText
                      primary={data.city}
                      primaryTypographyProps={getTextStyle()}
                    />
                  </ListItem>
                  <ListItem disableGutters dense>
                    <ListItemText
                      primary={data.phone}
                      primaryTypographyProps={getTextStyle()}
                    />
                  </ListItem>
                  <ListItem disableGutters dense>
                    <ListItemText
                      primary={data.email}
                      primaryTypographyProps={getTextStyle()}
                    />
                  </ListItem>
                  <ListItem disableGutters dense>
                    <ListItemText
                      primary={data.website}
                      primaryTypographyProps={getTextStyle()}
                    />
                  </ListItem>
                </List>
              </Box>
            </div>
          );

        case 'skills':
          return savedSkills.length > 0 ? (
            <div key="skills" className="sidebar-section">
              <Box sx={{ mt: getSectionSpacing() }}>
                <Typography variant="h6" sx={getTextStyle({ fontWeight: "bold" })}>PRO. SKILLS</Typography>
                <List>
                  {savedSkills.map((skill, i) => (
                    <ListItem key={i} disableGutters dense>
                      <ListItemText
                        primary={skill.name}
                        primaryTypographyProps={getTextStyle()}
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            </div>
          ) : null;

        case 'languages':
          return savedLanguages.length > 0 ? (
            <div key="languages" className="sidebar-section">
              <Box sx={{ mt: getSectionSpacing() }}>
                <Typography variant="h6" sx={getTextStyle({ fontWeight: "bold" })}>LANGUAGES</Typography>
                <List>
                  {savedLanguages.map((lang, i) => (
                    <ListItem key={i} disableGutters dense>
                      <ListItemText
                        primary={`${lang.name}${lang.level ? ` - ${lang.level}` : ''}`}
                        primaryTypographyProps={getTextStyle()}
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            </div>
          ) : null;

        case 'interests':
          return savedInterests.length > 0 ? (
            <div key="interests" className="sidebar-section">
              <Box sx={{ mt: getSectionSpacing() }}>
                <Typography variant="h6" sx={getTextStyle({ fontWeight: "bold" })}>INTERESTS</Typography>
                <List>
                  {savedInterests.map((interest, i) => (
                    <ListItem key={i} disableGutters dense>
                      <ListItemText
                        primary={interest}
                        primaryTypographyProps={getTextStyle()}
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            </div>
          ) : null;

        case 'references':
          return (
            <div key="references" className="sidebar-section">
              <Box sx={{ mt: getSectionSpacing() }}>
                <Typography variant="h6" sx={getTextStyle({ fontWeight: "bold" })}>REFERENCES</Typography>
                {savedReferences.length > 0 ? (
                  savedReferences.map((ref, i) => (
                    <Typography key={i} variant="body2" sx={getTextStyle()}>
                      {ref}
                    </Typography>
                  ))
                ) : (
                  <Typography variant="body2" sx={getTextStyle()}>Available on request</Typography>
                )}
              </Box>
            </div>
          );

        default:
          // Handle sections moved from right side
          return renderRightContentSections(sectionId, true);
      }
    }).filter(Boolean);
  };

  // Render right content sections based on current order
  const renderRightContentSections = (sectionId = null, inSidebar = false) => {
    const sectionsToRender = sectionId ? [sectionId] : rightSectionOrder;
    
    return sectionsToRender.map(currentSectionId => {
      const textColor = inSidebar ? "inherit" : "inherit";
      const bgColor = inSidebar ? "transparent" : "black";
      const headerColor = inSidebar ? "inherit" : "white";

      switch (currentSectionId) {
        case 'profile':
          return (
            <div key="profile" className={inSidebar ? "sidebar-section" : "resume-section"}>
              <Typography
                variant="h6"
                sx={{
                  bgcolor: bgColor,
                  color: headerColor,
                  p: 1,
                  pl: 2,
                  fontSize: headingSize,
                  fontFamily: font,
                  fontStyle: fontStyle,
                  lineHeight: `${lineSpacing}px`,
                }}
              >
                PROFILE
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  mt: 1,
                  textIndent: `${paragraphIndent}px`,
                  fontWeight: lineWeight,
                  mb: getParagraphSpacing(),
                  fontFamily: font,
                  fontSize: fontSize,
                  fontStyle: fontStyle,
                  lineHeight: `${lineSpacing}px`,
                  color: textColor,
                }}
              >
                {savedSummary || data.profile}
              </Typography>
            </div>
          );

        case 'career':
          return workExperiences.length > 0 ? (
            <div key="career" className={inSidebar ? "sidebar-section" : "resume-section"}>
              <Typography
                variant="h6"
                sx={{
                  bgcolor: bgColor,
                  color: headerColor,
                  p: 1,
                  pl: 2,
                  fontSize: headingSize,
                  fontFamily: font,
                  fontStyle: fontStyle,
                  lineHeight: `${lineSpacing}px`,
                }}
              >
                CAREER
              </Typography>
              {workExperiences.map((job, i) => (
                <Box key={i} sx={{ mt: 2 }}>
                  <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    sx={{ 
                      fontSize,
                      fontFamily: font,
                      fontStyle: fontStyle,
                      lineHeight: `${lineSpacing}px`,
                      color: textColor,
                    }}
                  >
                    {job.employer} — {job.jobTitle}
                    <span style={{ 
                      float: "right",
                      fontFamily: font,
                      fontStyle: fontStyle,
                      lineHeight: `${lineSpacing}px`,
                      color: textColor,
                    }}>
                      {formatDate(job.startMonth, job.startYear)} -{" "}
                      {job.current ? "Present" : formatDate(job.endMonth, job.endYear)}
                    </span>
                  </Typography>
                  {job.description && (
                    <Box
                      sx={{
                        mt: 1,
                        color: textColor,
                        "& strong": { 
                          fontWeight: "bold",
                          fontFamily: font,
                          fontSize: fontSize,
                          fontStyle: fontStyle,
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
                          fontSize: fontSize,
                          fontStyle: fontStyle,
                          lineHeight: `${lineSpacing}px`,
                        },
                        "& *": {
                          fontFamily: font,
                          fontSize: fontSize,
                          fontStyle: fontStyle,
                          lineHeight: `${lineSpacing}px`,
                          color: textColor,
                        },
                        ...globalFontStyle
                      }}
                      dangerouslySetInnerHTML={{
                        __html: job.description
                          .replace(/\*\*(.*?)\*\*/g, `<strong style="font-family: ${font}; font-size: ${fontSize}; font-style: ${fontStyle}; line-height: ${lineSpacing}px;">$1</strong>`)
                          .replace(/\*(.*?)\*/g, `<em style="font-family: ${font}; font-size: ${fontSize}; line-height: ${lineSpacing}px;">$1</em>`)
                          .replace(/<u>(.*?)<\/u>/g, `<u style="font-family: ${font}; font-size: ${fontSize}; font-style: ${fontStyle}; line-height: ${lineSpacing}px;">$1</u>`)
                          .replace(/\n/g, "<br/>"),
                      }}
                    />
                  )}
                </Box>
              ))}
            </div>
        ) : null;

        case 'education':
          return educationEntries.length > 0 ? (
            <div key="education" className={inSidebar ? "sidebar-section" : "resume-section"}>
              <Typography
                variant="h6"
                sx={{
                  bgcolor: bgColor,
                  color: headerColor,
                  p: 1,
                  pl: 2,
                  fontSize: headingSize,
                  fontFamily: font,
                  fontStyle: fontStyle,
                  lineHeight: `${lineSpacing}px`,
                }}
              >
                EDUCATION
              </Typography>
              {educationEntries.map((edu, i) => (
                <Box key={i} sx={{ mt: 1 }}>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      textIndent: `${paragraphIndent}px`,
                      fontWeight: lineWeight,
                      fontFamily: font,
                      fontSize: fontSize,
                      fontStyle: fontStyle,
                      lineHeight: `${lineSpacing}px`,
                      color: textColor,
                    }}
                  >
                    {formatDate(edu.gradMonth, edu.gradYear)}
                  </Typography>
                  <Typography variant="body2" fontWeight="bold" sx={{...getTextStyle(), color: textColor}}>
                    {edu.schoolName}
                  </Typography>
                  <Typography variant="body2" sx={{...getTextStyle(), color: textColor}}>
                    {edu.degree} {edu.fieldOfStudy && `- ${edu.fieldOfStudy}`}
                  </Typography>
                  {edu.additionalCoursework && (
                    <Typography variant="body2" sx={{...getTextStyle(), color: textColor}}>{edu.additionalCoursework}</Typography>
                  )}
                </Box>
              ))}
            </div>
          ) : null;

        case 'certifications':
          return savedCertifications.length > 0 ? (
            <div key="certifications" className={inSidebar ? "sidebar-section" : "resume-section"}>
              <Typography
                variant="h6"
                sx={{
                  bgcolor: bgColor,
                  color: headerColor,
                  p: 1,
                  pl: 2,
                  fontSize: headingSize,
                  fontFamily: font,
                  fontStyle: fontStyle,
                  lineHeight: `${lineSpacing}px`,
                }}
              >
                CERTIFICATIONS
              </Typography>
              {savedCertifications.map((cert, i) => (
                <Box key={i} sx={{ mt: 1 }}>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      textIndent: `${paragraphIndent}px`,
                      fontWeight: lineWeight,
                      fontFamily: font,
                      fontSize: fontSize,
                      fontStyle: fontStyle,
                      lineHeight: `${lineSpacing}px`,
                      color: textColor,
                    }}
                  >
                    {cert.name}
                  </Typography>
                  <Typography variant="body2" sx={{...getTextStyle(), color: textColor}}>
                    {cert.provider} {cert.year && `(${cert.year})`}
                  </Typography>
                </Box>
              ))}
            </div>
          ) : null;

        case 'accomplishments':
          return savedAccomplishments.length > 0 ? (
            <div key="accomplishments" className={inSidebar ? "sidebar-section" : "resume-section"}>
              <Typography
                variant="h6"
                sx={{
                  bgcolor: bgColor,
                  color: headerColor,
                  p: 1,
                  pl: 2,
                  fontSize: headingSize,
                  fontFamily: font,
                  fontStyle: fontStyle,
                  lineHeight: `${lineSpacing}px`,
                }}
              >
                ACCOMPLISHMENTS
              </Typography>
              <List dense>
                {savedAccomplishments.map((acc, i) => (
                  <ListItem key={i} sx={{ py: 0 }}>
                    <ListItemText 
                      primary={acc}
                      primaryTypographyProps={{...getTextStyle(), color: textColor}}
                    />
                  </ListItem>
                ))}
              </List>
            </div>
          ) : null;

        case 'softwareSkills':
          return softwareSkills.length > 0 ? (
            <div key="softwareSkills" className={inSidebar ? "sidebar-section" : "resume-section"}>
              <Typography
                variant="h6"
                sx={{
                  bgcolor: bgColor,
                  color: headerColor,
                  p: 1,
                  pl: 2,
                  fontSize: headingSize,
                  fontFamily: font,
                  fontStyle: fontStyle,
                  lineHeight: `${lineSpacing}px`,
                }}
              >
                SOFTWARE SKILLS
              </Typography>
              <List dense>
                {softwareSkills.map((skill, i) => (
                  <ListItem key={i} sx={{ py: 0 }}>
                    <ListItemText 
                      primary={`${skill.name} - ${skill.level}%`}
                      primaryTypographyProps={{...getTextStyle(), color: textColor}}
                    />
                  </ListItem>
                ))}
              </List>
            </div>
          ) : null;

        case 'volunteering':
          return savedVolunteering.length > 0 ? (
            <div key="volunteering" className={inSidebar ? "sidebar-section" : "resume-section"}>
              <Typography
                variant="h6"
                sx={{
                  bgcolor: bgColor,
                  color: headerColor,
                  p: 1,
                  pl: 2,
                  fontSize: headingSize,
                  fontFamily: font,
                  fontStyle: fontStyle,
                  lineHeight: `${lineSpacing}px`,
                }}
              >
                VOLUNTEERING
              </Typography>
              {savedVolunteering.map((vol, i) => (
                <Box key={i} sx={{ mt: 2 }}>
                  <Typography fontWeight="bold" sx={{...getTextStyle(), color: textColor}}>{vol.subtopic}</Typography>
                  <Typography variant="body2" color={inSidebar ? "text.secondary" : "text.secondary"} sx={getTextStyle()}>
                    {vol.fromDate} - {vol.toDate}
                  </Typography>
                  <Typography sx={{ 
                    mt: 1,
                    ...getTextStyle(),
                    color: textColor
                  }}>{vol.content}</Typography>
                </Box>
              ))}
            </div>
          ) : null;

        case 'websites':
          return savedWebsites.length > 0 ? (
            <div key="websites" className={inSidebar ? "sidebar-section" : "resume-section"}>
              <Typography
                variant="h6"
                sx={{
                  bgcolor: bgColor,
                  color: headerColor,
                  p: 1,
                  pl: 2,
                  fontSize: headingSize,
                  fontFamily: font,
                  fontStyle: fontStyle,
                  lineHeight: `${lineSpacing}px`,
                }}
              >
                WEBSITES & PROFILES
              </Typography>
              <List dense>
                {savedWebsites.map((site, i) => (
                  <ListItem key={i} sx={{ py: 0 }}>
                    <ListItemText 
                      primary={site.url}
                      primaryTypographyProps={{...getTextStyle(), color: textColor}}
                    />
                  </ListItem>
                ))}
              </List>
            </div>
          ) : null;

        case 'additionalInfo':
          return savedAdditionalInfo.length > 0 ? (
            <div key="additionalInfo" className={inSidebar ? "sidebar-section" : "resume-section"}>
              <Typography
                variant="h6"
                sx={{
                  bgcolor: bgColor,
                  color: headerColor,
                  p: 1,
                  pl: 2,
                  fontSize: headingSize,
                  fontFamily: font,
                  fontStyle: fontStyle,
                  lineHeight: `${lineSpacing}px`,
                }}
              >
                ADDITIONAL INFORMATION
              </Typography>
              <List dense>
                {savedAdditionalInfo.map((info, i) => (
                  <ListItem key={i} sx={{ py: 0 }}>
                    <ListItemText 
                      primary={info}
                      primaryTypographyProps={{...getTextStyle(), color: textColor}}
                    />
                  </ListItem>
                ))}
              </List>
            </div>
          ) : null;

        // Handle left-side sections when moved to right side
        case 'photo':
          return resumeMeta.hasPhoto && !inSidebar ? (
            <div key="photo" className="resume-section">
              <Box textAlign="center" mb={3}>
                <Avatar
                  src={photo || "/profile.jpg"}
                  alt="profile"
                  sx={{ width: 100, height: 100, mx: "auto", mb: 2 }}
                />
              </Box>
            </div>
          ) : null;

      
        case 'contact':
          return !inSidebar ? (
            <div key="contact" className="resume-section">
              <Box sx={{ mt: getSectionSpacing() }}>
                <Typography variant="h6" sx={getTextStyle({ fontWeight: "bold" })}>CONTACT</Typography>
                <List>
                  <ListItem disableGutters dense>
                    <ListItemText
                      primary={data.city}
                      primaryTypographyProps={getTextStyle()}
                    />
                  </ListItem>
                  <ListItem disableGutters dense>
                    <ListItemText
                      primary={data.phone}
                      primaryTypographyProps={getTextStyle()}
                    />
                  </ListItem>
                  <ListItem disableGutters dense>
                    <ListItemText
                      primary={data.email}
                      primaryTypographyProps={getTextStyle()}
                    />
                  </ListItem>
                  <ListItem disableGutters dense>
                    <ListItemText
                      primary={data.website}
                      primaryTypographyProps={getTextStyle()}
                    />
                  </ListItem>
                </List>
              </Box>
            </div>
          ) : null;

        case 'skills':
          return savedSkills.length > 0 && !inSidebar ? (
            <div key="skills" className="resume-section">
              <Box sx={{ mt: getSectionSpacing() }}>
                <Typography variant="h6" sx={getTextStyle({ fontWeight: "bold" })}>PRO. SKILLS</Typography>
                <List>
                  {savedSkills.map((skill, i) => (
                    <ListItem key={i} disableGutters dense>
                      <ListItemText
                        primary={skill.name}
                        primaryTypographyProps={getTextStyle()}
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            </div>
          ) : null;

        case 'languages':
          return savedLanguages.length > 0 && !inSidebar ? (
            <div key="languages" className="resume-section">
              <Box sx={{ mt: getSectionSpacing() }}>
                <Typography variant="h6" sx={getTextStyle({ fontWeight: "bold" })}>LANGUAGES</Typography>
                <List>
                  {savedLanguages.map((lang, i) => (
                    <ListItem key={i} disableGutters dense>
                      <ListItemText
                        primary={`${lang.name}${lang.level ? ` - ${lang.level}` : ''}`}
                        primaryTypographyProps={getTextStyle()}
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            </div>
          ) : null;

        case 'interests':
          return savedInterests.length > 0 && !inSidebar ? (
            <div key="interests" className="resume-section">
              <Box sx={{ mt: getSectionSpacing() }}>
                <Typography variant="h6" sx={getTextStyle({ fontWeight: "bold" })}>INTERESTS</Typography>
                <List>
                  {savedInterests.map((interest, i) => (
                    <ListItem key={i} disableGutters dense>
                      <ListItemText
                        primary={interest}
                        primaryTypographyProps={getTextStyle()}
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            </div>
          ) : null;

        case 'references':
          return !inSidebar ? (
            <div key="references" className="resume-section">
              <Box sx={{ mt: getSectionSpacing() }}>
                <Typography variant="h6" sx={getTextStyle({ fontWeight: "bold" })}>REFERENCES</Typography>
                {savedReferences.length > 0 ? (
                  savedReferences.map((ref, i) => (
                    <Typography key={i} variant="body2" sx={getTextStyle()}>
                      {ref}
                    </Typography>
                  ))
                ) : (
                  <Typography variant="body2" sx={getTextStyle()}>Available on request</Typography>
                )}
              </Box>
            </div>
          ) : null;

       // renderRightContentSections function-ல custom section case-ஐ update செய்யவும்
default:
  // Handle ALL custom sections for the user
  if (currentSectionId && currentSectionId.startsWith('custom_')) {
    const customSectionName = currentSectionId.replace('custom_', '');
    const items = customSections[customSectionName] || [];
    
    console.log(`🎯 Rendering custom section: ${customSectionName}`, items);
    
    // Filter out empty items
    const validItems = items.filter(item => item && item.trim() !== '');
    
    if (validItems.length > 0) {
      return (
        <div key={currentSectionId} className={inSidebar ? "sidebar-section" : "resume-section"}>
          <Typography
            variant="h6"
            sx={{
              bgcolor: bgColor,
              color: headerColor,
              p: 1,
              pl: 2,
              fontSize: headingSize,
              fontFamily: font,
              fontStyle: fontStyle,
              lineHeight: `${lineSpacing}px`,
            }}
          >
            {customSectionName.replace(/_/g, ' ').toUpperCase()}
          </Typography>
          <List dense>
            {validItems.map((item, i) => (
              <ListItem key={i} sx={{ py: 0 }}>
                <ListItemText 
                  primary={`• ${item}`}
                  primaryTypographyProps={{
                    ...getTextStyle(), 
                    color: textColor,
                    whiteSpace: 'pre-line'
                  }}
                />
              </ListItem>
            ))}
          </List>
        </div>
      );
    } else {
      console.log(`⚠️ No valid items in custom section: ${customSectionName}`);
      return null;
    }
  }
  return null;}
    }).filter(Boolean);
  };

  // Pagination for sidebar content
  const paginateSidebarContent = useCallback(() => {
    if (!sidebarContentRef.current) return;

    const pageHeightInPx = parseFloat(page.height.replace('mm', '')) * 3.78;
    const availableHeight = pageHeightInPx - (2 * topBottomMargin);

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
    if (!rightContentRef.current) return;

    const pageHeightInPx = parseFloat(page.height.replace('mm', '')) * 3.78;
    const availableHeight = pageHeightInPx - (2 * topBottomMargin);

    const rightContent = rightContentRef.current;
    const sections = Array.from(rightContent.querySelectorAll('.resume-section'));
    
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
    font,
    fontSize,
    fontStyle,
    headingSize,
    sectionSpacing,
    paragraphSpacing,
    lineSpacing,
    paragraphIndent,
    lineWeight,
  ]);

  // Render sidebar content for measurement (hidden)
  const renderSidebarForMeasurement = () => (
    <Box ref={sidebarContentRef} sx={{ visibility: 'hidden', position: 'absolute', top: -1000, width: '30%', ...globalFontStyle }}>
      {renderSidebarSections()}
    </Box>
  );

  // Render right content for measurement (hidden)
  const renderRightContentForMeasurement = () => (
    <Box ref={rightContentRef} sx={{ visibility: 'hidden', position: 'absolute', top: -1000, width: '70%', ...globalFontStyle }}>
      {renderRightContentSections()}
    </Box>
  );

  // Render actual sidebar content based on current page
  const renderSidebar = (pageIndex) => (
    <Box
      sx={{
        width: "30%",
        bgcolor: themeColor.primary,
        color: "black",
        p: 3,
        display: "flex",
        flexDirection: "column",
        fontFamily: font,
        fontSize: fontSize,
        fontStyle: fontStyle,
        lineHeight: `${lineSpacing}px`,
        "@media print": {
          bgcolor: themeColor.primary,
          color: "black",
          p: 2,
          width: "30%",
          display: "inline-block",
          verticalAlign: "top",
          WebkitPrintColorAdjust: "exact",
          printColorAdjust: "exact",
          fontFamily: font,
          fontSize: fontSize,
          fontStyle: fontStyle,
          lineHeight: `${lineSpacing}px`,
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
      {renderRightContentForMeasurement()}
      
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

            <Box sx={{ display: "flex", height: "100%", p: `${topBottomMargin}px ${sideMargins}px`, flex: 1 }}>
              {/* Left Sidebar - Show on all pages if there's sidebar content */}
              {sidebarPages[pageIndex] ? renderSidebar(pageIndex) : <Box sx={{ width: "30%", bgcolor: themeColor.primary, p: 3 }} />}
              
              {/* Vertical Divider - Show only when both sidebar and content exist */}
              {(sidebarPages[pageIndex] && pages[pageIndex]) && (
                <Divider 
                  orientation="vertical" 
                  flexItem 
                  sx={{ 
                    mx: 2, 
                    borderRightWidth: lineWeight 
                  }} 
                />
              )}
              
              {/* Right Content Section */}
              <Box
                sx={{
                  width: sidebarPages[pageIndex] ? "70%" : "100%",
                  pl: sidebarPages[pageIndex] ? 3 : 0,
                  fontFamily: font,
                  fontSize: fontSize,
                  fontStyle: fontStyle,
                  lineHeight: `${lineSpacing}px`,
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

export default ResumeTemplate;