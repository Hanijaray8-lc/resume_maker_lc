import React, { useMemo, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  Container,
  Stack,
  Typography,
  LinearProgress,
  useTheme,
  Fade,
  Zoom,
  Grid,
  useMediaQuery,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { useNavigate } from "react-router-dom";

const QUESTIONS = [
  {
    id: "experience",
    title: "How long have you been working?",
    subtitle: "We'll find the best templates for your experience level.",
    options: [
      "No Experience",
      "Less than 3 years",
      "3-5 Years",
      "5-10 Years",
      "10+ Years",
    ],
    icon: "💼",
  },
  {
    id: "student",
    title: "Are you a student?",
    options: ["Yes", "No"],
    icon: "🎓",
  },
  {
    id: "education",
    title: "Select the option that best describes your education level.",
    subtitle:
      "Your education background can help us guide you through relevant sections for your resume.",
    options: [
      "Secondary School",
      "Vocational Certificate or Diploma",
      "Apprenticeship or Internship Training",
      "Associates",
      "Bachelors",
      "Masters",
      "Doctorate or Ph.D.",
    ],
    icon: "📚",
  },
];

function OptionCard({ label, selected, onClick, index }) {
  const theme = useTheme();
  
  return (
    <Zoom in={true} style={{ transitionDelay: `${index * 100}ms` }}>
      <Card
        elevation={selected ? 4 : 0}
        sx={{
          borderRadius: 3,
          borderWidth: 2,
          borderStyle: "solid",
          transition: "all 220ms ease",
          borderColor: selected ? theme.palette.primary.main : "rgba(0, 0, 0, 0.12)",
          bgcolor: selected ? "primary.main" : "background.paper",
          color: selected ? "primary.contrastText" : "text.primary",
          outline: "none",
          ":hover": {
            transform: selected ? "scale(1.01)" : "translateY(-2px)",
            boxShadow: selected ? 6 : 3,
            borderColor: selected ? theme.palette.primary.main : theme.palette.primary.light,
          },
        }}
      >
        <CardActionArea onClick={onClick} sx={{ borderRadius: 3, py: 1 }}>
          <CardContent>
            <Stack direction="row" spacing={1.5} alignItems="center" justifyContent="center">
              {selected && <CheckIcon fontSize="small" />}
              <Typography sx={{ fontWeight: 600, textAlign: "center" }}>{label}</Typography>
            </Stack>
          </CardContent>
        </CardActionArea>
      </Card>
    </Zoom>
  );
}

export default function ResumeQuestionnaire({ answers, setAnswers }) {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState("forward");
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const total = QUESTIONS.length;
  const current = QUESTIONS[step];

  const progress = useMemo(() => Math.round(((Object.keys(answers).length) / total) * 100), [answers, total]);

  const handleSelect = (qid, option) => {
    setAnswers((prev) => ({ ...prev, [qid]: option }));
    if (step < total - 1) {
      setDirection("forward");
      setTimeout(() => setStep((s) => Math.min(s + 1, total - 1)), 220);
    }
  };

  const handleBack = () => {
    setDirection("backward");
    setStep((s) => Math.max(s - 1, 0));
  };

  const handleNext = () => {
    if (step < total - 1) {
      setDirection("forward");
      setStep((s) => Math.min(s + 1, total - 1));
    }
  };

  const handleRestart = () => {
    setAnswers({});
    setStep(0);
    setDirection("forward");
  };

  const isComplete = Object.keys(answers).length === total;

  return (
    <Container maxWidth="md" sx={{ py: { xs: 3, md: 6 } }}>
      <Stack spacing={4}>
        {/* Header Section */}
        <Box>
          <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 1 }}>
            <Box sx={{ 
              width: 40, 
              height: 40, 
              borderRadius: 2, 
              background: "linear-gradient(to right, #6a11cb, #2575fc)",
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center",
              color: "white"
            }}>
              <Typography variant="h6" fontWeight={700}>CV</Typography>
            </Box>
            <Typography variant="h5" fontWeight={700}>Build Your Professional Resume</Typography>
          </Stack>
          
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="body2" color="text.secondary">
              Answer a few questions to get personalized resume recommendations
            </Typography>
            <Chip 
              label={`Step ${Math.min(step + 1, total)} of ${total}`} 
              sx={{
                background: "linear-gradient(to right, #6a11cb, #2575fc)",
                color: "#fff",
                fontWeight: "bold",
              }}
            />
          </Stack>
        </Box>

        {/* Progress Bar */}
        <Box>
          <LinearProgress 
            variant="determinate" 
            value={isComplete ? 100 : progress} 
            sx={{ 
              borderRadius: 99, 
              height: 10,
              backgroundColor: theme.palette.grey[200],
              "& .MuiLinearProgress-bar": {
                borderRadius: 99,
                background: "linear-gradient(to right, #6a11cb, #2575fc)",
              }
            }} 
          />
          <Stack direction="row" justifyContent="space-between" sx={{ mt: 1 }}>
            <Typography variant="caption" color="text.secondary">
              {isComplete ? "Completed! 🎉" : "Progress..."}
            </Typography>
            <Typography variant="caption" fontWeight={600}>
              {isComplete ? "100%" : `${progress}%`}
            </Typography>
          </Stack>
        </Box>

        {/* Main Content */}
        <Fade in={true} key={step}>
          <Box>
            {!isComplete ? (
              <Box>
                <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
                  <Typography variant="h4">{current.icon}</Typography>
                  <Box>
                    <Typography variant="h6" fontWeight={700}>
                      {current.title}
                    </Typography>
                    {current.subtitle && (
                      <Typography variant="body2" color="text.secondary">
                        {current.subtitle}
                      </Typography>
                    )}
                  </Box>
                </Stack>

                <Grid container spacing={2}>
                  {current.options.map((opt, index) => (
                    <Grid item xs={12} md={6} key={opt}>
                      <OptionCard
                        label={opt}
                        selected={answers[current.id] === opt}
                        onClick={() => handleSelect(current.id, opt)}
                        index={index}
                      />
                    </Grid>
                  ))}
                </Grid>
              </Box>
            ) : (
              <Box>
                <Stack spacing={1} sx={{ mb: 3 }}>
                  <Typography variant="h4" textAlign="center" fontWeight={700}>
                    You're All Set! 🎉
                  </Typography>
                  <Typography variant="body1" color="text.secondary" textAlign="center">
                    Here's a summary of your answers. You can continue to create your resume or go back to edit any answer.
                  </Typography>
                </Stack>

                <Stack spacing={2}>
                  {QUESTIONS.map((q, idx) => (
                    <Card 
                      key={q.id} 
                      variant="outlined" 
                      sx={{ 
                        borderRadius: 3,
                        borderLeft: `4px solid`,
                        borderImage: "linear-gradient(to bottom, #6a11cb, #2575fc) 1",
                      }}
                    >
                      <CardContent>
                        <Stack spacing={1}>
                          <Typography variant="subtitle2" color="text.secondary">
                            {q.icon} {idx + 1}. {q.title}
                          </Typography>
                          <Chip
                            sx={{ 
                              background: "linear-gradient(to right, #6a11cb, #2575fc)",
                              color: "#fff",
                              fontWeight: 600,
                              width: "fit-content" 
                            }}
                            label={answers[q.id]}
                          />
                        </Stack>
                      </CardContent>
                    </Card>
                  ))}
                </Stack>

                <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mt: 4 }}>
                  <Button
                    variant="contained"
                    size="large"
                    fullWidth
                    endIcon={<ArrowForwardIcon />}
                    onClick={() => navigate("/resume")}
                    sx={{
                      background: "linear-gradient(to right, #6a11cb, #2575fc)",
                      color: "#fff",
                      fontWeight: "bold",
                      py: 1.5,
                      borderRadius: "12px",
                      "&:hover": {
                        background: "linear-gradient(to right, #2575fc, #6a11cb)",
                      },
                    }}
                  >
                    Create My Resume
                  </Button>
                  <Button 
                    variant="outlined" 
                    size="large" 
                    fullWidth
                    startIcon={<RestartAltIcon />}
                    onClick={handleRestart}
                    sx={{
                      borderColor: "#6a11cb",
                      color: "#6a11cb",
                      fontWeight: "bold",
                      borderRadius: "12px",
                      "&:hover": {
                        borderColor: "#2575fc",
                        backgroundColor: "rgba(37, 117, 252, 0.04)",
                      },
                    }}
                  >
                    Start Over
                  </Button>
                </Stack>
              </Box>
            )}
          </Box>
        </Fade>

        {/* Navigation */}
        {!isComplete && (
          <Stack direction="row" spacing={2} alignItems="center">
            <Button
              variant="outlined"
              onClick={handleBack}
              disabled={step === 0}
              startIcon={<ArrowBackIcon />}
              sx={{
                borderColor: "#6a11cb",
                color: "#6a11cb",
                fontWeight: "bold",
                borderRadius: "12px",
                "&:hover": {
                  borderColor: "#2575fc",
                  backgroundColor: "rgba(37, 117, 252, 0.04)",
                },
                "&.Mui-disabled": {
                  borderColor: theme.palette.grey[300],
                  color: theme.palette.grey[500],
                }
              }}
            >
              Back
            </Button>
            
            <Box sx={{ flex: 1 }} />
            
            {answers[current.id] && (
              <Button
                variant="contained"
                onClick={handleNext}
                endIcon={<ArrowForwardIcon />}
                sx={{
                  background: "linear-gradient(to right, #6a11cb, #2575fc)",
                  color: "#fff",
                  fontWeight: "bold",
                  borderRadius: "12px",
                  "&:hover": {
                    background: "linear-gradient(to right, #2575fc, #6a11cb)",
                  },
                }}
              >
                Next
              </Button>
            )}
            
            <Typography variant="caption" color="text.secondary" sx={{ display: { xs: 'none', sm: 'block' } }}>
              Tip: Click an option to auto-advance
            </Typography>
          </Stack>
        )}
      </Stack>
    </Container>
  );
}