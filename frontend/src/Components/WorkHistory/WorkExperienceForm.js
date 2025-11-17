import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  Checkbox,
  FormControlLabel,
  MenuItem,
  Button,
  IconButton,
  Tooltip,
  List,
  ListItem,
  LinearProgress,
} from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { useNavigate } from "react-router-dom";
import { useLocation, } from "react-router-dom";
import  { useEffect } from "react";



const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const years = Array.from({ length: 50 }, (_, i) => 2025 - i);

const steps = [
  "Heading",
  "Work history",
  "Education",
  "Skills",
  "Summary",
  "Finalize",
];

const WorkExperienceForm = () => {

      const navigate = useNavigate();
        const location = useLocation();
       const editingJob = location.state || null; 

  const [form, setForm] = useState({
    jobTitle: "",
    employer: "",
    CompanyName:"",
    location: "",
    remote: false,
    startMonth: "",
    startYear: "",
    endMonth: "",
    endYear: "",
    current: false,
  });
   // Prefill when editing
useEffect(() => {
  if (editingJob) {
    setForm({
      ...editingJob,   // all fields
      _id: editingJob._id, // ✅ keep id separately
    });
  }
}, [editingJob]);


  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

const handleSave = () => {
  try {
    // ✅ Save form data to localStorage
    localStorage.setItem("workExperience", JSON.stringify(form));

    console.log("Saved Work Experience to localStorage:", form);

    // ✅ Navigate and pass data if needed
    navigate("/JobDescriptionForm", { state: { data: form } });
  } catch (err) {
    console.error("Error:", err);
  }
};

  return (
    <Box display="flex" minHeight="100vh">
      {/* Sidebar */}
      <Box
        sx={{
          width: 240,
          backgroundColor: "#002B5B",
          color: "white",
          p: 3,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <Box>
          <Typography
            variant="h6"
            sx={{ fontWeight: "bold", mb: 3, color: "#ff4081" }}
          >
            Resume Builder
          </Typography>
          <List>
            {steps.map((step, index) => (
              <ListItem
                key={step}
                sx={{
                  fontSize: "0.9rem",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  color: index < 2 ? "white" : "rgba(255,255,255,0.7)",
                }}
              >
                <Box
                  sx={{
                    width: 24,
                    height: 24,
                    borderRadius: "50%",
                    backgroundColor: index === 1 ? "#ff4081" : "#1976d2",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.75rem",
                    color: "white",
                  }}
                >
                  {index + 1}
                </Box>
                {step}
              </ListItem>
            ))}
          </List>
          <Box mt={3}>
            <Typography variant="caption">RESUME COMPLETENESS:</Typography>
            <LinearProgress
              variant="determinate"
              value={20}
              sx={{
                mt: 1,
                backgroundColor: "rgba(255,255,255,0.3)",
                "& .MuiLinearProgress-bar": {
                  backgroundColor: "#2196f3",
                },
              }}
            />
          </Box>
        </Box>

        {/* Footer */}
        <Box>
          <Typography
            variant="body2"
            sx={{ color: "lightgreen", cursor: "pointer" }}
          >
            Terms & Conditions
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: "lightgreen", cursor: "pointer" }}
          >
            Privacy Policy
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: "lightgreen", cursor: "pointer" }}
          >
            Accessibility
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: "lightgreen", cursor: "pointer" }}
          >
            Contact Us
          </Typography>
          <Typography variant="caption" display="block" mt={1}>
            © 2025, Bold Limited. All rights reserved.
          </Typography>
        </Box>
      </Box>

      {/* Main Content */}
      <Container maxWidth="md" sx={{ p: 5 }}>
        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography
            variant="body2"
            sx={{
              color: "#002B5B",
              fontWeight: "bold",
              mb: 2,
              cursor: "pointer",
            }}
          >
            ← Go Back
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: "#1976d2", cursor: "pointer", fontWeight: "bold" }}
          >
            💡 Tips
          </Typography>
        </Box>

        {/* Title */}
        <Typography variant="h4" fontWeight="bold" gutterBottom>
         Describe your latest role.
        </Typography>
        <Typography variant="subtitle1" gutterBottom color="text.secondary">
        We’ll begin at the end and move back through your career.
        </Typography>

        <Typography
          variant="caption"
          color="error"
          display="block"
          gutterBottom
        >
          * indicates a required field
        </Typography>

        {/* Form */}
        <Box component="form" mt={3}>
          <Box display="flex" gap={2} mb={3}>
            <TextField
              fullWidth
              label="Job Title *"
              name="jobTitle"
              value={form.jobTitle}
              onChange={handleChange}
              placeholder="Retail Sales Associate"
            />
            <TextField
              fullWidth
              label="Employer *"
              name="employer"
              value={form.employer}
              onChange={handleChange}
              placeholder="H&M"
            />
          </Box><Box display="flex" gap={2} mb={3}>
             <TextField
            fullWidth
            label="CompanyName"
            name="CompanyName"
            value={form.CompanyName}
            onChange={handleChange}
            placeholder="xxx"
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="Location"
            name="location"
            value={form.location}
            onChange={handleChange}
            placeholder="New Delhi, India"
            sx={{ mb: 2 }}
          /></Box>

          <FormControlLabel
            control={
              <Checkbox
                name="remote"
                checked={form.remote}
                onChange={handleChange}
              />
            }
            label={
              <Box display="flex" alignItems="center" gap={0.5}>
                Remote
                <Tooltip title="Check if this was a remote job">
                  <IconButton size="small">
                    <InfoOutlinedIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
            }
          />

          {/* Dates */}
          <Box display="flex" gap={2} mt={3}>
            <TextField
              select
              label="Start Date - Month"
              name="startMonth"
              value={form.startMonth}
              onChange={handleChange}
              sx={{ flex: 1 }}
            >
              {months.map((m) => (
                <MenuItem key={m} value={m}>
                  {m}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label="Year"
              name="startYear"
              value={form.startYear}
              onChange={handleChange}
              sx={{ flex: 1 }}
            >
              {years.map((y) => (
                <MenuItem key={y} value={y}>
                  {y}
                </MenuItem>
              ))}
            </TextField>
          </Box>

          <Box display="flex" gap={2} mt={2}>
            <TextField
              select
              label="End Date - Month"
              name="endMonth"
              value={form.endMonth}
              onChange={handleChange}
              sx={{ flex: 1 }}
              disabled={form.current}
            >
              {months.map((m) => (
                <MenuItem key={m} value={m}>
                  {m}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label="Year"
              name="endYear"
              value={form.endYear}
              onChange={handleChange}
              sx={{ flex: 1 }}
              disabled={form.current}
            >
              {years.map((y) => (
                <MenuItem key={y} value={y}>
                  {y}
                </MenuItem>
              ))}
            </TextField>
          </Box>

          <FormControlLabel
            control={
              <Checkbox
                name="current"
                checked={form.current}
                onChange={handleChange}
              />
            }
            label="I currently work here"
            sx={{ mt: 1 }}
          />
        </Box>

        {/* Navigation */}
      <Box mt={6} display="flex" justifyContent="center" gap={3}>
  <Button variant="outlined" sx={{ px: 5, borderRadius: 3 }}>
    Preview
  </Button>

  {/* Skip Now Button */}
  <Button
    variant="outlined"
    sx={{
      px: 5,
      borderRadius: 3,
      fontWeight: "bold",
      color: "#1976d2",
      borderColor: "#1976d2",
      "&:hover": { borderColor: "#125ea2", color: "#125ea2" },
    }}
    onClick={() => navigate("/JobDescriptionForm")} // ✅ directly go to next page
  >
    Skip Now
  </Button>

  {/* Next Button */}
  <Button
    variant="contained"
    sx={{
      px: 5,
      borderRadius: 3,
      fontWeight: "bold",
      backgroundColor: "#e91e63",
      "&:hover": { backgroundColor: "#d81b60" },
    }}
    onClick={handleSave} // ✅ Save before navigating
  >
    Next
  </Button>
</Box>

      </Container>
    </Box>
  );
};

export default WorkExperienceForm;