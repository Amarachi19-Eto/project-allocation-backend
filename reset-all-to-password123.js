const { sequelize, User } = require("./models");
const bcrypt = require('bcryptjs');

async function resetAllToPassword123() {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected");
    
    const users = await User.findAll();
    
    for (const user of users) {
      // Reset EVERY user to password "password123"
      user.password = await bcrypt.hash('password123', 10);
      await user.save();
      console.log(`✅ Reset ${user.role} ${user.username} password to: password123`);
    }
    
    console.log('\n🎉 ALL PASSWORDS RESET SUCCESSFULLY!');
    console.log('📋 LOGIN CREDENTIALS:');
    console.log('ALL Users - Password: password123');
    console.log('');
    console.log('👨‍🎓 Students:');
    console.log('  STU2024001, STU2024002, STU2024003');
    console.log('  teststudent, student2024');
    console.log('');
    console.log('👨‍🏫 Supervisors:');
    console.log('  LEC2024001, drsmith');
    console.log('');
    console.log('👨‍💼 Admins:');
    console.log('  ADM2024001, admin');
    
  } catch (error) {
    console.error("Error:", error.message);
  } finally {
    await sequelize.close();
  }
}

resetAllToPassword123();
