const { sequelize, User } = require("./models");

async function checkUserDetails() {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected");
    
    // Get all users with their details (excluding passwords for security)
    const users = await User.findAll({
      attributes: ['id', 'username', 'email', 'role', 'isActive', 'createdAt']
    });
    
    console.log("Users in database:");
    console.table(users.map(user => user.toJSON()));
    
    // If you need to see password hashes (for debugging)
    const usersWithPasswords = await User.findAll({
      attributes: ['username', 'password'] // Be careful with this!
    });
    
    console.log("\nUsername and password hashes:");
    usersWithPasswords.forEach(user => {
      console.log(`Username: ${user.username}, Password Hash: ${user.password}`);
    });
    
  } catch (error) {
    console.error("Error:", error.message);
  } finally {
    await sequelize.close();
  }
}

checkUserDetails();
