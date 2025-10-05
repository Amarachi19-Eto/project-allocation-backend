// Absolute simplest Express server
const express = require("express");
const app = express();

app.get("/api/health", (req, res) => {
  console.log("Health check called");
  res.json({ status: "OK", message: "Server is working" });
});

app.get("/api/test", (req, res) => {
  res.json({ message: "Test successful", timestamp: new Date().toISOString() });
});

app.get("/", (req, res) => {
  res.json({ message: "Project Allocation Backend", status: "Live" });
});

// Export for Vercel
module.exports = app;
