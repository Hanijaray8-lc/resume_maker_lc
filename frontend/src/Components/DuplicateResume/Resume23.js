import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  Box,
  Grid,
  Typography,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Button,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip
} from "@mui/material";
import {
  ChevronLeft,
  ChevronRight,
  Print,
  Download,
  DragIndicator,
  Reorder,
  Email,
  Phone,
  LocationOn,
  Language,
  Star,
  CardMembership,
  Computer,
  VolunteerActivism,
  Interests,
  Link,
  ContactPhone,
  Info
} from "@mui/icons-material";
import { 
  Timeline, TimelineItem, TimelineSeparator, TimelineConnector, TimelineContent, TimelineDot 
} from '@mui/lab';
// --- Icons ---
import SchoolIcon from '@mui/icons-material/School';
import WorkIcon from '@mui/icons-material/Work';
import CircleIcon from '@mui/icons-material/Circle';
import SquareIcon from '@mui/icons-material/Square';
import PersonIcon from '@mui/icons-material/Person';
import BuildIcon from '@mui/icons-material/Build';
import TranslateIcon from '@mui/icons-material/Translate';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import html2pdf from "html2pdf.js";

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
  skills: [
    "JavaScript / React",
    "Node.js / Express",
    "MongoDB / MySQL",
    "REST APIs",
    "Teamwork & Communication",
  ],
  references: [
    {
      name: "Estelle Darcy",
      company: "Wardiere Inc.",
      position: "CTO",
      phone: "123-456-7890",
      email: "estelle@wardiere.com",
    },
    {
      name: "Harper Richard",
      company: "Wardiere Inc.",
      position: "CEO",
      phone: "123-456-7890",
      email: "harper@wardiere.com",
    },
  ],
};

// Separate section orders for left and right sides
const defaultLeftSectionOrder = [
  'contact',
  'profile',
  'skills',
  'languages',
  'references'
];

const defaultRightSectionOrder = [
  'education',
  'workExperience',
  'accomplishments',
  'certifications',
  'softwareSkills',
  'volunteering',
  'interests',
  'websites',
  'additionalInfo'
];

const Resume23 = ({
  color = "#471a33ff",
  font = "EB Garamond",
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
  designSettings = {}
}) => {
  // Merge design settings with props
  const mergedDesignSettings = {
    color: designSettings.color || color,
    font: designSettings.font || font,
    fontSize: designSettings.fontSize || fontSize,
    headingSize: designSettings.headingSize || headingSize,
    fontStyle: designSettings.fontStyle || fontStyle,
    sectionSpacing: designSettings.sectionSpacing !== undefined ? designSettings.sectionSpacing : sectionSpacing,
    paragraphSpacing: designSettings.paragraphSpacing !== undefined ? designSettings.paragraphSpacing : paragraphSpacing,
    lineSpacing: designSettings.lineSpacing !== undefined ? designSettings.lineSpacing : lineSpacing,
    topBottomMargin: designSettings.topBottomMargin !== undefined ? designSettings.topBottomMargin : topBottomMargin,
    sideMargins: designSettings.sideMargins !== undefined ? designSettings.sideMargins : sideMargins,
    paragraphIndent: designSettings.paragraphIndent !== undefined ? designSettings.paragraphIndent : paragraphIndent,
    lineWeight: designSettings.lineWeight !== undefined ? designSettings.lineWeight : lineWeight,
    pageSize: designSettings.pageSize || pageSize
  };

  const page = pageSizeMap[mergedDesignSettings.pageSize] || pageSizeMap.A4;
  const data = { ...defaultData, ...formData };
  const [currentPage, setCurrentPage] = useState(0);
  const [pages, setPages] = useState([]);
  const mainContentRef = useRef(null);
  const sidebarRef = useRef(null);
  
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

    // 🔄 Resume9-ல் இருந்து custom section logic-ஐ copy செய்யவும்
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
    // 🔥 FIX: Left side-ல custom sections auto add ஆகாது - filter only
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

 // Add this useEffect to automatically add/remove custom sections (Resume9 logic)
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

  const SectionHeading = ({ icon: Icon, children, colorProp = mergedDesignSettings.color }) => (
    <Typography sx={{ 
      mb: 1, 
      fontSize: mergedDesignSettings.headingSize, 
      fontWeight: "bold", 
      fontFamily: mergedDesignSettings.font, 
      color: "white",
      display: 'flex',
      alignItems: 'center',
      gap: 1
    }}>
      <Icon sx={{ fontSize: `calc(${mergedDesignSettings.headingSize} * 0.8)` }} />
      {children}
    </Typography>
  );

  const MainSectionHeading = ({ icon: Icon, children, colorProp = mergedDesignSettings.color }) => (
    <Typography sx={{ 
      mb: 1, 
      fontSize: mergedDesignSettings.headingSize, 
      fontWeight: "bold", 
      fontFamily: mergedDesignSettings.font, 
      color: colorProp,
      display: 'flex',
      alignItems: 'center',
      gap: 1
    }}>
      <Icon sx={{ fontSize: `calc(${mergedDesignSettings.headingSize} * 0.8)` }} />
      {children}
    </Typography>
  );

  const LeftColumnList = ({ heading, items, useBullets = true, icon: Icon }) => (
    <Box sx={{ mb: 3 }}>
      {heading && (
        <SectionHeading icon={Icon}>
          {heading}
        </SectionHeading>
      )}
      <List disablePadding dense sx={{ ml: -1 }}>
        {items.map((item, index) => (
          <ListItem key={index} sx={{ py: 0, pl: 0.5 }}>
            {useBullets ? (
              <SquareIcon sx={{ fontSize: 7, mr: 1, color: 'white' }} />
            ) : (
              <Box sx={{ width: 14 }} /> 
            )}
            <ListItemText 
              primary={typeof item === 'string' ? item : `${item.name} ${item.proficiency || item.level || `(${item.rating || 0}%)`}`}
              primaryTypographyProps={{ 
                color: 'white', 
                fontSize: mergedDesignSettings.fontSize,
                fontFamily: mergedDesignSettings.font,
                fontStyle: mergedDesignSettings.fontStyle,
                lineHeight: 1.2
              }}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  // Contact Info Component
  const ContactInfo = () => (
    <Box sx={{ textAlign: 'center' }}>
      <Avatar 
        src={photo || "https://via.placeholder.com/150"} 
        sx={{ 
          width: 120, 
          height: 120, 
          mb: 2,
          mx: 'auto',
          border: `3px solid white`
        }} 
      />
    </Box>
  );

  // Section rendering functions with icons
  const renderLeftSectionContent = (sectionId) => {
    switch (sectionId) {
      case 'contact':
        return <ContactInfo />;
      
      case 'education':
        return (
          <Box>
            <SectionHeading icon={SchoolIcon}>EDUCATION</SectionHeading>
            <Timeline sx={{ p: 0 }}>
              {educationEntries.length > 0 ? (
                educationEntries.map((edu, index) => (
                  <TimelineItem key={edu.id} sx={{ '&::before': { flex: 0 } }}>
                    <TimelineSeparator>
                      <TimelineDot variant="outlined" sx={{ borderColor: 'white' }} />
                      {index < educationEntries.length - 1 && <TimelineConnector sx={{ bgcolor: 'white' }} />}
                    </TimelineSeparator>
                    <TimelineContent>
                      <Typography sx={{ 
                        fontWeight: "bold", 
                        fontSize: mergedDesignSettings.fontSize, 
                        fontFamily: mergedDesignSettings.font, 
                        fontStyle: mergedDesignSettings.fontStyle,
                        color: "white" 
                      }}>
                        {edu.degree} - {edu.fieldOfStudy}
                      </Typography>
                      <Typography sx={{ 
                        fontSize: mergedDesignSettings.fontSize, 
                        fontFamily: mergedDesignSettings.font, 
                        fontStyle: mergedDesignSettings.fontStyle,
                        color: "white" 
                      }}>{edu.schoolName}, {edu.schoolLocation}</Typography>
                      <Typography sx={{ 
                        fontSize: mergedDesignSettings.fontSize, 
                        fontStyle: "italic", 
                        fontFamily: mergedDesignSettings.font, 
                        fontStyle: mergedDesignSettings.fontStyle,
                        color: "white" 
                      }}>{formatDate(edu.gradMonth, edu.gradYear)}</Typography>
                      {edu.additionalCoursework && <Typography sx={{ 
                        fontSize: mergedDesignSettings.fontSize, 
                        fontFamily: mergedDesignSettings.font, 
                        fontStyle: mergedDesignSettings.fontStyle,
                        color: "white" 
                      }}>{edu.additionalCoursework}</Typography>}
                    </TimelineContent>
                  </TimelineItem>
                ))
              ) : (
                <Typography sx={{ 
                  fontSize: mergedDesignSettings.fontSize, 
                  fontFamily: mergedDesignSettings.font, 
                  fontStyle: mergedDesignSettings.fontStyle,
                  color: "white" 
                }}>No education entries added yet.</Typography>
              )}
            </Timeline>
          </Box>
        );
      
      case 'skills':
        return (
          <LeftColumnList 
            heading="SKILLS" 
            items={savedSkills.length > 0 ? savedSkills : data.skills} 
            useBullets={true}
            icon={BuildIcon}
          />
        );
      
      case 'languages':
        return savedLanguages.length > 0 ? (
          <LeftColumnList 
            heading="LANGUAGES" 
            items={savedLanguages} 
            useBullets={false}
            icon={TranslateIcon}
          />
        ) : null;
    
    default:
  // Handle sections moved from right side to left sidebar
  if (sectionId.startsWith('custom_')) {
    const customSectionName = sectionId.replace('custom_', '');
    const items = customSections[customSectionName] || [];
    return items.length > 0 ? (
      <Box>
        <SectionHeading icon={Info}>{customSectionName.toUpperCase()}</SectionHeading>
        <List disablePadding dense sx={{ ml: -1 }}>
          {items.map((item, i) => (
            <ListItem key={i} sx={{ py: 0, pl: 0.5 }}>
              <SquareIcon sx={{ fontSize: 7, mr: 1, color: 'white' }} />
              <ListItemText 
                primary={item}
                primaryTypographyProps={{ 
                  color: 'white', 
                  fontSize: mergedDesignSettings.fontSize,
                  fontFamily: mergedDesignSettings.font,
                  fontStyle: mergedDesignSettings.fontStyle,
                  lineHeight: 1.2
                }}
              />
            </ListItem>
          ))}
        </List>
      </Box>
    ) : null;
  }

  // Handle right-side sections when they are moved to left sidebar
  return renderRightSectionContent(sectionId, true);
    }
  };

  const renderRightSectionContent = (sectionId, inSidebar = false) => {
    const textColor = inSidebar ? "white" : "inherit";
    const HeadingComponent = inSidebar ? SectionHeading : MainSectionHeading;
    
    switch (sectionId) {
      case 'profile':
        return (
          <div className="resume-section">
            <HeadingComponent icon={PersonIcon}>PROFILE INFO</HeadingComponent>
            <Typography sx={{ 
              mb: `${mergedDesignSettings.paragraphSpacing / 10}px`, 
              fontSize: mergedDesignSettings.fontSize, 
              fontFamily: mergedDesignSettings.font, 
              fontStyle: mergedDesignSettings.fontStyle,
              color: textColor 
            }}>
              {savedSummary || data.profile}
            </Typography>
          </div>
        );
      
      case 'workExperience':
        return (
          <div className="resume-section">
            <HeadingComponent icon={WorkIcon}>WORK EXPERIENCE</HeadingComponent>
            <Box sx={{ mt: 2 }}>
              <Timeline sx={{ p: 0 }}>
                {workExperiences && workExperiences.length > 0 ? (
                  workExperiences.map((work, i) => (
                    <TimelineItem key={i} sx={{ '&::before': { flex: 0 } }}>
                      <TimelineSeparator>
                        <TimelineDot variant="outlined" sx={{ borderColor: mergedDesignSettings.color }} />
                        {i < workExperiences.length - 1 && <TimelineConnector sx={{ bgcolor: mergedDesignSettings.color }} />}
                      </TimelineSeparator>
                      <TimelineContent>
                        <Typography sx={{ 
                          fontWeight: "bold", 
                          fontSize: mergedDesignSettings.fontSize, 
                          fontFamily: mergedDesignSettings.font, 
                          fontStyle: mergedDesignSettings.fontStyle,
                          color: textColor 
                        }}>
                          {formatDate(work.startMonth, work.startYear)} - {work.current ? "Present" : formatDate(work.endMonth, work.endYear)}
                        </Typography>
                        <Typography sx={{ 
                          fontWeight: "bold", 
                          fontSize: mergedDesignSettings.fontSize, 
                          fontFamily: mergedDesignSettings.font, 
                          fontStyle: mergedDesignSettings.fontStyle,
                          color: textColor 
                        }}>
                          {work.jobTitle}
                        </Typography>
                        <Typography sx={{ 
                          fontSize: mergedDesignSettings.fontSize, 
                          fontStyle: "italic", 
                          fontFamily: mergedDesignSettings.font, 
                          fontStyle: mergedDesignSettings.fontStyle,
                          color: textColor 
                        }}>
                          {work.employer}, {work.location}
                        </Typography>
                        {work.description && (
                          <List dense disablePadding>
                            {work.description.replace(/\*\*(.*?)\*\*/g, "$1").replace(/\*(.*?)\*/g, "$1").replace(/<u>(.*?)<\/u>/g, "$1").split("\n").filter(point => point.trim()).map((point, j) => (
                              <ListItem key={j} sx={{ py: 0.1, alignItems: 'flex-start' }}>
                                <CircleIcon sx={{ fontSize: 6, mr: 1, mt: 0.8, color: mergedDesignSettings.color }} />
                                <ListItemText 
                                  primary={point} 
                                  primaryTypographyProps={{ 
                                    fontSize: mergedDesignSettings.fontSize, 
                                    fontFamily: mergedDesignSettings.font, 
                                    fontStyle: mergedDesignSettings.fontStyle,
                                    color: textColor 
                                  }} 
                                />
                              </ListItem>
                            ))}
                          </List>
                        )}
                      </TimelineContent>
                    </TimelineItem>
                  ))
                ) : (
                  <Typography sx={{ 
                    fontSize: mergedDesignSettings.fontSize, 
                    fontFamily: mergedDesignSettings.font, 
                    fontStyle: mergedDesignSettings.fontStyle,
                    color: textColor 
                  }}>No work experiences added yet.</Typography>
                )}
              </Timeline>
            </Box>
          </div>
        );
      
      case 'accomplishments':
        return savedAccomplishments.length > 0 ? (
          <div className="resume-section">
            <HeadingComponent icon={EmojiEventsIcon}>ACCOMPLISHMENTS</HeadingComponent>
            {savedAccomplishments.map((acc, index) => (
              <Typography key={index} sx={{ 
                mb: `${mergedDesignSettings.paragraphSpacing / 10}px`, 
                fontSize: mergedDesignSettings.fontSize, 
                fontFamily: mergedDesignSettings.font, 
                fontStyle: mergedDesignSettings.fontStyle,
                color: textColor 
              }} whiteSpace="pre-line">
                • {acc}
              </Typography>
            ))}
          </div>
        ) : null;
      
      case 'certifications':
        return savedCertifications.length > 0 ? (
          <div className="resume-section">
            <HeadingComponent icon={CardMembership}>CERTIFICATIONS</HeadingComponent>
            {savedCertifications.map((cert, index) => (
              <Typography key={index} sx={{ 
                mb: `${mergedDesignSettings.paragraphSpacing / 10}px`, 
                fontSize: mergedDesignSettings.fontSize, 
                fontFamily: mergedDesignSettings.font, 
                fontStyle: mergedDesignSettings.fontStyle,
                color: textColor 
              }}>
                • {cert.name} – {cert.provider} ({cert.year})
              </Typography>
            ))}
          </div>
        ) : null;

      case 'references':
        return savedReferences.length > 0 ? (
          <div className="resume-section">
            <HeadingComponent icon={PersonIcon}>REFERENCES</HeadingComponent>
            {savedReferences.map((ref, index) => (
              <Typography key={index} sx={{ 
                mb: `${mergedDesignSettings.paragraphSpacing / 10}px`, 
                fontSize: mergedDesignSettings.fontSize, 
                fontFamily: mergedDesignSettings.font, 
                fontStyle: mergedDesignSettings.fontStyle,
                color: textColor 
              }} whiteSpace="pre-line">
                • {ref}
              </Typography>
            ))}
          </div>
        ) : null;      
     
      case 'softwareSkills':
        return softwareSkills.length > 0 ? (
          <div className="resume-section">
            <HeadingComponent icon={Computer}>SOFTWARE SKILLS</HeadingComponent>
            {softwareSkills.map((skill, index) => (
              <Typography key={index} sx={{ 
                mb: `${mergedDesignSettings.paragraphSpacing / 10}px`, 
                fontSize: mergedDesignSettings.fontSize, 
                fontFamily: mergedDesignSettings.font, 
                fontStyle: mergedDesignSettings.fontStyle,
                color: textColor 
              }}>
                • {skill.name} — {skill.level}%
              </Typography>
            ))}
          </div>
        ) : null;
      
      case 'volunteering':
        return savedVolunteering.length > 0 ? (
          <div className="resume-section">
            <HeadingComponent icon={VolunteerActivism}>VOLUNTEERING</HeadingComponent>
            {savedVolunteering.map((vol, index) => (
              <Box key={index} sx={{ mb: 1 }}>
                <Typography sx={{ 
                  fontSize: mergedDesignSettings.fontSize, 
                  fontWeight: "bold", 
                  fontFamily: mergedDesignSettings.font, 
                  fontStyle: mergedDesignSettings.fontStyle,
                  color: textColor 
                }}>{vol.subtopic}</Typography>
                <Typography sx={{ 
                  fontSize: mergedDesignSettings.fontSize, 
                  color: inSidebar ? "rgba(255,255,255,0.8)" : "gray", 
                  fontFamily: mergedDesignSettings.font, 
                  fontStyle: mergedDesignSettings.fontStyle 
                }}>{vol.fromDate} - {vol.toDate}</Typography>
                <Typography sx={{ 
                  fontSize: mergedDesignSettings.fontSize, 
                  whiteSpace: "pre-line", 
                  mt: 0.5, 
                  fontFamily: mergedDesignSettings.font, 
                  fontStyle: mergedDesignSettings.fontStyle,
                  color: textColor 
                }}>{vol.content}</Typography>
              </Box>
            ))}
          </div>
        ) : null;

      case 'skills':
        return (
          <div className="resume-section">
            <HeadingComponent icon={BuildIcon}>SKILLS</HeadingComponent>
            <List dense disablePadding>
              {(savedSkills.length > 0 ? savedSkills : data.skills).map((skill, i) => (
                <ListItem key={i} sx={{ py: 0.1, alignItems: 'flex-start' }}>
                  <CircleIcon sx={{ fontSize: 6, mr: 1, mt: 0.8, color: mergedDesignSettings.color }} />
                  <ListItemText 
                    primary={typeof skill === 'object' ? skill.name : skill} 
                    primaryTypographyProps={{ 
                      fontSize: mergedDesignSettings.fontSize, 
                      fontFamily: mergedDesignSettings.font, 
                      fontStyle: mergedDesignSettings.fontStyle,
                      color: textColor 
                    }} 
                  />
                </ListItem>
              ))}
            </List>
          </div>
        );
    
      case 'languages':
        return savedLanguages.length > 0 ? (
          <div className="resume-section">
            <HeadingComponent icon={TranslateIcon}>LANGUAGES</HeadingComponent>
            <List dense disablePadding>
              {savedLanguages.map((lang, i) => (
                <ListItem key={i} sx={{ py: 0.1, alignItems: 'flex-start' }}>
                  <CircleIcon sx={{ fontSize: 6, mr: 1, mt: 0.8, color: mergedDesignSettings.color }} />
                  <ListItemText 
                    primary={typeof lang === 'object' ? `${lang.language || lang.name}${lang.level ? ` - ${lang.level}` : ''}` : lang} 
                    primaryTypographyProps={{ 
                      fontSize: mergedDesignSettings.fontSize, 
                      fontFamily: mergedDesignSettings.font, 
                      fontStyle: mergedDesignSettings.fontStyle,
                      color: textColor 
                    }} 
                  />
                </ListItem>
              ))}
            </List>
          </div>
        ) : null;
      
      case 'interests':
        return savedInterests.length > 0 ? (
          <div className="resume-section">
            <HeadingComponent icon={Interests}>INTERESTS</HeadingComponent>
            {savedInterests.map((interest, index) => (
              <Typography key={index} sx={{ 
                mb: `${mergedDesignSettings.paragraphSpacing / 10}px`, 
                fontSize: mergedDesignSettings.fontSize, 
                fontFamily: mergedDesignSettings.font, 
                fontStyle: mergedDesignSettings.fontStyle,
                color: textColor 
              }}>
                • {interest}
              </Typography>
            ))}
          </div>
        ) : null;
      
      case 'websites':
        return savedWebsites.length > 0 ? (
          <div className="resume-section">
            <HeadingComponent icon={Link}>WEBSITES / PROFILES</HeadingComponent>
            {savedWebsites.map((site, index) => (
              <Typography key={index} sx={{ 
                mb: `${mergedDesignSettings.paragraphSpacing / 10}px`, 
                fontSize: mergedDesignSettings.fontSize, 
                fontFamily: mergedDesignSettings.font, 
                fontStyle: mergedDesignSettings.fontStyle,
                color: textColor 
              }}>
                • {site.url} {site.addToHeader ? "(Shown in Header)" : ""}
              </Typography>
            ))}
          </div>
        ) : null;
      
      case 'additionalInfo':
        return savedAdditionalInfo.length > 0 ? (
          <div className="resume-section">
            <HeadingComponent icon={Info}>ADDITIONAL INFORMATION</HeadingComponent>
            {savedAdditionalInfo.map((info, index) => (
              <Typography key={index} sx={{ 
                mb: `${mergedDesignSettings.paragraphSpacing / 10}px`, 
                fontSize: mergedDesignSettings.fontSize, 
                fontFamily: mergedDesignSettings.font, 
                fontStyle: mergedDesignSettings.fontStyle,
                color: textColor 
              }}>
                • {info}
              </Typography>
            ))}
          </div>
        ) : null;
      
      case 'education':
        return (
          <div className="resume-section">
            <HeadingComponent icon={SchoolIcon}>EDUCATION</HeadingComponent>
            <Timeline sx={{ p: 0 }}>
              {educationEntries.length > 0 ? (
                educationEntries.map((edu, index) => (
                  <TimelineItem key={edu.id} sx={{ '&::before': { flex: 0 } }}>
                    <TimelineSeparator>
                      <TimelineDot variant="outlined" sx={{ borderColor: mergedDesignSettings.color }} />
                      {index < educationEntries.length - 1 && <TimelineConnector sx={{ bgcolor: mergedDesignSettings.color }} />}
                    </TimelineSeparator>
                    <TimelineContent>
                      <Typography sx={{ 
                        fontWeight: "bold", 
                        fontSize: mergedDesignSettings.fontSize, 
                        fontFamily: mergedDesignSettings.font, 
                        fontStyle: mergedDesignSettings.fontStyle,
                        color: textColor 
                      }}>
                        {formatDate(edu.gradMonth, edu.gradYear)}
                      </Typography>
                      <Typography sx={{ 
                        fontWeight: "bold", 
                        fontSize: mergedDesignSettings.fontSize, 
                        fontFamily: mergedDesignSettings.font, 
                        fontStyle: mergedDesignSettings.fontStyle,
                        color: textColor 
                      }}>
                        {edu.degree} - {edu.fieldOfStudy}
                      </Typography>
                      <Typography sx={{ 
                        fontSize: mergedDesignSettings.fontSize, 
                        fontFamily: mergedDesignSettings.font, 
                        fontStyle: mergedDesignSettings.fontStyle,
                        color: textColor 
                      }}>{edu.schoolName}</Typography>
                      <Typography sx={{ 
                        fontSize: mergedDesignSettings.fontSize, 
                        fontStyle: "italic", 
                        fontFamily: mergedDesignSettings.font, 
                        fontStyle: mergedDesignSettings.fontStyle,
                        color: textColor 
                      }}>{edu.schoolLocation}</Typography>
                      {edu.additionalCoursework && <Typography sx={{ 
                        fontSize: mergedDesignSettings.fontSize, 
                        fontFamily: mergedDesignSettings.font, 
                        fontStyle: mergedDesignSettings.fontStyle,
                        color: textColor 
                      }}>{edu.additionalCoursework}</Typography>}
                    </TimelineContent>
                  </TimelineItem>
                ))
              ) : (
                <Typography sx={{ 
                  fontSize: mergedDesignSettings.fontSize, 
                  fontFamily: mergedDesignSettings.font, 
                  fontStyle: mergedDesignSettings.fontStyle,
                  color: textColor 
                }}>No education entries added yet.</Typography>
              )}
            </Timeline>
          </div>
        );
      
     default:
  if (sectionId.startsWith('custom_')) {
    const customSectionName = sectionId.replace('custom_', '');
    const items = customSections[customSectionName] || [];
    
    console.log(`🎯 Rendering custom section: ${customSectionName}`, items);
    
    if (items && items.length > 0) {
      return (
        <div className="resume-section">
          <HeadingComponent icon={Info}>{customSectionName.toUpperCase()}</HeadingComponent>
          {items.map((item, i) => (
            <Typography key={i} sx={{ 
              mb: `${mergedDesignSettings.paragraphSpacing / 10}px`, 
              fontSize: mergedDesignSettings.fontSize, 
              fontFamily: mergedDesignSettings.font, 
              fontStyle: mergedDesignSettings.fontStyle,
              color: textColor 
            }} whiteSpace="pre-line">
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
          {side === 'left' ? 'Left Side' : 'Right Side'} Sections
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
  
  // Pagination logic
  const paginateContent = useCallback(() => {
    if (!mainContentRef.current) return;

    const mainSections = Array.from(mainContentRef.current.querySelectorAll('.resume-section'));
    
    const pageHeightInPx = parseFloat(page.height.replace('mm', '')) * 3.78;
    const mainAvailableHeight = pageHeightInPx - (2 * mergedDesignSettings.topBottomMargin);

    let newPages = [];
    let currentMainPageSections = [];
    let currentMainHeight = 0;
    
    if (mainSections.length === 0) {
      newPages.push({ main: [] });
    }
    
    mainSections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      
      if (currentMainHeight + sectionHeight > mainAvailableHeight) {
        newPages.push({
          main: currentMainPageSections,
        });
        currentMainPageSections = [section];
        currentMainHeight = sectionHeight;
      } else {
        currentMainPageSections.push(section);
        currentMainHeight += sectionHeight;
      }
    });
    
    if (currentMainPageSections.length > 0) {
      newPages.push({
        main: currentMainPageSections,
      });
    }
    
    setPages(newPages);
  }, [page.height, mergedDesignSettings.topBottomMargin]);

  useEffect(() => {
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
    mergedDesignSettings, // Add this to re-paginate when design settings change
  ]);

  const renderSidebar = (isFirstPage = false) => {
    return (
      <Grid
        item
        xs={12}
        md={4}
        sx={{
          bgcolor: mergedDesignSettings.color,
          color: "white",
          width: "25%",
          p: isFirstPage ? 3 : 0,
          display: "flex",
          flexDirection: "column",
          minHeight: page.height,
          fontFamily: mergedDesignSettings.font,
          fontSize: mergedDesignSettings.fontSize,
          fontStyle: mergedDesignSettings.fontStyle,
          lineHeight: `${mergedDesignSettings.lineSpacing / 20}`,
          background: `linear-gradient(135deg, ${mergedDesignSettings.color} 0%, ${mergedDesignSettings.color}dd 100%)`,
          "@media print": {
            p: isFirstPage ? 2 : 0,
            bgcolor: mergedDesignSettings.color,
            color: "white",
            WebkitPrintColorAdjust: "exact",
            printColorAdjust: "exact",
            minHeight: page.height,
            fontFamily: mergedDesignSettings.font,
            fontSize: mergedDesignSettings.fontSize,
            fontStyle: mergedDesignSettings.fontStyle,
          },
        }}
      >
        {isFirstPage ? (
          <Box display="flex" flexDirection="column" sx={{ flexGrow: 1 }}>
            {leftSectionOrder.map((sectionId, index) => (
              <React.Fragment key={sectionId}>
                {renderLeftSectionContent(sectionId)}
                {index < leftSectionOrder.length - 1 && (
                  <Divider sx={{ 
                    my: mergedDesignSettings.sectionSpacing / 20, 
                    borderColor: 'rgba(255,255,255,0.3)',
                    borderBottomWidth: mergedDesignSettings.lineWeight 
                  }} />
                )}
              </React.Fragment>
            ))}
          </Box>
        ) : (
          <Box sx={{ minHeight: "100%" }} />
        )}
      </Grid>
    );
  };

  const renderMainContentToMeasure = () => (
    <Box ref={mainContentRef} sx={{ 
      visibility: 'hidden', 
      position: 'absolute', 
      fontFamily: mergedDesignSettings.font, 
      fontSize: mergedDesignSettings.fontSize, 
      fontStyle: mergedDesignSettings.fontStyle 
    }}>
      <Box sx={{ p: `${mergedDesignSettings.topBottomMargin}px ${mergedDesignSettings.sideMargins}px` }}>
        <div className="resume-section">
          <Typography sx={{ 
            mb: `${mergedDesignSettings.paragraphSpacing / 10}px`, 
            fontSize: `calc(${mergedDesignSettings.headingSize} * 1.2)`, 
            fontWeight: "900", 
            fontFamily: mergedDesignSettings.font, 
            color: mergedDesignSettings.color 
          }}>
            {data.firstName} {data.lastName}
          </Typography>
          <Typography sx={{ 
            mb: 2, 
            fontSize: mergedDesignSettings.fontSize, 
            fontFamily: mergedDesignSettings.font, 
            fontStyle: mergedDesignSettings.fontStyle,
            color: 'gray' 
          }}>{data.currentPosition}</Typography>
          <Box sx={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            fontSize: '0.85rem', 
            color: 'gray', 
            mb: 2, 
            gap: 2 
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Email sx={{ fontSize: 16, mr: 0.5, color: mergedDesignSettings.color }} />
              <Typography sx={{ fontSize: `calc(${mergedDesignSettings.fontSize} * 0.8)` }}>{data.email}</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Phone sx={{ fontSize: 16, mr: 0.5, color: mergedDesignSettings.color }} />
              <Typography sx={{ fontSize: `calc(${mergedDesignSettings.fontSize} * 0.8)` }}>{data.phone}</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <LocationOn sx={{ fontSize: 16, mr: 0.5, color: mergedDesignSettings.color }} />
              <Typography sx={{ fontSize: `calc(${mergedDesignSettings.fontSize} * 0.8)` }}>{data.city}</Typography>
            </Box>
            {data.website && (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Language sx={{ fontSize: 16, mr: 0.5, color: mergedDesignSettings.color }} />
                <Typography sx={{ fontSize: `calc(${mergedDesignSettings.fontSize} * 0.8)` }}>{data.website}</Typography>
              </Box>
            )}
          </Box>
        </div>
        <Divider sx={{ 
          my: mergedDesignSettings.sectionSpacing / 20, 
          borderBottomWidth: mergedDesignSettings.lineWeight 
        }} />
        
        {rightSectionOrder.map(sectionId => (
          <React.Fragment key={sectionId}>
            {renderRightSectionContent(sectionId)}
          </React.Fragment>
        ))}
      </Box>
    </Box>
  );

  return (
    <Box sx={{ 
      width: "100%", 
      position: "relative", 
      m: 5, 
      fontFamily: mergedDesignSettings.font 
    }}>
      {!exporting && (
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: 2, 
          mb: 2, 
          '@media print': { display: 'none' } 
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))} disabled={currentPage === 0} color="primary">
              <ChevronLeft />
            </IconButton>
            <Typography sx={{ mx: 2 }}>Page {currentPage + 1} of {Math.max(1, pages.length)}</Typography>
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
      
      <Box id="resume-container" sx={{ fontFamily: mergedDesignSettings.font }}>
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
                fontFamily: mergedDesignSettings.font,
                fontSize: mergedDesignSettings.fontSize,
                fontStyle: mergedDesignSettings.fontStyle,
                lineHeight: `${mergedDesignSettings.lineSpacing / 20}`,
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
                display: exporting ? 'flex' : (index === currentPage ? 'flex' : 'none'),
                '@media print': { display: 'flex' }
              }}
            >
              <Grid container sx={{ height: "100%" }}>
                {renderSidebar(index === 0)}
                <Grid
                  item
                  xs={12}
                  md={8}
                  sx={{
                    p: `${mergedDesignSettings.topBottomMargin}px ${mergedDesignSettings.sideMargins}px`,
                    width: "75%",
                    fontFamily: mergedDesignSettings.font,
                    fontSize: mergedDesignSettings.fontSize,
                    fontStyle: mergedDesignSettings.fontStyle,
                    "@media print": { 
                      p: 2,
                      fontFamily: mergedDesignSettings.font,
                      fontSize: mergedDesignSettings.fontSize,
                      fontStyle: mergedDesignSettings.fontStyle,
                    },
                  }}
                >
                  <div dangerouslySetInnerHTML={{ __html: pageContent.main.map(s => s.outerHTML).join('') }} />
                </Grid>
              </Grid>
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
              fontFamily: mergedDesignSettings.font,
              fontSize: mergedDesignSettings.fontSize,
              fontStyle: mergedDesignSettings.fontStyle,
              lineHeight: `${mergedDesignSettings.lineSpacing / 20}`,
              display: "flex",
              flexDirection: "column",
              "@media print": {
                width: page.width,
                height: "auto",
                minHeight: page.height,
                boxShadow: "none",
                m: 0,
              },
            }}
          >
            <Grid container sx={{ height: "100%" }}>
              {renderSidebar(true)}
              <Grid
                item
                xs={12}
                md={8}
                sx={{
                  p: `${mergedDesignSettings.topBottomMargin}px ${mergedDesignSettings.sideMargins}px`,
                  width: "75%",
                  fontFamily: mergedDesignSettings.font,
                  fontSize: mergedDesignSettings.fontSize,
                  fontStyle: mergedDesignSettings.fontStyle,
                  "@media print": { 
                    p: 2,
                    fontFamily: mergedDesignSettings.font,
                    fontSize: mergedDesignSettings.fontSize,
                    fontStyle: mergedDesignSettings.fontStyle,
                  },
                }}
              >
                <Typography sx={{ fontFamily: mergedDesignSettings.font }}>Loading resume...</Typography>
              </Grid>
            </Grid>
          </Box>
        )}
      </Box>

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
            Drag and drop sections to reorder them within each side or move sections between left and right sides.
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

export default Resume23;