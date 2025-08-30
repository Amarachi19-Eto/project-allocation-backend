const { sequelize, User } = require("./models");
const bcrypt = require('bcryptjs');

async function debugLoginIssue() {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connection working");
    
    const testUsername = "STU2024001";
    const testPassword = "password123";
    
    console.log(`\n🔍 Testing login for: ${testUsername}`);
    
    // 1. Check if user exists
    const user = await User.findOne({ where: { username: testUsername } });
    console.log(`1. User found: ${user ? 'YES' : 'NO'}`);
    
    if (!user) {
      console.log("❌ User doesn't exist in database");
      // Show all available users
      const allUsers = await User.findAll({ attributes: ['username', 'role'] });
      console.log("Available users:", allUsers.map(u => u.username));
      return;
    }
    
    console.log(`   - Username: ${user.username}`);
    console.log(`   - Role: ${user.role}`);
    console.log(`   - Active: ${user.isActive}`);
    
    // 2. Test password comparison
    console.log(`\n2. Testing password comparison:`);
    console.log(`   - Input password: ${testPassword}`);
    console.log(`   - Stored hash: ${user.password}`);
    
    const isValid = await bcrypt.compare(testPassword, user.password);
    console.log(`   - Password match: ${isValid}`);
    
    if (!isValid) {
      console.log("❌ Password doesn't match stored hash!");
      console.log("   This means either:");
      console.log("   a) Password wasn't reset correctly, OR");
      console.log("   b) There's a bcrypt issue");
      
      // Test bcrypt functionality
      console.log("\n3. Testing bcrypt functionality:");
      const testHash = await bcrypt.hash("test123", 10);
      const testCompare = await bcrypt.compare("test123", testHash);
      console.log(`   - Bcrypt self-test: ${testCompare}`);
      
      if (!testCompare) {
        console.log("❌ BCrypt is not working properly!");
        console.log("   Try: npm uninstall bcryptjs && npm install bcryptjs");
      }
    } else {
      console.log("✅ Password matches! The issue is elsewhere");
    }
    
  } catch (error) {
    console.error("Error:", error.message);
  } finally {
    await sequelize.close();
  }
}

debugLoginIssue();
