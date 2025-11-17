import React from 'react';
import { Container, Grid, Box, Typography, List, ListItem, Divider, Chip } from '@mui/material';
import { styled } from '@mui/system';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';

// Custom styled components for consistent design
const SectionHeader = styled(Typography)(({ theme, color }) => ({
  fontFamily: 'serif',
  fontWeight: 'bold',
  color: color || '#2c3e50',
  textTransform: 'uppercase',
  position: 'relative',
  paddingBottom: '8px',
  '&::after': {
    content: '""',
    position: 'absolute',
    left: 0,
    bottom: 0,
    width: '50px',
    height: '3px',
    backgroundColor: theme?.palette?.primary?.main || '#3498db',
    borderRadius: '5px',
  },
}));

const ContactInfo = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: '4px',
  '& .MuiSvgIcon-root': {
    fontSize: '1rem',
    marginRight: '8px',
    color: theme?.palette?.primary?.main || '#3498db',
  },
}));

const BulletPoint = styled('span')(({ color }) => ({
  marginRight: '8px',
  color: color || '#34495e',
}));

const Resume18 = ({
  color = '#2c3e50',
  nameColor = '#2c3e50',
  sidebarBackground = '#f8f9fa',
  headerBackground = '#fff',
  font = 'Arial, sans-serif',
  fontSize = '14px',
  fontStyle = 'normal',
  headingSize = '24px',
  sectionSpacing = 25,
  paragraphSpacing = 10,
  lineSpacing = 20,
  topBottomMargin = 30,
  sideMargins = 20,
  paragraphIndent = 0,
  lineWeight = 1,
  pageSize = 'A4',
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
    <Container sx={{ 
      width: pageSize === "A4" ? "210mm" : "216mm",
      minHeight: pageSize === "A4" ? "297mm" : "279mm",
      p: sideMargins / 5, 
      backgroundColor: palette.header, 
      boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
      border: `${lineWeight}px solid ${palette.accentColor}`,
      my: topBottomMargin / 10,
      fontFamily: font,
      fontSize: fontSize,
      fontStyle: fontStyle,
      lineHeight: `${lineSpacing}px`,
    }}>
      {/* Header Section */}
      <Box sx={{ 
        p: 4, 
        mb: 4, 
        borderBottom: `${lineWeight}px solid ${palette.accentColor}`, 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        backgroundColor: palette.sidebarBackground
      }}>
        <Box>
          <Typography variant="h2" sx={{ 
            fontWeight: 'bold', 
            color: palette.nameColor,
            fontSize: `calc(${headingSize} * 1.8)`,
            fontFamily: font,
          }}>
            DONNA STROUPE
          </Typography>
          <Typography variant="h5" sx={{ 
            color: palette.lightText, 
            mt: 1,
            fontSize: `calc(${headingSize} * 0.8)`,
            fontFamily: font,
          }}>
            Sales Representative
          </Typography>
        </Box>
        <Box sx={{ textAlign: 'right' }}>
          <ContactInfo>
            <EmailIcon sx={{ color: palette.accentColor }} />
            <Typography variant="body2" sx={{ 
              color: palette.textColor,
              fontFamily: font,
            }}>
              hello@email.com
            </Typography>
          </ContactInfo>
          <ContactInfo>
            <PhoneIcon sx={{ color: palette.accentColor }} />
            <Typography variant="body2" sx={{ 
              color: palette.textColor,
              fontFamily: font,
            }}>
              +1 456-789-0123
            </Typography>
          </ContactInfo>
          <ContactInfo>
            <LocationOnIcon sx={{ color: palette.accentColor }} />
            <Typography variant="body2" sx={{ 
              color: palette.textColor,
              fontFamily: font,
            }}>
              Anywhere St, Anytown
            </Typography>
          </ContactInfo>
        </Box>
      </Box>

      {/* Main Content Grid */}
      <Grid container spacing={4}>
        {/* Left Column (Summary, Skills) */}
        <Grid item xs={12} md={4}>
          <Box sx={{ mb: sectionSpacing / 10 }}>
            <SectionHeader color={palette.accentColor} sx={{ fontFamily: font }}>
              ABOUT ME
            </SectionHeader>
            <Typography variant="body1" sx={{ 
              mt: 2, 
              color: palette.textColor,
              fontFamily: font,
              textIndent: `${paragraphIndent}px`,
            }}>
              I am a Sales Representative with extensive experience in the fast-moving consumer goods industry. I am a professional who initiates and manages relationships with clients, who serves as their point of contact, and I am adept at following up with leads.
            </Typography>
          </Box>
          
          <Box sx={{ mb: sectionSpacing / 10 }}>
            <SectionHeader color={palette.accentColor} sx={{ fontFamily: font }}>
              SKILLS
            </SectionHeader>
            <Box sx={{ mt: 2 }}>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                <Chip label="Fast-moving consumer goods" variant="outlined" sx={{ 
                  borderColor: palette.accentColor, 
                  color: palette.accentColor,
                  fontFamily: font,
                }} />
                <Chip label="Packaged consumer goods sales" variant="outlined" sx={{ 
                  borderColor: palette.accentColor, 
                  color: palette.accentColor,
                  fontFamily: font,
                }} />
                <Chip label="Corporate sales account management" variant="outlined" sx={{ 
                  borderColor: palette.accentColor, 
                  color: palette.accentColor,
                  fontFamily: font,
                }} />
             
              </Box>
            </Box>
          </Box>

          <Box sx={{ mb: sectionSpacing / 10 }}>
            <SectionHeader color={palette.accentColor} sx={{ fontFamily: font }}>
              LANGUAGES
            </SectionHeader>
            <Box sx={{ mt: 2 }}>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                <Chip label="English" variant="outlined" sx={{ 
                  borderColor: palette.accentColor, 
                  color: palette.accentColor,
                  fontFamily: font,
                }} />
                <Chip label="French" variant="outlined" sx={{ 
                  borderColor: palette.accentColor, 
                  color: palette.accentColor,
                  fontFamily: font,
                }} />
              </Box>
            </Box>
          </Box>
        </Grid>

        {/* Right Column (Experience, Education) */}
        <Grid item xs={12} md={8}>
          <Box sx={{ mb: sectionSpacing / 10 }}>
            <SectionHeader color={palette.accentColor} sx={{ fontFamily: font }}>
              WORK EXPERIENCE
            </SectionHeader>
            
            <Box sx={{ mt: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <Typography variant="h6" sx={{ 
                  fontWeight: 'bold', 
                  color: palette.textColor,
                  fontFamily: font,
                }}>
                  Consumer Goods Seller
                </Typography>
                <Typography variant="body2" sx={{ 
                  fontStyle: 'italic', 
                  color: palette.lightText,
                  fontFamily: font,
                }}>
                  Aug 2018 - Present
                </Typography>
              </Box>
              <Typography variant="subtitle1" sx={{ 
                color: palette.accentColor, 
                mb: 1,
                fontFamily: font,
              }}>
                Impressive Industries
              </Typography>
              <List disablePadding>
                <ListItem sx={{ px: 0 }}>
                  <BulletPoint color={palette.accentColor}>•</BulletPoint>
                  <Typography variant="body2" sx={{ 
                    fontFamily: font,
                    textIndent: `${paragraphIndent}px`,
                  }}>
                    Offer consumer goods packages to corporate and clients
                  </Typography>
                </ListItem>
                <ListItem sx={{ px: 0 }}>
                  <BulletPoint color={palette.accentColor}>•</BulletPoint>
                  <Typography variant="body2" sx={{ 
                    fontFamily: font,
                    textIndent: `${paragraphIndent}px`,
                  }}>
                    Meet with clients every quarter to update or renew services
                  </Typography>
                </ListItem>
              </List>
            </Box>
            
         
          </Box>
          
          <Box sx={{ mb: sectionSpacing / 10 }}>
            <SectionHeader color={palette.accentColor} sx={{ fontFamily: font }}>
              EDUCATION
            </SectionHeader>
            <Box sx={{ mt: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <Typography variant="h6" sx={{ 
                  fontWeight: 'bold', 
                  color: palette.textColor,
                  fontFamily: font,
                }}>
                  B.A. Sales and Commerce
                </Typography>
                <Typography variant="body2" sx={{ 
                  fontStyle: 'italic', 
                  color: palette.lightText,
                  fontFamily: font,
                }}>
                  2019 - 2024
                </Typography>
              </Box>
              <Typography variant="subtitle1" sx={{ 
                color: palette.accentColor,
                fontFamily: font,
              }}>
                Western University
              </Typography>
            </Box>
          </Box>

          <Box>
            <SectionHeader color={palette.accentColor} sx={{ fontFamily: font }}>
              REFERENCES
            </SectionHeader>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1" fontWeight="bold" sx={{ fontFamily: font }}>
                  Estelle Denny
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontFamily: font }}>
                  Associate Director, COO
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontFamily: font }}>
                  estelledenny@gmail.com
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
                  harperrusso@gmail.com
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

// Meta information for the resume
export const resumeMeta = {
  hasPhoto: false,
  columns: 2,
  colorOptions: [
    { value: '#2c3e50', label: 'Dark Blue' },
    { value: '#3498db', label: 'Blue' },
    { value: '#e74c3c', label: 'Red' },
    { value: '#2ecc71', label: 'Green' },
    { value: '#9b59b6', label: 'Purple' },
    { value: '#f39c12', label: 'Orange' }
  ],
  nameColorOptions: [
    { value: '#2c3e50', label: 'Dark Blue' },
    { value: '#34495e', label: 'Dark Gray' },
    { value: '#000000', label: 'Black' },
    { value: '#2c3e50', label: 'Navy' },
    { value: '#c0392b', label: 'Dark Red' }
  ],
  sidebarBackgroundOptions: [
    { value: '#f8f9fa', label: 'Light Gray' },
    { value: '#e6f3f9ff', label: 'Light Blue' },
    { value: '#f0f8e6ff', label: 'Light Green' },
    { value: '#f9e6f3ff', label: 'Light Pink' },
    { value: '#e6e6f9ff', label: 'Light Lavender' },
    { value: '#f9f3e6ff', label: 'Light Beige' }
  ],
  headerBackgroundOptions: [
    { value: '#fff', label: 'White' },
    { value: '#f8f9fa', label: 'Light Gray' },
    { value: '#e3f2fd', label: 'Very Light Blue' },
    { value: '#f3e5f5', label: 'Very Light Purple' },
    { value: '#e8f5e9', label: 'Very Light Green' }
  ],
  experienceLevel: ["No Experience", "Less than 3 years", "3-5 Years"]
};

export default Resume18;
{/*import React from 'react';
import { Container, Grid, Box, Typography, List, ListItem, Divider, Chip } from '@mui/material';
import { styled } from '@mui/system';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';

// Custom styled components for consistent design
const SectionHeader = styled(Typography)(({ theme, color }) => ({
  fontFamily: 'serif',
  fontWeight: 'bold',
  color: color || '#2c3e50',
  textTransform: 'uppercase',
  position: 'relative',
  paddingBottom: '8px',
  '&::after': {
    content: '""',
    position: 'absolute',
    left: 0,
    bottom: 0,
    width: '50px',
    height: '3px',
    backgroundColor: theme?.palette?.primary?.main || '#3498db',
    borderRadius: '5px',
  },
}));

const ContactInfo = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: '4px',
  '& .MuiSvgIcon-root': {
    fontSize: '1rem',
    marginRight: '8px',
    color: theme?.palette?.primary?.main || '#3498db',
  },
}));

const BulletPoint = styled('span')(({ color }) => ({
  marginRight: '8px',
  color: color || '#34495e',
}));

const Resume18 = ({
  color = '#2c3e50',
  nameColor = '#2c3e50',
  sidebarBackground = '#f8f9fa',
  headerBackground = '#fff'
}) => {
  return (
    <Container  sx={{         width: "210mm",

      p: 2, 
      backgroundColor: headerBackground, 
      boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
      border: `2px solid ${color}`
    }}>
      <Box sx={{ 
        p: 4, 
        mb: 4, 
        borderBottom: `2px solid ${color}`, 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        backgroundColor: sidebarBackground
      }}>
        <Box>
          <Typography variant="h2" sx={{ fontWeight: 'bold', color: nameColor }}>
            JANE DOE
          </Typography>
          <Typography variant="h5" sx={{ color: '#7f8c8d', mt: 1 }}>
            Senior Software Engineer
          </Typography>
        </Box>
        <Box sx={{ textAlign: 'right' }}>
          <ContactInfo>
            <EmailIcon />
            <Typography variant="body2" sx={{ color: '#34495e' }}>jane.doe@example.com</Typography>
          </ContactInfo>
          <ContactInfo>
            <PhoneIcon />
            <Typography variant="body2" sx={{ color: '#34495e' }}>+1 (555) 123-4567</Typography>
          </ContactInfo>
          <ContactInfo>
            <LinkedInIcon />
            <Typography variant="body2" sx={{ color: '#34495e' }}>linkedin.com/in/janedoe</Typography>
          </ContactInfo>
          <ContactInfo>
            <GitHubIcon />
            <Typography variant="body2" sx={{ color: '#34495e' }}>github.com/janedoe</Typography>
          </ContactInfo>
        </Box>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Box sx={{ mb: 4 }}>
            <SectionHeader color={color}>SUMMARY</SectionHeader>
            <Typography variant="body1" sx={{ mt: 2, color: '#34495e' }}>
              Results-oriented Software Engineer with over 8 years of experience in developing and deploying scalable web applications. Proficient in full-stack development, cloud services, and agile methodologies. Proven ability to lead projects from concept to completion, delivering high-quality code and innovative solutions.
            </Typography>
          </Box>
          
          <Box sx={{ mb: 4 }}>
            <SectionHeader color={color}>SKILLS</SectionHeader>
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" sx={{ fontWeight: 'bold', color: color, mb: 1 }}>Programming Languages:</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                <Chip label="JavaScript" variant="outlined" sx={{ borderColor: color, color: color }} />
                <Chip label="Python" variant="outlined" sx={{ borderColor: color, color: color }} />
                <Chip label="Java" variant="outlined" sx={{ borderColor: color, color: color }} />
                <Chip label="TypeScript" variant="outlined" sx={{ borderColor: color, color: color }} />
              </Box>

              <Typography variant="body2" sx={{ fontWeight: 'bold', color: color, mt: 2, mb: 1 }}>Frameworks & Libraries:</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                <Chip label="React" variant="outlined" sx={{ borderColor: color, color: color }} />
                <Chip label="Node.js" variant="outlined" sx={{ borderColor: color, color: color }} />
                <Chip label="Django" variant="outlined" sx={{ borderColor: color, color: color }} />
                <Chip label="Spring Boot" variant="outlined" sx={{ borderColor: color, color: color }} />
                <Chip label="MUI" variant="outlined" sx={{ borderColor: color, color: color }} />
              </Box>

              <Typography variant="body2" sx={{ fontWeight: 'bold', color: color, mt: 2, mb: 1 }}>Tools & Cloud:</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                <Chip label="AWS" variant="outlined" sx={{ borderColor: color, color: color }} />
                <Chip label="Docker" variant="outlined" sx={{ borderColor: color, color: color }} />
                <Chip label="Kubernetes" variant="outlined" sx={{ borderColor: color, color: color }} />
                <Chip label="Git" variant="outlined" sx={{ borderColor: color, color: color }} />
              </Box>
            </Box>
          </Box>
        </Grid>

        <Grid item xs={12} md={8}>
          <Box sx={{ mb: 4 }}>
            <SectionHeader color={color}>PROFESSIONAL EXPERIENCE</SectionHeader>
            
            <Box sx={{ mt: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#34495e' }}>Senior Software Engineer</Typography>
                <Typography variant="body2" sx={{ fontStyle: 'italic', color: '#7f8c8d' }}>Jan 2020 - Present</Typography>
              </Box>
              <Typography variant="subtitle1" sx={{ color: color, mb: 1 }}>Tech Solutions Inc. - New York, NY</Typography>
              <List disablePadding>
                <ListItem><BulletPoint color={color}>•</BulletPoint> Led a team of 5 engineers to develop a microservices-based e-commerce platform, improving performance by 30%.</ListItem>
                <ListItem><BulletPoint color={color}>•</BulletPoint> Architected and implemented a new API gateway using Node.js, reducing latency by 25%.</ListItem>
                <ListItem><BulletPoint color={color}>•</BulletPoint> Mentored junior developers, conducting code reviews and fostering a collaborative team environment.</ListItem>
              </List>
            </Box>
            
            <Divider sx={{ my: 3, borderColor: color }} />
            
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#34495e' }}>Software Engineer</Typography>
                <Typography variant="body2" sx={{ fontStyle: 'italic', color: '#7f8c8d' }}>Aug 2017 - Dec 2019</Typography>
              </Box>
              <Typography variant="subtitle1" sx={{ color: color, mb: 1 }}>Innovate Systems - San Francisco, CA</Typography>
              <List disablePadding>
                <ListItem><BulletPoint color={color}>•</BulletPoint> Developed and maintained a client-facing dashboard using React, resulting in a 15% increase in user engagement.</ListItem>
                <ListItem><BulletPoint color={color}>•</BulletPoint> Contributed to backend development using Python and Django, implementing RESTful APIs for new features.</ListItem>
              </List>
            </Box>
          </Box>
          
          <Box>
            <SectionHeader color={color}>EDUCATION</SectionHeader>
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#34495e' }}>Stanford University</Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="subtitle1" sx={{ color: color }}>Master of Science in Computer Science</Typography>
                <Typography variant="body2" sx={{ fontStyle: 'italic', color: '#7f8c8d' }}>2017</Typography>
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#34495e', mt: 2 }}>University of California, Berkeley</Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="subtitle1" sx={{ color: color }}>Bachelor of Science in Computer Engineering</Typography>
                <Typography variant="body2" sx={{ fontStyle: 'italic', color: '#7f8c8d' }}>2015</Typography>
              </Box>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

// Add metadata for filtering
export const resumeMeta = {
  hasPhoto: false,
  columns: 1,
  experienceLevel: ["3-5 Years", "5-10 Years", "10+ Years"]
};

export default Resume18;
{/*import React from 'react';
import { Container, Grid, Box, Typography, List, ListItem, Divider, IconButton, Chip } from '@mui/material';
import { styled } from '@mui/system';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';

// Custom styled components for consistent design
const SectionHeader = styled(Typography)({
  fontFamily: 'serif',
  fontWeight: 'bold',
  color: '#2c3e50',
  textTransform: 'uppercase',
  position: 'relative',
  paddingBottom: '8px',
  '&::after': {
    content: '""',
    position: 'absolute',
    left: 0,
    bottom: 0,
    width: '50px',
    height: '3px',
    backgroundColor: '#3498db',
    borderRadius: '5px',
  },
});

const ContactInfo = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  marginBottom: '4px',
  '& .MuiSvgIcon-root': {
    fontSize: '1rem',
    marginRight: '8px',
    color: '#3498db',
  },
});

const BulletPoint = styled('span')({
  marginRight: '8px',
  color: '#34495e',
});

const Resume = () => {
  return (
    <Container maxWidth="md" sx={{ my: 4, p: 4, backgroundColor: '#fff', boxShadow: '0 8px 16px rgba(0,0,0,0.1)' }}>
      <Box sx={{ p: 4, mb: 4, borderBottom: '2px solid #3498db', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h2" sx={{ fontWeight: 'bold', color: '#2c3e50' }}>
            JANE DOE
          </Typography>
          <Typography variant="h5" sx={{ color: '#7f8c8d', mt: 1 }}>
            Senior Software Engineer
          </Typography>
        </Box>
        <Box sx={{ textAlign: 'right' }}>
          <ContactInfo>
            <EmailIcon />
            <Typography variant="body2" sx={{ color: '#34495e' }}>jane.doe@example.com</Typography>
          </ContactInfo>
          <ContactInfo>
            <PhoneIcon />
            <Typography variant="body2" sx={{ color: '#34495e' }}>+1 (555) 123-4567</Typography>
          </ContactInfo>
          <ContactInfo>
            <LinkedInIcon />
            <Typography variant="body2" sx={{ color: '#34495e' }}>linkedin.com/in/janedoe</Typography>
          </ContactInfo>
          <ContactInfo>
            <GitHubIcon />
            <Typography variant="body2" sx={{ color: '#34495e' }}>github.com/janedoe</Typography>
          </ContactInfo>
        </Box>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Box sx={{ mb: 4 }}>
            <SectionHeader>SUMMARY</SectionHeader>
            <Typography variant="body1" sx={{ mt: 2, color: '#34495e' }}>
              Results-oriented Software Engineer with over 8 years of experience in developing and deploying scalable web applications. Proficient in full-stack development, cloud services, and agile methodologies. Proven ability to lead projects from concept to completion, delivering high-quality code and innovative solutions.
            </Typography>
          </Box>
          
          <Box sx={{ mb: 4 }}>
            <SectionHeader>SKILLS</SectionHeader>
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#2c3e50', mb: 1 }}>Programming Languages:</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                <Chip label="JavaScript" variant="outlined" />
                <Chip label="Python" variant="outlined" />
                <Chip label="Java" variant="outlined" />
                <Chip label="TypeScript" variant="outlined" />
              </Box>

              <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#2c3e50', mt: 2, mb: 1 }}>Frameworks & Libraries:</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                <Chip label="React" variant="outlined" />
                <Chip label="Node.js" variant="outlined" />
                <Chip label="Django" variant="outlined" />
                <Chip label="Spring Boot" variant="outlined" />
                <Chip label="MUI" variant="outlined" />
              </Box>

              <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#2c3e50', mt: 2, mb: 1 }}>Tools & Cloud:</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                <Chip label="AWS" variant="outlined" />
                <Chip label="Docker" variant="outlined" />
                <Chip label="Kubernetes" variant="outlined" />
                <Chip label="Git" variant="outlined" />
              </Box>
            </Box>
          </Box>
        </Grid>

        <Grid item xs={12} md={8}>
          <Box sx={{ mb: 4 }}>
            <SectionHeader>PROFESSIONAL EXPERIENCE</SectionHeader>
            
            <Box sx={{ mt: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#34495e' }}>Senior Software Engineer</Typography>
                <Typography variant="body2" sx={{ fontStyle: 'italic', color: '#7f8c8d' }}>Jan 2020 - Present</Typography>
              </Box>
              <Typography variant="subtitle1" sx={{ color: '#2c3e50', mb: 1 }}>Tech Solutions Inc. - New York, NY</Typography>
              <List disablePadding>
                <ListItem><BulletPoint>•</BulletPoint> Led a team of 5 engineers to develop a microservices-based e-commerce platform, improving performance by 30%.</ListItem>
                <ListItem><BulletPoint>•</BulletPoint> Architected and implemented a new API gateway using Node.js, reducing latency by 25%.</ListItem>
                <ListItem><BulletPoint>•</BulletPoint> Mentored junior developers, conducting code reviews and fostering a collaborative team environment.</ListItem>
              </List>
            </Box>
            
            <Divider sx={{ my: 3 }} />
            
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#34495e' }}>Software Engineer</Typography>
                <Typography variant="body2" sx={{ fontStyle: 'italic', color: '#7f8c8d' }}>Aug 2017 - Dec 2019</Typography>
              </Box>
              <Typography variant="subtitle1" sx={{ color: '#2c3e50', mb: 1 }}>Innovate Systems - San Francisco, CA</Typography>
              <List disablePadding>
                <ListItem><BulletPoint>•</BulletPoint> Developed and maintained a client-facing dashboard using React, resulting in a 15% increase in user engagement.</ListItem>
                <ListItem><BulletPoint>•</BulletPoint> Contributed to backend development using Python and Django, implementing RESTful APIs for new features.</ListItem>
              </List>
            </Box>
          </Box>
          
          <Box>
            <SectionHeader>EDUCATION</SectionHeader>
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#34495e' }}>Stanford University</Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="subtitle1" sx={{ color: '#2c3e50' }}>Master of Science in Computer Science</Typography>
                <Typography variant="body2" sx={{ fontStyle: 'italic', color: '#7f8c8d' }}>2017</Typography>
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#34495e', mt: 2 }}>University of California, Berkeley</Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="subtitle1" sx={{ color: '#2c3e50' }}>Bachelor of Science in Computer Engineering</Typography>
                <Typography variant="body2" sx={{ fontStyle: 'italic', color: '#7f8c8d' }}>2015</Typography>
              </Box>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Resume;*/}