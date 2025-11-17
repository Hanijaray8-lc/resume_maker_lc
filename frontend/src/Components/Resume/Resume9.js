import React from "react";
import {
  Box,
  Typography,
  Avatar,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";

const Resume9 = ({ 
  color = "#8b4b2b",
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
        borderRadius: "16px",
        overflow: "hidden",
        display: "flex",
        fontFamily: font,
        fontSize: fontSize,
        fontStyle: fontStyle,
        lineHeight: `${lineSpacing}px`,
      }}
    >
      {/* Left Sidebar */}
      <Box
        sx={{
          width: "25%",
          bgcolor: primaryColor,
          color: "white",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          p: 3,
          position: "relative",
        }}
      >
        {/* Top angled image section */}
        <Box
          sx={{
            width: "100%",
            bgcolor: primaryColor,
            clipPath: "polygon(0 0, 100% 0, 100% 70%, 50% 100%, 0 70%)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            mb: sectionSpacing / 10,
            pt: 4,
          }}
        >
          <Avatar
            src="https://via.placeholder.com/150"
            sx={{
              width: 140,
              height: 140,
              border: `${lineWeight}px solid white`,
              boxShadow: 3,
            }}
          />
        </Box>

        {/* Contact */}
        <Box sx={{ width: "100%", mb: sectionSpacing / 5 }}>
          <Typography variant="h6" sx={{ 
            fontWeight: "bold", 
            mb: 1,
            fontSize: headingSize,
            fontFamily: font,
          }}>
            Contact
          </Typography>
          <Typography variant="body2" sx={{ mb: paragraphSpacing / 10 }}>📞 +123-456-7890</Typography>
          <Typography variant="body2" sx={{ mb: paragraphSpacing / 10 }}>✉️ hello@email.com</Typography>
          <Typography variant="body2" sx={{ mb: paragraphSpacing / 10 }}>🏠 123 Anywhere St, City</Typography>
          <Typography variant="body2">🌐 www.reallygreatsite.com</Typography>
        </Box>

        {/* About Me */}
        <Box sx={{ width: "100%", mb: sectionSpacing / 5 }}>
          <Typography variant="h6" sx={{ 
            fontWeight: "bold", 
            mb: 1,
            fontSize: headingSize,
            fontFamily: font,
          }}>
            About Me
          </Typography>
          <Typography variant="body2" sx={{ textIndent: `${paragraphIndent}px` }}>
            A creative writer/designer with a knack for crafting visually
            appealing and impactful designs. Adept at balancing functionality
            with aesthetics to produce engaging designs.
          </Typography>
        </Box>

        {/* Skills */}
        <Box sx={{ width: "100%" }}>
          <Typography variant="h6" sx={{ 
            fontWeight: "bold", 
            mb: 1,
            fontSize: headingSize,
            fontFamily: font,
          }}>
            Skills
          </Typography>
          <List dense>
            {[
              "Creative writing & solutions",
              "Copywriting",
              "Communication",
              "Strategic planning",
              "Project coordination",
              "Storytelling",
              "Presentation skills",
            ].map((skill, i) => (
              <ListItem key={i} sx={{ p: 0, mb: paragraphSpacing / 20 }}>
                <ListItemText 
                  primary={skill} 
                  sx={{ 
                    '& .MuiTypography-root': {
                      fontSize: fontSize,
                      fontFamily: font,
                    }
                  }}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      </Box>

      {/* Right Section */}
      <Box sx={{ 
        flex: 1, 
        bgcolor: "#f8f2ee", 
        p: sideMargins / 10,
        margin: `${topBottomMargin / 10}px 0`,
      }}>
        {/* Header */}
        <Box mb={sectionSpacing / 5}>
          <Typography variant="h4" sx={{ 
            fontWeight: "bold",
            fontSize: `calc(${headingSize} * 1.5)`,
            fontFamily: font,
          }}>
            LAILA MUHAMMAD
          </Typography>
          <Typography variant="subtitle1" sx={{ 
            color: primaryColor,
            fontSize: `calc(${fontSize} * 1.2)`,
            fontFamily: font,
          }}>
            Content Creator
          </Typography>
        </Box>

        {/* Education */}
        <Box mb={sectionSpacing / 5}>
          <Typography variant="h6" sx={{ 
            fontWeight: "bold", 
            mb: 1,
            fontSize: headingSize,
            fontFamily: font,
          }}>
            Education
          </Typography>
          <Divider sx={{ 
            mb: 2, 
            borderWidth: `${lineWeight}px`,
            backgroundColor: primaryColor,
          }} />
          <Box mb={paragraphSpacing / 5}>
            <Typography variant="subtitle2" sx={{ 
              fontWeight: "bold",
              fontSize: `calc(${fontSize} * 1.1)`,
              fontFamily: font,
            }}>
              Bachelor of Arts in Arabic Studies
            </Typography>
            <Typography variant="caption" sx={{ fontFamily: font }}>2020 - 2016</Typography>
            <Typography variant="body2" sx={{ 
              mt: 1,
              textIndent: `${paragraphIndent}px`,
              fontFamily: font,
            }}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sit
              amet sem facilisis scelerisque.
            </Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2" sx={{ 
              fontWeight: "bold",
              fontSize: `calc(${fontSize} * 1.1)`,
              fontFamily: font,
            }}>
              Diploma in Advertising Management
            </Typography>
            <Typography variant="caption" sx={{ fontFamily: font }}>2018 - 2016</Typography>
            <Typography variant="body2" sx={{ 
              mt: 1,
              textIndent: `${paragraphIndent}px`,
              fontFamily: font,
            }}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore.
            </Typography>
          </Box>
        </Box>

        {/* Experience */}
        <Box>
          <Typography variant="h6" sx={{ 
            fontWeight: "bold", 
            mb: 1,
            fontSize: headingSize,
            fontFamily: font,
          }}>
            Experience
          </Typography>
          <Divider sx={{ 
            mb: 2, 
            borderWidth: `${lineWeight}px`,
            backgroundColor: primaryColor,
          }} />
          <Box mb={paragraphSpacing / 5}>
            <Typography variant="subtitle2" sx={{ 
              fontWeight: "bold",
              fontSize: `calc(${fontSize} * 1.1)`,
              fontFamily: font,
            }}>
              Owner & Manager of Content Agency
            </Typography>
            <Typography variant="caption" sx={{ fontFamily: font }}>2020 - 2016</Typography>
            <Typography variant="body2" sx={{ 
              mt: 1,
              textIndent: `${paragraphIndent}px`,
              fontFamily: font,
            }}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sit
              amet sem facilisis scelerisque.
            </Typography>
          </Box>
          <Box mb={paragraphSpacing / 5}>
            <Typography variant="subtitle2" sx={{ 
              fontWeight: "bold",
              fontSize: `calc(${fontSize} * 1.1)`,
              fontFamily: font,
            }}>
              Director of Content Strategy
            </Typography>
            <Typography variant="caption" sx={{ fontFamily: font }}>2020 - 2019</Typography>
            <Typography variant="body2" sx={{ 
              mt: 1,
              textIndent: `${paragraphIndent}px`,
              fontFamily: font,
            }}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2" sx={{ 
              fontWeight: "bold",
              fontSize: `calc(${fontSize} * 1.1)`,
              fontFamily: font,
            }}>
              Content Creator
            </Typography>
            <Typography variant="caption" sx={{ fontFamily: font }}>2019 - 2018</Typography>
            <Typography variant="body2" sx={{ 
              mt: 1,
              textIndent: `${paragraphIndent}px`,
              fontFamily: font,
            }}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer
              at risus in orci placerat tincidunt.
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

// Meta for filtering
export const resumeMeta = {
  columns: 2,
  hasPhoto: true,
  hasHeadshot: true,
};

export default Resume9;
{/*import React from "react";
import {
  Box,
  Typography,
  Avatar,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";

const Resume9 = ({ color = "#8b4b2b" }) => {
  return (
    <Box
      sx={{
 width: "210mm",
         margin: "20px auto",
        boxShadow: 3,
        borderRadius: "16px",
        overflow: "hidden",
        display: "flex",
        fontFamily: "Arial",
        height:"150vh"
      }}
    >
      <Box
        sx={{
          width: "25%",
          bgcolor: color,
          color: "white",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          p: 3,
          position: "relative",
        }}
      >
        <Box
          sx={{
            width: "100%",
            bgcolor: color,
            clipPath: "polygon(0 0, 100% 0, 100% 70%, 50% 100%, 0 70%)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            mb: 6,
            pt: 4,
          }}
        >
          <Avatar
            src="https://via.placeholder.com/150"
            sx={{
              width: 140,
              height: 140,
              border: "4px solid white",
              boxShadow: 3,
            }}
          />
        </Box>

        <Box sx={{ width: "100%", mb: 4 }}>
          <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
            Contact
          </Typography>
          <Typography variant="body2">📞 +123-456-7890</Typography>
          <Typography variant="body2">✉️ hello@email.com</Typography>
          <Typography variant="body2">🏠 123 Anywhere St, City</Typography>
          <Typography variant="body2">🌐 www.reallygreatsite.com</Typography>
        </Box>

        <Box sx={{ width: "100%", mb: 4 }}>
          <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
            About Me
          </Typography>
          <Typography variant="body2">
            A creative writer/designer with a knack for crafting visually
            appealing and impactful designs. Adept at balancing functionality
            with aesthetics to produce engaging designs.
          </Typography>
        </Box>

        <Box sx={{ width: "100%" }}>
          <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
            Skills
          </Typography>
          <List dense>
            {[
              "Creative writing & solutions",
              "Copywriting",
              "Communication",
              "Strategic planning",
              "Project coordination",
              "Storytelling",
              "Presentation skills",
            ].map((skill, i) => (
              <ListItem key={i} sx={{ p: 0 }}>
                <ListItemText primary={skill} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Box>

      <Box sx={{ flex: 1, bgcolor: "#f8f2ee", p: 4 }}>
        <Box mb={4}>
          <Typography variant="h4" sx={{ fontWeight: "bold" }}>
            LAILA MUHAMMAD
          </Typography>
          <Typography variant="subtitle1" sx={{ color: color }}>
            Content Creator
          </Typography>
        </Box>

        <Box mb={4}>
          <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
            Education
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Box mb={2}>
            <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
              Bachelor of Arts in Arabic Studies
            </Typography>
            <Typography variant="caption">2020 - 2016</Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sit
              amet sem facilisis scelerisque.
            </Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
              Diploma in Advertising Management
            </Typography>
            <Typography variant="caption">2018 - 2016</Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore.
            </Typography>
          </Box>
        </Box>

        <Box>
          <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
            Experience
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Box mb={2}>
            <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
              Owner & Manager of Content Agency
            </Typography>
            <Typography variant="caption">2020 - 2016</Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sit
              amet sem facilisis scelerisque.
            </Typography>
          </Box>
          <Box mb={2}>
            <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
              Director of Content Strategy
            </Typography>
            <Typography variant="caption">2020 - 2019</Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
              Content Creator
            </Typography>
            <Typography variant="caption">2019 - 2018</Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer
              at risus in orci placerat tincidunt.
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

// Meta for filtering
export const resumeMeta = {
  columns: 2,
  hasPhoto: true,
  hasHeadshot: true,
};

export default Resume9;*/}
{/*import React from "react";
import { Box, Typography, Avatar, List, ListItem, ListItemText, Divider } from "@mui/material";

const ResumeTemplate9 = () => {
  return (
    <Box
      sx={{
        width: "850px",
        margin: "20px auto",
        boxShadow: 3,
        borderRadius: "16px",
        overflow: "hidden",
        display: "flex",
        fontFamily: "Arial",
      }}
    >
      <Box
        sx={{
          width: "25%",
          bgcolor: "#8b4b2b", // Brown color
          color: "white",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          p: 3,
          position: "relative",
        }}
      >
        <Box
          sx={{
            width: "100%",
            bgcolor: "#8b4b2b",
            clipPath: "polygon(0 0, 100% 0, 100% 70%, 50% 100%, 0 70%)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            mb: 6,
            pt: 4,
          }}
        >
          <Avatar
            src="https://via.placeholder.com/150"
            sx={{
              width: 140,
              height: 140,
              border: "4px solid white",
              boxShadow: 3,
            }}
          />
        </Box>

        <Box sx={{ width: "100%", mb: 4 }}>
          <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
            Contact
          </Typography>
          <Typography variant="body2">📞 +123-456-7890</Typography>
          <Typography variant="body2">✉️ hello@email.com</Typography>
          <Typography variant="body2">🏠 123 Anywhere St, City</Typography>
          <Typography variant="body2">🌐 www.reallygreatsite.com</Typography>
        </Box>

        <Box sx={{ width: "100%", mb: 4 }}>
          <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
            About Me
          </Typography>
          <Typography variant="body2">
            A creative writer/designer with a knack for crafting visually
            appealing and impactful designs. Adept at balancing functionality
            with aesthetics to produce engaging designs.
          </Typography>
        </Box>

        <Box sx={{ width: "100%" }}>
          <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
            Skills
          </Typography>
          <List dense>
            {[
              "Creative writing & solutions",
              "Copywriting",
              "Communication",
              "Strategic planning",
              "Project coordination",
              "Storytelling",
              "Presentation skills",
            ].map((skill, i) => (
              <ListItem key={i} sx={{ p: 0 }}>
                <ListItemText primary={skill} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Box>

      <Box sx={{ flex: 1, bgcolor: "#f8f2ee", p: 4 }}>
        <Box mb={4}>
          <Typography variant="h4" sx={{ fontWeight: "bold" }}>
            LAILA MUHAMMAD
          </Typography>
          <Typography variant="subtitle1" sx={{ color: "#8b4b2b" }}>
            Content Creator
          </Typography>
        </Box>

        <Box mb={4}>
          <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
            Education
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Box mb={2}>
            <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
              Bachelor of Arts in Arabic Studies
            </Typography>
            <Typography variant="caption">2020 - 2016</Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sit
              amet sem facilisis scelerisque.
            </Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
              Diploma in Advertising Management
            </Typography>
            <Typography variant="caption">2018 - 2016</Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore.
            </Typography>
          </Box>
        </Box>

        <Box>
          <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
            Experience
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Box mb={2}>
            <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
              Owner & Manager of Content Agency
            </Typography>
            <Typography variant="caption">2020 - 2016</Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sit
              amet sem facilisis scelerisque.
            </Typography>
          </Box>
          <Box mb={2}>
            <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
              Director of Content Strategy
            </Typography>
            <Typography variant="caption">2020 - 2019</Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
              Content Creator
            </Typography>
            <Typography variant="caption">2019 - 2018</Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer
              at risus in orci placerat tincidunt.
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};



export default ResumeTemplate9;*/}
