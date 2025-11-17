import React, { useState } from "react";
import {
  Box,
  Typography,
  Slider,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  ToggleButton,
  ToggleButtonGroup,
  Button,
  Grid,
  Collapse,
  Divider,
} from "@mui/material";
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

// Recommended color palette
const recommendedColors = [
  "#0951b0ff", "#34a853", "#fbbc05", "#ea4335", "#9c27b0", "#ff5722",
];

// Extended color palette
const allColors = [
  "#000000", "#FFFFFF", "#1a73e8", "#34a853", "#fbbc05", "#ea4335",
  "#9c27b0", "#ff5722", "#00bcd4", "#4caf50", "#ff9800", "#795548",
  "#607d8b", "#e91e63", "#3f51b5", "#8bc34a", "#cddc39", "#ffc107",
  "#673ab7", "#2196f3", "#ffeb3b", "#9e9e9e", "#b71c1c", "#004d40",
  "#ff1744", "#00695c", "#1de9b6", "#f06292", "#ff7043", "#00e5ff",
];

// Extended font list
const fontOptions = [
  "EB Garamond",
  "Roboto",
  "Arial",
  "Times New Roman",
  "Verdana",
  "Georgia",
  "Courier New",
  "Poppins",
  "Open Sans",
  "Lato",
  "Montserrat",
  "Raleway",
  "Playfair Display",
  "Source Sans Pro",
  "Merriweather",
  "Nunito",
  "Oswald",
  "Ubuntu",
  "PT Sans",
  "Noto Sans",
];

// Font sizes for different elements
const fontSizeOptions = [
  "8px", "9px", "10px", "11px", "12px", "13px", "14px", "15px", "16px", 
  "17px", "18px", "19px", "20px", "22px", "24px", "26px", "28px", "30px"
];

const headingSizeOptions = [
  "16px", "18px", "20px", "22px", "24px", "26px", "28px", "30px", "32px", 
  "34px", "36px", "38px", "40px", "42px", "44px", "46px", "48px", "50px"
];

const pageSizeOptions = [
  "A4", "Letter", "Legal", "A3", "Executive"
];

// Font size presets for the toggle buttons
const fontPresets = {
  small: { fontSize: "12px", headingSize: "20px" },
  normal: { fontSize: "14px", headingSize: "24px" },
  large: { fontSize: "16px", headingSize: "28px" }
};

const DesignFormattingComponent = ({ designSettings, setDesignSettings }) => {
  const [showAllColors, setShowAllColors] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  

  // Get current preset based on font size and heading size exactly
  const getCurrentPreset = () => {
    const fs = designSettings.fontSize;
    const hs = designSettings.headingSize;
    if (fs === fontPresets.small.fontSize && hs === fontPresets.small.headingSize) return "small";
    if (fs === fontPresets.normal.fontSize && hs === fontPresets.normal.headingSize) return "normal";
    if (fs === fontPresets.large.fontSize && hs === fontPresets.large.headingSize) return "large";
    return null; // return null if no exact preset match
  };

  const [resumeDefaultColor] = useState(designSettings.color);

  const resetColor = () => {
    setDesignSettings({ ...designSettings, color: resumeDefaultColor });
  };

  const resetToDefault = () => {
    setDesignSettings({
      color: "#0951b0ff",
      font: "EB Garamond",
      fontSize: "14px",
      fontStyle: "normal",
      headingSize: "24px",
      sectionSpacing: 50,
      paragraphSpacing: 30,
      lineSpacing: 20,
      topBottomMargin: 40,
      sideMargins: 40,
      lineWeight: 1,
      pageSize: "A4"
    });
    setShowAdvanced(false);
  };

  const toggleAdvanced = () => {
    setShowAdvanced(!showAdvanced);
  };

  // Handle font preset change (guard against null)
  const handleFontPresetChange = (preset) => {
    if (!preset || !fontPresets[preset]) return;
    setDesignSettings({
      ...designSettings,
      fontSize: fontPresets[preset].fontSize,
      headingSize: fontPresets[preset].headingSize
    });
  };

  return (
    <Box display="flex" flex={1} height="100%">
      <Box width="320px" p={2} sx={{ flexShrink: 0, overflowY: "auto" }}>
        <Typography variant="h6" gutterBottom>
          Design & formatting
        </Typography>

        {/* Recommended Colors */}
        <Box mt={3}>
          <Typography gutterBottom>Recommended Colors</Typography>
          <Box display="flex" gap={1} flexWrap="wrap">
            {/* Reset Color Option */}
            <Box
              onClick={resetColor}
              sx={{
                width: 24,
                height: 24,
                borderRadius: "50%",
                bgcolor: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "2px dashed #000",
                cursor: "pointer",
                fontSize: "12px",
                color: "#000",
                fontWeight: "bold",
              }}
            >
              R
            </Box>

            {/* Recommended Colors */}
            {recommendedColors.map((color) => (
              <Box
                key={color}
                onClick={() => setDesignSettings({ ...designSettings, color })}
                sx={{
                  width: 24,
                  height: 24,
                  borderRadius: "50%",
                  bgcolor: color,
                  border:
                    designSettings.color === color
                      ? "2px solid #000"
                      : "2px solid transparent",
                  cursor: "pointer",
                  "&:hover": {
                    transform: "scale(1.1)",
                    transition: "transform 0.2s"
                  }
                }}
              />
            ))}
          </Box>

          {/* See All / See Less button */}
          <Button
            size="small"
            onClick={() => setShowAllColors(!showAllColors)}
            sx={{ mt: 1, textTransform: "none" }}
          >
            {showAllColors ? "See Less" : "See All"}
          </Button>

          {/* All Colors (shown only if toggled) */}
          {showAllColors && (
            <>
              <Typography variant="body2" sx={{ mt: 2 }}>
                All Colors
              </Typography>
              <Grid container spacing={1} mt={1}>
                {allColors.map((color) => (
                  <Grid item xs={3} key={color}>
                    <Box
                      onClick={() => setDesignSettings({...designSettings, color})}
                      sx={{
                        width: 24,
                        height: 24,
                        borderRadius: "50%",
                        bgcolor: color,
                        border:
                          designSettings.color === color
                            ? "2px solid #000"
                            : "2px solid transparent",
                        cursor: "pointer",
                        "&:hover": {
                          transform: "scale(1.1)",
                          transition: "transform 0.2s"
                        }
                      }}
                    />
                  </Grid>
                ))}
              </Grid>
            </>
          )}
        </Box>

        

        {/* Font selection */}
        <Typography variant="subtitle2" sx={{ mt: 3 }}>
          Font style
        </Typography>
        <ToggleButtonGroup
          value={getCurrentPreset()}
          exclusive
          onChange={(e, v) => {
            // v will be null if user deselects the active button — ignore it
            if (v) handleFontPresetChange(v);
          }}
          sx={{ mb: 2 }}
          fullWidth
        >
          <ToggleButton value="small">Small</ToggleButton>
          <ToggleButton value="normal">Normal</ToggleButton>
          <ToggleButton value="large">Large</ToggleButton>
        </ToggleButtonGroup>

        <FormControl fullWidth sx={{ mb: 2, mt: 1 }}>
          <InputLabel>Font Family</InputLabel>
          <Select
            value={designSettings.font}
            onChange={(e) => setDesignSettings({...designSettings, font: e.target.value})}
            label="Font Family"
            MenuProps={{
              PaperProps: {
                style: {
                  maxHeight: 300,
                },
              },
            }}
          >
            {fontOptions.map((f) => (
              <MenuItem key={f} value={f}>
                {f}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Basic spacing controls */}
        <Typography gutterBottom>Section Spacing: {designSettings.sectionSpacing}px</Typography>
        <Slider
          value={designSettings.sectionSpacing}
          onChange={(e, v) => setDesignSettings({...designSettings, sectionSpacing: v})}
          min={10}
          max={100}
        />

        <Typography gutterBottom sx={{ mt: 2 }}>Paragraph Spacing: {designSettings.paragraphSpacing}px</Typography>
        <Slider
          value={designSettings.paragraphSpacing}
          onChange={(e, v) => setDesignSettings({...designSettings, paragraphSpacing: v})}
          min={10}
          max={80}
        />

        <Typography gutterBottom sx={{ mt: 2 }}>Line Spacing: {designSettings.lineSpacing}px</Typography>
        <Slider
          value={designSettings.lineSpacing}
          onChange={(e, v) => setDesignSettings({...designSettings, lineSpacing: v})}
          min={10}
          max={50}
        />

        {/* Advanced options */}
        <Collapse in={showAdvanced}>
          <Divider sx={{ my: 2 }} />
          <Typography variant="subtitle2" gutterBottom>
            Advanced Formatting
          </Typography>

          {/* Font size controls */}
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Font Size</InputLabel>
            <Select
              value={designSettings.fontSize}
              onChange={(e) => setDesignSettings({...designSettings, fontSize: e.target.value})}
              label="Font Size"
              MenuProps={{
                PaperProps: {
                  style: {
                    maxHeight: 300,
                  },
                },
              }}
            >
              {fontSizeOptions.map((size) => (
                <MenuItem key={size} value={size}>
                  {size}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Heading Size</InputLabel>
            <Select
              value={designSettings.headingSize}
              onChange={(e) => setDesignSettings({...designSettings, headingSize: e.target.value})}
              label="Heading Size"
              MenuProps={{
                PaperProps: {
                  style: {
                    maxHeight: 300,
                  },
                },
              }}
            >
              {headingSizeOptions.map((size) => (
                <MenuItem key={size} value={size}>
                  {size}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Additional advanced controls */}
          <Typography gutterBottom>Top/Bottom Margin: {designSettings.topBottomMargin}px</Typography>
          <Slider
            value={designSettings.topBottomMargin}
            onChange={(e, v) => setDesignSettings({...designSettings, topBottomMargin: v})}
            min={10}
            max={100}
          />

          <Typography gutterBottom sx={{ mt: 2 }}>Side Margins: {designSettings.sideMargins}px</Typography>
          <Slider
            value={designSettings.sideMargins}
            onChange={(e, v) => setDesignSettings({...designSettings, sideMargins: v})}
            min={10}
            max={100}
          />

          
          <Typography gutterBottom sx={{ mt: 2 }}>Line Weight: {designSettings.lineWeight}px</Typography>
          <Slider
            value={designSettings.lineWeight}
            onChange={(e, v) => setDesignSettings({...designSettings, lineWeight: v})}
            min={0.5}
            max={3}
            step={0.1}
          />

          <FormControl fullWidth sx={{ mt: 2, mb: 2 }}>
            <InputLabel>Page Size</InputLabel>
            <Select
              value={designSettings.pageSize}
              onChange={(e) => setDesignSettings({...designSettings, pageSize: e.target.value})}
              label="Page Size"
            >
              {pageSizeOptions.map((size) => (
                <MenuItem key={size} value={size}>
                  {size}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Collapse>

        <Button 
          variant="outlined" 
          fullWidth 
          sx={{ mt: 2 }}
          onClick={resetToDefault}
        >
          Reset to default
        </Button>
        <Button 
          variant="outlined" 
          fullWidth 
          onClick={toggleAdvanced}
          startIcon={<EmojiEventsIcon />}
          sx={{
            mt: 1,
            borderColor: '#FFD700',
            color: '#FFD700',
            fontWeight: 'bold',
            boxShadow: '0 0 10px #FFD70088',
            '&:hover': {
              backgroundColor: '#FFD70022',
              boxShadow: '0 0 15px #FFD700AA',
              borderColor: '#FFD700',
            }
          }}
        >
          {showAdvanced ? "Hide Advanced" : "Advanced"}
        </Button>
      </Box>
    </Box>
  );
};

export default DesignFormattingComponent;