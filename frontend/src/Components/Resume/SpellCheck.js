import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  CircularProgress,
  Menu,
  MenuItem,
} from "@mui/material";
import { CheckCircle, Error } from "@mui/icons-material";
import { MdSpellcheck } from "react-icons/md";

const SpellCheckComponent = ({ resumeContent, onCorrection, onHighlight }) => {
  const [misspelledWords, setMisspelledWords] = useState([]);
  const [selectedWord, setSelectedWord] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [contextMenu, setContextMenu] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [scanned, setScanned] = useState(false);

  // 🔹 Backend API Call
  const spellCheckWithAI = async (text) => {
    try {
      const response = await fetch("https://resume-maker-lc.onrender.com/api/spellcheck", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const data = await response.json();
      return data.corrections || [];
    } catch (err) {
      console.error("Error calling spell check API:", err);
      return [];
    }
  };

  // 🔹 Scan and detect errors
  const scanForErrors = async () => {
    // Get the resume content directly from DOM when scanning
    const resumeElement = document.getElementById("resume-preview");
    if (!resumeElement) {
      console.error("Resume element not found");
      return;
    }

    setScanning(true);
    setScanned(true);

    // Use the actual DOM element to get text content
    const text = resumeElement.innerText || resumeElement.textContent || "";
    
    if (!text.trim()) {
      console.error("No text content found in resume");
      setScanning(false);
      return;
    }

    const errors = await spellCheckWithAI(text);

    // Normalize to prevent undefined issues
    const formattedErrors = errors.map((e, i) => ({
      position: i,
      word: e.word || "Unknown",
      original: e.original || e.word || "Unknown",
      suggestions: Array.isArray(e.suggestions)
        ? e.suggestions
        : [e.suggestion || "No suggestion"],
    }));

    setMisspelledWords(formattedErrors);

    if (onHighlight) {
      onHighlight(formattedErrors);
    }

    setScanning(false);
  };

  // 🔹 Context menu actions
  const handleWordClick = (event, wordInfo) => {
    setSelectedWord(wordInfo);
    setSuggestions(wordInfo.suggestions);
    setContextMenu(
      contextMenu === null
        ? { mouseX: event.clientX - 2, mouseY: event.clientY - 4 }
        : null
    );
  };

  const handleClose = () => {
    setContextMenu(null);
  };

  const handleReplace = (newWord) => {
    if (selectedWord && onCorrection) {
      onCorrection(selectedWord.original || selectedWord.word, newWord);
      const updatedErrors = misspelledWords.filter(
        (word) => word.position !== selectedWord.position
      );
      setMisspelledWords(updatedErrors);
    }
    handleClose();
  };

  const handleIgnore = () => {
    const updatedErrors = misspelledWords.filter(
      (word) => word.position !== selectedWord.position
    );
    setMisspelledWords(updatedErrors);
    handleClose();
  };

  // 🔹 Status UI
  const renderStatusContent = () => {
    if (scanning) {
      return (
        <Paper sx={{ p: 3, textAlign: "center", bgcolor: "#f5f5f5" }}>
          <CircularProgress />
          <Typography variant="body1" sx={{ mt: 2 }}>
            Scanning with AI...
          </Typography>
        </Paper>
      );
    }

    if (!scanned) {
      return (
        <Paper sx={{ p: 3, textAlign: "center", bgcolor: "#e0f7fa" }}>
          <MdSpellcheck
            size={48}
            style={{ color: "#00bcd4", marginBottom: "16px" }}
          />
          <Typography variant="h6" color="#00bcd4">
            Ready to Check
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
            Click "Check Resume" to scan your document for spelling mistakes.
          </Typography>
        </Paper>
      );
    }

    if (misspelledWords.length > 0) {
      return (
        <>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Found {misspelledWords.length} potential error(s). Click a word to
            see suggestions:
          </Typography>

          <Box sx={{ maxHeight: "400px", overflow: "auto" }}>
            {misspelledWords.map((wordInfo) => (
              <Paper
                key={wordInfo.position}
                sx={{
                  p: 2,
                  mb: 1,
                  cursor: "pointer",
                  border: "1px solid",
                  borderColor: "error.light",
                  bgcolor: "#ffebee",
                  "&:hover": { bgcolor: "#ffcdd2" },
                }}
                onClick={(e) => handleWordClick(e, wordInfo)}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Error sx={{ color: "error.main", mr: 1 }} />
                  <Typography
                    variant="body1"
                    sx={{
                      textDecoration: "underline wavy red",
                      mr: 2,
                      fontWeight: "bold",
                    }}
                  >
                    {wordInfo.word}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Suggestion:{" "}
                    {Array.isArray(wordInfo.suggestions)
                      ? wordInfo.suggestions.join(", ")
                      : wordInfo.suggestion || "No suggestion"}
                  </Typography>
                </Box>
              </Paper>
            ))}
          </Box>
        </>
      );
    }

    return (
      <Paper sx={{ p: 3, textAlign: "center", bgcolor: "#e8f5e9" }}>
        <CheckCircle sx={{ fontSize: 48, color: "success.main", mb: 2 }} />
        <Typography variant="h6" color="success.main">
          No spelling errors found!
        </Typography>
      </Paper>
    );
  };

  // 🔹 Render main
  return (
    <Box sx={{ p: 2 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h5">AI Spell Check</Typography>
        <Button
          variant="contained"
          onClick={scanForErrors}
          disabled={scanning}
          startIcon={
            scanning ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              <MdSpellcheck />
            )
          }
        >
          {scanning ? "Scanning..." : scanned ? "Re-scan" : "Check Resume"}
        </Button>
      </Box>

      {renderStatusContent()}

      <Menu
        open={contextMenu !== null}
        onClose={handleClose}
        anchorReference="anchorPosition"
        anchorPosition={
          contextMenu !== null
            ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
            : undefined
        }
      >
        <MenuItem disabled>
          Suggestions for "{selectedWord?.word}"
        </MenuItem>
        {suggestions.map((suggestion, index) => (
          <MenuItem key={index} onClick={() => handleReplace(suggestion)}>
            {suggestion}
          </MenuItem>
        ))}
        <MenuItem onClick={handleIgnore}>
          <Typography variant="body2" color="text.secondary">
            Ignore
          </Typography>
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default SpellCheckComponent;