import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  Container,
  Paper,
  Box,
  Typography,
  Divider,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  ChevronLeft,
  ChevronRight,
  Print,
  Download,
  DragIndicator,
  Reorder
} from '@mui/icons-material';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const Resume12 = ({ 
  color = '#36454F',
  font = "Arial, sans-serif",
  fontSize = "14px",
  fontStyle = "normal",
  headingSize = "24px",
  sectionSpacing = 20,
  paragraphSpacing = 10,
  lineSpacing = 20,
  topBottomMargin = 40,
  sideMargins = 40,
  paragraphIndent = 0,
  lineWeight = 1,
  pageSize = "A4",
  theme,
  formData = {},
  photo = "",
  workExperiences = [],
  exporting = false,
  enableDragDrop = true
}) => {
  // Use theme color if provided, otherwise use the color prop
  const primaryColor = theme?.primary || color;
  const darkColor = theme?.dark || getDarkColor(primaryColor);
  
  // State for fetched data
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

  // Page splitting state
  const [currentPage, setCurrentPage] = useState(0);
  const [pages, setPages] = useState([]);
  const resumeRef = useRef(null);

  // Section ordering state
  const [sectionOrder, setSectionOrder] = useState([]);
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const [arrangeDialogOpen, setArrangeDialogOpen] = useState(false);

  // Page size mapping
  const pageSizeMap = {
    A4: { width: "210mm", height: "297mm" },
    Letter: { width: "216mm", height: "279mm" },
    Legal: { width: "216mm", height: "356mm" },
    A3: { width: "297mm", height: "420mm" },
    Executive: { width: "184mm", height: "267mm" },
  };

  const page = pageSizeMap[pageSize] || pageSizeMap.A4;

  // Default data
  const defaultData = {
    firstName: "John",
    lastName: "Doe",
    currentPosition: "Senior Graphic Designer",
    phone: "+1 (555) 123-4567",
    email: "johndoe@email.com",
    city: "New York, NY",
    website: "linkedin.com/in/johndoe",
    profile: "A creative and results-driven graphic designer with over 7 years of experience in visual branding and marketing. Passionate about creating designs that solve business problems and delight customers. Seeking to leverage skills in design leadership to contribute to a dynamic creative team."
  };

  const data = { ...defaultData, ...formData };
  
  // Define default section order for Resume12
  const defaultSectionOrder = [
    'about',
    'experience',
    'education',
    'skills',
    'languages',
    'certifications',
    'accomplishments',
    'additionalInfo',
    'volunteering',
    'interests',
    'websites',
    'references'
  ];

  // Common text style with color applied (similar to Resume3)
  const textStyle = {
    color: primaryColor,
    fontFamily: font,
    fontSize: fontSize,
    fontStyle: fontStyle,
    lineHeight: `${lineSpacing}px`
  };

  // Helper function to darken colors
  function getDarkColor(hex) {
    let c = hex.replace('#', '');
    if (c.length === 8) c = c.slice(0, 6);
    let r = Math.max(0, parseInt(c.substring(0,2),16) - 40);
    let g = Math.max(0, parseInt(c.substring(2,4),16) - 40);
    let b = Math.max(0, parseInt(c.substring(4,6),16) - 40);
    return `#${r.toString(16).padStart(2,'0')}${g.toString(16).padStart(2,'0')}${b.toString(16).padStart(2,'0')}`;
  }

  // Fetch data from localStorage and section order (improved custom section handling)
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

  // Load saved section order for Resume12
  const savedSectionOrder = localStorage.getItem("resume12SectionOrder");
  if (savedSectionOrder) {
    const parsedOrder = JSON.parse(savedSectionOrder);
    
    // Remove ALL old custom sections and add ONLY current sections
    const currentCustomSectionIds = Object.keys(sectionsData).map(name => `custom_${name}`);
    const filteredOrder = parsedOrder.filter(section => !section.startsWith('custom_'));
    const allSections = [...filteredOrder, ...currentCustomSectionIds];
    
    setSectionOrder(allSections);
    console.log('🔄 Updated section order with ONLY CURRENT custom sections:', allSections);
  } else {
    // For first time, add ONLY current custom sections
    const currentCustomSectionIds = Object.keys(sectionsData).map(name => `custom_${name}`);
    const updatedSectionOrder = [...defaultSectionOrder, ...currentCustomSectionIds];
    setSectionOrder(updatedSectionOrder);
    console.log('🆕 Initial section order with ONLY CURRENT custom sections:', updatedSectionOrder);
  }
}, []);

// 🔥 UPDATED: Automatically add/remove custom sections based on current sections
useEffect(() => {
  const userId = localStorage.getItem("userId");
  if (userId && Object.keys(customSections).length > 0) {
    const currentOrder = [...sectionOrder];
    
    // Get ONLY CURRENT custom section IDs
    const currentCustomSectionIds = Object.keys(customSections).map(name => `custom_${name}`);
    
    console.log("🔄 Processing CURRENT custom sections:", currentCustomSectionIds);
    
    // Remove ALL custom sections and add ONLY current ones
    const filteredOrder = currentOrder.filter(section => !section.startsWith('custom_'));
    const newOrder = [...filteredOrder, ...currentCustomSectionIds];
    
    if (JSON.stringify(newOrder) !== JSON.stringify(currentOrder)) {
      setSectionOrder(newOrder);
      localStorage.setItem("resume12SectionOrder", JSON.stringify(newOrder));
      console.log('📝 Final section order with ONLY CURRENT custom sections:', newOrder);
    }
  } else if (userId && Object.keys(customSections).length === 0) {
    // If no current custom sections, remove all custom sections
    const currentOrder = [...sectionOrder];
    const filteredOrder = currentOrder.filter(section => !section.startsWith('custom_'));
    
    if (filteredOrder.length !== currentOrder.length) {
      setSectionOrder(filteredOrder);
      localStorage.setItem("resume12SectionOrder", JSON.stringify(filteredOrder));
      console.log('🗑️ Removed all custom sections (no current sections)');
    }
  }
}, [customSections]);
  // Save section order to localStorage whenever it changes
  useEffect(() => {
    if (sectionOrder.length > 0) {
      localStorage.setItem("resume12SectionOrder", JSON.stringify(sectionOrder));
    }
  }, [sectionOrder]);

  const formatDate = (month, year) => {
    if (!month || !year) return "";
    return `${month} ${year}`;
  };

  // Drag and drop handlers for single section ordering
  const handleDragStart = (e, index) => {
    e.dataTransfer.setData('text/plain', JSON.stringify({
      index,
      sectionId: sectionOrder[index]
    }));
    e.currentTarget.style.opacity = '0.5';
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOverIndex(null);
  };

  const handleDrop = (e, targetIndex) => {
    e.preventDefault();
    const data = JSON.parse(e.dataTransfer.getData('text/plain'));
    const sourceIndex = data.index;
    const sectionId = data.sectionId;

    if (sourceIndex !== targetIndex) {
      // Reorder sections
      const newSectionOrder = [...sectionOrder];
      const [movedSection] = newSectionOrder.splice(sourceIndex, 1);
      newSectionOrder.splice(targetIndex, 0, movedSection);
      setSectionOrder(newSectionOrder);
    }

    setDragOverIndex(null);
    e.currentTarget.style.opacity = '1';
  };

  const handleDragEnd = (e) => {
    setDragOverIndex(null);
    e.currentTarget.style.opacity = '1';
  };

  const resetSectionOrder = () => {
    setSectionOrder(defaultSectionOrder);
  };

  const handleArrangeSectionsClick = () => {
    setArrangeDialogOpen(true);
  };

  const handleArrangeDialogClose = () => {
    setArrangeDialogOpen(false);
  };

  const getSectionTitle = (sectionId) => {
    const titles = {
      'about': 'About Me',
      'skills': 'Skills',
      'education': 'Education',
      'experience': 'Experience',
      'languages': 'Languages',
      'certifications': 'Certifications',
      'accomplishments': 'Accomplishments',
      'softwareSkills': 'Software Skills',
      'volunteering': 'Volunteering',
      'interests': 'Interests',
      'websites': 'Websites & Portfolios',
      'references': 'References',
      'additionalInfo': 'Additional Information'
    };
    
    if (sectionId.startsWith('custom_')) {
    const customName = sectionId.replace('custom_', '').replace(/_/g, ' ');
    return customName.charAt(0).toUpperCase() + customName.slice(1);
  }
    
    return titles[sectionId] || sectionId;
  };

  const renderDragPanel = () => {
    return (
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
          <DragIndicator sx={{ mr: 1 }} />
          Resume Sections
          <Typography variant="body2" color="textSecondary" sx={{ ml: 1 }}>
            ({sectionOrder.length} sections)
          </Typography>
        </Typography>
        <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
          Drag and drop to reorder sections. Sections will appear in the order shown below.
        </Typography>
        <Box sx={{ maxHeight: 400, overflow: 'auto', border: '1px solid #e0e0e0', borderRadius: 1, p: 1 }}>
          {sectionOrder.length > 0 ? (
            sectionOrder.map((sectionId, index) => (
              <Paper
                key={sectionId}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, index)}
                onDragEnd={handleDragEnd}
                sx={{
                  p: 2,
                  mb: 1,
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: dragOverIndex === index ? '#f0f0f0' : 'white',
                  boxShadow: dragOverIndex === index ? 2 : 1,
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
              No sections available.
            </Typography>
          )}
        </Box>
        <Button 
          onClick={resetSectionOrder} 
          variant="outlined" 
          size="small" 
          sx={{ mt: 1 }}
        >
          Reset Section Order
        </Button>
      </Box>
    );
  };

  const renderSectionContent = (sectionId) => {
    switch (sectionId) {
      case 'about':
        return savedSummary ? (
          <Box 
            mb={`${sectionSpacing}px`} 
            className="resume-section" 
            id="about-section" 
            sx={{ 
              fontFamily: font,
              ...textStyle
            }}
          >
            <Typography sx={{ 
              fontSize: headingSize, 
              fontWeight: "bold", 
              color: primaryColor, 
              fontFamily: font,
              mb: `${paragraphSpacing}px`,
              borderBottom: `${lineWeight * 2}px solid ${primaryColor}`, 
              pb: 1, 
              display: 'inline-block',
            }}>
              About Me
            </Typography>
            <Typography sx={{ 
              mt: `${paragraphSpacing / 4}px`, 
              textIndent: `${paragraphIndent}px`, 
              fontFamily: font,
              color: primaryColor,
              lineHeight: `${lineSpacing}px`
            }}>
              {savedSummary}
            </Typography>
          </Box>
        ) : null;

      case 'experience':
        return (workExperiences && workExperiences.length > 0) ? (
          <Box 
            mb={`${sectionSpacing}px`} 
            className="resume-section" 
            id="experience-section" 
            sx={{ 
              fontFamily: font,
              ...textStyle
            }}
          >
            <Typography sx={{ 
              fontSize: headingSize, 
              fontWeight: "bold", 
              color: primaryColor, 
              fontFamily: font,
              mb: `${paragraphSpacing}px`,
              borderBottom: `${lineWeight * 2}px solid ${primaryColor}`, 
              pb: 1, 
              display: 'inline-block',
            }}>
              Experience
            </Typography>
            {workExperiences.map((work, i) => (
              <Box key={i} sx={{ mb: `${paragraphSpacing}px`, fontFamily: font }}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="h6" fontWeight="bold" color={primaryColor} sx={textStyle}>
                    {work.jobTitle}
                  </Typography>
                  <Typography variant="body2" color={primaryColor} sx={textStyle}>
                    {formatDate(work.startMonth, work.startYear)} - {work.current ? "Present" : formatDate(work.endMonth, work.endYear)}
                  </Typography>
                </Box>
                <Typography variant="subtitle2" color={primaryColor} sx={{ 
                  mb: 1,
                  ...textStyle
                }}>
                  {work.employer} | {work.city}
                </Typography>
                {work.description && (
                  <Box color={primaryColor}
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
                      ...textStyle
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
        ) : null;

      case 'education':
        return (educationEntries.length > 0) ? (
          <Box 
            mb={`${sectionSpacing}px`} 
            className="resume-section" 
            id="education-section" 
            sx={{ 
              fontFamily: font,
              ...textStyle
            }}
          >
            <Typography sx={{ 
              fontSize: headingSize, 
              fontWeight: "bold", 
              color: primaryColor, 
              fontFamily: font,
              mb: `${paragraphSpacing}px`,
              borderBottom: `${lineWeight * 2}px solid ${primaryColor}`, 
              pb: 1, 
              display: 'inline-block',
            }}>
              Education
            </Typography>
            {educationEntries.map((edu) => (
              <Box key={edu.id} sx={{ mb: `${paragraphSpacing}px`, fontFamily: font }}>
                <Typography variant="h6" fontWeight="bold" color={primaryColor} sx={textStyle}>
                  {edu.degree} - {edu.fieldOfStudy}
                </Typography>
                <Typography variant="body2" color={primaryColor} sx={textStyle}>
                  {edu.schoolName}, {edu.schoolLocation}
                </Typography>
                <Typography variant="body2" color={primaryColor} sx={textStyle}>
                  {formatDate(edu.gradMonth, edu.gradYear)}
                </Typography>
                {edu.additionalCoursework && (
                  <Typography variant="body2" color={primaryColor} sx={textStyle}>
                    {edu.additionalCoursework}
                  </Typography>
                )}
              </Box>
            ))}
          </Box>
        ) : null;

      case 'skills':
        return (savedSkills.length > 0 || softwareSkills.length > 0) ? (
          <Box 
            mb={`${sectionSpacing}px`} 
            className="resume-section" 
            id="skills-section" 
            sx={{ 
              fontFamily: font,
              ...textStyle
            }}
          >
            <Typography sx={{ 
              fontSize: headingSize, 
              fontWeight: "bold", 
              color: primaryColor, 
              fontFamily: font,
              mb: `${paragraphSpacing}px`,
              borderBottom: `${lineWeight * 2}px solid ${primaryColor}`, 
              pb: 1, 
              display: 'inline-block',
            }}>
              Skills
            </Typography>
            <Box component="ul" sx={{ 
              pl: 2, 
              mt: 0, 
              fontFamily: font,
              ...textStyle 
            }}>
              {savedSkills.map((skill, i) => (
                <Typography key={i} component="li" variant="body1" color={primaryColor} sx={textStyle}>
                  {skill.name} {skill.rating ? `(${skill.rating}%)` : ''}
                </Typography>
              ))}
              {softwareSkills.map((skill, i) => (
                <Typography key={`software-${i}`} component="li" variant="body1" color={primaryColor} sx={textStyle}>
                  {skill.name} {skill.level ? `- ${skill.level}` : ''}
                </Typography>
              ))}
            </Box>
          </Box>
        ) : null;

      case 'languages':
        return savedLanguages.length > 0 ? (
          <Box 
            mb={`${sectionSpacing}px`} 
            className="resume-section" 
            id="languages-section" 
            sx={{ 
              fontFamily: font,
              ...textStyle
            }}
          >
            <Typography sx={{ 
              fontSize: headingSize, 
              fontWeight: "bold", 
              color: primaryColor, 
              fontFamily: font,
              mb: `${paragraphSpacing}px`,
              borderBottom: `${lineWeight * 2}px solid ${primaryColor}`, 
              pb: 1, 
              display: 'inline-block',
            }}>
              Languages
            </Typography>
            <Box component="ul" sx={{ 
              pl: 2, 
              mt: 0, 
              fontFamily: font,
              ...textStyle 
            }}>
              {savedLanguages.map((lang, index) => (
                <Typography key={index} component="li" variant="body1" color={primaryColor} sx={textStyle}>
                  {lang.name} {lang.level ? `– ${lang.level}` : ""}
                </Typography>
              ))}
            </Box>
          </Box>
        ) : null;

      case 'certifications':
        return savedCertifications.length > 0 ? (
          <Box 
            mb={`${sectionSpacing}px`} 
            className="resume-section" 
            id="certifications-section" 
            sx={{ 
              fontFamily: font,
              ...textStyle
            }}
          >
            <Typography sx={{ 
              fontSize: headingSize, 
              fontWeight: "bold", 
              color: primaryColor, 
              fontFamily: font,
              mb: `${paragraphSpacing}px`,
              borderBottom: `${lineWeight * 2}px solid ${primaryColor}`, 
              pb: 1, 
              display: 'inline-block',
            }}>
              Certifications
            </Typography>
            <Box component="ul" sx={{ 
              pl: 2, 
              mt: 0, 
              fontFamily: font,
              ...textStyle 
            }}>
              {savedCertifications.map((cert, index) => (
                <Typography key={index} component="li" variant="body1" color={primaryColor} sx={textStyle}>
                  {cert.name} – {cert.provider} ({cert.year})
                </Typography>
              ))}
            </Box>
          </Box>
        ) : null;

      case 'accomplishments':
        return savedAccomplishments.length > 0 ? (
          <Box 
            mb={`${sectionSpacing}px`} 
            className="resume-section" 
            id="accomplishments-section" 
            sx={{ 
              fontFamily: font,
              ...textStyle
            }}
          >
            <Typography sx={{ 
              fontSize: headingSize, 
              fontWeight: "bold", 
              color: primaryColor, 
              fontFamily: font,
              mb: `${paragraphSpacing}px`,
              borderBottom: `${lineWeight * 2}px solid ${primaryColor}`, 
              pb: 1, 
              display: 'inline-block',
            }}>
              Accomplishments
            </Typography>
            <Box component="ul" sx={{ 
              pl: 2, 
              mt: 0, 
              fontFamily: font,
              ...textStyle 
            }}>
              {savedAccomplishments.map((accomplishment, index) => (
                <Typography key={index} component="li" variant="body1" color={primaryColor} sx={textStyle}>
                  {accomplishment}
                </Typography>
              ))}
            </Box>
          </Box>
        ) : null;

      case 'additionalInfo':
        return savedAdditionalInfo.length > 0 ? (
          <Box 
            mb={`${sectionSpacing}px`} 
            className="resume-section" 
            id="additional-info-section" 
            sx={{ 
              fontFamily: font,
              ...textStyle
            }}
          >
            <Typography sx={{ 
              fontSize: headingSize, 
              fontWeight: "bold", 
              color: primaryColor, 
              fontFamily: font,
              mb: `${paragraphSpacing}px`,
              borderBottom: `${lineWeight * 2}px solid ${primaryColor}`, 
              pb: 1, 
              display: 'inline-block',
            }}>
              Additional Information
            </Typography>
            <Box component="ul" sx={{ 
              pl: 2, 
              mt: 0, 
              fontFamily: font,
              ...textStyle 
            }}>
              {savedAdditionalInfo.map((info, index) => (
                <Typography key={index} component="li" variant="body1" color={primaryColor} sx={textStyle}>
                  {info}
                </Typography>
              ))}
            </Box>
          </Box>
        ) : null;

      case 'volunteering':
        return savedVolunteering.length > 0 ? (
          <Box 
            mb={`${sectionSpacing}px`} 
            className="resume-section" 
            id="volunteering-section" 
            sx={{ 
              fontFamily: font,
              ...textStyle
            }}
          >
            <Typography sx={{ 
              fontSize: headingSize, 
              fontWeight: "bold", 
              color: primaryColor, 
              fontFamily: font,
              mb: `${paragraphSpacing}px`,
              borderBottom: `${lineWeight * 2}px solid ${primaryColor}`, 
              pb: 1, 
              display: 'inline-block',
            }}>
              Volunteering
            </Typography>
            {savedVolunteering.map((vol, index) => (
              <Box key={index} sx={{ mb: `${paragraphSpacing}px`, fontFamily: font }}>
                <Typography color={primaryColor} sx={{ 
                  ...textStyle, 
                  fontWeight: "bold" 
                }}>
                  {vol.subtopic}
                </Typography>
                <Typography color={primaryColor} sx={textStyle}>
                  {vol.fromDate} to {vol.toDate}
                </Typography>
                <Typography color={primaryColor} sx={{ 
                  ...textStyle, 
                  whiteSpace: "pre-line", 
                  mt: 0.5 
                }}>
                  {vol.content}
                </Typography>
              </Box>
            ))}
          </Box>
        ) : null;

      case 'interests':
        return savedInterests.length > 0 ? (
          <Box 
            mb={`${sectionSpacing}px`} 
            className="resume-section" 
            id="interests-section" 
            sx={{ 
              fontFamily: font,
              ...textStyle
            }}
          >
            <Typography sx={{ 
              fontSize: headingSize, 
              fontWeight: "bold", 
              color: primaryColor, 
              fontFamily: font,
              mb: `${paragraphSpacing}px`,
              borderBottom: `${lineWeight * 2}px solid ${primaryColor}`, 
              pb: 1, 
              display: 'inline-block',
            }}>
              Interests
            </Typography>
            <Box component="ul" sx={{ 
              pl: 2, 
              mt: 0, 
              fontFamily: font,
              ...textStyle 
            }}>
              {savedInterests.map((interest, index) => (
                <Typography key={index} component="li" variant="body1" color={primaryColor} sx={textStyle}>
                  {interest}
                </Typography>
              ))}
            </Box>
          </Box>
        ) : null;

      case 'websites':
        return savedWebsites.length > 0 ? (
          <Box 
            mb={`${sectionSpacing}px`} 
            className="resume-section" 
            id="websites-section" 
            sx={{ 
              fontFamily: font,
              ...textStyle
            }}
          >
            <Typography sx={{ 
              fontSize: headingSize, 
              fontWeight: "bold", 
              color: primaryColor, 
              fontFamily: font,
              mb: `${paragraphSpacing}px`,
              borderBottom: `${lineWeight * 2}px solid ${primaryColor}`, 
              pb: 1, 
              display: 'inline-block',
            }}>
              Websites & Portfolios
            </Typography>
            <Box component="ul" sx={{ 
              pl: 2, 
              mt: 0, 
              fontFamily: font,
              ...textStyle 
            }}>
              {savedWebsites.map((website, index) => (
                <Typography key={index} component="li" variant="body1" color={primaryColor} sx={textStyle}>
                  <a href={website.url} target="_blank" rel="noopener noreferrer" style={{ 
                    textDecoration: 'none', 
                    color: primaryColor, 
                    fontFamily: font, 
                    fontSize: fontSize, 
                    fontStyle: fontStyle 
                  }}>
                    {website.name || website.url}
                  </a>
                </Typography>
              ))}
            </Box>
          </Box>
        ) : null;

      case 'references':
        return savedReferences.length > 0 ? (
          <Box 
            mb={`${sectionSpacing}px`} 
            className="resume-section" 
            id="references-section" 
            sx={{ 
              fontFamily: font,
              ...textStyle
            }}
          >
            <Typography sx={{ 
              fontSize: headingSize, 
              fontWeight: "bold", 
              color: primaryColor, 
              fontFamily: font,
              mb: `${paragraphSpacing}px`,
              borderBottom: `${lineWeight * 2}px solid ${primaryColor}`, 
              pb: 1, 
              display: 'inline-block',
            }}>
              References
            </Typography>
            {savedReferences.map((ref, index) => (
              <Typography key={index} color={primaryColor} sx={{ 
                ...textStyle, 
                mb: `${paragraphSpacing}px` 
              }} whiteSpace="pre-line">
                {ref}
              </Typography>
            ))}
          </Box>
        ) : null;

      default:
        // Handle custom sections (improved like Resume3)
        if (sectionId && sectionId.startsWith('custom_')) {
          const customSectionName = sectionId.replace('custom_', '');
          const items = customSections[customSectionName] || [];
          
          console.log(`🎯 Rendering custom section: ${customSectionName}`, items);
          
          if (items && items.length > 0) {
            return (
              <Box 
                mb={`${sectionSpacing}px`} 
                className="resume-section" 
                id={`custom-${customSectionName}-section`} 
                sx={{ 
                  fontFamily: font,
                  ...textStyle
                }}
              >
                <Typography sx={{ 
                  fontSize: headingSize, 
                  fontWeight: "bold", 
                  color: primaryColor, 
                  fontFamily: font,
                  mb: `${paragraphSpacing}px`,
                  borderBottom: `${lineWeight * 2}px solid ${primaryColor}`, 
                  pb: 1, 
                  display: 'inline-block',
                }}>
                  {customSectionName.toUpperCase()}
                </Typography>
                {items.map((item, i) => (
                  <Typography key={i} sx={{ 
                    mb: `${paragraphSpacing / 2}px`, 
                    fontSize: fontSize, 
                    fontFamily: font,
                    color: primaryColor,
                    lineHeight: `${lineSpacing}px`
                  }} whiteSpace="pre-line">
                    • {item}
                  </Typography>
                ))}
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

  // Save download history function
  const saveDownloadHistory = async (format, fileName, fileSize) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const downloadData = {
        templateId: 12, // Resume12 template ID
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

  // Handle PDF download
  const handlePDFDownload = async () => {
    const resumeElement = document.getElementById('resume-container');
    if (!resumeElement) return;

    try {
      // Get all resume pages
      const resumePages = resumeElement.querySelectorAll('.resume-page');
      
      if (resumePages.length === 0) {
        console.error("No resume pages found");
        return;
      }

      const pdf = new jsPDF("p", "mm", pageSize.toLowerCase());
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      // Process each page individually
      for (let i = 0; i < resumePages.length; i++) {
        const pageElement = resumePages[i];
        
        // Add new page for all except the first one
        if (i > 0) {
          pdf.addPage();
        }

        // Capture the current page
        const canvas = await html2canvas(pageElement, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: "#ffffff",
          logging: false
        });

        const imgData = canvas.toDataURL("image/png");
        
        // Calculate dimensions to fit the page
        const imgWidth = pageWidth;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        
        // Add image to PDF
        pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight, undefined, 'FAST');
      }
      
      // Generate blob and get file size
      const pdfBlob = pdf.output('blob');
      const fileSize = pdfBlob.size;
      
      // Save download history
      await saveDownloadHistory("pdf", "resume", fileSize);
      
      // Save the PDF
      pdf.save("resume.pdf");
      
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Error generating PDF. Please try again.");
    }
  };

  // Handle PNG download - multiple images for multiple pages
  const handlePNGDownload = async () => {
    const resumeElement = document.getElementById('resume-container');
    if (!resumeElement) return;

    try {
      // Get all resume pages
      const resumePages = resumeElement.querySelectorAll('.resume-page');
      
      if (resumePages.length === 0) {
        console.error("No resume pages found");
        return;
      }

      // Download each page as a separate PNG file
      for (let i = 0; i < resumePages.length; i++) {
        const pageElement = resumePages[i];
        
        const canvas = await html2canvas(pageElement, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: "#ffffff"
        });
        
        const link = document.createElement('a');
        
        // Create unique filename for each page
        if (resumePages.length === 1) {
          link.download = `resume.png`;
        } else {
          link.download = `resume-page-${i + 1}.png`;
        }
        
        link.href = canvas.toDataURL();
        
        // For multiple pages, use setTimeout to allow previous download to complete
        if (i === 0) {
          link.click();
        } else {
          setTimeout(() => {
            link.click();
          }, i * 500);
        }
      }

      // Save download history for PNG
      await saveDownloadHistory("png", "resume", 0);

      // Show notification for multiple pages
      if (resumePages.length > 1) {
        alert(`Downloading ${resumePages.length} PNG files. Please check your downloads folder.`);
      }
      
    } catch (error) {
      console.error("Error generating PNG:", error);
      alert("Error generating PNG files. Please try again.");
    }
  };

  // Handle Print
  const handlePrint = () => {
    window.print();
  };

  // Combined download handler
  const handleDownload = (format) => {
    if (format === 'pdf') {
      handlePDFDownload();
    } else if (format === 'png') {
      handlePNGDownload();
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
      .replace(/<ol/g, `<ol style="font-family: ${font}; font-size: ${fontSize}; font-style: ${fontStyle}; line-height: ${lineSpacing}px;"`)
      .replace(/<a/g, `<a style="font-family: ${font}; font-size: ${fontSize}; font-style: ${fontStyle};"`);
  };

  // Page splitting functionality
  const splitContentIntoPages = useCallback(() => {
    if (!resumeRef.current) return;
    
    const sections = Array.from(resumeRef.current.querySelectorAll('.resume-section'));
    const pageHeightInPx = parseFloat(page.height.replace('mm', '')) * 3.78;
    const availableHeight = pageHeightInPx - (2 * topBottomMargin) - 2 * 16;

    let newPages = [];
    let currentPageSections = [];
    let currentHeight = 0;

    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;

      // If adding this section would exceed page height, create a new page
      if (currentHeight + sectionHeight > availableHeight) {
        if (currentPageSections.length > 0) {
          newPages.push(currentPageSections);
        }
        currentPageSections = [section.outerHTML];
        currentHeight = sectionHeight;
      } else {
        currentPageSections.push(section.outerHTML);
        currentHeight += sectionHeight;
      }
    });

    // Push the last page if it has content
    if (currentPageSections.length > 0) {
      newPages.push(currentPageSections);
    }
    
    setPages(newPages);
  }, [page.height, topBottomMargin, workExperiences, educationEntries, savedSkills, savedSummary, savedAdditionalInfo, savedLanguages, savedAccomplishments, savedCertifications, savedReferences, softwareSkills, savedVolunteering, savedInterests, savedWebsites, customSections, sectionOrder, sectionSpacing, paragraphSpacing, lineSpacing, fontSize, headingSize, font, primaryColor]);
  
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      splitContentIntoPages();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [splitContentIntoPages]);

  // Render content for measurement (hidden)
  const renderContentForMeasurement = () => (
    <Box ref={resumeRef} sx={{ visibility: 'hidden', position: 'absolute', fontFamily: font }}>
      <Box sx={{ p: `0px ${sideMargins}px`, fontFamily: font, color: primaryColor }}>
        {/* Header Section */}
        <Box 
          className="resume-section" 
          sx={{ 
            textAlign: 'center', 
            mb: `${sectionSpacing}px`, 
            fontFamily: font,
            ...textStyle
          }}
        >
          <Typography variant="h3" component="h1" fontWeight="bold" sx={{ 
            ...textStyle,
            fontSize: `calc(${headingSize} * 1.8)`,
          }}>
            {data.firstName} {data.lastName}
          </Typography>
          <Typography variant="h6" sx={{ 
            ...textStyle,
            letterSpacing: 2,
            fontSize: `calc(${fontSize} * 1.3)`,
          }}>
            {data.currentPosition}
          </Typography>
        </Box>

        <Divider sx={{ 
          my: `${sectionSpacing}px`, 
          borderWidth: `${lineWeight}px`,
          borderColor: primaryColor,
        }} />

        {/* Contact Info */}
        <Box 
          className="resume-section" 
          sx={{ 
            mb: `${sectionSpacing}px`, 
            display: 'flex', 
            justifyContent: 'center', 
            flexWrap: 'wrap', 
            gap: 3,
            fontFamily: font,
            ...textStyle
          }}
        >
          <Box display="flex" alignItems="center">
            <EmailIcon sx={{ mr: 1, color: primaryColor }} />
            <Typography variant="body1" color={primaryColor} sx={textStyle}>
              {data.email}
            </Typography>
          </Box>
          <Box display="flex" alignItems="center">
            <PhoneIcon sx={{ mr: 1, color: primaryColor }} />
            <Typography variant="body1" color={primaryColor} sx={textStyle}>
              {data.phone}
            </Typography>
          </Box>
          <Box display="flex" alignItems="center">
            <LocationOnIcon sx={{ mr: 1, color: primaryColor }} />
            <Typography variant="body1" color={primaryColor} sx={textStyle}>
              {data.city}
            </Typography>
          </Box>
          <Box display="flex" alignItems="center">
            <LinkedInIcon sx={{ mr: 1, color: primaryColor }} />
            <Typography variant="body1" color={primaryColor} sx={textStyle}>
              {data.website}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ 
          my: `${sectionSpacing}px`, 
          borderWidth: `${lineWeight}px`,
          borderColor: primaryColor,
        }} />
        
        {/* Render all sections in the specified order */}
        {sectionOrder.map(sectionId => (
          <React.Fragment key={sectionId}>
            {renderSectionContent(sectionId)}
          </React.Fragment>
        ))}
      </Box>
    </Box>
  );

  return (
    <Box sx={{ width: "100%", position: "relative", fontFamily: font, color: primaryColor }}>
      {/* Controls */}
      {!exporting && (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 2, gap: 2, '@media print': { display: 'none' } }}>
          <IconButton onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))} disabled={currentPage === 0} color="primary"><ChevronLeft /></IconButton>
          <Typography sx={{ mx: 2 }}>Page {currentPage + 1} of {Math.max(1, pages.length)}</Typography>
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
              
              <Button onClick={resetSectionOrder} variant="outlined" color="secondary" size="small">
                Reset Section Order
              </Button>
            </Box>
          )}
        </Box>
      )}
      
      {renderContentForMeasurement()}
      
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
                boxShadow: index === currentPage ? 3 : 0,
                bgcolor: "#fff",
                color: primaryColor,
                fontFamily: font,
                fontSize,
                fontStyle,
                lineHeight: `${lineSpacing}px`,
                p: `${topBottomMargin}px ${sideMargins}px`,
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
                display: exporting ? 'block' : (index === currentPage ? 'block' : 'none'),
                '@media print': { display: 'block' }
              }}
            >
              <div 
                style={textStyle}
                dangerouslySetInnerHTML={{ 
                  __html: addFontToHtmlContent(pageContent.join('')) 
                }} 
              />
            </Box>
          ))
        ) : (
          <Box
            className="resume-page"
            sx={{
              width: page.width,
              minHeight: page.height,
              mx: "auto",
              boxShadow: 3,
              bgcolor: "#fff",
              fontFamily: font,
              fontSize,
              fontStyle,
              lineHeight: `${lineSpacing}px`,
              p: `${topBottomMargin}px ${sideMargins}px`,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography sx={{ p: 2, ...textStyle }}>Loading resume...</Typography>
          </Box>
        )}
      </Box>

      {/* Arrange Sections Dialog */}
      <Dialog
        open={arrangeDialogOpen}
        onClose={handleArrangeDialogClose}
        maxWidth="md"
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
            Drag and drop to reorder sections. Sections will appear in the order shown below.
          </Typography>

          {renderDragPanel()}
        </DialogContent>

        <DialogActions>
          <Button onClick={resetSectionOrder} color="secondary">
            Reset Order
          </Button>
          <Button onClick={handleArrangeDialogClose} variant="contained">
            Done
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

// Meta information for Resume12
export const resumeMeta = {
  hasPhoto: false,
  columns: 1,
};

export default Resume12;