import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Grid,
  TextField,
  MenuItem,
  Typography,
  Paper,
  IconButton,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

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

  // Fetch existing entries
  useEffect(() => {
    axios.get("https://resume-maker-lc.onrender.com/api/education")
      .then(res => setEntries(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAdd = async () => {
    try {
      const res = await axios.post("https://resume-maker-lc.onrender.com/api/education", form);
      setEntries([res.data, ...entries]); // Add new entry to the top
      setForm({ schoolName: "", schoolLocation: "", degree: "", fieldOfStudy: "", gradMonth: "", gradYear: "", additionalCoursework: "" });
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://resume-maker-lc.onrender.com/api/education/${id}`);
      setEntries(entries.filter(e => e._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Education Summary
      </Typography>

     

   

      <Box sx={{ mt: 4 }}>
        {entries.map((edu, idx) => (
          <Paper key={edu._id} sx={{ p: 2, mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography fontWeight="bold">{edu.degree} | {edu.schoolName}</Typography>
              <Typography>{edu.schoolLocation} | {edu.gradMonth} {edu.gradYear}</Typography>
              {edu.fieldOfStudy ? (
                <Typography>Coursework: {edu.fieldOfStudy}</Typography>
              ) : (
                <Typography color="error">Missing additional coursework</Typography>
              )}
            </Box>
            <Box>
              <IconButton><EditIcon /></IconButton>
              <IconButton onClick={() => handleDelete(edu._id)}><DeleteIcon /></IconButton>
            </Box>
          </Paper>
        ))}
      </Box>


      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
         <Button
      variant="outlined"
      sx={{
        borderRadius: 3,
        mr:2,
        borderColor: "#1976d2",
        color: "#1976d2",
        "&:hover": { backgroundColor: "rgba(25, 118, 210, 0.1)" },
      }}
      onClick={() => navigate("/EducationSection")} // 👈 Go to education form
    >
      + Add Another Education
    </Button>
        <Button
          variant="contained"
          sx={{ backgroundColor: "#e91e63", "&:hover": { backgroundColor: "#d81b60" } }}
          onClick={() => navigate("/skills")} // Navigate to Skills page
        >
          Next: Skills
        </Button>
      </Box>
    </Box>
  );
};

export default EducationSection;
