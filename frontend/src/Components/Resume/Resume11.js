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
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import LanguageIcon from '@mui/icons-material/Language';
import WorkIcon from '@mui/icons-material/Work';

const Resume11 = ({ 
  color = '#36454F',
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

  // Define the colors for the template with customizable main color
  const charcoalGray = primaryColor;
  const dustyBlue = primaryColor; // Changed to use the theme color for icons
  const textWhite = '#F8F8F8';
  const textBlack = '#333333';

  return (
    <Container maxWidth="lg" sx={{ my: topBottomMargin / 10 }}>
      <Paper elevation={3} sx={{ 
        borderRadius: 2, 
        width: pageSize === "A4" ? "210mm" : "216mm",
        minHeight: pageSize === "A4" ? "297mm" : "279mm",
        fontFamily: font,
        fontSize: fontSize,
        fontStyle: fontStyle,
        lineHeight: `${lineSpacing}px`,
      }}>
        <Grid container sx={{ display: "flex" }}>
          {/* Main Content Column (Left) */}
          <Grid item xs={12} md={8} sx={{ 
            p: sideMargins / 5, 
            width: "70%",
            margin: `${topBottomMargin / 10}px 0`,
          }}>
            {/* Header */}
            <Box sx={{ mb: sectionSpacing / 10 }}>
              <Typography variant="h2" component="h1" fontWeight="bold" sx={{ 
                color: dustyBlue,
                fontSize: `calc(${headingSize} * 1.8)`,
                fontFamily: font,
              }}>
                JOHN DOE
              </Typography>
              <Typography variant="h5" color={textBlack} sx={{ 
                letterSpacing: 2,
                fontSize: `calc(${fontSize} * 1.3)`,
                fontFamily: font,
              }}>
                SENIOR GRAPHIC DESIGNER
              </Typography>
            </Box>
            
            <Divider sx={{ 
              my: sectionSpacing / 10, 
              borderWidth: `${lineWeight}px`,
            }} />

            {/* Experience Section */}
            <Box sx={{ mb: sectionSpacing / 10 }}>
              <Typography variant="h4" fontWeight="bold" color={textBlack} sx={{ 
                mb: 2,
                fontSize: headingSize,
                fontFamily: font,
              }}>
                Experience
              </Typography>

              {/* Job 1 */}
              <Box sx={{ mb: sectionSpacing / 10 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="h6" fontWeight="bold" sx={{ fontFamily: font }}>
                    Lead Designer
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontFamily: font }}>
                    Jan 2022 - Present
                  </Typography>
                </Box>
                <Typography variant="subtitle2" color="text.secondary" sx={{ 
                  mb: 1,
                  fontFamily: font,
                }}>
                  Creative Solutions Inc. | New York, NY
                </Typography>
                <Typography variant="body2" sx={{ 
                  fontFamily: font,
                  textIndent: `${paragraphIndent}px`,
                }}>
                  • Led a team of 5 designers on major branding projects, increasing client satisfaction by 25%.
                </Typography>
                <Typography variant="body2" sx={{ 
                  fontFamily: font,
                  textIndent: `${paragraphIndent}px`,
                }}>
                  • Developed and executed design strategies that resulted in a 15% growth in new business.
                </Typography>
              </Box>

              {/* Job 2 */}
              <Box sx={{ mb: sectionSpacing / 10 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="h6" fontWeight="bold" sx={{ fontFamily: font }}>
                    Graphic Designer
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontFamily: font }}>
                    Jul 2018 - Dec 2021
                  </Typography>
                </Box>
                <Typography variant="subtitle2" color="text.secondary" sx={{ 
                  mb: 1,
                  fontFamily: font,
                }}>
                  Innovative Marketers | Boston, MA
                </Typography>
                <Typography variant="body2" sx={{ 
                  fontFamily: font,
                  textIndent: `${paragraphIndent}px`,
                }}>
                  • Designed compelling visuals for digital and print campaigns, reaching over 500,000 customers.
                </Typography>
                <Typography variant="body2" sx={{ 
                  fontFamily: font,
                  textIndent: `${paragraphIndent}px`,
                }}>
                  • Collaborated with marketing and product teams to ensure brand consistency.
                </Typography>
              </Box>
            </Box>
            
            <Divider sx={{ 
              my: sectionSpacing / 10, 
              borderWidth: `${lineWeight}px`,
            }} />

            {/* Projects Section */}
            <Box sx={{ mb: sectionSpacing / 10 }}>
              <Typography variant="h4" fontWeight="bold" color={textBlack} sx={{ 
                mb: 2,
                fontSize: headingSize,
                fontFamily: font,
              }}>
                Projects
              </Typography>

              {/* Project 1 */}
              <Box sx={{ mb: paragraphSpacing / 5 }}>
                <Box display="flex" alignItems="center" sx={{ mb: 1 }}>
                  <WorkIcon sx={{ mr: 1, color: dustyBlue }} />
                  <Typography variant="h6" fontWeight="bold" sx={{ fontFamily: font }}>
                    E-commerce Brand Redesign
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ 
                  fontFamily: font,
                  textIndent: `${paragraphIndent}px`,
                }}>
                  • Led the full visual redesign of an e-commerce platform, improving user experience and increasing conversion rates by 10%.
                </Typography>
                <Typography variant="body2" sx={{ 
                  fontFamily: font,
                  textIndent: `${paragraphIndent}px`,
                }}>
                  • Created a comprehensive brand style guide, including new logo, color palette, and typography.
                </Typography>
              </Box>
              
              {/* Project 2 */}
              <Box>
                <Box display="flex" alignItems="center" sx={{ mb: 1 }}>
                  <WorkIcon sx={{ mr: 1, color: dustyBlue }} />
                  <Typography variant="h6" fontWeight="bold" sx={{ fontFamily: font }}>
                    Mobile App UI/UX
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ 
                  fontFamily: font,
                  textIndent: `${paragraphIndent}px`,
                }}>
                  • Designed the complete user interface and user experience for a new mobile application.
                </Typography>
                <Typography variant="body2" sx={{ 
                  fontFamily: font,
                  textIndent: `${paragraphIndent}px`,
                }}>
                  • Conducted user research and usability testing to inform design decisions and improve flow.
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* Sidebar Column (Right) */}
          <Grid item xs={12} md={4} sx={{ 
            bgcolor: charcoalGray, 
            p: sideMargins / 5, 
            color: textWhite, 
            width: "30%",
            fontFamily: font,
            fontSize: fontSize,
            lineHeight: `${lineSpacing}px`,
          }}>
            <Box sx={{ mb: sectionSpacing / 10 }}>
              <Avatar
                alt="John Doe"
                src="/path/to/your/image.jpg"
                sx={{ 
                  width: 120, 
                  height: 120, 
                  margin: '0 auto', 
                  mb: 2,
                  border: `${lineWeight * 2}px solid ${textWhite}`,
                }}
              />
              <Typography variant="h5" component="h2" fontWeight="bold" sx={{ 
                mb: 1,
                fontSize: `calc(${headingSize} * 0.9)`,
                fontFamily: font,
              }}>
                About Me
              </Typography>
              <Typography variant="body2" sx={{ 
                fontFamily: font,
                textIndent: `${paragraphIndent}px`,
              }}>
                A creative and results-driven graphic designer with over 7 years of experience in visual branding and marketing. Passionate about creating designs that solve business problems and delight customers.
              </Typography>
            </Box>

            <Divider sx={{ 
              my: paragraphSpacing / 5, 
              borderColor: textWhite,
              borderWidth: `${lineWeight}px`,
            }} />

            {/* Contact Info */}
            <Box sx={{ mb: sectionSpacing / 10 }}>
              <Typography variant="h5" fontWeight="bold" sx={{ 
                mb: 2,
                fontSize: `calc(${headingSize} * 0.9)`,
                fontFamily: font,
              }}>
                Contact
              </Typography>
              <Box display="flex" mb={1}>
                <PhoneIcon sx={{ mr: 1, color: dustyBlue }} />
                <Typography variant="body2" sx={{ fontFamily: font }}>+1 (555) 123-4567</Typography>
              </Box>
              <Box display="flex" alignItems="center" mb={1}>
                <EmailIcon sx={{ mr: 1, color: dustyBlue }} />
                <Typography variant="body2" sx={{ fontFamily: font }}>johndoe@email.com</Typography>
              </Box>
              <Box display="flex" alignItems="center" mb={1}>
                <LocationOnIcon sx={{ mr: 1, color: dustyBlue }} />
                <Typography variant="body2" sx={{ fontFamily: font }}>New York, NY</Typography>
              </Box>
              <Box display="flex" alignItems="center">
                <LinkedInIcon sx={{ mr: 1, color: dustyBlue }} />
                <Typography variant="body2" sx={{ fontFamily: font }}>linkedin.com/in/johndoe</Typography>
              </Box>
            </Box>

            <Divider sx={{ 
              my: paragraphSpacing / 5, 
              borderColor: textWhite,
              borderWidth: `${lineWeight}px`,
            }} />

            {/* Skills */}
            <Box sx={{ mb: sectionSpacing / 10 }}>
              <Typography variant="h5" fontWeight="bold" sx={{ 
                mb: 2,
                fontSize: `calc(${headingSize} * 0.9)`,
                fontFamily: font,
              }}>
                Skills
              </Typography>
              <Box component="ul" sx={{ listStyleType: 'none', p: 0 }}>
                <Box component="li" sx={{ mb: 1 }}>
                  <Typography variant="body2" sx={{ fontFamily: font }}>Adobe Creative Suite</Typography>
                </Box>
                <Box component="li" sx={{ mb: 1 }}>
                  <Typography variant="body2" sx={{ fontFamily: font }}>UI/UX Design</Typography>
                </Box>
                <Box component="li" sx={{ mb: 1 }}>
                  <Typography variant="body2" sx={{ fontFamily: font }}>Branding & Identity</Typography>
                </Box>
                <Box component="li" sx={{ mb: 1 }}>
                  <Typography variant="body2" sx={{ fontFamily: font }}>Print & Digital Media</Typography>
                </Box>
              </Box>
            </Box>

            <Divider sx={{ 
              my: paragraphSpacing / 5, 
              borderColor: textWhite,
              borderWidth: `${lineWeight}px`,
            }} />

            {/* Languages Section */}
            <Box sx={{ mb: sectionSpacing / 10 }}>
              <Typography variant="h5" fontWeight="bold" sx={{ 
                mb: 2,
                fontSize: `calc(${headingSize} * 0.9)`,
                fontFamily: font,
              }}>
                Languages
              </Typography>
              <Box component="ul" sx={{ listStyleType: 'none', p: 0 }}>
                <Box component="li" sx={{ mb: 1 }}>
                  <Typography variant="body2" sx={{ fontFamily: font }}>English - Native</Typography>
                </Box>
                <Box component="li" sx={{ mb: 1 }}>
                  <Typography variant="body2" sx={{ fontFamily: font }}>Spanish - Intermediate</Typography>
                </Box>
              </Box>
            </Box>
            
            <Divider sx={{ 
              my: paragraphSpacing / 5, 
              borderColor: textWhite,
              borderWidth: `${lineWeight}px`,
            }} />

            {/* Education */}
            <Box>
              <Typography variant="h5" fontWeight="bold" sx={{ 
                mb: 2,
                fontSize: `calc(${headingSize} * 0.9)`,
                fontFamily: font,
              }}>
                Education
              </Typography>
              <Typography variant="subtitle1" fontWeight="bold" color={dustyBlue} sx={{ fontFamily: font }}>
                B.F.A. in Graphic Design
              </Typography>
              <Typography variant="body2" sx={{ fontFamily: font }}>
                New York School of Design
              </Typography>
              <Typography variant="body2" sx={{ fontFamily: font }}>
                Graduated: May 2018
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

// Meta information for Resume11
export const resumeMeta = {
  hasPhoto: true,
  columns: 2,
};

export default Resume11;

