const { query } = require('../config/database');
require('dotenv').config();

(async () => {
  try {
    // Check if roles table exists
    const rolesCheck = await query("SHOW TABLES LIKE 'roles'");
    const userRolesCheck = await query("SHOW TABLES LIKE 'user_roles'");
    
    console.log('Roles table exists:', rolesCheck.rows.length > 0);
    console.log('User_roles table exists:', userRolesCheck.rows.length > 0);
    
    if (rolesCheck.rows.length > 0) {
      const roles = await query('SELECT * FROM roles ORDER BY id');
      console.log('\nRoles in database:');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      roles.rows.forEach(role => {
        console.log(`  ID: ${role.id} | Name: ${role.name}`);
      });
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log(`Total: ${roles.rows.length} roles`);
    } else {
      console.log('\n⚠️  Roles table does not exist!');
    }
    
    if (userRolesCheck.rows.length > 0) {
      const userRoles = await query('SELECT * FROM user_roles LIMIT 5');
      console.log('\nUser-Role relationships (sample):');
      console.log(JSON.stringify(userRoles.rows, null, 2));
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
})();

