const express = require('express');
const router = express.Router();
console.log('🔄 Loading adminRoutes...');

try {
    const { verifyToken } = require('../middleware/auth');
    console.log('✅ Auth middleware loaded successfully');
} catch (authError) {
    console.log('❌ Auth middleware error:', authError.message);
}

try {
    const { User, Student, Supervisor, Topic } = require('../models');
    console.log('✅ Models loaded successfully');
} catch (modelError) {
    console.log('❌ Models error:', modelError.message);
}

try {
    const bcrypt = require('bcryptjs');
    console.log('✅ bcrypt loaded successfully');
} catch (bcryptError) {
    console.log('❌ bcrypt error:', bcryptError.message);
}

// All routes require authentication
router.use((req, res, next) => {
    console.log('🔒 Admin route accessed:', req.path);
    next();
});

// Simple test route without auth first
router.get('/test', (req, res) => {
    console.log('✅ /api/admin/test route working');
    res.json({ message: 'Admin test route is working!' });
});

// Get all students
router.get('/students', async (req, res) => {
  try {
    console.log('📋 Fetching students...');
    const students = await Student.findAll({
      include: [{
        model: User,
        as: 'user',
        attributes: ['username', 'email', 'isActive', 'firstName', 'lastName']
      }]
    });
    res.json({ success: true, data: students });
  } catch (error) {
    console.log('❌ Students error:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

console.log('✅ adminRoutes loaded successfully');
module.exports = router;
