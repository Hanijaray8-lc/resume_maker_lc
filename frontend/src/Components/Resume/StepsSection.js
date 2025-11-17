import React from 'react';
import {
  Box,
  Button,
  Grid,
  Typography,
  Stack,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useNavigate } from 'react-router-dom'; // ✅ Import useNavigate
import ResumeImage from '../../assets/resume1.png'; // ✅ Adjust path if needed

const steps = [
  'Select a template from our library of professional designs',
  'Build your resume with our industry-specific bullet points',
  'Customize the details and wrap it up. You’re ready to send!',
];

const StepsSection = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const navigate = useNavigate(); // ✅ Initialize navigation

  const handleNextClick = () => {
    navigate('/experience-level'); // ✅ Navigate to /resume
  };

  return (
    <Box
      sx={{
        py: 6,
        px: 3,
        backgroundColor: '#f9f9f9',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <Grid
        container
        spacing={4}
        alignItems="center"
        justifyContent="center"
        sx={{ maxWidth: '1200px' }}
      >
        {/* Left: Text Content */}
        <Grid item xs={12} md={6}>
          <Box textAlign={isMobile ? 'center' : 'left'}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Just three easy steps
            </Typography>

            <Stack spacing={2} mt={3}>
              {steps.map((step, index) => (
                <Box
                  key={index}
                  sx={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: isMobile ? 'center' : 'flex-start',
                  }}
                >
                  <Box
                    sx={{
                      width: 30,
                      height: 30,
                      borderRadius: '50%',
                      backgroundColor: '#1976d2',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 'bold',
                      mr: 2,
                    }}
                  >
                    {index + 1}
                  </Box>
                  <Typography variant="body1">{step}</Typography>
                </Box>
              ))}
            </Stack>

            {/* ✅ Button with navigation */}
            <Button
              variant="outlined"
              onClick={handleNextClick} // ✅ Add click handler
              sx={{
                background: 'linear-gradient(to right, #6a11cb, #2575fc)',
                color: '#fff',
                fontWeight: 'bold',
                px: 3,
                py: 1.5,
                mt: 4,
                borderRadius: '12px',
                width: isMobile ? '100%' : 'auto',
                maxWidth: '300px',
                '&:hover': {
                  background: 'linear-gradient(to right, #2575fc, #6a11cb)',
                },
              }}
            >
              Next
            </Button>
          </Box>
        </Grid>

        {/* Right: Resume Image */}
        <Grid item xs={12} md={6} sx={{ textAlign: 'center' }}>
          <Box
            component="img"
            src={ResumeImage}
            alt="Resume Example"
            sx={{ width: '100%', maxWidth: 450, borderRadius: 2, boxShadow: 2 }}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default StepsSection;
