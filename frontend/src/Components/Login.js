// src/pages/AuthPage.js
import React, { useState } from "react";
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Tabs,
  Tab,
  Paper,
  IconButton
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const AuthPage = () => {
  const [tab, setTab] = useState(0); // 0 = Login, 1 = Signup
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const endpoint =
        tab === 0
          ? "https://resume-maker-lc.onrender.com/api/auth/login"
          : "https://resume-maker-lc.onrender.com/api/auth/signup";

      const res = await axios.post(endpoint, formData);

      alert(res.data.message);

      if (tab === 0) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("userId", res.data.user.id); // 👈 save id
        navigate("/"); // redirect after login
      }
    } catch (err) {
      alert(err.response?.data?.message || "Error occurred");
    }
  };

    const handleBack = () => {
    navigate(-1); // Go back to previous page
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        p: 2,
        background: "linear-gradient(135deg, #0a192f, #172a45)", // Navy blue dark theme
      }}
    >
      {/* 🎨 Decorative Background Blobs */}
      <Box
        sx={{
          position: "absolute",
          width: 300,
          height: 300,
          borderRadius: "50%",
          background:
            "radial-gradient(circle at 30% 30%, #1e3c72, #2a5298 70%)",
          top: -80,
          left: -100,
          filter: "blur(90px)",
          opacity: 0.5,
        }}
      />
      <Box
        sx={{
          position: "absolute",
          width: 250,
          height: 250,
          borderRadius: "50%",
          background:
            "radial-gradient(circle at 70% 70%, #6a11cb, #2575fc 70%)",
          bottom: -60,
          right: -80,
          filter: "blur(100px)",
          opacity: 0.4,
        }}
      />
      <Box
        sx={{
          position: "absolute",
          width: 180,
          height: 180,
          borderRadius: "50%",
          background:
            "radial-gradient(circle at 50% 50%, #00c6ff, #0072ff 80%)",
          bottom: 100,
          left: 50,
          filter: "blur(80px)",
          opacity: 0.4,
        }}
      />
   <IconButton
        onClick={handleBack}
        sx={{
          position: "absolute",
          top: 20,
          left: 20,
          color: "#64ffda",
          backgroundColor: "rgba(100, 255, 218, 0.1)",
          border: "1px solid rgba(100, 255, 218, 0.3)",
          "&:hover": {
            backgroundColor: "rgba(100, 255, 218, 0.2)",
            transform: "scale(1.05)",
          },
          zIndex: 10,
          transition: "all 0.3s ease",
        }}
      >
        <ArrowBackIcon />
      </IconButton>
      <Container maxWidth="sm" sx={{ position: "relative", zIndex: 1 }}>
        <Paper
          elevation={8}
          sx={{
            p: 5,
            borderRadius: 4,
            textAlign: "center",
            background: "rgba(10, 25, 47, 0.85)", // dark glass
            backdropFilter: "blur(15px)",
            border: "1px solid rgba(255,255,255,0.1)",
            boxShadow: "0px 8px 30px rgba(0,0,0,0.6)",
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: "bold",
              color: "#64ffda", // neon aqua
              mb: 3,
              letterSpacing: 1,
            }}
          >
            {tab === 0 ? "Welcome Back 👋" : "Create an Account ✨"}
          </Typography>

          <Tabs
            value={tab}
            onChange={(e, v) => setTab(v)}
            centered
            textColor="inherit"
            indicatorColor="primary"
            sx={{
              mb: 3,
              "& .MuiTab-root": {
                fontWeight: "bold",
                fontSize: "1rem",
                color: "#ccd6f6",
              },
              "& .Mui-selected": {
                color: "#64ffda !important",
              },
              "& .MuiTabs-indicator": {
                backgroundColor: "#64ffda",
              },
            }}
          >
            <Tab label="Login" />
            <Tab label="Signup" />
          </Tabs>

          <Box>
            {/* Name field - Always visible for both login and signup */}
            <TextField
              fullWidth
              margin="normal"
              label="Name"
              name="name"
              onChange={handleChange}
              variant="outlined"
              InputLabelProps={{ style: { color: "#8892b0" } }}
              InputProps={{
                style: { color: "#e6f1ff" },
              }}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Email"
              name="email"
              onChange={handleChange}
              variant="outlined"
              InputLabelProps={{ style: { color: "#8892b0" } }}
              InputProps={{
                style: { color: "#e6f1ff" },
              }}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Password"
              type="password"
              name="password"
              onChange={handleChange}
              variant="outlined"
              InputLabelProps={{ style: { color: "#8892b0" } }}
              InputProps={{
                style: { color: "#e6f1ff" },
              }}
            />

            <Button
              fullWidth
              variant="contained"
              sx={{
                mt: 4,
                py: 1.5,
                fontWeight: "bold",
                fontSize: "1rem",
                borderRadius: 3,
                background: "linear-gradient(135deg, #0072ff, #00c6ff)",
                "&:hover": {
                  background: "linear-gradient(135deg, #005bea, #00c6ff)",
                  boxShadow: "0px 6px 20px rgba(0, 198, 255, 0.4)",
                },
              }}
              onClick={handleSubmit}
            >
              {tab === 0 ? "Login" : "Signup"}
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default AuthPage;