const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const db = require('../config/database');

// Get club settings
router.get('/:clubId', authenticateToken, async (req, res) => {
  try {
    const { clubId } = req.params;
    
    // Check if user is manager of this club
    const relationshipsResult = await db.query(
      'SELECT * FROM club_relationships WHERE user_id = ? AND club_id = ? AND relationship_type = ?',
      [req.user.userId, clubId, 'manager']
    );
    
    if (relationshipsResult.rows.length === 0 && req.user.role !== 'openactive_user') {
      return res.status(403).json({ error: 'Not authorized to view club settings' });
    }
    
    // Get or create settings
    let settingsResult = await db.query(
      'SELECT * FROM club_settings WHERE club_id = ?',
      [clubId]
    );
    
    if (settingsResult.rows.length === 0) {
      // Create default settings
      await db.query(
        'INSERT INTO club_settings (club_id) VALUES (?)',
        [clubId]
      );
      
      settingsResult = await db.query(
        'SELECT * FROM club_settings WHERE club_id = ?',
        [clubId]
      );
    }
    
    res.json({ settings: settingsResult.rows[0] });
  } catch (error) {
    console.error('Error fetching club settings:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update club settings
router.put('/:clubId', authenticateToken, async (req, res) => {
  try {
    const { clubId } = req.params;
    const {
      logo_url,
      booking_slot_interval,
      session_duration_options,
      allow_consecutive_bookings,
      show_day_view,
      days_ahead_booking,
      next_day_opens_at,
      spring_summer_open,
      spring_summer_close,
      autumn_winter_open,
      autumn_winter_close,
      admin_booking_notification_email,
      admin_guest_booking_email
    } = req.body;
    
    // Check if user is manager of this club
    const relationshipsResult = await db.query(
      'SELECT * FROM club_relationships WHERE user_id = ? AND club_id = ? AND relationship_type = ?',
      [req.user.userId, clubId, 'manager']
    );
    
    if (relationshipsResult.rows.length === 0 && req.user.role !== 'openactive_user') {
      return res.status(403).json({ error: 'Not authorized to update club settings' });
    }
    
    // Update settings
    await db.query(
      `UPDATE club_settings SET 
        logo_url = COALESCE(?, logo_url),
        booking_slot_interval = COALESCE(?, booking_slot_interval),
        session_duration_options = COALESCE(?, session_duration_options),
        allow_consecutive_bookings = COALESCE(?, allow_consecutive_bookings),
        show_day_view = COALESCE(?, show_day_view),
        days_ahead_booking = COALESCE(?, days_ahead_booking),
        next_day_opens_at = COALESCE(?, next_day_opens_at),
        spring_summer_open = COALESCE(?, spring_summer_open),
        spring_summer_close = COALESCE(?, spring_summer_close),
        autumn_winter_open = COALESCE(?, autumn_winter_open),
        autumn_winter_close = COALESCE(?, autumn_winter_close),
        admin_booking_notification_email = COALESCE(?, admin_booking_notification_email),
        admin_guest_booking_email = COALESCE(?, admin_guest_booking_email)
      WHERE club_id = ?`,
      [
        logo_url,
        booking_slot_interval,
        session_duration_options,
        allow_consecutive_bookings,
        show_day_view,
        days_ahead_booking,
        next_day_opens_at,
        spring_summer_open,
        spring_summer_close,
        autumn_winter_open,
        autumn_winter_close,
        admin_booking_notification_email,
        admin_guest_booking_email,
        clubId
      ]
    );
    
    // Fetch updated settings
    const settingsResult = await db.query(
      'SELECT * FROM club_settings WHERE club_id = ?',
      [clubId]
    );
    
    res.json({ 
      message: 'Settings updated successfully',
      settings: settingsResult.rows[0]
    });
  } catch (error) {
    console.error('Error updating club settings:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;

