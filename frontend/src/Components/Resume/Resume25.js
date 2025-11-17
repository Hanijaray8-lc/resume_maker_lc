import React from 'react';
import { 
  Container, Grid, Box, Typography, Avatar, LinearProgress, List, ListItem, ListItemText,
  ListItemIcon, Button
} from '@mui/material';
// --- Icons ---
import PhoneIcon from '@mui/icons-material/Phone';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LanguageIcon from '@mui/icons-material/Language';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

// --- Resume Data ---
const resumeData = {
  personalInfo: {
    name: "JULIANA SILVA.",
    title: "GRAPHIC DESIGNER",
    aboutMe: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.",
  },
  contact: {
    phone: "+123-456-7890",
    email: "hello@reallygreatsite.com",
    address: "123 Anywhere St., Any City",
    website: "www.reallygreatsite.com",
  },
  skills: [
    { name: "Skill 1", proficiency: 80 },
    { name: "Skill 2", proficiency: 90 },
    { name: "Skill 3", proficiency: 75 },
    { name: "Skill 4", proficiency: 60 }
  ],
  languages: [
    { name: "Indonesian" },
    { name: "English" }
  ],
 
  experience: [
    {
      years: "2017-2022",
      title: "LEADER PROJECT",
      company: "Borcelle Company",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation."
    },
    {
      years: "2014-2017",
      title: "SENIOR GRAPHIC DESIGNER",
      company: "Borcelle Company",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation."
    },
    {
      years: "2012-2014",
      title: "JUNIOR GRAPHIC DESIGNER",
      company: "Borcelle Company",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation."
    }
  ],
  education: [
    {
      years: "2015-2017",
      degree: "Master Of Graphic Designer",
      institution: "Borcelle University"
    },
    {
      years: "2010-2014",
      degree: "Major Of Graphic Designer",
      institution: "Borcelle University"
    }
  ]
};

// --- Centered Heading Component with Lines ---
const CenteredHeadingWithLines = ({ title, lineColor, centerBg }) => (
    <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        mb: 3, 
        width: '100%' 
    }}>
        {/* Left Line */}
        <Box sx={{ flexGrow: 1, height: '2px', backgroundColor: lineColor, borderRadius: '5px', maxWidth: '30px' }} />
        
        {/* Center Text with Rounded Background */}
        <Box 
            sx={{ 
                backgroundColor: centerBg, 
                color: 'white', 
                px: 3, 
                py: 1, 
                mx: 2, 
                borderRadius: '20px', 
                fontWeight: 'bold',
                textTransform: 'uppercase',
                fontSize: '0.9rem',
                whiteSpace: 'nowrap'
            }}
        >
            {title}
        </Box>
        
        {/* Right Line */}
        <Box sx={{ flexGrow: 1, height: '2px', backgroundColor: lineColor, borderRadius: '5px', maxWidth: '30px' }} />
    </Box>
);

// --- Language Proficiency Circle Component ---
const LanguageProficiency = ({ name, proficiency, accentColor }) => {
  const circleSize = 60;
  const strokeWidth = 5;
  const radius = (circleSize - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (proficiency / 100) * circumference;

  return (
    <Box sx={{ textAlign: 'center', mb: 1, px: 0.5 }}>
      <svg width={circleSize} height={circleSize} style={{ transform: 'rotate(-90deg)' }}>
        <circle
          stroke="#ccc"
          fill="transparent"
          strokeWidth={strokeWidth}
          r={radius}
          cx={circleSize / 2}
          cy={circleSize / 2}
        />
        <circle
          stroke={accentColor}
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference + ' ' + circumference}
          style={{ strokeDashoffset: offset }}
          r={radius}
          cx={circleSize / 2}
          cy={circleSize / 2}
        />
      </svg>
      <Typography variant="caption" sx={{ color: 'white', display: 'block', mt: -3 }}>
        {proficiency}%
      </Typography>
      <Typography variant="body2" sx={{ color: 'white', mt: 0.5 }}>
        {name}
      </Typography>
    </Box>
  );
};

// --- Main Resume Component ---
const Resume25 = ({ 
  color = '#3f51b5' // Single color prop with default blue
}) => {
  const data = resumeData;

  // Use the color prop for all styling
  const darkBg = color;
  const lightViolet ='#7F509E'; // Use same color for light variant
  const darkViolet = '#7F509E'; // Use same color for dark variant
  const textGray = '#E0E0E0'; 
  const lightText = '#555';    
  const lightGrayText = '#ccc'; 
  const lineViolet = color; // Color for the accent lines
 const  accentColor = lightViolet


  return (
    <Container maxWidth="md" sx={{ 
      my: 4, 
      boxShadow: 6, 
      p: 0, 
      borderRadius: '8px', 
      overflow: 'hidden',
      width: "210mm" // A4 width
    }}>
      <Grid container>
        
        {/* === LEFT COLUMN (Dark Background) === */}
        <Grid item xs={12} sm={4} sx={{width:"30%"}}>
          <Box sx={{
            backgroundColor: darkBg,
            color: textGray,
            p: 4,
            height: '100%',
            pb: { xs: 4, sm: 4 },
          }}>
            
            {/* Profile Photo */}
            <Box sx={{ 
                width: 180, 
                height: 180, 
                borderRadius: '50%', 
                overflow: 'hidden', 
                mx: 'auto', 
                mb: 4,
                border: `5px solid ${lightViolet}`,
                boxShadow: `0 0 0 3px ${darkBg}`
            }}>
              <Avatar 
                alt={data.personalInfo.name} 
                src={data.personalInfo.photoUrl} 
                sx={{ 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'cover',
                  borderRadius: '0' 
                }} 
              />
            </Box>

            {/* About Me */}
            <Box sx={{ textAlign: 'center', mb: 4 }}>
                <CenteredHeadingWithLines 
                  title="About Me" 
                  lineColor={lightViolet} 
                  centerBg={darkViolet} 
                />
                <Typography variant="body2" sx={{ color: textGray, fontSize: '0.8rem', lineHeight: 1.4, px: 2 }}>
                  {data.personalInfo.aboutMe}
                </Typography>
            </Box>
            
            {/* Skills */}
            <Box sx={{ textAlign: 'center', mb: 4 }}>
                <CenteredHeadingWithLines 
                  title="Skill" 
                  lineColor={accentColor}
                  centerBg={darkViolet} 
                />
                <List dense disablePadding>
                {data.skills.map((skill, index) => (
                    <ListItem key={index} disableGutters sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Typography sx={{ color: textGray, fontSize: '0.8rem', minWidth: '60px', textAlign: 'left', mr: 2 }}>
                            {skill.name}
                        </Typography>
                        <LinearProgress 
                            variant="determinate" 
                            value={skill.proficiency} 
                            sx={{ 
                                flexGrow: 1, 
                                height: 8, 
                                borderRadius: 5, 
                                backgroundColor: lightGrayText,
                                '& .MuiLinearProgress-bar': {
                                    backgroundColor: lightViolet
                                }
                            }} 
                        />
                    </ListItem>
                ))}
                </List>
            </Box>

            {/* Language */}
            <Box sx={{ textAlign: 'center', mb: 4 }}>
                <CenteredHeadingWithLines 
                  title="Language" 
                  lineColor={lightViolet} 
                  centerBg={darkViolet} 
                />
                <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 1 }}>
                    {data.languages.map((lang, index) => (
                        <Button 
                            key={index}
                            variant="outlined" 
                            sx={{ 
                                color: 'white', 
                                borderColor: lightViolet, 
                                borderRadius: '20px', 
                                textTransform: 'none',
                                fontSize: '0.8rem',
                                '&:hover': {
                                    backgroundColor: lightViolet,
                                    borderColor: lightViolet,
                                }
                            }}
                        >
                            {lang.name}
                        </Button>
                    ))}
                </Box>
            </Box>

          </Box>
        </Grid>
        
        {/* === RIGHT COLUMN (White Background) === */}
        <Grid item xs={12} sm={8} sx={{width:"70%"}}>
          <Box sx={{ p: 4 }}>
            
            {/* Name & Title */}
            <Typography variant="h4" sx={{ fontWeight: '900', color: darkBg, lineHeight: 1.1 }}>
              {data.personalInfo.name}
            </Typography>
            <Typography variant="h6" sx={{ color: lightText, mb: 4, fontSize: '1rem' }}>
              {data.personalInfo.title}
            </Typography>

            {/* Contact */}
            <Box sx={{ textAlign: 'center', mb: 4 }}>
                <CenteredHeadingWithLines 
                  title="Contact" 
                   lineColor={accentColor} centerBg={darkViolet}
                />
                <List dense disablePadding sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: { xs: 1, sm: 2 } }}>
                    <ListItem disableGutters sx={{ width: 'auto', py: 0.2 }}>
                        <ListItemIcon sx={{ minWidth: 30 }}><PhoneIcon sx={{ fontSize: 16, color: darkViolet }} /></ListItemIcon>
                        <ListItemText primary={data.contact.phone} primaryTypographyProps={{ color: lightText, fontSize: '0.8rem' }} />
                    </ListItem>
                    <ListItem disableGutters sx={{ width: 'auto', py: 0.2 }}>
                        <ListItemIcon sx={{ minWidth: 30 }}><MailOutlineIcon sx={{ fontSize: 16, color: darkViolet }} /></ListItemIcon>
                        <ListItemText primary={data.contact.email} primaryTypographyProps={{ color: lightText, fontSize: '0.8rem' }} />
                    </ListItem>
                    <ListItem disableGutters sx={{ width: 'auto', py: 0.2 }}>
                        <ListItemIcon sx={{ minWidth: 30 }}><LocationOnIcon sx={{ fontSize: 16, color: darkViolet }} /></ListItemIcon>
                        <ListItemText primary={data.contact.address} primaryTypographyProps={{ color: lightText, fontSize: '0.8rem' }} />
                    </ListItem>
                     <ListItem disableGutters sx={{ width: 'auto', py: 0.2 }}>
                        <ListItemIcon sx={{ minWidth: 30 }}><LanguageIcon sx={{ fontSize: 16, color: darkViolet }} /></ListItemIcon>
                        <ListItemText primary={data.contact.website} primaryTypographyProps={{ color: lightText, fontSize: '0.8rem' }} />
                    </ListItem>
                </List>
            </Box>

            {/* Experience */}
            <Box sx={{ mb: 4 }}>
              <CenteredHeadingWithLines 
                title="Experience" 
                lineColor={lineViolet} 
                centerBg={darkViolet} 
              />
              {data.experience.map((exp, index) => (
                <Box key={index} sx={{ mb: 2, display: 'flex' }}>
                    <Typography variant="caption" sx={{ color: lightText, minWidth: '80px', mr: 2, flexShrink: 0 }}>
                        {exp.years}
                    </Typography>
                    <Box>
                        <Typography variant="body1" sx={{ fontWeight: 'bold', color: darkBg, lineHeight: 1.2 }}>
                            {exp.title}
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 'bold', color: darkViolet, mb: 0.5, fontSize: '0.9rem' }}>
                            {exp.company}
                        </Typography>
                        <Typography variant="body2" sx={{ color: lightText, fontSize: '0.8rem' }}>
                            {exp.description}
                        </Typography>
                    </Box>
                </Box>
              ))}
            </Box>

            {/* Education */}
            <Box sx={{ mb: 4 }}>
              <CenteredHeadingWithLines 
                title="Education" 
                lineColor={lineViolet} 
                centerBg={darkViolet} 
              />
              {data.education.map((edu, index) => (
                <Box key={index} sx={{ mb: 2, display: 'flex' }}>
                    <Typography variant="caption" sx={{ color: lightText, minWidth: '80px', mr: 2, flexShrink: 0 }}>
                        {edu.years}
                    </Typography>
                    <Box>
                        <Typography variant="body1" sx={{ fontWeight: 'bold', color: darkBg, lineHeight: 1.2 }}>
                            {edu.degree}
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 'bold', color: darkViolet, fontSize: '0.9rem' }}>
                            {edu.institution}
                        </Typography>
                    </Box>
                </Box>
              ))}
            </Box>

          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Resume25;
export const resumeMeta = {
  hasPhoto: true,
  columns: 2,
  colorOptions: [
    { value: '#3f51b5', label: 'Blue' },
    { value: '#4caf50', label: 'Green' },
    { value: '#ff9800', label: 'Orange' },
    { value: '#f44336', label: 'Red' },
    { value: '#9c27b0', label: 'Purple' }
  ]
};
{/*import React from 'react';
import { 
  Container, Grid, Box, Typography, Avatar, LinearProgress, List, ListItem, ListItemText,
  ListItemIcon, Button
} from '@mui/material';
// --- Icons ---
import PhoneIcon from '@mui/icons-material/Phone';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LanguageIcon from '@mui/icons-material/Language';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

// --- Styling Constants ---
const darkBg = '#1A202C'; 
const lightViolet = '#C0A0E0'; 
const darkViolet = '#7F509E'; 
const textGray = '#E0E0E0'; 
const lightText = '#555';    
const lightGrayText = '#ccc'; 
const lineViolet = darkViolet; // Color for the accent lines

// --- Resume Data (Same as before) ---
const resumeData = {
  personalInfo: {
    name: "JULIANA SILVA.",
    title: "GRAPHIC DESIGNER",
    aboutMe: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.",
  },
  contact: {
    phone: "+123-456-7890",
    email: "hello@reallygreatsite.com",
    address: "123 Anywhere St., Any City",
    website: "www.reallygreatsite.com",
  },
  skills: [
    { name: "Skill 1", proficiency: 80 },
    { name: "Skill 2", proficiency: 90 },
    { name: "Skill 3", proficiency: 75 },
    { name: "Skill 4", proficiency: 60 }
  ],
  languages: [
    { name: "Indonesian" },
    { name: "English" }
  ],
 
  experience: [
    {
      years: "2017-2022",
      title: "LEADER PROJECT",
      company: "Borcelle Company",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation."
    },
    {
      years: "2014-2017",
      title: "SENIOR GRAPHIC DESIGNER",
      company: "Borcelle Company",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation."
    },
    {
      years: "2012-2014",
      title: "JUNIOR GRAPHIC DESIGNER",
      company: "Borcelle Company",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation."
    }
  ],
  education: [
    {
      years: "2015-2017",
      degree: "Master Of Graphic Designer",
      institution: "Borcelle University"
    },
    {
      years: "2010-2014",
      degree: "Major Of Graphic Designer",
      institution: "Borcelle University"
    }
  ]
};


// --- Centered Heading Component with Lines (NEW IMPLEMENTATION) ---
const CenteredHeadingWithLines = ({ title, lineColor = lineViolet, centerBg = darkViolet }) => (
    <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        mb: 3, 
        width: '100%' 
    }}>
        <Box sx={{ flexGrow: 1, height: '2px', backgroundColor: lineColor, borderRadius: '5px', maxWidth: '30px' }} />
        
        <Box 
            sx={{ 
                backgroundColor: centerBg, 
                color: 'white', 
                px: 3, 
                py: 1, 
                mx: 2, 
                borderRadius: '20px', 
                fontWeight: 'bold',
                textTransform: 'uppercase',
                fontSize: '0.9rem',
                whiteSpace: 'nowrap'
            }}
        >
            {title}
        </Box>
        
        <Box sx={{ flexGrow: 1, height: '2px', backgroundColor: lineColor, borderRadius: '5px', maxWidth: '30px' }} />
    </Box>
);


// --- Language Proficiency Circle Component (Same as before) ---
const LanguageProficiency = ({ name, proficiency }) => {
  const circleSize = 60;
  const strokeWidth = 5;
  const radius = (circleSize - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (proficiency / 100) * circumference;

  return (
    <Box sx={{ textAlign: 'center', mb: 1, px: 0.5 }}>
      <svg width={circleSize} height={circleSize} style={{ transform: 'rotate(-90deg)' }}>
        <circle
          stroke={lightGrayText}
          fill="transparent"
          strokeWidth={strokeWidth}
          r={radius}
          cx={circleSize / 2}
          cy={circleSize / 2}
        />
        <circle
          stroke="white"
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference + ' ' + circumference}
          style={{ strokeDashoffset: offset }}
          r={radius}
          cx={circleSize / 2}
          cy={circleSize / 2}
        />
      </svg>
      <Typography variant="caption" sx={{ color: 'white', display: 'block', mt: -3 }}>
        {proficiency}%
      </Typography>
      <Typography variant="body2" sx={{ color: 'white', mt: 0.5 }}>
        {name}
      </Typography>
    </Box>
  );
};


// --- Main Resume Component ---
const JulianaSilvaResume = () => {
  const data = resumeData;

  return (
    <Container maxWidth="md" sx={{ 
      my: 4, 
      boxShadow: 6, 
      p: 0, 
      borderRadius: '8px', 
      overflow: 'hidden',
      width: "210mm" // A4 width
    }}>
      <Grid container>
        
        <Grid item xs={12} sm={4} sx={{width:"30%"}}>
          <Box sx={{
            backgroundColor: darkBg,
            color: textGray,
            p: 4,
            height: '100%',
            pb: { xs: 4, sm: 4 },
          }}>
            
            <Box sx={{ 
                width: 180, 
                height: 180, 
                borderRadius: '50%', 
                overflow: 'hidden', 
                mx: 'auto', 
                mb: 4,
                border: `5px solid ${lightViolet}`,
                boxShadow: `0 0 0 3px ${darkBg}`
            }}>
              <Avatar 
                alt={data.personalInfo.name} 
                src={data.personalInfo.photoUrl} 
                sx={{ 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'cover',
                  borderRadius: '0' 
                }} 
              />
            </Box>

            <Box sx={{ textAlign: 'center', mb: 4 }}>
                <CenteredHeadingWithLines title="About Me" lineColor={lightViolet} centerBg={darkViolet} />
                <Typography variant="body2" sx={{ color: textGray, fontSize: '0.8rem', lineHeight: 1.4, px: 2 }}>
                  {data.personalInfo.aboutMe}
                </Typography>
            </Box>
            
            <Box sx={{ textAlign: 'center', mb: 4 }}>
                <CenteredHeadingWithLines title="Skill" lineColor={lightViolet} centerBg={darkViolet} />
                <List dense disablePadding>
                {data.skills.map((skill, index) => (
                    <ListItem key={index} disableGutters sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Typography sx={{ color: textGray, fontSize: '0.8rem', minWidth: '60px', textAlign: 'left', mr: 2 }}>
                            {skill.name}
                        </Typography>
                        <LinearProgress 
                            variant="determinate" 
                            value={skill.proficiency} 
                            sx={{ 
                                flexGrow: 1, 
                                height: 8, 
                                borderRadius: 5, 
                                backgroundColor: lightGrayText,
                                '& .MuiLinearProgress-bar': {
                                    backgroundColor: lightViolet
                                }
                            }} 
                        />
                    </ListItem>
                ))}
                </List>
            </Box>

            <Box sx={{ textAlign: 'center', mb: 4 }}>
                <CenteredHeadingWithLines title="Language" lineColor={lightViolet} centerBg={darkViolet} />
                <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 1 }}>
                    {data.languages.map((lang, index) => (
                        <Button 
                            key={index}
                            variant="outlined" 
                            sx={{ 
                                color: 'white', 
                                borderColor: lightViolet, 
                                borderRadius: '20px', 
                                textTransform: 'none',
                                fontSize: '0.8rem',
                                '&:hover': {
                                    backgroundColor: lightViolet,
                                    borderColor: lightViolet,
                                }
                            }}
                        >
                            {lang.name}
                        </Button>
                    ))}
                </Box>
            </Box>

          

          </Box>
        </Grid>
        
        <Grid item xs={12} sm={8} sx={{width:"70%"}}>
          <Box sx={{ p: 4 }}>
            
            <Typography variant="h4" sx={{ fontWeight: '900', color: darkBg, lineHeight: 1.1 }}>
              {data.personalInfo.name}
            </Typography>
            <Typography variant="h6" sx={{ color: lightText, mb: 4, fontSize: '1rem' }}>
              {data.personalInfo.title}
            </Typography>

            <Box sx={{ textAlign: 'center', mb: 4 }}>
                <CenteredHeadingWithLines title="Contact" lineColor={lineViolet} centerBg={darkViolet} />
                <List dense disablePadding sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: { xs: 1, sm: 2 } }}>
                    <ListItem disableGutters sx={{ width: 'auto', py: 0.2 }}>
                        <ListItemIcon sx={{ minWidth: 30 }}><PhoneIcon sx={{ fontSize: 16, color: darkViolet }} /></ListItemIcon>
                        <ListItemText primary={data.contact.phone} primaryTypographyProps={{ color: lightText, fontSize: '0.8rem' }} />
                    </ListItem>
                    <ListItem disableGutters sx={{ width: 'auto', py: 0.2 }}>
                        <ListItemIcon sx={{ minWidth: 30 }}><MailOutlineIcon sx={{ fontSize: 16, color: darkViolet }} /></ListItemIcon>
                        <ListItemText primary={data.contact.email} primaryTypographyProps={{ color: lightText, fontSize: '0.8rem' }} />
                    </ListItem>
                    <ListItem disableGutters sx={{ width: 'auto', py: 0.2 }}>
                        <ListItemIcon sx={{ minWidth: 30 }}><LocationOnIcon sx={{ fontSize: 16, color: darkViolet }} /></ListItemIcon>
                        <ListItemText primary={data.contact.address} primaryTypographyProps={{ color: lightText, fontSize: '0.8rem' }} />
                    </ListItem>
                     <ListItem disableGutters sx={{ width: 'auto', py: 0.2 }}>
                        <ListItemIcon sx={{ minWidth: 30 }}><LanguageIcon sx={{ fontSize: 16, color: darkViolet }} /></ListItemIcon>
                        <ListItemText primary={data.contact.website} primaryTypographyProps={{ color: lightText, fontSize: '0.8rem' }} />
                    </ListItem>
                </List>
            </Box>

            <Box sx={{ mb: 4 }}>
              <CenteredHeadingWithLines title="Experience" lineColor={lineViolet} centerBg={darkViolet} />
              {data.experience.map((exp, index) => (
                <Box key={index} sx={{ mb: 2, display: 'flex' }}>
                    <Typography variant="caption" sx={{ color: lightText, minWidth: '80px', mr: 2, flexShrink: 0 }}>
                        {exp.years}
                    </Typography>
                    <Box>
                        <Typography variant="body1" sx={{ fontWeight: 'bold', color: darkBg, lineHeight: 1.2 }}>
                            {exp.title}
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 'bold', color: darkViolet, mb: 0.5, fontSize: '0.9rem' }}>
                            {exp.company}
                        </Typography>
                        <Typography variant="body2" sx={{ color: lightText, fontSize: '0.8rem' }}>
                            {exp.description}
                        </Typography>
                    </Box>
                </Box>
              ))}
            </Box>

            <Box sx={{ mb: 4 }}>
              <CenteredHeadingWithLines title="Education" lineColor={lineViolet} centerBg={darkViolet} />
              {data.education.map((edu, index) => (
                <Box key={index} sx={{ mb: 2, display: 'flex' }}>
                    <Typography variant="caption" sx={{ color: lightText, minWidth: '80px', mr: 2, flexShrink: 0 }}>
                        {edu.years}
                    </Typography>
                    <Box>
                        <Typography variant="body1" sx={{ fontWeight: 'bold', color: darkBg, lineHeight: 1.2 }}>
                            {edu.degree}
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 'bold', color: darkViolet, fontSize: '0.9rem' }}>
                            {edu.institution}
                        </Typography>
                    </Box>
                </Box>
              ))}
            </Box>

          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default JulianaSilvaResume;
export const resumeMeta = {
  hasPhoto: true,
  columns: 2
};*/}