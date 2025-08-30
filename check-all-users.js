const { sequelize, User } = require("./models");

async function checkAllUserDetails() {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected");
    
    // Get ALL user details including passwords
    const users = await User.findAll();
    
    console.log("=== ALL USERS IN DATABASE ===");
    users.forEach((user, index) => {
      console.log(`\n--- User ${index + 1} ---`);
      console.log(`Username: ${user.username}`);
      console.log(`Email: ${user.email}`);
      console.log(`Role: ${user.role}`);
      console.log(`Password Hash: ${user.password}`);
      console.log(`Active: ${user.isActive}`);
    });
    
  } catch (error) {
    console.error("Error:", error.message);
  } finally {
    await sequelize.close();
  }
}

checkAllUserDetails();
