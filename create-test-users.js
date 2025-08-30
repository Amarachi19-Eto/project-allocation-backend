const { sequelize, User } = require("./models");
const bcrypt = require('bcryptjs');

async function createTestUsers() {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected");
    
    // Create test users for each role
    const testUsers = [
      {
        username: 'admin001',
        email: 'admin@university.edu',
        password: await bcrypt.hash('admin123', 10),
        role: 'admin',
        isActive: true
      },
      {
        username: 'STU2024001',
        email: 'student1@university.edu',
        password: await bcrypt.hash('student123', 10),
        role: 'student',
        isActive: true
      },
      {
        username: 'LEC2024001',
        email: 'lecturer1@university.edu',
        password: await bcrypt.hash('lecturer123', 10),
        role: 'supervisor',
        isActive: true
      }
    ];
    
    for (const userData of testUsers) {
      const [user, created] = await User.findOrCreate({
        where: { username: userData.username },
        defaults: userData
      });
      
      if (created) {
        console.log(`✅ Created ${user.role} user: ${user.username}`);
      } else {
        console.log(`ℹ️ User ${user.username} already exists`);
      }
    }
    
    console.log('\n📋 Login credentials:');
    console.log('Admin - Username: admin001, Password: admin123');
    console.log('Student - Username: STU2024001, Password: student123');
    console.log('Supervisor - Username: LEC2024001, Password: lecturer123');
    
  } catch (error) {
    console.error("❌ Error creating users:", error.message);
    console.error("Full error:", error);
  } finally {
    await sequelize.close();
  }
}

createTestUsers();
