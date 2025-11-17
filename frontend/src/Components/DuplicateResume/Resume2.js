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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper
} from "@mui/material";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import SchoolIcon from "@mui/icons-material/School";
import WorkIcon from "@mui/icons-material/Work";
import LanguageIcon from "@mui/icons-material/Language";
import ComputerIcon from "@mui/icons-material/Computer";
import VolunteerActivismIcon from "@mui/icons-material/VolunteerActivism";
import StarIcon from "@mui/icons-material/Star";
import LinkIcon from "@mui/icons-material/Link";
import PersonIcon from "@mui/icons-material/Person";
import {
  ChevronLeft,
  ChevronRight,
  Print,
  Download,
  DragIndicator,
  Reorder
} from "@mui/icons-material";
import html2pdf from "html2pdf.js";
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
  firstName: "Donna",
  lastName: "Stroupe",
  currentPosition: "Business Student",
  phone: "+1 (123) 456-7890",
  email: "donna.stroupe@email.com",
  city: "123 Anywhere St., Any City",
  website: "",
  profile: "",
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

const Resume2 = ({
  color = "#791115ff",
  font = "Arial",
  fontSize = "14px",
  headingSize = "24px",
  fontStyle = "normal",
  sectionSpacing = 50,
  paragraphSpacing = 30,
  lineSpacing = 20,
  topBottomMargin = 40,
  sideMargins = 40,
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
  const [currentPage, setCurrentPage] = useState(0);
  const [pages, setPages] = useState([]);
  const mainContentRef = useRef(null);
  
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

  // Calculate spacing values for consistent application
  const sectionSpacingValue = sectionSpacing / 10; // Convert to px
  const paragraphSpacingValue = paragraphSpacing / 10; // Convert to px
  const lineSpacingValue = lineSpacing / 10; // Convert to px

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
    setSavedWebsites(storedWebsites);

    // 🔥 CUSTOM SECTIONS - Resume9 mathiri
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
    const savedLeftSectionOrder = localStorage.getItem("resume2LeftSectionOrder");
    if (savedLeftSectionOrder) {
      // 🔥 FIX: Left side-ல custom sections auto add ஆகாது - filter only
      const parsedOrder = JSON.parse(savedLeftSectionOrder);
      const filteredOrder = parsedOrder.filter(section => !section.startsWith('custom_'));
      setLeftSectionOrder(filteredOrder);
      console.log('🔄 Loaded left section order WITHOUT custom sections:', filteredOrder);
    } else {
      setLeftSectionOrder(defaultLeftSectionOrder);
    }

    const savedRightSectionOrder = localStorage.getItem("resume2RightSectionOrder");
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

  // 🔥 Add this useEffect to automatically add/remove custom sections
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
        localStorage.setItem("resume2RightSectionOrder", JSON.stringify(newRightOrder));
        console.log('📝 Final right section order with ONLY CURRENT custom sections:', newRightOrder);
      }
      
      // 🔥 FIX: Left side-லிருந்து custom sections-ஐ remove செய்யவும்
      const currentLeftOrder = [...leftSectionOrder];
      const filteredLeftOrder = currentLeftOrder.filter(section => !section.startsWith('custom_'));
      if (JSON.stringify(filteredLeftOrder) !== JSON.stringify(currentLeftOrder)) {
        setLeftSectionOrder(filteredLeftOrder);
        localStorage.setItem("resume2LeftSectionOrder", JSON.stringify(filteredLeftOrder));
        console.log('🗑️ Removed custom sections from left side:', filteredLeftOrder);
      }
      
    } else if (userId && Object.keys(customSections).length === 0) {
      // If no current custom sections, remove all custom sections from both sides
      const currentRightOrder = [...rightSectionOrder];
      const filteredRightOrder = currentRightOrder.filter(section => !section.startsWith('custom_'));
      
      if (filteredRightOrder.length !== currentRightOrder.length) {
        setRightSectionOrder(filteredRightOrder);
        localStorage.setItem("resume2RightSectionOrder", JSON.stringify(filteredRightOrder));
        console.log('🗑️ Removed all custom sections from right side (no current sections)');
      }
      
      const currentLeftOrder = [...leftSectionOrder];
      const filteredLeftOrder = currentLeftOrder.filter(section => !section.startsWith('custom_'));
      if (filteredLeftOrder.length !== currentLeftOrder.length) {
        setLeftSectionOrder(filteredLeftOrder);
        localStorage.setItem("resume2LeftSectionOrder", JSON.stringify(filteredLeftOrder));
        console.log('🗑️ Removed all custom sections from left side (no current sections)');
      }
    }
  }, [customSections]);

  // Save section orders to localStorage whenever they change
  useEffect(() => {
    if (leftSectionOrder.length > 0) {
      localStorage.setItem("resume2LeftSectionOrder", JSON.stringify(leftSectionOrder));
    }
  }, [leftSectionOrder]);

  useEffect(() => {
    if (rightSectionOrder.length > 0) {
      localStorage.setItem("resume2RightSectionOrder", JSON.stringify(rightSectionOrder));
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

  const renderLeftSectionContent = (sectionId) => {
    switch (sectionId) {
      case 'contact':
        return (
          <Box display="flex" flexDirection="column" alignItems="center" sx={{ width: '100%', fontFamily: font }}>
            <Avatar
              src={photo || "https://via.placeholder.com/150"}
              sx={{
                width: 140,
                height: 140,
                mb: 2,
                border: "3px solid white",
                bgcolor: color,
                "@media print": {
                  bgcolor: color,
                  border: "3px solid white",
                },
              }}
            />

            <Divider sx={{ bgcolor: "white", my: sectionSpacingValue, width: "100%", borderBottomWidth: lineWeight }} />

            <Typography variant="h6" gutterBottom sx={{ fontSize: headingSize, fontWeight: "bold", mb: 1, mt: 1, fontFamily: font }}>
              CONTACT ME
            </Typography>
            <List dense sx={{ width: '100%', fontFamily: font }}>
              <ListItem sx={{ mb: paragraphSpacingValue, px: 0 }}>
                <ListItemIcon sx={{ color: "white", minWidth: "30px" }}>
                  <PhoneIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText 
                  primary={data.phone} 
                  primaryTypographyProps={{ 
                    color: "white", 
                    fontSize: fontSize, 
                    style: { fontStyle, lineHeight: lineSpacingValue },
                    fontFamily: font
                  }} 
                />
              </ListItem>
              <ListItem sx={{ mb: paragraphSpacingValue, px: 0 }}>
                <ListItemIcon sx={{ color: "white", minWidth: "30px" }}>
                  <EmailIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText 
                  primary={data.email} 
                  primaryTypographyProps={{ 
                    color: "white", 
                    fontSize: fontSize, 
                    style: { fontStyle, lineHeight: lineSpacingValue },
                    fontFamily: font
                  }} 
                />
              </ListItem>
              <ListItem sx={{ mb: paragraphSpacingValue, px: 0 }}>
                <ListItemIcon sx={{ color: "white", minWidth: "30px" }}>
                  <LocationOnIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText 
                  primary={data.city} 
                  primaryTypographyProps={{ 
                    color: "white", 
                    fontSize: fontSize, 
                    style: { fontStyle, lineHeight: lineSpacingValue },
                    fontFamily: font
                  }} 
                />
              </ListItem>
              {data.website && (
                <ListItem sx={{ mb: paragraphSpacingValue, px: 0 }}>
                  <ListItemIcon sx={{ color: "white", minWidth: "30px" }}>
                    <ComputerIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText 
                    primary={data.website} 
                    primaryTypographyProps={{ 
                      color: "white", 
                      fontSize: fontSize, 
                      style: { fontStyle, lineHeight: lineSpacingValue },
                      fontFamily: font
                    }} 
                  />
                </ListItem>
              )}
            </List>
          </Box>
        );
      
      case 'education':
        return (
          <Box sx={{ width: '100%', pl: 1, fontFamily: font }}>
            <Divider sx={{ bgcolor: "white", my: sectionSpacingValue, width: "100%", borderBottomWidth: lineWeight }} />
            <Typography variant="h6" gutterBottom sx={{ fontSize: headingSize, fontWeight: "bold", mb: 1, mt: 1, fontFamily: font }}>
              EDUCATION
            </Typography>
            {educationEntries.length > 0 ? (
              educationEntries.map((edu) => (
                <Box key={edu.id} sx={{ mb: paragraphSpacingValue }}>
                  <Typography sx={{ fontWeight: "bold", fontSize: fontSize, fontStyle: fontStyle, fontFamily: font, lineHeight: lineSpacingValue }}>
                    {edu.degree} - {edu.fieldOfStudy}
                  </Typography>
                  <Typography sx={{ fontSize: fontSize, fontStyle: fontStyle, fontFamily: font, lineHeight: lineSpacingValue }}>
                    {edu.schoolName}, {edu.schoolLocation}
                  </Typography>
                  <Typography sx={{ fontSize: fontSize, fontStyle: "italic", fontFamily: font, lineHeight: lineSpacingValue }}>
                    {formatDate(edu.gradMonth, edu.gradYear)}
                  </Typography>
                  {edu.additionalCoursework && (
                    <Typography sx={{ fontSize: fontSize, fontStyle: fontStyle, fontFamily: font, lineHeight: lineSpacingValue }}>
                      {edu.additionalCoursework}
                    </Typography>
                  )}
                </Box>
              ))
            ) : (
              <Typography sx={{ fontSize: fontSize, fontFamily: font, lineHeight: lineSpacingValue }}>
                No education entries added yet.
              </Typography>
            )}
          </Box>
        );
      
      case 'skills':
        return (
          <Box sx={{ width: '100%', fontFamily: font }}>
            <Divider sx={{ bgcolor: "white", my: sectionSpacingValue, width: "100%", borderBottomWidth: lineWeight }} />
            <Typography variant="h6" gutterBottom sx={{ fontSize: headingSize, fontWeight: "bold", mb: 1, mt: 1, fontFamily: font }}>
              SKILLS
            </Typography>
            <List dense sx={{ width: '100%', fontFamily: font }}>
              {savedSkills.length > 0 ? (
                savedSkills.map((skill, i) => (
                  <ListItem key={i} sx={{ px: 0, mb: paragraphSpacingValue / 2 }}>
                    <ListItemIcon sx={{ color: "white", minWidth: "30px" }}>
                      <StarIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText
                      primary={skill.name}
                      secondary={`${skill.rating || 0}%`}
                      primaryTypographyProps={{ 
                        color: "white", 
                        fontSize: fontSize, 
                        style: { fontStyle, lineHeight: lineSpacingValue },
                        fontFamily: font
                      }}
                      secondaryTypographyProps={{ 
                        color: "white", 
                        fontSize: fontSize, 
                        style: { fontStyle, lineHeight: lineSpacingValue },
                        fontFamily: font
                      }}
                    />
                  </ListItem>
                ))
              ) : (
                <Typography sx={{ fontSize: fontSize, fontFamily: font, lineHeight: lineSpacingValue }}>No skills added yet.</Typography>
              )}
            </List>
          </Box>
        );
      
      default:
        // For sections that were moved from right side, use renderRightSectionContent with inSidebar=true
        return renderRightSectionContent(sectionId, true);
    }
  };

  const renderRightSectionContent = (sectionId, inSidebar = false) => {
    const textColor = inSidebar ? "white" : "inherit";
    const iconColor = inSidebar ? "white" : color;
    
    switch (sectionId) {
      case 'profile':
        return savedSummary ? (
          <div className="resume-section" style={{ marginBottom: sectionSpacingValue }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <PersonIcon sx={{ color: iconColor, mr: 1, fontSize: '28px' }} />
              <Typography sx={{ fontSize: headingSize, fontWeight: "bold", color: iconColor, fontFamily: font }}>
                SUMMARY
              </Typography>
            </Box>
            <Typography sx={{ mb: paragraphSpacingValue, fontSize: fontSize, fontStyle: fontStyle, whiteSpace: "pre-line", fontFamily: font, color: textColor, lineHeight: lineSpacingValue }}>
              {savedSummary}
            </Typography>
          </div>
        ) : null;
      
      case 'workExperience':
        return workExperiences && workExperiences.length > 0 ? (
          <div className="resume-section" style={{ marginBottom: sectionSpacingValue }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <WorkIcon sx={{ color: iconColor, mr: 1, fontSize: '28px' }} />
              <Typography sx={{ fontSize: headingSize, fontWeight: "bold", color: iconColor, fontFamily: font }}>
                WORK EXPERIENCE
              </Typography>
            </Box>
            <Box sx={{ mt: 2, fontFamily: font }}>
              {workExperiences.map((work, i) => (
                <Box key={i} sx={{ mb: paragraphSpacingValue }}>
                  <Typography sx={{ fontWeight: "bold", fontSize: fontSize, fontFamily: font, color: textColor, lineHeight: lineSpacingValue }}>
                    {work.jobTitle} @ {work.employer}
                  </Typography>
                  <Typography sx={{ fontSize: fontSize, fontStyle: "italic", mb: 0.5, fontFamily: font, color: textColor, lineHeight: lineSpacingValue }}>
                    {work.companyName} | {work.location} | {formatDate(work.startMonth, work.startYear)} - {work.current ? "Present" : formatDate(work.endMonth, work.endYear)}
                  </Typography>
                  {work.description && (
                    <Box
                      sx={{
                        mt: 1,
                        fontFamily: font,
                        color: textColor,
                        lineHeight: lineSpacingValue,
                        "& strong": { fontWeight: "bold", fontFamily: font },
                        "& em": { fontStyle: "italic", fontFamily: font },
                        "& u": { textDecoration: "underline", fontFamily: font },
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
            </Box>
          </div>
        ) : null;
      
      case 'contact':
        return (
          <div className="resume-section" style={{ marginBottom: sectionSpacingValue }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <PersonIcon sx={{ color: iconColor, mr: 1, fontSize: '28px' }} />
              <Typography sx={{ fontSize: headingSize, fontWeight: "bold", color: iconColor, fontFamily: font }}>
                CONTACT ME
              </Typography>
            </Box>
            <Box display="flex" flexDirection="column" sx={{ width: '100%', fontFamily: font }}>
              {!inSidebar && (
                <Avatar
                  src={photo || "https://via.placeholder.com/150"}
                  sx={{
                    width: 140,
                    height: 140,
                    mb: 2,
                    border: `3px solid ${color}`,
                    alignSelf: 'center'
                  }}
                />
              )}
              <List dense sx={{ width: '100%', fontFamily: font }}>
                <ListItem sx={{ mb: paragraphSpacingValue, px: 0 }}>
                  <ListItemIcon sx={{ color: iconColor, minWidth: "30px" }}>
                    <PhoneIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText 
                    primary={data.phone} 
                    primaryTypographyProps={{ 
                      color: textColor, 
                      fontSize: fontSize, 
                      style: { fontStyle, lineHeight: lineSpacingValue },
                      fontFamily: font
                    }} 
                  />
                </ListItem>
                <ListItem sx={{ mb: paragraphSpacingValue, px: 0 }}>
                  <ListItemIcon sx={{ color: iconColor, minWidth: "30px" }}>
                    <EmailIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText 
                    primary={data.email} 
                    primaryTypographyProps={{ 
                      color: textColor, 
                      fontSize: fontSize, 
                      style: { fontStyle, lineHeight: lineSpacingValue },
                      fontFamily: font
                    }} 
                  />
                </ListItem>
                <ListItem sx={{ mb: paragraphSpacingValue, px: 0 }}>
                  <ListItemIcon sx={{ color: iconColor, minWidth: "30px" }}>
                    <LocationOnIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText 
                    primary={data.city} 
                    primaryTypographyProps={{ 
                      color: textColor, 
                      fontSize: fontSize, 
                      style: { fontStyle, lineHeight: lineSpacingValue },
                      fontFamily: font
                    }} 
                  />
                </ListItem>
                {data.website && (
                  <ListItem sx={{ mb: paragraphSpacingValue, px: 0 }}>
                    <ListItemIcon sx={{ color: iconColor, minWidth: "30px" }}>
                      <ComputerIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText 
                      primary={data.website} 
                      primaryTypographyProps={{ 
                        color: textColor, 
                        fontSize: fontSize, 
                        style: { fontStyle, lineHeight: lineSpacingValue },
                        fontFamily: font
                      }} 
                    />
                  </ListItem>
                )}
              </List>
            </Box>
          </div>
        );
      
      case 'education':
        return (
          <div className="resume-section" style={{ marginBottom: sectionSpacingValue }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <SchoolIcon sx={{ color: iconColor, mr: 1, fontSize: '28px' }} />
              <Typography sx={{ fontSize: headingSize, fontWeight: "bold", color: iconColor, fontFamily: font }}>
                EDUCATION
              </Typography>
            </Box>
            {educationEntries.length > 0 ? (
              educationEntries.map((edu) => (
                <Box key={edu.id} sx={{ mb: paragraphSpacingValue }}>
                  <Typography sx={{ fontWeight: "bold", fontSize: fontSize, fontStyle: fontStyle, fontFamily: font, color: textColor, lineHeight: lineSpacingValue }}>
                    {edu.degree} - {edu.fieldOfStudy}
                  </Typography>
                  <Typography sx={{ fontSize: fontSize, fontStyle: fontStyle, fontFamily: font, color: textColor, lineHeight: lineSpacingValue }}>
                    {edu.schoolName}, {edu.schoolLocation}
                  </Typography>
                  <Typography sx={{ fontSize: fontSize, fontStyle: "italic", fontFamily: font, color: textColor, lineHeight: lineSpacingValue }}>
                    {formatDate(edu.gradMonth, edu.gradYear)}
                  </Typography>
                  {edu.additionalCoursework && (
                    <Typography sx={{ fontSize: fontSize, fontStyle: fontStyle, fontFamily: font, color: textColor, lineHeight: lineSpacingValue }}>
                      {edu.additionalCoursework}
                    </Typography>
                  )}
                </Box>
              ))
            ) : (
              <Typography sx={{ fontSize: fontSize, fontFamily: font, color: textColor, lineHeight: lineSpacingValue }}>
                No education entries added yet.
              </Typography>
            )}
          </div>
        );
      
      case 'skills':
        return (
          <div className="resume-section" style={{ marginBottom: sectionSpacingValue }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <StarIcon sx={{ color: iconColor, mr: 1, fontSize: '28px' }} />
              <Typography sx={{ fontSize: headingSize, fontWeight: "bold", color: iconColor, fontFamily: font }}>
                SKILLS
              </Typography>
            </Box>
            <List dense sx={{ width: '100%', fontFamily: font }}>
              {savedSkills.length > 0 ? (
                savedSkills.map((skill, i) => (
                  <ListItem key={i} sx={{ px: 0, mb: paragraphSpacingValue / 2 }}>
                    <ListItemIcon sx={{ color: iconColor, minWidth: "30px" }}>
                      <StarIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText
                      primary={skill.name}
                      secondary={`${skill.rating || 0}%`}
                      primaryTypographyProps={{ 
                        color: textColor, 
                        fontSize: fontSize, 
                        style: { fontStyle, lineHeight: lineSpacingValue },
                        fontFamily: font
                      }}
                      secondaryTypographyProps={{ 
                        color: textColor, 
                        fontSize: fontSize, 
                        style: { fontStyle, lineHeight: lineSpacingValue },
                        fontFamily: font
                      }}
                    />
                  </ListItem>
                ))
              ) : (
                <Typography sx={{ fontSize: fontSize, fontFamily: font, color: textColor, lineHeight: lineSpacingValue }}>No skills added yet.</Typography>
              )}
            </List>
          </div>
        );
      
      case 'languages':
        return savedLanguages.length > 0 ? (
          <div className="resume-section" style={{ marginBottom: sectionSpacingValue }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <LanguageIcon sx={{ color: iconColor, mr: 1, fontSize: '28px' }} />
              <Typography sx={{ fontSize: headingSize, fontWeight: "bold", color: iconColor, fontFamily: font }}>
                LANGUAGES
              </Typography>
            </Box>
            {savedLanguages.map((lang, index) => (
              <Typography key={index} sx={{ mb: paragraphSpacingValue, fontSize: fontSize, fontStyle: fontStyle, fontFamily: font, color: textColor, lineHeight: lineSpacingValue }}>
                • {lang.name} {lang.level && `(${lang.level})`}
              </Typography>
            ))}
          </div>
        ) : null;
      
      case 'accomplishments':
        return savedAccomplishments.length > 0 ? (
          <div className="resume-section" style={{ marginBottom: sectionSpacingValue }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <StarIcon sx={{ color: iconColor, mr: 1, fontSize: '28px' }} />
              <Typography sx={{ fontSize: headingSize, fontWeight: "bold", color: iconColor, fontFamily: font }}>
                ACCOMPLISHMENTS
              </Typography>
            </Box>
            {savedAccomplishments.map((acc, index) => (
              <Typography key={index} sx={{ mb: paragraphSpacingValue, fontSize: fontSize, fontStyle: fontStyle, fontFamily: font, color: textColor, lineHeight: lineSpacingValue }} whiteSpace="pre-line">
                • {acc}
              </Typography>
            ))}
          </div>
        ) : null;
      
      case 'certifications':
        return savedCertifications.length > 0 ? (
          <div className="resume-section" style={{ marginBottom: sectionSpacingValue }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <SchoolIcon sx={{ color: iconColor, mr: 1, fontSize: '28px' }} />
              <Typography sx={{ fontSize: headingSize, fontWeight: "bold", color: iconColor, fontFamily: font }}>
                CERTIFICATIONS
              </Typography>
            </Box>
            {savedCertifications.map((cert, index) => (
              <Typography key={index} sx={{ mb: paragraphSpacingValue, fontSize: fontSize, fontStyle: fontStyle, fontFamily: font, color: textColor, lineHeight: lineSpacingValue }}>
                • {cert.name} – {cert.provider} ({cert.year})
              </Typography>
            ))}
          </div>
        ) : null;
      
      case 'softwareSkills':
        return softwareSkills.length > 0 ? (
          <div className="resume-section" style={{ marginBottom: sectionSpacingValue }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <ComputerIcon sx={{ color: iconColor, mr: 1, fontSize: '28px' }} />
              <Typography sx={{ fontSize: headingSize, fontWeight: "bold", color: iconColor, fontFamily: font }}>
                SOFTWARE SKILLS
              </Typography>
            </Box>
            {softwareSkills.map((skill, index) => (
              <Typography key={index} sx={{ mb: paragraphSpacingValue, fontSize: fontSize, fontStyle: fontStyle, fontFamily: font, color: textColor, lineHeight: lineSpacingValue }}>
                • {skill.name} — {skill.level}%
              </Typography>
            ))}
          </div>
        ) : null;
      
      case 'volunteering':
        return savedVolunteering.length > 0 ? (
          <div className="resume-section" style={{ marginBottom: sectionSpacingValue }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <VolunteerActivismIcon sx={{ color: iconColor, mr: 1, fontSize: '28px' }} />
              <Typography sx={{ fontSize: headingSize, fontWeight: "bold", color: iconColor, fontFamily: font }}>
                VOLUNTEERING
              </Typography>
            </Box>
            {savedVolunteering.map((vol, index) => (
              <Box key={index} sx={{ mb: paragraphSpacingValue, fontFamily: font }}>
                <Typography sx={{ fontSize: fontSize, fontWeight: "bold", fontStyle: fontStyle, fontFamily: font, color: textColor, lineHeight: lineSpacingValue }}>
                  {vol.subtopic}
                </Typography>
                <Typography sx={{ fontSize: fontSize, color: inSidebar ? "rgba(255,255,255,0.8)" : "gray", fontStyle: "italic", fontFamily: font, lineHeight: lineSpacingValue }}>
                  {vol.fromDate} - {vol.toDate}
                </Typography>
                <Typography sx={{ fontSize: fontSize, whiteSpace: "pre-line", mt: 0.5, fontStyle: fontStyle, fontFamily: font, color: textColor, lineHeight: lineSpacingValue }}>
                  {vol.content}
                </Typography>
              </Box>
            ))}
          </div>
        ) : null;
      
      case 'interests':
        return savedInterests.length > 0 ? (
          <div className="resume-section" style={{ marginBottom: sectionSpacingValue }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <ComputerIcon sx={{ color: iconColor, mr: 1, fontSize: '28px' }} />
              <Typography sx={{ fontSize: headingSize, fontWeight: "bold", color: iconColor, fontFamily: font }}>
                INTERESTS
              </Typography>
            </Box>
            {savedInterests.map((interest, i) => (
              <Typography key={i} sx={{ mb: paragraphSpacingValue, fontSize: fontSize, fontStyle: fontStyle, fontFamily: font, color: textColor, lineHeight: lineSpacingValue }}>
                • {interest}
              </Typography>
            ))}
          </div>
        ) : null;
      
      case 'websites':
        return savedWebsites.length > 0 ? (
          <div className="resume-section" style={{ marginBottom: sectionSpacingValue }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <LinkIcon sx={{ color: iconColor, mr: 1, fontSize: '28px' }} />
              <Typography sx={{ fontSize: headingSize, fontWeight: "bold", color: iconColor, fontFamily: font }}>
                WEBSITES / PROFILES
              </Typography>
            </Box>
            {savedWebsites.map((site, index) => (
              <Typography key={index} sx={{ mb: paragraphSpacingValue, fontSize: fontSize, fontStyle: fontStyle, fontFamily: font, color: textColor, lineHeight: lineSpacingValue }}>
                • {site.url}
              </Typography>
            ))}
          </div>
        ) : null;
      
      case 'references':
        return savedReferences.length > 0 ? (
          <div className="resume-section" style={{ marginBottom: sectionSpacingValue }}>
            <Box sx={{ mb: 2, fontFamily: font }}>
              <Box sx={{display:"flex "}}> 
                <PersonIcon sx={{ color: iconColor, mr: 1, fontSize: '28px' }} />
                <Typography sx={{color: iconColor, mb: 1, fontSize: headingSize, fontWeight: "bold", fontFamily: font }}>
                  REFERENCES
                </Typography>
              </Box> 
              {savedReferences.map((ref, index) => (
                <Typography key={index} sx={{ mb: paragraphSpacingValue, fontSize: fontSize, fontFamily: font, color: textColor, lineHeight: lineSpacingValue }} whiteSpace="pre-line">
                  {ref}
                </Typography>
              ))}
            </Box>
          </div>
        ) : null;
      
      case 'additionalInfo':
        return savedAdditionalInfo.length > 0 ? (
          <div className="resume-section" style={{ marginBottom: sectionSpacingValue }}>
            <Box sx={{ mb: 2, fontFamily: font }}>
              <Box sx={{display:"flex "}}> 
                <ComputerIcon sx={{ color: iconColor, mr: 1, fontSize: '28px', mt:1 }} />
                <Typography sx={{ mb: 1, fontSize: headingSize, fontWeight: "bold", color: iconColor, fontFamily: font }}>
                  ADDITIONAL INFORMATION
                </Typography>
              </Box>
              {savedAdditionalInfo.map((info, index) => (
                <Typography key={index} sx={{ mb: paragraphSpacingValue, fontSize: fontSize, fontFamily: font, color: textColor, lineHeight: lineSpacingValue }}>
                  {info}
                </Typography>
              ))}
            </Box>
          </div>
        ) : null;
      
      // In renderRightSectionContent function, add this case in the default section:
      default:
        // Handle custom sections
        if (sectionId.startsWith('custom_')) {
          const customSectionName = sectionId.replace('custom_', '');
          const items = customSections[customSectionName] || [];
          
          console.log(`🎯 Rendering custom section: ${customSectionName}`, items);
          
          if (items && items.length > 0) {
            return (
              <div key={sectionId} className="resume-section" style={{ marginBottom: sectionSpacingValue }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <ComputerIcon sx={{ color: iconColor, mr: 1, fontSize: '28px' }} />
                  <Typography sx={{ fontSize: headingSize, fontWeight: "bold", color: iconColor, fontFamily: font }}>
                    {customSectionName.toUpperCase()}
                  </Typography>
                </Box>
                {items.map((item, i) => (
                  <Typography 
                    key={i} 
                    sx={{ 
                      mb: paragraphSpacingValue, 
                      fontSize: fontSize, 
                      fontStyle: fontStyle, 
                      fontFamily: font, 
                      color: textColor,
                      whiteSpace: "pre-line",
                      lineHeight: lineSpacingValue
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

  const getSectionTitle = (sectionId) => {
    const titles = {
      'contact': 'Contact Me',
      'education': 'Education',
      'skills': 'Skills',
      'profile': 'Summary',
      'workExperience': 'Work Experience',
      'languages': 'Languages',
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
      return sectionId.replace('custom_', '').toUpperCase();
    }
    
    return titles[sectionId] || sectionId;
  };

  const renderDragPanel = (side, sections) => {
    return (
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
          <DragIndicator sx={{ mr: 1 }} />
          {side === 'left' ? 'Left Sidebar' : 'Main Content'} Sections
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
  }, [page.height, topBottomMargin]);

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
    leftSectionOrder,
    rightSectionOrder,
    // design props
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
    lineWeight,
    pageSize,
  ]);

  const renderSidebar = (isFirstPage = false) => {
    return (
      <Box
        sx={{
          width: "30%",
          bgcolor: color,
          color: "white",
          p: isFirstPage ? 3 : 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          minHeight: page.height,
          fontFamily: font,
          "@media print": {
            bgcolor: color,
            color: "white",
            p: isFirstPage ? 2 : 0,
            width: "30%",
            display: "inline-block",
            verticalAlign: "top",
            WebkitPrintColorAdjust: "exact",
            printColorAdjust: "exact",
            minHeight: page.height,
            fontFamily: font,
          },
        }}
      >
        {isFirstPage ? (
          <Box display="flex" flexDirection="column" alignItems="center" sx={{ width: '100%', fontFamily: font }}>
            {/* Render left side sections in the specified order */}
            {leftSectionOrder.map((sectionId, index) => (
              <React.Fragment key={sectionId}>
                {renderLeftSectionContent(sectionId)}
              </React.Fragment>
            ))}
          </Box>
        ) : (
          // Empty sidebar for subsequent pages - just the colored background
          <Box sx={{ minHeight: "100%" }} />
        )}
      </Box>
    );
  };

  const renderMainContentToMeasure = () => (
    <Box ref={mainContentRef} sx={{ visibility: 'hidden', position: 'absolute', fontFamily: font }}>
      <div className="resume-section" style={{ marginBottom: sectionSpacingValue }}>
        <Typography sx={{ mb: paragraphSpacingValue, fontSize: headingSize, fontWeight: "bold", fontFamily: font, lineHeight: lineSpacingValue }}>
          {data.firstName} {data.lastName}
        </Typography>
        <Typography sx={{ mb: 2, fontSize: fontSize, fontFamily: font, lineHeight: lineSpacingValue }}>{data.currentPosition}</Typography>
      </div>

      {/* Render right side sections in the specified order */}
      {rightSectionOrder.map(sectionId => (
        <React.Fragment key={sectionId}>
          {renderRightSectionContent(sectionId)}
        </React.Fragment>
      ))}
    </Box>
  );

  return (
    <Box sx={{ width: "100%", position: "relative", m: 5, fontFamily: font }}>
      {!exporting && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 2, '@media print': { display: 'none' } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))} disabled={currentPage === 0} color="primary">
              <ChevronLeft />
            </IconButton>
            <Typography sx={{ mx: 2, fontFamily: font }}>Page {currentPage + 1} of {Math.max(1, pages.length)}</Typography>
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
      
      <Box id="resume-container" sx={{ fontFamily: font }}>
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
                lineHeight: lineSpacingValue,
                display: "flex",
                flexDirection: "column",
                pageBreakAfter: "always",
                "@media print": {
                  width: page.width,
                  height: "auto",
                  minHeight: page.height,
                  boxShadow: "none",
                  m: 0,
                  fontFamily: font,
                },
                // Show all pages when exporting, only current page when viewing
                display: exporting ? 'flex' : (index === currentPage ? 'flex' : 'none'),
                '@media print': { display: 'flex' }
              }}
            >
              <Box sx={{ display: "flex", height: "100%", fontFamily: font }}>
                {renderSidebar(index === 0)}
                <Box
                  sx={{
                    width: "70%",
                    p: `${topBottomMargin}px ${sideMargins}px`,
                    fontFamily: font,
                    "@media print": { 
                      p: 2,
                      fontFamily: font,
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
              mx: "auto",
              bgcolor: "#fff",
              boxShadow: 3,
              fontFamily: font,
              fontSize: fontSize,
              fontStyle: fontStyle,
              lineHeight: lineSpacingValue,
              display: "flex",
              flexDirection: "column",
              "@media print": {
                width: page.width,
                height: "auto",
                minHeight: page.height,
                boxShadow: "none",
                m: 0,
                fontFamily: font,
              },
            }}
          >
            <Box sx={{ display: "flex", height: "100%", fontFamily: font }}>
              {renderSidebar(true)}
              <Box
                sx={{
                  width: "70%",
                  p: `${topBottomMargin}px ${sideMargins}px`,
                  fontFamily: font,
                  "@media print": { 
                    p: 2,
                    fontFamily: font,
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
            Drag and drop sections to reorder them within each side or move sections between sidebar and main content.
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

export const resumeMeta = {
  hasPhoto: true,
  columns: 2,
};

export default Resume2;