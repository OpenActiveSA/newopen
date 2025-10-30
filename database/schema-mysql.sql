-- Open Farm Database Schema - MySQL Version
-- This file contains the complete database schema for the Open Farm tennis booking system

-- Drop existing tables (in reverse order of dependencies)
DROP TABLE IF EXISTS bookings;
DROP TABLE IF EXISTS events;
DROP TABLE IF EXISTS courts;
DROP TABLE IF EXISTS club_relationships;
DROP TABLE IF EXISTS clubs;
DROP TABLE IF EXISTS users;

-- Users table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    phone VARCHAR(50),
    role ENUM('openactive_user', 'club_manager', 'member', 'visitor') DEFAULT 'member',
    avatar_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_users_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Clubs table
CREATE TABLE clubs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    address TEXT,
    phone VARCHAR(50),
    email VARCHAR(255),
    website VARCHAR(255),
    logo_url TEXT,
    settings JSON,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_clubs_slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Club relationships table (many-to-many between users and clubs)
CREATE TABLE club_relationships (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    club_id INT NOT NULL,
    relationship_type ENUM('manager', 'member', 'visitor') NOT NULL,
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    permissions JSON,
    is_active BOOLEAN DEFAULT true,
    UNIQUE KEY unique_user_club (user_id, club_id),
    INDEX idx_club_relationships_user_id (user_id),
    INDEX idx_club_relationships_club_id (club_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (club_id) REFERENCES clubs(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Courts table
CREATE TABLE courts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    club_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    court_type VARCHAR(50) DEFAULT 'tennis',
    hourly_rate DECIMAL(10,2),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_courts_club_id (club_id),
    FOREIGN KEY (club_id) REFERENCES clubs(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bookings table
CREATE TABLE bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    club_id INT NOT NULL,
    court_id INT NOT NULL,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    status ENUM('pending', 'confirmed', 'cancelled', 'completed') DEFAULT 'pending',
    total_amount DECIMAL(10,2),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_bookings_user_id (user_id),
    INDEX idx_bookings_club_id (club_id),
    INDEX idx_bookings_court_id (court_id),
    INDEX idx_bookings_start_time (start_time),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (club_id) REFERENCES clubs(id) ON DELETE CASCADE,
    FOREIGN KEY (court_id) REFERENCES courts(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Events table
CREATE TABLE events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    club_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    max_participants INT,
    current_participants INT DEFAULT 0,
    is_public BOOLEAN DEFAULT true,
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_events_club_id (club_id),
    INDEX idx_events_start_time (start_time),
    FOREIGN KEY (club_id) REFERENCES clubs(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert sample data for testing

-- Insert a test user (password: 'password123')
-- Password hash is bcrypt hash of 'password123' with salt rounds of 12
-- Generated using: bcrypt.hash('password123', 12)
INSERT INTO users (email, password_hash, name, role) VALUES
('test@example.com', '$2a$12$qDSTymyur4PPa4AVOQOmb.zerj1dDbufPOROmamd97bi1Rqmijbyu', 'Test User', 'member'),
('admin@example.com', '$2a$12$qDSTymyur4PPa4AVOQOmb.zerj1dDbufPOROmamd97bi1Rqmijbyu', 'Admin User', 'openactive_user');

-- Insert sample clubs
INSERT INTO clubs (name, slug, description, address, phone, email) VALUES
('Demo Tennis Club', 'demo', 'A great place to play tennis', '123 Main St, City', '555-1234', 'demo@tennis.com'),
('Elite Sports Center', 'elite-sports-center', 'Premium sports facility', '456 Oak Ave, Town', '555-5678', 'elite@sports.com');

-- Insert club relationships
INSERT INTO club_relationships (user_id, club_id, relationship_type) VALUES
(1, 1, 'member'),
(2, 1, 'manager'),
(2, 2, 'manager');

-- Insert sample courts
INSERT INTO courts (club_id, name, description, court_type, hourly_rate) VALUES
(1, 'Court 1', 'Main tennis court with hard surface', 'tennis', 30.00),
(1, 'Court 2', 'Clay court for advanced players', 'tennis', 35.00),
(2, 'Court A', 'Premium indoor court', 'tennis', 50.00);

SELECT '✅ Database schema created successfully!' as message;
SELECT 'Test users created:' as message;
SELECT '  - test@example.com / password123 (member)' as message;
SELECT '  - admin@example.com / password123 (openactive_user)' as message;

