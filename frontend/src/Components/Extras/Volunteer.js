import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Typography,
  TextField,
  Tooltip,
  IconButton,
  Link,
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
import UndoIcon from "@mui/icons-material/Undo";
import RedoIcon from "@mui/icons-material/Redo";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
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

const Volunteering = () => {
  const [content, setContent] = useState("");
  const [history, setHistory] = useState([]);
  const [future, setFuture] = useState([]);
  const [subtopic, setSubtopic] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [records, setRecords] = useState([]);
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

  // Load from localStorage
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("volunteering")) || [];
    setRecords(saved);
  }, []);

  // Save to localStorage
  const saveToLocalStorage = (data) => {
    localStorage.setItem("volunteering", JSON.stringify(data));
  };

  const applyFormat = (before, after) => {
    const textarea = document.getElementById("volunteering-box");
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);

    const newText =
      content.substring(0, start) + before + selectedText + after + content.substring(end);

    setHistory([...history, content]);
    setContent(newText);
    setFuture([]);
  };

  const undo = () => {
    if (history.length === 0) return;
    const prev = history[history.length - 1];
    setHistory(history.slice(0, history.length - 1));
    setFuture([content, ...future]);
    setContent(prev);
  };

  const redo = () => {
    if (future.length === 0) return;
    const next = future[0];
    setFuture(future.slice(1));
    setHistory([...history, content]);
    setContent(next);
  };

  const handleSave = () => {
    if (!subtopic || !content) {
      alert("Please fill in at least Subtopic and Content.");
      return;
    }

    let updatedRecords;
    if (editIndex !== null) {
      updatedRecords = records.map((rec, idx) =>
        idx === editIndex ? { subtopic, fromDate, toDate, content } : rec
      );
      setEditIndex(null);
    } else {
      updatedRecords = [...records, { subtopic, fromDate, toDate, content }];
    }

    setRecords(updatedRecords);
    saveToLocalStorage(updatedRecords);

    setSubtopic("");
    setFromDate("");
    setToDate("");
    setContent("");
  };

  const handleDelete = (index) => {
    const updated = records.filter((_, i) => i !== index);
    setRecords(updated);
    saveToLocalStorage(updated);
  };

  const handleEdit = (index) => {
    const rec = records[index];
    setSubtopic(rec.subtopic);
    setFromDate(rec.fromDate);
    setToDate(rec.toDate);
    setContent(rec.content);
    setEditIndex(index);
  };

  const handleNext = () => {
    const currentSection = "Volunteering";
    const currentIndex = sections.indexOf(currentSection);

    if (currentIndex < sections.length - 1) {
      const nextSection = sections[currentIndex + 1];
      navigate(sectionRoutes[nextSection], { state: { selectedTemplate, selectedTheme } });
    } else {
      navigate("/mainpage", { state: { selectedTemplate, selectedTheme } });
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <Box>
      {/* Header */}
      <AppBar position="static" sx={{ backgroundColor: "#002B5B" }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={handleBack}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Volunteering
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Main content */}
      <Box sx={{ p: 4, maxWidth: "900px", mx: "auto" }}>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
          Tell us about your volunteer work.
        </Typography>

        <TextField
          fullWidth
          label="Subtopic"
          value={subtopic}
          onChange={(e) => setSubtopic(e.target.value)}
          sx={{ mb: 2 }}
        />

        <Box display="flex" gap={2} sx={{ mb: 2 }}>
          <TextField
            label="From Date"
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />
          <TextField
            label="To Date"
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />
        </Box>

        <TextField
          id="volunteering-box"
          fullWidth
          multiline
          rows={6}
          placeholder="Tell us about your volunteer work"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        {/* Formatting Toolbar */}
        <Box display="flex" alignItems="center" gap={1} mt={1} flexWrap="wrap" sx={{ borderTop: "1px solid #ddd", pt: 1 }}>
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

        {/* Save & Next buttons */}
        <Box textAlign="right" mt={3} sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
          <Button
            variant="contained"
            sx={{ backgroundColor: "#1976d2", "&:hover": { backgroundColor: "#1565c0" }, px: 4, py: 1, borderRadius: "30px", fontWeight: "bold" }}
            onClick={handleSave}
          >
            {editIndex !== null ? "Update" : "Save"}
          </Button>
          <Button
            variant="contained"
            sx={{ backgroundColor: "#e91e63", "&:hover": { backgroundColor: "#d81b60" }, px: 4, py: 1, borderRadius: "30px", fontWeight: "bold" }}
            onClick={handleNext}
          >
            Next
          </Button>
        </Box>

        {/* Display saved records */}
        <Box mt={4}>
          {records.map((rec, idx) => (
            <Card key={idx} sx={{ mb: 2, boxShadow: 3, borderRadius: "10px" }}>
              <CardContent>
                <Typography variant="h6">{rec.subtopic}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {rec.fromDate} - {rec.toDate}
                </Typography>
                <Typography variant="body1" sx={{ mt: 1 }}>
                  {rec.content}
                </Typography>
              </CardContent>
              <CardActions>
                <IconButton color="primary" onClick={() => handleEdit(idx)}>
                  <EditIcon />
                </IconButton>
                <IconButton color="error" onClick={() => handleDelete(idx)}>
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

export default Volunteering;
