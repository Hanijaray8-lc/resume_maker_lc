import React from "react";
import { Box, Button, Container, Typography, Grid, Paper } from "@mui/material";
import Sidebar from "./Sidebar";

const EducationLevel = () => {
  const educationLevels = [
    "Secondary School",
    "Vocational Certificate or Diploma",
    "Apprenticeship or Internship Training",
    "Associates",
    "Bachelors",
    "Masters",
    "Doctorate or Ph.D.",
  ];

  return (
    <Box display="flex" minHeight="100vh" bgcolor="#f8f9fb">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ py: 6 ,ml:{md:35,xs:0}}}>
        <Typography
          variant="h4"
          fontWeight="bold"
          gutterBottom
          sx={{ textAlign: { xs: "center", md: "left" } }}
        >
          What best describes your level of education?
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          gutterBottom
          sx={{ textAlign: { xs: "center", md: "left" } }}
        >
          Select the best option and we&apos;ll help you structure your education section.
        </Typography>

        {/* Education Options */}
        <Grid container spacing={3} mt={3} justifyContent="center">
          {educationLevels.map((level, idx) => (
            <Grid item xs={12} sm={6} md={4} key={idx} sx={{ml:{md:5,xs:0}}}>
              <Paper
                elevation={3}
                sx={{
                  p: 3,
                  textAlign: "center",
                  borderRadius: 3,
                  width:'300px',
                  border: "1px solid #ddd",
                  cursor: "pointer",
                  transition: "all 0.3s",
                  "&:hover": {
                    borderColor: "#1976d2",
                    boxShadow: "0px 4px 20px rgba(0,0,0,0.1)",
                    transform: "translateY(-3px)",
                  },
                }}
              >
                <Typography variant="body1" fontWeight="medium">
                  {level}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* Prefer not to answer */}
        <Box mt={4} textAlign="center">
          <Typography
            variant="body2"
            sx={{ color: "#1976d2", cursor: "pointer", fontWeight: "medium" }}
          >
            Prefer not to answer
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default EducationLevel;
