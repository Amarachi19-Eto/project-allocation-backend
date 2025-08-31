// final-test.js
const express = require("express");
const app = express();
const PORT = 5003;

// Create router directly
const router = express.Router();

router.get("/test", (req, res) => {
  console.log("✅ Final test route hit");
  res.json({ message: "Final test works!" });
});

app.use("/api/admin", router);

app.listen(PORT, () => {
  console.log("🚀 Final test server on port", PORT);
  console.log("📋 Test: http://localhost:5003/api/admin/test");
});
