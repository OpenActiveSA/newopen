const express = require('express');
const { body, validationResult } = require('express-validator');
const { query } = require('../config/database');
const { authenticateToken, requireClubAccess, requireClubManager } = require('../middleware/auth');

const router = express.Router();

// Get user's bookings
router.get('/my-bookings', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await query(`
      SELECT 
        b.id, b.start_time, b.end_time, b.status, b.total_amount, b.notes, b.created_at,
        c.name as club_name, c.slug as club_slug,
        co.name as court_name
      FROM bookings b
      JOIN clubs c ON b.club_id = c.id
      JOIN courts co ON b.court_id = co.id
      WHERE b.user_id = $1
      ORDER BY b.start_time DESC
    `, [userId]);

    res.json({
      bookings: result.rows
    });

  } catch (error) {
    console.error('Get user bookings error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get bookings for a club
router.get('/club/:clubId', authenticateToken, requireClubAccess, async (req, res) => {
  try {
    const { clubId } = req.params;
    const { startDate, endDate } = req.query;

    let queryText = `
      SELECT 
        b.id, b.start_time, b.end_time, b.status, b.total_amount, b.notes, b.created_at,
        u.name as user_name, u.email as user_email,
        co.name as court_name
      FROM bookings b
      JOIN users u ON b.user_id = u.id
      JOIN courts co ON b.court_id = co.id
      WHERE b.club_id = $1
    `;

    const queryParams = [clubId];

    if (startDate) {
      queryText += ` AND b.start_time >= $${queryParams.length + 1}`;
      queryParams.push(startDate);
    }

    if (endDate) {
      queryText += ` AND b.end_time <= $${queryParams.length + 1}`;
      queryParams.push(endDate);
    }

    queryText += ` ORDER BY b.start_time DESC`;

    const result = await query(queryText, queryParams);

    res.json({
      bookings: result.rows
    });

  } catch (error) {
    console.error('Get club bookings error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new booking
router.post('/', authenticateToken, [
  body('clubId').isUUID(),
  body('courtId').isUUID(),
  body('startTime').isISO8601(),
  body('endTime').isISO8601(),
  body('notes').optional().trim()
], async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: errors.array() 
      });
    }

    const { clubId, courtId, startTime, endTime, notes } = req.body;
    const userId = req.user.id;

    // Validate date range
    const start = new Date(startTime);
    const end = new Date(endTime);
    
    if (start >= end) {
      return res.status(400).json({ error: 'End time must be after start time' });
    }

    if (start < new Date()) {
      return res.status(400).json({ error: 'Cannot book in the past' });
    }

    // Check if user has access to club
    const clubAccess = await query(`
      SELECT relationship_type 
      FROM club_relationships 
      WHERE user_id = $1 AND club_id = $2 AND is_active = true
    `, [userId, clubId]);

    if (clubAccess.rows.length === 0) {
      return res.status(403).json({ error: 'No access to this club' });
    }

    // Check if court exists and belongs to club
    const courtResult = await query(`
      SELECT id, hourly_rate 
      FROM courts 
      WHERE id = $1 AND club_id = $2 AND is_active = true
    `, [courtId, clubId]);

    if (courtResult.rows.length === 0) {
      return res.status(404).json({ error: 'Court not found' });
    }

    const hourlyRate = courtResult.rows[0].hourly_rate;
    const durationHours = (end - start) / (1000 * 60 * 60);
    const totalAmount = hourlyRate * durationHours;

    // Check for overlapping bookings
    const overlappingBookings = await query(`
      SELECT id 
      FROM bookings 
      WHERE court_id = $1 
      AND status IN ('pending', 'confirmed')
      AND (
        (start_time <= $2 AND end_time > $2) OR
        (start_time < $3 AND end_time >= $3) OR
        (start_time >= $2 AND end_time <= $3)
      )
    `, [courtId, startTime, endTime]);

    if (overlappingBookings.rows.length > 0) {
      return res.status(400).json({ error: 'Time slot is already booked' });
    }

    // Create booking
    const result = await query(`
      INSERT INTO bookings (user_id, club_id, court_id, start_time, end_time, total_amount, notes)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id, start_time, end_time, status, total_amount, notes, created_at
    `, [userId, clubId, courtId, startTime, endTime, totalAmount, notes]);

    res.status(201).json({
      message: 'Booking created successfully',
      booking: result.rows[0]
    });

  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update booking status
router.put('/:bookingId/status', authenticateToken, [
  body('status').isIn(['pending', 'confirmed', 'cancelled', 'completed'])
], async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: errors.array() 
      });
    }

    const { bookingId } = req.params;
    const { status } = req.body;
    const userId = req.user.id;
    const userRole = req.user.role;

    // Get booking details
    const bookingResult = await query(`
      SELECT b.*, c.name as club_name
      FROM bookings b
      JOIN clubs c ON b.club_id = c.id
      WHERE b.id = $1
    `, [bookingId]);

    if (bookingResult.rows.length === 0) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    const booking = bookingResult.rows[0];

    // Check permissions
    const canUpdate = 
      booking.user_id === userId || // User owns the booking
      userRole === 'openactive_user' || // OpenActive user
      (await query(`
        SELECT relationship_type 
        FROM club_relationships 
        WHERE user_id = $1 AND club_id = $2 AND relationship_type = 'manager' AND is_active = true
      `, [userId, booking.club_id])).rows.length > 0; // Club manager

    if (!canUpdate) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    // Update booking status
    const result = await query(`
      UPDATE bookings 
      SET status = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING id, status, updated_at
    `, [status, bookingId]);

    res.json({
      message: 'Booking status updated successfully',
      booking: result.rows[0]
    });

  } catch (error) {
    console.error('Update booking status error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Cancel booking
router.put('/:bookingId/cancel', authenticateToken, async (req, res) => {
  try {
    const { bookingId } = req.params;
    const userId = req.user.id;

    // Get booking details
    const bookingResult = await query(
      'SELECT * FROM bookings WHERE id = $1',
      [bookingId]
    );

    if (bookingResult.rows.length === 0) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    const booking = bookingResult.rows[0];

    // Check if user owns the booking
    if (booking.user_id !== userId) {
      return res.status(403).json({ error: 'Can only cancel your own bookings' });
    }

    // Check if booking can be cancelled
    if (booking.status === 'cancelled') {
      return res.status(400).json({ error: 'Booking is already cancelled' });
    }

    if (booking.status === 'completed') {
      return res.status(400).json({ error: 'Cannot cancel completed booking' });
    }

    // Cancel booking
    const result = await query(`
      UPDATE bookings 
      SET status = 'cancelled', updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING id, status, updated_at
    `, [bookingId]);

    res.json({
      message: 'Booking cancelled successfully',
      booking: result.rows[0]
    });

  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get booking by ID
router.get('/:bookingId', authenticateToken, async (req, res) => {
  try {
    const { bookingId } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    const result = await query(`
      SELECT 
        b.*,
        c.name as club_name, c.slug as club_slug,
        co.name as court_name,
        u.name as user_name, u.email as user_email
      FROM bookings b
      JOIN clubs c ON b.club_id = c.id
      JOIN courts co ON b.court_id = co.id
      JOIN users u ON b.user_id = u.id
      WHERE b.id = $1
    `, [bookingId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    const booking = result.rows[0];

    // Check permissions
    const canView = 
      booking.user_id === userId || // User owns the booking
      userRole === 'openactive_user' || // OpenActive user
      (await query(`
        SELECT relationship_type 
        FROM club_relationships 
        WHERE user_id = $1 AND club_id = $2 AND is_active = true
      `, [userId, booking.club_id])).rows.length > 0; // Club member

    if (!canView) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json({
      booking
    });

  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
