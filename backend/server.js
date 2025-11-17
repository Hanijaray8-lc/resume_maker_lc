// server.js (updated)
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connect
mongoose
  .connect(process.env.MONGO_URI || "mongodb+srv://alphanewprojectlc:CEoMY7QsrBIJokk3@aizeldb.nuoy3.mongodb.net/Resume?retryWrites=true&w=majority", { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Import routes
const authRoutes = require("./routes/auth");
const contactRoutes = require("./routes/contact");
const generateRoutes = require("./routes/generateRoutes");
const aiRoutes = require("./routes/ai");
const spellcheckRoutes = require("./routes/spellcheck");
const resumeRoutes = require("./routes/resumes");

// Use routes
app.use("/api/auth", authRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/generate", generateRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/spellcheck", spellcheckRoutes);
app.use("/api/resumes", resumeRoutes);

// Static file serving (uploads)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "Backend is running" });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));