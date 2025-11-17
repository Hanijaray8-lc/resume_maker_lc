import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Grid,
  Button,
  Divider,
  TextField,
  Tabs,
  Tab,
  IconButton,
  Chip,
  Paper,
  alpha,
  useTheme,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import SecurityIcon from "@mui/icons-material/Security";
import DescriptionIcon from "@mui/icons-material/Description";
import SettingsIcon from "@mui/icons-material/Settings";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";
import DownloadIcon from "@mui/icons-material/Download";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import TemplatesComponent from "./TemplatesComponent";

const MyAccountPage = () => {
  const [tabValue, setTabValue] = useState(0);
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const theme = useTheme();
  const navigate = useNavigate();

  const handleTabChange = (event, newValue) => setTabValue(newValue);

  // ✅ Fetch user data from backend
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const res = await fetch("https://resume-maker-lc.onrender.com/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        if (res.ok) {
          setUser(data);
          setEditedUser(data);
        } else {
          console.error("Error:", data.message);
          navigate("/mainpage");
        }
      } catch (err) {
        console.error("Fetch error:", err);
        navigate("/mainpage");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (isEditing) {
      setEditedUser(user);
    }
  };

  const handleSaveChanges = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("https://resume-maker-lc.onrender.com/api/auth/update-profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editedUser),
      });

      if (res.ok) {
        const updatedUser = await res.json();
        setUser(updatedUser);
        setIsEditing(false);
        console.log("Profile updated successfully");
      } else {
        console.error("Failed to update profile");
        alert("Failed to update profile. Please try again.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Error updating profile. Please try again.");
    }
  };

  const handleInputChange = (field, value) => {
    setEditedUser(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleDeleteAccount = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("https://resume-maker-lc.onrender.com/api/auth/delete-account", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        localStorage.removeItem("token");
        alert("Your account has been deleted successfully.");
        navigate("/login");
      } else {
        const data = await res.json();
        console.error("Failed to delete account:", data.message);
        alert("Failed to delete account. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting account:", error);
      alert("Error deleting account. Please try again.");
    } finally {
      setDeleteConfirmOpen(false);
    }
  };

  const handleDeleteClick = () => {
    setDeleteConfirmOpen(true);
  };

  const handleCancelDelete = () => {
    setDeleteConfirmOpen(false);
  };

  const handleGoToMainPage = () => {
    navigate("/mainpage");
  };

  if (loading) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '60vh',
          background: `linear-gradient(135deg, ${theme.palette.primary.main}20, ${theme.palette.secondary.main}20)`
        }}
      >
        <Typography variant="h6" color="text.secondary">
          Loading your profile...
        </Typography>
      </Box>
    );
  }

  if (!user) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '60vh',
          background: `linear-gradient(135deg, ${theme.palette.primary.main}20, ${theme.palette.secondary.main}20)`,
          gap: 3
        }}
      >
        <Typography variant="h6" color="text.secondary">
          Failed to load user data
        </Typography>
        <Button 
          variant="contained" 
          onClick={handleGoToMainPage}
          sx={{ borderRadius: 3 }}
        >
          Go to Main Page
        </Button>
      </Box>
    );
  }

  const StatCard = ({ icon, label, value, color = "primary" }) => (
    <Paper 
      sx={{ 
        p: 3, 
        textAlign: 'center',
        background: `linear-gradient(135deg, ${theme.palette[color].light}20, ${theme.palette[color].main}20)`,
        border: `1px solid ${theme.palette[color].light}30`,
        borderRadius: 3,
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: `0 8px 24px ${alpha(theme.palette[color].main, 0.15)}`
        }
      }}
    >
      <Box sx={{ color: `${color}.main`, mb: 1 }}>
        {icon}
      </Box>
      <Typography variant="h4" fontWeight="bold" color={`${color}.main`}>
        {value}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
    </Paper>
  );

  const InfoField = ({ icon, label, value, field, editable = true }) => (
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, p: 2, borderRadius: 2, bgcolor: 'background.default' }}>
      <Box sx={{ color: 'primary.main', mr: 2 }}>
        {icon}
      </Box>
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
          {label}
        </Typography>
        {isEditing && editable ? (
          <TextField
            fullWidth
            size="small"
            value={editedUser[field] || ""}
            onChange={(e) => handleInputChange(field, e.target.value)}
            variant="outlined"
          />
        ) : (
          <Typography variant="body1">
            {value || "Not provided"}
          </Typography>
        )}
      </Box>
    </Box>
  );

  const ResumeCard = ({ resume }) => (
    <Card sx={{ mb: 2, borderRadius: 2, border: `1px solid ${theme.palette.divider}` }}>
      <CardContent sx={{ p: 3 }}>
        <Grid container alignItems="center" spacing={2}>
          <Grid item>
            <DescriptionIcon color="primary" sx={{ fontSize: 32 }} />
          </Grid>
          <Grid item xs>
            <Typography variant="h6" fontWeight="bold">
              {resume.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Modified: {resume.lastModified} • {resume.fileSize}
            </Typography>
          </Grid>
          <Grid item>
            <Chip 
              label={resume.status} 
              color={resume.status === "Active" ? "success" : "default"}
              variant="outlined"
              sx={{ mr: 1 }}
            />
          </Grid>
          <Grid item>
            <IconButton color="primary">
              <VisibilityIcon />
            </IconButton>
            <IconButton color="primary">
              <DownloadIcon />
            </IconButton>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ width: '100%', minHeight: '100vh' }}>
      {/* Profile Header */}
      <Card 
        sx={{ 
          mb: 4, 
          borderRadius: 0,
          background: `linear-gradient(135deg, ${theme.palette.primary.main}15, ${theme.palette.secondary.main}15)`,
          border: `1px solid ${theme.palette.divider}`,
          overflow: 'visible',
          position: 'relative'
        }}
      >
        {/* 🔙 Back Button inside header */}
        <Box
    sx={{
      position: "absolute",
      top: 16,
      left: 16,
      zIndex: 2,
    }}
  >
    <Button
      variant="outlined"
      startIcon={<ArrowBackIcon />}
      onClick={() => navigate(-1)} // go back one page
      sx={{
        borderRadius: 3,
        textTransform: "none",
        color: "white",
        borderColor: "white",
        "&:hover": {
          borderColor: theme.palette.secondary.light,
          backgroundColor: `${theme.palette.secondary.main}30`,
        },
      }}
    >
      Back
    </Button>
  </Box>
        {/* Header background and profile content */}
        <Box 
          sx={{
            height: 120,
            background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            borderRadius: 0
          }}
        />

        <CardContent sx={{ position: 'relative', mt: -8, pb: 4, px: 4 }}>
          <Grid container spacing={3} alignItems="flex-end">
            <Grid item xs={12} md={8}>
              <Box sx={{ display: 'flex', alignItems: 'flex-end', flexWrap: 'wrap', gap: 3 }}>
                <Avatar 
                  src="/profile.jpg" 
                  alt="Profile"
                  sx={{ 
                    width: 120, 
                    height: 120, 
                    border: `4px solid ${theme.palette.background.paper}`,
                    boxShadow: 3
                  }}
                />
                <Box sx={{ flexGrow: 1, minWidth: 200 }}>
                  <Typography variant="h4" fontWeight="bold" gutterBottom>
                    {user.name}
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                    <Chip 
                      label="Premium Member" 
                      size="small" 
                      color="primary" 
                      variant="outlined"
                    />
                    <Chip 
                      label="Verified" 
                      size="small" 
                      color="success" 
                      variant="outlined"
                    />
                  </Box>
                  <Typography color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <EmailIcon fontSize="small" />
                    {user.email}
                  </Typography>
                  {user.phone && (
                    <Typography color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <PhoneIcon fontSize="small" />
                      {user.phone}
                    </Typography>
                  )}
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', gap: 1, justifyContent: { xs: 'flex-start', md: 'flex-end' }, flexWrap: 'wrap' }}>
                <Button
                  variant={isEditing ? "outlined" : "contained"}
                  startIcon={<EditIcon />}
                  onClick={handleEditToggle}
                  sx={{ borderRadius: 3 }}
                >
                  {isEditing ? "Cancel" : "Edit Profile"}
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<LogoutIcon />}
                  onClick={handleLogout}
                  sx={{ borderRadius: 3 }}
                >
                  Logout
                </Button>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Box sx={{ px: 4 }}>
        <Grid container spacing={4}>
          {/* Sidebar Stats */}
          {/* <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
              Quick Stats
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <StatCard
                icon={<DescriptionIcon fontSize="large" />}
                label="Resumes Created"
                value={resumeHistory.length}
                color="primary"
              />
              <StatCard
                icon={<SecurityIcon fontSize="large" />}
                label="Member Since"
                value="2024"
                color="secondary"
              />
              <StatCard
                icon={<PersonIcon fontSize="large" />}
                label="Profile Complete"
                value="85%"
                color="success"
              />
            </Box>
          </Grid> */}

          {/* Main Content */}
          <Grid item xs={12} md={12}>
            {/* Tabs Section */}
            <Paper sx={{ borderRadius: 3, overflow: 'hidden', mb: 3 }}>
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                sx={{
                  bgcolor: 'background.default',
                  '& .MuiTab-root': { 
                    textTransform: 'none', 
                    fontWeight: 'bold',
                    minHeight: 60,
                  },
                  '& .Mui-selected': {
                    color: 'primary.main',
                  }
                }}
                indicatorColor="primary"
                textColor="primary"
              >
                <Tab icon={<PersonIcon sx={{ mr: 1 }} />} iconPosition="start" label="Account Info" />
                <Tab icon={<DescriptionIcon sx={{ mr: 1 }} />} iconPosition="start" label="Resume History" />
                <Tab icon={<SettingsIcon sx={{ mr: 1 }} />} iconPosition="start" label="Settings" />
              </Tabs>
            </Paper>

            {/* Tab Panels */}
            {tabValue === 0 && (
              <Card sx={{ borderRadius: 3, overflow: 'hidden' }}>
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h5" fontWeight="bold">
                      Personal Information
                    </Typography>
                    {isEditing && (
                      <Button
                        variant="contained"
                        startIcon={<SaveIcon />}
                        onClick={handleSaveChanges}
                        sx={{ borderRadius: 3 }}
                      >
                        Save Changes
                      </Button>
                    )}
                  </Box>
                  <Divider sx={{ mb: 3 }} />
                  
                  <InfoField
                    icon={<PersonIcon />}
                    label="Full Name"
                    value={user.name}
                    field="name"
                  />
                  <InfoField
                    icon={<EmailIcon />}
                    label="Email Address"
                    value={user.email}
                    field="email"
                  />
                  <InfoField
                    icon={<PhoneIcon />}
                    label="Phone Number"
                    value={user.phone}
                    field="phone"
                  />
                  <InfoField
                    icon={<LocationOnIcon />}
                    label="Address"
                    value={user.address}
                    field="address"
                  />
                </CardContent>
              </Card>
            )}

            {tabValue === 1 && (
              <Box>
                {/* Templates Component Section */}
                <Card sx={{ borderRadius: 3, overflow: 'hidden' }}>
                  <CardContent sx={{ p: 4 }}>
                    <TemplatesComponent />
                  </CardContent>
                </Card>
              </Box>
            )}

            {tabValue === 2 && (
              <Card sx={{ borderRadius: 3, overflow: 'hidden' }}>
                <CardContent sx={{ p: 4 }}>
                  <Typography variant="h5" fontWeight="bold" gutterBottom>
                    Account Settings
                  </Typography>
                  <Divider sx={{ mb: 3 }} />
                  
                  <Box sx={{ mb: 4 }}>
                    <Typography variant="h6" gutterBottom color="error.main">
                      Danger Zone
                    </Typography>
              <Paper 
  sx={{ 
    p: 3, 
    bgcolor: alpha(theme.palette.error.light, 0.15),  // light red background
    border: `1px solid ${theme.palette.error.main}`,
    borderRadius: 3,
    boxShadow: `0 4px 12px ${alpha(theme.palette.error.main, 0.2)}`,
    transition: "all 0.3s ease",
    "&:hover": {
      boxShadow: `0 6px 18px ${alpha(theme.palette.error.main, 0.35)}`,
      transform: "translateY(-3px)",
    },
  }}
>
  <Typography 
    variant="h6" 
    gutterBottom 
    color="error.main" 
    sx={{ fontWeight: "bold" }}
  >
    ⚠️ Delete Account
  </Typography>

  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
    Once you delete your account, <b>there is no going back.</b> 
    Please be absolutely certain before proceeding.
  </Typography>

  <Button
    variant="contained"
    color="error"
    startIcon={<DeleteIcon />}
    onClick={handleDeleteClick}
    sx={{ 
      borderRadius: 2, 
      px: 3,
      py: 1,
      fontWeight: "bold",
      textTransform: "none",
      "&:hover": {
        backgroundColor: theme.palette.error.dark,
      },
    }}
  >
    Delete My Account
  </Button>
</Paper>

                  </Box>
                </CardContent>
              </Card>
            )}
          </Grid>
        </Grid>
      </Box>

      {/* Delete Confirmation Dialog */}
      {deleteConfirmOpen && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 9999,
          }}
        >
          <Card 
            sx={{ 
              maxWidth: 400, 
              width: '90%', 
              borderRadius: 3,
              boxShadow: 3
            }}
          >
            <CardContent sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom color="error">
                Delete Account
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently lost.
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                <Button
                  variant="outlined"
                  onClick={handleCancelDelete}
                  sx={{ borderRadius: 2, flex: 1 }}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  onClick={handleDeleteAccount}
                  startIcon={<DeleteIcon />}
                  sx={{ borderRadius: 2, flex: 1 }}
                >
                  Delete Account
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Box>
      )}
    </Box>
  );
};

export default MyAccountPage;