import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  AppBar,
  Toolbar,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  InputAdornment,
  Menu,
  MenuItem,
  Paper,
  Chip,
  Alert,
  CircularProgress
} from "@mui/material";
import { Download, Print, Email, ZoomIn, ZoomOut, Title, CheckCircle, Cancel, Error } from "@mui/icons-material";
import { MdOutlineDesignServices, MdFormatListBulletedAdd, MdSpellcheck } from "react-icons/md";
import { FaFileAlt } from "react-icons/fa";
import { useLocation } from "react-router-dom";

import DesignFormattingComponent from "./DesignFormattingPage";
import Resume1 from "../DuplicateResume/Resume1";
import Resume2 from "../DuplicateResume/Resume2";
import Resume3 from "../DuplicateResume/Resume3";
import Resume4 from "../DuplicateResume/Resume4";
import Resume5 from "../DuplicateResume/Resume5";
import Resume6 from "../DuplicateResume/Resume6";
import Resume7 from "../DuplicateResume/Resume7";
import Resume8 from "../DuplicateResume/Resume8";
import Resume9 from "../DuplicateResume/Resume9";
import Resume10 from "../DuplicateResume/Resume10";
import Resume11 from "../DuplicateResume/Resume11";
import Resume12 from "../DuplicateResume/Resume12";
import Resume13 from "../DuplicateResume/Resume13";
import Resume14 from "../DuplicateResume/Resume14";
import Resume15 from "../DuplicateResume/Resume15";
import Resume16 from "../DuplicateResume/Resume16";
import Resume17 from "../DuplicateResume/Resume17";
import Resume18 from "../DuplicateResume/Resume18";
import Resume19 from "../DuplicateResume/Resume19";
import Resume20 from "../DuplicateResume/Resume20";  
import Resume21 from "../DuplicateResume/Resume21";
import Resume22 from "../DuplicateResume/Resume22";
import Resume23 from "../DuplicateResume/Resume23";
import Resume24 from "../DuplicateResume/Resume24";
import Resume25 from "../DuplicateResume/Resume25";
import Resume26 from "../DuplicateResume/Resume26";
import TemplatesComponent from "./TemplatesComponent";
import AddSectionComponent from "./AddSectionComponent";

// IMPORT THE NEWLY SPLIT COMPONENT
import SpellCheckComponent from "./SpellCheck";


import html2canvas from "html2canvas";
import jsPDF from "jspdf";


// Add this mapping of template components
const templateComponents = {
  1: Resume1,
  2: Resume2,
  3: Resume3,
  4: Resume4,
  5: Resume5,
  6: Resume6,
  7: Resume7,
  8: Resume8,
  9: Resume9,
  10: Resume10,
  11: Resume11,
  12: Resume12, 
  13: Resume13,
  14: Resume14,
  15: Resume15,
  16: Resume16,
  17: Resume17, 
  18: Resume18,
  19: Resume19,
  20: Resume20,
  21: Resume21,
  22: Resume22,
  23: Resume23,
  24: Resume24,
  25: Resume25,
  26: Resume26,
};

const ResumeEditor = () => {
  const [selectedMenu, setSelectedMenu] = useState("design");
  const [downloadDialogOpen, setDownloadDialogOpen] = useState(false);
  const [fileName, setFileName] = useState("Resume");
  const [fileFormat, setFileFormat] = useState("pdf");
  const [resumeName, setResumeName] = useState("My Resume");
  const [resumeNameDialogOpen, setResumeNameDialogOpen] = useState(false);
  const [scale, setScale] = useState(1);
  const location = useLocation();
  const [resumeContent, setResumeContent] = useState(null);
  const [misspelledWords, setMisspelledWords] = useState([]);
  const [exporting, setExporting] = useState(false);
  
  // Get the selected theme from navigation state
  const initialTheme = location.state?.selectedTheme || "#0951b0ff";
  
  // State for design and template settings
  const [designSettings, setDesignSettings] = useState({
    color: typeof initialTheme === "string" ? initialTheme : 
           initialTheme.primary || initialTheme.highlight || "#0951b0ff",
    font: "EB Garamond",
    fontSize: "14px",
    fontStyle: "normal",
    headingSize: "24px",
    sectionSpacing: 10,
    paragraphSpacing: 10,
    lineSpacing: 20,
    topBottomMargin: 20,
    sideMargins: 20,
    paragraphIndent: 0,
    lineWeight: 1,
    pageSize: "A4"
  });
  
  // Initialize selectedTemplate directly from navigation state
  const initialTemplate = location.state?.selectedTemplate || 1;
  const [selectedTemplate, setSelectedTemplate] = useState(initialTemplate);

  // Handle template and theme selection from navigation state
  useEffect(() => {
    if (location.state) {
      if (location.state.selectedTemplate) {
        setSelectedTemplate(location.state.selectedTemplate);
      }
      if (location.state.selectedTheme) {
        const theme = location.state.selectedTheme;
        setDesignSettings(prev => ({
          ...prev,
          color: typeof theme === "string" ? theme : 
                 theme.primary || theme.highlight || prev.color
        }));
      }
    }
  }, [location.state]);

  // Get reference to resume content for spell checking
  useEffect(() => {
    const content = document.getElementById("resume-preview");
    if (content) {
      setResumeContent(content);
    }
  }, [selectedTemplate, selectedMenu]);

  // Handle highlighting misspelled words in the resume
  const handleHighlightErrors = (errors) => {
    setMisspelledWords(errors);
    
    if (!resumeContent) return;
    
    // Remove any existing highlights
    const highlightedElements = resumeContent.querySelectorAll('.spell-error');
    highlightedElements.forEach(el => {
      // Restore original innerHTML by replacing the span
      const parent = el.parentNode;
      if (parent) {
          parent.innerHTML = parent.innerHTML.replace(
              `<span class="spell-error" style="text-decoration: wavy underline red;">${el.textContent}</span>`,
              el.textContent
          );
      }
    });
    
    // Add new highlights
    errors.forEach(error => {
      // This is a simplified approach - a proper solution requires robust text node traversal
      highlightText(resumeContent, error.original, error.word);
    });
  };
  
  // Helper function to highlight text (simplified implementation)
  const highlightText = (element, originalText, wordToHighlight) => {
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, null);
    let node;
    
    while (node = walker.nextNode()) {
      // Simple check to avoid re-highlighting or messing up child components
      if (node.parentElement && node.parentElement.closest('#resume-preview') === element && node.textContent.includes(originalText)) {
        const parent = node.parentNode;
        // Check if the parent is an editable element or a text node inside the resume structure
        if (parent && !parent.classList.contains('spell-error') && parent.tagName !== 'SCRIPT' && parent.tagName !== 'STYLE') {
          // Use innerHTML replacement as in the original code, but only if it's safe
          // A safer, but more complex, approach involves DOM manipulation with ranges/splitText.
          const html = parent.innerHTML;
          const regex = new RegExp(`(?<!<[^>]*>)(${originalText})(?![^<]*>)`, 'g'); // Simplified attempt to avoid matching inside tags
          
          if (html.includes(originalText) && !html.includes('spell-error')) { // Basic sanity check
              const newHtml = html.replace(
                regex,
                `<span class="spell-error" style="text-decoration: wavy underline red;">$1</span>`
              );
              parent.innerHTML = newHtml;
          }
        }
      }
    }
  };

  // Handle text replacement from spell check
  const handleSpellCorrection = (originalWord, newWord) => {
    if (!resumeContent) return;
    
    // Find and replace the highlighted span with the new word
    const highlightedElements = resumeContent.querySelectorAll('.spell-error');
    
    highlightedElements.forEach(el => {
        // We check against the original word passed from the spell checker
        if (el.textContent === originalWord) {
            const parent = el.parentNode;
            if (parent) {
                // Replace the span element's outer HTML with the new word
                el.outerHTML = newWord;
            }
        }
    });
  };

  // -------- Print Handler ----------
  const handlePrint = () => {
    const resumeElement = document.getElementById("resume-preview");
    if (!resumeElement) return;

    // Remove highlights before printing
    const highlightedElements = resumeElement.querySelectorAll('.spell-error');
    highlightedElements.forEach(el => {
      // Restore original innerHTML by replacing the span
      const parent = el.parentNode;
      if (parent) {
          parent.innerHTML = parent.innerHTML.replace(
              `<span class="spell-error" style="text-decoration: wavy underline red;">${el.textContent}</span>`,
              el.textContent
          );
      }
    });

    const printWindow = window.open("", "_blank");
    const styles = Array.from(document.querySelectorAll("style, link[rel='stylesheet']"))
      .map((node) => node.outerHTML)
      .join("\n");

    printWindow.document.write(`
      <html>
        <head>
          <title>Print Resume</title>
          ${styles}
        </head>
        <body>
          <div id="resume-preview">${resumeElement.innerHTML}</div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.focus();
        printWindow.print();
        
        // Restore highlights after printing
        if (misspelledWords.length > 0) {
          handleHighlightErrors(misspelledWords);
        }
      }, 500);
    };
  };
  // Add this function to your ResumeEditor component
const saveDownloadHistory = async (format, fileName, fileSize) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return;

    const downloadData = {
      templateId: selectedTemplate,
      fileName: fileName,
      fileFormat: format,
      fileSize: fileSize,
      themeColor: designSettings.color,
      downloadedAt: new Date().toISOString()
    };

    await axios.post("https://resume-maker-lc.onrender.com/api/resumes/save-download", downloadData, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error) {
    console.error("Error saving download history:", error);
  }
};
const handleDownload = async (format) => {
  const resumeElement = document.getElementById("resume-preview");
  if (!resumeElement) return;

  // Remove highlights before capturing
  const highlightedElements = resumeElement.querySelectorAll('.spell-error');
  highlightedElements.forEach(el => {
    const parent = el.parentNode;
    if (parent) {
      parent.innerHTML = parent.innerHTML.replace(
        `<span class="spell-error" style="text-decoration: wavy underline red;">${el.textContent}</span>`,
        el.textContent
      );
    }
  });

  // Set exporting mode so Resume components render all pages and hide UI
  setExporting(true);
  // Small delay to allow DOM to re-render
  await new Promise(res => setTimeout(res, 400));
  
  let fileSize = 0;

  if (format === "pdf") {
    try {
      // Get ALL resume pages, not just the first one
      const resumePages = resumeElement.querySelectorAll('.resume-page');
      
      if (resumePages.length === 0) {
        console.error("No resume pages found");
        return;
      }

      const pdf = new jsPDF("p", "mm", designSettings.pageSize.toLowerCase());
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
          scale: 2, // Higher scale for better quality
          useCORS: true,
          allowTaint: true,
          backgroundColor: "#ffffff",
          logging: false // Disable logging for better performance
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
      fileSize = pdfBlob.size;
      
      // Save the PDF
      pdf.save(`${fileName}.pdf`);
      
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Error generating PDF. Please try again.");
    }
    
  } else if (format === "png") {
    // Handle PNG export - download each page as separate PNG image
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
        link.download = `${fileName}.png`;
      } else {
        link.download = `${fileName}-page-${i + 1}.png`;
      }
      
      link.href = canvas.toDataURL();
      
      // For multiple pages, use setTimeout to allow previous download to complete
      if (i === 0) {
        link.click();
      } else {
        setTimeout(() => {
          link.click();
        }, i * 500); // 500ms delay between downloads
      }
    }

    // Show notification for multiple pages
    if (resumePages.length > 1) {
      alert(`Downloading ${resumePages.length} PNG files. Please check your downloads folder.`);
    }
    
  } else if (format === "txt") {
    // Handle text export
    const textContent = resumeElement.innerText || resumeElement.textContent;
    const blob = new Blob([textContent], { type: 'text/plain' });
    const link = document.createElement('a');
    link.download = `${fileName}.txt`;
    link.href = URL.createObjectURL(blob);
    link.click();
    URL.revokeObjectURL(link.href);
  }
  
  // Save download history
  await saveDownloadHistory(format, fileName, fileSize);
  
  // Restore highlights after download
  if (misspelledWords.length > 0) {
    handleHighlightErrors(misspelledWords);
  }
  
  // Done exporting - restore UI
  setExporting(false);
  
  setDownloadDialogOpen(false);
};
  // Handle zoom in
  const handleZoomIn = () => {
    setScale(prevScale => Math.min(prevScale + 0.1, 2)); // Max zoom 200%
  };

  // Handle zoom out
  const handleZoomOut = () => {
    setScale(prevScale => Math.max(prevScale - 0.1, 0.5)); // Min zoom 50%
  };

  // Helper function to darken colors
  const getDarkColor = (hex) => {
    let c = hex.replace("#", "");
    if (c.length === 8) c = c.slice(0, 6);
    let r = Math.max(0, parseInt(c.substring(0, 2), 16) - 40);
    let g = Math.max(0, parseInt(c.substring(2, 4), 16) - 40);
    let b = Math.max(0, parseInt(c.substring(4, 6), 16) - 40);
    return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
  };
  
  // State for resume data (retained from original file)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    currentPosition:"",
    city: "",
    country: "India",
    pinCode: "",
    phone: "",
    email: "",
    linkedIn: "",
    website: "",
    drivingLicence: "",
  });
  const [workExperiences, setWorkExperiences] = useState([]);
  const [preview, setPreview] = useState("");
  
  // Function to get props for the selected resume template
  const getResumeProps = () => {
    switch (selectedTemplate) {
      case 2:
        return { 
          color: designSettings.color, 
          workExperiences, 
          formData, 
          photo: preview,
         exporting
        };
      case 3:
        return { 
          color: typeof designSettings.color === "object" ? designSettings.color.primary : designSettings.color, 
          workExperiences, 
          formData, 
          photo: preview,
         exporting
        };
      case 4:
        return { 
          theme: designSettings.color, 
          color: typeof designSettings.color === "object" ? designSettings.color.primary : designSettings.color, 
          workExperiences, 
          formData, 
          photo: preview,
         exporting
        };
      case 7:
        return { 
          theme: designSettings.color, 
          color: typeof designSettings.color === "object" ? designSettings.color.highlight : designSettings.color, 
          workExperiences, 
          formData, 
          photo: preview,
         exporting
        };
      case 8:
        return { 
          theme: designSettings.color, 
          workExperiences, 
          formData, 
          photo: preview,
         exporting
        };
      default:
        return { 
          color: designSettings.color, 
          workExperiences, 
          formData, 
          photo: preview,
         exporting
        };
    }
  };


// Fetch data like EducationTips
useEffect(() => {
  const savedWorks = localStorage.getItem("workExperiences");
  if (savedWorks) {
    setWorkExperiences(JSON.parse(savedWorks));
  }

  const fetchContactData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await axios.get("https://resume-maker-lc.onrender.com/api/contact/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data) {
        setFormData({
          firstName: res.data.firstName || "",
          lastName: res.data.lastName || "",
          currentPosition:res.data.currentPosition || "",
          city: res.data.city || "",
          country: res.data.country || "India",
          pinCode: res.data.pinCode || "",
          phone: res.data.phone || "",
          email: res.data.email || "",
          linkedIn: res.data.linkedIn || "",
          website: res.data.website || "",
          drivingLicence: res.data.drivingLicence || "",
        });

        if (res.data.photo) {
          setPreview(
            res.data.photo.startsWith("http")
              ? res.data.photo
              : `https://resume-maker-lc.onrender.com${res.data.photo}`
          );
        }
      }
    } catch (err) {
      console.error("Error fetching contact", err);
    }
  };

  fetchContactData();
}, []);

  // -------- Render Middle Content ----------
  const renderContent = () => {
    const SelectedResumeComponent = templateComponents[selectedTemplate] || Resume1;
    
    return (
      <Box display="flex" height="100%">
        <Box width="50%" p={2} sx={{ overflowY: "auto" }}>
          {(() => {
            switch (selectedMenu) {
              case "templates":
                return (
                  <TemplatesComponent 
                    selectedTemplate={selectedTemplate}
                    setSelectedTemplate={setSelectedTemplate}
                    selectedColor={designSettings.color}
                    setSelectedColor={(color) => setDesignSettings({...designSettings, color})}
                  />
                );
              case "design":
                return (
                  <DesignFormattingComponent 
                    designSettings={designSettings}
                    setDesignSettings={setDesignSettings}
                  />
                );
              case "add":
                return <AddSectionComponent />;
              case "spell":
                // Using the imported SpellCheckComponent
                return <SpellCheckComponent 
                  resumeContent={resumeContent} 
                  onCorrection={handleSpellCorrection}
                  onHighlight={handleHighlightErrors}
                />;
              default:
                return (
                  <DesignFormattingComponent 
                    designSettings={designSettings}
                    setDesignSettings={setDesignSettings}
                  />
                );
            }
          })()}
        </Box>

        <Box 
          width="95%" 
          p={2} 
          sx={{ 
            overflowY: "auto", 
            borderLeft: "1px solid #ccc",
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start",
          }}
        >
          <Box 
            id="resume-preview" 
            sx={{ 
              transform: `scale(${scale})`,
              transformOrigin: "top center",
              transition: "transform 0.2s ease-in-out",
              width: "100%",
            }}
          >
            <SelectedResumeComponent
             {...getResumeProps()}
              theme={{ 
                primary: designSettings.color, 
                dark: getDarkColor(designSettings.color) 
              }}
              color={designSettings.color}
              font={designSettings.font}
              fontSize={designSettings.fontSize}
              fontStyle={designSettings.fontStyle}
              headingSize={designSettings.headingSize}
              sectionSpacing={designSettings.sectionSpacing}
              paragraphSpacing={designSettings.paragraphSpacing}
              lineSpacing={designSettings.lineSpacing}
              topBottomMargin={designSettings.topBottomMargin}
              sideMargins={designSettings.sideMargins}
              paragraphIndent={designSettings.paragraphIndent}
              lineWeight={designSettings.lineWeight}
              pageSize={designSettings.pageSize}
            />
           
          </Box>
        </Box>
      </Box>
    );
  };

  // Sidebar button styles
  const verticalButtonStyles = {
    borderRadius: "6px",
    mb: 1,
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    "& .MuiListItemIcon-root": { minWidth: "auto", mb: 0.5 },
    "&.Mui-selected": {
      bgcolor: "#e3f2fd",
      color: "#1976d2",
      "& .MuiListItemIcon-root": { color: "#1976d2" },
    },
  };

  return (
    <Box display="flex" flexDirection="column" height="100vh">
      <AppBar position="static" elevation={0} sx={{ bgcolor: "#fff", color: "#000" }}>
        <Toolbar sx={{ minHeight: 48, px: 0 }}>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>📝 {resumeName}</Typography>
          {misspelledWords.length > 0 && selectedMenu !== "spell" && (
            <Alert severity="error" sx={{ py: 0, mr: 2 }}>
              {misspelledWords.length} spelling errors found
            </Alert>
          )}
        </Toolbar>
      </AppBar>

      <Box display="flex" flex={1}>
        <Box width="90px" sx={{ bgcolor: "#f8f9fa", p: 2, borderRight: "1px solid #ccc" }}>
          <Typography variant="caption" sx={{ ml: 1, mt: 2, color: "gray" }}>CUSTOMIZE</Typography>
          <List>
            <ListItemButton selected={selectedMenu === "templates"} onClick={() => setSelectedMenu("templates")} sx={verticalButtonStyles}>
              <ListItemIcon><FaFileAlt size={20} /></ListItemIcon>
              <ListItemText primary="Templates" primaryTypographyProps={{ fontSize: "0.75rem" }} />
            </ListItemButton>
            <ListItemButton selected={selectedMenu === "design"} onClick={() => setSelectedMenu("design")} sx={verticalButtonStyles}>
              <ListItemIcon><MdOutlineDesignServices size={22} /></ListItemIcon>
              <ListItemText primary="Design" primaryTypographyProps={{ fontSize: "0.75rem" }} />
            </ListItemButton>
          </List>
          <Typography variant="caption" sx={{ ml: 1, mt: 2, color: "gray" }}>TOOLS</Typography>
          <List>
            <ListItemButton selected={selectedMenu === "add"} onClick={() => setSelectedMenu("add")} sx={verticalButtonStyles}>
              <ListItemIcon><MdFormatListBulletedAdd size={22} /></ListItemIcon>
              <ListItemText primary="Add" primaryTypographyProps={{ fontSize: "0.75rem" }} />
            </ListItemButton>
            <ListItemButton 
              selected={selectedMenu === "spell"} 
              onClick={() => setSelectedMenu("spell")} 
              sx={{
                ...verticalButtonStyles,
                ...(misspelledWords.length > 0 && { color: 'error.main' })
              }}
            >
              <ListItemIcon>
                <MdSpellcheck size={22} color={misspelledWords.length > 0 ? 'error' : 'inherit'} />
              </ListItemIcon>
              <ListItemText 
                primary="Spell" 
                primaryTypographyProps={{ 
                  fontSize: "0.75rem",
                  color: misspelledWords.length > 0 ? 'error.main' : 'inherit'
                }} 
              />
              {misspelledWords.length > 0 && (
                <Chip 
                  label={misspelledWords.length} 
                  size="small" 
                  color="error" 
                  sx={{ position: 'absolute', top: 4, right: 4, height: 16, minWidth: 16 }} 
                />
              )}
            </ListItemButton>
          </List>
        </Box>

        <Box flex={1} p={1} sx={{ height: "100vh", overflow: "hidden" }}>
          {renderContent()}
        </Box>

        <Box width="120px" display="flex" flexDirection="column" alignItems="center" sx={{ borderLeft: "1px solid #ddd", p: 2 }}>
          <Box display="flex" flexDirection="column" alignItems="center" mb={2}>
            <Typography variant="caption" sx={{ mb: 1 }}>Zoom: {Math.round(scale * 100)}%</Typography>
            <Box display="flex" gap={1}>
              <IconButton 
                size="small" 
                onClick={handleZoomOut} 
                disabled={scale <= 0.5}
                sx={{ border: "1px solid #ddd" }}
              >
                <ZoomOut fontSize="small" />
              </IconButton>
              <IconButton 
                size="small" 
                onClick={handleZoomIn} 
                disabled={scale >= 2}
                sx={{ border: "1px solid #ddd" }}
              >
                <ZoomIn fontSize="small" />
              </IconButton>
            </Box>
          </Box>
          
          <Box display="flex" flexDirection="column" alignItems="center" mb={2}>
            <IconButton color="primary" onClick={() => setResumeNameDialogOpen(true)}>
              <Title />
            </IconButton>
            <Typography variant="caption">Edit Name</Typography>
          </Box>
          
          <Box display="flex" flexDirection="column" alignItems="center" mb={2}>
            <IconButton color="primary" onClick={() => setDownloadDialogOpen(true)}>
              <Download />
            </IconButton>
            <Typography variant="caption">Download</Typography>
          </Box>
          <Box display="flex" flexDirection="column" alignItems="center" mb={2}>
            <IconButton color="primary" onClick={handlePrint}>
              <Print />
            </IconButton>
            <Typography variant="caption">Print</Typography>
          </Box>
          <Box display="flex" flexDirection="column" alignItems="center" mb={2}>
            <IconButton color="primary"><Email /></IconButton>
            <Typography variant="caption">Email</Typography>
          </Box>
          <Button variant="contained" color="secondary" sx={{ mt: 3, borderRadius: "30px", px: 3 }}>Finish</Button>
        </Box>
      </Box>

      <Dialog open={downloadDialogOpen} onClose={() => setDownloadDialogOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Download Resume</DialogTitle>
        <DialogContent>
          <TextField fullWidth label="File Name" value={fileName} onChange={(e) => setFileName(e.target.value)} sx={{ my: 2 }} />
          <RadioGroup value={fileFormat} onChange={(e) => setFileFormat(e.target.value)}>
            <FormControlLabel value="pdf" control={<Radio />} label="PDF (.pdf)" />
            <FormControlLabel value="png" control={<Radio />} label="PNG (.png)" />
            <FormControlLabel value="txt" control={<Radio />} label="Text (.txt)" />
          </RadioGroup>
        </DialogContent>
        <DialogActions sx={{ display: "flex", flexDirection: "row", gap: 2, px: 3, pb: 3 }}>
          <Button onClick={() => setDownloadDialogOpen(false)} sx={{
            borderRadius: "12px",
            px: 3,
            py: 1.5,
            textTransform: "none",
            borderColor: "#2575fc",
            color: "#6a11cb",
            fontWeight: "bold",
            width: "50%",
          }}>Cancel</Button>
          <Button variant="contained" onClick={() => handleDownload(fileFormat)} sx={{
            background: "linear-gradient(to right, #6a11cb, #2575fc)",
            color: "#fff",
            fontWeight: "bold",
            px: 3,
            py: 1.5,
            borderRadius: "12px",
            width: "50%",
            "&:hover": {
              background: "linear-gradient(to right, #2575fc, #6a11cb)",
            },
          }}>Download</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={resumeNameDialogOpen} onClose={() => setResumeNameDialogOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Edit Resume Name</DialogTitle>
        <DialogContent>
          <TextField 
            fullWidth 
            label="Resume Name" 
            value={resumeName} 
            onChange={(e) => setResumeName(e.target.value)} 
            sx={{ my: 2 }} 
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setResumeNameDialogOpen(false)}>
                    <Title />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </DialogContent>
        <DialogActions sx={{ display: "flex", flexDirection: "row", gap: 2, px: 3, pb: 3 }}>
          <Button onClick={() => setResumeNameDialogOpen(false)} sx={{
            borderRadius: "12px",
            px: 3,
            py: 1.5,
            textTransform: "none",
            borderColor: "#2575fc",
            color: "#6a11cb",
            fontWeight: "bold",
            width: "50%",
          }}>Cancel</Button>
          <Button variant="contained" onClick={() => setResumeNameDialogOpen(false)} sx={{
            background: "linear-gradient(to right, #6a11cb, #2575fc)",
            color: "#fff",
            fontWeight: "bold",
            px: 3,
            py: 1.5,
            borderRadius: "12px",
            width: "50%",
            "&:hover": {
              background: "linear-gradient(to right, #2575fc, #6a11cb)",
            },
          }}>Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ResumeEditor;