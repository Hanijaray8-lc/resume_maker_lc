import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  Box,
  Grid,
  Typography,
  Avatar,
  List,
  ListItem,
  ListItemText,
  Divider,
  IconButton,
  Button,
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

export const resumeMeta = {
  hasPhoto: true,
  columns: 2,
};

// Page size mapping
const pageSizeMap = {
  A4: { width: "210mm", height: "297mm" },
  Letter: { width: "216mm", height: "279mm" },
  Legal: { width: "216mm", height: "356mm" },
  A3: { width: "297mm", height: "420mm" },
  Executive: { width: "184mm", height: "267mm" },
};

const themes = [
  { primary: "#b83232", dark: "#333" },
  { primary: "#1e88e5", dark: "#0d47a1" },
  { primary: "#43a047", dark: "#1b5e20" },
  { primary: "#fbc02d", dark: "#f57f17" },
  { primary: "#8e24aa", dark: "#4a148c" },
];

const defaultData = {
  firstName: "William",
  lastName: "Gabriel",
  currentPosition: "Web Developer",
  phone: "123-456-7890",
  email: "hello@techguruplus.com",
  city: "Any City, ST 12345",
  website: "www.techguruplus.com",
  profile: "Experienced web developer with a passion for creating innovative solutions.",
};

// Separate section orders for left and right sides
const defaultLeftSectionOrder = [
  'contact',
  'skills',
  'education',
  'languages',
  'interests',
  'reference'
];

const defaultRightSectionOrder = [
  'profile',
  'workExperience',
  'accomplishments',
  'softwareSkills',
  'certifications',
  'volunteering',
  'websites',
  'additionalInfo'
];

const Resume4 = ({
  theme = { primary: "#1a2b47", dark: "#333" },
  color = "#1a2b47",
  font = "Arial",
  fontSize = "14px",
  fontStyle = "normal",
  headingSize = "24px",
  sectionSpacing = 5,
  paragraphSpacing = 5,
  lineSpacing = 15,
  topBottomMargin = 40,
  sideMargins = 40,
  paragraphIndent = 0,
  lineWeight = 1,
  pageSize = "A4",
  setTheme,
  photo = "",
  formData = {},
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

  // Load all data in a single useEffect to prevent multiple renders
  useEffect(() => {
    const loadData = () => {
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
      
      // Load the custom section with most items (most content) - Resume9 mathiri
      const userId = localStorage.getItem("userId");
      let sectionsData = {};

      if (userId) {
        // Get the CURRENT custom sections from ExtraSections page state
        const currentCustomSections = JSON.parse(localStorage.getItem(`current_custom_sections_${userId}`)) || [];
        
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
                }
              }
            } catch (error) {
              console.error(`Error loading current custom section ${sectionName}:`, error);
            }
          });
        }
      }

      setCustomSections(sectionsData);

      // Load saved section orders
      const savedLeftSectionOrder = localStorage.getItem("resume4LeftSectionOrder");
      if (savedLeftSectionOrder) {
        const parsedOrder = JSON.parse(savedLeftSectionOrder);
        const filteredOrder = parsedOrder.filter(section => !section.startsWith('custom_'));
        setLeftSectionOrder(filteredOrder);
      } else {
        setLeftSectionOrder(defaultLeftSectionOrder);
      }

      const savedRightSectionOrder = localStorage.getItem("resume4RightSectionOrder");
      if (savedRightSectionOrder) {
        const parsedOrder = JSON.parse(savedRightSectionOrder);
        
        // Remove ALL old custom sections and add ONLY current sections
        const currentCustomSectionIds = Object.keys(sectionsData).map(name => `custom_${name}`);
        const filteredOrder = parsedOrder.filter(section => !section.startsWith('custom_'));
        const allRightSections = [...filteredOrder, ...currentCustomSectionIds];
        
        setRightSectionOrder(allRightSections);
      } else {
        // For first time, add ONLY current custom sections to right side
        const currentCustomSectionIds = Object.keys(sectionsData).map(name => `custom_${name}`);
        const updatedRightSectionOrder = [...defaultRightSectionOrder, ...currentCustomSectionIds];
        setRightSectionOrder(updatedRightSectionOrder);
      }
    };

    loadData();
  }, []);

  // Fixed useEffect for custom sections - using useCallback to prevent infinite loops
  const updateSectionOrders = useCallback((sectionsData) => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    const currentCustomSectionIds = Object.keys(sectionsData).map(name => `custom_${name}`);
    
    // Update right section order
    setRightSectionOrder(prevRightOrder => {
      const filteredRightOrder = prevRightOrder.filter(section => !section.startsWith('custom_'));
      const newRightOrder = [...filteredRightOrder, ...currentCustomSectionIds];
      
      if (JSON.stringify(newRightOrder) !== JSON.stringify(prevRightOrder)) {
        localStorage.setItem("resume4RightSectionOrder", JSON.stringify(newRightOrder));
        return newRightOrder;
      }
      return prevRightOrder;
    });

    // Update left section order
    setLeftSectionOrder(prevLeftOrder => {
      const filteredLeftOrder = prevLeftOrder.filter(section => !section.startsWith('custom_'));
      if (JSON.stringify(filteredLeftOrder) !== JSON.stringify(prevLeftOrder)) {
        localStorage.setItem("resume4LeftSectionOrder", JSON.stringify(filteredLeftOrder));
        return filteredLeftOrder;
      }
      return prevLeftOrder;
    });
  }, []);

  useEffect(() => {
    if (Object.keys(customSections).length > 0) {
      updateSectionOrders(customSections);
    }
  }, [customSections, updateSectionOrders]);

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
      localStorage.setItem("resume4LeftSectionOrder", JSON.stringify(newSectionOrder));
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
      localStorage.setItem("resume4LeftSectionOrder", JSON.stringify(newLeftSectionOrder));
      localStorage.setItem("resume4RightSectionOrder", JSON.stringify(newRightSectionOrder));
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
      localStorage.setItem("resume4RightSectionOrder", JSON.stringify(newSectionOrder));
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
      localStorage.setItem("resume4LeftSectionOrder", JSON.stringify(newLeftSectionOrder));
      localStorage.setItem("resume4RightSectionOrder", JSON.stringify(newRightSectionOrder));
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
    localStorage.setItem("resume4LeftSectionOrder", JSON.stringify(defaultLeftSectionOrder));
  };

  const resetRightSectionOrder = () => {
    // Reset to default + current custom sections
    const currentCustomSectionIds = Object.keys(customSections).map(name => `custom_${name}`);
    const updatedRightSectionOrder = [...defaultRightSectionOrder, ...currentCustomSectionIds];
    setRightSectionOrder(updatedRightSectionOrder);
    localStorage.setItem("resume4RightSectionOrder", JSON.stringify(updatedRightSectionOrder));
  };

  const resetAllSectionOrder = () => {
    resetLeftSectionOrder();
    resetRightSectionOrder();
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
      'interests': 'Interests',
      'reference': 'Reference',
      'profile': 'Profile',
      'workExperience': 'Work Experience',
      'accomplishments': 'Accomplishments',
      'softwareSkills': 'Software Skills',
      'certifications': 'Certifications',
      'volunteering': 'Volunteering',
      'websites': 'Websites & Profiles',
      'additionalInfo': 'Additional Information'
    };
    
    if (sectionId.startsWith('custom_')) {
      return sectionId.replace('custom_', '').toUpperCase();
    }
    
    return titles[sectionId] || sectionId;
  };

  const renderDragPanel = (side, sections) => {
    return (
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', ...globalFontStyle }}>
          <DragIndicator sx={{ mr: 1 }} />
          {side === 'left' ? 'Left Sidebar' : 'Right Content'} Sections
          <Typography variant="body2" color="textSecondary" sx={{ ml: 1, ...globalFontStyle }}>
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
                  ...globalFontStyle
                }}
              >
                <DragIndicator color="action" />
                <Typography sx={{ ml: 1, flexGrow: 1, ...globalFontStyle }}>
                  {getSectionTitle(sectionId)}
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={globalFontStyle}>
                  {index + 1}
                </Typography>
              </Paper>
            ))
          ) : (
            <Typography variant="body2" color="textSecondary" sx={{ p: 2, textAlign: 'center', ...globalFontStyle }}>
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
        case 'contact':
          return (
            <div key="contact" className="sidebar-section">
              {/* Profile Image */}
              <Box textAlign="center" mb={3}>
                <Avatar
                  src={photo || "/profile.jpg"}
                  alt="profile"
                  sx={{ width: 140, height: 140, mx: "auto", mb: 2 }}
                />
                <Typography variant="h5" fontWeight="bold" sx={{ ...globalFontStyle, fontSize: headingSize }}>
                  {data.firstName} {data.lastName}
                </Typography>
                <Typography variant="subtitle1" sx={globalFontStyle}>{data.currentPosition}</Typography>
              </Box>

              <Box mb={3}>
                <Typography
                  variant="h6"
                  sx={{ 
                    bgcolor: theme.dark, 
                    p: 1, 
                    fontWeight: "bold",
                    ...globalFontStyle,
                    fontSize: headingSize
                  }}
                >
                  CONTACT
                </Typography>
                <List>
                  <ListItem sx={{ py: 0 }}>
                    <ListItemText
                      primary="PHONE:"
                      secondary={data.phone}
                      primaryTypographyProps={{ 
                        fontWeight: "bold", 
                        color: "#fff",
                        ...globalFontStyle
                      }}
                      secondaryTypographyProps={{ 
                        color: "#fff",
                        ...globalFontStyle
                      }}
                    />
                  </ListItem>
                  <ListItem sx={{ py: 0 }}>
                    <ListItemText
                      primary="EMAIL:"
                      secondary={data.email}
                      primaryTypographyProps={{ 
                        fontWeight: "bold", 
                        color: "#fff",
                        ...globalFontStyle
                      }}
                      secondaryTypographyProps={{ 
                        color: "#fff",
                        ...globalFontStyle
                      }}
                    />
                  </ListItem>
                  <ListItem sx={{ py: 0 }}>
                    <ListItemText
                      primary="LOCATION:"
                      secondary={data.city}
                      primaryTypographyProps={{ 
                        fontWeight: "bold", 
                        color: "#fff",
                        ...globalFontStyle
                      }}
                      secondaryTypographyProps={{ 
                        color: "#fff",
                        ...globalFontStyle
                      }}
                    />
                  </ListItem>
                  <ListItem sx={{ py: 0 }}>
                    <ListItemText
                      primary="WEBSITE:"
                      secondary={data.website}
                      primaryTypographyProps={{ 
                        fontWeight: "bold", 
                        color: "#fff",
                        ...globalFontStyle
                      }}
                      secondaryTypographyProps={{ 
                        color: "#fff",
                        ...globalFontStyle
                      }}
                    />
                  </ListItem>
                </List>
              </Box>
            </div>
          );

        case 'skills':
          return (
            <div key="skills" className="sidebar-section">
              <Box mb={3}>
                <Typography
                  variant="h6"
                  sx={{ 
                    bgcolor: theme.dark, 
                    p: 1, 
                    fontWeight: "bold",
                    ...globalFontStyle,
                    fontSize: headingSize
                  }}
                >
                  SKILLS
                </Typography>
                <List dense>
                  {savedSkills.length > 0 ? (
                    savedSkills.map((skill, i) => (
                      <ListItem key={i} sx={{ py: 0 }}>
                        <ListItemText 
                          primary={`${skill.name} (${skill.rating || 0}%)`}
                          primaryTypographyProps={{ 
                            color: "#fff",
                            ...globalFontStyle
                          }}
                        />
                      </ListItem>
                    ))
                  ) : (
                    [
                      "Front-end Coding",
                      "User Interface/User Experience",
                      "Custom Databases",
                      "Programming",
                      "Web Design",
                      "Multiplatform Mobile App Development",
                    ].map((skill, i) => (
                      <ListItem key={i} sx={{ py: 0 }}>
                        <ListItemText 
                          primary={skill}
                          primaryTypographyProps={{ 
                            color: "#fff",
                            ...globalFontStyle
                          }}
                        />
                      </ListItem>
                    ))
                  )}
                </List>
              </Box>
            </div>
          );

        case 'education':
          return (
            <div key="education" className="sidebar-section">
              <Box mb={3}>
                <Typography
                  variant="h6"
                  sx={{ 
                    bgcolor: theme.dark, 
                    p: 1, 
                    fontWeight: "bold",
                    ...globalFontStyle,
                    fontSize: headingSize
                  }}
                >
                  EDUCATION
                </Typography>
                {educationEntries.length > 0 ? (
                  educationEntries.map((edu) => (
                    <Box key={edu.id} sx={{ mb: 2, mt: 1 }}>
                      <Typography sx={{ 
                        fontWeight: "bold", 
                        color: "#fff",
                        ...globalFontStyle
                      }}>
                        {edu.degree} - {edu.fieldOfStudy}
                      </Typography>
                      <Typography sx={{ 
                        color: "#fff",
                        ...globalFontStyle
                      }}>
                        {edu.schoolName}, {edu.schoolLocation}
                      </Typography>
                      <Typography sx={{ 
                        fontStyle: "italic", 
                        color: "#fff",
                        ...globalFontStyle
                      }}>
                        {formatDate(edu.gradMonth, edu.gradYear)}
                      </Typography>
                      {edu.additionalCoursework && (
                        <Typography sx={{ 
                          color: "#fff",
                          ...globalFontStyle
                        }}>{edu.additionalCoursework}</Typography>
                      )}
                    </Box>
                  ))
                ) : (
                  <Box mt={1}>
                    <Typography fontWeight="bold" sx={{ 
                      color: "#fff",
                      ...globalFontStyle
                    }}>
                      Master of Science (2016)
                    </Typography>
                    <Typography sx={{ 
                      color: "#fff",
                      ...globalFontStyle
                    }}>Fradel and Spies University</Typography>
                    <Typography fontWeight="bold" mt={1} sx={{ 
                      color: "#fff",
                      ...globalFontStyle
                    }}>
                      Bachelor of Information Technology (2014)
                    </Typography>
                    <Typography sx={{ 
                      color: "#fff",
                      ...globalFontStyle
                    }}>Borcelle University</Typography>
                  </Box>
                )}
              </Box>
            </div>
          );

        case 'languages':
          return savedLanguages.length > 0 ? (
            <div key="languages" className="sidebar-section">
              <Box mb={3}>
                <Typography
                  variant="h6"
                  sx={{ 
                    bgcolor: theme.dark, 
                    p: 1, 
                    fontWeight: "bold",
                    ...globalFontStyle,
                    fontSize: headingSize
                  }}
                >
                  LANGUAGES
                </Typography>
                <List dense>
                  {savedLanguages.map((lang, i) => (
                    <ListItem key={i} sx={{ py: 0 }}>
                      <ListItemText 
                        primary={`${lang.name}${lang.level ? ` - ${lang.level}` : ''}`}
                        primaryTypographyProps={{ 
                          color: "#fff",
                          ...globalFontStyle
                        }}
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
              <Box mb={3}>
                <Typography
                  variant="h6"
                  sx={{ 
                    bgcolor: theme.dark, 
                    p: 1, 
                    fontWeight: "bold",
                    ...globalFontStyle,
                    fontSize: headingSize
                  }}
                >
                  INTERESTS
                </Typography>
                <List dense>
                  {savedInterests.map((interest, i) => (
                    <ListItem key={i} sx={{ py: 0 }}>
                      <ListItemText 
                        primary={interest}
                        primaryTypographyProps={{ 
                          color: "#fff",
                          ...globalFontStyle
                        }}
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            </div>
          ) : null;

        case 'reference':
          return (
            <div key="reference" className="sidebar-section">
              <Box>
                <Typography
                  variant="h6"
                  sx={{ 
                    bgcolor: theme.dark, 
                    p: 1, 
                    fontWeight: "bold",
                    ...globalFontStyle,
                    fontSize: headingSize
                  }}
                >
                  REFERENCE
                </Typography>
                {savedReferences.length > 0 ? (
                  savedReferences.map((ref, i) => (
                    <Typography key={i} variant="body2" mt={1} sx={{ 
                      color: "#fff",
                      ...globalFontStyle
                    }}>
                      {ref}
                    </Typography>
                  ))
                ) : (
                  <Typography variant="body2" mt={1} sx={{ 
                    color: "#fff",
                    ...globalFontStyle
                  }}>
                    Sacha Dubois <br />
                    CEO Wardiere Inc. <br />
                    <strong>Email:</strong> hello@reallygreatsite.com
                  </Typography>
                )}
              </Box>
            </div>
          );

        default:
          // Handle sections moved from right side
          return renderRightContentSectionsForSidebar(sectionId);
      }
    }).filter(Boolean);
  };

  // Render right content sections for sidebar (when moved from right to left)
  const renderRightContentSectionsForSidebar = (sectionId) => {
    switch (sectionId) {
      case 'profile':
        return savedSummary ? (
          <div key="profile" className="sidebar-section">
            <Box mb={3}>
              <Typography
                variant="h6"
                sx={{ 
                  bgcolor: theme.dark, 
                  p: 1, 
                  fontWeight: "bold",
                  ...globalFontStyle,
                  fontSize: headingSize
                }}
              >
                PROFILE
              </Typography>
              <Typography sx={{ 
                mt: 1,
                color: "#fff",
                ...globalFontStyle
              }}>{savedSummary}</Typography>
            </Box>
          </div>
        ) : null;

      case 'workExperience':
        return (
          <div key="workExperience" className="sidebar-section">
            <Box mb={3}>
              <Typography
                variant="h6"
                sx={{ 
                  bgcolor: theme.dark, 
                  p: 1, 
                  fontWeight: "bold",
                  ...globalFontStyle,
                  fontSize: headingSize
                }}
              >
                WORK EXPERIENCE
              </Typography>
              {workExperiences && workExperiences.length > 0 ? (
                workExperiences.slice(0, 1).map((work, i) => (
                  <Box key={i} mt={1}>
                    <Typography sx={{ 
                      fontWeight: "bold", 
                      color: "#fff",
                      ...globalFontStyle
                    }}>
                      {work.jobTitle} at {work.employer}
                    </Typography>
                    <Typography variant="body2" sx={{ 
                      color: "#fff",
                      ...globalFontStyle
                    }}>
                      {formatDate(work.startMonth, work.startYear)} -{" "}
                      {work.current ? "Present" : formatDate(work.endMonth, work.endYear)}
                    </Typography>
                  </Box>
                ))
              ) : (
                <Box mt={1}>
                  <Typography sx={{ 
                    fontWeight: "bold", 
                    color: "#fff",
                    ...globalFontStyle
                  }}>
                    Senior Web Developer at Wardiere Inc.
                  </Typography>
                  <Typography variant="body2" sx={{ 
                    color: "#fff",
                    ...globalFontStyle
                  }}>
                    October 2019 - Current
                  </Typography>
                </Box>
              )}
            </Box>
          </div>
        );

      case 'accomplishments':
        return savedAccomplishments.length > 0 ? (
          <div key="accomplishments" className="sidebar-section">
            <Box mb={3}>
              <Typography
                variant="h6"
                sx={{ 
                  bgcolor: theme.dark, 
                  p: 1, 
                  fontWeight: "bold",
                  ...globalFontStyle,
                  fontSize: headingSize
                }}
              >
                ACCOMPLISHMENTS
              </Typography>
              <List dense>
                {savedAccomplishments.slice(0, 3).map((acc, i) => (
                  <ListItem key={i} sx={{ py: 0 }}>
                    <ListItemText 
                      primary={acc}
                      primaryTypographyProps={{ 
                        color: "#fff",
                        ...globalFontStyle
                      }}
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          </div>
        ) : null;

      case 'softwareSkills':
        return softwareSkills.length > 0 ? (
          <div key="softwareSkills" className="sidebar-section">
            <Box mb={3}>
              <Typography
                variant="h6"
                sx={{ 
                  bgcolor: theme.dark, 
                  p: 1, 
                  fontWeight: "bold",
                  ...globalFontStyle,
                  fontSize: headingSize
                }}
              >
                SOFTWARE SKILLS
              </Typography>
              <List dense>
                {softwareSkills.slice(0, 5).map((skill, i) => (
                  <ListItem key={i} sx={{ py: 0 }}>
                    <ListItemText 
                      primary={`${skill.name} - ${skill.level}%`}
                      primaryTypographyProps={{ 
                        color: "#fff",
                        ...globalFontStyle
                      }}
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          </div>
        ) : null;

      case 'certifications':
        return savedCertifications.length > 0 ? (
          <div key="certifications" className="sidebar-section">
            <Box mb={3}>
              <Typography
                variant="h6"
                sx={{ 
                  bgcolor: theme.dark, 
                  p: 1, 
                  fontWeight: "bold",
                  ...globalFontStyle,
                  fontSize: headingSize
                }}
              >
                CERTIFICATIONS
              </Typography>
              <List dense>
                {savedCertifications.slice(0, 3).map((cert, i) => (
                  <ListItem key={i} sx={{ py: 0 }}>
                    <ListItemText 
                      primary={`${cert.name} - ${cert.provider}`}
                      primaryTypographyProps={{ 
                        color: "#fff",
                        ...globalFontStyle
                      }}
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          </div>
        ) : null;

      case 'volunteering':
        return savedVolunteering.length > 0 ? (
          <div key="volunteering" className="sidebar-section">
            <Box mb={3}>
              <Typography
                variant="h6"
                sx={{ 
                  bgcolor: theme.dark, 
                  p: 1, 
                  fontWeight: "bold",
                  ...globalFontStyle,
                  fontSize: headingSize
                }}
              >
                VOLUNTEERING
              </Typography>
              {savedVolunteering.slice(0, 1).map((vol, i) => (
                <Box key={i} mt={1}>
                  <Typography sx={{ 
                    fontWeight: "bold", 
                    color: "#fff",
                    ...globalFontStyle
                  }}>{vol.subtopic}</Typography>
                  <Typography variant="body2" sx={{ 
                    color: "#fff",
                    ...globalFontStyle
                  }}>
                    {vol.fromDate} - {vol.toDate}
                  </Typography>
                </Box>
              ))}
            </Box>
          </div>
        ) : null;

      case 'websites':
        return savedWebsites.length > 0 ? (
          <div key="websites" className="sidebar-section">
            <Box mb={3}>
              <Typography
                variant="h6"
                sx={{ 
                  bgcolor: theme.dark, 
                  p: 1, 
                  fontWeight: "bold",
                  ...globalFontStyle,
                  fontSize: headingSize
                }}
              >
                WEBSITES & PROFILES
              </Typography>
              <List dense>
                {savedWebsites.slice(0, 3).map((site, i) => (
                  <ListItem key={i} sx={{ py: 0 }}>
                    <ListItemText 
                      primary={site.url}
                      primaryTypographyProps={{ 
                        color: "#fff",
                        ...globalFontStyle
                      }}
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          </div>
        ) : null;

      case 'additionalInfo':
        return savedAdditionalInfo.length > 0 ? (
          <div key="additionalInfo" className="sidebar-section">
            <Box mb={3}>
              <Typography
                variant="h6"
                sx={{ 
                  bgcolor: theme.dark, 
                  p: 1, 
                  fontWeight: "bold",
                  ...globalFontStyle,
                  fontSize: headingSize
                }}
              >
                ADDITIONAL INFORMATION
              </Typography>
              <List dense>
                {savedAdditionalInfo.slice(0, 3).map((info, i) => (
                  <ListItem key={i} sx={{ py: 0 }}>
                    <ListItemText 
                      primary={info}
                      primaryTypographyProps={{ 
                        color: "#fff",
                        ...globalFontStyle
                      }}
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          </div>
        ) : null;

      default:
        // Handle custom sections
        if (sectionId.startsWith('custom_')) {
          const customSectionName = sectionId.replace('custom_', '');
          const items = customSections[customSectionName] || [];
          return items.length > 0 ? (
            <div key={sectionId} className="sidebar-section">
              <Box mb={3}>
                <Typography
                  variant="h6"
                  sx={{ 
                    bgcolor: theme.dark, 
                    p: 1, 
                    fontWeight: "bold",
                    ...globalFontStyle,
                    fontSize: headingSize
                  }}
                >
                  {customSectionName.toUpperCase()}
                </Typography>
                <List dense>
                  {items.slice(0, 3).map((item, i) => (
                    <ListItem key={i} sx={{ py: 0 }}>
                      <ListItemText 
                        primary={item}
                        primaryTypographyProps={{ 
                          color: "#fff",
                          ...globalFontStyle
                        }}
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            </div>
          ) : null;
        }
        return null;
    }
  };

  // Render right content sections based on current order
  const renderRightContentSections = () => {
    return rightSectionOrder.map(sectionId => {
      switch (sectionId) {
        case 'profile':
          return savedSummary ? (
            <div key="profile" className="resume-section">
              <Box mb={sectionSpacing}>
                <Typography
                  variant="h6"
                  sx={{ 
                    bgcolor: theme.primary, 
                    color: "#fff", 
                    px: 1, 
                    py: 0.5,
                    ...globalFontStyle,
                    fontSize: headingSize
                  }}
                >
                  PROFILE
                </Typography>
                <Typography sx={{ 
                  mt: 1,
                  ...globalFontStyle,
                  textIndent: `${paragraphIndent}px`
                }}>{savedSummary}</Typography>
              </Box>
            </div>
          ) : null;

        case 'workExperience':
          return (
            <div key="workExperience" className="resume-section">
              <Box mb={paragraphSpacing}>
                <Typography
                  variant="h6"
                  sx={{ 
                    bgcolor: theme.primary, 
                    color: "#fff", 
                    px: 1, 
                    py: 0.5,
                    ...globalFontStyle,
                    fontSize: headingSize
                  }}
                >
                  WORK EXPERIENCE
                </Typography>

                {workExperiences && workExperiences.length > 0 ? (
                  workExperiences.map((work, i) => (
                    <Box key={i} mt={2}>
                      <Typography fontWeight="bold" sx={{ ...globalFontStyle, fontSize: `calc(${fontSize} * 1.1)` }}>
                        {work.jobTitle} at {work.employer}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={globalFontStyle}>
                        {formatDate(work.startMonth, work.startYear)} -{" "}
                        {work.current ? "Present" : formatDate(work.endMonth, work.endYear)}
                      </Typography>
                      {work.description && (
                        <Box
                          sx={{
                            mt: 1,
                            "& strong": { fontWeight: "bold", ...globalFontStyle },
                            "& em": { fontStyle: "italic", ...globalFontStyle },
                            "& u": { textDecoration: "underline", ...globalFontStyle },
                            ...globalFontStyle,
                            textIndent: `${paragraphIndent}px`
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
                  ))
                ) : (
                  <>
                    <Box mt={2}>
                      <Typography fontWeight="bold" sx={{ ...globalFontStyle, fontSize: `calc(${fontSize} * 1.1)` }}>
                        Senior Web Developer at Wardiere Inc.
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={globalFontStyle}>
                        October 2019 - Current
                      </Typography>
                      <ul style={{ ...globalFontStyle, paddingLeft: '20px', textIndent: '0' }}>
                        <li>Editing, authoring, or developing website content.</li>
                        <li>Backup files from websites to local folders.</li>
                        <li>Identifying and resolving consumer feedback issues.</li>
                        <li>Evaluating code to guarantee compliance.</li>
                        <li>Analyzing technical requirements to determine user needs.</li>
                      </ul>
                    </Box>

                    <Box mt={2}>
                      <Typography fontWeight="bold" sx={{ ...globalFontStyle, fontSize: `calc(${fontSize} * 1.1)` }}>
                        Web Developer at Studio Shodwe
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={globalFontStyle}>
                        February 2015 - September 2019
                      </Typography>
                      <ul style={{ ...globalFontStyle, paddingLeft: '20px', textIndent: '0' }}>
                        <li>Creating and maintaining websites/software apps.</li>
                        <li>
                          Using scripting or writing languages, management tools, and
                          digital media.
                        </li>
                        <li>
                          Meeting with teams to resolve problems and define solutions.
                        </li>
                        <li>Directing or conducting website updates.</li>
                      </ul>
                    </Box>
                  </>
                )}
              </Box>
            </div>
          );

        case 'accomplishments':
          return savedAccomplishments.length > 0 ? (
            <div key="accomplishments" className="resume-section">
              <Box mb={sectionSpacing}>
                <Typography
                  variant="h6"
                  sx={{ 
                    bgcolor: theme.primary, 
                    color: "#fff", 
                    px: 1, 
                    py: 0.5,
                    ...globalFontStyle,
                    fontSize: headingSize
                  }}
                >
                  ACCOMPLISHMENTS
                </Typography>
                <List dense>
                  {savedAccomplishments.map((acc, i) => (
                    <ListItem key={i} sx={{ py: 0 }}>
                      <ListItemText 
                        primary={acc}
                        primaryTypographyProps={{ ...globalFontStyle }}
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            </div>
          ) : null;

        case 'softwareSkills':
          return softwareSkills.length > 0 ? (
            <div key="softwareSkills" className="resume-section">
              <Box mb={sectionSpacing}>
                <Typography
                  variant="h6"
                  sx={{ 
                    bgcolor: theme.primary, 
                    color: "#fff", 
                    px: 1, 
                    py: 0.5,
                    ...globalFontStyle,
                    fontSize: headingSize
                  }}
                >
                  SOFTWARE SKILLS
                </Typography>
                <List dense>
                  {softwareSkills.map((skill, i) => (
                    <ListItem key={i} sx={{ py: 0 }}>
                      <ListItemText 
                        primary={`${skill.name} - ${skill.level}%`}
                        primaryTypographyProps={{ ...globalFontStyle }}
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            </div>
          ) : null;

        case 'certifications':
          return savedCertifications.length > 0 ? (
            <div key="certifications" className="resume-section">
              <Box mb={3}>
                <Typography
                  variant="h6"
                  sx={{ 
                    bgcolor: theme.primary, 
                    color: "#fff", 
                    px: 1, 
                    py: 0.5,
                    ...globalFontStyle,
                    fontSize: headingSize
                  }}
                >
                  CERTIFICATIONS
                </Typography>
                <List dense>
                  {savedCertifications.map((cert, i) => (
                    <ListItem key={i} sx={{ py: 0 }}>
                      <ListItemText 
                        primary={`${cert.name} - ${cert.provider} (${cert.year})`}
                        primaryTypographyProps={{ ...globalFontStyle }}
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            </div>
          ) : null;

        case 'volunteering':
          return savedVolunteering.length > 0 ? (
            <div key="volunteering" className="resume-section">
              <Box mb={sectionSpacing}>
                <Typography
                  variant="h6"
                  sx={{ 
                    bgcolor: theme.primary, 
                    color: "#fff", 
                    px: 1, 
                    py: 0.5,
                    ...globalFontStyle,
                    fontSize: headingSize
                  }}
                >
                  VOLUNTEERING
                </Typography>
                {savedVolunteering.map((vol, i) => (
                  <Box key={i} mt={2}>
                    <Typography fontWeight="bold" sx={{ ...globalFontStyle, fontSize: `calc(${fontSize} * 1.1)` }}>{vol.subtopic}</Typography>
                    <Typography variant="body2" color="text.secondary" sx={globalFontStyle}>
                      {vol.fromDate} - {vol.toDate}
                    </Typography>
                    <Typography sx={{ 
                      mt: 1,
                      ...globalFontStyle,
                      textIndent: `${paragraphIndent}px`
                    }}>{vol.content}</Typography>
                  </Box>
                ))}
              </Box>
            </div>
          ) : null;

        case 'websites':
          return savedWebsites.length > 0 ? (
            <div key="websites" className="resume-section">
              <Box mb={sectionSpacing}>
                <Typography
                  variant="h6"
                  sx={{ 
                    bgcolor: theme.primary, 
                    color: "#fff", 
                    px: 1, 
                    py: 0.5,
                    ...globalFontStyle,
                    fontSize: headingSize
                  }}
                >
                  WEBSITES & PROFILES
                </Typography>
                <List dense>
                  {savedWebsites.map((site, i) => (
                    <ListItem key={i} sx={{ py: 0 }}>
                      <ListItemText 
                        primary={site.url}
                        primaryTypographyProps={{ ...globalFontStyle }}
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            </div>
          ) : null;

        case 'additionalInfo':
          return savedAdditionalInfo.length > 0 ? (
            <div key="additionalInfo" className="resume-section">
              <Box mb={sectionSpacing}>
                <Typography
                  variant="h6"
                  sx={{ 
                    bgcolor: theme.primary, 
                    color: "#fff", 
                    px: 1, 
                    py: 0.5,
                    ...globalFontStyle,
                    fontSize: headingSize
                  }}
                >
                  ADDITIONAL INFORMATION
                </Typography>
                <List dense>
                  {savedAdditionalInfo.map((info, i) => (
                    <ListItem key={i} sx={{ py: 0 }}>
                      <ListItemText 
                        primary={info}
                        primaryTypographyProps={{ ...globalFontStyle }}
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            </div>
          ) : null;

        default:
          // Handle sections moved from left side
          return renderLeftSectionsForRightContent(sectionId);
      }
    }).filter(Boolean);
  };

  // Render left sections for right content (when moved from left to right)
  const renderLeftSectionsForRightContent = (sectionId) => {
    switch (sectionId) {
      case 'contact':
        return (
          <div key="contact" className="resume-section">
            <Box mb={sectionSpacing}>
              <Typography
                variant="h6"
                sx={{ 
                  bgcolor: theme.primary, 
                  color: "#fff", 
                  px: 1, 
                  py: 0.5,
                  ...globalFontStyle,
                  fontSize: headingSize
                }}
              >
                CONTACT
              </Typography>
              <Box textAlign="center" mt={1}>
                <Avatar
                  src={photo || "/profile.jpg"}
                  alt="profile"
                  sx={{ width: 120, height: 120, mx: "auto", mb: 2 }}
                />
              </Box>
              <List>
                <ListItem sx={{ py: 0 }}>
                  <ListItemText
                    primary="PHONE:"
                    secondary={data.phone}
                    primaryTypographyProps={{ 
                      fontWeight: "bold",
                      ...globalFontStyle
                    }}
                    secondaryTypographyProps={{ ...globalFontStyle }}
                  />
                </ListItem>
                <ListItem sx={{ py: 0 }}>
                  <ListItemText
                    primary="EMAIL:"
                    secondary={data.email}
                    primaryTypographyProps={{ 
                      fontWeight: "bold",
                      ...globalFontStyle
                    }}
                    secondaryTypographyProps={{ ...globalFontStyle }}
                  />
                </ListItem>
                <ListItem sx={{ py: 0 }}>
                  <ListItemText
                    primary="LOCATION:"
                    secondary={data.city}
                    primaryTypographyProps={{ 
                      fontWeight: "bold",
                      ...globalFontStyle
                    }}
                    secondaryTypographyProps={{ ...globalFontStyle }}
                  />
                </ListItem>
                <ListItem sx={{ py: 0 }}>
                  <ListItemText
                    primary="WEBSITE:"
                    secondary={data.website}
                    primaryTypographyProps={{ 
                      fontWeight: "bold",
                      ...globalFontStyle
                    }}
                    secondaryTypographyProps={{ ...globalFontStyle }}
                  />
                </ListItem>
              </List>
            </Box>
          </div>
        );

      case 'skills':
        return (
          <div key="skills" className="resume-section">
            <Box mb={sectionSpacing}>
              <Typography
                variant="h6"
                sx={{ 
                  bgcolor: theme.primary, 
                  color: "#fff", 
                  px: 1, 
                  py: 0.5,
                  ...globalFontStyle,
                  fontSize: headingSize
                }}
              >
                SKILLS
              </Typography>
              <List dense>
                {savedSkills.length > 0 ? (
                  savedSkills.map((skill, i) => (
                    <ListItem key={i} sx={{ py: 0 }}>
                      <ListItemText 
                        primary={`${skill.name} (${skill.rating || 0}%)`}
                        primaryTypographyProps={{ ...globalFontStyle }}
                      />
                    </ListItem>
                  ))
                ) : (
                  [
                    "Front-end Coding",
                    "User Interface/User Experience",
                    "Custom Databases",
                    "Programming",
                    "Web Design",
                    "Multiplatform Mobile App Development",
                  ].map((skill, i) => (
                    <ListItem key={i} sx={{ py: 0 }}>
                      <ListItemText 
                        primary={skill}
                        primaryTypographyProps={{ ...globalFontStyle }}
                      />
                    </ListItem>
                  ))
                )}
              </List>
            </Box>
          </div>
        );

      case 'education':
        return (
          <div key="education" className="resume-section">
            <Box mb={sectionSpacing}>
              <Typography
                variant="h6"
                sx={{ 
                  bgcolor: theme.primary, 
                  color: "#fff", 
                  px: 1, 
                  py: 0.5,
                  ...globalFontStyle,
                  fontSize: headingSize
                }}
              >
                EDUCATION
              </Typography>
              {educationEntries.length > 0 ? (
                educationEntries.map((edu) => (
                  <Box key={edu.id} sx={{ mb: 2, mt: 1 }}>
                    <Typography sx={{ 
                      fontWeight: "bold",
                      ...globalFontStyle
                    }}>
                      {edu.degree} - {edu.fieldOfStudy}
                    </Typography>
                    <Typography sx={{ ...globalFontStyle }}>
                      {edu.schoolName}, {edu.schoolLocation}
                    </Typography>
                    <Typography sx={{ 
                      fontStyle: "italic",
                      ...globalFontStyle
                    }}>
                      {formatDate(edu.gradMonth, edu.gradYear)}
                    </Typography>
                    {edu.additionalCoursework && (
                      <Typography sx={{ ...globalFontStyle }}>{edu.additionalCoursework}</Typography>
                    )}
                  </Box>
                ))
              ) : (
                <Box mt={1}>
                  <Typography fontWeight="bold" sx={{ ...globalFontStyle }}>
                    Master of Science (2016)
                  </Typography>
                  <Typography sx={{ ...globalFontStyle }}>Fradel and Spies University</Typography>
                  <Typography fontWeight="bold" mt={1} sx={{ ...globalFontStyle }}>
                    Bachelor of Information Technology (2014)
                  </Typography>
                  <Typography sx={{ ...globalFontStyle }}>Borcelle University</Typography>
                </Box>
              )}
            </Box>
          </div>
        );

      case 'languages':
        return savedLanguages.length > 0 ? (
          <div key="languages" className="resume-section">
            <Box mb={sectionSpacing}>
              <Typography
                variant="h6"
                sx={{ 
                  bgcolor: theme.primary, 
                  color: "#fff", 
                  px: 1, 
                  py: 0.5,
                  ...globalFontStyle,
                  fontSize: headingSize
                }}
              >
                LANGUAGES
              </Typography>
              <List dense>
                {savedLanguages.map((lang, i) => (
                  <ListItem key={i} sx={{ py: 0 }}>
                    <ListItemText 
                      primary={`${lang.name}${lang.level ? ` - ${lang.level}` : ''}`}
                      primaryTypographyProps={{ ...globalFontStyle }}
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          </div>
        ) : null;

      case 'interests':
        return savedInterests.length > 0 ? (
          <div key="interests" className="resume-section">
            <Box mb={sectionSpacing}>
              <Typography
                variant="h6"
                sx={{ 
                  bgcolor: theme.primary, 
                  color: "#fff", 
                  px: 1, 
                  py: 0.5,
                  ...globalFontStyle,
                  fontSize: headingSize
                }}
              >
                INTERESTS
              </Typography>
              <List dense>
                {savedInterests.map((interest, i) => (
                  <ListItem key={i} sx={{ py: 0 }}>
                    <ListItemText 
                      primary={interest}
                      primaryTypographyProps={{ ...globalFontStyle }}
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          </div>
        ) : null;

      case 'reference':
        return (
          <div key="reference" className="resume-section">
            <Box mb={sectionSpacing}>
              <Typography
                variant="h6"
                sx={{ 
                  bgcolor: theme.primary, 
                  color: "#fff", 
                  px: 1, 
                  py: 0.5,
                  ...globalFontStyle,
                  fontSize: headingSize
                }}
              >
                REFERENCE
              </Typography>
              {savedReferences.length > 0 ? (
                savedReferences.map((ref, i) => (
                  <Typography key={i} variant="body2" mt={1} sx={{ ...globalFontStyle }}>
                    {ref}
                  </Typography>
                ))
              ) : (
                <Typography variant="body2" mt={1} sx={{ ...globalFontStyle }}>
                  Sacha Dubois <br />
                  CEO Wardiere Inc. <br />
                  <strong>Email:</strong> hello@reallygreatsite.com
                </Typography>
              )}
            </Box>
          </div>
        );

      default:
        // Handle custom sections
        if (sectionId.startsWith('custom_')) {
          const customSectionName = sectionId.replace('custom_', '');
          const items = customSections[customSectionName] || [];
          return items.length > 0 ? (
            <div key={sectionId} className="resume-section">
              <Box mb={sectionSpacing}>
                <Typography
                  variant="h6"
                  sx={{ 
                    bgcolor: theme.primary, 
                    color: "#fff", 
                    px: 1, 
                    py: 0.5,
                    ...globalFontStyle,
                    fontSize: headingSize
                  }}
                >
                  {customSectionName.toUpperCase()}
                </Typography>
                <List dense>
                  {items.map((item, i) => (
                    <ListItem key={i} sx={{ py: 0 }}>
                      <ListItemText 
                        primary={item}
                        primaryTypographyProps={{ ...globalFontStyle }}
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            </div>
          ) : null;
        }
        return null;
    }
  };

  // Fixed pagination function with useCallback
  const paginateContent = useCallback(() => {
    if (!mainContentRef.current || !sidebarContentRef.current) return;

    const mainSections = Array.from(mainContentRef.current.querySelectorAll('.resume-section'));
    const sidebarSections = Array.from(sidebarContentRef.current.querySelectorAll('.sidebar-section'));
    
    // Convert page height from mm to pixels (1mm ≈ 3.78px for print)
    const pageHeightInPx = parseFloat(page.height.replace('mm', '')) * 3.78;
    const mainAvailableHeight = pageHeightInPx - (2 * topBottomMargin);
    const sidebarAvailableHeight = pageHeightInPx - (2 * topBottomMargin);

    let newPages = [];
    
    // Process main content sections
    let currentMainSections = [];
    let currentMainHeight = 0;
    
    mainSections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      
      // If adding this section would exceed page height, start a new page
      if (currentMainHeight + sectionHeight > mainAvailableHeight && currentMainSections.length > 0) {
        newPages.push({
          main: [...currentMainSections],
          sidebar: []
        });
        currentMainSections = [section];
        currentMainHeight = sectionHeight;
      } else {
        currentMainSections.push(section);
        currentMainHeight += sectionHeight;
      }
    });
    
    // Add remaining main sections to the last page
    if (currentMainSections.length > 0) {
      newPages.push({
        main: [...currentMainSections],
        sidebar: []
      });
    }
    
    // Process sidebar content and distribute across pages
    let remainingSidebarSections = [...sidebarSections];
    
    newPages.forEach((page, pageIndex) => {
      let currentSidebarHeight = 0;
      let pageSidebarSections = [];
      
      // Add sidebar sections that fit on this page
      for (let i = 0; i < remainingSidebarSections.length; i++) {
        const section = remainingSidebarSections[i];
        const sectionHeight = section.offsetHeight;
        
        if (currentSidebarHeight + sectionHeight <= sidebarAvailableHeight) {
          pageSidebarSections.push(section);
          currentSidebarHeight += sectionHeight;
          remainingSidebarSections.splice(i, 1);
          i--; // Adjust index after removal
        }
      }
      
      page.sidebar = pageSidebarSections;
    });
    
    // Create additional pages for any remaining sidebar content
    while (remainingSidebarSections.length > 0) {
      let currentSidebarHeight = 0;
      let pageSidebarSections = [];
      
      for (let i = 0; i < remainingSidebarSections.length; i++) {
        const section = remainingSidebarSections[i];
        const sectionHeight = section.offsetHeight;
        
        if (currentSidebarHeight + sectionHeight <= sidebarAvailableHeight) {
          pageSidebarSections.push(section);
          currentSidebarHeight += sectionHeight;
          remainingSidebarSections.splice(i, 1);
          i--;
        }
      }
      
      newPages.push({
        main: [],
        sidebar: pageSidebarSections
      });
    }
    
    // Ensure we have at least one page
    if (newPages.length === 0) {
      newPages.push({ main: [], sidebar: [] });
    }
    
    setPages(newPages);
  }, [topBottomMargin, page.height]);

  // Fixed useEffect for pagination
  useEffect(() => {
    paginateContent();
  }, [paginateContent]);

  // Separate useEffect for responsive pagination with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      paginateContent();
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [
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
    paragraphIndent,
    lineWeight,
    pageSize,
  ]);

  const renderSidebarContentToMeasure = () => (
    <Box ref={sidebarContentRef} sx={{ 
      visibility: 'hidden', 
      position: 'absolute', 
      top: '-9999px',
      fontFamily: font,
      fontSize: fontSize,
      fontStyle: fontStyle,
      lineHeight: `${lineSpacing}px`,
      '& *': {
        fontFamily: `${font} !important`,
        fontSize: `${fontSize} !important`,
        fontStyle: `${fontStyle} !important`,
        lineHeight: `${lineSpacing}px !important`,
      }
    }}>
      <Box sx={{ 
        p: 3, 
        width: "100%", 
        color: "#fff",
        fontFamily: font,
        fontSize: fontSize,
        fontStyle: fontStyle,
        lineHeight: `${lineSpacing}px`,
      }}>
        {renderSidebarSections()}
      </Box>
    </Box>
  );

  const renderSidebar = (sidebarSections = []) => {
    return (
      <Box
        sx={{
          bgcolor: color,
          color: "#fff",
          width: "35%",
          p: 3,
          display: "flex",
          flexDirection: "column",
          minHeight: page.height,
          fontFamily: font,
          fontSize: fontSize,
          fontStyle: fontStyle,
          lineHeight: `${lineSpacing}px`,
          '& *': {
            fontFamily: `${font} !important`,
            fontSize: `${fontSize} !important`,
            fontStyle: `${fontStyle} !important`,
            lineHeight: `${lineSpacing}px !important`,
          },
          "@media print": {
            bgcolor: color,
            color: "#fff",
            p: 3,
            width: "35%",
            display: "inline-block",
            verticalAlign: "top",
            WebkitPrintColorAdjust: "exact",
            printColorAdjust: "exact",
            minHeight: page.height,
            fontFamily: font,
            fontSize: fontSize,
            fontStyle: fontStyle,
            lineHeight: `${lineSpacing}px`,
            '& *': {
              fontFamily: `${font} !important`,
              fontSize: `${fontSize} !important`,
              fontStyle: `${fontStyle} !important`,
              lineHeight: `${lineSpacing}px !important`,
            },
          },
        }}
      >
        {sidebarSections.length > 0 ? (
          <div dangerouslySetInnerHTML={{ __html: sidebarSections.map(s => s.outerHTML).join('') }} />
        ) : (
          <Box sx={{ minHeight: "100%" }} />
        )}
      </Box>
    );
  };

  const renderMainContentToMeasure = () => (
    <Box ref={mainContentRef} sx={{ 
      visibility: 'hidden', 
      position: 'absolute', 
      top: '-9999px',
      fontFamily: font,
      fontSize: fontSize,
      fontStyle: fontStyle,
      lineHeight: `${lineSpacing}px`,
      '& *': {
        fontFamily: `${font} !important`,
        fontSize: `${fontSize} !important`,
        fontStyle: `${fontStyle} !important`,
        lineHeight: `${lineSpacing}px !important`,
      }
    }}>
      <Box sx={{ 
        p: `${topBottomMargin}px ${sideMargins}px`, 
        width: "65%",
        fontFamily: font,
        fontSize: fontSize,
        fontStyle: fontStyle,
        lineHeight: `${lineSpacing}px`,
      }}>
        {/* Header - Always on first page */}
        <div className="resume-section">
          <Typography variant="h3" fontWeight="bold" sx={{ 
            fontSize: headingSize,
            fontFamily: font,
            fontStyle: fontStyle,
          }}>
            {data.firstName} {data.lastName}
          </Typography>
          <Typography variant="h6" sx={{ 
            mb: 3, 
            fontSize: fontSize,
            fontFamily: font,
            fontStyle: fontStyle,
            lineHeight: `${lineSpacing}px`,
          }}>
            {data.currentPosition}
          </Typography>
        </div>

        {renderRightContentSections()}
      </Box>
    </Box>
  );

  const renderMainContent = (mainSections = []) => {
    return (
      <Box
        sx={{
          p: `${topBottomMargin}px ${sideMargins}px`,
          width: "65%",
          fontFamily: font,
          fontSize: fontSize,
          fontStyle: fontStyle,
          lineHeight: `${lineSpacing}px`,
          '& *': {
            fontFamily: `${font} !important`,
            fontSize: `${fontSize} !important`,
            fontStyle: `${fontStyle} !important`,
            lineHeight: `${lineSpacing}px !important`,
          },
          "@media print": { 
            p: `${topBottomMargin}px ${sideMargins}px`,
            fontFamily: font,
            fontSize: fontSize,
            fontStyle: fontStyle,
            lineHeight: `${lineSpacing}px`,
            '& *': {
              fontFamily: `${font} !important`,
              fontSize: `${fontSize} !important`,
              fontStyle: `${fontStyle} !important`,
              lineHeight: `${lineSpacing}px !important`,
            },
          },
        }}
      >
        {mainSections.length > 0 ? (
          <div dangerouslySetInnerHTML={{ __html: mainSections.map(s => s.outerHTML).join('') }} />
        ) : (
          <Box sx={{ minHeight: "100%" }} />
        )}
      </Box>
    );
  };

  return (
    <Box sx={{ 
      width: "100%", 
      position: "relative", 
      m: 5,
      fontFamily: font,
      fontSize: fontSize,
      fontStyle: fontStyle,
      lineHeight: `${lineSpacing}px`,
    }}>
      {!exporting && (
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          mb: 2, 
          gap: 2, 
          '@media print': { display: 'none' } 
        }}>
          <IconButton onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))} disabled={currentPage === 0} color="primary"><ChevronLeft /></IconButton>
          <Typography sx={{ mx: 2, ...globalFontStyle }}>Page {currentPage + 1} of {Math.max(1, pages.length)}</Typography>
          <IconButton onClick={() => setCurrentPage(prev => Math.min(pages.length - 1, prev + 1))} disabled={currentPage === Math.max(0, pages.length - 1)} color="primary"><ChevronRight /></IconButton> 

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
      {renderSidebarContentToMeasure()}
      
      <Box id="resume-container">
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
                fontFamily: font,
                fontSize: fontSize,
                fontStyle: fontStyle,
                lineHeight: `${lineSpacing}px`,
                display: "flex",
                flexDirection: "row",
                pageBreakAfter: "always",
                '& *': {
                  fontFamily: `${font} !important`,
                  fontSize: `${fontSize} !important`,
                  fontStyle: `${fontStyle} !important`,
                  lineHeight: `${lineSpacing}px !important`,
                },
                "@media print": {
                  width: page.width,
                  height: "auto",
                  minHeight: page.height,
                  boxShadow: "none",
                  m: 0,
                  pageBreakAfter: "always",
                  fontFamily: font,
                  fontSize: fontSize,
                  fontStyle: fontStyle,
                  lineHeight: `${lineSpacing}px`,
                  '& *': {
                    fontFamily: `${font} !important`,
                    fontSize: `${fontSize} !important`,
                    fontStyle: `${fontStyle} !important`,
                    lineHeight: `${lineSpacing}px !important`,
                  },
                },
                // Show all pages when exporting, only current page when viewing
                display: exporting ? 'flex' : (index === currentPage ? 'flex' : 'none'),
                '@media print': { display: 'flex' }
              }}
            >
              {renderSidebar(pageContent.sidebar)}
              {renderMainContent(pageContent.main)}
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
              fontFamily: font,
              fontSize: fontSize,
              fontStyle: fontStyle,
              lineHeight: `${lineSpacing}px`,
              display: "flex",
              flexDirection: "row",
              '& *': {
                fontFamily: `${font} !important`,
                fontSize: `${fontSize} !important`,
                fontStyle: `${fontStyle} !important`,
                lineHeight: `${lineSpacing}px !important`,
              },
              "@media print": {
                width: page.width,
                height: "auto",
                minHeight: page.height,
                boxShadow: "none",
                m: 0,
                fontFamily: font,
                fontSize: fontSize,
                fontStyle: fontStyle,
                lineHeight: `${lineSpacing}px`,
                '& *': {
                  fontFamily: `${font} !important`,
                  fontSize: `${fontSize} !important`,
                  fontStyle: `${fontStyle} !important`,
                  lineHeight: `${lineSpacing}px !important`,
                },
              },
            }}
          >
            {renderSidebar()}
            {renderMainContent()}
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
          <Typography variant="body2" color="textSecondary" sx={{ mb: 3, ...globalFontStyle }}>
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

export default Resume4;