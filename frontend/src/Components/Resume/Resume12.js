import React from 'react';
import {
  Container,
  Paper,
  Box,
  Typography,
  Divider,
} from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

const Resume12 = ({ 
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
  const dustyBlue = primaryColor; // Changed to use the theme color
  const textBlack = '#333333';

  return (
    <Container sx={{ 
      my: topBottomMargin / 10, 
      width: pageSize === "A4" ? "210mm" : "216mm",
    }}>
      <Paper elevation={3} sx={{ 
        p: sideMargins / 3, 
        borderRadius: 2,
        fontFamily: font,
        fontSize: fontSize,
        fontStyle: fontStyle,
        lineHeight: `${lineSpacing}px`,
        minHeight: pageSize === "A4" ? "297mm" : "279mm",
      }}>
        {/* Header Section */}
        <Box sx={{ textAlign: 'center', mb: sectionSpacing / 10 }}>
          <Typography variant="h3" component="h1" fontWeight="bold" sx={{ 
            color: charcoalGray,
            fontSize: `calc(${headingSize} * 1.8)`,
            fontFamily: font,
          }}>
            JOHN DOE
          </Typography>
          <Typography variant="h6" color={dustyBlue} sx={{ 
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

        {/* Contact Info */}
        <Box sx={{ 
          mb: sectionSpacing / 10, 
          display: 'flex', 
          justifyContent: 'center', 
          flexWrap: 'wrap', 
          gap: 3 
        }}>
          <Box display="flex" alignItems="center">
            <EmailIcon sx={{ mr: 1, color: dustyBlue }} />
            <Typography variant="body1" color={textBlack} sx={{ fontFamily: font }}>
              johndoe@email.com
            </Typography>
          </Box>
          <Box display="flex" alignItems="center">
            <PhoneIcon sx={{ mr: 1, color: dustyBlue }} />
            <Typography variant="body1" color={textBlack} sx={{ fontFamily: font }}>
              +1 (555) 123-4567
            </Typography>
          </Box>
          <Box display="flex" alignItems="center">
            <LocationOnIcon sx={{ mr: 1, color: dustyBlue }} />
            <Typography variant="body1" color={textBlack} sx={{ fontFamily: font }}>
              New York, NY
            </Typography>
          </Box>
          <Box display="flex" alignItems="center">
            <LinkedInIcon sx={{ mr: 1, color: dustyBlue }} />
            <Typography variant="body1" color={textBlack} sx={{ fontFamily: font }}>
              linkedin.com/in/johndoe
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ 
          my: sectionSpacing / 10, 
          borderWidth: `${lineWeight}px`,
        }} />
        
        {/* About Me */}
        <Box sx={{ mb: sectionSpacing / 10 }}>
          <Typography variant="h5" fontWeight="bold" color={charcoalGray} sx={{ 
            mb: 2, 
            borderBottom: `${lineWeight * 2}px solid ${dustyBlue}`, 
            pb: 1, 
            display: 'inline-block',
            fontSize: headingSize,
            fontFamily: font,
          }}>
            About Me
          </Typography>
          <Typography variant="body1" color={textBlack} sx={{ 
            fontFamily: font,
            textIndent: `${paragraphIndent}px`,
          }}>
            A creative and results-driven graphic designer with over 7 years of experience in visual branding and marketing. Passionate about creating designs that solve business problems and delight customers. Seeking to leverage skills in design leadership to contribute to a dynamic creative team.
          </Typography>
        </Box>

        {/* Experience Section */}
        <Box sx={{ mb: sectionSpacing / 10 }}>
          <Typography variant="h5" fontWeight="bold" color={charcoalGray} sx={{ 
            mb: 2, 
            borderBottom: `${lineWeight * 2}px solid ${dustyBlue}`, 
            pb: 1, 
            display: 'inline-block',
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
            <Typography variant="body2" color={textBlack} sx={{ 
              fontFamily: font,
              textIndent: `${paragraphIndent}px`,
            }}>
              • Led a team of 5 designers on major branding projects, increasing client satisfaction by 25%.
            </Typography>
            <Typography variant="body2" color={textBlack} sx={{ 
              fontFamily: font,
              textIndent: `${paragraphIndent}px`,
            }}>
              • Developed and executed design strategies that resulted in a 15% growth in new business.
            </Typography>
          </Box>

      
        </Box>
        
        {/* Education */}
        <Box sx={{ mb: sectionSpacing / 10 }}>
          <Typography variant="h5" fontWeight="bold" color={charcoalGray} sx={{ 
            mb: 2, 
            borderBottom: `${lineWeight * 2}px solid ${dustyBlue}`, 
            pb: 1, 
            display: 'inline-block',
            fontSize: headingSize,
            fontFamily: font,
          }}>
            Education
          </Typography>
          <Typography variant="h6" fontWeight="bold" sx={{ fontFamily: font }}>
            B.F.A. in Graphic Design
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ fontFamily: font }}>
            New York School of Design
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ fontFamily: font }}>
            Graduated: May 2018
          </Typography>
        </Box>
        
        {/* Skills Section */}
        <Box sx={{ mb: sectionSpacing / 10 }}>
          <Typography variant="h5" fontWeight="bold" color={charcoalGray} sx={{ 
            mb: 2, 
            borderBottom: `${lineWeight * 2}px solid ${dustyBlue}`, 
            pb: 1, 
            display: 'inline-block',
            fontSize: headingSize,
            fontFamily: font,
          }}>
            Skills
          </Typography>
          <Box component="ul" sx={{ pl: 2, mt: 0 }}>
            <Typography component="li" variant="body1" color={textBlack} sx={{ fontFamily: font }}>
              Adobe Creative Suite
            </Typography>
            <Typography component="li" variant="body1" color={textBlack} sx={{ fontFamily: font }}>
              UI/UX Design
            </Typography>
        
          </Box>
        </Box>

        {/* Languages */}
        <Box>
          <Typography variant="h5" fontWeight="bold" color={charcoalGray} sx={{ 
            mb: 2, 
            borderBottom: `${lineWeight * 2}px solid ${dustyBlue}`, 
            pb: 1, 
            display: 'inline-block',
            fontSize: headingSize,
            fontFamily: font,
          }}>
            Languages
          </Typography>
          <Box component="ul" sx={{ pl: 2, mt: 0 }}>
            <Typography component="li" variant="body1" color={textBlack} sx={{ fontFamily: font }}>
              English - Native
            </Typography>
            <Typography component="li" variant="body1" color={textBlack} sx={{ fontFamily: font }}>
              Spanish - Intermediate
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

// Meta information for Resume12
export const resumeMeta = {
  hasPhoto: false,
  columns: 1,
};

export default Resume12;
{/*// Resume12.js
import React from 'react';
import {
  Container,
  Paper,
  Box,
  Typography,
  Divider,
} from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

const Resume12 = ({ color = '#36454F' }) => {
  // Define the colors for the template with customizable main color
  const charcoalGray = color;
  const dustyBlue = color; // Changed to use the theme color
  const textBlack = '#333333';

  return (
    <Container  sx={{ my: 4 , width: "210mm",}}>
      <Paper elevation={3} sx={{ p: 6, borderRadius: 2 }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h3" component="h1" fontWeight="bold" sx={{ color: charcoalGray }}>
            JOHN DOE
          </Typography>
          <Typography variant="h6" color={dustyBlue} sx={{ letterSpacing: 2 }}>
            SENIOR GRAPHIC DESIGNER
          </Typography>
        </Box>

        <Divider sx={{ my: 4 }} />

        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 3 }}>
          <Box display="flex" alignItems="center">
            <EmailIcon sx={{ mr: 1, color: dustyBlue }} />
            <Typography variant="body1" color={textBlack}>johndoe@email.com</Typography>
          </Box>
          <Box display="flex" alignItems="center">
            <PhoneIcon sx={{ mr: 1, color: dustyBlue }} />
            <Typography variant="body1" color={textBlack}>+1 (555) 123-4567</Typography>
          </Box>
          <Box display="flex" alignItems="center">
            <LocationOnIcon sx={{ mr: 1, color: dustyBlue }} />
            <Typography variant="body1" color={textBlack}>New York, NY</Typography>
          </Box>
          <Box display="flex" alignItems="center">
            <LinkedInIcon sx={{ mr: 1, color: dustyBlue }} />
            <Typography variant="body1" color={textBlack}>linkedin.com/in/johndoe</Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 4 }} />
        
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" fontWeight="bold" color={charcoalGray} sx={{ mb: 2, borderBottom: `2px solid ${dustyBlue}`, pb: 1, display: 'inline-block' }}>
            About Me
          </Typography>
          <Typography variant="body1" color={textBlack}>
            A creative and results-driven graphic designer with over 7 years of experience in visual branding and marketing. Passionate about creating designs that solve business problems and delight customers. Seeking to leverage skills in design leadership to contribute to a dynamic creative team.
          </Typography>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" fontWeight="bold" color={charcoalGray} sx={{ mb: 2, borderBottom: `2px solid ${dustyBlue}`, pb: 1, display: 'inline-block' }}>
            Experience
          </Typography>

          <Box sx={{ mb: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h6" fontWeight="bold">
                Lead Designer
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Jan 2022 - Present
              </Typography>
            </Box>
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
              Creative Solutions Inc. | New York, NY
            </Typography>
            <Typography variant="body2" color={textBlack}>
              • Led a team of 5 designers on major branding projects, increasing client satisfaction by 25%.
            </Typography>
            <Typography variant="body2" color={textBlack}>
              • Developed and executed design strategies that resulted in a 15% growth in new business.
            </Typography>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h6" fontWeight="bold">
                Graphic Designer
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Jul 2018 - Dec 2021
              </Typography>
            </Box>
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
              Innovative Marketers | Boston, MA
            </Typography>
            <Typography variant="body2" color={textBlack}>
              • Designed compelling visuals for digital and print campaigns, reaching over 500,000 customers.
            </Typography>
            <Typography variant="body2" color={textBlack}>
              • Collaborated with marketing and product teams to ensure brand consistency.
            </Typography>
          </Box>
        </Box>
        
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" fontWeight="bold" color={charcoalGray} sx={{ mb: 2, borderBottom: `2px solid ${dustyBlue}`, pb: 1, display: 'inline-block' }}>
            Education
          </Typography>
          <Typography variant="h6" fontWeight="bold">
            B.F.A. in Graphic Design
          </Typography>
          <Typography variant="body2" color="text.secondary">
            New York School of Design
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Graduated: May 2018
          </Typography>
        </Box>
        
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" fontWeight="bold" color={charcoalGray} sx={{ mb: 2, borderBottom: `2px solid ${dustyBlue}`, pb: 1, display: 'inline-block' }}>
            Skills
          </Typography>
          <Box component="ul" sx={{ pl: 2, mt: 0 }}>
            <Typography component="li" variant="body1" color={textBlack}>Adobe Creative Suite</Typography>
            <Typography component="li" variant="body1" color={textBlack}>UI/UX Design</Typography>
            <Typography component="li" variant="body1" color={textBlack}>Branding & Identity</Typography>
            <Typography component="li" variant="body1" color={textBlack}>Print & Digital Media</Typography>
          </Box>
        </Box>

        <Box>
          <Typography variant="h5" fontWeight="bold" color={charcoalGray} sx={{ mb: 2, borderBottom: `2px solid ${dustyBlue}`, pb: 1, display: 'inline-block' }}>
            Languages
          </Typography>
          <Box component="ul" sx={{ pl: 2, mt: 0 }}>
            <Typography component="li" variant="body1" color={textBlack}>English - Native</Typography>
            <Typography component="li" variant="body1" color={textBlack}>Spanish - Intermediate</Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

// Meta information for Resume12
export const resumeMeta = {
  hasPhoto: false,
  columns: 1,
};

export default Resume12;*/}
{/*import React from 'react';
import {
  Container,
  Paper,
  Box,
  Typography,
  Divider,
} from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

// Define the colors for the template
const charcoalGray = '#36454F';
const dustyBlue = '#5D7B8E';
const textBlack = '#333333';

const Resume12 = () => {
  return (
    <Container maxWidth="md" sx={{ my: 4 }}>
      <Paper elevation={3} sx={{ p: 6, borderRadius: 2 }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h3" component="h1" fontWeight="bold" sx={{ color: charcoalGray }}>
            JOHN DOE
          </Typography>
          <Typography variant="h6" color={dustyBlue} sx={{ letterSpacing: 2 }}>
            SENIOR GRAPHIC DESIGNER
          </Typography>
        </Box>

        <Divider sx={{ my: 4 }} />

        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 3 }}>
          <Box display="flex" alignItems="center">
            <EmailIcon sx={{ mr: 1, color: dustyBlue }} />
            <Typography variant="body1" color={textBlack}>johndoe@email.com</Typography>
          </Box>
          <Box display="flex" alignItems="center">
            <PhoneIcon sx={{ mr: 1, color: dustyBlue }} />
            <Typography variant="body1" color={textBlack}>+1 (555) 123-4567</Typography>
          </Box>
          <Box display="flex" alignItems="center">
            <LocationOnIcon sx={{ mr: 1, color: dustyBlue }} />
            <Typography variant="body1" color={textBlack}>New York, NY</Typography>
          </Box>
          <Box display="flex" alignItems="center">
            <LinkedInIcon sx={{ mr: 1, color: dustyBlue }} />
            <Typography variant="body1" color={textBlack}>linkedin.com/in/johndoe</Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 4 }} />
        
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" fontWeight="bold" color={charcoalGray} sx={{ mb: 2, borderBottom: `2px solid ${dustyBlue}`, pb: 1, display: 'inline-block' }}>
            About Me
          </Typography>
          <Typography variant="body1" color={textBlack}>
            A creative and results-driven graphic designer with over 7 years of experience in visual branding and marketing. Passionate about creating designs that solve business problems and delight customers. Seeking to leverage skills in design leadership to contribute to a dynamic creative team.
          </Typography>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" fontWeight="bold" color={charcoalGray} sx={{ mb: 2, borderBottom: `2px solid ${dustyBlue}`, pb: 1, display: 'inline-block' }}>
            Experience
          </Typography>

          <Box sx={{ mb: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h6" fontWeight="bold">
                Lead Designer
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Jan 2022 - Present
              </Typography>
            </Box>
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
              Creative Solutions Inc. | New York, NY
            </Typography>
            <Typography variant="body2" color={textBlack}>
              • Led a team of 5 designers on major branding projects, increasing client satisfaction by 25%.
            </Typography>
            <Typography variant="body2" color={textBlack}>
              • Developed and executed design strategies that resulted in a 15% growth in new business.
            </Typography>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h6" fontWeight="bold">
                Graphic Designer
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Jul 2018 - Dec 2021
              </Typography>
            </Box>
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
              Innovative Marketers | Boston, MA
            </Typography>
            <Typography variant="body2" color={textBlack}>
              • Designed compelling visuals for digital and print campaigns, reaching over 500,000 customers.
            </Typography>
            <Typography variant="body2" color={textBlack}>
              • Collaborated with marketing and product teams to ensure brand consistency.
            </Typography>
          </Box>
        </Box>
        
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" fontWeight="bold" color={charcoalGray} sx={{ mb: 2, borderBottom: `2px solid ${dustyBlue}`, pb: 1, display: 'inline-block' }}>
            Education
          </Typography>
          <Typography variant="h6" fontWeight="bold">
            B.F.A. in Graphic Design
          </Typography>
          <Typography variant="body2" color="text.secondary">
            New York School of Design
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Graduated: May 2018
          </Typography>
        </Box>
        
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" fontWeight="bold" color={charcoalGray} sx={{ mb: 2, borderBottom: `2px solid ${dustyBlue}`, pb: 1, display: 'inline-block' }}>
            Skills
          </Typography>
          <Box component="ul" sx={{ pl: 2, mt: 0 }}>
            <Typography component="li" variant="body1" color={textBlack}>Adobe Creative Suite</Typography>
            <Typography component="li" variant="body1" color={textBlack}>UI/UX Design</Typography>
            <Typography component="li" variant="body1" color={textBlack}>Branding & Identity</Typography>
            <Typography component="li" variant="body1" color={textBlack}>Print & Digital Media</Typography>
          </Box>
        </Box>

        <Box>
          <Typography variant="h5" fontWeight="bold" color={charcoalGray} sx={{ mb: 2, borderBottom: `2px solid ${dustyBlue}`, pb: 1, display: 'inline-block' }}>
            Languages
          </Typography>
          <Box component="ul" sx={{ pl: 2, mt: 0 }}>
            <Typography component="li" variant="body1" color={textBlack}>English - Native</Typography>
            <Typography component="li" variant="body1" color={textBlack}>Spanish - Intermediate</Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default Resume12;*/}
