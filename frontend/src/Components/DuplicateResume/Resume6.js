import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Box,
  Typography,
  IconButton,
  Divider,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper
} from "@mui/material";
import { 
  ChevronLeft, 
  ChevronRight, 
  Print, 
  Download, 
  DragIndicator,
  Reorder 
} from "@mui/icons-material";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export const resumeMeta = {
  hasPhoto: false,
  columns: 1,
};

const defaultData = {
  firstName: "Matthew",
  lastName: "Eliot",
currentPosition: "Senior Web Developer",
  phone: "+1 (970) 333-3833",
  email: "matthew.eliot@mail.com",
  city: "New York, NY",
  website: "https://linkedin.com/mattheweliot",
  profile: "Senior Web Developer specializing in front end development. Experienced with all stages of the development cycle for dynamic web projects. Well-versed in numerous programming languages including HTML5, PHP OOP, JavaScript, CSS, MySQL. Strong background in project management and customer relations.",
  skills: [
    { name: "HTML5", rating: 95 },
    { name: "CSS3", rating: 90 },
    { name: "JavaScript", rating: 85 },
    { name: "React", rating: 80 },
    { name: "Node.js", rating: 75 },
    { name: "SQL", rating: 70 },
  ],
  education: [
    {
      degree: "B.S. in Computer Science",
      fieldOfStudy: "Computer Science",
      schoolName: "New York University",
      schoolLocation: "New York, NY",
      gradMonth: "May",
      gradYear: "2015"
    }
  ],
  workExperiences: [
    {
      jobTitle: "Senior Web Developer",
      employer: "Tech Solutions Inc.",
      location: "New York, NY",
      startMonth: "Jan",
      startYear: "2018",
      endMonth: "Dec",
      endYear: "2023",
      current: false,
      description: "• Led a team of 5 developers on a major e-commerce platform redesign.\n• Implemented new features and optimized existing code, reducing page load times by 30%."
    },
    {
      jobTitle: "Web Developer",
      employer: "Digital Innovations Co.",
      location: "New York, NY",
      startMonth: "Jun",
      startYear: "2015",
      endMonth: "Dec",
      endYear: "2017",
      current: false,
      description: "• Developed and maintained client websites using HTML, CSS, and JavaScript.\n• Collaborated with designers to create user-friendly interfaces."
    }
  ],
  certifications: [
    { name: "Certified Web Professional", provider: "W3Schools", year: "2019" }
  ]
};

const pageSizeMap = {
  A4: { width: "210mm", height: "297mm" },
  Letter: { width: "216mm", height: "279mm" },
  Legal: { width: "216mm", height: "356mm" },
  A3: { width: "297mm", height: "420mm" },
  Executive: { width: "184mm", height: "267mm" },
};

// Define default section order for Resume6
const defaultSectionOrder = [
  'summary',
  'skills', 
  'experience',
  'education',
  'certifications',
  'languages',
  'accomplishments',
  'additionalInfo',
  'softwareSkills',
  'volunteering',
  'interests',
  'websites',
  'references'
];

const ResumeMatthew = ({
  theme = "#1a2b47",
  color = "#1a2b47",
  font = "Arial",
  fontSize = "14px",
  fontStyle = "normal",
  headingSize = "20px",
  sectionSpacing = 30,
  paragraphSpacing = 12,
  lineSpacing = 22,
  topBottomMargin = 30,
  sideMargins = 30,
  paragraphIndent = 0,
  lineWeight = 1,
  pageSize = "A4",
  formData = {},
  exporting = false,
  enableDragDrop = true,
}) => {
  const page = pageSizeMap[pageSize] || pageSizeMap.A4;
  const data = { ...defaultData, ...formData };
  const [themeColor, setThemeColor] = useState(color || theme);
  const [currentPage, setCurrentPage] = useState(0);
  const [pages, setPages] = useState([]);
  const resumeRef = useRef(null);

  const [savedSummary, setSavedSummary] = useState(data.profile);
  const [savedSkills, setSavedSkills] = useState(data.skills);
  const [educationEntries, setEducationEntries] = useState(data.education);
  const [workExperiences, setWorkExperiences] = useState(data.workExperiences);
  const [savedCertifications, setSavedCertifications] = useState(data.certifications);
  const [savedLanguages, setSavedLanguages] = useState([]);
  const [savedAccomplishments, setSavedAccomplishments] = useState([]);
  const [savedAdditionalInfo, setSavedAdditionalInfo] = useState([]);
  const [savedSoftware, setSavedSoftware] = useState([]);
  const [savedReferences, setSavedReferences] = useState([]);
  const [savedVolunteering, setSavedVolunteering] = useState([]);
  const [savedInterests, setSavedInterests] = useState([]);
  const [savedWebsites, setSavedWebsites] = useState([]);
  const [customSections, setCustomSections] = useState({});

  // State for section ordering - single array for all sections
  const [sectionOrder, setSectionOrder] = useState(defaultSectionOrder);
  const [dragOverIndex, setDragOverIndex] = useState(null);
  
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

  useEffect(() => {
    setThemeColor(color || theme);
    const storedSummaries = JSON.parse(localStorage.getItem("summaries")) || [];
    if (storedSummaries.length > 0) {
      setSavedSummary(storedSummaries[storedSummaries.length - 1]);
    }
    const storedEntries = localStorage.getItem("educationEntries");
    if (storedEntries) {
      setEducationEntries(JSON.parse(storedEntries));
    }
    const storedSkills = localStorage.getItem("skills");
    if (storedSkills) {
      setSavedSkills(JSON.parse(storedSkills));
    }
    const storedWorkExperiences = JSON.parse(localStorage.getItem("workExperiences")) || [];
    setWorkExperiences(storedWorkExperiences);
    const websites = JSON.parse(localStorage.getItem("websites")) || [];
    setSavedWebsites(websites);
    const certifications = JSON.parse(localStorage.getItem("certificationsList")) || [];
    setSavedCertifications(certifications);
    const languages = JSON.parse(localStorage.getItem("languagesList")) || [];
    setSavedLanguages(languages);
    const accomplishments = JSON.parse(localStorage.getItem("accomplishmentsList")) || [];
    setSavedAccomplishments(accomplishments);
    const additionalInfo = JSON.parse(localStorage.getItem("additionalInfo")) || [];
    setSavedAdditionalInfo(additionalInfo);
    const software = JSON.parse(localStorage.getItem("softwareSkills")) || [];
    setSavedSoftware(software);
    const references = JSON.parse(localStorage.getItem("referencesList")) || [];
    setSavedReferences(references);
    const volunteering = JSON.parse(localStorage.getItem("volunteering")) || [];
    setSavedVolunteering(volunteering);
    const interests = JSON.parse(localStorage.getItem("interests")) || [];
    setSavedInterests(interests);
    

  // Analyze all custom sections
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

  // Load saved section order for ResumeMatthew
  const savedSectionOrder = localStorage.getItem("resumeMatthewSectionOrder");
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
}, [color, theme]);

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
      localStorage.setItem("resumeMatthewSectionOrder", JSON.stringify(newOrder));
      console.log('📝 Final section order with ONLY CURRENT custom sections:', newOrder);
    }
  } else if (userId && Object.keys(customSections).length === 0) {
    // If no current custom sections, remove all custom sections
    const currentOrder = [...sectionOrder];
    const filteredOrder = currentOrder.filter(section => !section.startsWith('custom_'));
    
    if (filteredOrder.length !== currentOrder.length) {
      setSectionOrder(filteredOrder);
      localStorage.setItem("resumeMatthewSectionOrder", JSON.stringify(filteredOrder));
      console.log('🗑️ Removed all custom sections (no current sections)');
    }
  }
}, [customSections]);
  // Save section order to localStorage whenever it changes
  useEffect(() => {
    if (sectionOrder.length > 0) {
      localStorage.setItem("resumeMatthewSectionOrder", JSON.stringify(sectionOrder));
    }
  }, [sectionOrder]);

  const formatDate = (month, year) => {
    if (!month || !year) return "";
    return `${month} ${year}`;
  };

  const getPageWidth = () => page.width;
  const getPageHeight = () => page.height;

  const sectionTitleStyle = {
    color: themeColor,
    fontWeight: "bold",
    fontSize: headingSize,
    marginTop: `${sectionSpacing}px`,
    marginBottom: "8px",
    fontFamily: font,
    fontStyle: fontStyle,
  };

  const paragraphStyle = {
    marginTop: `${paragraphSpacing}px`,
    textIndent: `${paragraphIndent}px`,
    fontFamily: font,
    fontSize: fontSize,
    fontStyle: fontStyle,
    lineHeight: `${lineSpacing}px`,
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
      'summary': 'Summary',
      'skills': 'Skill Highlights',
      'experience': 'Experience',
      'education': 'Education',
      'certifications': 'Certifications',
      'languages': 'Languages',
      'accomplishments': 'Accomplishments',
      'additionalInfo': 'Additional Information',
      'softwareSkills': 'Software Skills',
      'volunteering': 'Volunteering',
      'interests': 'Interests',
      'websites': 'Websites & Profiles',
      'references': 'References'
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
      case 'summary':
        return (
          <Box sx={{ mt: `${sectionSpacing}px` }} className="resume-section" id="summary-section">
            <Typography sx={{...sectionTitleStyle, ...globalFontStyle}}>Summary</Typography>
            <Typography variant="body2" sx={paragraphStyle}>
              {savedSummary}
            </Typography>
          </Box>
        );
      
      case 'skills':
        return savedSkills.length > 0 ? (
          <Box className="resume-section" id="skills-section">
            <Typography sx={{...sectionTitleStyle, ...globalFontStyle}}>Skill Highlights</Typography>
            <Grid container spacing={1}>
              {savedSkills.map((skill, index) => (
                <Grid item xs={6} key={index}>
                  <Typography variant="body2" sx={getTextStyle()}>• {skill.name} {skill.rating && `(${skill.rating}%)`}</Typography>
                </Grid>
              ))}
            </Grid>
          </Box>
        ) : null;
      
      case 'experience':
        return workExperiences.length > 0 ? (
          <Box className="resume-section" id="experience-section">
            <Typography sx={{...sectionTitleStyle, ...globalFontStyle}}>Experience</Typography>
            {workExperiences.map((work, index) => (
              <Box key={index} sx={{ mt: `${paragraphSpacing}px` }}>
                <Typography fontWeight="bold" variant="body2" sx={getTextStyle()}>
                  {work.jobTitle} – {formatDate(work.startMonth, work.startYear)} to{" "}
                  {work.current ? "Present" : formatDate(work.endMonth, work.endYear)}
                </Typography>
                <Typography variant="body2" sx={{ fontStyle: "italic", ...globalFontStyle }}>
                  {work.employer}, {work.location}
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
          </Box>
        ) : null;
      
      case 'education':
        return educationEntries.length > 0 ? (
          <Box className="resume-section" id="education-section">
            <Typography sx={{...sectionTitleStyle, ...globalFontStyle}}>Education</Typography>
            {educationEntries.map((edu, index) => (
              <Box key={index} sx={{ mt: `${paragraphSpacing}px` }}>
                <Typography variant="body2" fontWeight="bold" sx={getTextStyle()}>
                  {edu.degree} {edu.fieldOfStudy && `- ${edu.fieldOfStudy}`}
                </Typography>
                <Typography variant="body2" sx={getTextStyle()}>
                  {edu.schoolName}, {edu.schoolLocation}
                </Typography>
                <Typography variant="body2" sx={{ fontStyle: "italic", ...globalFontStyle }}>
                  {formatDate(edu.gradMonth, edu.gradYear)}
                </Typography>
                {edu.additionalCoursework && (
                  <Typography variant="body2" sx={getTextStyle()}>
                    {edu.additionalCoursework}
                  </Typography>
                )}
              </Box>
            ))}
          </Box>
        ) : null;
      
      case 'certifications':
        return savedCertifications.length > 0 ? (
          <Box className="resume-section" id="certifications-section">
            <Typography sx={{...sectionTitleStyle, ...globalFontStyle}}>Certifications</Typography>
            {savedCertifications.map((cert, index) => (
              <Typography key={index} variant="body2" sx={paragraphStyle}>
                {cert.name} – {cert.provider} ({cert.year})
              </Typography>
            ))}
          </Box>
        ) : null;
      
      case 'languages':
        return savedLanguages.length > 0 ? (
          <Box className="resume-section" id="languages-section">
            <Typography sx={{...sectionTitleStyle, ...globalFontStyle}}>Languages</Typography>
            {savedLanguages.map((lang, index) => (
              <Typography key={index} variant="body2" sx={paragraphStyle}>
                {lang.name} {lang.level ? `– ${lang.level}` : ""}
              </Typography>
            ))}
          </Box>
        ) : null;
      
      case 'accomplishments':
        return savedAccomplishments.length > 0 ? (
          <Box className="resume-section" id="accomplishments-section">
            <Typography sx={{...sectionTitleStyle, ...globalFontStyle}}>Accomplishments</Typography>
            {savedAccomplishments.map((acc, index) => (
              <Typography key={index} variant="body2" sx={paragraphStyle}>
                • {acc}
              </Typography>
            ))}
          </Box>
        ) : null;
      
      case 'additionalInfo':
        return savedAdditionalInfo.length > 0 ? (
          <Box className="resume-section" id="additional-info-section">
            <Typography sx={{...sectionTitleStyle, ...globalFontStyle}}>Additional Information</Typography>
            {savedAdditionalInfo.map((info, index) => (
              <Typography key={index} variant="body2" sx={paragraphStyle}>
                • {info}
              </Typography>
            ))}
          </Box>
        ) : null;
      
      case 'softwareSkills':
        return savedSoftware.length > 0 ? (
          <Box className="resume-section" id="software-skills-section">
            <Typography sx={{...sectionTitleStyle, ...globalFontStyle}}>Software Skills</Typography>
            {savedSoftware.map((software, index) => (
              <Typography key={index} variant="body2" sx={paragraphStyle}>
                {software.name} – {software.level}%
              </Typography>
            ))}
          </Box>
        ) : null;
      
      case 'volunteering':
        return savedVolunteering.length > 0 ? (
          <Box className="resume-section" id="volunteering-section">
            <Typography sx={{...sectionTitleStyle, ...globalFontStyle}}>Volunteering</Typography>
            {savedVolunteering.map((vol, index) => (
              <Box key={index} sx={{ mb: 2 }}>
                <Typography variant="body2" fontWeight="bold" sx={getTextStyle()}>
                  {vol.subtopic}
                </Typography>
                <Typography variant="body2" sx={{ fontStyle: "italic", ...globalFontStyle }}>
                  {vol.fromDate} - {vol.toDate}
                </Typography>
                <Typography variant="body2" sx={paragraphStyle}>
                  {vol.content}
                </Typography>
              </Box>
            ))}
          </Box>
        ) : null;
      
      case 'interests':
        return savedInterests.length > 0 ? (
          <Box className="resume-section" id="interests-section">
            <Typography sx={{...sectionTitleStyle, ...globalFontStyle}}>Interests</Typography>
            {savedInterests.map((interest, index) => (
              <Typography key={index} variant="body2" sx={paragraphStyle}>
                • {interest}
              </Typography>
            ))}
          </Box>
        ) : null;
      
      case 'websites':
        return savedWebsites.length > 0 ? (
          <Box className="resume-section" id="websites-section">
            <Typography sx={{...sectionTitleStyle, ...globalFontStyle}}>Websites & Profiles</Typography>
            {savedWebsites.map((site, index) => (
              <Typography key={index} variant="body2" sx={paragraphStyle}>
                {site.url}
              </Typography>
            ))}
          </Box>
        ) : null;
      
      case 'references':
        return savedReferences.length > 0 ? (
          <Box className="resume-section" id="references-section">
            <Typography sx={{...sectionTitleStyle, ...globalFontStyle}}>References</Typography>
            {savedReferences.map((ref, index) => (
              <Typography key={index} variant="body2" sx={paragraphStyle}>
                • {ref}
              </Typography>
            ))}
          </Box>
        ) : null;
      
     default:
  // Handle ALL custom sections for the user
  if (sectionId && sectionId.startsWith('custom_')) {
    const customSectionName = sectionId.replace('custom_', '');
    const items = customSections[customSectionName] || [];
    
    console.log(`🎯 Rendering custom section: ${customSectionName}`, items);
    
    // Filter out empty items
    const validItems = items.filter(item => item && item.trim() !== '');
    
    if (validItems.length > 0) {
      return (
        <Box className="resume-section" id={`custom-${customSectionName}-section`}>
          <Typography sx={{...sectionTitleStyle, ...globalFontStyle}}>
            {customSectionName.replace(/_/g, ' ').toUpperCase()}
          </Typography>
          {validItems.map((item, i) => (
            <Typography key={i} variant="body2" sx={paragraphStyle}>
              • {item}
            </Typography>
          ))}
        </Box>
      );
    } else {
      console.log(`⚠️ No valid items in custom section: ${customSectionName}`);
      return null;
    }
  }
  return null;}}

  // Save download history function
  const saveDownloadHistory = async (format, fileName, fileSize) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const downloadData = {
        templateId: 6, // ResumeMatthew template ID
        fileName: fileName,
        fileFormat: format,
        fileSize: fileSize,
        themeColor: themeColor,
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

  const splitContentIntoPages = useCallback(() => {
    if (!resumeRef.current) return;

    const sections = Array.from(resumeRef.current.querySelectorAll('.resume-section'));
    const headerHeight = resumeRef.current.querySelector('.resume-header').offsetHeight;
    const pageHeightInPx = parseFloat(page.height.replace('mm', '')) * 3.78;
    const availableHeightFirstPage = pageHeightInPx - headerHeight - (2 * topBottomMargin);
    const availableHeightSubsequent = pageHeightInPx - (2 * topBottomMargin);

    let newPages = [];
    let currentPageSections = [];
    let currentHeight = 0;

    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const pageLimit = newPages.length === 0 ? availableHeightFirstPage : availableHeightSubsequent;

      if (currentHeight + sectionHeight > pageLimit) {
        newPages.push(currentPageSections);
        currentPageSections = [section.outerHTML];
        currentHeight = sectionHeight;
      } else {
        currentPageSections.push(section.outerHTML);
        currentHeight += sectionHeight;
      }
    });

    if (currentPageSections.length > 0) {
      newPages.push(currentPageSections);
    }
    setPages(newPages);
  }, [page.height, topBottomMargin, workExperiences, educationEntries, savedSkills, savedSummary, savedAdditionalInfo, savedLanguages, savedAccomplishments, savedCertifications, savedReferences, savedSoftware, savedVolunteering, savedInterests, savedWebsites, customSections, sectionOrder]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      splitContentIntoPages();
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [splitContentIntoPages]);

  const renderContentForMeasurement = () => (
    <Box ref={resumeRef} sx={{ visibility: 'hidden', position: 'absolute', ...globalFontStyle }}>
      <Box sx={{ width: getPageWidth(), p: 0, ...globalFontStyle }}>
        <Box className="resume-header"
          sx={{
            bgcolor: themeColor,
            color: "#fff",
            p: 3,
            textAlign: "center",
            ...globalFontStyle
          }}
        >
          <Typography variant="body1" sx={getTextStyle()}>{data.phone}</Typography>
          <Typography variant="body1" sx={getTextStyle()}>{data.email}</Typography>
          <Typography variant="body1" sx={getTextStyle()}>{data.website}</Typography>
          <Typography variant="h4" fontWeight="bold" mt={1} sx={getTextStyle({ fontSize: "2rem" })}>
            {data.firstName.toUpperCase()} {data.lastName.toUpperCase()}
          </Typography>
          <Typography variant="h6" mt={1} sx={getTextStyle({ fontSize: "1.2rem" })}>
            {data.currentPosition}
          </Typography>
        </Box>

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
    <Box sx={{ width: "100%", position: "relative" }}>
      {!exporting && (
        <Box sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          mb: 2,
          gap: 2,
          '@media print': { display: 'none' }
        }}>
          <IconButton onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))} disabled={currentPage === 0} color="primary">
            <ChevronLeft />
          </IconButton>
          <Typography sx={{ mx: 2 }}>
            Page {currentPage + 1} of {Math.max(1, pages.length)}
          </Typography>
          <IconButton onClick={() => setCurrentPage(prev => Math.min(pages.length - 1, prev + 1))} disabled={currentPage === Math.max(0, pages.length - 1)} color="primary">
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
      
      {renderContentForMeasurement()}

      <Box id="resume-container">
        {pages.length > 0 ? (
          pages.map((pageContent, index) => (
            <Box
              key={index}
              className="resume-page"
              sx={{
                width: getPageWidth(),
                minHeight: getPageHeight(),
                mx: "auto",
                boxShadow: index === currentPage ? 3 : 0,
                bgcolor: "#fff",
                color: "#000",
                fontFamily: font,
                fontSize,
                fontStyle,
                lineHeight: `${lineSpacing}px`,
                p: `${topBottomMargin}px ${sideMargins}px`,
                pageBreakAfter: "always",
                // Show all pages when exporting, only current page when viewing
                display: exporting ? 'block' : (index === currentPage ? 'block' : 'none'),
                '@media print': { display: 'block' },
              }}
            >
              {index === 0 && (
                <Box className="resume-header"
                  sx={{
                    bgcolor: themeColor,
                    color: "#fff",
                    p: 3,
                    textAlign: "center",
                    "@media print": {
                      bgcolor: themeColor,
                      color: "#fff",
                      WebkitPrintColorAdjust: "exact",
                      printColorAdjust: "exact",
                    },
                    ...globalFontStyle
                  }}
                >
                  <Typography variant="body1" sx={getTextStyle()}>{data.phone}</Typography>
                  <Typography variant="body1" sx={getTextStyle()}>{data.email}</Typography>
                  <Typography variant="body1" sx={getTextStyle()}>{data.website}</Typography>
                  <Typography variant="h4" fontWeight="bold" mt={1} sx={getTextStyle({ fontSize: "2rem" })}>
                    {data.firstName.toUpperCase()} {data.lastName.toUpperCase()}
                  </Typography>
                  <Typography variant="h6" mt={1} sx={getTextStyle({ fontSize: "1.2rem" })}>
                    {data.currentPosition}
                  </Typography>
                </Box>
              )}
              <div 
                style={globalFontStyle}
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
              width: getPageWidth(),
              minHeight: getPageHeight(),
              mx: "auto",
              boxShadow: 3,
              bgcolor: "#fff",
              color: "#000",
              fontFamily: font,
              fontSize,
              fontStyle,
              lineHeight: `${lineSpacing}px`,
              p: `${topBottomMargin}px ${sideMargins}px`,
            }}
          >
            <Typography sx={{ p: 2, ...globalFontStyle }}>Loading resume...</Typography>
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

export default ResumeMatthew;