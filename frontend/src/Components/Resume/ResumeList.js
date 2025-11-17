import React, { useState, useEffect, useRef } from "react"; // Added useRef
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Button,
  useMediaQuery,
  useTheme,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
  Dialog,
  DialogContent,
  DialogActions,
  LinearProgress,
  Chip,
  Grid,
  CardActionArea,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import FilterListIcon from "@mui/icons-material/FilterList";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import StarIcon from "@mui/icons-material/Star";
import LockIcon from "@mui/icons-material/Lock";
import WorkIcon from "@mui/icons-material/Work";
import BusinessIcon from "@mui/icons-material/Business";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import NewReleasesIcon from "@mui/icons-material/NewReleases";

import Resume1, { resumeMeta as resume1Meta } from "./Resume1";
import Resume2, { resumeMeta as resume2Meta } from "./Resume2";
import Resume3, { resumeMeta as resume3Meta } from "./Resume3";
import Resume4, { resumeMeta as resume4Meta } from "./Resume4";
import Resume5, { resumeMeta as resume5Meta } from "./Resume5";
import Resume6, { resumeMeta as resume6Meta } from "./Resume6";
import Resume7, { resumeMeta as resume7Meta } from "./Resume7";
import Resume8, { resumeMeta as resume8Meta } from "./Resume8";
import Resume9, { resumeMeta as resume9Meta } from "./Resume9";
import Resume10, { resumeMeta as resume10Meta } from "./Resume10";
import Resume11, { resumeMeta as resume11Meta } from "./Resume11";
import Resume12, { resumeMeta as resume12Meta } from "./Resume12";
import Resume13, { resumeMeta as resume13Meta } from "./Resume13";
import Resume14, { resumeMeta as resume14Meta } from "./Resume14";
import Resume15, { resumeMeta as resume15Meta } from "./Resume15";
import Resume16, { resumeMeta as resume16Meta } from "./Resume16";
import Resume17, { resumeMeta as resume17Meta } from "./Resume17";
import Resume18, { resumeMeta as resume18Meta } from "./Resume18";
import Resume19, { resumeMeta as resume19Meta } from "./Resume19";
import Resume20, { resumeMeta as resume20Meta } from "./Resume20";
import Resume21, { resumeMeta as resume21Meta } from "./Resume21";
import Resume22, { resumeMeta as resume22Meta } from "./Resume22";
import Resume23, { resumeMeta as resume23Meta } from "./Resume23";
import Resume24, { resumeMeta as resume24Meta } from "./Resume24";
import Resume25, { resumeMeta as resume25Meta } from "./Resume25";
import Resume26, { resumeMeta as resume26Meta } from "./Resume26";

const resumeThemes = [
  ["#f57c00","#1a2b47", "#6a1b9a", "#2e7d32", "#d32f2f"], // Resume1
  ["#bfaeb2", "#1a2b47", "#2e7d32", "#6a1b9a", "#c62828"], // Resume2
  [
    { bg: "#f5f5f5", primary: "#2c3e50" },
    { bg: "#fff0f0", primary: "#c0392b" },
    { bg: "#f0fff0", primary: "#27ae60" },
    { bg: "#f0f8ff", primary: "#2980b9" },
    { bg: "#fcf3cf", primary: "#f39c12" },
  ], // Resume3
  [
    { primary: "#b83232", dark: "#5c0606ff" },
    { primary: "#1e88e5", dark: "#0d47a1" },
    { primary: "#43a047", dark: "#1b5e20" },
    { primary: "#fbc02d", dark: "#f57f17" },
    { primary: "#8e24aa", dark: "#4a148c" },
  ], // Resume4
  ["#1a2b47", "#6a1b9a", "#2e7d32", "#d32f2f", "#f57c00"], // Resume5
  ["#2196f3", "#4caf50", "#ff5722", "#795548", "#000"], // Resume6
  [
    { mainBg: "#2e4a23", sideBg: "#3e5a30", highlight: "#b7e1a1", text: "#fff" },
    { mainBg: "#1e3d59", sideBg: "#1a5276", highlight: "#f5b041", text: "#fff" },
    { mainBg: "#4a235a", sideBg: "#512e5f", highlight: "#bb8fce", text: "#fff" },
    { mainBg: "#641e16", sideBg: "#922b21", highlight: "#f1948a", text: "#fff" },
    { mainBg: "#0e6251", sideBg: "#117a65", highlight: "#efb490ff", text: "#fff" },
  ], // Resume7
  ["#00695c", "#4caf50", "#ff5722", "#795548", "#e61313ff"], // Resume8
  ["#1976d2", "#2e7d32", "#ed6c02", "#d32f2f", "#7b1fa2"], // Resume9
  ["#0288d1", "#c2185b", "#388e3c", "#f57c00", "#5d4037"], // Resume10
  ["#303f9f", "#00796b", "#d84315", "#6a1b9a", "#c62828"], // Resume11
  ["#5d4037", "#0277bd", "#558b2f", "#e65100", "#6a1b9a"], // Resume12
  ["#004d40", "#d84315", "#283593", "#689f38", "#ad1457"], // Resume13
  ["#37474f", "#00838f", "#5d4037", "#2e7d32", "#c62828"], // Resume14
  ["#4527a0", "#00695c", "#d84315", "#5d4037", "#0277bd"], // Resume15
  ["#33691e", "#d84315", "#01579b", "#4a148c", "#b71c1c"], // Resume16
  ["#00695c", "#d84315", "#283593", "#558b2f", "#6a1b9a"], // Resume17
  ["#004d40", "#d84315", "#1a237e", "#33691e", "#880e4f"], // Resume18
  ["#1b5e20", "#d84315", "#0d47a1", "#4a148c", "#b71c1c"], // Resume19
  ["#33691e", "#e65100", "#1565c0", "#6a1b9a", "#c62828"], // Resume20
  ["#1a237e", "#00695c", "#d84315", "#4a148c", "#b71c1c"], // Resume21
  ['#2c3e50', "#3f51b5", "#009688", "#ff9800", "#795548"], // Resume22 - UNIQUE COLORS
  ["#e91e63", "#00bcd4", "#8bc34a", "#ff5722", "#607d8b"], // Resume23 - UNIQUE COLORS
  ["#673ab7", "#009688", "#ffc107", "#f44336", "#795548"], // Resume24 - UNIQUE COLORS
  ["#3f51b5", "#4caf50", "#ff9800", "#f44336", "#9c27b0"], // Resume25 - UNIQUE COLORS
  ["#2196f3", "#ff5722", "#4caf50", "#9c27b0", "#607d8b"], // Resume26 - UNIQUE COLORS
];

const resumes = [
  Resume1, Resume2, Resume3, Resume4,
  Resume5, Resume6, Resume7, Resume8,
  Resume9, Resume10, Resume11, Resume12,
  Resume13, Resume14, Resume15, Resume16,
  Resume17, Resume18, Resume19, Resume20,
  Resume21, Resume22, Resume23, Resume24, Resume25, Resume26
];

const resumeMetas = [
  resume1Meta, resume2Meta, resume3Meta, resume4Meta,
  resume5Meta, resume6Meta, resume7Meta, resume8Meta,
  resume9Meta, resume10Meta, resume11Meta, resume12Meta,
  resume13Meta, resume14Meta, resume15Meta, resume16Meta,
  resume17Meta, resume18Meta, resume19Meta, resume20Meta,
  resume21Meta, resume22Meta, resume23Meta, resume24Meta, resume25Meta, resume26Meta
];

// Premium templates list (Template numbers, not indexes)
const PREMIUM_TEMPLATES = [1, 2, 4, 5, 7, 8, 9, 10, 11, 16, 17, 20, 22, 23, 24, 25, 26];

// JSearch API Configuration - Updated with your correct API key
const JSEARCH_CONFIG = {
  apiKey:'88679965dfmsh5b4b567dc9f707cp106e58jsn396762ffe2a4',
  baseUrl: 'https://jsearch.p.rapidapi.com',
  host: 'jsearch.p.rapidapi.com'
};

// Enhanced Fallback job ads with more realistic data
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
  {
    id: 3,
    title: "Full Stack Developer",
    company: "Digital Solutions Co",
    location: "Pune, Maharashtra",
    salary: "₹7,00,000 - ₹14,00,000/yr",
    description: "End-to-end web development using modern technologies. Work on both frontend and backend components of our platform.",
    type: "Full-time",
    posted: "3 days ago",
    logo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    adType: "job",
    duration: 10,
    cta: "Apply Now",
    advertiser: "JSearch Jobs",
    experience: "2-5 Years",
    skills: ["JavaScript", "React", "Node.js", "PostgreSQL", "REST API"],
    source: "fallback",
    url: "#"
  },
  {
    id: 4,
    title: "Mobile App Developer",
    company: "AppWorks Studio",
    location: "Bengaluru, Karnataka",
    salary: "₹5,00,000 - ₹11,00,000/yr",
    description: "Create beautiful mobile applications for iOS and Android using React Native. Focus on performance and user experience.",
    type: "Full-time",
    posted: "1 day ago",
    logo: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=100&h=100&fit=crop",
    adType: "job",
    duration: 10,
    cta: "Apply Now",
    advertiser: "JSearch Jobs",
    experience: "1-3 Years",
    skills: ["React Native", "JavaScript", "iOS", "Android", "Redux"],
    source: "fallback",
    url: "#"
  },
  {
    id: 5,
    title: "DevOps Engineer",
    company: "InfraTech Solutions",
    location: "Gurgaon, Haryana",
    salary: "₹9,00,000 - ₹18,00,000/yr",
    description: "Manage cloud infrastructure, CI/CD pipelines, and ensure system reliability. Experience with Kubernetes and Terraform required.",
    type: "Full-time",
    posted: "4 days ago",
    logo: "https://images.unsplash.com/photo-1547658719-da2b51169166?w=100&h=100&fit=crop",
    adType: "job",
    duration: 10,
    cta: "Apply Now",
    advertiser: "JSearch Jobs",
    experience: "3-6 Years",
    skills: ["AWS", "Kubernetes", "Docker", "Terraform", "CI/CD"],
    source: "fallback",
    url: "#"
  },
  {
    id: 6,
    title: "Data Scientist",
    company: "Analytics Pro",
    location: "Bangalore, Karnataka",
    salary: "₹9,00,000 - ₹16,00,000/yr",
    description: "Work with large datasets, build machine learning models, and provide data-driven insights for business decisions.",
    type: "Full-time",
    posted: "2 days ago",
    logo: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=100&h=100&fit=crop",
    adType: "job",
    duration: 10,
    cta: "Apply Now",
    advertiser: "JSearch Jobs",
    experience: "2-5 Years",
    skills: ["Python", "Machine Learning", "SQL", "Pandas", "TensorFlow"],
    source: "fallback",
    url: "#"
  }
];

// Number of ads required to unlock premium templates
const ADS_REQUIRED = 2;

const ResumeList = ({ experience }) => {
  const [selectedThemes, setSelectedThemes] = useState(
    resumeThemes.map((palette) => palette[0])
  );
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [filtersOpen, setFiltersOpen] = useState(false);
  
  // Premium and ad states
  const [adDialogOpen, setAdDialogOpen] = useState(false);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [adProgress, setAdProgress] = useState(0);
  const [selectedPremiumTemplate, setSelectedPremiumTemplate] = useState(null);
  const [watchedAds, setWatchedAds] = useState([]);
  // UPDATED: unlockedTemplates stores TEMPORARY unlocks (not persistent in localStorage)
  const [unlockedTemplates, setUnlockedTemplates] = useState([]); 
  const [progressInterval, setProgressInterval] = useState(null);
  
  // Job ads state
  const [jobAds, setJobAds] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [jobError, setJobError] = useState(null);
  const [apiStatus, setApiStatus] = useState('loading'); // 'loading', 'success', 'error', 'rate_limited'

  // Filter state
  const [filters, setFilters] = useState({
    withPhoto: false,
    withoutPhoto: false,
    oneColumn: false,
    twoColumn: false,
  });
  
  // Ref to store the actual ads used for the current unlock
  const currentUnlockAds = useRef([]); 

  // Function to map experience to JSearch query
  const getJSearchParams = (exp) => {
    const queryMap = {
      "No Experience": "fresher entry level developer India",
      "Less than 3 years": "junior software developer India", 
      "3-5 Years": "software developer India",
      "5-10 Years": "senior software engineer India",
      "10+ Years": "tech lead architect India"
    };

    return {
      query: queryMap[exp] || 'software developer India',
      num_pages: '1',
      page: '1',
      country: 'in'
    };
  };
  
  // Function to transform JSearch data to our format
  const transformJobData = (job, exp) => ({
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
        : 'Great opportunity for skilled professionals. Apply now to learn more about this position.',
      type: job.job_employment_type || 'Full-time',
      posted: job.job_posted_at_datetime_utc ? 
        new Date(job.job_posted_at_datetime_utc).toLocaleDateString() : 'Recently',
      logo: job.employer_logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(job.employer_name || 'Company')}&background=random&size=100`,
      adType: 'job',
      duration: 10,
      cta: 'Apply Now',
      advertiser: 'JSearch Jobs',
      experience: exp || '2-4 Years',
      skills: job.job_required_skills || ['JavaScript', 'React', 'Node.js', 'CSS', 'HTML'],
      source: 'jsearch',
      url: job.job_apply_link || job.job_google_link || '#'
  });

  // Fetch real job data from JSearch API with better error handling
  useEffect(() => {
    const fetchJSearchJobs = async () => {
      try {
        setLoadingJobs(true);
        setApiStatus('loading');
        
        const params = getJSearchParams(experience);
        
        console.log('Fetching jobs with params:', params);
        
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

        console.log('API Response status:', response.status);

        if (response.status === 429) {
          setApiStatus('rate_limited');
          throw new Error('Rate limit exceeded. Please try again later or upgrade your RapidAPI plan.');
        }

        if (!response.ok) {
          setApiStatus('error');
          throw new Error(`JSearch API request failed: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log('API Response data:', data);
        
        if (data.status !== 'OK' || !data.data || data.data.length === 0) {
          setApiStatus('error');
          throw new Error('No jobs found or invalid response from JSearch API');
        }

        // Transform JSearch data to our format
        const jobs = data.data.map(job => transformJobData(job, experience));

        setJobAds(jobs); // Store all fetched jobs
        setLoadingJobs(false);
        setApiStatus('success');
        
      } catch (error) {
        console.error('Error fetching JSearch jobs:', error);
        
        // Only set error status if it wasn't a rate limit error already
        if (apiStatus !== 'rate_limited') {
            setApiStatus('error');
        }
        setJobError(error.message);
        
        // Use enhanced fallback data with experience context
        const experienceBasedJobs = FALLBACK_JOB_ADS.map(job => ({
          ...job,
          title: `${experience} ${job.title}`,
          description: `Perfect role for ${experience.toLowerCase()} professional. ${job.description}`,
          experience: experience,
          posted: `${Math.floor(Math.random() * 3) + 1} days ago`
        }));

        setJobAds(experienceBasedJobs); // Use fallback for display
        setLoadingJobs(false);
      }
    };

    // Add delay to avoid rate limiting
    const timer = setTimeout(() => {
      fetchJSearchJobs();
    }, 1000);

    return () => clearTimeout(timer);
  }, [experience]);

  // Check if user has premium access
  const hasPremiumAccess = () => {
    const userData = localStorage.getItem("userData");
    if (userData) {
      try {
        const user = JSON.parse(userData);
        // Assuming user.isPremium is the persistent premium status
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
    // Check for persistent premium access OR temporary unlock
    return hasPremiumAccess() || unlockedTemplates.includes(templateIndex + 1) || !isPremiumTemplate(templateIndex);
  };

  // UPDATED: Get ads for premium template unlocking - ONLY LIVE JSEARCH ADS
  const getAdsForPremiumUnlock = () => {
    const requiredAdsCount = ADS_REQUIRED;
    
    // 1. Check if we have enough live JSearch ads
    const liveAds = jobAds.filter(ad => ad.source === 'jsearch');
    
    if (liveAds.length >= requiredAdsCount) {
      console.log(`Using ${requiredAdsCount} live ads for premium unlock`);
      return liveAds.slice(0, requiredAdsCount);
    } 
    
    // 2. If not enough live ads, show error and prevent unlocking
    console.log(`Not enough live ads available (${liveAds.length}/${requiredAdsCount})`);
    
    // Show alert to user
    if (liveAds.length === 0) {
      alert('⚠️ Live job data not available. Please try again later when JSearch API is connected.');
    } else {
      alert(`⚠️ Only ${liveAds.length} live job(s) available. Need ${requiredAdsCount} live jobs to unlock premium templates. Please try again later.`);
    }
    
    return []; // Return empty array to prevent unlocking
  };

  const handleThemeChange = (resumeIdx, colorOrObj) => {
    setSelectedThemes((prev) =>
      prev.map((theme, idx) => (idx === resumeIdx ? colorOrObj : theme))
    );
  };

  const handleFilterChange = (event) => {
    setFilters({ ...filters, [event.target.name]: event.target.checked });
  };

  const handleTemplateSelect = (templateIndex, theme) => {
    if (isPremiumTemplate(templateIndex) && !isTemplateUnlocked(templateIndex)) {
      // Use the ad selection logic - ONLY LIVE ADS
      const adsForUnlock = getAdsForPremiumUnlock();
      
      // If no live ads available, don't open dialog
      if (adsForUnlock.length < ADS_REQUIRED) {
        console.log('Not enough live ads available for premium unlock');
        return;
      }
      
      currentUnlockAds.current = adsForUnlock; // Store the ads in ref
      
      console.log(`Premium template unlock attempt. Using ${adsForUnlock.length} LIVE ads:`, 
        adsForUnlock.map(ad => ({ title: ad.title, source: ad.source })));
      
      setSelectedPremiumTemplate({ 
        index: templateIndex, 
        theme,
      });
      setAdDialogOpen(true);
      setCurrentAdIndex(0);
      setAdProgress(0);
      setWatchedAds([]); // Reset watched ads for a new unlock attempt
      return;
    }

    proceedWithTemplateSelection(templateIndex, theme);
  };

  const proceedWithTemplateSelection = (templateIndex, theme) => {
    const token = localStorage.getItem("token");

    if (token) {
      navigate("/HeadingContactPage", {
        state: {
          selectedTemplate: templateIndex + 1,
          selectedTheme: theme,
        },
      });
    } else {
      localStorage.setItem("pendingTemplate", JSON.stringify({
        selectedTemplate: templateIndex + 1,
        selectedTheme: theme,
      }));
      navigate("/Signup");
    }
  };

  const handleAdComplete = () => {
    const currentAd = getCurrentAd();
    setWatchedAds(prev => [...prev, currentAd.id]);
    
    if (currentAdIndex < ADS_REQUIRED - 1) {
      setCurrentAdIndex(prev => prev + 1);
    } else {
      // All ads completed - unlock the template
      if (selectedPremiumTemplate) {
        const templateNumber = selectedPremiumTemplate.index + 1;
        // Temporary Unlock: Add to state but DO NOT persist to localStorage
        setUnlockedTemplates(prev => {
            if (!prev.includes(templateNumber)) {
                return [...prev, templateNumber];
            }
            return prev;
        });
        
        setAdDialogOpen(false);
        // Use setTimeout to ensure state update is processed before navigating
       // REFRESH AFTER UNLOCK
        setTimeout(() => {
          proceedWithTemplateSelection(selectedPremiumTemplate.index, selectedPremiumTemplate.theme);
        }, 100);
      }
    }
  };

  const handleAdClose = () => {
    setAdDialogOpen(false);
    setSelectedPremiumTemplate(null);
    currentUnlockAds.current = []; // Clear the ads for this attempt
    setAdProgress(0);
    setCurrentAdIndex(0);
    if (progressInterval) {
      clearInterval(progressInterval);
    }
  };

  // Get current ad for display - uses the Ref now
  const getCurrentAd = () => {
    return currentUnlockAds.current?.[currentAdIndex] || FALLBACK_JOB_ADS[0];
  };

  // Handle ad progress simulation
  useEffect(() => {
    if (!adDialogOpen) return;

    setAdProgress(0); // Reset progress for new ad

    const currentAd = getCurrentAd();
    const inc = 100 / (currentAd.duration * 10);

    const interval = setInterval(() => {
      setAdProgress(prev => Math.min(prev + inc, 100));
    }, 100);

    setProgressInterval(interval);

    return () => clearInterval(interval);
  }, [adDialogOpen, currentAdIndex]);

  // Separate effect to handle completion
  useEffect(() => {
    if (adProgress >= 100 && adDialogOpen) {
      if (progressInterval) {
        clearInterval(progressInterval);
      }
      handleAdComplete();
    }
  }, [adProgress, adDialogOpen]);

  const getRecommendedIndexes = (exp) => {
    if (!exp || exp === "3-5 Years") {
      return [1, 2, 3, 8, 9, 10, 12, 21, 22, 23, 24, 25];
    }
    if (exp === "No Experience") {
      return [0, 4, 5, 11, 12, 13];
    }
    if (exp === "Less than 3 years") {
      return [0, 1, 4, 14, 15, 16];
    }
    if (exp === "5-10 Years") {
      return [2, 3, 5, 6, 17, 18];
    }
    if (exp === "10+ Years") {
      return [3, 5, 6, 7, 19, 20];
    }
    return [1, 2, 3, 8, 9, 10];
  };

  const recommendedIndexes = getRecommendedIndexes(experience);

  const filteredIndexes = resumes
    .map((_, idx) => idx)
    .filter((idx) => {
      const meta = resumeMetas[idx];

      // PHOTO FILTER
      if (filters.withPhoto && filters.withoutPhoto) {
        // both selected → show all
      } else if (filters.withPhoto && !meta.hasPhoto) {
        return false;
      } else if (filters.withoutPhoto && meta.hasPhoto) {
        return false;
      }

      // COLUMN FILTER
      if (filters.oneColumn && filters.twoColumn) {
        // both selected → show all
      } else if (filters.oneColumn && meta.columns !== 1) {
        return false;
      } else if (filters.twoColumn && meta.columns !== 2) {
        return false;
      }

      // EXPERIENCE FILTER (only applies if no other filters are active)
      if (experience) {
        const recommended = getRecommendedIndexes(experience);
        return recommended.includes(idx);
      }

      return true;
    });

  // Render Job Ads Section with better status handling
  const renderJobAds = () => (
    <Box sx={{ mb: 6 }}>
   

     
    </Box>
  );

  // Resume card rendering function
  const renderResumeCard = (index) => {
    const ResumeComponent = resumes[index];
    const cardWidth = isMobile ? 280 : 300;
    const cardHeight = isMobile ? 380 : 420;
    const scaleFactor = isMobile ? 380 / 1123 : 420 / 1123;
    
    const isPremium = isPremiumTemplate(index);
    const isUnlocked = isTemplateUnlocked(index);
    
    // Check if live ads are available for unlocking
    const liveAdsAvailable = jobAds.filter(ad => ad.source === 'jsearch').length >= ADS_REQUIRED;
    
    return (
      <Box key={index} display="flex" flexDirection="column" alignItems="center" sx={{ width: isMobile ? "100%" : "auto", mb: 4 }}>
        <Card
          sx={{
            width: cardWidth,
            height: cardHeight,
            position: "relative",
            border: isPremium ? "2px solid #ff9800" : "1px solid #ddd",
            boxShadow: isPremium ? 4 : 3,
            overflow: "hidden",
            transition: "all 0.3s ease",
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: isPremium ? 6 : 4,
            }
          }}
        >
          <CardContent
            sx={{
              p: 0,
              width: "100%",
              height: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              bgcolor: "#eee",
              position: "relative",
            }}
          >
            {isPremium && !isUnlocked && (
              <Box
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  zIndex: 10,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <Box
                  sx={{
                    backgroundColor: "rgba(255, 255, 255, 0.9)",
                    borderRadius: 2,
                    padding: "8px 16px",
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    boxShadow: 3,
                  }}
                >
                  <LockIcon sx={{ fontSize: 20, color: "#ff9800" }} />
                  <Typography variant="body2" fontWeight="bold" color="#ff9800">
                    Premium Template
                  </Typography>
                </Box>
                
                {!liveAdsAvailable && (
                  <Typography variant="caption" sx={{ color: "#f44336", textAlign: "center", fontWeight: 'bold' }}>
                    ⚠️ Check API Status
                  </Typography>
                )}
              </Box>
            )}

            <Box
              sx={{
                width: "210mm",
                height: "297mm",
                transform: `scale(${scaleFactor})`,
                transformOrigin: "center",
                opacity: isPremium && !isUnlocked ? 0.7 : 1,
              }}
            >
              <ResumeComponent
                color={selectedThemes[index]}  theme={selectedThemes[index]}
                setTheme={(colorOrObj) => handleThemeChange(index, colorOrObj)}
              />
            </Box>
          </CardContent>
          
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
                fontSize: "0.75rem",
              }}
            />
          )}

          {recommendedIndexes.includes(index) && (
            <Box
              sx={{
                position: "absolute",
                bottom: 8,
                right: 8,
                bgcolor: "#f50057",
                color: "white",
                px: 2,
                py: 0.5,
                borderRadius: 1,
                fontSize: "12px",
                fontWeight: "bold",
              }}
            >
              RECOMMENDED
            </Box>
          )}
        </Card>
        
        <Box display="flex" justifyContent="center" gap={1} mt={2}>
          {resumeThemes[index].map((colorOrObj, i) => (
            <Box
              key={i}
              onClick={() => handleThemeChange(index, colorOrObj)}
              sx={{
                width: 24,
                height: 24,
                borderRadius: "50%",
                bgcolor:
                  typeof colorOrObj === "string"
                    ? colorOrObj
                    : colorOrObj.primary || colorOrObj.highlight,
                cursor: "pointer",
                border:
                  (typeof selectedThemes[index] === "string"
                    ? selectedThemes[index] === colorOrObj
                    : selectedThemes[index]?.primary === colorOrObj.primary ||
                      selectedThemes[index]?.highlight === colorOrObj.highlight)
                    ? "3px solid black"
                    : "2px solid #fff",
                boxShadow: 2,
                transition: "all 0.2s ease",
                '&:hover': {
                  transform: 'scale(1.1)',
                }
              }}
            />
          ))}
        </Box>
        
        <Button
          variant="contained"
          sx={{
            background: isPremium && !isUnlocked 
              ? (liveAdsAvailable ? "linear-gradient(45deg, #ff9800, #ff5722)" : "linear-gradient(45deg, #9e9e9e, #757575)")
              : "linear-gradient(45deg, #6a11cb, #2575fc)",
            color: "#fff",
            fontWeight: "bold",
            px: 3,
            py: 1.5,
            borderRadius: "12px",
            width: "100%",
            mt: 2,
            maxWidth: cardWidth,
            "&:hover": {
              background: isPremium && !isUnlocked 
                ? (liveAdsAvailable ? "linear-gradient(45deg, #ff5722, #ff9800)" : "linear-gradient(45deg, #757575, #9e9e9e)")
                : "linear-gradient(45deg, #2575fc, #6a11cb)",
              transform: liveAdsAvailable ? 'translateY(-2px)' : 'none',
              boxShadow: liveAdsAvailable ? 4 : 2,
            },
            transition: 'all 0.3s ease',
            cursor: isPremium && !isUnlocked && !liveAdsAvailable ? 'not-allowed' : 'pointer',
          }}
          onClick={() => handleTemplateSelect(index, selectedThemes[index])}
          startIcon={isPremium && !isUnlocked ? <LockIcon /> : null}
          disabled={isPremium && !isUnlocked && !liveAdsAvailable}
        >
          {isPremium && !isUnlocked ? 
            (liveAdsAvailable ? `Unlock Template (${ADS_REQUIRED} live ads)` : "Live Data Required") 
            : "Choose this template"}
        </Button>
      </Box>
    );
  };

  const renderFilters = () => (
    <Box
      sx={{
        p: 2,
        border: "1px solid #ddd",
        borderRadius: 2,
        bgcolor: "#fafafa",
        position: "sticky",
        top: 20,
      }}
    >
      <Typography variant="h6" gutterBottom>
        Filters
      </Typography>
      <Typography variant="subtitle2" sx={{ mt: 2 }}>
        Headshot
      </Typography>
      <FormGroup>
        <FormControlLabel
          control={
            <Checkbox
              checked={filters.withPhoto}
              onChange={handleFilterChange}
              name="withPhoto"
            />
          }
          label="With Photo"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={filters.withoutPhoto}
              onChange={handleFilterChange}
              name="withoutPhoto"
            />
          }
          label="Without Photo"
        />
      </FormGroup>

      <Typography variant="subtitle2" sx={{ mt: 2 }}>
        Columns
      </Typography>
      <FormGroup>
        <FormControlLabel
          control={
            <Checkbox
              checked={filters.oneColumn}
              onChange={handleFilterChange}
              name="oneColumn"
            />
          }
          label="1 Column"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={filters.twoColumn}
              onChange={handleFilterChange}
              name="twoColumn"
            />
          }
          label="2 Column"
        />
      </FormGroup>
    </Box>
  );

  const renderAdDialog = () => {
    const currentAd = getCurrentAd();
    
    // All ads in the unlock flow should be live JSearch ads
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
          
          {/* Ad Content - ONLY LIVE JSearch Job Ads */}
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
    <Container maxWidth="xl" sx={{ mt: 5, px: isMobile ? 2 : 3, mb: 8 }}>
      <Typography variant="h4" fontWeight="bold" textAlign="center" sx={{ fontSize: isMobile ? "1.8rem" : "2.125rem" }}>
        Best templates for {experience ? experience : "3–5 years of experience"}
      </Typography>
      <Typography
        variant="subtitle1"
        color="text.secondary"
        textAlign="center"
        sx={{ mb: 4, fontSize: isMobile ? "0.9rem" : "1rem" }}
      >
        You can always change your template later. {ADS_REQUIRED} LIVE job ads required for premium templates.
        {hasPremiumAccess() && " (Premium Access Active)"}
      </Typography>

      {/* JSearch Job Ads Section */}
      {renderJobAds()}

      {isMobile ? (
        <>
          <Box display="flex" justifyContent="center" mb={2}>
            <Button
              variant="outlined"
              startIcon={<FilterListIcon />}
              onClick={() => setFiltersOpen(!filtersOpen)}
              sx={{ mb: 2 }}
            >
              {filtersOpen ? "Hide Filters" : "Show Filters"}
            </Button>
          </Box>
          
          {filtersOpen && (
            <Accordion expanded={filtersOpen} sx={{ mb: 3 }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>Filters & Info</Typography>
              </AccordionSummary>
              <AccordionDetails>
                {renderFilters()}
              </AccordionDetails>
            </Accordion>
          )}
          
          <Box 
            display="grid" 
            gridTemplateColumns="repeat(auto-fill, minmax(280px, 1fr))" 
            gap={3}
            justifyContent="center"
          >
            {filteredIndexes.map((index) => renderResumeCard(index))}
          </Box>
        </>
      ) : (
        <Box display="flex" gap={4}>
          {/* LEFT FILTERS (20%) */}
          <Box sx={{ width: "280px", flexShrink: 0 }}>
            {renderFilters()}
          </Box>

          {/* RIGHT RESUMES (80%) */}
          <Box sx={{ flex: 1 }}>
            <Box 
              display="grid" 
              gridTemplateColumns="repeat(auto-fill, minmax(300px, 1fr))" 
              gap={4}
            >
              {filteredIndexes.map((index) => renderResumeCard(index))}
            </Box>
          </Box>
        </Box>
      )}

      {/* Ad Dialog */}
      {renderAdDialog()}

      {/* Footer Info */}
   <Box sx={{ mt: 6, textAlign: 'center', p: 4, bgcolor: '#f8f9fa', borderRadius: 3 }}>


 


  <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
    "Your next career opportunity starts with a great resume. Choose your template and begin your journey today!"
  </Typography>
</Box>
    </Container>
  );
};

export default ResumeList;