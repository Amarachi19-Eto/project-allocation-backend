const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  firstName: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  lastName: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  role: {
    type: DataTypes.ENUM('student', 'supervisor', 'admin'),
    allowNull: false,
    defaultValue: 'student'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'Users',
  indexes: [
    {
      fields: ['username'],
      unique: true
    },
    {
      fields: ['email']
    },
    {
      fields: ['role']
    }
  ],
  hooks: {
    beforeCreate: async (user) => {
      if (user.password) {
        user.password = await bcrypt.hash(user.password, 10);
      }
    },
    beforeUpdate: async (user) => {
      if (user.changed('password')) {
        user.password = await bcrypt.hash(user.password, 10);
      }
    }
  }
});

// Instance methods
User.prototype.getFullName = function() {
  return `${this.firstName || ''} ${this.lastName || ''}`.trim() || this.username;
};

User.prototype.isUserActive = function() {
  return this.isActive;
};

User.prototype.validPassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};

User.prototype.toSafeObject = function() {
  return {
    id: this.id,
    username: this.username,
    email: this.email,
    firstName: this.firstName,
    lastName: this.lastName,
    role: this.role,
    isActive: this.isActive,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt
  };
};

module.exports = User;