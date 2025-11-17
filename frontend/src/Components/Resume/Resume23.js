import React from 'react';
import { 
  Container, Grid, Box, Typography, Avatar, Divider, List, ListItem, ListItemText,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { 
  Timeline, TimelineItem, TimelineSeparator, TimelineConnector, TimelineContent, TimelineDot 
} from '@mui/lab';
// --- Icons ---
import SchoolIcon from '@mui/icons-material/School';
import WorkIcon from '@mui/icons-material/Work';
import CircleIcon from '@mui/icons-material/Circle';
import SquareIcon from '@mui/icons-material/Square';

// --- 1. RESUME DATA ---
const resumeData = {
  personalInfo: {
    name: "RICHARD SANCHEZ",
    title: "Marketing Manager",
    email: "hello@reallygreatsite.com",
    phone: "+123-456-7890",
    address: "123 Anywhere St., Any City",
    profileSummary: "I'm a passionate and results-oriented digital marketing strategist with a proven track record of unlocking growth and amplifying brand awareness for small businesses.",
  },
  skills: [
    "Project Management", "Public Relations", "Teamwork", "Time Management", 
    "Leadership", "Effective Communication", "Critical Thinking"
  ],
  languages: [
    { name: "English", proficiency: "(Fluent)" },
    { name: "French", proficiency: "(Fluent)" },
    { name: "German", proficiency: "(Basics)" },
  ],
  reference: {
    heading: "REFERENCE",
    name: "Harper Russo",
    title: "Wardiere Inc. / CEO",
    phone: "123-456-7890",
    email: "hello@reallygreatsite.com"
  },
  education: [
    {
      year: "2036",
      degree: "Master of Business Management",
      institution: "Wardiere University",
      details: "Graduated with highest honors, recognizing academic excellence.",
      gpa: "3.75/4.00"
    },
    {
      year: "2032",
      degree: "Bachelor of Business Management",
      institution: "Wardiere University",
      details: "Graduated with highest honors, recognizing academic excellence.",
      gpa: "3.75/4.00"
    }
  ],
  experience: [
    {
      year: "NOW",
      yearStart: "2032",
      title: "Marketing Manager",
      company: "Borcelle Studio",
      bulletPoints: [
        "Develop and implement comprehensive marketing strategies aligned with overall business objectives.",
        "Analyze market trends and competitor activities to identify opportunities for growth.",
      ]
    },
    {
      year: "2032",
      yearStart: "2028",
      title: "Creative Director",
      company: "Borcelle Studio",
      bulletPoints: [
        "Plan, execute, and optimize multi-channel marketing campaigns to drive brand visibility.",
        "Develop and implement comprehensive marketing strategies aligned with overall business objectives.",
      ]
    }
  ]
};

// --- 3. REUSABLE COMPONENTS ---
const CustomTimelineDot = ({ icon: Icon, color }) => (
  <Box sx={{ 
    display: 'inline-flex', 
    alignItems: 'center', 
    justifyContent: 'center', 
    width: 30, 
    height: 30, 
    borderRadius: '50%', 
    bgcolor: color,
    mr: 1 
  }}>
    <Icon sx={{ color: 'white', fontSize: 18 }} />
  </Box>
);

const LeftColumnList = ({ heading, items, useBullets = true, isMobile = false }) => (
  <Box sx={{ mb: 3 }}>
    <Typography variant="h6" sx={{ 
      fontWeight: 'bold', 
      mb: 1, 
      textTransform: 'uppercase', 
      fontSize: isMobile ? '0.9rem' : '1rem' 
    }}>
      {heading}
    </Typography>
    <List disablePadding dense sx={{ ml: -1 }}>
      {items.map((item, index) => (
        <ListItem key={index} sx={{ py: 0, pl: 0.5 }}>
          {useBullets ? (
            <SquareIcon sx={{ fontSize: 7, mr: 1, color: 'white' }} />
          ) : (
            <Box sx={{ width: 14 }} /> 
          )}
          <ListItemText 
            primary={typeof item === 'string' ? item : `${item.name} ${item.proficiency}`}
            primaryTypographyProps={{ 
              color: 'white', 
              fontSize: isMobile ? '0.8rem' : '0.9rem',
              lineHeight: 1.2
            }}
          />
        </ListItem>
      ))}
    </List>
  </Box>
);

// --- 4. MAIN RESUME COMPONENT ---
const Resume23 = ({ 
  pageSize = "A4",
  color = '#e91e63' // SINGLE COLOR PROP
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const data = resumeData;

  // Use the single color for all color properties
  const sidebarColor = color;
  const accentColor = color;
  const textColor = '#666';

  return (
    <Container maxWidth="md" sx={{ 
      my: isMobile ? 2 : 4, 
      boxShadow: isMobile ? 2 : 6, 
      p: 0, 
      bgcolor: 'white',
      width: pageSize === "A4" ? "210mm" : "216mm",
      maxWidth: '100%',
      mx: 'auto'
    }}>
      <Grid container sx={{ flexDirection: isMobile ? 'column' : 'row' }}>
        
        {/* === LEFT COLUMN (Dark Blue) === */}
        <Grid item xs={12} sm={4} sx={{
          width: isMobile ? '100%' : '30%',
          order: isMobile ? 2 : 1
        }}>
          <Box sx={{
            backgroundColor: sidebarColor,
            color: 'white',
            p: isMobile ? 2 : 4,
            height: isMobile ? 'auto' : '94.5%',
            pb: { xs: 4, sm: 4 } 
          }}>
            
            {/* Profile Photo */}
            <Avatar 
              alt={data.personalInfo.name} 
              src={data.personalInfo.photoUrl}
              sx={{ 
                width: isMobile ? 100 : 140, 
                height: isMobile ? 100 : 140, 
                mb: 3, 
                border: '4px solid white', 
                mx: 'auto'
              }} 
            />

            {/* Profile Info */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ 
                fontWeight: 'bold', 
                mb: 1, 
                textTransform: 'uppercase', 
                fontSize: isMobile ? '0.9rem' : '1rem' 
              }}>
                PROFILE INFO
              </Typography>
              <Typography variant="body2" sx={{ 
                color: 'lightgray', 
                fontSize: isMobile ? '0.8rem' : '0.85rem' 
              }}>
                {data.personalInfo.profileSummary}
              </Typography>
            </Box>
            
            {/* Skills */}
            <LeftColumnList heading="SKILLS" items={data.skills} isMobile={isMobile} />
            
            {/* Reference */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ 
                fontWeight: 'bold', 
                mb: 1, 
                textTransform: 'uppercase', 
                fontSize: isMobile ? '0.9rem' : '1rem' 
              }}>
                {data.reference.heading}
              </Typography>
              <Typography variant="body2" sx={{ 
                fontWeight: 'bold', 
                fontSize: isMobile ? '0.8rem' : '0.9rem' 
              }}>
                {data.reference.name}
              </Typography>
              <Typography variant="body2" sx={{ 
                color: 'lightgray', 
                fontSize: isMobile ? '0.75rem' : '0.8rem' 
              }}>
                {data.reference.title}
              </Typography>
              <Typography variant="body2" sx={{ 
                color: 'lightgray', 
                fontSize: isMobile ? '0.75rem' : '0.8rem' 
              }}>
                Phone: {data.reference.phone}
              </Typography>
              <Typography variant="body2" sx={{ 
                color: 'lightgray', 
                fontSize: isMobile ? '0.75rem' : '0.8rem' 
              }}>
                Email: {data.reference.email}
              </Typography>
            </Box>

            {/* Languages */}
            <LeftColumnList heading="LANGUAGES" items={data.languages} useBullets={false} isMobile={isMobile} />

          </Box>
        </Grid>
        
        {/* === RIGHT COLUMN (White) === */}
        <Grid item xs={12} sm={8} sx={{
          width: isMobile ? '100%' : '70%',
          order: isMobile ? 1 : 2
        }}>
          <Box sx={{ p: isMobile ? 2 : 4 }}>
            
            {/* Name & Contact Info */}
            <Typography variant="h3" sx={{ 
              fontWeight: '900', 
              color: accentColor,
              lineHeight: 1.1,
              fontSize: isSmallMobile ? '1.8rem' : isMobile ? '2.2rem' : '2.5rem'
            }}>
              {data.personalInfo.name}
            </Typography>
            <Typography variant="h6" sx={{ 
              color: textColor,
              mb: 2, 
              fontSize: isMobile ? '1rem' : '1.2rem' 
            }}>
              {data.personalInfo.title}
            </Typography>
            <Box sx={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              fontSize: '0.85rem', 
              color: textColor,
              mb: 2,
              flexDirection: isMobile ? 'column' : 'row',
              gap: isMobile ? 0.5 : 0
            }}>
              <Typography sx={{ fontSize: isMobile ? '0.8rem' : '0.85rem' }}>{data.personalInfo.email}</Typography>
              {!isMobile && "|"}
              <Typography sx={{ fontSize: isMobile ? '0.8rem' : '0.85rem', mx: isMobile ? 0 : 2 }}>{data.personalInfo.phone}</Typography>
              {!isMobile && "|"}
              <Typography sx={{ fontSize: isMobile ? '0.8rem' : '0.85rem', ml: isMobile ? 0 : 2 }}>{data.personalInfo.address}</Typography>
            </Box>
            
            {/* Education */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" sx={{ 
                fontWeight: 'bold', 
                color: accentColor,
                mb: 2, 
                display: 'flex', 
                alignItems: 'center',
                fontSize: isMobile ? '1.1rem' : '1.25rem'
              }}>
                <CustomTimelineDot icon={SchoolIcon} color={accentColor} />
                <Box component="span" sx={{ 
                  ml: 1, 
                  textTransform: 'uppercase', 
                  fontSize: isMobile ? '1rem' : '1.2rem' 
                }}>
                  EDUCATION
                </Box>
              </Typography>

              <Timeline sx={{ p: 0 }}>
                {data.education.map((item, index) => (
                  <TimelineItem key={index} sx={{ '&::before': { flex: 0 } }}>
                    <TimelineSeparator>
                      <TimelineDot variant="outlined" sx={{ borderColor: accentColor }} />
                      {index < data.education.length - 1 && <TimelineConnector sx={{ bgcolor: accentColor }} />}
                    </TimelineSeparator>
                    <TimelineContent sx={{ pt: 0, pb: 3, ml: isMobile ? -2 : -1 }}>
                      <Typography variant="body2" sx={{ 
                        fontWeight: 'bold',
                        fontSize: isMobile ? '0.8rem' : '0.875rem'
                      }}>
                        {item.year}
                      </Typography>
                      <Typography variant="subtitle1" sx={{ 
                        fontWeight: 'bold', 
                        color: accentColor,
                        mt: 0.5, 
                        fontSize: isMobile ? '0.9rem' : '1rem' 
                      }}>
                        {item.degree}
                      </Typography>
                      <Typography variant="body2" sx={{ 
                        fontWeight: 'bold', 
                        color: textColor,
                        fontSize: isMobile ? '0.8rem' : '0.9rem' 
                      }}>
                        {item.institution}
                      </Typography>
                      <Typography variant="caption" sx={{ 
                        color: textColor,
                        display: 'block',
                        fontSize: isMobile ? '0.75rem' : '0.8rem'
                      }}>
                        {item.details}
                      </Typography>
                      <Typography variant="caption" sx={{ 
                        display: 'block',
                        fontSize: isMobile ? '0.75rem' : '0.8rem'
                      }}>
                        GPA: {item.gpa}
                      </Typography>
                    </TimelineContent>
                  </TimelineItem>
                ))}
              </Timeline>
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Experience */}
            <Box>
              <Typography variant="h5" sx={{ 
                fontWeight: 'bold', 
                color: accentColor,
                mb: 2, 
                display: 'flex', 
                alignItems: 'center',
                fontSize: isMobile ? '1.1rem' : '1.25rem'
              }}>
                <CustomTimelineDot icon={WorkIcon} color={accentColor} />
                <Box component="span" sx={{ 
                  ml: 1, 
                  textTransform: 'uppercase', 
                  fontSize: isMobile ? '1rem' : '1.2rem' 
                }}>
                  EXPERIENCE
                </Box>
              </Typography>

              <Timeline sx={{ p: 0 }}>
                {data.experience.map((item, index) => (
                  <TimelineItem key={index} sx={{ '&::before': { flex: 0 } }}>
                    <TimelineSeparator>
                      <TimelineDot variant="outlined" sx={{ borderColor: accentColor }} />
                      {index < data.experience.length - 1 && <TimelineConnector sx={{ bgcolor: accentColor }} />}
                    </TimelineSeparator>
                    <TimelineContent sx={{ pt: 0, pb: 3, ml: isMobile ? -2 : -1 }}>
                      <Typography variant="body2" sx={{ 
                        fontWeight: 'bold',
                        fontSize: isMobile ? '0.8rem' : '0.875rem'
                      }}>
                        {item.yearStart} - {item.year}
                      </Typography>
                      <Typography variant="subtitle1" sx={{ 
                        fontWeight: 'bold', 
                        color: accentColor,
                        mt: 0.5, 
                        fontSize: isMobile ? '0.9rem' : '1rem' 
                      }}>
                        {item.title}
                      </Typography>
                      <Typography variant="body2" sx={{ 
                        fontWeight: 'bold', 
                        color: textColor,
                        fontSize: isMobile ? '0.8rem' : '0.9rem',
                        mb: 1 
                      }}>
                        {item.company}
                      </Typography>
                      
                      {/* Bullet Points */}
                      <List dense disablePadding sx={{ ml: isMobile ? -3 : -2 }}>
                        {item.bulletPoints.map((point, i) => (
                          <ListItem key={i} sx={{ py: 0.1, alignItems: 'flex-start' }}>
                            <CircleIcon sx={{ 
                              fontSize: 6, 
                              mr: 1, 
                              mt: 0.8, 
                              color: accentColor
                            }} />
                            <ListItemText 
                              primary={point} 
                              primaryTypographyProps={{ 
                                fontSize: isMobile ? '0.8rem' : '0.85rem' 
                              }} 
                            />
                          </ListItem>
                        ))}
                      </List>
                    </TimelineContent>
                  </TimelineItem>
                ))}
              </Timeline>
            </Box>

          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Resume23;
export const resumeMeta = {
  hasPhoto: true,
  columns: 2,
  colorOptions: [
    { value: '#e91e63', label: 'Pink' },
    { value: '#00bcd4', label: 'Cyan' },
    { value: '#8bc34a', label: 'Light Green' },
    { value: '#ff5722', label: 'Deep Orange' },
    { value: '#607d8b', label: 'Blue Grey' }
  ]
};
{/*import React from 'react';
import { 
  Container, Grid, Box, Typography, Avatar, Divider, List, ListItem, ListItemText,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { 
  Timeline, TimelineItem, TimelineSeparator, TimelineConnector, TimelineContent, TimelineDot 
} from '@mui/lab';
// --- Icons ---
import SchoolIcon from '@mui/icons-material/School';
import WorkIcon from '@mui/icons-material/Work';
import CircleIcon from '@mui/icons-material/Circle';
import SquareIcon from '@mui/icons-material/Square'; // Used for the square bullet points

// --- 1. RESUME DATA ---
const resumeData = {
  personalInfo: {
    name: "RICHARD SANCHEZ",
    title: "Marketing Manager",
    email: "hello@reallygreatsite.com",
    phone: "+123-456-7890",
    address: "123 Anywhere St., Any City",
    profileSummary: "I'm a passionate and results-oriented digital marketing strategist with a proven track record of unlocking growth and amplifying brand awareness for small businesses.",
  },
  skills: [
    "Project Management", "Public Relations", "Teamwork", "Time Management", 
    "Leadership", "Effective Communication", "Critical Thinking"
  ],
  languages: [
    { name: "English", proficiency: "(Fluent)" },
    { name: "French", proficiency: "(Fluent)" },
    { name: "German", proficiency: "(Basics)" },
  ],
  reference: {
    heading: "REFERENCE",
    name: "Harper Russo",
    title: "Wardiere Inc. / CEO",
    phone: "123-456-7890",
    email: "hello@reallygreatsite.com"
  },
  education: [
    {
      year: "2036",
      degree: "Master of Business Management",
      institution: "Wardiere University",
      details: "Graduated with highest honors, recognizing academic excellence.",
      gpa: "3.75/4.00"
    },
    {
      year: "2032",
      degree: "Bachelor of Business Management",
      institution: "Wardiere University",
      details: "Graduated with highest honors, recognizing academic excellence.",
      gpa: "3.75/4.00"
    }
  ],
  experience: [
    {
      year: "NOW",
      yearStart: "2032",
      title: "Marketing Manager",
      company: "Borcelle Studio",
      bulletPoints: [
        "Develop and implement comprehensive marketing strategies aligned with overall business objectives.",
        "Analyze market trends and competitor activities to identify opportunities for growth.",
      ]
    },
    {
      year: "2032",
      yearStart: "2028",
      title: "Creative Director",
      company: "Borcelle Studio",
      bulletPoints: [
        "Plan, execute, and optimize multi-channel marketing campaigns to drive brand visibility.",
        "Develop and implement comprehensive marketing strategies aligned with overall business objectives.",
      ]
    }
  ]
};

// --- 2. STYLING CONSTANTS ---
const primaryBlue = '#0A3870';
const secondaryText = '#666';

// --- 3. REUSABLE COMPONENTS ---

// Custom component for the Timeline Dot/Icon (like the Education cap)
const CustomTimelineDot = ({ icon: Icon, color }) => (
  <Box sx={{ 
    display: 'inline-flex', 
    alignItems: 'center', 
    justifyContent: 'center', 
    width: 30, 
    height: 30, 
    borderRadius: '50%', 
    bgcolor: color || primaryBlue, 
    mr: 1 
  }}>
    <Icon sx={{ color: 'white', fontSize: 18 }} />
  </Box>
);

// Reusable component for the Skills and Languages lists in the dark column
const LeftColumnList = ({ heading, items, useBullets = true, isMobile = false }) => (
  <Box sx={{ mb: 3 }}>
    <Typography variant="h6" sx={{ 
      fontWeight: 'bold', 
      mb: 1, 
      textTransform: 'uppercase', 
      fontSize: isMobile ? '0.9rem' : '1rem' 
    }}>
      {heading}
    </Typography>
    <List disablePadding dense sx={{ ml: -1 }}>
      {items.map((item, index) => (
        <ListItem key={index} sx={{ py: 0, pl: 0.5 }}>
          {useBullets ? (
            <SquareIcon sx={{ fontSize: 7, mr: 1, color: 'white' }} />
          ) : (
            // Empty space for Languages section where bullets are absent
            <Box sx={{ width: 14 }} /> 
          )}
          <ListItemText 
            primary={typeof item === 'string' ? item : `${item.name} ${item.proficiency}`}
            primaryTypographyProps={{ 
              color: 'white', 
              fontSize: isMobile ? '0.8rem' : '0.9rem',
              lineHeight: 1.2
            }}
          />
        </ListItem>
      ))}
    </List>
  </Box>
);

// --- 4. MAIN RESUME COMPONENT ---
const RichardSanchezResume = ({ pageSize = "A4" }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const data = resumeData;

  return (
    // Outer container with A4-like max-width and border shadow
    <Container maxWidth="md" sx={{ 
      my: isMobile ? 2 : 4, 
      boxShadow: isMobile ? 2 : 6, 
      p: 0, 
      bgcolor: 'white',
      width: pageSize === "A4" ? "210mm" : "216mm",
      maxWidth: '100%',
      mx: 'auto'
    }}>
      <Grid container sx={{ flexDirection: isMobile ? 'column' : 'row' }}>
        
        <Grid item xs={12} sm={4} sx={{
          width: isMobile ? '100%' : '30%',
          order: isMobile ? 2 : 1
        }}>
          <Box sx={{
            backgroundColor: primaryBlue,
            color: 'white',
            p: isMobile ? 2 : 4,
            height: isMobile ? 'auto' : '94.5%',
            pb: { xs: 4, sm: 4 } 
          }}>
            
            <Avatar 
              alt={data.personalInfo.name} 
              src={data.personalInfo.photoUrl}
              sx={{ 
                width: isMobile ? 100 : 140, 
                height: isMobile ? 100 : 140, 
                mb: 3, 
                border: '4px solid white', 
                mx: 'auto' // Center the image
              }} 
            />

            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ 
                fontWeight: 'bold', 
                mb: 1, 
                textTransform: 'uppercase', 
                fontSize: isMobile ? '0.9rem' : '1rem' 
              }}>
                PROFILE INFO
              </Typography>
              <Typography variant="body2" sx={{ 
                color: 'lightgray', 
                fontSize: isMobile ? '0.8rem' : '0.85rem' 
              }}>
                {data.personalInfo.profileSummary}
              </Typography>
            </Box>
            
            <LeftColumnList heading="SKILLS" items={data.skills} isMobile={isMobile} />
            
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ 
                fontWeight: 'bold', 
                mb: 1, 
                textTransform: 'uppercase', 
                fontSize: isMobile ? '0.9rem' : '1rem' 
              }}>
                {data.reference.heading}
              </Typography>
              <Typography variant="body2" sx={{ 
                fontWeight: 'bold', 
                fontSize: isMobile ? '0.8rem' : '0.9rem' 
              }}>
                {data.reference.name}
              </Typography>
              <Typography variant="body2" sx={{ 
                color: 'lightgray', 
                fontSize: isMobile ? '0.75rem' : '0.8rem' 
              }}>
                {data.reference.title}
              </Typography>
              <Typography variant="body2" sx={{ 
                color: 'lightgray', 
                fontSize: isMobile ? '0.75rem' : '0.8rem' 
              }}>
                Phone: {data.reference.phone}
              </Typography>
              <Typography variant="body2" sx={{ 
                color: 'lightgray', 
                fontSize: isMobile ? '0.75rem' : '0.8rem' 
              }}>
                Email: {data.reference.email}
              </Typography>
            </Box>

            <LeftColumnList heading="LANGUAGES" items={data.languages} useBullets={false} isMobile={isMobile} />

          </Box>
        </Grid>
        
        <Grid item xs={12} sm={8} sx={{
          width: isMobile ? '100%' : '70%',
          order: isMobile ? 1 : 2
        }}>
          <Box sx={{ p: isMobile ? 2 : 4 }}>
            
            <Typography variant="h3" sx={{ 
              fontWeight: '900', 
              color: primaryBlue, 
              lineHeight: 1.1,
              fontSize: isSmallMobile ? '1.8rem' : isMobile ? '2.2rem' : '2.5rem'
            }}>
              {data.personalInfo.name}
            </Typography>
            <Typography variant="h6" sx={{ 
              color: secondaryText, 
              mb: 2, 
              fontSize: isMobile ? '1rem' : '1.2rem' 
            }}>
              {data.personalInfo.title}
            </Typography>
            <Box sx={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              fontSize: '0.85rem', 
              color: secondaryText, 
              mb: 2,
              flexDirection: isMobile ? 'column' : 'row',
              gap: isMobile ? 0.5 : 0
            }}>
              <Typography sx={{ fontSize: isMobile ? '0.8rem' : '0.85rem' }}>{data.personalInfo.email}</Typography>
              {!isMobile && "|"}
              <Typography sx={{ fontSize: isMobile ? '0.8rem' : '0.85rem', mx: isMobile ? 0 : 2 }}>{data.personalInfo.phone}</Typography>
              {!isMobile && "|"}
              <Typography sx={{ fontSize: isMobile ? '0.8rem' : '0.85rem', ml: isMobile ? 0 : 2 }}>{data.personalInfo.address}</Typography>
            </Box>
            
            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" sx={{ 
                fontWeight: 'bold', 
                color: primaryBlue, 
                mb: 2, 
                display: 'flex', 
                alignItems: 'center',
                fontSize: isMobile ? '1.1rem' : '1.25rem'
              }}>
                <CustomTimelineDot icon={SchoolIcon} />
                <Box component="span" sx={{ 
                  ml: 1, 
                  textTransform: 'uppercase', 
                  fontSize: isMobile ? '1rem' : '1.2rem' 
                }}>
                  EDUCATION
                </Box>
              </Typography>

              <Timeline sx={{ p: 0 }}>
                {data.education.map((item, index) => (
                  <TimelineItem key={index} sx={{ '&::before': { flex: 0 } }}>
                    <TimelineSeparator>
                      <TimelineDot variant="outlined" color="primary" sx={{ borderColor: primaryBlue }} />
                      {index < data.education.length - 1 && <TimelineConnector sx={{ bgcolor: primaryBlue }} />}
                    </TimelineSeparator>
                    <TimelineContent sx={{ pt: 0, pb: 3, ml: isMobile ? -2 : -1 }}>
                      <Typography variant="body2" sx={{ 
                        fontWeight: 'bold',
                        fontSize: isMobile ? '0.8rem' : '0.875rem'
                      }}>
                        {item.year}
                      </Typography>
                      <Typography variant="subtitle1" sx={{ 
                        fontWeight: 'bold', 
                        color: primaryBlue, 
                        mt: 0.5, 
                        fontSize: isMobile ? '0.9rem' : '1rem' 
                      }}>
                        {item.degree}
                      </Typography>
                      <Typography variant="body2" sx={{ 
                        fontWeight: 'bold', 
                        color: secondaryText, 
                        fontSize: isMobile ? '0.8rem' : '0.9rem' 
                      }}>
                        {item.institution}
                      </Typography>
                      <Typography variant="caption" sx={{ 
                        color: secondaryText, 
                        display: 'block',
                        fontSize: isMobile ? '0.75rem' : '0.8rem'
                      }}>
                        {item.details}
                      </Typography>
                      <Typography variant="caption" sx={{ 
                        display: 'block',
                        fontSize: isMobile ? '0.75rem' : '0.8rem'
                      }}>
                        GPA: {item.gpa}
                      </Typography>
                    </TimelineContent>
                  </TimelineItem>
                ))}
              </Timeline>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box>
              <Typography variant="h5" sx={{ 
                fontWeight: 'bold', 
                color: primaryBlue, 
                mb: 2, 
                display: 'flex', 
                alignItems: 'center',
                fontSize: isMobile ? '1.1rem' : '1.25rem'
              }}>
                <CustomTimelineDot icon={WorkIcon} />
                <Box component="span" sx={{ 
                  ml: 1, 
                  textTransform: 'uppercase', 
                  fontSize: isMobile ? '1rem' : '1.2rem' 
                }}>
                  EXPERIENCE
                </Box>
              </Typography>

              <Timeline sx={{ p: 0 }}>
                {data.experience.map((item, index) => (
                  <TimelineItem key={index} sx={{ '&::before': { flex: 0 } }}>
                    <TimelineSeparator>
                      <TimelineDot variant="outlined" color="primary" sx={{ borderColor: primaryBlue }} />
                      {index < data.experience.length - 1 && <TimelineConnector sx={{ bgcolor: primaryBlue }} />}
                    </TimelineSeparator>
                    <TimelineContent sx={{ pt: 0, pb: 3, ml: isMobile ? -2 : -1 }}>
                      <Typography variant="body2" sx={{ 
                        fontWeight: 'bold',
                        fontSize: isMobile ? '0.8rem' : '0.875rem'
                      }}>
                        {item.yearStart} - {item.year}
                      </Typography>
                      <Typography variant="subtitle1" sx={{ 
                        fontWeight: 'bold', 
                        color: primaryBlue, 
                        mt: 0.5, 
                        fontSize: isMobile ? '0.9rem' : '1rem' 
                      }}>
                        {item.title}
                      </Typography>
                      <Typography variant="body2" sx={{ 
                        fontWeight: 'bold', 
                        color: secondaryText, 
                        fontSize: isMobile ? '0.8rem' : '0.9rem',
                        mb: 1 
                      }}>
                        {item.company}
                      </Typography>
                      
                      <List dense disablePadding sx={{ ml: isMobile ? -3 : -2 }}>
                        {item.bulletPoints.map((point, i) => (
                          <ListItem key={i} sx={{ py: 0.1, alignItems: 'flex-start' }}>
                            <CircleIcon sx={{ 
                              fontSize: 6, 
                              mr: 1, 
                              mt: 0.8, 
                              color: primaryBlue 
                            }} />
                            <ListItemText 
                              primary={point} 
                              primaryTypographyProps={{ 
                                fontSize: isMobile ? '0.8rem' : '0.85rem' 
                              }} 
                            />
                          </ListItem>
                        ))}
                      </List>
                    </TimelineContent>
                  </TimelineItem>
                ))}
              </Timeline>
            </Box>

          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default RichardSanchezResume;
export const resumeMeta = {
  hasPhoto: true,
  columns: 2
};*/}