const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Topic = sequelize.define('Topic', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: DataTypes.STRING(500),
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    department: {
        type: DataTypes.STRING(100),
        allowNull: false,
        defaultValue: 'Computer Science'
    },
    status: {
        type: DataTypes.ENUM('available', 'allocated', 'completed'),
        defaultValue: 'available'
    },
    studentId: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    supervisorId: {
        type: DataTypes.INTEGER,
        allowNull: true
    }
}, {
    indexes: [
        {
            fields: ['title']
        },
        {
            fields: ['department']
        },
        {
            fields: ['status']
        }
    ]
});

// Instance method to check if topic is available
Topic.prototype.isAvailable = function() {
    return this.status === 'available';
};

module.exports = Topic;