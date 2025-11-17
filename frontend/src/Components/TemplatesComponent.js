import React, { useState, useEffect } from "react";
import { Box, Typography, Grid, IconButton, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Snackbar, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import DownloadIcon from "@mui/icons-material/Download";
import DeleteIcon from "@mui/icons-material/Delete";

// Import resume templates
import Resume1 from "./DuplicateResume/Resume1";
import Resume2 from "./DuplicateResume/Resume2";
import Resume3 from "./DuplicateResume/Resume3";
import Resume4 from "./DuplicateResume/Resume4";
import Resume5 from "./DuplicateResume/Resume5";
import Resume6 from "./DuplicateResume/Resume6";
import Resume7 from "./DuplicateResume/Resume7";
import Resume8 from "./DuplicateResume/Resume8";
import Resume9 from "./DuplicateResume/Resume9";
import Resume10 from "./DuplicateResume/Resume10";
import Resume11 from "./DuplicateResume/Resume11";
import Resume12 from "./DuplicateResume/Resume12";
import Resume13 from "./DuplicateResume/Resume13";
import Resume14 from "./DuplicateResume/Resume14";
import Resume15 from "./DuplicateResume/Resume15";
import Resume16 from "./DuplicateResume/Resume16";
import Resume17 from "./DuplicateResume/Resume17";
import Resume18 from "./DuplicateResume/Resume18";
import Resume19 from "./DuplicateResume/Resume19";
import Resume20 from "./DuplicateResume/Resume20";
import Resume21 from "./Resume/Resume21";

const templates = [
  { id: 1, component: Resume1, name: "Template 1" },
  { id: 2, component: Resume2, name: "Template 2" },
  { id: 3, component: Resume3, name: "Template 3" },
  { id: 4, component: Resume4, name: "Template 4" },
  { id: 5, component: Resume5, name: "Template 5" },
  { id: 6, component: Resume6, name: "Template 6" },
  { id: 7, component: Resume7, name: "Template 7" },
  { id: 8, component: Resume8, name: "Template 8" },
  { id: 9, component: Resume9, name: "Template 9" },
  { id: 10, component: Resume10, name: "Template 10" },
  { id: 11, component: Resume11, name: "Template 11" },
  { id: 12, component: Resume12, name: "Template 12" },
  { id: 13, component: Resume13, name: "Template 13" },
  { id: 14, component: Resume14, name: "Template 14" },
  { id: 15, component: Resume15, name: "Template 15" },
  { id: 16, component: Resume16, name: "Template 16" },
  { id: 17, component: Resume17, name: "Template 17" },
  { id: 18, component: Resume18, name: "Template 18" },
  { id: 19, component: Resume19, name: "Template 19" },
  { id: 20, component: Resume20, name: "Template 20" },
  { id: 21, component: Resume21, name: "Template 21" },
];

// Palette definitions
const resumeThemes = [
  ["#f57c00", "#1a2b47", "#6a1b9a", "#2e7d32", "#d32f2f"],
  ["#bfaeb2", "#1a2b47", "#2e7d32", "#6a1b9a", "#c62828"],
  [
    { bg: "#f5f5f5", primary: "#2c3e50" },
    { bg: "#fff0f0", primary: "#c0392b" },
    { bg: "#f0fff0", primary: "#27ae60" },
    { bg: "#f0f8ff", primary: "#2980b9" },
    { bg: "#fcf3cf", primary: "#f39c12" },
  ],
  [
    { primary: "#b83232", dark: "#5c0606ff" },
    { primary: "#1e88e5", dark: "#0d47a1" },
    { primary: "#43a047", dark: "#1b5e20" },
    { primary: "#fbc02d", dark: "#f57f17" },
    { primary: "#8e24aa", dark: "#4a148c" },
  ],
  // ... (include all your existing theme definitions)
];

const TemplatesComponent = ({
  selectedTemplate,
  setSelectedTemplate,
  selectedColor,
  setSelectedColor,
}) => {
  const navigate = useNavigate();
  const [resumeDefaultColor] = useState(selectedColor || "#1976d2");
  const [resumeHistory, setResumeHistory] = useState([]);
  const [loadingPrefs, setLoadingPrefs] = useState(true);
  const [selectedThemes, setSelectedThemes] = useState(
    resumeThemes.map((palette) => palette[0])
  );
  
  // Delete confirmation dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [resumeToDelete, setResumeToDelete] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  // Fetch saved resume history
  useEffect(() => {
    fetchResumeHistory();
  }, []);

  const fetchResumeHistory = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoadingPrefs(false);
        return;
      }

      const res = await fetch("https://resume-maker-lc.onrender.com/api/resumes/history", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        console.warn("Failed to fetch history:", res.status);
        setLoadingPrefs(false);
        return;
      }

      const data = await res.json();
      if (Array.isArray(data)) setResumeHistory(data);
    } catch (err) {
      console.error("Error fetching resume history:", err);
      showSnackbar("Error loading resume history", "error");
    } finally {
      setLoadingPrefs(false);
    }
  };

  // Helper to build props accepted by individual Resume components
  const buildResumeProps = (id, theme) => {
    const idx = id - 1;
    const chosen = theme ?? resumeDefaultColor;

    switch (idx) {
      case 1: // Resume2
        return { color: typeof chosen === "string" ? chosen : chosen.primary || chosen };
      case 2: // Resume3
        return { color: typeof chosen === "string" ? chosen : chosen.primary || chosen };
      case 3: // Resume4
        return {
          theme: typeof chosen === "object" ? chosen : { primary: chosen },
          color: (typeof chosen === "object" && chosen.primary) ? chosen.primary : chosen,
        };
      case 6: // Resume7
        return {
          theme: typeof chosen === "object" ? chosen : { mainBg: chosen },
          color: (typeof chosen === "object" && chosen.highlight) ? chosen.highlight : (chosen.primary || chosen),
        };
      case 7: // Resume8
        return {
          theme: typeof chosen === "object" ? chosen : { primary: chosen },
        };
      default:
        return { color: typeof chosen === "string" ? chosen : chosen.primary || chosen.highlight || chosen };
    }
  };

  const handleTemplateClick = (templateId, theme, resumeData = null) => {
    if (typeof setSelectedTemplate === "function") {
      setSelectedTemplate(templateId);
    }

    if (typeof setSelectedColor === "function") {
      setSelectedColor(theme);
    }

    // Optional: Add navigation if needed
    // navigate("/mainpage", {
    //   state: {
    //     templateId,
    //     themeColor: theme,
    //     resumeData: resumeData || null,
    //   },
    // });
  };

  const handleEditClick = (templateId, theme, resumeData = null) => {
    if (typeof setSelectedTemplate === "function") {
      setSelectedTemplate(templateId);
    }

    if (typeof setSelectedColor === "function") {
      setSelectedColor(theme);
    }

    navigate("/mainpage", {
      state: {
        selectedTemplate: templateId,
        selectedTheme: theme,
        resumeData: resumeData || null,
        isEditing: true,
      },
    });
  };

  const handleDownloadClick = async (templateId, theme, resumeData = null) => {
    try {
      const template = templates.find(t => t.id === templateId);
      if (!template) return;

      console.log("Generating PDF for template:", templateId);
      
      // Simulate PDF generation
      const pdfBlob = await generatePDF(templateId, theme, resumeData);
      
      // Create download link
      const url = URL.createObjectURL(pdfBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `resume-template-${templateId}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Error generating PDF. Please try again.");
    }
  };

  // Placeholder function for PDF generation
  const generatePDF = async (templateId, theme, resumeData) => {
    // This is where you would integrate with a PDF generation library
    // For now, return a mock blob
    return new Blob(['Mock PDF content'], { type: 'application/pdf' });
  };

  // Delete resume function
  const deleteResume = async (resumeId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        showSnackbar("Authentication required", "error");
        return;
      }

      const res = await fetch(`https://resume-maker-lc.onrender.com/api/resumes/${resumeId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        throw new Error("Failed to delete resume");
      }

      // Remove from local state
      setResumeHistory(prev => prev.filter(item => item._id !== resumeId));
      showSnackbar("Resume deleted successfully", "success");
      
    } catch (error) {
      console.error("Error deleting resume:", error);
      showSnackbar("Error deleting resume", "error");
    } finally {
      setDeleteDialogOpen(false);
      setResumeToDelete(null);
    }
  };

  // Handle delete click
  const handleDeleteClick = (resumeData, e) => {
    e.stopPropagation();
    setResumeToDelete(resumeData);
    setDeleteDialogOpen(true);
  };

  // Confirm delete
  const confirmDelete = () => {
    if (resumeToDelete) {
      deleteResume(resumeToDelete._id);
    }
  };

  // Cancel delete
  const cancelDelete = () => {
    setDeleteDialogOpen(false);
    setResumeToDelete(null);
  };

  // Show snackbar notification
  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const onPalettePick = (tplIndex, colorOrObj) => {
    setSelectedThemes((prev) => prev.map((v, i) => (i === tplIndex ? colorOrObj : v)));
  };

  const renderTemplateCard = (template, chosenTheme, resumeData = null, isHistory = false, index = 0) => {
    const TemplateComp = template.component;
    const tplIndex = template.id - 1;
    const previewProps = buildResumeProps(template.id, chosenTheme);

    return (
      <Grid item xs={6} key={resumeData?._id || template.id}>
        <Box
          sx={{
            border: selectedTemplate === template.id ? "2px solid #1976d2" : "1px solid #ccc",
            borderRadius: "8px",
            cursor: "pointer",
            "&:hover": { boxShadow: 3 },
            height: "320px",
            width: "170px",
            overflow: "hidden",
            position: "relative",
            p: 0.5,
          }}
        >
          {/* Template Preview */}
          <Box
            onClick={() => {
              handleTemplateClick(template.id, chosenTheme, resumeData);
            }}
            sx={{
              transform: "scale(0.18)",
              transformOrigin: "top left",
              width: "850px",
              height: "1100px",
            }}
          >
            <TemplateComp {...previewProps} />
          </Box>

          {/* Template Name */}
          <Typography
            variant="caption"
            align="center"
            sx={{
              position: "absolute",
              bottom: isHistory ? 40 : 28,
              left: 0,
              right: 0,
              py: 0.5,
              bgcolor: "#fff",
              borderTop: "1px solid #ccc",
              fontSize: 11,
            }}
          >
            {isHistory && resumeData?.fileName
              ? `${resumeData.fileName}`
              : template.name}
          </Typography>

          {/* Action Buttons */}
          <Box
            sx={{
              position: "absolute",
              top: 4,
              right: 4,
              display: "flex",
              gap: 0.5,
              opacity: 0.8,
              "&:hover": { opacity: 1 },
            }}
          >
            {/* Edit Button */}
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                handleEditClick(template.id, chosenTheme, resumeData);
              }}
              sx={{
                bgcolor: "primary.main",
                color: "white",
                "&:hover": { bgcolor: "primary.dark" },
                width: 24,
                height: 24,
              }}
            >
              <EditIcon sx={{ fontSize: 14 }} />
            </IconButton>

            {/* Download Button */}
            <IconButton
              size="small"
             onClick={(e) => {
                e.stopPropagation();
                handleEditClick(template.id, chosenTheme, resumeData);
              }}
              sx={{
                bgcolor: "success.main",
                color: "white",
                "&:hover": { bgcolor: "success.dark" },
                width: 24,
                height: 24,
              }}
            >
              <DownloadIcon sx={{ fontSize: 14 }} />
            </IconButton>

            {/* Delete Button - Only show for history items */}
            {isHistory && (
              <IconButton
                size="small"
                onClick={(e) => handleDeleteClick(resumeData, e)}
                sx={{
                  bgcolor: "error.main",
                  color: "white",
                  "&:hover": { bgcolor: "error.dark" },
                  width: 24,
                  height: 24,
                }}
              >
                <DeleteIcon sx={{ fontSize: 14 }} />
              </IconButton>
            )}
          </Box>

          {/* Latest Badge for History Items */}
          {isHistory && index === 0 && (
            <Box
              sx={{
                position: "absolute",
                top: 4,
                left: 4,
                bgcolor: "#1976d2",
                color: "white",
                fontSize: "10px",
                px: 1,
                py: 0.2,
                borderRadius: "4px",
              }}
            >
              Latest
            </Box>
          )}

          {/* Color Palette - You can add this back if needed */}
        </Box>
      </Grid>
    );
  };

  return (
    <Box display="flex" flex={1} height="100%">
      <Box
        width="100%"
        p={2}
        sx={{ borderRight: "1px solid #ddd", flexShrink: 0, overflowY: "auto" }}
      >
        <Typography variant="h6" gutterBottom>
          Templates
        </Typography>

        {loadingPrefs ? (
          <Typography variant="body2">Loading preferences...</Typography>
        ) : resumeHistory.length > 0 ? (
          <>
            <Typography variant="subtitle2" color="text.secondary" mb={1}>
              Your Saved Resumes
            </Typography>
            <Grid container spacing={2}>
              {resumeHistory.map((item, index) => {
                const template = templates.find((t) => t.id === item.templateId) || templates[0];
                const tplIndex = template.id - 1;
                const chosenTheme = item.themeColor || selectedThemes[tplIndex] || resumeDefaultColor;

                return renderTemplateCard(template, chosenTheme, item, true, index);
              })}
            </Grid>
            
            {/* <Typography variant="subtitle2" color="text.secondary" mt={3} mb={1}>
              All Templates
            </Typography>
            <Grid container spacing={2}>
              {templates.map((tpl) => {
                const tplIndex = tpl.id - 1;
                const chosenTheme = selectedThemes[tplIndex] || resumeDefaultColor;
                return renderTemplateCard(tpl, chosenTheme);
              })}
            </Grid> */}
          </>
               ) : (
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            height="60vh"
          >
            <Typography variant="body1" color="text.secondary">
              No resumes found in your account.
            </Typography>
            <Typography variant="body2" color="text.secondary" mt={1}>
              Create and save your first resume to see it here.
            </Typography>
          </Box>
        )}

      </Box>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={cancelDelete}
        aria-labelledby="delete-dialog-title"
      >
        <DialogTitle id="delete-dialog-title">
          Delete Resume
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete "{resumeToDelete?.fileName}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelDelete} color="primary">
            Cancel
          </Button>
          <Button onClick={confirmDelete} color="error" variant="contained" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default TemplatesComponent;