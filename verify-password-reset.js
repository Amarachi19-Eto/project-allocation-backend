const { sequelize, User } = require("./models");
const bcrypt = require('bcryptjs');

async function verifyPasswordReset() {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected");
    
    const testUsers = [
      { username: 'STU2024001', password: 'student123', role: 'student' },
      { username: 'LEC2024001', password: 'lecturer123', role: 'supervisor' },
      { username: 'ADM2024001', password: 'admin123', role: 'admin' }
    ];
    
    for (const test of testUsers) {
      const user = await User.findOne({ where: { username: test.username } });
      
      if (user) {
        const isValid = await bcrypt.compare(test.password, user.password);
        console.log(`🔍 ${test.username} (${test.role}): ${isValid ? '✅' : '❌'} ${isValid ? 'Password matches!' : 'Password mismatch!'}`);
        
        if (!isValid) {
          console.log(`   Stored hash: ${user.password}`);
        }
      } else {
        console.log(`❌ ${test.username}: User not found`);
      }
    }
    
  } catch (error) {
    console.error("Error:", error.message);
  } finally {
    await sequelize.close();
  }
}

verifyPasswordReset();
