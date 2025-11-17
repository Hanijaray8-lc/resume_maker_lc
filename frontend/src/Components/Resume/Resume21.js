import React from 'react';
import { Grid, Box, Typography, Divider, LinearProgress } from '@mui/material';
import { styled } from '@mui/system';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import PublicIcon from '@mui/icons-material/Public';
import SchoolIcon from '@mui/icons-material/School';

// --- Styled Components for Consistent Theming ---

const HeaderBackground = styled(Box)(({ color }) => ({
  backgroundColor: color || '#f0f0f0',
  color: '#333',
  padding: '30px 40px',
  textAlign: 'center',
  marginBottom: '30px',
}));

const NameTitle = styled(Typography)(({ color, font, fontSize }) => ({
  fontFamily: font || 'Montserrat, sans-serif',
  fontWeight: 800,
  fontSize: fontSize || '2.5rem',
  lineHeight: 1,
  textTransform: 'uppercase',
  color: color || '#333',
}));

const RoleTitle = styled(Typography)(({ color, font, fontSize }) => ({
  fontFamily: font || 'Roboto, sans-serif',
  fontWeight: 400,
  fontSize: fontSize || '1rem',
  textTransform: 'uppercase',
  letterSpacing: '2px',
  marginTop: '5px',
  color: color || '#555',
}));

const SidebarSectionHeader = styled(Typography)(({ color, font, fontSize }) => ({
  fontFamily: font || 'Montserrat, sans-serif',
  fontWeight: 700,
  fontSize: fontSize || '1.1rem',
  color: color || '#333',
  textTransform: 'uppercase',
  marginBottom: '15px',
  paddingBottom: '5px',
  borderBottom: `1px solid ${color ? 'rgba(0,0,0,0.1)' : '#ddd'}`,
}));

const MainContentSectionHeader = styled(Typography)(({ color, font, fontSize }) => ({
  fontFamily: font || 'Montserrat, sans-serif',
  fontWeight: 700,
  fontSize: fontSize || '1.1rem',
  color: color || '#333',
  textTransform: 'uppercase',
  marginBottom: '15px',
  paddingBottom: '5px',
  borderBottom: `1px solid ${color ? 'rgba(0,0,0,0.1)' : '#ddd'}`,
}));

const InfoItem = styled(Box)(({ color, font }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: '8px',
  fontFamily: font || 'Arial, sans-serif',
  '& .MuiSvgIcon-root': {
    fontSize: '1.1rem',
    marginRight: '10px',
    color: color || '#777',
  },
  '& .MuiTypography-root': {
    color: '#555',
    fontFamily: font || 'Roboto, sans-serif',
    fontSize: '0.9rem',
  }
}));

const SkillBarWrapper = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  marginBottom: '15px',
});

const SkillLabel = styled(Typography)(({ color, font, fontSize }) => ({
  fontFamily: font || 'Roboto, sans-serif',
  fontWeight: 600,
  color: color || '#333',
  textTransform: 'uppercase',
  marginBottom: '5px',
  fontSize: fontSize || '0.9rem',
}));

const SkillBar = styled(LinearProgress)(({ color }) => ({
  height: 8,
  borderRadius: 4,
  backgroundColor: '#e0e0e0',
  '& .MuiLinearProgress-bar': {
    backgroundColor: color || '#777',
  },
}));

const TimelineItem = styled(Box)({
  display: 'flex',
  position: 'relative',
  marginBottom: '20px',
  '&::before': {
    content: '""',
    position: 'absolute',
    left: '8px',
    top: '0',
    bottom: '0',
    width: '2px',
    backgroundColor: '#ddd',
  },
});

const TimelineIcon = styled(Box)(({ color }) => ({
  backgroundColor: color || '#777',
  borderRadius: '50%',
  width: '18px',
  height: '18px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1,
  color: '#fff',
  marginLeft: '0px',
  marginRight: '20px',
  '& .MuiSvgIcon-root': {
    fontSize: '0.9rem',
  },
}));

// --- Resume Component ---

const Resume21 = ({
  color = '#f0f0f0',
  nameColor = '#333',
  sidebarBackground = '#fff',
  headerBackground = '#f0f0f0',
  accentColor = '#777',
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
    sidebarText: '#555',
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
        bgcolor: "#fff",
        fontFamily: font,
        fontSize: fontSize,
        fontStyle: fontStyle,
        lineHeight: `${lineSpacing}px`,
        my: topBottomMargin / 10,
        p: `${topBottomMargin / 2}px ${sideMargins / 2}px`,
        border: `${lineWeight}px solid ${palette.accentColor}`
      }}
    >
      {/* Header */}
      <HeaderBackground color={palette.header}>
        <NameTitle 
          color={palette.nameColor} 
          font={font}
          fontSize={getFontSize(2.5)}
        >
          JOHN SMITH
        </NameTitle>
        <RoleTitle 
          color={palette.nameColor} 
          font={font}
          fontSize={getFontSize(1.1)}
        >
          COPYWRITER
        </RoleTitle>
      </HeaderBackground>

      {/* Main Content Grid */}
      <Grid container>
        {/* Left Sidebar (Profile, Education, Skills) */}
        <Grid item xs={12} md={4} sx={{ 
          width: "45%",
          p: 4, 
          borderRight: { md: '1px solid #eee' },
          backgroundColor: palette.sidebarBackground,
          fontFamily: font,
        }}>
          {/* Profile */}
          <Box sx={{ mb: sectionSpacing / 10 }}>
            <SidebarSectionHeader 
              color={palette.nameColor} 
              font={font}
              fontSize={getFontSize(1.2)}
            >
              PROFILE
            </SidebarSectionHeader>
            <Box sx={{ mt: 2 }}>
              <InfoItem color={palette.accentColor} font={font}>
                <LocationOnIcon />
                <Typography sx={{ fontFamily: font, fontSize: fontSize }}>
                  Address: 1234 Main Street, Your City 20200
                </Typography>
              </InfoItem>
              <InfoItem color={palette.accentColor} font={font}>
                <PhoneIcon />
                <Typography sx={{ fontFamily: font, fontSize: fontSize }}>
                  123-456-7890
                </Typography>
              </InfoItem>
              <InfoItem color={palette.accentColor} font={font}>
                <EmailIcon />
                <Typography sx={{ fontFamily: font, fontSize: fontSize }}>
                  your@email.com
                </Typography>
              </InfoItem>
              <InfoItem color={palette.accentColor} font={font}>
                <PublicIcon />
                <Typography sx={{ fontFamily: font, fontSize: fontSize }}>
                  www.yourcompany.com
                </Typography>
              </InfoItem>
            </Box>
          </Box>
          <Divider sx={{ 
            my: sectionSpacing / 10, 
            borderColor: '#eee',
            borderBottomWidth: lineWeight,
          }} />

          {/* Education Timeline */}
          <Box sx={{ mb: sectionSpacing / 10 }}>
            <SidebarSectionHeader 
              color={palette.nameColor} 
              font={font}
              fontSize={getFontSize(1.2)}
            >
              EDUCATION
            </SidebarSectionHeader>
            <Box sx={{ mt: 2 }}>
              <TimelineItem>
                <TimelineIcon color={palette.accentColor}><SchoolIcon /></TimelineIcon>
                <Box>
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      color: palette.lightText, 
                      display: 'block',
                      fontFamily: font,
                      fontSize: fontSize,
                    }}
                  >
                    2014
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      fontWeight: 600, 
                      color: palette.textColor,
                      fontFamily: font,
                      fontSize: getFontSize(1.1),
                    }}
                  >
                    ENTER YOUR DEGREE
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: palette.textColor,
                      fontFamily: font,
                      fontSize: fontSize,
                    }}
                  >
                    YOUR SCHOOL
                  </Typography>
                </Box>
              </TimelineItem>
              <TimelineItem>
                <TimelineIcon color={palette.accentColor}><SchoolIcon /></TimelineIcon>
                <Box>
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      color: palette.lightText, 
                      display: 'block',
                      fontFamily: font,
                      fontSize: fontSize,
                    }}
                  >
                    2016
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      fontWeight: 600, 
                      color: palette.textColor,
                      fontFamily: font,
                      fontSize: getFontSize(1.1),
                    }}
                  >
                    ENTER YOUR DEGREE
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: palette.textColor,
                      fontFamily: font,
                      fontSize: fontSize,
                    }}
                  >
                    YOUR SCHOOL
                  </Typography>
                </Box>
              </TimelineItem>
            </Box>
          </Box>
          <Divider sx={{ 
            my: sectionSpacing / 10, 
            borderColor: '#eee',
            borderBottomWidth: lineWeight,
          }} />

          {/* Skills */}
          <Box>
            <SidebarSectionHeader 
              color={palette.nameColor} 
              font={font}
              fontSize={getFontSize(1.2)}
            >
              SKILL
            </SidebarSectionHeader>
            <Box sx={{ mt: 2 }}>
              <SkillBarWrapper>
                <SkillLabel 
                  color={palette.accentColor} 
                  font={font}
                  fontSize={fontSize}
                >
                  YOUR SKILL 1
                </SkillLabel>
                <SkillBar color={palette.nameColor} variant="determinate" value={90} />
              </SkillBarWrapper>
              <SkillBarWrapper>
                <SkillLabel 
                  color={palette.accentColor} 
                  font={font}
                  fontSize={fontSize}
                >
                  YOUR SKILL 2
                </SkillLabel>
                <SkillBar color={palette.nameColor} variant="determinate" value={80} />
              </SkillBarWrapper>
              <SkillBarWrapper>
                <SkillLabel 
                  color={palette.accentColor} 
                  font={font}
                  fontSize={fontSize}
                >
                  YOUR SKILL 3
                </SkillLabel>
                <SkillBar color={palette.nameColor} variant="determinate" value={95} />
              </SkillBarWrapper>
              <SkillBarWrapper>
                <SkillLabel 
                  color={palette.accentColor} 
                  font={font}
                  fontSize={fontSize}
                >
                  YOUR SKILL 4
                </SkillLabel>
                <SkillBar color={palette.nameColor} variant="determinate" value={75} />
              </SkillBarWrapper>
            </Box>
          </Box>
        </Grid>

        {/* Right Main Content (About Me, Experience, Reference) */}
        <Grid item xs={12} md={8} sx={{ 
          p: 4, 
          width: "55%",
          fontFamily: font,
        }}>
          {/* About Me */}
          <Box sx={{ mb: sectionSpacing / 10 }}>
            <MainContentSectionHeader 
              color={palette.nameColor} 
              font={font}
              fontSize={getFontSize(1.2)}
            >
              ABOUT ME
            </MainContentSectionHeader>
            <Typography 
              variant="body2" 
              sx={{ 
                color: palette.textColor, 
                lineHeight: 1.6, 
                fontFamily: font,
                fontSize: fontSize,
                textIndent: `${paragraphIndent}px`,
              }}
            >
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum do
            </Typography>
          </Box>

          {/* Professional Experience */}
          <Box sx={{ mb: sectionSpacing / 10 }}>
            <MainContentSectionHeader 
              color={palette.nameColor} 
              font={font}
              fontSize={getFontSize(1.2)}
            >
              PROFESSIONAL EXPERIENCE
            </MainContentSectionHeader>
            <Typography 
              variant="body2" 
              sx={{ 
                color: palette.textColor, 
                lineHeight: 1.6, 
                fontFamily: font,
                fontSize: fontSize,
                mb: 2,
                textIndent: `${paragraphIndent}px`,
              }}
            >
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum do
            </Typography>
            <Box sx={{ mb: 3 }}>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 600, 
                  color: palette.textColor, 
                  fontFamily: font,
                  fontSize: getFontSize(1.1),
                }}
              >
                JOB POSITION
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
                Your Company Name (20XX-20YY)
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: palette.textColor, 
                  mt: 1, 
                  lineHeight: 1.5, 
                  fontFamily: font,
                  fontSize: fontSize,
                  textIndent: `${paragraphIndent}px`,
                }}
              >
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum do
              </Typography>
            </Box>
          </Box>

          {/* Reference */}
          <Box>
            <MainContentSectionHeader 
              color={palette.nameColor} 
              font={font}
              fontSize={getFontSize(1.2)}
            >
              REFERENCE
            </MainContentSectionHeader>
            <Grid container spacing={3} sx={{ mt: 2 }}>
              <Grid item xs={12} sm={6}>
                <Box sx={{ 
                  p: 2, 
                  border: '1px solid #ddd', 
                  borderRadius: '4px', 
                  textAlign: 'center',
                  fontFamily: font,
                }}>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontWeight: 600, 
                      color: palette.textColor, 
                      fontFamily: font,
                      fontSize: getFontSize(1.1),
                    }}
                  >
                    JANE SMITH
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: palette.textColor, 
                      fontFamily: font,
                      fontSize: fontSize,
                      mt: 0.5,
                    }}
                  >
                    Creative Director<br />000-1234567<br />jane.smith@email.com
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ 
                  p: 2, 
                  border: '1px solid #ddd', 
                  borderRadius: '4px', 
                  textAlign: 'center',
                  fontFamily: font,
                }}>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontWeight: 600, 
                      color: palette.textColor, 
                      fontFamily: font,
                      fontSize: getFontSize(1.1),
                    }}
                  >
                    JOHN DOE
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: palette.textColor, 
                      fontFamily: font,
                      fontSize: fontSize,
                      mt: 0.5,
                    }}
                  >
                    Marketing Manager<br />000-8901234<br />john.doe@email.com
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>

      {/* Footer */}
      <Box sx={{ 
        height: '30px', 
        backgroundColor: palette.header,
        borderTop: `${lineWeight}px solid ${palette.accentColor}`
      }} />
    </Box>
  );
};

// Add metadata for filtering
export const resumeMeta = {
  hasPhoto: false,
  columns: 2,
  colorOptions: [
    { value: '#f0f0f0', label: 'Light Gray' },
    { value: '#e3f2fd', label: 'Light Blue' },
    { value: '#f1f8e9', label: 'Light Green' },
    { value: '#ffebee', label: 'Light Pink' },
    { value: '#fff3e0', label: 'Light Orange' }
  ],
  nameColorOptions: [
    { value: '#333', label: 'Dark Gray' },
    { value: '#1565c0', label: 'Blue' },
    { value: '#33691e', label: 'Green' },
    { value: '#c62828', label: 'Red' },
    { value: '#e65100', label: 'Orange' }
  ],
  sidebarBackgroundOptions: [
    { value: '#fff', label: 'White' },
    { value: '#f8f9fa', label: 'Light Gray' },
    { value: '#e3f2fd', label: 'Very Light Blue' },
    { value: '#f3e5f5', label: 'Very Light Purple' },
    { value: '#e8f5e9', label: 'Very Light Green' }
  ],
  headerBackgroundOptions: [
    { value: '#f0f0f0', label: 'Light Gray' },
    { value: '#e3f2fd', label: 'Light Blue' },
    { value: '#f1f8e9', label: 'Light Green' },
    { value: '#ffebee', label: 'Light Pink' },
    { value: '#fff3e0', label: 'Light Orange' }
  ],
  accentColorOptions: [
    { value: '#777', label: 'Medium Gray' },
    { value: '#1976d2', label: 'Blue' },
    { value: '#689f38', label: 'Green' },
    { value: '#d32f2f', label: 'Red' },
    { value: '#f57c00', label: 'Orange' }
  ],
  experienceLevel: ["No Experience", "Less than 3 years", "3-5 Years", "5-10 Years", "10+ Years"]
};

export default Resume21;
{/*import React from 'react';
import { Grid, Box, Typography, List, ListItem, Divider, LinearProgress } from '@mui/material';
import { styled } from '@mui/system';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import PublicIcon from '@mui/icons-material/Public';
import SchoolIcon from '@mui/icons-material/School';
import StarIcon from '@mui/icons-material/Star';

// --- Styled Components for Consistent Theming ---

const HeaderBackground = styled(Box)(({ color }) => ({
  backgroundColor: color || '#f0f0f0',
  color: '#333',
  padding: '30px 40px',
  textAlign: 'center',
  marginBottom: '30px',
}));

const NameTitle = styled(Typography)(({ color }) => ({
  fontFamily: 'Montserrat, sans-serif',
  fontWeight: 800,
  fontSize: '2.5rem',
  lineHeight: 1,
  textTransform: 'uppercase',
  color: color || '#333',
}));

const RoleTitle = styled(Typography)(({ color }) => ({
  fontFamily: 'Roboto, sans-serif',
  fontWeight: 400,
  fontSize: '1rem',
  textTransform: 'uppercase',
  letterSpacing: '2px',
  marginTop: '5px',
  color: color || '#555',
}));

const SidebarSectionHeader = styled(Typography)(({ color }) => ({
  fontFamily: 'Montserrat, sans-serif',
  fontWeight: 700,
  fontSize: '1.1rem',
  color: color || '#333',
  textTransform: 'uppercase',
  marginBottom: '15px',
  paddingBottom: '5px',
  borderBottom: `1px solid ${color ? 'rgba(0,0,0,0.1)' : '#ddd'}`,
}));

const MainContentSectionHeader = styled(Typography)(({ color }) => ({
  fontFamily: 'Montserrat, sans-serif',
  fontWeight: 700,
  fontSize: '1.1rem',
  color: color || '#333',
  textTransform: 'uppercase',
  marginBottom: '15px',
  paddingBottom: '5px',
  borderBottom: `1px solid ${color ? 'rgba(0,0,0,0.1)' : '#ddd'}`,
}));

const InfoItem = styled(Box)(({ color }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: '8px',
  '& .MuiSvgIcon-root': {
    fontSize: '1.1rem',
    marginRight: '10px',
    color: color || '#777',
  },
  '& .MuiTypography-root': {
    color: '#555',
    fontFamily: 'Roboto, sans-serif',
    fontSize: '0.9rem',
  }
}));

const SkillBarWrapper = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  marginBottom: '15px',
});

const SkillLabel = styled(Typography)(({ color }) => ({
  fontFamily: 'Roboto, sans-serif',
  fontWeight: 600,
  color: color || '#333',
  textTransform: 'uppercase',
  marginBottom: '5px',
  fontSize: '0.9rem',
}));

const SkillBar = styled(LinearProgress)(({ color }) => ({
  height: 8,
  borderRadius: 4,
  backgroundColor: '#e0e0e0',
  '& .MuiLinearProgress-bar': {
    backgroundColor: color || '#777',
  },
}));

const TimelineItem = styled(Box)({
  display: 'flex',
  position: 'relative',
  marginBottom: '20px',
  '&::before': {
    content: '""',
    position: 'absolute',
    left: '8px',
    top: '0',
    bottom: '0',
    width: '2px',
    backgroundColor: '#ddd',
  },
});

const TimelineIcon = styled(Box)(({ color }) => ({
  backgroundColor: color || '#777',
  borderRadius: '50%',
  width: '18px',
  height: '18px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1,
  color: '#fff',
  marginLeft: '0px',
  marginRight: '20px',
  '& .MuiSvgIcon-root': {
    fontSize: '0.9rem',
  },
}));

// --- Resume Component ---

const Resume21 = ({
  color = '#f0f0f0',
  nameColor = '#333',
  sidebarBackground = '#fff',
  headerBackground = '#f0f0f0',
  accentColor = '#777'
}) => {
  return (
    <Box
      sx={{
        width: "210mm",
        minHeight: "297mm",
        mx: "auto",
        boxShadow: 4,
        bgcolor: "#fff",
        fontFamily: "Arial, sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <HeaderBackground color={headerBackground}>
        <NameTitle color={nameColor}>JOHN SMITH</NameTitle>
        <RoleTitle color={nameColor}>COPYWRITER</RoleTitle>
      </HeaderBackground>

      <Grid container>
        <Grid item xs={12} md={4} sx={{ width:"45%",
          p: 4, 
          borderRight: { md: '1px solid #eee' },
          backgroundColor: sidebarBackground
        }}>
          <Box sx={{ mb: 4 }}>
            <SidebarSectionHeader color={nameColor}>PROFILE</SidebarSectionHeader>
            <Box sx={{ mt: 2 }}>
              <InfoItem color={accentColor}>
                <LocationOnIcon />
                <Typography>Address: 1234 Main Street, Your City 20200</Typography>
              </InfoItem>
              <InfoItem color={accentColor}>
                <PhoneIcon />
                <Typography>123-456-7890</Typography>
              </InfoItem>
              <InfoItem color={accentColor}>
                <EmailIcon />
                <Typography>your@email.com</Typography>
              </InfoItem>
              <InfoItem color={accentColor}>
                <PublicIcon />
                <Typography>www.yourcompany.com</Typography>
              </InfoItem>
            </Box>
          </Box>
          <Divider sx={{ my: 4, borderColor: '#eee' }} />

          <Box sx={{ mb: 4 }}>
            <SidebarSectionHeader color={nameColor}>EDUCATION</SidebarSectionHeader>
            <Box sx={{ mt: 2 }}>
              <TimelineItem>
                <TimelineIcon color={accentColor}><SchoolIcon /></TimelineIcon>
                <Box>
                  <Typography variant="caption" sx={{ color: '#777', display: 'block' }}>2014</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#333' }}>ENTER YOUR DEGREE</Typography>
                  <Typography variant="body2" sx={{ color: '#555' }}>YOUR SCHOOL</Typography>
                </Box>
              </TimelineItem>
              <TimelineItem>
                <TimelineIcon color={accentColor}><SchoolIcon /></TimelineIcon>
                <Box>
                  <Typography variant="caption" sx={{ color: '#777', display: 'block' }}>2016</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#333' }}>ENTER YOUR DEGREE</Typography>
                  <Typography variant="body2" sx={{ color: '#555' }}>YOUR SCHOOL</Typography>
                </Box>
              </TimelineItem>
            </Box>
          </Box>
          <Divider sx={{ my: 4, borderColor: '#eee' }} />

          <Box>
            <SidebarSectionHeader color={nameColor}>SKILL</SidebarSectionHeader>
            <Box sx={{ mt: 2 }}>
              <SkillBarWrapper>
                <SkillLabel color={accentColor}>YOUR SKILL 1</SkillLabel>
                <SkillBar color={nameColor} variant="determinate" value={90} />
              </SkillBarWrapper>
              <SkillBarWrapper>
                <SkillLabel color={accentColor}>YOUR SKILL 2</SkillLabel>
                <SkillBar color={nameColor} variant="determinate" value={80} />
              </SkillBarWrapper>
              <SkillBarWrapper>
                <SkillLabel color={accentColor}>YOUR SKILL 3</SkillLabel>
                <SkillBar color={nameColor} variant="determinate" value={95} />
              </SkillBarWrapper>
              <SkillBarWrapper>
                <SkillLabel color={accentColor}>YOUR SKILL 4</SkillLabel>
                <SkillBar color={nameColor} variant="determinate" value={75} />
              </SkillBarWrapper>
            </Box>
          </Box>
        </Grid>

        <Grid item xs={12} md={8} sx={{ p: 4, width: "55%" }}>
          <Box sx={{ mb: 4 }}>
            <MainContentSectionHeader color={nameColor}>ABOUT ME</MainContentSectionHeader>
            <Typography variant="body2" sx={{ color: '#555', lineHeight: 1.6, fontFamily: 'Roboto, sans-serif' }}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum do
            </Typography>
          </Box>

          <Box sx={{ mb: 4 }}>
            <MainContentSectionHeader color={nameColor}>PROFESSIONAL EXPERIENCE</MainContentSectionHeader>
            <Typography variant="body2" sx={{ color: '#555', lineHeight: 1.6, fontFamily: 'Roboto, sans-serif', mb: 2 }}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum do
            </Typography>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#333', fontFamily: 'Roboto, sans-serif', fontSize: '1rem' }}>
                JOB POSITION
              </Typography>
              <Typography variant="body2" sx={{ fontStyle: 'italic', color: '#777', fontFamily: 'Roboto, sans-serif' }}>
                Your Company Name (20XX-20YY)
              </Typography>
              <Typography variant="body2" sx={{ color: '#555', mt: 1, lineHeight: 1.5, fontFamily: 'Roboto, sans-serif' }}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum do
              </Typography>
            </Box>
          </Box>

          <Box>
            <MainContentSectionHeader color={nameColor}>REFERENCE</MainContentSectionHeader>
            <Grid container spacing={3} sx={{ mt: 2 }}>
              <Grid item xs={12} sm={6}>
                <Box sx={{ p: 2, border: '1px solid #ddd', borderRadius: '4px', textAlign: 'center' }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: '#333', fontFamily: 'Roboto, sans-serif', fontSize: '1rem' }}>
                    JANE SMITH
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#555', fontFamily: 'Roboto, sans-serif', mt: 0.5 }}>
                    Creative Director<br />000-1234567<br />jane.smith@email.com
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ p: 2, border: '1px solid #ddd', borderRadius: '4px', textAlign: 'center' }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: '#333', fontFamily: 'Roboto, sans-serif', fontSize: '1rem' }}>
                    JOHN DOE
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#555', fontFamily: 'Roboto, sans-serif', mt: 0.5 }}>
                    Marketing Manager<br />000-8901234<br />john.doe@email.com
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>

      <Box sx={{ height: '30px', backgroundColor: headerBackground }} />
    </Box>
  );
};

// Add metadata for filtering
export const resumeMeta = {
  hasPhoto: false,
  columns: 2,
  experienceLevel: ["3-5 Years", "5-10 Years", "10+ Years"]
};

export default Resume21;*/}
{/*import React from 'react';
import { Container, Grid, Box, Typography, List, ListItem, Divider, LinearProgress } from '@mui/material';
import { styled } from '@mui/system';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import PublicIcon from '@mui/icons-material/Public';
import SchoolIcon from '@mui/icons-material/School'; // For education timeline
import StarIcon from '@mui/icons-material/Star'; // For skill icons

// --- Styled Components for Consistent Theming ---

const HeaderBackground = styled(Box)({
  backgroundColor: '#f0f0f0', // Light Grey background for header
  color: '#333', // Dark text for header
  padding: '30px 40px',
  textAlign: 'center',
  marginBottom: '30px',
});

const NameTitle = styled(Typography)({
  fontFamily: 'Montserrat, sans-serif',
  fontWeight: 800,
  fontSize: '2.5rem',
  lineHeight: 1,
  textTransform: 'uppercase',
  color: '#333', // Darker text for name
});

const RoleTitle = styled(Typography)({
  fontFamily: 'Roboto, sans-serif',
  fontWeight: 400,
  fontSize: '1rem',
  textTransform: 'uppercase',
  letterSpacing: '2px',
  marginTop: '5px',
  color: '#555', // Medium grey for role
});

const SidebarSectionHeader = styled(Typography)({
  fontFamily: 'Montserrat, sans-serif',
  fontWeight: 700,
  fontSize: '1.1rem',
  color: '#333',
  textTransform: 'uppercase',
  marginBottom: '15px',
  paddingBottom: '5px',
  borderBottom: '1px solid #ddd', // Light border for sidebar sections
});

const MainContentSectionHeader = styled(Typography)({
  fontFamily: 'Montserrat, sans-serif',
  fontWeight: 700,
  fontSize: '1.1rem',
  color: '#333',
  textTransform: 'uppercase',
  marginBottom: '15px',
  paddingBottom: '5px',
  borderBottom: '1px solid #ddd', // Light border for main content sections
});

const InfoItem = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  marginBottom: '8px',
  '& .MuiSvgIcon-root': {
    fontSize: '1.1rem',
    marginRight: '10px',
    color: '#777', // Accent grey for icons
  },
  '& .MuiTypography-root': {
    color: '#555', // Text color for info
    fontFamily: 'Roboto, sans-serif',
    fontSize: '0.9rem',
  }
});

const SkillBarWrapper = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  marginBottom: '15px',
});

const SkillLabel = styled(Typography)({
  fontFamily: 'Roboto, sans-serif',
  fontWeight: 600,
  color: '#333',
  textTransform: 'uppercase',
  marginBottom: '5px',
  fontSize: '0.9rem',
});

const SkillBar = styled(LinearProgress)({
  height: 8,
  borderRadius: 4,
  backgroundColor: '#e0e0e0', // Lighter background for empty part of bar
  '& .MuiLinearProgress-bar': {
    backgroundColor: '#777', // Accent grey for filled part of bar
  },
});

const TimelineItem = styled(Box)({
  display: 'flex',
  position: 'relative',
  marginBottom: '20px',
  '&::before': {
    content: '""',
    position: 'absolute',
    left: '8px',
    top: '0',
    bottom: '0',
    width: '2px',
    backgroundColor: '#ddd', // Light grey line
  },
});

const TimelineIcon = styled(Box)({
  backgroundColor: '#777', // Accent grey for timeline dot
  borderRadius: '50%',
  width: '18px',
  height: '18px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1,
  color: '#fff',
  marginLeft: '0px',
  marginRight: '20px',
  '& .MuiSvgIcon-root': {
    fontSize: '0.9rem',
  },
});

// --- Resume Component ---

const ResumeLight = () => {
  return (
    <Container maxWidth="md" sx={{ my: 4, p: 0, boxShadow: '0 8px 16px rgba(0,0,0,0.1)', overflow: 'hidden', backgroundColor: '#fff' }}>
      <HeaderBackground>
        <NameTitle>JOHN SMITH</NameTitle>
        <RoleTitle>COPYWRITER</RoleTitle>
      </HeaderBackground>

      <Grid container>
        <Grid item xs={12} md={4} sx={{ p: 4, borderRight: { md: '1px solid #eee' } }}>
          <Box sx={{ mb: 4 }}>
            <SidebarSectionHeader>PROFILE</SidebarSectionHeader>
            <Box sx={{ mt: 2 }}>
              <InfoItem>
                <LocationOnIcon />
                <Typography>Address: 1234 Main Street, Your City 20200</Typography>
              </InfoItem>
              <InfoItem>
                <PhoneIcon />
                <Typography>123-456-7890</Typography>
              </InfoItem>
              <InfoItem>
                <EmailIcon />
                <Typography>your@email.com</Typography>
              </InfoItem>
              <InfoItem>
                <PublicIcon />
                <Typography>www.yourcompany.com</Typography>
              </InfoItem>
            </Box>
          </Box>
          <Divider sx={{ my: 4, borderColor: '#eee' }} />

          <Box sx={{ mb: 4 }}>
            <SidebarSectionHeader>EDUCATION</SidebarSectionHeader>
            <Box sx={{ mt: 2 }}>
              <TimelineItem>
                <TimelineIcon><SchoolIcon /></TimelineIcon>
                <Box>
                  <Typography variant="caption" sx={{ color: '#777', display: 'block' }}>2014</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#333' }}>ENTER YOUR DEGREE</Typography>
                  <Typography variant="body2" sx={{ color: '#555' }}>YOUR SCHOOL</Typography>
                </Box>
              </TimelineItem>
              <TimelineItem>
                <TimelineIcon><SchoolIcon /></TimelineIcon>
                <Box>
                  <Typography variant="caption" sx={{ color: '#777', display: 'block' }}>2016</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#333' }}>ENTER YOUR DEGREE</Typography>
                  <Typography variant="body2" sx={{ color: '#555' }}>YOUR SCHOOL</Typography>
                </Box>
              </TimelineItem>
            </Box>
          </Box>
          <Divider sx={{ my: 4, borderColor: '#eee' }} />

          <Box>
            <SidebarSectionHeader>SKILL</SidebarSectionHeader>
            <Box sx={{ mt: 2 }}>
              <SkillBarWrapper>
                <SkillLabel>YOUR SKILL 1</SkillLabel>
                <SkillBar variant="determinate" value={90} />
              </SkillBarWrapper>
              <SkillBarWrapper>
                <SkillLabel>YOUR SKILL 2</SkillLabel>
                <SkillBar variant="determinate" value={80} />
              </SkillBarWrapper>
              <SkillBarWrapper>
                <SkillLabel>YOUR SKILL 3</SkillLabel>
                <SkillBar variant="determinate" value={95} />
              </SkillBarWrapper>
              <SkillBarWrapper>
                <SkillLabel>YOUR SKILL 4</SkillLabel>
                <SkillBar variant="determinate" value={75} />
              </SkillBarWrapper>
            </Box>
          </Box>
        </Grid>

        <Grid item xs={12} md={8} sx={{ p: 4 ,width:"55%"}}>
          <Box sx={{ mb: 4 }}>
            <MainContentSectionHeader>ABOUT ME</MainContentSectionHeader>
            <Typography variant="body2" sx={{ color: '#555', lineHeight: 1.6, fontFamily: 'Roboto, sans-serif' }}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum do
            </Typography>
          </Box>

          <Box sx={{ mb: 4 }}>
            <MainContentSectionHeader>PROFESSIONAL EXPERIENCE</MainContentSectionHeader>
            <Typography variant="body2" sx={{ color: '#555', lineHeight: 1.6, fontFamily: 'Roboto, sans-serif', mb: 2 }}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum do
            </Typography>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#333', fontFamily: 'Roboto, sans-serif', fontSize: '1rem' }}>
                JOB POSITION
              </Typography>
              <Typography variant="body2" sx={{ fontStyle: 'italic', color: '#777', fontFamily: 'Roboto, sans-serif' }}>
                Your Company Name (20XX-20YY)
              </Typography>
              <Typography variant="body2" sx={{ color: '#555', mt: 1, lineHeight: 1.5, fontFamily: 'Roboto, sans-serif' }}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum do
              </Typography>
            </Box>
          </Box>

          <Box>
            <MainContentSectionHeader>REFERENCE</MainContentSectionHeader>
            <Grid container spacing={3} sx={{ mt: 2 }}>
              <Grid item xs={12} sm={6}>
                <Box sx={{ p: 2, border: '1px solid #ddd', borderRadius: '4px', textAlign: 'center' }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: '#333', fontFamily: 'Roboto, sans-serif', fontSize: '1rem' }}>
                    JANE SMITH
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#555', fontFamily: 'Roboto, sans-serif', mt: 0.5 }}>
                    Creative Director<br />000-1234567<br />jane.smith@email.com
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ p: 2, border: '1px solid #ddd', borderRadius: '4px', textAlign: 'center' }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: '#333', fontFamily: 'Roboto, sans-serif', fontSize: '1rem' }}>
                    JOHN DOE
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#555', fontFamily: 'Roboto, sans-serif', mt: 0.5 }}>
                    Marketing Manager<br />000-8901234<br />john.doe@email.com
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>

      <Box sx={{ height: '30px', backgroundColor: '#f0f0f0' }} />
    </Container>
  );
};

export default ResumeLight;*/}