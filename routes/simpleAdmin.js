const express = require("express");
const router = express.Router();

console.log("✅ Simple admin routes module loaded");

// Simple test route
router.get("/test", (req, res) => {
  console.log("📞 /api/admin/test route called");
  res.json({ message: "Admin test route is working!" });
});

// Simple students route
router.get("/students", (req, res) => {
  console.log("📞 /api/admin/students route called");
  res.json({ message: "Students route would work here", students: [] });
});

module.exports = router;
