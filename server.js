const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { testDatabase } = require("./models");

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: [
    "https://frontend-1vmoi0qpa-etokwudo-cynthias-projects.vercel.app",
    "https://frontend-5zvpbqeu5-etokwudo-cynthias-projects.vercel.app", 
    "http://localhost:3000"
  ],
  credentials: true
}));
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/sync", require("./routes/sync"));

// Health check route
app.get("/api/health", (req, res) => {
  res.json({ 
    status: "OK", 
    message: "Backend is running!",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

// Test route
app.get("/api/test", (req, res) => {
  res.json({ message: "Backend is working!" });
});

// Database connection and server start
testDatabase().then((connected) => {
  if (connected) {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log("📊 Database models loaded");
      console.log(`🌐 Environment: ${process.env.NODE_ENV}`);
      console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
    });
  } else {
    console.log("❌ Server not started due to database connection issues");
    process.exit(1);
  }
}).catch((error) => {
  console.error("❌ Failed to start server:", error);
  process.exit(1);
});

// Handle 404 errors
app.use("*", (req, res) => {
  res.status(404).json({
    error: "Route not found",
    path: req.originalUrl,
    availableEndpoints: [
      "GET  /",
      "GET  /api/health", 
      "GET  /api/test",
      "POST /api/auth/login",
      "POST /api/auth/register",
      "GET  /api/admin/students",
      "POST /api/sync/sync"
    ]
  });
});

// Handle errors
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.stack);
  res.status(500).json({ 
    error: "Something went wrong!",
    message: process.env.NODE_ENV === "development" ? err.message : "Internal server error"
  });
});
