const { sequelize } = require("./models");

async function checkExactColumnNames() {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected");
    
    // Get exact column names with proper quoting
    const result = await sequelize.query(`
      SELECT column_name
      FROM information_schema.columns 
      WHERE table_name = 'Users'
      ORDER BY ordinal_position;
    `);
    
    console.log("Exact column names in Users table:");
    result[0].forEach((col, index) => {
      console.log(`${index + 1}. ${col.column_name}`);
    });
    
  } catch (error) {
    console.error("Error:", error.message);
  } finally {
    await sequelize.close();
  }
}

checkExactColumnNames();
