import React from 'react';
import { 
  Container, Grid, Box, Typography, Avatar, Divider, List, ListItem, ListItemText,
  ListItemIcon
} from '@mui/material';
// --- Icons ---
import PhoneIcon from '@mui/icons-material/Phone';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CircleIcon from '@mui/icons-material/Circle';
import SquareIcon from '@mui/icons-material/Square';

// --- Resume Data ---
const resumeData = {
  personalInfo: {
    name: "JONATHAN PATTERSON",
    title: "Marketing Manager",
    aboutMe: "As a marketing manager, I have had the privilege of working with a diverse range of clients across various industries. I have developed marketing methodologies, started 13 new established organizations, and have consistently delivered results that exceeded their expectations.",
    // Replace with the actual path to your profile image
    photoUrl: "https://i.imgur.com/QhT8F2P.jpg", 
  },
  contact: {
    phone: "+123-456-7890",
    email: "hello@reallygreatsite.com",
    website: "www.reallygreatsite.com",
    address: "123 Anywhere St., Any City",
  },
  skills: [
    "Management Skills", "Creativity", "Digital Marketing", "Negotiation",
    "Critical Thinking", "Leadership"
  ],
  languages: [
    { name: "English", proficiency: 100 },
    { name: "German", proficiency: 75 },
    { name: "Spanish", proficiency: 70 }
  ],
  experience: [
    {
      company: "Ginyard International Co.",
      years: "2021 - 2023",
      title: "Marketing Manager",
      bulletPoints: [
        "Support the marketing leadership team through the organization and administrative support for various projects.",
        "Conduct research for key marketing campaigns."
      ]
    },
    {
      company: "Arrowwai Industries",
      years: "2019 - 2020",
      title: "Marketing Manager",
      bulletPoints: [
        "Support the marketing leadership team through the organization and administrative support for various projects.",
        "Conduct research for key marketing campaigns."
      ]
    },
    {
      company: "Salford & Co.",
      years: "2017 - 2018",
      title: "Marketing Manager",
      bulletPoints: [
        "Support the marketing leadership team through the organization and administrative support for various projects.",
        "Conduct research for key marketing campaigns."
      ]
    }
  ],
  education: [
    {
      institution: "Borcelle University",
      years: "2014 - 2016",
      degree: "Bachelor's of Science in Marketing"
    },
    {
      institution: "Rimberio University",
      years: "2010 - 2013",
      degree: "Bachelor's of Science in Marketing"
    }
  ],
  references: [
    {
      name: "Harumi Kobayashi",
      title: "Salford & Co. / CEO",
      phone: "123-456-7890",
      email: "hello@reallygreatsite.com"
    },
    {
      name: "Bailey Dupont",
      title: "Arrowwai Industries / CEO",
      phone: "123-456-7890",
      email: "hello@reallygreatsite.com"
    }
  ]
};

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
const Resume24 = ({ 
  color = '#673ab7' // Single color prop with default purple
}) => {
  const data = resumeData;

  // Use the color prop for all styling
  const darkBlue = color;
  const lightGrayText = '#ccc';
  const sectionHeadingColor = color;
  const secondaryText = '#666';

  // Custom styling for the curved bottom of the left column
  const leftColumnStyle = {
    backgroundColor: darkBlue,
    color: 'white',
    p: 4,
    height: '100%',
    pb: { xs: 4, sm: 4 },
    borderBottomLeftRadius: '50px', 
    borderBottomRightRadius: { xs: '0', sm: '50px' },
    borderTopLeftRadius: '5px' 
  };

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
        
        {/* === LEFT COLUMN (Dark Blue) === */}
        <Grid item xs={12} sm={4} sx={{width:"30%"}}>
          <Box sx={leftColumnStyle}>
            
            {/* About Me */}
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1, textTransform: 'uppercase', fontSize: '1.1rem' }}>
              About Me
            </Typography>
            <Typography variant="body2" sx={{ color: lightGrayText, mb: 4, fontSize: '0.8rem', lineHeight: 1.4 }}>
              {data.personalInfo.aboutMe}
            </Typography>

            {/* Contact */}
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1, textTransform: 'uppercase', fontSize: '1.1rem' }}>
              Contact
            </Typography>
            <List dense disablePadding sx={{ mb: 4 }}>
              <ListItem disableGutters sx={{ py: 0.2 }}>
                <ListItemIcon sx={{ minWidth: 30 }}><PhoneIcon sx={{ fontSize: 16, color: 'white' }} /></ListItemIcon>
                <ListItemText primary={data.contact.phone} primaryTypographyProps={{ color: 'white', fontSize: '0.8rem' }} />
              </ListItem>
              <ListItem disableGutters sx={{ py: 0.2 }}>
                <ListItemIcon sx={{ minWidth: 30 }}><MailOutlineIcon sx={{ fontSize: 16, color: 'white' }} /></ListItemIcon>
                <ListItemText primary={data.contact.email} primaryTypographyProps={{ color: 'white', fontSize: '0.8rem' }} />
              </ListItem>
              <ListItem disableGutters sx={{ py: 0.2 }}>
                <ListItemIcon sx={{ minWidth: 30 }}><CircleIcon sx={{ fontSize: 16, color: 'transparent' }} /></ListItemIcon>
                <ListItemText primary={data.contact.website} primaryTypographyProps={{ color: 'white', fontSize: '0.8rem' }} />
              </ListItem>
              <ListItem disableGutters sx={{ py: 0.2 }}>
                <ListItemIcon sx={{ minWidth: 30 }}><LocationOnIcon sx={{ fontSize: 16, color: 'white' }} /></ListItemIcon>
                <ListItemText primary={data.contact.address} primaryTypographyProps={{ color: 'white', fontSize: '0.8rem' }} />
              </ListItem>
            </List>

            {/* Skills */}
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1, textTransform: 'uppercase', fontSize: '1.1rem' }}>
              Skills
            </Typography>
            <List dense disablePadding sx={{ mb: 4 }}>
              {data.skills.map((skill, index) => (
                <ListItem key={index} disableGutters sx={{ py: 0.2 }}>
                  <ListItemIcon sx={{ minWidth: 30 }}><CircleIcon sx={{ fontSize: 6, color: 'white' }} /></ListItemIcon>
                  <ListItemText primary={skill} primaryTypographyProps={{ color: 'white', fontSize: '0.8rem' }} />
                </ListItem>
              ))}
            </List>

            {/* Language */}
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1, textTransform: 'uppercase', fontSize: '1.1rem' }}>
              Language
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-around', alignItems: 'flex-end', flexWrap: 'wrap' }}>
              {data.languages.map((lang, index) => (
                <LanguageProficiency 
                  key={index} 
                  name={lang.name} 
                  proficiency={lang.proficiency} 
                  accentColor="white" 
                />
              ))}
            </Box>

          </Box>
        </Grid>
        
        {/* === RIGHT COLUMN (White) === */}
        <Grid item xs={12} sm={8} sx={{width:"70%"}}>
          <Box sx={{ p: 4 }}>
            <Box sx={{display:"flex"}}>
                <Box>
            {/* Name & Title */}
            <Typography variant="h3" sx={{ fontWeight: '900', color: darkBlue, lineHeight: 1.1 }}>
              {data.personalInfo.name}
            </Typography>
            <Typography variant="h6" sx={{ color: secondaryText, mb: 3, fontSize: '1.2rem' }}>
              {data.personalInfo.title}
            </Typography></Box>

            {/* Profile Image - Capsule Shape */}
            <Box sx={{ 
                width: '150px', 
                height: '120px', 
                borderRadius: '90px / 120px', 
                overflow: 'hidden', 
                ml: 3, 
                mb: 3,
                boxShadow: 3,
                border: `4px solid ${darkBlue}`
              }}>
              <Avatar 
                alt={data.personalInfo.name} 
                sx={{ 
                  width: '100%', 
                  height: '100%', 
                  borderRadius: '0',
                  objectFit: 'cover'
                }} 
              />
            </Box></Box>

            {/* Experience */}
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: sectionHeadingColor, mb: 2, textTransform: 'uppercase', mt: { xs: 2, sm: 0 } }}>
              Experience
            </Typography>
            {data.experience.map((exp, index) => (
              <Box key={index} sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                  <Typography variant="body1" sx={{ fontWeight: 'bold', color: sectionHeadingColor }}>
                    {exp.company}
                  </Typography>
                  <Typography variant="caption" sx={{ color: secondaryText }}>
                    {exp.years}
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ fontWeight: 'bold', color: secondaryText, mb: 1 }}>
                  {exp.title}
                </Typography>
                <List dense disablePadding sx={{ ml: -2 }}>
                  {exp.bulletPoints.map((point, i) => (
                    <ListItem key={i} sx={{ py: 0.1, alignItems: 'flex-start' }}>
                      <ListItemIcon sx={{ minWidth: 25, mt: 0.5 }}><SquareIcon sx={{ fontSize: 8, color: darkBlue }} /></ListItemIcon>
                      <ListItemText primary={point} primaryTypographyProps={{ fontSize: '0.85rem' }} />
                    </ListItem>
                  ))}
                </List>
              </Box>
            ))}
            <Divider sx={{ my: 3 }} />

            {/* Education */}
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: sectionHeadingColor, mb: 2, textTransform: 'uppercase' }}>
              Education
            </Typography>
            {data.education.map((edu, index) => (
              <Box key={index} sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                  <Typography variant="body1" sx={{ fontWeight: 'bold', color: sectionHeadingColor }}>
                    {edu.institution}
                  </Typography>
                  <Typography variant="caption" sx={{ color: secondaryText }}>
                    {edu.years}
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ fontWeight: 'bold', color: secondaryText, fontSize: '0.9rem' }}>
                  {edu.degree}
                </Typography>
              </Box>
            ))}
            <Divider sx={{ my: 3 }} />

            {/* References */}
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: sectionHeadingColor, mb: 2, textTransform: 'uppercase' }}>
              References
            </Typography>
            <Grid container spacing={2}>
              {data.references.map((ref, index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <Typography variant="body1" sx={{ fontWeight: 'bold', color: sectionHeadingColor }}>
                    {ref.name}
                  </Typography>
                  <Typography variant="body2" sx={{ color: secondaryText, fontSize: '0.85rem' }}>
                    {ref.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: secondaryText, fontSize: '0.85rem' }}>
                    Phone: {ref.phone}
                  </Typography>
                  <Typography variant="body2" sx={{ color: secondaryText, fontSize: '0.85rem' }}>
                    Email: {ref.email}
                  </Typography>
                </Grid>
              ))}
            </Grid>

          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Resume24;
export const resumeMeta = {
  hasPhoto: true,
  columns: 2,
  colorOptions: [
    { value: '#673ab7', label: 'Purple' },
    { value: '#009688', label: 'Teal' },
    { value: '#ffc107', label: 'Amber' },
    { value: '#f44336', label: 'Red' },
    { value: '#795548', label: 'Brown' }
  ]
};
{/*import React from 'react';
import { 
  Container, Grid, Box, Typography, Avatar, Divider, List, ListItem, ListItemText,
  ListItemIcon
} from '@mui/material';
// --- Icons ---
import PhoneIcon from '@mui/icons-material/Phone';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CircleIcon from '@mui/icons-material/Circle';
import SquareIcon from '@mui/icons-material/Square';

// --- Styling Constants (FIXED: Defined here) ---
const darkBlue = '#0A3870';
const lightGrayText = '#ccc';
const sectionHeadingColor = darkBlue;
const secondaryText = '#666'; // <-- THIS IS THE MISSING DEFINITION

// --- Resume Data ---
const resumeData = {
  personalInfo: {
    name: "JONATHAN PATTERSON",
    title: "Marketing Manager",
    aboutMe: "As a marketing manager, I have had the privilege of working with a diverse range of clients across various industries. I have developed marketing methodologies, started 13 new established organizations, and have consistently delivered results that exceeded their expectations.",
    // Replace with the actual path to your profile image
    photoUrl: "https://i.imgur.com/QhT8F2P.jpg", 
  },
  contact: {
    phone: "+123-456-7890",
    email: "hello@reallygreatsite.com",
    website: "www.reallygreatsite.com",
    address: "123 Anywhere St., Any City",
  },
  skills: [
    "Management Skills", "Creativity", "Digital Marketing", "Negotiation",
    "Critical Thinking", "Leadership"
  ],
  languages: [
    { name: "English", proficiency: 100 },
    { name: "German", proficiency: 75 },
    { name: "Spanish", proficiency: 70 }
  ],
  experience: [
    {
      company: "Ginyard International Co.",
      years: "2021 - 2023",
      title: "Marketing Manager",
      bulletPoints: [
        "Support the marketing leadership team through the organization and administrative support for various projects.",
        "Conduct research for key marketing campaigns."
      ]
    },
    {
      company: "Arrowwai Industries",
      years: "2019 - 2020",
      title: "Marketing Manager",
      bulletPoints: [
        "Support the marketing leadership team through the organization and administrative support for various projects.",
        "Conduct research for key marketing campaigns."
      ]
    },
    {
      company: "Salford & Co.",
      years: "2017 - 2018",
      title: "Marketing Manager",
      bulletPoints: [
        "Support the marketing leadership team through the organization and administrative support for various projects.",
        "Conduct research for key marketing campaigns."
      ]
    }
  ],
  education: [
    {
      institution: "Borcelle University",
      years: "2014 - 2016",
      degree: "Bachelor's of Science in Marketing"
    },
    {
      institution: "Rimberio University",
      years: "2010 - 2013",
      degree: "Bachelor's of Science in Marketing"
    }
  ],
  references: [
    {
      name: "Harumi Kobayashi",
      title: "Salford & Co. / CEO",
      phone: "123-456-7890",
      email: "hello@reallygreatsite.com"
    },
    {
      name: "Bailey Dupont",
      title: "Arrowwai Industries / CEO",
      phone: "123-456-7890",
      email: "hello@reallygreatsite.com"
    }
  ]
};

// --- Language Proficiency Circle Component ---
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
const JonathanPattersonResume = () => {
  const data = resumeData;

  // Custom styling for the curved bottom of the left column
  const leftColumnStyle = {
    backgroundColor: darkBlue,
    color: 'white',
    p: 4,
    height: '100%',
    pb: { xs: 4, sm: 4 },
    // Use border-radius for the curve effect visible in the design
    borderBottomLeftRadius: '50px', 
    borderBottomRightRadius: { xs: '0', sm: '50px' },
    // Add border-top-left-radius for the top-left curve as seen in the design
    borderTopLeftRadius: '5px' 
  };


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
          <Box sx={leftColumnStyle}>
            
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1, textTransform: 'uppercase', fontSize: '1.1rem' }}>
              About Me
            </Typography>
            <Typography variant="body2" sx={{ color: lightGrayText, mb: 4, fontSize: '0.8rem', lineHeight: 1.4 }}>
              {data.personalInfo.aboutMe}
            </Typography>

            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1, textTransform: 'uppercase', fontSize: '1.1rem' }}>
              Contact
            </Typography>
            <List dense disablePadding sx={{ mb: 4 }}>
              <ListItem disableGutters sx={{ py: 0.2 }}>
                <ListItemIcon sx={{ minWidth: 30 }}><PhoneIcon sx={{ fontSize: 16, color: 'white' }} /></ListItemIcon>
                <ListItemText primary={data.contact.phone} primaryTypographyProps={{ color: 'white', fontSize: '0.8rem' }} />
              </ListItem>
              <ListItem disableGutters sx={{ py: 0.2 }}>
                <ListItemIcon sx={{ minWidth: 30 }}><MailOutlineIcon sx={{ fontSize: 16, color: 'white' }} /></ListItemIcon>
                <ListItemText primary={data.contact.email} primaryTypographyProps={{ color: 'white', fontSize: '0.8rem' }} />
              </ListItem>
              <ListItem disableGutters sx={{ py: 0.2 }}>
                <ListItemIcon sx={{ minWidth: 30 }}><CircleIcon sx={{ fontSize: 16, color: 'transparent' }} /></ListItemIcon>
                <ListItemText primary={data.contact.website} primaryTypographyProps={{ color: 'white', fontSize: '0.8rem' }} />
              </ListItem>
              <ListItem disableGutters sx={{ py: 0.2 }}>
                <ListItemIcon sx={{ minWidth: 30 }}><LocationOnIcon sx={{ fontSize: 16, color: 'white' }} /></ListItemIcon>
                <ListItemText primary={data.contact.address} primaryTypographyProps={{ color: 'white', fontSize: '0.8rem' }} />
              </ListItem>
            </List>

            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1, textTransform: 'uppercase', fontSize: '1.1rem' }}>
              Skills
            </Typography>
            <List dense disablePadding sx={{ mb: 4 }}>
              {data.skills.map((skill, index) => (
                <ListItem key={index} disableGutters sx={{ py: 0.2 }}>
                  <ListItemIcon sx={{ minWidth: 30 }}><CircleIcon sx={{ fontSize: 6, color: 'white' }} /></ListItemIcon>
                  <ListItemText primary={skill} primaryTypographyProps={{ color: 'white', fontSize: '0.8rem' }} />
                </ListItem>
              ))}
            </List>

            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1, textTransform: 'uppercase', fontSize: '1.1rem' }}>
              Language
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-around', alignItems: 'flex-end', flexWrap: 'wrap' }}>
              {data.languages.map((lang, index) => (
                <LanguageProficiency key={index} name={lang.name} proficiency={lang.proficiency} />
              ))}
            </Box>

          </Box>
        </Grid>
        
        <Grid item xs={12} sm={8} sx={{width:"70%"}}>
          <Box sx={{ p: 4 }}>
            <Box sx={{display:"flex"}}>
                <Box>
            <Typography variant="h3" sx={{ fontWeight: '900', color: darkBlue, lineHeight: 1.1 }}>
              {data.personalInfo.name}
            </Typography>
            <Typography variant="h6" sx={{ color: secondaryText, mb: 3, fontSize: '1.2rem' }}>
              {data.personalInfo.title}
            </Typography></Box>

            <Box sx={{ 
                width: '150px', 
                height: '120px', 
                borderRadius: '90px / 120px', 
                overflow: 'hidden', 
                ml: 3, 
                mb: 3,
                boxShadow: 3
              }}>
              <Avatar 
                alt={data.personalInfo.name} 
                sx={{ 
                  width: '100%', 
                  height: '100%', 
                  borderRadius: '0',
                  objectFit: 'cover'
                }} 
              />
            </Box></Box>

            <Typography variant="h5" sx={{ fontWeight: 'bold', color: sectionHeadingColor, mb: 2, textTransform: 'uppercase', mt: { xs: 2, sm: 0 } }}>
              Experience
            </Typography>
            {data.experience.map((exp, index) => (
              <Box key={index} sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                  <Typography variant="body1" sx={{ fontWeight: 'bold', color: sectionHeadingColor }}>
                    {exp.company}
                  </Typography>
                  <Typography variant="caption" sx={{ color: secondaryText }}>
                    {exp.years}
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ fontWeight: 'bold', color: secondaryText, mb: 1 }}>
                  {exp.title}
                </Typography>
                <List dense disablePadding sx={{ ml: -2 }}>
                  {exp.bulletPoints.map((point, i) => (
                    <ListItem key={i} sx={{ py: 0.1, alignItems: 'flex-start' }}>
                      <ListItemIcon sx={{ minWidth: 25, mt: 0.5 }}><SquareIcon sx={{ fontSize: 8, color: darkBlue }} /></ListItemIcon>
                      <ListItemText primary={point} primaryTypographyProps={{ fontSize: '0.85rem' }} />
                    </ListItem>
                  ))}
                </List>
              </Box>
            ))}
            <Divider sx={{ my: 3 }} />

            <Typography variant="h5" sx={{ fontWeight: 'bold', color: sectionHeadingColor, mb: 2, textTransform: 'uppercase' }}>
              Education
            </Typography>
            {data.education.map((edu, index) => (
              <Box key={index} sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                  <Typography variant="body1" sx={{ fontWeight: 'bold', color: sectionHeadingColor }}>
                    {edu.institution}
                  </Typography>
                  <Typography variant="caption" sx={{ color: secondaryText }}>
                    {edu.years}
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ fontWeight: 'bold', color: secondaryText, fontSize: '0.9rem' }}>
                  {edu.degree}
                </Typography>
              </Box>
            ))}
            <Divider sx={{ my: 3 }} />

            <Typography variant="h5" sx={{ fontWeight: 'bold', color: sectionHeadingColor, mb: 2, textTransform: 'uppercase' }}>
              References
            </Typography>
            <Grid container spacing={2}>
              {data.references.map((ref, index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <Typography variant="body1" sx={{ fontWeight: 'bold', color: sectionHeadingColor }}>
                    {ref.name}
                  </Typography>
                  <Typography variant="body2" sx={{ color: secondaryText, fontSize: '0.85rem' }}>
                    {ref.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: secondaryText, fontSize: '0.85rem' }}>
                    Phone: {ref.phone}
                  </Typography>
                  <Typography variant="body2" sx={{ color: secondaryText, fontSize: '0.85rem' }}>
                    Email: {ref.email}
                  </Typography>
                </Grid>
              ))}
            </Grid>

          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default JonathanPattersonResume;
export const resumeMeta = {
  hasPhoto: true,
  columns: 2
};*/}