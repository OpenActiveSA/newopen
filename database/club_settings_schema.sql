-- Club Settings Table
CREATE TABLE IF NOT EXISTS club_settings (
  id INT PRIMARY KEY AUTO_INCREMENT,
  club_id INT NOT NULL,
  
  -- Club Branding
  logo_url VARCHAR(500),
  
  -- Booking Configuration
  booking_slot_interval INT DEFAULT 30 COMMENT 'Minutes: 30, 60, 90',
  session_duration_options VARCHAR(100) DEFAULT '30,60,90,120' COMMENT 'Comma-separated minutes',
  allow_consecutive_bookings BOOLEAN DEFAULT TRUE,
  show_day_view BOOLEAN DEFAULT TRUE,
  
  -- Booking Rules
  days_ahead_booking INT DEFAULT 7 COMMENT 'How many days ahead members can book',
  next_day_opens_at TIME DEFAULT '00:00:00' COMMENT 'When next day bookings open (12am or 12pm)',
  
  -- Operating Hours (Spring/Summer)
  spring_summer_open TIME DEFAULT '06:00:00',
  spring_summer_close TIME DEFAULT '22:00:00',
  
  -- Operating Hours (Autumn/Winter)
  autumn_winter_open TIME DEFAULT '07:00:00',
  autumn_winter_close TIME DEFAULT '20:00:00',
  
  -- Notification Settings
  admin_booking_notification_email VARCHAR(255),
  admin_guest_booking_email VARCHAR(255),
  
  -- Metadata
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (club_id) REFERENCES clubs(id) ON DELETE CASCADE,
  UNIQUE KEY unique_club_settings (club_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

