import React, { useState } from "react";
import {
  Container,
  Grid,
  TextField,
  Typography,
  Button,
  Box,
  Paper,
  MenuItem,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";

const PersonalDetails = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    dob: "",
    nationality: "Indian",
    maritalStatus: "Single",
    visaStatus: "",
    gender: "",
    religion: "",
    passport: "",
    other: "",
  });

  const [showGender, setShowGender] = useState(false);
  const [showReligion, setShowReligion] = useState(false);
  const [showPassport, setShowPassport] = useState(false);
  const [showOther, setShowOther] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

const handleSave = async () => {
  try {
    const res = await fetch("https://resume-maker-lc.onrender.com/api/personal-details", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await res.json();
    console.log("Saved Personal Details:", data);

    navigate("/WorkHistry");
  } catch (err) {
    console.error("Error:", err);
  }
};


  return (
    <Box sx={{ display: "flex" }}>
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
          {/* Title */}
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Personal Details
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            gutterBottom
            sx={{ mb: 3 }}
          >
            This is an optional section, and an excellent opportunity to add
            relevant information.
          </Typography>

          {/* Form */}
          <Grid container spacing={3} >
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="date"
                label="Date Of Birth / Age"
                name="dob"
                InputLabelProps={{ shrink: true }}
                value={formData.dob}
                onChange={handleChange}
                sx={{width:"380px"}}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Nationality"
                name="nationality"
                value={formData.nationality}
                onChange={handleChange}
                                sx={{width:"380px"}}

              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Marital Status"
                name="maritalStatus"
                value={formData.maritalStatus}
                onChange={handleChange}
                                                sx={{width:"380px"}}

              >
                <MenuItem value="Single">Single</MenuItem>
                <MenuItem value="Married">Married</MenuItem>
                <MenuItem value="Divorced">Divorced</MenuItem>
                <MenuItem value="Widowed">Widowed</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Visa Status"
                name="visaStatus"
                value={formData.visaStatus}
                onChange={handleChange}
                placeholder="Full working capabilities"
                                                sx={{width:"380px"}}

              />
            </Grid>
          </Grid>

          {/* Additional Info Buttons */}
          <Box sx={{ mt: 4 }}>
            <Typography
              variant="subtitle1"
              fontWeight="bold"
              sx={{ mb: 2, color: "#555" }}
            >
              Additional Information
            </Typography>

            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 2 }}>
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={() => setShowGender(!showGender)}
              >
                Gender
              </Button>
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={() => setShowReligion(!showReligion)}
              >
                Religion
              </Button>
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={() => setShowPassport(!showPassport)}
              >
                Passport
              </Button>
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={() => setShowOther(!showOther)}
              >
                Other
              </Button>
            </Box>

            <Grid container spacing={2}>
              {showGender && (
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    fullWidth
                                    sx={{width:"383px"}}

                  />
                </Grid>
              )}
              {showReligion && (
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Religion"
                    name="religion"
                    value={formData.religion}
                    onChange={handleChange}
                    fullWidth
                                    sx={{width:"383px"}}

                  />
                </Grid>
              )}
              {showPassport && (
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Passport Number"
                    name="passport"
                    value={formData.passport}
                    onChange={handleChange}
                    fullWidth
                                    sx={{width:"383px"}}

                  />
                </Grid>
              )}
              {showOther && (
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Other Information"
                    name="other"
                    value={formData.other}
                    onChange={handleChange}
                    fullWidth
                                    sx={{width:"383px"}}

                  />
                </Grid>
              )}
            </Grid>
          </Box>

          {/* Bottom Buttons */}
          <Box
            sx={{ mt: 4, display: "flex", justifyContent: "space-between" }}
          >
            <Button variant="text" onClick={() => navigate(-1)}>
              ← Go Back
            </Button>
            <Box sx={{ display: "flex", gap: 2 }}>
              <Button variant="outlined" onClick={() => navigate('/Workhistry')} >Skip for now</Button>
              <Button variant="outlined">Preview</Button>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "#e91e63",
                  "&:hover": { backgroundColor: "#d81b60" },
                }}
                onClick={handleSave}
              >
                Next
              </Button>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default PersonalDetails;
