const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

console.log('🔄 Loading adminRoutes...');

// Import models and middleware properly
const { User, Student, Supervisor, Topic } = require('../models');
const { verifyToken } = require('../middleware/auth');

console.log('✅ Models and middleware loaded successfully');

// Apply auth middleware to all admin routes
router.use(verifyToken);

// Check if user is admin
const requireAdmin = (req, res, next) => {
  console.log('🔒 Checking admin access for user:', req.user);
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

// Test route
router.get('/test', requireAdmin, (req, res) => {
  console.log('✅ /api/admin/test route working');
  res.json({ message: 'Admin test route is working!' });
});

// Get all students
router.get('/students', requireAdmin, async (req, res) => {
  try {
    console.log('📋 Fetching students...');
    const students = await Student.findAll({
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'username', 'email', 'isActive', 'firstName', 'lastName']
      }]
    });
    
    console.log(`✅ Found ${students.length} students`);
    res.json({ success: true, data: students });
  } catch (error) {
    console.error('❌ Students error:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Add new student
router.post('/students', requireAdmin, async (req, res) => {
  try {
    const { username, email, password, firstName, lastName, registrationNumber, department, yearOfStudy } = req.body;
    console.log('➕ Adding new student:', { username, email, registrationNumber });

    // Validate required fields
    if (!username || !email || !password || !registrationNumber) {
      return res.status(400).json({ 
        success: false, 
        error: 'Username, email, password, and registration number are required' 
      });
    }

    // Check for existing user
    const existingUser = await User.findOne({ 
      where: { 
        $or: [{ username }, { email }] 
      } 
    });

    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        error: 'Username or email already exists' 
      });
    }

    // Check for existing registration number
    const existingStudent = await Student.findOne({ 
      where: { registrationNumber } 
    });

    if (existingStudent) {
      return res.status(400).json({ 
        success: false, 
        error: 'Registration number already exists' 
      });
    }

    // Create user
    const user = await User.create({
      username,
      email,
      password,
      firstName: firstName || '',
      lastName: lastName || '',
      role: 'student'
    });

    // Create student
    const student = await Student.create({
      registrationNumber,
      fullName: `${firstName || ''} ${lastName || ''}`.trim(),
      department: department || 'Computer Science',
      yearOfStudy: yearOfStudy || 4,
      email,
      isAssigned: false,
      userId: user.id
    });

    console.log('✅ Student created successfully:', student.id);
    res.json({ 
      success: true, 
      message: 'Student added successfully!',
      data: student
    });

  } catch (error) {
    console.error('❌ Add student error:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Delete student
router.delete('/students/:id', requireAdmin, async (req, res) => {
  try {
    const studentId = req.params.id;
    console.log('🗑️ Deleting student:', studentId);

    const student = await Student.findByPk(studentId, {
      include: [{ model: User, as: 'user' }]
    });

    if (!student) {
      return res.status(404).json({ success: false, error: 'Student not found' });
    }

    // Delete student and user
    if (student.user) {
      await User.destroy({ where: { id: student.user.id } });
    } else {
      await Student.destroy({ where: { id: studentId } });
    }

    console.log('✅ Student deleted successfully');
    res.json({ 
      success: true, 
      message: 'Student deleted successfully!' 
    });

  } catch (error) {
    console.error('❌ Delete student error:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get all supervisors
router.get('/supervisors', requireAdmin, async (req, res) => {
  try {
    console.log('📋 Fetching supervisors...');
    const supervisors = await Supervisor.findAll({
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'username', 'email', 'isActive', 'firstName', 'lastName']
      }]
    });
    
    console.log(`✅ Found ${supervisors.length} supervisors`);
    res.json({ success: true, data: supervisors });
  } catch (error) {
    console.error('❌ Supervisors error:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Add new supervisor
router.post('/supervisors', requireAdmin, async (req, res) => {
  try {
    const { username, email, password, firstName, lastName, staffId, department, position, maxProjects } = req.body;
    console.log('➕ Adding new supervisor:', { username, email, staffId });

    if (!username || !email || !password || !staffId) {
      return res.status(400).json({ 
        success: false, 
        error: 'Username, email, password, and staff ID are required' 
      });
    }

    // Check for existing user
    const existingUser = await User.findOne({ 
      where: { 
        $or: [{ username }, { email }] 
      } 
    });

    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        error: 'Username or email already exists' 
      });
    }

    // Check for existing staff ID
    const existingSupervisor = await Supervisor.findOne({ 
      where: { staffId } 
    });

    if (existingSupervisor) {
      return res.status(400).json({ 
        success: false, 
        error: 'Staff ID already exists' 
      });
    }

    // Create user
    const user = await User.create({
      username,
      email,
      password,
      firstName: firstName || '',
      lastName: lastName || '',
      role: 'supervisor'
    });

    // Create supervisor
    const supervisor = await Supervisor.create({
      staffId,
      fullName: `${firstName || ''} ${lastName || ''}`.trim(),
      department: department || 'Computer Science',
      email,
      position: position || 'Lecturer',
      maxProjects: maxProjects || 5,
      currentProjects: 0,
      userId: user.id
    });

    console.log('✅ Supervisor created successfully:', supervisor.id);
    res.json({ 
      success: true, 
      message: 'Supervisor added successfully!',
      data: supervisor
    });

  } catch (error) {
    console.error('❌ Add supervisor error:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Delete supervisor
router.delete('/supervisors/:id', requireAdmin, async (req, res) => {
  try {
    const supervisorId = req.params.id;
    console.log('🗑️ Deleting supervisor:', supervisorId);

    const supervisor = await Supervisor.findByPk(supervisorId, {
      include: [{ model: User, as: 'user' }]
    });

    if (!supervisor) {
      return res.status(404).json({ success: false, error: 'Supervisor not found' });
    }

    // Delete supervisor and user
    if (supervisor.user) {
      await User.destroy({ where: { id: supervisor.user.id } });
    } else {
      await Supervisor.destroy({ where: { id: supervisorId } });
    }

    console.log('✅ Supervisor deleted successfully');
    res.json({ 
      success: true, 
      message: 'Supervisor deleted successfully!' 
    });

  } catch (error) {
    console.error('❌ Delete supervisor error:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get all topics
router.get('/topics', requireAdmin, async (req, res) => {
  try {
    console.log('📋 Fetching topics...');
    const topics = await Topic.findAll({
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['id', 'registrationNumber', 'fullName']
        },
        {
          model: Supervisor,
          as: 'supervisor',
          attributes: ['id', 'staffId', 'fullName']
        }
      ]
    });

    console.log(`✅ Found ${topics.length} topics`);
    res.json({ success: true, data: topics });
  } catch (error) {
    console.error('❌ Topics error:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Add new topic
router.post('/topics', requireAdmin, async (req, res) => {
  try {
    const { title, description, department } = req.body;
    console.log('➕ Adding new topic:', { title, department });

    if (!title) {
      return res.status(400).json({ 
        success: false, 
        error: 'Topic title is required' 
      });
    }

    // Check for duplicate topic
    const existingTopic = await Topic.findOne({ 
      where: { title } 
    });

    if (existingTopic) {
      return res.status(400).json({ 
        success: false, 
        error: 'Topic with this title already exists' 
      });
    }

    const topic = await Topic.create({
      title,
      description: description || '',
      department: department || 'Computer Science',
      status: 'available'
    });

    console.log('✅ Topic created successfully:', topic.id);
    res.json({ 
      success: true, 
      message: 'Topic added successfully!',
      data: topic
    });

  } catch (error) {
    console.error('❌ Add topic error:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update topic
router.put('/topics/:id', requireAdmin, async (req, res) => {
  try {
    const topicId = req.params.id;
    const { title, description, department, status } = req.body;
    console.log('✏️ Updating topic:', topicId);

    const topic = await Topic.findByPk(topicId);

    if (!topic) {
      return res.status(404).json({ success: false, error: 'Topic not found' });
    }

    // Check for duplicate title (excluding current topic)
    if (title && title !== topic.title) {
      const existingTopic = await Topic.findOne({ 
        where: { title } 
      });

      if (existingTopic) {
        return res.status(400).json({ 
          success: false, 
          error: 'Topic with this title already exists' 
        });
      }
    }

    await topic.update({
      title: title || topic.title,
      description: description !== undefined ? description : topic.description,
      department: department || topic.department,
      status: status || topic.status
    });

    console.log('✅ Topic updated successfully');
    res.json({ 
      success: true, 
      message: 'Topic updated successfully!',
      data: topic
    });

  } catch (error) {
    console.error('❌ Update topic error:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Delete topic
router.delete('/topics/:id', requireAdmin, async (req, res) => {
  try {
    const topicId = req.params.id;
    console.log('🗑️ Deleting topic:', topicId);

    const topic = await Topic.findByPk(topicId);

    if (!topic) {
      return res.status(404).json({ success: false, error: 'Topic not found' });
    }

    await topic.destroy();

    console.log('✅ Topic deleted successfully');
    res.json({ 
      success: true, 
      message: 'Topic deleted successfully!' 
    });

  } catch (error) {
    console.error('❌ Delete topic error:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get system notifications
router.get('/notifications', requireAdmin, async (req, res) => {
  try {
    console.log('📢 Fetching notifications');
    // In a real system, this would come from a notifications table
    // For now, we'll return mock notifications
    const notifications = [
      {
        id: 1,
        type: 'topic_accepted',
        message: 'Student STU2024001 accepted topic: AI-Based Project Topic Duplication Detection System',
        timestamp: new Date().toISOString(),
        read: false
      },
      {
        id: 2, 
        type: 'topic_declined',
        message: 'Student STU2024002 declined topic: Blockchain-based Secure Voting System',
        timestamp: new Date().toISOString(),
        read: false
      }
    ];

    res.json({ success: true, data: notifications });
  } catch (error) {
    console.error('❌ Notifications error:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

console.log('✅ adminRoutes loaded successfully');
module.exports = router;