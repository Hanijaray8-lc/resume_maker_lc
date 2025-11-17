import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  Typography,
  Grid,
  TextField,
  Paper,
  Tabs,
  Tab,
  IconButton,
  LinearProgress,
  Tooltip,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  useTheme,
  useMediaQuery,
  Drawer,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Collapse
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import LinkIcon from "@mui/icons-material/Link";
import UndoIcon from "@mui/icons-material/Undo";
import RedoIcon from "@mui/icons-material/Redo";
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import AddIcon from "@mui/icons-material/Add";
import MenuIcon from "@mui/icons-material/Menu";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SmartToyIcon from "@mui/icons-material/SmartToy";

import Sidebar from './Sidebar';

const SkillsSection = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState(0);
  const [search, setSearch] = useState("");
  const [skills, setSkills] = useState([]);
  const [textSkill, setTextSkill] = useState("");
  const [history, setHistory] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiRecommendations, setAiRecommendations] = useState([]);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [aiPanelExpanded, setAiPanelExpanded] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down("sm"));

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

  // Fetch AI recommendations
  const fetchAISkillRecommendations = async (jobTitle) => {
    if (!jobTitle.trim()) return;

    setAiLoading(true);
    try {
      const response = await fetch('https://resume-maker-lc.onrender.com/api/ai/skills', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ jobTitle }),
      });

      if (!response.ok) throw new Error('API failed');

      const data = await response.json();
      setAiRecommendations(data.skills || []);

    } catch (error) {
      console.error("AI API Error:", error);
      setAiRecommendations([]);
    } finally {
      setAiLoading(false);
    }
  };

  // Debounced search for AI
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (search.length > 2) {
        fetchAISkillRecommendations(search);
      } else {
        setAiRecommendations([]);
      }
    }, 1000);

    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  // Load from localStorage
  useEffect(() => {
    const savedSkills = localStorage.getItem("skills");
    if (savedSkills) setSkills(JSON.parse(savedSkills));
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("skills", JSON.stringify(skills));
  }, [skills]);

  const handleAddSkill = (skill) => {
    if (skill.trim() !== "" && !skills.find((s) => s.name === skill)) {
      const newSkills = [...skills, { name: skill, rating: 0 }];
      setSkills(newSkills);
      setTextSkill("");
    }
  };

  const handleDelete = (index) => {
    const newSkills = skills.filter((_, i) => i !== index);
    setSkills(newSkills);
  };

  const handleRatingChange = (index, newRating) => {
    const updated = [...skills];
    updated[index].rating = newRating;
    setSkills(updated);
  };

  const applyFormat = (startTag, endTag) => {
    const textarea = document.getElementById("skill-box");
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textSkill.substring(start, end);
    const newText =
      textSkill.substring(0, start) +
      startTag +
      selectedText +
      endTag +
      textSkill.substring(end);

    setHistory([...history, textSkill]);
    setTextSkill(newText);
  };

  const undo = () => {
    if (history.length === 0) return;
    const prev = history[history.length - 1];
    setRedoStack([textSkill, ...redoStack]);
    setHistory(history.slice(0, -1));
    setTextSkill(prev);
  };

  const redo = () => {
    if (redoStack.length === 0) return;
    const next = redoStack[0];
    setHistory([...history, textSkill]);
    setRedoStack(redoStack.slice(1));
    setTextSkill(next);
  };

  const saveSkills = () => {
    navigate('/ResumeSummary');
  };

  const toggleMobileSidebar = () => {
    setMobileSidebarOpen(!mobileSidebarOpen);
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      {/* Desktop Sidebar */}
      {!isMobile && <Sidebar />}

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
            <Sidebar onMobileClose={toggleMobileSidebar} />
          </Drawer>
        </>
      )}

      {/* AI Side Panel - Desktop */}
      {!isMobile && (
        <Box sx={{
          width: 320,
          bgcolor: '#f8f9fa',
          p: 2,
          borderRight: '1px solid #e0e0e0',
          overflowY: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 280,
          top: 0
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <AutoAwesomeIcon sx={{ mr: 1, color: '#1976d2' }} />
            <Typography variant="h6" fontWeight="bold" color="#1976d2">
              AI Skills Assistant
            </Typography>
          </Box>

          {/* AI Search */}
          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                🔍 AI Skill Search
              </Typography>
              <TextField
                fullWidth
                size="small"
                placeholder="Enter job title..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                sx={{ mb: 1 }}
              />
              <Typography variant="caption" color="textSecondary">
                AI will suggest relevant skills
              </Typography>
            </CardContent>
          </Card>

          {/* AI Loading */}
          {aiLoading && (
            <Card sx={{ mb: 2, textAlign: 'center', p: 2 }}>
              <CircularProgress size={20} sx={{ mr: 1 }} />
              <Typography variant="body2">AI is analyzing job market...</Typography>
            </Card>
          )}

          {/* AI Recommendations */}
          {aiRecommendations.length > 0 && (
            <Card sx={{ mb: 2 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <AutoAwesomeIcon sx={{ mr: 1, color: '#ff9800' }} />
                  <Typography variant="subtitle1" fontWeight="bold">
                    AI Suggested Skills
                  </Typography>
                </Box>
                <Typography variant="caption" color="textSecondary" gutterBottom>
                  For: "{search}"
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                  {aiRecommendations.map((skill, index) => (
                    <Chip
                      key={index}
                      label={skill}
                      size="small"
                      onClick={() => handleAddSkill(skill)}
                      clickable
                      color="primary"
                      variant="outlined"
                      icon={<AddIcon sx={{ fontSize: 16 }} />}
                    />
                  ))}
                </Box>
              </CardContent>
            </Card>
          )}

          {/* Quick Add */}
          <Card>
            <CardContent>
              <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                ⚡ Quick Add Skills
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {["Communication", "Teamwork", "Problem Solving", "Python", "JavaScript", "Project Management"].map(skill => (
                  <Chip
                    key={skill}
                    label={skill}
                    size="small"
                    onClick={() => handleAddSkill(skill)}
                    clickable
                    variant="outlined"
                    icon={<AddIcon sx={{ fontSize: 16 }} />}
                  />
                ))}
              </Box>
            </CardContent>
          </Card>
        </Box>
      )}

      {/* Main Content */}
      <Container 
        maxWidth="lg" 
        sx={{ 
          py: isMobile ? 4 : 6, 
          ml: isMobile ? 0 : '640px',
          px: isMobile ? 2 : 3,
          pt: isMobile ? 8 : 6
        }}
      >
        <Typography 
          variant={isMobile ? "h6" : "h5"} 
          fontWeight="bold" 
          gutterBottom
          sx={{ fontSize: isSmallMobile ? "1.25rem" : "inherit" }}
        >
          What skills would you like to highlight?
        </Typography>
        <Typography 
          variant="body1" 
          color="textSecondary" 
          gutterBottom
          sx={{ 
            fontSize: isSmallMobile ? "0.875rem" : "inherit",
            lineHeight: 1.6
          }}
        >
          Choose from our pre-written examples below or write your own. 
          {!isMobile && " AI suggestions appear on the left."}
        </Typography>

        {/* Mobile AI Assistant Section */}
        {isMobile && (
          <Box sx={{ mb: 3 }}>
            <Accordion 
              expanded={aiPanelExpanded}
              onChange={() => setAiPanelExpanded(!aiPanelExpanded)}
              sx={{
                '&:before': { display: 'none' },
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                borderRadius: '8px !important',
              }}
            >
              <AccordionSummary 
                expandIcon={<ExpandMoreIcon />}
                sx={{
                  backgroundColor: '#f8f9fa',
                  borderRadius: aiPanelExpanded ? '8px 8px 0 0' : '8px',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <SmartToyIcon sx={{ mr: 1, color: '#1976d2' }} />
                  <Typography variant="subtitle1" fontWeight="bold" color="#1976d2">
                    AI Skills Assistant
                  </Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails sx={{ p: 2 }}>
                {/* AI Search */}
                <Card sx={{ mb: 2 }}>
                  <CardContent sx={{ p: 2 }}>
                    <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                      🔍 AI Skill Search
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      placeholder="Enter job title..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      sx={{ mb: 1 }}
                    />
                    <Typography variant="caption" color="textSecondary">
                      AI will suggest relevant skills
                    </Typography>
                  </CardContent>
                </Card>

                {/* AI Loading */}
                {aiLoading && (
                  <Card sx={{ mb: 2, textAlign: 'center', p: 2 }}>
                    <CircularProgress size={20} sx={{ mr: 1 }} />
                    <Typography variant="body2">AI is analyzing job market...</Typography>
                  </Card>
                )}

                {/* AI Recommendations */}
                {aiRecommendations.length > 0 && (
                  <Card sx={{ mb: 2 }}>
                    <CardContent sx={{ p: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <AutoAwesomeIcon sx={{ mr: 1, color: '#ff9800' }} />
                        <Typography variant="subtitle2" fontWeight="bold">
                          AI Suggested Skills
                        </Typography>
                      </Box>
                      <Typography variant="caption" color="textSecondary" gutterBottom>
                        For: "{search}"
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                        {aiRecommendations.map((skill, index) => (
                          <Chip
                            key={index}
                            label={skill}
                            size="small"
                            onClick={() => handleAddSkill(skill)}
                            clickable
                            color="primary"
                            variant="outlined"
                            icon={<AddIcon sx={{ fontSize: 16 }} />}
                          />
                        ))}
                      </Box>
                    </CardContent>
                  </Card>
                )}

                {/* Quick Add */}
                <Card>
                  <CardContent sx={{ p: 2 }}>
                    <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                      ⚡ Quick Add Skills
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {["Communication", "Teamwork", "Problem Solving", "Python", "JavaScript", "Project Management"].map(skill => (
                        <Chip
                          key={skill}
                          label={skill}
                          size="small"
                          onClick={() => handleAddSkill(skill)}
                          clickable
                          variant="outlined"
                          icon={<AddIcon sx={{ fontSize: 16 }} />}
                        />
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </AccordionDetails>
            </Accordion>
          </Box>
        )}

        <Grid container spacing={3} mt={isMobile ? 1 : 2} >
          <Grid item xs={12} sx={{ width:isMobile ? "100%" : "700px" }}>
            <Paper sx={{ p: isMobile ? 2 : 5, width: "100%" }}>
              <Tabs 
                value={tab} 
                onChange={(e, val) => setTab(val)}
                variant={isMobile ? "fullWidth" : "standard"}
              >
                <Tab label="Text Editor" />
                <Tab label="Skills Rating" />
              </Tabs>

              {tab === 0 && (
                <Box sx={{ mt: 2 }}>
                  <TextField
                    id="skill-box"
                    fullWidth
                    multiline
                    rows={isMobile ? 3 : 4}
                    placeholder="Type a skill and press Enter..."
                    value={textSkill}
                    onChange={(e) => setTextSkill(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddSkill(textSkill);
                      }
                    }}
                  />

                  {/* Formatting Toolbar */}
                  <Box 
                    display="flex" 
                    gap={1} 
                    mt={1}
                    sx={{ 
                      flexWrap: isMobile ? "wrap" : "nowrap",
                      justifyContent: isMobile ? "center" : "flex-start"
                    }}
                  >
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
                    <Box sx={{ flex: isMobile ? "0 0 100%" : 1, height: isMobile ? 8 : 0 }} />
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

                  {/* Added Skills */}
                  <Box sx={{ mt: 2, display: "flex", flexWrap: "wrap", gap: 1 }}>
                    {skills.map((skill, idx) => (
                      <Chip
                        key={idx}
                        label={skill.name}
                        onDelete={() => handleDelete(idx)}
                        deleteIcon={<DeleteIcon />}
                        color="secondary"
                        variant="outlined"
                        size={isMobile ? "small" : "medium"}
                      />
                    ))}
                  </Box>
                </Box>
              )}

              {tab === 1 && (
                <Box sx={{ mt: 2 }}>
                  {skills.map((skill, idx) => (
                    <Box key={idx} sx={{ mb: 3 }}>
                      <Typography sx={{ mb: 1, fontSize: isSmallMobile ? "0.875rem" : "inherit" }}>
                        {skill.name}
                      </Typography>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <input
                          type="range"
                          min={0}
                          max={100}
                          value={skill.rating}
                          onChange={(e) => handleRatingChange(idx, Number(e.target.value))}
                          style={{ flex: 1 }}
                        />
                        <Typography sx={{ minWidth: 40, fontSize: isSmallMobile ? "0.875rem" : "inherit" }}>
                          {skill.rating}%
                        </Typography>
                        <IconButton color="error" onClick={() => handleDelete(idx)} size="small">
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={skill.rating}
                        sx={{ height: 8, borderRadius: 5, mt: 1 }}
                      />
                    </Box>
                  ))}
                </Box>
              )}

              <Typography variant="body2" sx={{ mt: 2, fontSize: isSmallMobile ? "0.875rem" : "inherit" }}>
                Skills: {skills.length}
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Bottom Buttons */}
        <Box sx={{ 
          display: "flex", 
          gap: 2, 
          mt: 3,
          flexDirection: isMobile ? "column" : "row",
          alignItems: isMobile ? "stretch" : "flex-start"
        }}>
          <Button 
            variant="outlined" 
            sx={{ 
              px: 4, 
              borderRadius: 3, 
              fontWeight: "bold",
              flex: isMobile ? 1 : "none"
            }}
          >
            Preview
          </Button>
          <Button
            variant="outlined"
            sx={{
              px: 4,
              borderRadius: 3,
              fontWeight: "bold",
              borderColor: "#1976d2",
              color: "#1976d2",
              flex: isMobile ? 1 : "none",
              "&:hover": { borderColor: "#115293", color: "#115293" },
            }}
            onClick={() => navigate("/ResumeSummary")}
          >
            Skip Now
          </Button>
          <Button
            variant="contained"
            sx={{
              px: 4,
              borderRadius: 3,
              fontWeight: "bold",
              backgroundColor: "#e91e63",
              flex: isMobile ? 1 : "none",
              "&:hover": { backgroundColor: "#d81b60" },
            }}
            onClick={() => {
              saveSkills();
              navigate("/ResumeSummary", {
                state: { selectedTemplate, selectedTheme },
              });
            }}
          >
            Next: Summary
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default SkillsSection;