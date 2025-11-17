import React from "react";
import { 
  Box, 
  Typography, 
  Avatar, 
  Divider, 
  List, 
  ListItem, 
  ListItemText,
  ListItemIcon
} from "@mui/material";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import LocationOnIcon from "@mui/icons-material/LocationOn";


const Resume17 = ({
  color = "#3f51b5",
  nameColor = "#f3ededff",
  sidebarBackground = "#f5f5f5",
  headerBackground = "linear-gradient(135deg, #3f51b5, #2196f3)",
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
        width: pageSize === "A4" ? "210mm" : "216mm",
        minHeight: pageSize === "A4" ? "297mm" : "279mm",
        mx: "auto",
        boxShadow: 4,
        bgcolor: "white",
        fontFamily: font,
        fontSize: fontSize,
        fontStyle: fontStyle,
        lineHeight: `${lineSpacing}px`,
        position: "relative",
        overflow: "hidden",
        my: topBottomMargin / 10,
        p: `${topBottomMargin / 2}px ${sideMargins / 2}px`,
      }}
    >
      {/* V Shape Header */}
      <Box
        sx={{
          width: "100%",
          height: "200px",
          background: palette.header,
          clipPath: "polygon(0 0, 100% 0, 100% 75%, 50% 100%, 0 75%)",
          position: "relative",
          display: "flex",
          justifyContent: "center",
          color: "white",
        }}
      >
        <Box sx={{ textAlign: "center", px: 3, mt: 2 }}>
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: "bold", 
              color: palette.nameColor,
              fontSize: `calc(${headingSize} * 1.5)`,
              fontFamily: font,
            }}
          >
            DONNA STROUPE
          </Typography>
          <Typography 
            variant="subtitle1" 
            sx={{ 
              color: palette.nameColor, 
              fontSize: `calc(${fontSize} * 1.1)`,
              fontFamily: font,
              mb: 1 
            }}
          >
            Sales Representative
          </Typography>
        </Box>
        <Avatar
          src="https://via.placeholder.com/150"
          sx={{
            width: 100,
            height: 100,
            border: "4px solid white",
            position: "absolute",
            bottom: "-3px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
          }}
        />
      </Box>

      {/* Two Column Layout */}
      <Box sx={{ display: "flex", mt: 2 }}>
        {/* Left Column */}
        <Box
          sx={{
            width: "30%",
            bgcolor: palette.sidebarBackground,
            p: sideMargins / 5,
            borderRight: `${lineWeight}px solid #eee`,
            fontFamily: font,
            fontSize: fontSize,
            lineHeight: `${lineSpacing}px`,
          }}
        >
          {/* Contact */}
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: "bold", 
              color: palette.accentColor, 
              mb: 1,
              fontSize: `calc(${headingSize} * 0.8)`,
              fontFamily: font,
            }}
          >
            Contact
          </Typography>
          <List dense>
            <ListItem sx={{ px: 0 }}>
              <ListItemIcon sx={{ minWidth: '30px', color: palette.accentColor }}>
                <PhoneIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText 
                primary="+1 456-789-0123" 
                primaryTypographyProps={{ fontFamily: font, fontSize: fontSize }}
              />
            </ListItem>
            <ListItem sx={{ px: 0 }}>
              <ListItemIcon sx={{ minWidth: '30px', color: palette.accentColor }}>
                <EmailIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText 
                primary="hello@email.com" 
                primaryTypographyProps={{ fontFamily: font, fontSize: fontSize }}
              />
            </ListItem>
            <ListItem sx={{ px: 0 }}>
              <ListItemIcon sx={{ minWidth: '30px', color: palette.accentColor }}>
                <LocationOnIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText 
                primary="Anywhere St, Anytown" 
                primaryTypographyProps={{ fontFamily: font, fontSize: fontSize }}
              />
            </ListItem>
          </List>

          <Divider sx={{ my: sectionSpacing / 10, borderBottomWidth: lineWeight }} />

          {/* Skills */}
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: "bold", 
              color: palette.accentColor, 
              mb: 1,
              fontSize: `calc(${headingSize} * 0.8)`,
              fontFamily: font,
            }}
          >
            Skills
          </Typography>
          <Box component="ul" sx={{ listStyleType: 'none', p: 0, mb: 2 }}>
            <Typography component="li" variant="body2" sx={{ 
              mb: 1,
              fontFamily: font,
              textIndent: `${paragraphIndent}px`,
            }}>
              • Fast-moving consumer goods
            </Typography>
            <Typography component="li" variant="body2" sx={{ 
              mb: 1,
              fontFamily: font,
              textIndent: `${paragraphIndent}px`,
            }}>
              • Packaged consumer goods sales
            </Typography>
            <Typography component="li" variant="body2" sx={{ 
              fontFamily: font,
              textIndent: `${paragraphIndent}px`,
            }}>
              • Corporate sales account management
            </Typography>
          </Box>

          <Divider sx={{ my: sectionSpacing / 10, borderBottomWidth: lineWeight }} />

          {/* Languages */}
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: "bold", 
              color: palette.accentColor, 
              mb: 1,
              fontSize: `calc(${headingSize} * 0.8)`,
              fontFamily: font,
            }}
          >
            Languages
          </Typography>
          <Box component="ul" sx={{ listStyleType: 'none', p: 0 }}>
            <Typography component="li" variant="body2" sx={{ 
              mb: 1,
              fontFamily: font,
              textIndent: `${paragraphIndent}px`,
            }}>
              • English
            </Typography>
            <Typography component="li" variant="body2" sx={{ 
              fontFamily: font,
              textIndent: `${paragraphIndent}px`,
            }}>
              • French
            </Typography>
          </Box>
        </Box>

        {/* Right Column */}
        <Box 
          sx={{ 
            width: "70%", 
            p: sideMargins / 5,
            fontFamily: font,
            fontSize: fontSize,
            lineHeight: `${lineSpacing}px`,
          }}
        >
          {/* About Me */}
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: "bold", 
              color: palette.accentColor, 
              mb: 1,
              fontSize: `calc(${headingSize} * 0.8)`,
              fontFamily: font,
            }}
          >
            About Me
          </Typography>
          <Typography 
            sx={{ 
              mb: sectionSpacing / 10, 
              color: "#555",
              fontFamily: font,
              textIndent: `${paragraphIndent}px`,
            }}
          >
            I am a Sales Representative with extensive experience in the fast-moving consumer goods industry. I am a professional who initiates and manages relationships with clients, who serves as their point of contact, and I am adept at following up with leads.
          </Typography>

          <Divider sx={{ my: sectionSpacing / 10, borderBottomWidth: lineWeight }} />

          {/* Work Experience */}
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: "bold", 
              color: palette.accentColor, 
              mb: 1,
              fontSize: `calc(${headingSize} * 0.8)`,
              fontFamily: font,
            }}
          >
            Work Experience
          </Typography>
          
          {/* Job 1 */}
          <Box sx={{ mb: sectionSpacing / 10 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography 
                variant="subtitle1" 
                fontWeight="bold" 
                sx={{ fontFamily: font }}
              >
                Consumer Goods Seller
              </Typography>
              <Typography 
                variant="body2" 
                color="text.secondary" 
                sx={{ fontFamily: font }}
              >
                Aug 2018 - Present
              </Typography>
            </Box>
            <Typography 
              variant="body2" 
              sx={{ 
                mb: 1, 
                color: palette.lightText,
                fontFamily: font,
              }}
            >
              Impressive Industries
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                fontFamily: font,
                textIndent: `${paragraphIndent}px`,
              }}
            >
              • Offer consumer goods packages to corporate and clients
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                fontFamily: font,
                textIndent: `${paragraphIndent}px`,
              }}
            >
              • Meet with clients every quarter to update or renew services
            </Typography>
          </Box>

          {/* Job 2 */}
          <Box sx={{ mb: sectionSpacing / 10 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography 
                variant="subtitle1" 
                fontWeight="bold" 
                sx={{ fontFamily: font }}
              >
                PMCG Sales Agent
              </Typography>
              <Typography 
                variant="body2" 
                color="text.secondary" 
                sx={{ fontFamily: font }}
              >
                Jul 2016 - Aug 2018
              </Typography>
            </Box>
            <Typography 
              variant="body2" 
              sx={{ 
                mb: 1, 
                color: palette.lightText,
                fontFamily: font,
              }}
            >
              Fast-moving Industries
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                fontFamily: font,
                textIndent: `${paragraphIndent}px`,
              }}
            >
              • Visited corporate client offices to renew latest products
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                fontFamily: font,
                textIndent: `${paragraphIndent}px`,
              }}
            >
              • Built relationships with clients to maintain sales goals and create new opportunities
            </Typography>
          </Box>

          <Divider sx={{ my: sectionSpacing / 10, borderBottomWidth: lineWeight }} />

          {/* Education */}
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: "bold", 
              color: palette.accentColor, 
              mb: 1,
              fontSize: `calc(${headingSize} * 0.8)`,
              fontFamily: font,
            }}
          >
            Education
          </Typography>
          <Box sx={{ mb: sectionSpacing / 10 }}>
            <Typography 
              variant="subtitle2" 
              fontWeight="bold" 
              sx={{ fontFamily: font }}
            >
              B.A. Sales and Commerce
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                color: palette.lightText,
                fontFamily: font,
              }}
            >
              Western University
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                color: palette.lightText,
                fontFamily: font,
              }}
            >
              2019 - 2024
            </Typography>
          </Box>

          <Divider sx={{ my: sectionSpacing / 10, borderBottomWidth: lineWeight }} />

          {/* References */}
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: "bold", 
              color: palette.accentColor, 
              mb: 1,
              fontSize: `calc(${headingSize} * 0.8)`,
              fontFamily: font,
            }}
          >
            References
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Box sx={{ width: '48%' }}>
              <Typography 
                variant="subtitle1" 
                fontWeight="bold" 
                sx={{ fontFamily: font }}
              >
                Estelle Denny
              </Typography>
              <Typography 
                variant="body2" 
                color="text.secondary" 
                sx={{ fontFamily: font }}
              >
                Associate Director, COO
              </Typography>
              <Typography 
                variant="body2" 
                color="text.secondary" 
                sx={{ fontFamily: font }}
              >
                estelledenny@gmail.com
              </Typography>
            </Box>
            <Box sx={{ width: '48%' }}>
              <Typography 
                variant="subtitle1" 
                fontWeight="bold" 
                sx={{ fontFamily: font }}
              >
                Harper Russo
              </Typography>
              <Typography 
                variant="body2" 
                color="text.secondary" 
                sx={{ fontFamily: font }}
              >
                Associate Director, CEO
              </Typography>
              <Typography 
                variant="body2" 
                color="text.secondary" 
                sx={{ fontFamily: font }}
              >
                harperrusso@gmail.com
              </Typography>
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
    { value: '#3f51b5', label: 'Indigo' },
    { value: '#2196f3', label: 'Blue' },
    { value: '#f44336', label: 'Red' },
    { value: '#4caf50', label: 'Green' },
    { value: '#ff9800', label: 'Orange' },
    { value: '#9c27b0', label: 'Purple' }
  ],
  nameColorOptions: [
    { value: '#f3ededff', label: 'Light' },
    { value: '#333333', label: 'Dark Gray' },
    { value: '#000000', label: 'Black' },
    { value: '#1a2b47', label: 'Dark Blue' },
    { value: '#2e7d32', label: 'Green' }
  ],
  sidebarBackgroundOptions: [
    { value: '#f5f5f5', label: 'Light Gray' },
    { value: '#e6f3f9ff', label: 'Light Blue' },
    { value: '#f0f8e6ff', label: 'Light Green' },
    { value: '#f9e6f3ff', label: 'Light Pink' },
    { value: '#e6e6f9ff', label: 'Light Lavender' },
    { value: '#f9f3e6ff', label: 'Light Beige' }
  ],
  headerBackgroundOptions: [
    { value: 'linear-gradient(135deg, #3f51b5, #2196f3)', label: 'Blue Gradient' },
    { value: 'linear-gradient(135deg, #f44336, #ff9800)', label: 'Red-Orange Gradient' },
    { value: 'linear-gradient(135deg, #4caf50, #8bc34a)', label: 'Green Gradient' },
    { value: 'linear-gradient(135deg, #9c27b0, #e91e63)', label: 'Purple-Pink Gradient' },
    { value: 'linear-gradient(135deg, #607d8b, #9e9e9e)', label: 'Gray Gradient' }
  ],
  experienceLevel: ["No Experience", "Less than 3 years", "3-5 Years"]
};

export default Resume17;
{/*import React from "react";
import { Box, Typography, Avatar, Divider, List, ListItem, ListItemText } from "@mui/material";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import BuildIcon from "@mui/icons-material/Build";
import LanguageIcon from "@mui/icons-material/Language";

const Resume17 = ({
  color = "#3f51b5",
  nameColor = "#f3ededff",
  sidebarBackground = "#f5f5f5",
  headerBackground = "linear-gradient(135deg, #3f51b5, #2196f3)"
}) => {
  return (
    <Box
      sx={{
        width: "210mm",
        minHeight: "297mm",
        mx: "auto",
        boxShadow: 4,
        bgcolor: "white",
        fontFamily: "Arial, sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          width: "100%",
          height: "200px",
          background: headerBackground,
          clipPath: "polygon(0 0, 100% 0, 100% 75%, 50% 100%, 0 75%)",
          position: "relative",
          display: "flex",
          justifyContent: "center",
          color: "white",
        }}
      >
        <Box sx={{ textAlign: "center", px: 3, mt: 2 }}>
          <Typography variant="h4" sx={{ fontWeight: "bold", color: nameColor }}>
            DONNA STROUPE
          </Typography>
          <Typography variant="subtitle1" sx={{ color: nameColor, fontSize: "1.1rem", mb: 1 }}>
            Sales Representative
          </Typography>
        </Box>
        <Avatar
          src="https://via.placeholder.com/150"
          sx={{
            width: 100,
            height: 100,
            border: "4px solid white",
            position: "absolute",
            bottom: "-3px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
          }}
        />
      </Box>

      <Box sx={{ display: "flex", mt: 2 }}>
        <Box
          sx={{
            width: "30%",
            bgcolor: sidebarBackground,
            p: 3,
            borderRight: "2px solid #eee",
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: "bold", color: color, mb: 1 }}>
            Contact
          </Typography>
          <List dense>
            <ListItem>
              <PhoneIcon fontSize="small" sx={{ mr: 1, color: color }} />
              <ListItemText primary="+1 (123) 456-7890" />
            </ListItem>
            <ListItem>
              <EmailIcon fontSize="small" sx={{ mr: 1, color: color }} />
              <ListItemText primary="donna@email.com" />
            </ListItem>
            <ListItem>
              <LocationOnIcon fontSize="small" sx={{ mr: 1, color: color }} />
              <ListItemText primary="123 Anywhere St." />
            </ListItem>
          </List>

          <Divider sx={{ my: 2 }} />

          <Typography variant="h6" sx={{ fontWeight: "bold", color: color, mb: 1 }}>
            Skills
          </Typography>
          <Typography>• Communication</Typography>
          <Typography>• Sales Strategy</Typography>
          <Typography>• Negotiation</Typography>
          <Typography>• CRM Tools</Typography>

          <Divider sx={{ my: 2 }} />

          <Typography variant="h6" sx={{ fontWeight: "bold", color: color, mb: 1 }}>
            Languages
          </Typography>
          <Typography>• English (Native)</Typography>
          <Typography>• Spanish (Advanced)</Typography>
          <Typography>• French (Basic)</Typography>
        </Box>

        <Box sx={{ width: "70%", p: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: "bold", color: color, mb: 1 }}>
            Summary
          </Typography>
          <Typography sx={{ mb: 2, color: "#555" }}>
            Motivated sales representative with 3+ years of experience in client relationship
            management, business development, and achieving revenue growth. Skilled in negotiation,
            communication, and sales strategy.
          </Typography>

          <Divider sx={{ my: 2 }} />

          <Typography variant="h6" sx={{ fontWeight: "bold", color: color, mb: 1 }}>
            Work Experience
          </Typography>
          <Typography sx={{ fontWeight: "bold" }}>Marketing Intern – Borcelle Studios</Typography>
          <Typography sx={{ fontStyle: "italic", color: "#777" }}>Jan 2023 – Present</Typography>
          <Typography sx={{ mb: 2 }}>
            • Assisted in developing social media marketing campaigns <br />
            • Conducted market research and competitor analysis <br />
            • Created content for company blog
          </Typography>

          <Typography sx={{ fontWeight: "bold" }}>Retail Associate – City Fashion Store</Typography>
          <Typography sx={{ fontStyle: "italic", color: "#777" }}>Jun 2021 – Dec 2022</Typography>
          <Typography sx={{ mb: 2 }}>
            • Provided customer service and sales support <br />
            • Managed inventory and organized product displays <br />
            • Trained new employees
          </Typography>

          <Divider sx={{ my: 2 }} />

          <Typography variant="h6" sx={{ fontWeight: "bold", color: color, mb: 1 }}>
            Education
          </Typography>
          <Typography sx={{ fontWeight: "bold" }}>Borcelle University</Typography>
          <Typography sx={{ fontStyle: "italic", color: "#777" }}>
            Business Administration (2020 – Present)
          </Typography>
          <Typography sx={{ fontWeight: "bold", mt: 1 }}>Fauget College</Typography>
          <Typography sx={{ fontStyle: "italic", color: "#777" }}>
            High School Diploma (2016 – 2020)
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

// Add metadata for filtering
export const resumeMeta = {
  hasPhoto: true,
  columns: 2,
  experienceLevel: ["No Experience", "Less than 3 years", "3-5 Years"]
};

export default Resume17;*/}
{/*import React from "react";
import { Box, Typography, Avatar, Divider, List, ListItem, ListItemText } from "@mui/material";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import BuildIcon from "@mui/icons-material/Build";
import LanguageIcon from "@mui/icons-material/Language";

const ResumeVShapeDouble = () => {
  return (
    <Box
      sx={{
        width: "210mm",
        minHeight: "297mm",
        mx: "auto",
        boxShadow: 4,
        bgcolor: "white",
        fontFamily: "Arial, sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
    >

        
      <Box
        sx={{
          width: "100%",
          height: "200px",
          background: "linear-gradient(135deg, #3f51b5, #2196f3)",
          clipPath: "polygon(0 0, 100% 0, 100% 75%, 50% 100%, 0 75%)",
          position: "relative",
          display: "flex",
          justifyContent: "center",
          color: "white",
        }}
      >

          <Box sx={{ textAlign: "center",  px: 3,mt:2 }}>
        <Typography variant="h4" sx={{ fontWeight: "bold", color: "#f3ededff" }}>
          DONNA STROUPE
        </Typography>
        <Typography variant="subtitle1" sx={{ color: "#f3ededff", fontSize: "1.1rem", mb: 1 }}>
          Sales Representative
        </Typography>
      </Box>
        <Avatar
          src="https://via.placeholder.com/150"
          sx={{
            width: 100,
            height: 100,
            border: "4px solid white",
            position: "absolute",
            bottom: "-3px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
          }}
        />
      </Box>

    

      <Box sx={{ display: "flex", mt: 2 }}>
        <Box
          sx={{
            width: "30%",
            bgcolor: "#f5f5f5",
            p: 3,
            borderRight: "2px solid #eee",
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: "bold", color: "#3f51b5", mb: 1 }}>
            Contact
          </Typography>
          <List dense>
            <ListItem>
              <PhoneIcon fontSize="small" sx={{ mr: 1, color: "#3f51b5" }} />
              <ListItemText primary="+1 (123) 456-7890" />
            </ListItem>
            <ListItem>
              <EmailIcon fontSize="small" sx={{ mr: 1, color: "#3f51b5" }} />
              <ListItemText primary="donna@email.com" />
            </ListItem>
            <ListItem>
              <LocationOnIcon fontSize="small" sx={{ mr: 1, color: "#3f51b5" }} />
              <ListItemText primary="123 Anywhere St." />
            </ListItem>
          </List>

          <Divider sx={{ my: 2 }} />

          <Typography variant="h6" sx={{ fontWeight: "bold", color: "#3f51b5", mb: 1 }}>
            Skills
          </Typography>
          <Typography>• Communication</Typography>
          <Typography>• Sales Strategy</Typography>
          <Typography>• Negotiation</Typography>
          <Typography>• CRM Tools</Typography>

          <Divider sx={{ my: 2 }} />

          <Typography variant="h6" sx={{ fontWeight: "bold", color: "#3f51b5", mb: 1 }}>
            Languages
          </Typography>
          <Typography>• English (Native)</Typography>
          <Typography>• Spanish (Advanced)</Typography>
          <Typography>• French (Basic)</Typography>
        </Box>

        <Box sx={{ width: "70%", p: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: "bold", color: "#3f51b5", mb: 1 }}>
            Summary
          </Typography>
          <Typography sx={{ mb: 2, color: "#555" }}>
            Motivated sales representative with 3+ years of experience in client relationship
            management, business development, and achieving revenue growth. Skilled in negotiation,
            communication, and sales strategy.
          </Typography>

          <Divider sx={{ my: 2 }} />

          <Typography variant="h6" sx={{ fontWeight: "bold", color: "#3f51b5", mb: 1 }}>
            Work Experience
          </Typography>
          <Typography sx={{ fontWeight: "bold" }}>Marketing Intern – Borcelle Studios</Typography>
          <Typography sx={{ fontStyle: "italic", color: "#777" }}>Jan 2023 – Present</Typography>
          <Typography sx={{ mb: 2 }}>
            • Assisted in developing social media marketing campaigns <br />
            • Conducted market research and competitor analysis <br />
            • Created content for company blog
          </Typography>

          <Typography sx={{ fontWeight: "bold" }}>Retail Associate – City Fashion Store</Typography>
          <Typography sx={{ fontStyle: "italic", color: "#777" }}>Jun 2021 – Dec 2022</Typography>
          <Typography sx={{ mb: 2 }}>
            • Provided customer service and sales support <br />
            • Managed inventory and organized product displays <br />
            • Trained new employees
          </Typography>

          <Divider sx={{ my: 2 }} />

          <Typography variant="h6" sx={{ fontWeight: "bold", color: "#3f51b5", mb: 1 }}>
            Education
          </Typography>
          <Typography sx={{ fontWeight: "bold" }}>Borcelle University</Typography>
          <Typography sx={{ fontStyle: "italic", color: "#777" }}>
            Business Administration (2020 – Present)
          </Typography>
          <Typography sx={{ fontWeight: "bold", mt: 1 }}>Fauget College</Typography>
          <Typography sx={{ fontStyle: "italic", color: "#777" }}>
            High School Diploma (2016 – 2020)
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default ResumeVShapeDouble;*/}