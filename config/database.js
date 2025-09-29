const { Sequelize } = require("sequelize");
require("dotenv").config();

// Use Railway'\''s DATABASE_URL or fallback to local development
const getDatabaseConfig = () => {
  if (process.env.DATABASE_URL) {
    // Production - Railway PostgreSQL
    return {
      connectionString: process.env.DATABASE_URL,
      dialect: "postgres",
      logging: false,
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false
        }
      },
      pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000
      }
    };
  } else {
    // Development - Local PostgreSQL
    return {
      database: process.env.DB_NAME || "project_allocation",
      username: process.env.DB_USER || "postgres",
      password: process.env.DB_PASSWORD || "admin123",
      host: process.env.DB_HOST || "localhost",
      port: process.env.DB_PORT || 5433,
      dialect: "postgres",
      logging: process.env.NODE_ENV === "development" ? console.log : false,
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      }
    };
  }
};

const sequelize = process.env.DATABASE_URL 
  ? new Sequelize(process.env.DATABASE_URL, getDatabaseConfig())
  : new Sequelize(getDatabaseConfig());

// Test database connection
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connection established successfully");
    
    // Log database info
    if (process.env.DATABASE_URL) {
      console.log("🌐 Connected to: Railway PostgreSQL");
    } else {
      console.log("💻 Connected to: Local PostgreSQL");
    }
    
    return true;
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    
    // Provide helpful error messages
    if (error.original) {
      if (error.original.code === "ECONNREFUSED") {
        console.error("💡 Hint: Make sure PostgreSQL is running");
      } else if (error.original.code === "3D000") {
        console.error("💡 Hint: Database does not exist. Create it first.");
      } else if (error.original.code === "28P01") {
        console.error("💡 Hint: Password authentication failed.");
      }
    }
    
    return false;
  }
};

module.exports = { sequelize, testConnection };
