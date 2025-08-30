const { sequelize, User } = require("./models");
const bcrypt = require('bcryptjs');

async function properlyResetPasswords() {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected");
    
    // Get ALL users
    const users = await User.findAll();
    
    console.log("🔧 Resetting passwords for all users...");
    
    for (const user of users) {
      let newPassword;
      
      // Set appropriate passwords based on role
      switch(user.role) {
        case 'student':
          newPassword = 'student123';
          break;
        case 'supervisor':
          newPassword = 'lecturer123';
          break;
        case 'admin':
          newPassword = 'admin123';
          break;
        default:
          newPassword = 'password123';
      }
      
      // IMPORTANT: Create a NEW hash (don't reuse old hashes)
      const newHash = await bcrypt.hash(newPassword, 10);
      
      // Update the user with the NEW hash
      await User.update(
        { password: newHash },
        { where: { id: user.id } }
      );
      
      console.log(`✅ Reset ${user.role} ${user.username} to: ${newPassword}`);
    }
    
    console.log('\n🎉 ALL PASSWORDS PROPERLY RESET!');
    console.log('📋 LOGIN CREDENTIALS:');
    console.log('Students - Password: student123');
    console.log('Supervisors - Password: lecturer123');
    console.log('Admins - Password: admin123');
    
  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    await sequelize.close();
  }
}

properlyResetPasswords();
