import React from "react";
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  Avatar,
} from "@mui/material";

const testimonials = [
  {
    name: "John Doe",
    role: "Software Engineer",
    feedback:
      "This platform helped me build a professional resume quickly and effectively!",
    avatar: "https://i.pravatar.cc/150?img=3",
  },
  {
    name: "Jane Smith",
    role: "UI/UX Designer",
    feedback:
      "The templates are modern and easy to customize. Highly recommend!",
    avatar: "https://i.pravatar.cc/150?img=5",
  },
  {
    name: "Michael Johnson",
    role: "Project Manager",
    feedback:
      "I landed my dream job with the resume I created here. Fantastic tool!",
    avatar: "https://i.pravatar.cc/150?img=8",
  },
];

const Testimonials = () => {
  return (
    <Box
      sx={{
        py: 6,
        backgroundColor: "#fff",
        width: "100%",   // Full width
      }}
    >
      {/* Heading */}
      <Typography
        variant="h4"
        align="center"
        gutterBottom
        sx={{ fontWeight: "bold", mb: 4 }}
      >
        What Our Users Say
      </Typography>

      {/* Cards Grid */}
      <Grid container spacing={3} justifyContent="center" sx={{ px: 0, mx: 0 }}>
        {testimonials.map((testimonial, index) => (
          <Grid item key={index}>
            <Card
              sx={{
                width: 300, // fixed width in px
                height: 260,
                boxShadow: 3,
                borderRadius: 3,
                textAlign: "center",
              }}
            >
              <CardContent>
                <Avatar
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  sx={{
                    width: 60,
                    height: 60,
                    mx: "auto",
                    mb: 2,
                  }}
                />
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  {testimonial.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {testimonial.role}
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  "{testimonial.feedback}"
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Testimonials;
