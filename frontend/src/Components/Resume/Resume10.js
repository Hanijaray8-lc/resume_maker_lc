import React from "react";
import { Box, Typography, Avatar, Divider } from "@mui/material";

const ResumeTemplate10 = ({ 
  color = "#2b2320",
  font = "Arial, sans-serif",
  fontSize = "14px",
  fontStyle = "normal",
  headingSize = "24px",
  sectionSpacing = 30,
  paragraphSpacing = 10,
  lineSpacing = 20,
  topBottomMargin = 30,
  sideMargins = 20,
  paragraphIndent = 0,
  lineWeight = 1,
  pageSize = "A4",
  theme
}) => {
  // Use theme color if provided, otherwise use the color prop
  const primaryColor = theme?.primary || color;
  const darkColor = theme?.dark || getDarkColor(primaryColor);
  
  // Helper function to darken colors
  function getDarkColor(hex) {
    let c = hex.replace('#', '');
    if (c.length === 8) c = c.slice(0, 6);
    let r = Math.max(0, parseInt(c.substring(0,2),16) - 40);
    let g = Math.max(0, parseInt(c.substring(2,4),16) - 40);
    let b = Math.max(0, parseInt(c.substring(4,6),16) - 40);
    return `#${r.toString(16).padStart(2,'0')}${g.toString(16).padStart(2,'0')}${b.toString(16).padStart(2,'0')}`;
  }

  return (
    <Box
      sx={{
        width: pageSize === "A4" ? "210mm" : "216mm",
        minHeight: pageSize === "A4" ? "297mm" : "279mm",
        margin: `${topBottomMargin}px auto`,
        boxShadow: 3,
        borderRadius: 2,
        overflow: "hidden",
        fontFamily: font,
        fontSize: fontSize,
        fontStyle: fontStyle,
        lineHeight: `${lineSpacing}px`,
      }}
    >
      {/* Full Width Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          bgcolor: primaryColor,
          color: "white",
          p: sideMargins / 5,
        }}
      >
        <Avatar
          src="https://via.placeholder.com/150"
          alt="Profile"
          sx={{
            width: 90,
            height: 90,
            border: `${lineWeight * 3}px solid white`,
            mr: 2,
          }}
        />
        <Box>
          <Typography variant="h6" sx={{ 
            fontWeight: "bold",
            fontSize: headingSize,
            fontFamily: font,
          }}>
            DONNA STROUPE
          </Typography>
          <Typography variant="body2" sx={{ fontFamily: font }}>
            Sales Representative
          </Typography>
        </Box>
      </Box>

      {/* Main Content (Sidebar + Right Content) */}
      <Box sx={{ display: "flex" }}>
        {/* Left Sidebar with full height color */}
        <Box
          sx={{
            width: "30%",
            bgcolor: "#f0eae5",
            p: sideMargins / 5,
          }}
        >    <Typography variant="subtitle1" sx={{ 
            fontWeight: "bold", 
            mt: sectionSpacing / 10,
            fontSize: `calc(${fontSize} * 1.1)`,
            fontFamily: font,
          }}>
          CONTACT
          </Typography>
          <Divider sx={{ 
            my: 1, 
            borderWidth: `${lineWeight}px`,
            backgroundColor: primaryColor,
          }} />
          {/* Contact */}
          <Box sx={{ fontSize: fontSize, mb: sectionSpacing / 10 }}>
            <Typography sx={{ fontFamily: font, mb: paragraphSpacing / 10 }}>
              📧 hello@reallygreatsite.com
            </Typography>
            <Typography sx={{ fontFamily: font, mb: paragraphSpacing / 10 }}>
              📞 +123-456-7890
            </Typography>
            <Typography sx={{ fontFamily: font, mb: paragraphSpacing / 10 }}>
              📍 123 Anywhere St, Any City
            </Typography>
            <Typography sx={{ fontFamily: font }}>
              🌐 reallygreatsite.com
            </Typography>
          </Box>

          {/* Education */}
          <Typography variant="subtitle1" sx={{ 
            fontWeight: "bold", 
            mt: sectionSpacing / 10,
            fontSize: `calc(${fontSize} * 1.1)`,
            fontFamily: font,
          }}>
            EDUCATION
          </Typography>
          <Divider sx={{ 
            my: 1, 
            borderWidth: `${lineWeight}px`,
            backgroundColor: primaryColor,
          }} />
          <Typography variant="body2" sx={{ fontFamily: font, mb: paragraphSpacing / 10 }}>
            BA Sales and Commerce <br />
            Wardiere University <br /> 2016 - 2020
          </Typography>
          <Typography variant="body2" sx={{ fontFamily: font }}>
            Bachelor of Marketing <br />
            Wardiere University <br /> 2020 - 2023
          </Typography>

          {/* Skills */}
          <Typography variant="subtitle1" sx={{ 
            fontWeight: "bold", 
            mt: sectionSpacing / 10,
            fontSize: `calc(${fontSize} * 1.1)`,
            fontFamily: font,
          }}>
            SKILLS
          </Typography>
          <Divider sx={{ 
            my: 1, 
            borderWidth: `${lineWeight}px`,
            backgroundColor: primaryColor,
          }} />
          <ul style={{ 
            paddingLeft: "20px", 
            fontSize: fontSize,
            fontFamily: font,
            marginTop: paragraphSpacing / 10,
            marginBottom: paragraphSpacing / 10,
          }}>
            <li>Sales Strategies</li>
            <li>Negotiations</li>
            <li>Problem-Solving</li>
            <li>Time Management</li>
            <li>Presentation</li>
            <li>Team Collaboration</li>
          </ul>

          {/* Languages */}
          <Typography variant="subtitle1" sx={{ 
            fontWeight: "bold", 
            mt: sectionSpacing / 10,
            fontSize: `calc(${fontSize} * 1.1)`,
            fontFamily: font,
          }}>
            LANGUAGE
          </Typography>
          <Divider sx={{ 
            my: 1, 
            borderWidth: `${lineWeight}px`,
            backgroundColor: primaryColor,
          }} />
          <Typography variant="body2" sx={{ fontFamily: font }}>
            English
          </Typography>
          <Typography variant="body2" sx={{ fontFamily: font }}>
            French
          </Typography>
        </Box>

        {/* Right Content */}
        <Box sx={{ 
          flex: 1, 
          p: sideMargins / 5,
          margin: `${topBottomMargin / 10}px 0`,
        }}>
          <Typography variant="h6" sx={{ 
            fontWeight: "bold", 
            mb: 1,
            fontSize: headingSize,
            fontFamily: font,
          }}>
            About Me
          </Typography>
          <Typography variant="body2" sx={{ 
            mb: sectionSpacing / 10,
            textIndent: `${paragraphIndent}px`,
            fontFamily: font,
          }}>
            I am a Sales Representative who initiates and manages customer
            relationships. I ensure smooth transitions from initial outreach to
            final purchase, either by them or someone in their household.
          </Typography>

          <Typography variant="h6" sx={{ 
            fontWeight: "bold", 
            mb: 1,
            fontSize: headingSize,
            fontFamily: font,
          }}>
            Work Experience
          </Typography>
          <Divider sx={{ 
            mb: 2, 
            borderWidth: `${lineWeight}px`,
            backgroundColor: primaryColor,
          }} />

          <Typography variant="subtitle2" sx={{ 
            fontFamily: font,
            fontSize: `calc(${fontSize} * 1.05)`,
            mb: paragraphSpacing / 10,
          }}>
            Jul 2020 - Aug 2023 | Arowwai Industries | Consumer Goods Seller
          </Typography>
          <ul style={{ 
            fontSize: fontSize,
            fontFamily: font,
            marginBottom: sectionSpacing / 10,
            paddingLeft: "20px",
          }}>
            <li>Offered consumer goods packages to corporate and clients</li>
            <li>Met with clients every quarter to update/renew services</li>
            <li>Trained junior sales agents</li>
          </ul>

          <Typography variant="subtitle2" sx={{ 
            fontFamily: font,
            fontSize: `calc(${fontSize} * 1.05)`,
            mb: paragraphSpacing / 10,
          }}>
            Jul 2020 - Aug 2016 | Timmerman Industries | FMCG Sales Agent
          </Typography>
          <ul style={{ 
            fontSize: fontSize,
            fontFamily: font,
            marginBottom: sectionSpacing / 10,
            paddingLeft: "20px",
          }}>
            <li>Visited corporate offices to offer latest products</li>
            <li>
              Built relationships with clients to maintain goals and create
              repeat opportunities
            </li>
          </ul>

          <Typography variant="subtitle2" sx={{ 
            fontFamily: font,
            fontSize: `calc(${fontSize} * 1.05)`,
            mb: paragraphSpacing / 10,
          }}>
            Aug 2014 - Jul 2015 | Arowwai Industries | Sales Agent
          </Typography>
          <ul style={{ 
            fontSize: fontSize,
            fontFamily: font,
            marginBottom: sectionSpacing / 10,
            paddingLeft: "20px",
          }}>
            <li>Visited corporate offices to offer latest products</li>
          </ul>

          <Typography variant="h6" sx={{ 
            fontWeight: "bold", 
            mt: sectionSpacing / 10, 
            mb: 1,
            fontSize: headingSize,
            fontFamily: font,
          }}>
            References
          </Typography>
          <Divider sx={{ 
            mb: 2, 
            borderWidth: `${lineWeight}px`,
            backgroundColor: primaryColor,
          }} />
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Box>
              <Typography variant="subtitle2" sx={{ fontFamily: font }}>
                Estelle Darcy
              </Typography>
              <Typography variant="body2" sx={{ fontFamily: font }}>
                Wardiere Inc / CEO
              </Typography>
              <Typography variant="body2" sx={{ fontFamily: font }}>
                📞 +123-456-7890
              </Typography>
              <Typography variant="body2" sx={{ fontFamily: font }}>
                hello@reallygreatsite.com
              </Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2" sx={{ fontFamily: font }}>
                Harper Russo
              </Typography>
              <Typography variant="body2" sx={{ fontFamily: font }}>
                Wardiere Inc / CEO
              </Typography>
              <Typography variant="body2" sx={{ fontFamily: font }}>
                📞 +123-456-7890
              </Typography>
              <Typography variant="body2" sx={{ fontFamily: font }}>
                hello@reallygreatsite.com
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

// Meta information for Resume10
export const resumeMeta = {
  hasPhoto: true,
  columns: 2,
};

export default ResumeTemplate10;
