import React from "react";
import { Box, Button, Container, Grid, Typography, Paper } from "@mui/material";

const StepsPage = () => {
  return (
    <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center" }}>
      <Container maxWidth="lg">
        <Grid container spacing={6} alignItems="center">
          {/* Left Section */}
          <Grid item xs={12} md={6}>
            <Typography variant="h3" fontWeight="bold" gutterBottom>
              Just three <br /> easy steps
            </Typography>

            <Box sx={{ mt: 3 }}>
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" fontWeight="bold">
                  1 Select
                </Typography>
                <Typography color="text.secondary">
                  Select a template from our library of professional designs
                </Typography>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" fontWeight="bold">
                  2 Build
                </Typography>
                <Typography color="text.secondary">
                  Build your resume with our industry-specific bullet points
                </Typography>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" fontWeight="bold">
                  3 Customize
                </Typography>
                <Typography color="text.secondary">
                  Customize the details and wrap it up. You’re ready to send!
                </Typography>
              </Box>
            </Box>

            <Button
              variant="contained"
              sx={{
                mt: 3,
                backgroundColor: "#e91e63",
                px: 5,
                py: 1.5,
                fontSize: "1rem",
                borderRadius: "25px",
                "&:hover": { backgroundColor: "#d81b60" },
              }}
            >
              Next
            </Button>
          </Grid>

          {/* Right Section (Resume Preview Image) */}
          <Grid item xs={12} md={6}>
            <Paper
              elevation={3}
              sx={{
                p: 2,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <img
                src="https://via.placeholder.com/300x400" // Replace with resume preview image
                alt="Resume Preview"
                style={{ width: "100%", borderRadius: "8px" }}
              />
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default StepsPage;
