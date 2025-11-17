import React from 'react';
import { Grid, Box, Typography, List, ListItem, Divider, LinearProgress } from '@mui/material';
import { styled } from '@mui/system';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import HomeIcon from '@mui/icons-material/Home';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

// --- Styled Components for Theming ---

const HeaderTitle = styled(Typography)(({ color, font, fontSize }) => ({
  fontFamily: font || 'serif',
  fontWeight: 'bold',
  letterSpacing: '2px',
  color: color || '#4e342e',
  textTransform: 'uppercase',
  fontSize: fontSize || '2.5rem',
}));

const SectionHeader = styled(Typography)(({ color, font, fontSize }) => ({
  fontFamily: font || 'sans-serif',
  fontWeight: 'bold',
  color: color || '#5d4037',
  textTransform: 'uppercase',
  marginBottom: '10px',
  paddingBottom: '5px',
  borderBottom: `2px solid ${color || '#795548'}`,
  fontSize: fontSize || '1.2rem',
}));

const InfoItem = styled(Box)(({ color, font }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: '8px',
  fontFamily: font || 'Arial, sans-serif',
  '& .MuiSvgIcon-root': {
    fontSize: '1rem',
    marginRight: '10px',
    color: color || '#795548',
  },
}));

const SkillBarContainer = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  marginBottom: '8px',
});

const SkillBarText = styled(Typography)(({ font, fontSize }) => ({
  width: '120px',
  flexShrink: 0,
  fontFamily: font || 'Arial, sans-serif',
  fontSize: fontSize || '0.9rem',
}));

const BulletPoint = styled('span')(({ color }) => ({
  marginRight: '8px',
  color: color || '#5d4037',
}));

// --- Resume Component ---

const Resume19 = ({
  color = '#795548',
  nameColor = '#4e342e',
  sidebarBackground = '#f5f5f5',
  headerBackground = '#fff',
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

  // Calculate font sizes based on the fontSize prop
  const getFontSize = (multiplier = 1) => {
    const baseSize = parseInt(fontSize) || 14;
    return `${baseSize * multiplier}px`;
  };

  return (
    <Box
      sx={{
        width: pageSize === "A4" ? "210mm" : "216mm",
        minHeight: pageSize === "A4" ? "297mm" : "279mm",
        mx: "auto",
        boxShadow: 4,
        bgcolor: palette.header,
        fontFamily: font,
        fontSize: fontSize,
        fontStyle: fontStyle,
        lineHeight: `${lineSpacing}px`,
        my: topBottomMargin / 10,
        p: `${topBottomMargin / 2}px ${sideMargins / 2}px`,
        border: `${lineWeight}px solid ${palette.accentColor}`
      }}
    >
      <Grid container>
        {/* Left Sidebar */}
        <Grid item xs={12} md={4} sx={{ 
          backgroundColor: palette.sidebarBackground, 
          p: sideMargins / 5,
          width: "30%",
          boxSizing: "border-box"
        }}>
          {/* Contact Information */}
          <Box sx={{ mb: sectionSpacing / 10 }}>
            <SectionHeader color={palette.accentColor} font={font} fontSize={getFontSize(1.2)}>
              Contact
            </SectionHeader>
            <InfoItem color={palette.accentColor} font={font}>
              <PhoneIcon />
              <Typography variant="body2" sx={{ fontFamily: font, fontSize: fontSize }}>
                +1 456-789-0123
              </Typography>
            </InfoItem>
            <InfoItem color={palette.accentColor} font={font}>
              <EmailIcon />
              <Typography variant="body2" sx={{ fontFamily: font, fontSize: fontSize }}>
                hello@email.com
              </Typography>
            </InfoItem>
            <InfoItem color={palette.accentColor} font={font}>
              <HomeIcon />
              <Typography variant="body2" sx={{ fontFamily: font, fontSize: fontSize }}>
                Anywhere St, Anytown
              </Typography>
            </InfoItem>
          </Box>

          <Divider sx={{ 
            mb: sectionSpacing / 10, 
            bgcolor: '#e0e0e0',
            borderBottomWidth: lineWeight,
          }} />

          {/* Skills */}
          <Box sx={{ mb: sectionSpacing / 10 }}>
            <SectionHeader color={palette.accentColor} font={font} fontSize={getFontSize(1.2)}>
              Skills
            </SectionHeader>
            <Box>
              <SkillBarContainer>
                <SkillBarText font={font} fontSize={fontSize}>Fast-moving consumer goods</SkillBarText>
                <LinearProgress 
                  variant="determinate" 
                  value={95} 
                  sx={{ 
                    flexGrow: 1, 
                    height: 8, 
                    borderRadius: 5, 
                    backgroundColor: '#e0e0e0', 
                    '& .MuiLinearProgress-bar': { 
                      backgroundColor: palette.accentColor 
                    } 
                  }} 
                />
              </SkillBarContainer>
              <SkillBarContainer>
                <SkillBarText font={font} fontSize={fontSize}>Packaged consumer goods sales</SkillBarText>
                <LinearProgress 
                  variant="determinate" 
                  value={85} 
                  sx={{ 
                    flexGrow: 1, 
                    height: 8, 
                    borderRadius: 5, 
                    backgroundColor: '#e0e0e0', 
                    '& .MuiLinearProgress-bar': { 
                      backgroundColor: palette.accentColor 
                    } 
                  }} 
                />
              </SkillBarContainer>
              <SkillBarContainer>
                <SkillBarText font={font} fontSize={fontSize}>Corporate sales account management</SkillBarText>
                <LinearProgress 
                  variant="determinate" 
                  value={80} 
                  sx={{ 
                    flexGrow: 1, 
                    height: 8, 
                    borderRadius: 5, 
                    backgroundColor: '#e0e0e0', 
                    '& .MuiLinearProgress-bar': { 
                      backgroundColor: palette.accentColor 
                    } 
                  }} 
                />
              </SkillBarContainer>
            </Box>
          </Box>

          <Divider sx={{ 
            mb: sectionSpacing / 10, 
            bgcolor: '#e0e0e0',
            borderBottomWidth: lineWeight,
          }} />

          {/* Languages */}
          <Box>
            <SectionHeader color={palette.accentColor} font={font} fontSize={getFontSize(1.2)}>
              Languages
            </SectionHeader>
            <SkillBarContainer>
              <SkillBarText font={font} fontSize={fontSize}>English</SkillBarText>
              <LinearProgress 
                variant="determinate" 
                value={100} 
                sx={{ 
                  flexGrow: 1, 
                  height: 8, 
                  borderRadius: 5, 
                  backgroundColor: '#e0e0e0', 
                  '& .MuiLinearProgress-bar': { 
                    backgroundColor: palette.accentColor 
                  } 
                }} 
              />
            </SkillBarContainer>
            <SkillBarContainer>
              <SkillBarText font={font} fontSize={fontSize}>French</SkillBarText>
              <LinearProgress 
                variant="determinate" 
                value={75} 
                sx={{ 
                  flexGrow: 1, 
                  height: 8, 
                  borderRadius: 5, 
                  backgroundColor: '#e0e0e0', 
                  '& .MuiLinearProgress-bar': { 
                    backgroundColor: palette.accentColor 
                  } 
                }} 
              />
            </SkillBarContainer>
          </Box>
        </Grid>

        {/* Right Main Content */}
        <Grid item xs={12} md={8} sx={{ 
          p: sideMargins / 5, 
          width: "70%",
          boxSizing: "border-box"
        }}>
          {/* Main Name & Title */}
          <Box sx={{ mb: sectionSpacing / 10 }}>
            <HeaderTitle 
              color={palette.nameColor} 
              font={font}
              fontSize={getFontSize(2.5)}
              variant="h3"
            >
              DONNA STROUPE
            </HeaderTitle>
            <Typography 
              variant="h6" 
              sx={{ 
                color: palette.lightText, 
                mt: 1, 
                textTransform: 'uppercase',
                fontFamily: font,
                fontSize: getFontSize(1.2),
              }}
            >
              Sales Representative
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                mt: 2, 
                color: palette.textColor,
                fontFamily: font,
                fontSize: fontSize,
                textIndent: `${paragraphIndent}px`,
              }}
            >
              I am a Sales Representative with extensive experience in the fast-moving consumer goods industry. I am a professional who initiates and manages relationships with clients, who serves as their point of contact, and I am adept at following up with leads.
            </Typography>
          </Box>

          {/* Professional Experience */}
          <Box sx={{ mb: sectionSpacing / 10 }}>
            <SectionHeader color={palette.accentColor} font={font} fontSize={getFontSize(1.2)}>
              Work Experience
            </SectionHeader>
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 'bold', 
                    color: palette.textColor,
                    fontFamily: font,
                    fontSize: getFontSize(1.1),
                  }}
                >
                  Consumer Goods Seller
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontStyle: 'italic', 
                    color: palette.lightText,
                    fontFamily: font,
                    fontSize: fontSize,
                  }}
                >
                  Aug 2018 - Present
                </Typography>
              </Box>
              <Typography 
                variant="subtitle1" 
                sx={{ 
                  color: palette.accentColor, 
                  mb: 1,
                  fontFamily: font,
                  fontSize: fontSize,
                }}
              >
                Impressive Industries
              </Typography>
              <List disablePadding>
                <ListItem sx={{ py: 0.5, px: 0 }}>
                  <BulletPoint color={palette.accentColor}>•</BulletPoint>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      fontFamily: font,
                      fontSize: fontSize,
                      textIndent: `${paragraphIndent}px`,
                    }}
                  >
                    Offer consumer goods packages to corporate and clients
                  </Typography>
                </ListItem>
                <ListItem sx={{ py: 0.5, px: 0 }}>
                  <BulletPoint color={palette.accentColor}>•</BulletPoint>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      fontFamily: font,
                      fontSize: fontSize,
                      textIndent: `${paragraphIndent}px`,
                    }}
                  >
                    Meet with clients every quarter to update or renew services
                  </Typography>
                </ListItem>
              </List>
            </Box>

            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 'bold', 
                    color: palette.textColor,
                    fontFamily: font,
                    fontSize: getFontSize(1.1),
                  }}
                >
                  PMCG Sales Agent
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontStyle: 'italic', 
                    color: palette.lightText,
                    fontFamily: font,
                    fontSize: fontSize,
                  }}
                >
                  Jul 2016 - Aug 2018
                </Typography>
              </Box>
              <Typography 
                variant="subtitle1" 
                sx={{ 
                  color: palette.accentColor, 
                  mb: 1,
                  fontFamily: font,
                  fontSize: fontSize,
                }}
              >
                Fast-moving Industries
              </Typography>
              <List disablePadding>
                <ListItem sx={{ py: 0.5, px: 0 }}>
                  <BulletPoint color={palette.accentColor}>•</BulletPoint>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      fontFamily: font,
                      fontSize: fontSize,
                      textIndent: `${paragraphIndent}px`,
                    }}
                  >
                    Visited corporate client offices to renew latest products
                  </Typography>
                </ListItem>
                <ListItem sx={{ py: 0.5, px: 0 }}>
                  <BulletPoint color={palette.accentColor}>•</BulletPoint>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      fontFamily: font,
                      fontSize: fontSize,
                      textIndent: `${paragraphIndent}px`,
                    }}
                  >
                    Built relationships with clients to maintain sales goals and create new opportunities
                  </Typography>
                </ListItem>
              </List>
            </Box>
          </Box>

          <Divider sx={{ 
            my: sectionSpacing / 10, 
            bgcolor: '#e0e0e0',
            borderBottomWidth: lineWeight,
          }} />

          {/* Education */}
          <Box sx={{ mb: sectionSpacing / 10 }}>
            <SectionHeader color={palette.accentColor} font={font} fontSize={getFontSize(1.2)}>
              Education
            </SectionHeader>
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 'bold', 
                    color: palette.textColor,
                    fontFamily: font,
                    fontSize: getFontSize(1.1),
                  }}
                >
                  B.A. Sales and Commerce
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontStyle: 'italic', 
                    color: palette.lightText,
                    fontFamily: font,
                    fontSize: fontSize,
                  }}
                >
                  2019 - 2024
                </Typography>
              </Box>
              <Typography 
                variant="subtitle1" 
                sx={{ 
                  color: palette.accentColor,
                  fontFamily: font,
                  fontSize: fontSize,
                }}
              >
                Western University
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ 
            my: sectionSpacing / 10, 
            bgcolor: '#e0e0e0',
            borderBottomWidth: lineWeight,
          }} />

          {/* References */}
          <Box>
            <SectionHeader color={palette.accentColor} font={font} fontSize={getFontSize(1.2)}>
              References
            </SectionHeader>
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
        </Grid>
      </Grid>
    </Box>
  );
};

// Meta information for the resume
export const resumeMeta = {
  hasPhoto: false,
  columns: 2,
  colorOptions: [
    { value: '#795548', label: 'Brown' },
    { value: '#3f51b5', label: 'Indigo' },
    { value: '#2196f3', label: 'Blue' },
    { value: '#f44336', label: 'Red' },
    { value: '#4caf50', label: 'Green' },
    { value: '#ff9800', label: 'Orange' },
    { value: '#9c27b0', label: 'Purple' }
  ],
  nameColorOptions: [
    { value: '#4e342e', label: 'Dark Brown' },
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
    { value: '#fff', label: 'White' },
    { value: '#f8f9fa', label: 'Light Gray' },
    { value: '#e3f2fd', label: 'Very Light Blue' },
    { value: '#f3e5f5', label: 'Very Light Purple' },
    { value: '#e8f5e9', label: 'Very Light Green' }
  ],
  experienceLevel: ["No Experience", "Less than 3 years", "3-5 Years"]
};

export default Resume19;
{/*import React from 'react';
import { Grid, Box, Typography, List, ListItem, Divider, LinearProgress } from '@mui/material';
import { styled } from '@mui/system';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import HomeIcon from '@mui/icons-material/Home';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

// --- Styled Components for Theming ---

const HeaderTitle = styled(Typography)(({ color }) => ({
  fontFamily: 'serif',
  fontWeight: 'bold',
  letterSpacing: '2px',
  color: color || '#4e342e',
  textTransform: 'uppercase',
}));

const SectionHeader = styled(Typography)(({ color }) => ({
  fontFamily: 'sans-serif',
  fontWeight: 'bold',
  color: color || '#5d4037',
  textTransform: 'uppercase',
  marginBottom: '10px',
  paddingBottom: '5px',
  borderBottom: `2px solid ${color || '#795548'}`,
}));

const InfoItem = styled(Box)(({ color }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: '8px',
  '& .MuiSvgIcon-root': {
    fontSize: '1rem',
    marginRight: '10px',
    color: color || '#795548',
  },
}));

const SkillBarContainer = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  marginBottom: '8px',
});

const SkillBarText = styled(Typography)({
  width: '120px',
  flexShrink: 0,
  fontSize: '0.9rem',
});

const BulletPoint = styled('span')(({ color }) => ({
  marginRight: '8px',
  color: color || '#5d4037',
}));

// --- Resume Component ---

const Resume19 = ({
  color = '#795548',
  nameColor = '#4e342e',
  sidebarBackground = '#f5f5f5',
  headerBackground = '#fff'
}) => {
  return (
    <Box
      sx={{
        width: "210mm",
        minHeight: "297mm",
        m:2,
        mx: "auto",
        boxShadow: 4,
        bgcolor: headerBackground,
        fontFamily: "Arial, sans-serif",
        position: "relative",
        overflow: "hidden",
        border: `2px solid ${color}`
      }}
    >
      <Grid container>
        <Grid item xs={12} md={4} sx={{ 
          backgroundColor: sidebarBackground, 
          p: 3,
          width: "30%",
          boxSizing: "border-box"
        }}>
          <Box sx={{ mb: 3 }}>
            <SectionHeader color={color}>Contact</SectionHeader>
            <InfoItem color={color}>
              <PhoneIcon />
              <Typography variant="body2">+1 (555) 123-4567</Typography>
            </InfoItem>
            <InfoItem color={color}>
              <EmailIcon />
              <Typography variant="body2">jane.doe@example.com</Typography>
            </InfoItem>
            <InfoItem color={color}>
              <HomeIcon />
              <Typography variant="body2">New York, NY</Typography>
            </InfoItem>
            <InfoItem color={color}>
              <LinkedInIcon />
              <Typography variant="body2">linkedin.com/in/janedoe</Typography>
            </InfoItem>
          </Box>

          <Divider sx={{ mb: 3, bgcolor: '#e0e0e0' }} />

          <Box sx={{ mb: 3 }}>
            <SectionHeader color={color}>Skills</SectionHeader>
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>Programming Languages:</Typography>
              <SkillBarContainer>
                <SkillBarText>JavaScript</SkillBarText>
                <LinearProgress variant="determinate" value={95} sx={{ flexGrow: 1, height: 8, borderRadius: 5, backgroundColor: '#e0e0e0', '& .MuiLinearProgress-bar': { backgroundColor: color } }} />
              </SkillBarContainer>
              <SkillBarContainer>
                <SkillBarText>Python</SkillBarText>
                <LinearProgress variant="determinate" value={85} sx={{ flexGrow: 1, height: 8, borderRadius: 5, backgroundColor: '#e0e0e0', '& .MuiLinearProgress-bar': { backgroundColor: color } }} />
              </SkillBarContainer>
              <SkillBarContainer>
                <SkillBarText>SQL</SkillBarText>
                <LinearProgress variant="determinate" value={80} sx={{ flexGrow: 1, height: 8, borderRadius: 5, backgroundColor: '#e0e0e0', '& .MuiLinearProgress-bar': { backgroundColor: color } }} />
              </SkillBarContainer>
            </Box>
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>Frameworks & Tools:</Typography>
              <SkillBarContainer>
                <SkillBarText>React</SkillBarText>
                <LinearProgress variant="determinate" value={90} sx={{ flexGrow: 1, height: 8, borderRadius: 5, backgroundColor: '#e0e0e0', '& .MuiLinearProgress-bar': { backgroundColor: color } }} />
              </SkillBarContainer>
              <SkillBarContainer>
                <SkillBarText>Node.js</SkillBarText>
                <LinearProgress variant="determinate" value={80} sx={{ flexGrow: 1, height: 8, borderRadius: 5, backgroundColor: '#e0e0e0', '& .MuiLinearProgress-bar': { backgroundColor: color } }} />
              </SkillBarContainer>
              <SkillBarContainer>
                <SkillBarText>AWS</SkillBarText>
                <LinearProgress variant="determinate" value={75} sx={{ flexGrow: 1, height: 8, borderRadius: 5, backgroundColor: '#e0e0e0', '& .MuiLinearProgress-bar': { backgroundColor: color } }} />
              </SkillBarContainer>
            </Box>
          </Box>

          <Divider sx={{ mb: 3, bgcolor: '#e0e0e0' }} />

          <Box>
            <SectionHeader color={color}>Languages</SectionHeader>
            <SkillBarContainer>
              <SkillBarText>English</SkillBarText>
              <LinearProgress variant="determinate" value={100} sx={{ flexGrow: 1, height: 8, borderRadius: 5, backgroundColor: '#e0e0e0', '& .MuiLinearProgress-bar': { backgroundColor: color } }} />
            </SkillBarContainer>
            <SkillBarContainer>
              <SkillBarText>Spanish</SkillBarText>
              <LinearProgress variant="determinate" value={65} sx={{ flexGrow: 1, height: 8, borderRadius: 5, backgroundColor: '#e0e0e0', '& .MuiLinearProgress-bar': { backgroundColor: color } }} />
            </SkillBarContainer>
          </Box>
        </Grid>

        <Grid item xs={12} md={8} sx={{ 
          p: 3, 
          width: "70%",
          boxSizing: "border-box"
        }}>
          <Box sx={{ mb: 3 }}>
            <HeaderTitle color={nameColor} variant="h3">Jane Doe</HeaderTitle>
            <Typography variant="h6" sx={{ color: '#7f8c8d', mt: 1, textTransform: 'uppercase' }}>Senior Full-Stack Developer</Typography>
            <Typography variant="body1" sx={{ mt: 2, color: '#5d4037' }}>
              Results-oriented Software Engineer with a passion for building scalable and efficient web applications. Proven ability to deliver high-quality code and lead projects from conception to deployment.
            </Typography>
          </Box>

          <Box sx={{ mb: 3 }}>
            <SectionHeader color={color}>Professional Experience</SectionHeader>
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#5d4037' }}>Senior Software Engineer</Typography>
                <Typography variant="body2" sx={{ fontStyle: 'italic', color: '#7f8c8d' }}>Jan 2020 - Present</Typography>
              </Box>
              <Typography variant="subtitle1" sx={{ color: nameColor, mb: 1 }}>Tech Solutions Inc. - New York, NY</Typography>
              <List disablePadding>
                <ListItem sx={{ py: 0.5 }}><BulletPoint color={color}>•</BulletPoint> Led a team of 5 engineers to develop a new e-commerce platform using React and Node.js.</ListItem>
                <ListItem sx={{ py: 0.5 }}><BulletPoint color={color}>•</BulletPoint> Reduced server response time by 30% through performance optimization and code refactoring.</ListItem>
                <ListItem sx={{ py: 0.5 }}><BulletPoint color={color}>•</BulletPoint> Managed the full software development lifecycle, from requirements gathering to deployment.</ListItem>
              </List>
            </Box>

            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#5d4037' }}>Software Engineer</Typography>
                <Typography variant="body2" sx={{ fontStyle: 'italic', color: '#7f8c8d' }}>Aug 2017 - Dec 2019</Typography>
              </Box>
              <Typography variant="subtitle1" sx={{ color: nameColor, mb: 1 }}>Innovate Systems - San Francisco, CA</Typography>
              <List disablePadding>
                <ListItem sx={{ py: 0.5 }}><BulletPoint color={color}>•</BulletPoint> Developed and maintained key features for a SaaS product, increasing user retention by 15%.</ListItem>
                <ListItem sx={{ py: 0.5 }}><BulletPoint color={color}>•</BulletPoint> Collaborated with the UX/UI team to translate design wireframes into high-quality front-end code.</ListItem>
              </List>
            </Box>
          </Box>

          <Divider sx={{ my: 3, bgcolor: '#e0e0e0' }} />

          <Box>
            <SectionHeader color={color}>Education</SectionHeader>
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#5d4037' }}>Stanford University</Typography>
                <Typography variant="body2" sx={{ fontStyle: 'italic', color: '#7f8c8d' }}>2017</Typography>
              </Box>
              <Typography variant="subtitle1" sx={{ color: nameColor }}>Master of Science in Computer Science</Typography>
            </Box>
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#5d4037' }}>University of California, Berkeley</Typography>
                <Typography variant="body2" sx={{ fontStyle: 'italic', color: '#7f8c8d' }}>2015</Typography>
              </Box>
              <Typography variant="subtitle1" sx={{ color: nameColor }}>Bachelor of Science in Computer Engineering</Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

// Add metadata for filtering
export const resumeMeta = {
  hasPhoto: false,
  columns: 2,
  experienceLevel: ["3-5 Years", "5-10 Years", "10+ Years"]
};

export default Resume19;*/}
{/*import React from 'react';
import { Container, Grid, Box, Typography, List, ListItem, Divider, LinearProgress } from '@mui/material';
import { styled } from '@mui/system';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import HomeIcon from '@mui/icons-material/Home';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

// --- Styled Components for Theming ---

const HeaderTitle = styled(Typography)({
  fontFamily: 'serif',
  fontWeight: 'bold',
  letterSpacing: '2px',
  color: '#4e342e', // Dark Brown
  textTransform: 'uppercase',
});

const SectionHeader = styled(Typography)({
  fontFamily: 'sans-serif',
  fontWeight: 'bold',
  color: '#5d4037', // Medium Brown
  textTransform: 'uppercase',
  marginBottom: '10px',
  paddingBottom: '5px',
  borderBottom: '2px solid #795548', // Brown
});

const InfoItem = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  marginBottom: '8px',
  '& .MuiSvgIcon-root': {
    fontSize: '1rem',
    marginRight: '10px',
    color: '#795548', // Brown
  },
});

const SkillBarContainer = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  marginBottom: '8px',
});

const SkillBarText = styled(Typography)({
  width: '120px',
  flexShrink: 0,
  fontSize: '0.9rem',
});

const BulletPoint = styled('span')({
  marginRight: '8px',
  color: '#5d4037', // Medium Brown
});

// --- Resume Component ---

const Resume = () => {
  return (
    <Container maxWidth="md" sx={{ my: 4, p: 0, boxShadow: '0 8px 16px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
      <Grid container>
        <Grid item xs={12} md={4} sx={{ backgroundColor: '#f5f5f5', p: 4, width: "30%" }}>
          <Box sx={{ mb: 4 }}>
            <SectionHeader>Contact</SectionHeader>
            <InfoItem>
              <PhoneIcon />
              <Typography variant="body2">+1 (555) 123-4567</Typography>
            </InfoItem>
            <InfoItem>
              <EmailIcon />
              <Typography variant="body2">jane.doe@example.com</Typography>
            </InfoItem>
            <InfoItem>
              <HomeIcon />
              <Typography variant="body2">New York, NY</Typography>
            </InfoItem>
            <InfoItem>
              <LinkedInIcon />
              <Typography variant="body2">linkedin.com/in/janedoe</Typography>
            </InfoItem>
          </Box>

          <Divider sx={{ mb: 4, bgcolor: '#e0e0e0' }} />

          <Box sx={{ mb: 4 }}>
            <SectionHeader>Skills</SectionHeader>
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>Programming Languages:</Typography>
              <SkillBarContainer>
                <SkillBarText>JavaScript</SkillBarText>
                <LinearProgress variant="determinate" value={95} sx={{ flexGrow: 1, height: 8, borderRadius: 5, backgroundColor: '#e0e0e0', '& .MuiLinearProgress-bar': { backgroundColor: '#795548' } }} />
              </SkillBarContainer>
              <SkillBarContainer>
                <SkillBarText>Python</SkillBarText>
                <LinearProgress variant="determinate" value={85} sx={{ flexGrow: 1, height: 8, borderRadius: 5, backgroundColor: '#e0e0e0', '& .MuiLinearProgress-bar': { backgroundColor: '#795548' } }} />
              </SkillBarContainer>
              <SkillBarContainer>
                <SkillBarText>SQL</SkillBarText>
                <LinearProgress variant="determinate" value={80} sx={{ flexGrow: 1, height: 8, borderRadius: 5, backgroundColor: '#e0e0e0', '& .MuiLinearProgress-bar': { backgroundColor: '#795548' } }} />
              </SkillBarContainer>
            </Box>
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>Frameworks & Tools:</Typography>
              <SkillBarContainer>
                <SkillBarText>React</SkillBarText>
                <LinearProgress variant="determinate" value={90} sx={{ flexGrow: 1, height: 8, borderRadius: 5, backgroundColor: '#e0e0e0', '& .MuiLinearProgress-bar': { backgroundColor: '#795548' } }} />
              </SkillBarContainer>
              <SkillBarContainer>
                <SkillBarText>Node.js</SkillBarText>
                <LinearProgress variant="determinate" value={80} sx={{ flexGrow: 1, height: 8, borderRadius: 5, backgroundColor: '#e0e0e0', '& .MuiLinearProgress-bar': { backgroundColor: '#795548' } }} />
              </SkillBarContainer>
              <SkillBarContainer>
                <SkillBarText>AWS</SkillBarText>
                <LinearProgress variant="determinate" value={75} sx={{ flexGrow: 1, height: 8, borderRadius: 5, backgroundColor: '#e0e0e0', '& .MuiLinearProgress-bar': { backgroundColor: '#795548' } }} />
              </SkillBarContainer>
            </Box>
          </Box>

          <Divider sx={{ mb: 4, bgcolor: '#e0e0e0' }} />

          <Box>
            <SectionHeader>Languages</SectionHeader>
            <SkillBarContainer>
              <SkillBarText>English</SkillBarText>
              <LinearProgress variant="determinate" value={100} sx={{ flexGrow: 1, height: 8, borderRadius: 5, backgroundColor: '#e0e0e0', '& .MuiLinearProgress-bar': { backgroundColor: '#795548' } }} />
            </SkillBarContainer>
            <SkillBarContainer>
              <SkillBarText>Spanish</SkillBarText>
              <LinearProgress variant="determinate" value={65} sx={{ flexGrow: 1, height: 8, borderRadius: 5, backgroundColor: '#e0e0e0', '& .MuiLinearProgress-bar': { backgroundColor: '#795548' } }} />
            </SkillBarContainer>
          </Box>
        </Grid>

        <Grid item xs={12} md={8} sx={{ p: 4, width: "70%" }}>
          <Box sx={{ mb: 4 }}>
            <HeaderTitle variant="h2">Jane Doe</HeaderTitle>
            <Typography variant="h6" sx={{ color: '#7f8c8d', mt: 1, textTransform: 'uppercase' }}>Senior Full-Stack Developer</Typography>
            <Typography variant="body1" sx={{ mt: 2, color: '#5d4037' }}>
              Results-oriented Software Engineer with a passion for building scalable and efficient web applications. Proven ability to deliver high-quality code and lead projects from conception to deployment.
            </Typography>
          </Box>

          <Box sx={{ mb: 4 }}>
            <SectionHeader>Professional Experience</SectionHeader>
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#5d4037' }}>Senior Software Engineer</Typography>
                <Typography variant="body2" sx={{ fontStyle: 'italic', color: '#7f8c8d' }}>Jan 2020 - Present</Typography>
              </Box>
              <Typography variant="subtitle1" sx={{ color: '#4e342e', mb: 1 }}>Tech Solutions Inc. - New York, NY</Typography>
              <List disablePadding>
                <ListItem sx={{ py: 0.5 }}><BulletPoint>•</BulletPoint> Led a team of 5 engineers to develop a new e-commerce platform using React and Node.js.</ListItem>
                <ListItem sx={{ py: 0.5 }}><BulletPoint>•</BulletPoint> Reduced server response time by 30% through performance optimization and code refactoring.</ListItem>
                <ListItem sx={{ py: 0.5 }}><BulletPoint>•</BulletPoint> Managed the full software development lifecycle, from requirements gathering to deployment.</ListItem>
              </List>
            </Box>

            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#5d4037' }}>Software Engineer</Typography>
                <Typography variant="body2" sx={{ fontStyle: 'italic', color: '#7f8c8d' }}>Aug 2017 - Dec 2019</Typography>
              </Box>
              <Typography variant="subtitle1" sx={{ color: '#4e342e', mb: 1 }}>Innovate Systems - San Francisco, CA</Typography>
              <List disablePadding>
                <ListItem sx={{ py: 0.5 }}><BulletPoint>•</BulletPoint> Developed and maintained key features for a SaaS product, increasing user retention by 15%.</ListItem>
                <ListItem sx={{ py: 0.5 }}><BulletPoint>•</BulletPoint> Collaborated with the UX/UI team to translate design wireframes into high-quality front-end code.</ListItem>
              </List>
            </Box>
          </Box>

          <Divider sx={{ my: 4, bgcolor: '#e0e0e0' }} />

          <Box>
            <SectionHeader>Education</SectionHeader>
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#5d4037' }}>Stanford University</Typography>
                <Typography variant="body2" sx={{ fontStyle: 'italic', color: '#7f8c8d' }}>2017</Typography>
              </Box>
              <Typography variant="subtitle1" sx={{ color: '#4e342e' }}>Master of Science in Computer Science</Typography>
            </Box>
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#5d4037' }}>University of California, Berkeley</Typography>
                <Typography variant="body2" sx={{ fontStyle: 'italic', color: '#7f8c8d' }}>2015</Typography>
              </Box>
              <Typography variant="subtitle1" sx={{ color: '#4e342e' }}>Bachelor of Science in Computer Engineering</Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Resume;*/}