const { sequelize } = require("./models");

async function checkDatabaseStructure() {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected");
    
    // Check what tables exist
    const tables = await sequelize.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);
    
    console.log("Tables in database:");
    console.table(tables[0]);
    
    // Check the structure of Users table (or users table)
    const userTable = await sequelize.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns 
      WHERE (table_name = 'Users' OR table_name = 'users')
      ORDER BY ordinal_position;
    `);
    
    console.log("Users table columns:");
    console.table(userTable[0]);
    
  } catch (error) {
    console.error("Error:", error.message);
  } finally {
    await sequelize.close();
  }
}

checkDatabaseStructure();
