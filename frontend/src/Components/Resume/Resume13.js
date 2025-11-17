import React from 'react';
import {
  Container,
  Grid,
  Paper,
  Box,
  Typography,
  Avatar,
  Divider,
} from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LanguageIcon from '@mui/icons-material/Language';

const Resume13 = ({ 
  color = '#3A5A78',
  nameColor = '#333333',
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

  // Define a color palette for the template with customizable accent color
  const palette = {
    mainBackground: '#FFFFFF',
    sidebarBackground: primaryColor + '15', // 15 hex = ~8% opacity
    accentColor: primaryColor,
    textColor: '#333333',
    lightText: '#666666',
    nameColor: nameColor, // This should now properly update with the prop
  };

  return (
    <Container sx={{ 
      my: topBottomMargin / 10, 
      width: pageSize === "A4" ? "210mm" : "216mm",
    }}>
      <Paper elevation={5} sx={{ 
        borderRadius: 2, 
        overflow: 'hidden',
        fontFamily: font,
        fontSize: fontSize,
        fontStyle: fontStyle,
        lineHeight: `${lineSpacing}px`,
        minHeight: pageSize === "A4" ? "297mm" : "279mm",
      }}>
        
        {/* Full-width Header with rounded corners */}
        <Box 
          sx={{
            display: 'flex',
            alignItems: 'center',
            bgcolor: palette.sidebarBackground,
            p: sideMargins / 5,
            // Apply rounded corners only to the top-left and bottom-left
            borderTopLeftRadius: 20,
            borderTopRightRadius: 0,
            borderBottomLeftRadius: 20,
            borderBottomRightRadius: 0,
            
            // Adjust to be a single row on small screens, and a two-column on larger screens
            flexDirection: { xs: 'column', sm: 'row' },
            gap: { xs: 2, sm: 8 },
            mt: "50px",
            mb: "50px",
            ml: "100px"
          }}
        >
          <Box >
            <Avatar
              alt="Profile"
              src="/path/to/your/image.jpg"
              sx={{ 
                width: 120, 
                height: 120, 
                mb: { xs: 2, sm: 0 },
                border: `${lineWeight * 2}px solid white`,
              }}
            />
          </Box>
          <Box >
            <Typography variant="h4" component="h1" fontWeight="bold" sx={{ 
              color: palette.accentColor,
              fontSize: `calc(${headingSize} * 1.5)`,
              fontFamily: font,
            }}>
              DONNA STROUPE
            </Typography>
            <Typography variant="subtitle1" sx={{ 
              color: palette.lightText,
              fontSize: `calc(${fontSize} * 1.1)`,
              fontFamily: font,
            }}>
              Sales Representative
            </Typography>
          </Box>
        </Box>
        
        <Grid container sx={{ display: "flex" }}>
          {/* Left Sidebar (No longer contains name/title/avatar) */}
          <Grid item xs={12} sm={4} sx={{ 
            bgcolor: palette.sidebarBackground, 
            p: sideMargins / 5, 
            width: "30%",
            fontFamily: font,
            fontSize: fontSize,
            lineHeight: `${lineSpacing}px`,
          }}>
            {/* Contact Info */}
            <Box sx={{ mb: sectionSpacing / 10 }}>
              <Typography variant="h6" fontWeight="bold" sx={{ 
                mb: 1, 
                color: palette.accentColor,
                fontSize: `calc(${headingSize} * 0.8)`,
                fontFamily: font,
              }}>
                Contact
              </Typography>
              <Box display="flex" alignItems="center" mb={1}>
                <PhoneIcon sx={{ mr: 1, color: palette.accentColor }} />
                <Typography variant="body2" sx={{ fontFamily: font }}>
                  +1 456-789-0123
                </Typography>
              </Box>
              <Box display="flex" alignItems="center" mb={1}>
                <EmailIcon sx={{ mr: 1, color: palette.accentColor }} />
                <Typography variant="body2" sx={{ fontFamily: font }}>
                  hello@email.com
                </Typography>
              </Box>
              <Box display="flex" alignItems="center">
                <LocationOnIcon sx={{ mr: 1, color: palette.accentColor }} />
                <Typography variant="body2" sx={{ fontFamily: font }}>
                  Anywhere St, Anytown
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ 
              my: paragraphSpacing / 5, 
              borderWidth: `${lineWeight}px`,
            }} />

            {/* Education */}
            <Box sx={{ mb: sectionSpacing / 10 }}>
              <Typography variant="h6" fontWeight="bold" sx={{ 
                mb: 1, 
                color: palette.accentColor,
                fontSize: `calc(${headingSize} * 0.8)`,
                fontFamily: font,
              }}>
                Education
              </Typography>
              <Typography variant="subtitle2" fontWeight="bold" sx={{ fontFamily: font }}>
                B.A. Sales and Commerce
              </Typography>
              <Typography variant="body2" sx={{ 
                color: palette.lightText,
                fontFamily: font,
              }}>
                Western University
              </Typography>
              <Typography variant="body2" sx={{ 
                color: palette.lightText,
                fontFamily: font,
              }}>
                2019 - 2024
              </Typography>
            </Box>

            <Divider sx={{ 
              my: paragraphSpacing / 5, 
              borderWidth: `${lineWeight}px`,
            }} />

            {/* Skills */}
            <Box sx={{ mb: sectionSpacing / 10 }}>
              <Typography variant="h6" fontWeight="bold" sx={{ 
                mb: 1, 
                color: palette.accentColor,
                fontSize: `calc(${headingSize} * 0.8)`,
                fontFamily: font,
              }}>
                Skills
              </Typography>
              <Box component="ul" sx={{ listStyleType: 'none', p: 0 }}>
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
            </Box>

            <Divider sx={{ 
              my: paragraphSpacing / 5, 
              borderWidth: `${lineWeight}px`,
            }} />
            
            {/* Languages */}
            <Box>
              <Typography variant="h6" fontWeight="bold" sx={{ 
                mb: 1, 
                color: palette.accentColor,
                fontSize: `calc(${headingSize} * 0.8)`,
                fontFamily: font,
              }}>
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
          </Grid>

          {/* Right Main Content */}
          <Grid item xs={12} sm={8} sx={{ 
            p: sideMargins / 5, 
            width: "70%",
            fontFamily: font,
            fontSize: fontSize,
            lineHeight: `${lineSpacing}px`,
            margin: `${topBottomMargin / 10}px 0`,
          }}>
            {/* About Me */}
            <Box sx={{ mb: sectionSpacing / 10 }}>
              <Typography variant="h6" fontWeight="bold" sx={{ 
                mb: 1, 
                color: palette.accentColor,
                fontSize: `calc(${headingSize} * 0.8)`,
                fontFamily: font,
              }}>
                About Me
              </Typography>
              <Typography variant="body2" sx={{ 
                fontFamily: font,
                textIndent: `${paragraphIndent}px`,
              }}>
                I am a Sales Representative with extensive experience in the fast-moving consumer goods industry. I am a professional who initiates and manages relationships with clients, who serves as their point of contact, and I am adept at following up with leads.
              </Typography>
            </Box>

            <Divider sx={{ 
              my: paragraphSpacing / 5, 
              borderWidth: `${lineWeight}px`,
            }} />

            {/* Work Experience */}
            <Box sx={{ mb: sectionSpacing / 10 }}>
              <Typography variant="h6" fontWeight="bold" sx={{ 
                mb: 2, 
                color: palette.accentColor,
                fontSize: `calc(${headingSize} * 0.8)`,
                fontFamily: font,
              }}>
                Work Experience
              </Typography>

              {/* Job 1 */}
              <Box sx={{ mb: sectionSpacing / 10 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="subtitle1" fontWeight="bold" sx={{ fontFamily: font }}>
                    Consumer Goods Seller
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontFamily: font }}>
                    Aug 2018 - Present
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ 
                  mb: 1, 
                  color: palette.lightText,
                  fontFamily: font,
                }}>
                  Impressive Industries
                </Typography>
                <Typography variant="body2" sx={{ 
                  fontFamily: font,
                  textIndent: `${paragraphIndent}px`,
                }}>
                  • Offer consumer goods packages to corporate and clients
                </Typography>
                <Typography variant="body2" sx={{ 
                  fontFamily: font,
                  textIndent: `${paragraphIndent}px`,
                }}>
                  • Meet with clients every quarter to update or renew services
                </Typography>
              </Box>

              {/* Job 2 */}
              <Box sx={{ mb: sectionSpacing / 10 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="subtitle1" fontWeight="bold" sx={{ fontFamily: font }}>
                    PMCG Sales Agent
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontFamily: font }}>
                    Jul 2016 - Aug 2018
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ 
                  mb: 1, 
                  color: palette.lightText,
                  fontFamily: font,
                }}>
                  Fast-moving Industries
                </Typography>
                <Typography variant="body2" sx={{ 
                  fontFamily: font,
                  textIndent: `${paragraphIndent}px`,
                }}>
                  • Visited corporate client offices to renew latest products
                </Typography>
                <Typography variant="body2" sx={{ 
                  fontFamily: font,
                  textIndent: `${paragraphIndent}px`,
                }}>
                  • Built relationships with clients to maintain sales goals and create new opportunities
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ 
              my: paragraphSpacing / 5, 
              borderWidth: `${lineWeight}px`,
            }} />

            {/* References */}
            <Box>
              <Typography variant="h6" fontWeight="bold" sx={{ 
                mb: 2, 
                color: palette.accentColor,
                fontSize: `calc(${headingSize} * 0.8)`,
                fontFamily: font,
              }}>
                References
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1" fontWeight="bold" sx={{ fontFamily: font }}>
                    Estelle Denny
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontFamily: font }}>
                    Associate Director, COO
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontFamily: font }}>
                    <a href="mailto:estelledenny@gmail.com" style={{ color: palette.lightText }}>estelledenny@gmail.com</a>
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1" fontWeight="bold" sx={{ fontFamily: font }}>
                    Harper Russo
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontFamily: font }}>
                    Associate Director, CEO
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontFamily: font }}>
                    <a href="mailto:harperrusso@gmail.com" style={{ color: palette.lightText }}>harperrusso@gmail.com</a>
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

// Meta information for Resume13
export const resumeMeta = {
  hasPhoto: true,
  columns: 2,
  colorOptions: [
    { value: '#3A5A78', label: 'Default Blue' },
    { value: '#1a2b47', label: 'Dark Blue' },
    { value: '#6a1b9a', label: 'Purple' },
    { value: '#88c4d4ff', label: 'Green' },
    { value: '#d32f2f', label: 'Red' }
  ],
  nameColorOptions: [
    { value: '#333333', label: 'Dark Gray' },
    { value: '#000000', label: 'Black' },
    { value: '#1a2b47', label: 'Dark Blue' },
    { value: '#2e7d32', label: 'Green' },
    { value: '#d32f2f', label: 'Red' }
  ]
};

export default Resume13;
{/*// Resume13.js
import React from 'react';
import {
  Container,
  Grid,
  Paper,
  Box,
  Typography,
  Avatar,
  Divider,
} from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LanguageIcon from '@mui/icons-material/Language';

const Resume13 = ({ color = '#3A5A78', nameColor = '#333333' }) => {
  // Define a color palette for the template with customizable accent color
  const palette = {
    mainBackground: '#FFFFFF',
    sidebarBackground: color + '15', // 15 hex = ~8% opacity
    accentColor: color,
    textColor: '#333333',
    lightText: '#666666',
    nameColor: nameColor, // This should now properly update with the prop
  };

  return (
    <Container  sx={{ my: 4, width: "210mm", }}>
      <Paper elevation={5} sx={{ borderRadius: 2, overflow: 'hidden' }}>
        
        <Box 
          sx={{
            display: 'flex',
            alignItems: 'center',
            bgcolor: palette.sidebarBackground,
            p: 2,
            // Apply rounded corners only to the top-left and bottom-left
            borderTopLeftRadius: 20,
            borderTopRightRadius: 0,
            borderBottomLeftRadius: 20,
            borderBottomRightRadius: 0,
            
            // Adjust to be a single row on small screens, and a two-column on larger screens
            flexDirection: { xs: 'column', sm: 'row' },
            gap: { xs: 2, sm: 8 },
            mt: "50px",
            mb: "50px",
            ml: "100px"
          }}
        >
          <Box >
            <Avatar
              alt="Profile"
              src="/path/to/your/image.jpg"
              sx={{ width: 120, height: 120, mb: { xs: 2, sm: 0 } }}
            />
          </Box>
          <Box >
            <Typography variant="h4" component="h1" fontWeight="bold" sx={{ color: palette.accentColor }}>
              DONNA STROUPE
            </Typography>
            <Typography variant="subtitle1" sx={{ color: palette.lightText }}>
              Sales Representative
            </Typography>
          </Box>
        </Box>
        
        <Grid container sx={{ display: "flex" }}>
          <Grid item xs={12} sm={4} sx={{ bgcolor: palette.sidebarBackground, p: 4, width: "30%" }}>
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 1, color: palette.accentColor }}>
                Contact
              </Typography>
              <Box display="flex" alignItems="center" mb={1}>
                <PhoneIcon sx={{ mr: 1, color: palette.accentColor }} />
                <Typography variant="body2">+1 456-789-0123</Typography>
              </Box>
              <Box display="flex" alignItems="center" mb={1}>
                <EmailIcon sx={{ mr: 1, color: palette.accentColor }} />
                <Typography variant="body2">hello@email.com</Typography>
              </Box>
              <Box display="flex" alignItems="center">
                <LocationOnIcon sx={{ mr: 1, color: palette.accentColor }} />
                <Typography variant="body2">Anywhere St, Anytown</Typography>
              </Box>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 1, color: palette.accentColor }}>
                Education
              </Typography>
              <Typography variant="subtitle2" fontWeight="bold">
                B.A. Sales and Commerce
              </Typography>
              <Typography variant="body2" sx={{ color: palette.lightText }}>
                Western University
              </Typography>
              <Typography variant="body2" sx={{ color: palette.lightText }}>
                2019 - 2024
              </Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 1, color: palette.accentColor }}>
                Skills
              </Typography>
              <Box component="ul" sx={{ listStyleType: 'none', p: 0 }}>
                <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                  • Fast-moving consumer goods
                </Typography>
                <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                  • Packaged consumer goods sales
                </Typography>
                <Typography component="li" variant="body2">
                  • Corporate sales account management
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ my: 2 }} />
            
            <Box>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 1, color: palette.accentColor }}>
                Languages
              </Typography>
              <Box component="ul" sx={{ listStyleType: 'none', p: 0 }}>
                <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                  • English
                </Typography>
                <Typography component="li" variant="body2">
                  • French
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} sm={8} sx={{ p: 4, width: "70%" }}>
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 1, color: palette.accentColor }}>
                About Me
              </Typography>
              <Typography variant="body2">
                I am a Sales Representative with extensive experience in the fast-moving consumer goods industry. I am a professional who initiates and manages relationships with clients, who serves as their point of contact, and I am adept at following up with leads.
              </Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, color: palette.accentColor }}>
                Work Experience
              </Typography>

              <Box sx={{ mb: 3 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="subtitle1" fontWeight="bold">
                    Consumer Goods Seller
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Aug 2018 - Present
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ mb: 1, color: palette.lightText }}>
                  Impressive Industries
                </Typography>
                <Typography variant="body2">
                  • Offer consumer goods packages to corporate and clients
                </Typography>
                <Typography variant="body2">
                  • Meet with clients every quarter to update or renew services
                </Typography>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="subtitle1" fontWeight="bold">
                    PMCG Sales Agent
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Jul 2016 - Aug 2018
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ mb: 1, color: palette.lightText }}>
                  Fast-moving Industries
                </Typography>
                <Typography variant="body2">
                  • Visited corporate client offices to renew latest products
                </Typography>
                <Typography variant="body2">
                  • Built relationships with clients to maintain sales goals and create new opportunities
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, color: palette.accentColor }}>
                References
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    Estelle Denny
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Associate Director, COO
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <a href="mailto:estelledenny@gmail.com" style={{ color: palette.lightText }}>estelledenny@gmail.com</a>
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    Harper Russo
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Associate Director, CEO
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <a href="mailto:harperrusso@gmail.com" style={{ color: palette.lightText }}>harperrusso@gmail.com</a>
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

// Meta information for Resume13
export const resumeMeta = {
  hasPhoto: true,
  columns: 2,
  colorOptions: [
    { value: '#3A5A78', label: 'Default Blue' },
    { value: '#1a2b47', label: 'Dark Blue' },
    { value: '#6a1b9a', label: 'Purple' },
    { value: '#88c4d4ff', label: 'Green' },
    { value: '#d32f2f', label: 'Red' }
  ],
  nameColorOptions: [
    { value: '#333333', label: 'Dark Gray' },
    { value: '#000000', label: 'Black' },
    { value: '#1a2b47', label: 'Dark Blue' },
    { value: '#2e7d32', label: 'Green' },
    { value: '#d32f2f', label: 'Red' }
  ]
};

export default Resume13;*/}
{/*// Resume13.js
import React from 'react';
import {
  Container,
  Grid,
  Paper,
  Box,
  Typography,
  Avatar,
  Divider,
} from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LanguageIcon from '@mui/icons-material/Language';

const Resume13 = ({ color = '#3A5A78', nameColor = '#333333' }) => {
  // Define a color palette for the template with customizable accent color
  const palette = {
    mainBackground: '#FFFFFF',
    sidebarBackground: color + '15', // 15 hex = ~8% opacity
    accentColor: color,
    textColor: '#333333',
    lightText: '#666666',
    nameColor: nameColor,
  };

  return (
    <Container maxWidth="md" sx={{ my: 4 }}>
      <Paper elevation={5} sx={{ borderRadius: 2, overflow: 'hidden' }}>
        
        <Box 
          sx={{
            display: 'flex',
            alignItems: 'center',
            bgcolor: palette.sidebarBackground,
            p: 2,
            // Apply rounded corners only to the top-left and bottom-left
            borderTopLeftRadius: 20,
            borderTopRightRadius: 0,
            borderBottomLeftRadius: 20,
            borderBottomRightRadius: 0,
            
            // Adjust to be a single row on small screens, and a two-column on larger screens
            flexDirection: { xs: 'column', sm: 'row' },
            gap: { xs: 2, sm: 8 },
            mt: "50px",
            mb: "50px",
            ml: "100px"
          }}
        >
          <Box >
            <Avatar
              alt="Profile"
              src="/path/to/your/image.jpg"
              sx={{ width: 120, height: 120, mb: { xs: 2, sm: 0 } }}
            />
          </Box>
          <Box >
            <Typography variant="h4" component="h1" fontWeight="bold" sx={{ color: palette.nameColor }}>
              DONNA STROUPE
            </Typography>
            <Typography variant="subtitle1" sx={{ color: palette.lightText }}>
              Sales Representative
            </Typography>
          </Box>
        </Box>
        
        <Grid container sx={{ display: "flex" }}>
          <Grid item xs={12} sm={4} sx={{ bgcolor: palette.sidebarBackground, p: 4, width: "30%" }}>
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 1, color: palette.accentColor }}>
                Contact
              </Typography>
              <Box display="flex" alignItems="center" mb={1}>
                <PhoneIcon sx={{ mr: 1, color: palette.accentColor }} />
                <Typography variant="body2">+1 456-789-0123</Typography>
              </Box>
              <Box display="flex" alignItems="center" mb={1}>
                <EmailIcon sx={{ mr: 1, color: palette.accentColor }} />
                <Typography variant="body2">hello@email.com</Typography>
              </Box>
              <Box display="flex" alignItems="center">
                <LocationOnIcon sx={{ mr: 1, color: palette.accentColor }} />
                <Typography variant="body2">Anywhere St, Anytown</Typography>
              </Box>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 1, color: palette.accentColor }}>
                Education
              </Typography>
              <Typography variant="subtitle2" fontWeight="bold">
                B.A. Sales and Commerce
              </Typography>
              <Typography variant="body2" sx={{ color: palette.lightText }}>
                Western University
              </Typography>
              <Typography variant="body2" sx={{ color: palette.lightText }}>
                2019 - 2024
              </Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 1, color: palette.accentColor }}>
                Skills
              </Typography>
              <Box component="ul" sx={{ listStyleType: 'none', p: 0 }}>
                <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                  • Fast-moving consumer goods
                </Typography>
                <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                  • Packaged consumer goods sales
                </Typography>
                <Typography component="li" variant="body2">
                  • Corporate sales account management
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ my: 2 }} />
            
            <Box>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 1, color: palette.accentColor }}>
                Languages
              </Typography>
              <Box component="ul" sx={{ listStyleType: 'none', p: 0 }}>
                <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                  • English
                </Typography>
                <Typography component="li" variant="body2">
                  • French
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} sm={8} sx={{ p: 4, width: "70%" }}>
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 1, color: palette.accentColor }}>
                About Me
              </Typography>
              <Typography variant="body2">
                I am a Sales Representative with extensive experience in the fast-moving consumer goods industry. I am a professional who initiates and manages relationships with clients, who serves as their point of contact, and I am adept at following up with leads.
              </Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, color: palette.accentColor }}>
                Work Experience
              </Typography>

              <Box sx={{ mb: 3 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="subtitle1" fontWeight="bold">
                    Consumer Goods Seller
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Aug 2018 - Present
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ mb: 1, color: palette.lightText }}>
                  Impressive Industries
                </Typography>
                <Typography variant="body2">
                  • Offer consumer goods packages to corporate and clients
                </Typography>
                <Typography variant="body2">
                  • Meet with clients every quarter to update or renew services
                </Typography>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="subtitle1" fontWeight="bold">
                    PMCG Sales Agent
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Jul 2016 - Aug 2018
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ mb: 1, color: palette.lightText }}>
                  Fast-moving Industries
                </Typography>
                <Typography variant="body2">
                  • Visited corporate client offices to renew latest products
                </Typography>
                <Typography variant="body2">
                  • Built relationships with clients to maintain sales goals and create new opportunities
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, color: palette.accentColor }}>
                References
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    Estelle Denny
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Associate Director, COO
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <a href="mailto:estelledenny@gmail.com" style={{ color: palette.lightText }}>estelledenny@gmail.com</a>
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    Harper Russo
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Associate Director, CEO
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <a href="mailto:harperrusso@gmail.com" style={{ color: palette.lightText }}>harperrusso@gmail.com</a>
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

// Meta information for Resume13
export const resumeMeta = {
  hasPhoto: true,
  columns: 2,
  colorOptions: [
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
  ]
};

export default Resume13;*/}
{/*// Resume13.js
import React from 'react';
import {
  Container,
  Grid,
  Paper,
  Box,
  Typography,
  Avatar,
  Divider,
} from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LanguageIcon from '@mui/icons-material/Language';

const Resume13 = ({ color = '#3A5A78' }) => {
  // Define a color palette for the template with customizable accent color
  const palette = {
    mainBackground: '#FFFFFF',
    sidebarBackground: '#E8F0F7',
    accentColor: color, // Use the theme color
    textColor: '#333333',
    lightText: '#666666',
  };

  return (
    <Container maxWidth="md" sx={{ my: 4 }}>
      <Paper elevation={5} sx={{ borderRadius: 2, overflow: 'hidden' }}>
        
        <Box 
          sx={{
            display: 'flex',
            alignItems: 'center',
            bgcolor: palette.sidebarBackground,
            p: 2,
            // Apply rounded corners only to the top-left and bottom-left
            borderTopLeftRadius: 20,
            borderTopRightRadius: 0,
            borderBottomLeftRadius: 20,
            borderBottomRightRadius: 0,
            
            // Adjust to be a single row on small screens, and a two-column on larger screens
            flexDirection: { xs: 'column', sm: 'row' },
            gap: { xs: 2, sm: 8 },
            mt:"50px",
            mb:"50px",
            ml:"100px"
          }}
        >
          <Box >
            <Avatar
              alt="Profile"
              src="/path/to/your/image.jpg"
              sx={{ width: 120, height: 120, mb: { xs: 2, sm: 0 } }}
            />
          </Box>
          <Box >
            <Typography variant="h4" component="h1" fontWeight="bold" sx={{ color: palette.textColor }}>
              DONNA STROUPE
            </Typography>
            <Typography variant="subtitle1" sx={{ color: palette.lightText }}>
              Sales Representative
            </Typography>
          </Box>
        </Box>
        
        <Grid container sx={{display:"flex"}}>
          <Grid item xs={12} sm={4} sx={{ bgcolor: palette.sidebarBackground, p: 4,width:"30%" }}>
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 1, color: palette.accentColor }}>
                Contact
              </Typography>
              <Box display="flex" alignItems="center" mb={1}>
                <PhoneIcon sx={{ mr: 1, color: palette.accentColor }} />
                <Typography variant="body2">+1 456-789-0123</Typography>
              </Box>
              <Box display="flex" alignItems="center" mb={1}>
                <EmailIcon sx={{ mr: 1, color: palette.accentColor }} />
                <Typography variant="body2">hello@email.com</Typography>
              </Box>
              <Box display="flex" alignItems="center">
                <LocationOnIcon sx={{ mr: 1, color: palette.accentColor }} />
                <Typography variant="body2">Anywhere St, Anytown</Typography>
              </Box>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 1, color: palette.accentColor }}>
                Education
              </Typography>
              <Typography variant="subtitle2" fontWeight="bold">
                B.A. Sales and Commerce
              </Typography>
              <Typography variant="body2" sx={{ color: palette.lightText }}>
                Western University
              </Typography>
              <Typography variant="body2" sx={{ color: palette.lightText }}>
                2019 - 2024
              </Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 1, color: palette.accentColor }}>
                Skills
              </Typography>
              <Box component="ul" sx={{ listStyleType: 'none', p: 0 }}>
                <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                  • Fast-moving consumer goods
                </Typography>
                <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                  • Packaged consumer goods sales
                </Typography>
                <Typography component="li" variant="body2">
                  • Corporate sales account management
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ my: 2 }} />
            
            <Box>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 1, color: palette.accentColor }}>
                Languages
              </Typography>
              <Box component="ul" sx={{ listStyleType: 'none', p: 0 }}>
                <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                  • English
                </Typography>
                <Typography component="li" variant="body2">
                  • French
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} sm={8} sx={{ p: 4 ,width:"70%"}}>
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 1, color: palette.accentColor }}>
                About Me
              </Typography>
              <Typography variant="body2">
                I am a Sales Representative with extensive experience in the fast-moving consumer goods industry. I am a professional who initiates and manages relationships with clients, who serves as their point of contact, and I am adept at following up with leads.
              </Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, color: palette.accentColor }}>
                Work Experience
              </Typography>

              <Box sx={{ mb: 3 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="subtitle1" fontWeight="bold">
                    Consumer Goods Seller
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Aug 2018 - Present
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ mb: 1, color: palette.lightText }}>
                  Impressive Industries
                </Typography>
                <Typography variant="body2">
                  • Offer consumer goods packages to corporate and clients
                </Typography>
                <Typography variant="body2">
                  • Meet with clients every quarter to update or renew services
                </Typography>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="subtitle1" fontWeight="bold">
                    PMCG Sales Agent
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Jul 2016 - Aug 2018
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ mb: 1, color: palette.lightText }}>
                  Fast-moving Industries
                </Typography>
                <Typography variant="body2">
                  • Visited corporate client offices to renew latest products
                </Typography>
                <Typography variant="body2">
                  • Built relationships with clients to maintain sales goals and create new opportunities
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, color: palette.accentColor }}>
                References
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    Estelle Denny
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Associate Director, COO
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <a href="mailto:estelledenny@gmail.com" style={{ color: palette.lightText }}>estelledenny@gmail.com</a>
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    Harper Russo
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Associate Director, CEO
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <a href="mailto:harperrusso@gmail.com" style={{ color: palette.lightText }}>harperrusso@gmail.com</a>
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

// Meta information for Resume13
export const resumeMeta = {
  hasPhoto: true,
  columns: 2,
};

export default Resume13;*/}
{/*import React from 'react';
import {
  Container,
  Grid,
  Paper,
  Box,
  Typography,
  Avatar,
  Divider,
} from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LanguageIcon from '@mui/icons-material/Language';

// Define a color palette for the template
const palette = {
  mainBackground: '#FFFFFF',
  sidebarBackground: '#E8F0F7',
  accentColor: '#3A5A78', // A deep blue
  textColor: '#333333',
  lightText: '#666666',
};

const Resume13 = () => {
  return (
    <Container maxWidth="md" sx={{ my: 4 }}>
      <Paper elevation={5} sx={{ borderRadius: 2, overflow: 'hidden' }}>
        
        <Box 
          sx={{
            display: 'flex',
            alignItems: 'center',
            bgcolor: palette.sidebarBackground,
            p: 2,
            // Apply rounded corners only to the top-left and bottom-left
            borderTopLeftRadius: 20,
            borderTopRightRadius: 0,
            borderBottomLeftRadius: 20,
            borderBottomRightRadius: 0,
            
            // Adjust to be a single row on small screens, and a two-column on larger screens
            flexDirection: { xs: 'column', sm: 'row' },
            gap: { xs: 2, sm: 8 },
            mt:"50px",
            mb:"50px",
            ml:"100px"
          }}
        >
          <Box >
            <Avatar
              alt="Profile"
              src="/path/to/your/image.jpg"
              sx={{ width: 120, height: 120, mb: { xs: 2, sm: 0 } }}
            />
          </Box>
          <Box >
            <Typography variant="h4" component="h1" fontWeight="bold" sx={{ color: palette.textColor }}>
              DONNA STROUPE
            </Typography>
            <Typography variant="subtitle1" sx={{ color: palette.lightText }}>
              Sales Representative
            </Typography>
          </Box>
        </Box>
        
        <Grid container sx={{display:"flex"}}>
          <Grid item xs={12} sm={4} sx={{ bgcolor: palette.sidebarBackground, p: 4,width:"30%" }}>
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 1, color: palette.accentColor }}>
                Contact
              </Typography>
              <Box display="flex" alignItems="center" mb={1}>
                <PhoneIcon sx={{ mr: 1, color: palette.accentColor }} />
                <Typography variant="body2">+1 456-789-0123</Typography>
              </Box>
              <Box display="flex" alignItems="center" mb={1}>
                <EmailIcon sx={{ mr: 1, color: palette.accentColor }} />
                <Typography variant="body2">hello@email.com</Typography>
              </Box>
              <Box display="flex" alignItems="center">
                <LocationOnIcon sx={{ mr: 1, color: palette.accentColor }} />
                <Typography variant="body2">Anywhere St, Anytown</Typography>
              </Box>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 1, color: palette.accentColor }}>
                Education
              </Typography>
              <Typography variant="subtitle2" fontWeight="bold">
                B.A. Sales and Commerce
              </Typography>
              <Typography variant="body2" sx={{ color: palette.lightText }}>
                Western University
              </Typography>
              <Typography variant="body2" sx={{ color: palette.lightText }}>
                2019 - 2024
              </Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 1, color: palette.accentColor }}>
                Skills
              </Typography>
              <Box component="ul" sx={{ listStyleType: 'none', p: 0 }}>
                <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                  • Fast-moving consumer goods
                </Typography>
                <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                  • Packaged consumer goods sales
                </Typography>
                <Typography component="li" variant="body2">
                  • Corporate sales account management
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ my: 2 }} />
            
            <Box>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 1, color: palette.accentColor }}>
                Languages
              </Typography>
              <Box component="ul" sx={{ listStyleType: 'none', p: 0 }}>
                <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                  • English
                </Typography>
                <Typography component="li" variant="body2">
                  • French
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} sm={8} sx={{ p: 4 ,width:"70%"}}>
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 1, color: palette.accentColor }}>
                About Me
              </Typography>
              <Typography variant="body2">
                I am a Sales Representative with extensive experience in the fast-moving consumer goods industry. I am a professional who initiates and manages relationships with clients, who serves as their point of contact, and I am adept at following up with leads.
              </Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, color: palette.accentColor }}>
                Work Experience
              </Typography>

              <Box sx={{ mb: 3 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="subtitle1" fontWeight="bold">
                    Consumer Goods Seller
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Aug 2018 - Present
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ mb: 1, color: palette.lightText }}>
                  Impressive Industries
                </Typography>
                <Typography variant="body2">
                  • Offer consumer goods packages to corporate and clients
                </Typography>
                <Typography variant="body2">
                  • Meet with clients every quarter to update or renew services
                </Typography>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="subtitle1" fontWeight="bold">
                    PMCG Sales Agent
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Jul 2016 - Aug 2018
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ mb: 1, color: palette.lightText }}>
                  Fast-moving Industries
                </Typography>
                <Typography variant="body2">
                  • Visited corporate client offices to renew latest products
                </Typography>
                <Typography variant="body2">
                  • Built relationships with clients to maintain sales goals and create new opportunities
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, color: palette.accentColor }}>
                References
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    Estelle Denny
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Associate Director, COO
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <a href="mailto:estelledenny@gmail.com" style={{ color: palette.lightText }}>estelledenny@gmail.com</a>
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    Harper Russo
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Associate Director, CEO
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <a href="mailto:harperrusso@gmail.com" style={{ color: palette.lightText }}>harperrusso@gmail.com</a>
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default Resume13;*/}