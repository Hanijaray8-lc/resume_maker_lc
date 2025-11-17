import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemText,
  IconButton,
} from "@mui/material";

export const resumeMeta = {
  hasPhoto: false,
  columns: 2,
};

const ResumeTemplate = ({
  theme = { primary: "#f4b400", dark: "#000" },
  setTheme,
  font = "Arial",
  fontSize = "14px",
  fontStyle = "normal",
  headingSize = "24px",
  sectionSpacing = 10,
  paragraphSpacing = 10,
  lineSpacing = 20,
  topBottomMargin = 20,
  sideMargins = 20,
  paragraphIndent = 0,
  lineWeight = 1,
  pageSize = "A4",
}) => {
  const [themeColor, setThemeColor] = useState(
    typeof theme === "string" ? { primary: theme, dark: "#000" } : theme
  );

  {/*useEffect(() => {
    setThemeColor(
      typeof theme === "string" ? { primary: theme, dark: "#000" } : theme
    );
  }, [theme]);

  const colors = ["#f4b400", "#1a2b47", "#6a1b9a", "#2e7d32", "#d32f2f", "#f57c00"];*/}

  const contactInfo = [
    "123, Main Street, Birmingham",
    "+123-456-7890",
    "hello@email.com",
    "linkedin.com/in/alanbrown",
  ];

  const proSkills = ["Design Thinking", "Team Work", "Creativity"];
  const perSkills = ["Adaptability", "Leadership"];

  const jobs = [
    {
      company: "Company A",
      duration: "2018 - Present",
      position: "Senior Marketing Manager",
      duties: [
        "Develop and execute marketing strategies.",
        "Lead a high-performing team.",
        "Monitor brand consistency across platforms.",
      ],
    },
    {
      company: "Company B",
      duration: "2015 - 2018",
      position: "Marketing Specialist",
      duties: [
        "Manage budgets and campaigns.",
        "Oversee market research and identify trends.",
        "Report to senior stakeholders.",
      ],
    },
  ];

  const education = [
    { year: "2013 - 2014", place: "University Name", details: "Course details" },
    { year: "2011 - 2013", place: "College Name", details: "Course details" },
    { year: "2009 - 2011", place: "High School", details: "Course details" },
  ];

  return (
    <Box>
      {/* Resume Container */}
      <Box
        sx={{
          width: pageSize === "A4" ? "210mm" : "100%",
          minHeight: pageSize === "A4" ? "297mm" : "100vh",
          mx: "auto",
          bgcolor: "#fff",
          boxShadow: 3,
          display: "flex",
          fontFamily: font,
          fontSize: fontSize,
          fontStyle: fontStyle,
          lineHeight: `${lineSpacing}px`,
          px: `${sideMargins}px`,
          py: `${topBottomMargin}px`,
        }}
      >
        {/* Left Sidebar (30%) */}
        <Box
          sx={{
            width: "30%",
            bgcolor: themeColor.primary,
            color: "black",
            p: 3,
            display: "flex",
            flexDirection: "column",
            "@media print": {
              bgcolor: themeColor.primary,
              color: "black",
              p: 2,
              width: "30%",
              display: "inline-block",
              verticalAlign: "top",
              WebkitPrintColorAdjust: "exact",
              printColorAdjust: "exact",
            },
          }}
        >
          {/* Name + Title */}
          <Typography
            variant="h4"
            fontWeight="bold"
            sx={{ fontSize: headingSize }}
          >
            ALAN
            <br />
            BROWN
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{
              mt: 1,
              bgcolor: "black",
              color: "white",
              textAlign: "center",
              p: 1,
            }}
          >
            JOB TITLE
          </Typography>

          {/* Contact */}
          <Box sx={{ mt: sectionSpacing }}>
            <Typography variant="h6">CONTACT</Typography>
            <List>
              {contactInfo.map((text, i) => (
                <ListItem key={i} disableGutters dense>
                  <ListItemText
                    primary={text}
                    primaryTypographyProps={{
                      color: "black",
                      variant: "body2",
                      sx: {
                        textIndent: `${paragraphIndent}px`,
                        fontWeight: lineWeight,
                      },
                    }}
                  />
                </ListItem>
              ))}
            </List>
          </Box>

          {/* Pro. Skills */}
          <Box sx={{ mt: sectionSpacing }}>
            <Typography variant="h6">PRO. SKILLS</Typography>
            <List>
              {proSkills.map((skill, i) => (
                <ListItem key={i} disableGutters dense>
                  <ListItemText
                    primary={skill}
                    primaryTypographyProps={{
                      color: "black",
                      variant: "body2",
                      sx: {
                        textIndent: `${paragraphIndent}px`,
                        fontWeight: lineWeight,
                      },
                    }}
                  />
                </ListItem>
              ))}
            </List>
          </Box>

          {/* Per. Skills */}
          <Box sx={{ mt: sectionSpacing }}>
            <Typography variant="h6">PER. SKILLS</Typography>
            <List>
              {perSkills.map((skill, i) => (
                <ListItem key={i} disableGutters dense>
                  <ListItemText
                    primary={skill}
                    primaryTypographyProps={{
                      color: "black",
                      variant: "body2",
                      sx: {
                        textIndent: `${paragraphIndent}px`,
                        fontWeight: lineWeight,
                      },
                    }}
                  />
                </ListItem>
              ))}
            </List>
          </Box>

          {/* References */}
          <Box sx={{ mt: sectionSpacing }}>
            <Typography variant="h6">REFERENCES</Typography>
            <Typography variant="body2">Available on request</Typography>
          </Box>
        </Box>

        {/* Right Content (70%) */}
        <Box
          sx={{
            width: "70%",
            p: 4,
            "@media print": {
              width: "70%",
              p: 2,
              display: "inline-block",
              verticalAlign: "top",
              WebkitPrintColorAdjust: "exact",
              printColorAdjust: "exact",
            },
          }}
        >
          {/* Profile */}
          <Typography
            variant="h6"
            sx={{
               bgcolor: "black",
              color: "white",
              p: 1,
              pl: 2,
              fontSize: headingSize,
            }}
          >
            PROFILE
          </Typography>
          <Typography
            variant="body2"
            sx={{
              mt: 1,
              textIndent: `${paragraphIndent}px`,
              fontWeight: lineWeight,
              mb: paragraphSpacing,
            }}
          >
            Write a short brief introduction of just a few short paragraphs
            explaining your key skills, career background, and what you’re
            looking for. Keep it professional and simple.
          </Typography>

          {/* Career */}
          <Box sx={{ mt: sectionSpacing }}>
            <Typography
              variant="h6"
              sx={{
                  bgcolor: "black",
                color: "white",
                p: 1,
                pl: 2,
                fontSize: headingSize,
              }}
            >
              CAREER
            </Typography>
            {jobs.map((job, i) => (
              <Box key={i} sx={{ mt: 2 }}>
                <Typography
                  variant="subtitle1"
                  fontWeight="bold"
                  sx={{ fontSize }}
                >
                  {job.company} — {job.position}
                  <span style={{ float: "right" }}>{job.duration}</span>
                </Typography>
                <ul style={{ paddingLeft: `${paragraphIndent + 20}px` }}>
                  {job.duties.map((duty, idx) => (
                    <li key={idx}>{duty}</li>
                  ))}
                </ul>
              </Box>
            ))}
          </Box>

          {/* Education */}
          <Box sx={{ mt: sectionSpacing }}>
            <Typography
              variant="h6"
              sx={{
                bgcolor: "black",
                color: "white",
                p: 1,
                pl: 2,
                fontSize: headingSize,
              }}
            >
              EDUCATION
            </Typography>
            {education.map((edu, i) => (
              <Box key={i} sx={{ mt: 1 }}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    textIndent: `${paragraphIndent}px`,
                    fontWeight: lineWeight,
                  }}
                >
                  {edu.year}
                </Typography>
                <Typography variant="body2">{edu.place}</Typography>
                <Typography variant="body2">{edu.details}</Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

     
    </Box>
  );
};

export default ResumeTemplate;
