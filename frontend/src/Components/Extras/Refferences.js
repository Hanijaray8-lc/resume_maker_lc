import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Typography,
  TextField,
  Tooltip,
  IconButton,
  Card,
  CardContent,
  CardActions,
  AppBar,
  Toolbar,
} from "@mui/material";
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import LinkIcon from "@mui/icons-material/Link";
import UndoIcon from "@mui/icons-material/Undo";
import RedoIcon from "@mui/icons-material/Redo";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useSections } from "./SectionContext";

const sectionRoutes = {
  "Photo, Personal Details": "/PersonalDetail",
  "Websites, Portfolios, Profiles": "/WebsiteSection",
  Certifications: "/Certifications",
  Languages: "/Language",
  Accomplishments: "/AccomplishmentsSection",
  "Additional Information": "/AdditionalInfoForm",
  Software: "/SoftWare",
  References: "/Refferences",
  Volunteering: "/Volunteer",
  Interests: "/Interest",
};

const References = () => {
  const [content, setContent] = useState("");
  const [savedRefs, setSavedRefs] = useState([]);
  const [history, setHistory] = useState([]);
  const [future, setFuture] = useState([]);
  const [editIndex, setEditIndex] = useState(null);

  const { sections } = useSections();
  const navigate = useNavigate();
  const location = useLocation();

  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [selectedTheme, setSelectedTheme] = useState(null);

  useEffect(() => {
    if (location.state) {
      const { selectedTemplate: template, selectedTheme: theme } = location.state;
      if (template) setSelectedTemplate(template);
      if (theme) setSelectedTheme(theme);
    }
  }, [location.state]);

  // Load saved references from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("referencesList");
    if (saved) {
      setSavedRefs(JSON.parse(saved));
    }
  }, []);

  // Formatting helpers
  const applyFormat = (before, after) => {
    const textarea = document.getElementById("references-box");
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    const newText =
      content.substring(0, start) +
      before +
      selectedText +
      after +
      content.substring(end);

    setHistory([...history, content]);
    setContent(newText);
    setFuture([]);
  };

  const undo = () => {
    if (history.length > 0) {
      const prev = history.pop();
      setFuture([content, ...future]);
      setContent(prev);
      setHistory([...history]);
    }
  };

  const redo = () => {
    if (future.length > 0) {
      const next = future.shift();
      setHistory([...history, content]);
      setContent(next);
      setFuture([...future]);
    }
  };

  // Save references
  const handleSave = () => {
    if (!content.trim()) {
      alert("Please enter some content before saving.");
      return;
    }

    let updatedList;
    if (editIndex !== null) {
      updatedList = [...savedRefs];
      updatedList[editIndex] = content;
      setEditIndex(null);
    } else {
      updatedList = [...savedRefs, content];
    }

    setSavedRefs(updatedList);
    localStorage.setItem("referencesList", JSON.stringify(updatedList));
    setContent("");
  };

  const handleEdit = (index) => {
    setContent(savedRefs[index]);
    setEditIndex(index);
  };

  const handleDelete = (index) => {
    const updatedList = savedRefs.filter((_, i) => i !== index);
    setSavedRefs(updatedList);
    localStorage.setItem("referencesList", JSON.stringify(updatedList));
  };

  const handleNext = () => {
    const currentSection = "References";
    const currentIndex = sections.indexOf(currentSection);

    if (currentIndex < sections.length - 1) {
      const nextSection = sections[currentIndex + 1];
      navigate(sectionRoutes[nextSection], {
        state: { selectedTemplate, selectedTheme },
      });
    } else {
      navigate("/mainpage", {
        state: { selectedTemplate, selectedTheme },
      });
    }
  };

  return (
    <Box>
      {/* Header */}
      <AppBar position="static" sx={{ backgroundColor: "#002B5B" }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={() => navigate(-1)}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            References
          </Typography>
        </Toolbar>
      </AppBar>

      <Box sx={{ p: 4, maxWidth: "800px", mx: "auto" }}>
        {/* Editable Text Field */}
        <TextField
          id="references-box"
          fullWidth
          multiline
          rows={6}
          placeholder="Enter your references here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        {/* Formatting Toolbar */}
        <Box display="flex" gap={1} mt={1} flexWrap="wrap">
          <Tooltip title="Bold">
            <IconButton size="small" onClick={() => applyFormat("**", "**")}>
              <FormatBoldIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Italic">
            <IconButton size="small" onClick={() => applyFormat("*", "*")}>
              <FormatItalicIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Underline">
            <IconButton size="small" onClick={() => applyFormat("<u>", "</u>")}>
              <FormatUnderlinedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Bullet List">
            <IconButton size="small" onClick={() => applyFormat("\n- ", "")}>
              <FormatListBulletedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Insert Link">
            <IconButton size="small" onClick={() => applyFormat("[", "](https://)")}>
              <LinkIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Undo">
            <IconButton size="small" onClick={undo}>
              <UndoIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Redo">
            <IconButton size="small" onClick={redo}>
              <RedoIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>

        {/* Save and Next buttons */}
        <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
          <Button variant="contained" color="primary" onClick={handleSave}>
            {editIndex !== null ? "Update" : "Save"}
          </Button>
          <Button variant="contained" color="secondary" onClick={handleNext}>
            Next
          </Button>
        </Box>

        {/* Saved References */}
        <Box mt={4}>
          <Typography variant="h6" mb={2}>
            Saved References
          </Typography>
          {savedRefs.map((item, index) => (
            <Card key={index} sx={{ mb: 2, boxShadow: 2 }}>
              <CardContent>
                <Typography variant="body2" whiteSpace="pre-line">
                  {item}
                </Typography>
              </CardContent>
              <CardActions>
                <IconButton onClick={() => handleEdit(index)} color="primary">
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => handleDelete(index)} color="error">
                  <DeleteIcon />
                </IconButton>
              </CardActions>
            </Card>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default References;
