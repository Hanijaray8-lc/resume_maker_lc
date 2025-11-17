import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Grid, Box, Typography, List, ListItem, Divider, IconButton, Button, Dialog, DialogTitle, DialogContent, DialogActions, Paper } from '@mui/material';
import { styled } from '@mui/system';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { ChevronLeft, ChevronRight, Print, Download, DragIndicator, Reorder } from '@mui/icons-material';

// --- Styled Components for Consistent Theming ---

const HeaderContainer = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  paddingBottom: '20px',
  borderBottom: '1px solid #e0e0e0',
  marginBottom: '30px',
});

const NameTitle = styled(Typography)(({ color, font, fontSize, fontStyle, lineHeight }) => ({
  fontFamily: font || 'Montserrat, sans-serif',
  fontWeight: 800,
  lineHeight: lineHeight || 1.1,
  color: color || '#333',
  textTransform: 'uppercase',
  fontSize: fontSize || '2.5rem',
  fontStyle: fontStyle || 'normal',
}));

const ContactInfoItem = styled(Box)(({ color, font, fontSize, fontStyle, lineHeight }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: '5px',
  fontFamily: font || 'Arial, sans-serif',
  color: color || '#555',
  fontSize: fontSize || '14px',
  fontStyle: fontStyle || 'normal',
  lineHeight: lineHeight || '20px',
  '& .MuiSvgIcon-root': {
    fontSize: '0.9rem',
    marginRight: '8px',
    color: 'inherit',
  },
}));

const MainSectionHeader = styled(Typography)(({ headerColor, font, fontSize, fontStyle, lineHeight }) => ({
  fontFamily: font || 'Montserrat, sans-serif',
  fontWeight: 700,
  fontSize: fontSize || '1.1rem',
  color: headerColor || '#333',
  textTransform: 'uppercase',
  position: 'relative',
  marginBottom: '15px',
  paddingLeft: '20px',
  fontStyle: fontStyle || 'normal',
  lineHeight: lineHeight || 'normal',
  '&::before': {
    content: '""',
    position: 'absolute',
    left: 0,
    top: '50%',
    transform: 'translateY(-50%)',
    width: '10px',
    height: '10px',
    backgroundColor: headerColor || '#333',
    borderRadius: '2px',
  },
}));

const SidebarSectionHeader = styled(Typography)(({ headerColor, font, fontSize, fontStyle, lineHeight }) => ({
  fontFamily: font || 'Montserrat, sans-serif',
  fontWeight: 700,
  fontSize: fontSize || '1rem',
  color: headerColor || '#fff',
  textTransform: 'uppercase',
  marginBottom: '15px',
  fontStyle: fontStyle || 'normal',
  lineHeight: lineHeight || 'normal',
}));

// Page size mapping
const pageSizeMap = {
  A4: { width: "210mm", height: "297mm" },
  Letter: { width: "216mm", height: "279mm" },
  Legal: { width: "216mm", height: "356mm" },
  A3: { width: "297mm", height: "420mm" },
  Executive: { width: "184mm", height: "267mm" },
};

// Font size mapping
const fontSizeMap = {
  small: "12px",
  normal: "14px",
  medium: "16px",
  large: "18px"
};

// Font style mapping
const fontStyleMap = {
  normal: "normal",
  italic: "italic"
};

// Default data
const defaultData = {
  firstName: "RICHARD",
  lastName: "MORRISON",
  role: "GRAPHIC DESIGNER, ART DIRECTOR",
  phone: "+0 123 456 789 0",
  email: "richard@company.com",
  city: "STREET LOCATION, CITY, COUNTRY NAME",
  profile: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur sit amet quam ut tortor pellentesque semper at dapibus metus. Pellentesque finibus bibendum tellus ac imperdiet. Quisque semper pulvinar est, ac pretium justo pharetra a.",
};

// Separate section orders for left and right sides
const defaultLeftSectionOrder = [
  'contact',
  'education',
  'skills'
];

const defaultRightSectionOrder = [
  'profile',
  'workExperience',
  'languages',
  'accomplishments',
  'certifications',
  'softwareSkills',
  'volunteering',
  'interests',
  'websites',
  'references',
  'additionalInfo'
];

// --- Resume Component ---

const Resume20 = ({
  color = '#333',
  nameColor = '#333',
  sidebarBackground = '#333',
  headerBackground = '#fff',
  sidebarTextColor = '#fff',
  font = 'Arial, sans-serif',
  fontSize = '14px',
  fontStyle = 'normal',
  headingSize = '24px',
  sectionSpacing = 50,
  paragraphSpacing = 30,
  lineSpacing = 20,
  topBottomMargin = 40,
  sideMargins = 40,
  paragraphIndent = 0,
  lineWeight = 1,
  pageSize = 'A4',
  theme,
  formData = {},
  workExperiences = [],
  enableDragDrop = true,
  exporting = false,
}) => {
  // Get effective font size - FIXED to handle both string and object values
  const getBaseFontSize = () => {
    if (typeof fontSize === 'string') {
      const effective = fontSizeMap[fontSize] || fontSize || "14px";
      return parseInt(effective, 10);
    }
    return 14; // default fallback
  };

  // Get font size with multiplier
  const getFontSizeWithMultiplier = (multiplier = 1) => {
    const baseSize = getBaseFontSize();
    return `${baseSize * multiplier}px`;
  };

  // Get line height
  const getLineHeight = () => `${lineSpacing}px`;

  // Get heading size - FIXED to handle various input types
  const getHeadingSize = () => {
    if (typeof headingSize === 'string') {
      return headingSize;
    }
    return `${getBaseFontSize() * 1.7}px`; // Default multiplier for heading
  };

  // Get subheading size
  const getSubheadingSize = () => `${getBaseFontSize() * 1.2}px`;

  // Get font style
  const getFontStyle = () => {
    if (typeof fontStyle === 'string') {
      return fontStyleMap[fontStyle] || fontStyle;
    }
    return 'normal';
  };

  // Common text styles - APPLIED TO ENTIRE RESUME
  const textStyles = {
    fontFamily: font,
    fontSize: getFontSizeWithMultiplier(),
    fontStyle: getFontStyle(),
    lineHeight: getLineHeight(),
    textIndent: `${paragraphIndent}px`,
  };

  // Common heading styles
  const headingStyles = {
    ...textStyles,
    fontSize: getHeadingSize(),
    fontWeight: "bold",
  };

  // Common subheading styles
  const subheadingStyles = {
    ...textStyles,
    fontSize: getSubheadingSize(),
    fontWeight: "bold",
  };

  // State for pagination
  const [currentPage, setCurrentPage] = useState(0);
  const [pages, setPages] = useState([]);
  const mainContentRef = useRef(null);

  // Data states
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

  // Merge default data with form data
  const data = { ...defaultData, ...formData };
  const page = pageSizeMap[pageSize] || pageSizeMap.A4;
  
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
    sidebarText: sidebarTextColor,
  };

  // Load data from localStorage
  useEffect(() => {
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

    // Load custom sections like Resume9
    const userId = localStorage.getItem("userId");
    console.log("👤 Current userId:", userId);
    
    let sectionsData = {};

    if (userId) {
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
    const savedLeftSectionOrder = localStorage.getItem("resume20LeftSectionOrder");
    if (savedLeftSectionOrder) {
      const parsedOrder = JSON.parse(savedLeftSectionOrder);
      const filteredOrder = parsedOrder.filter(section => !section.startsWith('custom_'));
      setLeftSectionOrder(filteredOrder);
      console.log('🔄 Loaded left section order WITHOUT custom sections:', filteredOrder);
    } else {
      setLeftSectionOrder(defaultLeftSectionOrder);
    }

    const savedRightSectionOrder = localStorage.getItem("resume20RightSectionOrder");
    if (savedRightSectionOrder) {
      const parsedOrder = JSON.parse(savedRightSectionOrder);
      
      const currentCustomSectionIds = Object.keys(sectionsData).map(name => `custom_${name}`);
      const filteredOrder = parsedOrder.filter(section => !section.startsWith('custom_'));
      const allRightSections = [...filteredOrder, ...currentCustomSectionIds];
      
      setRightSectionOrder(allRightSections);
      console.log('🔄 Updated right section order with ONLY CURRENT custom sections:', allRightSections);
    } else {
      const currentCustomSectionIds = Object.keys(sectionsData).map(name => `custom_${name}`);
      const updatedRightSectionOrder = [...defaultRightSectionOrder, ...currentCustomSectionIds];
      setRightSectionOrder(updatedRightSectionOrder);
      console.log('🆕 Initial right section order with ONLY CURRENT custom sections:', updatedRightSectionOrder);
    }
  }, []);

  // Add this useEffect to automatically add/remove custom sections like Resume9
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId && Object.keys(customSections).length > 0) {
      const currentRightOrder = [...rightSectionOrder];
      let updated = false;
      
      const currentCustomSectionIds = Object.keys(customSections).map(name => `custom_${name}`);
      
      console.log("🔄 Processing CURRENT custom sections:", currentCustomSectionIds);
      
      const filteredRightOrder = currentRightOrder.filter(section => !section.startsWith('custom_'));
      const newRightOrder = [...filteredRightOrder, ...currentCustomSectionIds];
      
      if (JSON.stringify(newRightOrder) !== JSON.stringify(currentRightOrder)) {
        setRightSectionOrder(newRightOrder);
        localStorage.setItem("resume20RightSectionOrder", JSON.stringify(newRightOrder));
        console.log('📝 Final right section order with ONLY CURRENT custom sections:', newRightOrder);
      }
      
      const currentLeftOrder = [...leftSectionOrder];
      const filteredLeftOrder = currentLeftOrder.filter(section => !section.startsWith('custom_'));
      if (JSON.stringify(filteredLeftOrder) !== JSON.stringify(currentLeftOrder)) {
        setLeftSectionOrder(filteredLeftOrder);
        localStorage.setItem("resume20LeftSectionOrder", JSON.stringify(filteredLeftOrder));
        console.log('🗑️ Removed custom sections from left side:', filteredLeftOrder);
      }
      
    } else if (userId && Object.keys(customSections).length === 0) {
      const currentRightOrder = [...rightSectionOrder];
      const filteredRightOrder = currentRightOrder.filter(section => !section.startsWith('custom_'));
      
      if (filteredRightOrder.length !== currentRightOrder.length) {
        setRightSectionOrder(filteredRightOrder);
        localStorage.setItem("resume20RightSectionOrder", JSON.stringify(filteredRightOrder));
        console.log('🗑️ Removed all custom sections from right side (no current sections)');
      }
      
      const currentLeftOrder = [...leftSectionOrder];
      const filteredLeftOrder = currentLeftOrder.filter(section => !section.startsWith('custom_'));
      if (filteredLeftOrder.length !== currentLeftOrder.length) {
        setLeftSectionOrder(filteredLeftOrder);
        localStorage.setItem("resume20LeftSectionOrder", JSON.stringify(filteredLeftOrder));
        console.log('🗑️ Removed all custom sections from left side (no current sections)');
      }
    }
  }, [customSections]);

  // Save section orders to localStorage whenever they change
  useEffect(() => {
    if (leftSectionOrder.length > 0) {
      localStorage.setItem("resume20LeftSectionOrder", JSON.stringify(leftSectionOrder));
    }
  }, [leftSectionOrder]);

  useEffect(() => {
    if (rightSectionOrder.length > 0) {
      localStorage.setItem("resume20RightSectionOrder", JSON.stringify(rightSectionOrder));
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
      'profile': 'Profile',
      'workExperience': 'Work Experience',
      'languages': 'Languages',
      'accomplishments': 'Accomplishments',
      'certifications': 'Certifications',
      'softwareSkills': 'Software Skills',
      'volunteering': 'Volunteering',
      'interests': 'Interests',
      'websites': 'Websites',
      'references': 'References',
      'additionalInfo': 'Additional Information'
    };
    
    if (sectionId.startsWith('custom_')) {
      return sectionId.replace('custom_', '').toUpperCase();
    }
    
    return titles[sectionId] || sectionId;
  };

  // Render right section content (for both main content and sidebar)
  const renderRightSectionContent = (sectionId, inSidebar = false) => {
    const textColor = inSidebar ? palette.sidebarText : palette.textColor;

    const SectionHeader = ({ children, ...props }) =>
      inSidebar ? (
        <SidebarSectionHeader
          headerColor={palette.sidebarText}
          font={font}
          fontSize={getHeadingSize()}
          fontStyle={getFontStyle()}
          lineHeight={getLineHeight()}
          {...props}
        >
          {children}
        </SidebarSectionHeader>
      ) : (
        <MainSectionHeader 
          headerColor={palette.accentColor} 
          font={font}
          fontSize={getHeadingSize()}
          fontStyle={getFontStyle()}
          lineHeight={getLineHeight()}
          {...props}
        >
          {children}
        </MainSectionHeader>
      );

    switch (sectionId) {
      case 'profile':
        return (
          <Box key="profile" className="resume-section" sx={{ mb: sectionSpacing / 10, ...textStyles }}>
            <SectionHeader>
               PROFILE
            </SectionHeader>
            <Typography
              variant="body2"
              sx={{
                color: textColor,
                ...textStyles
              }}
            >
              {savedSummary || data.profile}
            </Typography>
          </Box>
        );

      case 'workExperience':
        return (
          <Box key="workExperience" className="resume-section" sx={{ mb: sectionSpacing / 10, ...textStyles }}>
            <SectionHeader>
              WORK EXPERIENCE
            </SectionHeader>
            
            {workExperiences && workExperiences.length > 0 ? (
              workExperiences.map((work, i) => (
                <Box key={i} sx={{ mb: paragraphSpacing / 10, ...textStyles }}>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      ...subheadingStyles,
                      color: textColor,
                    }}
                  >
                    {work.jobTitle}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      fontStyle: getFontStyle(),
                      color: inSidebar ? 'rgba(255,255,255,0.8)' : palette.lightText, 
                      ...textStyles
                    }}
                  >
                    {work.employer} ({formatDate(work.startMonth, work.startYear)} -{" "}
                    {work.current ? "Present" : formatDate(work.endMonth, work.endYear)})
                  </Typography>
                  {work.description && (
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: textColor, 
                        mt: paragraphSpacing / 10, 
                        ...textStyles
                      }}
                    >
                      {work.description}
                    </Typography>
                  )}
                </Box>
              ))
            ) : (
              <Box sx={{ mb: paragraphSpacing / 10, ...textStyles }}>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    ...subheadingStyles,
                    color: textColor,
                  }}
                >
                  GRAPHIC DESIGNER
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontStyle: getFontStyle(),
                    color: inSidebar ? 'rgba(255,255,255,0.8)' : palette.lightText, 
                    ...textStyles
                  }}
                >
                  Lorem Ipsum Digital Agency (2017-2019)
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: textColor, 
                    mt: paragraphSpacing / 10, 
                    ...textStyles
                  }}
                >
                  Curabitur sit amet quam ut tortor pellentesque semper at dapibus metus.
                </Typography>
              </Box>
            )}
          </Box>
        );

      case 'education':
        return educationEntries.length > 0 ? (
          <Box key="education" className="resume-section" sx={{ mb: sectionSpacing / 10, ...textStyles }}>
            <SectionHeader>
              EDUCATION
            </SectionHeader>
            {educationEntries.map((edu, index) => (
              <Box key={edu.id} sx={{ mb: index === educationEntries.length - 1 ? 0 : paragraphSpacing / 10, ...textStyles }}>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    ...subheadingStyles,
                    color: textColor,
                  }}
                >
                  {edu.degree} - {edu.fieldOfStudy}
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontStyle: getFontStyle(),
                    color: inSidebar ? 'rgba(255,255,255,0.8)' : palette.lightText, 
                    ...textStyles,
                  }}
                >
                  {edu.schoolName} ({formatDate(edu.gradMonth, edu.gradYear)})
                </Typography>
              </Box>
            ))}
          </Box>
        ) : null;

      case 'skills':
        return (
          <Box key="skills" className="resume-section" sx={{ mb: sectionSpacing / 10, ...textStyles }}>
            <SectionHeader>
              SKILLS
            </SectionHeader>
            <List sx={{ listStyleType: 'disc', pl: 2 }}>
              {savedSkills.length > 0 ? (
                savedSkills.map((skill, i) => (
                  <ListItem key={i} sx={{ display: 'list-item', p: 0, pl: 1, mb: paragraphSpacing / 20 }}>
                    <Typography 
                      sx={{ 
                        color: textColor, 
                        ...textStyles
                      }}
                    >
                      {skill.name} {skill.rating ? `(${skill.rating}%)` : ''}
                    </Typography>
                  </ListItem>
                ))
              ) : (
                <>
                  <ListItem sx={{ display: 'list-item', p: 0, pl: 1, mb: paragraphSpacing / 20 }}>
                    <Typography 
                      sx={{ 
                        color: textColor, 
                        ...textStyles
                      }}
                    >
                      Graphic Design
                    </Typography>
                  </ListItem>
                  <ListItem sx={{ display: 'list-item', p: 0, pl: 1, mb: paragraphSpacing / 20 }}>
                    <Typography 
                      sx={{ 
                        color: textColor, 
                        ...textStyles
                      }}
                    >
                      Leadership
                    </Typography>
                  </ListItem>
                  <ListItem sx={{ display: 'list-item', p: 0, pl: 1, mb: paragraphSpacing / 20 }}>
                    <Typography 
                      sx={{ 
                        color: textColor, 
                        ...textStyles
                      }}
                    >
                      Web Development
                    </Typography>
                  </ListItem>
                </>
              )}
            </List>
          </Box>
        );

      case 'languages':
        return savedLanguages.length > 0 ? (
          <Box key="languages" className="resume-section" sx={{ mb: sectionSpacing / 10, ...textStyles }}>
            <SectionHeader>
              LANGUAGES
            </SectionHeader>
            <List sx={{ listStyleType: 'disc', pl: 2 }}>
              {savedLanguages.map((lang, i) => (
                <ListItem key={i} sx={{ display: 'list-item', p: 0, pl: 1, mb: paragraphSpacing / 20 }}>
                  <Typography 
                    sx={{ 
                      color: textColor, 
                      ...textStyles
                    }}
                  >
                    {lang.name}{lang.level ? ` - ${lang.level}` : ''}
                  </Typography>
                </ListItem>
              ))}
            </List>
          </Box>
        ) : null;

      case 'accomplishments':
        return savedAccomplishments.length > 0 ? (
          <Box key="accomplishments" className="resume-section" sx={{ mb: sectionSpacing / 10, ...textStyles }}>
            <SectionHeader>
              ACCOMPLISHMENTS
            </SectionHeader>
            <List sx={{ listStyleType: 'disc', pl: 2 }}>
              {savedAccomplishments.map((acc, i) => (
                <ListItem key={i} sx={{ display: 'list-item', p: 0, pl: 1, mb: paragraphSpacing / 20 }}>
                  <Typography 
                    sx={{ 
                      color: textColor, 
                      ...textStyles
                    }}
                  >
                    {acc}
                  </Typography>
                </ListItem>
              ))}
            </List>
          </Box>
        ) : null;

      case 'certifications':
        return savedCertifications.length > 0 ? (
          <Box key="certifications" className="resume-section" sx={{ mb: sectionSpacing / 10, ...textStyles }}>
            <SectionHeader>
              CERTIFICATIONS
            </SectionHeader>
            <List sx={{ listStyleType: 'disc', pl: 2 }}>
              {savedCertifications.map((cert, i) => (
                <ListItem key={i} sx={{ display: 'list-item', p: 0, pl: 1, mb: paragraphSpacing / 20 }}>
                  <Typography 
                    sx={{ 
                      color: textColor, 
                      ...textStyles
                    }}
                  >
                    {cert.name} - {cert.provider} ({cert.year})
                  </Typography>
                </ListItem>
              ))}
            </List>
          </Box>
        ) : null;

      case 'softwareSkills':
        return softwareSkills.length > 0 ? (
          <Box key="softwareSkills" className="resume-section" sx={{ mb: sectionSpacing / 10, ...textStyles }}>
            <SectionHeader>
              SOFTWARE SKILLS
            </SectionHeader>
            <List sx={{ listStyleType: 'disc', pl: 2 }}>
              {softwareSkills.map((skill, i) => (
                <ListItem key={i} sx={{ display: 'list-item', p: 0, pl: 1, mb: paragraphSpacing / 20 }}>
                  <Typography 
                    sx={{ 
                      color: textColor, 
                      ...textStyles
                    }}
                  >
                    {skill.name} - {skill.level}%
                  </Typography>
                </ListItem>
              ))}
            </List>
          </Box>
        ) : null;

      case 'volunteering':
        return savedVolunteering.length > 0 ? (
          <Box key="volunteering" className="resume-section" sx={{ mb: sectionSpacing / 10, ...textStyles }}>
            <SectionHeader>
              VOLUNTEERING
            </SectionHeader>
            {savedVolunteering.map((vol, index) => (
              <Box key={index} sx={{ mb: paragraphSpacing / 10, ...textStyles }}>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    ...subheadingStyles,
                    color: textColor,
                  }}
                >
                  {vol.subtopic}
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontStyle: getFontStyle(),
                    color: inSidebar ? 'rgba(255,255,255,0.8)' : palette.lightText, 
                    ...textStyles
                  }}
                >
                  {vol.fromDate} - {vol.toDate}
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: textColor, 
                    mt: paragraphSpacing / 20, 
                    ...textStyles
                  }}
                >
                  {vol.content}
                </Typography>
              </Box>
            ))}
          </Box>
        ) : null;

      case 'interests':
        return savedInterests.length > 0 ? (
          <Box key="interests" className="resume-section" sx={{ mb: sectionSpacing / 10, ...textStyles }}>
            <SectionHeader>
              INTERESTS
            </SectionHeader>
            <List sx={{ listStyleType: 'disc', pl: 2 }}>
              {savedInterests.map((interest, i) => (
                <ListItem key={i} sx={{ display: 'list-item', p: 0, pl: 1, mb: paragraphSpacing / 20 }}>
                  <Typography 
                    sx={{ 
                      color: textColor, 
                      ...textStyles
                    }}
                  >
                    {interest}
                  </Typography>
                </ListItem>
              ))}
            </List>
          </Box>
        ) : null;

      case 'websites':
        return savedWebsites.length > 0 ? (
          <Box key="websites" className="resume-section" sx={{ mb: sectionSpacing / 10, ...textStyles }}>
            <SectionHeader>
              WEBSITES / PROFILES
            </SectionHeader>
            <List sx={{ listStyleType: 'disc', pl: 2 }}>
              {savedWebsites.map((site, i) => (
                <ListItem key={i} sx={{ display: 'list-item', p: 0, pl: 1, mb: paragraphSpacing / 20 }}>
                  <Typography 
                    sx={{ 
                      color: textColor, 
                      ...textStyles
                    }}
                  >
                    {site.url}
                  </Typography>
                </ListItem>
              ))}
            </List>
          </Box>
        ) : null;

      case 'references':
        return savedReferences.length > 0 ? (
          <Box key="references" className="resume-section" sx={{ mb: sectionSpacing / 10, ...textStyles }}>
            <SectionHeader>
              REFERENCES
            </SectionHeader>
            <List sx={{ listStyleType: 'disc', pl: 2 }}>
              {savedReferences.map((ref, i) => (
                <ListItem key={i} sx={{ display: 'list-item', p: 0, pl: 1, mb: paragraphSpacing / 20 }}>
                  <Typography 
                    sx={{ 
                      color: textColor, 
                      ...textStyles
                    }}
                  >
                    {ref}
                  </Typography>
                </ListItem>
              ))}
            </List>
          </Box>
        ) : null;

      case 'additionalInfo':
        return savedAdditionalInfo.length > 0 ? (
          <Box key="additionalInfo" className="resume-section" sx={{ mb: sectionSpacing / 10, ...textStyles }}>
            <SectionHeader>
              ADDITIONAL INFORMATION
            </SectionHeader>
            <List sx={{ listStyleType: 'disc', pl: 2 }}>
              {savedAdditionalInfo.map((info, i) => (
                <ListItem key={i} sx={{ display: 'list-item', p: 0, pl: 1, mb: paragraphSpacing / 20 }}>
                  <Typography 
                    sx={{ 
                      color: textColor, 
                      ...textStyles
                    }}
                  >
                    {info}
                  </Typography>
                </ListItem>
              ))}
            </List>
          </Box>
        ) : null;

      default:
        if (sectionId.startsWith('custom_')) {
          const customSectionName = sectionId.replace('custom_', '');
          const items = customSections[customSectionName] || [];
          
          console.log(`🎯 Rendering custom section: ${customSectionName}`, items);
          
          if (items && items.length > 0) {
            return (
              <Box key={sectionId} className="resume-section" sx={{ mb: sectionSpacing / 10, ...textStyles }}>
                <SectionHeader>
                  {customSectionName.toUpperCase()}
                </SectionHeader>
                <List sx={{ listStyleType: 'disc', pl: 2 }}>
                  {items.map((item, i) => (
                    <ListItem key={i} sx={{ display: 'list-item', p: 0, pl: 1, mb: paragraphSpacing / 20 }}>
                      <Typography 
                        sx={{ 
                          color: textColor, 
                          ...textStyles
                        }}
                      >
                        {item}
                      </Typography>
                    </ListItem>
                  ))}
                </List>
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
  const renderSidebarSections = (pageIndex) => {
    return leftSectionOrder.map(sectionId => {
      return renderRightSectionContent(sectionId, true);
    }).filter(Boolean);
  };

  // Render main content for measurement (hidden) - Resume9 style pagination
  const renderMainContentToMeasure = () => (
    <Box ref={mainContentRef} sx={{ visibility: 'hidden', position: 'absolute', ...textStyles }}>
      <Box sx={{ p: `${topBottomMargin}px ${sideMargins}px` }}>
        {rightSectionOrder.map(sectionId => renderRightSectionContent(sectionId, false)).filter(Boolean)}
      </Box>
    </Box>
  );

  // Pagination function - Resume9 style
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
  }, [page.height, topBottomMargin, rightSectionOrder]);

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
    rightSectionOrder,
  ]);

  // Render the current page based on pagination
  const renderCurrentPage = (pageIndex) => {
    if (pages.length === 0) {
      return renderFirstPage([], pageIndex);
    }
    
    return pageIndex === 0 ? renderFirstPage(pages[pageIndex], pageIndex) : renderSecondPage(pages[pageIndex], pageIndex);
  };

  // Render first page
  const renderFirstPage = (pageContent, pageIndex) => (
    <Box
      sx={{
        width: page.width,
        minHeight: page.height,
        maxHeight: page.height,
        mx: "auto",
        boxShadow: 4,
        bgcolor: palette.header,
        ...textStyles, // APPLY TEXT STYLES TO ENTIRE PAGE
        my: topBottomMargin / 10,
        p: `${topBottomMargin / 2}px ${sideMargins / 2}px`,
        border: `${lineWeight}px solid ${palette.accentColor}`,
        overflow: 'hidden',
        position: 'relative',
        display: exporting ? 'flex' : (pageIndex === currentPage ? 'flex' : 'none'),
        flexDirection: 'column',
        '@media print': {
          boxShadow: 'none',
          my: 0,
          border: 'none',
          maxHeight: 'none',
          pageBreakAfter: pages.length > 1 ? 'always' : 'avoid'
        }
      }}
    >
      {/* Header - NOW INCLUDES ALL DESIGN SETTINGS */}
      <Box sx={{ p: 4, pb: 2, ...textStyles }}>
        <Grid container alignItems="center">
          <Grid item xs={12} sm={8} sx={{ width: "70%" }}>
            <HeaderContainer>
              <Box sx={{ p: 1.5, mr: 2, backgroundColor: palette.accentColor, borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <PersonIcon sx={{ color: '#fff', fontSize: getFontSizeWithMultiplier(2.5) }} />
              </Box>
              <Box>
                <Box sx={{display:"flex"}}>
                <NameTitle 
                  color={palette.nameColor} 
                  font={font}
                  fontSize={getFontSizeWithMultiplier(2.5)}
                  fontStyle={getFontStyle()}
                  lineHeight={getLineHeight()}
                  variant="h4"
                >
                  {data.firstName}
                </NameTitle>
                <NameTitle 
                  color={palette.nameColor} 
                  font={font}
                  fontSize={getFontSizeWithMultiplier(2.5)}
                  fontStyle={getFontStyle()}
                  lineHeight={getLineHeight()}
                  variant="h4" 
                  sx={{ 
                    mt: -0.5,
                    ml: 1,
                  }}
                >
                  {data.lastName}
                </NameTitle>
                </Box>
                <Typography 
                  variant="subtitle1" 
                  sx={{ 
                    color: palette.lightText, 
                    mt: 0.5, 
                    fontFamily: font,
                    fontWeight: 500, 
                    letterSpacing: '1px',
                    fontSize: getFontSizeWithMultiplier(1.1),
                    fontStyle: getFontStyle(),
                    lineHeight: getLineHeight(),
                  }}
                >
                  {data.currentPosition || data.role}
                </Typography>
              </Box>
            </HeaderContainer>
          </Grid>
          <Grid item xs={12} sm={4} sx={{ textAlign: { xs: 'left', sm: 'right' }, width: "30%" }}>
            <ContactInfoItem 
              color={palette.accentColor} 
              font={font}
              fontSize={getFontSizeWithMultiplier()}
              fontStyle={getFontStyle()}
              lineHeight={getLineHeight()}
            >
              <EmailIcon />
              <Typography 
                variant="body2" 
                sx={{ 
                  color: palette.textColor, 
                  ...textStyles
                }}
              >
                {data.email}
              </Typography>
            </ContactInfoItem>
            <ContactInfoItem 
              color={palette.accentColor} 
              font={font}
              fontSize={getFontSizeWithMultiplier()}
              fontStyle={getFontStyle()}
              lineHeight={getLineHeight()}
            >
              <PhoneIcon />
              <Typography 
                variant="body2" 
                sx={{ 
                  color: palette.textColor, 
                  ...textStyles
                }}
              >
                {data.phone}
              </Typography>
            </ContactInfoItem>
            <ContactInfoItem 
              color={palette.accentColor} 
              font={font}
              fontSize={getFontSizeWithMultiplier()}
              fontStyle={getFontStyle()}
              lineHeight={getLineHeight()}
            >
              <LocationOnIcon />
              <Typography 
                variant="body2" 
                sx={{ 
                  color: palette.textColor, 
                  ...textStyles
                }}
              >
                {data.city}
              </Typography>
            </ContactInfoItem>
            {/* Websites */}
            {savedWebsites.length > 0 && savedWebsites.map((site, index) => (
              site.addToHeader && (
                <ContactInfoItem 
                  key={index} 
                  color={palette.accentColor} 
                  font={font}
                  fontSize={getFontSizeWithMultiplier()}
                  fontStyle={getFontStyle()}
                  lineHeight={getLineHeight()}
                >
                  <LocationOnIcon />
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: palette.textColor, 
                      ...textStyles
                    }}
                  >
                    {site.url}
                  </Typography>
                </ContactInfoItem>
              )
            ))}
          </Grid>
        </Grid>
      </Box>

      {/* Main Content & Sidebar */}
      <Grid container sx={{ flex: 1 }}>
        {/* Main Content Area */}
        <Grid item xs={12} md={8} sx={{ p: 4, pt: 0, width: "70%", ...textStyles }}>
          <div 
            style={textStyles}
            dangerouslySetInnerHTML={{ 
              __html: pageContent.main ? pageContent.main.map(s => s.outerHTML).join('') : '' 
            }} 
          />
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} md={4} sx={{ width: "30%" }}>
          <Box sx={{ 
            backgroundColor: palette.accentColor, 
            p: 4, 
            color: palette.sidebarText, 
            height: '100%',
            minHeight: 'calc(100% - 100px)',
            ...textStyles // APPLY TEXT STYLES TO SIDEBAR
          }}>
            {renderSidebarSections(pageIndex)}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );

  // Render second page
  const renderSecondPage = (pageContent, pageIndex) => (
    <Box
      sx={{
        width: page.width,
        minHeight: page.height,
        mx: "auto",
        boxShadow: 4,
        bgcolor: palette.header,
        ...textStyles, // APPLY TEXT STYLES TO ENTIRE PAGE
        my: topBottomMargin / 10,
        p: `${topBottomMargin / 2}px ${sideMargins / 2}px`,
        border: `${lineWeight}px solid ${palette.accentColor}`,
        display: exporting ? 'flex' : (pageIndex === currentPage ? 'flex' : 'none'),
        flexDirection: 'column',
        '@media print': {
          boxShadow: 'none',
          my: 0,
          border: 'none',
          pageBreakBefore: 'always',
          pageBreakAfter: 'avoid'
        }
      }}
    >
      {/* Second page header */}
      <Box sx={{ p: 4, pb: 2, ...textStyles }}>
        <Grid container alignItems="center">
          <Grid item xs={12} sm={8} sx={{ width: "70%" }}>
            {/* Empty header for alignment */}
          </Grid>
          <Grid item xs={12} sm={4} sx={{ textAlign: { xs: 'left', sm: 'right' }, width: "30%" }}>
            {/* Empty contact info for alignment */}
          </Grid>
        </Grid>
      </Box>

      {/* Main Content & Sidebar - Same structure but empty sidebar */}
      <Grid container sx={{ flex: 1 }}>
        {/* Main Content Area - 70% width */}
        <Grid item xs={12} md={8} sx={{ p: 4, pt: 0, width: "70%", ...textStyles }}>
          <div 
            style={textStyles}
            dangerouslySetInnerHTML={{ 
              __html: pageContent.main ? pageContent.main.map(s => s.outerHTML).join('') : '' 
            }} 
          />
        </Grid>

        {/* Sidebar - 30% width but empty */}
        <Grid item xs={12} md={4} sx={{ width: "30%" }}>
          <Box sx={{ 
            backgroundColor: palette.accentColor, 
            p: 4, 
            color: palette.sidebarText, 
            height: '90%',
            minHeight: 'calc(100% - 100px)',
            ...textStyles // APPLY TEXT STYLES TO SIDEBAR
          }}>
            <Box sx={{ opacity: 0.7, textAlign: 'center', }}>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: palette.sidebarText,
                  ...textStyles,
                  fontStyle: 'italic',
                }}
              >
              </Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );

  // Render drag panel for arrange sections dialog
  const renderDragPanel = (side, sections) => {
    return (
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
          <DragIndicator sx={{ mr: 1 }} />
          {side === 'left' ? 'Left Sidebar' : 'Right Main Content'} Sections
          <Typography variant="body2" color="textSecondary" sx={{ ml: 1 }}>
            ({sections.length} sections)
          </Typography>
        </Typography>
        <Box sx={{ maxHeight: 400, overflow: 'auto', border: '1px solid #e0e0e0', borderRadius: 1, p: 1 }}>
          {sections.length > 0 ? (
            sections.map((sectionId, index) => (
              <Paper
                key={sectionId}
                draggable={enableDragDrop}
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
                  cursor: enableDragDrop ? 'grab' : 'default',
                  '&:active': {
                    cursor: enableDragDrop ? 'grabbing' : 'default',
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

  return (
    <Box sx={{ width: "100%", position: "relative" }}>
      {/* Controls - Hidden during print */}
      {!exporting && (
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          mb: 2, 
          gap: 2, 
          '@media print': { display: 'none' } 
        }}>
          <IconButton 
            onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))} 
            disabled={currentPage === 0} 
            color="primary"
          >
            <ChevronLeft />
          </IconButton>
          <Typography sx={{ mx: 2 }}>
            Page {currentPage + 1} of {Math.max(1, pages.length)}
          </Typography>
          <IconButton 
            onClick={() => setCurrentPage(prev => Math.min(pages.length - 1, prev + 1))} 
            disabled={currentPage >= pages.length - 1} 
            color="primary"
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
      
      {/* Resume Content - Show all pages when exporting, only current page when viewing */}
      <Box id="resume-container">
        {pages.length > 0 ? (
          pages.map((pageContent, index) => (
            renderCurrentPage(index)
          ))
        ) : (
          renderFirstPage({ main: [] }, 0)
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
            Drag and drop sections to reorder them within each side or move sections between left sidebar and right main content.
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

// Add metadata for filtering
Resume20.resumeMeta = {
  hasPhoto: false,
  columns: 2,
  colorOptions: [
    { value: '#333', label: 'Dark Gray' },
    { value: '#3f51b5', label: 'Indigo' },
    { value: '#2196f3', label: 'Blue' },
    { value: '#f44336', label: 'Red' },
    { value: '#4caf50', label: 'Green' },
    { value: '#ff9800', label: 'Orange' },
    { value: '#9c27b0', label: 'Purple' }
  ],
  nameColorOptions: [
    { value: '#333', label: 'Dark Gray' },
    { value: '#000000', label: 'Black' },
    { value: '#1a2b47', label: 'Dark Blue' },
    { value: '#2e7d32', label: 'Green' },
    { value: '#7b1fa2', label: 'Purple' }
  ],
  sidebarBackgroundOptions: [
    { value: '#333', label: 'Dark Gray' },
    { value: '#1a2b47', label: 'Dark Blue' },
    { value: '#2e7d32', label: 'Green' },
    { value: '#7b1fa2', label: 'Purple' },
    { value: '#c2185b', label: 'Pink' },
    { value: '#d32f2f', label: 'Red' }
  ],
  sidebarTextColorOptions: [
    { value: '#fff', label: 'White' },
    { value: '#f5f5f5', label: 'Light Gray' },
    { value: '#e0e0e0', label: 'Very Light Gray' },
    { value: '#bbdefb', label: 'Light Blue' },
    { value: '#c8e6c9', label: 'Light Green' }
  ],
  headerBackgroundOptions: [
    { value: '#fff', label: 'White' },
    { value: '#f8f9fa', label: 'Light Gray' },
    { value: '#e3f2fd', label: 'Very Light Blue' },
    { value: '#f3e5f5', label: 'Very Light Purple' },
    { value: '#e8f5e9', label: 'Very Light Green' }
  ],
  experienceLevel: ["No Experience", "Less than 3 years", "3-5 Years", "5-10 Years", "10+ Years"]
};

export default Resume20;