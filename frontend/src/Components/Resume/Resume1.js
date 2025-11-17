import React from "react";
import {
  Box,
  Grid,
  Typography,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";

export const resumeMeta = {
  hasPhoto: true,
  columns: 2,
};

// Map page size to CSS dimensions
const pageSizeMap = {
  A4: { width: "210mm", height: "297mm" },
  Letter: { width: "216mm", height: "279mm" },
  Legal: { width: "216mm", height: "356mm" },
  A3: { width: "297mm", height: "420mm" },
  Executive: { width: "184mm", height: "267mm" },
};

const Resume1 = ({
  color = "#1a2b47",
  font = "EB Garamond",
  fontSize = "14px",
  headingSize = "24px",
  fontStyle = "normal",
  sectionSpacing = 50,
  paragraphSpacing = 30,
  lineSpacing = 20,
  topBottomMargin = 40,
  sideMargins = 40,
  paragraphIndent = 0,
  lineWeight = 1,
  pageSize = "A4",
}) => {
  const page = pageSizeMap[pageSize] || pageSizeMap.A4;

  return (
    <Box
      sx={{
        width: page.width,
        minHeight: page.height,
        mx: "auto",
        bgcolor: "#fff",
        boxShadow: 3,
        fontFamily: font,
        fontSize: fontSize,
        fontStyle: fontStyle,
        lineHeight: `${lineSpacing / 20}`,
        p: `${topBottomMargin}px ${sideMargins}px`,
        "@media print": {
          width: page.width,
          height: page.height,
          boxShadow: "none",
          m: 0,
        },
      }}
    >
      <Grid container>
        {/* Left Section (30%) */}
        <Grid
          item
          xs={12}
          md="auto"
          sx={{
            width: { xs: "100%", md: "30%" },
            bgcolor: color,
            color: "white",
            p: 3,
            "@media print": {
              p: 2,
              bgcolor: color,
              color: "white",
              WebkitPrintColorAdjust: "exact",
              printColorAdjust: "exact",
              width: "30%", // Add this line for print
              display: "inline-block", // Ensures side-by-side layout
              verticalAlign: "top",
            },
          }}
        >
          <Box display="flex" flexDirection="column" alignItems="center">
            <Avatar
              src="https://via.placeholder.com/150"
              sx={{ width: 120, height: 120, mb: 2 }}
            />
            <Typography
              sx={{ mb: 2, fontSize: headingSize, fontWeight: "bold" }}
            >
              CONTACT
            </Typography>
            <List dense>
              {[
                "+123-456-7890",
                "hello@reallygreatsite.com",
                "123 Anywhere St., Any City",
                "www.reallygreatsite.com",
              ].map((text, i) => (
                <ListItem
                  key={i}
                  disableGutters
                  sx={{
                    mb: `${paragraphSpacing / 10}px`,
                    pl: `${paragraphIndent}px`,
                  }}
                >
                  <ListItemText
                    primary={text}
                    primaryTypographyProps={{
                      color: "white",
                      fontSize: fontSize,
                      style: { fontStyle },
                    }}
                  />
                </ListItem>
              ))}
            </List>

            <Divider sx={{ bgcolor: "white", my: sectionSpacing / 20, borderBottomWidth: lineWeight }} />

            <Typography sx={{ mb: 1, fontSize: headingSize, fontWeight: "bold" }}>
              EDUCATION
            </Typography>
            <Typography sx={{ mb: `${paragraphSpacing / 10}px` }}>
              2029 - 2030 <br />
              Wardiere University <br />
              Master of Business Management
            </Typography>
            <Typography sx={{ mb: `${paragraphSpacing / 10}px` }}>
              2025 - 2029 <br />
              Wardiere University <br />
              Bachelor of Business <br />
              GPA: 3.8 / 4.0
            </Typography>

            <Divider sx={{ bgcolor: "white", my: sectionSpacing / 20, borderBottomWidth: lineWeight }} />

            <Typography sx={{ mb: 1, fontSize: headingSize, fontWeight: "bold" }}>
              SKILLS
            </Typography>
            <List dense>
              {[
                "Project Management",
                "Public Relations",
                "Teamwork",
                "Time Management",
                "Leadership",
              ].map((skill, i) => (
                <ListItem
                  key={i}
                  disableGutters
                  sx={{
                    mb: `${paragraphSpacing / 10}px`,
                    pl: `${paragraphIndent}px`,
                  }}
                >
                  <ListItemText
                    primary={skill}
                    primaryTypographyProps={{
                      color: "white",
                      fontSize: fontSize,
                      style: { fontStyle },
                    }}
                  />
                </ListItem>
              ))}
            </List>

            <Divider sx={{ bgcolor: "white", my: sectionSpacing / 20, borderBottomWidth: lineWeight }} />

          </Box>
        </Grid>

        {/* Right Section (70%) */}
        <Grid
          item
          xs={12}
          md="auto"
          sx={{
            width: { xs: "100%", md: "70%" },
            p: 4,
            "@media print": {
              p: 2,
              width: "70%", // Add this line for print
              display: "inline-block",
              verticalAlign: "top",
            },
          }}
        >
          <Typography
            sx={{ mb: `${paragraphSpacing / 10}px`, fontSize: headingSize, fontWeight: "bold" }}
          >
            RICHARD <span style={{ color: color }}>SANCHEZ</span>
          </Typography>
          <Typography sx={{ mb: 2, fontSize: fontSize }}>
            MARKETING MANAGER
          </Typography>

          <Divider sx={{ my: sectionSpacing / 20, borderBottomWidth: lineWeight }} />

          <Typography sx={{ mb: 1, fontSize: headingSize, fontWeight: "bold" }}>
            PROFILE
          </Typography>
          <Typography
            sx={{
              mb: `${paragraphSpacing / 10}px`,
              fontSize: fontSize,
              pl: `${paragraphIndent}px`,
            }}
          >
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </Typography>

          <Typography sx={{ mb: 1, fontSize: headingSize, fontWeight: "bold" }}>
            WORK EXPERIENCE
          </Typography>
          <Box sx={{ mt: 2 }}>
            {[
              {
                company: "Borcelle Studio",
                duration: "2030 - Present",
                position: "Marketing Manager & Specialist",
                duties: [
                  "Develop and execute marketing strategies.",
                  "Lead, mentor, and manage a high-performing team.",
                  "Monitor brand consistency.",
                ],
              },
              {
                company: "Fauget Studio",
                duration: "2025 - 2029",
                position: "Marketing Manager & Specialist",
                duties: [
                  "Create and manage the marketing budget.",
                  "Oversee market research and identify trends.",
                  "Monitor brand consistency.",
                ],
              },
              {
                company: "Studio Shodwe",
                duration: "2024 - 2025",
                position: "Marketing Manager & Specialist",
                duties: [
                  "Develop and maintain strong relationships with partners.",
                  "Monitor and maintain brand consistency.",
                ],
              },
            ].map((job, i) => (
              <Box key={i} sx={{ mb: 2 }}>
                <Typography
                  sx={{ fontWeight: "bold", fontSize: fontSize }}
                >
                  {job.company}
                  <span style={{ float: "right" }}>{job.duration}</span>
                </Typography>
                <Typography sx={{ fontSize: fontSize }}>
                  {job.position}
                </Typography>
                <ul style={{ marginTop: 4, marginBottom: 4 }}>
                  {job.duties.map((duty, idx) => (
                    <li
                      key={idx}
                      style={{
                        fontSize,
                        marginBottom: `${paragraphSpacing / 20}px`,
                        paddingLeft: paragraphIndent,
                      }}
                    >
                      {duty}
                    </li>
                  ))}
                </ul>
              </Box>
            ))}
          </Box>

          <Divider sx={{ my: sectionSpacing / 20, borderBottomWidth: lineWeight }} />

          <Typography sx={{ fontSize: headingSize, fontWeight: "bold" }}>
            REFERENCE
          </Typography>
          <Grid container spacing={2} mt={1}>
            <Grid item xs={6}>
              <Typography sx={{ fontSize: fontSize, fontWeight: "bold" }}>
                Estelle Darcy
              </Typography>
              <Typography sx={{ fontSize: fontSize }}>
                Wardiere Inc. / CTO
              </Typography>
              <Typography sx={{ fontSize: fontSize }}>
                Phone: 123-456-7890
              </Typography>
              <Typography sx={{ fontSize: fontSize }}>
                Email: hello@reallygreatsite.com
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography sx={{ fontSize: fontSize, fontWeight: "bold" }}>
                Harper Richard
              </Typography>
              <Typography sx={{ fontSize: fontSize }}>
                Wardiere Inc. / CEO
              </Typography>
              <Typography sx={{ fontSize: fontSize }}>
                Phone: 123-456-7890
              </Typography>
              <Typography sx={{ fontSize: fontSize }}>
                Email: hello@reallygreatsite.com
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Resume1;
