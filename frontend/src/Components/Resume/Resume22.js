import React from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  Divider,
  Chip,
  Container,
  useTheme,
  useMediaQuery,
  Avatar
} from '@mui/material';
import { 
  Email, 
  Phone, 
  LocationOn, 
  Language 
} from '@mui/icons-material';

const Resume22 = ({ 
  color = '#2c3e50', // Default header/sidebar color
  nameColor = '#ffffff', // Default name color
  accentColor = '#e74c3c' // Default accent color (red)
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const personalInfo = {
    name: "JONATHAN",
    surname: "PATTERSON",
    title: "Art Director",
    contact: {
      phone: "+123-456-7890",
      email: "hello@reallygreatsite.com",
      address: "123 Anywhere St., Any City",
      website: "www.reallygreatsite.com"
    }
  };

  const education = [
    {
      period: "2004-2017",
      degree: "BACHELOR OF DESIGN",
      institution: "WARNING UNIVERSITY",
      description: "Graduated in Visual Designing"
    },
    {
      period: "2003-2018",
      degree: "BACHELOR OF DESIGN",
      institution: "WARNING UNIVERSITY",
      description: "Graduated in Visual Designing"
    }
  ];

  const experience = [
    {
      period: "2009-2020",
      company: "STUDIO SHOWER",
      position: "Graphic Designer",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
    },
  ];

  const skills = [
    "Creativity", "Digital Marketing",
  ];

  const languages = [
    { language: "English", level: "Native" },
    { language: "German", level: "Basic" },
    { language: "Spanish", level: "Basic" }
  ];

  const achievements = [
    {
      period: "2012-2018",
      description: "exerciti per of internship In our company worth over $500miles"
    },
    {
      period: "2015-2020",
      description: "exerciti per of internship Microsoft has projects"
    }
  ];

  const profileText = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam quis nostrud exercitation. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut dolore et dolore magna aliqua. Ut enim ad minim veniam quis nostrud exercitation.";

  return (
    <Box sx={{ 
      py: isMobile ? 2 : 4,
      width: "210mm",
      maxWidth: '100%',
      mx: 'auto'
    }}>
      <Card sx={{ 
        boxShadow: isMobile ? 1 : 3, 
        borderRadius: 2, 
        overflow: 'hidden',
        mx: 'auto'
      }}>
        <CardContent sx={{ p: 0 }}>
          {/* Header Section */}
          <Box sx={{ 
            backgroundColor: color, 
            color: nameColor,
            p: isMobile ? 2 : 4,
            textAlign: 'center',
            pl: 10,
            position: 'relative'
          }}>
            <Typography variant="h2" sx={{ 
              fontWeight: 'bold', 
              fontSize: isSmallMobile ? '1.5rem' : isMobile ? '2rem' : '3rem',
              letterSpacing: isMobile ? 1 : 2,
              lineHeight: 1.2
            }}>
              {personalInfo.name}
            </Typography>
            <Typography variant="h2" sx={{ 
              fontWeight: 'bold', 
              fontSize: isSmallMobile ? '1.5rem' : isMobile ? '2rem' : '3rem',
              letterSpacing: isMobile ? 1 : 2,
              lineHeight: 1.2
            }}>
              {personalInfo.surname}
            </Typography>
            <Typography variant="h5" sx={{ 
              mt: 1, 
              opacity: 0.9,
              letterSpacing: isMobile ? 0.5 : 1,
              fontSize: isSmallMobile ? '1rem' : isMobile ? '1.25rem' : '1.5rem'
            }}>
              {personalInfo.title}
            </Typography>
          </Box>

          <Grid container sx={{ 
            position: 'relative', 
            minHeight: isMobile ? 'auto' : '800px' 
          }}>
            {/* Left Sidebar */}
          <Grid item xs={12} md={4} sx={{ 
  backgroundColor: color,
  color: 'white',
  p: isMobile ? 2 : 3,
  width: isMobile ? '100%' : '29%',
  position: isMobile ? 'static' : 'relative',
  top: isMobile ? 0 : -100,
  borderTopLeftRadius: isMobile ? 0 : '50px',
  borderTopRightRadius: isMobile ? 0 : '50px',
  borderBottomLeftRadius: isMobile ? 0 : '8px',
  ml: isMobile ? 0 : 1,
  mt: isMobile ? 0 : '-100px',
  mb: isMobile ? 0 : 0,
  order: isMobile ? 2 : 1,
  // Shadow properties add pannunga
  boxShadow: isMobile ? '0 2px 8px rgba(0,0,0,0.1)' : '0 4px 12px rgba(0,0,0,0.15)',
  zIndex: 2
}}>
              {/* Profile Photo Container */}
              <Box sx={{ 
                position: isMobile ? 'relative' : 'absolute',
                left: isMobile ? 'auto' : '50%',
                transform: isMobile ? 'none' : 'translateX(-50%)',
                width: isMobile ? 100 : 140,
                height: isMobile ? 100 : 140,
                borderRadius: '50%',
                border: '6px solid white',
                backgroundColor: 'white',
                boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                zIndex: 10,
                mx: isMobile ? 'auto' : 'none',
                mb: isMobile ? 2 : 0,
                mt: isMobile ? -50 : 0
              }}>
                <Avatar 
                  sx={{ 
                    width: isMobile ? 88 : 128, 
                    height: isMobile ? 88 : 128, 
                    borderRadius: '50%'
                  }}
                  src="/path-to-your-photo.jpg"
                >
                  <Typography variant="h4" sx={{ 
                    fontWeight: 'bold', 
                    color: color,
                    fontSize: isMobile ? '1.5rem' : '2rem'
                  }}>
                    JP
                  </Typography>
                </Avatar>
              </Box>

              {/* Sidebar Content */}
              <Box sx={{ mt: isMobile ? 4 : 12 }}>

                {/* Contact Information */}
                <Box sx={{ mb: 3, mt: isMobile ? 0 : 20 }}>
                  <Typography variant="h6" sx={{ 
                    fontWeight: 'bold', 
                    mb: 2,
                    color: '#ecf0f1',
                    fontSize: isMobile ? '1rem' : '1.1rem',
                    borderBottom: `2px solid ${accentColor}`,
                    pb: 0.5,
                    display: 'inline-block'
                  }}>
                    CONTACT
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                    <Phone sx={{ fontSize: isMobile ? 16 : 18, mr: 1.5, color: accentColor }} />
                    <Typography variant="body2" sx={{ 
                      color: '#ecf0f1',
                      fontSize: isMobile ? '0.8rem' : '0.875rem'
                    }}>
                      {personalInfo.contact.phone}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                    <Email sx={{ fontSize: isMobile ? 16 : 18, mr: 1.5, color: accentColor }} />
                    <Typography variant="body2" sx={{ 
                      color: '#ecf0f1',
                      fontSize: isMobile ? '0.8rem' : '0.875rem'
                    }}>
                      {personalInfo.contact.email}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                    <LocationOn sx={{ fontSize: isMobile ? 16 : 18, mr: 1.5, color: accentColor }} />
                    <Typography variant="body2" sx={{ 
                      color: '#ecf0f1',
                      fontSize: isMobile ? '0.8rem' : '0.875rem'
                    }}>
                      {personalInfo.contact.address}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                    <Language sx={{ fontSize: isMobile ? 16 : 18, mr: 1.5, color: accentColor }} />
                    <Typography variant="body2" sx={{ 
                      color: '#ecf0f1',
                      fontSize: isMobile ? '0.8rem' : '0.875rem'
                    }}>
                      {personalInfo.contact.website}
                    </Typography>
                  </Box>
                </Box>

                <Divider sx={{ my: 2, backgroundColor: '#7f8c8d' }} />

                {/* Skills */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" sx={{ 
                    fontWeight: 'bold', 
                    mb: 2,
                    color: '#ecf0f1',
                    fontSize: isMobile ? '1rem' : '1.1rem',
                    borderBottom: `2px solid ${accentColor}`,
                    pb: 0.5,
                    display: 'inline-block'
                  }}>
                    SKILLS
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {skills.map((skill, index) => (
                      <Chip 
                        key={index}
                        label={skill}
                        size="small"
                        sx={{ 
                          mb: 1,
                          backgroundColor: accentColor,
                          color: 'white',
                          fontWeight: 'bold',
                          fontSize: isMobile ? '0.7rem' : '0.75rem',
                          height: isMobile ? 24 : 32
                        }}
                      />
                    ))}
                  </Box>
                </Box>

                <Divider sx={{ my: 2, backgroundColor: '#7f8c8d' }} />

                {/* Languages */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" sx={{ 
                    fontWeight: 'bold', 
                    mb: 2,
                    color: '#ecf0f1',
                    fontSize: isMobile ? '1rem' : '1.1rem',
                    borderBottom: `2px solid ${accentColor}`,
                    pb: 0.5,
                    display: 'inline-block'
                  }}>
                    LANGUAGES
                  </Typography>
                  {languages.map((lang, index) => (
                    <Box key={index} sx={{ mb: 1.5 }}>
                      <Typography variant="body2" sx={{ 
                        fontWeight: 'bold',
                        color: '#ecf0f1',
                        fontSize: isMobile ? '0.8rem' : '0.875rem'
                      }}>
                        {lang.language}
                      </Typography>
                      <Typography variant="body2" sx={{ 
                        color: '#bdc3c7',
                        fontStyle: 'italic',
                        fontSize: isMobile ? '0.75rem' : '0.875rem'
                      }}>
                        {lang.level}
                      </Typography>
                    </Box>
                  ))}
                </Box>

                <Divider sx={{ my: 2, backgroundColor: '#7f8c8d' }} />

                {/* Achievements */}
                <Box>
                  <Typography variant="h6" sx={{ 
                    fontWeight: 'bold', 
                    mb: 2,
                    color: '#ecf0f1',
                    fontSize: isMobile ? '1rem' : '1.1rem',
                    borderBottom: `2px solid ${accentColor}`,
                    pb: 0.5,
                    display: 'inline-block'
                  }}>
                    ACHIEVEMENT
                  </Typography>
                  {achievements.map((achievement, index) => (
                    <Box key={index} sx={{ mb: 2.5 }}>
                      <Typography variant="body2" sx={{ 
                        fontWeight: 'bold',
                        color: accentColor,
                        fontSize: isMobile ? '0.8rem' : '0.9rem'
                      }}>
                        {achievement.period}
                      </Typography>
                      <Typography variant="body2" sx={{ 
                        color: '#ecf0f1',
                        fontSize: isMobile ? '0.75rem' : '0.85rem',
                        lineHeight: 1.4
                      }}>
                        {achievement.description}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Grid>

            {/* Main Content */}
            <Grid item xs={12} md={8} sx={{ 
              p: isMobile ? 2 : 4,
              width: isMobile ? '100%' : '60%',
              order: isMobile ? 1 : 2
            }}>
              {/* Profile */}
              <Box sx={{ mb: 4, mt: isMobile ? 2 : 2 }}>
                <Typography variant="h6" sx={{ 
                  fontWeight: 'bold', 
                  mb: 2,
                  color:color,
                  fontSize: isMobile ? '1.1rem' : '1.2rem',
                  borderBottom: `2px solid ${accentColor}`,
                  pb: 1,
                  display: 'inline-block'
                }}>
                  PROFILE INFO
                </Typography>
                <Typography variant="body2" sx={{ 
                  lineHeight: 1.6,
                  color: '#34495e',
                  textAlign: isMobile ? 'left' : 'justify',
                  fontSize: isMobile ? '0.875rem' : '0.9rem'
                }}>
                  {profileText}
                </Typography>
              </Box>

              <Divider sx={{ my: 3, backgroundColor: '#bdc3c7' }} />

              {/* Education */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" sx={{ 
                  fontWeight: 'bold', 
                  mb: 3,
                  color:color,
                  fontSize: isMobile ? '1.1rem' : '1.2rem',
                  borderBottom: `2px solid ${accentColor}`,
                  pb: 1,
                  display: 'inline-block'
                }}>
                  EDUCATION
                </Typography>
                {education.map((edu, index) => (
                  <Box key={index} sx={{ 
                    mb: 3, 
                    pl: isMobile ? 1 : 2, 
                    borderLeft: `3px solid ${accentColor}` 
                  }}>
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      mb: 1,
                      flexDirection: isMobile ? 'column' : 'row',
                      gap: isMobile ? 1 : 0
                    }}>
                      <Typography variant="body1" sx={{ 
                        fontWeight: 'bold',
                        color: '#2c3e50',
                        fontSize: isMobile ? '0.9rem' : '1rem'
                      }}>
                        {edu.degree}
                      </Typography>
                      <Typography variant="body2" sx={{ 
                        color: accentColor,
                        fontWeight: 'bold',
                        backgroundColor: '#f9f9f9',
                        px: 1,
                        py: 0.5,
                        borderRadius: 1,
                        fontSize: isMobile ? '0.8rem' : '0.875rem',
                        alignSelf: isMobile ? 'flex-start' : 'center'
                      }}>
                        {edu.period}
                      </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ 
                      fontWeight: 'bold', 
                      mb: 0.5,
                      color: '#34495e',
                      fontSize: isMobile ? '0.85rem' : '0.9rem'
                    }}>
                      {edu.institution}
                    </Typography>
                    <Typography variant="body2" sx={{ 
                      color: '#7f8c8d',
                      fontStyle: 'italic',
                      fontSize: isMobile ? '0.8rem' : '0.875rem'
                    }}>
                      {edu.description}
                    </Typography>
                  </Box>
                ))}
              </Box>

              <Divider sx={{ my: 3, backgroundColor: '#bdc3c7' }} />

              {/* Experience */}
              <Box>
                <Typography variant="h6" sx={{ 
                  fontWeight: 'bold', 
                  mb: 3,
                  color:color,
                  fontSize: isMobile ? '1.1rem' : '1.2rem',
                  borderBottom: `2px solid ${accentColor}`,
                  pb: 1,
                  display: 'inline-block'
                }}>
                  EXPERIENCE
                </Typography>
                {experience.map((exp, index) => (
                  <Box key={index} sx={{ 
                    mb: 3, 
                    pl: isMobile ? 1 : 2, 
                    borderLeft: `3px solid ${accentColor}`,
                    position: 'relative'
                  }}>
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      mb: 1,
                      flexDirection: isMobile ? 'column' : 'row',
                      gap: isMobile ? 1 : 0
                    }}>
                      <Typography variant="body1" sx={{ 
                        fontWeight: 'bold',
                        color: '#2c3e50',
                        fontSize: isMobile ? '0.9rem' : '1rem'
                      }}>
                        {exp.company}
                      </Typography>
                      <Typography variant="body2" sx={{ 
                        color: accentColor,
                        fontWeight: 'bold',
                        backgroundColor: '#f9f9f9',
                        px: 1,
                        py: 0.5,
                        borderRadius: 1,
                        fontSize: isMobile ? '0.8rem' : '0.875rem',
                        alignSelf: isMobile ? 'flex-start' : 'center'
                      }}>
                        {exp.period}
                      </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ 
                      fontWeight: 'bold', 
                      mb: 1,
                      color: '#34495e',
                      fontStyle: 'italic',
                      fontSize: isMobile ? '0.85rem' : '0.9rem'
                    }}>
                      {exp.position}
                    </Typography>
                    <Typography variant="body2" sx={{ 
                      lineHeight: 1.6,
                      color: '#2c3e50',
                      fontSize: isMobile ? '0.85rem' : '0.9rem'
                    }}>
                      {exp.description}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Resume22;

// Meta information for Resume22
export const resumeMeta = {
  hasPhoto: true,
  columns: 2,
  colorOptions: [
    { value: '#2c3e50', label: 'Default Blue' },
    { value: '#1a2b47', label: 'Dark Blue' },
    { value: '#6a1b9a', label: 'Purple' },
    { value: '#2e7d32', label: 'Green' },
    { value: '#d32f2f', label: 'Red' }
  ],
  nameColorOptions: [
    { value: '#ffffff', label: 'White' },
    { value: '#f5f5f5', label: 'Light Gray' },
    { value: '#e0e0e0', label: 'Silver' },
    { value: '#ffeb3b', label: 'Yellow' },
    { value: '#81c784', label: 'Light Green' }
  ]
};
{/*import React from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  Divider,
  Chip,
  Container,
  useTheme,
  useMediaQuery,
  Avatar
} from '@mui/material';
import { 
  Email, 
  Phone, 
  LocationOn, 
  Language 
} from '@mui/icons-material';

const ResumeTemplate = ({ pageSize = "A4" }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const personalInfo = {
    name: "JONATHAN",
    surname: "PATTERSON",
    title: "Art Director",
    contact: {
      phone: "+123-456-7890",
      email: "hello@reallygreatsite.com",
      address: "123 Anywhere St., Any City",
      website: "www.reallygreatsite.com"
    }
  };

  const education = [
    {
      period: "2004-2017",
      degree: "BACHELOR OF DESIGN",
      institution: "WARNING UNIVERSITY",
      description: "Graduated in Visual Designing"
    },
    {
      period: "2003-2018",
      degree: "BACHELOR OF DESIGN",
      institution: "WARNING UNIVERSITY",
      description: "Graduated in Visual Designing"
    }
  ];

  const experience = [
    {
      period: "2009-2020",
      company: "STUDIO SHOWER",
      position: "Graphic Designer",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
    },
   
  ];

  const skills = [
    "Creativity", "Digital Marketing",
  ];

  const languages = [
    { language: "English", level: "Native" },
    { language: "German", level: "Basic" },
    { language: "Spanish", level: "Basic" }
  ];

  const achievements = [
    {
      period: "2012-2018",
      description: "exerciti per of internship In our company worth over $500miles"
    },
    {
      period: "2015-2020",
      description: "exerciti per of internship Microsoft has projects"
    }
  ];

  const profileText = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam quis nostrud exercitation. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut dolore et dolore magna aliqua. Ut enim ad minim veniam quis nostrud exercitation.";

  return (
    <Box sx={{ 
      py: isMobile ? 2 : 4,
      width: pageSize === "A4" ? "210mm" : "216mm",
      maxWidth: '100%',
      mx: 'auto'
    }}>
      <Card sx={{ 
        boxShadow: isMobile ? 1 : 3, 
        borderRadius: 2, 
        overflow: 'hidden',
        mx: 'auto'
      }}>
        <CardContent sx={{ p: 0 }}>
          <Box sx={{ 
            backgroundColor: '#2c3e50', 
            color: 'white',
            p: isMobile ? 2 : 4,
            textAlign: 'center',
            pl:10,
            position: 'relative'
          }}>
            <Typography variant="h2" sx={{ 
              fontWeight: 'bold', 
              fontSize: isSmallMobile ? '1.5rem' : isMobile ? '2rem' : '3rem',
              letterSpacing: isMobile ? 1 : 2,
              lineHeight: 1.2
            }}>
              {personalInfo.name}
            </Typography>
            <Typography variant="h2" sx={{ 
              fontWeight: 'bold', 
              fontSize: isSmallMobile ? '1.5rem' : isMobile ? '2rem' : '3rem',
              letterSpacing: isMobile ? 1 : 2,
              lineHeight: 1.2
            }}>
              {personalInfo.surname}
            </Typography>
            <Typography variant="h5" sx={{ 
              mt: 1, 
              opacity: 0.9,
              letterSpacing: isMobile ? 0.5 : 1,
              fontSize: isSmallMobile ? '1rem' : isMobile ? '1.25rem' : '1.5rem'
            }}>
              {personalInfo.title}
            </Typography>
          </Box>

          <Grid container sx={{ 
            position: 'relative', 
            minHeight: isMobile ? 'auto' : '800px' 
          }}>
            <Grid item xs={12} md={4} sx={{ 
              backgroundColor: '#34495e',
              color: 'white',
              p: isMobile ? 2 : 3,
              width: isMobile ? '100%' : '29%',
              position: isMobile ? 'static' : 'relative',
              top: isMobile ? 0 : -100,
              borderTopLeftRadius: isMobile ? 0 : '50px',
              borderTopRightRadius: isMobile ? 0 : '50px',
              borderBottomLeftRadius: isMobile ? 0 : '8px',
              ml: isMobile ? 0 : 1,
              mt: isMobile ? 0 : '-100px',
              mb: isMobile ? 0 : 0,
              order: isMobile ? 2 : 1
            }}>
              <Box sx={{ 
                position: isMobile ? 'relative' : 'absolute',
                left: isMobile ? 'auto' : '50%',
                transform: isMobile ? 'none' : 'translateX(-50%)',
                width: isMobile ? 100 : 140,
                height: isMobile ? 100 : 140,
                borderRadius: '50%',
                border: '6px solid white',
                backgroundColor: 'white',
                boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                zIndex: 10,
                mx: isMobile ? 'auto' : 'none',
                mb: isMobile ? 2 : 0,
                mt: isMobile ? -50 : 0
              }}>
                <Avatar 
                  sx={{ 
                    width: isMobile ? 88 : 128, 
                    height: isMobile ? 88 : 128, 
                    borderRadius: '50%'
                  }}
                  src="/path-to-your-photo.jpg"
                >
                  <Typography variant="h4" sx={{ 
                    fontWeight: 'bold', 
                    color: '#2c3e50',
                    fontSize: isMobile ? '1.5rem' : '2rem'
                  }}>
                    JP
                  </Typography>
                </Avatar>
              </Box>

              <Box sx={{ mt: isMobile ? 4 : 12 }}>

                <Box sx={{ mb: 3, mt: isMobile ? 0 : 20 }}>
                  <Typography variant="h6" sx={{ 
                    fontWeight: 'bold', 
                    mb: 2,
                    color: '#ecf0f1',
                    fontSize: isMobile ? '1rem' : '1.1rem',
                    borderBottom: '2px solid #e74c3c',
                    pb: 0.5,
                    display: 'inline-block'
                  }}>
                    CONTACT
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                    <Phone sx={{ fontSize: isMobile ? 16 : 18, mr: 1.5, color: '#e74c3c' }} />
                    <Typography variant="body2" sx={{ 
                      color: '#ecf0f1',
                      fontSize: isMobile ? '0.8rem' : '0.875rem'
                    }}>
                      {personalInfo.contact.phone}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                    <Email sx={{ fontSize: isMobile ? 16 : 18, mr: 1.5, color: '#e74c3c' }} />
                    <Typography variant="body2" sx={{ 
                      color: '#ecf0f1',
                      fontSize: isMobile ? '0.8rem' : '0.875rem'
                    }}>
                      {personalInfo.contact.email}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                    <LocationOn sx={{ fontSize: isMobile ? 16 : 18, mr: 1.5, color: '#e74c3c' }} />
                    <Typography variant="body2" sx={{ 
                      color: '#ecf0f1',
                      fontSize: isMobile ? '0.8rem' : '0.875rem'
                    }}>
                      {personalInfo.contact.address}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                    <Language sx={{ fontSize: isMobile ? 16 : 18, mr: 1.5, color: '#e74c3c' }} />
                    <Typography variant="body2" sx={{ 
                      color: '#ecf0f1',
                      fontSize: isMobile ? '0.8rem' : '0.875rem'
                    }}>
                      {personalInfo.contact.website}
                    </Typography>
                  </Box>
                </Box>

                <Divider sx={{ my: 2, backgroundColor: '#7f8c8d' }} />

                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" sx={{ 
                    fontWeight: 'bold', 
                    mb: 2,
                    color: '#ecf0f1',
                    fontSize: isMobile ? '1rem' : '1.1rem',
                    borderBottom: '2px solid #e74c3c',
                    pb: 0.5,
                    display: 'inline-block'
                  }}>
                    SKILLS
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {skills.map((skill, index) => (
                      <Chip 
                        key={index}
                        label={skill}
                        size="small"
                        sx={{ 
                          mb: 1,
                          backgroundColor: '#e74c3c',
                          color: 'white',
                          fontWeight: 'bold',
                          fontSize: isMobile ? '0.7rem' : '0.75rem',
                          height: isMobile ? 24 : 32
                        }}
                      />
                    ))}
                  </Box>
                </Box>

                <Divider sx={{ my: 2, backgroundColor: '#7f8c8d' }} />

                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" sx={{ 
                    fontWeight: 'bold', 
                    mb: 2,
                    color: '#ecf0f1',
                    fontSize: isMobile ? '1rem' : '1.1rem',
                    borderBottom: '2px solid #e74c3c',
                    pb: 0.5,
                    display: 'inline-block'
                  }}>
                    LANGUAGES
                  </Typography>
                  {languages.map((lang, index) => (
                    <Box key={index} sx={{ mb: 1.5 }}>
                      <Typography variant="body2" sx={{ 
                        fontWeight: 'bold',
                        color: '#ecf0f1',
                        fontSize: isMobile ? '0.8rem' : '0.875rem'
                      }}>
                        {lang.language}
                      </Typography>
                      <Typography variant="body2" sx={{ 
                        color: '#bdc3c7',
                        fontStyle: 'italic',
                        fontSize: isMobile ? '0.75rem' : '0.875rem'
                      }}>
                        {lang.level}
                      </Typography>
                    </Box>
                  ))}
                </Box>

                <Divider sx={{ my: 2, backgroundColor: '#7f8c8d' }} />

                <Box>
                  <Typography variant="h6" sx={{ 
                    fontWeight: 'bold', 
                    mb: 2,
                    color: '#ecf0f1',
                    fontSize: isMobile ? '1rem' : '1.1rem',
                    borderBottom: '2px solid #e74c3c',
                    pb: 0.5,
                    display: 'inline-block'
                  }}>
                    ACHIEVEMENT
                  </Typography>
                  {achievements.map((achievement, index) => (
                    <Box key={index} sx={{ mb: 2.5 }}>
                      <Typography variant="body2" sx={{ 
                        fontWeight: 'bold',
                        color: '#e74c3c',
                        fontSize: isMobile ? '0.8rem' : '0.9rem'
                      }}>
                        {achievement.period}
                      </Typography>
                      <Typography variant="body2" sx={{ 
                        color: '#ecf0f1',
                        fontSize: isMobile ? '0.75rem' : '0.85rem',
                        lineHeight: 1.4
                      }}>
                        {achievement.description}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12} md={8} sx={{ 
              p: isMobile ? 2 : 4,
              width: isMobile ? '100%' : '60%',
              order: isMobile ? 1 : 2
            }}>
              <Box sx={{ mb: 4, mt: isMobile ? 2 : 2 }}>
                <Typography variant="h6" sx={{ 
                  fontWeight: 'bold', 
                  mb: 2,
                  color: '#2c3e50',
                  fontSize: isMobile ? '1.1rem' : '1.2rem',
                  borderBottom: '2px solid #e74c3c',
                  pb: 1,
                  display: 'inline-block'
                }}>
                  PROFILE INFO
                </Typography>
                <Typography variant="body2" sx={{ 
                  lineHeight: 1.6,
                  color: '#34495e',
                  textAlign: isMobile ? 'left' : 'justify',
                  fontSize: isMobile ? '0.875rem' : '0.9rem'
                }}>
                  {profileText}
                </Typography>
              </Box>

              <Divider sx={{ my: 3, backgroundColor: '#bdc3c7' }} />

              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" sx={{ 
                  fontWeight: 'bold', 
                  mb: 3,
                  color: '#2c3e50',
                  fontSize: isMobile ? '1.1rem' : '1.2rem',
                  borderBottom: '2px solid #e74c3c',
                  pb: 1,
                  display: 'inline-block'
                }}>
                  EDUCATION
                </Typography>
                {education.map((edu, index) => (
                  <Box key={index} sx={{ 
                    mb: 3, 
                    pl: isMobile ? 1 : 2, 
                    borderLeft: '3px solid #e74c3c' 
                  }}>
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      mb: 1,
                      flexDirection: isMobile ? 'column' : 'row',
                      gap: isMobile ? 1 : 0
                    }}>
                      <Typography variant="body1" sx={{ 
                        fontWeight: 'bold',
                        color: '#2c3e50',
                        fontSize: isMobile ? '0.9rem' : '1rem'
                      }}>
                        {edu.degree}
                      </Typography>
                      <Typography variant="body2" sx={{ 
                        color: '#e74c3c',
                        fontWeight: 'bold',
                        backgroundColor: '#f9f9f9',
                        px: 1,
                        py: 0.5,
                        borderRadius: 1,
                        fontSize: isMobile ? '0.8rem' : '0.875rem',
                        alignSelf: isMobile ? 'flex-start' : 'center'
                      }}>
                        {edu.period}
                      </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ 
                      fontWeight: 'bold', 
                      mb: 0.5,
                      color: '#34495e',
                      fontSize: isMobile ? '0.85rem' : '0.9rem'
                    }}>
                      {edu.institution}
                    </Typography>
                    <Typography variant="body2" sx={{ 
                      color: '#7f8c8d',
                      fontStyle: 'italic',
                      fontSize: isMobile ? '0.8rem' : '0.875rem'
                    }}>
                      {edu.description}
                    </Typography>
                  </Box>
                ))}
              </Box>

              <Divider sx={{ my: 3, backgroundColor: '#bdc3c7' }} />

              <Box>
                <Typography variant="h6" sx={{ 
                  fontWeight: 'bold', 
                  mb: 3,
                  color: '#2c3e50',
                  fontSize: isMobile ? '1.1rem' : '1.2rem',
                  borderBottom: '2px solid #e74c3c',
                  pb: 1,
                  display: 'inline-block'
                }}>
                  EXPERIENCE
                </Typography>
                {experience.map((exp, index) => (
                  <Box key={index} sx={{ 
                    mb: 3, 
                    pl: isMobile ? 1 : 2, 
                    borderLeft: '3px solid #e74c3c',
                    position: 'relative'
                  }}>
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      mb: 1,
                      flexDirection: isMobile ? 'column' : 'row',
                      gap: isMobile ? 1 : 0
                    }}>
                      <Typography variant="body1" sx={{ 
                        fontWeight: 'bold',
                        color: '#2c3e50',
                        fontSize: isMobile ? '0.9rem' : '1rem'
                      }}>
                        {exp.company}
                      </Typography>
                      <Typography variant="body2" sx={{ 
                        color: '#e74c3c',
                        fontWeight: 'bold',
                        backgroundColor: '#f9f9f9',
                        px: 1,
                        py: 0.5,
                        borderRadius: 1,
                        fontSize: isMobile ? '0.8rem' : '0.875rem',
                        alignSelf: isMobile ? 'flex-start' : 'center'
                      }}>
                        {exp.period}
                      </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ 
                      fontWeight: 'bold', 
                      mb: 1,
                      color: '#34495e',
                      fontStyle: 'italic',
                      fontSize: isMobile ? '0.85rem' : '0.9rem'
                    }}>
                      {exp.position}
                    </Typography>
                    <Typography variant="body2" sx={{ 
                      lineHeight: 1.6,
                      color: '#2c3e50',
                      fontSize: isMobile ? '0.85rem' : '0.9rem'
                    }}>
                      {exp.description}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ResumeTemplate;
export const resumeMeta = {
  hasPhoto: true,
  columns: 2,

  colorOptions: [
    { value: '#3A5A78', label: 'Default Blue' },
    { value: '#1a2b47', label: 'Dark Blue' },
    { value: '#6a1b9a', label: 'Purple' },
    { value: '#88c4d4ff', label: 'Green' },
    { value: '#d32f2f', label: 'Red' }
  ],
  nameColorOptions: [
    { value: '#333333', label: 'Dark Gray' },
    { value: '#000000', label: 'Black' },
    { value: '#1a2b47', label: 'Dark Blue' },
    { value: '#2e7d32', label: 'Green' },
    { value: '#d32f2f', label: 'Red' }
  ]
};*/}