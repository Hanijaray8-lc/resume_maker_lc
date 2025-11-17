import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  TextField,
  Checkbox,
  FormControlLabel,
  IconButton,
  MenuItem,
  Tooltip,
  useTheme,
  useMediaQuery,
  Drawer,
} from "@mui/material";
import {
  Edit,
  Delete,
  FormatBold,
  FormatItalic,
  FormatUnderlined,
  FormatListBulleted,
  Link,
  Undo,
  Redo,
  Menu as MenuIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import Sidebar from "../Sidebar";

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


const WorkExperienceList = () => {
  const [works, setWorks] = useState([]);
  const [showForm, setShowForm] = useState(false);

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

  const [editingIndex, setEditingIndex] = useState(null);
  const [form, setForm] = useState({
    jobTitle: "",
    employer: "",
    companyName: "",
    location: "",
    startMonth: "",
    startYear: "",
    endMonth: "",
    endYear: "",
    current: false,
    description: "",
  });
  const [history, setHistory] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [selectedTheme, setSelectedTheme] = useState(null);

  useEffect(() => {
    if (location.state) {
      const { selectedTemplate: template, selectedTheme: theme } = location.state;
      if (template) setSelectedTemplate(template);
      if (theme) setSelectedTheme(theme);
    }
  }, [location.state]);

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 50 }, (_, i) => currentYear - i);

  // ✅ Load from localStorage
  useEffect(() => {
    const savedWorks = localStorage.getItem("workExperiences");
    const singleWork = localStorage.getItem("workExperience");
    
    let allWorks = [];
    
    if (savedWorks) {
      allWorks = JSON.parse(savedWorks);
    }
    
    if (singleWork) {
      const workData = JSON.parse(singleWork);
      
      // Ensure all required fields exist with default values
      const completeWorkData = {
        jobTitle: workData.jobTitle || "",
        employer: workData.employer || "",
        companyName: workData.companyName || "",
        location: workData.location || "",
        startMonth: workData.startMonth || "",
        startYear: workData.startYear || "",
        endMonth: workData.endMonth || "",
        endYear: workData.endYear || "",
        current: workData.current || false,
        description: workData.description || "",
      };
      
      const exists = allWorks.some(work => 
        work.jobTitle === completeWorkData.jobTitle && 
        work.employer === completeWorkData.employer &&
        work.startYear === completeWorkData.startYear
      );
      
      if (!exists) {
        allWorks.push(completeWorkData);
        localStorage.setItem("workExperiences", JSON.stringify(allWorks));
        localStorage.removeItem("workExperience");
      }
    }
    
    setWorks(allWorks);
  }, []);

  // ✅ Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // ✅ Text formatting functions
  const applyFormat = (startTag, endTag) => {
    const textarea = document.getElementById("description-textarea");
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = form.description.substring(start, end);
    const newText =
      form.description.substring(0, start) +
      startTag +
      selectedText +
      endTag +
      form.description.substring(end);

    setHistory([...history, form.description]);
    setForm(prev => ({ ...prev, description: newText }));
    setRedoStack([]);
  };

  const undo = () => {
    if (history.length === 0) return;
    const prev = history[history.length - 1];
    setRedoStack([form.description, ...redoStack]);
    setHistory(history.slice(0, -1));
    setForm(prev => ({ ...prev, description: prev }));
  };

  const redo = () => {
    if (redoStack.length === 0) return;
    const next = redoStack[0];
    setHistory([...history, form.description]);
    setRedoStack(redoStack.slice(1));
    setForm(prev => ({ ...prev, description: next }));
  };

  // ✅ Format description text for display
  const formatDescription = (description) => {
    if (!description) return "";
    
    return description
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/<u>(.*?)<\/u>/g, '<u>$1</u>')
      .replace(/\n/g, '<br/>');
  };

  // ✅ Save to localStorage
  const saveToLocalStorage = (updatedWorks) => {
    setWorks(updatedWorks);
    localStorage.setItem("workExperiences", JSON.stringify(updatedWorks));
  };

  // ✅ Handle form submission (add or update)
  const handleSave = () => {
    let updatedWorks;
    
    if (editingIndex !== null) {
      updatedWorks = [...works];
      updatedWorks[editingIndex] = form;
    } else {
      updatedWorks = [...works, form];
    }
    
    saveToLocalStorage(updatedWorks);
    resetForm();
  };

  // ✅ Edit a work experience
  const handleEdit = (index) => {
    setForm(works[index]);
    setEditingIndex(index);
    setShowForm(true);
    setHistory([]);
    setRedoStack([]);
  };

  // ✅ Delete a work experience
  const handleDelete = (index) => {
    const updatedWorks = works.filter((_, i) => i !== index);
    saveToLocalStorage(updatedWorks);
  };

  // ✅ Reset form
  const resetForm = () => {
    setForm({
      jobTitle: "",
      employer: "",
      companyName: "",
      location: "",
      startMonth: "",
      startYear: "",
      endMonth: "",
      endYear: "",
      current: false,
      description: "",
    });
    setEditingIndex(null);
    setShowForm(false);
    setHistory([]);
    setRedoStack([]);
  };

  const toggleMobileSidebar = () => {
    setMobileSidebarOpen(!mobileSidebarOpen);
  };

  return (
    <Box display="flex" minHeight="100vh">
      {/* Desktop Sidebar */}
      {!isMobile && <Sidebar />}

      {/* Mobile Sidebar Drawer */}
      {isMobile && (
        <>
          {/* Hamburger Menu Button */}
          <IconButton
            onClick={toggleMobileSidebar}
            sx={{
              position: "fixed",
              top: 16,
              left: 16,
              zIndex: 1300,
              backgroundColor: "white",
              boxShadow: 2,
              "&:hover": {
                backgroundColor: "grey.100",
              },
            }}
          >
            <MenuIcon />
          </IconButton>

          {/* Mobile Drawer */}
          <Drawer
            variant="temporary"
            open={mobileSidebarOpen}
            onClose={toggleMobileSidebar}
            ModalProps={{
              keepMounted: true,
            }}
            sx={{
              display: { xs: "block", md: "none" },
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: 280,
                backgroundColor: "#f5f5f5",
              },
            }}
          >
            <Sidebar onMobileClose={toggleMobileSidebar} />
          </Drawer>
        </>
      )}

      {/* Main Content */}
      <Container 
        maxWidth="lg" 
        sx={{ 
          py: isMobile ? 3 : 5, 
          ml: isMobile ? 0 : "300px",
          px: isSmallMobile ? 2 : 3,
          pt: isMobile ? 8 : 5,
        }}
      >
        {/* Header Section */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems={isMobile ? "flex-start" : "center"}
          mb={3}
          flexDirection={isMobile ? "column" : "row"}
          gap={isMobile ? 2 : 0}
        >
          <Typography 
            variant={isMobile ? "h5" : "h4"} 
            fontWeight="bold"
            sx={{ fontSize: isSmallMobile ? "1.5rem" : "1.5rem" }}
          >
            Work Experiences
          </Typography>
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#e91e63",
              "&:hover": { backgroundColor: "#d81b60" },
              width: isMobile ? "100%" : "auto",
              maxWidth: isMobile ? "250px" : "none",
            }}
            onClick={() => setShowForm(true)}
          >
            + Add Work Experience
          </Button>
        </Box>

        {/* ✅ Show form if button clicked */}
        {showForm && (
          <Box
            sx={{
              p: isMobile ? 2 : 3,
              mb: 3,
              border: "1px solid #ccc",
              borderRadius: 2,
              background: "#f9f9f9",
            }}
          >
            <Typography variant={isMobile ? "h6" : "h5"} mb={2}>
              {editingIndex !== null ? "Edit Work Experience" : "Add Work Experience"}
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Job Title"
                  name="jobTitle"
                  value={form.jobTitle}
                  onChange={handleChange}
                  required
                                    sx={{width:{md:"250px",xs:"300px"}}}

                  size={isSmallMobile ? "small" : "medium"}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Employer"
                  name="employer"
                  value={form.employer}
                  onChange={handleChange}
                  required
                                    sx={{width:{md:"250px",xs:"300px"}}}

                  size={isSmallMobile ? "small" : "medium"}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Company Name"
                  name="companyName"
                  value={form.companyName}
                                    sx={{width:{md:"250px",xs:"300px"}}}

                  onChange={handleChange}
                  size={isSmallMobile ? "small" : "medium"}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Location"
                  name="location"
                  value={form.location}
                                    sx={{width:{md:"250px",xs:"300px"}}}

                  onChange={handleChange}
                  size={isSmallMobile ? "small" : "medium"}
                />
              </Grid>
              
              {/* Start Date */}
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  select
                  label="Start Month"
                  name="startMonth"
                  value={form.startMonth}
                  onChange={handleChange}
                  required
                  sx={{width:{md:"250px",xs:"300px"}}}
                  size={isSmallMobile ? "small" : "medium"}
                >
                  {months.map((month) => (
                    <MenuItem key={month} value={month}>
                      {month}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  select
                  label="Start Year"
                  name="startYear"
                  value={form.startYear}
                  onChange={handleChange}
                  required
                                    sx={{width:{md:"250px",xs:"300px"}}}

                  size={isSmallMobile ? "small" : "medium"}
                >
                  {years.map((year) => (
                    <MenuItem key={year} value={year}>
                      {year}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              
              {/* End Date */}
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  select
                  label="End Month"
                  name="endMonth"
                  value={form.endMonth}
                  onChange={handleChange}
                  disabled={form.current}
                                    sx={{width:{md:"250px",xs:"300px"}}}

                  size={isSmallMobile ? "small" : "medium"}
                >
                  {months.map((month) => (
                    <MenuItem key={month} value={month}>
                      {month}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  select
                  label="End Year"
                  name="endYear"
                  value={form.endYear}
                                    sx={{width:{md:"250px",xs:"300px"}}}

                  onChange={handleChange}
                  disabled={form.current}
                  size={isSmallMobile ? "small" : "medium"}
                >
                  {years.map((year) => (
                    <MenuItem key={year} value={year}>
                      {year}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={form.current}
                      onChange={handleChange}
                      name="current"
                      size={isSmallMobile ? "small" : "medium"}
                    />
                  }
                  label="I currently work here"
                />
              </Grid>
              
              {/* Rich Text Editor for Description */}
              <Grid item xs={12}>
                <Typography variant="subtitle2" gutterBottom>
                  Description
                </Typography>
                <Box border={1} borderColor="grey.400" borderRadius={1} p={1}>
                  <Box 
                    display="flex" 
                    gap={1} 
                    mb={1} 
                    flexWrap="wrap"
                    justifyContent={isSmallMobile ? "center" : "flex-start"}
                  >
                    <Tooltip title="Bold">
                      <IconButton size="small" onClick={() => applyFormat("**", "**")}>
                        <FormatBold fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Italic">
                      <IconButton size="small" onClick={() => applyFormat("*", "*")}>
                        <FormatItalic fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Underline">
                      <IconButton size="small" onClick={() => applyFormat("<u>", "</u>")}>
                        <FormatUnderlined fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Bullet List">
                      <IconButton size="small" onClick={() => applyFormat("\n- ", "")}>
                        <FormatListBulleted fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Insert Link">
                      <IconButton size="small" onClick={() => applyFormat("[", "](https://)")}>
                        <Link fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Undo">
                      <IconButton size="small" onClick={undo} disabled={history.length === 0}>
                        <Undo fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Redo">
                      <IconButton size="small" onClick={redo} disabled={redoStack.length === 0}>
                        <Redo fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                  
                  <TextField
                    id="description-textarea"
                    fullWidth
                    multiline
                    rows={isSmallMobile ? 3 : 4}
                    name="description"
                    value={form.description || ""}
                    onChange={handleChange}
                    variant="outlined"
                    placeholder="Describe your responsibilities and achievements..."
                    size={isSmallMobile ? "small" : "medium"}
                  />
                </Box>
              </Grid>
            </Grid>
            <Box mt={2} display="flex" gap={2} flexDirection={isSmallMobile ? "column" : "row"}>
              <Button 
                variant="contained" 
                onClick={handleSave}
                disabled={!form.jobTitle || !form.employer || !form.startMonth || !form.startYear}
                sx={{ width: isSmallMobile ? "100%" : "auto" }}
              >
                {editingIndex !== null ? "Update" : "Save"}
              </Button>
              <Button 
                variant="outlined" 
                onClick={resetForm}
                sx={{ width: isSmallMobile ? "100%" : "auto" }}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        )}

        {/* 🔥 Scrollable List */}
        <Box
          sx={{
            maxHeight: isMobile ? "400px" : "500px",
            overflowY: "auto",
            pr: 1,
          }}
        >
          <Grid container spacing={2}>
            {Array.isArray(works) && works.length > 0 ? (
              works.map((work, index) => (
                <Grid item xs={12} key={index}>
                  <Card 
                    sx={{ 
                      boxShadow: 2, 
                      borderRadius: 2, 
                      width: "100%",
                      maxWidth: "100%",
                    }}
                  >
                    <CardContent sx={{ p: isSmallMobile ? 2 : 3 }}>
                      <Box 
                        display="flex" 
                        justifyContent="space-between" 
                        alignItems="flex-start"
                        flexDirection={isSmallMobile ? "column" : "row"}
                        gap={isSmallMobile ? 2 : 0}
                      >
                        <Box sx={{ width: isSmallMobile ? "100%" : "85%" }}>
                          <Typography 
                            variant={isSmallMobile ? "h6" : "h6"} 
                            fontWeight="bold"
                            sx={{ fontSize: isSmallMobile ? "1rem" : "1.25rem" }}
                          >
                            {work.jobTitle} @ {work.employer}
                          </Typography>
                          <Typography 
                            variant="subtitle2" 
                            color="text.secondary"
                            sx={{ fontSize: isSmallMobile ? "0.8rem" : "0.875rem" }}
                          >
                            {work.companyName} {work.companyName && work.location ? "|" : ""} {work.location}
                          </Typography>
                          <Typography 
                            variant="body2" 
                            color="text.secondary"
                            sx={{ fontSize: isSmallMobile ? "0.75rem" : "0.875rem" }}
                          >
                            {work.startMonth} {work.startYear} –{" "}
                            {work.current
                              ? "Present"
                              : `${work.endMonth || ""} ${work.endYear || ""}`}
                          </Typography>
                          {work.description && (
                            <Typography 
                              variant="body1" 
                              mt={1}
                              sx={{ 
                                whiteSpace: 'pre-wrap',
                                fontSize: isSmallMobile ? "0.875rem" : "1rem",
                                '& strong': { fontWeight: 'bold' },
                                '& em': { fontStyle: 'italic' },
                                '& u': { textDecoration: 'underline' }
                              }}
                              dangerouslySetInnerHTML={{ 
                                __html: formatDescription(work.description)
                              }}
                            />
                          )}
                        </Box>
                        <Box 
                          display="flex" 
                          gap={1}
                          sx={{ 
                            width: isSmallMobile ? "100%" : "auto",
                            justifyContent: isSmallMobile ? "flex-end" : "flex-start"
                          }}
                        >
                          <IconButton 
                            color="primary" 
                            onClick={() => handleEdit(index)}
                            aria-label="edit"
                            size={isSmallMobile ? "small" : "medium"}
                          >
                            <Edit fontSize={isSmallMobile ? "small" : "medium"} />
                          </IconButton>
                          <IconButton 
                            color="error" 
                            onClick={() => handleDelete(index)}
                            aria-label="delete"
                            size={isSmallMobile ? "small" : "medium"}
                          >
                            <Delete fontSize={isSmallMobile ? "small" : "medium"} />
                          </IconButton>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))
            ) : (
              <Grid item xs={12}>
                <Typography 
                  textAlign="center" 
                  color="text.secondary"
                  sx={{ fontSize: isSmallMobile ? "0.875rem" : "1rem" }}
                >
                  No work experiences found
                </Typography>
              </Grid>
            )}
          </Grid>
        </Box>

        {/* ✅ Go Back and Next buttons */}
        <Box 
          display="flex" 
          justifyContent="space-between" 
          mt={4}
          flexDirection={isSmallMobile ? "column" : "row"}
          gap={isSmallMobile ? 2 : 0}
        >
          <Button 
            variant="outlined" 
            onClick={() => navigate(-1)}
            sx={{ width: isSmallMobile ? "100%" : "auto" }}
          >
            Go Back
          </Button>
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#e91e63",
              "&:hover": { backgroundColor: "#d81b60" },
              width: isSmallMobile ? "100%" : "auto",
            }}
            onClick={() =>
              navigate("/EducationTips", {
                state: { selectedTemplate, selectedTheme },
              })
            }
          >
            Next
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default WorkExperienceList;