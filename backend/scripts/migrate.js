const { query } = require('../config/database');
require('dotenv').config();

const createTables = async () => {
  try {
    console.log('🚀 Starting database migration...');

    // Create users table
    await query(`
      CREATE TABLE IF NOT EXISTS users (
        id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        name VARCHAR(255),
        phone VARCHAR(20),
        role VARCHAR(50) DEFAULT 'member',
        avatar_url TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Create clubs table
    await query(`
      CREATE TABLE IF NOT EXISTS clubs (
        id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
        name VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        description TEXT,
        address TEXT,
        phone VARCHAR(20),
        email VARCHAR(255),
        website VARCHAR(255),
        logo_url TEXT,
        settings JSON,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Create club_relationships table
    await query(`
      CREATE TABLE IF NOT EXISTS club_relationships (
        id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
        user_id CHAR(36) NOT NULL,
        club_id CHAR(36) NOT NULL,
        relationship_type ENUM('manager', 'member', 'visitor') NOT NULL,
        joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        permissions JSON,
        is_active BOOLEAN DEFAULT true,
        UNIQUE KEY unique_user_club (user_id, club_id),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (club_id) REFERENCES clubs(id) ON DELETE CASCADE
      )
    `);

    // Create courts table
    await query(`
      CREATE TABLE IF NOT EXISTS courts (
        id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
        club_id CHAR(36) NOT NULL,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        court_type VARCHAR(100) DEFAULT 'tennis',
        hourly_rate DECIMAL(10,2),
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (club_id) REFERENCES clubs(id) ON DELETE CASCADE
      )
    `);

    // Create bookings table
    await query(`
      CREATE TABLE IF NOT EXISTS bookings (
        id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
        user_id CHAR(36) NOT NULL,
        club_id CHAR(36) NOT NULL,
        court_id CHAR(36) NOT NULL,
        start_time TIMESTAMP NOT NULL,
        end_time TIMESTAMP NOT NULL,
        status ENUM('pending', 'confirmed', 'cancelled', 'completed') DEFAULT 'pending',
        total_amount DECIMAL(10,2),
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (club_id) REFERENCES clubs(id) ON DELETE CASCADE,
        FOREIGN KEY (court_id) REFERENCES courts(id) ON DELETE CASCADE
      )
    `);

    // Create events table
    await query(`
      CREATE TABLE IF NOT EXISTS events (
        id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
        club_id CHAR(36) NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        start_time TIMESTAMP NOT NULL,
        end_time TIMESTAMP NOT NULL,
        max_participants INT,
        current_participants INT DEFAULT 0,
        is_public BOOLEAN DEFAULT true,
        created_by CHAR(36),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (club_id) REFERENCES clubs(id) ON DELETE CASCADE,
        FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
      )
    `);

    // Create indexes for better performance (MySQL doesn't support IF NOT EXISTS for indexes)
    try {
      await query('CREATE INDEX idx_users_email ON users(email)');
    } catch (e) { /* Index already exists */ }
    
    try {
      await query('CREATE INDEX idx_clubs_slug ON clubs(slug)');
    } catch (e) { /* Index already exists */ }
    
    try {
      await query('CREATE INDEX idx_club_relationships_user_id ON club_relationships(user_id)');
    } catch (e) { /* Index already exists */ }
    
    try {
      await query('CREATE INDEX idx_club_relationships_club_id ON club_relationships(club_id)');
    } catch (e) { /* Index already exists */ }
    
    try {
      await query('CREATE INDEX idx_courts_club_id ON courts(club_id)');
    } catch (e) { /* Index already exists */ }
    
    try {
      await query('CREATE INDEX idx_bookings_user_id ON bookings(user_id)');
    } catch (e) { /* Index already exists */ }
    
    try {
      await query('CREATE INDEX idx_bookings_club_id ON bookings(club_id)');
    } catch (e) { /* Index already exists */ }
    
    try {
      await query('CREATE INDEX idx_bookings_court_id ON bookings(court_id)');
    } catch (e) { /* Index already exists */ }
    
    try {
      await query('CREATE INDEX idx_bookings_start_time ON bookings(start_time)');
    } catch (e) { /* Index already exists */ }
    
    try {
      await query('CREATE INDEX idx_events_club_id ON events(club_id)');
    } catch (e) { /* Index already exists */ }
    
    try {
      await query('CREATE INDEX idx_events_start_time ON events(start_time)');
    } catch (e) { /* Index already exists */ }

    console.log('✅ Database migration completed successfully!');

    // Insert sample data
    await insertSampleData();

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
};

const insertSampleData = async () => {
  try {
    console.log('🌱 Inserting sample data...');

    // Check if sample data already exists
    const existingClubs = await query('SELECT COUNT(*) as count FROM clubs');
    if (existingClubs.rows[0].count > 0) {
      console.log('📋 Sample data already exists, skipping...');
      return;
    }

    // Insert sample club
    const clubResult = await query(`
      INSERT INTO clubs (name, slug, description, address, phone, email)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [
      'Demo Tennis Club',
      'demo',
      'A premier tennis club for all skill levels',
      '123 Tennis Court Lane, Sports City',
      '+1-555-0123',
      'info@demotennisclub.com'
    ]);

    // Get the club ID from the inserted record
    const clubIdResult = await query('SELECT id FROM clubs WHERE slug = ?', ['demo']);
    const clubId = clubIdResult.rows[0].id;

    // Insert sample courts
    await query(`
      INSERT INTO courts (club_id, name, description, court_type, hourly_rate)
      VALUES 
        (?, 'Court 1', 'Indoor hard court', 'tennis', 25.00),
        (?, 'Court 2', 'Outdoor clay court', 'tennis', 30.00),
        (?, 'Court 3', 'Indoor hard court', 'tennis', 25.00),
        (?, 'Court 4', 'Outdoor hard court', 'tennis', 20.00)
    `, [clubId, clubId, clubId, clubId]);

    console.log('✅ Sample data inserted successfully!');
  } catch (error) {
    console.error('❌ Failed to insert sample data:', error);
  }
};

// Run migration if this file is executed directly
if (require.main === module) {
  createTables()
    .then(() => {
      console.log('🎾 Database setup complete!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Database setup failed:', error);
      process.exit(1);
    });
}

module.exports = { createTables, insertSampleData };