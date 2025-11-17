import React, { useEffect, useState, useRef, useCallback } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {
  Container,
  Paper,
  Typography,
  Grid,
  Box,
  Divider,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Link,
  IconButton,
  Button,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  Email,
  Phone,
  Language,
  ChevronLeft,
  ChevronRight,
  DragIndicator,
  Reorder
} from '@mui/icons-material';
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const Resume14 = ({ 
  color = '#2d5c7f',
  nameColor = '#2d5c7f',
  font = "Arial, sans-serif",
  fontSize = "14px",
  fontStyle = "normal",
  headingSize = "24px",
  sectionSpacing = 30,
  paragraphSpacing = 10,
  lineSpacing = 20,
  topBottomMargin = 30,
  sideMargins = 20,
  paragraphIndent = 0,
  lineWeight = 1,
  pageSize = "A4",
  theme: externalTheme,
  formData = {},
  photo = "",
  workExperiences = [],
  exporting = false,
  enableDragDrop = true
}) => {
  // Use theme color if provided, otherwise use the color prop
  const primaryColor = externalTheme?.primary || color;
  const darkColor = externalTheme?.dark || getDarkColor(primaryColor);
  
  // State for all additional data
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
  const mainContentRef = useRef(null);

  // Define default section order (all sections in single array)
  const defaultSectionOrder = [
    'header',
    'profile',
    'experience',
    'education',
    'skills',
    'certifications',
    'languages',
    'accomplishments',
    'softwareSkills',
    'volunteering',
    'interests',
    'websites',
    'references',
    'additionalInfo'
  ];

  // State for section ordering - single array for all sections
  const [sectionOrder, setSectionOrder] = useState(defaultSectionOrder);
  const [dragOverIndex, setDragOverIndex] = useState(null);
  
  // State for arrange sections dialog
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
  const data = {
    firstName: "Cairine",
    lastName: "Ziv",
    currentPosition: "IT PROJECT MANAGER",
    phone: "+123-456-7890",
    email: "hello@reallygreatsite.com",
    city: "",
    website: "reallygreatsite.com",
    profile: "Join us at projectsmanager.mcs.org for the first time. This is a special case of our work experience in the industry which is a great deal of research.",
    ...formData
  };

  // Global font style for all text with color
  const globalFontStyle = {
    fontFamily: font,
    fontSize: fontSize,
    fontStyle: fontStyle,
    lineHeight: `${lineSpacing}px`,
    color: color,
  };

  // Style object for consistent font family and color application
  const getTextStyle = (additionalStyles = {}) => ({
    ...globalFontStyle,
    ...additionalStyles
  });

  // Helper function to darken colors
  function getDarkColor(hex) {
    let c = hex.replace('#', '');
    if (c.length === 8) c = c.slice(0, 6);
    let r = Math.max(0, parseInt(c.substring(0,2),16) - 40);
    let g = Math.max(0, parseInt(c.substring(2,4),16) - 40);
    let b = Math.max(0, parseInt(c.substring(4,6),16) - 40);
    return `#${r.toString(16).padStart(2,'0')}${g.toString(16).padStart(2,'0')}${b.toString(16).padStart(2,'0')}`;
  }

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

  // Load saved section order for Resume14
  const savedSectionOrder = localStorage.getItem("resume14SectionOrder");
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

    // Resume14-ல் custom section auto-update useEffect-ஐ add பண்ணவும்
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
      localStorage.setItem("resume14SectionOrder", JSON.stringify(newOrder));
      console.log('📝 Final section order with ONLY CURRENT custom sections:', newOrder);
    }
  } else if (userId && Object.keys(customSections).length === 0) {
    // If no current custom sections, remove all custom sections
    const currentOrder = [...sectionOrder];
    const filteredOrder = currentOrder.filter(section => !section.startsWith('custom_'));
    
    if (filteredOrder.length !== currentOrder.length) {
      setSectionOrder(filteredOrder);
      localStorage.setItem("resume14SectionOrder", JSON.stringify(filteredOrder));
      console.log('🗑️ Removed all custom sections (no current sections)');
    }
  }
}, [customSections]);

  // Save section order to localStorage whenever it changes
  useEffect(() => {
    if (sectionOrder.length > 0) {
      localStorage.setItem("resume14SectionOrder", JSON.stringify(sectionOrder));
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
      'header': 'Header',
      'profile': 'Professional Summary',
      'experience': 'Work Experience',
      'education': 'Education',
      'skills': 'Skills & Competencies',
      'certifications': 'Certifications',
      'languages': 'Languages',
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

  // Save download history function
  const saveDownloadHistory = async (format, fileName, fileSize) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const downloadData = {
        templateId: 14, // Resume14 template ID
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
    const resumeElement = document.getElementById('resume14-container');
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
    const resumeElement = document.getElementById('resume14-container');
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


  // Add global font style and color to HTML content
  const addFontToHtmlContent = (htmlContent) => {
    if (!htmlContent) return '';
    
    // Add font family and color to ALL HTML content elements
    return htmlContent
      .replace(/<div/g, `<div style="font-family: ${font}; font-size: ${fontSize}; font-style: ${fontStyle}; line-height: ${lineSpacing}px; color: ${color};"`)
      .replace(/<p/g, `<p style="font-family: ${font}; font-size: ${fontSize}; font-style: ${fontStyle}; line-height: ${lineSpacing}px; color: ${color};"`)
      .replace(/<span/g, `<span style="font-family: ${font}; font-size: ${fontSize}; font-style: ${fontStyle}; line-height: ${lineSpacing}px; color: ${color};"`)
      .replace(/<h1/g, `<h1 style="font-family: ${font}; font-size: ${headingSize}; font-style: ${fontStyle}; color: ${primaryColor};"`)
      .replace(/<h2/g, `<h2 style="font-family: ${font}; font-size: ${headingSize}; font-style: ${fontStyle}; color: ${primaryColor};"`)
      .replace(/<h3/g, `<h3 style="font-family: ${font}; font-size: ${headingSize}; font-style: ${fontStyle}; color: ${primaryColor};"`)
      .replace(/<h4/g, `<h4 style="font-family: ${font}; font-size: ${headingSize}; font-style: ${fontStyle}; color: ${primaryColor};"`)
      .replace(/<h5/g, `<h5 style="font-family: ${font}; font-size: ${headingSize}; font-style: ${fontStyle}; color: ${primaryColor};"`)
      .replace(/<h6/g, `<h6 style="font-family: ${font}; font-size: ${headingSize}; font-style: ${fontStyle}; color: ${primaryColor};"`)
      .replace(/<li/g, `<li style="font-family: ${font}; font-size: ${fontSize}; font-style: ${fontStyle}; line-height: ${lineSpacing}px; color: ${color};"`)
      .replace(/<ul/g, `<ul style="font-family: ${font}; font-size: ${fontSize}; font-style: ${fontStyle}; line-height: ${lineSpacing}px; color: ${color};"`)
      .replace(/<ol/g, `<ol style="font-family: ${font}; font-size: ${fontSize}; font-style: ${fontStyle}; line-height: ${lineSpacing}px; color: ${color};"`)
      .replace(/<a/g, `<a style="font-family: ${font}; font-size: ${fontSize}; font-style: ${fontStyle}; color: ${color};"`);
  };

  // Create a custom theme with customizable colors
  const theme = createTheme({
    palette: {
      primary: {
        main: primaryColor,
        light: `${primaryColor}80`,
        dark: `${primaryColor}40`,
      },
      secondary: {
        main: '#e67e22',
        light: '#f39c12',
        dark: '#d35400',
      },
      background: {
        default: '#f9f9f9',
      },
      text: {
        primary: color,
        secondary: color,
      }
    },
    typography: {
      fontFamily: font,
      h3: {
        fontWeight: 700,
        color: nameColor,
        fontSize: `calc(${headingSize} * 1.8)`,
        fontFamily: font,
      },
      h4: {
        fontWeight: 600,
        color: nameColor,
        fontSize: `calc(${headingSize} * 1.4)`,
        fontFamily: font,
      },
      h5: {
        fontWeight: 600,
        color: primaryColor,
        fontSize: headingSize,
        fontFamily: font,
      },
      h6: {
        fontWeight: 600,
        color: primaryColor,
        fontSize: `calc(${headingSize} * 0.9)`,
        fontFamily: font,
      },
      subtitle1: {
        color: color,
        fontWeight: 500,
        fontSize: `calc(${fontSize} * 1.1)`,
        fontFamily: font,
      },
      body2: {
        color: color,
        fontSize: fontSize,
        lineHeight: `${lineSpacing}px`,
        fontFamily: font,
      },
      body1: {
        color: color,
        fontSize: fontSize,
        lineHeight: `${lineSpacing}px`,
        fontFamily: font,
      }
    },
  });

  // Header Component
  const HeaderSection = () => {
    return (
      <Box sx={{ 
        mb: sectionSpacing / 10, 
        p: sideMargins / 5,
        borderBottom: `3px solid ${primaryColor}`,
        pb: 3,
        textAlign: 'center'
      }}>
        {photo && (
          <Avatar 
            src={photo} 
            sx={{ 
              width: 120, 
              height: 120, 
              mx: 'auto',
              mb: 3,
              border: `3px solid ${primaryColor}`,
              boxShadow: 2
            }} 
          />
        )}
        <Typography variant="h3" gutterBottom sx={{ color: nameColor, ...globalFontStyle }}>
          {data.firstName} {data.lastName}
        </Typography>
        <Typography variant="h5" sx={{ color: primaryColor, mb: 3, ...globalFontStyle }}>
          {data.currentPosition}
        </Typography>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          flexWrap: 'wrap', 
          gap: 3,
          mt: 2
        }}>
          {data.phone && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Phone sx={{ color: primaryColor, mr: 1, fontSize: 20 }} />
              <Typography variant="body2" sx={getTextStyle()}>
                {data.phone}
              </Typography>
            </Box>
          )}
          {data.email && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Email sx={{ color: primaryColor, mr: 1, fontSize: 20 }} />
              <Typography variant="body2" sx={getTextStyle()}>
                {data.email}
              </Typography>
            </Box>
          )}
          {data.website && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Language sx={{ color: primaryColor, mr: 1, fontSize: 20 }} />
              <Typography variant="body2" sx={getTextStyle()}>
                {data.website}
              </Typography>
            </Box>
          )}
          {data.city && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="body2" sx={getTextStyle()}>
                {data.city}
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    );
  };

  // Profile Section
  const ProfileSection = () => {
    return (
      <Box sx={{ 
        mb: sectionSpacing / 10, 
        p: sideMargins / 5
      }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          mb: 2,
          pb: 1,
          borderBottom: `2px solid ${primaryColor}`
        }}>
          <Box sx={{ 
            width: 4, 
            height: 24, 
            backgroundColor: primaryColor, 
            mr: 2 
          }} />
          <Typography variant="h5" color="primary" sx={{ fontWeight: 700, ...globalFontStyle }}>
            PROFESSIONAL SUMMARY
          </Typography>
        </Box>
        <Typography variant="body2" paragraph sx={getTextStyle({
          textAlign: 'justify',
          lineHeight: 1.6
        })}>
          {savedSummary || data.profile}
        </Typography>
      </Box>
    );
  };

  // Work Experience Section
  const WorkExperienceSection = () => {
    const experienceData = workExperiences && workExperiences.length > 0 ? workExperiences : [
      { jobTitle: "Project Manager", employer: "Welfare FOR", companyName: "Welfare FOR Organization", startMonth: "Jul", startYear: "2017", current: true, description: "Conduct day-to-day project coordination, planning, and implementation across multiple teams\nManage project budgets and timelines ensuring on-time delivery" },
      { jobTitle: "Senior UX Designer", employer: "Prospect Line", companyName: "Prospect Line Company", startMonth: "Jan", startYear: "2014", endMonth: "Sept", endYear: "2017", description: "Managed complex projects from start to end with 95% success rate\nCollaborated with cross-functional teams to deliver user-centered designs" },
    ];
    
    const sections = [];

    // 1. Heading is a separate measurable unit
    sections.push(
      <div key="work-heading" className="resume-section">
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          mb: 3,
          pb: 1,
          borderBottom: `2px solid ${primaryColor}`
        }}>
          <Box sx={{ 
            width: 4, 
            height: 24, 
            backgroundColor: primaryColor, 
            mr: 2 
          }} />
          <Typography variant="h5" color="primary" sx={{ fontWeight: 700, ...globalFontStyle }}>
            WORK EXPERIENCE
          </Typography>
        </Box>
      </div>
    );

    // 2. Each entry is a separate measurable unit
    experienceData.forEach((work, i) => {
      sections.push(
        <div key={`work-entry-${i}`} className="resume-section">
          <Box sx={{ 
            mb: sectionSpacing / 8,
            p: sideMargins / 5,
            borderLeft: `3px solid ${primaryColor}`,
            pl: 3,
            ml: 1
          }}>
            <Typography variant="h6" gutterBottom color="primary" sx={{ fontWeight: 600, ...globalFontStyle }}>
              {work.jobTitle} | {work.employer}
            </Typography>
            <Typography variant="subtitle1" gutterBottom sx={{ color: color, fontStyle: 'italic', mb: 1, ...globalFontStyle }}>
              {work.companyName} | {formatDate(work.startMonth, work.startYear)} - {work.current ? 'Present' : formatDate(work.endMonth, work.endYear)}
            </Typography>
            {work.description && (
              <Box
                sx={{ 
                  mt: 1, 
                  color: color,
                  "& strong": { 
                    fontWeight: "bold", 
                    color: primaryColor,
                    fontFamily: font,
                    fontSize: fontSize,
                    fontStyle: fontStyle,
                  }, 
                  "& em": { 
                    fontStyle: "italic",
                    fontFamily: font,
                    fontSize: fontSize,
                    color: color,
                  }, 
                  "& u": { 
                    textDecoration: "underline",
                    fontFamily: font,
                    fontSize: fontSize,
                    fontStyle: fontStyle,
                    color: color,
                  },
                  "& *": {
                    fontFamily: font,
                    fontSize: fontSize,
                    fontStyle: fontStyle,
                    lineHeight: `${lineSpacing}px`,
                    color: color,
                  },
                  ...globalFontStyle
                }}
                dangerouslySetInnerHTML={{
                  __html: work.description
                    .replace(/\*\*(.*?)\*\*/g, `<strong style="font-family: ${font}; font-size: ${fontSize}; font-style: ${fontStyle}; color: ${primaryColor};">$1</strong>`)
                    .replace(/\*(.*?)\*/g, `<em style="font-family: ${font}; font-size: ${fontSize}; color: ${color};">$1</em>`)
                    .replace(/<u>(.*?)<\/u>/g, `<u style="font-family: ${font}; font-size: ${fontSize}; font-style: ${fontStyle}; color: ${color};">$1</u>`)
                    .replace(/\n/g, `<br style="font-family: ${font}; color: ${color};"/>`),
                }}
              />
            )}
          </Box>
        </div>
      );
    });

    return <>{sections}</>;
  };

  // Education Section
  const EducationSection = () => {
    const defaultEntries = [
      { id: 1, degree: "Master", fieldOfStudy: "Project Management", schoolName: "HOFZ Graduate Center", gradMonth: "Oct", gradYear: "2014", schoolLocation: "Specialized in agile project management methodologies", additionalCoursework: "Graduated with honors" },
      { id: 2, degree: "BA", fieldOfStudy: "Product Design", schoolName: "Cliffany College", gradMonth: "Dec", gradYear: "2013", schoolLocation: "GPA: 3.92/4.0", additionalCoursework: "Dean's List for 4 consecutive semesters" },
    ];
    const educationData = educationEntries.length > 0 ? educationEntries : defaultEntries;
    
    const sections = [];
    
    // 1. Heading is a separate measurable unit
    sections.push(
      <div key="edu-heading" className="resume-section">
        <Box sx={{ 
                display: 'flex', alignItems: 'center', mb: 3, pb: 1,
                borderBottom: `2px solid ${primaryColor}`
              }}>
                <Box sx={{ width: 4, height: 24, backgroundColor: primaryColor, mr: 2 }} />
          <Typography variant="h5" color="primary" sx={{ fontWeight: 700, ...globalFontStyle }}>
            EDUCATION
          </Typography>
        </Box>
      </div>
    );

    // 2. Each entry is a separate measurable unit
    educationData.forEach((edu) => {
      sections.push(
        <div key={`edu-entry-${edu.id}`} className="resume-section">
          <Box sx={{ 
            mb: sectionSpacing / 8,
            p: sideMargins / 5,
            borderLeft: `3px solid ${primaryColor}`,
            pl: 3,
            ml: 1
          }}>
            <Typography variant="h6" gutterBottom color="primary" sx={{ fontWeight: 600, ...globalFontStyle }}>
              {edu.degree} in {edu.fieldOfStudy}
            </Typography>
            <Typography variant="subtitle1" gutterBottom sx={{ color: color, fontStyle: 'italic', mb: 1, ...globalFontStyle }}>
              {edu.schoolName} | {formatDate(edu.gradMonth, edu.gradYear)}
            </Typography>
            <List dense sx={{ py: 0, color: color }}>
              <ListItem sx={{ px: 0, py: 0.5 }}>
                <ListItemIcon sx={{ minWidth: 30 }}>
                  <Box sx={{ width: 6, height: 6, backgroundColor: primaryColor, borderRadius: '50%' }} />
                </ListItemIcon>
                <ListItemText 
                  primary={edu.schoolLocation} 
                  sx={{ 
                    fontFamily: font, 
                    fontSize: fontSize,
                    color: color,
                    '& .MuiTypography-root': {
                      fontFamily: font,
                      fontSize: fontSize,
                      color: color,
                    }
                  }}
                />
              </ListItem>
              {edu.additionalCoursework && (
                <ListItem sx={{ px: 0, py: 0.5 }}>
                  <ListItemIcon sx={{ minWidth: 30 }}>
                    <Box sx={{ width: 6, height: 6, backgroundColor: primaryColor, borderRadius: '50%' }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary={`Coursework: ${edu.additionalCoursework}`} 
                    sx={{ 
                      fontFamily: font, 
                      fontSize: fontSize,
                      color: color,
                      '& .MuiTypography-root': {
                        fontFamily: font,
                        fontSize: fontSize,
                        color: color,
                      }
                    }}
                  />
                </ListItem>
              )}
            </List>
          </Box>
        </div>
      );
    });

    return <>{sections}</>;
  };

  // Skills Section
  const SkillsSection = () => {
    const skills = savedSkills.length > 0 ? savedSkills.map(skill => skill.name) : [
      "Project Management",
      "Agile & Scrum Methodologies",
      "Resource Management",
      "Risk Management",
      "Budget & Schedule Tracking",
      "Strategic Planning & Implementation",
      "Stakeholder Communication",
      "Team Leadership & Development"
    ];

    return (
      <div className="resume-section">
        <Box sx={{ 
          mb: sectionSpacing / 10
        }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            mb: 3,
            pb: 1,
            borderBottom: `2px solid ${primaryColor}`
          }}>
                 <Box sx={{ width: 4, height: 24, backgroundColor: primaryColor, mr: 2 }} />
            <Typography variant="h5" color="primary" sx={{ fontWeight: 700, ...globalFontStyle }}>
              SKILLS & COMPETENCIES
            </Typography>
          </Box>
          <Grid container spacing={2}>
            {skills.map((skill, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box sx={{ 
                    width: 6, 
                    height: 6, 
                    backgroundColor: primaryColor, 
                    borderRadius: '50%',
                    mr: 2
                  }} />
                  <Typography variant="body2" sx={getTextStyle()}>
                    {skill}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      </div>
    );
  };

  // Awards Section
  const AwardsSection = () => {
    const awards = savedAccomplishments.length > 0 ? savedAccomplishments : [
      "Market Sustainability Engineering & Technology (MSET) Award",
      "Market Safety Research Group (MSRG) Recognition",
      "Market Leadership Top Company (MLTC) Award",
      "Workforce Development Excellence (KPI) Award"
    ];

    if (awards.length === 0) return null;

    return (
      <div className="resume-section" key="awards-section">
        <Box sx={{ mb: sectionSpacing / 10 }}>
          <Box sx={{ 
            display: 'flex', alignItems: 'center', mb: 3, pb: 1,
            borderBottom: `2px solid ${primaryColor}`
          }}>
            <Box sx={{ width: 4, height: 24, backgroundColor: primaryColor, mr: 2 }} />
            <Typography variant="h5" color="primary" sx={{ fontWeight: 700, ...globalFontStyle }}>
              {savedAccomplishments.length > 0 ? "ACCOMPLISHMENTS" : "AWARDS & RECOGNITIONS"}
            </Typography>
          </Box>
          <List dense>
            {awards.map((award, index) => (
              <ListItem key={index} sx={{ px: 0, py: 0.5 }}>
                <ListItemIcon sx={{ minWidth: 30 }}><Box sx={{ width: 6, height: 6, backgroundColor: primaryColor, borderRadius: '50%' }} /></ListItemIcon>
                <ListItemText 
                  primary={award} 
                  sx={{ 
                    fontFamily: font, 
                    fontSize: fontSize,
                    color: color,
                    '& .MuiTypography-root': {
                      fontFamily: font,
                      fontSize: fontSize,
                      color: color,
                    }
                  }}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      </div>
    );
  };

  // Render section content based on section ID
  const renderSectionContent = (sectionId) => {
    switch (sectionId) {
      case 'header':
        return (
          <div className="resume-section" key="header-section">
            <HeaderSection />
          </div>
        );
      
      case 'profile':
        return (
          <div className="resume-section" key="profile-section">
            <ProfileSection />
          </div>
        );
      
      case 'experience':
        return <WorkExperienceSection key="experience-section" />;
      
      case 'education':
        return <EducationSection key="education-section" />;
      
      case 'skills':
        return <SkillsSection key="skills-section" />;
      
      case 'certifications':
        return savedCertifications.length > 0 ? (
          <div className="resume-section" key="certifications-section">
            <Box sx={{ mb: sectionSpacing / 10 }}>
              <Box sx={{ 
                display: 'flex', alignItems: 'center', mb: 3, pb: 1,
                borderBottom: `2px solid ${primaryColor}`
              }}>
                <Box sx={{ width: 4, height: 24, backgroundColor: primaryColor, mr: 2 }} />
                <Typography variant="h5" color="primary" sx={{ fontWeight: 700, ...globalFontStyle }}>CERTIFICATIONS</Typography>
              </Box>
              <List dense>
                {savedCertifications.map((cert, index) => (
                  <ListItem key={index} sx={{ px: 0, py: 0.5 }}>
                    <ListItemIcon sx={{ minWidth: 30 }}><Box sx={{ width: 6, height: 6, backgroundColor: primaryColor, borderRadius: '50%' }} /></ListItemIcon>
                    <ListItemText 
                      primary={`${cert.name} - ${cert.provider} (${cert.year})`} 
                      sx={{ 
                        fontFamily: font, 
                        fontSize: fontSize,
                        color: color,
                        '& .MuiTypography-root': {
                          fontFamily: font,
                          fontSize: fontSize,
                          color: color,
                        }
                      }}
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          </div>
        ) : null;
      
      case 'languages':
        return savedLanguages.length > 0 ? (
          <div className="resume-section" key="languages-section">
            <Box sx={{ mb: sectionSpacing / 10 }}>
              <Box sx={{ 
                display: 'flex', alignItems: 'center', mb: 3, pb: 1,
                borderBottom: `2px solid ${primaryColor}`
              }}>
                <Box sx={{ width: 4, height: 24, backgroundColor: primaryColor, mr: 2 }} />
                <Typography variant="h5" color="primary" sx={{ fontWeight: 700, ...globalFontStyle }}>LANGUAGES</Typography>
              </Box>
              <Grid container spacing={2}>
                {savedLanguages.map((lang, index) => (
                  <Grid item xs={12} sm={6} key={index}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box sx={{ width: 6, height: 6, backgroundColor: primaryColor, borderRadius: '50%', mr: 2 }} />
                      <Typography variant="body2" sx={getTextStyle()}>{lang.name} {lang.level ? `(${lang.level})` : ''}</Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </div>
        ) : null;
      
      case 'accomplishments':
        return savedAccomplishments.length > 0 ? (
          <div className="resume-section" key="accomplishments-section">
            <Box sx={{ mb: sectionSpacing / 10 }}>
              <Box sx={{ 
                display: 'flex', alignItems: 'center', mb: 3, pb: 1,
                borderBottom: `2px solid ${primaryColor}`
              }}>
                <Box sx={{ width: 4, height: 24, backgroundColor: primaryColor, mr: 2 }} />
                <Typography variant="h5" color="primary" sx={{ fontWeight: 700, ...globalFontStyle }}>ACCOMPLISHMENTS</Typography>
              </Box>
              <List dense>
                {savedAccomplishments.map((award, index) => (
                  <ListItem key={index} sx={{ px: 0, py: 0.5 }}>
                    <ListItemIcon sx={{ minWidth: 30 }}><Box sx={{ width: 6, height: 6, backgroundColor: primaryColor, borderRadius: '50%' }} /></ListItemIcon>
                    <ListItemText 
                      primary={award} 
                      sx={{ 
                        fontFamily: font, 
                        fontSize: fontSize,
                        color: color,
                        '& .MuiTypography-root': {
                          fontFamily: font,
                          fontSize: fontSize,
                          color: color,
                        }
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
          <div className="resume-section" key="software-skills-section">
            <Box sx={{ mb: sectionSpacing / 10 }}>
              <Box sx={{ 
                display: 'flex', alignItems: 'center', mb: 3, pb: 1,
                borderBottom: `2px solid ${primaryColor}`
              }}>
                <Box sx={{ width: 4, height: 24, backgroundColor: primaryColor, mr: 2 }} />
                <Typography variant="h5" color="primary" sx={{ fontWeight: 700, ...globalFontStyle }}>SOFTWARE SKILLS</Typography>
              </Box>
              <Grid container spacing={2}>
                {softwareSkills.map((skill, index) => (
                  <Grid item xs={12} sm={6} key={index}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box sx={{ width: 6, height: 6, backgroundColor: primaryColor, borderRadius: '50%', mr: 2 }} />
                      <Typography variant="body2" sx={getTextStyle()}>{skill.name} — {skill.level}%</Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </div>
        ) : null;
      
      case 'volunteering':
        return savedVolunteering.length > 0 ? (
          <div className="resume-section" key="volunteering-section">
            <Box sx={{ mb: sectionSpacing / 10 }}>
              <Box sx={{ 
                display: 'flex', alignItems: 'center', mb: 3, pb: 1,
                borderBottom: `2px solid ${primaryColor}`
              }}>
                <Box sx={{ width: 4, height: 24, backgroundColor: primaryColor, mr: 2 }} />
                <Typography variant="h5" color="primary" sx={{ fontWeight: 700, ...globalFontStyle }}>VOLUNTEERING</Typography>
              </Box>
              {savedVolunteering.map((vol, index) => (
                <Box key={index} sx={{ mb: 1 }}>
                  <Typography sx={{ fontSize: fontSize, fontWeight: "bold", fontFamily: font, color: color }}>{vol.subtopic}</Typography>
                  <Typography sx={{ fontSize: fontSize, color: color, fontFamily: font }}>{vol.fromDate} - {vol.toDate}</Typography>
                  <Typography sx={{ fontSize: fontSize, whiteSpace: "pre-line", mt: 0.5, fontFamily: font, color: color }}>{vol.content}</Typography>
                </Box>
              ))}
            </Box>
          </div>
        ) : null;
      
      case 'interests':
        return savedInterests.length > 0 ? (
          <div className="resume-section" key="interests-section">
            <Box sx={{ mb: sectionSpacing / 10 }}>
              <Box sx={{ 
                display: 'flex', alignItems: 'center', mb: 3, pb: 1,
                borderBottom: `2px solid ${primaryColor}`
              }}>
                <Box sx={{ width: 4, height: 24, backgroundColor: primaryColor, mr: 2 }} />
                <Typography variant="h5" color="primary" sx={{ fontWeight: 700, ...globalFontStyle }}>INTERESTS</Typography>
              </Box>
              <Grid container spacing={2}>
                {savedInterests.map((interest, index) => (
                  <Grid item xs={12} sm={6} key={index}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box sx={{ width: 6, height: 6, backgroundColor: primaryColor, borderRadius: '50%', mr: 2 }} />
                      <Typography variant="body2" sx={getTextStyle()}>{interest}</Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </div>
        ) : null;
      
      case 'websites':
        return savedWebsites.length > 0 ? (
          <div className="resume-section" key="websites-section">
            <Box sx={{ mb: sectionSpacing / 10 }}>
              <Box sx={{ 
                display: 'flex', alignItems: 'center', mb: 3, pb: 1,
                borderBottom: `2px solid ${primaryColor}`
              }}>
                <Box sx={{ width: 4, height: 24, backgroundColor: primaryColor, mr: 2 }} />
                <Typography variant="h5" color="primary" sx={{ fontWeight: 700, ...globalFontStyle }}>WEBSITES / PROFILES</Typography>
              </Box>
              {savedWebsites.map((site, index) => (
                <Typography key={index} sx={getTextStyle({ mb: `${paragraphSpacing / 10}px` })}>
                  {site.url} {site.addToHeader ? "(Shown in Header)" : ""}
                </Typography>
              ))}
            </Box>
          </div>
        ) : null;
      
      case 'references':
        return savedReferences.length > 0 ? (
          <div className="resume-section" key="references-section">
            <Box sx={{ mb: sectionSpacing / 10 }}>
              <Box sx={{ 
                display: 'flex', alignItems: 'center', mb: 3, pb: 1,
                borderBottom: `2px solid ${primaryColor}`
              }}>
                <Box sx={{ width: 4, height: 24, backgroundColor: primaryColor, mr: 2 }} />
                <Typography variant="h5" color="primary" sx={{ fontWeight: 700, ...globalFontStyle }}>REFERENCES</Typography>
              </Box>
              {savedReferences.map((ref, index) => (
                <Typography key={index} sx={getTextStyle({ mb: `${paragraphSpacing / 10}px` })} whiteSpace="pre-line">
                  {ref}
                </Typography>
              ))}
            </Box>
          </div>
        ) : null;
      
      case 'additionalInfo':
        return savedAdditionalInfo.length > 0 ? (
          <div className="resume-section" key="additional-info-section">
            <Box sx={{ mb: sectionSpacing / 10 }}>
              <Box sx={{ 
                display: 'flex', alignItems: 'center', mb: 3, pb: 1,
                borderBottom: `2px solid ${primaryColor}`
              }}>
                <Box sx={{ width: 4, height: 24, backgroundColor: primaryColor, mr: 2 }} />
                <Typography variant="h5" color="primary" sx={{ fontWeight: 700, ...globalFontStyle }}>ADDITIONAL INFORMATION</Typography>
              </Box>
              <List dense>
                {savedAdditionalInfo.map((info, index) => (
                  <ListItem key={index} sx={{ px: 0, py: 0.5 }}>
                    <ListItemIcon sx={{ minWidth: 30 }}><Box sx={{ width: 6, height: 6, backgroundColor: primaryColor, borderRadius: '50%' }} /></ListItemIcon>
                    <ListItemText 
                      primary={info} 
                      sx={{ 
                        fontFamily: font, 
                        fontSize: fontSize,
                        color: color,
                        '& .MuiTypography-root': {
                          fontFamily: font,
                          fontSize: fontSize,
                          color: color,
                        }
                      }}
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          </div>
        ) : null;
      
     // renderSectionContent function-ல் default case-ஐ replace பண்ணவும்:

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
        <div className="resume-section" key={`custom-${customSectionName}-section`}>
          <Box sx={{ mb: sectionSpacing / 10 }}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              mb: 3,
              pb: 1,
              borderBottom: `2px solid ${primaryColor}`
            }}>
              <Box sx={{ 
                width: 4, 
                height: 24, 
                backgroundColor: primaryColor, 
                mr: 2 
              }} />
              <Typography variant="h5" color="primary" sx={{ fontWeight: 700, ...globalFontStyle }}>
                {customSectionName.replace(/_/g, ' ').toUpperCase()}
              </Typography>
            </Box>
            <List dense>
              {validItems.map((item, i) => (
                <ListItem key={i} sx={{ px: 0, py: 0.5 }}>
                  <ListItemIcon sx={{ minWidth: 30 }}>
                    <Box sx={{ 
                      width: 6, 
                      height: 6, 
                      backgroundColor: primaryColor, 
                      borderRadius: '50%' 
                    }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary={item} 
                    sx={{ 
                      fontFamily: font, 
                      fontSize: fontSize,
                      color: color,
                      '& .MuiTypography-root': {
                        fontFamily: font,
                        fontSize: fontSize,
                        color: color,
                        lineHeight: `${lineSpacing}px`,
                      }
                    }}
                  />
                </ListItem>
              ))}
            </List>
          </Box>
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

  // Pagination function
  const paginateContent = useCallback(() => {
    if (!mainContentRef.current) return;

    // Target ALL measurable units
    const allSections = Array.from(mainContentRef.current.querySelectorAll('.resume-section'));
    const pageHeightInPx = parseFloat(page.height.replace('mm', '')) * 3.78;
    
    // We use a small buffer for top/bottom margins, not 2 * topBottomMargin
    // This allows for better space utilization while leaving padding on the page.
    // The margin size will be controlled by the Paper component's 'p' style.
    const availableHeight = pageHeightInPx - 60; // 60px is a fixed buffer for safety/padding

    let newPages = [];
    let currentPageSections = [];
    let currentPageHeight = 0;
    
    if (allSections.length === 0) {
      newPages.push({ main: [] });
    }
    
    allSections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      
      if (currentPageHeight + sectionHeight > availableHeight) {
        // Start a new page
        newPages.push({ main: currentPageSections });
        currentPageSections = [section];
        currentPageHeight = sectionHeight;
      } else {
        // Add to current page
        currentPageSections.push(section);
        currentPageHeight += sectionHeight;
      }
    });
    
    if (currentPageSections.length > 0) {
      newPages.push({ main: currentPageSections });
    }
    
    setPages(newPages);
  }, [page.height]);

  useEffect(() => {
    // Timeout to ensure all content is rendered and measured correctly
    const timeoutId = setTimeout(() => {
      paginateContent();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [paginateContent, educationEntries, savedSkills, savedSummary, workExperiences, 
      savedAdditionalInfo, savedLanguages, savedAccomplishments, savedCertifications, 
      savedReferences, softwareSkills, savedVolunteering, savedInterests, savedWebsites, 
      customSections, sectionOrder]);

  // Content for pagination measurement
  const renderMainContentToMeasure = () => (
    <Box ref={mainContentRef} sx={{ visibility: 'hidden', position: 'absolute', ...globalFontStyle }}>
      {/* Render all sections in the specified order */}
      {sectionOrder.map(sectionId => (
        <React.Fragment key={sectionId}>
          {renderSectionContent(sectionId)}
        </React.Fragment>
      ))}
    </Box>
  );

  // Render actual page content
  const renderPageContent = (pageContent, index) => (
    <Paper 
      key={index}
      elevation={8} 
      className="resume-page"
      sx={{ 
        p: sideMargins / 5,
        borderRadius: 1,
        background: 'white',
        fontFamily: font,
        fontSize: fontSize,
        fontStyle: fontStyle,
        lineHeight: `${lineSpacing}px`,
        color: color,
        minHeight: page.height,
        width: page.width,
        mx: 'auto',
        mb: 2,
       "& *": {
  color: `${color} !important`,
  borderColor: `${primaryColor} !important`,
  outlineColor: `${primaryColor} !important`,
  backgroundColor: "transparent !important",
},
"& [style*='border']": {
  borderColor: `${primaryColor} !important`,
},
"& [style*='border-left']": {
  borderLeftColor: `${primaryColor} !important`,
},
"& [style*='border-bottom']": {
  borderBottomColor: `${primaryColor} !important`,
},
"& [style*='border-top']": {
  borderTopColor: `${primaryColor} !important`,
},
"& [style*='border-right']": {
  borderRightColor: `${primaryColor} !important`,
},

        // Show all pages when exporting, only current page when viewing
        display: exporting ? 'block' : (index === currentPage ? 'block' : 'none'),
        '@media print': {
          display: 'block',
          boxShadow: 'none',
          m: 0,
          minHeight: 'auto',
          borderRadius: 0
        }
      }}
    >
      {/* Renders the paginated HTML content */}
      <div 
        style={{...globalFontStyle, color: color}}
        dangerouslySetInnerHTML={{ __html: addFontToHtmlContent(pageContent.main.map(s => s.outerHTML).join('')) }} 
      />
    </Paper>
  );

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ 
        bgcolor: 'background.default', 
        minHeight: '100vh', 
        py: topBottomMargin / 10,
        background: 'white',
        color: color,
      }}>
        {/* Controls */}
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
            <Typography sx={{ mx: 2, color: color }}>
              Page {currentPage + 1} of {Math.max(1, pages.length)}
            </Typography>
            <IconButton 
              onClick={() => setCurrentPage(prev => Math.min(pages.length - 1, prev + 1))} 
              disabled={currentPage === Math.max(0, pages.length - 1)} 
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
                
                <Button onClick={resetSectionOrder} variant="outlined" color="secondary" size="small">
                  Reset Section Order
                </Button>
              </Box>
            )}
          </Box>
        )}
        
        {/* This hidden content is ONLY for height measurement. It does not appear on screen. */}
        {renderMainContentToMeasure()}
        
        <Box id="resume14-container">
          {pages.length > 0 ? (
            pages.map((pageContent, index) => renderPageContent(pageContent, index))
          ) : (
             // Fallback for initial load (when pages are not yet calculated)
            <Paper 
              elevation={8} 
              className="resume-page"
              sx={{ 
                p: sideMargins / 5, 
                borderRadius: 1,
                background: 'white',
                fontFamily: font,
                fontSize: fontSize,
                fontStyle: fontStyle,
                lineHeight: `${lineSpacing}px`,
                color: color,
                minHeight: page.height,
                width: page.width,
                mx: 'auto',
              "& *": {
  color: `${color} !important`,
  borderColor: `${primaryColor} !important`,
  outlineColor: `${primaryColor} !important`,
  backgroundColor: "transparent !important",
},
"& [style*='border']": {
  borderColor: `${primaryColor} !important`,
},
"& [style*='border-left']": {
  borderLeftColor: `${primaryColor} !important`,
},
"& [style*='border-bottom']": {
  borderBottomColor: `${primaryColor} !important`,
},
"& [style*='border-top']": {
  borderTopColor: `${primaryColor} !important`,
},
"& [style*='border-right']": {
  borderRightColor: `${primaryColor} !important`,
},

                '@media print': {
                  boxShadow: 'none',
                  borderRadius: 0
                }
              }}
            >
              {/* Fallback renders the actual component output directly using section order */}
              {sectionOrder.map(sectionId => (
                <React.Fragment key={sectionId}>
                  {renderSectionContent(sectionId)}
                </React.Fragment>
              ))}
            </Paper>
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
    </ThemeProvider>
  );
};

// Meta information for Resume14
export const resumeMeta = {
  hasPhoto: true,
  columns: 1, // Changed to single column
  colorOptions: [
    { value: '#2d5c7f', label: 'Professional Blue' },
    { value: '#1a2b47', label: 'Dark Blue' },
    { value: '#2e7d32', label: 'Green' },
    { value: '#5d4037', label: 'Brown' },
    { value: '#37474f', label: 'Slate Gray' }
  ],
  nameColorOptions: [
    { value: '#2d5c7f', label: 'Blue' },
    { value: '#1a2b47', label: 'Dark Blue' },
    { value: '#2e7d32', label: 'Green' },
    { value: '#5d4037', label: 'Brown' },
    { value: '#000000', label: 'Black' }
  ]
};

export default Resume14;