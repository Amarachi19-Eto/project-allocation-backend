const { sequelize, User } = require("./models");
const bcrypt = require('bcryptjs');

async function createUsersWithRegNumbers() {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected");
    
    // Create users with registration numbers
    const students = [
      {
        username: 'STU2024001', // Registration number as username
        email: 'stu2024001@university.edu',
        password: await bcrypt.hash('student123', 10),
        role: 'student',
        isActive: true
      },
      {
        username: 'STU2024002', // Registration number as username
        email: 'stu2024002@university.edu',
        password: await bcrypt.hash('student123', 10),
        role: 'student',
        isActive: true
      },
      {
        username: 'STU2024003', // Registration number as username
        email: 'stu2024003@university.edu',
        password: await bcrypt.hash('student123', 10),
        role: 'student',
        isActive: true
      }
    ];
    
    const supervisors = [
      {
        username: 'LEC2024001', // Staff ID as username
        email: 'lec2024001@university.edu',
        password: await bcrypt.hash('lecturer123', 10),
        role: 'supervisor',
        isActive: true
      }
    ];
    
    const admins = [
      {
        username: 'ADM2024001', // Admin ID as username
        email: 'adm2024001@university.edu',
        password: await bcrypt.hash('admin123', 10),
        role: 'admin',
        isActive: true
      }
    ];
    
    // Create all users
    const allUsers = [...students, ...supervisors, ...admins];
    
    for (const userData of allUsers) {
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
    console.log('Students - Registration No: STU2024001, STU2024002, STU2024003');
    console.log('Students - Password: student123');
    console.log('Supervisor - Staff ID: LEC2024001, Password: lecturer123');
    console.log('Admin - Admin ID: ADM2024001, Password: admin123');
    
  } catch (error) {
    console.error("Error:", error.message);
  } finally {
    await sequelize.close();
  }
}

createUsersWithRegNumbers();
