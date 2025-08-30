const { sequelize, User } = require("./models");

async function testUserQuery() {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected");
    
    // Try to find a user
    const user = await User.findOne({
      where: { username: 'STU2024001' }
    });
    
    if (user) {
      console.log("✅ User found successfully!");
      console.log("User data:", user.toJSON());
    } else {
      console.log("ℹ️ User not found - this is normal if no users exist yet");
    }
    
  } catch (error) {
    console.error("❌ Error querying user:", error.message);
    console.error("Full error:", error);
  } finally {
    await sequelize.close();
  }
}

testUserQuery();
