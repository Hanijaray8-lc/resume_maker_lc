import React from "react";
import { Box, Typography, Button, useTheme, useMediaQuery } from "@mui/material";
import { motion } from "framer-motion";

import image1 from "../assets/images1.png";
import image2 from "../assets/images2.png";
import image3 from "../assets/images1.png";
import image4 from "../assets/images2.png";

const slides = [
  {
    img: image1,
    title: "Custom Your Resume",
    desc: "Personalize and style your resume easily with our smart AI editor.",
  },
  {
    img: image2,
    title: "Import Your Resume",
    desc: "Upload your existing resume and improve it instantly with AI.",
  },
  {
    img: image3,
    title: "Expert Tips",
    desc: "Get professional insights to highlight your strengths better.",
  },
  {
    img: image4,
    title: "Suggestions",
    desc: "AI-powered suggestions that show employers you're the best fit.",
  },
];

const ResumeSection = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        px: { xs: 2, sm: 4, md: 6 },
        py: { xs: 3, md: 4 },
        bgcolor: "background.default",
        overflow: "hidden",
      }}
    >
      {slides.map((slide, i) => {
        const isEven = i % 2 === 0;

        return (
 <Box
  key={i}
  sx={{
    display: "flex",
    alignItems: "center",
    flexDirection: {
      xs: "column",
      md: isEven ? "row" : "row-reverse",
    },
    minHeight: { xs: "60vh", md: "80vh" },
    gap: { xs: 3, md: 4 }, // 👈 reduced gap so both sides look balanced
    mb: { xs: 6, md: 0 },
    py: { xs: 3, md: 0 },
    px: { xs: 0, md: 2 }, // little padding on desktop
  }}
>
  {/* Image */}
  <motion.div
    initial={{ opacity: 0, x: isMobile ? 0 : (isEven ? -150 : 150) }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: false, amount: 0.3 }}
    transition={{ duration: 0.8 }}
    style={{
      flex: 1,
      display: "flex",
      justifyContent: "center",
    }}
  >
    <Box
      component="img"
      src={slide.img}
      alt={slide.title}
      sx={{
        width: { xs: "100%", sm: "80%", md: "100%" },
        maxWidth: "450px",
        borderRadius: "16px",
        boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
      }}
    />
  </motion.div>

  {/* Text */}
  <motion.div
    initial={{ opacity: 0, x: isMobile ? 0 : (isEven ? 150 : -150) }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: false, amount: 0.3 }}
    transition={{ duration: 0.8, delay: isMobile ? 0 : 0.2 }}
    style={{
      flex: 1,
      textAlign: isMobile ? "center" : "left",
      display: "flex",
      flexDirection: "column",
      alignItems: isMobile ? "center" : "flex-start",
      padding: isMobile ? "0" : "0 24px", // 👈 add equal padding so both sides match
    }}
  >
    <Typography
      variant={isMobile ? "h5" : "h4"}
      fontWeight="bold"
      gutterBottom
      sx={{
        fontSize: { xs: "1.5rem", sm: "1.75rem", md: "2.125rem" },
      }}
    >
      {slide.title}
    </Typography>
    <Typography
      variant="body1"
      gutterBottom
      sx={{
        mb: 3,
        fontSize: { xs: "0.9rem", sm: "1rem" },
        maxWidth: { xs: "100%", md: "100%" }, // 👈 allow full flex width on desktop
      }}
    >
      {slide.desc}
    </Typography>

    <Button
      variant="contained"
      sx={{
        background: "linear-gradient(to right, #6a11cb, #2575fc)",
        color: "#fff",
        fontWeight: "bold",
        px: 3,
        py: 1.5,
        borderRadius: "12px",
        fontSize: { xs: "0.9rem", sm: "1rem" },
        width: isSmallMobile ? "100%" : "auto",
        maxWidth: "300px",
        "&:hover": {
          background: "linear-gradient(to right, #2575fc, #6a11cb)",
        },
      }}
    >
      Try Our AI Resume Builder
    </Button>
  </motion.div>
</Box>


        );
      })}
    </Box>
  );
};

export default ResumeSection;
