import React, { useState, useEffect } from "react";
import { Box, Typography, IconButton } from "@mui/material";

export const resumeMeta = {
  hasPhoto: false,
  columns: 1,
};

const ResumeMatthew = ({
  theme = "#1a2b47",
  setTheme,
  color,
  font = "Arial",
  fontSize = "14px",
  fontStyle = "normal",
  headingSize = "20px",
  sectionSpacing = 30,
  paragraphSpacing = 12,
  lineSpacing = 22,
  topBottomMargin = 30,
  sideMargins = 30,
  paragraphIndent = 0,
  lineWeight = 1,
  pageSize = "A4",
}) => {
  const [themeColor, setThemeColor] = useState(color || theme);

  useEffect(() => {
    setThemeColor(color || theme);
  }, [color, theme]);

  const colors = ["#1a2b47", "#6a1b9a", "#2e7d32", "#d32f2f", "#f57c00"];

  const getPageWidth = () => {
    switch (pageSize) {
      case "Letter":
      case "Legal":
        return "216mm";
      case "A3":
        return "297mm";
      case "Executive":
        return "184mm";
      default:
        return "210mm";
    }
  };

  const getPageHeight = () => {
    switch (pageSize) {
      case "A3":
        return "420mm";
      case "Legal":
        return "356mm";
      case "Letter":
      case "Executive":
        return "279mm";
      default:
        return "297mm";
    }
  };

  const sectionTitleStyle = {
    color: themeColor,
    fontWeight: "bold",
    fontSize: headingSize,
    marginTop: `${sectionSpacing}px`,
    marginBottom: "8px",
  };

  const paragraphStyle = {
    marginTop: `${paragraphSpacing}px`,
    textIndent: `${paragraphIndent}px`,
  };

  const listStyle = {
    marginTop: `${paragraphSpacing}px`,
    paddingLeft: `${paragraphIndent + 20}px`,
    lineHeight: `${lineSpacing}px`,
  };

  return (
    <Box>
      <Box
        sx={{
          width: getPageWidth(),
          minHeight: getPageHeight(),
          bgcolor: "#fff",
          color: "#000",
          pt: `${topBottomMargin}px`,
          pb: `${topBottomMargin}px`,
          pl: `${sideMargins}px`,
          pr: `${sideMargins}px`,
          mx: "auto",
          boxShadow: 5,
          fontFamily: font,
          fontSize: fontSize,
          lineHeight: `${lineSpacing}px`,
          fontStyle: fontStyle,
          position: "relative",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            bgcolor: themeColor,
            color: "#fff",
            p: 3,
            textAlign: "center",
            "@media print": {
              bgcolor: themeColor,
              color: "#fff",
              WebkitPrintColorAdjust: "exact",
              printColorAdjust: "exact",
            },
          }}
        >
          <Typography variant="body1">+1 (970) 333-3833</Typography>
          <Typography variant="body1">matthew.eliot@mail.com</Typography>
          <Typography variant="body1">
            https://linkedin.com/mattheweliot
          </Typography>
          <Typography variant="h4" fontWeight="bold" mt={1}>
            MATTHEW ELIOT
          </Typography>
        </Box>

        {/* Summary */}
        <Box sx={{ mt: `${sectionSpacing}px` }}>
          <Typography sx={sectionTitleStyle}>Summary</Typography>
          <Typography variant="body2" sx={paragraphStyle}>
            Senior Web Developer specializing in front end development.
            Experienced with all stages of the development cycle for dynamic web
            projects. Well-versed in numerous programming languages including
            <b> HTML5, PHP OOP, JavaScript, CSS, MySQL</b>. Strong background in
            project management and customer relations.
          </Typography>
        </Box>

        {/* Skills */}
        <Box>
          <Typography sx={sectionTitleStyle}>Skill Highlights</Typography>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 1,
            }}
          >
            <Typography variant="body2">• Project management</Typography>
            <Typography variant="body2">• Creative design</Typography>
            <Typography variant="body2">• Strong decision maker</Typography>
            <Typography variant="body2">• Innovative</Typography>
            <Typography variant="body2">• Complex problem solver</Typography>
            <Typography variant="body2">• Service-focused</Typography>
          </Box>
        </Box>

        {/* Experience */}
        <Box>
          <Typography sx={sectionTitleStyle}>Experience</Typography>
          <Typography fontWeight="bold" variant="body2" sx={{ mt: `${paragraphSpacing}px` }}>
            Web Developer – 09/2015 to 05/2019
          </Typography>
          <Typography variant="body2" sx={{ fontStyle: "italic" }}>
            Luna Web Design, New York
          </Typography>
          <ul style={listStyle}>
            <li>
              Cooperate with designers to create clean interfaces and simple,
              intuitive interactions and experiences.
            </li>
            <li>Develop project concepts and maintain optimal workflow.</li>
            <li>
              Work with senior developer to manage large, complex design
              projects for corporate clients.
            </li>
            <li>
              Complete detailed programming and development tasks for front end
              public and internal websites as well as challenging back-end
              server code.
            </li>
            <li>
              Carry out quality assurance tests to discover errors and optimize
              usability.
            </li>
          </ul>
        </Box>

        {/* Education */}
        <Box>
          <Typography sx={sectionTitleStyle}>Education</Typography>
          <Typography variant="body2" fontWeight="bold" sx={{ mt: `${paragraphSpacing}px` }}>
            Bachelor of Science: Computer Information Systems – 2014
          </Typography>
          <Typography variant="body2">Columbia University, NY</Typography>
        </Box>

        {/* Certifications */}
        <Box>
          <Typography sx={sectionTitleStyle}>Certifications</Typography>
          <Typography variant="body2" sx={paragraphStyle}>
            PHP Framework (certificate): Zend, Codeigniter, Symfony.
          </Typography>
          <Typography variant="body2" sx={paragraphStyle}>
            Programming Languages: JavaScript, HTML5, PHP OOP, CSS, SQL, MySQL.
          </Typography>
        </Box>
      </Box>

      {/* Theme Selector */}
      
    </Box>
  );
};

export default ResumeMatthew;
