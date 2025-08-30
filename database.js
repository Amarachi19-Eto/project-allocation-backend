const { Sequelize } = require('sequelize');

// Database configuration
// REPLACE 'your_password_here' with your actual PostgreSQL password
const sequelize = new Sequelize('project_allocation', 'postgres', 'admin123', {
  host: 'localhost',
  dialect: 'postgres',
  port: 5433,
  logging: console.log, // This will show SQL queries in terminal - helpful for debugging
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

// Test database connection
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.');
    return true;
  } catch (error) {
    console.error('❌ Unable to connect to database:');
    console.error('Error details:', error.message);
    
    // Provide helpful error messages
    if (error.original && error.original.code === 'ECONNREFUSED') {
      console.error('💡 Hint: Make sure PostgreSQL is running on your computer');
    } else if (error.original && error.original.code === '3D000') {
      console.error('💡 Hint: Database "project_allocation" does not exist. Create it in pgAdmin first.');
    } else if (error.original && error.original.code === '28P01') {
      console.error('💡 Hint: Password authentication failed. Check your PostgreSQL password.');
    }
    
    return false;
  }
};

module.exports = {
  sequelize,
  testConnection
};