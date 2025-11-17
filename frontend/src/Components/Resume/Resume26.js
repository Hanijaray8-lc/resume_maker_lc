import React from 'react';
import { 
  Container, Grid, Box, Typography, Avatar, LinearProgress, List, ListItem, ListItemText,
  ListItemIcon
} from '@mui/material';
// --- Icons ---
import PhoneIcon from '@mui/icons-material/Phone';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WebIcon from '@mui/icons-material/Web';
import CircleIcon from '@mui/icons-material/Circle';
import WorkIcon from '@mui/icons-material/Work';
import SchoolIcon from '@mui/icons-material/School';
import PersonIcon from '@mui/icons-material/Person';

// --- Resume Data ---
const resumeData = {
  personalInfo: {
    name: "AARTHI R.",
    title: "PRODUCT DESIGNER",
    summary: "Highly motivated and results-oriented Product Designer with 5+ years of experience in leading end-to-end design processes for SaaS and mobile applications. Expertise in user research, prototyping, and design system creation. Focused on delivering elegant, user-centric solutions.",
    photoUrl: "https://i.imgur.com/K1K0d7Q.jpeg", // Placeholder image
  },
  contact: [
    { icon: PhoneIcon, text: "+91 98765 43210" },
    { icon: MailOutlineIcon, text: "aarthi.design@email.com" },
    { icon: LocationOnIcon, text: "Chennai, Tamil Nadu" },
    { icon: WebIcon, text: "www.portfolio.com" },
  ],
  skills: [
    { name: "Figma", level: 95 },
    { name: "UX Research", level: 85 },
    { name: "Prototyping (Principle)", level: 80 },
    { name: "HTML/CSS", level: 70 },
  ],
  experience: [
    {
      company: "TechSolutions Inc.",
      years: "2021 - Present",
      title: "Senior Product Designer",
      description: "Led design for core features of the flagship B2B platform. Reduced task completion time by 15% through iterative usability testing and redesign. Mentored junior designers.",
    },
    {
      company: "Creative Studio",
      years: "2018 - 2021",
      title: "UX/UI Designer",
      description: "Developed and maintained the company's first comprehensive design system, improving team efficiency by 25%. Designed five successful mobile applications.",
    },
  ],
  education: [
    {
      institution: "Anna University",
      years: "2014 - 2018",
      degree: "B.E. Computer Science & Engineering",
    },
    {
      institution: "IIT Madras",
      years: "2019 - 2020",
      degree: "Certification in Advanced Interaction Design",
    },
  ],
  interests: ["Photography", "Travel", "Sketching", "Fitness"]
};

// --- Reusable Component for Section Heading ---
const SectionHeader = ({ title, icon: Icon, primaryColor, accentColor }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, borderBottom: `2px solid ${accentColor}`, pb: 0.5 }}>
    <Icon sx={{ color: primaryColor, mr: 1.5, fontSize: 24 }} />
    <Typography variant="h6" sx={{ fontWeight: 'bold', color: primaryColor, textTransform: 'uppercase', letterSpacing: 1 }}>
      {title}
    </Typography>
  </Box>
);

// --- Main Resume Component ---
const Resume26 = ({ 
  color = '#2196f3' // Single color prop with default blue
}) => {
  const data = resumeData;

  // Use the color prop for all styling
  const primaryColor = color;
  const accentColor = color; // Use same color for accent
  const textDark = '#333333';
  const textLight = '#666666';
  const primaryLight = '#7FFFD4'; // Light Cyan/Aqua
const primaryDark = '#008080';  // Dark Teal
const backgroundGray = '#d2fbf9ff';
const mainContainerBg = '#eaf5f4ff';


  // Custom style for the large name box
  const nameBoxStyle = {
    px: 4, 
    py: 4, 
    backgroundColor: 'white',
    borderBottom: `5px solid ${accentColor}`,
    position: 'relative',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
  };

  return (
    <Container maxWidth="md" sx={{ 
      my: 4, 
      p: 0, 
      bgcolor: mainContainerBg,
      width: "210mm" // A4 width
    }}>
      
      {/* --- HEADER SECTION --- */}
      <Box sx={nameBoxStyle}>
        <Grid container spacing={4} alignItems="center">
          
          {/* Avatar (Hidden on small screens, shown next to name on large screens) */}
          <Grid item xs={12} sm={2} sx={{ display: { xs: 'none', sm: 'block' } }}>
            <Avatar 
              alt={data.personalInfo.name} 
              src={data.personalInfo.photoUrl} 
              sx={{ 
                width: 100, 
                height: 100, 
                border: `3px solid ${primaryColor}`, 
                boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)'
              }} 
            />
          </Grid>
          
          {/* Name and Title */}
          <Grid item xs={12} sm={10}>
            <Typography variant="h2" sx={{ fontWeight: '900', color: textDark, lineHeight: 1.1, fontSize: { xs: '2.5rem', sm: '3.5rem' } }}>
              {data.personalInfo.name}
            </Typography>
            <Typography variant="h5" sx={{ color: primaryColor, fontWeight: 'bold', letterSpacing: 2, textTransform: 'uppercase', mt: 0.5 }}>
              {data.personalInfo.title}
            </Typography>
          </Grid>
        </Grid>
      </Box>

      {/* --- MAIN CONTENT GRID --- */}
      <Grid container>
        
        {/* === LEFT COLUMN (Contact, Skills, Interests) === */}
        <Grid item xs={12} sm={4} sx={{width:"30%"}}>
          <Box sx={{
            backgroundColor: backgroundGray,
            color: textLight,
            p: 4,
            height: '93%',
          }}>
            
            {/* Contact Info */}
            <Box sx={{ mb: 4 }}>
              <SectionHeader 
                title="Contact" 
                icon={PhoneIcon} 
                primaryColor={primaryColor}
                accentColor={accentColor}
              />
              <List dense disablePadding>
                {data.contact.map((item, index) => (
                  <ListItem key={index} disableGutters sx={{ py: 0.5 }}>
                    <ListItemIcon sx={{ minWidth: 35 }}>
                      <item.icon sx={{ fontSize: 18, color: primaryColor }} />
                    </ListItemIcon>
                    <ListItemText 
                      primary={item.text} 
                      primaryTypographyProps={{ color: textLight, fontSize: '0.9rem' }} 
                    />
                  </ListItem>
                ))}
              </List>
            </Box>

            {/* Skills */}
            <Box sx={{ mb: 4 }}>
              <SectionHeader 
                title="Skills" 
                icon={CircleIcon} 
                primaryColor={primaryColor}
                accentColor={accentColor}
              />
              <List dense disablePadding>
                {data.skills.map((skill, index) => (
                  <ListItem key={index} disableGutters sx={{ display: 'block', mb: 1.5 }}>
                    <Typography variant="body2" sx={{ color: textLight, fontWeight: 'bold', mb: 0.5 }}>
                      {skill.name}
                    </Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={skill.level} 
                      sx={{ 
                        height: 6, 
                        borderRadius: 3, 
                        backgroundColor: '#E0E0E0',
                        '& .MuiLinearProgress-bar': {
                            backgroundColor: accentColor,
                        }
                      }} 
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
            
            {/* Interests */}
            <Box>
              <SectionHeader 
                title="Interests" 
                icon={CircleIcon} 
                primaryColor={primaryColor}
                accentColor={accentColor}
              />
              <Typography variant="body2" sx={{ color: textLight, fontSize: '0.9rem' }}>
                {data.interests.join(' | ')}
              </Typography>
            </Box>

          </Box>
        </Grid>
        
        {/* === RIGHT COLUMN (Profile, Experience and Education) === */}
        <Grid item xs={12} sm={8} sx={{width:"70%",}}>
          <Box sx={{ p: 4 }}>
            
            {/* Profile Section - Moved to Right Column */}
            <Box sx={{ mb: 5 }}>
              <SectionHeader 
                title="Profile" 
                icon={PersonIcon} 
                primaryColor={primaryColor}
                accentColor={accentColor}
              />
              <Typography variant="body2" sx={{ color: textLight, fontSize: '0.95rem', lineHeight: 1.6, textAlign: 'justify' }}>
                {data.personalInfo.summary}
              </Typography>
            </Box>

            {/* Experience */}
            <Box sx={{ mb: 5 }}>
              <SectionHeader 
                title="Experience" 
                icon={WorkIcon} 
                primaryColor={primaryColor}
                accentColor={accentColor}
              />
              {data.experience.map((exp, index) => (
                <Box key={index} sx={{ mb: 3, borderLeft: `3px solid ${accentColor}`, pl: 2 }}>
                  <Typography variant="caption" sx={{ color: primaryColor, fontWeight: 'bold' }}>
                    {exp.years}
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: textDark, mt: 0.5, lineHeight: 1.2 }}>
                    {exp.title}
                  </Typography>
                  <Typography variant="body1" sx={{ color: textLight, mb: 1, fontStyle: 'italic' }}>
                    {exp.company}
                  </Typography>
                  <Typography variant="body2" sx={{ color: textLight, fontSize: '0.9rem' }}>
                    {exp.description}
                  </Typography>
                </Box>
              ))}
            </Box>

            {/* Education */}
            <Box>
              <SectionHeader 
                title="Education" 
                icon={SchoolIcon} 
                primaryColor={primaryColor}
                accentColor={accentColor}
              />
              {data.education.map((edu, index) => (
                <Box key={index} sx={{ mb: 3, borderLeft: `3px solid ${accentColor}`, pl: 2 }}>
                  <Typography variant="caption" sx={{ color: primaryColor, fontWeight: 'bold' }}>
                    {edu.years}
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: textDark, mt: 0.5, lineHeight: 1.2 }}>
                    {edu.degree}
                  </Typography>
                  <Typography variant="body1" sx={{ color: textLight, fontStyle: 'italic' }}>
                    {edu.institution}
                  </Typography>
                </Box>
              ))}
            </Box>

          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Resume26;
export const resumeMeta = {
  hasPhoto: true,
  columns: 2,
  colorOptions: [
    { value: '#2196f3', label: 'Blue' },
    { value: '#ff5722', label: 'Orange' },
    { value: '#4caf50', label: 'Green' },
    { value: '#9c27b0', label: 'Purple' },
    { value: '#607d8b', label: 'Blue Grey' }
  ]
};
