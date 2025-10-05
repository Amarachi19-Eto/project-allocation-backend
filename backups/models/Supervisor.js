const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Supervisor = sequelize.define('Supervisor', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    staffId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true
    },
    fullName: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    department: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    position: {
        type: DataTypes.STRING(100),
        allowNull: false,
        defaultValue: 'Lecturer'
    },
    maxProjects: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 5
    },
    currentProjects: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    }
}, {
    indexes: [
        {
            fields: ['staffId'],
            unique: true
        },
        {
            fields: ['email'],
            unique: true
        },
        {
            fields: ['department']
        }
    ]
});

// Instance method to check if supervisor can accept more students
Supervisor.prototype.canAcceptMoreStudents = function() {
    return this.currentProjects < this.maxProjects;
};

// Instance method to get supervisor capacity info
Supervisor.prototype.getCapacityInfo = function() {
    return {
        current: this.currentProjects,
        max: this.maxProjects,
        available: this.maxProjects - this.currentProjects
    };
};

module.exports = Supervisor;