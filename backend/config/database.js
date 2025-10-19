const mysql = require('mysql2/promise');
require('dotenv').config();

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'openactive',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  acquireTimeout: 60000,
  timeout: 60000
};

// Create connection pool
const pool = mysql.createPool(dbConfig);

// Test database connection
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Connected to MySQL database');
    connection.release();
  } catch (error) {
    console.error('❌ Database connection error:', error);
    process.exit(-1);
  }
};

// Initialize connection test
testConnection();

// Helper function to execute queries
const query = async (sql, params = []) => {
  const start = Date.now();
  try {
    const [rows, fields] = await pool.execute(sql, params);
    const duration = Date.now() - start;
    console.log('📊 Query executed:', { sql: sql.substring(0, 100) + '...', duration, rows: rows.length });
    return { rows, fields };
  } catch (error) {
    console.error('❌ Query error:', error);
    throw error;
  }
};

// Helper function to get a connection from the pool
const getConnection = async () => {
  return await pool.getConnection();
};

module.exports = {
  query,
  getConnection,
  pool
};
