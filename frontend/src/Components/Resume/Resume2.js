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

const Resume2 = ({
  color = "#791115ff",
  font = "Arial",
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
      <Box sx={{ display: "flex", height: "100%" }}>
        {/* Left Section - 30% with full height */}
        <Box
          sx={{
            width: "30%",
            bgcolor: color,
            color: "white",
            p: 3,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            minHeight: "100%",
            "@media print": {
              bgcolor: color,
              color: "white",
              p: 2,
              width: "30%",
              display: "inline-block",
              verticalAlign: "top",
              WebkitPrintColorAdjust: "exact",
              printColorAdjust: "exact",
            },
          }}
        >
          <Avatar
            src="https://via.placeholder.com/150"
            sx={{
              width: 140,
              height: 140,
              mb: 2,
              border: "3px solid white",
              bgcolor: color, // Ensure avatar background uses color
              "@media print": {
                bgcolor: color,
                border: "3px solid white",
              },
            }}
          />

       

          <Divider 
            sx={{ 
              bgcolor: "white", 
              my: sectionSpacing / 20, 
              width: "100%", 
              borderBottomWidth: lineWeight 
            }} 
          />

          <Typography 
            variant="h6" 
            gutterBottom
            sx={{ fontSize: headingSize, fontWeight: "bold", mb: 1, mt: 1 }}
          >
            CONTACT ME
          </Typography>
          <List dense sx={{ width: '100%' }}>
            <ListItem sx={{ mb: `${paragraphSpacing / 20}px`, px: 0 }}>
              <ListItemIcon sx={{ color: "white", minWidth: "30px" }}>
                <PhoneIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText
                primary="+1 (123) 456-7890"
                primaryTypographyProps={{ 
                  color: "white", 
                  fontSize: fontSize,
                  style: { fontStyle },
                }}
              />
            </ListItem>
            <ListItem sx={{ mb: `${paragraphSpacing / 20}px`, px: 0 }}>
              <ListItemIcon sx={{ color: "white", minWidth: "30px" }}>
                <EmailIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText
                primary="donna.stroupe@email.com"
                primaryTypographyProps={{ 
                  color: "white", 
                  fontSize: fontSize,
                  style: { fontStyle },
                }}
              />
            </ListItem>
            <ListItem sx={{ mb: `${paragraphSpacing / 20}px`, px: 0 }}>
              <ListItemIcon sx={{ color: "white", minWidth: "30px" }}>
                <LocationOnIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText
                primary="123 Anywhere St., Any City"
                primaryTypographyProps={{ 
                  color: "white", 
                  fontSize: fontSize,
                  style: { fontStyle },
                }}
              />
            </ListItem>
          </List>

          <Divider 
            sx={{ 
              bgcolor: "white", 
              my: sectionSpacing / 20, 
              width: "100%", 
              borderBottomWidth: lineWeight 
            }} 
          />

          <Typography 
            variant="h6" 
            gutterBottom
            sx={{ fontSize: headingSize, fontWeight: "bold", mb: 1, mt: 1 }}
          >
            EDUCATION
          </Typography>
          <Box sx={{ width: '100%', pl: 1 }}>
            <Box sx={{ mb: 2 }}>
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
                }}
              >
                2016 – 2020
              </Typography>
            </Box>
          </Box>

          <Divider 
            sx={{ 
              bgcolor: "white", 
              my: sectionSpacing / 20, 
              width: "100%", 
              borderBottomWidth: lineWeight 
            }} 
          />

     
        </Box>

        {/* Right Section - 70% */}
        <Box
          sx={{
            width: "70%",
            p: 4,
            "@media print": {
              p: 3,
            },
          }}
        >
          <Typography 
            sx={{ 
              mb: `${paragraphSpacing / 10}px`, 
              fontSize: "2.2rem", 
              fontWeight: "bold",
              color: "#333"
            }}
          >
            DONNA <span style={{ color: color }}>STROUPE</span>
          </Typography>
          <Typography 
            sx={{ 
              mb: 3, 
              fontSize: "1.4rem",
              fontStyle: fontStyle,
              color: "#666"
            }}
          >
            Business Student
          </Typography>

          <Divider 
            sx={{ 
              my: sectionSpacing / 20, 
              borderBottomWidth: lineWeight 
            }} 
          />

          <Box sx={{ mt: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <WorkIcon sx={{ color: color, mr: 1, fontSize: '28px' }} />
              <Typography 
                sx={{ 
                  fontSize: headingSize, 
                  fontWeight: "bold",
                  color: color
                }}
              >
                WORK EXPERIENCE
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
          </Box>

          <Divider 
            sx={{ 
              my: sectionSpacing / 20, 
              borderBottomWidth: lineWeight 
            }} 
          />

          <Box sx={{ mt: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <VolunteerActivismIcon sx={{ color: color, mr: 1, fontSize: '28px' }} />
              <Typography 
                sx={{ 
                  fontSize: headingSize, 
                  fontWeight: "bold",
                  color: color
                }}
              >
                VOLUNTEER EXPERIENCE
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
                Community Outreach Volunteer - Ingoude Company
              </Typography>
              <Typography 
                sx={{ 
                  fontStyle: 'italic',
                  fontSize: fontSize,
                  color: '#666',
                  mb: 1
                }}
              >
                September 2022 - Present
              </Typography>
              <Typography 
                sx={{ 
                  mb: `${paragraphSpacing / 20}px`, 
                  fontSize: fontSize,
                  fontStyle: fontStyle,
                }}
              >
                • Participated in collections to distribute school supplies in low-income schools
                <br />
                • Organized fundraising events for educational initiatives
                <br />
                • Mentored students from underprivileged backgrounds
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
                Event Coordinator - Community Cleanup Initiative
              </Typography>
              <Typography 
                sx={{ 
                  fontStyle: 'italic',
                  fontSize: fontSize,
                  color: '#666',
                  mb: 1
                }}
              >
                April 2021 - August 2022
              </Typography>
              <Typography 
                sx={{ 
                  mb: `${paragraphSpacing / 20}px`, 
                  fontSize: fontSize,
                  fontStyle: fontStyle,
                }}
              >
                • Coordinated monthly community cleanup events
                <br />
                • Managed volunteer recruitment and scheduling
                <br />
                • Partnered with local businesses for sponsorship
              </Typography>
            </Box>
          </Box>

          <Divider 
            sx={{ 
              my: sectionSpacing / 20, 
              borderBottomWidth: lineWeight 
            }} 
          />

          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
            <Box sx={{ width: '48%' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <LanguageIcon sx={{ color: color, mr: 1, fontSize: '28px' }} />
                <Typography 
                  sx={{ 
                    fontSize: headingSize, 
                    fontWeight: "bold",
                    color: color
                  }}
                >
                  LANGUAGES
                </Typography>
              </Box>
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
        </Box>
      </Box>
    </Box>
  );
};

export const resumeMeta = {
  hasPhoto: true,
  columns: 2,
};

export default Resume2;
