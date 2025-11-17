import React, { useEffect, useState } from "react";
import { Box, Typography, Button, Grid, useTheme, useMediaQuery } from "@mui/material";
import resume1 from "../assets/resumee1.png";
import resume2 from "../assets/resumee2.png";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const [currentImage, setCurrentImage] = useState(0);
  const images = [resume1, resume2];
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
    const navigate = useNavigate();

  // Auto change images
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 3000); // every 3s
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <Box sx={{ 
      px: { xs: 2, sm: 3, md: 5 }, 
      py: { xs: 3, sm: 4, md: 5 },
      overflow: "hidden"
    }}>
      <Grid 
        container 
        spacing={5} 
        alignItems="center"
        direction={isMobile ? "column-reverse" : "row"}
      >
        {/* Content Section */}
        <Grid item xs={12} md={6}>
          <Box sx={{ 
            textAlign: isMobile ? "center" : "left",
            ml: { md: 4 }
          }}>
            <Typography 
              variant={isMobile ? "h4" : "h3"} 
              fontWeight="bold" 
              gutterBottom
              sx={{ 
                fontSize: { xs: "1.75rem", sm: "2.5rem", md: "3rem" } 
              }}
            >
              The Best Online Resume Builder
            </Typography>
            <Typography 
              variant={isMobile ? "body1" : "h6"} 
              color="text.secondary" 
              paragraph
              sx={{ 
                mb: 3,
                fontSize: { xs: "1rem", sm: "1.1rem", md: "1.25rem" } 
              }}
            >
              Easily create a resume for any job using our best-in-class resume builder platform.
            </Typography>

            {/* Buttons */}
            <Box sx={{ 
              display: "flex", 
              gap: 2, 
              mb: 4,
              flexDirection: isMobile ? "column" : "row",
              justifyContent: isMobile ? "center" : "flex-start",
              alignItems: "center"
            }}>
              <Button
                variant="contained"
                sx={{
                  background: "linear-gradient(to right, #6a11cb, #2575fc)",
                  color: "#fff",
                  fontWeight: "bold",
                  px: 3,
                  py: 1.5,
                  borderRadius: "12px",
                  width: isMobile ? "100%" : "auto",
                  maxWidth: "300px",
                  "&:hover": {
                    background: "linear-gradient(to right, #2575fc, #6a11cb)",
                  },
                }}
  onClick={() => navigate("/steps")}              >
                Create My Resume Now
              </Button>
            
            </Box>

            {/* Stats */}
            <Box sx={{ 
              display: "flex", 
              gap: { xs: 2, sm: 4 }, 
              mb: 4,
              justifyContent: isMobile ? "center" : "flex-start"
            }}>
              <Box sx={{ textAlign: "center" }}>
                <Typography variant="h4" sx={{ color: "purple", fontWeight: "bold", fontSize: { xs: "1.75rem", sm: "2rem" } }}>
                  ↑ 38%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  more interviews
                </Typography>
              </Box>
              <Box sx={{ textAlign: "center" }}>
                <Typography variant="h4" sx={{ color: "purple", fontWeight: "bold", fontSize: { xs: "1.75rem", sm: "2rem" } }}>
                  ↑ 23%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  more likely to get a job offer
                </Typography>
              </Box>
            </Box>

            {/* Logos */}
            <Typography variant="subtitle1" sx={{ mb: 2, textAlign: isMobile ? "center" : "left" }}>
              Subscribers have been hired by: *
            </Typography>
          </Box>
        </Grid>

        {/* Image Slideshow Section */}
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Box
              component="img"
              key={currentImage}
              src={images[currentImage]}
              alt="Resume"
              sx={{
                width: "100%",
                maxWidth: { xs: "300px", sm: "350px", md: "400px" },
                borderRadius: 2,
                boxShadow: 3,
                transition: "opacity 1s ease-in-out, transform 1s ease-in-out",
                animation: "flipImage 3s infinite",
              }}
            />
          </Box>
        </Grid>
      </Grid>

      {/* Flip Animation */}
      <style>
        {`
          @keyframes flipImage {
            0% { transform: rotateY(0deg); opacity: 1; }
            45% { transform: rotateY(90deg); opacity: 0.3; }
            55% { transform: rotateY(90deg); opacity: 0.3; }
            100% { transform: rotateY(0deg); opacity: 1; }
          }
        `}
      </style>
    </Box>
  );
};

export default HeroSection;