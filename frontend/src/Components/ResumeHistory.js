// ResumeHistory.js
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Alert,
  CircularProgress
} from "@mui/material";
import { Delete, Download, Visibility, Edit } from "@mui/icons-material";
import axios from "axios";

const ResumeHistory = () => {
  const [resumeHistory, setResumeHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [selectedResume, setSelectedResume] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [resumeToDelete, setResumeToDelete] = useState(null);

  // Fetch resume history from backend
  useEffect(() => {
    fetchResumeHistory();
  }, []);

  const fetchResumeHistory = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      const res = await axios.get("https://resume-maker-lc.onrender.com/api/resumes/history", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setResumeHistory(res.data);
    } catch (error) {
      console.error("Error fetching resume history:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePreview = (resume) => {
    setSelectedResume(resume);
    setPreviewDialogOpen(true);
  };

  const handleDownload = async (resume) => {
    try {
      const response = await axios.get(`https://resume-maker-lc.onrender.com/api/resumes/download/${resume._id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        responseType: 'blob'
      });

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${resume.fileName}.${resume.fileFormat}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error downloading resume:", error);
    }
  };

  const handleDeleteClick = (resume) => {
    setResumeToDelete(resume);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`https://resume-maker-lc.onrender.com/api/resumes/${resumeToDelete._id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      setResumeHistory(prev => prev.filter(resume => resume._id !== resumeToDelete._id));
      setDeleteDialogOpen(false);
      setResumeToDelete(null);
    } catch (error) {
      console.error("Error deleting resume:", error);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="200px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Resume History
      </Typography>
      
      {resumeHistory.length === 0 ? (
        <Alert severity="info">
          No resume history found. Download resumes from the resume editor to see them here.
        </Alert>
      ) : (
        <Grid container spacing={3}>
          {resumeHistory.map((resume) => (
            <Grid item xs={12} md={6} lg={4} key={resume._id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" gutterBottom>
                    {resume.fileName}
                  </Typography>
                  
                  <Box sx={{ mb: 2 }}>
                    <Chip 
                      label={resume.fileFormat.toUpperCase()} 
                      size="small" 
                      color="primary" 
                      variant="outlined"
                      sx={{ mr: 1 }}
                    />
                    <Chip 
                      label={`Template ${resume.templateId}`} 
                      size="small" 
                      variant="outlined"
                    />
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    <strong>Downloaded:</strong> {new Date(resume.downloadedAt).toLocaleDateString()}
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    <strong>File Size:</strong> {formatFileSize(resume.fileSize)}
                  </Typography>
                  
                  {resume.themeColor && (
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                      <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
                        <strong>Theme:</strong>
                      </Typography>
                      <Box
                        sx={{
                          width: 20,
                          height: 20,
                          borderRadius: '50%',
                          backgroundColor: resume.themeColor,
                          border: '1px solid #ccc'
                        }}
                      />
                    </Box>
                  )}
                </CardContent>
                
                <CardActions>
                  <IconButton 
                    size="small" 
                    onClick={() => handlePreview(resume)}
                    color="primary"
                  >
                    <Visibility />
                  </IconButton>
                  <IconButton 
                    size="small" 
                    onClick={() => handleDownload(resume)}
                    color="primary"
                  >
                    <Download />
                  </IconButton>
                  <IconButton 
                    size="small" 
                    onClick={() => handleDeleteClick(resume)}
                    color="error"
                  >
                    <Delete />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Preview Dialog */}
      <Dialog 
        open={previewDialogOpen} 
        onClose={() => setPreviewDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Preview: {selectedResume?.fileName}
        </DialogTitle>
        <DialogContent>
          {selectedResume && (
            <Box>
              <Typography variant="body1" gutterBottom>
                <strong>Template:</strong> {selectedResume.templateId}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Format:</strong> {selectedResume.fileFormat}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Downloaded:</strong> {new Date(selectedResume.downloadedAt).toLocaleString()}
              </Typography>
              {/* You can add more preview details here */}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPreviewDialogOpen(false)}>Close</Button>
          <Button 
            variant="contained" 
            onClick={() => selectedResume && handleDownload(selectedResume)}
          >
            Download Again
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog 
        open={deleteDialogOpen} 
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Resume</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{resumeToDelete?.fileName}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            color="error" 
            onClick={handleDeleteConfirm}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ResumeHistory;