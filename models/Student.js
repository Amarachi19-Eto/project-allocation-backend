const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Student = sequelize.define('Student', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    registrationNumber: {
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
        allowNull: false,
        defaultValue: 'Computer Science'
    },
    yearOfStudy: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 4
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    isAssigned: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    indexes: [
        {
            fields: ['registrationNumber'],
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

// Instance method to check if student can be assigned a topic
Student.prototype.canBeAssigned = function() {
    return !this.isAssigned;
};

// Instance method to get student info
Student.prototype.getInfo = function() {
    return {
        id: this.id,
        registrationNumber: this.registrationNumber,
        department: this.department,
        yearOfStudy: this.yearOfStudy,
        isAssigned: this.isAssigned
    };
};

module.exports = Student;sequelize