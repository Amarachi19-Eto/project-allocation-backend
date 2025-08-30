const { sequelize } = require('../config/database');

// Import all models
const User = require('./User');
const Student = require('./Student');
const Supervisor = require('./Supervisor');
const Topic = require('./Topic');

// Define associations
User.hasOne(Student, { 
    foreignKey: 'userId', 
    as: 'student',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});

User.hasOne(Supervisor, { 
    foreignKey: 'userId', 
    as: 'supervisor',
    onDelete: 'CASCADE', 
    onUpdate: 'CASCADE'
});

Student.belongsTo(User, { 
    foreignKey: 'userId', 
    as: 'user',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});

Supervisor.belongsTo(User, { 
    foreignKey: 'userId', 
    as: 'user',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});

// Topic Associations
Topic.belongsTo(Student, { 
    foreignKey: 'studentId', 
    as: 'student',
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE'
});

Topic.belongsTo(Supervisor, { 
    foreignKey: 'supervisorId', 
    as: 'supervisor', 
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE'
});

Student.hasMany(Topic, { 
    foreignKey: 'studentId', 
    as: 'topics',
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE'
});

Supervisor.hasMany(Topic, { 
    foreignKey: 'supervisorId', 
    as: 'topics',
    onDelete: 'SET NULL', 
    onUpdate: 'CASCADE'
});

// Sync all models with database
const syncDatabase = async () => {
    try {
        await sequelize.sync({ force: false });
        console.log('✅ Database models synchronized successfully');
        
        // Log all models and associations
        console.log('\n📊 Loaded Models:');
        console.log('   - User');
        console.log('   - Student'); 
        console.log('   - Supervisor');
        console.log('   - Topic');
        
    } catch (error) {
        console.error('❌ Error synchronizing database models:', error);
        throw error;
    }
};

// Test database connection and models
const testDatabase = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Database connection established successfully');
        
        await syncDatabase();
        return true;
    } catch (error) {
        console.error('❌ Database connection failed:', error);
        return false;
    }
};

module.exports = {
    sequelize,
    User,
    Student,
    Supervisor,
    Topic,
    syncDatabase,
    testDatabase
};