const express = require('express');
const router = express.Router();
const { syncDatabase, User, Student, Supervisor, Topic } = require('../models');
const bcrypt = require('bcryptjs');

// Sync database and create tables
router.post('/sync', async (req, res) => {
  try {
    console.log('🔄 Starting database synchronization...');
    
    // Sync all models
    await syncDatabase();
    console.log('✅ Database tables created successfully');
    
    // Create default admin user if doesn't exist
    const adminExists = await User.findOne({ where: { username: 'admin001' } });
    if (!adminExists) {
      await User.create({
        username: 'admin001',
        email: 'admin@university.edu',
        password: await bcrypt.hash('admin123', 10),
        firstName: 'System',
        lastName: 'Administrator',
        role: 'admin',
        isActive: true
      });
      console.log('✅ Default admin user created');
    }
    
    res.json({ 
      success: true, 
      message: 'Database synchronized successfully',
      tables: ['Users', 'Students', 'Supervisors', 'Topics']
    });
    
  } catch (error) {
    console.error('❌ Database sync error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Get database status
router.get('/status', async (req, res) => {
  try {
    const userCount = await User.count();
    const studentCount = await Student.count();
    const supervisorCount = await Supervisor.count();
    const topicCount = await Topic.count();
    
    res.json({
      success: true,
      database: 'PostgreSQL',
      orm: 'Sequelize',
      tables: {
        users: userCount,
        students: studentCount,
        supervisors: supervisorCount,
        topics: topicCount
      },
      status: 'Connected'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
