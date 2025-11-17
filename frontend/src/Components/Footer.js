import React from "react";
import {
  Box,
  Grid,
  Typography,
  IconButton,
  Link,
  Divider,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import FacebookIcon from "@mui/icons-material/Facebook";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";
import XIcon from "@mui/icons-material/Close";

const Footer = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box
      sx={{
        background: "linear-gradient(to right, #6a11cb, #2575fc)",
        color: "#fff",
        py: { xs: 4, md: 6 },
        px: { xs: 2, sm: 3, md: 10 },
        mt: 5,
      }}
    >
      <Grid 
        container 
        spacing={isMobile ? 4 : 6} 
        alignItems="flex-start"
        justifyContent="center"
      >
        {/* Contact Info Section - Now First on Mobile */}
        <Grid item xs={12} md={4} order={{ xs: 2, md: 1 }}>
          <Box sx={{ 
            textAlign: { xs: "center", md: "left" },
            maxWidth: { xs: "100%", md: "400px" }
          }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: "bold",
                mb: 2,
                color: "#fff",
                textTransform: "uppercase",
                fontSize: { xs: "1rem", md: "1.125rem" }
              }}
            >
              Contact Us
            </Typography>
            <Box
              sx={{
                "& svg": { 
                  fontSize: { xs: 14, md: 16 }, 
                  mr: 1, 
                  color: "#00e5ff",
                  verticalAlign: "middle"
                },
              }}
            >
              <Typography 
                variant="body2" 
                sx={{ 
                  mb: 2,
                  fontSize: { xs: "0.875rem", md: "0.9rem" },
                  lineHeight: 1.5
                }}
              >
              
                <Box component="span" sx={{ display: "inline-block", ml: 0.5 }}>
                   <LocationOnIcon /> <b>Main Branch:</b> 5/106A, JJ Nagar, Reddiarpatti, Tirunelveli,
                  Tamil Nadu - 627007
                </Box>
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  mb: 2,
                  fontSize: { xs: "0.875rem", md: "0.9rem" },
                  lineHeight: 1.5
                }}
              >
              
                <Box component="span" sx={{ display: "inline-block", ml: 0.5 }}>  <LocationOnIcon />
                  <b>Sub Branch:</b> Makkah Mukarramah Street, Safath, Jubail -
                  35514
                </Box>
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  mb: 2,
                  fontSize: { xs: "0.875rem", md: "0.9rem" },
                  lineHeight: 1.5
                }}
              >
                <PhoneIcon />
                +91 94860 42369<br /> <PhoneIcon />
                +91 99430 42369<br /> <PhoneIcon />
                +91 81480 42369
              </Typography>
              <Typography 
                variant="body2"
                sx={{ 
                  fontSize: { xs: "0.875rem", md: "0.9rem" },
                  lineHeight: 1.5
                }}
              >
                <EmailIcon />
                lifechangersind@gmail.com
              </Typography>
            </Box>
          </Box>
        </Grid>

        {/* Branding Section - Now Second on Mobile */}
        <Grid item xs={12} md={4} order={{ xs: 1, md: 2 }}>
          <Box sx={{ 
            textAlign: { xs: "center", md: "left" },
            maxWidth: { xs: "100%", md: "300px" },
            mx: "auto"
          }}>
            <Typography
              variant="h5"
              sx={{ 
                fontWeight: "bold", 
                mb: 2, 
                letterSpacing: 0.5,
                fontSize: { xs: "1.5rem", md: "1.75rem" }
              }}
            >
              Life Changers Ind
            </Typography>
            <Typography
              variant="body2"
              sx={{ 
                mb: 3, 
                color: "#f1f1f1", 
                lineHeight: 1.6,
                fontSize: { xs: "0.875rem", md: "0.9rem" }
              }}
            >
              Create a professional resume effortlessly with our AI-powered
              Resume Builder. Stand out from the crowd and start your career
              journey today!
            </Typography>
          </Box>
        </Grid>

        {/* Social Links Section - Now Third on Mobile */}
        <Grid item xs={12} md={4} order={{ xs: 3, md: 3 }}>
          <Box sx={{ 
            textAlign: { xs: "center", md: "left" },
            maxWidth: { xs: "100%", md: "250px" },
            mx: "auto"
          }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: "bold",
                mb: 2,
                color: "#fff",
                textTransform: "uppercase",
                fontSize: { xs: "1rem", md: "1.125rem" }
              }}
            >
              Follow Us
            </Typography>
            <Box
              sx={{
                display: "flex",
                justifyContent: { xs: "center", md: "flex-start" },
                gap: { xs: 1, md: 1.5 },
                flexWrap: "wrap"
              }}
            >
              {[
                {
                  icon: <XIcon />,
                  link: "https://x.com/Lifechangersind?t=Yc8WfiFeA611U-8oLd15sg&s=09",
                  name: "Twitter"
                },
                {
                  icon: <FacebookIcon />,
                  link: "https://www.facebook.com/lc.ind.50?mibextid=LQQJ4d",
                  name: "Facebook"
                },
                {
                  icon: <LinkedInIcon />,
                  link: "https://www.linkedin.com/in/life-changers-ind-5696b720a/",
                  name: "LinkedIn"
                },
                {
                  icon: <InstagramIcon />,
                  link: "https://www.instagram.com/lifechangersind/?igsh=dnY1MGo0OXQzd2tj",
                  name: "Instagram"
                },
              ].map((social, index) => (
                <IconButton
                  key={index}
                  component={Link}
                  href={social.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    color: "#fff",
                    transition: "0.3s",
                    "&:hover": {
                      color: "#00e5ff",
                      transform: "scale(1.2)",
                      backgroundColor: "rgba(255,255,255,0.1)"
                    },
                    width: { xs: 40, md: 44 },
                    height: { xs: 40, md: 44 }
                  }}
                  aria-label={`Follow us on ${social.name}`}
                >
                  {social.icon}
                </IconButton>
              ))}
            </Box>
          </Box>
        </Grid>
      </Grid>

      {/* Divider and Copyright */}
      <Divider sx={{ 
        my: 4, 
        borderColor: "rgba(255,255,255,0.3)",
        mx: { xs: 2, md: 0 }
      }} />
      <Typography
        variant="body2"
        align="center"
        sx={{ 
          color: "#e0e0e0", 
          mb: 1,
          fontSize: { xs: "0.8rem", md: "0.875rem" },
          px: { xs: 1, md: 0 }
        }}
      >
        Start building your future — one resume at a time.
      </Typography>
      <Typography 
        variant="body2" 
        align="center" 
        sx={{ 
          color: "#e0e0e0",
          fontSize: { xs: "0.8rem", md: "0.875rem" },
          px: { xs: 1, md: 0 }
        }}
      >
        © LifeChangersInd. All Rights Reserved.
      </Typography>
    </Box>
  );
};

export default Footer;