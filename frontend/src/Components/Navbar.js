import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import DescriptionIcon from "@mui/icons-material/Description";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [openLogoutDialog, setOpenLogoutDialog] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();

  const handleLogoutConfirm = () => {
    localStorage.removeItem("token");
    setOpenLogoutDialog(false);
    navigate("/login");
  };

  const handleMenuClick = (action) => {
    if (action === "account") navigate("/MyAccount");
    else if (action === "resume") navigate("/steps");
    else if (action === "logout") setOpenLogoutDialog(true);
    setOpenDrawer(false);
  };

  return (
    <>
      <AppBar
        position="static"
        elevation={0}
        sx={{
          backgroundColor: "white",
          color: "black",
          borderBottom: "1px solid #eee",
        }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          {/* Logo */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton edge="start" disableRipple onClick={() => navigate("/")}>
              <img
                src="https://img.icons8.com/color/48/000000/resume.png"
                alt="logo"
                style={{
                  width: isMobile ? 22 : 35,
                  height: isMobile ? 22 : 35,
                }}
              />
            </IconButton>
            <Typography
              variant="h6"
              sx={{
                ml: 1,
                fontWeight: "bold",
                color: "purple",
                cursor: "pointer",
                fontSize: isMobile ? "1rem" : "1.25rem",
              }}
              onClick={() => navigate("/")}
            >
              Resume Builder
            </Typography>
          </Box>

          {/* Desktop Menu */}
          {!isMobile && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Button
                startIcon={<AccountCircleIcon />}
                sx={{ color: "black", textTransform: "none", fontWeight: 500 }}
                onClick={() => handleMenuClick("account")}
              >
                My Account
              </Button>

              <Button
                startIcon={<LogoutIcon />}
                sx={{ color: "black", textTransform: "none", fontWeight: 500 }}
                onClick={() => handleMenuClick("logout")}
              >
                Logout
              </Button>

              <Button
                startIcon={<DescriptionIcon />}
                variant="outlined"
                sx={{
                  textTransform: "none",
                  borderRadius: "10px",
                  borderColor: "#2575fc",
                  color: "#2575fc",
                  fontWeight: "bold",
                  background: "linear-gradient(to right, #6a11cb, #2575fc)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  "&:hover": {
                    borderColor: "#6a11cb",
                    background: "linear-gradient(to right, #2575fc, #6a11cb)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  },
                }}
                onClick={() => handleMenuClick("resume")}
              >
                Build My Resume
              </Button>
            </Box>
          )}

          {/* Mobile Menu Icon */}
          {isMobile && (
            <IconButton onClick={() => setOpenDrawer(true)}>
              <MenuIcon sx={{ color: "black" }} />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
      >
        <Box sx={{ width: 250, p: 2 }}>
          <List>
            <ListItem button onClick={() => handleMenuClick("account")}>
              <ListItemIcon>
                <AccountCircleIcon />
              </ListItemIcon>
              <ListItemText primary="My Account" />
            </ListItem>

            <ListItem button onClick={() => handleMenuClick("resume")}>
              <ListItemIcon>
                <DescriptionIcon />
              </ListItemIcon>
              <ListItemText primary="Build My Resume" />
            </ListItem>

            <ListItem button onClick={() => handleMenuClick("logout")}>
              <ListItemIcon>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItem>
          </List>
        </Box>
      </Drawer>

      {/* Logout Confirmation Dialog */}
      <Dialog
        open={openLogoutDialog}
        onClose={() => setOpenLogoutDialog(false)}
      >
        <DialogTitle>Confirm Logout</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to logout from your account?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenLogoutDialog(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleLogoutConfirm} color="error" variant="contained">
            Logout
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Navbar;
