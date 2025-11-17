import React, { useRef, useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  useTheme,
  useMediaQuery,
  IconButton,
  Dialog,
  DialogContent,
  DialogActions,
  LinearProgress,
  Chip,
  CircularProgress,
  Alert,
} from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import LockIcon from '@mui/icons-material/Lock';
import StarIcon from '@mui/icons-material/Star';
import WorkIcon from '@mui/icons-material/Work';
import BusinessIcon from '@mui/icons-material/Business';
import LocationOnIcon from '@mui/icons-material/LocationOn';

import resume1 from '../assets/resume1.png';
import resume2 from '../assets/resume2.png';
import resume3 from '../assets/resume3.png';
import resume4 from '../assets/resume4.png';
import resume5 from '../assets/resume5.png';
import resume6 from '../assets/resume6.png';
import resume7 from '../assets/resume7.png';
import resume8 from '../assets/resume8.png';
import Resume9 from "../assets/resume9.png";
import Resume10 from "../assets/resume10.png";  
import Resume11 from "../assets/resume11.png";
import Resume12 from "../assets/resume12.png";
import Resume13 from "../assets/resume13.png";
import Resume14 from "../assets/resume14.png";
import Resume15 from "../assets/resume15.png";
import Resume16 from "../assets/resume16.png";
import Resume17 from "../assets/resume17.png";  
import Resume18 from "../assets/resume18.png";
import Resume19 from "../assets/resume19.png";
import Resume20 from "../assets/resume20.png";
import Resume21 from "../assets/resume21.png";

const resumes = [
  resume1, resume2, resume3, resume4, resume5, resume6, resume7, resume8,
  Resume9, Resume10, Resume11, Resume12, Resume13, Resume14, Resume15,
  Resume16, Resume17, Resume18, Resume19, Resume20, Resume21,
];

// Premium templates list (Template numbers, not indexes)
const PREMIUM_TEMPLATES = [1, 2, 4, 5, 7, 8, 9, 10, 11, 16, 17, 20];

// JSearch API Configuration
const JSEARCH_CONFIG = {
  apiKey: 'f208d9682amsh418080df3cfa881p16e6d5jsna538b0fb1fe5',
  baseUrl: 'https://jsearch.p.rapidapi.com',
  host: 'jsearch.p.rapidapi.com'
};

// Enhanced Fallback job ads
const FALLBACK_JOB_ADS = [
  {
    id: 1,
    title: "Frontend Developer",
    company: "Tech Innovations Ltd",
    location: "Chennai, Tamil Nadu",
    salary: "₹6,00,000 - ₹12,00,000/yr",
    description: "Looking for skilled React developers to build modern web applications. Experience with TypeScript and state management required.",
    type: "Full-time",
    posted: "1 day ago",
    logo: "https://images.unsplash.com/photo-1556656793-08538906a9f8?w=100&h=100&fit=crop",
    adType: "job",
    duration: 10,
    cta: "Apply Now",
    advertiser: "JSearch Jobs",
    experience: "2-4 Years",
    skills: ["React", "JavaScript", "TypeScript", "CSS", "HTML5"],
    source: "fallback",
    url: "#"
  },
  {
    id: 2,
    title: "Backend Engineer",
    company: "Cloud Systems Inc",
    location: "Hyderabad, Telangana",
    salary: "₹8,00,000 - ₹15,00,000/yr",
    description: "Build scalable backend systems using Node.js and Python. Experience with microservices architecture and cloud platforms preferred.",
    type: "Full-time",
    posted: "2 days ago",
    logo: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=100&h=100&fit=crop",
    adType: "job",
    duration: 10,
    cta: "Apply Now",
    advertiser: "JSearch Jobs",
    experience: "3-5 Years",
    skills: ["Node.js", "Python", "MongoDB", "AWS", "Docker"],
    source: "fallback",
    url: "#"
  },
];

// Number of ads required to unlock premium templates
const ADS_REQUIRED = 2;

const ResumeCarousel = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const scrollContainerRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleItems, setVisibleItems] = useState(3);
  
  // Premium and ad states
  const [adDialogOpen, setAdDialogOpen] = useState(false);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [adProgress, setAdProgress] = useState(0);
  const [selectedPremiumTemplate, setSelectedPremiumTemplate] = useState(null);
  const [watchedAds, setWatchedAds] = useState([]);
  const [unlockedTemplates, setUnlockedTemplates] = useState([]);
  const [progressInterval, setProgressInterval] = useState(null);
  
  // Job ads state
  const [jobAds, setJobAds] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [jobError, setJobError] = useState(null);
  const [apiStatus, setApiStatus] = useState('loading');

  // Ref to store the actual ads used for the current unlock
  const currentUnlockAds = useRef([]);

  const templateThemes = [
    "#1a2b47", "#791115ff", "#1a2b47", "#1a2b47", "#791115ff", "#1a2b47", 
    "#b7e1a1", "#f4b400", "#8b4b2b", "#2b2320", "#333333", "#36454F", 
    "#3A5A78", "#2d5c7f", "#333333", "#a7ad63ff", "#3f51b5", "#3498db", 
    "#795548", "#333", "#333"
  ];

  // Fetch real job data from JSearch API
  useEffect(() => {
    const fetchJSearchJobs = async () => {
      try {
        setLoadingJobs(true);
        setApiStatus('loading');
        
        const params = {
          query: 'software developer India',
          num_pages: '1',
          page: '1',
          country: 'in'
        };
        
        const response = await fetch(
          `${JSEARCH_CONFIG.baseUrl}/search?query=${encodeURIComponent(params.query)}&num_pages=${params.num_pages}&page=${params.page}&country=${params.country}`,
          {
            method: 'GET',
            headers: {
              'X-RapidAPI-Key': JSEARCH_CONFIG.apiKey,
              'X-RapidAPI-Host': JSEARCH_CONFIG.host
            }
          }
        );

        if (response.status === 429) {
          setApiStatus('rate_limited');
          throw new Error('Rate limit exceeded. Please try again later.');
        }

        if (!response.ok) {
          setApiStatus('error');
          throw new Error(`JSearch API request failed: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.status !== 'OK' || !data.data || data.data.length === 0) {
          setApiStatus('error');
          throw new Error('No jobs found from JSearch API');
        }

        // Transform JSearch data to our format
        const jobs = data.data.map(job => ({
          id: job.job_id || `job-${Math.random().toString(36).substr(2, 9)}`,
          title: job.job_title || 'Software Developer',
          company: job.employer_name || 'Tech Company',
          location: job.job_city ? 
            `${job.job_city}, ${job.job_country}` : 
            (job.job_country || 'Remote'),
          salary: job.job_salary_currency && job.job_max_salary ? 
            `${job.job_salary_currency} ${job.job_min_salary || ''} - ${job.job_max_salary}` 
            : 'Salary not disclosed',
          description: job.job_description ? 
            (job.job_description.slice(0, 160) + (job.job_description.length > 160 ? '...' : '')) 
            : 'Great opportunity for skilled professionals.',
          type: job.job_employment_type || 'Full-time',
          posted: job.job_posted_at_datetime_utc ? 
            new Date(job.job_posted_at_datetime_utc).toLocaleDateString() : 'Recently',
          logo: job.employer_logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(job.employer_name || 'Company')}&background=random&size=100`,
          adType: 'job',
          duration: 10,
          cta: 'Apply Now',
          advertiser: 'JSearch Jobs',
          experience: '2-4 Years',
          skills: job.job_required_skills || ['JavaScript', 'React', 'Node.js', 'CSS', 'HTML'],
          source: 'jsearch',
          url: job.job_apply_link || job.job_google_link || '#'
        }));

        setJobAds(jobs);
        setLoadingJobs(false);
        setApiStatus('success');
        
      } catch (error) {
        console.error('Error fetching JSearch jobs:', error);
        setApiStatus('error');
        setJobError(error.message);
        setJobAds(FALLBACK_JOB_ADS);
        setLoadingJobs(false);
      }
    };

    const timer = setTimeout(() => {
      fetchJSearchJobs();
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Calculate visible items based on screen size
  useEffect(() => {
    const updateVisibleItems = () => {
      if (window.innerWidth < 600) {
        setVisibleItems(1);
      } else if (window.innerWidth < 960) {
        setVisibleItems(2);
      } else {
        setVisibleItems(3);
      }
    };

    updateVisibleItems();
    window.addEventListener('resize', updateVisibleItems);
    return () => window.removeEventListener('resize', updateVisibleItems);
  }, []);

  // Check if user has premium access
  const hasPremiumAccess = () => {
    const userData = localStorage.getItem("userData");
    if (userData) {
      try {
        const user = JSON.parse(userData);
        return user.isPremium || false;
      } catch (e) {
        return false;
      }
    }
    return false;
  };

  // Check if template is premium
  const isPremiumTemplate = (templateIndex) => {
    return PREMIUM_TEMPLATES.includes(templateIndex + 1);
  };

  // Check if template is unlocked
  const isTemplateUnlocked = (templateIndex) => {
    return hasPremiumAccess() || unlockedTemplates.includes(templateIndex + 1) || !isPremiumTemplate(templateIndex);
  };

  // Get ads for premium template unlocking - ONLY LIVE JSEARCH ADS
  const getAdsForPremiumUnlock = () => {
    const requiredAdsCount = ADS_REQUIRED;
    const liveAds = jobAds.filter(ad => ad.source === 'jsearch');
    
    if (liveAds.length >= requiredAdsCount) {
      console.log(`Using ${requiredAdsCount} live ads for premium unlock`);
      return liveAds.slice(0, requiredAdsCount);
    } 
    
    console.log(`Not enough live ads available (${liveAds.length}/${requiredAdsCount})`);
    
    if (liveAds.length === 0) {
      alert('⚠️ Live job data not available. Please try again later when JSearch API is connected.');
    } else {
      alert(`⚠️ Only ${liveAds.length} live job(s) available. Need ${requiredAdsCount} live jobs to unlock premium templates.`);
    }
    
    return [];
  };

  const handleTemplateClick = (index) => {
    if (isPremiumTemplate(index) && !isTemplateUnlocked(index)) {
      const adsForUnlock = getAdsForPremiumUnlock();
      
      if (adsForUnlock.length < ADS_REQUIRED) {
        console.log('Not enough live ads available for premium unlock');
        return;
      }
      
      currentUnlockAds.current = adsForUnlock;
      
      console.log(`Premium template unlock attempt. Using ${adsForUnlock.length} LIVE ads`);
      
      setSelectedPremiumTemplate({ 
        index: index,
        theme: templateThemes[index] || "#4A90E2",
      });
      setAdDialogOpen(true);
      setCurrentAdIndex(0);
      setAdProgress(0);
      setWatchedAds([]);
      return;
    }

    proceedWithTemplateSelection(index);
  };

  const proceedWithTemplateSelection = (index) => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login", {
        state: {
          from: "/HeadingContactPage",
          selectedTemplate: index + 1,
          selectedTheme: templateThemes[index] || "#4A90E2",
        },
      });
    } else {
      navigate("/HeadingContactPage", {
        state: {
          selectedTemplate: index + 1,
          selectedTheme: templateThemes[index] || "#4A90E2",
        },
      });
    }
  };

  const handleAdComplete = () => {
    const currentAd = getCurrentAd();
    setWatchedAds(prev => [...prev, currentAd.id]);
    
    if (currentAdIndex < ADS_REQUIRED - 1) {
      setCurrentAdIndex(prev => prev + 1);
      setAdProgress(0);
    } else {
      if (selectedPremiumTemplate) {
        const templateNumber = selectedPremiumTemplate.index + 1;
        setUnlockedTemplates(prev => {
            if (!prev.includes(templateNumber)) {
                return [...prev, templateNumber];
            }
            return prev;
        });
        
        setAdDialogOpen(false);
        setTimeout(() => {
            proceedWithTemplateSelection(selectedPremiumTemplate.index);
        }, 0);
      }
    }
  };

  const handleAdClose = () => {
    setAdDialogOpen(false);
    setSelectedPremiumTemplate(null);
    currentUnlockAds.current = [];
    setAdProgress(0);
    setCurrentAdIndex(0);
    if (progressInterval) {
      clearInterval(progressInterval);
    }
  };

  // Get current ad for display
  const getCurrentAd = () => {
    return currentUnlockAds.current?.[currentAdIndex] || FALLBACK_JOB_ADS[0];
  };

  // Handle ad progress simulation
  useEffect(() => {
    let interval;
    if (adDialogOpen) {
      const currentAd = getCurrentAd();
      interval = setInterval(() => {
        setAdProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            handleAdComplete();
            return 100;
          }
          return prev + (100 / (currentAd.duration * 10)); 
        });
      }, 100);

      setProgressInterval(interval);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [adDialogOpen, currentAdIndex, selectedPremiumTemplate]);

  // Calculate total dots needed
  const totalDots = Math.ceil(resumes.length / visibleItems);

  // Update current index when scrolling
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollLeft = container.scrollLeft;
      const itemWidth = container.firstChild?.firstChild?.offsetWidth || 300;
      const gap = 16;
      const totalItemWidth = itemWidth + gap;
      
      const newIndex = Math.round(scrollLeft / totalItemWidth);
      const maxIndex = resumes.length - visibleItems;
      setCurrentIndex(Math.max(0, Math.min(newIndex, maxIndex)));
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [visibleItems]);

  const scroll = (direction) => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const itemWidth = container.firstChild?.firstChild?.offsetWidth || 300;
    const gap = 16;
    const scrollAmount = (itemWidth + gap) * (direction === 'left' ? -1 : 1);
    
    container.scrollBy({
      left: scrollAmount,
      behavior: 'smooth',
    });
  };

  const goToSlide = (dotIndex) => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const itemWidth = container.firstChild?.firstChild?.offsetWidth || 300;
    const gap = 16;
    const scrollPosition = dotIndex * visibleItems * (itemWidth + gap);
    
    container.scrollTo({
      left: scrollPosition,
      behavior: 'smooth',
    });
  };

  // Calculate active dot index
  const activeDot = Math.floor(currentIndex / visibleItems);

  // Render Ad Dialog
  const renderAdDialog = () => {
    const currentAd = getCurrentAd();
    const isLiveAd = currentAd?.source === 'jsearch';
    
    return (
      <Dialog 
        open={adDialogOpen} 
        onClose={handleAdClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            overflow: 'hidden',
            maxWidth: '800px'
          }
        }}
      >
        <DialogContent sx={{ p: 0 }}>
          {/* Ad Header */}
          <Box sx={{ p: 3, bgcolor: '#f8f9fa', textAlign: 'center', borderBottom: '1px solid #e0e0e0' }}>
            <Typography variant="h5" fontWeight="bold" color="primary" gutterBottom>
              Unlock Premium Template #{selectedPremiumTemplate?.index + 1}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Watch {ADS_REQUIRED} LIVE job ads to unlock this premium template
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
              Live Job Opportunity • JSearch API • Real-time Data
            </Typography>
            
            <Chip 
              label="✅ Live Job Data" 
              size="small" 
              color="success" 
              variant="outlined"
              sx={{ mt: 1 }}
            />
          </Box>
          
          {/* Ad Progress */}
          <Box sx={{ px: 3, pt: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Template Unlock Progress
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Ad {currentAdIndex + 1} of {ADS_REQUIRED}
              </Typography>
            </Box>
            <LinearProgress 
              variant="determinate" 
              value={adProgress} 
              sx={{ 
                height: 8, 
                borderRadius: 4,
                bgcolor: '#e0e0e0',
                '& .MuiLinearProgress-bar': {
                  background: 'linear-gradient(45deg, #4caf50, #2e7d32)',
                  borderRadius: 4,
                }
              }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
              <Typography variant="body2" color="text.secondary">
                {Math.round(adProgress)}% Complete
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {currentAd?.duration || 10}s
              </Typography>
            </Box>
          </Box>
          
          {/* Ad Content */}
          <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', gap: 3, alignItems: 'flex-start' }}>
              <Box
                component="img"
                src={currentAd?.logo}
                alt={currentAd?.company}
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: 2,
                  bgcolor: '#f5f5f5',
                  p: 1,
                  objectFit: 'cover'
                }}
                onError={(e) => {
                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(currentAd?.company || 'Company')}&background=random&size=80`;
                }}
              />
              <Box sx={{ flex: 1 }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  {currentAd?.title}
                </Typography>
                <Typography variant="body1" color="primary" gutterBottom>
                  {currentAd?.company} • {currentAd?.location}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  💰 {currentAd?.salary}
                </Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  {currentAd?.description}
                </Typography>
                
                {/* Job Details */}
                <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
                  <Chip 
                    icon={<WorkIcon />} 
                    label={currentAd?.type} 
                    size="small" 
                    variant="outlined" 
                  />
                  <Chip 
                    icon={<BusinessIcon />} 
                    label={currentAd?.experience} 
                    size="small" 
                    variant="outlined" 
                  />
                  <Chip 
                    icon={<LocationOnIcon />} 
                    label={currentAd?.location} 
                    size="small" 
                    variant="outlined" 
                  />
                </Box>
                
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                  {currentAd?.skills?.slice(0, 4).map((skill, index) => (
                    <Chip
                      key={index}
                      label={skill}
                      size="small"
                      variant="outlined"
                    />
                  ))}
                </Box>
                
                <Button 
                  variant="contained" 
                  color="success"
                  sx={{ borderRadius: 2 }}
                  fullWidth
                  onClick={() => currentAd?.url && currentAd.url !== '#' && window.open(currentAd.url, '_blank', 'noopener,noreferrer')}
                  startIcon={<WorkIcon />}
                >
                  {currentAd?.cta || "Apply Now"}
                </Button>
              </Box>
            </Box>
            
            {/* Ad Info */}
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Typography variant="caption" color="text.secondary">
                ✅ Live job data from JSearch API • {ADS_REQUIRED - (currentAdIndex + 1)} more live job(s) to watch for template unlock
              </Typography>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, justifyContent: 'space-between', bgcolor: '#f8f9fa' }}>
          <Button 
            onClick={handleAdClose} 
            color="secondary" 
            variant="outlined"
            sx={{ borderRadius: 2 }}
          >
            Cancel Unlock
          </Button>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {[...Array(ADS_REQUIRED)].map((_, idx) => (
                <Box
                  key={idx}
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    bgcolor: idx <= currentAdIndex ? '#4caf50' : '#e0e0e0',
                    transition: 'all 0.3s ease',
                  }}
                />
              ))}
            </Box>
            <Typography variant="body2" color="text.secondary">
              {currentAdIndex + 1}/{ADS_REQUIRED} live ads watched
            </Typography>
          </Box>
        </DialogActions>
      </Dialog>
    );
  };

  return (
    <Box sx={{ backgroundColor: '#fff', py: { xs: 3, md: 4 }, textAlign: 'center' }}>
      <Typography
        variant={isMobile ? "h6" : "h5"}
        fontWeight="bold"
        gutterBottom
        color="text.primary"
        sx={{
          px: { xs: 2, md: 0 },
          fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.75rem' },
        }}
      >
        Pick one of many world-class templates and build your resume in minutes
      </Typography>

      {/* API Status Indicator */}
      <Box sx={{ px: 2, mb: 2 }}>
        <Chip 
          label={
            apiStatus === 'success' ? 
              `✅ ${jobAds.filter(ad => ad.source === 'jsearch').length} live jobs available` : 
              apiStatus === 'loading' ? '⏳ Loading job data...' :
              apiStatus === 'rate_limited' ? '⚠️ Rate limit reached' :
              '⚠️ Live data required for premium unlock'
          }
          color={
            apiStatus === 'success' ? 'success' :
            apiStatus === 'loading' ? 'warning' : 'error'
          }
          variant="outlined"
          size="small"
        />
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
          Premium templates require {ADS_REQUIRED} live job ads from JSearch API
        </Typography>
      </Box>

      {/* Scrollable Container */}
      <Box
        ref={scrollContainerRef}
        sx={{
          overflowX: 'auto',
          whiteSpace: 'nowrap',
          width: '100%',
          mt: { xs: 3, md: 4 },
          px: { xs: 1, md: 1 },
          scrollbarWidth: 'none',
          '&::-webkit-scrollbar': { display: 'none' },
        }}
      >
        <Box sx={{ display: 'inline-flex', gap: 2 }}>
          {resumes.map((img, idx) => {
            const isPremium = isPremiumTemplate(idx);
            const isUnlocked = isTemplateUnlocked(idx);
            const liveAdsAvailable = jobAds.filter(ad => ad.source === 'jsearch').length >= ADS_REQUIRED;

            return (
              <Box
                key={idx}
                component={motion.div}
                initial="rest"
                whileHover="hover"
                animate="rest"
                variants={{
                  rest: { scale: 1 },
                  hover: { scale: 1.05 },
                }}
                sx={{
                  position: 'relative',
                  width: { xs: 250, sm: 280, md: 370 },
                  height: { xs: 350, sm: 380, md: 470 },
                  overflow: 'hidden',
                  flexShrink: 0,
                  backgroundColor: '#fff',
                  cursor: isPremium && !isUnlocked && !liveAdsAvailable ? 'not-allowed' : 'pointer',
                  padding: { xs: 1, md: 1 },
                  border: isPremium ? "2px solid #ff9800" : "1px solid #ddd",
                  boxShadow: isPremium ? 3 : 1,
                  opacity: isPremium && !isUnlocked ? 0.8 : 1,
                }}
                onClick={() => handleTemplateClick(idx)}
              >
                {/* Premium Badge */}
                {isPremium && (
                  <Chip
                    icon={<StarIcon />}
                    label="PREMIUM"
                    color="warning"
                    size="small"
                    sx={{
                      position: "absolute",
                      top: 8,
                      left: 8,
                      fontWeight: "bold",
                      fontSize: "0.7rem",
                      zIndex: 2,
                    }}
                  />
                )}

                {/* Lock Overlay for locked premium templates */}
                {isPremium && !isUnlocked && (
                  <Box
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      backgroundColor: "rgba(0, 0, 0, 0.5)",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      zIndex: 1,
                      borderRadius: 1,
                    }}
                  >
                    <LockIcon sx={{ fontSize: 40, color: "#fff", mb: 1 }} />
                    <Typography variant="body2" color="#fff" textAlign="center" sx={{ px: 2 }}>
                      {liveAdsAvailable ? 
                        `Watch ${ADS_REQUIRED} live ads\nto unlock` : 
                        "Live job data\nrequired to unlock"
                      }
                    </Typography>
                  </Box>
                )}

                {/* Resume Image */}
                <Box
                  component="img"
                  src={img}
                  alt={`Resume ${idx + 1}`}
                  sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    borderRadius: 1,
                    filter: isPremium && !isUnlocked ? "blur(2px)" : "none",
                  }}
                />

                {/* Hover Button */}
                <Box
                  component={motion.div}
                  variants={{ rest: { opacity: 0 }, hover: { opacity: 1 } }}
                  transition={{ duration: 0.3 }}
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 2,
                  }}
                >
                  <Button
                    variant="contained"
                    sx={{
                      background: isPremium && !isUnlocked 
                        ? (liveAdsAvailable ? "linear-gradient(45deg, #ff9800, #ff5722)" : "linear-gradient(45deg, #9e9e9e, #757575)")
                        : "linear-gradient(to right, #6a11cb, #2575fc)",
                      color: "#fff",
                      fontWeight: "bold",
                      px: { xs: 2, md: 3 },
                      py: { xs: 1, md: 1.5 },
                      borderRadius: "12px",
                      fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1rem' },
                      minWidth: { xs: '120px', sm: 'auto' },
                      "&:hover": {
                        background: isPremium && !isUnlocked 
                          ? (liveAdsAvailable ? "linear-gradient(45deg, #ff5722, #ff9800)" : "linear-gradient(45deg, #757575, #9e9e9e)")
                          : "linear-gradient(to right, #2575fc, #6a11cb)",
                      },
                      cursor: isPremium && !isUnlocked && !liveAdsAvailable ? 'not-allowed' : 'pointer',
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTemplateClick(idx);
                    }}
                    startIcon={isPremium && !isUnlocked ? <LockIcon /> : null}
                    disabled={isPremium && !isUnlocked && !liveAdsAvailable}
                  >
                    {isPremium && !isUnlocked ? 
                      (liveAdsAvailable ? `Unlock (${ADS_REQUIRED} ads)` : "Live Data Required") 
                      : "Use Template"}
                  </Button>
                </Box>
              </Box>
            );
          })}
        </Box>
      </Box>

      {/* Navigation Arrows and Dots */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 3, gap: 2 }}>
        {/* Left Arrow */}
        <IconButton 
          onClick={() => scroll('left')} 
          sx={{ 
            backgroundColor: '#f5f5f5',
            '&:hover': { backgroundColor: '#e0e0e0' }
          }}
          disabled={currentIndex === 0}
        >
          <ArrowBackIosIcon />
        </IconButton>

        {/* Dots Indicator */}
        <Box sx={{ display: 'flex', gap: 1 }}>
          {Array.from({ length: totalDots }).map((_, index) => (
            <Box
              key={index}
              onClick={() => goToSlide(index)}
              sx={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                backgroundColor: activeDot === index ? 'primary.main' : 'grey.300',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: activeDot === index ? 'primary.main' : 'grey.400',
                },
              }}
            />
          ))}
        </Box>

        {/* Right Arrow */}
        <IconButton 
          onClick={() => scroll('right')} 
          sx={{ 
            backgroundColor: '#f5f5f5',
            '&:hover': { backgroundColor: '#e0e0e0' }
          }}
          disabled={currentIndex >= resumes.length - visibleItems}
        >
          <ArrowForwardIosIcon />
        </IconButton>
      </Box>

      {/* Ad Dialog */}
      {renderAdDialog()}

      {/* Footer Info */}
      <Box sx={{ mt: 4, textAlign: 'center', p: 2, bgcolor: '#f8f9fa', borderRadius: 2, mx: 2 }}>
        <Typography variant="body2" color="text.secondary">
          💡 Premium templates require {ADS_REQUIRED} LIVE job ads from JSearch API • 
          Current Status: {apiStatus === 'success' ? 
            `✅ ${jobAds.filter(ad => ad.source === 'jsearch').length} live jobs available` : 
            '⚠️ Live data required for premium unlock'
          }
        </Typography>
      </Box>
    </Box>
  );
};

export default ResumeCarousel;