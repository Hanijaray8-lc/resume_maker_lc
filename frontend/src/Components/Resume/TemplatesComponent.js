import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  IconButton,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import { Download, Print, Email } from "@mui/icons-material";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

// Import resume templates
import Resume1 from "./Resume1";
import Resume2 from "./Resume2";
import Resume3 from "./Resume3";
import Resume4 from "./Resume4";
import Resume5 from "./Resume5";
import Resume6 from "./Resume6";
import Resume8 from "./Resume8";
import Resume7 from "./Resume7";
import Resume9 from "./Resume9";
import Resume10 from "./Resume10";
import Resume11 from "./Resume11";
import Resume12 from "./Resume12";  
import Resume13 from "./Resume13";
import Resume14 from "./Resume14";
import Resume15 from "./Resume15";
import Resume16 from "./Resume16";
import Resume17 from "./Resume17";
import Resume18 from "./Resume18";
import Resume19 from "./Resume19";
import Resume20 from "./Resume20";
import Resume21 from "./Resume21";
import Resume22 from "./Resume22";
import Resume23 from "./Resume23";
import Resume24 from "./Resume24";
import Resume25 from "./Resume25";
import Resume26 from "./Resume26";


// Recommended & all colors
const recommendedColors = ["#0951b0ff", "#34a853", "#fbbc05", "#ea4335", "#9c27b0", "#ff5722"];
const allColors = [
  "#000000", "#FFFFFF", "#1a73e8", "#34a853", "#fbbc05", "#ea4335",
  "#9c27b0", "#ff5722", "#00bcd4", "#4caf50", "#ff9800", "#795548",
  "#607d8b", "#e91e63", "#3f51b5", "#8bc34a", "#cddc39", "#ffc107",
  "#673ab7", "#2196f3", "#ffeb3b", "#9e9e9e", "#b71c1c", "#004d40",
  "#ff1744", "#00695c", "#1de9b6", "#f06292", "#ff7043", "#00e5ff",
];

// Helper to darken colors
function getDarkColor(hex) {
  if (!hex || typeof hex !== "string") return "#0951b0ff";
  let c = hex.replace("#", "");
  if (c.length === 8) c = c.slice(0, 6);
  if (c.length !== 6 || isNaN(parseInt(c, 16))) return "#0951b0ff";
  let r = Math.max(0, parseInt(c.substring(0, 2), 16) - 40);
  let g = Math.max(0, parseInt(c.substring(2, 4), 16) - 40);
  let b = Math.max(0, parseInt(c.substring(4, 6), 16) - 40);
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

// Templates
const templates = [
  { id: 1, component: Resume1, name: "Template 1" },
  { id: 2, component: Resume2, name: "Template 2" },
  { id: 3, component: Resume3, name: "Template 3" },
  { id: 4, component: Resume4, name: "Template 4" },
  { id: 5, component: Resume5, name: "Template 5" },
  { id: 6, component: Resume6, name: "Template 6" },
  { id: 7, component: Resume7, name: "Template 7" },
  { id: 8, component: Resume8, name: "Template 8" },
  { id: 9, component: Resume9, name: "Template 9" },
  { id: 10, component: Resume10, name: "Template 10" },
  { id: 11, component: Resume11, name: "Template 11" }, 
  { id: 12, component: Resume12, name: "Template 12" },
  { id: 13, component: Resume13, name: "Template 13" },
  { id: 14, component: Resume14, name: "Template 14" },
  { id: 15, component: Resume15, name: "Template 15" },
  { id: 16, component: Resume16, name: "Template 16" },
  { id: 17, component: Resume17, name: "Template 17" },
  { id: 18, component: Resume18, name: "Template 18" },
  { id: 19, component: Resume19, name: "Template 19" },
  { id: 20, component: Resume20, name: "Template 20" },
  { id: 21, component: Resume21, name: "Template 21" },
    { id: 22, component: Resume22, name: "Template 22" },
  { id: 23, component: Resume23, name: "Template 23" },
  { id: 24, component: Resume24, name: "Template 24" },
  { id: 25, component: Resume25, name: "Template 25" },
  { id: 26, component: Resume26, name: "Template 26" },

];

const TemplatesComponent = ({ selectedTemplate, setSelectedTemplate, selectedColor, setSelectedColor }) => {
  const [showAllColors, setShowAllColors] = useState(false);

  // Download dialog state
  const [openDownloadDialog, setOpenDownloadDialog] = useState(false);
  const [fileName, setFileName] = useState("resume");
  const [fileType, setFileType] = useState("pdf");
  // ✅ Keep the very first resume color as default (only runs once)
  const [resumeDefaultColor] = useState(selectedColor);

  const SelectedResume = templates.find((t) => t.id === selectedTemplate).component;

  // Print function (resume only)
  const handlePrint = () => {
    const resumeElement = document.getElementById("resume-preview");
    if (!resumeElement) return;
    const printWindow = window.open("", "_blank");
    const styles = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'))
      .map((node) => node.outerHTML)
      .join("\n");

    printWindow.document.write(`
    <html>
      <head>
        <title>Print Resume</title>
        ${styles}
        <style>
          body {
            margin: 0;
            padding: 0;
            background: white;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          @page {
            size: A4;
            margin: 0;
          }
          @media print {
            * {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            html, body {
              width: 100%;
              height: auto;
            }
            #resume-preview {
              margin: 0;
              box-shadow: none;
              border: none;
              page-break-inside: avoid;
            }
          }
        </style>
      </head>
      <body>
        <div id="resume-preview">
          ${resumeElement.innerHTML}
        </div>
      </body>
    </html>
  `);
    printWindow.document.close();
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.focus();
        printWindow.print();
      }, 500);
    };
  };

  // Handle Download (PDF / PNG / TXT)
  const handleDownload = async () => {
    const resumeElement = document.getElementById("resume-preview");
    if (!resumeElement) return;

    if (fileType === "pdf" || fileType === "png") {
      const canvas = await html2canvas(resumeElement, { scale: 2 });
      if (fileType === "png") {
        const imgData = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.href = imgData;
        link.download = `${fileName}.png`;
        link.click();
      } else {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        pdf.addImage(imgData, "PNG", 0, 0, pageWidth, pageHeight);
        pdf.save(`${fileName}.pdf`);
      }
    } else if (fileType === "txt") {
      const textContent = resumeElement.innerText;
      const blob = new Blob([textContent], { type: "text/plain;charset=utf-8" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `${fileName}.txt`;
      link.click();
    }

    setOpenDownloadDialog(false);
  };

  return (
    <Box display="flex" flex={1} height="100%">
      {/* Left Templates Panel */}
      <Box width="380px" p={2} sx={{ borderRight: "1px solid #ddd", flexShrink: 0, overflowY: "auto" }}>
        <Typography variant="h6" gutterBottom>Templates</Typography>

        {/* Color Picker */}
      <Box mt={2}>
  <Typography gutterBottom>Choose Color</Typography>
  <Box display="flex" gap={1} flexWrap="wrap">
    {/* 🔄 Reset Color Option */}
    <Box
      onClick={() => setSelectedColor(resumeDefaultColor)}
      sx={{
        width: 24,
        height: 24,
        borderRadius: "50%",
        bgcolor: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: "2px dashed #000",
        cursor: "pointer",
        fontSize: "12px",
        color: "#000",
        fontWeight: "bold",
      }}
    >
      R
    </Box>

    {/* 🎨 Recommended Colors */}
    {recommendedColors.map((color) => (
      <Box
        key={color}
        onClick={() => setSelectedColor(color)}
        sx={{
          width: 24, height: 24, borderRadius: "50%",
          bgcolor: color,
          border: selectedColor === color ? "2px solid #000" : "2px solid transparent",
          cursor: "pointer",
        }}
      />
    ))}
  </Box>

          <Button size="small" onClick={() => setShowAllColors(!showAllColors)} sx={{ mt: 1, textTransform: "none" }}>
            {showAllColors ? "See Less" : "See All"}
          </Button>
          {showAllColors && (
            <Grid container spacing={1} mt={1}>
              {allColors.map((color) => (
                <Grid item xs={3} key={color}>
                  <Box
                    onClick={() => setSelectedColor(color)}
                    sx={{
                      width: 24, height: 24, borderRadius: "50%",
                      bgcolor: color,
                      border: selectedColor === color ? "2px solid #000" : "2px solid transparent",
                      cursor: "pointer",
                    }}
                  />
                </Grid>
              ))}
            </Grid>
          )}
        </Box>

        {/* Templates list */}
        <Grid container spacing={2} mt={2}>
          {templates.map((tpl) => {
            const TemplateComp = tpl.component;
            // Use fallback color if selectedColor is undefined
            const safeColor = selectedColor || "#0951b0ff";
            return (
              <Grid item xs={6} key={tpl.id}>
                <Box
                  onClick={() => setSelectedTemplate(tpl.id)}
                  sx={{
                    border: selectedTemplate === tpl.id ? "2px solid #1976d2" : "1px solid #ccc",
                    borderRadius: "8px",
                    cursor: "pointer",
                    "&:hover": { boxShadow: 3 },
                    height: "260px", width: "170px",
                    overflow: "hidden",
                  }}
                >
                  <Box sx={{ transform: "scale(0.2)", transformOrigin: "top left" }}>
                    <TemplateComp
                      theme={{ primary: safeColor, dark: getDarkColor(safeColor) }}
                      color={safeColor}
                    />
                  </Box>
                  <Typography variant="caption" align="center" sx={{ py: 0.5, bgcolor: "#f5f5f5" }}>
                    {tpl.name}
                  </Typography>
                </Box>
              </Grid>
            );
          })}
        </Grid>
      </Box>
    </Box>
  );
};

export default TemplatesComponent;