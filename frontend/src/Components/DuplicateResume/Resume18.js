import React, { useEffect, useState, useRef, useCallback } from 'react';
import { 
  Container, Grid, Box, Typography, List, ListItem, Divider, Chip, IconButton, Button,
  Dialog, DialogTitle, DialogContent, DialogActions, Paper
} from '@mui/material';
import { styled } from '@mui/system';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { ChevronLeft, ChevronRight, Print, Download, DragIndicator, Reorder } from '@mui/icons-material';
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

// Custom styled components for consistent design
const SectionHeader = styled(Typography)(({ theme, color }) => ({
  fontFamily: 'serif',
  fontWeight: 'bold',
  color: color || '#2c3e50',
  textTransform: 'uppercase',
  position: 'relative',
  paddingBottom: '8px',
  '&::after': {
    content: '""',
    position: 'absolute',
    left: 0,
    bottom: 0,
    width: '50px',
    height: '3px',
    backgroundColor: theme?.palette?.primary?.main || '#3498db',
    borderRadius: '5px',
  },
}));

const ContactInfo = styled(Box)(({ theme, color }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: '4px',
  '& .MuiSvgIcon-root': {
    fontSize: '1rem',
    marginRight: '8px',
    color: color || '#3498db',
  },
}));

const BulletPoint = styled('span')(({ color }) => ({
  marginRight: '8px',
  color: color || '#34495e',
}));

const pageSizeMap = {
  A4: { width: "210mm", height: "297mm" },
  Letter: { width: "216mm", height: "279mm" },
  Legal: { width: "216mm", height: "356mm" },
  A3: { width: "297mm", height: "420mm" },
  Executive: { width: "184mm", height: "267mm" },
};

// Resume3-ல் இருந்து defaultData எடுத்து வந்தது
const defaultData = {
  firstName: "John",
  lastName: "Doe",
  currentPosition: "Software Engineer",
  phone: "+91 98765 43210",
  email: "john.doe@email.com",
  city: "Chennai, India",
  website: "www.johndoe.com",
  profile: "Experienced software engineer with a strong background in full-stack development, cloud solutions, and problem solving.",
  skills: [
    "React, Node.js, MongoDB",
    "Java, Spring Boot",
    "AWS, Docker",
    "Problem Solving",
  ],
};

// Define default section order for Resume18 - ADD ACCOMPLISHMENTS HERE
const defaultSectionOrder = [
  'about',
  'skills',
  'languages',
  'certifications',
  'softwareSkills',
  'interests',
  'accomplishments', // ✅ ADDED ACCOMPLISHMENTS
  'experience',
  'education',
  'additionalInfo',
  'volunteering',
  'references',
  'websites'
];

const Resume18 = ({
  color = '#2c3e50',
  nameColor = '#2c3e50',
  sidebarBackground = '#f8f9fa',
  headerBackground = '#fff',
  font = 'Arial, sans-serif',
  fontSize = '14px',
  fontStyle = 'normal',
  headingSize = '24px',
  sectionSpacing = 30,
  paragraphSpacing = 10,
  lineSpacing = 20,
  topBottomMargin = 30,
  sideMargins = 20,
  paragraphIndent = 0,
  lineWeight = 1,
  pageSize = 'A4',
  theme,
  photo = "",
  workExperiences = [],
  exporting = false,
  enableDragDrop = true,
  formData = {}, // Resume3-ல் இருந்து formData prop-ஐ எடுத்து வந்தது
}) => {
  // Use theme color if provided, otherwise use the color prop
const primaryColor = color;

  
  // Define a color palette for the template with customizable colors
  const palette = {
    mainBackground: '#FFFFFF',
    sidebarBackground: sidebarBackground,
    accentColor: primaryColor,
    textColor: primaryColor, // Apply color to all text
    lightText: primaryColor, // Apply color to light text as well
    header: headerBackground,
    nameColor: nameColor,
  };

  const page = pageSizeMap[pageSize] || pageSizeMap.A4;
  const [currentPage, setCurrentPage] = useState(0);
  const [pages, setPages] = useState([]);
  const resumeRef = useRef(null);

  // State for fetched data
  const [educationEntries, setEducationEntries] = useState([]);
  const [savedSkills, setSavedSkills] = useState([]);
  const [savedSummary, setSavedSummary] = useState("");
  const [savedAdditionalInfo, setSavedAdditionalInfo] = useState([]);
  const [savedLanguages, setSavedLanguages] = useState([]);
  const [savedAccomplishments, setSavedAccomplishments] = useState([]); // ✅ ADDED ACCOMPLISHMENTS STATE
  const [savedCertifications, setSavedCertifications] = useState([]);
  const [savedReferences, setSavedReferences] = useState([]);
  const [softwareSkills, setSoftwareSkills] = useState([]);
  const [savedVolunteering, setSavedVolunteering] = useState([]);
  const [savedInterests, setSavedInterests] = useState([]);
  const [savedWebsites, setSavedWebsites] = useState([]);
  const [customSections, setCustomSections] = useState({});
  
  // Resume3-ல் இருந்து data எடுத்து வந்தது
  const data = { ...defaultData, ...formData };

  // State for section ordering - single array for all sections
  const [sectionOrder, setSectionOrder] = useState(defaultSectionOrder);
  const [dragOverIndex, setDragOverIndex] = useState(null);
  
  // State for arrange sections dialog
  const [arrangeDialogOpen, setArrangeDialogOpen] = useState(false);

  // Fetch data from localStorage - UPDATED LIKE RESUME3
  useEffect(() => {
    // Load other data
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
    
    // ✅ ADDED: Fetch accomplishments data
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
    
    // ✅ UPDATED: Custom sections loading like Resume3
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

  // Load saved section order for Resume18
  const savedSectionOrder = localStorage.getItem("resume18SectionOrder");
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

// Custom sections update effect-ஐ சேர்க்கவும்:
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
      localStorage.setItem("resume18SectionOrder", JSON.stringify(newOrder));
      console.log('📝 Final section order with ONLY CURRENT custom sections:', newOrder);
    }
  } else if (userId && Object.keys(customSections).length === 0) {
    // If no current custom sections, remove all custom sections
    const currentOrder = [...sectionOrder];
    const filteredOrder = currentOrder.filter(section => !section.startsWith('custom_'));
    
    if (filteredOrder.length !== currentOrder.length) {
      setSectionOrder(filteredOrder);
      localStorage.setItem("resume18SectionOrder", JSON.stringify(filteredOrder));
      console.log('🗑️ Removed all custom sections (no current sections)');
    }
  }
}, [customSections]);

  // Save section order to localStorage whenever it changes
  useEffect(() => {
    if (sectionOrder.length > 0) {
      localStorage.setItem("resume18SectionOrder", JSON.stringify(sectionOrder));
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
      'experience': 'Work Experience',
      'education': 'Education',
      'languages': 'Languages',
      'certifications': 'Certifications',
      'accomplishments': 'Accomplishments', // ✅ ADDED ACCOMPLISHMENTS TITLE
      'softwareSkills': 'Software Skills',
      'volunteering': 'Volunteering',
      'interests': 'Interests',
      'websites': 'Websites/Profiles',
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

  // ✅ UPDATED: Apply proper spacing and heading size to all sections
  const renderSectionContent = (sectionId) => {
    // Common section container with proper spacing
    const sectionContainerStyle = {
      mb: `${sectionSpacing / 10}px`, 
      fontFamily: font,
      fontSize: fontSize,
      fontStyle: fontStyle,
      lineHeight: `${lineSpacing}px`,
      color: palette.textColor
    };

    // Common paragraph style
    const paragraphStyle = {
      mb: `${paragraphSpacing / 10}px`,
      fontFamily: font,
      fontSize: fontSize,
      fontStyle: fontStyle,
      lineHeight: `${lineSpacing}px`,
      color: palette.textColor,
      textIndent: `${paragraphIndent}px`
    };

    // Common heading style
    const headingStyle = {
      fontSize: headingSize,
      fontWeight: 'bold',
      color: palette.textColor,
      fontFamily: font,
      fontStyle: fontStyle,
      mb: `${paragraphSpacing / 10}px`,
      lineHeight: `${lineSpacing}px`
    };

    switch (sectionId) {
      case 'about':
        return (
          <Box className="resume-section" id="about-section" sx={sectionContainerStyle}>
            <SectionHeader color={palette.textColor} sx={headingStyle}>
              ABOUT ME
            </SectionHeader>
            <Typography
              variant="body1"
              sx={paragraphStyle}
            >
              {savedSummary || data.profile}
            </Typography>
          </Box>
        );
      
      case 'skills':
        return (
          <Box className="resume-section" id="skills-section" sx={sectionContainerStyle}>
            <SectionHeader color={palette.textColor} sx={headingStyle}>
              SKILLS
            </SectionHeader>
            <Box sx={{ mt: 2, fontFamily: font }}>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {savedSkills.length > 0 ? (
                  savedSkills.map((skill, index) => (
                    <Chip
                      key={index}
                      label={skill.name}
                      variant="outlined"
                      sx={{
                        borderColor: palette.textColor,
                        color: palette.textColor,
                        fontFamily: font,
                        fontStyle: fontStyle,
                        fontSize: fontSize,
                        mb: `${paragraphSpacing / 20}px`
                      }}
                    />
                  ))
                ) : (
                  data.skills.map((skill, index) => (
                    <Chip
                      key={index}
                      label={skill}
                      variant="outlined"
                      sx={{
                        borderColor: palette.textColor,
                        fontFamily: font,
                        color: palette.textColor,
                        fontStyle: fontStyle,
                        fontSize: fontSize,
                        mb: `${paragraphSpacing / 20}px`
                      }}
                    />
                  ))
                )}
              </Box>
            </Box>
          </Box>
        );

      case 'languages':
        return savedLanguages.length > 0 ? (
          <Box className="resume-section" id="languages-section" sx={sectionContainerStyle}>
            <SectionHeader color={palette.textColor} sx={headingStyle}>
              LANGUAGES
            </SectionHeader>
            <Box sx={{ mt: 2 }}>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {savedLanguages.map((lang, index) => (
                  <Chip
                    key={index}
                    label={`${lang.name}${lang.level ? ` - ${lang.level}` : ''}`}
                    variant="outlined"
                    sx={{
                      borderColor: palette.textColor,
                      color: palette.textColor,
                      fontFamily: font,
                      fontStyle: fontStyle,
                      fontSize: fontSize,
                      mb: `${paragraphSpacing / 20}px`
                    }}
                  />
                ))}
              </Box>
            </Box>
          </Box>
        ) : null;

      case 'certifications':
        return savedCertifications.length > 0 ? (
          <Box className="resume-section" id="certifications-section" sx={sectionContainerStyle}>
            <SectionHeader color={palette.textColor} sx={headingStyle}>
              CERTIFICATIONS
            </SectionHeader>
            <Box sx={{ mt: 2 }}>
              {savedCertifications.map((cert, index) => (
                <Box key={index} sx={{ mb: `${paragraphSpacing / 10}px` }}>
                  <Typography variant="body2" sx={{ ...paragraphStyle, fontWeight: 'bold' }}>
                    {cert.name}
                  </Typography>
                  <Typography variant="body2" sx={paragraphStyle}>
                    {cert.provider} ({cert.year})
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        ) : null;

      case 'softwareSkills':
        return softwareSkills.length > 0 ? (
          <Box className="resume-section" id="software-skills-section" sx={sectionContainerStyle}>
            <SectionHeader color={palette.textColor} sx={headingStyle}>
              SOFTWARE SKILLS
            </SectionHeader>
            <Box sx={{ mt: 2 }}>
              {softwareSkills.map((skill, index) => (
                <Box key={index} sx={{ mb: `${paragraphSpacing / 10}px` }}>
                  <Typography variant="body2" sx={paragraphStyle}>
                    {skill.name} — {skill.level}%
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        ) : null;

      case 'interests':
        return savedInterests.length > 0 ? (
          <Box className="resume-section" id="interests-section" sx={sectionContainerStyle}>
            <SectionHeader color={palette.textColor} sx={headingStyle}>
              INTERESTS
            </SectionHeader>
            <Box sx={{ mt: 2 }}>
              {savedInterests.map((interest, index) => (
                <Typography key={index} variant="body2" sx={paragraphStyle}>
                  • {interest}
                </Typography>
              ))}
            </Box>
          </Box>
        ) : null;

      // ✅ ADDED: ACCOMPLISHMENTS SECTION
      case 'accomplishments':
        return savedAccomplishments.length > 0 ? (
          <Box className="resume-section" id="accomplishments-section" sx={sectionContainerStyle}>
            <SectionHeader color={palette.textColor} sx={headingStyle}>
              ACCOMPLISHMENTS
            </SectionHeader>
            <Box sx={{ mt: 2 }}>
              {savedAccomplishments.map((accomplishment, index) => (
                <Typography key={index} variant="body2" sx={{ 
                  ...paragraphStyle,
                  whiteSpace: 'pre-line'
                }}>
                  • {accomplishment}
                </Typography>
              ))}
            </Box>
          </Box>
        ) : null;

      case 'experience':
        return (
          <Box className="resume-section" id="experience-section" sx={sectionContainerStyle}>
            <SectionHeader color={palette.textColor} sx={headingStyle}>
              WORK EXPERIENCE
            </SectionHeader>

            {(workExperiences && workExperiences.length > 0) ? (
              workExperiences.map((work, index) => (
                <Box key={index} sx={{ mt: 3, mb: `${sectionSpacing / 10}px` }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <Typography variant="h6" sx={{ 
                      fontWeight: 'bold', 
                      color: palette.textColor, 
                      fontFamily: font,
                      fontStyle: fontStyle,
                      fontSize: `calc(${headingSize} * 0.9)`,
                      mb: `${paragraphSpacing / 20}px`
                    }}>
                      {work.jobTitle}
                    </Typography>
                    <Typography variant="body2" sx={{ 
                      fontStyle: 'italic', 
                      color: palette.textColor, 
                      fontFamily: font, 
                      fontStyle: fontStyle,
                      fontSize: fontSize,
                      mb: `${paragraphSpacing / 20}px`
                    }}>
                      {formatDate(work.startMonth, work.startYear)} - {work.current ? "Present" : formatDate(work.endMonth, work.endYear)}
                    </Typography>
                  </Box>
                  <Typography variant="subtitle1" sx={{ 
                    color: palette.textColor, 
                    mb: `${paragraphSpacing / 10}px`, 
                    fontFamily: font, 
                    fontStyle: fontStyle,
                    fontSize: `calc(${fontSize} * 1.1)`
                  }}>
                    {work.employer}
                  </Typography>
                  {work.description && (
                    <Box
                      sx={{ 
                        mt: 1, 
                        color: palette.textColor,
                        fontFamily: font,
                        fontSize: fontSize,
                        fontStyle: fontStyle,
                        lineHeight: `${lineSpacing}px`
                      }}
                      dangerouslySetInnerHTML={{
                        __html: work.description
                          .replace(/\*\*(.*?)\*\*/g, `<strong style="font-family: ${font}; font-weight: bold; font-style: ${fontStyle}; color: ${palette.textColor}; font-size: ${fontSize}; line-height: ${lineSpacing}px">$1</strong>`)
                          .replace(/\*(.*?)\*/g, `<em style="font-family: ${font}; font-style: italic; color: ${palette.textColor}; font-size: ${fontSize}; line-height: ${lineSpacing}px">$1</em>`)
                          .replace(/<u>(.*?)<\/u>/g, `<u style="font-family: ${font}; color: ${palette.textColor}; font-size: ${fontSize}; line-height: ${lineSpacing}px">$1</u>`)
                          .replace(/\n/g, `<br style="font-family: ${font}" />`),
                      }}
                    />
                  )}
                  {index < workExperiences.length - 1 && (
                    <Divider sx={{ 
                      my: `${sectionSpacing / 20}px`, 
                      borderColor: palette.textColor, 
                      borderBottomWidth: lineWeight 
                    }} />
                  )}
                </Box>
              ))
            ) : (
              <>
                <Box sx={{ mt: 3, mb: `${sectionSpacing / 10}px` }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <Typography variant="h6" sx={{ 
                      fontWeight: 'bold', 
                      color: palette.textColor, 
                      fontFamily: font, 
                      fontStyle: fontStyle,
                      fontSize: `calc(${headingSize} * 0.9)`,
                      mb: `${paragraphSpacing / 20}px`
                    }}>
                      Consumer Goods Seller
                    </Typography>
                    <Typography variant="body2" sx={{ 
                      fontStyle: 'italic', 
                      color: palette.textColor, 
                      fontFamily: font, 
                      fontStyle: fontStyle,
                      fontSize: fontSize,
                      mb: `${paragraphSpacing / 20}px`
                    }}>
                      Aug 2018 - Present
                    </Typography>
                  </Box>
                  <Typography variant="subtitle1" sx={{ 
                    color: palette.textColor, 
                    mb: `${paragraphSpacing / 10}px`, 
                    fontFamily: font, 
                    fontStyle: fontStyle,
                    fontSize: `calc(${fontSize} * 1.1)`
                  }}>
                    Impressive Industries
                  </Typography>
                  <List disablePadding>
                    <ListItem sx={{ px: 0, py: `${paragraphSpacing / 40}px` }}>
                      <BulletPoint color={palette.textColor}>•</BulletPoint>
                      <Typography variant="body2" sx={{ 
                        fontFamily: font, 
                        fontStyle: fontStyle, 
                        textIndent: `${paragraphIndent}px`, 
                        lineHeight: `${lineSpacing}px`, 
                        color: palette.textColor,
                        fontSize: fontSize
                      }}>
                        Offer consumer goods packages to corporate and clients
                      </Typography>
                    </ListItem>
                    <ListItem sx={{ px: 0, py: `${paragraphSpacing / 40}px` }}>
                      <BulletPoint color={palette.textColor}>•</BulletPoint>
                      <Typography variant="body2" sx={{ 
                        fontFamily: font, 
                        fontStyle: fontStyle, 
                        textIndent: `${paragraphIndent}px`, 
                        lineHeight: `${lineSpacing}px`, 
                        color: palette.textColor,
                        fontSize: fontSize
                      }}>
                        Meet with clients every quarter to update or renew services
                      </Typography>
                    </ListItem>
                  </List>
                </Box>
                
                <Divider sx={{ 
                  my: `${sectionSpacing / 20}px`, 
                  borderColor: palette.textColor, 
                  borderBottomWidth: lineWeight 
                }} />
                
                <Box sx={{ mb: `${sectionSpacing / 10}px` }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <Typography variant="h6" sx={{ 
                      fontWeight: 'bold', 
                      color: palette.textColor, 
                      fontFamily: font, 
                      fontStyle: fontStyle,
                      fontSize: `calc(${headingSize} * 0.9)`,
                      mb: `${paragraphSpacing / 20}px`
                    }}>
                      PMCG Sales Agent
                    </Typography>
                    <Typography variant="body2" sx={{ 
                      fontStyle: 'italic', 
                      color: palette.textColor, 
                      fontFamily: font, 
                      fontStyle: fontStyle,
                      fontSize: fontSize,
                      mb: `${paragraphSpacing / 20}px`
                    }}>
                      Jul 2016 - Aug 2018
                    </Typography>
                  </Box>
                  <Typography variant="subtitle1" sx={{ 
                    color: palette.textColor, 
                    mb: `${paragraphSpacing / 10}px`, 
                    fontFamily: font, 
                    fontStyle: fontStyle,
                    fontSize: `calc(${fontSize} * 1.1)`
                  }}>
                    Fast-moving Industries
                  </Typography>
                  <List disablePadding>
                    <ListItem sx={{ px: 0, py: `${paragraphSpacing / 40}px` }}>
                      <BulletPoint color={palette.textColor}>•</BulletPoint>
                      <Typography variant="body2" sx={{ 
                        fontFamily: font, 
                        fontStyle: fontStyle, 
                        textIndent: `${paragraphIndent}px`, 
                        lineHeight: `${lineSpacing}px`, 
                        color: palette.textColor,
                        fontSize: fontSize
                      }}>
                        Visited corporate client offices to renew latest products
                      </Typography>
                    </ListItem>
                    <ListItem sx={{ px: 0, py: `${paragraphSpacing / 40}px` }}>
                      <BulletPoint color={palette.textColor}>•</BulletPoint>
                      <Typography variant="body2" sx={{ 
                        fontFamily: font, 
                        fontStyle: fontStyle, 
                        textIndent: `${paragraphIndent}px`, 
                        lineHeight: `${lineSpacing}px`, 
                        color: palette.textColor,
                        fontSize: fontSize
                      }}>
                        Built relationships with clients to maintain sales goals and create new opportunities
                      </Typography>
                    </ListItem>
                  </List>
                </Box>
              </>
            )}
          </Box>
        );
      
      case 'education':
        return (
          <Box className="resume-section" id="education-section" sx={sectionContainerStyle}>
            <SectionHeader color={palette.textColor} sx={headingStyle}>
              EDUCATION
            </SectionHeader>
            <Box sx={{ mt: 2 }}>
              {educationEntries.length > 0 ? (
                educationEntries.map((edu) => (
                  <Box key={edu.id} sx={{ mb: `${sectionSpacing / 10}px` }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                      <Typography variant="h6" sx={{ 
                        fontWeight: 'bold', 
                        color: palette.textColor, 
                        fontFamily: font, 
                        fontStyle: fontStyle,
                        fontSize: `calc(${headingSize} * 0.9)`,
                        mb: `${paragraphSpacing / 20}px`
                      }}>
                        {edu.degree} {edu.fieldOfStudy ? `- ${edu.fieldOfStudy}` : ''}
                      </Typography>
                      <Typography variant="body2" sx={{ 
                        fontStyle: 'italic', 
                        color: palette.textColor, 
                        fontFamily: font, 
                        fontStyle: fontStyle,
                        fontSize: fontSize,
                        mb: `${paragraphSpacing / 20}px`
                      }}>
                        {formatDate(edu.gradMonth, edu.gradYear)}
                      </Typography>
                    </Box>
                    <Typography variant="subtitle1" sx={{ 
                      color: palette.textColor, 
                      fontFamily: font, 
                      fontStyle: fontStyle,
                      fontSize: `calc(${fontSize} * 1.1)`,
                      mb: `${paragraphSpacing / 10}px`
                    }}>
                      {edu.schoolName}, {edu.schoolLocation}
                    </Typography>
                    {edu.additionalCoursework && (
                      <Typography variant="body2" sx={{ 
                        fontFamily: font, 
                        fontStyle: fontStyle, 
                        color: palette.textColor,
                        fontSize: fontSize,
                        lineHeight: `${lineSpacing}px`
                      }}>
                        {edu.additionalCoursework}
                      </Typography>
                    )}
                  </Box>
                ))
              ) : (
                <Box sx={{ mb: `${sectionSpacing / 10}px` }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <Typography variant="h6" sx={{ 
                      fontWeight: 'bold', 
                      color: palette.textColor, 
                      fontFamily: font, 
                      fontStyle: fontStyle,
                      fontSize: `calc(${headingSize} * 0.9)`,
                      mb: `${paragraphSpacing / 20}px`
                    }}>
                      B.A. Sales and Commerce
                    </Typography>
                    <Typography variant="body2" sx={{ 
                      fontStyle: 'italic', 
                      color: palette.textColor, 
                      fontFamily: font, 
                      fontStyle: fontStyle,
                      fontSize: fontSize,
                      mb: `${paragraphSpacing / 20}px`
                    }}>
                      2019 - 2024
                    </Typography>
                  </Box>
                  <Typography variant="subtitle1" sx={{ 
                    color: palette.textColor, 
                    fontFamily: font, 
                    fontStyle: fontStyle,
                    fontSize: `calc(${fontSize} * 1.1)`
                  }}>
                    Western University
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        );

      case 'additionalInfo':
        return savedAdditionalInfo.length > 0 ? (
          <Box className="resume-section" id="additional-info-section" sx={sectionContainerStyle}>
            <SectionHeader color={palette.textColor} sx={headingStyle}>
              ADDITIONAL INFORMATION
            </SectionHeader>
            <Box sx={{ mt: 2 }}>
              {savedAdditionalInfo.map((info, index) => (
                <Typography key={index} variant="body2" sx={paragraphStyle}>
                  • {info}
                </Typography>
              ))}
            </Box>
          </Box>
        ) : null;

      case 'volunteering':
        return savedVolunteering.length > 0 ? (
          <Box className="resume-section" id="volunteering-section" sx={sectionContainerStyle}>
            <SectionHeader color={palette.textColor} sx={headingStyle}>
              VOLUNTEERING
            </SectionHeader>
            <Box sx={{ mt: 2 }}>
              {savedVolunteering.map((vol, index) => (
                <Box key={index} sx={{ mb: `${sectionSpacing / 10}px` }}>
                  <Typography variant="body2" sx={{ 
                    fontWeight: 'bold', 
                    fontFamily: font, 
                    fontStyle: fontStyle, 
                    color: palette.textColor,
                    fontSize: fontSize,
                    mb: `${paragraphSpacing / 20}px`
                  }}>
                    {vol.subtopic}
                  </Typography>
                  <Typography variant="body2" sx={{ 
                    color: palette.textColor, 
                    fontStyle: 'italic', 
                    fontFamily: font, 
                    fontStyle: fontStyle,
                    fontSize: fontSize,
                    mb: `${paragraphSpacing / 20}px`
                  }}>
                    {vol.fromDate} - {vol.toDate}
                  </Typography>
                  {vol.content && (
                    <Typography variant="body2" sx={{ 
                      mt: 0.5, 
                      fontFamily: font, 
                      fontStyle: fontStyle, 
                      whiteSpace: 'pre-line', 
                      lineHeight: `${lineSpacing}px`, 
                      color: palette.textColor,
                      fontSize: fontSize
                    }}>
                      {vol.content}
                    </Typography>
                  )}
                </Box>
              ))}
            </Box>
          </Box>
        ) : null;

      case 'references':
        return savedReferences.length > 0 ? (
          <Box className="resume-section" id="references-section" sx={sectionContainerStyle}>
            <SectionHeader color={palette.textColor} sx={headingStyle}>
              REFERENCES
            </SectionHeader>
            <Box sx={{ mt: 2 }}>
              {savedReferences.map((ref, index) => (
                <Typography key={index} variant="body2" sx={{ 
                  ...paragraphStyle,
                  whiteSpace: 'pre-line'
                }}>
                  {ref}
                </Typography>
              ))}
            </Box>
          </Box>
        ) : null;

      case 'websites':
        return savedWebsites.length > 0 ? (
          <Box className="resume-section" id="websites-section" sx={sectionContainerStyle}>
            <SectionHeader color={palette.textColor} sx={headingStyle}>
              WEBSITES / PROFILES
            </SectionHeader>
            <Box sx={{ mt: 2 }}>
              {savedWebsites.map((site, index) => (
                <Typography key={index} variant="body2" sx={paragraphStyle}>
                  • <a href={site.url} style={{ 
                    color: palette.textColor, 
                    fontFamily: font, 
                    fontStyle: fontStyle,
                    fontSize: fontSize,
                    textDecoration: 'none'
                  }} target="_blank" rel="noopener noreferrer">{site.url}</a>
                </Typography>
              ))}
            </Box>
          </Box>
        ) : null;

    // renderSectionContent function-ல் default case-ஐ இப்படி மாற்றவும்:

default:
  // ✅ Resume3-ல் இருந்து custom section rendering logic
  if (sectionId && sectionId.startsWith('custom_')) {
    const customSectionName = sectionId.replace('custom_', '');
    const items = customSections[customSectionName] || [];
    
    console.log(`🎯 Rendering custom section: ${customSectionName}`, {
      sectionId,
      customSectionName,
      items,
      customSections,
      hasItems: items.length > 0
    });
    
    // Filter out empty items
    const validItems = items.filter(item => item && item.trim() !== '');
    
    if (validItems.length > 0) {
      console.log(`✅ Displaying custom section: ${customSectionName} with ${validItems.length} items`);
      return (
        <Box className="resume-section" id={`custom-${customSectionName}-section`} sx={sectionContainerStyle}>
          <SectionHeader color={palette.textColor} sx={headingStyle}>
            {customSectionName.replace(/_/g, ' ').toUpperCase()}
          </SectionHeader>
          <Box sx={{ mt: 2 }}>
            {validItems.map((item, i) => (
              <Box key={i} sx={{ mb: `${paragraphSpacing / 10}px` }}>
                <Typography sx={paragraphStyle} whiteSpace="pre-line">
                  • {item}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      );
    } else {
      console.log(`⚠️ No valid items in custom section: ${customSectionName}`, {
        items,
        validItems
      });
      return null;
    }
  }
  console.log(`❌ Section not found or empty: ${sectionId}`);
  return null;
    }
  };

  const splitContentIntoPages = useCallback(() => {
    if (!resumeRef.current) return;
    
    const sections = Array.from(resumeRef.current.querySelectorAll('.resume-section'));
    const headerHeight = resumeRef.current.querySelector('.resume-header')?.offsetHeight || 0;
    const pageHeightInPx = parseFloat(page.height.replace('mm', '')) * 3.78;
    const availableHeightFirstPage = pageHeightInPx - headerHeight - (2 * topBottomMargin) - 2 * 16;
    const availableHeightSubsequent = pageHeightInPx - (2 * topBottomMargin) - 2 * 16;

    let newPages = [];
    let currentPageSections = [];
    let currentHeight = 0;

    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;

      // If it's the first page, use the reduced height
      const pageLimit = newPages.length === 0 ? availableHeightFirstPage : availableHeightSubsequent;

      // If adding this section would exceed page height, create a new page
      if (currentHeight + sectionHeight > pageLimit) {
        newPages.push(currentPageSections);
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
  }, [page.height, topBottomMargin, workExperiences, educationEntries, savedSkills, savedSummary, savedAdditionalInfo, savedLanguages, savedAccomplishments, savedCertifications, savedReferences, softwareSkills, savedVolunteering, savedInterests,, savedWebsites, customSections, sectionOrder, sectionSpacing, paragraphSpacing, lineSpacing, fontSize, headingSize, font, color]);
  
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      splitContentIntoPages();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [splitContentIntoPages]);

  // Save download history function
  const saveDownloadHistory = async (format, fileName, fileSize) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const downloadData = {
        templateId: 18, // Resume18 template ID
        fileName: fileName,
        fileFormat: format,
        fileSize: fileSize,
        themeColor: color,
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

  // Function to add font styles to HTML content
  const addFontStylesToHTML = (htmlContent) => {
    // Add font family and style to all elements in the HTML
    return htmlContent
      .replace(/<div/g, `<div style="font-family: ${font}; font-style: ${fontStyle}; font-size: ${fontSize}; line-height: ${lineSpacing}px; color: ${palette.textColor};"`)
      .replace(/<p/g, `<p style="font-family: ${font}; font-style: ${fontStyle}; font-size: ${fontSize}; line-height: ${lineSpacing}px; color: ${palette.textColor};"`)
      .replace(/<span/g, `<span style="font-family: ${font}; font-style: ${fontStyle}; color: ${palette.textColor};"`)
      .replace(/<h1/g, `<h1 style="font-family: ${font}; font-style: ${fontStyle}; color: ${palette.textColor};"`)
      .replace(/<h2/g, `<h2 style="font-family: ${font}; font-style: ${fontStyle}; color: ${palette.textColor};"`)
      .replace(/<h3/g, `<h3 style="font-family: ${font}; font-style: ${fontStyle}; color: ${palette.textColor};"`)
      .replace(/<h4/g, `<h4 style="font-family: ${font}; font-style: ${fontStyle}; color: ${palette.textColor};"`)
      .replace(/<h5/g, `<h5 style="font-family: ${font}; font-style: ${fontStyle}; color: ${palette.textColor};"`)
      .replace(/<h6/g, `<h6 style="font-family: ${font}; font-style: ${fontStyle}; color: ${palette.textColor};"`)
      .replace(/<li/g, `<li style="font-family: ${font}; font-style: ${fontStyle}; font-size: ${fontSize}; line-height: ${lineSpacing}px; color: ${palette.textColor};"`)
      .replace(/<ul/g, `<ul style="font-family: ${font}; font-style: ${fontStyle}; color: ${palette.textColor};"`)
      .replace(/<ol/g, `<ol style="font-family: ${font}; font-style: ${fontStyle}; color: ${palette.textColor};"`)
      .replace(/<td/g, `<td style="font-family: ${font}; font-style: ${fontStyle}; color: ${palette.textColor};"`)
      .replace(/<th/g, `<th style="font-family: ${font}; font-style: ${fontStyle}; color: ${palette.textColor};"`)
      .replace(/<tr/g, `<tr style="font-family: ${font}; font-style: ${fontStyle}; color: ${palette.textColor};"`)
      .replace(/<table/g, `<table style="font-family: ${font}; font-style: ${fontStyle}; color: ${palette.textColor};"`);
  };

const renderContentForMeasurement = () => (
  <Box ref={resumeRef} sx={{ visibility: 'hidden', position: 'absolute', fontFamily: font }}>
    <Container sx={{ 
      width: pageSize === "A4" ? "210mm" : "216mm",
      minHeight: pageSize === "A4" ? "297mm" : "279mm",
      p: sideMargins / 5, 
      backgroundColor: palette.header, 
      boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
      border: `${lineWeight}px solid ${palette.textColor}`,
      my: topBottomMargin / 10,
      fontFamily: font,
      fontSize: fontSize,
      fontStyle: fontStyle,
      lineHeight: `${lineSpacing}px`,
      color: palette.textColor,
    }}>
      {/* Header Section */}
      <Box className="resume-section resume-header" sx={{ 
        p: 4, 
        mb: 4, 
        borderBottom: `${lineWeight}px solid ${palette.textColor}`,
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        backgroundColor: palette.sidebarBackground,
        fontFamily: font,
        color: palette.textColor,
      }}>
        <Box sx={{ fontFamily: font }}>
          <Typography variant="h2" sx={{ 
            fontWeight: 'bold', 
            color: palette.nameColor,
            fontSize: `calc(${headingSize} * 1.8)`,
            fontFamily: font,
            fontStyle: fontStyle,
            lineHeight: `${lineSpacing}px`,
            mb: `${paragraphSpacing / 10}px`
          }}>
            {data.firstName} {data.lastName}
          </Typography>
          <Typography variant="h5" sx={{ 
            color: palette.textColor, 
            mt: 1,
            fontSize: `calc(${headingSize} * 0.8)`,
            fontFamily: font,
            fontStyle: fontStyle,
            lineHeight: `${lineSpacing}px`,
            mb: `${paragraphSpacing / 10}px`
          }}>
            {data.currentPosition}
          </Typography>
        </Box>
        <Box sx={{ textAlign: 'right', fontFamily: font }}>
          <ContactInfo sx={{ fontFamily: font }} color={palette.textColor}>
            <EmailIcon sx={{ color: palette.textColor }} />
            <Typography variant="body2" sx={{ 
              color: palette.textColor,
              fontFamily: font,
              fontStyle: fontStyle,
              fontSize: fontSize,
              lineHeight: `${lineSpacing}px`,
              mb: `${paragraphSpacing / 20}px`
            }}>
              {data.email}
            </Typography>
          </ContactInfo>
          <ContactInfo sx={{ fontFamily: font }} color={palette.textColor}>
            <PhoneIcon sx={{ color: palette.textColor }} />
            <Typography variant="body2" sx={{ 
              color: palette.textColor,
              fontFamily: font,
              fontStyle: fontStyle,
              fontSize: fontSize,
              lineHeight: `${lineSpacing}px`,
              mb: `${paragraphSpacing / 20}px`
            }}>
              {data.phone}
            </Typography>
          </ContactInfo>
          <ContactInfo sx={{ fontFamily: font }} color={palette.textColor}>
            <LocationOnIcon sx={{ color: palette.textColor }} />
            <Typography variant="body2" sx={{ 
              color: palette.textColor,
              fontFamily: font,
              fontStyle: fontStyle,
              fontSize: fontSize,
              lineHeight: `${lineSpacing}px`,
              mb: `${paragraphSpacing / 20}px`
            }}>
              {data.city}
            </Typography>
          </ContactInfo>
        </Box>
      </Box>

      {/* Main Content Grid */}
      <Grid container spacing={4} sx={{ fontFamily: font, color: palette.textColor }}>
        <Grid item xs={12} md={4} sx={{ fontFamily: font }}>
          {/* ✅ FIXED: Render ALL sections in sectionOrder that should be in left column */}
          {sectionOrder
            .filter(sectionId => {
              const leftColumnSections = ['about', 'skills', 'languages', 'certifications', 'softwareSkills', 'interests', 'accomplishments'];
              return leftColumnSections.includes(sectionId) || sectionId.startsWith('custom_');
            })
            .map(sectionId => {
              const sectionContent = renderSectionContent(sectionId);
              console.log(`📝 Measurement - Left Column - ${sectionId}:`, sectionContent ? 'Rendered' : 'Skipped');
              return sectionContent ? (
                <React.Fragment key={sectionId}>
                  {sectionContent}
                </React.Fragment>
              ) : null;
            })}
        </Grid>

        {/* Right Column */}
        <Grid item xs={12} md={8} sx={{ fontFamily: font }}>
          {/* ✅ FIXED: Render ALL sections in sectionOrder that should be in right column */}
          {sectionOrder
            .filter(sectionId => {
              const rightColumnSections = ['experience', 'education', 'additionalInfo', 'volunteering', 'references', 'websites'];
              return rightColumnSections.includes(sectionId);
            })
            .map(sectionId => {
              const sectionContent = renderSectionContent(sectionId);
              console.log(`📝 Measurement - Right Column - ${sectionId}:`, sectionContent ? 'Rendered' : 'Skipped');
              return sectionContent ? (
                <React.Fragment key={sectionId}>
                  {sectionContent}
                </React.Fragment>
              ) : null;
            })}
        </Grid>
      </Grid>
    </Container>
  </Box>
);
       


  return (
    <Box sx={{ width: "100%", position: "relative", fontFamily: font, color: palette.textColor }}>
      {!exporting && (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 2, gap: 2, '@media print': { display: 'none' }, fontFamily: font }}>
          <IconButton onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))} disabled={currentPage === 0} color="primary" sx={{ fontFamily: font }}>
            <ChevronLeft />
          </IconButton>
          <Typography sx={{ mx: 2, fontFamily: font, color: palette.textColor }}>Page {currentPage + 1} of {Math.max(1, pages.length)}</Typography>
          <IconButton onClick={() => setCurrentPage(prev => Math.min(pages.length - 1, prev + 1))} disabled={currentPage === Math.max(0, pages.length - 1)} color="primary" sx={{ fontFamily: font }}>
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
              
              <Button onClick={resetSectionOrder} variant="outlined" color="secondary" size="small">
                Reset Section Order
              </Button>
            </Box>
          )}
        </Box>
      )}
      
      {/* Measurement content (hidden) */}
      {renderContentForMeasurement()}
      
      {/* Actual resume content */}
      <Box id="resume-container" sx={{ fontFamily: font, color: palette.textColor }}>
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
                color: palette.textColor,
                fontFamily: font,
                fontSize,
                fontStyle,
                lineHeight: `${lineSpacing}px`,
                p: `${topBottomMargin}px ${sideMargins}px`,
                display: "flex",
                flexDirection: "column",
                pageBreakAfter: "always",
                border: `${lineWeight}px solid ${palette.textColor}`, // Apply color to border
                "@media print": {
                  width: page.width,
                  height: "auto",
                  minHeight: page.height,
                  boxShadow: "none",
                  m: 0,
                  fontFamily: font,
                  fontSize: fontSize,
                  fontStyle: fontStyle,
                  color: palette.textColor,
                  border: `${lineWeight}px solid ${palette.textColor}`, // Apply color to border for print
                },
                // Show all pages when exporting, only current page when viewing
                display: exporting ? 'block' : (index === currentPage ? 'block' : 'none'),
                '@media print': { display: 'block' }
              }}
            >
              {/* Apply font styles to the HTML content */}
              <div 
                style={{ 
                  fontFamily: font, 
                  fontStyle: fontStyle, 
                  fontSize: fontSize,
                  lineHeight: `${lineSpacing}px`,
                  color: palette.textColor
                }}
                dangerouslySetInnerHTML={{ 
                  __html: addFontStylesToHTML(pageContent.join('')) 
                }} 
              />
            </Box>
          ))
        ) : (
          <Container sx={{ 
            width: pageSize === "A4" ? "210mm" : "216mm",
            minHeight: pageSize === "A4" ? "297mm" : "279mm",
            p: sideMargins / 5, 
            backgroundColor: palette.header, 
            boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
            border: `${lineWeight}px solid ${palette.textColor}`, // Apply color to border
            my: topBottomMargin / 10,
            fontFamily: font,
            fontSize: fontSize,
            fontStyle: fontStyle,
            lineHeight: `${lineSpacing}px`,
            color: palette.textColor,
          }}>
            <Typography sx={{ fontFamily: font, color: palette.textColor }}>Loading resume content...</Typography>
          </Container>
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

// Meta information for the resume
export const resumeMeta = {
  hasPhoto: false,
  columns: 2,
  colorOptions: [
    { value: '#2c3e50', label: 'Dark Blue' },
    { value: '#3498db', label: 'Blue' },
    { value: '#e74c3c', label: 'Red' },
    { value: '#2ecc71', label: 'Green' },
    { value: '#9b59b6', label: 'Purple' },
    { value: '#f39c12', label: 'Orange' }
  ],
  nameColorOptions: [
    { value: '#2c3e50', label: 'Dark Blue' },
    { value: '#34495e', label: 'Dark Gray' },
    { value: '#000000', label: 'Black' },
    { value: '#2c3e50', label: 'Navy' },
    { value: '#c0392b', label: 'Dark Red' }
  ],
  sidebarBackgroundOptions: [
    { value: '#f8f9fa', label: 'Light Gray' },
    { value: '#e6f3f9ff', label: 'Light Blue' },
    { value: '#f0f8e6ff', label: 'Light Green' },
    { value: '#f9e6f3ff', label: 'Light Pink' },
    { value: '#e6e6f9ff', label: 'Light Lavender' },
    { value: '#f9f3e6ff', label: 'Light Beige' }
  ],
  headerBackgroundOptions: [
    { value: '#fff', label: 'White' },
    { value: '#f8f9fa', label: 'Light Gray' },
    { value: '#e3f2fd', label: 'Very Light Blue' },
    { value: '#f3e5f5', label: 'Very Light Purple' },
    { value: '#e8f5e9', label: 'Very Light Green' }
  ],
  experienceLevel: ["No Experience", "Less than 3 years", "3-5 Years"]
};

export default Resume18;