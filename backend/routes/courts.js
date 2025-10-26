const express = require('express');
const { body, validationResult } = require('express-validator');
const { query } = require('../config/database');
const { authenticateToken, requireClubAccess, requireClubManager } = require('../middleware/auth');

const router = express.Router();

// Get courts for a club
router.get('/club/:clubId', authenticateToken, requireClubAccess, async (req, res) => {
  try {
    const { clubId } = req.params;

    const result = await query(`
      SELECT 
        id, name, description, court_type, hourly_rate, is_active, created_at
      FROM courts 
      WHERE club_id = $1 AND is_active = true
      ORDER BY name
    `, [clubId]);

    res.json({
      courts: result.rows
    });

  } catch (error) {
    console.error('Get courts error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new court
router.post('/club/:clubId', authenticateToken, requireClubManager, [
  body('name').trim().isLength({ min: 1 }),
  body('description').optional().trim(),
  body('courtType').optional().trim(),
  body('hourlyRate').optional().isFloat({ min: 0 })
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

    const { clubId } = req.params;
    const { name, description, courtType, hourlyRate } = req.body;

    const result = await query(`
      INSERT INTO courts (club_id, name, description, court_type, hourly_rate)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, name, description, court_type, hourly_rate, created_at
    `, [clubId, name, description, courtType || 'tennis', hourlyRate || 0]);

    res.status(201).json({
      message: 'Court created successfully',
      court: result.rows[0]
    });

  } catch (error) {
    console.error('Create court error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update court
router.put('/:courtId', authenticateToken, requireClubManager, [
  body('name').optional().trim().isLength({ min: 1 }),
  body('description').optional().trim(),
  body('courtType').optional().trim(),
  body('hourlyRate').optional().isFloat({ min: 0 })
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

    const { courtId } = req.params;
    const { name, description, courtType, hourlyRate } = req.body;

    const result = await query(`
      UPDATE courts 
      SET 
        name = COALESCE($1, name),
        description = COALESCE($2, description),
        court_type = COALESCE($3, court_type),
        hourly_rate = COALESCE($4, hourly_rate),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $5
      RETURNING id, name, description, court_type, hourly_rate, updated_at
    `, [name, description, courtType, hourlyRate, courtId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Court not found' });
    }

    res.json({
      message: 'Court updated successfully',
      court: result.rows[0]
    });

  } catch (error) {
    console.error('Update court error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete court (soft delete)
router.delete('/:courtId', authenticateToken, requireClubManager, async (req, res) => {
  try {
    const { courtId } = req.params;

    const result = await query(`
      UPDATE courts 
      SET is_active = false, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING id
    `, [courtId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Court not found' });
    }

    res.json({
      message: 'Court deleted successfully'
    });

  } catch (error) {
    console.error('Delete court error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;




