const express = require('express');
const router = express.Router();
const { login, register, verifyToken } = require('../controllers/authController');

// Login route
router.post('/login', login);

// Register route  
router.post('/register', register);

// Test protected route (requires token)
router.get('/protected', verifyToken, (req, res) => {
  res.json({
    message: 'This is a protected route!',
    user: req.user
  });
});

module.exports = router;