import React from "react";
import {
  Box,
  Typography,
  Avatar,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";

const Resume4 = ({
  theme = { primary: "#1a2b47", dark: "#333" },
  color = "#1a2b47",
  font = "Arial",
  fontSize = "14px",
  fontStyle = "normal",
  headingSize = "24px",
  sectionSpacing = 10,
  paragraphSpacing = 10,
  lineSpacing = 20,
  topBottomMargin = 40,
  sideMargins = 40,
  paragraphIndent = 0,
  lineWeight = 1,
  pageSize = "A4",
  setTheme,
}) => {
  // FIX: Use both theme and color props correctly
  const primaryColor = theme?.primary || color || "#1a2b47";
  const darkColor = theme?.dark || "#333";

  return (
    <Box
      sx={{
        width: pageSize === "A4" ? "210mm" : "100%",
        minHeight: pageSize === "A4" ? "297mm" : "100vh",
        bgcolor: "#fff",
        display: "flex",
        flexDirection: "row",
        boxShadow: 3,
        fontFamily: font,
        fontSize: fontSize,
        fontStyle: fontStyle,
        lineHeight: `${lineSpacing}px`,
        px: `${sideMargins}px`,
        py: `${topBottomMargin}px`,
      }}
    >
      {/* Left Sidebar */}
      <Box
        sx={{
          bgcolor: primaryColor,
          color: "#fff",
          width: "35%",
          p: 3,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          "@media print": {
            bgcolor: primaryColor,
            color: "#fff",
            p: 2,
            width: "35%",
            display: "inline-block",
            verticalAlign: "top",
            WebkitPrintColorAdjust: "exact",
            printColorAdjust: "exact",
          },
        }}
      >
        {/* Profile Image */}
        <Box textAlign="center" mb={3}>
          <Avatar
            src="/profile.jpg"
            alt="profile"
            sx={{ width: 140, height: 140, mx: "auto", mb: 2 }}
          />
          <Typography variant="h5" fontWeight="bold" sx={{ fontSize: headingSize }}>
            William Gabriel
          </Typography>
          <Typography variant="subtitle1" sx={{ fontSize: fontSize }}>
            Web Developer
          </Typography>
        </Box>

        {/* Contact */}
        <Box mb={3}>
          <Typography
            variant="h6"
            sx={{ 
              bgcolor: darkColor,
              p: 1, 
              fontWeight: "bold",
              fontSize: headingSize 
            }}
          >
            CONTACT
          </Typography>
          <List>
            <ListItem sx={{ py: 0 }}>
              <ListItemText
                primary="ADDRESS:"
                secondary="123 Anywhere St., Any City, ST 12345"
                primaryTypographyProps={{ 
                  fontWeight: "bold", 
                  fontSize: fontSize,
                  color: "#fff"
                }}
                secondaryTypographyProps={{ 
                  fontSize: fontSize,
                  color: "#fff" 
                }}
              />
            </ListItem>
            <ListItem sx={{ py: 0 }}>
              <ListItemText
                primary="EMAIL:"
                secondary="hello@techguruplus.com"
                primaryTypographyProps={{ 
                  fontWeight: "bold", 
                  fontSize: fontSize,
                  color: "#fff"
                }}
                secondaryTypographyProps={{ 
                  fontSize: fontSize,
                  color: "#fff" 
                }}
              />
            </ListItem>
            <ListItem sx={{ py: 0 }}>
              <ListItemText
                primary="WEBSITE:"
                secondary="www.techguruplus.com"
                primaryTypographyProps={{ 
                  fontWeight: "bold", 
                  fontSize: fontSize,
                  color: "#fff"
                }}
                secondaryTypographyProps={{ 
                  fontSize: fontSize,
                  color: "#fff" 
                }}
              />
            </ListItem>
            <ListItem sx={{ py: 0 }}>
              <ListItemText
                primary="SOCIAL:"
                secondary="@techguruplus"
                primaryTypographyProps={{ 
                  fontWeight: "bold", 
                  fontSize: fontSize,
                  color: "#fff"
                }}
                secondaryTypographyProps={{ 
                  fontSize: fontSize,
                  color: "#fff" 
                }}
              />
            </ListItem>
          </List>
        </Box>

        {/* Skills */}
        <Box mb={3}>
          <Typography
            variant="h6"
            sx={{ 
              bgcolor: darkColor,
              p: 1, 
              fontWeight: "bold",
              fontSize: headingSize 
            }}
          >
            SKILLS
          </Typography>
          <List dense>
            {[
              "Front-end Coding",
              "User Interface/User Experience",
              "Custom Databases",
              "Programming",
              "Web Design",
              "Multiplatform Mobile App Development",
            ].map((skill, i) => (
              <ListItem key={i} sx={{ py: 0 }}>
                <ListItemText 
                  primary={skill} 
                  primaryTypographyProps={{ 
                    fontSize: fontSize,
                    color: "#fff"
                  }}
                />
              </ListItem>
            ))}
          </List>
        </Box>

      
      </Box>

      {/* Right Content */}
      <Box sx={{ width: "65%", p: 4 }}>
        {/* Header */}
        <Typography 
          variant="h3" 
          fontWeight="bold" 
          sx={{ 
            fontSize: headingSize,
            color: primaryColor
          }}
        >
          WILLIAM GABRIEL
        </Typography>
        <Typography 
          variant="h6" 
          sx={{ 
            mb: 3, 
            fontSize: fontSize,
            color: primaryColor
          }}
        >
          WEB DEVELOPER
        </Typography>

        {/* Education */}
        <Box mb={sectionSpacing}>
          <Typography
            variant="h6"
            sx={{ 
              bgcolor: primaryColor,
              color: "#fff", 
              px: 1, 
              py: 0.5,
              fontSize: headingSize 
            }}
          >
            EDUCATION
          </Typography>
          <Box mt={1}>
            <Typography fontWeight="bold" sx={{ fontSize: fontSize }}>
              Master of Science (2016)
            </Typography>
            <Typography sx={{ fontSize: fontSize }}>Fradel and Spies University</Typography>
            <Typography fontWeight="bold" mt={1} sx={{ fontSize: fontSize }}>
              Bachelor of Information Technology (2014)
            </Typography>
            <Typography sx={{ fontSize: fontSize }}>Borcelle University</Typography>
          </Box>
        </Box>

        {/* Work Experience */}
        <Box mb={paragraphSpacing}>
          <Typography
            variant="h6"
            sx={{ 
              bgcolor: primaryColor,
              color: "#fff", 
              px: 1, 
              py: 0.5,
              fontSize: headingSize 
            }}
          >
            WORK EXPERIENCE
          </Typography>

          <Box mt={2}>
            <Typography fontWeight="bold" sx={{ fontSize: fontSize }}>
              Senior Web Developer at Wardiere Inc.
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: fontSize }}>
              October 2019 - Current
            </Typography>
            <ul style={{ paddingLeft: "20px", marginTop: 4 }}>
              <li style={{ fontSize: fontSize }}>Editing, authoring, or developing website content.</li>
              <li style={{ fontSize: fontSize }}>Backup files from websites to local folders.</li>
              <li style={{ fontSize: fontSize }}>Identifying and resolving consumer feedback issues.</li>
              <li style={{ fontSize: fontSize }}>Evaluating code to guarantee compliance.</li>
              <li style={{ fontSize: fontSize }}>
                Analyzing technical requirements to determine user needs.
              </li>
            </ul>
          </Box>

          <Box mt={2}>
            <Typography fontWeight="bold" sx={{ fontSize: fontSize }}>
              Web Developer at Studio Shodwe
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: fontSize }}>
              February 2015 - September 2019
            </Typography>
            <ul style={{ paddingLeft: "20px", marginTop: 4 }}>
              <li style={{ fontSize: fontSize }}>Creating and maintaining websites/software apps.</li>
              <li style={{ fontSize: fontSize }}>
                Using scripting or writing languages, management tools, and
                digital media.
              </li>
              <li style={{ fontSize: fontSize }}>
                Meeting with teams to resolve problems and define solutions.
              </li>
              <li style={{ fontSize: fontSize }}>Directing or conducting website updates.</li>
            </ul>
          </Box>
        </Box>

          {/* Reference */}
        <Box>
          <Typography
            variant="h6"
            sx={{ 
              bgcolor: primaryColor,
              p: 1, 
              fontWeight: "bold",
              fontSize: headingSize ,
              color:'white'
            }}
          >
            REFERENCE
          </Typography>
          <Typography variant="body1" mt={1} sx={{ fontSize: fontSize, color: "#292727ff" }}>
            Sacha Dubois <br />
            CEO Wardiere Inc. <br />
            <strong>Email:</strong> hello@reallygreatsite.com
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export const resumeMeta = {
  hasPhoto: true,
  columns: 2,
};

export default Resume4;