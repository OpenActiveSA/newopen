const { query } = require('../config/database');
require('dotenv').config();

(async () => {
  try {
    console.log('🚀 Assigning OpenFarm User role to first user...\n');
    
    // Get first user
    const users = await query('SELECT id FROM users ORDER BY id LIMIT 1');
    if (users.rows.length === 0) {
      console.log('❌ No users found in database');
      process.exit(1);
    }
    
    const userId = users.rows[0].id;
    console.log(`📋 Found user ID: ${userId}`);
    
    // Get openfarm_user role ID
    const roleResult = await query("SELECT id FROM roles WHERE name = 'openfarm_user'");
    if (roleResult.rows.length === 0) {
      console.log('❌ OpenFarm User role not found. Run setup-roles.js first.');
      process.exit(1);
    }
    
    const roleId = roleResult.rows[0].id;
    console.log(`📋 Found role ID: ${roleId}`);
    
    // Check if already assigned
    const existing = await query('SELECT * FROM user_roles WHERE user_id = ? AND role_id = ?', [userId, roleId]);
    if (existing.rows.length > 0) {
      console.log('✅ User already has OpenFarm User role');
    } else {
      // Assign role
      await query('INSERT INTO user_roles (user_id, role_id) VALUES (?, ?)', [userId, roleId]);
      console.log('✅ OpenFarm User role assigned successfully!');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
})();

