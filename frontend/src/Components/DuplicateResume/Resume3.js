import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  Box,
  Grid,
  Typography,
  Avatar,
  Divider,
  IconButton,
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
  DragIndicator,
  Reorder
} from "@mui/icons-material";
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
  currentPosition: "Software Engineer",
  phone: "+91 98765 43210",
  email: "john.doe@email.com",
  city: "Chennai, India",
  website: "www.johndoe.com",
  profile:
    "Experienced software engineer with a strong background in full-stack development, cloud solutions, and problem solving.",
  skills: [
    "React, Node.js, MongoDB",
    "Java, Spring Boot",
    "AWS, Docker",
    "Problem Solving",
  ],
};

// Define default section order (all sections in single array)
const defaultSectionOrder = [
  'profile',
  'skills', 
  'education',
  'experience',
  'projects',
  'languages',
  'certifications',
  'accomplishments',
  'softwareSkills',
  'volunteering',
  'interests',
  'websites',
  'references',
  'additionalInfo'
];

const Resume3 = ({
  color = "#1a2b47",
  font = "Arial",
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
  const resumeRef = useRef(null);

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

  // State for section ordering - single array for all sections
  const [sectionOrder, setSectionOrder] = useState(defaultSectionOrder);
  const [dragOverIndex, setDragOverIndex] = useState(null);
  
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
    
  

  
 const userId = localStorage.getItem("userId");
  console.log("👤 Current userId:", userId);
  
  let sectionsData = {};

  if (userId) {
    // Get the CURRENT custom sections from ExtraSections page state
    // We'll store them in localStorage temporarily for Resume3 to access
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

  // Load saved section order for Resume3
  const savedSectionOrder = localStorage.getItem("resume3SectionOrder");
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
      localStorage.setItem("resume3SectionOrder", JSON.stringify(newOrder));
      console.log('📝 Final section order with ONLY CURRENT custom sections:', newOrder);
    }
  } else if (userId && Object.keys(customSections).length === 0) {
    // If no current custom sections, remove all custom sections
    const currentOrder = [...sectionOrder];
    const filteredOrder = currentOrder.filter(section => !section.startsWith('custom_'));
    
    if (filteredOrder.length !== currentOrder.length) {
      setSectionOrder(filteredOrder);
      localStorage.setItem("resume3SectionOrder", JSON.stringify(filteredOrder));
      console.log('🗑️ Removed all custom sections (no current sections)');
    }
  }
}, [customSections]);

  // Save section order to localStorage whenever it changes
  useEffect(() => {
    if (sectionOrder.length > 0) {
      localStorage.setItem("resume3SectionOrder", JSON.stringify(sectionOrder));
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
      'profile': 'Profile',
      'skills': 'Skills',
      'education': 'Education',
      'experience': 'Work Experience',
      'projects': 'Projects',
      'languages': 'Languages',
      'certifications': 'Certifications',
      'accomplishments': 'Accomplishments',
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

  // Common text style with color applied
  const textStyle = {
    color: color,
    fontFamily: font,
    fontSize: fontSize,
    fontStyle: fontStyle,
    lineHeight: `${lineSpacing}px`
  };

  const renderSectionContent = (sectionId) => {
    switch (sectionId) {
      case 'profile':
        return (
          <Box 
            mb={`${sectionSpacing}px`} 
            className="resume-section" 
            id="profile-section" 
            sx={{ 
              fontFamily: font,
              ...textStyle
            }}
          >
            <Typography sx={{ 
              fontSize: headingSize, 
              fontWeight: "bold", 
              color, 
              fontFamily: font,
              mb: `${paragraphSpacing}px`
            }}>
              Profile
            </Typography>
            <Typography sx={{ 
              mt: `${paragraphSpacing / 4}px`, 
              textIndent: `${paragraphIndent}px`, 
              fontFamily: font,
              color: color,
              lineHeight: `${lineSpacing}px`
            }}>
              {savedSummary || data.profile}
            </Typography>
          </Box>
        );
      
      case 'skills':
        return (
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
              color, 
              fontFamily: font,
              mb: `${paragraphSpacing}px`
            }}>
              Skills
            </Typography>
            <ul style={{ 
              paddingLeft: "20px", 
              marginTop: 4, 
              fontFamily: font, 
              listStyleType: "none",
              color: color,
              lineHeight: `${lineSpacing}px`
            }}>
              {savedSkills.length > 0 ? (
                savedSkills.map((skill, i) => (
                  <li key={i} style={{ 
                    fontFamily: font, 
                    marginBottom: `${paragraphSpacing / 2}px`, 
                    color: color,
                    lineHeight: `${lineSpacing}px`
                  }}>
                    {skill.name} {skill.rating ? `(${skill.rating}%)` : ''}
                  </li>
                ))
              ) : (
                data.skills.map((skill, i) => (
                  <li key={i} style={{ 
                    fontFamily: font, 
                    marginBottom: `${paragraphSpacing / 2}px`, 
                    color: color,
                    lineHeight: `${lineSpacing}px`
                  }}>
                    {skill}
                  </li>
                ))
              )}
            </ul>
          </Box>
        );
      
      case 'education':
        return (
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
              color, 
              fontFamily: font,
              mb: `${paragraphSpacing}px`
            }}>
              Education
            </Typography>
            {educationEntries.length > 0 ? (
              educationEntries.map((edu) => (
                <Box key={edu.id} sx={{ 
                  mb: `${paragraphSpacing}px`, 
                  fontFamily: font 
                }}>
                  <Typography variant="subtitle2" fontWeight="bold" sx={{ 
                    fontFamily: font, 
                    color: color,
                    lineHeight: `${lineSpacing}px`
                  }}>
                    {edu.degree} - {edu.fieldOfStudy}
                  </Typography>
                  <Typography variant="body2" sx={{ 
                    fontFamily: font, 
                    color: color,
                    lineHeight: `${lineSpacing}px`
                  }}>
                    {edu.schoolName}, {edu.schoolLocation}
                  </Typography>
                  <Typography variant="body2" fontStyle="italic" sx={{ 
                    fontFamily: font, 
                    color: color,
                    lineHeight: `${lineSpacing}px`
                  }}>
                    {formatDate(edu.gradMonth, edu.gradYear)}
                  </Typography>
                  {edu.additionalCoursework && (
                    <Typography variant="body2" sx={{ 
                      fontFamily: font, 
                      color: color,
                      lineHeight: `${lineSpacing}px`
                    }}>
                      {edu.additionalCoursework}
                    </Typography>
                  )}
                </Box>
              ))
            ) : (
              <>
                <Typography variant="subtitle2" sx={{ 
                  fontFamily: font, 
                  color: color,
                  lineHeight: `${lineSpacing}px`
                }}>
                  B.Tech in CSE
                </Typography>
                <Typography variant="body2" sx={{ 
                  fontFamily: font, 
                  color: color,
                  lineHeight: `${lineSpacing}px`
                }}>
                  XYZ University, 2014 - 2018
                </Typography>
              </>
            )}
          </Box>
        );
      
      case 'experience':
        return (
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
              color, 
              fontFamily: font,
              mb: `${paragraphSpacing}px`
            }}>
              Experience
            </Typography>
            {workExperiences && workExperiences.length > 0 ? (
              workExperiences.map((work, i) => (
                <Box key={i} mb={`${paragraphSpacing}px`} sx={{ fontFamily: font }}>
                  <Typography variant="subtitle1" fontWeight="bold" sx={{ 
                    fontFamily: font, 
                    color: color,
                    lineHeight: `${lineSpacing}px`
                  }}>
                    {work.jobTitle}
                  </Typography>
                  <Typography variant="body2" sx={{ 
                    fontFamily: font, 
                    color: color,
                    lineHeight: `${lineSpacing}px`
                  }}>
                    {work.employer} | {formatDate(work.startMonth, work.startYear)} - {work.current ? "Present" : formatDate(work.endMonth, work.endYear)}
                  </Typography>
                  {work.description && (
                    <Box
                      sx={{ 
                        mt: 1, 
                        fontFamily: font, 
                        color: color,
                        lineHeight: `${lineSpacing}px`
                      }}
                      dangerouslySetInnerHTML={{
                        __html: work.description
                          .replace(/\*\*(.*?)\*\*/g, `<strong style="font-family:${font}; color:${color}; line-height:${lineSpacing}px">$1</strong>`)
                          .replace(/\*(.*?)\*/g, `<em style="font-family:${font}; color:${color}; line-height:${lineSpacing}px">$1</em>`)
                          .replace(/<u>(.*?)<\/u>/g, `<u style="font-family:${font}; color:${color}; line-height:${lineSpacing}px">$1</u>`)
                          .replace(/\n/g, `<br style="font-family:${font}; color:${color}; line-height:${lineSpacing}px"/>`),
                      }}
                    />
                  )}
                </Box>
              ))
            ) : (
              <>
                <Box mb={`${paragraphSpacing}px`} sx={{ fontFamily: font }}>
                  <Typography variant="subtitle1" fontWeight="bold" sx={{ 
                    fontFamily: font, 
                    color: color,
                    lineHeight: `${lineSpacing}px`
                  }}>
                    Senior Software Engineer
                  </Typography>
                  <Typography variant="body2" sx={{ 
                    fontFamily: font, 
                    color: color,
                    lineHeight: `${lineSpacing}px`
                  }}>
                    ABC Tech | 2020 - Present
                  </Typography>
                  <Typography variant="body2" sx={{ 
                    fontFamily: font, 
                    color: color,
                    lineHeight: `${lineSpacing}px`
                  }}>
                    Leading a team of developers building scalable web applications.
                  </Typography>
                </Box>
                <Box mb={`${paragraphSpacing}px`} sx={{ fontFamily: font }}>
                  <Typography variant="subtitle1" fontWeight="bold" sx={{ 
                    fontFamily: font, 
                    color: color,
                    lineHeight: `${lineSpacing}px`
                  }}>
                    Software Developer
                  </Typography>
                  <Typography variant="body2" sx={{ 
                    fontFamily: font, 
                    color: color,
                    lineHeight: `${lineSpacing}px`
                  }}>
                    XYZ Solutions | 2018 - 2020
                  </Typography>
                  <Typography variant="body2" sx={{ 
                    fontFamily: font, 
                    color: color,
                    lineHeight: `${lineSpacing}px`
                  }}>
                    Worked on REST APIs and frontend dashboards for enterprise apps.
                  </Typography>
                </Box>
              </>
            )}
          </Box>
        );
      
      case 'projects':
        return (
          <Box 
            mb={`${sectionSpacing}px`} 
            className="resume-section" 
            id="projects-section" 
            sx={{ 
              fontFamily: font,
              ...textStyle
            }}
          >
            <Typography sx={{ 
              fontSize: headingSize, 
              fontWeight: "bold", 
              color, 
              fontFamily: font,
              mb: `${paragraphSpacing}px`
            }}>
              Projects
            </Typography>
            <ul style={{ 
              paddingLeft: "20px", 
              marginTop: 4, 
              fontFamily: font, 
              listStyleType: "none",
              color: color,
              lineHeight: `${lineSpacing}px`
            }}>
              <li style={{ 
                fontFamily: font, 
                marginBottom: `${paragraphSpacing / 2}px`, 
                color: color,
                lineHeight: `${lineSpacing}px`
              }}>
                E-commerce Platform with MERN stack
              </li>
              <li style={{ 
                fontFamily: font, 
                marginBottom: `${paragraphSpacing / 2}px`, 
                color: color,
                lineHeight: `${lineSpacing}px`
              }}>
                AI-based Resume Screener
              </li>
              <li style={{ 
                fontFamily: font, 
                marginBottom: `${paragraphSpacing / 2}px`, 
                color: color,
                lineHeight: `${lineSpacing}px`
              }}>
                Hospital Management System
              </li>
            </ul>
          </Box>
        );
      
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
              color, 
              fontFamily: font,
              mb: `${paragraphSpacing}px`
            }}>
              Languages
            </Typography>
            {savedLanguages.map((lang, index) => (
              <Typography key={index} sx={{ 
                mb: `${paragraphSpacing / 2}px`, 
                fontSize: fontSize, 
                fontFamily: font,
                color: color,
                lineHeight: `${lineSpacing}px`
              }}>
                {lang.name} {lang.level ? `– ${lang.level}` : ""}
              </Typography>
            ))}
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
              color, 
              fontFamily: font,
              mb: `${paragraphSpacing}px`
            }}>
              Certifications
            </Typography>
            {savedCertifications.map((cert, index) => (
              <Typography key={index} sx={{ 
                mb: `${paragraphSpacing / 2}px`, 
                fontSize: fontSize, 
                fontFamily: font,
                color: color,
                lineHeight: `${lineSpacing}px`
              }}>
                {cert.name} – {cert.provider} ({cert.year})
              </Typography>
            ))}
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
              color, 
              fontFamily: font,
              mb: `${paragraphSpacing}px`
            }}>
              Accomplishments
            </Typography>
            {savedAccomplishments.map((acc, index) => (
              <Typography key={index} sx={{ 
                mb: `${paragraphSpacing / 2}px`, 
                fontSize: fontSize, 
                fontFamily: font,
                color: color,
                lineHeight: `${lineSpacing}px`
              }} whiteSpace="pre-line">
                {acc}
              </Typography>
            ))}
          </Box>
        ) : null;
      
      case 'softwareSkills':
        return softwareSkills.length > 0 ? (
          <Box 
            mb={`${sectionSpacing}px`} 
            className="resume-section" 
            id="software-skills-section" 
            sx={{ 
              fontFamily: font,
              ...textStyle
            }}
          >
            <Typography sx={{ 
              fontSize: headingSize, 
              fontWeight: "bold", 
              color, 
              fontFamily: font,
              mb: `${paragraphSpacing}px`
            }}>
              Software Skills
            </Typography>
            {softwareSkills.map((skill, index) => (
              <Typography key={index} sx={{ 
                mb: `${paragraphSpacing / 2}px`, 
                fontSize: fontSize, 
                fontFamily: font,
                color: color,
                lineHeight: `${lineSpacing}px`
              }}>
                {skill.name} — {skill.level}%
              </Typography>
            ))}
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
              color, 
              fontFamily: font,
              mb: `${paragraphSpacing}px`
            }}>
              Volunteering
            </Typography>
            {savedVolunteering.map((vol, index) => (
              <Box key={index} sx={{ mb: `${paragraphSpacing}px` }}>
                <Typography sx={{ 
                  fontSize: fontSize, 
                  fontWeight: "bold", 
                  fontFamily: font, 
                  color: color,
                  lineHeight: `${lineSpacing}px`
                }}>
                  {vol.subtopic}
                </Typography>
                <Typography sx={{ 
                  fontSize: fontSize, 
                  color: color, 
                  fontFamily: font,
                  lineHeight: `${lineSpacing}px`
                }}>
                  {vol.fromDate} - {vol.toDate}
                </Typography>
                <Typography sx={{ 
                  fontSize: fontSize, 
                  whiteSpace: "pre-line", 
                  mt: 0.5, 
                  fontFamily: font, 
                  color: color,
                  lineHeight: `${lineSpacing}px`
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
              color, 
              fontFamily: font,
              mb: `${paragraphSpacing}px`
            }}>
              Interests
            </Typography>
            {savedInterests.map((interest, index) => (
              <Typography key={index} sx={{ 
                mb: `${paragraphSpacing / 2}px`, 
                fontSize: fontSize, 
                fontFamily: font,
                color: color,
                lineHeight: `${lineSpacing}px`
              }}>
                • {interest}
              </Typography>
            ))}
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
              color, 
              fontFamily: font,
              mb: `${paragraphSpacing}px`
            }}>
              Websites / Profiles
            </Typography>
            {savedWebsites.map((site, index) => (
              <Typography key={index} sx={{ 
                mb: `${paragraphSpacing / 2}px`, 
                fontSize: fontSize, 
                fontFamily: font,
                color: color,
                lineHeight: `${lineSpacing}px`
              }}>
                {site.url} {site.addToHeader ? "(Shown in Header)" : ""}
              </Typography>
            ))}
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
              color, 
              fontFamily: font,
              mb: `${paragraphSpacing}px`
            }}>
              References
            </Typography>
            {savedReferences.map((ref, index) => (
              <Typography key={index} sx={{ 
                mb: `${paragraphSpacing / 2}px`, 
                fontSize: fontSize, 
                fontFamily: font,
                color: color,
                lineHeight: `${lineSpacing}px`
              }} whiteSpace="pre-line">
                {ref}
              </Typography>
            ))}
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
              color, 
              fontFamily: font,
              mb: `${paragraphSpacing}px`
            }}>
              Additional Information
            </Typography>
            {savedAdditionalInfo.map((info, index) => (
              <Typography key={index} sx={{ 
                mb: `${paragraphSpacing / 2}px`, 
                fontSize: fontSize, 
                fontFamily: font,
                color: color,
                lineHeight: `${lineSpacing}px`
              }}>
                {info}
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
            color, 
            fontFamily: font,
            mb: `${paragraphSpacing}px`
          }}>
            {customSectionName.replace(/_/g, ' ').toUpperCase()}
          </Typography>
          {validItems.map((item, i) => (
            <Box key={i} sx={{ mb: `${paragraphSpacing / 2}px` }}>
              <Typography sx={{ 
                fontSize: fontSize, 
                fontFamily: font,
                color: color,
                lineHeight: `${lineSpacing}px`
              }} whiteSpace="pre-line">
                • {item}
              </Typography>
            </Box>
          ))}
        </Box>
      );
    } else {
      console.log(`⚠️ No valid items in custom section: ${customSectionName}`);
      return null;
    }
  }
  return null;
      }}

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
  }, [page.height, topBottomMargin, workExperiences, educationEntries, savedSkills, savedSummary, savedAdditionalInfo, savedLanguages, savedAccomplishments, savedCertifications, savedReferences, softwareSkills, savedVolunteering, savedInterests, savedWebsites, customSections, sectionOrder, sectionSpacing, paragraphSpacing, lineSpacing, fontSize, headingSize, font, color]);
  
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
        templateId: 3, // Resume3 template ID
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

  const renderContentForMeasurement = () => (
    <Box ref={resumeRef} sx={{ visibility: 'hidden', position: 'absolute', fontFamily: font }}>
      <Box sx={{ 
        p: `0px ${sideMargins}px`, 
        fontFamily: font,
        color: color
      }}>
        <Grid container spacing={2} alignItems="center" className="resume-header" sx={{ fontFamily: font }}>
          <Grid item xs={3}>
            <Avatar
              src={photo || "https://randomuser.me/api/portraits/men/45.jpg"}
              sx={{ 
                width: 120, 
                height: 120, 
                border: `${lineWeight}px solid ${color}`, 
                fontFamily: font 
              }}
            />
          </Grid>
          <Grid item xs={9}>
            <Typography sx={{ 
              fontSize: headingSize, 
              fontWeight: "bold", 
              color, 
              fontFamily: font,
              lineHeight: `${lineSpacing}px`
            }}>
              {data.firstName} {data.lastName}
            </Typography>
            <Typography variant="subtitle1" sx={{ 
              fontFamily: font, 
              color: color,
              lineHeight: `${lineSpacing}px`
            }}>
              {data.currentPosition}
            </Typography>
            <Typography variant="body2" sx={{ 
              fontFamily: font, 
              color: color,
              lineHeight: `${lineSpacing}px`
            }}>
              📧 {data.email}
            </Typography>
            <Typography variant="body2" sx={{ 
              fontFamily: font, 
              color: color,
              lineHeight: `${lineSpacing}px`
            }}>
              📞 {data.phone}
            </Typography>
            {data.city && (
              <Typography variant="body2" sx={{ 
                fontFamily: font, 
                color: color,
                lineHeight: `${lineSpacing}px`
              }}>
                📍 {data.city}
              </Typography>
            )}
          </Grid>
        </Grid>

        <Divider sx={{ 
          my: 2, 
          borderColor: color, 
          borderWidth: lineWeight, 
          fontFamily: font 
        }} />

        <Grid container spacing={3} sx={{ fontFamily: font }}>
          <Grid item xs={12}>
            {/* Render all sections in the specified order */}
            {sectionOrder.map(sectionId => (
              <React.Fragment key={sectionId}>
                {renderSectionContent(sectionId)}
              </React.Fragment>
            ))}
          </Grid>
        </Grid>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ 
      width: "100%", 
      position: "relative", 
      fontFamily: font, 
      color: color 
    }}>
      {!exporting && (
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          mb: 2, 
          gap: 2, 
          '@media print': { display: 'none' }, 
          fontFamily: font 
        }}>
          <IconButton 
            onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))} 
            disabled={currentPage === 0} 
            color="primary" 
            sx={{ fontFamily: font }}
          >
            <ChevronLeft />
          </IconButton>
          <Typography sx={{ 
            mx: 2, 
            fontFamily: font, 
            color: color 
          }}>
            Page {currentPage + 1} of {Math.max(1, pages.length)}
          </Typography>
          <IconButton 
            onClick={() => setCurrentPage(prev => Math.min(pages.length - 1, prev + 1))} 
            disabled={currentPage === Math.max(0, pages.length - 1)} 
            color="primary" 
            sx={{ fontFamily: font }}
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
                sx={{ fontFamily: font }}
              >
                Arrange Sections
              </Button>
              
              <Button 
                onClick={resetSectionOrder} 
                variant="outlined" 
                color="secondary" 
                size="small"
                sx={{ fontFamily: font }}
              >
                Reset Section Order
              </Button>
            </Box>
          )}
        </Box>
      )}
      
      {renderContentForMeasurement()}
      
      <Box id="resume-container" sx={{ fontFamily: font, color: color }}>
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
                color: color,
                fontFamily: font,
                fontSize,
                fontStyle,
                lineHeight: `${lineSpacing}px`,
                p: `${topBottomMargin}px ${sideMargins}px`,
                display: "flex",
                flexDirection: "column",
                pageBreakAfter: "always",
                "& *": {
                  fontFamily: `${font} !important`,
                  color: `${color} !important`,
                  lineHeight: `${lineSpacing}px !important`,
                },
                "@media print": {
                  width: page.width,
                  height: "auto",
                  minHeight: page.height,
                  boxShadow: "none",
                  m: 0,
                  fontFamily: font,
                  color: color,
                  "& *": {
                    fontFamily: `${font} !important`,
                    color: `${color} !important`,
                    lineHeight: `${lineSpacing}px !important`,
                  },
                },
                // Show all pages when exporting, only current page when viewing
                display: exporting ? 'block' : (index === currentPage ? 'block' : 'none'),
                '@media print': { display: 'block' }
              }}
            >
              {index === 0 && (
                <>
                  <Grid container spacing={2} alignItems="center" sx={{ 
                    fontFamily: font, 
                    "& *": { 
                      fontFamily: `${font} !important`, 
                      color: `${color} !important`,
                      lineHeight: `${lineSpacing}px !important`,
                    } 
                  }}>
                    <Grid item xs={3}>
                      <Avatar
                        src={photo || "https://randomuser.me/api/portraits/men/45.jpg"}
                        sx={{ 
                          width: 120, 
                          height: 120, 
                          border: `${lineWeight}px solid ${color}`, 
                          fontFamily: font 
                        }}
                      />
                    </Grid>
                    <Grid item xs={9}>
                      <Typography sx={{ 
                        fontSize: headingSize, 
                        fontWeight: "bold", 
                        color, 
                        fontFamily: font,
                        lineHeight: `${lineSpacing}px`
                      }}>
                        {data.firstName} {data.lastName}
                      </Typography>
                      <Typography variant="subtitle1" sx={{ 
                        fontFamily: font, 
                        color: color,
                        lineHeight: `${lineSpacing}px`
                      }}>
                        {data.currentPosition}
                      </Typography>
                      <Typography variant="body2" sx={{ 
                        fontFamily: font, 
                        color: color,
                        lineHeight: `${lineSpacing}px`
                      }}>
                        📧 {data.email}
                      </Typography>
                      <Typography variant="body2" sx={{ 
                        fontFamily: font, 
                        color: color,
                        lineHeight: `${lineSpacing}px`
                      }}>
                        📞 {data.phone}
                      </Typography>
                      {data.city && (
                        <Typography variant="body2" sx={{ 
                          fontFamily: font, 
                          color: color,
                          lineHeight: `${lineSpacing}px`
                        }}>
                          📍 {data.city}
                        </Typography>
                      )}
                    </Grid>
                  </Grid>
                  <Divider sx={{ 
                    my: 2, 
                    borderColor: color, 
                    borderWidth: lineWeight, 
                    fontFamily: font 
                  }} />
                </>
              )}
              <div 
                dangerouslySetInnerHTML={{ 
                  __html: pageContent.join('').replace(
                    /style="([^"]*)"/g, 
                    (match, p1) => `style="${p1}; font-family: ${font} !important; color: ${color} !important; line-height: ${lineSpacing}px !important"`
                  )
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
              color: color,
              "& *": {
                fontFamily: `${font} !important`,
                color: `${color} !important`,
                lineHeight: `${lineSpacing}px !important`,
              },
            }}
          >
            <Typography sx={{ 
              p: 2, 
              fontFamily: font, 
              color: color,
              lineHeight: `${lineSpacing}px`
            }}>
              Loading resume...
            </Typography>
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

export default Resume3;