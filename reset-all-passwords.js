const { sequelize, User } = require("./models");
const bcrypt = require('bcryptjs');

async function resetAllPasswords() {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected");
    
    // Reset passwords for all users
    const users = await User.findAll();
    
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
      
      // Update password
      user.password = await bcrypt.hash(newPassword, 10);
      await user.save();
      
      console.log(`✅ Reset password for ${user.username} (${user.role}): ${newPassword}`);
    }
    
    console.log('\n📋 Login credentials:');
    console.log('Student (teststudent) - Password: student123');
    console.log('Student (student2024) - Password: student123');
    console.log('Supervisor (drsmith) - Password: lecturer123');
    console.log('Admin (admin) - Password: admin123');
    
  } catch (error) {
    console.error("Error:", error.message);
  } finally {
    await sequelize.close();
  }
}

resetAllPasswords();
