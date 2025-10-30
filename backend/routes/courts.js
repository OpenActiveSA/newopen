const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const db = require('../config/database');

// Get all courts for a club
router.get('/club/:clubId', authenticateToken, async (req, res) => {
  try {
    const { clubId } = req.params;
    
    const result = await db.query(
      'SELECT id, club_id, name, court_type as sport, is_active, created_at, updated_at FROM courts WHERE club_id = ? AND is_active = true ORDER BY name',
      [clubId]
    );
    
    res.json({ courts: result.rows });
  } catch (error) {
    console.error('Error fetching courts:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create a new court
router.post('/club/:clubId', authenticateToken, async (req, res) => {
  try {
    const { clubId } = req.params;
    const { name, sport } = req.body;
    
    // Check if user is manager of this club
    const relationshipsResult = await db.query(
      'SELECT * FROM club_relationships WHERE user_id = ? AND club_id = ? AND relationship_type = ?',
      [req.user.userId, clubId, 'manager']
    );
    
    if (relationshipsResult.rows.length === 0 && req.user.role !== 'openactive_user') {
      return res.status(403).json({ error: 'Not authorized to add courts' });
    }
    
    // Validate sport
    const validSports = ['Tennis', 'Padel', 'Pickleball', 'Squash', 'Table Tennis'];
    if (!validSports.includes(sport)) {
      return res.status(400).json({ error: 'Invalid sport type' });
    }
    
    // Insert court (using court_type column)
    const insertResult = await db.query(
      'INSERT INTO courts (club_id, name, court_type) VALUES (?, ?, ?)',
      [clubId, name, sport]
    );
    
    // Get the created court
    const courtResult = await db.query(
      'SELECT id, club_id, name, court_type as sport, is_active, created_at, updated_at FROM courts WHERE id = ?',
      [insertResult.rows.insertId]
    );
    
    res.status(201).json({ 
      message: 'Court created successfully',
      court: courtResult.rows[0]
    });
  } catch (error) {
    console.error('Error creating court:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update a court
router.put('/:courtId', authenticateToken, async (req, res) => {
  try {
    const { courtId } = req.params;
    const { name, sport } = req.body;
    
    // Get court to check club ownership
    const courtResult = await db.query(
      'SELECT club_id FROM courts WHERE id = ?',
      [courtId]
    );
    
    if (courtResult.rows.length === 0) {
      return res.status(404).json({ error: 'Court not found' });
    }
    
    const clubId = courtResult.rows[0].club_id;
    
    // Check if user is manager of this club
    const relationshipsResult = await db.query(
      'SELECT * FROM club_relationships WHERE user_id = ? AND club_id = ? AND relationship_type = ?',
      [req.user.userId, clubId, 'manager']
    );
    
    if (relationshipsResult.rows.length === 0 && req.user.role !== 'openactive_user') {
      return res.status(403).json({ error: 'Not authorized to update this court' });
    }
    
    // Validate sport if provided
    if (sport) {
      const validSports = ['Tennis', 'Padel', 'Pickleball', 'Squash', 'Table Tennis'];
      if (!validSports.includes(sport)) {
        return res.status(400).json({ error: 'Invalid sport type' });
      }
    }
    
    // Update court (using court_type column)
    await db.query(
      'UPDATE courts SET name = COALESCE(?, name), court_type = COALESCE(?, court_type) WHERE id = ?',
      [name, sport, courtId]
    );
    
    // Get updated court
    const updatedResult = await db.query(
      'SELECT id, club_id, name, court_type as sport, is_active, created_at, updated_at FROM courts WHERE id = ?',
      [courtId]
    );
    
    res.json({ 
      message: 'Court updated successfully',
      court: updatedResult.rows[0]
    });
  } catch (error) {
    console.error('Error updating court:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete a court (soft delete)
router.delete('/:courtId', authenticateToken, async (req, res) => {
  try {
    const { courtId } = req.params;
    
    // Get court to check club ownership
    const courtResult = await db.query(
      'SELECT club_id FROM courts WHERE id = ?',
      [courtId]
    );
    
    if (courtResult.rows.length === 0) {
      return res.status(404).json({ error: 'Court not found' });
    }
    
    const clubId = courtResult.rows[0].club_id;
    
    // Check if user is manager of this club
    const relationshipsResult = await db.query(
      'SELECT * FROM club_relationships WHERE user_id = ? AND club_id = ? AND relationship_type = ?',
      [req.user.userId, clubId, 'manager']
    );
    
    if (relationshipsResult.rows.length === 0 && req.user.role !== 'openactive_user') {
      return res.status(403).json({ error: 'Not authorized to delete this court' });
    }
    
    // Soft delete
    await db.query(
      'UPDATE courts SET is_active = false WHERE id = ?',
      [courtId]
    );
    
    res.json({ message: 'Court deleted successfully' });
  } catch (error) {
    console.error('Error deleting court:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
