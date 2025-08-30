const { sequelize, User } = require("./models");
const bcrypt = require('bcryptjs');

async function debugLogin() {
  try {
    console.log("1. Testing database connection...");
    await sequelize.authenticate();
    console.log("✅ Database connection successful");
    
    console.log("2. Testing User model...");
    const userCount = await User.count();
    console.log(`✅ User model works. Total users: ${userCount}`);
    
    console.log("3. Testing password hashing...");
    const testHash = await bcrypt.hash('test123', 10);
    console.log("✅ Password hashing works");
    
    console.log("4. Testing user lookup...");
    const testUser = await User.findOne({ where: { username: 'STU2024001' } });
    
    if (testUser) {
      console.log("✅ User found:", testUser.username);
      
      console.log("5. Testing password verification...");
      const isValid = await bcrypt.compare('student123', testUser.password);
      console.log(`✅ Password verification: ${isValid}`);
      
      if (!isValid) {
        console.log("❌ Password doesn't match. Did you change the password?");
      }
    } else {
      console.log("❌ User STU2024001 not found");
      console.log("Available users:");
      const allUsers = await User.findAll();
      allUsers.forEach(user => {
        console.log(`- ${user.username} (${user.role})`);
      });
    }
    
  } catch (error) {
    console.error("❌ Error in debug:", error.message);
    console.error("Full error stack:", error.stack);
  } finally {
    await sequelize.close();
  }
}

debugLogin();
