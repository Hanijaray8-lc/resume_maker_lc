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
  DialogActions
} from "@mui/material";
import {
  ChevronLeft,
  ChevronRight,
  DragIndicator,
  Reorder
} from "@mui/icons-material";

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

const Resume1 = ({
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
      const savedLeftSectionOrder = localStorage.getItem("resume1LeftSectionOrder");
      if (savedLeftSectionOrder) {
        const parsedOrder = JSON.parse(savedLeftSectionOrder);
        const filteredOrder = parsedOrder.filter(section => !section.startsWith('custom_'));
        setLeftSectionOrder(filteredOrder);
      } else {
        setLeftSectionOrder(defaultLeftSectionOrder);
      }

      const savedRightSectionOrder = localStorage.getItem("resume1RightSectionOrder");
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
        localStorage.setItem("resume1RightSectionOrder", JSON.stringify(newRightOrder));
        return newRightOrder;
      }
      return prevRightOrder;
    });

    // Update left section order
    setLeftSectionOrder(prevLeftOrder => {
      const filteredLeftOrder = prevLeftOrder.filter(section => !section.startsWith('custom_'));
      if (JSON.stringify(filteredLeftOrder) !== JSON.stringify(prevLeftOrder)) {
        localStorage.setItem("resume1LeftSectionOrder", JSON.stringify(filteredLeftOrder));
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
      localStorage.setItem("resume1LeftSectionOrder", JSON.stringify(newSectionOrder));
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
      localStorage.setItem("resume1LeftSectionOrder", JSON.stringify(newLeftSectionOrder));
      localStorage.setItem("resume1RightSectionOrder", JSON.stringify(newRightSectionOrder));
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
      localStorage.setItem("resume1RightSectionOrder", JSON.stringify(newSectionOrder));
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
      localStorage.setItem("resume1LeftSectionOrder", JSON.stringify(newLeftSectionOrder));
      localStorage.setItem("resume1RightSectionOrder", JSON.stringify(newRightSectionOrder));
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
    localStorage.setItem("resume1LeftSectionOrder", JSON.stringify(defaultLeftSectionOrder));
  };

  const resetRightSectionOrder = () => {
    setRightSectionOrder(defaultRightSectionOrder);
    localStorage.setItem("resume1RightSectionOrder", JSON.stringify(defaultRightSectionOrder));
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

  const renderLeftSectionContent = (sectionId) => {
    switch (sectionId) {
      case 'contact':
        return (
          <Box display="flex" flexDirection="column" alignItems="center">
            <Avatar src={photo || "https://via.placeholder.com/150"} sx={{ width: 120, height: 120, mb: 2 }} />
            <Typography sx={{ mb: 2, fontSize: headingSize, fontWeight: "bold", fontFamily: font }}>CONTACT</Typography>
            <List dense>
              {[data.phone, data.email, data.city, data.website].filter(Boolean).map((text, i) => (
                <ListItem key={i} disableGutters>
                  <ListItemText 
                    primary={text} 
                    primaryTypographyProps={{ 
                      color: "white", 
                      fontSize: fontSize, 
                      style: { fontStyle, fontFamily: font },
                      fontFamily: font
                    }} 
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        );
      
      case 'education':
        return (
          <Box>
            <Typography sx={{ mb: 1, fontSize: headingSize, fontWeight: "bold", fontFamily: font }}>EDUCATION</Typography>
            {educationEntries.length > 0 ? (
              educationEntries.map((edu) => (
                <Box key={edu.id} sx={{ mb: 2 }}>
                  <Typography sx={{ fontWeight: "bold", fontSize, fontFamily: font }}>
                    {edu.degree} - {edu.fieldOfStudy}
                  </Typography>
                  <Typography sx={{ fontSize, fontFamily: font }}>{edu.schoolName}, {edu.schoolLocation}</Typography>
                  <Typography sx={{ fontSize, fontStyle: "italic", fontFamily: font }}>{formatDate(edu.gradMonth, edu.gradYear)}</Typography>
                  {edu.additionalCoursework && <Typography sx={{ fontSize, fontFamily: font }}>{edu.additionalCoursework}</Typography>}
                </Box>
              ))
            ) : (
              <Typography sx={{ fontSize, fontFamily: font }}>No education entries added yet.</Typography>
            )}
          </Box>
        );
      
      case 'skills':
        return (
          <Box>
            <Typography sx={{ mb: 1, fontSize: headingSize, fontWeight: "bold", fontFamily: font }}>SKILLS</Typography>
            <List dense>
              {savedSkills.length > 0 ? (
                savedSkills.map((skill, i) => (
                  <ListItem key={i} disableGutters>
                    <ListItemText 
                      primary={`${skill.name} (${skill.rating || 0}%)`} 
                      primaryTypographyProps={{ 
                        color: "white", 
                        fontSize: fontSize, 
                        style: { fontStyle, fontFamily: font },
                        fontFamily: font
                      }} 
                    />
                  </ListItem>
                ))
              ) : (
                data.skills.map((skill, i) => (
                  <ListItem key={i} disableGutters>
                    <ListItemText 
                      primary={skill} 
                      primaryTypographyProps={{ 
                        color: "white", 
                        fontSize: fontSize, 
                        style: { fontStyle, fontFamily: font },
                        fontFamily: font
                      }} 
                    />
                  </ListItem>
                ))
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
    
    switch (sectionId) {
      case 'profile':
        return (
          <div className="resume-section">
            <Typography sx={{ mb: 1, fontSize: headingSize, fontWeight: "bold", fontFamily: font, color: textColor }}>PROFILE</Typography>
            <Typography sx={{ mb: `${paragraphSpacing / 10}px`, fontSize: fontSize, fontFamily: font, color: textColor }}>{savedSummary || data.profile}</Typography>
          </div>
        );
      
      case 'workExperience':
        return (
          <div className="resume-section">
            <Typography sx={{ mb: 1, fontSize: headingSize, fontWeight: "bold", fontFamily: font, color: textColor }}>WORK EXPERIENCE</Typography>
            <Box sx={{ mt: 2 }}>
              {workExperiences && workExperiences.length > 0 ? (
                workExperiences.map((work, i) => (
                  <Box key={i} sx={{ mb: 2 }}>
                    <Typography sx={{ fontWeight: "bold", fontSize: fontSize, fontFamily: font, color: textColor }}>
                      {work.jobTitle} @ {work.employer}
                      <span style={{ float: "right" }}>
                        {formatDate(work.startMonth, work.startYear)} -{" "}
                        {work.current ? "Present" : formatDate(work.endMonth, work.endYear)}
                      </span>
                    </Typography>
                    <Typography sx={{ fontSize: fontSize, fontStyle: "italic", fontFamily: font, color: textColor }}>
                      {work.companyName} | {work.location}
                    </Typography>
                    {work.description && (
                      <Box
                        sx={{ 
                          mt: 1, 
                          fontFamily: font,
                          fontSize: fontSize,
                          color: textColor,
                          "& strong": { fontWeight: "bold", fontFamily: font },
                          "& em": { fontStyle: "italic", fontFamily: font }, 
                          "& u": { textDecoration: "underline", fontFamily: font } 
                        }}
                        dangerouslySetInnerHTML={{
                          __html: work.description.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>").replace(/\*(.*?)\*/g, "<em>$1</em>").replace(/<u>(.*?)<\/u>/g, "<u>$1</u>").replace(/\n/g, "<br/>"),
                        }}
                      />
                    )}
                  </Box>
                ))
              ) : (
                <Typography sx={{ fontSize: fontSize, fontFamily: font, color: textColor }}>No work experiences added yet.</Typography>
              )}
            </Box>
          </div>
        );
      
      case 'languages':
        return savedLanguages.length > 0 ? (
          <div className="resume-section">
            <Typography sx={{ mb: 1, fontSize: headingSize, fontWeight: "bold", fontFamily: font, color: textColor }}>LANGUAGES</Typography>
            {savedLanguages.map((lang, index) => (
              <Typography key={index} sx={{ mb: `${paragraphSpacing / 10}px`, fontSize: fontSize, fontFamily: font, color: textColor }}>
                {lang.name} {lang.level ? `– ${lang.level}` : ""}
              </Typography>
            ))}
          </div>
        ) : null;
      
      case 'accomplishments':
        return savedAccomplishments.length > 0 ? (
          <div className="resume-section">
            <Typography sx={{ mb: 1, fontSize: headingSize, fontWeight: "bold", fontFamily: font, color: textColor }}>ACCOMPLISHMENTS</Typography>
            {savedAccomplishments.map((acc, index) => (
              <Typography key={index} sx={{ mb: `${paragraphSpacing / 10}px`, fontSize: fontSize, fontFamily: font, color: textColor }} whiteSpace="pre-line">
                {acc}
              </Typography>
            ))}
          </div>
        ) : null;
      
      case 'certifications':
        return savedCertifications.length > 0 ? (
          <div className="resume-section">
            <Typography sx={{ mb: 1, fontSize: headingSize, fontWeight: "bold", fontFamily: font, color: textColor }}>CERTIFICATIONS</Typography>
            {savedCertifications.map((cert, index) => (
              <Typography key={index} sx={{ mb: `${paragraphSpacing / 10}px`, fontSize: fontSize, fontFamily: font, color: textColor }}>
                {cert.name} – {cert.provider} ({cert.year})
              </Typography>
            ))}
          </div>
        ) : null;
      
      case 'softwareSkills':
        return softwareSkills.length > 0 ? (
          <div className="resume-section">
            <Typography sx={{ mb: 1, fontSize: headingSize, fontWeight: "bold", fontFamily: font, color: textColor }}>SOFTWARE SKILLS</Typography>
            {softwareSkills.map((skill, index) => (
              <Typography key={index} sx={{ mb: `${paragraphSpacing / 10}px`, fontSize: fontSize, fontFamily: font, color: textColor }}>
                {skill.name} — {skill.level}%
              </Typography>
            ))}
          </div>
        ) : null;
      
      case 'volunteering':
        return savedVolunteering.length > 0 ? (
          <div className="resume-section">
            <Typography sx={{ mb: 1, fontSize: headingSize, fontWeight: "bold", fontFamily: font, color: textColor }}>VOLUNTEERING</Typography>
            {savedVolunteering.map((vol, index) => (
              <Box key={index} sx={{ mb: 1 }}>
                <Typography sx={{ fontSize: fontSize, fontWeight: "bold", fontFamily: font, color: textColor }}>{vol.subtopic}</Typography>
                <Typography sx={{ fontSize: fontSize, color: inSidebar ? "rgba(255,255,255,0.8)" : "gray", fontFamily: font }}>{vol.fromDate} - {vol.toDate}</Typography>
                <Typography sx={{ fontSize: fontSize, whiteSpace: "pre-line", mt: 0.5, fontFamily: font, color: textColor }}>{vol.content}</Typography>
              </Box>
            ))}
          </div>
        ) : null;
      
      case 'interests':
        return savedInterests.length > 0 ? (
          <div className="resume-section">
            <Typography sx={{ mb: 1, fontSize: headingSize, fontWeight: "bold", fontFamily: font, color: textColor }}>INTERESTS</Typography>
            {savedInterests.map((interest, index) => (
              <Typography key={index} sx={{ mb: `${paragraphSpacing / 10}px`, fontSize: fontSize, fontFamily: font, color: textColor }}>• {interest}</Typography>
            ))}
          </div>
        ) : null;
      
      case 'websites':
        return savedWebsites.length > 0 ? (
          <div className="resume-section">
            <Typography sx={{ mb: 1, fontSize: headingSize, fontWeight: "bold", fontFamily: font, color: textColor }}>WEBSITES / PROFILES</Typography>
            {savedWebsites.map((site, index) => (
              <Typography key={index} sx={{ mb: `${paragraphSpacing / 10}px`, fontSize: fontSize, fontFamily: font, color: textColor }}>
                {site.url} {site.addToHeader ? "(Shown in Header)" : ""}
              </Typography>
            ))}
          </div>
        ) : null;
      
      case 'references':
        return savedReferences.length > 0 ? (
          <div className="resume-section">
            <Typography sx={{ mb: 1, fontSize: headingSize, fontWeight: "bold", fontFamily: font, color: textColor }}>REFERENCES</Typography>
            {savedReferences.map((ref, index) => (
              <Typography key={index} sx={{ mb: `${paragraphSpacing / 10}px`, fontSize: fontSize, fontFamily: font, color: textColor }} whiteSpace="pre-line">
                {ref}
              </Typography>
            ))}
          </div>
        ) : null;
      
      case 'additionalInfo':
        return savedAdditionalInfo.length > 0 ? (
          <div className="resume-section">
            <Typography sx={{ mb: 1, fontSize: headingSize, fontWeight: "bold", fontFamily: font, color: textColor }}>ADDITIONAL INFORMATION</Typography>
            {savedAdditionalInfo.map((info, index) => (
              <Typography key={index} sx={{ mb: `${paragraphSpacing / 10}px`, fontSize: fontSize, fontFamily: font, color: textColor }}> {info}</Typography>
            ))}
          </div>
        ) : null;
      
      default:
        // Handle custom sections
        if (sectionId.startsWith('custom_')) {
          const customSectionName = sectionId.replace('custom_', '');
          const items = customSections[customSectionName] || [];
          return items.length > 0 ? (
            <div className="resume-section">
              <Typography sx={{ mb: 1, fontSize: headingSize, fontWeight: "bold", fontFamily: font, color: textColor }}>{customSectionName.toUpperCase()}</Typography>
              {items.map((item, i) => (
                <Typography key={i} sx={{ mb: `${paragraphSpacing / 10}px`, fontSize: fontSize, fontFamily: font, color: textColor }} whiteSpace="pre-line">
                  {item}
                </Typography>
              ))}
            </div>
          ) : null;
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

  // Fixed pagination with useCallback to prevent infinite loops
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

  const renderMainContentToMeasure = () => (
    <Box ref={mainContentRef} sx={{ visibility: 'hidden', position: 'absolute', fontFamily: font, fontSize: fontSize, fontStyle: fontStyle }}>
      <Box sx={{ p: `${topBottomMargin}px ${sideMargins}px` }}>
        <div className="resume-section">
          <Typography sx={{ mb: `${paragraphSpacing / 10}px`, fontSize: headingSize, fontWeight: "bold", fontFamily: font }}>
            {data.firstName} <span style={{ color }}>{data.lastName}</span>
          </Typography>
          <Typography sx={{ mb: 2, fontSize: fontSize, fontFamily: font }}>{data.currentPosition}</Typography>
        </div>
        <Divider sx={{ my: sectionSpacing / 20, borderBottomWidth: lineWeight }} />
        
        {/* Render right side sections in the specified order */}
        {rightSectionOrder.map(sectionId => (
          <React.Fragment key={sectionId}>
            {renderRightSectionContent(sectionId)}
          </React.Fragment>
        ))}
      </Box>
    </Box>
  );

  const renderSidebar = (isFirstPage = false) => {
    return (
      <Grid
        item
        xs={12}
        md={4}
        sx={{
          bgcolor: color,
          color: "white",
          width: "25%",
          p: isFirstPage ? 3 : 0,
          display: "flex",
          flexDirection: "column",
          minHeight: page.height,
          fontFamily: font,
          fontSize: fontSize,
          fontStyle: fontStyle,
          lineHeight: `${lineSpacing / 20}`,
          "@media print": {
            p: isFirstPage ? 2 : 0,
            bgcolor: color,
            color: "white",
            WebkitPrintColorAdjust: "exact",
            printColorAdjust: "exact",
            minHeight: page.height,
            fontFamily: font,
            fontSize: fontSize,
            fontStyle: fontStyle,
          },
        }}
      >
        {isFirstPage ? (
          <Box display="flex" flexDirection="column" sx={{ flexGrow: 1 }}>
            {/* Render left side sections in the specified order */}
            {leftSectionOrder.map((sectionId, index) => (
              <React.Fragment key={sectionId}>
                {renderLeftSectionContent(sectionId)}
                {index < leftSectionOrder.length - 1 && (
                  <Divider sx={{ bgcolor: "white", my: sectionSpacing / 20, borderBottomWidth: lineWeight }} />
                )}
              </React.Fragment>
            ))}
          </Box>
        ) : (
          // Empty sidebar for subsequent pages - just the colored background
          <Box sx={{ minHeight: "100%" }} />
        )}
      </Grid>
    );
  };

  return (
    <Box sx={{ width: "100%", position: "relative", m: 5, fontFamily: font }}>
      {!exporting && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 2, '@media print': { display: 'none' } }}>
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
                lineHeight: `${lineSpacing / 20}`,
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
                    p: `${topBottomMargin}px ${sideMargins}px`,
                    width: "75%",
                    fontFamily: font,
                    fontSize: fontSize,
                    fontStyle: fontStyle,
                    "@media print": { 
                      p: 2,
                      fontFamily: font,
                      fontSize: fontSize,
                      fontStyle: fontStyle,
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
              fontFamily: font,
              fontSize: fontSize,
              fontStyle: fontStyle,
              lineHeight: `${lineSpacing / 20}`,
              display: "flex",
              flexDirection: "column",
              "@media print": {
                width: page.width,
                height: "auto",
                minHeight: page.height,
                boxShadow: "none",
                m: 0,
                fontFamily: font,
                fontSize: fontSize,
                fontStyle: fontStyle,
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
                  p: `${topBottomMargin}px ${sideMargins}px`,
                  width: "75%",
                  fontFamily: font,
                  fontSize: fontSize,
                  fontStyle: fontStyle,
                  "@media print": { 
                    p: 2,
                    fontFamily: font,
                    fontSize: fontSize,
                    fontStyle: fontStyle,
                  },
                }}
              >
                <Typography sx={{ fontFamily: font }}>Loading resume...</Typography>
              </Grid>
            </Grid>
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

export default Resume1;