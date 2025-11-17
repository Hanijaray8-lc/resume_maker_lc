import React from "react";
import {
  Box,
  Typography,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import SchoolIcon from "@mui/icons-material/School";
import WorkIcon from "@mui/icons-material/Work";
import LanguageIcon from "@mui/icons-material/Language";
import ComputerIcon from "@mui/icons-material/Computer";
import VolunteerActivismIcon from "@mui/icons-material/VolunteerActivism";

// Map page size to CSS dimensions
const pageSizeMap = {
  A4: { width: "210mm", height: "297mm" },
  Letter: { width: "216mm", height: "279mm" },
  Legal: { width: "216mm", height: "356mm" },
  A3: { width: "297mm", height: "420mm" },
  Executive: { width: "184mm", height: "267mm" },
};

const Resume5 = ({
  color = "#791115ff",
  font = "Arial",
  fontSize = "14px",
  headingSize = "24px",
  fontStyle = "normal",
  sectionSpacing = 50,
  paragraphSpacing = 30,
  lineSpacing = 20,
  topBottomMargin = 20,
  sideMargins = 20,
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
        lineHeight: `${lineSpacing / 10}px`,
        p: `${topBottomMargin}px ${sideMargins}px`,
        "@media print": {
          width: page.width,
          height: page.height,
          boxShadow: "none",
          m: 0,
        },
      }}
    >
      {/* Header Section with Name and Title */}
      <Box 
        sx={{ 
          bgcolor: color, 
          color: "white", 
          p: 3, 
          textAlign: "center",
          mb: sectionSpacing / 10,
          "@media print": {
            bgcolor: color,
            WebkitPrintColorAdjust: "exact",
            printColorAdjust: "exact",
          }
        }}
      >
        <Typography 
          sx={{ 
            fontSize: "2.5rem", 
            fontWeight: "bold",
            mb: 1
          }}
        >
          DONNA STROUPE
        </Typography>
        <Typography 
          sx={{ 
            fontSize: "1.5rem",
            fontStyle: fontStyle,
          }}
        >
          Business Student
        </Typography>
      </Box>

      <Box sx={{ display: "flex", height: "100%" }}>
        {/* Left Section - 35% */}
        <Box
          sx={{
            width: "35%",
            pr: 3,
            display: "flex",
            flexDirection: "column",
            "@media print": {
              width: "35%",
              display: "inline-block",
              verticalAlign: "top",
            },
          }}
        >
          {/* Profile Photo */}
          <Box sx={{ display: "flex", justifyContent: "center", mb: sectionSpacing / 10 }}>
            <Avatar
              src="https://via.placeholder.com/150"
              sx={{
                width: 160,
                height: 160,
                border: `3px solid ${color}`,
              }}
            />
          </Box>

          {/* Contact Information */}
          <Typography 
            variant="h6" 
            gutterBottom
            sx={{ 
              fontSize: headingSize, 
              fontWeight: "bold", 
              mb: 2, 
              color: color,
              borderBottom: `2px solid ${color}`,
              pb: 1
            }}
          >
            CONTACT
          </Typography>
          <List dense sx={{ width: '100%', mb: sectionSpacing / 10 }}>
            <ListItem sx={{ mb: `${paragraphSpacing / 20}px`, px: 0 }}>
              <ListItemIcon sx={{ color: color, minWidth: "30px" }}>
                <PhoneIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText
                primary="+1 (123) 456-7890"
                primaryTypographyProps={{ 
                  fontSize: fontSize,
                  style: { fontStyle },
                }}
              />
            </ListItem>
            <ListItem sx={{ mb: `${paragraphSpacing / 20}px`, px: 0 }}>
              <ListItemIcon sx={{ color: color, minWidth: "30px" }}>
                <EmailIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText
                primary="donna.stroupe@email.com"
                primaryTypographyProps={{ 
                  fontSize: fontSize,
                  style: { fontStyle },
                }}
              />
            </ListItem>
            <ListItem sx={{ mb: `${paragraphSpacing / 20}px`, px: 0 }}>
              <ListItemIcon sx={{ color: color, minWidth: "30px" }}>
                <LocationOnIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText
                primary="123 Anywhere St., Any City"
                primaryTypographyProps={{ 
                  fontSize: fontSize,
                  style: { fontStyle },
                }}
              />
            </ListItem>
          </List>

          {/* Education */}
          <Typography 
            variant="h6" 
            gutterBottom
            sx={{ 
              fontSize: headingSize, 
              fontWeight: "bold", 
              mb: 2, 
              color: color,
              borderBottom: `2px solid ${color}`,
              pb: 1
            }}
          >
            EDUCATION
          </Typography>
          <Box sx={{ width: '100%', mb: sectionSpacing / 10 }}>
            <Box sx={{ mb: 3 }}>
              <Typography 
                sx={{ 
                  fontWeight: "bold", 
                  fontSize: fontSize,
                  fontStyle: fontStyle,
                }}
              >
                Borcelle University
              </Typography>
              <Typography 
                sx={{ 
                  fontSize: fontSize,
                  fontStyle: fontStyle,
                }}
              >
                Business Administration
              </Typography>
              <Typography 
                sx={{ 
                  fontSize: fontSize,
                  fontStyle: 'italic',
                  color: '#666'
                }}
              >
                2020 - Present
              </Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography 
                sx={{ 
                  fontWeight: "bold", 
                  fontSize: fontSize,
                  fontStyle: fontStyle,
                }}
              >
                Fauget College
              </Typography>
              <Typography 
                sx={{ 
                  fontSize: fontSize,
                  fontStyle: fontStyle,
                }}
              >
                High School Diploma
              </Typography>
              <Typography 
                sx={{ 
                  fontSize: fontSize,
                  fontStyle: 'italic',
                  color: '#666'
                }}
              >
                2016 – 2020
              </Typography>
            </Box>
          </Box>

          {/* Languages */}
          <Typography 
            variant="h6" 
            gutterBottom
            sx={{ 
              fontSize: headingSize, 
              fontWeight: "bold", 
              mb: 2, 
              color: color,
              borderBottom: `2px solid ${color}`,
              pb: 1
            }}
          >
            LANGUAGES
          </Typography>
          <Box sx={{ width: '100%', mb: sectionSpacing / 10 }}>
            <Typography 
              sx={{ 
                mb: `${paragraphSpacing / 20}px`, 
                fontSize: fontSize,
                fontStyle: fontStyle,
              }}
            >
              • English (Native)
              <br />
              • Spanish (Advanced)
              <br />
              • French (Basic)
            </Typography>
          </Box>
        </Box>

        {/* Vertical Divider */}
        <Divider 
          orientation="vertical" 
          flexItem 
          sx={{ 
            mx: 2, 
            borderRightWidth: lineWeight 
          }} 
        />

        {/* Right Section - 65% */}
        <Box
          sx={{
            width: "65%",
            pl: 3,
            "@media print": {
              width: "65%",
              display: "inline-block",
              verticalAlign: "top",
            },
          }}
        >
          {/* Profile Summary */}
          <Typography 
            variant="h6" 
            gutterBottom
            sx={{ 
              fontSize: headingSize, 
              fontWeight: "bold", 
              mb: 2, 
              color: color,
              borderBottom: `2px solid ${color}`,
              pb: 1
            }}
          >
            PROFILE
          </Typography>
          <Typography 
            sx={{ 
              mb: sectionSpacing / 10, 
              fontSize: fontSize,
              fontStyle: fontStyle,
              textAlign: "justify"
            }}
          >
            Motivated business student with experience in marketing and retail. 
            Proven ability to develop effective marketing campaigns and provide 
            excellent customer service. Seeking to leverage skills and knowledge 
            to contribute to company success while gaining practical experience 
            in business administration.
          </Typography>

          {/* Work Experience */}
          <Typography 
            variant="h6" 
            gutterBottom
            sx={{ 
              fontSize: headingSize, 
              fontWeight: "bold", 
              mb: 2, 
              color: color,
              borderBottom: `2px solid ${color}`,
              pb: 1
            }}
          >
            WORK EXPERIENCE
          </Typography>
          
          <Box sx={{ mb: 3 }}>
            <Typography 
              sx={{ 
                fontWeight: "bold", 
                fontSize: "1.1rem",
                fontStyle: fontStyle,
              }}
            >
              Marketing Intern - Borcelle Studios
            </Typography>
            <Typography 
              sx={{ 
                fontStyle: 'italic',
                fontSize: fontSize,
                color: '#666',
                mb: 1
              }}
            >
              January 2023 - Present
            </Typography>
            <Typography 
              sx={{ 
                mb: `${paragraphSpacing / 20}px`, 
                fontSize: fontSize,
                fontStyle: fontStyle,
              }}
            >
              • Assisted in developing social media marketing campaigns
              <br />
              • Conducted market research and competitor analysis
              <br />
              • Created content for company blog and social media channels
            </Typography>
          </Box>
          
          <Box sx={{ mb: 3 }}>
            <Typography 
              sx={{ 
                fontWeight: "bold", 
                fontSize: "1.1rem",
                fontStyle: fontStyle,
              }}
            >
              Retail Associate - City Fashion Store
            </Typography>
            <Typography 
              sx={{ 
                fontStyle: 'italic',
                fontSize: fontSize,
                color: '#666',
                mb: 1
              }}
            >
              June 2021 - December 2022
            </Typography>
            <Typography 
              sx={{ 
                mb: `${paragraphSpacing / 20}px`, 
                fontSize: fontSize,
                fontStyle: fontStyle,
              }}
            >
              • Provided customer service and sales support
              <br />
              • Managed inventory and organized product displays
              <br />
              • Trained new employees on store procedures
            </Typography>
          </Box>

     

          {/* Skills */}
          <Typography 
            variant="h6" 
            gutterBottom
            sx={{ 
              fontSize: headingSize, 
              fontWeight: "bold", 
              mb: 2, 
              color: color,
              borderBottom: `2px solid ${color}`,
              pb: 1
            }}
          >
            SKILLS
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
            <Box sx={{ width: '50%', mb: 2 }}>
              <Typography 
                sx={{ 
                  fontWeight: "bold", 
                  fontSize: fontSize,
                  fontStyle: fontStyle,
                }}
              >
                Technical Skills
              </Typography>
              <Typography 
                sx={{ 
                  fontSize: fontSize,
                  fontStyle: fontStyle,
                }}
              >
                • Microsoft Office Suite
                <br />
                • Social Media Management
                <br />
                • Market Research
              </Typography>
            </Box>
            <Box sx={{ width: '50%', mb: 2 }}>
              <Typography 
                sx={{ 
                  fontWeight: "bold", 
                  fontSize: fontSize,
                  fontStyle: fontStyle,
                }}
              >
                Soft Skills
              </Typography>
              <Typography 
                sx={{ 
                  fontSize: fontSize,
                  fontStyle: fontStyle,
                }}
              >
                • Communication
                <br />
                • Teamwork
                <br />
                • Problem Solving
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export const resumeMeta = {
  hasPhoto: true,
  columns: 2,
};

export default Resume5;