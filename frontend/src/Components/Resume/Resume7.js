import React from "react";
import {
  Box,
  Grid,
  Typography,
  Avatar,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";

const Resume7 = ({
  theme = { primary: "#0951b0ff", dark: "#063a80" },
  color = "#b7e1a1",
  font = "EB Garamond",
  fontSize = "14px",
  fontStyle = "normal",
  headingSize = "24px",
  sectionSpacing = 10,
  paragraphSpacing = 10,
  lineSpacing = 20,
  topBottomMargin = 20,
  sideMargins = 40,
  paragraphIndent = 0,
  lineWeight = 1,
  pageSize = "A4"
}) => {
  
  // FIX: Check if color is an object or string
  const getActualColor = () => {
    if (typeof color === 'string') {
      return color;
    } else if (color && typeof color === 'object') {
      return color.highlight || color.primary || "#b7e1a1";
    }
    return "#b7e1a1";
  };

  const actualColor = getActualColor();
  
  // FIXED: Correct color theme implementation
  const currentTheme = {
    mainBg: "#b3e4e6ff", // White background for main content
    sideBg: actualColor, // Use the actual color for sidebar
    highlight: actualColor, // Use the actual color for highlights
    text: "#000000", // Black text for main content
    sideText: "#171515" // Dark text for sidebar
  };

  // Calculate responsive dimensions based on pageSize
  const getPageDimensions = () => {
    switch (pageSize.toLowerCase()) {
      case "a4":
        return { width: "210mm", height: "297mm" };
      case "letter":
        return { width: "216mm", height: "279mm" };
      case "legal":
        return { width: "216mm", height: "356mm" };
      case "a3":
        return { width: "297mm", height: "420mm" };
      case "executive":
        return { width: "184mm", height: "267mm" };
      default:
        return { width: "210mm", height: "297mm" };
    }
  };

  const pageDimensions = getPageDimensions();

  return (
      <Box
        sx={{
          width: pageDimensions.width,
          minHeight: pageDimensions.height,
          bgcolor: currentTheme.mainBg,
          color: currentTheme.text,
          boxShadow: 5,
          display: "flex",
          flexDirection: "column",
          marginTop: `${topBottomMargin}px`,
          marginBottom: `${topBottomMargin}px`,
          marginLeft: `${sideMargins}px`,
          marginRight: `${sideMargins}px`,
          fontFamily: font,
          fontStyle: fontStyle,
        }}
      >
        <Grid container>
          {/* LEFT MAIN CONTENT */}
          <Grid item xs={8} sx={{
            bgcolor: currentTheme.mainBg,
            width: '70%',
            padding: `${sectionSpacing / 2}px`,
            "@media print": {
              width: "70%",
              display: "inline-block",
              verticalAlign: "top",
              bgcolor: currentTheme.mainBg,
              color: currentTheme.text,
              WebkitPrintColorAdjust: "exact",
              printColorAdjust: "exact",
            },
          }}>
            {/* Header - FIXED: Now uses highlight color */}
            <Box sx={{ 
              bgcolor: currentTheme.highlight, 
              color: "#000", 
              p: 3,
              marginBottom: `${sectionSpacing}px`
            }}>
              <Typography 
                variant="h4" 
                fontWeight="bold"
                sx={{ 
                  fontSize: `calc(${headingSize} * 1.5)`,
                  lineHeight: `${lineSpacing * 2}px`
                }}
              >
                Caryn Feist
              </Typography>
              <Typography 
                variant="h6"
                sx={{ 
                  fontSize: `calc(${headingSize} * 0.8)`,
                  lineHeight: `${lineSpacing}px`
                }}
              >
                Executive Chef
              </Typography>
            </Box>

            {/* Summary - FIXED: Now uses black background with highlight text color */}
            <Box sx={{ 
              bgcolor: "#000", 
              p: 3,
              marginBottom: `${sectionSpacing}px`
            }}>
              <Typography 
                variant="body1" 
                sx={{ 
                  color: currentTheme.highlight,
                  fontSize: fontSize,
                  lineHeight: `${lineSpacing}px`,
                  marginBottom: `${paragraphSpacing}px`
                }}
              >
                Executive Chef with experience overseeing multiple upscale,
                full-service restaurants. Eleven years of progressive responsibility
                in food preparation, menu development, and management of
                back-of-the-house operations. People-oriented manager who is
                passionate about food, quality, and customer service, as well as
                motivating and mentoring team members.
              </Typography>
            </Box>

            {/* Professional Experience - FIXED: Now uses highlight color */}
            <Box sx={{ 
              bgcolor: currentTheme.highlight, 
              color: "#000", 
              p: 1,
              marginBottom: `${sectionSpacing / 2}px`
            }}>
              <Typography 
                variant="h6" 
                fontWeight="bold"
                sx={{ fontSize: headingSize }}
              >
                Professional Experience
              </Typography>
            </Box>
            <Box p={3} sx={{ marginBottom: `${sectionSpacing}px` }}>
              <Typography 
                fontWeight="bold"
                sx={{ 
                  fontSize: `calc(${fontSize} * 1.2)`,
                  lineHeight: `${lineSpacing}px`,
                  marginBottom: `${paragraphSpacing / 2}px`
                }}
              >
                Lamberti's Cucina, San Diego, CA{" "}
                <span style={{ float: "right" }}>March 2015 – Present</span>
              </Typography>
              <Typography 
                variant="body2" 
                fontStyle="italic"
                sx={{ 
                  fontSize: fontSize,
                  marginBottom: `${paragraphSpacing}px`
                }}
              >
                Executive Chef
              </Typography>
              <ul style={{ 
                paddingLeft: `${paragraphIndent + 20}px`,
                marginBottom: `${paragraphSpacing}px`
              }}>
                {[
                  "Create menus and standards leading to exemplary dining experiences across four local dining establishments.",
                  "Lead and train culinary teams and ensure training material enables delivery of exceptional dining experiences.",
                  "Collaborate with chef partners across the enterprise.",
                  "Liaise with supply chain management to identify potential supplier relationships.",
                  "Address quality and/or service gaps.",
                  "Develop food service equipment plans to meet budgetary goals."
                ].map((item, index) => (
                  <li 
                    key={index}
                    style={{ 
                      fontSize: fontSize,
                      lineHeight: `${lineSpacing}px`,
                      marginBottom: `${paragraphSpacing / 2}px`
                    }}
                  >
                    {item}
                  </li>
                ))}
              </ul>

              <Typography 
                fontWeight="bold" 
                sx={{ 
                  fontSize: `calc(${fontSize} * 1.2)`,
                  lineHeight: `${lineSpacing}px`,
                  marginBottom: `${paragraphSpacing / 2}px`
                }}
              >
                Jenny's House, N. Hollywood, CA{" "}
                <span style={{ float: "right" }}>
                  January 2009 – February 2015
                </span>
              </Typography>
              <Typography 
                variant="body2" 
                fontStyle="italic"
                sx={{ 
                  fontSize: fontSize,
                  marginBottom: `${paragraphSpacing}px`
                }}
              >
                Sous Chef
              </Typography>
              <ul style={{ 
                paddingLeft: `${paragraphIndent + 20}px`,
                marginBottom: `${paragraphSpacing}px`
              }}>
                {[
                  "Supervised food preparation and presentation to ensure quality and restaurant standards.",
                  "Worked with executive chef to maintain kitchen organization and staff ability.",
                  "Led kitchen staff when chef was unavailable.",
                  "Oversaw and organized kitchen stock and ingredients.",
                  "Kept cooking stations stocked prior to prime hours.",
                  "Managed food and product ordering.",
                  "Hired and trained new kitchen employees.",
                  "Minimized waste and managed budget concerns."
                ].map((item, index) => (
                  <li 
                    key={index}
                    style={{ 
                      fontSize: fontSize,
                      lineHeight: `${lineSpacing}px`,
                      marginBottom: `${paragraphSpacing / 2}px`
                    }}
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </Box>

            {/* Education - FIXED: Now uses highlight color */}
            <Box sx={{ 
              bgcolor: currentTheme.highlight, 
              color: "#000", 
              p: 1,
              marginBottom: `${sectionSpacing / 2}px`
            }}>
              <Typography 
                variant="h6" 
                fontWeight="bold"
                sx={{ fontSize: headingSize }}
              >
                Education
              </Typography>
            </Box>
            <Box p={3}>
              <Typography 
                fontWeight="bold"
                sx={{ 
                  fontSize: `calc(${fontSize} * 1.2)`,
                  lineHeight: `${lineSpacing}px`,
                  marginBottom: `${paragraphSpacing / 2}px`
                }}
              >
                Master Chef Certificate Program{" "}
                <span style={{ float: "right" }}>
                  October 2009 – February 2009
                </span>
              </Typography>
              <Typography 
                variant="body2"
                sx={{ 
                  fontSize: fontSize,
                  marginBottom: `${paragraphSpacing}px`
                }}
              >
                Chef Eric's Culinary Classroom, Los Angeles, CA
              </Typography>

              <Typography 
                fontWeight="bold"
                sx={{ 
                  fontSize: `calc(${fontSize} * 1.2)`,
                  lineHeight: `${lineSpacing}px`,
                  marginBottom: `${paragraphSpacing / 2}px`
                }}
              >
                Associate of Science in Culinary Arts{" "}
                <span style={{ float: "right" }}>
                  September 2016 – March 2018
                </span>
              </Typography>
              <Typography 
                variant="body2"
                sx={{ fontSize: fontSize }}
              >
                Art Institute Of California, Hollywood, CA
              </Typography>
            </Box>
          </Grid>

          {/* RIGHT SIDEBAR - FIXED: Now uses sideBg color */}
          <Grid
            item
            xs={4}
            sx={{
              bgcolor: currentTheme.sideBg, // This will be the actual color
              color: currentTheme.sideText,
              textAlign: "center",
              p: 3,
              width: '30%',
              "@media print": {
                width: "30%",
                display: "inline-block",
                verticalAlign: "top",
                bgcolor: currentTheme.sideBg,
                color: currentTheme.sideText,
                WebkitPrintColorAdjust: "exact",
                printColorAdjust: "exact",
              },
            }}
          >
            <Avatar
              src="/profile.jpg"
              alt="profile"
              sx={{ 
                width: 150, 
                height: 150, 
                mx: "auto", 
                mb: 2,
                border: `${lineWeight}px solid ${currentTheme.highlight}`
              }}
            />

            {/* Contact */}
            <Typography 
              variant="body1" 
              mb={2}
              sx={{ 
                fontSize: fontSize,
                lineHeight: `${lineSpacing}px`,
                color: currentTheme.sideText
              }}
            >
              4759 Sunnydale Lane, Plano, <br />
              Texas, United States, 75071 <br />
              123-456-7890 <br />
              email@youremail.com
            </Typography>

            <Divider sx={{ 
              bgcolor: currentTheme.highlight, 
              my: 2,
              height: `${lineWeight}px`
            }} />

            {/* Skills - FIXED: Now uses highlight color for heading */}
            <Typography
              variant="h6"
              fontWeight="bold"
              sx={{ 
                color: currentTheme.highlight, 
                mb: 2,
                fontSize: headingSize
              }}
            >
              Key Skills
            </Typography>
            <List dense>
              {[
                "Highly developed culinary expertise",
                "Seasonal menu development",
                "Knowledge of a variety of cuisines",
                "Development of special event menus",
                "Standardizing recipes for consistency",
                "Strong personal work ethic",
                "Guest driven focus on service",
                "Budget management for food/labor",
                "Knowledge of FDA & health codes",
                "Leadership in full-service environments",
                "Problem solving & innovation",
                "Excellent communication skills",
                "Multi-project management",
              ].map((skill, i) => (
                <ListItem 
                  key={i} 
                  sx={{ 
                    py: 0,
                    paddingLeft: `${paragraphIndent}px`
                  }}
                >
                  <ListItemText 
                    primary={`• ${skill}`}
                    sx={{
                      fontSize: fontSize,
                      lineHeight: `${lineSpacing}px`,
                      color: currentTheme.sideText
                    }}
                  />
                </ListItem>
              ))}
            </List>
          </Grid>
        </Grid>
      </Box>
  );
};

export const resumeMeta = {
  hasPhoto: true,
  columns: 2,
};

export default Resume7;