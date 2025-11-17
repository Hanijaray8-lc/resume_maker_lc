import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  Box,
  Button,
  Grid,
  TextField,
  MenuItem,
  Typography,
  Paper,
  IconButton,
  Card,
  CardContent,
  useTheme,
  useMediaQuery,
  Drawer,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import Sidebar from "../Sidebar";

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
const years = Array.from({ length: 50 }, (_, i) => 1980 + i);

const degrees = [
  "High School Diploma",
  "Vocational Certificate or Diploma",
  "Associates",
  "Bachelors",
  "Masters",
  "Doctorate or Ph.D.",
];

const EducationSection = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("lg"));

  const [entries, setEntries] = useState([]);
  const [form, setForm] = useState({
    schoolName: "",
    schoolLocation: "",
    degree: "",
    fieldOfStudy: "",
    gradMonth: "",
    gradYear: "",
    additionalCoursework: "",
  });
  const [editMode, setEditMode] = useState(false);
  const [currentEditId, setCurrentEditId] = useState(null);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [entryToDelete, setEntryToDelete] = useState(null);

  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [selectedTheme, setSelectedTheme] = useState(null);

  useEffect(() => {
    if (location.state) {
      const { selectedTemplate: template, selectedTheme: theme } = location.state;
      if (template) setSelectedTemplate(template);
      if (theme) setSelectedTheme(theme);
    }
  }, [location.state]);

  // Fetch existing entries from localStorage
  useEffect(() => {
    fetchEducationEntries();
  }, []);

  const fetchEducationEntries = () => {
    const storedEntries = localStorage.getItem("educationEntries");
    if (storedEntries) {
      setEntries(JSON.parse(storedEntries));
    }
  };

  const saveEducationEntries = (entries) => {
    localStorage.setItem("educationEntries", JSON.stringify(entries));
    setEntries(entries);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAdd = () => {
    const newEntry = {
      id: Date.now(),
      ...form
    };
    
    const updatedEntries = [newEntry, ...entries];
    saveEducationEntries(updatedEntries);
    resetForm();
  };

  const handleEdit = (edu) => {
    setForm({
      schoolName: edu.schoolName,
      schoolLocation: edu.schoolLocation,
      degree: edu.degree,
      fieldOfStudy: edu.fieldOfStudy,
      gradMonth: edu.gradMonth,
      gradYear: edu.gradYear,
      additionalCoursework: edu.additionalCoursework,
    });
    setEditMode(true);
    setCurrentEditId(edu.id);
    
    // Scroll to form on mobile when editing
    if (isMobile) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleUpdate = () => {
    const updatedEntries = entries.map(entry => 
      entry.id === currentEditId 
        ? { id: currentEditId, ...form }
        : entry
    );
    
    saveEducationEntries(updatedEntries);
    resetForm();
  };

  const handleDeleteClick = (id) => {
    setEntryToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    const updatedEntries = entries.filter(e => e.id !== entryToDelete);
    saveEducationEntries(updatedEntries);
    setDeleteDialogOpen(false);
    setEntryToDelete(null);
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setEntryToDelete(null);
  };

  const resetForm = () => {
    setForm({
      schoolName: "",
      schoolLocation: "",
      degree: "",
      fieldOfStudy: "",
      gradMonth: "",
      gradYear: "",
      additionalCoursework: "",
    });
    setEditMode(false);
    setCurrentEditId(null);
  };

  const toggleMobileSidebar = () => {
    setMobileSidebarOpen(!mobileSidebarOpen);
  };

  return (
    <Box display="flex" minHeight="100vh" sx={{ backgroundColor: "#fafafa" }}>
      {/* Desktop Sidebar - Fixed width */}
      {!isMobile && (
        <Box sx={{ 
          width: "280px", 
          minWidth: "280px",
          flexShrink: 0,
          position: "fixed",
          left: 0,
          top: 0,
          height: "100vh",
          overflowY: "auto",
          zIndex: 1000
        }}>
          <Sidebar />
        </Box>
      )}

      {/* Mobile Sidebar Drawer */}
      {isMobile && (
        <>
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
            <Box sx={{ p: 2, display: "flex", justifyContent: "flex-end" }}>
              <IconButton onClick={toggleMobileSidebar}>
                <CloseIcon />
              </IconButton>
            </Box>
            <Sidebar onMobileClose={toggleMobileSidebar} />
          </Drawer>
        </>
      )}

      {/* Main Content - Properly spaced for desktop */}
      <Box sx={{ 
        flexGrow: 1,
        p: isSmallMobile ? 2 : isMobile ? 3 : 4,
        ml: isMobile ? 0 : "280px", // Match sidebar width
        width: isMobile ? "100%" : `calc(100% - 280px)`, // Calculate remaining width
        maxWidth: "1200px",
           ml: isMobile ? 0 : "320px",
      }}>
        {/* Header */}
        <Box sx={{ 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "space-between",
          mb: 3,
          flexDirection: isSmallMobile ? "column" : "row",
          gap: isSmallMobile ? 2 : 0
        }}>
          <Typography 
            variant={isMobile ? "h5" : "h4"} 
            fontWeight="bold"
            sx={{ 
              fontSize: isSmallMobile ? "1.5rem" : "inherit",
              textAlign: isSmallMobile ? "center" : "left"
            }}
          >
            Education Summary
          </Typography>
          
          {entries.length > 0 && (
            <Typography 
              variant="body2" 
              color="textSecondary"
              sx={{ 
                fontSize: isSmallMobile ? "0.8rem" : "inherit",
                textAlign: isSmallMobile ? "center" : "left"
              }}
            >
              {entries.length} education {entries.length === 1 ? 'entry' : 'entries'}
            </Typography>
          )}
        </Box>

        {/* Education Form */}
        <Card sx={{ 
          mb: 4, 
          p: isSmallMobile ? 2 : 3,
          boxShadow: 2,
          borderRadius: 2
        }}>
          <CardContent sx={{ p: isSmallMobile ? 1 : 2 }}>
            <Typography 
              variant={isMobile ? "h6" : "h5"} 
              gutterBottom
              sx={{ 
                fontSize: isSmallMobile ? "1.1rem" : "inherit",
                mb: 3
              }}
            >
              {editMode ? "✏️ Edit Education" : "➕ Add New Education"}
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                                    sx={{width:"300px"}}

                  label="School Name"
                  name="schoolName"
                  value={form.schoolName}
                  onChange={handleChange}
                  required
                  size={isSmallMobile ? "small" : "medium"}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  sx={{width:"300px"}}
                  label="School Location"
                  name="schoolLocation"
                  value={form.schoolLocation}
                  onChange={handleChange}
                  required
                  size={isSmallMobile ? "small" : "medium"}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  select
                  label="Degree"
                  name="degree"
                  value={form.degree}
                  onChange={handleChange}
                          sx={{
    width: {
      xs: "225px", // 👈 mobile (extra small screens)
      sm: "200px", // 👈 small tablets
      md: "250px", // 👈 medium screens
      lg: "300px", // 👈 large desktop
    },
  }}
                  required
                  size={isSmallMobile ? "small" : "medium"}
                >
                  {degrees.map((degree) => (
                    <MenuItem key={degree} value={degree}>
                      {degree}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Field of Study"
                  name="fieldOfStudy"
                  value={form.fieldOfStudy}
                  onChange={handleChange}
                           sx={{
    width: {
      xs: "225px", // 👈 mobile (extra small screens)
      sm: "200px", // 👈 small tablets
      md: "250px", // 👈 medium screens
      lg: "300px", // 👈 large desktop
    },
  }}
                  size={isSmallMobile ? "small" : "medium"}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  select
                  label="Graduation Month"
                  name="gradMonth"
                  value={form.gradMonth}
                  onChange={handleChange}
                           sx={{
    width: {
    xs: "225px", // 👈 mobile (extra small screens)
      sm: "200px", // 👈 small tablets
      md: "250px", // 👈 medium screens
      lg: "300px", // 👈 large desktop
    },
  }}
                  size={isSmallMobile ? "small" : "medium"}
                >
                  {months.map((month) => (
                    <MenuItem key={month} value={month}>
                      {month}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  select
                  label="Graduation Year"
                  name="gradYear"
                  value={form.gradYear}
                  sx={{
    width: {
      xs: "225px", // 👈 mobile (extra small screens)
      sm: "200px", // 👈 small tablets
      md: "250px", // 👈 medium screens
      lg: "300px", // 👈 large desktop
    },
  }}
                  onChange={handleChange}
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
                <TextField
                  fullWidth
                  multiline
                  rows={isSmallMobile ? 2 : 3}
                  label="Additional Coursework"
                  name="additionalCoursework"
                  value={form.additionalCoursework}
                  onChange={handleChange}
                  size={isSmallMobile ? "small" : "medium"}
                  placeholder="List any relevant coursework, projects, or achievements..."
                />
              </Grid>
              
              <Grid item xs={12}>
                <Box sx={{ 
                  display: 'flex', 
                  gap: 2,
                  flexDirection: isSmallMobile ? "column" : "row",
                  mt: 1
                }}>
                  <Button 
                    onClick={editMode ? handleUpdate : handleAdd} 
                    variant="contained"
                    disabled={!form.schoolName || !form.schoolLocation || !form.degree}
                    sx={{ 
                      width: isSmallMobile ? "100%" : "auto",
                      minWidth: isSmallMobile ? "100%" : "200px"
                    }}
                  >
                    {editMode ? "Update Education" : "Add Education"}
                  </Button>
                  {editMode && (
                    <Button 
                      onClick={resetForm} 
                      variant="outlined"
                      sx={{ 
                        width: isSmallMobile ? "100%" : "auto",
                        minWidth: isSmallMobile ? "100%" : "120px"
                      }}
                    >
                      Cancel
                    </Button>
                  )}
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Education Entries List */}
        <Box sx={{ mt: 4 }}>
          {entries.length === 0 ? (
            <Paper sx={{ 
              p: isSmallMobile ? 3 : 4, 
              textAlign: 'center',
              borderRadius: 2,
              boxShadow: 1
            }}>
              <Typography 
                variant="h6" 
                color="textSecondary"
                sx={{ fontSize: isSmallMobile ? "1rem" : "inherit" }}
              >
                🎓 No education entries yet. Add your first education above.
              </Typography>
            </Paper>
          ) : (
            entries.map((edu) => (
              <Paper 
                key={edu.id} 
                sx={{ 
                  p: isSmallMobile ? 2 : 3, 
                  mb: 2, 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'flex-start',
                  flexDirection: isSmallMobile ? "column" : "row",
                  gap: isSmallMobile ? 2 : 1,
                  borderRadius: 2,
                  boxShadow: 2,
                  position: 'relative',
                  '&:hover': {
                    boxShadow: 3,
                  }
                }}
              >
                <Box sx={{ 
                  width: isSmallMobile ? "100%" : "85%",
                  pr: isSmallMobile ? 0 : 2 
                }}>
                  <Typography 
                    fontWeight="bold"
                    sx={{ 
                      fontSize: isSmallMobile ? "1rem" : "1.1rem",
                      color: "primary.main",
                      mb: 0.5
                    }}
                  >
                    {edu.degree}
                  </Typography>
                  <Typography 
                    fontWeight="medium"
                    sx={{ fontSize: isSmallMobile ? "0.9rem" : "inherit" }}
                  >
                    {edu.schoolName}
                  </Typography>
                  <Typography 
                    variant="body2"
                    color="textSecondary"
                    sx={{ fontSize: isSmallMobile ? "0.8rem" : "inherit", mb: 1 }}
                  >
                    📍 {edu.schoolLocation} • 🗓️ {edu.gradMonth} {edu.gradYear}
                  </Typography>
                  {edu.fieldOfStudy && (
                    <Typography 
                      variant="body2"
                      sx={{ fontSize: isSmallMobile ? "0.8rem" : "inherit", mb: 0.5 }}
                    >
                      <strong>Field of Study:</strong> {edu.fieldOfStudy}
                    </Typography>
                  )}
                  {edu.additionalCoursework && (
                    <Typography 
                      variant="body2"
                      sx={{ 
                        fontSize: isSmallMobile ? "0.8rem" : "inherit",
                        mt: 1,
                        p: 1,
                        backgroundColor: "grey.50",
                        borderRadius: 1
                      }}
                    >
                      <strong>Additional Coursework:</strong> {edu.additionalCoursework}
                    </Typography>
                  )}
                </Box>
                <Box 
                  sx={{ 
                    display: 'flex',
                    justifyContent: isSmallMobile ? "space-between" : "flex-start",
                    width: isSmallMobile ? "100%" : "auto",
                    gap: isSmallMobile ? 1 : 0.5
                  }}
                >
                  <IconButton 
                    onClick={() => handleEdit(edu)} 
                    size={isSmallMobile ? "medium" : "medium"}
                    sx={{ 
                      backgroundColor: "primary.light", 
                      color: "white",
                      '&:hover': { backgroundColor: "primary.main" }
                    }}
                  >
                    <EditIcon fontSize={isSmallMobile ? "small" : "medium"} />
                  </IconButton>
                  <IconButton 
                    onClick={() => handleDeleteClick(edu.id)} 
                    size={isSmallMobile ? "medium" : "medium"}
                    sx={{ 
                      backgroundColor: "error.light", 
                      color: "white",
                      '&:hover': { backgroundColor: "error.main" }
                    }}
                  >
                    <DeleteIcon fontSize={isSmallMobile ? "small" : "medium"} />
                  </IconButton>
                </Box>
              </Paper>
            ))
          )}
        </Box>

        {/* Next Button */}
        {entries.length > 0 && (
          <Box sx={{ 
            display: 'flex', 
            justifyContent: isSmallMobile ? "center" : "flex-end", 
            mt: 4,
            pt: 3,
            borderTop: "1px solid",
            borderColor: "divider"
          }}>
            <Button
              variant="contained"
              size={isSmallMobile ? "large" : "medium"}
              sx={{ 
                backgroundColor: "#e91e63", 
                "&:hover": { backgroundColor: "#d81b60" },
                width: isSmallMobile ? "100%" : "auto",
                minWidth: isSmallMobile ? "100%" : "200px",
                py: isSmallMobile ? 1.5 : 1
              }}
              onClick={() => navigate("/skills", { 
                state: { 
                  selectedTemplate, 
                  selectedTheme 
                } 
              })}
            >
              Next: Skills →
            </Button>
          </Box>
        )}

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteDialogOpen}
          onClose={handleDeleteCancel}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Delete Education Entry?"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure you want to delete this education entry? This action cannot be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDeleteCancel}>Cancel</Button>
            <Button onClick={handleDeleteConfirm} color="error" autoFocus>
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default EducationSection;