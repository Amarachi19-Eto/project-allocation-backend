const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { testDatabase } = require('./models');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'https://project-allocation-frontend-xi.vercel.app'],
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/admin', require('./routes/adminRoutes'));

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend is working!' });
});

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    database: 'Connected'
  });
});

// Database connection and server start
testDatabase().then((connected) => {
  if (connected) {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log('📊 Database models loaded');
      console.log(`🌐 Open http://localhost:${PORT}/api/test to test the server`);
    });
  } else {
    console.log('❌ Server not started due to database connection issues');
  }
});

// Handle errors
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});