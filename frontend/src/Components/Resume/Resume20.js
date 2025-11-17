import React from 'react';
import { Grid, Box, Typography, List, ListItem, Divider } from '@mui/material';
import { styled } from '@mui/system';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';

// --- Styled Components for Consistent Theming ---

const HeaderContainer = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  paddingBottom: '20px',
  borderBottom: '1px solid #e0e0e0',
  marginBottom: '30px',
});

const NameTitle = styled(Typography)(({ color, font, fontSize }) => ({
  fontFamily: font || 'Montserrat, sans-serif',
  fontWeight: 800,
  lineHeight: 1.1,
  color: color || '#333',
  textTransform: 'uppercase',
  fontSize: fontSize || '2.5rem',
}));

const ContactInfoItem = styled(Box)(({ color, font }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: '5px',
  fontFamily: font || 'Arial, sans-serif',
  '& .MuiSvgIcon-root': {
    fontSize: '0.9rem',
    marginRight: '8px',
    color: color || '#555',
  },
}));

const MainSectionHeader = styled(Typography)(({ color, font, fontSize }) => ({
  fontFamily: font || 'Montserrat, sans-serif',
  fontWeight: 700,
  fontSize: fontSize || '1.1rem',
  color: color || '#333',
  textTransform: 'uppercase',
  position: 'relative',
  marginBottom: '15px',
  paddingLeft: '20px',
  '&::before': {
    content: '""',
    position: 'absolute',
    left: 0,
    top: '50%',
    transform: 'translateY(-50%)',
    width: '10px',
    height: '10px',
    backgroundColor: color || '#333',
    borderRadius: '2px',
  },
}));

const SidebarSectionHeader = styled(Typography)(({ color, font, fontSize }) => ({
  fontFamily: font || 'Montserrat, sans-serif',
  fontWeight: 700,
  fontSize: fontSize || '1rem',
  color: color || '#fff',
  textTransform: 'uppercase',
  marginBottom: '15px',
}));

const SidebarListItem = styled(ListItem)(({ color, font, fontSize }) => ({
  padding: '4px 0',
  color: color || '#fff',
  fontFamily: font || 'Arial, sans-serif',
  fontSize: fontSize || '0.9rem',
}));

const MainContentListItem = styled(ListItem)(({ color, font, fontSize }) => ({
  padding: '2px 0',
  color: color || '#555',
  fontFamily: font || 'Arial, sans-serif',
  fontSize: fontSize || '0.9rem',
  display: 'list-item',
}));

// --- Resume Component ---

const Resume20 = ({
  color = '#333',
  nameColor = '#333',
  sidebarBackground = '#333',
  headerBackground = '#fff',
  sidebarTextColor = '#fff',
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
    sidebarText: sidebarTextColor,
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
      {/* Header */}
      <Box sx={{ p: 4, pb: 2 }}>
        <Grid container alignItems="center">
          <Grid item xs={12} sm={8} sx={{ width: "70%" }}>
            <HeaderContainer>
              <Box sx={{ p: 1.5, mr: 2, backgroundColor: palette.accentColor, borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <PersonIcon sx={{ color: '#fff', fontSize: '2.5rem' }} />
              </Box>
              <Box>
                <NameTitle 
                  color={palette.nameColor} 
                  font={font}
                  fontSize={getFontSize(2.5)}
                  variant="h4"
                >
                  RICHARD
                </NameTitle>
                <NameTitle 
                  color={palette.nameColor} 
                  font={font}
                  fontSize={getFontSize(2.5)}
                  variant="h4" 
                  sx={{ mt: -0.5 }}
                >
                  MORRISON
                </NameTitle>
                <Typography 
                  variant="subtitle1" 
                  sx={{ 
                    color: palette.lightText, 
                    mt: 0.5, 
                    fontFamily: font,
                    fontWeight: 500, 
                    letterSpacing: '1px',
                    fontSize: getFontSize(1.1)
                  }}
                >
                  GRAPHIC DESIGNER, ART DIRECTOR
                </Typography>
              </Box>
            </HeaderContainer>
          </Grid>
          <Grid item xs={12} sm={4} sx={{ textAlign: { xs: 'left', sm: 'right' }, width: "30%" }}>
            <ContactInfoItem color={palette.accentColor} font={font}>
              <EmailIcon />
              <Typography 
                variant="body2" 
                sx={{ 
                  color: palette.textColor, 
                  fontFamily: font,
                  fontSize: fontSize
                }}
              >
                richard@company.com
              </Typography>
            </ContactInfoItem>
            <ContactInfoItem color={palette.accentColor} font={font}>
              <PhoneIcon />
              <Typography 
                variant="body2" 
                sx={{ 
                  color: palette.textColor, 
                  fontFamily: font,
                  fontSize: fontSize
                }}
              >
                +0 123 456 789 0
              </Typography>
            </ContactInfoItem>
            <ContactInfoItem color={palette.accentColor} font={font}>
              <LocationOnIcon />
              <Typography 
                variant="body2" 
                sx={{ 
                  color: palette.textColor, 
                  fontFamily: font,
                  fontSize: fontSize
                }}
              >
                STREET LOCATION, CITY,<br />COUNTRY NAME
              </Typography>
            </ContactInfoItem>
          </Grid>
        </Grid>
      </Box>

      {/* Main Content & Sidebar */}
      <Grid container>
        {/* Main Content Area */}
        <Grid item xs={12} md={8} sx={{ p: 4, pt: 0, width: "70%" }}>
          {/* Profile */}
          <Box sx={{ mb: sectionSpacing / 10 }}>
            <MainSectionHeader 
              color={palette.accentColor} 
              font={font}
              fontSize={getFontSize(1.2)}
            >
              PROFILE
            </MainSectionHeader>
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
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur sit amet quam ut tortor pellentesque semper at dapibus metus. Pellentesque finibus bibendum tellus ac imperdiet. Quisque semper pulvinar est, ac pretium justo pharetra a.
            </Typography>
          </Box>

          {/* Work Experience */}
          <Box sx={{ mb: sectionSpacing / 10 }}>
            <MainSectionHeader 
              color={palette.accentColor} 
              font={font}
              fontSize={getFontSize(1.2)}
            >
              WORK EXPERIENCE
            </MainSectionHeader>
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
                GRAPHIC DESIGNER
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
                Lorem Ipsum Digital Agency (2017-2019)
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
                Curabitur sit amet quam ut tortor pellentesque semper at dapibus metus.
              </Typography>
            </Box>
            <Box>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 600, 
                  color: palette.textColor, 
                  fontFamily: font,
                  fontSize: getFontSize(1.1),
                }}
              >
                ART DIRECTOR
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
                Lorem Ipsum Digital Agency (2019-2021)
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
                Vestibulum convallis quam vel lorem commodo lacinia. Morbi ultricies, elit sed gravida euismod, sem elit fermentum libero, sed ornare velit mi et mi. Pellentesque non tempor sem.
              </Typography>
            </Box>
          </Box>

          {/* Education */}
          <Box sx={{ mb: sectionSpacing / 10 }}>
            <MainSectionHeader 
              color={palette.accentColor} 
              font={font}
              fontSize={getFontSize(1.2)}
            >
              EDUCATION
            </MainSectionHeader>
            <Box sx={{ mb: 2 }}>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 600, 
                  color: palette.textColor, 
                  fontFamily: font,
                  fontSize: getFontSize(1.1),
                }}
              >
                HIGH SCHOOL NAME
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
                Senior High School (2010-2013)
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
                Lorem ipsum dolor sit amet, consectetur adipiscing.
              </Typography>
            </Box>
            <Box>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 600, 
                  color: palette.textColor, 
                  fontFamily: font,
                  fontSize: getFontSize(1.1),
                }}
              >
                UNIVERSITY NAME
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
                Bachelor Of Art (2013-2017)
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
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur sit amet quam ut tortor pellentesque.
              </Typography>
            </Box>
          </Box>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} md={4} sx={{ width: "30%" }}>
          <Box sx={{ 
            backgroundColor: palette.accentColor, 
            p: 4, 
            color: palette.sidebarText, 
            height: '100%',
            fontFamily: font,
          }}>
            {/* Skills */}
            <Box sx={{ mb: sectionSpacing / 10 }}>
              <SidebarSectionHeader 
                color={palette.sidebarText} 
                font={font}
                fontSize={getFontSize(1.1)}
              >
                SKILLS
              </SidebarSectionHeader>
              <List disablePadding sx={{ listStyleType: 'disc', pl: 2, '& .MuiListItem-root': { display: 'list-item' } }}>
                <SidebarListItem 
                  color={palette.sidebarText} 
                  font={font}
                  fontSize={fontSize}
                >
                  Graphic Designer
                </SidebarListItem>
                <SidebarListItem 
                  color={palette.sidebarText} 
                  font={font}
                  fontSize={fontSize}
                >
                  Leadership
                </SidebarListItem>
                <SidebarListItem 
                  color={palette.sidebarText} 
                  font={font}
                  fontSize={fontSize}
                >
                  Web Development
                </SidebarListItem>
                <SidebarListItem 
                  color={palette.sidebarText} 
                  font={font}
                  fontSize={fontSize}
                >
                  Brand Campaign
                </SidebarListItem>
                <SidebarListItem 
                  color={palette.sidebarText} 
                  font={font}
                  fontSize={fontSize}
                >
                  UI Design
                </SidebarListItem>
              </List>
            </Box>
            <Divider sx={{ 
              mb: sectionSpacing / 10, 
              borderColor: '#555',
              borderBottomWidth: lineWeight,
            }} />

            {/* Expertise */}
            <Box sx={{ mb: sectionSpacing / 10 }}>
              <SidebarSectionHeader 
                color={palette.sidebarText} 
                font={font}
                fontSize={getFontSize(1.1)}
              >
                EXPERTISE
              </SidebarSectionHeader>
              <List disablePadding sx={{ listStyleType: 'disc', pl: 2, '& .MuiListItem-root': { display: 'list-item' } }}>
                <SidebarListItem 
                  color={palette.sidebarText} 
                  font={font}
                  fontSize={fontSize}
                >
                  Adobe Illustrator
                </SidebarListItem>
                <SidebarListItem 
                  color={palette.sidebarText} 
                  font={font}
                  fontSize={fontSize}
                >
                  In Design
                </SidebarListItem>
                <SidebarListItem 
                  color={palette.sidebarText} 
                  font={font}
                  fontSize={fontSize}
                >
                  Adobe Photoshop
                </SidebarListItem>
                <SidebarListItem 
                  color={palette.sidebarText} 
                  font={font}
                  fontSize={fontSize}
                >
                  Microsoft Word
                </SidebarListItem>
              </List>
            </Box>
            <Divider sx={{ 
              mb: sectionSpacing / 10, 
              borderColor: '#555',
              borderBottomWidth: lineWeight,
            }} />

            {/* Interests */}
            <Box>
              <SidebarSectionHeader 
                color={palette.sidebarText} 
                font={font}
                fontSize={getFontSize(1.1)}
              >
                INTERESTS
              </SidebarSectionHeader>
              <List disablePadding sx={{ listStyleType: 'disc', pl: 2, '& .MuiListItem-root': { display: 'list-item' } }}>
                <SidebarListItem 
                  color={palette.sidebarText} 
                  font={font}
                  fontSize={fontSize}
                >
                  Photography
                </SidebarListItem>
                <SidebarListItem 
                  color={palette.sidebarText} 
                  font={font}
                  fontSize={fontSize}
                >
                  Swimming
                </SidebarListItem>
                <SidebarListItem 
                  color={palette.sidebarText} 
                  font={font}
                  fontSize={fontSize}
                >
                  Riding
                </SidebarListItem>
                <SidebarListItem 
                  color={palette.sidebarText} 
                  font={font}
                  fontSize={fontSize}
                >
                  Travel
                </SidebarListItem>
              </List>
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
  colorOptions: [
    { value: '#333', label: 'Dark Gray' },
    { value: '#3f51b5', label: 'Indigo' },
    { value: '#2196f3', label: 'Blue' },
    { value: '#f44336', label: 'Red' },
    { value: '#4caf50', label: 'Green' },
    { value: '#ff9800', label: 'Orange' },
    { value: '#9c27b0', label: 'Purple' }
  ],
  nameColorOptions: [
    { value: '#333', label: 'Dark Gray' },
    { value: '#000000', label: 'Black' },
    { value: '#1a2b47', label: 'Dark Blue' },
    { value: '#2e7d32', label: 'Green' },
    { value: '#7b1fa2', label: 'Purple' }
  ],
  sidebarBackgroundOptions: [
    { value: '#333', label: 'Dark Gray' },
    { value: '#1a2b47', label: 'Dark Blue' },
    { value: '#2e7d32', label: 'Green' },
    { value: '#7b1fa2', label: 'Purple' },
    { value: '#c2185b', label: 'Pink' },
    { value: '#d32f2f', label: 'Red' }
  ],
  sidebarTextColorOptions: [
    { value: '#fff', label: 'White' },
    { value: '#f5f5f5', label: 'Light Gray' },
    { value: '#e0e0e0', label: 'Very Light Gray' },
    { value: '#bbdefb', label: 'Light Blue' },
    { value: '#c8e6c9', label: 'Light Green' }
  ],
  headerBackgroundOptions: [
    { value: '#fff', label: 'White' },
    { value: '#f8f9fa', label: 'Light Gray' },
    { value: '#e3f2fd', label: 'Very Light Blue' },
    { value: '#f3e5f5', label: 'Very Light Purple' },
    { value: '#e8f5e9', label: 'Very Light Green' }
  ],
  experienceLevel: ["No Experience", "Less than 3 years", "3-5 Years", "5-10 Years", "10+ Years"]
};

export default Resume20;
