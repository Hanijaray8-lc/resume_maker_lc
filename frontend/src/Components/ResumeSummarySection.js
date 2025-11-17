import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  TextField,
  IconButton,
  Button,
  Chip,
  Card,
  CardContent,
  CardActions,
  Tooltip,
  useTheme,
  useMediaQuery,
  Drawer,
  Container,
  AppBar,
  Toolbar,
  Menu,
  MenuItem,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import Sidebar from "./Sidebar";

import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import LinkIcon from "@mui/icons-material/Link";
import UndoIcon from "@mui/icons-material/Undo";
import RedoIcon from "@mui/icons-material/Redo";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import MenuIcon from "@mui/icons-material/Menu";
import MoreVertIcon from "@mui/icons-material/MoreVert";

export default function SummarySection() {
  const [search, setSearch] = useState("");
  const [content, setContent] = useState("");
  const [summaries, setSummaries] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [mobileMenuAnchor, setMobileMenuAnchor] = useState(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const popularJobs = ["Cashier", "Customer Service Representative", "Manager", "Server", "Retail","Web Developer", "Software Engineer", "Project Manager", "Data Analyst", "Marketing Specialist"];

  const handleAddSuggestion = (text) => {
    setContent(text);
  };

  const [history, setHistory] = useState([]);
  const [future, setFuture] = useState([]);
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

  // Load saved summaries from localStorage
  useEffect(() => {
    const savedSummaries = JSON.parse(localStorage.getItem("summaries")) || [];
    setSummaries(savedSummaries);
  }, []);

  const applyFormat = (before, after) => {
    const textarea = document.getElementById("desc-box");
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
      const prev = history[history.length - 1];
      setFuture([content, ...future]);
      setContent(prev);
      setHistory(history.slice(0, -1));
    }
  };

  const redo = () => {
    if (future.length > 0) {
      const [next, ...remainingFuture] = future;
      setHistory([...history, content]);
      setContent(next);
      setFuture(remainingFuture);
    }
  };

  const handleSaveSummary = () => {
    if (!content.trim()) {
      alert("Please write something before saving.");
      return;
    }
    const newSummaries = [...summaries, content];
    setSummaries(newSummaries);
    localStorage.setItem("summaries", JSON.stringify(newSummaries));
    setContent("");
    alert("Summary saved successfully!");
  };

  const handleDelete = (index) => {
    const updated = summaries.filter((_, i) => i !== index);
    setSummaries(updated);
    localStorage.setItem("summaries", JSON.stringify(updated));
  };

  const handleEdit = (index) => {
    setContent(summaries[index]);
    handleDelete(index);
  };

  const handleSearch = async () => {
    if (!search.trim()) {
      alert("Please enter a job title to search.");
      return;
    }
    
    setLoading(true);
    setSuggestions([]);
    
    try {
      const res = await fetch("https://resume-maker-lc.onrender.com/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobTitle: search }),
      });
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const data = await res.json();
      setSuggestions(data.summaries || []);
    } catch (err) {
      console.error("Error fetching AI suggestions:", err);
      alert("Failed to fetch AI suggestions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const toggleMobileSidebar = () => {
    setMobileSidebarOpen(!mobileSidebarOpen);
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMenuAnchor(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuAnchor(null);
  };

  return (
    <Box display="flex" minHeight="100vh">
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

      {/* Main Content */}
      <Box sx={{ 
        flex: 1, 
        p: isMobile ? 2 : 5, 
        ml: isMobile ? 0 : "260px",
        pt: isMobile ? 8 : 5,
      }}>
        {/* Back Button */}
        <Typography
          variant="body2"
          sx={{
            color: "#002B5B",
            fontWeight: "bold",
            mb: 1,
            cursor: "pointer",
            "&:hover": {
              color: "#e91e63",
              textDecoration: "underline",
            },
            transition: "color 0.3s ease",
            fontSize: isSmallMobile ? "0.875rem" : "inherit",
          }}
          onClick={() => navigate(-1)}
        >
          ← Go Back
        </Typography>

        {/* Title */}
        <Typography 
          variant={isMobile ? "h6" : "h5"} 
          fontWeight="bold" 
          gutterBottom
          sx={{ fontSize: isSmallMobile ? "1.25rem" : "inherit" }}
        >
          Briefly tell us about your <b>background</b>
        </Typography>

        <Typography 
          variant="body1" 
          sx={{ 
            mb: 4,
            fontSize: isSmallMobile ? "0.875rem" : "inherit",
            lineHeight: 1.6,
          }}
        >
          Choose from our AI-powered examples below or write your own.
        </Typography>

        {/* Search Box */}
        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
          <TextField
            fullWidth
            placeholder="Search by job title for AI-generated examples"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyPress={handleKeyPress}
            size={isSmallMobile ? "small" : "medium"}
            sx={{ width: isSmallMobile ? "100%" : "400px" }}
          />
          <IconButton onClick={handleSearch} disabled={loading}>
            <SearchIcon />
          </IconButton>
        </Box>

        {/* Popular Job Titles */}
        <Box sx={{ mb: 3 ,width: isSmallMobile ? "100%" : "800px"}} >
          <Typography 
            variant="body2" 
            sx={{ 
              mb: 1, 
              fontWeight: "bold",
              fontSize: isSmallMobile ? "0.875rem" : "inherit"
            }}
          >
            Popular Job Titles
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {popularJobs.map((job) => (
              <Chip
                key={job}
                label={job}
                size={isSmallMobile ? "small" : "medium"}
                sx={{ 
                  cursor: "pointer",
                  "&:hover": { backgroundColor: "#2563eb", color: "white" }
                }}
                onClick={() => {
                  setSearch(job);
                  handleSearch();
                }}
              />
            ))}
          </Box>
        </Box>

        {/* Suggestions */}
        <Box sx={{ mb: 4 }}>
          <Typography 
            variant="body2" 
            sx={{ 
              mb: 2, 
              fontWeight: "bold",
              fontSize: isSmallMobile ? "0.875rem" : "inherit"
            }}
          >
            {suggestions.length > 0 ? `Showing ${suggestions.length} AI suggestions for` : 'Search for'} <b style={{color: "#2563eb"}}>{search || "___"}</b>
          </Typography>
          
          {loading ? (
            <Box sx={{ textAlign: "center", py: 4 }}>
              <Typography>Loading AI suggestions...</Typography>
            </Box>
          ) : suggestions.length > 0 ? (
            suggestions.map((s, i) => (
              <Card 
                key={i} 
                sx={{ 
                  mb: 2, 
                  borderLeft: "5px solid #e11d48",
                  transition: "all 0.3s ease",
                  "&:hover": { 
                    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                    transform: isMobile ? "none" : "translateY(-2px)"
                  }
                }}
              >
                <CardContent sx={{ display: "flex", alignItems: "flex-start", p: isSmallMobile ? 2 : 3 }}>
                  <Tooltip title="Add to editor">
                    <AddCircleOutlineIcon
                      sx={{ 
                        color: "#2563eb", 
                        cursor: "pointer", 
                        mr: 2, 
                        mt: 0.5,
                        "&:hover": { color: "#1e40af" }
                      }}
                      onClick={() => handleAddSuggestion(s)}
                    />
                  </Tooltip>
                  <Box sx={{ flex: 1 }}>
                    <Typography 
                      variant="subtitle2" 
                      sx={{ 
                        mb: 1, 
                        color: "#e11d48", 
                        display: "flex", 
                        alignItems: "center",
                        fontSize: isSmallMobile ? "0.75rem" : "inherit"
                      }}
                    >
                      ⭐ AI Suggested #{i + 1}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        lineHeight: 1.6,
                        fontSize: isSmallMobile ? "0.875rem" : "inherit"
                      }}
                    >
                      {s}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            ))
          ) : (
            <Box sx={{ 
              textAlign: "center", 
              py: 4, 
              border: "2px dashed #ddd",
              width: isSmallMobile ? "100%" : "900px",
              borderRadius: 2
            }}>
              <Typography variant="body2" color="text.secondary">
                {search ? "No suggestions found. Try a different job title." : "Enter a job title above to get AI-powered summary suggestions."}
              </Typography>
            </Box>
          )}
        </Box>

        {/* Mobile Editor Section */}
        {isMobile && (
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
              Your Summary
            </Typography>

            <TextField
              id="desc-box"
              fullWidth
              multiline
              minRows={6}
              placeholder="Write your professional summary here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              sx={{ 
                mb: 2,
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "white"
                }
              }}
            />

            {/* Mobile Toolbar */}
            <Box 
              display="flex" 
              gap={1} 
              sx={{ 
                p: 1, 
                backgroundColor: "white", 
                borderRadius: 1,
                border: "1px solid #e0e0e0",
                flexWrap: "wrap"
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
              <Box sx={{ flex: 1 }} />
              <Tooltip title="Undo">
                <IconButton size="small" onClick={undo} disabled={history.length === 0}>
                  <UndoIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Redo">
                <IconButton size="small" onClick={redo} disabled={future.length === 0}>
                  <RedoIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>

            {/* Mobile Action Buttons */}
            <Box sx={{ display: "flex", gap: 2, mt: 3, flexWrap: "wrap" }}>
              <Button 
                variant="outlined" 
                sx={{ 
                  borderRadius: 3, 
                  px: 3,
                  flex: isSmallMobile ? "1 1 100%" : 1
                }}
              >
                Preview
              </Button>

              <Button
                variant="contained"
                sx={{
                  bgcolor: "#2563eb",
                  borderRadius: 3,
                  px: 3,
                  flex: isSmallMobile ? "1 1 100%" : 1,
                  "&:hover": { bgcolor: "#1e40af" },
                }}
                onClick={handleSaveSummary}
              >
                Save
              </Button>

              <Button
                variant="contained"
                sx={{
                  bgcolor: "#e11d48",
                  borderRadius: 3,
                  px: 3,
                  flex: isSmallMobile ? "1 1 100%" : 1,
                  "&:hover": { bgcolor: "#be123c" },
                }}
                onClick={() => {
                  if (!content.trim() && summaries.length === 0) {
                    alert("Please create and save at least one summary before proceeding.");
                    return;
                  }
                  navigate("/ExtraSection", {
                    state: { selectedTemplate, selectedTheme },
                  });
                }}
              >
                Next
              </Button>
            </Box>
          </Box>
        )}

        {/* Desktop Right Panel */}
        {!isMobile && (
          <Box sx={{ 
            position: "fixed",
            right: 0,
            top: 0,
            width: 400, 
            p: 4, 
            borderLeft: "1px solid #ddd",
            backgroundColor: "#fafafa",
            minHeight: "100vh",
            overflowY: "auto"
          }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
              Your Summary
            </Typography>

            <Typography variant="body2" sx={{ mb: 1, color: "text.secondary" }}>
              Write your summary here or use AI suggestions.
            </Typography>

            <TextField
              id="desc-box"
              fullWidth
              multiline
              minRows={8}
              placeholder="Write your professional summary here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              sx={{ 
                mb: 2,
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "white"
                }
              }}
            />

            {/* Toolbar */}
            <Box 
              display="flex" 
              gap={1} 
              sx={{ 
                p: 1, 
                backgroundColor: "white", 
                borderRadius: 1,
                border: "1px solid #e0e0e0"
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
              <Box sx={{ flex: 1 }} />
              <Tooltip title="Undo">
                <IconButton size="small" onClick={undo} disabled={history.length === 0}>
                  <UndoIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Redo">
                <IconButton size="small" onClick={redo} disabled={future.length === 0}>
                  <RedoIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>

            {/* Action Buttons */}
            <Box sx={{ display: "flex", gap: 2, mt: 3, flexWrap: "wrap" }}>
              <Button 
                variant="outlined" 
                sx={{ borderRadius: 20, px: 4, flex: 1 }}
              >
                Preview
              </Button>

              <Button
                variant="contained"
                sx={{
                  bgcolor: "#2563eb",
                  borderRadius: 20,
                  px: 4,
                  flex: 1,
                  "&:hover": { bgcolor: "#1e40af" },
                }}
                onClick={handleSaveSummary}
              >
                Save
              </Button>

              <Button
                variant="contained"
                sx={{
                  bgcolor: "#e11d48",
                  borderRadius: 20,
                  px: 4,
                  flex: 1,
                  "&:hover": { bgcolor: "#be123c" },
                }}
                onClick={() => {
                  if (!content.trim() && summaries.length === 0) {
                    alert("Please create and save at least one summary before proceeding.");
                    return;
                  }
                  navigate("/ExtraSection", {
                    state: { selectedTemplate, selectedTheme },
                  });
                }}
              >
                Next
              </Button>
            </Box>

            {/* Saved Summaries */}
            <Box mt={4}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
                Saved Summaries ({summaries.length})
              </Typography>
              
              {summaries.length > 0 ? (
                summaries.map((s, i) => (
                  <Card 
                    key={i} 
                    sx={{ 
                      mb: 2,
                      transition: "all 0.3s ease",
                      "&:hover": { 
                        boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
                      }
                    }}
                  >
                    <CardContent>
                      <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                        {s}
                      </Typography>
                    </CardContent>
                    <CardActions sx={{ justifyContent: "flex-end", gap: 1 }}>
                      <Tooltip title="Edit this summary">
                        <IconButton onClick={() => handleEdit(i)} size="small">
                          <EditIcon color="primary" fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete this summary">
                        <IconButton onClick={() => {
                          if (window.confirm("Are you sure you want to delete this summary?")) {
                            handleDelete(i);
                          }
                        }} size="small">
                          <DeleteIcon color="error" fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </CardActions>
                  </Card>
                ))
              ) : (
                <Box sx={{ 
                  textAlign: "center", 
                  py: 3,
                  border: "1px dashed #ddd",
                  borderRadius: 1,
                  backgroundColor: "white"
                }}>
                  <Typography variant="body2" color="text.secondary">
                    No saved summaries yet.
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        )}

        {/* Mobile Saved Summaries */}
        {isMobile && summaries.length > 0 && (
          <Box mt={4}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
              Saved Summaries ({summaries.length})
            </Typography>
            
            {summaries.map((s, i) => (
              <Card 
                key={i} 
                sx={{ 
                  mb: 2,
                  transition: "all 0.3s ease",
                }}
              >
                <CardContent>
                  <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                    {s}
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: "flex-end", gap: 1 }}>
                  <IconButton onClick={() => handleEdit(i)} size="small">
                    <EditIcon color="primary" fontSize="small" />
                  </IconButton>
                  <IconButton onClick={() => {
                    if (window.confirm("Are you sure you want to delete this summary?")) {
                      handleDelete(i);
                    }
                  }} size="small">
                    <DeleteIcon color="error" fontSize="small" />
                  </IconButton>
                </CardActions>
              </Card>
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
}