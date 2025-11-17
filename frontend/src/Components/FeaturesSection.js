import React from "react";
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  Button,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import PsychologyIcon from "@mui/icons-material/Psychology";
import DescriptionIcon from "@mui/icons-material/Description";
import ColorLensIcon from "@mui/icons-material/ColorLens";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import TipsAndUpdatesIcon from "@mui/icons-material/TipsAndUpdates";
import { useNavigate } from 'react-router-dom';


const features = [
  {
    icon: <PsychologyIcon sx={{ fontSize: { xs: 40, sm: 50 } }} />,
    title: "Powerful resume builder",
    desc: "Use our potent creation tools and expert guidance to create the perfect resume for your next job application.",
    color: "linear-gradient(45deg, #FF9A9E 0%, #FAD0C4 100%)",
  },
  {
    icon: <DescriptionIcon sx={{ fontSize: { xs: 40, sm: 50 } }} />,
    title: "Professional templates",
    desc: "Choose from 25+ applicant tracking systems (ATS)-friendly modern and professional templates.",
    color: "linear-gradient(45deg, #A1C4FD 0%, #C2E9FB 100%)",
  },
  {
    icon: <ColorLensIcon sx={{ fontSize: { xs: 40, sm: 50 } }} />,
    title: "Customize fonts and colors",
    desc: "Select custom fonts and colors on any resume template.",
    color: "linear-gradient(45deg, #FFECD2 0%, #FCB69F 100%)",
  },
  {
    icon: <DescriptionIcon sx={{ fontSize: { xs: 40, sm: 50 } }} />,
    title: "Free resume examples",
    desc: "Use our more than 500 resume examples and templates to see what a great resume looks like in practice.",
    color: "linear-gradient(45deg, #84FAB0 0%, #8FD3F4 100%)",
  },
  {
    icon: <AssignmentTurnedInIcon sx={{ fontSize: { xs: 40, sm: 50 } }} />,
    title: "ATS-friendly templates",
    desc: "Sail through applicant tracking systems with resume templates that appeal to both machines and humans.",
    color: "linear-gradient(45deg, #FFC3A0 0%, #FFAFBD 100%)",
  },
  {
    icon: <TipsAndUpdatesIcon sx={{ fontSize: { xs: 40, sm: 50 } }} />,
    title: "Expert tips and guidance",
    desc: "Get help every step of the way as you build your resume with expert tips and suggested phrases.",
    color: "linear-gradient(45deg, #D4FC79 0%, #96E6A1 100%)",
  },
];

const FeaturePage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/steps'); // உங்கள் route path-ஐ இங்கே கொடுக்கவும்
  };

  return (
    <Box
      sx={{
        textAlign: "center",
        py: { xs: 4, sm: 8 },
        px: { xs: 1, sm: 2 },
        background: "linear-gradient(135deg, #fff, #fff 100%)",
      }}
    >
      {/* Title */}
      <Typography
        variant={isMobile ? "h4" : "h3"}
        fontWeight="bold"
        gutterBottom
        sx={{
          mb: { xs: 2, sm: 4 },
          px: { xs: 1, sm: 0 },
          background: "linear-gradient(45deg, #3f51b5 30%, #2196f3 90%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          textShadow: "1px 1px 2px rgba(0,0,0,0.1)",
        }}
      >
        Get hired 36% faster with our feature-packed resume builder
      </Typography>

      {/* Subtitle */}
      <Typography
        variant={isMobile ? "body1" : "h6"}
        sx={{
          mb: { xs: 4, sm: 6 },
          color: theme.palette.text.secondary,
          maxWidth: 800,
          mx: "auto",
          px: { xs: 1, sm: 0 },
        }}
      >
        Create a professional resume that stands out with our powerful tools and
        beautiful templates
      </Typography>

      {/* Features Grid */}
      <Grid 
        container 
        spacing={isMobile ? 2 : 4} 
        justifyContent="center" 
        sx={{ px: { xs: 1, sm: 4 } }}
      >
        {features.map((feature, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card
              sx={{
                height: { xs: 240, sm: 280 },
                width: "100%",
                maxWidth: 400,
                mx: "auto",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                p: { xs: 2, sm: 3 },
                borderRadius: 4,
                boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
                background: feature.color,
                transition: "transform 0.3s, box-shadow 0.3s",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: "0 12px 20px rgba(0,0,0,0.15)",
                },
              }}
            >
              <Box
                sx={{
                  width: { xs: 70, sm: 80 },
                  height: { xs: 70, sm: 80 },
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "rgba(255,255,255,0.2)",
                  borderRadius: "50%",
                  mb: { xs: 1, sm: 2 },
                }}
              >
                {feature.icon}
              </Box>
              <CardContent sx={{ p: { xs: "8px", sm: "16px" } }}>
                <Typography
                  variant={isMobile ? "subtitle1" : "h6"}
                  gutterBottom
                  sx={{ 
                    fontWeight: "bold", 
                    color: "common.black",
                    fontSize: { xs: "1rem", sm: "1.25rem" }
                  }}
                >
                  {feature.title}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ 
                    color: "rgba(0,0,0,0.8)", 
                    fontSize: { xs: "0.85rem", sm: "0.95rem" } 
                  }}
                >
                  {feature.desc}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Button */}
      <Button
        variant="contained"
        size="large"
        onClick={handleGetStarted}
        sx={{
          background: "linear-gradient(to right, #6a11cb, #2575fc)",
          color: "#fff",
          fontWeight: "bold",
          px: 3,
          py: 1.5,
          mt: { xs: 4, sm: 5 },
          borderRadius: "12px",
          fontSize: { xs: "0.9rem", sm: "1rem" },
          "&:hover": {
            background: "linear-gradient(to right, #2575fc, #6a11cb)",
          },
        }}
      >
        Get Started Now
      </Button>
    </Box>
  );
};

export default FeaturePage;