import React from 'react';
import {
  Box,
  Typography,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SchoolIcon from '@mui/icons-material/School';
import WorkIcon from '@mui/icons-material/Work';
import LanguageIcon from '@mui/icons-material/Language';
import ComputerIcon from '@mui/icons-material/Computer';

// Map page size to CSS dimensions
const pageSizeMap = {
  A4: { width: '210mm', height: '297mm' },
  Letter: { width: '216mm', height: '279mm' },
  Legal: { width: '216mm', height: '356mm' },
  A3: { width: '297mm', height: '420mm' },
  Executive: { width: '184mm', height: '267mm' },
};

const Resume = ({
  color = '#a7ad63ff',
  nameColor = '#333333',
  sidebarBackground = '#a7ad63ff',
  headerBackground = '#a7ad63ff',
  font = 'Arial, sans-serif',
  fontSize = '14px',
  fontStyle = 'normal',
  headingSize = '24px',
  sectionSpacing = 30,
  paragraphSpacing = 10,
  lineSpacing = 20,
  topBottomMargin = 30,
  sideMargins = 20,
  paragraphIndent = 0,
  lineWeight = 1,
  pageSize = 'A4',
  borderTopRightRadius = '100px',
  borderTopLeftRadius = '100px',
  theme
}) => {
  const page = pageSizeMap[pageSize] || pageSizeMap.A4;
  
  // Use theme color if provided, otherwise use the color prop
  const primaryColor = theme?.primary || color;
  
  // Define a color palette for the template with customizable colors
  const palette = {
    mainBackground: '#FFFFFF',
    sidebarBackground: sidebarBackground,
    accentColor: primaryColor,
    textColor: '#333333',
    lightText: '#666666',
    header: headerBackground,
    nameColor: nameColor,
  };

  return (
    <Box
      sx={{
        width: page.width,
        minHeight: page.height,
        mx: 'auto',
        bgcolor: '#fff',
        boxShadow: 3,
        fontFamily: font,
        fontSize: fontSize,
        fontStyle: fontStyle,
        lineHeight: `${lineSpacing}px`,
        p: `${topBottomMargin}px ${sideMargins}px`,
        '@media print': {
          width: page.width,
          height: page.height,
          boxShadow: 'none',
          m: 0,
        },
      }}
    >
      <Box sx={{ display: 'flex', height: '100%' }}>
        {/* Left Sidebar - 30% */}
        <Box
          sx={{
            width: '30%',
            bgcolor: palette. accentColor,
            color: 'white',
            p: 3,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            minHeight: '100%',
            borderTopRightRadius: borderTopRightRadius,
            borderTopLeftRadius: borderTopLeftRadius,
            borderBottomLeftRadius: 0,
            '@media print': {
              bgcolor: palette.sidebarBackground,
              color: 'white',
              p: 2,
              width: '30%',
              display: 'inline-block',
              verticalAlign: 'top',
              WebkitPrintColorAdjust: 'exact',
              printColorAdjust: 'exact',
              borderTopRightRadius: borderTopRightRadius,
              borderTopLeftRadius: borderTopLeftRadius,
              borderBottomLeftRadius: 0,
            },
          }}
        >
          <Avatar
            alt="Profile"
            src="/path/to/your/image.jpg"
            sx={{
              width: 140,
              height: 140,
              mb: 2,
              border: '3px solid white',
              bgcolor: palette. accentColor,
              '@media print': {
                bgcolor: palette. accentColor,
                border: '3px solid white',
              },
            }}
          />

          <Divider
            sx={{
              bgcolor: 'white',
              my: sectionSpacing / 20,
              width: '100%',
              borderBottomWidth: lineWeight,
            }}
          />

          {/* Contact Info */}
          <Typography
            variant="h6"
            gutterBottom
            sx={{ fontSize: headingSize, fontWeight: 'bold', mb: 1, mt: 1 }}
          >
            CONTACT
          </Typography>
          <List dense sx={{ width: '100%' }}>
            <ListItem sx={{ mb: `${paragraphSpacing / 20}px`, px: 0 }}>
              <ListItemIcon sx={{ color: 'white', minWidth: '30px' }}>
                <PhoneIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText
                primary="+1 456-789-0123"
                primaryTypographyProps={{
                  color: 'white',
                  fontSize: fontSize,
                  style: { fontStyle },
                }}
              />
            </ListItem>
            <ListItem sx={{ mb: `${paragraphSpacing / 20}px`, px: 0 }}>
              <ListItemIcon sx={{ color: 'white', minWidth: '30px' }}>
                <EmailIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText
                primary="hello@email.com"
                primaryTypographyProps={{
                  color: 'white',
                  fontSize: fontSize,
                  style: { fontStyle },
                }}
              />
            </ListItem>
            <ListItem sx={{ mb: `${paragraphSpacing / 20}px`, px: 0 }}>
              <ListItemIcon sx={{ color: 'white', minWidth: '30px' }}>
                <LocationOnIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText
                primary="Anywhere St, Anytown"
                primaryTypographyProps={{
                  color: 'white',
                  fontSize: fontSize,
                  style: { fontStyle },
                }}
              />
            </ListItem>
          </List>

          <Divider
            sx={{
              bgcolor: 'white',
              my: sectionSpacing / 20,
              width: '100%',
              borderBottomWidth: lineWeight,
            }}
          />

          {/* Education */}
          <Typography
            variant="h6"
            gutterBottom
            sx={{ fontSize: headingSize, fontWeight: 'bold', mb: 1, mt: 1 }}
          >
            EDUCATION
          </Typography>
          <Box sx={{ width: '100%', pl: 1 }}>
            <Box sx={{ mb: 2 }}>
              <Typography
                sx={{
                  fontWeight: 'bold',
                  fontSize: fontSize,
                  fontStyle: fontStyle,
                }}
              >
                B.A. Sales and Commerce
              </Typography>
              <Typography
                sx={{
                  fontSize: fontSize,
                  fontStyle: fontStyle,
                }}
              >
                Western University
              </Typography>
              <Typography
                sx={{
                  fontSize: fontSize,
                  fontStyle: 'italic',
                }}
              >
                2019 - 2024
              </Typography>
            </Box>
          </Box>

          <Divider
            sx={{
              bgcolor: 'white',
              my: sectionSpacing / 20,
              width: '100%',
              borderBottomWidth: lineWeight,
            }}
          />

          {/* Skills */}
          <Typography
            variant="h6"
            gutterBottom
            sx={{ fontSize: headingSize, fontWeight: 'bold', mb: 1, mt: 1 }}
          >
            SKILLS
          </Typography>
          <Box sx={{ width: '100%', pl: 1 }}>
            <Typography
              sx={{
                mb: `${paragraphSpacing / 20}px`,
                fontSize: fontSize,
                fontStyle: fontStyle,
              }}
            >
              • Fast-moving consumer goods
              <br />
              • Packaged consumer goods sales
              <br />
              • Corporate sales account management
            </Typography>
          </Box>

          <Divider
            sx={{
              bgcolor: 'white',
              my: sectionSpacing / 20,
              width: '100%',
              borderBottomWidth: lineWeight,
            }}
          />

          {/* Languages */}
          <Typography
            variant="h6"
            gutterBottom
            sx={{ fontSize: headingSize, fontWeight: 'bold', mb: 1, mt: 1 }}
          >
            LANGUAGES
          </Typography>
          <Box sx={{ width: '100%', pl: 1 }}>
            <Typography
              sx={{
                mb: `${paragraphSpacing / 20}px`,
                fontSize: fontSize,
                fontStyle: fontStyle,
              }}
            >
              • English
              <br />
              • French
            </Typography>
          </Box>
        </Box>

        {/* Right Main Content - 70% */}
        <Box
          sx={{
            width: '70%',
            p: 4,
            '@media print': {
              p: 3,
            },
          }}
        >
          <Typography
            sx={{
              mb: `${paragraphSpacing / 10}px`,
              fontSize: '2.2rem',
              fontWeight: 'bold',
              color: palette.nameColor,
            }}
          >
            DONNA <span style={{ color: palette.accentColor }}>STROUPE</span>
          </Typography>
          <Typography
            sx={{
              mb: 3,
              fontSize: '1.4rem',
              fontStyle: fontStyle,
              color: '#666',
            }}
          >
            Sales Representative
          </Typography>

          <Divider
            sx={{
              my: sectionSpacing / 20,
              borderBottomWidth: lineWeight,
            }}
          />

          {/* About Me */}
          <Box sx={{ mt: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <WorkIcon sx={{ color: palette.accentColor, mr: 1, fontSize: '28px' }} />
              <Typography
                sx={{
                  fontSize: headingSize,
                  fontWeight: 'bold',
                  color: palette.accentColor,
                }}
              >
                ABOUT ME
              </Typography>
            </Box>
            <Typography
              sx={{
                mb: `${paragraphSpacing / 20}px`,
                fontSize: fontSize,
                fontStyle: fontStyle,
                textIndent: `${paragraphIndent}px`,
              }}
            >
              I am a Sales Representative with extensive experience in the fast-moving consumer
              goods industry. I am a professional who initiates and manages relationships with
              clients, who serves as their point of contact, and I am adept at following up with
              leads.
            </Typography>
          </Box>

          <Divider
            sx={{
              my: sectionSpacing / 20,
              borderBottomWidth: lineWeight,
            }}
          />

          {/* Work Experience */}
          <Box sx={{ mt: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <WorkIcon sx={{ color: palette.accentColor, mr: 1, fontSize: '28px' }} />
              <Typography
                sx={{
                  fontSize: headingSize,
                  fontWeight: 'bold',
                  color: palette.accentColor,
                }}
              >
                WORK EXPERIENCE
              </Typography>
            </Box>

            {/* Job 1 */}
            <Box sx={{ mb: 3 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography
                  sx={{
                    fontWeight: 'bold',
                    fontSize: '1.1rem',
                    fontStyle: fontStyle,
                  }}
                >
                  Consumer Goods Seller
                </Typography>
                <Typography
                  sx={{
                    fontStyle: 'italic',
                    fontSize: fontSize,
                    color: '#666',
                  }}
                >
                  Aug 2018 - Present
                </Typography>
              </Box>
              <Typography
                sx={{
                  mb: 1,
                  color: palette.lightText,
                  fontSize: fontSize,
                  fontStyle: fontStyle,
                }}
              >
                Impressive Industries
              </Typography>
              <Typography
                sx={{
                  mb: `${paragraphSpacing / 20}px`,
                  fontSize: fontSize,
                  fontStyle: fontStyle,
                  textIndent: `${paragraphIndent}px`,
                }}
              >
                • Offer consumer goods packages to corporate and clients
                <br />
                • Meet with clients every quarter to update or renew services
              </Typography>
            </Box>

            {/* Job 2 */}
            <Box sx={{ mb: 3 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography
                  sx={{
                    fontWeight: 'bold',
                    fontSize: '1.1rem',
                    fontStyle: fontStyle,
                  }}
                >
                  PMCG Sales Agent
                </Typography>
                <Typography
                  sx={{
                    fontStyle: 'italic',
                    fontSize: fontSize,
                    color: '#666',
                  }}
                >
                  Jul 2016 - Aug 2018
                </Typography>
              </Box>
              <Typography
                sx={{
                  mb: 1,
                  color: palette.lightText,
                  fontSize: fontSize,
                  fontStyle: fontStyle,
                }}
              >
                Fast-moving Industries
              </Typography>
              <Typography
                sx={{
                  mb: `${paragraphSpacing / 20}px`,
                  fontSize: fontSize,
                  fontStyle: fontStyle,
                  textIndent: `${paragraphIndent}px`,
                }}
              >
                • Visited corporate client offices to renew latest products
                <br />
                • Built relationships with clients to maintain sales goals and create new
                opportunities
              </Typography>
            </Box>
          </Box>

          <Divider
            sx={{
              my: sectionSpacing / 20,
              borderBottomWidth: lineWeight,
            }}
          />

          {/* References */}
          <Box sx={{ mt: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <WorkIcon sx={{ color: palette.accentColor, mr: 1, fontSize: '28px' }} />
              <Typography
                sx={{
                  fontSize: headingSize,
                  fontWeight: 'bold',
                  color: palette.accentColor,
                }}
              >
                REFERENCES
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Box sx={{ width: '48%' }}>
                <Typography
                  sx={{
                    fontWeight: 'bold',
                    fontSize: '1.1rem',
                    fontStyle: fontStyle,
                  }}
                >
                  Estelle Denny
                </Typography>
                <Typography
                  sx={{
                    fontSize: fontSize,
                    fontStyle: fontStyle,
                    color: '#666',
                  }}
                >
                  Associate Director, COO
                </Typography>
                <Typography
                  sx={{
                    fontSize: fontSize,
                    fontStyle: fontStyle,
                    color: '#666',
                  }}
                >
                  estelledenny@gmail.com
                </Typography>
              </Box>
              <Box sx={{ width: '48%' }}>
                <Typography
                  sx={{
                    fontWeight: 'bold',
                    fontSize: '1.1rem',
                    fontStyle: fontStyle,
                  }}
                >
                  Harper Russo
                </Typography>
                <Typography
                  sx={{
                    fontSize: fontSize,
                    fontStyle: fontStyle,
                    color: '#666',
                  }}
                >
                  Associate Director, CEO
                </Typography>
                <Typography
                  sx={{
                    fontSize: fontSize,
                    fontStyle: fontStyle,
                    color: '#666',
                  }}
                >
                  harperrusso@gmail.com
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

// Meta information for the resume
export const resumeMeta = {
  hasPhoto: true,
  columns: 2,
  colorOptions: [
    { value: '#a7ad63ff', label: 'Olive Green' },
    { value: '#b1cddcff', label: 'Light Blue' },
    { value: '#3A5A78', label: 'Default Blue' },
    { value: '#1a2b47', label: 'Dark Blue' },
    { value: '#6a1b9a', label: 'Purple' },
    { value: '#2e7d32', label: 'Green' },
    { value: '#d32f2f', label: 'Red' }
  ],
  nameColorOptions: [
    { value: '#333333', label: 'Dark Gray' },
    { value: '#000000', label: 'Black' },
    { value: '#1a2b47', label: 'Dark Blue' },
    { value: '#2e7d32', label: 'Green' },
    { value: '#d32f2f', label: 'Red' }
  ],
  sidebarBackgroundOptions: [
    { value: '#a7ad63ff', label: 'Olive Green' },
    { value: '#e6f3f9ff', label: 'Light Blue' },
    { value: '#f0f8e6ff', label: 'Light Green' },
    { value: '#f9e6f3ff', label: 'Light Pink' },
    { value: '#e6e6f9ff', label: 'Light Lavender' },
    { value: '#f9f3e6ff', label: 'Light Beige' }
  ],
  headerBackgroundOptions: [
    { value: '#a7ad63ff', label: 'Olive Green' },
    { value: '#d3d6d8ff', label: 'Light Gray' },
    { value: '#d1ecf1ff', label: 'Light Cyan' },
    { value: '#f8d7daff', label: 'Light Red' },
    { value: '#d4eddaff', label: 'Light Mint' },
    { value: '#e2e3e5ff', label: 'Light Silver' }
  ]
};

export default Resume;
{/*import React from "react";
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
  color = "#a7ad63ff",
   borderTopRightRadius = "100px",
      borderTopLeftRadius = "100px",

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
    borderTopRightRadius: borderTopRightRadius, // ✅ Rounded only top-left
        borderTopLeftRadius: borderTopLeftRadius, // ✅ Rounded only top-left

    borderBottomLeftRadius: 0, // ✅ Keep bottom flat
    "@media print": {
      bgcolor: color,
      color: "white",
      p: 2,
      width: "30%",
      display: "inline-block",
      verticalAlign: "top",
      WebkitPrintColorAdjust: "exact",
      printColorAdjust: "exact",
      borderTopRightRadius: borderTopRightRadius, // ✅ Ensure works in print too
          borderTopLeftRadius: borderTopLeftRadius, // ✅ Rounded only top-left

      borderBottomLeftRadius: 0,
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

export default Resume2;*/}
