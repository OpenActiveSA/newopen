const { query } = require('../config/database');
require('dotenv').config();

(async () => {
  try {
    console.log('🚀 Setting up user roles...\n');
    
    // Insert the three roles
    await query(`
      INSERT INTO roles (name) 
      VALUES ('openfarm_user'), ('owner'), ('manager')
      ON DUPLICATE KEY UPDATE name = VALUES(name)
    `);
    
    console.log('✅ Roles inserted:');
    const roles = await query('SELECT * FROM roles ORDER BY id');
    roles.rows.forEach(role => {
      console.log(`   - ${role.name} (ID: ${role.id})`);
    });
    
    console.log('\n✨ Role setup complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
})();

