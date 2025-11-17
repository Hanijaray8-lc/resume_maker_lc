import React from "react";
import { Box, Typography, Avatar, Divider, Grid } from "@mui/material";

const Resume = ({
  color = "#1a2b47",
  font = "Arial",
  fontSize = "14px",
  fontStyle = "normal",
  headingSize = "24px",
  sectionSpacing = 20,
  paragraphSpacing = 10,
  lineSpacing = 20,
  topBottomMargin = 40,
  sideMargins = 40,
  paragraphIndent = 0,
  lineWeight = 1,
  pageSize = "A4",
}) => {
  // Page size mapping (mm)
  const pageDimensions = {
    A4: { w: "210mm", h: "297mm" },
    Letter: { w: "216mm", h: "279mm" },
    Legal: { w: "216mm", h: "356mm" },
    A3: { w: "297mm", h: "420mm" },
    Executive: { w: "184mm", h: "267mm" },
  };

  const { w, h } = pageDimensions[pageSize] || pageDimensions.A4;

  return (
    <Box
      sx={{
        width: w,
        height: h,
        mx: "auto",
        boxShadow: 3,
        display: "flex",
        flexDirection: "column",
        bgcolor: "#fff",
        color,
        fontFamily: font,
        fontSize,
        fontStyle,
        p: `${topBottomMargin}px ${sideMargins}px`,
        lineHeight: `${lineSpacing}px`,
      }}
    >
      {/* Header */}
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={3}>
          <Avatar
            src="https://randomuser.me/api/portraits/men/45.jpg"
            sx={{ width: 120, height: 120, border: `3px solid ${color}` }}
          />
        </Grid>
        <Grid item xs={9}>
          <Typography
            sx={{ fontSize: headingSize, fontWeight: "bold", color }}
          >
            JOHN DOE
          </Typography>
          <Typography variant="subtitle1">Software Engineer</Typography>
          <Typography variant="body2">📧 john.doe@email.com</Typography>
          <Typography variant="body2">📞 +91 98765 43210</Typography>
        </Grid>
      </Grid>

      <Divider sx={{ my: 2, borderColor: color, borderWidth: lineWeight }} />

      <Grid container spacing={3}>
        {/* Left Column */}
        <Grid item xs={5}>
          <Box mb={`${sectionSpacing}px`}>
            <Typography
              sx={{ fontSize: headingSize, fontWeight: "bold", color }}
            >
              Profile
            </Typography>
            <Typography
              sx={{ mt: `${paragraphSpacing / 4}px`, textIndent: paragraphIndent }}
            >
              Experienced software engineer with a strong background in
              full-stack development, cloud solutions, and problem solving.
            </Typography>
          </Box>

          <Box mb={`${sectionSpacing}px`}>
            <Typography
              sx={{ fontSize: headingSize, fontWeight: "bold", color }}
            >
              Skills
            </Typography>
            <ul style={{ paddingLeft: "20px", marginTop: 4 }}>
              <li>React, Node.js, MongoDB</li>
              <li>Java, Spring Boot</li>
              <li>AWS, Docker</li>
              <li>Problem Solving</li>
            </ul>
          </Box>

          <Box>
            <Typography
              sx={{ fontSize: headingSize, fontWeight: "bold", color }}
            >
              Education
            </Typography>
            <Typography variant="subtitle2">B.Tech in CSE</Typography>
            <Typography variant="body2">
              XYZ University, 2014 - 2018
            </Typography>
          </Box>
        </Grid>

        {/* Right Column */}
        <Grid item xs={7}>
          <Box mb={`${sectionSpacing}px`}>
            <Typography
              sx={{ fontSize: headingSize, fontWeight: "bold", color }}
            >
              Experience
            </Typography>

            <Box mb={`${paragraphSpacing}px`}>
              <Typography variant="subtitle1" fontWeight="bold">
                Senior Software Engineer
              </Typography>
              <Typography variant="body2">ABC Tech | 2020 - Present</Typography>
              <Typography variant="body2">
                Leading a team of developers building scalable web applications.
              </Typography>
            </Box>

            <Box mb={`${paragraphSpacing}px`}>
              <Typography variant="subtitle1" fontWeight="bold">
                Software Developer
              </Typography>
              <Typography variant="body2">XYZ Solutions | 2018 - 2020</Typography>
              <Typography variant="body2">
                Worked on REST APIs and frontend dashboards for enterprise apps.
              </Typography>
            </Box>
          </Box>

          <Box>
            <Typography
              sx={{ fontSize: headingSize, fontWeight: "bold", color }}
            >
              Projects
            </Typography>
            <ul style={{ paddingLeft: "20px", marginTop: 4 }}>
              <li>E-commerce Platform with MERN stack</li>
              <li>AI-based Resume Screener</li>
              <li>Hospital Management System</li>
            </ul>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};
export const resumeMeta = {
  hasPhoto: true,
  columns: 1,
};
export default Resume;
