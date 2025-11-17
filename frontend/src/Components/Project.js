import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  IconButton,
  Chip,
  Stack,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";

const API_URL = "https://resume-maker-lc.onrender.com/api/projects"; // backend url

const Projects = ({ userId }) => {
  const [projects, setProjects] = useState([]); // saved projects
  const [tempProjects, setTempProjects] = useState([]); // unsaved projects
  const [form, setForm] = useState({
    title: "",
    description: "",
    technologies: "",
  });

  // Fetch projects from DB
  const fetchProjects = async () => {
    try {
      const res = await axios.get(`${API_URL}/${userId}`);
      setProjects(res.data); // res.data = array
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (userId) fetchProjects();
  }, [userId]);

  // Handle form change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Add project to temp list
  const handleAddTemp = () => {
    if (!form.title || !form.description || !form.technologies) return;

    const newProject = {
      ...form,
      technologies: form.technologies.split(",").map((t) => t.trim()),
    };

    setTempProjects([newProject, ...tempProjects]);
    setForm({ title: "", description: "", technologies: "" });
  };

  // Save all tempProjects to DB (overwrite old list)
  const handleSaveAll = async () => {
    try {
      const res = await axios.post(API_URL, {
        userId,
        projects: [...projects, ...tempProjects], // merge old + new
      });

      setProjects(res.data.projects); // updated array
      setTempProjects([]);
      alert("Projects saved successfully!");
    } catch (err) {
      console.error(err);
    }
  };

  // Delete project by index
const handleDelete = async (index) => {
  try {
    const res = await axios.delete(`${API_URL}/${userId}/${index}`);
    setProjects(res.data.projects);
  } catch (err) {
    console.error(err);
  }
};





  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Projects
      </Typography>

      {/* Add Project Form */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <TextField
          label="Project Title"
          name="title"
          fullWidth
          margin="normal"
          value={form.title}
          onChange={handleChange}
        />
        <TextField
          label="Description"
          name="description"
          multiline
          rows={3}
          fullWidth
          margin="normal"
          value={form.description}
          onChange={handleChange}
        />
        <TextField
          label="Technologies (comma separated)"
          name="technologies"
          fullWidth
          margin="normal"
          value={form.technologies}
          onChange={handleChange}
        />
        <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
          <Button variant="outlined" color="primary" onClick={handleAddTemp}>
            Add Project
          </Button>
          <Button variant="contained" color="success" onClick={handleSaveAll}>
            Next (Save All)
          </Button>
        </Stack>
      </Paper>

      {/* Unsaved Projects */}
      {tempProjects.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1">Unsaved Projects</Typography>
          {tempProjects.map((project, i) => (
            <Paper key={i} sx={{ p: 2, mb: 2, bgcolor: "#f5f5f5" }}>
              <Typography variant="h6">{project.title}</Typography>
              <Typography variant="body2">{project.description}</Typography>
              {project.technologies.map((tech, j) => (
                <Chip key={j} label={tech} size="small" sx={{ mr: 1, mt: 1 }} />
              ))}
            </Paper>
          ))}
        </Box>
      )}

      {/* Already Saved Projects */}
      {projects.map((project, index) => (
        <Paper key={index} sx={{ p: 2, mb: 2 }}>
          <Stack direction="row" justifyContent="space-between">
            <Box>
              <Typography variant="h6">{project.title}</Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                {project.description}
              </Typography>
              {project.technologies.map((tech, i) => (
                <Chip key={i} label={tech} size="small" sx={{ mr: 1, mb: 1 }} />
              ))}
            </Box>
            <IconButton color="error" onClick={() => handleDelete(index)}>
              <DeleteIcon />
            </IconButton>
          </Stack>
        </Paper>
      ))}
    </Box>
  );
};

export default Projects;
