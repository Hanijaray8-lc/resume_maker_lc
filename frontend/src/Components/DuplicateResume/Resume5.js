import React, { useEffect, useState, useRef, useCallback } from "react";
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
import LanguageIcon from "@mui/icons-material/Language";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

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

const defaultData = {
  firstName: "John",
  lastName: "Doe",
  currentPosition: "Full Stack Developer",
  phone: "+91 9876543210",
  email: "johndoe@email.com",
  city: "Chennai, India",
  website: "www.johndoe.com",
  profile:
    "Highly motivated Full Stack Developer with experience in building scalable MERN stack applications. Passionate about problem solving and creating user-friendly solutions.",
};

// Separate section orders for left and right sides
const defaultLeftSectionOrder = [
  'contact',
  'education',
  'languages',
  'skills'
];

const defaultRightSectionOrder = [
  'profile',
  'workExperience',
  'certifications',
  'accomplishments',
  'volunteering',
  'interests',
  'additionalInfo',
  'references',
  'websites'
];

const Resume5 = ({
  color = "#791115ff",
  font = "Arial",
  fontSize = "14px",
  headingSize = "24px",
  fontStyle = "normal",
  sectionSpacing = 10,
  paragraphSpacing = 30,
  lineSpacing = 20,
  topBottomMargin = 20,
  sideMargins = 20,
  paragraphIndent = 0,
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
  const rightContentRef = useRef(null);
  const sidebarContentRef = useRef(null);

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
  console.log('🌐 Loaded websites:', storedWebsites);
  setSavedWebsites(storedWebsites);

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
  const savedLeftSectionOrder = localStorage.getItem("resume5LeftSectionOrder");
  const savedRightSectionOrder = localStorage.getItem("resume5RightSectionOrder");

  if (savedLeftSectionOrder && savedRightSectionOrder) {
    // Use saved orders if they exist
    setLeftSectionOrder(JSON.parse(savedLeftSectionOrder));
    setRightSectionOrder(JSON.parse(savedRightSectionOrder));
  } else {
    // For first time, add ONLY current custom sections to right side
    const currentCustomSectionIds = Object.keys(sectionsData).map(name => `custom_${name}`);
    const updatedRightSectionOrder = [...defaultRightSectionOrder, ...currentCustomSectionIds];
    setRightSectionOrder(updatedRightSectionOrder);
    console.log('🆕 Initial right section order with ONLY CURRENT custom sections:', updatedRightSectionOrder);
  }
}, []);
  // Save section orders to localStorage whenever they change
  useEffect(() => {
    if (leftSectionOrder.length > 0) {
      localStorage.setItem("resume5LeftSectionOrder", JSON.stringify(leftSectionOrder));
    }
  }, [leftSectionOrder]);

  useEffect(() => {
    if (rightSectionOrder.length > 0) {
      localStorage.setItem("resume5RightSectionOrder", JSON.stringify(rightSectionOrder));
    }
  }, [rightSectionOrder]);

 useEffect(() => {
  const userId = localStorage.getItem("userId");
  if (userId && Object.keys(customSections).length > 0) {
    const currentRightOrder = [...rightSectionOrder];
    let updated = false;
    
    // Get ONLY CURRENT custom section IDs
    const currentCustomSectionIds = Object.keys(customSections).map(name => `custom_${name}`);
    
    console.log("🔄 Processing CURRENT custom sections for right side:", currentCustomSectionIds);
    
    // Remove ALL old custom sections and add ONLY current ones
    const filteredOrder = currentRightOrder.filter(section => !section.startsWith('custom_'));
    const newRightOrder = [...filteredOrder, ...currentCustomSectionIds];
    
    if (JSON.stringify(newRightOrder) !== JSON.stringify(currentRightOrder)) {
      setRightSectionOrder(newRightOrder);
      localStorage.setItem("resume5RightSectionOrder", JSON.stringify(newRightOrder));
      updated = true;
      console.log('📝 Updated right section order with ONLY CURRENT custom sections:', newRightOrder);
    }
    
    if (updated) {
      console.log('✅ Section order updated with current custom sections');
    }
  } else if (userId && Object.keys(customSections).length === 0) {
    // If no current custom sections, remove all custom sections from right side
    const currentRightOrder = [...rightSectionOrder];
    const filteredOrder = currentRightOrder.filter(section => !section.startsWith('custom_'));
    
    if (filteredOrder.length !== currentRightOrder.length) {
      setRightSectionOrder(filteredOrder);
      localStorage.setItem("resume5RightSectionOrder", JSON.stringify(filteredOrder));
      console.log('🗑️ Removed all custom sections from right side (no current sections)');
    }
  }
}, [customSections]);

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

  // Common section header style
  const getSectionHeaderStyle = () => ({
    fontSize: headingSize, 
    fontWeight: "bold", 
    mb: `${sectionSpacing / 2}px`, 
    color: color,
    borderBottom: `${lineWeight}px solid ${color}`,
    pb: 1,
    ...globalFontStyle
  });

  // Common content spacing style
  const getContentSpacingStyle = () => ({
    mb: `${sectionSpacing}px`,
    ...globalFontStyle
  });

  // Common paragraph spacing style
  const getParagraphSpacingStyle = () => ({
    mb: `${paragraphSpacing}px`,
    ...globalFontStyle
  });

  // Common list item spacing style
  const getListItemSpacingStyle = () => ({
    mb: `${paragraphSpacing / 2}px`,
    ...globalFontStyle
  });

  // Render sidebar sections based on current order
  const renderSidebarSections = () => {
    return leftSectionOrder.map(sectionId => {
      switch (sectionId) {
        case 'contact':
          return data.phone || data.email || data.city || data.website || savedWebsites.length > 0 ? (
            <div key="contact" className="sidebar-section" style={getContentSpacingStyle()}>
              {/* Profile Photo */}
              <Box sx={{ display: "flex", justifyContent: "center", mb: `${sectionSpacing}px` }}>
                <Avatar
                  src={photo || "https://via.placeholder.com/150"}
                  sx={{
                    width: 160,
                    height: 160,
                    border: `${lineWeight}px solid ${color}`,
                  }}
                />
              </Box>

              <Typography 
                variant="h6" 
                gutterBottom
                sx={getSectionHeaderStyle()}
              >
                CONTACT
              </Typography>
              <List dense sx={{ width: '100%', mb: `${sectionSpacing}px`, ...globalFontStyle }}>
                {data.phone && (
                  <ListItem sx={{ mb: `${paragraphSpacing / 2}px`, px: 0 }}>
                    <ListItemIcon sx={{ color: color, minWidth: "30px" }}>
                      <PhoneIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText
                      primary={data.phone}
                      primaryTypographyProps={getTextStyle()}
                    />
                  </ListItem>
                )}
                {data.email && (
                  <ListItem sx={{ mb: `${paragraphSpacing / 2}px`, px: 0 }}>
                    <ListItemIcon sx={{ color: color, minWidth: "30px" }}>
                      <EmailIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText
                      primary={data.email}
                      primaryTypographyProps={getTextStyle()}
                    />
                  </ListItem>
                )}
                {data.city && (
                  <ListItem sx={{ mb: `${paragraphSpacing / 2}px`, px: 0 }}>
                    <ListItemIcon sx={{ color: color, minWidth: "30px" }}>
                      <LocationOnIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText
                      primary={data.city}
                      primaryTypographyProps={getTextStyle()}
                    />
                  </ListItem>
                )}
                {data.website && (
                  <ListItem sx={{ mb: `${paragraphSpacing / 2}px`, px: 0 }}>
                    <ListItemIcon sx={{ color: color, minWidth: "30px" }}>
                      <LanguageIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText
                      primary={data.website}
                      primaryTypographyProps={getTextStyle()}
                    />
                  </ListItem>
                )}
                {/* Render websites from savedWebsites */}
                {savedWebsites.map((site, index) => (
                  <ListItem key={index} sx={{ mb: `${paragraphSpacing / 2}px`, px: 0 }}>
                    <ListItemIcon sx={{ color: color, minWidth: "30px" }}>
                      <LanguageIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText
                      primary={site.url}
                      primaryTypographyProps={getTextStyle()}
                    />
                  </ListItem>
                ))}
              </List>
            </div>
          ) : null;

          case 'websites':
  return savedWebsites.length > 0 ? (
    <div key="websites" className="sidebar-section" style={getContentSpacingStyle()}>
      <Typography 
        variant="h6" 
        gutterBottom
        sx={getSectionHeaderStyle()}
      >
        WEBSITES & PROFILES
      </Typography>
      <List dense sx={{ width: '100%', ...globalFontStyle }}>
        {savedWebsites.map((site, index) => (
          <ListItem key={index} sx={{ mb: `${paragraphSpacing / 2}px`, px: 0 }}>
            <ListItemIcon sx={{ color: color, minWidth: "30px" }}>
              <LanguageIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText
              primary={site.url}
              secondary={site.addToHeader ? "Shown in Header" : ""}
              primaryTypographyProps={getTextStyle()}
              secondaryTypographyProps={getTextStyle({ 
                fontStyle: 'italic', 
                color: '#666',
                fontSize: '0.8rem'
              })}
            />
          </ListItem>
        ))}
      </List>
    </div>
  ) : null;

        case 'education':
          return educationEntries.length > 0 ? (
            <div key="education" className="sidebar-section" style={getContentSpacingStyle()}>
              <Typography 
                variant="h6" 
                gutterBottom
                sx={getSectionHeaderStyle()}
              >
                EDUCATION
              </Typography>
              <Box sx={{ width: '100%', mb: `${sectionSpacing}px`, ...globalFontStyle }}>
                {educationEntries.map((edu) => (
                  <Box key={edu.id} sx={{ mb: `${paragraphSpacing}px` }}>
                    <Typography sx={getTextStyle({ fontWeight: "bold" })}>
                      {edu.schoolName}
                    </Typography>
                    <Typography sx={getTextStyle()}>
                      {edu.degree} {edu.fieldOfStudy && `- ${edu.fieldOfStudy}`}
                    </Typography>
                    <Typography sx={getTextStyle({ fontStyle: 'italic', color: '#666' })}>
                      {formatDate(edu.gradMonth, edu.gradYear)}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </div>
          ) : null;

        case 'languages':
          return savedLanguages.length > 0 ? (
            <div key="languages" className="sidebar-section" style={getContentSpacingStyle()}>
              <Typography 
                variant="h6" 
                gutterBottom
                sx={getSectionHeaderStyle()}
              >
                LANGUAGES
              </Typography>
              <Box sx={{ width: '100%', mb: `${sectionSpacing}px`, ...globalFontStyle }}>
                {savedLanguages.map((lang, index) => (
                  <Typography
                    key={index}
                    sx={getListItemSpacingStyle()}
                  >
                    • {lang.name} {lang.level ? `(${lang.level})` : ""}
                  </Typography>
                ))}
              </Box>
            </div>
          ) : null;

        case 'skills':
          return (savedSkills.length > 0 || softwareSkills.length > 0) ? (
            <div key="skills" className="sidebar-section" style={getContentSpacingStyle()}>
              <Typography 
                variant="h6" 
                gutterBottom
                sx={getSectionHeaderStyle()}
              >
                SKILLS
              </Typography>
              <Box sx={{ width: '100%', mb: `${sectionSpacing}px`, ...globalFontStyle }}>
                {savedSkills.map((skill, index) => (
                  <Typography
                    key={index}
                    sx={getListItemSpacingStyle()}
                  >
                    • {skill.name} {skill.rating ? `(${skill.rating}%)` : ""}
                  </Typography>
                ))}
                {softwareSkills.map((skill, index) => (
                  <Typography
                    key={`software-${index}`}
                    sx={getListItemSpacingStyle()}
                  >
                    • {skill.name} {skill.level ? `(${skill.level}%)` : ""}
                  </Typography>
                ))}
              </Box>
            </div>
          ) : null;

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
        return (savedSummary || data.profile) ? (
          <div key="profile" className="sidebar-section" style={getContentSpacingStyle()}>
            <Typography 
              variant="h6" 
              gutterBottom
              sx={getSectionHeaderStyle()}
            >
              PROFILE
            </Typography>
            <Typography sx={getTextStyle({ mb: `${sectionSpacing}px`, textAlign: "justify", textIndent: `${paragraphIndent}px` })}>
              {savedSummary || data.profile}
            </Typography>
          </div>
        ) : null;

      case 'workExperience':
        return workExperiences && workExperiences.length > 0 ? (
          <div key="workExperience" className="sidebar-section" style={getContentSpacingStyle()}>
            <Typography 
              variant="h6" 
              gutterBottom
              sx={getSectionHeaderStyle()}
            >
              WORK EXPERIENCE
            </Typography>
            
            {workExperiences.map((work, i) => (
              <Box key={i} sx={{ mb: `${paragraphSpacing}px`, ...globalFontStyle }}>
                <Typography sx={getTextStyle({ fontWeight: "bold", fontSize: "1.1rem" })}>
                  {work.jobTitle} - {work.employer}
                </Typography>
                <Typography sx={getTextStyle({ fontStyle: 'italic', color: '#666', mb: 1 })}>
                  {formatDate(work.startMonth, work.startYear)} -{" "}
                  {work.current
                    ? "Present"
                    : formatDate(work.endMonth, work.endYear)}
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

      case 'certifications':
        return savedCertifications.length > 0 ? (
          <div key="certifications" className="sidebar-section" style={getContentSpacingStyle()}>
            <Typography 
              variant="h6" 
              gutterBottom
              sx={getSectionHeaderStyle()}
            >
              CERTIFICATIONS
            </Typography>
            {savedCertifications.map((cert, index) => (
              <Box key={index} sx={{ mb: `${paragraphSpacing}px`, ...globalFontStyle }}>
                <Typography sx={getTextStyle({ fontWeight: "bold" })}>
                  {cert.name}
                </Typography>
                <Typography sx={getTextStyle()}>
                  {cert.provider} {cert.year && `(${cert.year})`}
                </Typography>
              </Box>
            ))}
          </div>
        ) : null;

      case 'accomplishments':
        return savedAccomplishments.length > 0 ? (
          <div key="accomplishments" className="sidebar-section" style={getContentSpacingStyle()}>
            <Typography 
              variant="h6" 
              gutterBottom
              sx={getSectionHeaderStyle()}
            >
              ACCOMPLISHMENTS
            </Typography>
            {savedAccomplishments.map((acc, index) => (
              <Typography
                key={index}
                sx={getListItemSpacingStyle()}
              >
                • {acc}
              </Typography>
            ))}
          </div>
        ) : null;

      case 'volunteering':
        return savedVolunteering.length > 0 ? (
          <div key="volunteering" className="sidebar-section" style={getContentSpacingStyle()}>
            <Typography 
              variant="h6" 
              gutterBottom
              sx={getSectionHeaderStyle()}
            >
              VOLUNTEERING
            </Typography>
            {savedVolunteering.map((vol, index) => (
              <Box key={index} sx={{ mb: `${paragraphSpacing}px`, ...globalFontStyle }}>
                <Typography sx={getTextStyle({ fontWeight: "bold" })}>
                  {vol.subtopic}
                </Typography>
                <Typography sx={getTextStyle({ fontStyle: 'italic', color: '#666' })}>
                  {vol.fromDate} - {vol.toDate}
                </Typography>
                <Typography sx={getTextStyle()}>
                  {vol.content}
                </Typography>
              </Box>
            ))}
          </div>
        ) : null;

      case 'interests':
        return savedInterests.length > 0 ? (
          <div key="interests" className="sidebar-section" style={getContentSpacingStyle()}>
            <Typography 
              variant="h6" 
              gutterBottom
              sx={getSectionHeaderStyle()}
            >
              INTERESTS
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', ...globalFontStyle }}>
              {savedInterests.map((interest, index) => (
                <Typography
                  key={index}
                  sx={getTextStyle({ mr: 2, mb: `${paragraphSpacing / 2}px` })}
                >
                  • {interest}
                </Typography>
              ))}
            </Box>
          </div>
        ) : null;

      case 'additionalInfo':
        return savedAdditionalInfo.length > 0 ? (
          <div key="additionalInfo" className="sidebar-section" style={getContentSpacingStyle()}>
            <Typography 
              variant="h6" 
              gutterBottom
              sx={getSectionHeaderStyle()}
            >
              ADDITIONAL INFORMATION
            </Typography>
            {savedAdditionalInfo.map((info, index) => (
              <Typography
                key={index}
                sx={getListItemSpacingStyle()}
              >
                • {info}
              </Typography>
            ))}
          </div>
        ) : null;

      case 'references':
        return savedReferences.length > 0 ? (
          <div key="references" className="sidebar-section" style={getContentSpacingStyle()}>
            <Typography 
              variant="h6" 
              gutterBottom
              sx={getSectionHeaderStyle()}
            >
              REFERENCES
            </Typography>
            {savedReferences.map((ref, index) => (
              <Typography
                key={index}
                sx={getListItemSpacingStyle()}
              >
                • {ref}
              </Typography>
            ))}
          </div>
        ) : null;

   
// Update the websites section in renderRightContentSections - ENHANCE this section
case 'websites':
  return savedWebsites.length > 0 ? (
    <div key="websites" className="resume-section" style={getContentSpacingStyle()}>
      <Typography 
        variant="h6" 
        gutterBottom
        sx={getSectionHeaderStyle()}
      >
        WEBSITES & PROFILES
      </Typography>
      <List dense sx={{ width: '100%', ...globalFontStyle }}>
        {savedWebsites.map((site, index) => (
          <ListItem key={index} sx={{ mb: `${paragraphSpacing / 2}px`, px: 0 }}>
            <ListItemIcon sx={{ color: color, minWidth: "30px" }}>
              <LanguageIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText
              primary={site.url}
              secondary={site.addToHeader ? "Shown in Header" : ""}
              primaryTypographyProps={getTextStyle()}
              secondaryTypographyProps={getTextStyle({ 
                fontStyle: 'italic', 
                color: '#666',
                fontSize: '0.8rem'
              })}
            />
          </ListItem>
        ))}
      </List>
    </div>
  ) : null;
      default:
  // Handle custom sections in sidebar
  if (sectionId.startsWith('custom_')) {
    const customSectionName = sectionId.replace('custom_', '');
    const items = customSections[customSectionName] || [];
    
    console.log(`🎯 Rendering custom section in sidebar: ${customSectionName}`, items);
    
    // Filter out empty items
    const validItems = items.filter(item => item && item.trim() !== '');
    
    if (validItems.length > 0) {
      return (
        <div key={sectionId} className="sidebar-section" style={getContentSpacingStyle()}>
          <Typography 
            variant="h6" 
            gutterBottom
            sx={getSectionHeaderStyle()}
          >
            {customSectionName.replace(/_/g, ' ').toUpperCase()}
          </Typography>
          {validItems.map((item, i) => (
            <Typography
              key={i}
              sx={getListItemSpacingStyle()}
            >
              • {item}
            </Typography>
          ))}
        </div>
      );
    } else {
      console.log(`⚠️ No valid items in custom section: ${customSectionName}`);
      return null;
    }
  }
  return null;}}

  // Render right content sections based on current order
  const renderRightContentSections = () => {
    return rightSectionOrder.map(sectionId => {
      switch (sectionId) {
        case 'profile':
          return (savedSummary || data.profile) ? (
            <div key="profile" className="resume-section" style={getContentSpacingStyle()}>
              <Typography 
                variant="h6" 
                gutterBottom
                sx={getSectionHeaderStyle()}
              >
                PROFILE
              </Typography>
              <Typography sx={getTextStyle({ mb: `${sectionSpacing}px`, textAlign: "justify", textIndent: `${paragraphIndent}px` })}>
                {savedSummary || data.profile}
              </Typography>
            </div>
          ) : null;

        case 'workExperience':
          return workExperiences && workExperiences.length > 0 ? (
            <div key="workExperience" className="resume-section" style={getContentSpacingStyle()}>
              <Typography 
                variant="h6" 
                gutterBottom
                sx={getSectionHeaderStyle()}
              >
                WORK EXPERIENCE
              </Typography>
              
              {workExperiences.map((work, i) => (
                <Box key={i} sx={{ mb: `${paragraphSpacing}px`, ...globalFontStyle }}>
                  <Typography sx={getTextStyle({ fontWeight: "bold", fontSize: "1.1rem" })}>
                    {work.jobTitle} - {work.employer}
                  </Typography>
                  <Typography sx={getTextStyle({ fontStyle: 'italic', color: '#666', mb: 1 })}>
                    {formatDate(work.startMonth, work.startYear)} -{" "}
                    {work.current
                      ? "Present"
                      : formatDate(work.endMonth, work.endYear)}
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

        case 'certifications':
          return savedCertifications.length > 0 ? (
            <div key="certifications" className="resume-section" style={getContentSpacingStyle()}>
              <Typography 
                variant="h6" 
                gutterBottom
                sx={getSectionHeaderStyle()}
              >
                CERTIFICATIONS
              </Typography>
              {savedCertifications.map((cert, index) => (
                <Box key={index} sx={{ mb: `${paragraphSpacing}px`, ...globalFontStyle }}>
                  <Typography sx={getTextStyle({ fontWeight: "bold" })}>
                    {cert.name}
                  </Typography>
                  <Typography sx={getTextStyle()}>
                    {cert.provider} {cert.year && `(${cert.year})`}
                  </Typography>
                </Box>
              ))}
            </div>
          ) : null;

        case 'accomplishments':
          return savedAccomplishments.length > 0 ? (
            <div key="accomplishments" className="resume-section" style={getContentSpacingStyle()}>
              <Typography 
                variant="h6" 
                gutterBottom
                sx={getSectionHeaderStyle()}
              >
                ACCOMPLISHMENTS
              </Typography>
              {savedAccomplishments.map((acc, index) => (
                <Typography
                  key={index}
                  sx={getListItemSpacingStyle()}
                >
                  • {acc}
                </Typography>
              ))}
            </div>
          ) : null;

        case 'volunteering':
          return savedVolunteering.length > 0 ? (
            <div key="volunteering" className="resume-section" style={getContentSpacingStyle()}>
              <Typography 
                variant="h6" 
                gutterBottom
                sx={getSectionHeaderStyle()}
              >
                VOLUNTEERING
              </Typography>
              {savedVolunteering.map((vol, index) => (
                <Box key={index} sx={{ mb: `${paragraphSpacing}px`, ...globalFontStyle }}>
                  <Typography sx={getTextStyle({ fontWeight: "bold" })}>
                    {vol.subtopic}
                  </Typography>
                  <Typography sx={getTextStyle({ fontStyle: 'italic', color: '#666' })}>
                    {vol.fromDate} - {vol.toDate}
                  </Typography>
                  <Typography sx={getTextStyle()}>
                    {vol.content}
                  </Typography>
                </Box>
              ))}
            </div>
          ) : null;

        case 'interests':
          return savedInterests.length > 0 ? (
            <div key="interests" className="resume-section" style={getContentSpacingStyle()}>
              <Typography 
                variant="h6" 
                gutterBottom
                sx={getSectionHeaderStyle()}
              >
                INTERESTS
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', ...globalFontStyle }}>
                {savedInterests.map((interest, index) => (
                  <Typography
                    key={index}
                    sx={getTextStyle({ mr: 2, mb: `${paragraphSpacing / 2}px` })}
                  >
                    • {interest}
                  </Typography>
                ))}
              </Box>
            </div>
          ) : null;

        case 'additionalInfo':
          return savedAdditionalInfo.length > 0 ? (
            <div key="additionalInfo" className="resume-section" style={getContentSpacingStyle()}>
              <Typography 
                variant="h6" 
                gutterBottom
                sx={getSectionHeaderStyle()}
              >
                ADDITIONAL INFORMATION
              </Typography>
              {savedAdditionalInfo.map((info, index) => (
                <Typography
                  key={index}
                  sx={getListItemSpacingStyle()}
                >
                  • {info}
                </Typography>
              ))}
            </div>
          ) : null;

        case 'references':
          return savedReferences.length > 0 ? (
            <div key="references" className="resume-section" style={getContentSpacingStyle()}>
              <Typography 
                variant="h6" 
                gutterBottom
                sx={getSectionHeaderStyle()}
              >
                REFERENCES
              </Typography>
              {savedReferences.map((ref, index) => (
                <Typography
                  key={index}
                  sx={getListItemSpacingStyle()}
                >
                  • {ref}
                </Typography>
              ))}
            </div>
          ) : null;

        case 'websites':
          return savedWebsites.length > 0 ? (
            <div key="websites" className="resume-section" style={getContentSpacingStyle()}>
              <Typography 
                variant="h6" 
                gutterBottom
                sx={getSectionHeaderStyle()}
              >
                WEBSITES
              </Typography>
              {savedWebsites.map((site, index) => (
                <Typography
                  key={index}
                  sx={getListItemSpacingStyle()}
                >
                  • {site.url} {site.addToHeader ? "(Shown in Header)" : ""}
                </Typography>
              ))}
            </div>
          ) : null;

        default:
          // Handle left-side sections moved to right side
          return renderLeftSectionsForRight(sectionId);
      }
    }).filter(Boolean);
  };

  // Render left sections for right side (when moved from left to right)
  const renderLeftSectionsForRight = (sectionId) => {
    switch (sectionId) {
      case 'contact':
        return data.phone || data.email || data.city || data.website || savedWebsites.length > 0 ? (
          <div key="contact" className="resume-section" style={getContentSpacingStyle()}>
            <Typography 
              variant="h6" 
              gutterBottom
              sx={getSectionHeaderStyle()}
            >
              CONTACT
            </Typography>
            <List dense sx={{ width: '100%', mb: `${sectionSpacing}px`, ...globalFontStyle }}>
              {data.phone && (
                <ListItem sx={{ mb: `${paragraphSpacing / 2}px`, px: 0 }}>
                  <ListItemIcon sx={{ color: color, minWidth: "30px" }}>
                    <PhoneIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText
                    primary={data.phone}
                    primaryTypographyProps={getTextStyle()}
                  />
                </ListItem>
              )}
              {data.email && (
                <ListItem sx={{ mb: `${paragraphSpacing / 2}px`, px: 0 }}>
                  <ListItemIcon sx={{ color: color, minWidth: "30px" }}>
                    <EmailIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText
                    primary={data.email}
                    primaryTypographyProps={getTextStyle()}
                  />
                </ListItem>
              )}
              {data.city && (
                <ListItem sx={{ mb: `${paragraphSpacing / 2}px`, px: 0 }}>
                  <ListItemIcon sx={{ color: color, minWidth: "30px" }}>
                    <LocationOnIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText
                    primary={data.city}
                    primaryTypographyProps={getTextStyle()}
                  />
                </ListItem>
              )}
              {data.website && (
                <ListItem sx={{ mb: `${paragraphSpacing / 2}px`, px: 0 }}>
                  <ListItemIcon sx={{ color: color, minWidth: "30px" }}>
                    <LanguageIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText
                    primary={data.website}
                    primaryTypographyProps={getTextStyle()}
                  />
                </ListItem>
              )}
              {/* Render websites from savedWebsites */}
              {savedWebsites.map((site, index) => (
                <ListItem key={index} sx={{ mb: `${paragraphSpacing / 2}px`, px: 0 }}>
                  <ListItemIcon sx={{ color: color, minWidth: "30px" }}>
                    <LanguageIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText
                    primary={site.url}
                    primaryTypographyProps={getTextStyle()}
                  />
                </ListItem>
              ))}
            </List>
          </div>
        ) : null;

      case 'education':
        return educationEntries.length > 0 ? (
          <div key="education" className="resume-section" style={getContentSpacingStyle()}>
            <Typography 
              variant="h6" 
              gutterBottom
              sx={getSectionHeaderStyle()}
            >
              EDUCATION
            </Typography>
            <Box sx={{ width: '100%', mb: `${sectionSpacing}px`, ...globalFontStyle }}>
              {educationEntries.map((edu) => (
                <Box key={edu.id} sx={{ mb: `${paragraphSpacing}px` }}>
                  <Typography sx={getTextStyle({ fontWeight: "bold" })}>
                    {edu.schoolName}
                  </Typography>
                  <Typography sx={getTextStyle()}>
                    {edu.degree} {edu.fieldOfStudy && `- ${edu.fieldOfStudy}`}
                  </Typography>
                  <Typography sx={getTextStyle({ fontStyle: 'italic', color: '#666' })}>
                    {formatDate(edu.gradMonth, edu.gradYear)}
                  </Typography>
                </Box>
              ))}
            </Box>
          </div>
        ) : null;

      case 'languages':
        return savedLanguages.length > 0 ? (
          <div key="languages" className="resume-section" style={getContentSpacingStyle()}>
            <Typography 
              variant="h6" 
              gutterBottom
              sx={getSectionHeaderStyle()}
            >
              LANGUAGES
            </Typography>
            <Box sx={{ width: '100%', mb: `${sectionSpacing}px`, ...globalFontStyle }}>
              {savedLanguages.map((lang, index) => (
                <Typography
                  key={index}
                  sx={getListItemSpacingStyle()}
                >
                  • {lang.name} {lang.level ? `(${lang.level})` : ""}
                </Typography>
              ))}
            </Box>
          </div>
        ) : null;

      case 'skills':
        return (savedSkills.length > 0 || softwareSkills.length > 0) ? (
          <div key="skills" className="resume-section" style={getContentSpacingStyle()}>
            <Typography 
              variant="h6" 
              gutterBottom
              sx={getSectionHeaderStyle()}
            >
              SKILLS
            </Typography>
            <Box sx={{ width: '100%', mb: `${sectionSpacing}px`, ...globalFontStyle }}>
              {savedSkills.map((skill, index) => (
                <Typography
                  key={index}
                  sx={getListItemSpacingStyle()}
                >
                  • {skill.name} {skill.rating ? `(${skill.rating}%)` : ""}
                </Typography>
              ))}
              {softwareSkills.map((skill, index) => (
                <Typography
                  key={`software-${index}`}
                  sx={getListItemSpacingStyle()}
                >
                  • {skill.name} {skill.level ? `(${skill.level}%)` : ""}
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
    
    console.log(`🎯 Rendering custom section in left: ${customSectionName}`, items);
    
    // Filter out empty items
    const validItems = items.filter(item => item && item.trim() !== '');
    
    if (validItems.length > 0) {
      return (
        <div key={sectionId} className="resume-section" style={getContentSpacingStyle()}>
          <Typography 
            variant="h6" 
            gutterBottom
            sx={getSectionHeaderStyle()}
          >
            {customSectionName.replace(/_/g, ' ').toUpperCase()}
          </Typography>
          {validItems.map((item, i) => (
            <Typography
              key={i}
              sx={getListItemSpacingStyle()}
            >
              • {item}
            </Typography>
          ))}
        </div>
      );
    } else {
      console.log(`⚠️ No valid items in custom section: ${customSectionName}`);
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
      'profile': 'Profile',
      'workExperience': 'Work Experience',
      'certifications': 'Certifications',
      'accomplishments': 'Accomplishments',
      'volunteering': 'Volunteering',
      'interests': 'Interests',
      'additionalInfo': 'Additional Information',
      'references': 'References',
      'websites': 'Websites'
    };
    
    if (sectionId.startsWith('custom_')) {
      return sectionId.replace('custom_', '').replace(/_/g, ' ').toUpperCase();
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
  }, [page.height, topBottomMargin, leftSectionOrder, sectionSpacing, paragraphSpacing, lineSpacing, fontSize, headingSize, font, color,customSections]);

  // Pagination for main content (right side)
  const paginateMainContent = useCallback(() => {
    if (!rightContentRef.current) return;

    const pageHeightInPx = parseFloat(page.height.replace('mm', '')) * 3.78;
    const headerHeight = 120;
    const availableHeight = pageHeightInPx - (2 * topBottomMargin) - headerHeight;

    const rightContent = rightContentRef.current;
    const sections = Array.from(rightContent.querySelectorAll('.resume-section'));
    
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
  }, [page.height, topBottomMargin, rightSectionOrder, sectionSpacing, paragraphSpacing, lineSpacing, fontSize, headingSize, font, color]);

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
    sectionSpacing,
    paragraphSpacing,
    lineSpacing,
    fontSize,
    headingSize,
    font,
    color
  ]);

  // Add global font style to HTML content
  const addFontToHtmlContent = (htmlContent) => {
    if (!htmlContent) return '';
    
    // Add font family to all HTML content
    return htmlContent.replace(
      /<div/g, 
      `<div style="font-family: ${font}; font-size: ${fontSize}; font-style: ${fontStyle}; line-height: ${lineSpacing}px;"`
    ).replace(
      /<p/g, 
      `<p style="font-family: ${font}; font-size: ${fontSize}; font-style: ${fontStyle}; line-height: ${lineSpacing}px;"`
    ).replace(
      /<span/g, 
      `<span style="font-family: ${font}; font-size: ${fontSize}; font-style: ${fontStyle}; line-height: ${lineSpacing}px;"`
    );
  };

  // Render sidebar content for measurement (hidden)
  const renderSidebarForMeasurement = () => (
    <Box ref={sidebarContentRef} sx={{ visibility: 'hidden', position: 'absolute', top: -1000, width: '35%', ...globalFontStyle }}>
      {renderSidebarSections()}
    </Box>
  );

  // Render right content for measurement (hidden)
  const renderRightContentForMeasurement = () => (
    <Box ref={rightContentRef} sx={{ 
      visibility: 'hidden', 
      position: 'absolute', 
      top: -1000, 
      width: '65%',
      ...globalFontStyle 
    }}>
      {renderRightContentSections()}
    </Box>
  );

  // Render actual sidebar content based on current page
  const renderSidebar = (pageIndex) => (
    <Box
      sx={{
        width: "35%",
        pr: 3,
        display: "flex",
        flexDirection: "column",
        "@media print": {
          width: "35%",
          display: "inline-block",
          verticalAlign: "top",
        },
        ...globalFontStyle
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

  // Render header section - only for first page
  const renderHeader = (pageIndex) => (
    pageIndex === 0 && (
      <Box 
        sx={{ 
          bgcolor: color, 
          color: "white", 
          p: 3, 
          textAlign: "center",
          mb: `${sectionSpacing}px`,
          "@media print": {
            bgcolor: color,
            WebkitPrintColorAdjust: "exact",
            printColorAdjust: "exact",
          },
          ...globalFontStyle
        }}
      >
        <Typography 
          sx={{ 
            fontSize: "2.5rem", 
            fontWeight: "bold",
            mb: 1,
            fontFamily: font,
          }}
        >
          {data.firstName} {data.lastName}
        </Typography>
        <Typography 
          sx={{ 
            fontSize: "1.5rem",
            fontStyle: fontStyle,
            fontFamily: font,
          }}
        >
          {data.currentPosition}
        </Typography>
      </Box>
    )
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
                ...globalFontStyle
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
              // Add padding top for subsequent pages to maintain layout
              pt: pageIndex > 0 ? `${sectionSpacing}px` : `${topBottomMargin}px`,
              ...globalFontStyle
            }}>
              {/* Left Sidebar - Show on all pages if there's sidebar content */}
              {sidebarPages[pageIndex] ? renderSidebar(pageIndex) : <Box sx={{ width: "35%", pr: 3, ...globalFontStyle }} />}
              
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
                  width: sidebarPages[pageIndex] ? "65%" : "100%",
                  pl: sidebarPages[pageIndex] ? 3 : 0,
                  "@media print": {
                    width: sidebarPages[pageIndex] ? "65%" : "100%",
                    display: "inline-block",
                    verticalAlign: "top",
                  },
                  ...globalFontStyle
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

export default Resume5;