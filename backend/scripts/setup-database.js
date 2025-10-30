const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Database configuration
const config = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  port: process.env.DB_PORT || 3306,
  multipleStatements: true
};

async function setupDatabase() {
  let connection;
  
  try {
    // Connect to MySQL without specifying database
    console.log('🔌 Connecting to MySQL...');
    connection = await mysql.createConnection(config);
    console.log('✅ Connected to MySQL');

    // Create database if it doesn't exist
    const dbName = process.env.DB_NAME || 'newfarm';
    console.log(`📦 Creating database '${dbName}' if it doesn't exist...`);
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${dbName}`);
    console.log(`✅ Database '${dbName}' ready`);

    // Use the database
    await connection.query(`USE ${dbName}`);

    // Read and execute the schema file
    const schemaPath = path.join(__dirname, '../../database/schema-mysql.sql');
    console.log('📄 Reading schema file...');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    console.log('🏗️  Creating tables and inserting sample data...');
    await connection.query(schema);
    console.log('✅ Database setup complete!');

    console.log('\n🎉 Success! You can now login with:');
    console.log('   Email: test@example.com');
    console.log('   Password: password123');
    console.log('\n   OR');
    console.log('\n   Email: admin@example.com');
    console.log('   Password: password123');
    console.log('   (Admin user with openactive_user role)\n');

  } catch (error) {
    console.error('❌ Database setup error:', error);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Run the setup
setupDatabase();




