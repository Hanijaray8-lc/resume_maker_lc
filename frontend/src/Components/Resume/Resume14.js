import React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {
  Paper,
  Typography,
  Grid,
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
} from '@mui/material';
import {
  Email,
  Phone,
} from '@mui/icons-material';

const Resume14 = ({ 
  color = '#2d5c7f',
  nameColor = '#2d5c7f',
  font = "Arial, sans-serif",
  fontSize = "12px", // Font size reduced slightly for better fit
  fontStyle = "normal",
  headingSize = "22px", // Heading size reduced slightly
  sectionSpacing = 3, // **குறைக்கப்பட்ட இடைவெளி (Reduced Spacing)**
  lineSpacing = 18,
  topBottomMargin = 20,
  sideMargins = 15,
  pageSize = "A4", // **A4 அளவு உறுதிப்படுத்தப்பட்டது**
  theme: externalTheme,
  formData = {}, 
  photo = "",
  workExperiences = []
}) => {
  
  // --- HARDCODED/DEFAULT DATA FOR SINGLE PAGE ---

  const primaryColor = externalTheme?.primary || color;
  
  const page = { 
      width: "210mm", // A4 Width
      height: "297mm" // A4 Height
  };
  
  const data = {
    firstName: "CAIRINE",
    lastName: "ZIV",
    role: "IT PROJECT MANAGER",
    phone: "+123-456-7890",
    email: "hello@reallygreatsite.com",
    city: "Chennai, India",
    website: "reallygreatsite.com",
    profile: "Highly motivated and results-oriented IT Project Manager with 8+ years of experience leading complex, cross-functional projects from inception to completion. Proven ability to deliver projects on time and within budget, ensuring alignment with strategic business goals. Seeking to leverage expertise in Agile methodologies and team leadership.",
    ...formData 
  };

  const experienceData = workExperiences && workExperiences.length > 0 ? workExperiences : [
    { jobTitle: "Senior Project Manager", employer: "Welfare FOR Organization", companyName: "Welfare FOR", startMonth: "Jul", startYear: "2017", current: true, 
      description: 
        "Led a team of 15 engineers and designers to launch a critical public-facing platform, resulting in a 25% increase in user engagement.\nManaged a project budget of $5M, consistently delivering within 5% variance of projected costs.\nImplemented Scrum methodology, improving team velocity by 40% over two quarters."
    },
   
  ];

  const educationEntries = [
    { id: 1, degree: "Master of Science", fieldOfStudy: "Project Management", schoolName: "HOFZ Graduate Center", gradMonth: "Oct", gradYear: "2014", schoolLocation: "Thesis focused on risk mitigation in large-scale IT projects.", additionalCoursework: "Graduated with High Honors" },
  ];

  const savedSkills = [
    { name: "Agile & Scrum Methodologies" },
    { name: "Risk Management" },
    { name: "Budgeting & Forecasting" },
    { name: "JIRA & Confluence" },
  ]

  const savedCertifications = [
    { name: "Project Management Professional (PMP)", provider: "PMI", year: "2020" },
    { name: "Certified ScrumMaster (CSM)", provider: "Scrum Alliance", year: "2018" }
  ];

  const savedLanguages = [
    { name: "Tamil", level: "Native" },
    { name: "English", level: "Fluent" },
    { name: "Hindi", level: "Conversational" }
  ];
  

  
  // --- UTILS & THEME (Simplified) ---

  const formatDate = (month, year) => {
    if (!month || !year) return "";
    return `${month} ${year}`;
  };

  const theme = createTheme({
    palette: {
      primary: { main: primaryColor },
      text: { primary: '#2c3e50', secondary: '#566573' }
    },
    typography: {
      fontFamily: font,
      h3: { fontWeight: 700, color: nameColor, fontSize: `calc(${headingSize} * 1.8)` },
      h5: { fontWeight: 600, color: primaryColor, fontSize: headingSize },
      h6: { fontWeight: 600, color: primaryColor, fontSize: `calc(${headingSize} * 0.9)` },
      subtitle1: { color: '#7f8c8d', fontWeight: 500, fontSize: `calc(${fontSize} * 1.1)` },
      body2: { color: '#34495e', fontSize: fontSize, lineHeight: `${lineSpacing}px` }
    },
  });

  // --- SECTION COMPONENTS ---
  
  const SectionHeader = ({ title }) => (
    <Box sx={{ 
      display: 'flex', 
      alignItems: 'center', 
      // mb: 3 (Removed default margin bottom from here)
      pb: 1,
      mt: 1, // **அதிகரித்த மேலிருந்து இடைவெளி (Increased top margin for clear separation)**
      borderBottom: `2px solid ${primaryColor}`
    }}>
      <Box sx={{ 
        width: 4, 
        height: 22, // Reduced height
        backgroundColor: primaryColor, 
        mr: 2 
      }} />
      <Typography variant="h5" color="primary" sx={{ fontWeight: 700 }}>
        {title}
      </Typography>
    </Box>
  );

  const HeaderSection = () => {
    return (
      <Box sx={{ 
        mb: sectionSpacing / 10, 
        p: sideMargins / 5,
        borderBottom: `3px solid ${primaryColor}`,
        pb: 3,
        textAlign: 'center'
      }}>
        {photo && (
          <Avatar src={photo} sx={{ 
            width: 100, height: 100, mx: 'auto', mb: 2, // Reduced avatar size/margin
            border: `3px solid ${primaryColor}`, boxShadow: 2
          }} />
        )}
        <Typography variant="h3" gutterBottom sx={{ color: nameColor, mb: 0.5 }}>
          {data.firstName} {data.lastName}
        </Typography>
        <Typography variant="h5" sx={{ color: primaryColor, mb: 1 }}>
          {data.role}
        </Typography>
        <Box sx={{ 
          display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 2, mt: 1 // Reduced gap
        }}>
          {data.phone && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Phone sx={{ color: primaryColor, mr: 0.5, fontSize: 18 }} />
              <Typography variant="body2">{data.phone}</Typography>
            </Box>
          )}
          {data.email && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Email sx={{ color: primaryColor, mr: 0.5, fontSize: 18 }} />
              <Typography variant="body2">{data.email}</Typography>
            </Box>
          )}
          {data.city && (
             <Typography variant="body2">{data.city}</Typography>
          )}
        </Box>
      </Box>
    );
  };

  const ProfileSection = () => {
    return (
      <Box sx={{ mb: sectionSpacing }}>
        <SectionHeader title="PROFESSIONAL SUMMARY" />
        <Typography variant="body2" paragraph sx={{ 
          textAlign: 'justify', lineHeight: 1.5 // Reduced line height slightly
        }}>
          {data.profile}
        </Typography>
      </Box>
    );
  };
  
  const WorkExperienceSection = () => {
    return (
      <Box sx={{ mb: sectionSpacing }}>
        <SectionHeader title="WORK EXPERIENCE" />
        {experienceData.map((work, i) => (
          <Box 
            key={i} 
            sx={{ 
              mb: sectionSpacing / 2,
              borderLeft: `3px solid ${primaryColor}`,
              pl: 3,
              ml: 1
            }}
          >
            <Typography variant="h6" gutterBottom color="primary" sx={{ fontWeight: 600, mb: 0.5 }}>
              {work.jobTitle} | {work.employer}
            </Typography>
            <Typography variant="subtitle1" gutterBottom sx={{ color: 'text.secondary', fontStyle: 'italic', mb: 0.5 }}>
              {work.companyName} | {formatDate(work.startMonth, work.startYear)} - {work.current ? 'Present' : formatDate(work.endMonth, work.endYear)}
            </Typography>
            <List dense sx={{ py: 0 }}>
              {work.description.split('\n').map((line, index) => (
                <ListItem key={index} sx={{ px: 0, py: 0.2 }}> 
                  <ListItemIcon sx={{ minWidth: 20 }}> 
                    <Box sx={{ width: 5, height: 5, backgroundColor: primaryColor, borderRadius: '50%' }} />
                  </ListItemIcon>
                  <ListItemText primary={line} />
                </ListItem>
              ))}
            </List>
          </Box>
        ))}
      </Box>
    );
  };

  const EducationSection = () => {
    return (
      <Box sx={{ mb: sectionSpacing }}>
        <SectionHeader title="EDUCATION" />
        {educationEntries.map((edu) => (
          <Box 
            key={edu.id} 
            sx={{ 
              mb: sectionSpacing / 2,
              borderLeft: `3px solid ${primaryColor}`,
              pl: 3,
              ml: 1
            }}
          >
            <Typography variant="h6" gutterBottom color="primary" sx={{ fontWeight: 600, mb: 0.5 }}>
              {edu.degree} in {edu.fieldOfStudy}
            </Typography>
            <Typography variant="subtitle1" gutterBottom sx={{ color: 'text.secondary', fontStyle: 'italic', mb: 0.5 }}>
              {edu.schoolName} | {formatDate(edu.gradMonth, edu.gradYear)}
            </Typography>
            <List dense sx={{ py: 0 }}>
              <ListItem sx={{ px: 0, py: 0.2 }}>
                <ListItemIcon sx={{ minWidth: 20 }}>
                  <Box sx={{ width: 5, height: 5, backgroundColor: primaryColor, borderRadius: '50%' }} />
                </ListItemIcon>
                <ListItemText primary={edu.schoolLocation} />
              </ListItem>
              {edu.additionalCoursework && (
                <ListItem sx={{ px: 0, py: 0.2 }}>
                  <ListItemIcon sx={{ minWidth: 20 }}>
                    <Box sx={{ width: 5, height: 5, backgroundColor: primaryColor, borderRadius: '50%' }} />
                  </ListItemIcon>
                  <ListItemText primary={`Coursework: ${edu.additionalCoursework}`} />
                </ListItem>
              )}
            </List>
          </Box>
        ))}
      </Box>
    );
  };

  const SkillsSection = () => {
    return (
      <Box sx={{ mb: sectionSpacing }}>
        <SectionHeader title="SKILLS & COMPETENCIES" />
        <Grid container spacing={1}> 
          {savedSkills.map((skill, index) => (
            <Grid item xs={12} sm={6} key={index}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ 
                  width: 5, height: 5, backgroundColor: primaryColor, borderRadius: '50%', mr: 1.5 // Reduced margin
                }} />
                <Typography variant="body2">{skill.name}</Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  };

  const CertificationsSection = () => {
      if (savedCertifications.length === 0) return null;
      return (
          <Box sx={{ mb: sectionSpacing }}>
              <SectionHeader title="CERTIFICATIONS" />
              <List dense>
                  {savedCertifications.map((cert, index) => (
                      <ListItem key={index} sx={{ px: 0, py: 0.2 }}>
                          <ListItemIcon sx={{ minWidth: 20 }}><Box sx={{ width: 5, height: 5, backgroundColor: primaryColor, borderRadius: '50%' }} /></ListItemIcon>
                          <ListItemText primary={`${cert.name} - ${cert.provider} (${cert.year})`} />
                      </ListItem>
                  ))}
              </List>
          </Box>
      );
  };
  
  const LanguagesSection = () => {
      if (savedLanguages.length === 0) return null;
      return (
          <Box sx={{ mb: sectionSpacing }}>
              <SectionHeader title="LANGUAGES" />
              <Grid container spacing={1}>
                  {savedLanguages.map((lang, index) => (
                      <Grid item xs={12} sm={6} key={index}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Box sx={{ width: 5, height: 5, backgroundColor: primaryColor, borderRadius: '50%', mr: 1.5 }} />
                              <Typography variant="body2">{lang.name} {lang.level ? `(${lang.level})` : ''}</Typography>
                          </Box>
                      </Grid>
                  ))}
              </Grid>
          </Box>
      );
  };
  

  // --- MAIN RENDER ---

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ 
        bgcolor: 'background.default', 
        minHeight: '100vh', 
        py: topBottomMargin / 10,
        background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%)'
      }}>
        
        {/* Single Page Paper - A4 Size */}
        <Paper 
          elevation={8} 
          sx={{ 
            p: sideMargins / 5, 
            borderRadius: 1,
            background: 'white',
            fontFamily: font,
            fontSize: fontSize,
            fontStyle: fontStyle,
            lineHeight: `${lineSpacing}px`,
            width: page.width, 
            minHeight: page.height, // Set min height to A4 height
            mx: 'auto',
          }}
        >
          {/* Render all sections sequentially */}
          <HeaderSection />
          <ProfileSection />
          <WorkExperienceSection />
          <EducationSection />
          <SkillsSection />
          <CertificationsSection />
          <LanguagesSection />
          
        </Paper>
      </Box>
    </ThemeProvider>
  );
};

export const resumeMeta = {
  hasPhoto: true,
  columns: 1,
  colorOptions: [
    { value: '#2d5c7f', label: 'Professional Blue' },
    { value: '#1a2b47', label: 'Dark Blue' },
    { value: '#2e7d32', label: 'Green' }
  ],
  nameColorOptions: [
    { value: '#2d5c7f', label: 'Blue' },
    { value: '#000000', label: 'Black' }
  ]
};

export default Resume14;
