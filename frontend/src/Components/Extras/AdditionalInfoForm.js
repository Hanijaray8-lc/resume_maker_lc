import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Divider,
  Button,
  Tabs,
  Tab,
  IconButton,
  Tooltip,
  TextField,
  Card,
  CardContent,
  CardActions,
  AppBar,
  Toolbar
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import LinkIcon from '@mui/icons-material/Link';
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useSections } from "./SectionContext";

const sectionRoutes = {
  "Photo, Personal Details": "/PersonalDetail",
  "Websites, Portfolios, Profiles": "/WebsiteSection",
  "Certifications": "/Certifications",
  "Languages": "/Language",
  "Accomplishments": "/AccomplishmentsSection",
  "Additional Information": "/AdditionalInfoForm",
  "Software": "/SoftWare",
  "References": "/Refferences",
  "Volunteering": "/Volunteer",
  "Interests": "/Interest",
};

const theme = createTheme({
  palette: { primary: { main: '#1976d2' } },
  typography: { h4: { fontWeight: 600 }, h6: { fontWeight: 500 } },
});

// ✅ Rich Text Editor
const RichTextEditor = ({ value, onChange }) => {
  const [history, setHistory] = useState([]);
  const [future, setFuture] = useState([]);

  const applyFormat = (before, after) => {
    const textarea = document.getElementById("details-textarea");
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    const newText =
      value.substring(0, start) +
      before +
      selectedText +
      after +
      value.substring(end);

    setHistory([...history, value]);
    onChange(newText);
    setFuture([]);
  };

  const undo = () => {
    if (history.length > 0) {
      const prev = history[history.length - 1];
      setFuture([value, ...future]);
      onChange(prev);
      setHistory(history.slice(0, -1));
    }
  };

  const redo = () => {
    if (future.length > 0) {
      const next = future[0];
      setHistory([...history, value]);
      onChange(next);
      setFuture(future.slice(1));
    }
  };

  return (
    <Box>
      <TextField
        id="details-textarea"
        fullWidth
        multiline
        rows={6}
        variant="outlined"
        placeholder="Add your details here"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        sx={{ mb: 1 }}
      />
      <Box display="flex" gap={1} mt={1} sx={{ border: '1px solid #ccc', p: 1, borderRadius: 1 }}>
        <Tooltip title="Bold"><IconButton size="small" onClick={() => applyFormat("**", "**")}><FormatBoldIcon fontSize="small" /></IconButton></Tooltip>
        <Tooltip title="Italic"><IconButton size="small" onClick={() => applyFormat("*", "*")}><FormatItalicIcon fontSize="small" /></IconButton></Tooltip>
        <Tooltip title="Underline"><IconButton size="small" onClick={() => applyFormat("<u>", "</u>")}><FormatUnderlinedIcon fontSize="small" /></IconButton></Tooltip>
        <Tooltip title="Bullet List"><IconButton size="small" onClick={() => applyFormat("\n- ", "")}><FormatListBulletedIcon fontSize="small" /></IconButton></Tooltip>
        <Tooltip title="Insert Link"><IconButton size="small" onClick={() => applyFormat("[", "](https://)")}><LinkIcon fontSize="small" /></IconButton></Tooltip>
        <Box sx={{ flexGrow: 1 }} />
        <Tooltip title="Undo"><IconButton size="small" onClick={undo}><UndoIcon fontSize="small" /></IconButton></Tooltip>
        <Tooltip title="Redo"><IconButton size="small" onClick={redo}><RedoIcon fontSize="small" /></IconButton></Tooltip>
      </Box>
    </Box>
  );
};

const AdditionalInfoForm = () => {
  const [details, setDetails] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [savedDetails, setSavedDetails] = useState([]);
  const [editIndex, setEditIndex] = useState(null);

  const navigate = useNavigate();
  const { sections } = useSections();
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

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("additionalInfo")) || [];
    setSavedDetails(stored);
  }, []);

  const handleTabChange = (event, newValue) => setTabValue(newValue);

  // ✅ Save
  const handleSave = () => {
    if (!details.trim()) return;

    let updated;
    if (editIndex !== null) {
      updated = [...savedDetails];
      updated[editIndex] = details;
      setEditIndex(null);
    } else {
      updated = [...savedDetails, details];
    }

    setSavedDetails(updated);
    localStorage.setItem("additionalInfo", JSON.stringify(updated));
    setDetails('');
  };

  // ✅ Delete
  const handleDelete = (index) => {
    const updated = savedDetails.filter((_, i) => i !== index);
    setSavedDetails(updated);
    localStorage.setItem("additionalInfo", JSON.stringify(updated));
  };

  // ✅ Edit
  const handleEdit = (index) => {
    setDetails(savedDetails[index]);
    setEditIndex(index);
  };

  // ✅ Next
  const handleNext = () => {
    const currentSection = "Additional Information";
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
      {/* ✅ Header with bg #002B5B */}
      <AppBar position="static" sx={{ backgroundColor: "#002B5B" }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={() => navigate(-1)}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Additional Information
          </Typography>
        </Toolbar>
      </AppBar>

      <ThemeProvider theme={theme}>
        <Container maxWidth="md" sx={{ py: 4, ml: "280px" }}>
          <Paper elevation={3} sx={{ p: 4 }}>
            <Typography variant="h4" gutterBottom color="primary">
              Additional Information
            </Typography>
            <Typography variant="body1" paragraph sx={{ color: 'text.secondary', mb: 3 }}>
              Add anything else you want employers to know.
            </Typography>

            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
              <Tabs value={tabValue} onChange={handleTabChange}>
                <Tab label="Details" />
              </Tabs>
            </Box>

            {tabValue === 0 && <RichTextEditor value={details} onChange={setDetails} />}

            <Divider sx={{ my: 3 }} />

            {/* Saved Cards */}
            <Box sx={{ mb: 3 }}>
              {savedDetails.map((item, index) => (
                <Card key={index} sx={{ mb: 2 }}>
                  <CardContent>
                    <Typography variant="body1">{item}</Typography>
                  </CardContent>
                  <CardActions>
                    <IconButton color="primary" onClick={() => handleEdit(index)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleDelete(index)}>
                      <DeleteIcon />
                    </IconButton>
                  </CardActions>
                </Card>
              ))}
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button variant="outlined" onClick={() => navigate(-1)}>Back</Button>
              <Button variant="contained" onClick={handleSave}>Save</Button>
              <Button variant="contained" size="large" onClick={handleNext}>
                Next
              </Button>
            </Box>
          </Paper>
        </Container>
      </ThemeProvider>
    </Box>
  );
};

export default AdditionalInfoForm;
